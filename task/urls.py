from django.urls import path
from .views import (
    ChallengeListView, ChallengeJoinView,
    MyChallengesView, ChallengeCompleteView
)

urlpatterns = [
    # Challenges
    path("challenges/", ChallengeListView.as_view(), name="challenge-list"),
    path("challenges/<int:challenge_id>/join/", ChallengeJoinView.as_view(), name="challenge-join"),
    path("challenges/me/", MyChallengesView.as_view(), name="my-challenges"),
    path("challenges/<int:participation_id>/complete/", ChallengeCompleteView.as_view(), name="challenge-complete"),
]

