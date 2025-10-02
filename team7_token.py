from hedera import (
    Client, PrivateKey, AccountId,
    TokenCreateTransaction, TokenType, TokenSupplyType
)

# --- Operator credentials ---
OPERATOR_ID = AccountId.fromString("0.0.6917054")
OPERATOR_KEY = PrivateKey.fromStringDER(
    "302e020100300506032b6570042204208c6fb1bc05605b77d0a831f66229fe3f5a7570cf90272049e804d333db57d30f"
)

# --- Connect to Hedera testnet ---
client = Client.forTestnet()
client.setOperator(OPERATOR_ID, OPERATOR_KEY)

# --- Create Fungible Token (T7T) ---
transaction = (
    TokenCreateTransaction()
    .setTokenName("Team7 Token")
    .setTokenSymbol("T7T")
    .setTreasuryAccountId(OPERATOR_ID)
    .setTokenType(TokenType.FUNGIBLE_COMMON)
    .setInitialSupply(1000000)  # 1,000,000 T7T
    .setSupplyType(TokenSupplyType.INFINITE)  # Can mint more later
    .setDecimals(0)  # Whole-number tokens
    .setAdminKey(OPERATOR_KEY.getPublicKey())
    .setSupplyKey(OPERATOR_KEY.getPublicKey())
    .freezeWith(client)
)

# --- Sign & execute ---
signed_tx = transaction.sign(OPERATOR_KEY)
response = signed_tx.execute(client)
receipt = response.getReceipt(client)

print("✅ Token Created!")
print("Token ID:", receipt.tokenId.toString())
