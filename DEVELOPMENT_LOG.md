# Baagupadu Development Log & Decisions Track

This document is a living record of our progress, design decisions, and upcoming actions for the Baagupadu Career Guidance Coach Assistant project. I will continually update this file as we make new changes.

---

## 📅 August 18, 2026 - Current Status

### ✅ What We Have Done So Far
1. **Hardware Requirements & Scaling Strategy:**
   - Evaluated the system architecture (Next.js, FastAPI, PostgreSQL + pgvector, and Ollama).
   - **Key Decision:** Emphasized the necessity of high-VRAM Enterprise GPUs (like A100s or RTX 4090/6000s) to handle concurrent inference for the three local models (`llama3.1`, `qwen2.5`, `phi3`).

2. **Version Control:**
   - Successfully pushed the latest local changes to the GitHub repository (`Sreekarreddy2005/Baagupadu-Career-Guidance-Coach-Assistant-Gem`) on the `main` branch.
   - Added recent enhancements including the Subconscious Agent (`shadow_agents.py`, `subconscious_agent.py`) and updated core engine components.

### 📌 Active/Upcoming Tasks
- **Maintain this log:** I will update this document after every major feature, architecture decision, or debugging session to ensure we have a central source of truth for the project's evolution.
- *(Waiting for the next feature request, optimization, or issue to tackle)*

---

> [!TIP]
> **To the User:** Whenever we start a new feature or resolve a bug, I will append my notes here. You can always refer to this file to see where we left off.

### 📌 Strategy & Market Validation (August 18, 2026)
- **Market Feasibility Strategy Created:** Formulated a brutally honest go-to-market and validation strategy specific to the Indian demographic. 
- **Key Takeaways:** 
  - Emphasized "WhatsApp-first" testing over complex app builds.
  - Highlighted the "Fake Door" payment test to gauge actual Willingness to Pay (WTP).
  - Addressed the "Parental Bypass" factor (selling the outcome to parents vs. companionship to students).
  - Linked Artifact: `market_validation_india.md`
  - Created a step-by-step [Market Research Guide](file:///Users/sreekarreddypindi/.gemini/antigravity-ide/brain/fd24801d-82e0-4a87-93ba-a3d54615a805/market_research_india.md) focusing on secondary data, competitor analysis, primary unstructured interviews, and search intent.

### 📌 Team & Operations (August 21, 2026)
- **Onboarding Syllabus Created:** Outlined the specific technical skills required for new developers to contribute to the project, heavily focusing on the Agentic AI/ML stack (LangGraph, RAG, Ollama), alongside the Next.js/FastAPI components.
- Linked Artifact: `team_onboarding_skills.md`
- **Interview Q&A Guide Updated:** Replaced complex scenario questions with simple, foundational questions (covering Python dicts/lists, React hooks, APIs, Git/Docker, and simple RAG/LLM concepts) to easily vet junior/mid-level candidates.
- Linked Artifact: `interview_qa_guide.md`

### 📌 Security & Architecture (August 22, 2026)
- **RAG Security & Observability Architecture Implemented:** 
  - **Input Sanitization:** Built and integrated a "Prompt Shield" (`GuardrailAgent`) in `api.py` to intercept and block prompt injection attempts before they reach the main pipeline.
  - **Access Control:** Audited all GraphRAG and Vector RAG retrieval code (`planner_agent.py`, `executor_agent.py`, `extractor_agent.py`) to confirm strict SQL Row-Level Filtering (`user_id` / `conversation_id`) is in place.
  - **Observability:** Added `AuditLog` to PostgreSQL (`models.py`) and integrated it into the API to track all user queries and blocked injection attempts.
  - **Rate Limiting:** Deferred (Option 4).
- Linked Artifacts: `implementation_plan.md`, `walkthrough.md`

### 📌 Infrastructure & Networking (August 22, 2026)
- **Cloudflare Tunnel CORS Fix:**
  - **Issue:** Remote users accessing the Next.js frontend via `trycloudflare.com` were getting "Network Error" when sending messages.
  - **Root Cause:** The `baseURL` in `frontend/src/lib/api.ts` was hardcoded to `http://localhost:8000`, causing the remote browser to attempt a CORS request to its own local machine rather than the host server.
  - **Resolution:** Modified `baseURL` to use relative paths (`''`). This allows the Next.js server to intercept the `/api/chat` request and use its internal `next.config.ts` rewrite rules to securely proxy the request to the FastAPI backend running on the host machine.

### 📌 Agent Behavior & Logic (August 22, 2026)
- **Trust Phase Premature-Exploration Fix:**
  - **Issue:** The AI was jumping straight into deep questions (e.g., asking about high school) immediately after the user said "yes" to the first message, completely breaking the Trust Phase.
  - **Root Cause:** The `planner_agent.py` prompt did not explicitly know how many messages had passed, causing it to generate a `proposed_plan` that pushed into the "childhood" micro-phase too early.
  - **Resolution:** Injected `MESSAGE NUMBER: {user_msg_count}` directly into the Planner's System Prompt with a strict rule to stay in light small-talk for the first 4 messages. Also hardcoded a failsafe in the Python execution logic to forcefully set `micro_phase = "none"` if `user_msg_count <= 4`, preventing the RAG system from accidentally fetching high-school/childhood question banks prematurely.

### 📌 API Proxy & Networking (August 22, 2026)
- **Next.js Rewrite 500 Error Fix:**
  - **Issue:** The frontend threw an `AxiosError: Request failed with status code 500` when remote teammates tried to send messages via the Cloudflare Tunnel.
  - **Root Cause:** Next.js `rewrites()` in `next.config.ts` was silently failing to proxy the request to the local `http://127.0.0.1:8000` backend (a known instability with Node `fetch` and IPv6/IPv4 resolution). Additionally, Cloudflare was caching the old frontend for remote users.
  - **Resolution:** 
    1. Removed the buggy rewrite array from `next.config.ts`.
    2. Built a manual, highly observable Catch-all API Route at `frontend/src/app/api/[...slug]/route.ts`. This custom handler intercepts all `/api/*` calls and uses standard `fetch` to securely bridge the frontend to the backend while providing exact JSON error messages instead of blind 500 errors.

### 📌 Architecture & NLP Engine (August 31, 2026)
- **Nomic-Embed-Text Migration:**
  - Upgraded the embedding engine from the small `all-MiniLM-L6-v2` to the massive 8,192-token context `nomic-embed-text-v1.5`.
  - Migrated PostgreSQL `pgvector` tables (`KnowledgeBaseChunk` and `LongTermMemory`) from 384 dimensions to 768 dimensions.
- **CakeChat Methodologies Integration:**
  - **Emotional Conditioning:** Implemented "Thought Vectors". The `PlannerAgent` now classifies user emotion and forces the `ExecutorAgent` to condition its tone.
  - **MMI Reranking:** Built a new `MMIEvaluatorAgent`. The `ExecutorAgent` uses `asyncio.gather` to generate 3 response candidates. The Evaluator scores them on uniqueness (Distinct-N) and emotional alignment, ensuring high-quality, non-robotic responses.
  - **Distinct-N Logging:** Added background calculation of `Distinct-2` metrics in `ExtractorAgent` to monitor AI vocabulary repetitiveness.
- **Docker Infrastructure Fix:**
  - Mapped the `gems/` directory as a live volume (`- ./gems:/gems`) in `docker-compose.yml` to allow the containerized ingestion script to read the knowledge base without needing Docker image rebuilds.
  - Added `einops` and `transformers` to `requirements.txt` to support the Nomic model.
