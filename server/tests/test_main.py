import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_search_returns_results():
    """Test that search endpoint returns multiple results"""
    response = client.post("/search", json={
        "query": "Parabola Tool"
    })
    assert response.status_code == 200
    data = response.json()
    assert "results" in data
    assert len(data["results"]) > 0
    assert len(data["results"]) <= 5
    
    # Check result structure
    result = data["results"][0]
    assert "id" in result
    assert "title" in result
    assert "uploader" in result
    assert "duration" in result
    assert "thumbnail" in result
    assert "url" in result

def test_search_no_results():
    """Test search with nonsensical query"""
    response = client.post("/search", json={
        "query": "xyzabc123impossible999"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["results"] == []

def test_process_audio():
    """Test audio processing creates job"""
    response = client.post("/process", json={
        "video_id": "dQw4w9WgXcQ",
        "title": "Rick Astley - Never Gonna Give You Up",
        "mode": "audio"
    })
    assert response.status_code == 200
    data = response.json()
    assert "job_id" in data
    assert data["status"] == "queued"

def test_process_video():
    """Test video processing returns instant embed"""
    response = client.post("/process", json={
        "video_id": "dQw4w9WgXcQ",
        "title": "Rick Astley - Never Gonna Give You Up",
        "mode": "video"
    })
    assert response.status_code == 200
    data = response.json()
    assert "job_id" in data
    assert data["status"] == "ready"
    assert "embed_url" in data
    assert "https://www.youtube.com/embed/dQw4w9WgXcQ" in data["embed_url"]

def test_process_invalid_mode():
    """Test invalid mode returns error"""
    response = client.post("/process", json={
        "video_id": "dQw4w9WgXcQ",
        "mode": "invalid"
    })
    assert response.status_code == 400

def test_job_status_not_found():
    """Test status check for non-existent job"""
    response = client.get("/status/nonexistent_job_id")
    assert response.status_code == 404