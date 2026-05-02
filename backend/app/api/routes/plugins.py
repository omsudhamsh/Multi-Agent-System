from fastapi import APIRouter, HTTPException, Depends
from typing import List
from app.schemas import Plugin, PluginToggle
from app.api.dependencies import get_plugin_manager
from app.services.plugin_manager import PluginManager

router = APIRouter()


@router.get("", response_model=List[Plugin])
async def get_plugins(
    plugin_manager: PluginManager = Depends(get_plugin_manager)
):
    """Get all plugins."""
    return await plugin_manager.get_all_plugins()


@router.get("/{plugin_id}", response_model=Plugin)
async def get_plugin(
    plugin_id: str,
    plugin_manager: PluginManager = Depends(get_plugin_manager)
):
    """Get a specific plugin."""
    plugin = await plugin_manager.get_plugin(plugin_id)
    if not plugin:
        raise HTTPException(status_code=404, detail="Plugin not found")
    return plugin


@router.put("/{plugin_id}/toggle", response_model=Plugin)
async def toggle_plugin(
    plugin_id: str,
    toggle_data: PluginToggle,
    plugin_manager: PluginManager = Depends(get_plugin_manager)
):
    """Toggle plugin enabled state."""
    plugin = await plugin_manager.toggle_plugin(plugin_id, toggle_data.enabled)
    if not plugin:
        raise HTTPException(status_code=404, detail="Plugin not found")
    return plugin


@router.post("/{plugin_id}/connect", response_model=Plugin)
async def connect_plugin(
    plugin_id: str,
    plugin_manager: PluginManager = Depends(get_plugin_manager)
):
    """Connect a plugin."""
    plugin = await plugin_manager.connect_plugin(plugin_id)
    if not plugin:
        raise HTTPException(status_code=404, detail="Plugin not found")
    return plugin
