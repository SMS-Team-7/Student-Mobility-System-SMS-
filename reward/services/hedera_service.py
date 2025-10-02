from django.conf import settings
from hedera import (
    Client, AccountId, PrivateKey,
    TokenId, TransferTransaction,
    AccountCreateTransaction, Hbar
)
from ..models import TokenReward


def get_hedera_client():
    """
    Initialize and return a Hedera client using operator credentials.
    """
    operator_id = AccountId.fromString(settings.HEDERA_OPERATOR_ID)
    operator_key = PrivateKey.fromString(settings.HEDERA_OPERATOR_KEY)
    client = Client.forTestnet() if settings.HEDERA_NETWORK == "testnet" else Client.forMainnet()
    client.setOperator(operator_id, operator_key)
    return client


def create_hedera_account(initial_balance=10):
    """
    Create a new custodial Hedera account for a user.
    Returns (account_id, public_key, private_key).
    """
    client = get_hedera_client()

    # Generate a new keypair for the user
    new_private = PrivateKey.generate()
    new_public = new_private.getPublicKey()

    # Create account transaction
    transaction = (
        AccountCreateTransaction()
        .setKey(new_public)
        .setInitialBalance(Hbar(initial_balance))  # give them some tinybar
    )

    tx_response = transaction.execute(client)
    receipt = tx_response.getReceipt(client)

    account_id = str(receipt.accountId)
    return account_id, str(new_public), str(new_private)


def transfer_tokens(user, amount, reason="Reward"):
    """
    Transfer Team7 tokens from treasury/operator to the user’s Hedera account.
    Also creates a local TokenReward entry.
    """
    if not user.hedera_account_id:
        raise Exception("User has no Hedera account linked")

    client = get_hedera_client()
    token_id = TokenId.fromString(settings.TEAM7_TOKEN_ID)

    # Build transfer transaction
    transaction = (
        TransferTransaction()
        .addTokenTransfer(token_id, client.operatorAccountId, -amount)
        .addTokenTransfer(token_id, AccountId.fromString(user.hedera_account_id), amount)
        .freezeWith(client)
        .sign(PrivateKey.fromString(settings.HEDERA_OPERATOR_KEY))
    )

    # Execute transaction
    tx_response = transaction.execute(client)
    receipt = tx_response.getReceipt(client)

    if receipt.status.toString() != "SUCCESS":
        raise Exception(f"Hedera transfer failed: {receipt.status}")

    # Save local reward record
    reward = TokenReward.objects.create(
        user=user,
        amount=amount,
        reason=reason,
        hedera_tx_id=str(tx_response.transactionId)
    )

    return reward
