import { useState } from "react";
import { motion } from "motion/react";
import { LampContainer } from "@/components/ui/lamp";
import { Spinner } from "@/components/ui/spinner";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Footer } from "./components/Footer";
import { useTheme } from "@/context/ThemeContext";
import SearchForm from "./components/SearchForm";
import SearchResults from "./components/SearchResults";
import ModeSelector from "./components/ModeSelector";
import MediaDisplay from "./components/MediaDisplay";
import { API_BASE_URL } from "./config";

function App() {
  const { isDarkMode } = useTheme();
  const [uiState, setUiState] = useState("idle"); // idle, searching, results, processing, ready, error
  const [searchResults, setSearchResults] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);
  const [selectedMode, setSelectedMode] = useState(null);
  const [jobId, setJobId] = useState(null);
  const [mediaData, setMediaData] = useState(null);
  const [error, setError] = useState(null);

  const handleSearch = async (query) => {
    setUiState("searching");
    setError(null);

    try {
      const res = await fetch(`${API_BASE_URL}/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const data = await res.json();

      if (!data.results || data.results.length === 0) {
        setError("No results found. Try a different search.");
        setUiState("error");
        return;
      }

      setSearchResults(data.results);
      setUiState("results");
    } catch (err) {
      setError("Search failed. Please try again.");
      setUiState("error");
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

    setUiState("processing");
    setError(null);

    try {
      const res = await fetch(`${API_BASE_URL}/process`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          video_id: selectedResult.id,
          mode: selectedMode,
        }),
      });

      const data = await res.json();
      setJobId(data.job_id);

      if (selectedMode === "video") {
        // Video is instant
        setMediaData({
          type: "video",
          embed_url: data.embed_url,
          title: selectedResult.title,
        });
        setUiState("ready");
      } else {
        // Audio requires polling
        pollJobStatus(data.job_id);
      }
    } catch (err) {
      setError("Processing failed. Please try another result.");
      setUiState("error");
    }
  };

  const pollJobStatus = async (jobId) => {
    const maxAttempts = 60;
    let attempts = 0;

    const poll = setInterval(async () => {
      attempts++;

      try {
        const res = await fetch(`${API_BASE_URL}/status/${jobId}`);
        const status = await res.json();

        if (status.status === "ready") {
          clearInterval(poll);
          setMediaData({
            type: "audio",
            url: `${API_BASE_URL}${status.url}`,
            title: selectedResult.title,
            jobId: jobId,
          });
          setUiState("ready");
        } else if (status.status === "failed") {
          clearInterval(poll);
          setError(status.error || "Download failed. Try another result.");
          setUiState("error");
        }

        if (attempts >= maxAttempts) {
          clearInterval(poll);
          setError("Download timed out. Please try again.");
          setUiState("error");
        }
      } catch (err) {
        clearInterval(poll);
        setError("Status check failed. Please try again.");
        setUiState("error");
      }
    }, 1000);
  };

  const handleReset = () => {
    setUiState("idle");
    setSearchResults([]);
    setSelectedResult(null);
    setSelectedMode(null);
    setJobId(null);
    setMediaData(null);
    setError(null);
  };

  return (
    <>
      {/* Logo - Fixed Top Left */}
      <div className="fixed top-0 left-0 z-[100]">
        <img
          src="/logo.png"
          alt="Basket Logo"
          className="w-12 h-12 md:w-20 md:h-20 object-contain drop-shadow-lg"
        />
      </div>

      {/* Theme Toggle - Fixed Top Right */}
      <div className="fixed top-2 right-2 md:top-4 md:right-4 z-[100]">
        <ThemeToggle />
      </div>

      {/* Footer - Social Links */}
      <Footer />

      <LampContainer className="pb-10">
        <div className="w-full max-w-5xl mx-auto px-4">
          {/* Title */}
          <motion.h1
            initial={{ opacity: 0.5, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.2,
              duration: 0.6,
              ease: "easeInOut",
            }}
            className={`bg-gradient-to-br py-2 bg-clip-text text-center text-5xl font-bold tracking-tight text-transparent md:text-7xl mb-6 font-serif ${isDarkMode
              ? "from-slate-300 to-slate-500"
              : "from-slate-700 to-slate-900"
              }`}
          >
            Basket
          </motion.h1>

          {/* Search Form */}
          <SearchForm
            onSearch={handleSearch}
            isSearching={uiState === "searching"}
          />

          {/* Error State */}
          {error && (
            <div className={`max-w-xl mx-auto mt-6 p-4 rounded-xl border text-center text-sm font-medium ${isDarkMode
              ? "bg-red-500/20 border-red-500/50 text-red-200"
              : "bg-red-100 border-red-300 text-red-700"
              }`}>
              {error}
              <div className="mt-3">
                <HoverBorderGradient
                  containerClassName="mx-auto"
                  className="px-4 py-1.5 text-sm"
                  onClick={handleReset}
                >
                  Search Again
                </HoverBorderGradient>
              </div>
            </div>
          )}

          {/* Search Results */}
          {uiState === "results" && (
            <SearchResults
              results={searchResults}
              selectedResult={selectedResult}
              onSelect={handleSelectResult}
            />
          )}

          {/* Mode Selector */}
          {selectedResult && uiState === "results" && (
            <ModeSelector
              selectedMode={selectedMode}
              onModeSelect={handleModeSelect}
              onFetch={handleFetch}
              disabled={!selectedMode}
            />
          )}

          {/* Processing State */}
          {uiState === "processing" && (
            <div className="mt-10 text-center">
              <Spinner className="w-12 h-12 mx-auto mb-4 text-cyan-400" />
              <p className={`text-base font-semibold mb-1 ${isDarkMode ? "text-slate-200" : "text-slate-700"}`}>
                {selectedMode === "audio"
                  ? "Downloading audio..."
                  : "Loading video..."}
              </p>
              <p className={`text-xs italic truncate max-w-md mx-auto ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                {selectedResult.title}
              </p>
            </div>
          )}

          {/* Media Display */}
          {uiState === "ready" && mediaData && (
            <MediaDisplay media={mediaData} onReset={handleReset} />
          )}
        </div>
      </LampContainer>
    </>
  );
}

export default App;
