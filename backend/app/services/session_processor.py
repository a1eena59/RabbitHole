# backend/app/services/session_processor.py
import time
from typing import Dict, Any
from app.schemas.session import SessionPayloadSchema
from app.services.embeddings import EmbeddingEngine
from app.services.rabbit_hole import RabbitHoleDetector
from app.services.graph_builder import GraphBuilder
from app.services.metrics import MetricsEngine

class SessionProcessor:
    @staticmethod
    async def process_raw_telemetry(payload: SessionPayloadSchema) -> Dict[str, Any]:
        start_processing_time = time.time()
        
        # 1. Extract titles for embedding generation
        titles = [f"{event.title} {event.domain}" for event in payload.events]
        
        # 2. Vectorize Context Elements asynchronously
        embeddings = await EmbeddingEngine.get_embeddings(titles)
        
        # 3. Detect Cluster Shifts
        analyzed_events = RabbitHoleDetector.analyze_session_drifts(payload.events, embeddings)
        
        # 4. Synthesize Flow Node Matrices
        graph_data = GraphBuilder.generate_react_flow_matrix(analyzed_events)
        
        # 5. Extract Analytics
        metrics_data = MetricsEngine.calculate_session_analytics(analyzed_events, payload.duration)
        
        processing_delta_ms = int((time.time() - start_processing_time) * 1000)
        
        return {
            "processed_graph": graph_data,
            "metrics": metrics_data,
            "processing_time_ms": processing_delta_ms,
            "analyzed_events": analyzed_events
        }