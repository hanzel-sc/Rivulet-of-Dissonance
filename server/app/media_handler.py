import os
import subprocess
from yt_dlp import YoutubeDL

MEDIA_DIR = os.path.abspath("media")

def ensure_media_dir():
    if not os.path.exists(MEDIA_DIR):
        os.makedirs(MEDIA_DIR)

def search_youtube(query: str) -> str:
    ydl_opts = {
        "format": "bestaudio/best",
        "quiet": True,
        "noplaylist": True,
        "default_search": "ytsearch1",
    }
    with YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(query, download=False)
        return info["entries"][0]["webpage_url"]

def download_audio(youtube_url: str, output_name: str) -> str:
    output_path = os.path.join(MEDIA_DIR, f"{output_name}.mp3")
    ydl_opts = {
        "format": "bestaudio/best",
        "outtmpl": os.path.join(MEDIA_DIR, f"{output_name}.%(ext)s"),
        "postprocessors": [{
            "key": "FFmpegExtractAudio",
            "preferredcodec": "mp3",
            "preferredquality": "192",
        }],
        "quiet": True,
    }
    with YoutubeDL(ydl_opts) as ydl:
        ydl.download([youtube_url])
    return output_path
