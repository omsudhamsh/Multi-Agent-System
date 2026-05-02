from pydantic import BaseModel


class Settings(BaseModel):
    """Settings schema matching frontend expectations."""
    apiKey: str
    model: str
    theme: str = "system"
    notifications: dict = {
        "taskComplete": True,
        "errors": True,
        "updates": False
    }


class SettingsUpdate(BaseModel):
    """Schema for updating settings."""
    apiKey: str | None = None
    model: str | None = None
    theme: str | None = None
    notifications: dict | None = None
