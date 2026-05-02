from pydantic import BaseModel


class Plugin(BaseModel):
    """Plugin schema matching frontend expectations."""
    id: str
    name: str
    description: str
    icon: str
    category: str
    enabled: bool = False
    connected: bool = False


class PluginToggle(BaseModel):
    """Schema for toggling plugin state."""
    enabled: bool
