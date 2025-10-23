import base64
from django.db import models
from django.utils import timezone
from django.conf import settings

User = settings.AUTH_USER_MODEL

def b64encode(b: bytes) -> str:
    return base64.urlsafe_b64encode(b).rstrip(b"=").decode("ascii")

def b64decode(s: str) -> bytes:
    padding = '=' * (-len(s) % 4)
    return base64.urlsafe_b64decode(s + padding)


class WebAuthnCredential(models.Model):
    """
    Stores public key credential for a user.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="webauthn_credentials")
    credential_id = models.CharField(max_length=512, unique=True)  # base64url
    public_key = models.TextField()  # COSE / PEM base64
    sign_count = models.BigIntegerField(default=0)
    transports = models.CharField(max_length=255, blank=True, null=True)  # optional
    created_at = models.DateTimeField(auto_now_add=True)

    def credential_id_bytes(self) -> bytes:
        return b64decode(self.credential_id)


class WebAuthnChallenge(models.Model):
    """
    Stores temporary challenge (for registration or authentication).
    """
    PURPOSE_CHOICES = (
        ("register", "Register"),
        ("authenticate", "Authenticate"),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    challenge = models.CharField(max_length=512)
    purpose = models.CharField(max_length=32, choices=PURPOSE_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)

    def is_expired(self):
        """Challenges expire after 5 minutes."""
        return timezone.now() - self.created_at > timezone.timedelta(minutes=5)
