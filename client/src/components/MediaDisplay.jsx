import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { API_BASE_URL } from "../config";
import { Download, RefreshCcw, Music, Video as VideoIcon } from "lucide-react";

function MediaDisplay({ media, onReset, isDownloading = false }) {
  return (
    <div className="w-full max-w-3xl mx-auto mt-12 p-8 rounded-3xl bg-slate-900/40 backdrop-blur-xl border-2 border-slate-800 shadow-2xl">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 flex items-center justify-center text-cyan-400">
          {media.type === "audio" ? <Music className="w-6 h-6" /> : <VideoIcon className="w-6 h-6" />}
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-100 font-serif leading-tight">
            {media.title}
          </h3>
        </div>
      </div>

      {media.type === "audio" && (
        <div className="flex flex-col gap-8 items-center">
          <div className="w-full p-2 rounded-xl bg-black/40 border border-slate-800 shadow-inner">
            <audio
              controls
              src={media.url}
              autoPlay
              className="w-full h-9"
            />
          </div>

          <a href={`${API_BASE_URL}/download/${media.jobId}`} download className="block w-full max-w-sm">
            <button className="slide-button w-full h-14 text-lg">
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
        <div className="rounded-2xl overflow-hidden border-2 border-slate-800 shadow-2xl aspect-video mb-8">
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

      <div className="mt-10 pt-8 border-t border-slate-800 flex justify-center">
        <button
          className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors uppercase tracking-[0.2em] text-xs font-bold"
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