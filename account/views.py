from rest_framework import generics, permissions
from django.contrib.auth import get_user_model
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import UserSerializer, RegisterSerializer, ConnectHederaSerializer

User = get_user_model()


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class ConnectHederaView(APIView):
    """
    Connect an existing Hedera account to the user profile.
    ( backend can also generate new accounts and save encrypted private keys).
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ConnectHederaSerializer  # ✅ helps DRF schema generators

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        hedera_account_id = serializer.validated_data["hedera_account_id"]
        public_key = serializer.validated_data.get("public_key")

        user = request.user
        user.hedera_account_id = hedera_account_id
        if public_key:
            user.hedera_public_key = public_key
        user.save()

        return Response({
            "status": "linked",
            "hedera_account_id": user.hedera_account_id
        })
