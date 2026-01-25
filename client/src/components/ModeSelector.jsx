import { cn } from "@/lib/utils";
import { Music, Video, ArrowRight } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

function ModeSelector({ selectedMode, onModeSelect, onFetch, disabled }) {
  const { isDarkMode } = useTheme();

  return (
    <div className="w-full max-w-lg mx-auto mt-6 text-center">
      <h3 className={cn(
        "text-base font-semibold mb-4",
        isDarkMode ? "text-slate-300" : "text-slate-600"
      )}>
        Choose format
      </h3>

      {/* Toggle Button Group */}
      <div className="flex justify-center gap-2 mb-5">
        <button
          type="button"
          onClick={() => onModeSelect("audio")}
          className={cn(
            "flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-all duration-200",
            "border-2",
            selectedMode === "audio"
              ? "bg-cyan-500 text-black border-cyan-500 shadow-[0_0_15px_rgba(0,229,255,0.3)]"
              : isDarkMode
                ? "bg-slate-900/60 text-slate-300 border-slate-700 hover:border-cyan-500/50 hover:text-white"
                : "bg-white/80 text-slate-600 border-slate-300 hover:border-cyan-500/50 hover:text-slate-900"
          )}
        >
          <Music className="w-4 h-4" />
          Audio
        </button>

        <button
          type="button"
          onClick={() => onModeSelect("video")}
          className={cn(
            "flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-all duration-200",
            "border-2",
            selectedMode === "video"
              ? "bg-cyan-500 text-black border-cyan-500 shadow-[0_0_15px_rgba(0,229,255,0.3)]"
              : isDarkMode
                ? "bg-slate-900/60 text-slate-300 border-slate-700 hover:border-cyan-500/50 hover:text-white"
                : "bg-white/80 text-slate-600 border-slate-300 hover:border-cyan-500/50 hover:text-slate-900"
          )}
        >
          <Video className="w-4 h-4" />
          Video
        </button>
      </div>

      {/* Fetch Button */}
      <div className="flex justify-center">
        <button
          className={cn(
            "slide-button min-w-[180px] text-sm uppercase tracking-wide",
            !isDarkMode && "slide-button-light"
          )}
          onClick={onFetch}
          disabled={disabled}
        >
          {selectedMode === "audio"
            ? "Get Audio"
            : selectedMode === "video"
              ? "Watch Video"
              : "Select Format"}
          <ArrowRight className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  );
}

export default ModeSelector;