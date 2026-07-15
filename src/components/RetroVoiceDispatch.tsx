"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Square, RotateCcw, Volume2, VolumeX } from "lucide-react";

interface RetroVoiceDispatchProps {
  quote: string;
}

export default function RetroVoiceDispatch({ quote }: RetroVoiceDispatchProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeWordIndex, setActiveWordIndex] = useState(-1);
  const [isMuted, setIsMuted] = useState(false);
  const words = quote.split(/\s+/);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Stop speech synthesis and timers on unmount or quote change
  useEffect(() => {
    stopPlayback();
    return () => {
      stopPlayback();
    };
  }, [quote]);

  const stopPlayback = () => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsPlaying(false);
    setActiveWordIndex(-1);
  };

  const startPlayback = () => {
    stopPlayback();

    const hasSpeechSynthesis = typeof window !== "undefined" && window.speechSynthesis;

    if (hasSpeechSynthesis && !isMuted) {
      const utterance = new SpeechSynthesisUtterance(quote);
      utteranceRef.current = utterance;

      // Find a suitable deep or low-pitched voice if possible
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = 
        voices.find(v => v.name.toLowerCase().includes("google us english") || v.name.toLowerCase().includes("male") || v.lang.startsWith("en-US")) 
        || voices[0];
      
      if (preferredVoice) utterance.voice = preferredVoice;
      utterance.rate = 0.82; // Slow, poetic cadence
      utterance.pitch = 0.85; // Low-pitch

      // Synchronize highlighting with spoken words using onboundary
      utterance.onboundary = (event) => {
        if (event.name === "word") {
          const charIndex = event.charIndex;
          const textBefore = quote.substring(0, charIndex);
          const wordsBefore = textBefore.trim().split(/\s+/);
          const index = textBefore.trim() === "" ? 0 : wordsBefore.length;
          setActiveWordIndex(index);
        }
      };

      utterance.onend = () => {
        setIsPlaying(false);
        setActiveWordIndex(-1);
      };

      utterance.onerror = () => {
        // Fallback to visual-only animation if speech synthesis fails
        startVisualTimerOnly();
      };

      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
    } else {
      // Fallback to text highlight timer (visual-only)
      startVisualTimerOnly();
    }
  };

  const startVisualTimerOnly = () => {
    setIsPlaying(true);
    let index = 0;
    setActiveWordIndex(0);

    timerRef.current = setInterval(() => {
      index++;
      if (index >= words.length) {
        stopPlayback();
      } else {
        setActiveWordIndex(index);
      }
    }, 380); // Roughly 160 words per minute
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      stopPlayback();
    } else {
      startPlayback();
    }
  };

  const handleMuteToggle = () => {
    const wasPlaying = isPlaying;
    stopPlayback();
    setIsMuted(!isMuted);
    
    // Auto-restart with the new mode if it was already playing
    if (wasPlaying) {
      setTimeout(() => {
        setIsMuted(prevMuted => {
          // Temporarily capture state inside timeout
          return prevMuted;
        });
        startPlayback();
      }, 50);
    }
  };

  return (
    <div className="border border-neutral-800/80 bg-neutral-900/40 rounded-xl p-4 space-y-4 shadow-inner relative overflow-hidden">
      {/* Tape Deck Header */}
      <div className="flex justify-between items-center text-[10px] font-mono text-neutral-500 uppercase tracking-widest border-b border-neutral-800/60 pb-2">
        <span className="flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${isPlaying ? "bg-red-500 animate-pulse" : "bg-neutral-800"}`} />
          {isPlaying ? "DISPATCH PLAYING" : "DISPATCH STANDBY"}
        </span>
        <span>NOMAD-DECK II</span>
      </div>

      {/* Cassette Graphic (SVG) */}
      <div className="w-full h-24 bg-neutral-950 rounded-lg flex items-center justify-center border border-neutral-900 shadow-inner relative overflow-hidden">
        {/* Background grid lines */}
        <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#808080_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none" />

        {/* Cassette Shell */}
        <div className="w-48 h-18 bg-neutral-900 border border-neutral-800 rounded-md relative flex flex-col justify-between p-2">
          {/* Label area */}
          <div className="h-6 w-full bg-orange-500/10 border border-orange-500/30 rounded flex items-center justify-center font-mono text-[9px] text-orange-500 uppercase tracking-wider">
            VOICE REC: BOURDAIN_NOTES
          </div>

          {/* Tape window & spindles */}
          <div className="h-6 w-28 mx-auto bg-neutral-950 border border-neutral-800 rounded-sm relative flex justify-between items-center px-4 overflow-hidden">
            {/* Sprocket 1 */}
            <motion.svg 
              className="w-4 h-4 text-neutral-600 fill-current"
              animate={isPlaying ? { rotate: 360 } : {}}
              transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
              <path d="M12 2v20M2 12h20M5 5l14 14M5 19L19 5" stroke="currentColor" strokeWidth="2" />
            </motion.svg>

            {/* Simulated Tape reels */}
            <div className="w-10 h-0.5 bg-neutral-800 absolute left-9 top-1/2 -translate-y-1/2" />

            {/* Sprocket 2 */}
            <motion.svg 
              className="w-4 h-4 text-neutral-600 fill-current"
              animate={isPlaying ? { rotate: 360 } : {}}
              transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
              <path d="M12 2v20M2 12h20M5 5l14 14M5 19L19 5" stroke="currentColor" strokeWidth="2" />
            </motion.svg>
          </div>

          {/* Screws and details */}
          <div className="w-full flex justify-between px-1">
            <span className="w-1 h-1 rounded-full bg-neutral-800" />
            <span className="w-1 h-1 rounded-full bg-neutral-800" />
          </div>
        </div>
      </div>

      {/* Media Controls */}
      <div className="flex items-center justify-between bg-neutral-950/60 border border-neutral-900 rounded-lg p-2">
        <div className="flex gap-2">
          <button
            onClick={handlePlayPause}
            className={`p-2 rounded-md transition-all ${
              isPlaying 
                ? "bg-amber-500/10 border border-amber-500/30 text-amber-500" 
                : "bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white"
            }`}
            title={isPlaying ? "Pause Dispatch" : "Play Dispatch"}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button
            onClick={stopPlayback}
            disabled={!isPlaying}
            className="p-2 rounded-md bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white disabled:opacity-40 disabled:hover:text-neutral-400 transition-all"
            title="Stop"
          >
            <Square className="w-4 h-4" />
          </button>
        </div>

        {/* Waveform Visualizer */}
        <div className="flex items-end gap-[2px] h-6 px-4 flex-1 justify-center">
          {Array.from({ length: 14 }).map((_, i) => {
            const randomHeights = [6, 24, 10, 18, 12, 20, 8];
            const defaultHeight = 4;
            return (
              <motion.div
                key={i}
                className="w-[3px] bg-orange-500 rounded-t"
                animate={{
                  height: isPlaying 
                    ? [
                        `${randomHeights[i % 7]}px`, 
                        `${randomHeights[(i + 2) % 7]}px`, 
                        `${randomHeights[(i + 4) % 7]}px`
                      ]
                    : `${defaultHeight}px`
                }}
                transition={{
                  repeat: Infinity,
                  duration: 0.6 + (i % 3) * 0.1,
                  ease: "easeInOut"
                }}
              />
            );
          })}
        </div>

        {/* Mute Button */}
        <button
          onClick={handleMuteToggle}
          className={`p-2 rounded-md transition-all ${
            isMuted 
              ? "text-red-500 bg-red-500/10 border border-red-500/20" 
              : "text-neutral-400 hover:text-white bg-neutral-900 border border-neutral-800"
          }`}
          title={isMuted ? "Unmute Voice" : "Mute (Visual Highlight Only)"}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Transcript Text with Spoken Word Highlighting */}
      <div className="bg-neutral-950/40 p-3 rounded-lg border border-neutral-900/60 font-serif text-sm leading-relaxed text-neutral-400 max-h-32 overflow-y-auto">
        {words.map((word, index) => {
          const isActive = index === activeWordIndex;
          const isSpoken = index < activeWordIndex;
          return (
            <span
              key={index}
              className={`mr-1 transition-all duration-150 inline-block ${
                isActive 
                  ? "text-orange-500 text-glow-amber scale-105 font-semibold" 
                  : isSpoken 
                  ? "text-neutral-200" 
                  : "text-neutral-500"
              }`}
            >
              {word}
            </span>
          );
        })}
      </div>
    </div>
  );
}
