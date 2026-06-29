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


@router.get("/", tags=["Health"])
async def root():
    return {
        "service": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "tagline": "हर हक़ मिलना चाहिए",
        "docs": "/docs"
    }


@router.get("/health", response_model=HealthResponse, tags=["Health"])
async def health_check():
    return HealthResponse(
        status="healthy",
        version=settings.APP_VERSION,
        timestamp=datetime.utcnow().isoformat()
    )


@router.post("/find-schemes", response_model=SchemesResponse, tags=["Schemes"])
async def find_schemes(user: UserProfile):
    """
    Find all government schemes user is eligible for.
    """
    start_time = time.time()
    profile_dict = user.dict()
    
    try:
        # Check cache
        cached_result = cache_service.get(profile_dict)
        if cached_result:
            cached_result['user_name'] = user.name
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
        
        # Cache the result
        cache_service.set(profile_dict, response_data)
        
        # Save to database (non-blocking)
        try:
            from app.core.database import db_service
            db_service.save_submission(profile_dict, eligible_schemes, total_benefit)
        except Exception as db_error:
            logger.error(f"Database save failed: {db_error}")
        
        logger.info(
            f"Processed: user={user.name} | "
            f"schemes={len(eligible_schemes)} | "
            f"benefit=Rs.{total_benefit} | "
            f"time={response_data['processing_time_ms']}ms"
        )
        
        return response_data
        
    except Exception as e:
        logger.error(f"Error: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred. Please try again."
        )


@router.get("/schemes", tags=["Schemes"])
async def get_all_schemes():
    """Returns all schemes"""
    schemes = eligibility_engine.get_all_schemes()
    return {
        "total": len(schemes),
        "schemes": schemes
    }


@router.get("/stats", tags=["Admin"])
async def get_stats():
    """Service and usage statistics"""
    stats = {
        "cache": cache_service.stats(),
        "schemes_loaded": len(eligibility_engine.get_all_schemes()),
        "model": settings.GROQ_MODEL,
    }
    
    # Add database stats if available
    try:
        from app.core.database import db_service
        stats["database"] = db_service.get_stats()
    except Exception as e:
        stats["database"] = {"connected": False, "error": str(e)}
    
    return stats