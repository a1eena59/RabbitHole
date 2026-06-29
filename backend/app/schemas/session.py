# backend/app/app/schemas/session.py
from pydantic import BaseModel, Field
from typing import List, Optional

class EventCreateSchema(BaseModel):
    id: str
    url: str
    title: str
    domain: str
    timestamp: int
    timeSpent: int = Field(..., alias="timeSpent") # Intercepts extension's camelCase mapping
    tabId: int = Field(..., alias="tabId")
    eventType: str = Field(..., alias="eventType")
    referrer: Optional[str] = None

    class Config:
        # Allows handling incoming payloads via camelCase while letting Python write snake_case internally
        populate_by_name = True 

class SessionPayloadSchema(BaseModel):
    startTime: int = Field(..., alias="startTime")
    endTime: int = Field(..., alias="endTime")
    duration: int
    events: List[EventCreateSchema]

    class Config:
        populate_by_name = True

class SessionResponseSchema(BaseModel):
    sessionId: str = Field(..., alias="sessionId")
    
    class Config:
        populate_by_name = True