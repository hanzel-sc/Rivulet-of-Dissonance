import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { API_BASE_URL } from "../config";
import { Download, RefreshCcw, Music, Video as VideoIcon } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

function MediaDisplay({ media, onReset, isDownloading = false }) {
  const { isDarkMode } = useTheme();

  const ERROR_MESSAGES = {
    SOURCE_RESTRICTED:
      "This track can’t be downloaded right now due to temporary restrictions from the source platform. You can still listen via the embedded player.",
    UNKNOWN_ERROR:
      "Something went wrong while processing this request. Please try again later."
  };


  return (
    <div className={cn(
      "w-full max-w-3xl mx-auto mt-6 md:mt-12 p-4 md:p-8 rounded-3xl backdrop-blur-xl border-2 shadow-2xl",
      isDarkMode
        ? "bg-slate-900/40 border-slate-800"
        : "bg-white/80 border-slate-200"
    )}>
      <div className="flex items-center gap-4 mb-8">
        <div className={cn(
          "w-12 h-12 rounded-2xl flex items-center justify-center",
          isDarkMode ? "bg-cyan-500/20 text-cyan-400" : "bg-cyan-100 text-cyan-600"
        )}>
          {media.type === "audio" ? <Music className="w-6 h-6" /> : <VideoIcon className="w-6 h-6" />}
        </div>
        <div>
          <h3 className={cn(
            "text-xl font-bold font-serif leading-tight",
            isDarkMode ? "text-slate-100" : "text-slate-800"
          )}>
            {media.title}
          </h3>
        </div>
      </div>

      {media.type === "audio" && media.status === "ready" && (
        <div className="flex flex-col gap-8 items-center">
          <div className={cn(
            "w-full p-2 rounded-xl border shadow-inner",
            isDarkMode ? "bg-black/40 border-slate-800" : "bg-slate-100 border-slate-200"
          )}>
            <audio
              controls
              src={`${API_BASE_URL}/download/${media.jobId}`}
              autoPlay
              className="w-full h-9"
            />
          </div>
          {media.status === "blocked" && (
            <div
              className={cn(
                "mt-6 p-5 rounded-2xl border text-center space-y-2",
                isDarkMode
                  ? "border-yellow-500/30 bg-yellow-500/10 text-yellow-300"
                  : "border-yellow-400/40 bg-yellow-100/60 text-yellow-800"
              )}
            >
              <p className="font-semibold text-sm tracking-wide uppercase">
                Download unavailable
              </p>
              <p className="text-sm leading-relaxed opacity-90">
                {ERROR_MESSAGES[media.error] ||
                  "This item can’t be downloaded right now."}
              </p>
            </div>
          )}


          <a href={`${API_BASE_URL}/download/${media.jobId}`} download className="block w-full max-w-sm">
            <button className={cn(
              "slide-button w-full h-14 text-lg",
              !isDarkMode && "slide-button-light"
            )}>
              {isDownloading ? (
                <>
                  <Spinner className="w-5 h-5 mr-2" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5 mr-2" />
                  <span>Download MP3</span>
                </>
              )}
            </button>
          </a>
        </div>
      )}

      {media.type === "video" && (
        <div className={cn(
          "rounded-2xl overflow-hidden border-2 shadow-2xl aspect-video mb-8",
          isDarkMode ? "border-slate-800" : "border-slate-200"
        )}>
          <iframe
            width="100%"
            height="100%"
            src={media.embed_url}
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
            title={media.title}
          />
        </div>
      )}

      <div className={cn(
        "mt-10 pt-8 border-t flex justify-center",
        isDarkMode ? "border-slate-800" : "border-slate-200"
      )}>
        <button
          className={cn(
            "flex items-center gap-2 transition-colors uppercase tracking-[0.2em] text-xs font-bold",
            isDarkMode
              ? "text-slate-400 hover:text-cyan-400"
              : "text-slate-500 hover:text-cyan-600"
          )}
          onClick={onReset}
        >
          <RefreshCcw className="w-4 h-4" />
          Search Again
        </button>
      </div>
    </div>
  );
}

export default MediaDisplay;