import asyncio
from typing import Dict, Any, List
from datetime import datetime
from app.schemas import Task, TaskStatus
from app.agents import (
    PlannerAgent, DeveloperAgent, ResearcherAgent,
    TesterAgent, ReviewerAgent, MemoryAgent
)
from app.services.log_service import LogService
from app.core.logging import get_logger

logger = get_logger(__name__)


class TaskExecutor:
    """Orchestrates multi-agent task execution."""
    
    def __init__(
        self,
        planner: PlannerAgent,
        developer: DeveloperAgent,
        researcher: ResearcherAgent,
        tester: TesterAgent,
        reviewer: ReviewerAgent,
        memory: MemoryAgent,
        log_service: LogService
    ):
        self.planner = planner
        self.developer = developer
        self.researcher = researcher
        self.tester = tester
        self.reviewer = reviewer
        self.memory = memory
        self.log_service = log_service
        
        self.agents = {
            "planner": planner,
            "developer": developer,
            "researcher": researcher,
            "tester": tester,
            "reviewer": reviewer,
            "memory": memory
        }
    
    async def execute_task(self, task: Task) -> Dict[str, Any]:
        """Execute a task using multiple agents."""
        logger.info(f"Starting task execution: {task.id}")
        
        context = {
            "task_id": task.id,
            "prompt": task.prompt
        }
        
        results = {}
        
        try:
            # Step 1: Planning
            await self.log_service.add_log("info", "planner", "Starting task analysis")
            plan_result = await self.planner.execute(context)
            context.update(plan_result)
            results["plan"] = plan_result
            await self.log_service.add_timeline_event(
                "planner", "Planner", "Created execution plan", "completed"
            )
            
            # Step 2: Research
            await self.log_service.add_log("info", "researcher", "Gathering information")
            research_result = await self.researcher.execute(context)
            context.update(research_result)
            results["research"] = research_result
            await self.log_service.add_timeline_event(
                "researcher", "Researcher", "Compiled research findings", "completed"
            )
            
            # Step 3: Development
            await self.log_service.add_log("info", "developer", "Starting implementation")
            dev_result = await self.developer.execute(context)
            context.update(dev_result)
            results["development"] = dev_result
            await self.log_service.add_timeline_event(
                "developer", "Developer", "Implementation complete", "completed"
            )
            
            # Step 4: Testing
            await self.log_service.add_log("info", "tester", "Running validation")
            test_result = await self.tester.execute(context)
            context.update(test_result)
            results["testing"] = test_result
            await self.log_service.add_timeline_event(
                "tester", "Tester", "Validation complete", "completed"
            )
            
            # Step 5: Review
            await self.log_service.add_log("info", "reviewer", "Finalizing review")
            review_result = await self.reviewer.execute(context)
            context.update(review_result)
            results["review"] = review_result
            await self.log_service.add_timeline_event(
                "reviewer", "Reviewer", "Review complete", "completed"
            )
            
            # Step 6: Memory (if enabled)
            await self.log_service.add_log("info", "memory", "Storing context")
            memory_result = await self.memory.execute(context)
            results["memory"] = memory_result
            
            logger.info(f"Task execution completed: {task.id}")
            
            return {
                "success": True,
                "results": results,
                "confidence": context.get("confidence", 75)
            }
            
        except Exception as e:
            logger.error(f"Task execution failed: {str(e)}")
            await self.log_service.add_log("error", "system", f"Task failed: {str(e)}")
            return {
                "success": False,
                "error": str(e),
                "results": results
            }
    
    def get_all_agents(self) -> List[Dict[str, Any]]:
        """Get all agent states."""
        return [agent.to_dict() for agent in self.agents.values()]
    
    def get_agent(self, agent_id: str) -> Dict[str, Any]:
        """Get specific agent state."""
        agent = self.agents.get(agent_id)
        if not agent:
            raise ValueError(f"Agent not found: {agent_id}")
        return agent.to_dict()
