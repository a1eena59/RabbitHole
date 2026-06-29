# backend/app/services/metrics.py
from typing import List, Dict, Any

class MetricsEngine:
    @staticmethod
    def calculate_session_analytics(analyzed_events: List[Dict[str, Any]], total_duration_ms: int) -> Dict[str, Any]:
        if not analyzed_events or total_duration_ms == 0:
            return {"curiosity_score": 0, "focus_score": 0, "total_clusters": 0}

        total_nodes = len(analyzed_events)
        unique_clusters = len(set(e["clusterId"] for e in analyzed_events))
        
        # Calculate deeper fragmentation penalties
        cluster_switches = 0
        for i in range(1, total_nodes):
            if analyzed_events[i]["clusterId"] != analyzed_events[i-1]["clusterId"]:
                cluster_switches += 1

        # 1. Focus Score: High values mean spending prolonged time on a single topic path
        # Decreases as user thrashes back and forth across unrelated cluster paths
        fragmentation_penalty = (cluster_switches / total_nodes) if total_nodes > 1 else 0
        focus_score = max(0, int((1.0 - fragmentation_penalty) * 100))

        # 2. Curiosity Score: Scales high when depth and exploration meet balanced bounds
        # Punishes staying inside only 1 node or thrashing meaninglessly across 40 blank pages
        base_exploration = (unique_clusters * 15) + (total_nodes * 2)
        curiosity_score = min(100, max(10, int(base_exploration * (1.0 - (fragmentation_penalty * 0.3)))))

        return {
            "curiosity_score": curiosity_score,
            "focus_score": focus_score,
            "total_clusters": unique_clusters,
            "total_nodes": total_nodes
        }