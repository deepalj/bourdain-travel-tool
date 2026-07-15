"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Compass, 
  MapPin, 
  Utensils, 
  BookOpen, 
  Cpu, 
  Database, 
  Sparkles, 
  Globe,
  Loader2
} from "lucide-react";
import { Destination } from "@/data/destinations";
import { fetchDestinations } from "@/utils/dataService";
import { isSupabaseConfigured } from "@/utils/supabase";

interface BourdainTravelAppProps {
  globeComponent?: React.ReactNode;
  onDestinationSelect?: (dest: Destination) => void;
}

export default function BourdainTravelApp({ globeComponent, onDestinationSelect }: BourdainTravelAppProps) {
  const [destinationsList, setDestinationsList] = useState<Destination[]>([]);
  const [selectedDestId, setSelectedDestId] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"journal" | "culinary" | "portfolio">("journal");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDestinations().then(data => {
      setDestinationsList(data);
      if (data.length > 0) {
        setSelectedDestId(data[0].id);
        if (onDestinationSelect) {
          onDestinationSelect(data[0]);
        }
      }
      setIsLoading(false);
    });
  }, [onDestinationSelect]);

  const selectedDest = destinationsList.find(d => d.id === selectedDestId);

  // Trigger callback when destination selection changes (important for the globe to sync)
  const handleDestinationSelect = (dest: Destination) => {
    setSelectedDestId(dest.id);
    if (onDestinationSelect) {
      onDestinationSelect(dest);
    }
  };

  if (isLoading) {
    return (
      <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-[#060607] text-neutral-300 font-mono">
        <div className="pointer-events-none absolute inset-0 grain-overlay z-50" />
        <div className="flex flex-col items-center gap-4 text-center p-8 max-w-sm">
          <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
          <h3 className="text-sm font-semibold tracking-widest text-glow-amber uppercase">Reading Logs</h3>
          <p className="text-xs text-neutral-500 italic">
            &ldquo;Travel isn&apos;t always pretty. It isn&apos;t always comfortable.&rdquo;
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full flex flex-col md:flex-row overflow-hidden bg-[#060607]">
      {/* Grain Overlay */}
      <div className="pointer-events-none absolute inset-0 grain-overlay z-50" />

      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 ambient-glow rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 ambient-glow-red rounded-full pointer-events-none" />

      {/* Left Sidebar: Journal / Stats / Portfolio */}
      <aside className="w-full md:w-[420px] lg:w-[460px] flex-shrink-0 flex flex-col border-b md:border-b-0 md:border-r border-neutral-800/60 bg-neutral-950/80 backdrop-blur-md z-10">
        {/* Header Section */}
        <div className="p-6 border-b border-neutral-800/60">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-500 animate-pulse">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-widest text-neutral-500 font-mono">Field Dispatch</span>
              <h1 className="text-xl font-bold font-serif text-white tracking-tight text-glow-amber">
                Bourdain&apos;s Travel Tool
              </h1>
            </div>
          </div>
          <p className="text-xs text-neutral-400 font-serif italic mt-2 leading-relaxed">
            &ldquo;If I&apos;m advocate for anything, it&apos;s to move. As far as you can, as much as you can. Across the ocean, or simply across the river.&rdquo;
          </p>
        </div>

        {/* Dynamic Navigation Tabs */}
        <div className="grid grid-cols-3 border-b border-neutral-800/60 font-mono text-xs text-center bg-neutral-900/30">
          <button
            onClick={() => setActiveTab("journal")}
            className={`py-3 flex flex-col items-center gap-1 border-b-2 transition-all ${
              activeTab === "journal" 
                ? "border-orange-500 text-orange-500 bg-orange-500/5 font-semibold" 
                : "border-transparent text-neutral-400 hover:text-neutral-200"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Field Notes</span>
          </button>
          <button
            onClick={() => setActiveTab("culinary")}
            className={`py-3 flex flex-col items-center gap-1 border-b-2 transition-all ${
              activeTab === "culinary" 
                ? "border-orange-500 text-orange-500 bg-orange-500/5 font-semibold" 
                : "border-transparent text-neutral-400 hover:text-neutral-200"
            }`}
          >
            <Utensils className="w-4 h-4" />
            <span>Tasting Log</span>
          </button>
          <button
            onClick={() => setActiveTab("portfolio")}
            className={`py-3 flex flex-col items-center gap-1 border-b-2 transition-all ${
              activeTab === "portfolio" 
                ? "border-orange-500 text-orange-500 bg-orange-500/5 font-semibold" 
                : "border-transparent text-neutral-400 hover:text-neutral-200"
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>Builder Log</span>
          </button>
        </div>

        {/* Tab Content (Scrollable Area) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <AnimatePresence mode="wait">
            {activeTab === "journal" && selectedDest && (
              <motion.div
                key="journal"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* Destination Selector */}
                <div>
                  <h2 className="text-xs uppercase tracking-widest text-neutral-500 font-mono mb-3">Choose Destination</h2>
                  <div className="flex flex-wrap gap-2">
                    {destinationsList.map((dest) => (
                      <button
                        key={dest.id}
                        onClick={() => handleDestinationSelect(dest)}
                        className={`px-3 py-1.5 rounded-md text-xs font-mono border transition-all ${
                          selectedDestId === dest.id
                            ? "bg-orange-500/10 border-orange-500/40 text-orange-500"
                            : "bg-neutral-900/60 border-neutral-800 hover:border-neutral-700 text-neutral-400 hover:text-neutral-200"
                        }`}
                      >
                        {dest.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Location coordinates */}
                <div className="flex items-center gap-2 text-xs font-mono text-neutral-500 bg-neutral-900/40 border border-neutral-900 px-3 py-2 rounded-md">
                  <MapPin className="w-3.5 h-3.5 text-orange-500/70" />
                  <span>COORDS: {selectedDest.coordinates}</span>
                </div>

                {/* The Quote Block (Cinematic Typewriter Vibe) */}
                <div className="relative border-l-2 border-orange-500/40 pl-4 py-1 italic text-neutral-300 font-serif text-lg leading-relaxed bg-orange-950/5 pr-2 rounded-r-md">
                  <span className="absolute -top-3 left-2 text-5xl text-orange-500/10 font-serif select-none">&ldquo;</span>
                  <p className="relative z-10">&ldquo;{selectedDest.quote}&rdquo;</p>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <h3 className="text-xs uppercase tracking-widest text-neutral-500 font-mono">Observations</h3>
                  <p className="text-sm text-neutral-400 leading-relaxed font-sans">{selectedDest.description}</p>
                </div>

                {/* Lessons Learned */}
                <div className="space-y-3">
                  <h3 className="text-xs uppercase tracking-widest text-neutral-500 font-mono">Lessons from the Road</h3>
                  <ul className="space-y-2">
                    {selectedDest.lessonsLearned.map((lesson, idx) => (
                      <motion.li
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="text-xs text-neutral-300 flex items-start gap-2 bg-neutral-900/20 border border-neutral-800/40 p-2.5 rounded-md"
                      >
                        <span className="text-orange-500/80 mt-0.5 select-none">▪</span>
                        <span>{lesson}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}

            {activeTab === "culinary" && selectedDest && (
              <motion.div
                key="culinary"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-xs uppercase tracking-widest text-neutral-500 font-mono">Local Offerings in {selectedDest.name}</h2>
                  <span className="text-xs text-neutral-400 font-mono bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">{selectedDest.country}</span>
                </div>

                <div className="space-y-4">
                  {selectedDest.culinaryHighlights.map((highlight, idx) => (
                    <motion.div
                      key={highlight.dish}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="group border border-neutral-800/80 bg-neutral-900/30 hover:bg-neutral-900/60 p-4 rounded-lg transition-all hover:border-orange-500/30"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-sm font-semibold text-white group-hover:text-orange-500 transition-colors font-serif">
                          {highlight.dish}
                        </h3>
                        <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded ${
                          highlight.category === "street-food" 
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            : highlight.category === "fine-dining"
                            ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                            : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                        }`}>
                          {highlight.category.replace("-", " ")}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                        {highlight.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === "portfolio" && (
              <motion.div
                key="portfolio"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xs uppercase tracking-widest text-neutral-500 font-mono mb-2">The Builder&apos;s Logbook</h2>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Weaving engineering discipline with the storytelling spirit of Bourdain. Here is how my skills line up with your team&apos;s search.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Skill Card 1: Frontend */}
                  <div className="border border-neutral-800/80 bg-neutral-900/30 hover:bg-neutral-900/50 p-4 rounded-lg transition-all hover:border-orange-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-orange-500" />
                      <h3 className="text-sm font-semibold text-white font-serif">Frontend Artistry & Detail</h3>
                    </div>
                    <p className="text-xs text-neutral-400 leading-relaxed mb-3">
                      Expert in craft-first React, Next.js, Framer Motion, and Tailwind CSS. Obsessive about sub-pixel alignment, lighting, motion design, and layouts that command attention.
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="text-[10px] font-mono px-2 py-0.5 bg-neutral-800 text-neutral-300 rounded border border-neutral-700">Next.js 15</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 bg-neutral-800 text-neutral-300 rounded border border-neutral-700">React 19</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 bg-neutral-800 text-neutral-300 rounded border border-neutral-700">Three.js</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 bg-neutral-800 text-neutral-300 rounded border border-neutral-700">Framer Motion</span>
                    </div>
                  </div>

                  {/* Skill Card 2: Supabase / DB */}
                  <div className="border border-neutral-800/80 bg-neutral-900/30 hover:bg-neutral-900/50 p-4 rounded-lg transition-all hover:border-orange-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Database className="w-4 h-4 text-orange-500" />
                      <h3 className="text-sm font-semibold text-white font-serif">Database & Backend Plumbing</h3>
                    </div>
                    <p className="text-xs text-neutral-400 leading-relaxed mb-3">
                      Solid understanding of PostgreSQL, relational schema design, real-time sync, Row-Level Security (RLS) policies, and authentication flows via Supabase.
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="text-[10px] font-mono px-2 py-0.5 bg-neutral-800 text-neutral-300 rounded border border-neutral-700">Supabase</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 bg-neutral-800 text-neutral-300 rounded border border-neutral-700">PostgreSQL</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 bg-neutral-800 text-neutral-300 rounded border border-neutral-700">RLS Security</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 bg-neutral-800 text-neutral-300 rounded border border-neutral-700">REST APIs</span>
                    </div>
                  </div>

                  {/* Skill Card 3: AI Tooling */}
                  <div className="border border-neutral-800/80 bg-neutral-900/30 hover:bg-neutral-900/50 p-4 rounded-lg transition-all hover:border-orange-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Cpu className="w-4 h-4 text-orange-500" />
                      <h3 className="text-sm font-semibold text-white font-serif">AI-Assisted Velocity</h3>
                      <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded">Productive</span>
                    </div>
                    <p className="text-xs text-neutral-400 leading-relaxed mb-3">
                      Highly comfortable co-piloting with agentic tools (like Antigravity). Skilled at directing agent prompts, managing context sizes, and leveraging AI for rapid iteration while taking complete architectural ownership.
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="text-[10px] font-mono px-2 py-0.5 bg-neutral-800 text-neutral-300 rounded border border-neutral-700">Agentic Coding</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 bg-neutral-800 text-neutral-300 rounded border border-neutral-700">Context Engineering</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-neutral-800/60 pt-4 mt-2">
                  <h4 className="text-[11px] uppercase font-mono text-neutral-400 mb-2">Portfolio Overview & Mission</h4>
                  <div className="text-[11px] text-neutral-500 font-serif leading-relaxed italic">
                    &ldquo;Like culinary apprenticeships, software engineering is a craft. You learn the tools, study the masters, and then you take ownership to ship real, delicious products.&rdquo;
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar Footer Details */}
        <div className="p-4 border-t border-neutral-800/60 bg-neutral-950 font-mono text-[10px] text-neutral-500 flex justify-between items-center">
          <div className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${isSupabaseConfigured ? "bg-green-500 animate-pulse" : "bg-amber-500"}`}></span>
            <span>DB: {isSupabaseConfigured ? "SUPABASE LIVE" : "MOCK FALLBACK"}</span>
          </div>
          <span>Bourdain Travel Tool</span>
        </div>
      </aside>

      {/* Right Content Area: 3D Globe / Visual Showpiece */}
      <main className="flex-1 relative min-h-[400px] md:min-h-0 flex items-center justify-center bg-black">
        {globeComponent ? (
          globeComponent
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center relative animate-fadeIn">
            {/* Visual Guide/Map background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(38,38,38,0.25)_0%,transparent_70%)]" />
            <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

            <div className="relative space-y-4 max-w-sm z-10">
              <div className="w-20 h-20 mx-auto rounded-full border-2 border-dashed border-orange-500/30 flex items-center justify-center text-orange-500/60">
                <Globe className="w-8 h-8 animate-spin" style={{ animationDuration: "12s" }} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-neutral-300 font-serif">Globe Viewport Placeholder</h3>
                <p className="text-xs text-neutral-500 font-mono mt-1">
                  Connecting coordinates...
                </p>
                {selectedDest && (
                  <div className="mt-3 text-xs font-mono text-orange-500/70 border border-orange-500/20 bg-orange-500/5 px-2.5 py-1.5 rounded inline-block animate-pulse">
                    ACTIVE: {selectedDest.name} ({selectedDest.coordinates})
                  </div>
                )}
              </div>
              <p className="text-[11px] text-neutral-400 italic">
                Step 3 will mount the fully interactive 3D WebGL Globe here with coordinates mapping, arc paths, and navigation.
              </p>
            </div>

            {/* Float paths overlay mock design element */}
            {selectedDest && (
              <div className="absolute bottom-6 right-6 font-mono text-[10px] text-neutral-600 border border-neutral-900 p-3 rounded bg-neutral-950/40 text-left space-y-1">
                <div>// CAMERA PATH METRICS</div>
                <div>LATITUDE: {selectedDest.lat.toFixed(4)}</div>
                <div>LONGITUDE: {selectedDest.lng.toFixed(4)}</div>
                <div>ZOOM: 1.8x</div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
