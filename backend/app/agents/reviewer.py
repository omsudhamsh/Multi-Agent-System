from typing import Any, Dict
from app.agents.base import BaseAgent
from app.services.gemini import GeminiService
from app.core.logging import get_logger

logger = get_logger(__name__)


class ReviewerAgent(BaseAgent):
    """Agent responsible for final review and summary."""
    
    def __init__(self, gemini_service: GeminiService):
        super().__init__(
            agent_id="reviewer",
            name="Reviewer",
            role="Summarizes and validates results",
            icon="CheckCircle2"
        )
        self.gemini = gemini_service
    
    async def execute(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """Review all outputs and create final summary."""
        prompt = context.get("prompt", "")
        plan = context.get("plan", "")
        implementation = context.get("implementation", "")
        test_results = context.get("testResults", "")
        
        self.update_status("working", 0, "Reviewing outputs")
        logger.info(f"Reviewer summarizing: {prompt}")
        
        try:
            review_prompt = f"""You are a senior reviewer. Provide a final summary and validation.

Original Task: {prompt}

Plan: {plan[:300] if plan else 'N/A'}
Implementation: {implementation[:500] if implementation else 'N/A'}
Test Results: {test_results[:300] if test_results else 'N/A'}

Provide:
1. Executive summary of what was accomplished
2. Quality assessment
3. Recommendations or next steps
4. Overall confidence score (0-100)

Be clear and actionable."""
            
            self.update_status("working", 50, "Analyzing quality")
            
            review = await self.gemini.generate(review_prompt)
            
            self.update_status("working", 80, "Finalizing summary")
            
            # Extract confidence score
            confidence = self._extract_confidence(review)
            
            self.update_status("completed", 100, "Review complete", review[:200] + "...")
            
            logger.info(f"Reviewer completed with confidence: {confidence}%")
            
            return {
                "review": review,
                "confidence": confidence,
                "agent": self.id
            }
            
        except Exception as e:
            logger.error(f"Reviewer error: {str(e)}")
            self.update_status("error", self.progress, f"Error: {str(e)}")
            raise
    
    def _extract_confidence(self, text: str) -> int:
        """Extract confidence score from review."""
        import re
        
        # Look for patterns like "confidence: 85" or "85%"
        patterns = [
            r"confidence[:\s]+(\d+)",
            r"(\d+)%",
            r"score[:\s]+(\d+)"
        ]
        
        for pattern in patterns:
            match = re.search(pattern, text.lower())
            if match:
                score = int(match.group(1))
                if 0 <= score <= 100:
                    return score
        
        return 75  # Default confidence
