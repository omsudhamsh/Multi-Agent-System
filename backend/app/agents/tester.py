from typing import Any, Dict
from app.agents.base import BaseAgent
from app.services.gemini import GeminiService
from app.core.logging import get_logger

logger = get_logger(__name__)


class TesterAgent(BaseAgent):
    """Agent responsible for testing and validation."""
    
    def __init__(self, gemini_service: GeminiService):
        super().__init__(
            agent_id="tester",
            name="Tester",
            role="Checks for bugs and validates",
            icon="TestTube2"
        )
        self.gemini = gemini_service
    
    async def execute(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """Test and validate the implementation."""
        prompt = context.get("prompt", "")
        implementation = context.get("implementation", "")
        
        self.update_status("working", 0, "Preparing test cases")
        logger.info(f"Tester validating: {prompt}")
        
        try:
            test_prompt = f"""You are a QA expert. Review and test this implementation.

Original Task: {prompt}

Implementation: {implementation[:1000] if implementation else 'No implementation'}

Provide:
1. Test cases to validate functionality
2. Potential bugs or issues found
3. Edge cases to consider
4. Overall quality assessment

Be thorough but concise."""
            
            self.update_status("working", 40, "Running validation")
            
            test_results = await self.gemini.generate(test_prompt)
            
            self.update_status("working", 80, "Analyzing results")
            
            # Extract issues
            issues = self._extract_issues(test_results)
            
            status_msg = f"Found {len(issues)} potential issues" if issues else "All checks passed"
            self.update_status("completed", 100, status_msg, test_results[:200] + "...")
            
            logger.info(f"Tester completed: {status_msg}")
            
            return {
                "testResults": test_results,
                "issues": issues,
                "passed": len(issues) == 0,
                "agent": self.id
            }
            
        except Exception as e:
            logger.error(f"Tester error: {str(e)}")
            self.update_status("error", self.progress, f"Error: {str(e)}")
            raise
    
    def _extract_issues(self, text: str) -> list:
        """Extract potential issues from test results."""
        issues = []
        keywords = ["bug", "issue", "error", "problem", "warning", "concern"]
        
        for line in text.split("\n"):
            line_lower = line.lower()
            if any(keyword in line_lower for keyword in keywords):
                issues.append(line.strip())
        
        return issues[:5]  # Limit to top 5
