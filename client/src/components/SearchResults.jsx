function SearchResults({ results, selectedResult, onSelect }) {
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="results-container">
      <h2 className="results-title">Select a result</h2>
      <div className="results-list">
        {results.map((result) => (
          <div
            key={result.id}
            className={`result-card ${selectedResult?.id === result.id ? 'selected' : ''}`}
            onClick={() => onSelect(result)}
          >
            <img
              src={result.thumbnail}
              alt={result.title}
              className="result-thumbnail"
            />
            <div className="result-info">
              <h3 className="result-title">{result.title}</h3>
              <p className="result-uploader">{result.uploader}</p>
              <p className="result-duration">{formatDuration(result.duration)}</p>
            </div>
            <div className="result-select-indicator">
              {selectedResult?.id === result.id && '✓'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SearchResults;