PART 1: SYSTEM ARCHITECTURE
1.1 High-Level Architecture Diagram
text
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
1.2 Component Breakdown
Layer	Component	Technology	Purpose
Presentation	Frontend	React + Next.js 14/15	User interface, chat interactions
Delivery	CDN + Hosting	AWS CloudFront + S3	Global content delivery
API Gateway	Routing + Auth	AWS API Gateway + WAF	Request routing, auth, rate limiting
Backend	Core API	FastAPI (Python 3.11+)	Business logic, API endpoints
AI Orchestration	Multi-Agent System	LangGraph + CrewAI	6-phase conversation orchestration
LLM	AI Inference	Gemini 2.5 Flash-Lite	Conversational AI
Database	Primary + Vector	PostgreSQL 15+ + pgvector	User data, embeddings, personas
Cache	Session + Queue	Redis 7+ (ElastiCache)	Caching, pub/sub
Auth	Identity	AWS Cognito	User authentication and management
Infrastructure	IaC	AWS CDK (TypeScript)	Infrastructure as Code
CI/CD	Deployment	GitHub Actions	Automated deployment
📋 PART 2: USER FLOW DIAGRAM
2.1 Complete User Journey
text
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
2.2 Data Flow Across Phases
text
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
2.3 User State Transitions
text
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
2.4 API Request Flow
text
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
│  │  ├── Selects question from question_banks/                                     ││
│  │  ├── Calls Gemini API for response                                             ││
│  │  └── Saves state to PostgreSQL (PostgresSaver)                                ││
│  └─────────────────────────────────────────────────────────────────────────────────┘│
│                                                                                     │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐│
│  │  Step 4: Response sent back to client                                          ││
│  │  ├── Endpoint: POST /api/v1/chat/message                                       ││
│  │  └── Response: { "message": "That's fascinating!", "phase": "childhood" }      ││
│  └─────────────────────────────────────────────────────────────────────────────────┘│
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
📋 PART 3: FILE STRUCTURE TO ARCHITECTURE MAPPING
3.1 How Your Project Files Map to the Architecture
text
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                    FILE STRUCTURE → ARCHITECTURE MAP                                │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│  📁 Baagupadu/                                                                      │
│  │                                                                                  │
│  ├── 📁 frontend/                         ───────▶  FRONTEND LAYER                  │
│  │   ├── src/app/                         ───────▶  Next.js Pages                  │
│  │   │   ├── (landing)/                   ───────▶  Landing Page                   │
│  │   │   ├── chat/                        ───────▶  Chat Interface                 │
│  │   │   └── globals.css                  ───────▶  TailwindCSS Styles             │
│  │   ├── components/                      ───────▶  UI Components                  │
│  │   │   ├── agent/                       ───────▶  Sahayam Avatar UI              │
│  │   │   ├── chat/                        ───────▶  Chat UI Components             │
│  │   │   └── ui/                          ───────▶  Generic UI Elements            │
│  │   ├── hooks/                           ───────▶  Custom React Hooks             │
│  │   ├── lib/                             ───────▶  API Clients & Utilities        │
│  │   └── types/                           ───────▶  TypeScript Types               │
│  │                                                                                  │
│  ├── 📁 gems/                             ───────▶  AI SERVICE LAYER               │
│  │   └── 📁 nenu_evaru/                    ───────▶  Module: "Who Am I?"            │
│  │       ├── 📁 prompts/                  ───────▶  System Prompts                 │
│  │       │   ├── system_prompt.md         ───────▶  Sahayam Personality            │
│  │       │   ├── trust_building_phase.md  ───────▶  Phase 1 Prompts                │
│  │       │   └── childhood_exploration.md ───────▶  Phase 2 Prompts                │
│  │       ├── 📁 question_banks/           ───────▶  Question Data                  │
│  │       │   ├── childhood_questions.json ───────▶  Childhood Questions            │
│  │       │   ├── teenage_questions.json   ───────▶  Teenage Questions              │
│  │       │   └── adult_questions.json     ───────▶  Adult Questions                │
│  │       ├── 📁 frameworks/               ───────▶  Psychological Frameworks       │
│  │       ├── 📁 inference/                ───────▶  Response Parsing Logic         │
│  │       └── 📁 memory/                   ───────▶  State Persistence Logic        │
│  │                                                                                  │
│  ├── 📁 docs/                             ───────▶  DOCUMENTATION                  │
│  ├── 📁 user_flow/                        ───────▶  USER JOURNEY SOPs              │
│  ├── 📁 shared/                           ───────▶  SHARED TYPES & CONSTANTS       │
│  └── 📄 package.json                      ───────▶  DEPENDENCIES                   │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
📋 PART 4: DEPLOYMENT ARCHITECTURE
4.1 CI/CD Pipeline
text
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                            CI/CD PIPELINE                                           │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐│
│  │  1. DEVELOPER PUSHES CODE                                                       ││
│  │  ├── git push origin main                                                       ││
│  │  └── Creates PR → GitHub Actions trigger                                        ││
│  └─────────────────────────────────────────────────────────────────────────────────┘│
│                                                                                     │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐│
│  │  2. GITHUB ACTIONS (CI/CD Pipeline)                                            ││
│  │  ├── Lint: TypeScript/Python linting                                           ││
│  │  ├── Test: Unit tests + Integration tests                                      ││
│  │  ├── Build: Build frontend (Next.js) + Backend (Docker)                       ││
│  │  └── Security Scan: Snyk/Trivy for vulnerabilities                             ││
│  └─────────────────────────────────────────────────────────────────────────────────┘│
│                                                                                     │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐│
│  │  3. DEPLOYMENT                                                                  ││
│  │  ├── Frontend: Upload to S3 → CloudFront invalidation                          ││
│  │  ├── Backend: Push Docker to ECR → Deploy to ECS Fargate                      ││
│  │  └── Database: Run migrations (Alembic)                                         ││
│  └─────────────────────────────────────────────────────────────────────────────────┘│
│                                                                                     │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐│
│  │  4. MONITORING                                                                  ││
│  │  ├── CloudWatch: Logs + Metrics                                                 ││
│  │  ├── X-Ray: Distributed tracing                                                 ││
│  │  └── Alerts: Slack/Email notifications                                          ││
│  └─────────────────────────────────────────────────────────────────────────────────┘│
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
4.2 Deployment Environments
text
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                          DEPLOYMENT ENVIRONMENTS                                    │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐│
│  │  DEVELOPMENT (dev.baagupadu.com)                                               ││
│  │  ├── Purpose: Active development and testing                                   ││
│  │  ├── Branch: feature/*                                                         ││
│  │  ├── Database: Dev RDS (Single-AZ)                                             ││
│  │  └── Cost: $50-100/month                                                       ││
│  └─────────────────────────────────────────────────────────────────────────────────┘│
│                                                                                     │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐│
│  │  STAGING (staging.baagupadu.com)                                               ││
│  │  ├── Purpose: Pre-production validation                                        ││
│  │  ├── Branch: develop                                                           ││
│  │  ├── Database: Staging RDS (Multi-AZ)                                          ││
│  │  └── Cost: $100-200/month                                                      ││
│  └─────────────────────────────────────────────────────────────────────────────────┘│
│                                                                                     │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐│
│  │  PRODUCTION (baagupadu.com)                                                    ││
│  │  ├── Purpose: Live users                                                        ││
│  │  ├── Branch: main                                                               ││
│  │  ├── Database: Production RDS (Multi-AZ + Read Replicas)                       ││
│  │  └── Cost: $200-500/month                                                       ││
│  └─────────────────────────────────────────────────────────────────────────────────┘│
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
📋 PART 5: SECURITY ARCHITECTURE
5.1 Security Layers
text
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                           SECURITY ARCHITECTURE                                     │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐│
│  │  NETWORK LAYER                                                                  ││
│  │  ├── VPC with public/private subnets                                           ││
│  │  ├── Security Groups (least privilege)                                         ││
│  │  └── NACL for extra protection                                                 ││
│  └─────────────────────────────────────────────────────────────────────────────────┘│
│                                                                                     │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐│
│  │  APPLICATION LAYER                                                              ││
│  │  ├── AWS WAF (Web Application Firewall)                                        ││
│  │  ├── Rate Limiting (100 RPS per user)                                          ││
│  │  ├── Input Validation (FastAPI Pydantic)                                       ││
│  │  └── JWT Authentication (AWS Cognito)                                          ││
│  └─────────────────────────────────────────────────────────────────────────────────┘│
│                                                                                     │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐│
│  │  DATA LAYER                                                                     ││
│  │  ├── KMS Encryption (Data at rest)                                             ││
│  │  ├── TLS 1.3 (Data in transit)                                                ││
│  │  ├── AWS Secrets Manager (Credentials)                                         ││
│  │  └── RDS Encryption + Multi-AZ                                                 ││
│  └─────────────────────────────────────────────────────────────────────────────────┘│
│                                                                                     │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐│
│  │  MONITORING LAYER                                                               ││
│  │  ├── AWS CloudTrail (Audit Logging)                                            ││
│  │  ├── AWS CloudWatch (Metrics + Alerts)                                         ││
│  │  └── AWS X-Ray (Distributed Tracing)                                           ││
│  └─────────────────────────────────────────────────────────────────────────────────┘│
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
📋 PART 6: PERFORMANCE & SCALING
6.1 Performance Targets
Metric	Target	How                                                                                                                                                                                                                              It's Achieved
API Response Time	<200ms	FastAPI async, caching
LLM Response Time	<3s	Gemini 2.5 Flash-Lite
Page Load Time	<2s	CloudFront CDN, optimized assets
Concurrent Users	100	ECS Fargate auto-scaling
Database Query Time	<50ms	RDS + pgvector optimization
6.2 Scaling Strategy
text
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                           SCALING STRATEGY                                          │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐│
│  │  HORIZONTAL SCALING                                                             ││
│  │  ├── ECS Fargate: Auto-scaling based on CPU/Memory usage                       ││
│  │  ├── RDS: Read replicas for read-heavy workloads                               ││
│  │  └── CloudFront: Global CDN for static assets                                  ││
│  └─────────────────────────────────────────────────────────────────────────────────┘│
│                                                                                     │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐│
│  │  VERTICAL SCALING                                                               ││
│  │  ├── RDS: Upgrade instance size when needed                                    ││
│  │  └── ECS: Increase memory/CPU per container                                    ││
│  └─────────────────────────────────────────────────────────────────────────────────┘│
│                                                                                     │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐│
│  │  CACHING STRATEGY                                                               ││
│  │  ├── Redis: Session caching + rate limiting                                    ││
│  │  ├── CloudFront: Edge caching for static assets                                ││
│  │  └── FastAPI: Response caching for common requests                             ││
│  └─────────────────────────────────────────────────────────────────────────────────┘│
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
