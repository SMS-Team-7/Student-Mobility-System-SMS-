from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model

User = get_user_model()



class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            raise serializers.ValidationError("Both email and password are required.")

        # get user by email
        try:
            user_obj = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError("Invalid email or password.")

        user = authenticate(username=user_obj.username, password=password)
        if not user:
            raise serializers.ValidationError("Invalid email or password.")

        if not user.is_active:
            raise serializers.ValidationError("This account is inactive.")

        data["user"] = user
        return data



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






# ✅ NEW — Serializer for ConnectHederaView
class ConnectHederaSerializer(serializers.Serializer):
    hedera_account_id = serializers.CharField(required=True)
    public_key = serializers.CharField(required=False, allow_blank=True)

    def validate_hedera_account_id(self, value):
        if not value.strip():
            raise serializers.ValidationError("hedera_account_id cannot be empty.")
        return value
 
class OTPRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

class OTPVerifySerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField()
    
 #Serializer for QR code generation and scanning
class QRGenerateSerializer(serializers.Serializer):
        data = serializers.CharField(required=True)

class QRScanSerializer(serializers.Serializer):
    image = serializers.ImageField()   