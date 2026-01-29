import redis
import json
from typing import Dict, Optional

class RedisManager:
    def __init__(self, redis_url: str):
        self.client = redis.from_url(redis_url, decode_responses=True)
    
    def ping(self) -> bool:
        """Check Redis connection"""
        try:
            return self.client.ping()
        except:
            return False
    
    # Job Management
    def create_job(self, job_id: str, video_id: str, mode: str, title: str = None) -> Dict:
        """Create a new job"""
        job_data = {
            "id": job_id,
            "video_id": video_id,
            "mode": mode,
            "title": title,
            "status": "queued",
        }
        self.client.setex(f"job:{job_id}", 172800, json.dumps(job_data))  # 48 hours TTL
        return job_data
    
    def get_job(self, job_id: str) -> Optional[Dict]:
        """Get job by ID"""
        data = self.client.get(f"job:{job_id}")
        return json.loads(data) if data else None
    
    def update_job(self, job_id: str, **kwargs):
        """Update job fields"""
        data = self.client.get(f"job:{job_id}")
        if data:
            job = json.loads(data)
            job.update(kwargs)
            self.client.setex(f"job:{job_id}", 172800, json.dumps(job))
    
    def delete_job(self, job_id: str):
        """Delete a job"""
        self.client.delete(f"job:{job_id}")
    
    # Download Slot Management
    def acquire_download_slot(self, job_id: str, max_concurrent: int = 5) -> bool:
        """Try to acquire a download slot"""
        active = self.client.scard("active_downloads")
        if active >= max_concurrent:
            return False
        
        self.client.sadd("active_downloads", job_id)
        self.client.expire("active_downloads", 7200)  # 2 hours
        return True
    
    def release_download_slot(self, job_id: str):
        """Release a download slot"""
        self.client.srem("active_downloads", job_id)
    
    def get_active_downloads(self) -> int:
        """Get count of active downloads"""
        return self.client.scard("active_downloads")
    
    # Search Caching
    def cache_search_results(self, query: str, results: list, ttl: int = 3600):
        """Cache search results"""
        try:
            cache_key = f"search:{query.lower()}"
            self.client.setex(cache_key, ttl, json.dumps(results))
        except Exception as e:
            print(f"Redis cache error: {e}")
    
    def get_cached_search(self, query: str) -> Optional[list]:
        """Get cached search results"""
        try:
            cache_key = f"search:{query.lower()}"
            data = self.client.get(cache_key)
            return json.loads(data) if data else None
        except Exception as e:
            print(f"Redis retrieve error: {e}")
            return None
    
    def clear_search_cache(self):
        """Clear all search cache"""
        for key in self.client.scan_iter("search:*"):
            self.client.delete(key)
    
    ## Audio Caching

    # === Audio Cache ===

    def get_cached_audio(self, video_id: str) -> Optional[str]:
        """Return cached audio file URL if exists"""
        return self.client.get(f"audio_cache:{video_id}")

    def cache_audio(self, video_id: str, file_url: str, ttl: int = 86400):
        """Cache downloaded audio"""
        self.client.setex(f"audio_cache:{video_id}", ttl, file_url)

    '''
    RATE_LIMIT_SCRIPT = """
    local current = redis.call("INCR", KEYS[1])
    if current == 1 then
    redis.call("EXPIRE", KEYS[1], ARGV[1])
    end
    return current
    """

    def increment_request_count(
        self,
        key: str,
        window_seconds: int = 3600,
        limit: int = 100
    ) -> bool:
        """Returns False if rate limit exceeded"""
        count = self.client.eval(
            RATE_LIMIT_SCRIPT,
            1,
            key,
            window_seconds
        )
        return count <= limit'''

# Global instance
redis_manager: Optional[RedisManager] = None

def init_redis(redis_url: str):
    """Initialize Redis manager"""
    global redis_manager
    redis_manager = RedisManager(redis_url)
    return redis_manager

def get_redis() -> RedisManager:
    """Get Redis manager instance"""
    if redis_manager is None:
        raise RuntimeError("Redis not initialized. Call init_redis() first.")
    return redis_manager