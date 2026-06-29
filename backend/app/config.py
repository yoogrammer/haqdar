# app/config.py
from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache
from typing import List

class Settings(BaseSettings):
    # App
    APP_NAME: str = "HaqDar API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    
    # API
    API_V1_PREFIX: str = "/api/v1"
    
    # CORS
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "https://haqdar.vercel.app",
    ]
    
    # AI Service
    GROQ_API_KEY: str
    GROQ_MODEL: str = "llama-3.3-70b-versatile"
    AI_MAX_TOKENS: int = 250
    AI_TEMPERATURE: float = 0.7
    AI_TIMEOUT: int = 15
    
    # Cache
    CACHE_TTL: int = 3600
    CACHE_MAX_SIZE: int = 1000
    
    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 30
    
    # Logging
    LOG_LEVEL: str = "INFO"
    
    # ✅ CRITICAL — Allow extra fields in .env (ignores OPENAI_API_KEY, etc)
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"  # ← This fixes the error
    )

@lru_cache()
def get_settings() -> Settings:
    return Settings()

settings = get_settings()