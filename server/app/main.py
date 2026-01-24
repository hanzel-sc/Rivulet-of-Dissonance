from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from app.models import SearchRequest, SearchResponse, SearchResult, ProcessRequest, JobStatus
from app.media_handler import (
    search_youtube, 
    download_audio, 
    ensure_media_dir,
    create_job,
    get_job_status,
    cleanup_old_files,
    FILES_DIR
)
import os
from contextlib import asynccontextmanager

# Cleanup on startup
@asynccontextmanager
async def lifespan(app: FastAPI):
    ensure_media_dir()
    cleanup_old_files()
    yield

app = FastAPI(lifespan=lifespan)

# CORS - restrict in production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development. Restrict in production!
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Search endpoint - returns top 5 results
@app.post("/search", response_model=SearchResponse)
async def search(req: SearchRequest):
    try:
        results = search_youtube(req.query, max_results=6)
        
        if not results:
            return SearchResponse(results=[])
        
        search_results = [SearchResult(**r) for r in results]
        return SearchResponse(results=search_results)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Process media endpoint - handles audio download or video embed
@app.post("/process")
async def process_media(req: ProcessRequest, background_tasks: BackgroundTasks):
    if req.mode not in ["audio", "video"]:
        raise HTTPException(status_code=400, detail="Invalid mode")
    
    # Create job
    job_id = create_job(req.video_id, req.mode)
    
    if req.mode == "audio":
        # Start background download
        background_tasks.add_task(download_audio, req.video_id, job_id)
        return {"job_id": job_id, "status": "queued"}
    
    elif req.mode == "video":
        # Video is instant - just return embed URL
        return {
            "job_id": job_id,
            "status": "ready",
            "embed_url": f"https://www.youtube.com/embed/{req.video_id}"
        }

# Job status endpoint
@app.get("/status/{job_id}", response_model=JobStatus)
async def check_status(job_id: str):
    job = get_job_status(job_id)
    
    if job.get("status") == "not_found":
        raise HTTPException(status_code=404, detail="Job not found")
    
    return JobStatus(
        status=job.get("status"),
        url=job.get("url"),
        embed_url=job.get("embed_url"),
        error=job.get("error")
    )

# Download endpoint
@app.get("/download/{job_id}")
async def download_file(job_id: str):
    file_path = os.path.join(FILES_DIR, f"{job_id}.mp3")
    
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    
    return FileResponse(
        path=file_path,
        media_type="audio/mpeg",
        filename=f"{job_id}.mp3"
    )

# Mount static files
app.mount("/media", StaticFiles(directory="media"), name="media")