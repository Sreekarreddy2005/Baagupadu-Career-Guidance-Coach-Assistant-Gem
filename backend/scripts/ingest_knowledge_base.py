import os
import sys
import json
import asyncio
from pathlib import Path

# Add backend's parent to path so 'from backend...' works
backend_dir = Path(__file__).parent.parent
sys.path.append(str(backend_dir.parent))
sys.path.append(str(backend_dir))

from database import AsyncSessionLocal, engine, Base
from models import KnowledgeBaseChunk
from sentence_transformers import SentenceTransformer

# Load the embedding model (same as used for LongTermMemory)
print("Loading embedding model...")
embedder = SentenceTransformer("nomic-ai/nomic-embed-text-v1.5", trust_remote_code=True)
print("Model loaded.")

GEMS_DIR = backend_dir.parent / "gems" / "nenu_evaru"

async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

def chunk_markdown(content: str) -> list[dict]:
    """Splits markdown strictly by Headers, regardless of word count."""
    chunks = []
    current_header = "General"
    current_text = ""
    
    for line in content.split('\n'):
        if line.startswith('#'):
            if current_text.strip():
                chunks.append({"header_step": current_header, "content": f"{current_header}\n{current_text.strip()}"})
            current_header = line.strip()
            current_text = ""
        else:
            current_text += line + "\n"
            
    if current_text.strip():
        chunks.append({"header_step": current_header, "content": f"{current_header}\n{current_text.strip()}"})
            
    return chunks

def chunk_json(data: dict | list, parent_key="") -> list[dict]:
    """Converts JSON structure into readable text chunks with metadata."""
    chunks = []
    
    if isinstance(data, dict):
        for key, value in data.items():
            if isinstance(value, (dict, list)):
                chunks.extend(chunk_json(value, key))
            else:
                chunks.append({"header_step": parent_key or "JSON Data", "content": f"{parent_key + ' - ' if parent_key else ''}{key}: {value}"})
    elif isinstance(data, list):
        for item in data:
            if isinstance(item, (dict, list)):
                chunks.extend(chunk_json(item, parent_key))
            else:
                chunks.append({"header_step": parent_key or "JSON List", "content": f"{parent_key}: {item}"})
                
    return chunks

async def ingest():
    await init_db()
    
    async with AsyncSessionLocal() as session:
        # Clear existing chunks to avoid duplicates if re-run
        await session.execute(KnowledgeBaseChunk.__table__.delete())
        
        directories = ['frameworks', 'inference', 'memory', 'output', 'prompts', 'question_banks']
        
        total_chunks = 0
        for dir_name in directories:
            dir_path = GEMS_DIR / dir_name
            if not dir_path.exists():
                continue
                
            for filepath in dir_path.glob("*"):
                if not filepath.is_file():
                    continue
                    
                # Skip system_prompt and efficient_persona_engine as they are base prompt files
                if filepath.name in ["system_prompt.md", "efficient_persona_engine.md"]:
                    continue
                    
                print(f"Processing {filepath.name}...")
                
                try:
                    with open(filepath, 'r', encoding='utf-8') as f:
                        content = f.read()
                        
                    chunks = []
                    if filepath.suffix == '.md':
                        chunks = chunk_markdown(content)
                    elif filepath.suffix == '.json':
                        try:
                            data = json.loads(content)
                            chunks = chunk_json(data)
                            # Re-group small json chunks into slightly larger semantic blocks
                            grouped = []
                            curr_header = "JSON Data"
                            curr_content = ""
                            for c in chunks:
                                if len(curr_content.split()) + len(c["content"].split()) > 50:
                                    grouped.append({"header_step": curr_header, "content": curr_content})
                                    curr_content = c["content"]
                                    curr_header = c["header_step"]
                                else:
                                    curr_content += "\n" + c["content"] if curr_content else c["content"]
                            if curr_content: grouped.append({"header_step": curr_header, "content": curr_content})
                            chunks = grouped
                        except json.JSONDecodeError:
                            print(f"Failed to parse JSON in {filepath.name}")
                            
                    if not chunks:
                        continue
                        
                    print(f"  -> Extracted {len(chunks)} chunks. Embedding...")
                    
                    # Determine Phase
                    phase = "general"
                    name_lower = filepath.name.lower()
                    if "childhood" in name_lower: phase = "childhood"
                    elif "teenage" in name_lower: phase = "teenage"
                    elif "adult" in name_lower: phase = "adult"
                    elif "trust" in name_lower: phase = "trust"
                    elif "exploration" in name_lower: phase = "exploration"
                    elif "guardrails" in name_lower: phase = "guardrails"
                    
                    # Batch embed for speed
                    texts = [c["content"] for c in chunks]
                    embeddings = embedder.encode(texts).tolist()
                    
                    db_chunks = []
                    for i, (chunk_dict, emb) in enumerate(zip(chunks, embeddings)):
                        if not chunk_dict["content"].strip(): continue
                        db_chunks.append(KnowledgeBaseChunk(
                            source_file=filepath.name,
                            phase=phase,
                            header_step=chunk_dict["header_step"][:255],
                            chunk_index=i,
                            content=chunk_dict["content"],
                            embedding=emb
                        ))
                    
                    session.add_all(db_chunks)
                    await session.commit()
                    total_chunks += len(db_chunks)
                    
                except Exception as e:
                    print(f"Error processing {filepath.name}: {e}")
                    
        print(f"✅ Ingestion complete. Stored {total_chunks} vector chunks in the database.")

if __name__ == "__main__":
    asyncio.run(ingest())
