from functools import lru_cache
from app.services.gemini import GeminiService
from app.services.task_manager import TaskManager
from app.services.task_executor import TaskExecutor
from app.services.plugin_manager import PluginManager
from app.services.log_service import LogService
from app.memory.store import MemoryStore
from app.tools.registry import ToolRegistry
from app.agents import (
    PlannerAgent,
    DeveloperAgent,
    ResearcherAgent,
    TesterAgent,
    ReviewerAgent,
    MemoryAgent,
    ToolAgent
)


# Singleton instances
_gemini_service = None
_task_manager = None
_plugin_manager = None
_log_service = None
_memory_store = None
_tool_registry = None
_task_executor = None


def get_gemini_service() -> GeminiService:
    """Get Gemini service singleton."""
    global _gemini_service
    if _gemini_service is None:
        _gemini_service = GeminiService()
    return _gemini_service


def get_task_manager() -> TaskManager:
    """Get task manager singleton."""
    global _task_manager
    if _task_manager is None:
        _task_manager = TaskManager()
    return _task_manager


def get_plugin_manager() -> PluginManager:
    """Get plugin manager singleton."""
    global _plugin_manager
    if _plugin_manager is None:
        _plugin_manager = PluginManager()
    return _plugin_manager


def get_log_service() -> LogService:
    """Get log service singleton."""
    global _log_service
    if _log_service is None:
        _log_service = LogService()
    return _log_service


def get_memory_store() -> MemoryStore:
    """Get memory store singleton."""
    global _memory_store
    if _memory_store is None:
        _memory_store = MemoryStore()
    return _memory_store


def get_tool_registry() -> ToolRegistry:
    """Get tool registry singleton."""
    global _tool_registry
    if _tool_registry is None:
        _tool_registry = ToolRegistry()
    return _tool_registry


def get_task_executor() -> TaskExecutor:
    """Get task executor singleton."""
    global _task_executor
    if _task_executor is None:
        gemini = get_gemini_service()
        memory = get_memory_store()
        tools = get_tool_registry()
        log_service = get_log_service()
        
        # Initialize agents
        planner = PlannerAgent(gemini)
        developer = DeveloperAgent(gemini)
        researcher = ResearcherAgent(gemini)
        tester = TesterAgent(gemini)
        reviewer = ReviewerAgent(gemini)
        memory_agent = MemoryAgent(memory)
        
        _task_executor = TaskExecutor(
            planner=planner,
            developer=developer,
            researcher=researcher,
            tester=tester,
            reviewer=reviewer,
            memory=memory_agent,
            log_service=log_service
        )
    return _task_executor
