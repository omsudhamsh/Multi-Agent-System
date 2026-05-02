from typing import Dict, List, Optional
from datetime import datetime
from app.schemas import Task, TaskCreate, TaskStatus
from app.core.logging import get_logger
import uuid
import asyncio

logger = get_logger(__name__)


class TaskManager:
    """Manages task lifecycle and storage."""
    
    def __init__(self):
        self._tasks: Dict[str, Task] = {}
        self._task_results: Dict[str, Dict] = {}
        logger.info("Task manager initialized")
    
    async def create_task(self, task_data: TaskCreate) -> Task:
        """Create a new task."""
        task = Task(
            id=f"task-{uuid.uuid4().hex[:8]}",
            prompt=task_data.prompt,
            status="pending",
            progress=0,
            confidenceScore=0,
            createdAt=datetime.utcnow().isoformat() + "Z",
            agents=[]
        )
        
        self._tasks[task.id] = task
        logger.info(f"Created task: {task.id}")
        
        return task
    
    async def get_task(self, task_id: str) -> Optional[Task]:
        """Get a task by ID."""
        return self._tasks.get(task_id)
    
    async def get_all_tasks(self) -> List[Task]:
        """Get all tasks."""
        return list(self._tasks.values())
    
    async def update_task(
        self, 
        task_id: str, 
        status: TaskStatus = None,
        progress: int = None,
        confidence: int = None,
        agents: List[str] = None
    ) -> Optional[Task]:
        """Update task status."""
        task = self._tasks.get(task_id)
        if not task:
            return None
        
        if status:
            task.status = status
            if status == "completed":
                task.completedAt = datetime.utcnow().isoformat() + "Z"
        
        if progress is not None:
            task.progress = progress
        
        if confidence is not None:
            task.confidenceScore = confidence
        
        if agents is not None:
            task.agents = agents
        
        logger.info(f"Updated task {task_id}: status={status}, progress={progress}")
        
        return task
    
    async def store_task_result(self, task_id: str, result: Dict) -> None:
        """Store task execution results."""
        self._task_results[task_id] = result
        logger.info(f"Stored results for task: {task_id}")
    
    async def get_task_result(self, task_id: str) -> Optional[Dict]:
        """Get task execution results."""
        return self._task_results.get(task_id)
    
    async def delete_task(self, task_id: str) -> bool:
        """Delete a task."""
        if task_id in self._tasks:
            del self._tasks[task_id]
            if task_id in self._task_results:
                del self._task_results[task_id]
            logger.info(f"Deleted task: {task_id}")
            return True
        return False
