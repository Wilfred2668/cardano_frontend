# Generate a secure random key for JWT signing
# Run this and copy the output to your .env file

import secrets

# Generate 256-bit (32 bytes) secret key
secret_key = secrets.token_hex(32)

print("=" * 60)
print("Your new JWT Secret Key:")
print("=" * 60)
print(secret_key)
print("=" * 60)
print("\nAdd this to your backend/.env file:")
print(f"JWT_SECRET_KEY={secret_key}")
print("=" * 60)
