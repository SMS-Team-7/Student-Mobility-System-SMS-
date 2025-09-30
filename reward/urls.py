from django.urls import path
from .views import TokenRewardListView, TokenBalanceView

urlpatterns = [
    path("", TokenRewardListView.as_view(), name="token-reward-list"),  # /tokens/
    path("balance/", TokenBalanceView.as_view(), name="token-balance"),  # /tokens/balance/
]
