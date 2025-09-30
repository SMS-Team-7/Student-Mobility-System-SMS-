from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Sum

from .models import TokenReward
from .serializers import TokenRewardSerializer


class TokenRewardListView(generics.ListAPIView):
    """
    List all token rewards for the authenticated user.
    """
    serializer_class = TokenRewardSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return TokenReward.objects.filter(user=self.request.user)


class TokenBalanceView(APIView):
    """
    Get the total token balance for the authenticated user.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        balance = TokenReward.objects.filter(user=request.user).aggregate(
            total=Sum("amount")
        )["total"] or 0
        return Response({"balance": balance})
