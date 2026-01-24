import os, uuid
import json
from datetime import datetime, timedelta
from typing import List, Dict
from yt_dlp import YoutubeDL

MEDIA_DIR = os.path.abspath("media")
JOBS_DIR = os.path.join(MEDIA_DIR, "jobs")
FILES_DIR = os.path.join(MEDIA_DIR, "files")

def ensure_media_dir():
    for d in [MEDIA_DIR, JOBS_DIR, FILES_DIR]:
        if not os.path.exists(d):
            os.makedirs(d)

def search_youtube(query: str, max_results: int = 5) -> List[Dict]:
    ydl_opts = {
        "quiet": True,
        "no_warnings": True,
        "skip_download": True,
        "extract_flat": True,
    }

    search_query = f"ytsearch{max_results}:{query}"

    with YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(search_query, download=False)

    if not info or "entries" not in info:
        return []

    results = []
    for entry in info["entries"]:
        if not entry or not entry.get("id"):
            continue

        video_id = entry["id"]
        # Use YouTube's standard thumbnail URL as fallback if not provided
        thumbnail = entry.get("thumbnail") or f"https://i.ytimg.com/vi/{video_id}/hqdefault.jpg"
        
        results.append({
            "id": video_id,
            "title": entry.get("title") or "Unknown",
            "uploader": entry.get("uploader") or entry.get("channel") or "Unknown",
            "duration": entry.get("duration") or 0,
            "thumbnail": thumbnail,
            "url": f"https://www.youtube.com/watch?v={video_id}",
        })

    return results


def create_job(video_id: str, mode: str) -> str:
    """Create a job file and return job ID"""
    job_id = uuid.uuid4().hex
    job_file = os.path.join(JOBS_DIR, f"{job_id}.json")
    
    job_data = {
        "id": job_id,
        "video_id": video_id,
        "mode": mode,
        "status": "queued",
        "created_at": datetime.now().isoformat()
    }
    
    with open(job_file, "w") as f:
        json.dump(job_data, f)
    
    return job_id

def get_job_status(job_id: str) -> Dict:
    """Get current job status"""
    job_file = os.path.join(JOBS_DIR, f"{job_id}.json")
    
    if not os.path.exists(job_file):
        return {"status": "not_found"}
    
    with open(job_file, "r") as f:
        return json.load(f)

def update_job_status(job_id: str, status: str, **kwargs):
    """Update job status"""
    job_file = os.path.join(JOBS_DIR, f"{job_id}.json")
    
    if os.path.exists(job_file):
        with open(job_file, "r") as f:
            job_data = json.load(f)
        
        job_data["status"] = status
        job_data.update(kwargs)
        
        with open(job_file, "w") as f:
            json.dump(job_data, f)

def download_audio(video_id: str, job_id: str) -> str:
    """Download and convert audio to MP3 with optimized settings"""
    output_path = os.path.join(FILES_DIR, f"{job_id}.mp3")
    url = f"https://youtube.com/watch?v={video_id}"
    
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
        "concurrent_fragment_downloads": 8,
        "retries": 3,
        "fragment_retries": 3,
    }
    
    try:
        update_job_status(job_id, "downloading")
        
        with YoutubeDL(ydl_opts) as ydl:
            ydl.download([url])
        
        update_job_status(job_id, "ready", url=f"/media/files/{job_id}.mp3")
        return output_path
        
    except Exception as e:
        update_job_status(job_id, "failed", error=str(e))
        raise

def cleanup_old_files(max_age_hours: int = 24):
    """Remove old job files and media files"""
    cutoff = datetime.now() - timedelta(hours=max_age_hours)
    
    for job_file in os.listdir(JOBS_DIR):
        path = os.path.join(JOBS_DIR, job_file)
        if os.path.getmtime(path) < cutoff.timestamp():
            os.remove(path)
    
    for media_file in os.listdir(FILES_DIR):
        path = os.path.join(FILES_DIR, media_file)
        if os.path.getmtime(path) < cutoff.timestamp():
            os.remove(path)