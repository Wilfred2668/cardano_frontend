import secrets
from typing import Dict, Optional
from datetime import datetime, timedelta

class ChallengeStore:
    """
    In-memory store for authentication challenges.
    In production, use Redis or a proper database.
    """
    
    def __init__(self, expiration_minutes: int = 5):
        self._challenges: Dict[str, dict] = {}
        self.expiration_minutes = expiration_minutes
    
    def create_challenge(self, did: str) -> str:
        """
        Generate a random challenge for a DID.
        
        Args:
            did: The DID requesting authentication
            
        Returns:
            A random 32-byte hex string as the challenge
        """
        challenge = secrets.token_hex(32)
        
        self._challenges[did] = {
            "challenge": challenge,
            "created_at": datetime.utcnow(),
            "used": False
        }
        
        # Clean up expired challenges
        self._cleanup_expired()
        
        return challenge
    
    def verify_challenge(self, did: str, challenge: str) -> bool:
        """
        Verify if the challenge is valid for the given DID.
        
        Args:
            did: The DID being authenticated
            challenge: The challenge string to verify
            
        Returns:
            True if challenge is valid and not expired, False otherwise
        """
        if did not in self._challenges:
            return False
        
        stored = self._challenges[did]
        
        # Check if already used
        if stored["used"]:
            return False
        
        # Check if expired
        expiration = stored["created_at"] + timedelta(minutes=self.expiration_minutes)
        if datetime.utcnow() > expiration:
            del self._challenges[did]
            return False
        
        # Check if challenge matches
        if stored["challenge"] != challenge:
            return False
        
        # Mark as used
        stored["used"] = True
        
        return True
    
    def _cleanup_expired(self):
        """Remove expired challenges from the store."""
        now = datetime.utcnow()
        expired_dids = []
        
        for did, data in self._challenges.items():
            expiration = data["created_at"] + timedelta(minutes=self.expiration_minutes)
            if now > expiration:
                expired_dids.append(did)
        
        for did in expired_dids:
            del self._challenges[did]

# Global challenge store instance
challenge_store = ChallengeStore()
