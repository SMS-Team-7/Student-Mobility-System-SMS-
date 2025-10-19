from rest_framework import generics, permissions, serializers, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.conf import settings

import io
import qrcode
import base64
import pyotp
from PIL import Image
import cv2
import numpy as np
import datetime

from .serializers import (
    UserSerializer,
    RegisterSerializer,
    ConnectHederaSerializer,
    QRGenerateSerializer,
    QRScanSerializer,
)
from .models import TempLoginToken

User = get_user_model()


# ----------------- AUTH / PROFILE -----------------
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class ConnectHederaView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ConnectHederaSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        hedera_account_id = serializer.validated_data["hedera_account_id"]
        public_key = serializer.validated_data.get("public_key")

        user = request.user
        user.hedera_account_id = hedera_account_id
        if public_key:
            user.hedera_public_key = public_key
        user.save()

        return Response({
            "status": "linked",
            "hedera_account_id": user.hedera_account_id
        })


# ----------------- QR CODE -----------------
class GenerateQRView(APIView):
    """
    Generate a QR code for arbitrary data or a temporary login token.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = QRGenerateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        data = serializer.validated_data.get('data')

        # Optional: generate a temporary login token
        if data == "temp_login":
            expires_at = timezone.now() + datetime.timedelta(minutes=5)
            temp_token = TempLoginToken.objects.create(
                user=request.user,
                expires_at=expires_at
            )
            data = str(temp_token.token)

        qr_img = qrcode.make(data)
        buffer = io.BytesIO()
        qr_img.save(buffer, format='PNG')
        qr_base64 = base64.b64encode(buffer.getvalue()).decode()

        return Response({
            'message': 'QR code generated successfully',
            'data': data,
            'qr_code_base64': f"data:image/png;base64,{qr_base64}",
        }, status=status.HTTP_200_OK)


class ScanQRView(APIView):
    """
    Scan a QR code and optionally verify a temporary login token.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = QRScanSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        image = serializer.validated_data['image']
        image_bytes = np.frombuffer(image.read(), np.uint8)
        img = cv2.imdecode(image_bytes, cv2.IMREAD_COLOR)

        detector = cv2.QRCodeDetector()
        data, bbox, _ = detector.detectAndDecode(img)

        if not data:
            return Response({'error': 'No QR code detected'}, status=status.HTTP_400_BAD_REQUEST)

        # Check if data corresponds to a TempLoginToken
        try:
            token_obj = TempLoginToken.objects.get(token=data, is_verified=False)
            if token_obj.is_expired():
                return Response({'error': 'QR code expired'}, status=status.HTTP_400_BAD_REQUEST)

            token_obj.is_verified = True
            token_obj.save()
            return Response({
                'message': 'QR login verified',
                'user_id': token_obj.user.id,
                'username': token_obj.user.username
            }, status=status.HTTP_200_OK)
        except TempLoginToken.DoesNotExist:
            # Return raw data if not a temp login token
            return Response({'decoded_data': data}, status=status.HTTP_200_OK)


# ----------------- OTP -----------------
class OTPSetupView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user_email = request.user.email or "user@example.com"
        secret = pyotp.random_base32()

        totp = pyotp.TOTP(secret)
        otp_uri = totp.provisioning_uri(name=user_email, issuer_name="MyApp")

        qr_img = qrcode.make(otp_uri)
        buffer = io.BytesIO()
        qr_img.save(buffer, format='PNG')
        qr_base64 = base64.b64encode(buffer.getvalue()).decode()

        return Response({
            "secret": secret,
            "qr_code_base64": f"data:image/png;base64,{qr_base64}",
            "otp_uri": otp_uri,
        })


class OTPVerifySerializer(serializers.Serializer):
    secret = serializers.CharField()
    otp = serializers.CharField()


class OTPVerifyView(APIView):
    def post(self, request):
        serializer = OTPVerifySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        secret = serializer.validated_data['secret']
        otp = serializer.validated_data['otp']

        totp = pyotp.TOTP(secret)
        if totp.verify(otp):
            return Response({"message": "OTP verified successfully"}, status=status.HTTP_200_OK)
        return Response({"error": "Invalid or expired OTP"}, status=status.HTTP_400_BAD_REQUEST)
