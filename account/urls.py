from django.urls import path
from .views import RegisterView, ProfileView, ConnectHederaView, GenerateQRView, ScanQRView, OTPSetupView,OTPVerifyView

urlpatterns = [
    path("register/", RegisterView.as_view(), name="user-register"),   # /users/register/
    path("profile/", ProfileView.as_view(), name="user-profile"),      # /users/profile/
    path("connect-hedera/", ConnectHederaView.as_view(), name="connect-hedera"),  # /users/connect-hedera/
    path('generate-QR/', GenerateQRView.as_view(), name='generate_qr'),
    path('scan-QR/', ScanQRView.as_view(), name='scan_qr'),
    path('otp/setup/', OTPSetupView.as_view(), name='otp_setup'),
    path('otp/verify/', OTPVerifyView.as_view(), name='otp_verify'),
]
