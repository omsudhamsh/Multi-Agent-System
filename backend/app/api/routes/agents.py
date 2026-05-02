from fastapi import APIRouter, HTTPException, Depends
from typing import List
from app.api.dependencies import get_task_executor
from app.services.task_executor import TaskExecutor

router = APIRouter()


@router.get("")
async def get_agents(
    task_executor: TaskExecutor = Depends(get_task_executor)
):
    """Get all agents and their current status."""
    return task_executor.get_all_agents()


@router.get("/{agent_id}")
async def get_agent(
    agent_id: str,
    task_executor: TaskExecutor = Depends(get_task_executor)
):
    """Get a specific agent's status."""
    try:
        return task_executor.get_agent(agent_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
