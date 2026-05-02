from typing import List
from datetime import datetime
from app.schemas import LogEntry, TimelineEvent, LogLevel
from app.core.logging import get_logger
import uuid

logger = get_logger(__name__)


class LogService:
    """Service for managing logs and timeline events."""
    
    def __init__(self):
        self._logs: List[LogEntry] = []
        self._timeline: List[TimelineEvent] = []
        self._max_logs = 1000
        self._max_timeline = 100
    
    async def add_log(self, level: LogLevel, agent: str, message: str) -> LogEntry:
        """Add a log entry."""
        log = LogEntry(
            id=f"log-{uuid.uuid4().hex[:8]}",
            timestamp=datetime.utcnow().isoformat() + "Z",
            level=level,
            agent=agent,
            message=message
        )
        
        self._logs.append(log)
        
        # Enforce max logs limit
        if len(self._logs) > self._max_logs:
            self._logs = self._logs[-self._max_logs:]
        
        logger.log(
            getattr(logger, level.upper(), logger.info),
            f"[{agent}] {message}"
        )
        
        return log
    
    async def get_logs(self, level: str = None, limit: int = 100) -> List[LogEntry]:
        """Get logs with optional filtering."""
        logs = self._logs
        
        if level and level != "all":
            logs = [log for log in logs if log.level == level]
        
        return logs[-limit:]
    
    async def add_timeline_event(
        self, 
        agent_id: str, 
        agent_name: str, 
        action: str, 
        status: str
    ) -> TimelineEvent:
        """Add a timeline event."""
        event = TimelineEvent(
            id=f"event-{uuid.uuid4().hex[:8]}",
            agentId=agent_id,
            agentName=agent_name,
            action=action,
            timestamp=datetime.utcnow().strftime("%H:%M:%S"),
            status=status
        )
        
        self._timeline.append(event)
        
        # Enforce max timeline limit
        if len(self._timeline) > self._max_timeline:
            self._timeline = self._timeline[-self._max_timeline:]
        
        return event
    
    async def get_timeline(self, limit: int = 50) -> List[TimelineEvent]:
        """Get timeline events."""
        return self._timeline[-limit:]
    
    async def clear_logs(self) -> None:
        """Clear all logs."""
        self._logs.clear()
        logger.info("Logs cleared")
    
    async def clear_timeline(self) -> None:
        """Clear timeline."""
        self._timeline.clear()
        logger.info("Timeline cleared")
