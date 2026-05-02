from typing import Any, Dict, List, Optional
from datetime import datetime
from app.core.config import settings
from app.core.logging import get_logger

logger = get_logger(__name__)


class MemoryStore:
    """In-memory storage for task context and history."""
    
    def __init__(self):
        self._store: Dict[str, Dict[str, Any]] = {}
        self._max_items = settings.MAX_MEMORY_ITEMS
        logger.info(f"Memory store initialized (max items: {self._max_items})")
    
    async def store(self, key: str, data: Dict[str, Any]) -> None:
        """Store data in memory."""
        data["stored_at"] = datetime.utcnow().isoformat()
        self._store[key] = data
        
        # Enforce max items limit
        if len(self._store) > self._max_items:
            oldest_key = min(self._store.keys(), 
                           key=lambda k: self._store[k].get("stored_at", ""))
            del self._store[oldest_key]
            logger.debug(f"Removed oldest entry: {oldest_key}")
    
    async def retrieve(self, key: str) -> Optional[Dict[str, Any]]:
        """Retrieve data from memory."""
        return self._store.get(key)
    
    async def search(self, query: str, limit: int = 5) -> List[Dict[str, Any]]:
        """Search memory entries."""
        results = []
        query_lower = query.lower()
        
        for key, data in self._store.items():
            # Simple text search
            if query_lower in str(data).lower():
                results.append({"key": key, **data})
                if len(results) >= limit:
                    break
        
        return results
    
    async def get_stats(self) -> Dict[str, Any]:
        """Get memory statistics."""
        return {
            "total": len(self._store),
            "max": self._max_items,
            "usage_percent": int((len(self._store) / self._max_items) * 100)
        }
    
    async def clear(self) -> None:
        """Clear all memory."""
        self._store.clear()
        logger.info("Memory store cleared")
