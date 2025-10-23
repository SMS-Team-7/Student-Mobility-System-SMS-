from django.urls import path
from . import views

urlpatterns = [
    # ---------- WebAuthn (Biometric) ----------
    path("webauthn/register/begin/", views.WebAuthnRegisterBegin.as_view(), name="webauthn-register-begin"),
    path("webauthn/register/complete/", views.WebAuthnRegisterComplete.as_view(), name="webauthn-register-complete"),

    path("webauthn/auth/begin/", views.WebAuthnAuthBegin.as_view(), name="webauthn-auth-begin"),
    path("webauthn/auth/complete/", views.WebAuthnAuthComplete.as_view(), name="webauthn-auth-complete"),
]
