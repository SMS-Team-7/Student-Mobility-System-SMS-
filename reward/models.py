from django.db import models
from django.conf import settings

class TokenReward(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="token_rewards"
    )
    # optional relation to a ride (some rewards are unrelated)
    ride = models.ForeignKey(
        "ride.Ride",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="token_rewards"
    )
    amount = models.PositiveIntegerField(default=0)
    reason = models.CharField(max_length=255)   # e.g. "Booked a ride", "Uploaded free book"
    hedera_tx_id = models.CharField(max_length=128, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.amount} tokens → {self.user.username} ({self.reason})"
