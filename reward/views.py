from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Sum
from django.conf import settings

from .models import TokenReward
from .serializers import TokenRewardSerializer

# Hedera SDK imports
from hedera import (
    Client, AccountId, PrivateKey,
    TokenId, TransferTransaction, AccountBalanceQuery
)


def get_hedera_client():
    """
    Initialize and return a Hedera client using operator credentials.
    """
    operator_id = AccountId.fromString(settings.HEDERA_OPERATOR_ID)
    operator_key = PrivateKey.fromString(settings.HEDERA_OPERATOR_KEY)
    client = Client.forTestnet() if settings.HEDERA_NETWORK == "testnet" else Client.forMainnet()
    client.setOperator(operator_id, operator_key)
    return client


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
    Get the total token balance (local DB).
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        balance = TokenReward.objects.filter(user=request.user).aggregate(
            total=Sum("amount")
        )["total"] or 0
        return Response({"balance": balance})


class HederaAccountBalanceView(APIView):
    """
    Get the real balance from Hedera network for the operator account.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        client = get_hedera_client()
        balance = (
            AccountBalanceQuery()
            .setAccountId(settings.HEDERA_OPERATOR_ID)
            .execute(client)
        )
        return Response({
            "hbars": str(balance.hbars),
            "tokens": {str(tid): amt for tid, amt in balance.token.values.items()}
        })


class HederaTokenTransferView(APIView):
    """
    Transfer Team7 tokens from treasury/operator to a user account.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user_account_id = request.data.get("account_id")  # Hedera account to send to
        amount = int(request.data.get("amount", 0))

        if not user_account_id or amount <= 0:
            return Response({"error": "Invalid parameters"}, status=400)

        client = get_hedera_client()
        token_id = TokenId.fromString(settings.TEAM7_TOKEN_ID)

        # Transfer tokens
        transaction = (
            TransferTransaction()
            .addTokenTransfer(token_id, client.operatorAccountId, -amount)
            .addTokenTransfer(token_id, AccountId.fromString(user_account_id), amount)
            .freezeWith(client)
            .sign(PrivateKey.fromString(settings.HEDERA_OPERATOR_KEY))
        )

        tx_response = transaction.execute(client)
        receipt = tx_response.getReceipt(client)

        if receipt.status.toString() != "SUCCESS":
            return Response({"error": f"Transfer failed: {receipt.status}"}, status=400)

        # ✅ Properly indented
        TokenReward.objects.create(
            user=request.user,
            amount=amount,
            reason=f"Hedera transfer {receipt.status}",
            hedera_tx_id=str(tx_response.transactionId)
        )

        return Response({
            "message": "Transfer successful",
            "status": str(receipt.status),
            "transaction_id": str(tx_response.transactionId)
        })
