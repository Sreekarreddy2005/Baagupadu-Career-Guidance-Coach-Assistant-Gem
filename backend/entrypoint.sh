#!/bin/bash
set -e

echo "Running Database Migrations..."
python scripts/migrate_db.py

echo "Ingesting Knowledge Base..."
python scripts/ingest_knowledge_base.py

echo "Starting FastAPI server..."
exec uvicorn api:app --host 0.0.0.0 --port 8000
