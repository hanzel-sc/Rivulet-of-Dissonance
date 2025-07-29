from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from app.models import MediaRequest
from app.media_handler import search_youtube, download_audio, ensure_media_dir
import os

ensure_media_dir()

app = FastAPI()

# Allow CORS from frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Set to frontend URL later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/download/{filename}")
def download_file(filename: str):
    file_path = os.path.join("media", filename)

    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")

    return FileResponse(
        path=file_path,
        media_type="application/octet-stream",
        filename=filename
    )

@app.post("/fetch-media")
async def fetch_media(req: MediaRequest):
    youtube_url = search_youtube(req.query)
    
    if req.type == "audio":
        filename = req.query.replace(" ", "_")
        filepath = download_audio(youtube_url, filename)
        return {
            "type": "audio",
            "url": f"http://localhost:8000/media/{filename}.mp3"
        }

    elif req.type == "video":
        video_id = youtube_url.split("v=")[-1]
        return {
            "type": "video",
            "embed_url": f"https://www.youtube.com/embed/{video_id}"
        }

    return JSONResponse({"error": "Invalid type"}, status_code=400)

# Serve media files
from fastapi.staticfiles import StaticFiles
app.mount("/media", StaticFiles(directory="media"), name="media")
