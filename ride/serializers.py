from rest_framework import serializers
from .models import Ride, TokenReward
from driver.serializers import DriverSerializer, StudentSerializer
from driver.models import Driver, Student

class RideSerializer(serializers.ModelSerializer):
    student = serializers.CharField(source="student.user.username", read_only=True)
    driver = serializers.CharField(source="driver.user.username", read_only=True)

    class Meta:
        model = Ride
        fields = [
            "id",
            "student",
            "driver",
            "pickup_location",
            "dropoff_location",
            "status",
            "created_at",
            "completed_at",
        ]


class TokenRewardSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = TokenReward
        fields = [
            "id",
            "username",
            "ride",
            "amount",
            "reason",
            "created_at",
        ]
