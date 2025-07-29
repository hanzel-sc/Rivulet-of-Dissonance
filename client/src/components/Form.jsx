import { useState } from 'react';

function Form({ setMedia }) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("audio");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:8000/fetch-media", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ query, type })
    });

    const data = await res.json();
    setMedia(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Enter search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        required
      />
      <label>
        <input
          type="radio"
          value="audio"
          checked={type === "audio"}
          onChange={() => setType("audio")}
        />
        Audio
      </label>
      <label>
        <input
          type="radio"
          value="video"
          checked={type === "video"}
          onChange={() => setType("video")}
        />
        Video
      </label>
      <button type="submit">Fetch</button>
    </form>
  );
}

export default Form;
