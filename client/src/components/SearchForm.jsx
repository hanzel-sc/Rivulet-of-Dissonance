import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Search } from "lucide-react";
import React, { useState } from "react";

function SearchForm({ onSearch, isSearching }) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="flex flex-col md:flex-row gap-4 items-center w-full">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            type="search"
            placeholder="Search for music or videos..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={isSearching}
            className="w-full pl-12 h-11 bg-slate-900/50 border-slate-800 text-white rounded-xl focus:ring-cyan-500/50 focus:border-cyan-500 transition-all text-lg"
          />
        </div>
        <button
          type="submit"
          disabled={isSearching || !query.trim()}
          className="slide-button w-full md:w-auto min-w-[140px]"
        >
          {isSearching ? (
            <>
              <Spinner className="w-4 h-4" />
              <span>Searching</span>
            </>
          ) : (
            <>
              <span>Search</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}

export default SearchForm;