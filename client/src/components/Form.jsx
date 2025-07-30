import { useState } from 'react';

function Form({ setMedia }) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("audio");

  const mediaOptions = [
    {label:"Audio", value:"audio"},
    {label:"Video", value:"video"},
  ];

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
      <select id="dropdown" value={type} onChange={(e) => setType(e.target.value)}>
        {mediaOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>

        ))}
      </select>

      <button type="submit">Fetch</button>
    </form>
  );
}

export default Form;
