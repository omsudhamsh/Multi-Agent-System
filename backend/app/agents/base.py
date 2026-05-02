from abc import ABC, abstractmethod
from typing import Any, Dict
from app.schemas import AgentStatus


class BaseAgent(ABC):
    """Base class for all agents."""
    
    def __init__(self, agent_id: str, name: str, role: str, icon: str):
        self.id = agent_id
        self.name = name
        self.role = role
        self.icon = icon
        self.status: AgentStatus = "idle"
        self.progress: int = 0
        self.last_action: str = "Standing by"
        self.output_snippet: str = "No output yet"
    
    @abstractmethod
    async def execute(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """Execute the agent's task."""
        pass
    
    def update_status(self, status: AgentStatus, progress: int = None, 
                     action: str = None, output: str = None) -> None:
        """Update agent state."""
        self.status = status
        if progress is not None:
            self.progress = progress
        if action:
            self.last_action = action
        if output:
            self.output_snippet = output
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert agent to dictionary."""
        return {
            "id": self.id,
            "name": self.name,
            "role": self.role,
            "status": self.status,
            "progress": self.progress,
            "lastAction": self.last_action,
            "outputSnippet": self.output_snippet,
            "icon": self.icon
        }
