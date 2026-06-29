# backend/app/services/graph_builder.py
from typing import List, Dict, Any

class GraphBuilder:
    @staticmethod
    def generate_react_flow_matrix(analyzed_events: List[Dict[str, Any]]) -> Dict[str, Any]:
        nodes = []
        edges = []
        
        if not analyzed_events:
            return {"nodes": [], "edges": []}

        for idx, event in enumerate(analyzed_events):
            # 1. Clean Node Schema: Pure metadata, zero positioning, zero layout assumptions
            nodes.append({
                "id": event["id"],
                "data": {
                    "title": event["title"],
                    "url": event["url"],
                    "domain": event["domain"],
                    "timeSpent": event["timeSpent"],
                    "clusterId": event["clusterId"]
                }
            })

            # 2. Sequential Chronological Edges: Always connect Node (i-1) -> Node (i)
            if idx > 0:
                previous_event = analyzed_events[idx - 1]
                is_semantic_drift = previous_event["clusterId"] != event["clusterId"]

                edges.append({
                    "id": f"edge-{previous_event['id']}-{event['id']}",
                    "source": previous_event["id"],
                    "target": event["id"],
                    "drift": is_semantic_drift
                })
                
        return {"nodes": nodes, "edges": edges}