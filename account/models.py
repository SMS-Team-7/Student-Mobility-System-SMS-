from django.contrib.auth.models import AbstractUser
from django.db import models


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

    def __str__(self):
        return f"{self.username} ({self.role})"
