import json
import base64
import requests
from typing import Optional, Dict, Any
from jose import jws, jwt
from jose.constants import ALGORITHMS
from cryptography.hazmat.primitives.asymmetric import ec
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.backends import default_backend
from config import settings

class DIDVerifier:
    """
    Handles DID resolution and signature verification using Hyperledger Identus.
    """
    
    def __init__(self, agent_url: str = None):
        self.agent_url = agent_url or settings.IDENTUS_AGENT_URL
    
    def resolve_did(self, did: str) -> Optional[Dict[str, Any]]:
        """
        Resolve a DID using the Identus Cloud Agent.
        
        Args:
            did: The DID to resolve (e.g., "did:prism:...")
            
        Returns:
            DID Document dictionary if successful, None otherwise
        """
        try:
            # Call Identus Cloud Agent DID resolution endpoint
            url = f"{self.agent_url}/dids/{did}"
            response = requests.get(url, timeout=10)
            
            if response.status_code == 200:
                return response.json()
            elif response.status_code == 404:
                print(f"DID not found: {did}")
                return None
            else:
                print(f"DID resolution failed with status {response.status_code}: {response.text}")
                return None
                
        except requests.RequestException as e:
            print(f"Error resolving DID: {str(e)}")
            return None
    
    def extract_public_key(self, did_document: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """
        Extract the public key from a DID Document.
        
        Args:
            did_document: The resolved DID Document
            
        Returns:
            Public key JWK dictionary if found, None otherwise
        """
        try:
            # Try to find verification method
            verification_methods = did_document.get("verificationMethod", [])
            
            if not verification_methods:
                print("No verification methods found in DID document")
                return None
            
            # Get the first verification method
            verification_method = verification_methods[0]
            
            # Extract publicKeyJwk
            public_key_jwk = verification_method.get("publicKeyJwk")
            
            if not public_key_jwk:
                # Try publicKeyMultibase or other formats
                print("publicKeyJwk not found, checking other formats...")
                return None
            
            return public_key_jwk
            
        except Exception as e:
            print(f"Error extracting public key: {str(e)}")
            return None
    
    def verify_signature(
        self,
        message: str,
        signature: str,
        public_key_jwk: Dict[str, Any]
    ) -> bool:
        """
        Verify a JWS signature using ES256 algorithm.
        
        Args:
            message: The original message that was signed
            signature: The JWS compact serialization signature
            public_key_jwk: The public key in JWK format
            
        Returns:
            True if signature is valid, False otherwise
        """
        try:
            # Verify JWS signature
            # The signature should be in JWS compact format: header.payload.signature
            decoded = jws.verify(
                signature,
                public_key_jwk,
                algorithms=[ALGORITHMS.ES256, ALGORITHMS.ES256K, ALGORITHMS.ES384, ALGORITHMS.ES512]
            )
            
            # Check if the decoded payload matches the message
            decoded_str = decoded.decode('utf-8') if isinstance(decoded, bytes) else decoded
            
            return decoded_str == message
            
        except Exception as e:
            print(f"Signature verification failed: {str(e)}")
            return False
    
    def verify_did_authentication(
        self,
        did: str,
        challenge: str,
        signature: str
    ) -> bool:
        """
        Complete DID authentication verification flow.
        
        Args:
            did: The DID claiming authentication
            challenge: The original challenge string
            signature: The JWS signature of the challenge
            
        Returns:
            True if authentication is valid, False otherwise
        """
        # Step 1: Resolve DID
        did_document = self.resolve_did(did)
        if not did_document:
            print(f"Failed to resolve DID: {did}")
            return False
        
        # Step 2: Extract public key
        public_key = self.extract_public_key(did_document)
        if not public_key:
            print(f"Failed to extract public key from DID document")
            return False
        
        # Step 3: Verify signature
        is_valid = self.verify_signature(challenge, signature, public_key)
        
        if is_valid:
            print(f"Successfully verified DID authentication for: {did}")
        else:
            print(f"Signature verification failed for: {did}")
        
        return is_valid

# Global verifier instance
did_verifier = DIDVerifier()
