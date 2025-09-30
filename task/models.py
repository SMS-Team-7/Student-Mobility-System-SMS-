from django.db import models
from django.conf import settings
from django.utils import timezone
from reward.models import TokenReward


class Challenge(models.Model):
    """
    A challenge that users can complete to earn tokens.
    Example: "Upload 3 free books", "Book 5 rides", etc.
    """
    title = models.CharField(max_length=255)
    description = models.TextField()
    token_reward = models.PositiveIntegerField(default=10)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.title


class ChallengeParticipation(models.Model):
    """
    Track which users joined/completed challenges.
    """
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="challenges")
    challenge = models.ForeignKey(Challenge, on_delete=models.CASCADE, related_name="participants")
    completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ("user", "challenge")

    def __str__(self):
        return f"{self.user.username} → {self.challenge.title}"

    def complete(self):
        """
        Mark challenge as complete and reward tokens.
        """
        if not self.completed:
            self.completed = True
            self.completed_at = timezone.now()
            self.save()

            # Reward tokens
            TokenReward.objects.create(
                user=self.user,
                amount=self.challenge.token_reward,
                reason=f"Completed challenge: {self.challenge.title}"
            )
