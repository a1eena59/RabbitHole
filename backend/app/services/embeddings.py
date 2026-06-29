# backend/app/services/embeddings.py
import asyncio
from typing import List
from sentence_transformers import SentenceTransformer
from app.core.config import settings

class EmbeddingEngine:
    _model = None

    @classmethod
    def get_model(cls):
        if cls._model is None:
            # Lazy load the weights framework into host memory exactly when requested
            cls._model = SentenceTransformer(settings.EMBEDDING_MODEL_NAME)
        return cls._model

    @classmethod
    async def get_embeddings(cls, texts: List[str]) -> List[List[float]]:
        if not texts:
            return []
        
        # Offload intensive tensor operations to an execution thread pool to protect FastAPI runtime loops
        loop = asyncio.get_running_loop()
        model = cls.get_model()
        
        embeddings = await loop.run_in_executor(
            None, 
            lambda: model.encode(texts, convert_to_numpy=True).tolist()
        )
        return embeddings