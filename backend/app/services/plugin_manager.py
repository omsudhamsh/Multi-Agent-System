from typing import List, Optional
from app.schemas import Plugin
from app.core.logging import get_logger

logger = get_logger(__name__)


class PluginManager:
    """Manages available plugins."""
    
    def __init__(self):
        self._plugins: List[Plugin] = self._initialize_plugins()
        logger.info(f"Plugin manager initialized with {len(self._plugins)} plugins")
    
    def _initialize_plugins(self) -> List[Plugin]:
        """Initialize default plugins."""
        return [
            Plugin(
                id="web-search",
                name="Web Search",
                description="Search the web for real-time information and documentation",
                icon="Globe",
                category="Research",
                enabled=True,
                connected=True
            ),
            Plugin(
                id="file-reader",
                name="File Reader",
                description="Read and parse files from your local filesystem",
                icon="FileText",
                category="Files",
                enabled=True,
                connected=True
            ),
            Plugin(
                id="code-runner",
                name="Code Runner",
                description="Execute code snippets in isolated sandboxes",
                icon="Play",
                category="Development",
                enabled=True,
                connected=True
            ),
            Plugin(
                id="github-sync",
                name="GitHub Sync",
                description="Push, pull, and manage repositories",
                icon="Github",
                category="Development",
                enabled=True,
                connected=False
            ),
            Plugin(
                id="database-connector",
                name="Database Connector",
                description="Connect to SQL and NoSQL databases",
                icon="Database",
                category="Data",
                enabled=True,
                connected=True
            ),
            Plugin(
                id="pdf-parser",
                name="PDF Parser",
                description="Extract text and data from PDF documents",
                icon="FileType",
                category="Files",
                enabled=True,
                connected=True
            ),
        ]
    
    async def get_all_plugins(self) -> List[Plugin]:
        """Get all plugins."""
        return self._plugins
    
    async def get_plugin(self, plugin_id: str) -> Optional[Plugin]:
        """Get a specific plugin."""
        for plugin in self._plugins:
            if plugin.id == plugin_id:
                return plugin
        return None
    
    async def toggle_plugin(self, plugin_id: str, enabled: bool) -> Optional[Plugin]:
        """Toggle plugin enabled state."""
        for plugin in self._plugins:
            if plugin.id == plugin_id:
                plugin.enabled = enabled
                logger.info(f"Plugin {plugin_id} {'enabled' if enabled else 'disabled'}")
                return plugin
        return None
    
    async def connect_plugin(self, plugin_id: str) -> Optional[Plugin]:
        """Connect a plugin."""
        for plugin in self._plugins:
            if plugin.id == plugin_id:
                plugin.connected = True
                plugin.enabled = True
                logger.info(f"Plugin {plugin_id} connected")
                return plugin
        return None
