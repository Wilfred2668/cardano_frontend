"""
Campaign service for database operations
"""
import secrets
from typing import List, Optional
from database import get_db
from models import CampaignResponse

class CampaignService:
    """Service for managing campaigns in the database"""
    
    @staticmethod
    def generate_campaign_id() -> str:
        """Generate a unique campaign ID"""
        return secrets.token_hex(16)
    
    @staticmethod
    def get_or_create_user_identifier(did: str) -> str:
        """
        Get existing identifier for DID or create a new one
        Each DID gets one unique 24-character hex identifier
        
        Args:
            did: User's DID
            
        Returns:
            24-character hex identifier
        """
        with get_db() as conn:
            cursor = conn.cursor()
            
            # Check if identifier exists for this DID
            cursor.execute("""
                SELECT identifier_from_purchaser
                FROM user_identifiers
                WHERE did = ?
            """, (did,))
            
            row = cursor.fetchone()
            
            if row:
                return row['identifier_from_purchaser']
            
            # Generate new identifier
            identifier = secrets.token_hex(12)  # 12 bytes = 24 hex characters
            
            cursor.execute("""
                INSERT INTO user_identifiers (did, identifier_from_purchaser)
                VALUES (?, ?)
            """, (did, identifier))
            conn.commit()
            
            return identifier
    
    @staticmethod
    def create_campaign(
        did: str,
        campaign_name: str,
        campaign_description: str,
        input_text: str,
        campaign_objective: Optional[str] = None,
        target_audience: Optional[str] = None,
        budget: Optional[float] = None,
        duration_days: Optional[int] = None,
        start_date: Optional[str] = None,
        end_date: Optional[str] = None
    ) -> CampaignResponse:
        """
        Create a new campaign in the database
        
        Args:
            did: User's DID
            campaign_name: Name of the campaign
            campaign_description: Description of the campaign
            input_text: Detailed explanation for processing
            campaign_objective: Campaign objective/goal
            target_audience: Target audience
            budget: Campaign budget
            duration_days: Duration in days
            start_date: Start date
            end_date: End date
            
        Returns:
            Created campaign data
        """
        campaign_id = CampaignService.generate_campaign_id()
        identifier = CampaignService.get_or_create_user_identifier(did)
        
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO campaigns 
                (campaign_id, did, identifier_from_purchaser, campaign_name, 
                 campaign_description, campaign_objective, target_audience, 
                 budget, duration_days, start_date, end_date, input_text, status)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (campaign_id, did, identifier, campaign_name, campaign_description,
                  campaign_objective, target_audience, budget, duration_days,
                  start_date, end_date, input_text, 'pending'))
            conn.commit()
            
            # Fetch the created campaign
            cursor.execute("""
                SELECT id, campaign_id, did, identifier_from_purchaser,
                       campaign_name, campaign_description, campaign_objective,
                       target_audience, budget, duration_days, start_date, end_date,
                       input_text, status, created_at, updated_at
                FROM campaigns
                WHERE campaign_id = ?
            """, (campaign_id,))
            
            row = cursor.fetchone()
            
        return CampaignResponse(
            id=row['id'],
            campaign_id=row['campaign_id'],
            did=row['did'],
            identifier_from_purchaser=row['identifier_from_purchaser'],
            campaign_name=row['campaign_name'],
            campaign_description=row['campaign_description'],
            campaign_objective=row['campaign_objective'],
            target_audience=row['target_audience'],
            budget=row['budget'],
            duration_days=row['duration_days'],
            start_date=row['start_date'],
            end_date=row['end_date'],
            input_text=row['input_text'],
            status=row['status'],
            created_at=row['created_at'],
            updated_at=row['updated_at']
        )
    
    @staticmethod
    def get_campaigns_by_did(did: str) -> List[CampaignResponse]:
        """
        Get all campaigns for a specific DID
        
        Args:
            did: User's DID
            
        Returns:
            List of campaigns
        """
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                SELECT id, campaign_id, did, identifier_from_purchaser,
                       campaign_name, campaign_description, campaign_objective,
                       target_audience, budget, duration_days, start_date, end_date,
                       input_text, status, created_at, updated_at
                FROM campaigns
                WHERE did = ?
                ORDER BY created_at DESC
            """, (did,))
            
            rows = cursor.fetchall()
        
        return [
            CampaignResponse(
                id=row['id'],
                campaign_id=row['campaign_id'],
                did=row['did'],
                identifier_from_purchaser=row['identifier_from_purchaser'],
                campaign_name=row['campaign_name'],
                campaign_description=row['campaign_description'],
                campaign_objective=row['campaign_objective'],
                target_audience=row['target_audience'],
                budget=row['budget'],
                duration_days=row['duration_days'],
                start_date=row['start_date'],
                end_date=row['end_date'],
                input_text=row['input_text'],
                status=row['status'],
                created_at=row['created_at'],
                updated_at=row['updated_at']
            )
            for row in rows
        ]
    
    @staticmethod
    def get_campaign_by_id(campaign_id: str) -> Optional[CampaignResponse]:
        """
        Get a specific campaign by its ID
        
        Args:
            campaign_id: Campaign identifier
            
        Returns:
            Campaign data or None if not found
        """
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                SELECT id, campaign_id, did, identifier_from_purchaser,
                       campaign_name, campaign_description, campaign_objective,
                       target_audience, budget, duration_days, start_date, end_date,
                       input_text, status, created_at, updated_at
                FROM campaigns
                WHERE campaign_id = ?
            """, (campaign_id,))
            
            row = cursor.fetchone()
        
        if not row:
            return None
        
        return CampaignResponse(
            id=row['id'],
            campaign_id=row['campaign_id'],
            did=row['did'],
            identifier_from_purchaser=row['identifier_from_purchaser'],
            campaign_name=row['campaign_name'],
            campaign_description=row['campaign_description'],
            campaign_objective=row['campaign_objective'],
            target_audience=row['target_audience'],
            budget=row['budget'],
            duration_days=row['duration_days'],
            start_date=row['start_date'],
            end_date=row['end_date'],
            input_text=row['input_text'],
            status=row['status'],
            created_at=row['created_at'],
            updated_at=row['updated_at']
        )
    
    @staticmethod
    def update_campaign_status(campaign_id: str, status: str) -> bool:
        """
        Update campaign status
        
        Args:
            campaign_id: Campaign identifier
            status: New status
            
        Returns:
            True if updated, False if not found
        """
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                UPDATE campaigns
                SET status = ?, updated_at = CURRENT_TIMESTAMP
                WHERE campaign_id = ?
            """, (status, campaign_id))
            conn.commit()
            
            return cursor.rowcount > 0

# Global service instance
campaign_service = CampaignService()
