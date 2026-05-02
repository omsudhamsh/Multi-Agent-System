from typing import Optional
from app.core.config import settings
from app.core.logging import get_logger
import httpx

logger = get_logger(__name__)


class GeminiService:
    """Service for interacting with LLM API (Groq/OpenAI compatible)."""
    
    def __init__(self):
        """Initialize LLM service."""
        from app.api.routes.settings import _settings
        self.api_key = _settings.apiKey
        self.model = _settings.model
        
        # Fallback to config if settings are empty
        if not self.api_key or self.api_key.startswith("sk-") or "â€¢" in self.api_key:
            self.api_key = settings.GEMINI_API_KEY
            self.model = settings.GEMINI_MODEL
        
        # Determine API base URL based on model
        if "groq" in self.model.lower() or (self.api_key and self.api_key.startswith("gsk_")):
            self.base_url = "https://api.groq.com/openai/v1"
            logger.info(f"Using Groq API with model: {self.model}")
        else:
            self.base_url = "https://api.openai.com/v1"
            logger.info(f"Using OpenAI-compatible API with model: {self.model}")
    
    def _refresh_credentials(self):
        """Refresh credentials from global settings."""
        from app.api.routes.settings import _settings
        if _settings.apiKey and not (_settings.apiKey.startswith("sk-") or "â€¢" in _settings.apiKey):
            self.api_key = _settings.apiKey
            self.model = _settings.model
            if "groq" in self.model.lower() or self.api_key.startswith("gsk_"):
                self.base_url = "https://api.groq.com/openai/v1"
            else:
                self.base_url = "https://api.openai.com/v1"

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
