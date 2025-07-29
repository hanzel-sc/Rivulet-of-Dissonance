function VideoEmbed({ url }) {
  return (
    <div>
      <iframe
        width="560"
        height="315"
        src={url}
        frameBorder={0}
        allow="autoplay; encrypted-media"
        allowFullScreen
        title="YouTube Video"
      ></iframe>
    </div>
  );
}

export default VideoEmbed;
