from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone
import uuid


# ----------------- CUSTOM USER MODEL -----------------
class User(AbstractUser):
    ROLE_CHOICES = (
        ("student", "Student"),
        ("driver", "Driver"),
        ("user", "Normal User"),
    )

    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="user")

    # Hedera custodial fields
    hedera_account_id = models.CharField(max_length=100, blank=True, null=True)
    hedera_public_key = models.TextField(blank=True, null=True)
    hedera_private_key_encrypted = models.TextField(blank=True, null=True)
    # 🔒 store encrypted version of private key (don’t keep plain text!)
    otp_secret = models.CharField(max_length=32, blank=True, null=True)
    otp_created_at = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return f"{self.username} ({self.role})"

    def otp_expired(self):
        if not self.otp_created_at:
            return True
        return (timezone.now() - self.otp_created_at).seconds > 300 

   


# ----------------- TEMP LOGIN TOKEN -----------------
class TempLoginToken(models.Model):
    """
    Temporary QR login session.
    Used to allow a user to log in via mobile QR scan.
    """
    token = models.UUIDField(default=uuid.uuid4, unique=True)
    user = models.ForeignKey('User', on_delete=models.CASCADE, null=True, blank=True)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()

    def is_expired(self):
        return timezone.now() > self.expires_at

    def __str__(self):
        status = "Verified" if self.is_verified else "Pending"
        return f"{self.token} ({status})"
 