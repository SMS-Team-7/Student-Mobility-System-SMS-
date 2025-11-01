from dotenv import load_dotenv
import os

load_dotenv()

HEDERA_OPERATOR_ID = os.getenv("HEDERA_OPERATOR_ID")
HEDERA_OPERATOR_KEY = os.getenv("HEDERA_OPERATOR_KEY")
TEAM7_TOKEN_ID = os.getenv("TEAM7_TOKEN_ID")

print("🔍 Operator ID loaded as:", repr(HEDERA_OPERATOR_ID))
print("🔍 Operator Key loaded as:", repr(HEDERA_OPERATOR_KEY)[:40] + "...")
print("🔍 Token ID loaded as:", repr(TEAM7_TOKEN_ID))


import os
from hedera import (
    Client, AccountId, PrivateKey,
    TokenId, TransferTransaction
)

# ------------------------
# CONFIGURATION
# ------------------------

# Load these from environment variables or your Django settings
HEDERA_OPERATOR_ID = os.getenv("HEDERA_OPERATOR_ID", "0.0.xxxxxx")  # your treasury account
HEDERA_OPERATOR_KEY = os.getenv("HEDERA_OPERATOR_KEY", "302e...")   # private key for that account
TEAM7_TOKEN_ID = os.getenv("TEAM7_TOKEN_ID", "0.0.xxxxxx")          # your Hedera token ID
HEDERA_NETWORK = os.getenv("HEDERA_NETWORK", "testnet")             # or "mainnet"

# User’s Hedera Account ID
USER_ACCOUNT_ID = "0.0.6917054"   # <- replace with user's Hedera ID
AMOUNT = 10                      # amount of tokens to send


# ------------------------
# MAIN LOGIC
# ------------------------

def get_hedera_client():
    """
    Initialize and return a Hedera client using operator credentials.
    """
    operator_id = AccountId.fromString(HEDERA_OPERATOR_ID)
    operator_key = PrivateKey.fromString(HEDERA_OPERATOR_KEY)

    client = Client.forTestnet() if HEDERA_NETWORK == "testnet" else Client.forMainnet()
    client.setOperator(operator_id, operator_key)
    return client


def send_token_reward(account_id: str, amount: int):
    """
    Transfer Team7 tokens from operator to a user's Hedera account.
    """
    client = get_hedera_client()
    token_id = TokenId.fromString(TEAM7_TOKEN_ID)

    print(f"🚀 Sending {amount} tokens to {account_id}...")

    # Create the transaction
    transaction = (
        TransferTransaction()
        .addTokenTransfer(token_id, client.operatorAccountId, -amount)
        .addTokenTransfer(token_id, AccountId.fromString(account_id), amount)
        .freezeWith(client)
        .sign(PrivateKey.fromString(HEDERA_OPERATOR_KEY))
    )

    # Execute transaction
    tx_response = transaction.execute(client)
    receipt = tx_response.getReceipt(client)

    if receipt.status.toString() == "SUCCESS":
        print(f"✅ Transfer successful! TX ID: {tx_response.transactionId}")
    else:
        print(f"❌ Transfer failed: {receipt.status}")


if __name__ == "__main__":
    send_token_reward(USER_ACCOUNT_ID, AMOUNT)
