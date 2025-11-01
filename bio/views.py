import base64
import json
from django.conf import settings
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from fido2.server import Fido2Server
from fido2.webauthn import PublicKeyCredentialRpEntity
from fido2.utils import websafe_encode, websafe_decode
from fido2 import cbor

from django.contrib.auth import get_user_model
from .models import WebAuthnCredential, WebAuthnChallenge
from .serializers import WebAuthnBeginSerializer, WebAuthnCompleteSerializer
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

# RP entity:
rp = PublicKeyCredentialRpEntity(
    id=settings.WEBAUTHN_RP_ID,
    name=settings.WEBAUTHN_RP_NAME
)


def b64url_encode(b: bytes) -> str:
    return websafe_encode(b).decode("utf-8")

def b64url_decode(s: str) -> bytes:
    return websafe_decode(s.encode("utf-8"))

class WebAuthnRegisterBegin(APIView):
    permission_classes = [permissions.IsAuthenticated]  # user must be logged in to register biometric
    def post(self, request):
        user = request.user
        username = user.username
        display_name = user.get_full_name() or username

        # exclude credentials the user already has
        exclude = []
        for cred in user.webauthn_credentials.all():
            exclude.append({
                "id": b64url_decode(cred.credential_id),
                "type": "public-key",
            })

        registration_data, state = server.register_begin(
            {
                "id": username.encode("utf-8"),
                "name": username,
                "displayName": display_name,
            },
            user_verification="preferred",
            exclude_credentials=exclude,
        )
        # registration_data contains challenge etc in proper shape for navigator.credentials.create()
        # store state.challenge in DB (state is dict-like)
        challenge_b64 = b64url_encode(state["challenge"])
        WebAuthnChallenge.objects.create(user=user, challenge=challenge_b64, purpose="register")
        return Response(registration_data)

class WebAuthnRegisterComplete(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request):
        # client sends clientDataJSON + attestationObject + rawId
        serializer = WebAuthnCompleteSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        # find pending challenge for this user
        challenge_record = WebAuthnChallenge.objects.filter(user=request.user, purpose="register").order_by("-created_at").first()
        if not challenge_record or challenge_record.is_expired():
            return Response({"detail":"No valid challenge"}, status=status.HTTP_400_BAD_REQUEST)

        state = {"challenge": b64url_decode(challenge_record.challenge)}

        try:
            attestation_object = b64url_decode(data["attestationObject"])
            client_data = b64url_decode(data["clientDataJSON"])
            auth_data = server.register_complete(state, client_data, attestation_object)
        except Exception as exc:
            return Response({"detail": str(exc)}, status=400)

        cred_id = b64url_encode(auth_data.credential_data.credential_id)
        public_key = auth_data.credential_data.public_key
        sign_count = auth_data.sign_count

        # store credential
        WebAuthnCredential.objects.create(
            user=request.user,
            credential_id=cred_id,
            public_key=public_key.to_bytes().hex() if hasattr(public_key, "to_bytes") else str(public_key),
            sign_count=sign_count
        )

        # delete challenge
        challenge_record.delete()
        return Response({"status":"ok"})

class WebAuthnAuthBegin(APIView):
    permission_classes = [permissions.AllowAny]
    def post(self, request):
        # For auth via username (or email) — find user
        username = request.data.get("username")
        if not username:
            return Response({"detail":"username required"}, status=400)

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({"detail":"user not found"}, status=404)

        # Get user's credentials
        creds = []
        for cred in user.webauthn_credentials.all():
            creds.append({
                "id": b64url_decode(cred.credential_id),
                "type": "public-key",
            })

        auth_data, state = server.authenticate_begin(creds, user_verification="preferred")
        # store state.challenge for verification
        challenge_b64 = b64url_encode(state["challenge"])
        WebAuthnChallenge.objects.create(user=user, challenge=challenge_b64, purpose="authenticate")
        # return auth_data to client (navigator.credentials.get)
        # need to convert any bytes to base64url where necessary
        return Response(auth_data)

class WebAuthnAuthComplete(APIView):
    permission_classes = [permissions.AllowAny]
    def post(self, request):
        serializer = WebAuthnCompleteSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        raw_id_b64 = data["rawId"]
        raw_id = b64url_decode(raw_id_b64)

        # locate challenge record by username (client may also send username)
        username = request.data.get("username")
        if not username:
            return Response({"detail":"username required"}, status=400)
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({"detail":"user not found"}, status=404)

        challenge_record = WebAuthnChallenge.objects.filter(user=user, purpose="authenticate").order_by("-created_at").first()
        if not challenge_record or challenge_record.is_expired():
            return Response({"detail":"No valid challenge"}, status=400)

        state = {"challenge": b64url_decode(challenge_record.challenge)}

        # find matching credential stored
        try:
            cred = user.webauthn_credentials.get(credential_id=b64url_encode(raw_id))
        except WebAuthnCredential.DoesNotExist:
            return Response({"detail":"Unknown credential"}, status=404)

        try:
            client_data = b64url_decode(data["clientDataJSON"])
            auth_data = b64url_decode(data["authenticatorData"])
            sig = b64url_decode(data["signature"])
            result = server.authenticate_complete(
                state,
                [{"credential_id": raw_id, "public_key": bytes.fromhex(cred.public_key) if cred.public_key else None, "sign_count": cred.sign_count}],
                client_data,
                auth_data,
                sig
            )
        except Exception as exc:
            return Response({"detail": str(exc)}, status=400)

        # update sign_count
        cred.sign_count = result["new_sign_count"]
        cred.save()

        # delete challenge
        challenge_record.delete()

        # issue tokens (JWT)
        refresh = RefreshToken.for_user(user)
        return Response({
            "message":"authentication successful",
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        })
