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

# ----------------- AUTH / LOGIN -----------------

from rest_framework import permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from .serializers import LoginSerializer  # already defined in your serializers.py


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    @swagger_auto_schema(
        operation_description="Login with email and password to obtain JWT tokens",
        request_body=LoginSerializer,
        responses={
            200: openapi.Response(
                description="Login successful",
                examples={
                    "application/json": {
                        "message": "Login successful",
                        "refresh": "your_refresh_token",
                        "access": "your_access_token",
                        "user": {
                            "id": 1,
                            "username": "daniel",
                            "email": "daniel@example.com",
                            "role": "student"
                        }
                    }
                },
            ),
            400: "Invalid credentials or missing fields",
        },
    )
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]

        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)

        return Response({
            "message": "Login successful",
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "role": user.role,
            }
        }, status=status.HTTP_200_OK)



class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        user = serializer.save(is_active=False)  # user inactive until verified
        user.otp_secret = pyotp.random_base32()

        totp = pyotp.TOTP(user.otp_secret)
        otp = totp.now()
        user.otp_created_at = timezone.now()
        user.save()

        # Send OTP to email
        send_mail(
            "Verify Your Email - SMS",
            f"Welcome to SMS!\n\nYour email verification code is: {otp}\nThis code will expire in 5 minutes.",
            "olorunfemidaniel53@gmail.com",
            [user.email],
        )


class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class ConnectHederaView(APIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = ConnectHederaSerializer  # same serializer: expects hedera_account_id, public_key (optional)

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        hedera_account_id = serializer.validated_data["hedera_account_id"]
        public_key = serializer.validated_data.get("public_key")

        # 1️⃣ Check if user already exists
        user = User.objects.filter(hedera_account_id=hedera_account_id).first()

        if user:
            # ✅ Existing user — log in
            refresh = RefreshToken.for_user(user)
            return Response({
                "message": "Login successful (via Hedera)",
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "role": user.role,
                    "hedera_account_id": user.hedera_account_id,
                },
            }, status=status.HTTP_200_OK)

        # 2️⃣ If user doesn't exist — register new one
        user = User.objects.create_user(
            username=f"hedera_{hedera_account_id}",
            email=f"{hedera_account_id}@hedera.local",  # placeholder email
            is_active=True,
            role="user",
            hedera_account_id=hedera_account_id,
            hedera_public_key=public_key or "",
        )

        refresh = RefreshToken.for_user(user)

        return Response({
            "message": "New Hedera account linked & user created.",
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "user": {
                "id": user.id,
                "username": user.username,
                "hedera_account_id": user.hedera_account_id,
            },
        }, status=status.HTTP_201_CREATED)


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

        # ✅ Mark user as verified and activate account
        user.is_active = True
        user.otp_secret = None
        user.save()

        refresh = RefreshToken.for_user(user)

        return Response({
            "message": "Email verified successfully! You’re now logged in.",
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }, status=200)

