"use client";

import { useRef, useState, useCallback, useEffect, useMemo } from "react";
import Image from "next/image";
import { SONG } from "./constants";

type LyricLine = { time: number; text: string };

function parseLrc(text: string): LyricLine[] {
  const lines = text.split("\n");
  const result: LyricLine[] = [];
  const re = /\[(\d{2}):(\d{2})\.(\d{2,3})\]\s*(.*)/;

  for (const line of lines) {
    const match = line.match(re);
    if (!match) continue;

    const [, min, sec, frac, rawText] = match;
    const text = rawText.trim();

    // Skip empty text and section markers like [Verse 1]
    if (!text || /^\[.*\]$/.test(text)) continue;

    const fracSeconds =
      frac.length === 3 ? Number(frac) / 1000 : Number(frac) / 100;
    const time = Number(min) * 60 + Number(sec) + fracSeconds;
    result.push({ time, text });
  }

  return result.sort((a, b) => a.time - b.time);
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function Home() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [lyrics, setLyrics] = useState<LyricLine[]>([]);
  const [showLyrics, setShowLyrics] = useState(false);
  const lyricsContainerRef = useRef<HTMLDivElement>(null);

  const currentLyricIndex = useMemo(() => {
    let index = -1;
    for (let i = lyrics.length - 1; i >= 0; i--) {
      if (lyrics[i].time <= currentTime) {
        index = i;
        break;
      }
    }
    return index;
  }, [lyrics, currentTime]);

  useEffect(() => {
    if (!showLyrics || currentLyricIndex < 0) return;
    const container = lyricsContainerRef.current;
    if (!container) return;
    const el = container.querySelector(`[data-lyric-index="${currentLyricIndex}"]`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [currentLyricIndex, showLyrics]);

  useEffect(() => {
    fetch(SONG.lyricsSrc)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to fetch LRC: ${res.status}`);
        return res.text();
      })
      .then((text) => setLyrics(parseLrc(text)))
      .catch((err) => console.warn("Could not load lyrics:", err));
  }, []);

  function togglePlayback() {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  }

  const seekToPosition = useCallback((clientX: number) => {
    const audio = audioRef.current;
    const bar = progressRef.current;
    if (!audio || !bar) return;

    const rect = bar.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    audio.currentTime = ratio * audio.duration;
    setCurrentTime(audio.currentTime);
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    seekToPosition(e.clientX);
  }, [seekToPosition]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setIsDragging(true);
    seekToPosition(e.touches[0].clientX);
  }, [seekToPosition]);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => seekToPosition(e.clientX);
    const handleTouchMove = (e: TouchEvent) => seekToPosition(e.touches[0].clientX);
    const handleEnd = () => setIsDragging(false);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleEnd);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleEnd);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleEnd);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleEnd);
    };
  }, [isDragging, seekToPosition]);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="flex min-h-screen items-center justify-center bg-white font-sans">
      <main className="flex w-full max-w-xs flex-col items-center gap-6 px-4">
        <Image
          src={SONG.albumArt}
          alt="Album art"
          width={256}
          height={256}
          className="h-64 w-64 rounded-lg object-cover shadow-md"
          priority
        />

        <div className="flex flex-col items-center gap-1">
          <h1 className="text-xl font-semibold text-zinc-900">{SONG.title}</h1>
          <p className="text-sm text-zinc-500">{SONG.artist}</p>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={togglePlayback}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-400 text-white transition-colors hover:bg-rose-500"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5.14v13.72a1 1 0 0 0 1.5.86l11-6.86a1 1 0 0 0 0-1.72l-11-6.86A1 1 0 0 0 8 5.14z" />
              </svg>
            )}
          </button>

          <button
            onClick={() => setShowLyrics(!showLyrics)}
            className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
              showLyrics
                ? "bg-rose-400 text-white hover:bg-rose-500"
                : "bg-zinc-200 text-zinc-500 hover:bg-zinc-300"
            }`}
            aria-label={showLyrics ? "Hide lyrics" : "Show lyrics"}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 6h16" />
              <path d="M4 12h12" />
              <path d="M4 18h8" />
            </svg>
          </button>
        </div>

        <div className="w-full flex flex-col gap-1">
          <div
            ref={progressRef}
            className="relative h-2 w-full cursor-pointer rounded-full bg-zinc-200"
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            role="slider"
            aria-label="Seek"
            aria-valuemin={0}
            aria-valuemax={Math.floor(duration)}
            aria-valuenow={Math.floor(currentTime)}
          >
            <div
              className="absolute top-0 left-0 h-full rounded-full bg-rose-400 transition-[width] duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-zinc-500">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {showLyrics && lyrics.length > 0 && (
          <div
            ref={lyricsContainerRef}
            className="w-full max-h-48 overflow-y-auto rounded-lg bg-zinc-50 px-4 py-3"
            style={{ animation: "lyrics-panel-in 200ms ease-out" }}
          >
            <div className="flex flex-col gap-1">
              {lyrics.map((line, i) => (
                <p
                  key={line.time}
                  data-lyric-index={i}
                  className={`text-center transition-all duration-300 ${
                    i === currentLyricIndex
                      ? "text-base font-semibold text-rose-500"
                      : "text-sm text-zinc-400"
                  }`}
                >
                  {line.text}
                </p>
              ))}
            </div>
          </div>
        )}

        <audio
          ref={audioRef}
          src={SONG.audioSrc}
          onEnded={() => setIsPlaying(false)}
          onTimeUpdate={() => {
            if (!isDragging && audioRef.current) {
              setCurrentTime(audioRef.current.currentTime);
            }
          }}
          onLoadedMetadata={() => {
            if (audioRef.current) {
              setDuration(audioRef.current.duration);
            }
          }}
        />
      </main>
    </div>
  );
}
