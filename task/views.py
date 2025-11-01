from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils import timezone

from .models import Challenge, ChallengeParticipation
from .serializers import ChallengeSerializer, ChallengeParticipationSerializer


# -------- Challenges --------
class ChallengeListView(generics.ListAPIView):
    """
    List all active challenges
    """
    queryset = Challenge.objects.filter(is_active=True)
    serializer_class = ChallengeSerializer
    permission_classes = [permissions.IsAuthenticated]


class ChallengeJoinView(APIView):
    """
    Join a challenge
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, challenge_id):
        try:
            challenge = Challenge.objects.get(id=challenge_id, is_active=True)
        except Challenge.DoesNotExist:
            return Response({"error": "Challenge not found or inactive."}, status=404)

        participation, created = ChallengeParticipation.objects.get_or_create(
            user=request.user,
            challenge=challenge
        )

        if not created:
            return Response({"message": "You already joined this challenge."}, status=200)

        return Response(
            ChallengeParticipationSerializer(participation).data,
            status=201
        )


class MyChallengesView(generics.ListAPIView):
    """
    List challenges joined by the authenticated user
    """
    serializer_class = ChallengeParticipationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ChallengeParticipation.objects.filter(user=self.request.user)


class ChallengeCompleteView(APIView):
    """
    Mark a challenge as completed and reward tokens
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, participation_id):
        try:
            participation = ChallengeParticipation.objects.get(
                id=participation_id,
                user=request.user
            )
        except ChallengeParticipation.DoesNotExist:
            return Response({"error": "Challenge participation not found."}, status=404)

        if participation.completed:
            return Response({"message": "Challenge already completed."}, status=200)

        # Mark complete → reward tokens
        participation.complete()

        return Response(
            ChallengeParticipationSerializer(participation).data,
            status=200
        )
