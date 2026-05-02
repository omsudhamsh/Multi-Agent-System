from fastapi import APIRouter, HTTPException, BackgroundTasks, Depends
from fastapi.responses import StreamingResponse
from typing import List
from app.schemas import Task, TaskCreate
from app.api.dependencies import (
    get_task_manager,
    get_task_executor,
    get_log_service
)
from app.services.task_manager import TaskManager
from app.services.task_executor import TaskExecutor
from app.services.log_service import LogService
import asyncio
import json

router = APIRouter()


@router.post("", response_model=Task)
async def create_task(
    task_data: TaskCreate,
    background_tasks: BackgroundTasks,
    task_manager: TaskManager = Depends(get_task_manager),
    task_executor: TaskExecutor = Depends(get_task_executor),
    log_service: LogService = Depends(get_log_service)
):
    """Create and start a new task."""
    # Create task
    task = await task_manager.create_task(task_data)
    
    # Start execution in background
    background_tasks.add_task(execute_task_background, task, task_manager, task_executor, log_service)
    
    return task


async def execute_task_background(
    task: Task,
    task_manager: TaskManager,
    task_executor: TaskExecutor,
    log_service: LogService
):
    """Execute task in background."""
    try:
        # Update to running
        await task_manager.update_task(
            task.id,
            status="running",
            progress=0,
            agents=["planner", "researcher", "developer", "tester", "reviewer", "memory"]
        )
        
        # Execute task
        result = await task_executor.execute_task(task)
        
        # Update task with results
        if result["success"]:
            await task_manager.update_task(
                task.id,
                status="completed",
                progress=100,
                confidence=result.get("confidence", 75)
            )
        else:
            await task_manager.update_task(
                task.id,
                status="failed",
                progress=0
            )
        
        # Store results
        await task_manager.store_task_result(task.id, result)
        
    except Exception as e:
        await log_service.add_log("error", "system", f"Task execution failed: {str(e)}")
        await task_manager.update_task(task.id, status="failed")


@router.get("", response_model=List[Task])
async def get_tasks(
    task_manager: TaskManager = Depends(get_task_manager)
):
    """Get all tasks."""
    return await task_manager.get_all_tasks()


@router.get("/{task_id}", response_model=Task)
async def get_task(
    task_id: str,
    task_manager: TaskManager = Depends(get_task_manager)
):
    """Get a specific task."""
    task = await task_manager.get_task(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@router.get("/{task_id}/result")
async def get_task_result(
    task_id: str,
    task_manager: TaskManager = Depends(get_task_manager)
):
    """Get task execution results."""
    result = await task_manager.get_task_result(task_id)
    if not result:
        raise HTTPException(status_code=404, detail="Task result not found")
    return result


@router.get("/{task_id}/stream")
async def stream_task_updates(
    task_id: str,
    task_manager: TaskManager = Depends(get_task_manager)
):
    """Stream task updates using Server-Sent Events."""
    
    async def event_generator():
        """Generate SSE events for task updates."""
        while True:
            task = await task_manager.get_task(task_id)
            if not task:
                break
            
            # Send task update
            data = json.dumps(task.model_dump())
            yield f"data: {data}\n\n"
            
            # Stop streaming if task is complete or failed
            if task.status in ["completed", "failed"]:
                break
            
            await asyncio.sleep(1)
    
    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream"
    )


@router.delete("/{task_id}")
async def delete_task(
    task_id: str,
    task_manager: TaskManager = Depends(get_task_manager)
):
    """Delete a task."""
    success = await task_manager.delete_task(task_id)
    if not success:
        raise HTTPException(status_code=404, detail="Task not found")
    return {"message": "Task deleted successfully"}
