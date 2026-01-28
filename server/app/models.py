from pydantic import BaseModel
from typing import List, Optional

class SearchRequest(BaseModel):
    query: str

class SearchResult(BaseModel):
    id: str
    title: str
    uploader: Optional[str] = "Unknown"
    duration: Optional[int] = 0
    thumbnail: Optional[str] = ""
    url: str


class SearchResponse(BaseModel):
    results: List[SearchResult]

class ProcessRequest(BaseModel):
    video_id: str
    title: Optional[str] = "download"  # Title for filename
    mode: str  # "audio" or "video"

class JobStatus(BaseModel):
    status: str  # "queued", "downloading", "processing", "ready", "failed"
    title: Optional[str] = None
    progress: Optional[int] = None
    url: Optional[str] = None
    embed_url: Optional[str] = None
    error: Optional[str] = None