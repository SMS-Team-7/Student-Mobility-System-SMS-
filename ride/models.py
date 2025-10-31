from django.db import models
from django.conf import settings
from django.utils import timezone

User = settings.AUTH_USER_MODEL


class Ride(models.Model):
    rider = models.ForeignKey(User, on_delete=models.CASCADE, related_name="rides", null=True, blank=True)
    driver = models.ForeignKey(User, on_delete=models.SET_NULL, related_name="rides_driven", null=True, blank=True)
    pickup_location = models.CharField(max_length=255)
    dropoff_location = models.CharField(max_length=255)
    status = models.CharField(
        max_length=20,
        choices=[
            ("pending", "Pending"),
            ("accepted", "Accepted"),
            ("ongoing", "Ongoing"),
            ("completed", "Completed"),
            ("cancelled", "Cancelled"),
        ],
        default="pending",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return f"Ride {self.id} by {self.rider.username} ({self.status})"


class TokenReward(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="rewards")
    ride = models.ForeignKey("ride.Ride", on_delete=models.CASCADE, related_name="rewards", null=True, blank=True)
    amount = models.PositiveIntegerField(default=0)
    reason = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.amount} tokens → {self.user.username} ({self.reason})"



class Location(models.Model):
    RIDE_ROLE_CHOICES = [
        ("driver", "Driver"),
        ("student", "Student"),
    ]

    ride = models.ForeignKey("ride.Ride", on_delete=models.CASCADE, related_name="locations")
    role = models.CharField(max_length=10, choices=RIDE_ROLE_CHOICES)
    latitude = models.FloatField()
    longitude = models.FloatField()
    timestamp = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ["-timestamp"]

    def __str__(self):
        return f"{self.role} @ ({self.latitude}, {self.longitude}) for Ride {self.ride.id}"
