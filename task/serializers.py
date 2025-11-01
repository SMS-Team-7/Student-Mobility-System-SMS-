from rest_framework import serializers
from .models import Challenge, ChallengeParticipation


class ChallengeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Challenge
        fields = ["id", "title", "description", "token_reward", "is_active", "created_at"]


class ChallengeParticipationSerializer(serializers.ModelSerializer):
    challenge = ChallengeSerializer(read_only=True)

    class Meta:
        model = ChallengeParticipation
        fields = ["id", "challenge", "completed", "completed_at"]
