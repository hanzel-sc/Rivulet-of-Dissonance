import os
import uuid
from typing import List, Dict
from yt_dlp import YoutubeDL
from app.redis_manager import get_redis

MEDIA_DIR = os.path.abspath("media")
FILES_DIR = os.path.join(MEDIA_DIR, "files")

def ensure_media_dir():
    for d in [MEDIA_DIR, FILES_DIR]:
        if not os.path.exists(d):
            os.makedirs(d)

def search_youtube(query: str, max_results: int = 6) -> List[Dict]:
    """Search YouTube - optimized with caching"""
    redis = get_redis()
    
    # Check cache
    cached = redis.get_cached_search(query)
    if cached:
        return cached
    
    ydl_opts = {
        "quiet": True,
        "no_warnings": True,
        "skip_download": True,
        "extract_flat": True,
    }
    
    search_query = f"ytsearch{max_results}:{query}"
    
    try:
        with YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(search_query, download=False)
        
        if not info or "entries" not in info:
            return []
        
        results = []
        for entry in info.get("entries", []):
            if not entry or not entry.get("id"):
                continue
            
            video_id = entry["id"]
            results.append({
                "id": video_id,
                "title": entry.get("title", "Unknown"),
                "uploader": entry.get("uploader") or entry.get("channel", "Unknown"),
                "duration": entry.get("duration", 0),
                "thumbnail": entry.get("thumbnail") or f"https://i.ytimg.com/vi/{video_id}/hqdefault.jpg",
                "url": f"https://www.youtube.com/watch?v={video_id}",
            })
        
        # Cache for 1 hour
        if results:
            redis.cache_search_results(query, results)
        
        return results
    except Exception as e:
        print(f"Search error: {e}")
        # Return empty list or re-raise if you want 500 with details
        # For better UX, returning empty list is safer, but main.py handles exceptions too.
        # Let's re-raise to see the error in the logs/API response for now.
        raise e

def create_job(video_id: str, mode: str, title: str = None) -> str:
    """Create job in Redis"""
    redis = get_redis()
    job_id = uuid.uuid4().hex
    redis.create_job(job_id, video_id, mode, title=title)
    return job_id

def get_job(job_id: str) -> Dict:
    """Get job status"""
    redis = get_redis()
    job = redis.get_job(job_id)
    return job if job else {"status": "not_found"}

def update_job(job_id: str, **kwargs):
    """Update job status"""
    redis = get_redis()
    redis.update_job(job_id, **kwargs)

def acquire_download_slot(job_id: str) -> bool:
    """Check if we can start a download (limit to 5 concurrent)"""
    redis = get_redis()
    return redis.acquire_download_slot(job_id, max_concurrent=5)

def release_download_slot(job_id: str):
    """Release download slot"""
    redis = get_redis()
    redis.release_download_slot(job_id)

def download_audio(video_id: str, job_id: str) -> str:
    """Download audio - optimized for speed"""
    output_path = os.path.join(FILES_DIR, f"{job_id}.mp3")
    url = f"https://youtube.com/watch?v={video_id}"
    
    # Wait for slot
    if not acquire_download_slot(job_id):
        update_job(job_id, status="queued", message="Waiting for download slot")
        return None
    
    try:
        update_job(job_id, status="downloading")
        
        ydl_opts = {
            "format": "bestaudio/best",
            "outtmpl": os.path.join(FILES_DIR, f"{job_id}.%(ext)s"),
            "postprocessors": [{
                "key": "FFmpegExtractAudio",
                "preferredcodec": "mp3",
                "preferredquality": "192",
            }],
            "quiet": True,
            "no_warnings": True,
            # Speed optimizations
            "concurrent_fragment_downloads": 8,
            "retries": 3,
            "fragment_retries": 3,
        }
        
        with YoutubeDL(ydl_opts) as ydl:
            ydl.download([url])
        
        update_job(job_id, status="ready", url=f"/media/files/{job_id}.mp3")
        return output_path
    
    except Exception as e:
        update_job(job_id, status="failed", error=str(e))
        if os.path.exists(output_path):
            os.remove(output_path)
        raise
    
    finally:
        release_download_slot(job_id)