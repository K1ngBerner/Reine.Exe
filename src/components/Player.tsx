import { translateTree } from "../i18n/tree";
import { useEffect, useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX, Music2 } from "lucide-react";
import { music } from "../data/music";
export default function Player({ requestPlay }: { requestPlay: number }) {
  const ref = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [available, setAvailable] = useState(Boolean(music.src));
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(() => {
    try {
      const saved = Number(sessionStorage.getItem("reine-volume") ?? 0.2);
      return Number.isFinite(saved) ? Math.max(0, Math.min(1, saved)) : 0.2;
    } catch {
      return 0.2;
    }
  });
  const [muted, setMuted] = useState(false);
  const [expanded, setExpanded] = useState(false);
  useEffect(() => {
    if (ref.current) ref.current.volume = volume;
    try {
      sessionStorage.setItem("reine-volume", String(volume));
    } catch {
      /* optional storage */
    }
  }, [volume]);
  useEffect(() => {
    if (requestPlay > 0) {
      setVolume(0.2);
      if (ref.current) ref.current.volume = 0.2;
      void ref.current?.play().catch(() => setPlaying(false));
    }
  }, [requestPlay]);
  function toggle() {
    if (!ref.current) return;
    if (playing) ref.current.pause();
    else void ref.current.play().catch(() => setAvailable(false));
  }
  return translateTree(
    <div className={`music-player ${expanded ? "expanded" : ""}`}>
      <audio
        ref={ref}
        src={music.src || undefined}
        preload="metadata"
        loop
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onError={() => {
          setAvailable(false);
          setPlaying(false);
        }}
        onLoadedMetadata={() => {
          setAvailable(true);
          setDuration(ref.current?.duration || 0);
        }}
        onTimeUpdate={() => setTime(ref.current?.currentTime || 0)}
        muted={muted}
      />
      <div className="player-main">
        <button
          className="track-info"
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
          aria-label="Abrir controles de música"
        >
          <Music2 size={18} />
          <span>
            <small>{playing ? "NOW PLAYING" : "SOUNDTRACK / PAUSADO"}</small>
            <strong>{music.title}</strong>
          </span>
        </button>
        <button
          aria-label={playing ? "Pausar música" : "Tocar música"}
          onClick={toggle}
          disabled={!available}
        >
          {playing ? <Pause size={18} /> : <Play size={18} />}
        </button>
      </div>
      {expanded && (
        <div className="player-controls">
          {available ? (
            <>
              <p>{music.artist}</p>
              <label>
                Progresso{" "}
                <span>
                  {Math.floor(time / 60)}:
                  {String(Math.floor(time % 60)).padStart(2, "0")}
                </span>
                <input
                  aria-label="Progresso da música"
                  type="range"
                  min="0"
                  max={duration || 1}
                  step="1"
                  value={time}
                  onChange={(e) => {
                    if (ref.current)
                      ref.current.currentTime = Number(e.target.value);
                  }}
                />
              </label>
              <div className="volume-row">
                <button
                  aria-label={muted ? "Ativar som" : "Silenciar"}
                  onClick={() => setMuted(!muted)}
                >
                  {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
                <input
                  aria-label="Volume"
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                />
              </div>
            </>
          ) : (
            <p>Faixa local indisponível.</p>
          )}
          <a href={music.streaming} target="_blank" rel="noopener noreferrer">
            Rosa Walton · ouvir no streaming ↗
          </a>
        </div>
      )}
    </div>,
  );
}
