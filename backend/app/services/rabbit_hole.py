# backend/app/services/rabbit_hole.py
import numpy as np
from typing import List, Dict, Any
from sklearn.cluster import DBSCAN
from app.schemas.session import EventCreateSchema

class RabbitHoleDetector:
    @staticmethod
    def analyze_session_drifts(events: List[EventCreateSchema], embeddings: List[List[float]]) -> List[Dict[str, Any]]:
        if not events or len(events) != len(embeddings):
            return []

        # 1. Convert embeddings matrix to a raw numpy array for scikit-learn
        X = np.array(embeddings)

        # 2. Configure DBSCAN
        # eps: Maximum distance between two samples for one to be considered as in the neighborhood of the other.
        # min_samples: The number of samples in a neighborhood for a point to be considered as a core point.
        # metric='cosine': Perfect for semantic sentence embeddings.
        dbscan = DBSCAN(eps=0.32, min_samples=2, metric='cosine')
        cluster_labels = dbscan.fit_predict(X)

        analyzed_events = []
        
        # 3. Map cluster outputs back to raw telemetry items
        for idx, event in enumerate(events):
            event_dict = event.model_dump()
            label = int(cluster_labels[idx])
            
            # DBSCAN assigns '-1' to elements that don't fit into any dense cluster (Noise/Outliers)
            if label == -1:
                event_dict["clusterId"] = -1
                event_dict["similarityToCentroid"] = 0.0  # Outlier indicator
            else:
                event_dict["clusterId"] = label
                
                # Calculate relative distance to its structural cluster neighbors
                cluster_mask = (cluster_labels == label)
                cluster_vectors = X[cluster_mask]
                centroid = np.mean(cluster_vectors, axis=0)
                
                # Compute exact cosine similarity to the cluster center core
                dot = np.dot(X[idx], centroid)
                norm1, norm2 = np.linalg.norm(X[idx]), np.linalg.norm(centroid)
                similarity = float(dot / (norm1 * norm2)) if norm1 and norm2 else 0.0
                event_dict["similarityToCentroid"] = round(similarity, 2)

            analyzed_events.append(event_dict)
            
        return analyzed_events