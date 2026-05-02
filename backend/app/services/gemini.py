from typing import Optional
from app.core.config import settings
from app.core.logging import get_logger
import httpx

logger = get_logger(__name__)


class GeminiService:
    """Service for interacting with LLM API (Groq/OpenAI compatible)."""
    
    def __init__(self):
        """Initialize LLM service."""
        self.api_key = settings.GEMINI_API_KEY
        self.model = settings.GEMINI_MODEL
        
        # Try to use runtime settings if available and valid
        try:
            from app.api.routes.settings import _settings
            if self._is_valid_api_key(_settings.apiKey):
                self.api_key = _settings.apiKey
                self.model = _settings.model
        except Exception:
            pass
        
        # Determine API base URL based on model/key
        self.base_url = self._resolve_base_url()
        logger.info(f"Using API with model: {self.model} at {self.base_url}")
    
    @staticmethod
    def _is_valid_api_key(key: str) -> bool:
        """Check if an API key is a real key (not a dummy/masked placeholder)."""
        if not key or len(key) < 10:
            return False
        # Reject keys that look like masked placeholders
        if key.startswith("sk-") and "•" in key:
            return False
        if "•" in key or "â€¢" in key:
            return False
        return True
    
    def _resolve_base_url(self) -> str:
        """Determine the correct API base URL from model name and key prefix."""
        if self.api_key and self.api_key.startswith("gsk_"):
            return "https://api.groq.com/openai/v1"
        if "groq" in self.model.lower():
            return "https://api.groq.com/openai/v1"
        return "https://api.openai.com/v1"
    
    def _refresh_credentials(self):
        """Refresh credentials from global settings."""
        try:
            from app.api.routes.settings import _settings
            if self._is_valid_api_key(_settings.apiKey):
                self.api_key = _settings.apiKey
                self.model = _settings.model
                self.base_url = self._resolve_base_url()
        except Exception:
            pass

    async def generate(self, prompt: str, system_instruction: Optional[str] = None) -> str:
        """Generate text using LLM API."""
        self._refresh_credentials()
        try:
            messages = []
            
            if system_instruction:
                messages.append({
                    "role": "system",
                    "content": system_instruction
                })
            
            messages.append({
                "role": "user",
                "content": prompt
            })
            
            async with httpx.AsyncClient(timeout=60.0) as client:
                response = await client.post(
                    f"{self.base_url}/chat/completions",
                    headers={
                        "Authorization": f"Bearer {self.api_key}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": self.model,
                        "messages": messages,
                        "temperature": 0.7,
                        "max_tokens": 2048,
                    }
                )
                
                response.raise_for_status()
                result = response.json()
                
                return result["choices"][0]["message"]["content"]
            
        except Exception as e:
            logger.error(f"LLM generation error: {str(e)}")
            raise
    
    async def generate_stream(self, prompt: str, system_instruction: Optional[str] = None):
        """Generate text using LLM API with streaming."""
        self._refresh_credentials()
        try:
            messages = []
            if system_instruction:
                messages.append({"role": "system", "content": system_instruction})
            
            messages.append({"role": "user", "content": prompt})
            
            async with httpx.AsyncClient(timeout=60.0) as client:
                async with client.stream(
                    "POST",
                    f"{self.base_url}/chat/completions",
                    headers={
                        "Authorization": f"Bearer {self.api_key}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": self.model,
                        "messages": messages,
                        "temperature": 0.7,
                        "max_tokens": 2048,
                        "stream": True
                    }
                ) as response:
                    response.raise_for_status()
                    async for line in response.aiter_lines():
                        if line.startswith("data: "):
                            data = line[6:]
                            if data != "[DONE]":
                                import json
                                try:
                                    chunk = json.loads(data)
                                    if "choices" in chunk and len(chunk["choices"]) > 0:
                                        delta = chunk["choices"][0].get("delta", {})
                                        if "content" in delta:
                                            yield delta["content"]
                                except json.JSONDecodeError:
                                    continue
                    
        except Exception as e:
            logger.error(f"LLM streaming error: {str(e)}")
            raise
