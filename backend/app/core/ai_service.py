# app/core/ai_service.py
from groq import Groq, APIError
from typing import List, Dict
from app.config import settings
from app.utils.logger import logger


class AIService:
    """Robust AI service with fallbacks and error handling"""
    
    def __init__(self):
        self.client = Groq(api_key=settings.GROQ_API_KEY)
        self.model = settings.GROQ_MODEL
        logger.info(f"AI service initialized with model: {self.model}")
    
    def generate_summary(
        self,
        user_name: str,
        user_profile: Dict,
        schemes: List[Dict],
        total_benefit: int,
        language: str = "english"
    ) -> str:
        """Generate personalized AI summary with fallback"""
        
        if not schemes:
            return self._no_schemes_message(language)
        
        try:
            return self._call_ai(user_name, user_profile, schemes, total_benefit, language)
        except APIError as e:
            logger.error(f"AI API error: {e}")
            return self._fallback_message(user_name, len(schemes), total_benefit, language)
        except Exception as e:
            logger.error(f"Unexpected AI error: {e}")
            return self._fallback_message(user_name, len(schemes), total_benefit, language)
    
    def _call_ai(
        self,
        user_name: str,
        profile: Dict,
        schemes: List[Dict],
        total_benefit: int,
        language: str
    ) -> str:
        """Make actual API call to Groq"""
        scheme_names = ', '.join([s['name'] for s in schemes[:5]])
        
        if language == "hindi":
            lang_instruction = "Write in simple Hindi (हिंदी) using Devanagari script."
        elif language == "tamil":
            lang_instruction = "Write in simple Tamil (தமிழ்) using Tamil script."
        else:
            lang_instruction = "Write in simple, warm English."
        
        prompt = f"""You are a compassionate government scheme advisor in India.

User: {user_name}, {profile.get('age')} years old, {profile.get('occupation')} from {profile.get('state')}.

They qualify for {len(schemes)} schemes including: {scheme_names}
Total annual benefit: Rs.{total_benefit:,}

{lang_instruction}
Write exactly 3 sentences:
1. Celebrate how many schemes they qualify for
2. Mention the total benefit amount
3. Encourage them to apply at the nearest Common Service Centre (CSC)

Keep it warm, simple, and motivating. No technical jargon."""

        response = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {
                    "role": "system",
                    "content": "You are a warm, helpful advisor who empowers Indian families to access their government benefits."
                },
                {"role": "user", "content": prompt}
            ],
            max_tokens=settings.AI_MAX_TOKENS,
            temperature=settings.AI_TEMPERATURE,
            timeout=settings.AI_TIMEOUT
        )
        
        return response.choices[0].message.content.strip()
    
    @staticmethod
    def _fallback_message(name: str, count: int, benefit: int, language: str) -> str:
        """Fallback message when AI fails"""
        if language == "hindi":
            return (
                f"{name} जी, बधाई हो! आप {count} सरकारी योजनाओं के हकदार हैं "
                f"जिनसे आपको सालाना ₹{benefit:,} तक का लाभ मिल सकता है। "
                f"कृपया अभी अपने नजदीकी जन सेवा केंद्र (CSC) में जाकर आवेदन करें।"
            )
        elif language == "tamil":
            return (
                f"{name} அவர்களே, வாழ்த்துக்கள்! நீங்கள் {count} அரசு திட்டங்களுக்கு "
                f"தகுதியானவர். ஆண்டுக்கு ₹{benefit:,} வரை நன்மை பெறலாம். "
                f"தயவுசெய்து உங்கள் அருகிலுள்ள பொது சேவை மையத்தில் விண்ணப்பியுங்கள்."
            )
        return (
            f"Congratulations {name}! You qualify for {count} government schemes "
            f"worth ₹{benefit:,} annually. Please visit your nearest Common Service "
            f"Centre (CSC) to apply for them. This benefit is your legal right!"
        )
    
    @staticmethod
    def _no_schemes_message(language: str) -> str:
        if language == "hindi":
            return (
                "आपकी प्रोफ़ाइल के आधार पर कोई सीधी योजना नहीं मिली। "
                "कृपया व्यक्तिगत मार्गदर्शन के लिए अपने नजदीकी जन सेवा केंद्र में जाएँ।"
            )
        elif language == "tamil":
            return (
                "உங்கள் சுயவிவரத்தின் அடிப்படையில் நேரடி திட்டங்கள் எதுவும் காணப்படவில்லை. "
                "தனிப்பட்ட வழிகாட்டுதலுக்கு உங்கள் அருகிலுள்ள பொது சேவை மையத்தைப் பார்வையிடவும்."
            )
        return (
            "No direct schemes matched your profile. Please visit your nearest "
            "Common Service Centre (CSC) for personalized guidance."
        )


ai_service = AIService()