from typing import Any, Dict
from app.agents.base import BaseAgent
from app.tools.registry import ToolRegistry
from app.core.logging import get_logger

logger = get_logger(__name__)


class ToolAgent(BaseAgent):
    """Agent responsible for executing tools and plugins."""
    
    def __init__(self, tool_registry: ToolRegistry):
        super().__init__(
            agent_id="tools",
            name="Tools",
            role="Connects plugins and actions",
            icon="Wrench"
        )
        self.tools = tool_registry
    
    async def execute(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """Execute requested tools."""
        tool_name = context.get("tool_name", "")
        tool_params = context.get("tool_params", {})
        
        self.update_status("working", 0, f"Preparing {tool_name}")
        logger.info(f"Tools executing: {tool_name}")
        
        try:
            self.update_status("working", 40, f"Running {tool_name}")
            
            # Execute tool
            result = await self.tools.execute(tool_name, tool_params)
            
            self.update_status("working", 80, "Processing results")
            
            self.update_status("completed", 100, f"Executed {tool_name}",
                             str(result)[:200])
            
            logger.info(f"Tools completed: {tool_name}")
            
            return {
                "toolName": tool_name,
                "result": result,
                "agent": self.id
            }
            
        except Exception as e:
            logger.error(f"Tools error: {str(e)}")
            self.update_status("error", self.progress, f"Error: {str(e)}")
            raise
