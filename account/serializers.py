from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "role",
            "hedera_account_id",
            "hedera_public_key",
        ]
        read_only_fields = ["id", "hedera_account_id", "hedera_public_key"]


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["username", "email", "password", "role"]

    def create(self, validated_data):
        return User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
            role=validated_data.get("role", "user"),
        )


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)



# ✅ NEW — Serializer for ConnectHederaView
class ConnectHederaSerializer(serializers.Serializer):
    hedera_account_id = serializers.CharField(required=True)
    public_key = serializers.CharField(required=False, allow_blank=True)

    def validate_hedera_account_id(self, value):
        if not value.strip():
            raise serializers.ValidationError("hedera_account_id cannot be empty.")
        return value