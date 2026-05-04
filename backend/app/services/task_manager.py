from typing import Dict, List, Optional
from datetime import datetime
from app.schemas import Task, TaskCreate, TaskStatus
from app.core.logging import get_logger
from app.db.database import AsyncSessionLocal
from app.db.models import TaskModel, TaskResultModel
import uuid
import json

logger = get_logger(__name__)

class TaskManager:
    """Manages task lifecycle and storage using SQLite."""
    
    def __init__(self):
        logger.info("Task manager initialized with SQLite")
    
    async def create_task(self, task_data: TaskCreate, user_id: str = "guest") -> Task:
        """Create a new task in the database."""
        task_id = f"task-{uuid.uuid4().hex[:8]}"
        created_at = datetime.utcnow().isoformat() + "Z"
        
        async with AsyncSessionLocal() as session:
            db_task = TaskModel(
                id=task_id,
                user_id=user_id,
                prompt=task_data.prompt,
                status="pending",
                progress=0,
                confidenceScore=0,
                createdAt=created_at,
                agents=[]
            )
            session.add(db_task)
            await session.commit()
            
            return Task(
                id=task_id,
                prompt=task_data.prompt,
                status="pending",
                progress=0,
                confidenceScore=0,
                createdAt=created_at,
                agents=[]
            )
    
    async def get_task(self, task_id: str) -> Optional[Task]:
        """Get a task by ID."""
        async with AsyncSessionLocal() as session:
            db_task = await session.get(TaskModel, task_id)
            if not db_task:
                return None
            return Task(
                id=db_task.id,
                prompt=db_task.prompt,
                status=db_task.status,
                progress=db_task.progress,
                confidenceScore=db_task.confidenceScore,
                createdAt=db_task.createdAt,
                completedAt=db_task.completedAt,
                agents=db_task.agents or []
            )
    
    async def get_all_tasks(self, user_id: str = "guest") -> List[Task]:
        """Get all tasks for a specific user."""
        from sqlalchemy import select
        async with AsyncSessionLocal() as session:
            stmt = select(TaskModel).where(TaskModel.user_id == user_id).order_by(TaskModel.createdAt.desc())
            result = await session.execute(stmt)
            tasks = result.scalars().all()
            
            return [
                Task(
                    id=t.id,
                    prompt=t.prompt,
                    status=t.status,
                    progress=t.progress,
                    confidenceScore=t.confidenceScore,
                    createdAt=t.createdAt,
                    completedAt=t.completedAt,
                    agents=t.agents or []
                ) for t in tasks
            ]
    
    async def update_task(
        self, 
        task_id: str, 
        status: TaskStatus = None,
        progress: int = None,
        confidence: int = None,
        agents: List[str] = None
    ) -> Optional[Task]:
        """Update task status in the database."""
        async with AsyncSessionLocal() as session:
            db_task = await session.get(TaskModel, task_id)
            if not db_task:
                return None
            
            if status:
                db_task.status = status
                if status == "completed":
                    db_task.completedAt = datetime.utcnow().isoformat() + "Z"
            
            if progress is not None:
                db_task.progress = progress
            
            if confidence is not None:
                db_task.confidenceScore = confidence
            
            if agents is not None:
                db_task.agents = agents
            
            await session.commit()
            await session.refresh(db_task)
            
            logger.info(f"Updated task {task_id}: status={status}, progress={progress}")
            
            return Task(
                id=db_task.id,
                prompt=db_task.prompt,
                status=db_task.status,
                progress=db_task.progress,
                confidenceScore=db_task.confidenceScore,
                createdAt=db_task.createdAt,
                completedAt=db_task.completedAt,
                agents=db_task.agents or []
            )
    
    async def store_task_result(self, task_id: str, result: Dict) -> None:
        """Store task execution results in database."""
        async with AsyncSessionLocal() as session:
            db_result = TaskResultModel(
                task_id=task_id,
                results=result
            )
            session.add(db_result)
            await session.commit()
            logger.info(f"Stored results for task: {task_id}")
    
    async def get_task_result(self, task_id: str) -> Optional[Dict]:
        """Get task execution results from database."""
        from sqlalchemy import select
        async with AsyncSessionLocal() as session:
            stmt = select(TaskResultModel).where(TaskResultModel.task_id == task_id)
            result = await session.execute(stmt)
            db_result = result.scalar_one_or_none()
            if not db_result:
                return None
            return db_result.results
    
    async def delete_task(self, task_id: str) -> bool:
        """Delete a task and its results from the database."""
        from sqlalchemy import delete
        async with AsyncSessionLocal() as session:
            db_task = await session.get(TaskModel, task_id)
            if db_task:
                # Delete results first due to FK
                await session.execute(delete(TaskResultModel).where(TaskResultModel.task_id == task_id))
                await session.delete(db_task)
                await session.commit()
                logger.info(f"Deleted task: {task_id}")
                return True
            return False
