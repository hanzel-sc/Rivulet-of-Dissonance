import { cn, formatDuration } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Clock, User, CheckCircle2 } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

function SearchResults({ results, selectedResult, onSelect }) {
  const { isDarkMode } = useTheme();

  return (
    <div className="w-full max-w-5xl mx-auto mt-8 pb-8">
      <h2 className={cn(
        "text-xl font-bold mb-5 text-center font-serif",
        isDarkMode ? "text-slate-100" : "text-slate-800"
      )}>
        Search Results
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {results.map((result) => (
          <div
            key={result.id}
            className={cn(
              "relative flex gap-3 p-2 rounded-xl cursor-pointer transition-all duration-200",
              "backdrop-blur-sm border hover:border-cyan-500/50",
              isDarkMode ? "bg-slate-900/50" : "bg-white/80 shadow-md",
              selectedResult?.id === result.id
                ? "border-cyan-500 ring-1 ring-cyan-500 shadow-[0_0_15px_rgba(0,229,255,0.15)]"
                : isDarkMode ? "border-slate-800" : "border-slate-200"
            )}
            onClick={() => onSelect(result)}
          >
            {/* Selection indicator */}
            {selectedResult?.id === result.id && (
              <div className="absolute -top-1 -right-1 z-30 bg-cyan-500 text-black p-0.5 rounded-full shadow-lg">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            )}

            {/* Compact Thumbnail */}
            <div className="relative w-24 h-16 flex-shrink-0 rounded-lg overflow-hidden">
              <img
                src={result.thumbnail}
                alt={result.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0.5 right-0.5">
                <Badge variant="cyan" className="text-[9px] px-1 py-0 backdrop-blur-md bg-black/60 border-none font-mono">
                  {formatDuration(result.duration)}
                </Badge>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 flex flex-col justify-center py-0.5">
              <h3 className={cn(
                "text-xs font-medium leading-tight line-clamp-2 transition-colors",
                selectedResult?.id === result.id
                  ? "text-cyan-400"
                  : isDarkMode ? "text-slate-100" : "text-slate-800"
              )}>
                {result.title}
              </h3>
              <div className="flex items-center gap-1 mt-1">
                <User className={cn("w-2.5 h-2.5", isDarkMode ? "text-slate-500" : "text-slate-400")} />
                <span className={cn("text-[10px] truncate", isDarkMode ? "text-slate-500" : "text-slate-500")}>
                  {result.uploader}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SearchResults;