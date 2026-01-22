import { useState } from 'react';

function SearchForm({ onSearch, isSearching }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="search-form">
      <input
        type="text"
        placeholder="Search for music or videos..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        disabled={isSearching}
        required
      />
      <button type="submit" disabled={isSearching || !query.trim()}>
        {isSearching ? 'Searching...' : 'Search'}
      </button>
    </form>
  );
}

export default SearchForm;