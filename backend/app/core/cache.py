# app/core/cache.py
from cachetools import TTLCache
from typing import Optional, Any
import hashlib
import json
from app.config import settings
from app.utils.logger import logger

class CacheService:
    """In-memory TTL cache to reduce AI API costs"""
    
    def __init__(self):
        self._cache = TTLCache(
            maxsize=settings.CACHE_MAX_SIZE,
            ttl=settings.CACHE_TTL
        )
    
    def _make_key(self, data: dict) -> str:
        """Generate deterministic cache key from user data"""
        # Exclude name and personal identifiers from cache key
        cache_data = {k: v for k, v in data.items() if k != 'name'}
        serialized = json.dumps(cache_data, sort_keys=True)
        return hashlib.md5(serialized.encode()).hexdigest()
    
    def get(self, data: dict) -> Optional[Any]:
        """Retrieve from cache if exists"""
        key = self._make_key(data)
        result = self._cache.get(key)
        if result:
            logger.info(f"Cache HIT for key {key[:8]}")
            return result
        logger.info(f"Cache MISS for key {key[:8]}")
        return None
    
    def set(self, data: dict, value: Any) -> None:
        """Store in cache"""
        key = self._make_key(data)
        self._cache[key] = value
        logger.info(f"Cache SET for key {key[:8]} | size={len(self._cache)}")
    
    def stats(self) -> dict:
        return {
            "size": len(self._cache),
            "max_size": self._cache.maxsize,
            "ttl_seconds": self._cache.ttl
        }

cache_service = CacheService()