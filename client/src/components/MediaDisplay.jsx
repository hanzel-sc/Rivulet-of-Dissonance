function MediaDisplay({ media, onReset }) {
  return (
    <div className="media-display">
      <h3 className="media-title">{media.title}</h3>

      {media.type === 'audio' && (
        <div className="audio-player">
          <audio controls src={media.url} autoPlay></audio>
          <a href={`http://localhost:8000/download/${media.jobId}`} download>
            <button className="download-btn">Download MP3</button>
          </a>
        </div>
      )}

      {media.type === 'video' && (
        <div className="video-player">
          <iframe
            width="100%"
            height="400"
            src={media.embed_url}
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
            title={media.title}
          ></iframe>
        </div>
      )}

      <button onClick={onReset} className="reset-btn">
        Search Again
      </button>
    </div>
  );
}

export default MediaDisplay;