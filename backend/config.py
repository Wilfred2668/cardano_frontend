from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    """Application configuration settings."""
    
    # Identus Cloud Agent Configuration
    IDENTUS_AGENT_URL: str = "http://localhost:8080"
    
    # JWT Configuration
    JWT_SECRET_KEY: str = "your-secret-key-change-this-in-production"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRATION_HOURS: int = 24
    
    # API Configuration
    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8000
    API_RELOAD: bool = True
    
    # CORS Origins
    CORS_ORIGINS: list = ["http://localhost:5173", "http://localhost:3000"]
    
    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "ignore"  # Ignore extra fields from .env

settings = Settings()
