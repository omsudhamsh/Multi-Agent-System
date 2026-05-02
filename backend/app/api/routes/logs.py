from fastapi import APIRouter, Depends, Query
from typing import List
from app.schemas import LogEntry, TimelineEvent
from app.api.dependencies import get_log_service
from app.services.log_service import LogService

router = APIRouter()


@router.get("", response_model=List[LogEntry])
async def get_logs(
    level: str = Query(default="all", description="Filter by log level"),
    limit: int = Query(default=100, ge=1, le=1000),
    log_service: LogService = Depends(get_log_service)
):
    """Get logs with optional filtering."""
    return await log_service.get_logs(level=level, limit=limit)


@router.get("/timeline", response_model=List[TimelineEvent])
async def get_timeline(
    limit: int = Query(default=50, ge=1, le=100),
    log_service: LogService = Depends(get_log_service)
):
    """Get timeline events."""
    return await log_service.get_timeline(limit=limit)


@router.delete("")
async def clear_logs(
    log_service: LogService = Depends(get_log_service)
):
    """Clear all logs."""
    await log_service.clear_logs()
    return {"message": "Logs cleared successfully"}


@router.delete("/timeline")
async def clear_timeline(
    log_service: LogService = Depends(get_log_service)
):
    """Clear timeline events."""
    await log_service.clear_timeline()
    return {"message": "Timeline cleared successfully"}
