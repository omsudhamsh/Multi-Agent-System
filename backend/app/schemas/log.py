from pydantic import BaseModel
from typing import Literal


LogLevel = Literal["info", "warning", "error", "debug"]


class LogEntry(BaseModel):
    """Log entry schema matching frontend expectations."""
    id: str
    timestamp: str
    level: LogLevel
    agent: str
    message: str


class TimelineEvent(BaseModel):
    """Timeline event schema matching frontend expectations."""
    id: str
    agentId: str
    agentName: str
    action: str
    timestamp: str
    status: Literal["completed", "running", "pending"]
