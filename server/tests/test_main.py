import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_fetch_audio():
    response = client.post("/fetch-media", json={
        "query": "Parabola Tool official audio",
        "type": "audio"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["type"] == "audio"
    assert data["url"].endswith(".mp3")
    assert "http://localhost:8000/media/" in data["url"]

def test_fetch_video():
    response = client.post("/fetch-media", json={
        "query": "Parabola Tool official video",
        "type": "video"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["type"] == "video"
    assert "https://www.youtube.com/embed/" in data["embed_url"]

def test_invalid_type():
    response = client.post("/fetch-media", json={
        "query": "anything",
        "type": "invalid"
    })
    assert response.status_code == 400
