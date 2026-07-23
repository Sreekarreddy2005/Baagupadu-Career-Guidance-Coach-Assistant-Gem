<div align="center">
  
# 🌟 Baagupadu (బాగుపడు)
### *Discover Who You Truly Are*

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![AWS Bedrock](https://img.shields.io/badge/AWS_Bedrock-Llama_3_70B-FF9900?style=for-the-badge&logo=amazonaws)](https://aws.amazon.com/bedrock/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-pgvector-336791?style=for-the-badge&logo=postgresql)](https://postgresql.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev/)

*Baagupadu ("To Prosper & Better Oneself" in Telugu) is a highly interactive, AI-powered mentoring ecosystem designed to help you think independently, make better career decisions, and take control of your life.*

[Architecture](#architecture--multi-agent-engine) • [Tech Stack](#tech-stack) • [Installation & Setup](#installation--local-setup)

</div>

---

## 📖 The Vision
The internet gave us unlimited access to knowledge, but it created an **"Information Paradox"**—confusion, lack of direction, and shallow learning. Baagupadu cuts through the noise by starting with the most important subject: **You.** 

Instead of boring surveys, you engage in a deep, empathetic conversation with **Sahayam**, your personal psychological AI mentor. Sahayam explores your childhood, teenage years, and adulthood to generate a comprehensive synthesis of your personality and an actionable career roadmap.

---

## 🧠 Architecture & Multi-Agent Engine

Baagupadu is powered by a **Multi-Agent Directed Acyclic Graph (LangGraph)**. Rather than a single monolithic prompt, we distribute the cognitive load across specialized agents running sequentially per conversation turn.

This ensures Sahayam is an empathetic psychological coach, while complex logic runs invisibly in the background.

### 1. The 5-Agent LangGraph Node System
- **Planner Agent:** Analyzes the conversation history against our rules (the `router.md`). It dictates the goal for the turn (e.g. "Pivot to teenage years to explore fears of failure"). It strictly enforces the psychological coaching frame.
- **Evaluator Agent:** Acts as the strict gatekeeper. It reviews the Planner's proposed plan against our psychological `guardrails.md`. If the plan is unsafe or tone-deaf, it is rejected and replanned.
- **Executor Agent (Sahayam):** The empathetic Chat LLM. It receives the approved plan, the active phase rules via RAG, and Long-Term Memory context. It focuses entirely on talking human-to-human with the user.
- **Synthesizer Agent:** Analyzes the Executor's outgoing response to determine if the user has naturally advanced to a new psychological phase (e.g., transitioning from *Trust Building* to *Childhood Exploration*).
- **Extractor Agent:** Extracts structured JSON traits (e.g., `resilience`, `autonomy`) from the conversation and updates the user's Psychological Profile in real-time.

### 2. Session-Scoped Memory & Vector Database
The database uses `pgvector` in PostgreSQL for both **Rules RAG** (fetching the correct coaching methodology based on the phase) and **Long-Term Memory** (semantic search of past user messages).
- **100% Session Isolation:** The `Conversation`, `ProfileState`, and `LongTermMemory` models are tied exclusively to the active Session ID.
- **Total Amnesia:** Starting a "New Chat" spins up a completely blank psychological profile and an empty vector memory bank. Your past sessions are saved, but they do not bleed into your new isolated sessions.

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 16 (App Router), React 19, Zustand, Tailwind CSS v4, Framer Motion, React Three Fiber.
- **Backend:** FastAPI, Uvicorn, LangGraph, SQLAlchemy (Async), PostgreSQL (`pgvector`).
- **AI / LLM Providers Supported:** AWS Bedrock (Primary: `us.meta.llama3-1-70b-instruct-v1:0`), OpenAI, Google Gemini, Anthropic, Ollama.

---

## 🚀 Installation & Local Setup

Want to run Baagupadu locally? Follow these steps.

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)
- PostgreSQL (with `pgvector` extension installed)
- AWS Account with Bedrock Access (or OpenAI/Gemini keys)

### Step 1: Clone the Repository
```bash
git clone https://github.com/Sreekarreddy2005/Baagupadu-Career-Guidance-Coach-Assistant-Gem.git
cd Baagupadu-Career-Guidance-Coach-Assistant-Gem
```

### Step 2: Backend Setup (FastAPI & AI)
1. Open the `backend/` directory.
2. Create a virtual environment and install dependencies:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
pip install -r requirements.txt
```
3. Copy the example environment variables file and configure it:
```bash
cp .env.example .env
```
4. Open the `.env` file and configure your database and AI provider.

**Setting up PostgreSQL (`pgvector`) locally:**
If you are running PostgreSQL locally (e.g. via Postgres.app on Mac or Docker), ensure you have installed the `pgvector` extension.
```sql
-- Run this in your psql terminal to enable vectors
CREATE EXTENSION IF NOT EXISTS vector;
```
Then set your `DATABASE_URL` in `.env`:
```env
DATABASE_URL=postgresql+asyncpg://your_db_user:your_db_password@localhost/your_db_name
```

**Setting up Local LLMs (Ollama) for 100% Offline AI:**
If you prefer not to use AWS Bedrock or OpenAI, you can run the AI locally using [Ollama](https://ollama.com/).
1. Install Ollama and start the application.
2. Pull the required models in your terminal:
   ```bash
   ollama run llama3.1:8b  # Used for the empathetic Chat Executor
   ollama run qwen2.5:7b   # Used for the strict Logic Evaluator/Planner
   ```
3. Update your `.env` to point to Ollama:
   ```env
   LLM_PROVIDER=ollama
   OLLAMA_BASE_URL=http://localhost:11434
   OLLAMA_CHAT_MODEL=llama3.1:8b
   OLLAMA_LOGIC_MODEL=qwen2.5:7b
   ```
5. **Initialize the Database & Knowledge Base:**
Because of the pgvector implementation, you must first create the tables and embed the psychological rules:
```bash
# This creates the tables in Postgres
python scripts/migrate_db.py

# This reads gems/nenu_evaru/prompts/ and embeds them into pgvector
python scripts/ingest_knowledge_base.py
```

6. Start the backend server:
```bash
uvicorn api:app --host 0.0.0.0 --port 8000 --reload
```

### Step 3: Frontend Setup (Next.js)
1. Open a new terminal and navigate to the `frontend/` directory.
2. Install dependencies:
```bash
cd frontend
npm install
```
3. Start the UI:
```bash
npm run dev
```
4. Open your browser to `http://localhost:3000` and start discovering who you truly are!

---

<div align="center">
  <i>"The moment a person realizes that the world is shaped by people no smarter than them, everything changes."</i>
</div>
