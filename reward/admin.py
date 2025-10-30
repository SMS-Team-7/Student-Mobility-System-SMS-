from django.contrib import admin
from .models import TokenReward

@admin.register(TokenReward)
class TokenRewardAdmin(admin.ModelAdmin):
    list_display = ("user", "amount", "reason", "hedera_tx_id", "created_at")
    list_filter = ("reason", "created_at")
    search_fields = ("user__username", "user__email", "reason", "hedera_tx_id")
    ordering = ("-created_at",)
