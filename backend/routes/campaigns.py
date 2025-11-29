"""
Campaign routes for FastAPI
"""
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import requests
from typing import List

from models import CreateCampaignRequest, CampaignResponse, CampaignListResponse, UserIdentifierResponse
from services.campaign_service import campaign_service
from auth.jwt_utils import verify_token
from config import settings

router = APIRouter(prefix="/campaigns", tags=["campaigns"])
security = HTTPBearer()

def get_current_did(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    """
    Dependency to get the current authenticated DID from JWT token
    """
    token = credentials.credentials
    payload = verify_token(token)
    
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )
    
    did = payload.get("did")
    if not did:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="DID not found in token"
        )
    
    return did

@router.get("/identifier", response_model=UserIdentifierResponse)
async def get_user_identifier(did: str = Depends(get_current_did)):
    """
    Get or create the unique identifier for the authenticated user
    """
    try:
        identifier = campaign_service.get_or_create_user_identifier(did)
        return UserIdentifierResponse(identifier=identifier, did=did)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get identifier: {str(e)}"
        )

@router.post("", response_model=CampaignResponse, status_code=status.HTTP_201_CREATED)
async def create_campaign(
    request: CreateCampaignRequest,
    did: str = Depends(get_current_did)
):
    """
    Create a new campaign and submit job to external API
    """
    try:
        # Get or create user identifier (unique per DID)
        identifier = campaign_service.get_or_create_user_identifier(did)
        
        # Store campaign in database
        campaign = campaign_service.create_campaign(
            did=did,
            campaign_name=request.campaign_name,
            campaign_description=request.campaign_description,
            campaign_objective=request.campaign_objective,
            target_audience=request.target_audience,
            budget=request.budget,
            duration_days=request.duration_days,
            start_date=request.start_date,
            end_date=request.end_date,
            input_text=request.input_text
        )
        
        # Prepare request for external API (only send identifier and input_text)
        job_request = {
            "identifier_from_purchaser": identifier,
            "input_data": {
                "text": request.input_text
            }
        }
        
        # Submit job to external API
        try:
            response = requests.post(
                settings.JOB_API_URL,
                json=job_request,
                timeout=10
            )
            
            if response.status_code == 200:
                # Update campaign status to processing
                campaign_service.update_campaign_status(campaign.campaign_id, "processing")
                campaign.status = "processing"
            else:
                print(f"Job API returned status {response.status_code}: {response.text}")
                
        except requests.RequestException as e:
            print(f"Failed to submit job to external API: {str(e)}")
            # Campaign remains in pending status
        
        return campaign
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create campaign: {str(e)}"
        )

@router.get("", response_model=CampaignListResponse)
async def get_campaigns(did: str = Depends(get_current_did)):
    """
    Get all campaigns for the authenticated user
    """
    try:
        campaigns = campaign_service.get_campaigns_by_did(did)
        return CampaignListResponse(
            campaigns=campaigns,
            total=len(campaigns)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch campaigns: {str(e)}"
        )

@router.get("/{campaign_id}", response_model=CampaignResponse)
async def get_campaign(
    campaign_id: str,
    did: str = Depends(get_current_did)
):
    """
    Get a specific campaign by ID
    """
    campaign = campaign_service.get_campaign_by_id(campaign_id)
    
    if not campaign:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Campaign not found"
        )
    
    # Verify the campaign belongs to the authenticated user
    if campaign.did != did:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    return campaign
