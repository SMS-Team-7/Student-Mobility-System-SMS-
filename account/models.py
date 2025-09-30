# users/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    ROLE_CHOICES = (
        ("student", "Student"),
        ("driver", "Driver"),
        ("user", "Normal User"),
    )

    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="user")
    hedera_account_id = models.CharField(max_length=100, blank=True, null=True)
    public_key = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.username} ({self.role})"
