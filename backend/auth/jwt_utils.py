from datetime import datetime, timedelta
from typing import Optional
from jose import jwt
from config import settings

def create_access_token(did: str) -> str:
    """
    Create a JWT access token for the authenticated DID.
    
    Args:
        did: The DID to include in the token
        
    Returns:
        Encoded JWT token string
    """
    expire = datetime.utcnow() + timedelta(hours=settings.JWT_EXPIRATION_HOURS)
    
    payload = {
        "sub": did,
        "did": did,
        "exp": expire,
        "iat": datetime.utcnow(),
        "type": "access_token"
    }
    
    token = jwt.encode(
        payload,
        settings.JWT_SECRET_KEY,
        algorithm=settings.JWT_ALGORITHM
    )
    
    return token

def verify_token(token: str) -> Optional[dict]:
    """
    Verify and decode a JWT token.
    
    Args:
        token: The JWT token to verify
        
    Returns:
        Decoded token payload if valid, None otherwise
    """
    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM]
        )
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.JWTError:
        return None

def extract_did_from_token(token: str) -> Optional[str]:
    """
    Extract DID from a JWT token.
    
    Args:
        token: The JWT token
        
    Returns:
        DID string if valid, None otherwise
    """
    payload = verify_token(token)
    if payload:
        return payload.get("did")
    return None
