# backend/app/models/session.py
import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, BigInteger, ForeignKey, DateTime, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database.base import Base # Points to your central declarative base module

class SessionModel(Base):
    __tablename__ = "sessions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    start_time = Column(BigInteger, nullable=False)
    end_time = Column(BigInteger, nullable=False)
    duration_ms = Column(Integer, nullable=False)
    processed_graph = Column(JSON, nullable=False)  # Stores direct structural JSON node matrices
    metrics = Column(JSON, nullable=False)          # Stores curiosity_score, fragmentation, etc.
    processing_time_ms = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationship to cleanly pull historical logs without manual database filtering loops
    events = relationship("EventModel", back_populates="session", cascade="all, delete-orphan")


class EventModel(Base):
    __tablename__ = "events"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id = Column(UUID(as_uuid=True), ForeignKey("sessions.id", ondelete="CASCADE"), nullable=False)
    url = Column(String, nullable=False)
    title = Column(String, nullable=False)
    domain = Column(String, nullable=False)
    timestamp = Column(BigInteger, nullable=False)
    time_spent_ms = Column(Integer, nullable=False)
    event_type = Column(String(20), nullable=False)

    session = relationship("SessionModel", back_populates="events")