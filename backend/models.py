from sqlalchemy import Column, String, DateTime, ForeignKey, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from backend.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String(255), primary_key=True, index=True) # Clerk user_id
    email = Column(String(255), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    last_login = Column(DateTime(timezone=True), onupdate=func.now())

    profile = relationship("UserProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")


class UserProfile(Base):
    __tablename__ = "user_profiles"

    user_id = Column(String(255), ForeignKey("users.id"), primary_key=True)
    
    # Store the complex, deeply nested JSON objects directly
    session_progress = Column(JSON, default=dict)
    life_stage_data = Column(JSON, default=dict)
    inferences = Column(JSON, default=dict)
    patterns = Column(JSON, default=dict)
    persona = Column(JSON, default=dict)
    guidance = Column(JSON, default=dict)
    conversation_memory = Column(JSON, default=dict)
    
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("User", back_populates="profile")
