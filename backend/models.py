"""
Pydantic models for request/response validation
"""
from pydantic import BaseModel, Field, validator
from typing import Optional
from datetime import datetime

class CreateCampaignRequest(BaseModel):
    """Request model for creating a campaign"""
    campaign_name: str = Field(..., min_length=1, max_length=200, description="Campaign name")
    campaign_description: str = Field(..., min_length=1, description="Campaign description")
    campaign_objective: Optional[str] = Field(None, description="Campaign objective/goal")
    target_audience: Optional[str] = Field(None, description="Target audience")
    budget: Optional[float] = Field(None, ge=0, description="Campaign budget")
    duration_days: Optional[int] = Field(None, ge=1, description="Campaign duration in days")
    start_date: Optional[str] = Field(None, description="Campaign start date")
    end_date: Optional[str] = Field(None, description="Campaign end date")
    input_text: str = Field(..., min_length=1, description="Detailed explanation for processing")

class CampaignResponse(BaseModel):
    """Response model for campaign"""
    id: int
    campaign_id: str
    did: str
    identifier_from_purchaser: str
    campaign_name: str
    campaign_description: str
    campaign_objective: Optional[str]
    target_audience: Optional[str]
    budget: Optional[float]
    duration_days: Optional[int]
    start_date: Optional[str]
    end_date: Optional[str]
    input_text: str
    status: str
    created_at: str
    updated_at: str

class CampaignListResponse(BaseModel):
    """Response model for listing campaigns"""
    campaigns: list[CampaignResponse]
    total: int

class UserIdentifierResponse(BaseModel):
    """Response model for user identifier"""
    identifier: str
    did: str
