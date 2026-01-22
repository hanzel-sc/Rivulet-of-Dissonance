import { useState } from 'react';
import SearchForm from './components/SearchForm';
import SearchResults from './components/SearchResults';
import ModeSelector from './components/ModeSelector';
import MediaDisplay from './components/MediaDisplay';

function App() {
  const [uiState, setUiState] = useState('idle'); // idle, searching, results, processing, ready, error
  const [searchResults, setSearchResults] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);
  const [selectedMode, setSelectedMode] = useState(null);
  const [jobId, setJobId] = useState(null);
  const [mediaData, setMediaData] = useState(null);
  const [error, setError] = useState(null);

  const handleSearch = async (query) => {
    setUiState('searching');
    setError(null);

    try {
      const res = await fetch('http://localhost:8000/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });

      const data = await res.json();

      if (!data.results || data.results.length === 0) {
        setError('No results found. Try a different search.');
        setUiState('error');
        return;
      }

      setSearchResults(data.results);
      setUiState('results');
    } catch (err) {
      setError('Search failed. Please try again.');
      setUiState('error');
    }
  };

  const handleSelectResult = (result) => {
    setSelectedResult(result);
    setSelectedMode(null); // Reset mode when changing selection
  };

  const handleModeSelect = (mode) => {
    setSelectedMode(mode);
  };

  const handleFetch = async () => {
    if (!selectedResult || !selectedMode) return;

    setUiState('processing');
    setError(null);

    try {
      const res = await fetch('http://localhost:8000/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          video_id: selectedResult.id,
          mode: selectedMode
        })
      });

      const data = await res.json();
      setJobId(data.job_id);

      if (selectedMode === 'video') {
        // Video is instant
        setMediaData({
          type: 'video',
          embed_url: data.embed_url,
          title: selectedResult.title
        });
        setUiState('ready');
      } else {
        // Audio requires polling
        pollJobStatus(data.job_id);
      }
    } catch (err) {
      setError('Processing failed. Please try another result.');
      setUiState('error');
    }
  };

  const pollJobStatus = async (jobId) => {
    const maxAttempts = 60;
    let attempts = 0;

    const poll = setInterval(async () => {
      attempts++;

      try {
        const res = await fetch(`http://localhost:8000/status/${jobId}`);
        const status = await res.json();

        if (status.status === 'ready') {
          clearInterval(poll);
          setMediaData({
            type: 'audio',
            url: `http://localhost:8000${status.url}`,
            title: selectedResult.title,
            jobId: jobId
          });
          setUiState('ready');
        } else if (status.status === 'failed') {
          clearInterval(poll);
          setError(status.error || 'Download failed. Try another result.');
          setUiState('error');
        }

        if (attempts >= maxAttempts) {
          clearInterval(poll);
          setError('Download timed out. Please try again.');
          setUiState('error');
        }
      } catch (err) {
        clearInterval(poll);
        setError('Status check failed. Please try again.');
        setUiState('error');
      }
    }, 1000);
  };

  const handleReset = () => {
    setUiState('idle');
    setSearchResults([]);
    setSelectedResult(null);
    setSelectedMode(null);
    setJobId(null);
    setMediaData(null);
    setError(null);
  };

  return (
    <div className="container">
      <h1>Basket</h1>

      <SearchForm onSearch={handleSearch} isSearching={uiState === 'searching'} />

      {error && (
        <div className="error-message">
          {error}
          <button onClick={handleReset} className="reset-btn">Search Again</button>
        </div>
      )}

      {uiState === 'results' && (
        <SearchResults
          results={searchResults}
          selectedResult={selectedResult}
          onSelect={handleSelectResult}
        />
      )}

      {selectedResult && uiState === 'results' && (
        <ModeSelector
          selectedMode={selectedMode}
          onModeSelect={handleModeSelect}
          onFetch={handleFetch}
          disabled={!selectedMode}
        />
      )}

      {uiState === 'processing' && (
        <div className="processing-state">
          <div className="spinner"></div>
          <p className="processing-text">
            {selectedMode === 'audio' ? 'Downloading audio...' : 'Loading video...'}
          </p>
          <p className="processing-title">{selectedResult.title}</p>
        </div>
      )}

      {uiState === 'ready' && mediaData && (
        <MediaDisplay media={mediaData} onReset={handleReset} />
      )}
    </div>
  );
}

export default App;