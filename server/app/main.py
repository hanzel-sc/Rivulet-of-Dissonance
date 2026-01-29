from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
import os
import re
from app.media_handler import update_job, get_cached_audio

def sanitize_filename(filename: str) -> str:
    """Sanitize filename to be safe for OS"""
    return re.sub(r'[^\w\s\.-]', '_', filename).strip()

from app.models import SearchRequest, SearchResponse, SearchResult, ProcessRequest, JobStatus
from app.media_handler import (
    search_youtube, download_audio, ensure_media_dir,
    create_job, get_job, FILES_DIR
)
from app.redis_manager import init_redis, get_redis

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "*").split(",")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    ensure_media_dir()
    init_redis(REDIS_URL)
    yield

app = FastAPI(lifespan=lifespan)

# CORS - Allow your Vercel frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health():
    redis = get_redis()
    redis_status = "connected" if redis.ping() else "disconnected"
    return {"status": "healthy", "redis": redis_status}

@app.post("/search", response_model=SearchResponse)
async def search(req: SearchRequest):
    try:
        results = search_youtube(req.query, max_results=6)
        search_results = [SearchResult(**r) for r in results]
        return SearchResponse(results=search_results)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/process")
async def process_media(req: ProcessRequest, background_tasks: BackgroundTasks):
    if req.mode not in ["audio", "video"]:
        raise HTTPException(status_code=400, detail="Invalid mode")
    
    job_id = create_job(req.video_id, req.mode, title=req.title)
    
    if req.mode == "audio":
        cached_url = get_cached_audio(req.video_id)

        if cached_url:
            # Instant hit
            
            update_job(job_id, status="ready", url=cached_url)
            return {"job_id": job_id, "status": "ready", "cached": True}

        # Cache miss → download
        background_tasks.add_task(download_audio, req.video_id, job_id)
        return {"job_id": job_id, "status": "queued"}

    elif req.mode == "video":
        return {
            "job_id": job_id,
            "status": "ready",
            "embed_url": f"https://www.youtube.com/embed/{req.video_id}"
        }

@app.get("/status/{job_id}", response_model=JobStatus)
async def check_status(job_id: str):
    job = get_job(job_id)
    if job.get("status") == "not_found":
        raise HTTPException(status_code=404, detail="Job not found")
    
    return JobStatus(
        status=job.get("status"),
        title=job.get("title"),
        url=job.get("url"),
        embed_url=job.get("embed_url"),
        error=job.get("error")
    )

@app.get("/download/{job_id}")
async def download_file(job_id: str):
    job = get_job(job_id)
    if not job or job.get("status") == "not_found":
        raise HTTPException(status_code=404, detail="Job not found")

    file_url = job.get("url")
    if not file_url:
        raise HTTPException(status_code=404, detail="File not ready")

    # file_url example: /media/files/audio_<video_id>.mp3
    filename_on_disk = os.path.basename(file_url)
    file_path = os.path.join(FILES_DIR, filename_on_disk)

    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")

    title = job.get("title", "download")
    safe_title = sanitize_filename(title)

    return FileResponse(
        path=file_path,
        media_type="audio/mpeg",
        filename=f"{safe_title}.mp3"
    )
