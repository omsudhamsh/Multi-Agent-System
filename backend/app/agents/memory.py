from typing import Any, Dict
from app.agents.base import BaseAgent
from app.memory.store import MemoryStore
from app.core.logging import get_logger

logger = get_logger(__name__)


class MemoryAgent(BaseAgent):
    """Agent responsible for storing and retrieving context."""
    
    def __init__(self, memory_store: MemoryStore):
        super().__init__(
            agent_id="memory",
            name="Memory",
            role="Stores project context",
            icon="Brain"
        )
        self.memory = memory_store
    
    async def execute(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """Store task context in memory."""
        task_id = context.get("task_id", "")
        prompt = context.get("prompt", "")
        
        self.update_status("working", 0, "Indexing context")
        logger.info(f"Memory storing context for task: {task_id}")
        
        try:
            self.update_status("working", 40, "Processing information")
            
            # Store task context
            memory_entry = {
                "task_id": task_id,
                "prompt": prompt,
                "plan": context.get("plan", ""),
                "implementation": context.get("implementation", "")[:500],
                "confidence": context.get("confidence", 0)
            }
            
            await self.memory.store(task_id, memory_entry)
            
            self.update_status("working", 80, "Updating index")
            
            # Get memory stats
            stats = await self.memory.get_stats()
            
            self.update_status("completed", 100, f"Stored context entry",
                             f"Total entries: {stats['total']}")
            
            logger.info(f"Memory stored entry for task: {task_id}")
            
            return {
                "stored": True,
                "stats": stats,
                "agent": self.id
            }
            
        except Exception as e:
            logger.error(f"Memory error: {str(e)}")
            self.update_status("error", self.progress, f"Error: {str(e)}")
            raise
