from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional
import uvicorn

from config import settings
from auth.challenge_store import challenge_store
from auth.cardano_verifier import cardano_verifier  # Use Cardano verifier (no Docker needed)
from auth.jwt_utils import create_access_token
from routes.campaigns import router as campaigns_router

# Initialize FastAPI app
app = FastAPI(
    title="Rize DID Authentication API",
    description="DID-based authentication using Hyperledger Identus",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(campaigns_router)

# ============================================================
# Pydantic Models
# ============================================================

class ChallengeResponse(BaseModel):
    """Response model for challenge generation."""
    challenge: str = Field(..., description="Random challenge string to be signed")
    did: str = Field(..., description="The DID requesting authentication")

class VerifyRequest(BaseModel):
    """Request model for signature verification."""
    did: str = Field(..., description="The DID claiming authentication")
    challenge: str = Field(..., description="The challenge that was signed")
    signature: str = Field(..., description="JWS signature of the challenge")

class AuthResponse(BaseModel):
    """Response model for successful authentication."""
    access_token: str = Field(..., description="JWT access token")
    token_type: str = Field(default="bearer", description="Token type")
    did: str = Field(..., description="Authenticated DID")

class ErrorResponse(BaseModel):
    """Response model for errors."""
    detail: str = Field(..., description="Error message")

# ============================================================
# API Endpoints
# ============================================================

@app.get("/")
async def root():
    """Root endpoint with API information."""
    return {
        "name": "Rize DID Authentication API",
        "version": "1.0.0",
        "status": "running",
        "identus_agent": settings.IDENTUS_AGENT_URL
    }

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}

@app.get(
    "/auth/challenge",
    response_model=ChallengeResponse,
    responses={
        400: {"model": ErrorResponse, "description": "Invalid request"},
        500: {"model": ErrorResponse, "description": "Internal server error"}
    }
)
async def get_challenge(did: str = Query(..., description="The DID requesting authentication")):
    """
    Generate a random challenge for DID authentication.
    
    The client must sign this challenge with their DID's private key
    and send it back to the /auth/verify endpoint.
    
    Args:
        did: The DID in format "did:prism:..." or other supported DID methods
        
    Returns:
        ChallengeResponse with the challenge string
    """
    try:
        if not did or not did.startswith("did:"):
            raise HTTPException(
                status_code=400,
                detail="Invalid DID format. Must start with 'did:'"
            )
        
        # Generate challenge
        challenge = challenge_store.create_challenge(did)
        
        return ChallengeResponse(challenge=challenge, did=did)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate challenge: {str(e)}"
        )

@app.post(
    "/auth/verify",
    response_model=AuthResponse,
    responses={
        400: {"model": ErrorResponse, "description": "Invalid request"},
        401: {"model": ErrorResponse, "description": "Authentication failed"},
        500: {"model": ErrorResponse, "description": "Internal server error"}
    }
)
async def verify_authentication(request: VerifyRequest):
    """
    Verify DID-based authentication.
    
    This endpoint:
    1. Validates the challenge is still valid
    2. Resolves the DID through Identus Cloud Agent
    3. Extracts the public key from the DID Document
    4. Verifies the JWS signature using ES256
    5. Issues a JWT access token if valid
    
    Args:
        request: VerifyRequest containing did, challenge, and signature
        
    Returns:
        AuthResponse with JWT access token
    """
    try:
        # Step 1: Verify challenge exists and is valid
        if not challenge_store.verify_challenge(request.did, request.challenge):
            raise HTTPException(
                status_code=401,
                detail="Invalid or expired challenge. Please request a new challenge."
            )
        
        # Step 2: Verify DID authentication (Cardano-based verification)
        is_valid = cardano_verifier.verify_did_authentication(
            did=request.did,
            challenge=request.challenge,
            signature=request.signature
        )
        
        if not is_valid:
            raise HTTPException(
                status_code=401,
                detail="Signature verification failed. Authentication unsuccessful."
            )
        
        # Step 3: Create JWT access token
        access_token = create_access_token(request.did)
        
        return AuthResponse(
            access_token=access_token,
            token_type="bearer",
            did=request.did
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Authentication verification failed: {str(e)}"
        )

@app.get("/auth/me")
async def get_current_user(token: str = Query(..., description="JWT access token")):
    """
    Get current authenticated user information from JWT token.
    
    Args:
        token: JWT access token
        
    Returns:
        User information including DID
    """
    try:
        from auth.jwt_utils import verify_token
        
        payload = verify_token(token)
        if not payload:
            raise HTTPException(
                status_code=401,
                detail="Invalid or expired token"
            )
        
        return {
            "did": payload.get("did"),
            "authenticated": True,
            "expires_at": payload.get("exp")
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get user info: {str(e)}"
        )

# ============================================================
# Main Entry Point
# ============================================================

if __name__ == "__main__":
    print(f"""
╔════════════════════════════════════════════════════════════╗
║  Rize DID Authentication API                               ║
║  Running on: http://{settings.API_HOST}:{settings.API_PORT}                  ║
║  Identus Agent: {settings.IDENTUS_AGENT_URL}               ║
╚════════════════════════════════════════════════════════════╝
    """)
    
    uvicorn.run(
        "main:app",
        host=settings.API_HOST,
        port=settings.API_PORT,
        reload=True
    )
