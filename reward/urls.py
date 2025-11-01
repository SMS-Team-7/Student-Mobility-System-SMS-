from django.urls import path
from .views import (
    TokenRewardListView,
    TokenBalanceView,
    HederaAccountBalanceView,
    HederaTokenTransferView,
)

urlpatterns = [
    path("", TokenRewardListView.as_view(), name="token-reward-list"),          # /tokens/
    path("balance/", TokenBalanceView.as_view(), name="token-balance"),        # /tokens/balance/
    path("hedera/balance/", HederaAccountBalanceView.as_view(), name="hedera-account-balance"),  # /tokens/hedera/balance/
    path("hedera/transfer/", HederaTokenTransferView.as_view(), name="hedera-token-transfer"),   # /tokens/hedera/transfer/
]
