// App.jsx
import { useState } from 'react';
import Form from './components/Form';
import Player from './components/Player';
import VideoEmbed from './components/VideoEmbed';
import SnowCanvas from './components/Canvas';
import Starfield from './components/Starfield';

function App() {
  const [media, setMedia] = useState(null);

  return (
  <> 
    <Starfield/>
    <div className="container">
      <img src="/frost.jpeg" alt="background" class="bg-image" />
      <h1>BASKET</h1>
      <Form setMedia={setMedia} />
      
      <div className={`media-wrapper ${media ? 'visible' : ''}`}>
        {media?.type === "audio" && <Player url={media.url} />}
        {media?.type === "video" && <VideoEmbed url={media.embed_url} />}
      </div>
    </div>
  </>
  );
}

export default App;
