# app/api/routes.py
import time
from fastapi import APIRouter, HTTPException, status
from datetime import datetime
from app.models.schemas import (
    UserProfile, SchemesResponse, HealthResponse, ErrorResponse
)
from app.core.eligibility import eligibility_engine
from app.core.ai_service import ai_service
from app.core.cache import cache_service
from app.config import settings
from app.utils.logger import logger

router = APIRouter()

@router.get(
    "/",
    tags=["Health"],
    summary="API Root"
)
async def root():
    return {
        "service": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "tagline": "हर हक़ मिलना चाहिए",
        "docs": "/docs"
    }

@router.get(
    "/health",
    response_model=HealthResponse,
    tags=["Health"]
)
async def health_check():
    return HealthResponse(
        status="healthy",
        version=settings.APP_VERSION,
        timestamp=datetime.utcnow().isoformat()
    )

@router.post(
    "/find-schemes",
    response_model=SchemesResponse,
    tags=["Schemes"],
    summary="Find eligible government schemes",
    responses={
        500: {"model": ErrorResponse, "description": "Internal server error"}
    }
)
async def find_schemes(user: UserProfile):
    """
    Find all government schemes user is eligible for.
    
    Returns personalized scheme recommendations with AI-generated summary.
    Results are cached for 1 hour to reduce API costs.
    """
    start_time = time.time()
    profile_dict = user.dict()
    
    try:
        # Check cache first
        cached_result = cache_service.get(profile_dict)
        if cached_result:
            cached_result['user_name'] = user.name  # Personalize name
            cached_result['cached'] = True
            cached_result['processing_time_ms'] = round((time.time() - start_time) * 1000, 2)
            return cached_result
        
        # Find eligible schemes
        eligible_schemes = eligibility_engine.check_eligibility(profile_dict)
        total_benefit = sum(s.get('annual_benefit_value', 0) for s in eligible_schemes)
        
        # Generate AI summary
        ai_summary = ai_service.generate_summary(
            user_name=user.name,
            user_profile=profile_dict,
            schemes=eligible_schemes,
            total_benefit=total_benefit,
            language=user.language.value
        )
        
        # Build response
        response_data = {
            "success": True,
            "user_name": user.name,
            "total_schemes": len(eligible_schemes),
            "total_annual_benefit": total_benefit,
            "schemes": eligible_schemes,
            "ai_summary": ai_summary,
            "language": user.language.value,
            "cached": False,
            "processing_time_ms": round((time.time() - start_time) * 1000, 2)
        }
        
        # Cache it
        cache_service.set(profile_dict, response_data)

        # Save to database (non-blocking, won't crash if fails)
try:
    from app.core.database import db_service
    db_service.save_submission(profile_dict, eligible_schemes, total_benefit)
except Exception as e:
    logger.error(f"DB save failed: {e}")
        
        logger.info(
            f"Processed request: user={user.name} | "
            f"schemes={len(eligible_schemes)} | "
            f"benefit=₹{total_benefit:,} | "
            f"time={response_data['processing_time_ms']}ms"
        )
        
        return response_data
        
    except Exception as e:
        logger.error(f"Error processing request: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while processing your request. Please try again."
        )

@router.get(
    "/schemes",
    tags=["Schemes"],
    summary="Get all available schemes"
)
async def get_all_schemes():
    """Returns all schemes in the database (for browsing)"""
    schemes = eligibility_engine.get_all_schemes()
    return {
        "total": len(schemes),
        "schemes": schemes
    }

@router.get("/stats", tags=["Admin"])
async def get_stats():
    """Service and usage statistics"""
    from app.core.database import db_service
    
    return {
        "cache": cache_service.stats(),
        "schemes_loaded": len(eligibility_engine.get_all_schemes()),
        "model": settings.GROQ_MODEL,
        "database": db_service.get_stats()
    }
async def get_stats():
    """Cache and service statistics"""
    return {
        "cache": cache_service.stats(),
        "schemes_loaded": len(eligibility_engine.get_all_schemes()),
        "model": settings.GROQ_MODEL
    }