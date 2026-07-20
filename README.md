<div align="center">
  
# 🌟 Baagupadu (బాగుపడు)
### *Discover Who You Truly Are*

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![AWS Bedrock](https://img.shields.io/badge/AWS_Bedrock-Llama_3_70B-FF9900?style=for-the-badge&logo=amazonaws)](https://aws.amazon.com/bedrock/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-pgvector-336791?style=for-the-badge&logo=postgresql)](https://postgresql.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev/)

*Baagupadu ("To Prosper & Better Oneself" in Telugu) is a highly interactive, AI-powered mentoring ecosystem designed to help you think independently, make better career decisions, and take control of your life.*

[Architecture](#architecture--ai-engine) • [Branching Strategy](#branching-strategy) • [Tech Stack](#tech-stack) • [Installation & Setup](#installation--local-setup)

</div>

---

## 📖 The Vision
The internet gave us unlimited access to knowledge, but it created an **"Information Paradox"**—confusion, lack of direction, and shallow learning. Baagupadu cuts through the noise by starting with the most important subject: **You.** 

Instead of boring surveys, you engage in a deep, empathetic conversation with **Sahayam**, your personal AI mentor. Sahayam explores your childhood, teenage years, and adulthood to generate a comprehensive synthesis of your personality and an actionable career roadmap.

---

## 🧠 Architecture & AI Engine

Baagupadu is not a simple chatbot. It is a highly complex, multi-agent AI system designed to simulate a real human psychologist and career coach.

### 1. The Evaluator-Actor Model
To ensure Sahayam remains empathetic while still gathering psychological data, the system is split into two background roles powered by **AWS Bedrock (Meta Llama 3.1 70B Instruct)**:
- **The Actor:** Focuses entirely on having a warm, empathetic, and fast-paced conversation with the user (70% Best Friend, 30% Fast-Moving Guide).
- **The Evaluator:** Runs silently in the background, analyzing every message the user sends to extract psychological traits, quality signals, and career motivations.

### 2. Semantic RAG & Context Management
The core "rules" and question banks for Sahayam contain over **220,000 tokens** of text. Feeding this to an AI directly would cause "Context Window Collapse". 
To solve this, we implemented **Semantic RAG (Retrieval-Augmented Generation)** using `pgvector` in PostgreSQL:
- The backend mathematically searches the database for the exact rules needed for the current conversation phase.
- It injects a strictly limited number of chunks (max 2) into the AI's context.
- **Fuzzy Deduplication:** The Evaluator intelligently merges similar traits to keep the AI's memory clean and lightning-fast.

---

## 🌿 Branching Strategy (The Dual-Core System)

Because of the project's scale, development is strictly split across two Git branches. This ensures that the "Brain" (psychology rules) and the "Body" (infrastructure) are developed safely.

### 1. `main` Branch (The Brain)
The `main` branch is entirely dedicated to the psychological frameworks, AI prompts, and conversation rules. 
- **What lives here:** The `gems/nenu_evaru/` directory.
- **Why:** This isolates the prompt engineering. Any changes to Sahayam's personality, how it extracts traits, or what questions it asks are safely version-controlled here.

### 2. `sreekar-expansion-branch` (The Body)
This is the active development branch for the full-stack infrastructure.
- **What lives here:** The `frontend/` (Next.js UI), `backend/` (FastAPI, pgvector, LangChain, AWS integration), and `requirements.txt`.
- **Why:** This is where the heavy lifting happens. We recently used this branch to migrate from local, unstable 8B models (which suffered from instruction leakage) to **AWS Bedrock (Llama 70B)**, completely overhauling the RAG logic and API routes.

*(Note: To run the full application, you must be on the `sreekar-expansion-branch`).*

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 16 (App Router), React 19, Zustand, Tailwind CSS v4, Framer Motion, React Three Fiber.
- **Backend:** FastAPI, Uvicorn, SQLAlchemy (Async), PostgreSQL (`pgvector`).
- **AI / LLM:** AWS Bedrock (`us.meta.llama3-1-70b-instruct-v1:0`), LangChain, Boto3, SentenceTransformers.

---

## 🚀 Installation & Local Setup

Want to run Baagupadu locally? Follow these steps from the **`sreekar-expansion-branch`**.

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)
- PostgreSQL (with `pgvector` extension installed)
- AWS Account with Bedrock Access

### Step 1: Clone the Repository
```bash
git clone https://github.com/Sreekarreddy2005/Baagupadu-Career-Guidance-Coach-Assistant-Gem.git
cd Baagupadu-Career-Guidance-Coach-Assistant-Gem
git checkout sreekar-expansion-branch
```

### Step 2: Backend Setup (FastAPI & AWS)
1. Open the `backend/` directory.
2. Create a virtual environment and install dependencies:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
pip install -r requirements.txt
```
3. Create a `.env` file inside the `backend/` folder and add your AWS credentials and Database URL:
```env
# LLM Configuration
LLM_PROVIDER="bedrock"
AWS_ACCESS_KEY_ID="your_access_key_here"
AWS_SECRET_ACCESS_KEY="your_secret_key_here"
AWS_REGION="us-east-1"

# Database
DATABASE_URL="postgresql+asyncpg://user:password@localhost/baagupadu"
```
4. Start the backend server:
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
