from rest_framework import generics, permissions, serializers, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.conf import settings
import pyotp

from django.core.mail import send_mail
from django.contrib.auth import get_user_model


from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import OTPRequestSerializer, OTPVerifySerializer



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



# ---------- STEP 1: Request OTP ----------
class OTPRequestView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = OTPRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"]

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error": "No account found with this email"}, status=404)

        # Generate or reuse OTP secret
        if not user.otp_secret:
            user.otp_secret = pyotp.random_base32()

        totp = pyotp.TOTP(user.otp_secret)
        otp = totp.now()

        # Save timestamp
        user.otp_created_at = timezone.now()
        user.save()

        # Send OTP via email
        send_mail(
            "Your Login OTP",
            f"Your one-time password is: {otp}\n\nIt will expire in 5 minutes.",
            "no-reply@myapp.com",
            [user.email],
        )

        return Response({"message": "OTP sent to your email."}, status=200)


# ---------- STEP 2: Verify OTP ----------
class OTPVerifyView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = OTPVerifySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]
        otp = serializer.validated_data["otp"]

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error": "Invalid email."}, status=404)

        if user.otp_expired():
            return Response({"error": "OTP expired. Request a new one."}, status=400)

        totp = pyotp.TOTP(user.otp_secret)
        if not totp.verify(otp):
            return Response({"error": "Invalid OTP."}, status=400)

        # ✅ Generate JWT token for user
        refresh = RefreshToken.for_user(user)

        # Optional: clear secret to prevent reuse
        user.otp_secret = None
        user.save()

        return Response({
            "message": "Login successful!",
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }, status=200)

