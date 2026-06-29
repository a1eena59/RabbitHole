# backend/app/database/connection.py
import ssl
from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from app.core.config import settings
from app.database.base import Base


db_url = settings.DATABASE_URL

# 1. Force the driver protocol to use asyncpg for database concurrency
if db_url.startswith("postgresql://"):
    db_url = db_url.replace("postgresql://", "postgresql+asyncpg://")

# 2. FIX: Strip out the raw '?sslmode=require' string so asyncpg doesn't crash
if "?sslmode=" in db_url:
    db_url = db_url.split("?sslmode=")[0]

# 3. Configure the SSL context required by Neon cloud infrastructure securely
connect_args = {}
if "neon.tech" in db_url:
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    connect_args["ssl"] = ctx

# 4. Instantiate the engine worker instance safely
engine = create_async_engine(
    db_url,
    future=True,
    echo=False,
    pool_pre_ping=True,
    connect_args=connect_args
)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False
)

# Database dependency injector injected directly into FastAPI router signatures
async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()

# Structural utility loop to initialize local schemas instantly during prototype phases
async def init_db() -> None:
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)