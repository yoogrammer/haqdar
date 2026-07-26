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
    """Find all government schemes user is eligible for."""
    start_time = time.time()
    profile_dict = user.dict()
    
    try:
        cached_result = cache_service.get(profile_dict)
        if cached_result:
            cached_result['user_name'] = user.name
            cached_result['cached'] = True
            cached_result['processing_time_ms'] = round((time.time() - start_time) * 1000, 2)
            return cached_result
        
        eligible_schemes = eligibility_engine.check_eligibility(profile_dict)
        total_benefit = sum(s.get('annual_benefit_value', 0) for s in eligible_schemes)
        
        ai_summary = ai_service.generate_summary(
            user_name=user.name,
            user_profile=profile_dict,
            schemes=eligible_schemes,
            total_benefit=total_benefit,
            language=user.language.value
        )
        
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
        
        cache_service.set(profile_dict, response_data)
        
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
    
    try:
        from app.core.database import db_service
        stats["database"] = db_service.get_stats()
    except Exception as e:
        stats["database"] = {"connected": False, "error": str(e)}
    
    return stats
@router.post("/voice-chat", tags=["Voice"])
async def voice_chat(request: dict):
    """Extract and validate value from user's spoken response."""
    try:
        user_message = request.get("message", "")
        field = request.get("field", "name")
        language = request.get("language", "english")
        
        system_prompt = f"""You are a value extractor and validator for HaqDar.

Field to extract: {field}

Rules:
- name: Any name is valid. Extract just the name (e.g. "my name is Rohan" → "Rohan")
- age: MUST be a number between 1-120. If unclear or not a number, return null
- gender: MUST be "male", "female", or "other". If unclear, return null
- state: MUST be a valid Indian state name (Maharashtra, Delhi, Uttar Pradesh, Bihar, Rajasthan, Tamil Nadu, Karnataka, Gujarat, West Bengal, etc.). If not a state, return null
- residence: MUST be "rural" or "urban" (village=rural, city=urban, गाँव=rural, शहर=urban). If unclear, return null
- occupation: MUST be ONE of: "farmer", "daily_wage", "student", "salaried", "self_employed", "unemployed", "domestic_worker", "street_vendor". If unclear or not a job, return null
- income: MUST be a valid rupee amount (number). If user says something not related to money (like "laptop", "car"), return null. Convert lakh→100000, thousand→1000
- caste: MUST be "general", "obc", "sc", or "st". If unclear, return null

If value is invalid or unclear, return null for value.

Respond in JSON:
{{"value": "extracted_value_or_null"}}

Examples:
User: "laptop" (field: income)
Response: {{"value": null}}

User: "50 thousand" (field: income)
Response: {{"value": 50000}}

User: "farmer" (field: occupation)
Response: {{"value": "farmer"}}

User: "I don't know" (field: age)
Response: {{"value": null}}

User: "I am 32" (field: age)
Response: {{"value": 32}}

User: "some place" (field: state)
Response: {{"value": null}}

User: "Maharashtra" (field: state)
Response: {{"value": "Maharashtra"}}"""

        from groq import Groq
        client = Groq(api_key=settings.GROQ_API_KEY)
        
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Field: {field}\nUser said: {user_message}"}
            ],
            max_tokens=50,
            temperature=0.1,
            response_format={"type": "json_object"}
        )
        
        result_text = response.choices[0].message.content.strip()
        
        import json
        result = json.loads(result_text)
        
        extracted = result.get("value")
        
        # Additional validation
        if extracted is not None and extracted != "null":
            if field == "age":
                try:
                    age = int(extracted)
                    if age < 1 or age > 120:
                        extracted = None
                    else:
                        extracted = age
                except:
                    extracted = None
                    
            elif field == "income":
                try:
                    income = int(extracted)
                    if income < 0 or income > 100000000:
                        extracted = None
                    else:
                        extracted = income
                except:
                    extracted = None
                    
            elif field == "gender":
                if str(extracted).lower() not in ["male", "female", "other"]:
                    extracted = None
                else:
                    extracted = str(extracted).lower()
                    
            elif field == "residence":
                if str(extracted).lower() not in ["rural", "urban"]:
                    extracted = None
                else:
                    extracted = str(extracted).lower()
                    
            elif field == "caste":
                if str(extracted).lower() not in ["general", "obc", "sc", "st"]:
                    extracted = None
                else:
                    extracted = str(extracted).lower()
                    
            elif field == "occupation":
                valid_occupations = ["farmer", "daily_wage", "student", "salaried", "self_employed", "unemployed", "domestic_worker", "street_vendor"]
                if str(extracted).lower() not in valid_occupations:
                    extracted = None
                else:
                    extracted = str(extracted).lower()
        else:
            extracted = None
        
        logger.info(f"Extracted {field}: '{user_message}' → {extracted}")
        
        return {
            "success": True,
            "value": extracted,
            "valid": extracted is not None
        }
        
    except Exception as e:
        logger.error(f"Extract error: {e}")
        return {
            "success": False,
            "value": None,
            "valid": False
        }
        
