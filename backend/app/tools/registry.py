from typing import Any, Dict, Callable, Optional
from app.core.logging import get_logger

logger = get_logger(__name__)


class ToolRegistry:
    """Registry for managing available tools/plugins."""
    
    def __init__(self):
        self._tools: Dict[str, Callable] = {}
        self._register_default_tools()
        logger.info("Tool registry initialized")
    
    def register(self, name: str, func: Callable) -> None:
        """Register a new tool."""
        self._tools[name] = func
        logger.info(f"Registered tool: {name}")
    
    async def execute(self, name: str, params: Dict[str, Any]) -> Any:
        """Execute a tool by name."""
        if name not in self._tools:
            raise ValueError(f"Tool not found: {name}")
        
        tool_func = self._tools[name]
        return await tool_func(params)
    
    def list_tools(self) -> list:
        """List all registered tools."""
        return list(self._tools.keys())
    
    def _register_default_tools(self) -> None:
        """Register default tools."""
        self.register("web_search", self._web_search)
        self.register("file_reader", self._file_reader)
        self.register("code_runner", self._code_runner)
    
    async def _web_search(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Placeholder for web search tool."""
        query = params.get("query", "")
        logger.info(f"Web search: {query}")
        return {
            "query": query,
            "results": ["Result 1", "Result 2", "Result 3"],
            "message": "Web search executed (placeholder)"
        }
    
    async def _file_reader(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Placeholder for file reader tool."""
        filepath = params.get("filepath", "")
        logger.info(f"File read: {filepath}")
        return {
            "filepath": filepath,
            "content": "File content here (placeholder)",
            "message": "File read executed (placeholder)"
        }
    
    async def _code_runner(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Placeholder for code runner tool."""
        code = params.get("code", "")
        logger.info(f"Code execution requested")
        return {
            "code": code[:100],
            "output": "Code output here (placeholder)",
            "message": "Code execution completed (placeholder)"
        }
