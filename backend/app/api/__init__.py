from fastapi import APIRouter
from app.api.routes import tasks, agents, plugins, logs, health, auth, settings

api_router = APIRouter(prefix="/api/v1")

# Include all route modules
api_router.include_router(health.router)
api_router.include_router(auth.router, prefix="/auth")
api_router.include_router(tasks.router, prefix="/tasks")
api_router.include_router(agents.router, prefix="/agents")
api_router.include_router(plugins.router, prefix="/plugins")
api_router.include_router(logs.router, prefix="/logs")
api_router.include_router(settings.router, prefix="/settings")

__all__ = ["api_router"]
