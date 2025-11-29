"""
Cardano-based DID Verifier using PyCardano
Alternative to Identus Cloud Agent - works without Docker

This verifier:
1. Extracts public key from DID
2. Verifies Ed25519 signature directly
3. No need for Identus agent or Docker
"""

from jose import jws
from jose.constants import ALGORITHMS
from cryptography.hazmat.primitives.asymmetric import ed25519
from cryptography.hazmat.primitives import serialization
import json
import base64

class CardanoDIDVerifier:
    """
    Verify DID authentication using direct cryptographic verification.
    No Docker or Identus agent required.
    """
    
    def __init__(self):
        print("Initializing Cardano DID Verifier (Docker-free mode)")
    
    def extract_public_key_from_did(self, did: str) -> str:
        """
        Extract public key from DID identifier.
        Format: did:prism:<public-key-hex>
        
        Args:
            did: DID string (e.g., "did:prism:abc123...")
            
        Returns:
            Public key in hex format
        """
        try:
            # Parse DID format: did:prism:<identifier>
            parts = did.split(":")
            if len(parts) != 3 or parts[0] != "did" or parts[1] != "prism":
                raise ValueError(f"Invalid DID format: {did}")
            
            # The identifier contains the public key
            public_key_hex = parts[2]
            
            return public_key_hex
            
        except Exception as e:
            raise ValueError(f"Failed to extract public key from DID: {str(e)}")
    
    def verify_signature(self, message: str, signature: str, public_key_hex: str) -> bool:
        """
        Verify Ed25519 signature using public key.
        
        Args:
            message: Original challenge message
            signature: JWS signature in compact format
            public_key_hex: Public key in hex format
            
        Returns:
            True if signature is valid, False otherwise
        """
        try:
            print(f"Verifying signature with public key: {public_key_hex[:20]}...")
            
            # Parse JWS compact format: header.payload.signature
            parts = signature.split('.')
            if len(parts) != 3:
                print("Invalid JWS format")
                return False
            
            header_b64, payload_b64, signature_b64 = parts
            
            # Decode header to check algorithm
            header = json.loads(base64.urlsafe_b64decode(header_b64 + '=='))
            if header.get('alg') not in ['EdDSA', 'ES256']:
                print(f"Unsupported algorithm: {header.get('alg')}")
                return False
            
            # Decode payload (should be the challenge)
            payload = base64.urlsafe_b64decode(payload_b64 + '==').decode('utf-8')
            if payload != message:
                print("Payload doesn't match challenge")
                return False
            
            # Decode signature
            signature_bytes = base64.urlsafe_b64decode(signature_b64 + '==')
            
            # Convert hex public key to bytes
            # Ed25519 public key must be exactly 32 bytes (64 hex chars)
            try:
                if len(public_key_hex) != 64:
                    print(f"Invalid public key length: {len(public_key_hex)} (expected 64 hex chars)")
                    return False
                
                public_key_bytes = bytes.fromhex(public_key_hex)
                
                if len(public_key_bytes) != 32:
                    print(f"Invalid public key byte length: {len(public_key_bytes)} (expected 32 bytes)")
                    return False
                
                # Create Ed25519 public key object
                public_key = ed25519.Ed25519PublicKey.from_public_bytes(public_key_bytes)
                
                # Verify signature
                # Message to verify is: header.payload
                message_to_verify = f"{header_b64}.{payload_b64}".encode('utf-8')
                public_key.verify(signature_bytes, message_to_verify)
                
                print("✓ Signature verified successfully")
                return True
                
            except Exception as verify_error:
                print(f"Signature verification failed: {str(verify_error)}")
                return False
            
        except Exception as e:
            print(f"Error during signature verification: {str(e)}")
            return False
    
    def verify_did_authentication(self, did: str, challenge: str, signature: str) -> bool:
        """
        Complete DID authentication verification.
        
        Args:
            did: Decentralized Identifier
            challenge: Random challenge string
            signature: JWS signature of the challenge
            
        Returns:
            True if authentication successful, False otherwise
        """
        try:
            print(f"\n=== Verifying DID Authentication ===")
            print(f"DID: {did}")
            print(f"Challenge: {challenge[:20]}...")
            
            # Step 1: Extract public key from DID
            public_key_hex = self.extract_public_key_from_did(did)
            print(f"Extracted public key: {public_key_hex[:20]}...")
            
            # Step 2: Verify signature
            is_valid = self.verify_signature(challenge, signature, public_key_hex)
            
            if is_valid:
                print("✓ DID authentication successful")
            else:
                print("✗ DID authentication failed")
            
            return is_valid
            
        except Exception as e:
            print(f"DID authentication error: {str(e)}")
            return False

# Global verifier instance
cardano_verifier = CardanoDIDVerifier()
