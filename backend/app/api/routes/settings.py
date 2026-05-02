from fastapi import APIRouter, HTTPException
from app.schemas.settings import Settings, SettingsUpdate

router = APIRouter()

# In-memory settings for now (could be moved to persistent store)
_settings = Settings(
    apiKey="sk-••••••••••••••••••••••••",
    model="gemini-pro",
    theme="system"
)

@router.get("", response_model=Settings)
async def get_settings():
    """Get global application settings."""
    return _settings

@router.put("", response_model=Settings)
async def update_settings(settings_update: SettingsUpdate):
    """Update global application settings."""
    global _settings
    update_data = settings_update.model_dump(exclude_unset=True)
    
    # Create new settings object with updated fields
    _settings = Settings(**{**_settings.model_dump(), **update_data})
    
    return _settings
