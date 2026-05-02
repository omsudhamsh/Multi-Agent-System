from typing import Any, Dict
from app.agents.base import BaseAgent
from app.services.gemini import GeminiService
from app.core.logging import get_logger

logger = get_logger(__name__)


class DeveloperAgent(BaseAgent):
    """Agent responsible for code generation and implementation."""
    
    def __init__(self, gemini_service: GeminiService):
        super().__init__(
            agent_id="developer",
            name="Developer",
            role="Writes or improves code",
            icon="Code2"
        )
        self.gemini = gemini_service
    
    async def execute(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """Generate or improve code based on requirements."""
        prompt = context.get("prompt", "")
        plan = context.get("plan", "")
        research = context.get("research", "")
        
        self.update_status("working", 0, "Analyzing requirements")
        logger.info(f"Developer working on: {prompt}")
        
        try:
            dev_prompt = f"""You are an expert software developer. Implement the following task.

Task: {prompt}

Plan: {plan[:500] if plan else 'No plan'}
Research: {research[:500] if research else 'No research'}

Provide:
1. Clean, production-ready code
2. Brief explanation of the implementation
3. Any important notes or considerations

Focus on quality, readability, and best practices."""
            
            self.update_status("working", 30, "Designing solution")
            
            implementation = ""
            async for chunk in self.gemini.generate_stream(dev_prompt):
                implementation += chunk
                # Periodically update output snippet to show progress
                if len(implementation) % 100 < 20: 
                    self.update_status("working", 50, "Generating code", implementation[-200:])
            
            self.update_status("working", 70, "Finalizing implementation")
            
            # Extract code blocks
            code_blocks = self._extract_code_blocks(implementation)
            
            self.update_status("completed", 100, f"Implementation complete with {len(code_blocks)} code blocks",
                             implementation[:200] + "...")
            
            logger.info(f"Developer completed with {len(code_blocks)} code blocks")
            
            return {
                "implementation": implementation,
                "codeBlocks": code_blocks,
                "agent": self.id
            }
            
        except Exception as e:
            logger.error(f"Developer error: {str(e)}")
            self.update_status("error", self.progress, f"Error: {str(e)}")
            raise
    
    def _extract_code_blocks(self, text: str) -> list:
        """Extract code blocks from markdown."""
        blocks = []
        in_block = False
        current_block = []
        
        for line in text.split("\n"):
            if line.strip().startswith("```"):
                if in_block:
                    blocks.append("\n".join(current_block))
                    current_block = []
                in_block = not in_block
            elif in_block:
                current_block.append(line)
        
        return blocks
