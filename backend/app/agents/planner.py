from typing import Any, Dict, List
from app.agents.base import BaseAgent
from app.services.gemini import GeminiService
from app.core.logging import get_logger

logger = get_logger(__name__)


class PlannerAgent(BaseAgent):
    """Agent responsible for breaking tasks into steps."""
    
    def __init__(self, gemini_service: GeminiService):
        super().__init__(
            agent_id="planner",
            name="Planner",
            role="Breaks tasks into steps",
            icon="ClipboardList"
        )
        self.gemini = gemini_service
    
    async def execute(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze task and create execution plan."""
        prompt = context.get("prompt", "")
        
        self.update_status("working", 0, "Analyzing task requirements")
        logger.info(f"Planner analyzing: {prompt}")
        
        try:
            # Create planning prompt
            planning_prompt = f"""You are a task planning expert. Analyze this request and break it into clear, actionable steps.

User Request: {prompt}

Provide:
1. A brief analysis of what needs to be done
2. A numbered list of 3-7 execution steps
3. Which agents should handle each step (choose from: Researcher, Developer, Tester, Reviewer)

Be concise and specific."""
            
            self.update_status("working", 30, "Creating execution plan")
            
            # Get plan from Gemini
            plan_text = await self.gemini.generate(planning_prompt)
            
            self.update_status("working", 80, "Finalizing plan")
            
            # Parse steps (simple extraction)
            steps = self._extract_steps(plan_text)
            
            self.update_status("completed", 100, f"Created execution plan with {len(steps)} steps", 
                             plan_text[:200] + "...")
            
            logger.info(f"Planner completed with {len(steps)} steps")
            
            return {
                "plan": plan_text,
                "steps": steps,
                "agent": self.id
            }
            
        except Exception as e:
            logger.error(f"Planner error: {str(e)}")
            self.update_status("error", self.progress, f"Error: {str(e)}")
            raise
    
    def _extract_steps(self, plan_text: str) -> List[str]:
        """Extract numbered steps from plan text."""
        steps = []
        for line in plan_text.split("\n"):
            line = line.strip()
            if line and (line[0].isdigit() or line.startswith("-") or line.startswith("•")):
                steps.append(line)
        return steps if steps else ["Execute task"]
