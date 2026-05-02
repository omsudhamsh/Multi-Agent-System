from typing import Any, Dict
from app.agents.base import BaseAgent
from app.services.gemini import GeminiService
from app.core.logging import get_logger

logger = get_logger(__name__)


class ResearcherAgent(BaseAgent):
    """Agent responsible for gathering information."""
    
    def __init__(self, gemini_service: GeminiService):
        super().__init__(
            agent_id="researcher",
            name="Researcher",
            role="Gathers useful information",
            icon="Search"
        )
        self.gemini = gemini_service
    
    async def execute(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """Research and gather relevant information."""
        prompt = context.get("prompt", "")
        plan = context.get("plan", "")
        
        self.update_status("working", 0, "Starting research")
        logger.info(f"Researcher gathering information for: {prompt}")
        
        try:
            research_prompt = f"""You are a research expert. Gather relevant information for this task.

Task: {prompt}

Plan Context: {plan[:500] if plan else 'No plan provided'}

Provide:
1. Key concepts and technologies involved
2. Best practices and recommendations
3. Potential challenges and solutions
4. Relevant resources or approaches

Be concise and actionable."""
            
            self.update_status("working", 40, "Analyzing requirements")
            
            research_results = await self.gemini.generate(research_prompt)
            
            self.update_status("working", 80, "Compiling findings")
            
            # Extract key points
            key_points = self._extract_key_points(research_results)
            
            self.update_status("completed", 100, f"Found {len(key_points)} key insights",
                             research_results[:200] + "...")
            
            logger.info(f"Researcher completed with {len(key_points)} insights")
            
            return {
                "research": research_results,
                "keyPoints": key_points,
                "agent": self.id
            }
            
        except Exception as e:
            logger.error(f"Researcher error: {str(e)}")
            self.update_status("error", self.progress, f"Error: {str(e)}")
            raise
    
    def _extract_key_points(self, text: str) -> list:
        """Extract key points from research."""
        points = []
        for line in text.split("\n"):
            line = line.strip()
            if line and (line[0].isdigit() or line.startswith("-") or line.startswith("•")):
                points.append(line)
        return points[:10]  # Limit to top 10
