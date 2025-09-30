from django.db import models
from django.conf import settings

User = settings.AUTH_USER_MODEL


class Driver(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="driver_profile")
    vehicle_type = models.CharField(max_length=100)
    license_plate = models.CharField(max_length=50, unique=True)
    is_available = models.BooleanField(default=True)
    phone_number = models.CharField(max_length=20, blank=True, null=True)

    def __str__(self):
        return f"Driver {self.user.username} - {self.vehicle_type}"


class Student(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="student_profile")
    department = models.CharField(max_length=150, blank=True, null=True)
    year_of_study = models.PositiveIntegerField(blank=True, null=True)

    def __str__(self):
        return f"Student {self.user.username}"