@router.post("/sarvam/speech-to-text", tags=["Voice"])
async def sarvam_stt(request: dict):
    """Convert speech to text using Sarvam AI"""
    import os
    import httpx
    import base64
    
    SARVAM_KEY = os.getenv("SARVAM_API_KEY", "").strip()
    
    logger.info(f"Sarvam STT called. Key exists: {bool(SARVAM_KEY)}, Key length: {len(SARVAM_KEY)}")
    
    if not SARVAM_KEY:
        logger.error("SARVAM_API_KEY not found in environment")
        return {"success": False, "text": "", "error": "API key not configured"}
    
    try:
        audio_base64 = request.get("audio", "")
        language = request.get("language", "en-IN")
        
        if not audio_base64:
            return {"success": False, "text": "", "error": "No audio provided"}
        
        audio_bytes = base64.b64decode(audio_base64)
        logger.info(f"Audio decoded: {len(audio_bytes)} bytes, language: {language}")
        
        async with httpx.AsyncClient() as client:
            files = {
                'file': ('audio.wav', audio_bytes, 'audio/wav')
            }
            data = {
                'language_code': language,
                'model': 'saarika:v2',
                'with_timestamps': 'false'
            }
            headers = {
                'api-subscription-key': SARVAM_KEY
            }
            
            response = await client.post(
                'https://api.sarvam.ai/speech-to-text',
                files=files,
                data=data,
                headers=headers,
                timeout=15.0
            )
            
            logger.info(f"Sarvam STT response: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                text = result.get("transcript", "")
                logger.info(f"Transcribed: {text}")
                return {
                    "success": True,
                    "text": text,
                    "language": result.get("language_code", language)
                }
            else:
                error_text = response.text
                logger.error(f"Sarvam STT failed {response.status_code}: {error_text}")
                return {"success": False, "text": "", "error": error_text}
                
    except Exception as e:
        logger.error(f"STT exception: {type(e).__name__}: {e}", exc_info=True)
        return {"success": False, "text": "", "error": str(e)}


@router.post("/sarvam/text-to-speech", tags=["Voice"])
async def sarvam_tts(request: dict):
    """Convert text to speech using Sarvam AI"""
    import os
    import httpx
    
    SARVAM_KEY = os.getenv("SARVAM_API_KEY", "").strip()
    
    logger.info(f"Sarvam TTS called. Key exists: {bool(SARVAM_KEY)}")
    
    if not SARVAM_KEY:
        logger.error("SARVAM_API_KEY not found")
        return {"success": False, "audio": None, "error": "API key not configured"}
    
    try:
        text = request.get("text", "")
        language = request.get("language", "en-IN")
        speaker = request.get("speaker", "meera")
        
        if not text:
            return {"success": False, "audio": None, "error": "No text provided"}
        
        logger.info(f"TTS request: text='{text[:50]}...', lang={language}, speaker={speaker}")
        
        async with httpx.AsyncClient() as client:
            payload = {
                "inputs": [text],
                "target_language_code": language,
                "speaker": speaker,
                "pitch": 0,
                "pace": 1.0,
                "loudness": 1.0,
                "speech_sample_rate": 22050,
                "enable_preprocessing": True,
                "model": "bulbul:v1"
            }
            headers = {
                'api-subscription-key': SARVAM_KEY,
                'Content-Type': 'application/json'
            }
            
            response = await client.post(
                'https://api.sarvam.ai/text-to-speech',
                json=payload,
                headers=headers,
                timeout=20.0
            )
            
            logger.info(f"Sarvam TTS response: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                audios = result.get("audios", [])
                if audios:
                    logger.info("TTS success")
                    return {"success": True, "audio": audios[0]}
                else:
                    logger.error(f"No audio in response: {result}")
                    return {"success": False, "audio": None, "error": "No audio returned"}
            else:
                error_text = response.text
                logger.error(f"Sarvam TTS failed {response.status_code}: {error_text}")
                return {"success": False, "audio": None, "error": error_text}
                
    except Exception as e:
        logger.error(f"TTS exception: {type(e).__name__}: {e}", exc_info=True)
        return {"success": False, "audio": None, "error": str(e)}