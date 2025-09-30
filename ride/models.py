from django.db import models
from django.conf import settings
from driver.models import Driver, Student  # assuming same app

User = settings.AUTH_USER_MODEL


class Ride(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="rides")
    driver = models.ForeignKey(Driver, on_delete=models.CASCADE, related_name="rides")
    pickup_location = models.CharField(max_length=255)
    dropoff_location = models.CharField(max_length=255)
    status = models.CharField(
        max_length=20,
        choices=[("pending", "Pending"), ("ongoing", "Ongoing"), ("completed", "Completed")],
        default="pending"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return f"Ride {self.id} - {self.student.user.username} with {self.driver.user.username}"


class TokenReward(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="rewards")
    ride = models.ForeignKey("ride.Ride", on_delete=models.CASCADE, related_name="rewards", null=True, blank=True)
    amount = models.PositiveIntegerField(default=0)
    reason = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.amount} tokens → {self.user.username} ({self.reason})"


