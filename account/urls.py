from django.urls import path
from .views import RegisterView, ProfileView, ConnectHederaView

urlpatterns = [
    path("register/", RegisterView.as_view(), name="user-register"),   # /users/register/
    path("profile/", ProfileView.as_view(), name="user-profile"),      # /users/profile/
    path("connect-hedera/", ConnectHederaView.as_view(), name="connect-hedera"),  # /users/connect-hedera/
]
