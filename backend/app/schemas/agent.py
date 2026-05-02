from pydantic import BaseModel, Field
from typing import Literal


AgentStatus = Literal["idle", "working", "waiting", "error", "completed"]


class Agent(BaseModel):
    """Agent schema matching frontend expectations."""
    id: str
    name: str
    role: str
    status: AgentStatus = "idle"
    progress: int = Field(default=0, ge=0, le=100)
    lastAction: str = "Standing by"
    outputSnippet: str = "No output yet"
    icon: str


class AgentUpdate(BaseModel):
    """Schema for updating agent state."""
    status: AgentStatus | None = None
    progress: int | None = Field(default=None, ge=0, le=100)
    lastAction: str | None = None
    outputSnippet: str | None = None
