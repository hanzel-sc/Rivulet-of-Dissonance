function ModeSelector({ selectedMode, onModeSelect, onFetch, disabled }) {
  return (
    <div className="mode-selector">
      <h3>Choose format</h3>
      <div className="mode-options">
        <div
          className={`mode-option ${selectedMode === 'audio' ? 'selected' : ''}`}
          onClick={() => onModeSelect('audio')}
        >
          <div className="mode-icon">🎵</div>
          <div className="mode-label">Audio</div>
          <div className="mode-desc">Downloadable MP3</div>
        </div>
        <div
          className={`mode-option ${selectedMode === 'video' ? 'selected' : ''}`}
          onClick={() => onModeSelect('video')}
        >
          <div className="mode-icon">🎬</div>
          <div className="mode-label">Video</div>
          <div className="mode-desc">Embedded playback</div>
        </div>
      </div>
      <button
        className="fetch-btn"
        onClick={onFetch}
        disabled={disabled}
      >
        {selectedMode === 'audio' ? 'Download Audio' : selectedMode === 'video' ? 'Play Video' : 'Select Format'}
      </button>
    </div>
  );
}

export default ModeSelector;