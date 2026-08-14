# Baagupadu

## Layout
- This is not a Node/Python workspace: run frontend commands from `frontend/` and backend commands from `backend/`.
- `backend/api.py` is the FastAPI entrypoint. Chat requests invoke the LangGraph assembled in `backend/agent/sahayam_engine.py` (planner -> evaluator -> executor -> extraction, then synthesis or roadmap).
- Coaching rules, prompts, frameworks, and question banks live in `gems/nenu_evaru/`. `backend/scripts/ingest_knowledge_base.py` embeds selected files from that directory into PostgreSQL; update and re-ingest them when changing RAG content.

## Frontend
- Use `npm install`, `npm run dev`, `npm run lint`, and `npm run build` in `frontend/`. There is no separate frontend test script.
- The frontend is Next.js 16 with the App Router. Before changing framework behavior, consult the local Next documentation as required by `frontend/AGENTS.md`.
- Client API calls in `frontend/src/lib/api.ts` use `NEXT_PUBLIC_BACKEND_URL` (default `http://localhost:8000`), not the `BACKEND_API_URL` rewrite setting in `next.config.ts`.
- `/chat` and `/dashboard` require Clerk authentication; backend `/api/*` endpoints expect a Bearer token.

## Backend And Data
- Create `backend/.env` from `.env.example`; `DATABASE_URL` must use the async `postgresql+asyncpg://` dialect and target PostgreSQL with `pgvector`. Local Ollama defaults are configured there.
- Start the API from `backend/` with `uvicorn api:app --host 0.0.0.0 --port 8000 --reload`.
- `python scripts/migrate_db.py` drops and recreates every table. Run it only when resetting the database; it does not create the `vector` extension, so enable that extension first.
- `python scripts/ingest_knowledge_base.py` deletes and rebuilds all knowledge-base chunks and downloads/uses the `all-MiniLM-L6-v2` embedding model. It must run after a reset and after changing ingestible `gems/nenu_evaru/` content.
- The ad hoc root `test_*.py` scripts are live integration probes that need configured database/LLM services; no automated backend test suite or Python lint/typecheck configuration is present.

## Containers
- `docker compose up -d` starts PostgreSQL on host port 5433, backend on 8000, frontend on 3000, Ollama, n8n, Adminer, and Cloudflare Tunnel.
- The backend Docker build context is `backend/`, while ingestion reads the repository-level `gems/nenu_evaru/`; those files are not copied into the backend image, so container startup cannot populate the knowledge base unless the image/build context is changed.
