from rest_framework import serializers
from .models import TokenReward

class TokenRewardSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    ride = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = TokenReward
        fields = [
            "id",
            "user",
            "ride",
            "amount",
            "reason",
            "hedera_tx_id",
            "created_at",
        ]
        read_only_fields = ["id", "user", "created_at", "hedera_tx_id"]
