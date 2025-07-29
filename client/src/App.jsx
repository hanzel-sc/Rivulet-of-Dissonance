import { useState } from 'react';
import Form from './components/Form';
import Player from './components/Player';
import VideoEmbed from './components/VideoEmbed';

function App() {
  const [media, setMedia] = useState(null);

  return (
    <div className="container">
      <h1>Media Fetcher</h1>
      <Form setMedia={setMedia} />
      {media?.type === "audio" && <Player url={media.url} />}
      {media?.type === "video" && <VideoEmbed url={media.embed_url} />}
    </div>
  );
}

export default App;
