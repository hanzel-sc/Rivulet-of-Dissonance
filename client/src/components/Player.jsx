function Player({ url }) {
  const filename = url.split("/").pop(); // Gets the file name from the URL

  return (
    <div>
      <audio controls src={url}></audio>
      <br />
      <a href={`http://localhost:8000/download/${filename}`} download>
        <button>Download</button>
      </a>
    </div>
  );
}

export default Player;
