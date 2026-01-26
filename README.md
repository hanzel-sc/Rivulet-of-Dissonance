
---

# Rivulet of Dissonance

Rivulet of Dissonance is a **full-stack media exploration and processing application** that allows users to search for YouTube content and choose between:

* **Embedding and streaming videos directly in the UI**
* **Extracting and downloading high-quality audio as MP3**

> ⚠️ This project is intended for **personal, educational, and private use**.

---

## Table of Contents

* [Architecture Overview](#architecture-overview)
* [Features](#features)
* [Tech Stack](#tech-stack)
* [Frontend Overview](#frontend-overview)
* [Backend Overview](#backend-overview)
* [Application Flow](#application-flow)
* [Directory Structure](#directory-structure)
* [Local Development](#local-development)
* [Testing](#testing)
* [Configuration](#configuration)
* [Known Limitations](#known-limitations)
* [Future Improvements](#future-improvements)

---

## Architecture Overview

The application follows a **decoupled frontend–backend architecture**:

```
React (Vite)
   ↓
FastAPI REST API
   ↓
yt-dlp (media extraction)
   ↓
Background job processing
   ↓
Local media storage
```

Key architectural ideas:

* Stateless frontend
* Asynchronous backend processing for audio downloads
* Polling-based job status updates
* Clean separation between UI state and backend job state

---

## Features

### Core Functionality

* Search YouTube videos by query
* Display search results with:

  * Thumbnails
  * Duration
  * Uploader information
* Select a result and choose a processing mode:

  * **Audio** (MP3 download)
  * **Video** (embedded playback)

### Audio Processing

* Background audio extraction using `yt-dlp`
* Conversion to MP3 (192kbps)
* Job-based processing with status polling
* One-click audio download

### Video Playback

* Instant YouTube iframe embedding
* No download required
* Embedded directly in the UI

### UI & UX

* Dark / light theme support with persistence
* Animated “lamp” hero section with particle effects
* Responsive layout (desktop & mobile)
* Clear UI state transitions:

  * Idle → Searching → Results → Processing → Ready → Error
* Visual feedback for loading, processing, and errors

---

## Tech Stack

### Frontend

* **React 19**
* **Vite**
* **Tailwind CSS**
* **Framer Motion / Motion**
* **Lucide Icons**
* Custom UI components inspired by shadcn/ui

### Backend

* **FastAPI**
* **Uvicorn**
* **yt-dlp**
* Background tasks for media processing

### Tooling & Testing

* **pytest**
* **FastAPI TestClient**
* ESLint
* PostCSS + Autoprefixer

---

## Frontend Overview

The frontend lives in `client/` and is built as a **single-page application**.

Key concepts:

* Centralized theme management via `ThemeContext`
* Explicit UI states managed in `App.jsx`
* Reusable UI primitives (`Button`, `Input`, `Badge`, `Spinner`)
* Animation-heavy but controlled visual effects:

  * Lamp glow
  * Particle fields
  * Motion-based transitions

Notable components:

* `LampContainer` – animated hero background
* `SearchForm` – query input
* `SearchResults` – selectable video grid
* `ModeSelector` – audio/video selection
* `MediaDisplay` – final playback or download view

---

## Backend Overview

The backend lives in `server/` and exposes a small REST API.

### API Endpoints

| Endpoint             | Method | Description                                  |
| -------------------- | ------ | -------------------------------------------- |
| `/search`            | POST   | Search YouTube videos                        |
| `/process`           | POST   | Start audio extraction or return video embed |
| `/status/{job_id}`   | GET    | Poll job status                              |
| `/download/{job_id}` | GET    | Download processed MP3                       |

### Job System

* Jobs are represented as JSON files on disk
* Each job tracks:

  * Status (`queued`, `downloading`, `ready`, `failed`)
  * Video ID
  * Output file path
* Old jobs and media files are cleaned up automatically

---

## Application Flow

1. User submits a search query
2. Backend searches YouTube using `yt-dlp`
3. Results are returned and displayed
4. User selects a video and chooses:

   * **Video** → instant embed
   * **Audio** → background download job
5. Frontend polls job status
6. Once ready:

   * Audio is playable and downloadable
   * Video is embedded and streamed
7. User can reset and start over

---

## Directory Structure

```text
client/
  src/
    components/
      ui/               # Reusable UI primitives
      SearchForm.jsx
      SearchResults.jsx
      MediaDisplay.jsx
    context/
      ThemeContext.jsx
    lib/
      utils.js
    App.jsx
    main.jsx

server/
  app/
    main.py             # FastAPI entrypoint
    media_handler.py    # yt-dlp logic & jobs
    models.py           # Pydantic models
  tests/
    test_main.py
```

---

## Local Development

### Prerequisites

* Node.js 18+
* Python 3.9+
* ffmpeg installed and available in PATH

---

### Frontend

```bash
cd client
npm install
npm run dev
```

Frontend runs at:

```
http://localhost:5173
```

---

### Backend

```bash
cd server
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Backend runs at:

```
http://localhost:8000
```

---

## Testing

### Backend Tests

```bash
cd server
pytest
```

Tests cover:

* Search endpoint behavior
* Processing modes
* Job creation
* Error handling

---

## Configuration

### API Base URL

Frontend API base URL can be configured in:

```js
client/src/config.js
```

```js
export const API_BASE_URL = "http://localhost:8000";
```

---

## Known Limitations

* Job state is file-based (not suitable for horizontal scaling)
* No authentication or rate limiting
* Polling used instead of push-based updates
* Media files stored locally
* Designed for private, low-volume use

---

## Future Improvements

* Redis-backed job queue
* Background worker system (Celery / RQ)
* Object storage (S3 / R2) 
* WebSocket or SSE job updates
* Authentication & rate limiting
* Progress tracking for downloads
* Frontend state machine (XState / reducer)
* Dockerized deployment

---