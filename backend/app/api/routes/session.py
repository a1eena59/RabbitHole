# backend/app/api/routes/session.py
import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database.connection import get_db
from app.models.session import SessionModel, EventModel
from app.schemas.session import SessionPayloadSchema, SessionResponseSchema

router = APIRouter(prefix="/session", tags=["Sessions"])

@router.post("", response_model=SessionResponseSchema, status_code=status.HTTP_201_CREATED)
async def ingest_browsing_session(payload: SessionPayloadSchema, db: AsyncSession = Depends(get_db)):
    if not payload.events:
        raise HTTPException(status_code=400, detail="Cannot process an empty session recording profile.")

    # 1. ENFORCE GRAPH CLEANLINESS: Filter down to meaningful navigational actions only
    # Removes high-frequency noisy clutter like 'tab_switch' before running clustering math
    meaningful_events = [
        event for event in payload.events 
        if event.eventType in ("page_load", "tab_open", "back_forward")
    ]

    if not meaningful_events:
        raise HTTPException(
            status_code=400, 
            detail="No meaningful navigational milestones found after filtering out runtime noise."
        )

    # 2. Re-instantiate the verified schema payload contract mapping cleanly
    filtered_payload = payload.model_copy(update={"events": meaningful_events})

    from app.services.session_processor import SessionProcessor
    
    # 3. Execute Vectorization, DBSCAN Clustering, and Graph-Edge calculations
    pipeline_results = await SessionProcessor.process_raw_telemetry(filtered_payload)
    
    # 4. Save the parent session metrics framework to Neon PostgreSQL
    new_session = SessionModel(
        id=uuid.uuid4(),
        start_time=filtered_payload.startTime,
        end_time=filtered_payload.endTime,
        duration_ms=filtered_payload.duration,
        processed_graph=pipeline_results["processed_graph"],
        metrics=pipeline_results["metrics"],
        processing_time_ms=pipeline_results["processing_time_ms"]
    )
    
    db.add(new_session)
    
    # 5. Store separate historical lookup log elements matching your database configurations
    for event in pipeline_results["analyzed_events"]:
        db.add(EventModel(
            id=uuid.UUID(event["id"]),
            session_id=new_session.id,
            url=event["url"],
            title=event["title"],
            domain=event["domain"],
            timestamp=event["timestamp"],
            time_spent_ms=event["timeSpent"],
            event_type=event["eventType"]  # Correctly retains original string type without breaking schemas
        ))
        
    await db.flush()
    return {"sessionId": str(new_session.id)}

@router.get("/{session_id}")
async def get_processed_session(session_id: str, db: AsyncSession = Depends(get_db)):
    try:
        session_uuid = uuid.UUID(session_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Malformed unique session identity structure.")
        
    result = await db.execute(select(SessionModel).where(SessionModel.id == session_uuid))
    session_record = result.scalar_one_or_none()
    
    if not session_record:
        raise HTTPException(status_code=404, detail="Requested browsing graph path profile not found.")
        
    return {
        "sessionId": str(session_record.id),
        "startTime": session_record.start_time,
        "endTime": session_record.end_time,
        "durationMs": session_record.duration_ms,
        "graph": session_record.processed_graph,
        "metrics": session_record.metrics,
        "processingTimeMs": session_record.processing_time_ms
    }