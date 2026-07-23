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
embedder = SentenceTransformer('all-MiniLM-L6-v2')
print("Model loaded.")

GEMS_DIR = backend_dir.parent / "gems" / "nenu_evaru"

async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

def chunk_markdown(content: str, max_words=100) -> list[str]:
    """Splits markdown intelligently by Headers, preserving semantic context."""
    chunks = []
    current_header = ""
    current_text = ""
    
    for line in content.split('\n'):
        if line.startswith('#'):
            # Save accumulated text under the old header
            if current_text.strip():
                combined_len = len((current_header + " " + current_text).split())
                if combined_len > max_words:
                    # Too big, split by paragraphs while preserving header
                    paras = current_text.split('\n\n')
                    sub_chunk = ""
                    for p in paras:
                        if len(sub_chunk.split()) + len(p.split()) > max_words:
                            if sub_chunk: chunks.append(f"{current_header}\n{sub_chunk.strip()}".strip())
                            sub_chunk = p
                        else:
                            sub_chunk += "\n\n" + p if sub_chunk else p
                    if sub_chunk: chunks.append(f"{current_header}\n{sub_chunk.strip()}".strip())
                else:
                    chunks.append(f"{current_header}\n{current_text.strip()}".strip())
            
            # Start new header
            current_header = line.strip()
            current_text = ""
        else:
            current_text += line + "\n"
            
    # Flush remaining text
    if current_text.strip():
        combined_len = len((current_header + " " + current_text).split())
        if combined_len > max_words:
            paras = current_text.split('\n\n')
            sub_chunk = ""
            for p in paras:
                if len(sub_chunk.split()) + len(p.split()) > max_words:
                    if sub_chunk: chunks.append(f"{current_header}\n{sub_chunk.strip()}".strip())
                    sub_chunk = p
                else:
                    sub_chunk += "\n\n" + p if sub_chunk else p
            if sub_chunk: chunks.append(f"{current_header}\n{sub_chunk.strip()}".strip())
        else:
            chunks.append(f"{current_header}\n{current_text.strip()}".strip())
            
    return chunks

def chunk_json(data: dict | list, parent_key="") -> list[str]:
    """Converts JSON structure into readable text chunks."""
    chunks = []
    
    if isinstance(data, dict):
        for key, value in data.items():
            if isinstance(value, (dict, list)):
                chunks.extend(chunk_json(value, key))
            else:
                chunks.append(f"{parent_key + ' - ' if parent_key else ''}{key}: {value}")
    elif isinstance(data, list):
        for item in data:
            if isinstance(item, (dict, list)):
                chunks.extend(chunk_json(item, parent_key))
            else:
                chunks.append(f"{parent_key}: {item}")
                
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
                            curr = ""
                            for c in chunks:
                                if len(curr.split()) + len(c.split()) > 50:
                                    grouped.append(curr)
                                    curr = c
                                else:
                                    curr += "\n" + c if curr else c
                            if curr: grouped.append(curr)
                            chunks = grouped
                        except json.JSONDecodeError:
                            print(f"Failed to parse JSON in {filepath.name}")
                            
                    if not chunks:
                        continue
                        
                    print(f"  -> Extracted {len(chunks)} chunks. Embedding...")
                    
                    # Batch embed for speed
                    embeddings = embedder.encode(chunks).tolist()
                    
                    db_chunks = []
                    for i, (chunk_text, emb) in enumerate(zip(chunks, embeddings)):
                        if not chunk_text.strip(): continue
                        db_chunks.append(KnowledgeBaseChunk(
                            source_file=filepath.name,
                            chunk_index=i,
                            content=chunk_text,
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
