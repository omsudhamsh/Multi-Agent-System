from pydantic import BaseModel, Field
from typing import Literal, List
from datetime import datetime


TaskStatus = Literal["pending", "running", "completed", "failed"]


class TaskCreate(BaseModel):
    """Schema for creating a new task."""
    prompt: str = Field(..., min_length=1, max_length=2000)


class Task(BaseModel):
    """Task schema matching frontend expectations."""
    id: str
    prompt: str
    status: TaskStatus
    progress: int = Field(default=0, ge=0, le=100)
    confidenceScore: int = Field(default=0, ge=0, le=100)
    createdAt: str
    completedAt: str | None = None
    agents: List[str] = Field(default_factory=list)


class TaskUpdate(BaseModel):
    """Schema for task updates during execution."""
    status: TaskStatus | None = None
    progress: int | None = Field(default=None, ge=0, le=100)
    confidenceScore: int | None = Field(default=None, ge=0, le=100)
    completedAt: str | None = None
