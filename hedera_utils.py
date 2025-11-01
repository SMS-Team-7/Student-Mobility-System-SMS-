import os
from dotenv import load_dotenv
from hedera import (
    Client, AccountId, PrivateKey,
    AccountCreateTransaction, Hbar,
    TransferTransaction, TokenCreateTransaction, TokenType, TokenSupplyType,
    TokenMintTransaction, AccountBalanceQuery, TransactionId
)

# Load environment variables
load_dotenv()

OPERATOR_ID = AccountId.fromString(os.getenv("HEDERA_OPERATOR_ID"))
OPERATOR_KEY = PrivateKey.fromStringDER(os.getenv("HEDERA_OPERATOR_KEY"))
TEAM7_TOKEN_ID = os.getenv("TEAM7_TOKEN_ID")

# ✅ Utility: Create Hedera client
def create_client():
    client = Client.forTestnet()
    client.setOperator(OPERATOR_ID, OPERATOR_KEY)
    return client

# ✅ Create Hedera account (for user)
def create_hedera_account(initial_hbar=10):
    client = create_client()
    new_key = PrivateKey.generateED25519()
    new_account_tx = (
        AccountCreateTransaction()
        .setKey(new_key.getPublicKey())
        .setInitialBalance(Hbar(initial_hbar))
        .execute(client)
    )
    receipt = new_account_tx.getReceipt(client)
    new_account_id = receipt.accountId

    return {
        "account_id": str(new_account_id),
        "public_key": str(new_key.getPublicKey()),
        "private_key": str(new_key),
    }

# ✅ Transfer tokens (from treasury or another user)
def transfer_tokens(from_account_id, from_private_key, to_account_id, token_id, amount):
    client = create_client()
    from_key = PrivateKey.fromString(from_private_key)

    transaction = (
        TransferTransaction()
        .addTokenTransfer(token_id, from_account_id, -amount)
        .addTokenTransfer(token_id, to_account_id, amount)
        .freezeWith(client)
        .sign(from_key)
    )

    tx_response = transaction.execute(client)
    receipt = tx_response.getReceipt(client)
    return {"tx_id": str(tx_response.transactionId), "status": str(receipt.status)}

# ✅ Mint new tokens (if supply is INFINITE)
def mint_tokens(token_id, amount):
    client = create_client()
    tx = (
        TokenMintTransaction()
        .setTokenId(token_id)
        .setAmount(amount)
        .freezeWith(client)
        .sign(OPERATOR_KEY)
    )
    response = tx.execute(client)
    receipt = response.getReceipt(client)
    return {"status": str(receipt.status), "new_supply": receipt.totalSupply}

# ✅ Get token balance for an account
def get_token_balance(account_id, token_id):
    client = create_client()
    balance = AccountBalanceQuery().setAccountId(AccountId.fromString(account_id)).execute(client)
    return balance.tokens.get(token_id)

# ✅ Verify transaction by ID
def verify_tx(tx_id: str):
    client = create_client()
    transaction_id = TransactionId.fromString(tx_id)
    receipt = transaction_id.getReceipt(client)
    return {"status": str(receipt.status)}
