# app/models/schemas.py
from pydantic import BaseModel, Field, validator
from typing import List, Optional, Literal
from enum import Enum

class Gender(str, Enum):
    MALE = "male"
    FEMALE = "female"
    OTHER = "other"

class Residence(str, Enum):
    RURAL = "rural"
    URBAN = "urban"

class Caste(str, Enum):
    GENERAL = "general"
    OBC = "obc"
    SC = "sc"
    ST = "st"

class Language(str, Enum):
    ENGLISH = "english"
    HINDI = "hindi"

class UserProfile(BaseModel):
    """User profile with strict validation"""
    name: str = Field(..., min_length=1, max_length=100, description="User's name")
    age: int = Field(..., ge=1, le=120, description="Age between 1-120")
    gender: Gender
    state: str = Field(..., min_length=2, max_length=50)
    residence: Residence
    occupation: str = Field(..., min_length=2, max_length=50)
    income: int = Field(..., ge=0, le=10_000_000, description="Annual income in rupees")
    caste: Caste
    has_bank_account: bool = False
    has_ration_card: bool = False
    has_children: bool = False
    is_pregnant: bool = False
    language: Language = Language.ENGLISH
    
    @validator('name')
    def sanitize_name(cls, v):
        return v.strip().title()
    
    @validator('state')
    def sanitize_state(cls, v):
        return v.strip().title()
    
    class Config:
        json_schema_extra = {
            "example": {
                "name": "Sunita Devi",
                "age": 32,
                "gender": "female",
                "state": "Rajasthan",
                "residence": "rural",
                "occupation": "farmer",
                "income": 49000,
                "caste": "sc",
                "has_bank_account": True,
                "has_ration_card": True,
                "has_children": True,
                "is_pregnant": False,
                "language": "english"
            }
        }

class Scheme(BaseModel):
    """Government scheme model"""
    id: int
    name: str
    name_hindi: str
    benefit: str
    benefit_hindi: str
    category: str
    documents: List[str]
    documents_hindi: List[str]
    apply_at: str
    apply_at_hindi: str
    apply_online: str
    annual_benefit_value: int
    tags: List[str]

class SchemesResponse(BaseModel):
    """Response model with metadata"""
    success: bool
    user_name: str
    total_schemes: int
    total_annual_benefit: int
    schemes: List[Scheme]
    ai_summary: str
    language: str
    cached: bool = False
    processing_time_ms: Optional[float] = None

class HealthResponse(BaseModel):
    status: str
    version: str
    timestamp: str

class ErrorResponse(BaseModel):
    detail: str
    error_code: Optional[str] = None