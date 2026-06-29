# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.routes import session
from app.database.connection import init_db

app = FastAPI(title=settings.PROJECT_NAME, version="1.0.0")

# Enable Cross-Origin Resource Sharing (CORS) for local extensions and dashboards
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Expand cleanly into designated environment configurations during deployment 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database tables on server start up
@app.on_event("startup")
async def on_startup():
    await init_db()

# Wire operational routing trees
app.include_router(session.router, prefix=settings.API_V1_STR)

@app.get("/api/health", tags=["System"])
async def system_health_check():
    return {"status": "healthy", "engine": "FastAPI Vector Pipeline Active"}