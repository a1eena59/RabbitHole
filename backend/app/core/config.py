# backend/app/core/config.py
import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "RabbitHole Core Engine"
    API_V1_STR: str = "/api"
    
    # Database Configuration - Defaults to local SQLite for instant testing if env isn't set
    DATABASE_URL: str = "sqlite+aiosqlite:///./rabbithole.db"
    
    # Model Configuration
    EMBEDDING_MODEL_NAME: str = "all-MiniLM-L6-v2"
    
    model_config = SettingsConfigDict(
        env_file=os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), ".env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()