from sqlalchemy import Column, String, DateTime, ForeignKey, JSON, Integer, Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from pgvector.sqlalchemy import Vector
from backend.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String(255), primary_key=True, index=True) # Clerk user_id
    email = Column(String(255), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    last_login = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    conversations = relationship("Conversation", back_populates="user", cascade="all, delete-orphan")


class Conversation(Base):
    __tablename__ = "conversations"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(String(255), ForeignKey("users.id"))
    start_time = Column(DateTime(timezone=True), server_default=func.now())
    end_time = Column(DateTime(timezone=True), nullable=True)
    
    user = relationship("User", back_populates="conversations")
    messages = relationship("Message", back_populates="conversation", cascade="all, delete-orphan", order_by="Message.timestamp")
    profile_state = relationship("ProfileState", back_populates="conversation", uselist=False, cascade="all, delete-orphan")
    long_term_memories = relationship("LongTermMemory", back_populates="conversation", cascade="all, delete-orphan")


class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, autoincrement=True)
    conversation_id = Column(Integer, ForeignKey("conversations.id"))
    role = Column(String(50)) # 'user', 'ai', 'system'
    content = Column(Text)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    
    conversation = relationship("Conversation", back_populates="messages")


class ProfileState(Base):
    """
    Stores UI-specific tracking states like phase progress and generated roadmaps.
    This replaces the old massive JSON blob, pushing memory/context to Vector/Message tables.
    """
    __tablename__ = "profile_state"

    conversation_id = Column(Integer, ForeignKey("conversations.id"), primary_key=True)
    
    session_progress = Column(JSON, default=dict)
    life_stage_data = Column(JSON, default=dict)
    persona = Column(JSON, default=dict)
    guidance = Column(JSON, default=dict)
    
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    conversation = relationship("Conversation", back_populates="profile_state")


class LongTermMemory(Base):
    """
    Stores extracted behavioral patterns and insights as vectorized embeddings.
    """
    __tablename__ = "long_term_memory"

    id = Column(Integer, primary_key=True, autoincrement=True)
    conversation_id = Column(Integer, ForeignKey("conversations.id"), index=True)
    
    memory_type = Column(String(100)) # e.g., 'childhood_insight', 'career_pattern', 'user_preference'
    content = Column(Text) # The actual insight text
    
    # all-MiniLM-L6-v2 produces 384-dimensional embeddings
    embedding = Column(Vector(384))
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    conversation = relationship("Conversation", back_populates="long_term_memories")


class KnowledgeBaseChunk(Base):
    """
    Stores embedded chunks of the Markdown rules and JSON question banks for RAG.
    """
    __tablename__ = "knowledge_base_chunks"

    id = Column(Integer, primary_key=True, autoincrement=True)
    source_file = Column(String(255), index=True) # e.g., 'router.md', 'childhood_questions.json'
    chunk_index = Column(Integer)
    content = Column(Text)
    
    # all-MiniLM-L6-v2 produces 384-dimensional embeddings
    embedding = Column(Vector(384))
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
