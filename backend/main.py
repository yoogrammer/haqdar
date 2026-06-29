# backend/main.py

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import os
from dotenv import load_dotenv
from groq import Groq

# Load environment variables
load_dotenv()

# Setup Groq client (FREE alternative to OpenAI)
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# Create FastAPI app
app = FastAPI(title="HaqDar API", version="1.0.0")

# Allow React frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─────────────────────────────────────────
# DATA MODELS
# ─────────────────────────────────────────

class UserProfile(BaseModel):
    name: str
    age: int
    gender: str
    state: str
    residence: str
    occupation: str
    income: int
    caste: str
    has_bank_account: bool
    has_ration_card: bool
    has_children: bool
    is_pregnant: Optional[bool] = False
    language: Optional[str] = "english"

# ─────────────────────────────────────────
# ROUTES
# ─────────────────────────────────────────

@app.get("/")
def home():
    return {
        "message": "HaqDar API is running!",
        "tagline": "हर हक़ मिलना चाहिए"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.post("/find-schemes")
async def find_schemes(user: UserProfile):
    try:
        # Step 1 — Rule based eligibility check
        from eligibility import check_eligibility
        user_dict = user.dict()
        eligible_schemes = check_eligibility(user_dict)

        if not eligible_schemes:
            return {
                "success": True,
                "user_name": user.name,
                "total_schemes": 0,
                "total_annual_benefit": 0,
                "schemes": [],
                "ai_summary": "Based on your profile, please visit your nearest Common Service Centre (CSC) for personalized help.",
            }

        # Step 2 — Calculate total benefit
        total_benefit = sum(
            s.get('annual_benefit_value', 0)
            for s in eligible_schemes
        )

        # Step 3 — Generate AI summary using Groq (FREE)
        scheme_names = [s['name'] for s in eligible_schemes]

        prompt = f"""
You are a helpful government scheme advisor in India.

User Profile:
- Name: {user.name}
- Age: {user.age}, Gender: {user.gender}
- State: {user.state}, Residence: {user.residence}
- Occupation: {user.occupation}
- Annual Income: Rs.{user.income}
- Caste Category: {user.caste}

They are eligible for these {len(eligible_schemes)} government schemes:
{', '.join(scheme_names)}

Total potential annual benefit: Rs.{total_benefit}

Write a warm, encouraging 3-sentence summary in {'Hindi' if user.language == 'hindi' else 'simple English'}.
Tell them how many schemes they qualify for, the total benefit amount, and encourage them to apply immediately.
Keep it very simple, warm and motivating.
Do not use complex words.
"""

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": "You are a helpful government scheme advisor who helps poor families in India understand their rights and benefits."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            max_tokens=200,
            temperature=0.7
        )

        ai_summary = response.choices[0].message.content

        # Step 4 — Return everything
        return {
            "success": True,
            "user_name": user.name,
            "total_schemes": len(eligible_schemes),
            "total_annual_benefit": total_benefit,
            "schemes": eligible_schemes,
            "ai_summary": ai_summary,
            "language": user.language
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error: {str(e)}"
        )


@app.get("/schemes/all")
def get_all_schemes():
    from eligibility import load_schemes
    schemes = load_schemes()
    return {
        "total": len(schemes),
        "schemes": schemes
    }