# PART 1: SYSTEM ARCHITECTURE
## 1.1 High-Level Architecture Diagram
| ` | ext |
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              BAAGUPADU — SYSTEM ARCHITECTURE                        │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│  ┌─────────────────────────────────────────────────────────────────────────────┐    │
│  │                           USER (Browser)                                    │    │
│  └─────────────────────────────────────────────────────────────────────────────┘    │
│                                      │                                              │
│                                      ▼                                              │
│  ┌─────────────────────────────────────────────────────────────────────────────┐    │
│  │                      AWS CLOUDFRONT (Global CDN)                            │    │
│  └─────────────────────────────────────────────────────────────────────────────┘    │
│                                      │                                              │
│                                      ▼                                              │
│  ┌─────────────────────────────────────────────────────────────────────────────┐    │
│  │                           AWS S3 (Static Hosting)                           │    │
│  │  ┌─────────────────────────────────────────────────────────────────────┐    │    │
│  │  │  Next.js Static Assets (HTML, CSS, JS, Images)                      │    │    │
│  │  └─────────────────────────────────────────────────────────────────────┘    │    │
│  └─────────────────────────────────────────────────────────────────────────────┘    │
│                                      │                                              │
│                                      ▼                                              │
│  ┌─────────────────────────────────────────────────────────────────────────────┐    │
│  │                      AWS API GATEWAY + WAF                                  │    │
│  │  ├── Authentication (Cognito JWT)                                          │    │
│  │  ├── Rate Limiting (100 RPS)                                               │    │
│  │  └── Request Routing                                                       │    │
│  └─────────────────────────────────────────────────────────────────────────────┘    │
│                                      │                                              │
│                                      ▼                                              │
│  ┌─────────────────────────────────────────────────────────────────────────────┐    │
│  │                    AWS ECS FARGATE (Container Orchestration)                 │    │
│  │  ┌─────────────────────────────────────────────────────────────────────┐    │    │
│  │  │  ┌─────────────────────────────────────────────────────────────┐    │    │    │
│  │  │  │                 FASTAPI SERVICE (Python 3.11+)              │    │    │    │
│  │  │  │  ┌─────────────────────────────────────────────────────────┐│    │    │    │
│  │  │  │  │  API Endpoints:                                         ││    │    │    │
│  │  │  │  │  ├── /auth/*       → Authentication                     ││    │    │    │
│  │  │  │  │  ├── /chat/*       → Conversation Management            ││    │    │    │
│  │  │  │  │  ├── /persona/*    → Persona Building                   ││    │    │    │
│  │  │  │  │  ├── /guidance/*   → Career Guidance                    ││    │    │    │
│  │  │  │  │  └── /user/*       → User Profile Management            ││    │    │    │
│  │  │  │  └─────────────────────────────────────────────────────────┘│    │    │    │
│  │  │  └─────────────────────────────────────────────────────────────┘    │    │    │
│  │  └─────────────────────────────────────────────────────────────────────┘    │    │
│  └─────────────────────────────────────────────────────────────────────────────┘    │
│                                      │                                              │
│                                      ▼                                              │
│  ┌─────────────────────────────────────────────────────────────────────────────┐    │
│  │                    AI SERVICE LAYER (LangGraph + CrewAI)                    │    │
│  │  ┌─────────────────────────────────────────────────────────────────────┐    │    │
│  │  │  ┌─────────────────────────────────────────────────────────────┐    │    │    │
│  │  │  │  SUPER AGENT (Orchestrator)                                 │    │    │    │
│  │  │  │  ├── Routes requests to appropriate sub-agents              │    │    │    │
│  │  │  │  └── Manages state transitions between phases               │    │    │    │
│  │  │  └─────────────────────────────────────────────────────────────┘    │    │    │
│  │  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐    │    │    │
│  │  │  │   Agent 1   │ │   Agent 2   │ │   Agent 3   │ │   Agent 4   │    │    │    │
│  │  │  │   Trust     │ │  Childhood  │ │   Teenage   │ │   Adult     │    │    │    │
│  │  │  │   Building  │ │ Exploration │ │ Exploration │ │ Exploration │    │    │    │
│  │  │  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘    │    │    │
│  │  │  ┌─────────────┐ ┌─────────────┐                                    │    │    │
│  │  │  │   Agent 5   │ │   Agent 6   │                                    │    │    │
│  │  │  │  Synthesis  │ │  Guidance   │                                    │    │    │
│  │  │  │             │ │  Delivery   │                                    │    │    │
│  │  │  └─────────────┘ └─────────────┘                                    │    │    │
│  │  └─────────────────────────────────────────────────────────────────────┘    │    │
│  └─────────────────────────────────────────────────────────────────────────────┘    │
│                                      │                                              │
│                                      ▼                                              │
│  ┌─────────────────────────────────────────────────────────────────────────────┐    │
│  │                         GEMINI API (Gemini 2.5 Flash-Lite)                  │    │
│  │  └── LLM Inference for conversation, persona building, and guidance        │    │
│  └─────────────────────────────────────────────────────────────────────────────┘    │
│                                      │                                              │
│                                      ▼                                              │
│  ┌─────────────────────────────────────────────────────────────────────────────┐    │
│  │                           DATA LAYER                                        │    │
│  │  ┌─────────────────────────────────────────────────────────────────────┐    │    │
│  │  │              AWS RDS PostgreSQL 15+ + pgvector                      │    │    │
│  │  │  ┌─────────────────────────────────────────────────────────────┐    │    │    │
│  │  │  │  Tables:                                                     │    │    │    │
│  │  │  │  ├── users           → User profiles and authentication     │    │    │    │
│  │  │  │  ├── conversations   → Chat history with phases             │    │    │    │
│  │  │  │  ├── messages        → Individual messages                  │    │    │    │
│  │  │  │  ├── personas        → Synthesized persona data             │    │    │    │
│  │  │  │  ├── traits          → Identified traits                    │    │    │    │
│  │  │  │  └── embeddings      → Vector embeddings (pgvector)         │    │    │    │
│  │  │  └─────────────────────────────────────────────────────────────┘    │    │    │
│  │  └─────────────────────────────────────────────────────────────────────┘    │    │
│  │  ┌─────────────────────────────────────────────────────────────────────┐    │    │
│  │  │              AWS ELASTICACHE REDIS 7+                              │    │    │
│  │  │  ├── Session Cache                                                  │    │    │
│  │  │  ├── Rate Limiting                                                  │    │    │
│  │  │  └── Pub/Sub Queue (Celery)                                        │    │    │
│  │  └─────────────────────────────────────────────────────────────────────┘    │    │
│  └─────────────────────────────────────────────────────────────────────────────┘    │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
`
## 1.2 Component Breakdown
| Layer | Component | Technology | Purpose |
| --- | --- | --- | --- |
| Presentation | Frontend | React + Next.js 14/15 | User interface, chat interactions |
| Delivery | CDN + Hosting | AWS CloudFront + S3 | Global content delivery |
| API Gateway | Routing + Auth | AWS API Gateway + WAF | Request routing, auth, rate limiting |
| Backend | Core API | FastAPI (Python 3.11+) | Business logic, API endpoints |
| AI Orchestration | Multi-Agent System | LangGraph + CrewAI | 6-phase conversation orchestration |
| LLM | AI Inference | Gemini 2.5 Flash-Lite | Conversational AI |
| Database | Primary + Vector | PostgreSQL 15+ + pgvector | User data, embeddings, personas |
| Cache | Session + Queue | Redis 7+ (ElastiCache) | Caching, pub/sub |
| Auth | Identity | AWS Cognito | User authentication and management |
| Infrastructure | IaC | AWS CDK (TypeScript) | Infrastructure as Code |
| CI/CD | Deployment | GitHub Actions | Automated deployment |
# PART 2: USER FLOW DIAGRAM
## 2.1 Complete User Journey
| ` | ext |
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              BAAGUPADU — USER JOURNEY                               │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│  ┌─────────────────────────────────────────────────────────────────────────────┐    │
│  │                      1. LANDING PAGE                                        │    │
│  │  ┌─────────────────────────────────────────────────────────────────────┐    │    │
│  │  │  User visits Baagupadu.com                                          │    │    │
│  │  │  ├── Sees hero section with Sahayam avatar                        │    │    │
│  │  │  ├── Reads tagline: "Discover Who You Truly Are"                  │    │    │
│  │  │  └── Clicks "Start My Journey" → Redirects to /chat              │    │    │
│  │  └─────────────────────────────────────────────────────────────────────┘    │    │
│  └─────────────────────────────────────────────────────────────────────────────┘    │
│                                      │                                              │
│                                      ▼                                              │
│  ┌─────────────────────────────────────────────────────────────────────────────┐    │
│  │                      2. AUTHENTICATION                                     │    │
│  │  ┌─────────────────────────────────────────────────────────────────────┐    │    │
│  │  │  User signs up / logs in (AWS Cognito)                             │    │    │
│  │  │  ├── Email + Password                                               │    │    │
│  │  │  ├── Social Login (Google, LinkedIn) — Optional                    │    │    │
│  │  │  └── User profile created in database                              │    │    │
│  │  └─────────────────────────────────────────────────────────────────────┘    │    │
│  └─────────────────────────────────────────────────────────────────────────────┘    │
│                                      │                                              │
│                                      ▼                                              │
│  ┌─────────────────────────────────────────────────────────────────────────────┐    │
│  │                   3. PHASE 1: TRUST BUILDING                                │    │
│  │  ┌─────────────────────────────────────────────────────────────────────┐    │    │
│  │  │  Sahayam introduces itself and builds rapport                       │    │    │
│  │  │  ├── Warm welcome: "Hi! I'm Sahayam..."                            │    │    │
│  │  │  ├── Sets expectations: "No right or wrong way..."                 │    │    │
│  │  │  ├── Asks: "What made you curious about this conversation?"        │    │    │
│  │  │  └── Understands user motivation                                   │    │    │
│  │  └─────────────────────────────────────────────────────────────────────┘    │    │
│  └─────────────────────────────────────────────────────────────────────────────┘    │
│                                      │                                              │
│                                      ▼                                              │
│  ┌─────────────────────────────────────────────────────────────────────────────┐    │
│  │                   4. PHASE 2: CHILDHOOD EXPLORATION                         │    │
│  │  ┌─────────────────────────────────────────────────────────────────────┐    │    │
│  │  │  Sahayam explores ages 0-12                                         │    │    │
│  │  │  ├── Family Environment (3-4 questions)                            │    │    │
│  │  │  ├── Learning & Curiosity (2-3 questions)                          │    │    │
│  │  │  ├── Play & Imagination (2-3 questions)                            │    │    │
│  │  │  ├── Social Dynamics (2-3 questions)                               │    │    │
│  │  │  ├── Emotional Development (2-3 questions)                         │    │    │
│  │  │  ├── Discipline & Boundaries (1-2 questions)                       │    │    │
│  │  │  ├── Confidence & Self-Identity (2-3 questions)                    │    │    │
│  │  │  └── Root-Cause Discovery (1-2 questions)                          │    │    │
│  │  └─────────────────────────────────────────────────────────────────────┘    │    │
│  └─────────────────────────────────────────────────────────────────────────────┘    │
│                                      │                                              │
│                                      ▼                                              │
│  ┌─────────────────────────────────────────────────────────────────────────────┐    │
│  │                   5. PHASE 3: TEENAGE EXPLORATION                           │    │
│  │  ┌─────────────────────────────────────────────────────────────────────┐    │    │
│  │  │  Sahayam explores ages 13-19                                        │    │    │
│  │  │  ├── Identity Formation (3-4 questions)                            │    │    │
│  │  │  ├── Social Dynamics (3-4 questions)                               │    │    │
│  │  │  ├── Academic/Career Aspirations (2-3 questions)                   │    │    │
│  │  │  ├── Family Relationships (2-3 questions)                          │    │    │
│  │  │  ├── Emotional Development (2-3 questions)                         │    │    │
│  │  │  └── Values & Morality (1-2 questions)                             │    │    │
│  │  └─────────────────────────────────────────────────────────────────────┘    │    │
│  └─────────────────────────────────────────────────────────────────────────────┘    │
│                                      │                                              │
│                                      ▼                                              │
│  ┌─────────────────────────────────────────────────────────────────────────────┐    │
│  │                   6. PHASE 4: ADULT EXPLORATION                             │    │
│  │  ┌─────────────────────────────────────────────────────────────────────┐    │    │
│  │  │  Sahayam explores ages 20-30                                        │    │    │
│  │  │  ├── Career & Purpose (3-4 questions)                               │    │    │
│  │  │  ├── Skills & Strengths (2-3 questions)                             │    │    │
│  │  │  ├── Current Challenges (2-3 questions)                             │    │    │
│  │  │  └── Vision & Future (2-3 questions)                                │    │    │
│  │  └─────────────────────────────────────────────────────────────────────┘    │    │
│  └─────────────────────────────────────────────────────────────────────────────┘    │
│                                      │                                              │
│                                      ▼                                              │
│  ┌─────────────────────────────────────────────────────────────────────────────┐    │
│  │                   7. PHASE 5: SYNTHESIS & INSIGHTS                          │    │
│  │  ┌─────────────────────────────────────────────────────────────────────┐    │    │
│  │  │  Sahayam synthesizes all data and shares insights                   │    │    │
│  │  │  ├── Identifies patterns across life stages                        │    │    │
│  │  │  ├── Builds comprehensive persona (Core Identity, Strengths, etc.) │    │    │
│  │  │  └── Presents persona to user for validation                       │    │    │
│  │  └─────────────────────────────────────────────────────────────────────┘    │    │
│  └─────────────────────────────────────────────────────────────────────────────┘    │
│                                      │                                              │
│                                      ▼                                              │
│  ┌─────────────────────────────────────────────────────────────────────────────┐    │
│  │                   8. PHASE 6: GUIDANCE DELIVERY                             │    │
│  │  ┌─────────────────────────────────────────────────────────────────────┐    │    │
│  │  │  Sahayam provides personalized career guidance                      │    │    │
│  │  │  ├── Career Affinities (2-3 aligned directions)                    │    │    │
│  │  │  ├── Skill Gaps & Recommendations (2-3 areas)                      │    │    │
│  │  │  ├── Action Steps (3-5 actionable steps)                           │    │    │
│  │  │  └── Visual Roadmap (Interactive visualization)                    │    │    │
│  │  └─────────────────────────────────────────────────────────────────────┘    │    │
│  └─────────────────────────────────────────────────────────────────────────────┘    │
│                                      │                                              │
│                                      ▼                                              │
│  ┌─────────────────────────────────────────────────────────────────────────────┐    │
│  │                   9. PERSONA & ROADMAP VISUALIZATION                        │    │
│  │  ┌─────────────────────────────────────────────────────────────────────┐    │    │
│  │  │  User sees their complete profile                                   │    │    │
│  │  │  ├── Persona Card: "The Curious Explorer"                          │    │    │
│  │  │  ├── Trait Radar Chart (5 dimensions)                              │    │    │
│  │  │  ├── Career Roadmap (5-step visual plan)                           │    │    │
│  │  │  └── Options: Download PDF, Share, Continue                        │    │    │
│  │  └─────────────────────────────────────────────────────────────────────┘    │    │
│  └─────────────────────────────────────────────────────────────────────────────┘    │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
`
## 2.2 Data Flow Across Phases
| ` | ext |
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              DATA FLOW ACROSS PHASES                                │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐│
│  │                                                                                 ││
│  │  PHASE 1: TRUST BUILDING                                                        ││
│  │  ├── User Input → Motivation, expectations                                     ││
│  │  └── Output → User context established                                         ││
│  │                                                                                 ││
│  │                                    │                                            ││
│  │                                    ▼                                            ││
│  │                                                                                 ││
│  │  PHASE 2: CHILDHOOD EXPLORATION                                                ││
│  │  ├── User Input → Family, learning, play, social, emotional, discipline        ││
│  │  └── Output → Childhood patterns, core emotional blueprint                    ││
│  │                                                                                 ││
│  │                                    │                                            ││
│  │                                    ▼                                            ││
│  │                                                                                 ││
│  │  PHASE 3: TEENAGE EXPLORATION                                                  ││
│  │  ├── User Input → Identity, friends, values, ambitions                        ││
│  │  └── Output → Identity patterns, values profile                               ││
│  │                                                                                 ││
│  │                                    │                                            ││
│  │                                    ▼                                            ││
│  │                                                                                 ││
│  │  PHASE 4: ADULT EXPLORATION                                                    ││
│  │  ├── User Input → Career, skills, purpose, challenges                         ││
│  │  └── Output → Ambition patterns, growth evidence                              ││
│  │                                                                                 ││
│  │                                    │                                            ││
│  │                                    ▼                                            ││
│  │                                                                                 ││
│  │  PHASE 5: SYNTHESIS & INSIGHTS                                                 ││
│  │  ├── Input → All life stage data                                              ││
│  │  ├── Processing → Pattern recognition across stages                          ││
│  │  └── Output → Comprehensive persona                                           ││
│  │                                                                                 ││
│  │                                    │                                            ││
│  │                                    ▼                                            ││
│  │                                                                                 ││
│  │  PHASE 6: GUIDANCE DELIVERY                                                    ││
│  │  ├── Input → Persona                                                          ││
│  │  ├── Processing → Career mapping, skill gap analysis                         ││
│  │  └── Output → Career affinities, action steps, visual roadmap                 ││
│  │                                                                                 ││
│  └─────────────────────────────────────────────────────────────────────────────────┘│
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
`
## 2.3 User State Transitions
| ` | ext |
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                           USER STATE TRANSITIONS                                    │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐          │
│  │   Visitor   │───▶│   New User  │───▶│ Phase 1     │───▶│ Phase 2     │          │
│  │  (Landing)  │    │  (Sign Up)  │    │  (Trust)    │    │ (Childhood) │          │
│  └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘          │
│                                                │                │                   │
│                                                ▼                ▼                   │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐          │
│  │   Phase 6   │◀───│   Phase 5   │◀───│   Phase 4   │◀───│   Phase 3   │          │
│  │  (Guidance) │    │ (Synthesis) │    │   (Adult)   │    │  (Teenage)  │          │
│  └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘          │
│        │                                                                             │
│        ▼                                                                             │
│  ┌─────────────┐                                                                     │
│  │  Completed  │                                                                     │
│  │    User     │                                                                     │
│  │  (Persona +│                                                                     │
│  │   Roadmap) │                                                                     │
│  └─────────────┘                                                                     │
│                                                                                     │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐│
│  │                              SESSION PERSISTENCE                                ││
│  │  ┌─────────────────────────────────────────────────────────────────────────────┐││
│  │  │  User can:                                                                  │││
│  │  │  ├── Resume from any phase                                                  │││
│  │  │  ├── View completed phase summaries                                        │││
│  │  │  └── Return to view persona and roadmap anytime                            │││
│  │  └─────────────────────────────────────────────────────────────────────────────┘││
│  └─────────────────────────────────────────────────────────────────────────────────┘│
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
`
## 2.4 API Request Flow
| ` | ext |
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                             API REQUEST FLOW                                        │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐          │
│  │   Client    │───▶│ API Gateway │───▶│  FastAPI    │───▶│  LangGraph  │          │
│  │  (Frontend) │    │  (Routing)  │    │  (Backend)  │    │  (Agents)   │          │
│  └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘          │
│                                                                                     │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐│
│  │  Step 1: User sends message                                                    ││
│  │  ├── Endpoint: POST /api/v1/chat/message                                       ││
│  │  └── Payload: { "message": "I love gadgets", "phase": "childhood" }            ││
│  └─────────────────────────────────────────────────────────────────────────────────┘│
│                                                                                     │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐│
│  │  Step 2: FastAPI processes request                                             ││
│  │  ├── Authenticates user (JWT)                                                  ││
│  │  ├── Validates input                                                           ││
│  │  └── Routes to appropriate agent                                               ││
│  └─────────────────────────────────────────────────────────────────────────────────┘│
│                                                                                     │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐│
│  │  Step 3: LangGraph orchestrates agent workflow                                  ││
│  │  ├── Loads prompt from gems/nenu_evaru/prompts/                                ││
│  │  ├── Selects question from question_banks/
<truncated 26027 bytes>

NOTE: The output was truncated because it was too long. Use a more targeted query or a smaller range to get the information you need.
