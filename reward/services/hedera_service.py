import os
import requests
from django.conf import settings
from ..models import TokenReward


# Mirror Node + Hashio endpoints
HEDERA_MIRROR = "https://testnet.mirrornode.hedera.com/api/v1"
HEDERA_HASHIO = "https://testnet.hashio.io/api"

OPERATOR_ID = settings.HEDERA_OPERATOR_ID
OPERATOR_KEY = settings.HEDERA_OPERATOR_KEY  # For real signing if needed
TOKEN_ID = settings.TEAM7_TOKEN_ID
NETWORK = settings.HEDERA_NETWORK  # "testnet" or "mainnet"


def get_account_balance(account_id: str):
    """
    Fetch Hedera account balance using Mirror Node REST API.
    """
    url = f"{HEDERA_MIRROR}/accounts/{account_id}"
    resp = requests.get(url)

    if resp.status_code != 200:
        raise Exception(f"Error fetching balance: {resp.text}")

    return resp.json().get("balance", {}).get("balance", 0)


def create_hedera_account(initial_balance=10):
    """
    ⚠️ Real Hedera account creation requires signed transactions.
    For now, we simulate creation (custodial accounts can be tracked locally).
    """
    # In production, you would call Hashio + sign with OPERATOR_KEY
    fake_account_id = f"0.0.{os.urandom(3).hex()}"
    fake_public_key = os.urandom(32).hex()
    fake_private_key = os.urandom(32).hex()

    return fake_account_id, fake_public_key, fake_private_key


def transfer_tokens(user, amount, reason="Reward"):
    """
    Record a Hedera token transfer.
    For real transfers, you’d use the Hashio API and sign requests.
    Here we simulate + log in DB for Render-safe deployment.
    """
    if not user.hedera_account_id:
        raise Exception("User has no Hedera account linked")

    # Simulated transfer payload
    transfer_payload = {
        "from": OPERATOR_ID,
        "to": user.hedera_account_id,
        "token": TOKEN_ID,
        "amount": amount
    }

    # Normally: requests.post(HEDERA_HASHIO + "/v1/token/transfer", json=transfer_payload)
    # Here: fake success response
    fake_tx_id = os.urandom(6).hex()

    # Save local reward record
    reward = TokenReward.objects.create(
        user=user,
        amount=amount,
        reason=reason,
        hedera_tx_id=fake_tx_id
    )

    return reward
