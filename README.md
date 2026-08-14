<div align="center">
  
# 🌟 Baagupadu (బాగుపడు)
### *Discover Who You Truly Are*

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Ollama](https://img.shields.io/badge/Local_AI-Ollama-FF9900?style=for-the-badge&logo=ollama)](https://ollama.com/)
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

### 1. The 5-Agent Architecture & Background Evaluation
- **Planner Agent (Logic/Qwen):** Analyzes the conversation history against our rules (the `router.md`). It dictates the goal for the turn and dictates **Organic Trust Transitions**—moving from small talk to deep exploration organically based on user comfort rather than rigid message counts.
- **Safety Evaluator (Logic/Qwen):** Acts as the strict gatekeeper. It reviews the Planner's proposed plan against our psychological `guardrails.md`. If the plan is unsafe or tone-deaf, it is rejected and replanned.
- **Executor Agent (Chat/Llama):** The empathetic Chat LLM. It receives the approved plan and uses natural texting habits (emojis, casual reactions) to talk human-to-human with the user.
- **Synthesizer Agent (Logic/Qwen):** Analyzes the Executor's outgoing response to determine if the user has naturally advanced to a new psychological phase.
- **Extractor Agent (Logic/Qwen):** Extracts structured JSON traits from the conversation and updates the user's Psychological Profile in real-time.
- **Real-Time Quality Evaluator (Judge/Phi-3):** An asynchronous background agent that strictly grades the AI's chat response on Empathy, Resonance, and Insight without blocking the user's chat flow.

### 2. Session-Scoped Memory & Vector Database
The database uses `pgvector` in PostgreSQL for both **Rules RAG** (fetching the correct coaching methodology based on the phase) and **Long-Term Memory** (semantic search of past user messages).
- **100% Session Isolation:** The `Conversation`, `ProfileState`, and `LongTermMemory` models are tied exclusively to the active Session ID.
- **Total Amnesia:** Starting a "New Chat" spins up a completely blank psychological profile and an empty vector memory bank. Your past sessions are saved, but they do not bleed into your new isolated sessions.

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 16 (App Router), React 19, Zustand, Tailwind CSS v4, Framer Motion, React Three Fiber.
- **Backend:** FastAPI, Uvicorn, LangGraph, SQLAlchemy (Async), PostgreSQL (`pgvector`).
- **AI / LLM:** 100% Local AI via Ollama:
  - `llama3.1:8b` for Empathetic Chatting.
  - `qwen2.5:7b` for Logic, Planning, & Extraction.
  - `phi3:mini` for Real-Time Background Quality Evaluation.

---

## 🚀 Installation & Local Setup

Want to run Baagupadu locally? Follow this step-by-step guide for both **Mac** and **Windows**.

### Prerequisites
Before you start, ensure you have the following installed on your machine:
- **Node.js (v18+)**: [Download Here](https://nodejs.org/)
- **Python (v3.10+)**: [Download Here](https://www.python.org/downloads/)
- **Ollama**: [Download Here](https://ollama.com/download) (Required for 100% local, offline AI)
- **PostgreSQL**: 
  - **Mac:** Recommend using [Postgres.app](https://postgresapp.com/) or Homebrew (`brew install postgresql`).
  - **Windows:** Recommend downloading the official installer from [EnterpriseDB](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads).

---

### Step 1: Clone the Repository
Open your terminal (Mac) or Command Prompt / PowerShell (Windows) and run:
```bash
git clone https://github.com/Sreekarreddy2005/Baagupadu-Career-Guidance-Coach-Assistant-Gem.git
cd Baagupadu-Career-Guidance-Coach-Assistant-Gem
```

### Step 2: Set up Local AI Models (Ollama)
Open a new terminal window and pull the required models. Note: This will download several gigabytes of data.
```bash
ollama run llama3.1:8b  # The empathetic conversational agent
ollama run qwen2.5:7b   # The strict logic and planning agent
ollama run phi3:mini    # The lightweight, unbiased background judge
```
*Leave the Ollama application running in the background.*

### Step 3: Set up PostgreSQL with `pgvector`
We use `pgvector` for Semantic RAG. You must enable it in your database.

**For Mac (using Postgres.app or Homebrew):**
1. Ensure your Postgres server is running.
2. Open your terminal and log into postgres: `psql postgres`
3. Create a database: `CREATE DATABASE baagupadu;`
4. Connect to it: `\c baagupadu`
5. Enable the extension: `CREATE EXTENSION IF NOT EXISTS vector;`

**For Windows:**
1. Open the **SQL Shell (psql)** program that came with your PostgreSQL installation.
2. Press Enter to accept default server/port until it asks for your password. Enter the password you created during installation.
3. Create a database: `CREATE DATABASE baagupadu;`
4. Connect to it: `\c baagupadu`
5. Enable the extension: `CREATE EXTENSION IF NOT EXISTS vector;`

### Step 4: Backend Setup (FastAPI)
1. Open your terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   - **Mac:**
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```
   - **Windows:**
     ```cmd
     python -m venv venv
     venv\Scripts\activate
     ```
3. Install the required Python packages:
   ```bash
   pip install -r requirements.txt
   ```
4. Copy the environment variables file:
   - **Mac:** `cp .env.example .env`
   - **Windows:** `copy .env.example .env`
5. Open the `.env` file in a text editor and set your database URL using the password you set up earlier:
   ```env
   LLM_PROVIDER=ollama
   DATABASE_URL=postgresql+asyncpg://postgres:YOUR_PASSWORD@localhost/baagupadu
   ```
6. **CRITICAL: Initialize the Database & Knowledge Base:**
   Run these scripts to create the tables and embed the psychological rules into vector space:
   ```bash
   python scripts/migrate_db.py
   python scripts/ingest_knowledge_base.py
   ```
7. Start the backend server:
   ```bash
   uvicorn api:app --host 0.0.0.0 --port 8000 --reload
   ```

### Step 5: Frontend Setup (Next.js)
1. Open a **new terminal window** (leave the backend running) and navigate to the frontend:
   ```bash
   cd frontend
   ```
2. Install the Node modules:
   ```bash
   npm install
   ```
3. Start the UI:
   ```bash
   npm run dev
   ```
4. Open your browser to `http://localhost:3000` and start discovering who you truly are!

---

## 🏢 Enterprise Server Deployment (Docker)
If you want to deploy Baagupadu to an office server so that your entire team can access it 24/7 without running it on your personal laptop, use the included Docker configuration.

**Prerequisite:** Ensure [Docker](https://docs.docker.com/get-docker/) and Docker Compose are installed on your server.

1. Clone the repository on your server:
   ```bash
   git clone https://github.com/Sreekarreddy2005/Baagupadu-Career-Guidance-Coach-Assistant-Gem.git
   cd Baagupadu-Career-Guidance-Coach-Assistant-Gem
   ```
2. Start the entire ecosystem (Frontend, Backend, Database, and Ollama AI):
   ```bash
   docker-compose up -d
   ```
3. Wait about 3-5 minutes for the first boot. The system will automatically:
   - Create a PostgreSQL database with `pgvector`.
   - Download the `llama3.1:8b`, `qwen2.5:7b`, and `phi3:mini` AI models.
   - Run backend database migrations and ingest the psychological rules into vector space.
4. Your team can now access the app at `http://<your-server-ip>:3000`.

*Note: If your server has an NVIDIA GPU, edit `docker-compose.yml` and uncomment the `deploy` section under the `ollama` service to enable GPU acceleration.*

---

<div align="center">
  <i>"The moment a person realizes that the world is shaped by people no smarter than them, everything changes."</i>
</div>
