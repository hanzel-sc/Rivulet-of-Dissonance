// Player.jsx
function Player({ url }) {
  const filename = url.split("/").pop();

  return (
    <div className="media-player">
      <audio controls src={url} />
      <a href={`http://localhost:8000/download/${filename}`} download>
        <button className="download-btn">Download</button>
      </a>
    </div>
  );
}

export default Player;
