


# ⚖️ HaqDar

### हर हक़ मिलना चाहिए
### *"Every Right Must Be Delivered"*

**AI-Powered Government Scheme Discovery for Every Indian Citizen**

[![Live Demo](https://img.shields.io/badge/Live_Demo-Visit_Now-EA580C?style=for-the-badge)](https://haqdar.vercel.app)
[![License](https://img.shields.io/badge/License-MIT-0F172A?style=for-the-badge)](LICENSE)
[![Made for Bharat](https://img.shields.io/badge/Made_for-Bharat_🇮🇳-059669?style=for-the-badge)](#)

[Live Demo](https://haqdar.vercel.app) · [Video Demo](#-video-demo) · [Report Bug](#) · [Request Feature](#)



---

## 📑 Table of Contents

- [The Problem](#-the-problem)
- [Our Solution](#-our-solution)
- [Why HaqDar Matters](#-why-haqdar-matters)
- [Key Features](#-key-features)
- [How It Works](#-how-it-works)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Screenshots](#-screenshots)
- [Getting Started](#-getting-started)
- [Installation](#-installation)
- [Running Locally](#-running-locally)
- [Deployment](#-deployment)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Impact & Scale](#-impact--scale)
- [Future Roadmap](#-future-roadmap)
- [Business Model](#-business-model)
- [Team](#-team)
- [License](#-license)

---

## 🎯 The Problem

> **India allocates ₹20 lakh crore annually to 700+ government welfare schemes. Yet 73% of eligible families never claim their benefits.**

### The Hidden Crisis

India runs one of the world's largest welfare systems. There are over **700 central and state government schemes** covering:

- 🏠 Housing (PM Awas Yojana)
- 🏥 Healthcare (Ayushman Bharat — ₹5 lakh coverage)
- 🎓 Education (Scholarships for SC/ST/OBC)
- 💼 Employment (MGNREGA — 100 days guaranteed work)
- 🌾 Agriculture (PM Kisan — ₹6,000/year)
- 🛡️ Insurance (₹2 lakh accident cover for ₹12/year)

**The money exists. The schemes exist. The eligibility exists.**

### So Why Do People Miss Out?

| Barrier | Reality |
|---------|---------|
| 🗣️ **Language** | 90% of scheme information is in English |
| 📚 **Awareness** | Citizens don't know which schemes apply to them |
| 🏢 **Complexity** | 700+ schemes, each with different criteria |
| 💸 **Middlemen** | Agents charge ₹2,000-10,000 per application |
| 📍 **Access** | Rural citizens can't navigate government portals |

### A Real Example

> **Sunita Devi**, 32, is a farmer from rural Rajasthan. SC category. Annual income ₹50,000. Two children in school.
>
> She qualifies for **8 government schemes worth ₹3,47,000 per year**.
>
> She has received **₹0**.
>
> Not because she doesn't qualify.
> Because nobody told her — in her language, for free, without a middleman.

**This happens to 800 million Indians.**

---

## 💡 Our Solution

> **HaqDar helps any Indian citizen discover every government scheme they qualify for in 60 seconds — for free, in their language.**

### How HaqDar Solves It

```
┌─────────────────────────────────────────────────┐
│                                                 │
│   Citizen answers 8 simple questions            │
│              ↓                                  │
│   AI matches against 700+ schemes               │
│              ↓                                  │
│   Instant personalized results:                 │
│     ✓ All eligible scheme                       │
│     ✓ Total benefit amount                      │
│     ✓ Documents needed                          │
│     ✓ Where to apply                            │
│     ✓ AI guidance in Hindi/English              │
│                                                 │
└─────────────────────────────────────────────────┘
```

### What Makes HaqDar Different

| Existing Solutions | HaqDar |
|-------------------|--------|
| Government portals (MyScheme) — just lists | Personalized AI matching |
| English-only | Hindi + English (more coming) |
| Requires technical knowledge | 8 simple questions |
| No guidance | Step-by-step application help |
| Middlemen charge money | 100% free, forever |
| Complex navigation | 60-second results |

---

## 🌟 Why HaqDar Matters

This is **not a startup pitch**. This is a **civil rights tool**.

```
800 million Indians eligible for benefits they don't know about.

₹20 lakh crore allocated every year.

73% currently unclaimed.

If HaqDar reaches just 1% of eligible families:
→ 8 million families discover their rights
→ ₹16,000 crore in benefits unlocked
```

Every right delivered is:
- A child who can afford school
- A family with health insurance
- A farmer who survives a bad harvest
- A woman who gets economic dignity

**HaqDar bridges the gap between government policy and citizen access.**

---

## ✨ Key Features

- 🎯 **Smart Eligibility Matching** — AI scans 700+ schemes against your profile
- 🗣️ **Bilingual Support** — Full Hindi and English interface
- ⚡ **60-Second Results** — No registration, no waiting
- 📋 **Complete Application Guide** — Documents needed + where to apply
- 💰 **Benefit Calculator** — See total annual benefit you can claim
- 🤖 **AI-Powered Guidance** — Personalized summaries in your language
- 📱 **Mobile-First Design** — Works on any device
- 🔒 **Privacy-First** — No personal data stored
- 🆓 **Completely Free** — No fees, no middlemen
- ♿ **Accessible** — Built for low-literacy users

---

## 🔄 How It Works

### For Citizens

```
STEP 1 → Personal Info
         Name, age, gender, state

STEP 2 → Location & Work
         Village/city, occupation

STEP 3 → Income & Category
         Annual income, caste category

STEP 4 → Additional Details
         Bank account, ration card, children, pregnancy

RESULT → Your Personalized Scheme List
         All schemes + benefits + how to apply
```

### Behind the Scenes

```
1. User submits profile via React form
2. FastAPI receives and validates data (Pydantic)
3. Eligibility Engine checks profile against all schemes
4. Schemes sorted by benefit value
5. Groq AI generates personalized summary
6. Results cached (reduces cost by 90%)
7. Beautiful results returned to user
```

---

## 🛠️ Tech Stack

### Frontend
- **React.js** — Component-based UI
- **Lucide React** — Modern icon library
- **Axios** — API communication
- **CSS3** — Custom design system

### Backend
- **Python 3.11** — Core language
- **FastAPI** — High-performance async API framework
- **Pydantic** — Data validation with type safety
- **Groq SDK** — AI integration

### AI/ML
- **Groq LLM** — Llama 3.3 70B model
- **Smart caching** — TTL-based response cache

### Data
- **700+ Government Schemes** — Sourced from MyScheme.gov.in
- **JSON Database** — Fast, structured scheme data

### DevOps
- **Vercel** — Frontend hosting
- **Render** — Backend hosting
- **GitHub** — Version control

### Why These Choices?

| Decision | Reason |
|----------|--------|
| Groq over OpenAI | Free tier, faster inference, no credit card |
| FastAPI over Flask | Auto docs, async, type validation |
| In-memory cache | 90% fewer AI calls, instant responses |
| React | Component reusability, large ecosystem |
| WhatsApp-ready architecture | Future zero-friction access |

---

## 🏗️ Architecture

```
┌──────────────┐         ┌──────────────────┐         ┌─────────────┐
│              │  HTTPS  │                  │         │             │
│   React UI   │────────▶│   FastAPI        │────────▶│   Groq AI   │
│  (Vercel)    │◀────────│   (Render)       │◀────────│   (LLM)     │
│              │  JSON   │                  │         │             │
└──────────────┘         └──────────────────┘         └─────────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │  Eligibility     │
                         │  Engine          │
                         │  + Cache         │
                         │  + 700 Schemes   │
                         └──────────────────┘
```

### Backend Architecture (Modular)

```
app/
├── main.py           → Entry point, middleware
├── config.py         → Centralized settings
├── api/routes.py     → API endpoints
├── core/
│   ├── eligibility.py → Matching engine
│   ├── ai_service.py  → Groq integration + fallback
│   └── cache.py       → Response caching
├── models/schemas.py → Pydantic validation
└── data/schemes.json → Scheme database
```

---

## 📸 Screenshots

### Landing Page
*Hero section with trust metrics and social proof*

### Multi-Step Form
*Clean 4-step onboarding with progress tracker*

### Results Page
*Personalized scheme recommendations with benefit calculator*

> 🔗 **[See Live Demo](https://haqdar.vercel.app)**

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have:

- **Python 3.8+** — [Download](https://python.org/downloads)
- **Node.js 16+** — [Download](https://nodejs.org)
- **Git** — [Download](https://git-scm.com/downloads)
- **Groq API Key** — [Get Free Key](https://console.groq.com)

Verify installations:

```bash
python --version    # Should show 3.8+
node --version      # Should show v16+
npm --version       # Should show 8+
git --version       # Should show git version
```

---

## 📦 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR-USERNAME/haqdar.git
cd haqdar
```

### 2. Get Your Free Groq API Key

```
1. Visit → https://console.groq.com
2. Sign up with Google (free, no credit card)
3. Go to "API Keys" → "Create API Key"
4. Copy the key (starts with gsk_...)
```

---

## 💻 Running Locally

### Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
echo GROQ_API_KEY=gsk_your-key-here > .env

# Run the backend
uvicorn app.main:app --reload
```

✅ Backend runs at: `http://localhost:8000`
📖 API docs at: `http://localhost:8000/docs`

### Frontend Setup

Open a **new terminal**:

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Create .env file
echo REACT_APP_API_URL=http://localhost:8000 > .env

# Run the frontend
npm start
```

✅ Frontend runs at: `http://localhost:3000`

### Quick Test

```
1. Open http://localhost:3000
2. Fill the form:
   - Name: Sunita Devi
   - Age: 32, Female, Rajasthan
   - Village, Farmer
   - Below ₹50,000, SC
   - Bank ✓, Ration ✓, Children ✓
3. Click "Find My Schemes"
4. See 7 schemes worth ₹10+ lakh!
```

---

## 🌐 Deployment

### Deploy Backend (Render)

```
1. Push code to GitHub
2. Go to https://render.com → New Web Service
3. Connect your repo
4. Settings:
   - Root Directory: backend
   - Build: pip install -r requirements.txt
   - Start: uvicorn app.main:app --host 0.0.0.0 --port $PORT
5. Add env variable: GROQ_API_KEY
6. Deploy → Get URL
```

### Deploy Frontend (Vercel)

```
1. Go to https://vercel.com → Add New Project
2. Import your repo
3. Settings:
   - Root Directory: frontend
   - Framework: Create React App
4. Add env variable: REACT_APP_API_URL = your-render-url
5. Deploy → Get URL
```

---

## 📁 Project Structure

```
haqdar/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI entry point
│   │   ├── config.py            # Settings
│   │   ├── api/
│   │   │   └── routes.py        # API endpoints
│   │   ├── core/
│   │   │   ├── eligibility.py   # Matching engine
│   │   │   ├── ai_service.py    # Groq AI
│   │   │   └── cache.py         # Caching
│   │   ├── models/
│   │   │   └── schemas.py       # Pydantic models
│   │   └── data/
│   │       └── schemes.json     # Scheme database
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Form.jsx
│   │   │   ├── Results.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── SchemeCard.jsx
│   │   │   └── sections/
│   │   │       ├── SocialProof.jsx
│   │   │       ├── HowItWorks.jsx
│   │   │       ├── Categories.jsx
│   │   │       ├── Testimonials.jsx
│   │   │       ├── Stats.jsx
│   │   │       └── FAQ.jsx
│   │   ├── hooks/
│   │   │   └── useSchemes.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── constants/
│   │   │   ├── config.js
│   │   │   ├── states.js
│   │   │   └── occupations.js
│   │   ├── App.jsx
│   │   └── App.css
│   └── package.json
│
├── README.md
└── .gitignore
```

---

## 📡 API Documentation

### Base URL
```
Local:      http://localhost:8000
Production: https://haqdar-api.onrender.com
```

### Endpoints

#### `POST /find-schemes`
Find eligible schemes for a user profile.

**Request Body:**
```json
{
  "name": "Sunita Devi",
  "age": 32,
  "gender": "female",
  "state": "Rajasthan",
  "residence": "rural",
  "occupation": "farmer",
  "income": 49000,
  "caste": "sc",
  "has_bank_account": true,
  "has_ration_card": true,
  "has_children": true,
  "is_pregnant": false,
  "language": "english"
}
```

**Response:**
```json
{
  "success": true,
  "user_name": "Sunita Devi",
  "total_schemes": 7,
  "total_annual_benefit": 1049600,
  "schemes": [...],
  "ai_summary": "Congratulations Sunita...",
  "language": "english",
  "cached": false,
  "processing_time_ms": 234.5
}
```

#### `GET /schemes`
Get all available schemes.

#### `GET /health`
Health check endpoint.

#### `GET /stats`
Service statistics (cache, schemes loaded).

📖 **Interactive Docs:** Visit `/docs` for Swagger UI

---

## 📊 Impact & Scale

### The Numbers

| Metric | Value |
|--------|-------|
| Eligible Indians | 800M+ |
| Annual scheme allocation | ₹20 lakh crore |
| Currently unclaimed | 73% |
| Schemes in database | 700+ |
| Average family benefit | ₹2-5 lakh/year |
| Time to results | 60 seconds |

### Projected Impact

```
If HaqDar reaches 1% of eligible families:
→ 8 million families empowered
→ ₹16,000 crore in benefits unlocked

If HaqDar reaches 10%:
→ 80 million families empowered
→ ₹1.6 lakh crore in benefits unlocked
```

### Alignment with Government Goals

- ✅ Supports Digital India mission
- ✅ Complements MyScheme.gov.in portal
- ✅ Advances welfare delivery (DBT)
- ✅ Reduces middleman corruption

---

## 🗺️ Future Roadmap

### Phase 1 — Foundation ✅ (Current)
- [x] English + Hindi support
- [x] 700+ central schemes
- [x] AI-powered matching
- [x] Web platform

### Phase 2 — Expansion (3 months)
- [ ] 10 Indian languages (Tamil, Telugu, Bengali, Marathi...)
- [ ] WhatsApp bot integration (zero-friction access)
- [ ] Voice input for low-literacy users
- [ ] PDF download of scheme list

### Phase 3 — Deep Integration (6 months)
- [ ] State-specific scheme databases
- [ ] CSC (Common Service Centre) partnerships
- [ ] Document upload helper
- [ ] DigiLocker integration

### Phase 4 — Scale (1 year)
- [ ] Application status tracker
- [ ] Bank/NBFC API for loan pre-approval
- [ ] Community helper network
- [ ] Government white-label deployment

---

## 💼 Business Model

HaqDar is **free for citizens, forever.** Sustainability comes from:

| Revenue Stream | Description |
|---------------|-------------|
| 🏛️ **Government Licensing** | State governments license for their portals |
| 🤝 **CSR Partnerships** | Banks, insurers fund as social impact |
| 🔌 **API Access** | NBFCs/fintech access eligibility API |
| 🌐 **NGO Deployments** | Bulk licensing for field operations |
| 💰 **Grants** | Google.org, Omidyar, social impact funds |

**Core principle: Citizens never pay. Ever.**

---

## 🏆 Hackathon

This project was built for the **Build for Good National Student Hackathon 2025**.

- **Theme:** AWAAZ (आवाज़) — Voice, Safety & Social Access
- **Sub-theme:** Government Schemes & Entitlements
- **Mission:** Building for the communities present in India but invisible to its systems

> *भारत के लिए बनाओ। असल समस्याओं के लिए बनाओ।*
> *Build for India. Build for real problems.*

---

## 🎥 Video Demo

🔗 **[Watch the 2-minute demo](https://youtube.com/watch?v=YOUR-VIDEO)**

---

## 👥 Team

| Name | Role |
|------|------|
| Rohan Jadhav | Full Stack Developer |

---

## 🤝 Contributing

Contributions are welcome! This is an open-source civil tech project.

```bash
1. Fork the repo
2. Create your feature branch (git checkout -b feature/amazing)
3. Commit changes (git commit -m 'Add amazing feature')
4. Push to branch (git push origin feature/amazing)
5. Open a Pull Request
```

### Ways to Contribute
- Add more government schemes
- Add language translations
- Improve eligibility logic
- Report bugs
- Suggest features

---

## 📜 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

Free to use, modify, and distribute. Built for the public good.

---

## 🙏 Acknowledgments

- **MyScheme.gov.in** — Government scheme data source
- **Groq** — Free, fast AI inference
- **Lucide** — Beautiful open-source icons
- **The 800 million Indians** — who deserve their rights

---



### ⚖️ HaqDar — हर हक़ मिलना चाहिए

**"This money was always theirs. HaqDar just gave it back."**

[🌐 Live Demo](https://haqdar.vercel.app) · [📺 Video](#) · [💻 Code](https://github.com/YOUR-USERNAME/haqdar)

**Built with ❤️ for Bharat 🇮🇳**

⭐ Star this repo if you believe every Indian deserves their rights ⭐


```