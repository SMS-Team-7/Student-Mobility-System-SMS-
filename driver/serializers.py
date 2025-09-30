from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Driver, Student

User = get_user_model()


class DriverSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)
    email = serializers.CharField(source="user.email", read_only=True)

    class Meta:
        model = Driver
        fields = [
            "id",
            "username",
            "email",
            "vehicle_type",
            "license_plate",
            "is_available",
            "phone_number",
        ]


class StudentSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)
    email = serializers.CharField(source="user.email", read_only=True)

    class Meta:
        model = Student
        fields = [
            "id",
            "username",
            "email",
            "department",
            "year_of_study",
        ]
