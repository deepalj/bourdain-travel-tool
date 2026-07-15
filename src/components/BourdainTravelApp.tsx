"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Compass, 
  MapPin, 
  Utensils, 
  BookOpen, 
  Cpu, 
  Loader2,
  Plus
} from "lucide-react";
import { Destination } from "@/data/destinations";
import { fetchDestinations, saveDestination } from "@/utils/dataService";
import { isSupabaseConfigured } from "@/utils/supabase";
import TravelGlobeWrapper from "@/components/TravelGlobeWrapper";
import RetroVoiceDispatch from "@/components/RetroVoiceDispatch";
import PassportStamps from "@/components/PassportStamps";
import EnvironmentHUD from "@/components/EnvironmentHUD";
import BuilderDrawer from "@/components/BuilderDrawer";
import LogJourneyModal from "@/components/LogJourneyModal";

export default function BourdainTravelApp() {
  const [destinationsList, setDestinationsList] = useState<Destination[]>([]);
  const [selectedDestId, setSelectedDestId] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"journal" | "culinary">("journal");
  const [isLoading, setIsLoading] = useState(true);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);

  // Form states for creating new journeys
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [clickedCoords, setClickedCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [tempPinCoords, setTempPinCoords] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    fetchDestinations().then(data => {
      setDestinationsList(data);
      if (data.length > 0) {
        setSelectedDestId(data[0].id);
      }
      setIsLoading(false);
    });
  }, []);

  const selectedDest = destinationsList.find(d => d.id === selectedDestId) || null;

  const handleDestinationSelect = (dest: Destination) => {
    setSelectedDestId(dest.id);
  };

  const handleGlobeClick = (coords: { lat: number; lng: number }) => {
    if (isLogModalOpen) {
      setClickedCoords(coords);
      setTempPinCoords(coords);
    }
  };

  const handleSaveJourney = async (newDest: Destination) => {
    const success = await saveDestination(newDest);
    if (success) {
      setDestinationsList(prev => [...prev, newDest]);
      setSelectedDestId(newDest.id);
      setTempPinCoords(null);
    } else {
      alert("Failed to save new travel dispatch to Supabase.");
    }
  };

  const handleCloseLogModal = () => {
    setIsLogModalOpen(false);
    setTempPinCoords(null);
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

      {/* Floating Builder Log Trigger Button */}
      <button
        onClick={() => setIsBuilderOpen(true)}
        className="absolute top-6 right-6 z-30 bg-neutral-950/85 hover:bg-neutral-900 border border-neutral-800 text-white rounded-full py-2.5 px-4 flex items-center gap-2 font-mono text-xs shadow-xl backdrop-blur-md transition-all hover:scale-105 active:scale-95 group hover:border-orange-500/50 cursor-pointer"
      >
        <Cpu className="w-4 h-4 text-orange-500 group-hover:animate-pulse" />
        <span>Builder Log</span>
      </button>

      {/* Left Sidebar: Journal / Stats */}
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

        {/* Dynamic Navigation Tabs (Field Notes & Tasting Log) */}
        <div className="grid grid-cols-2 border-b border-neutral-800/60 font-mono text-xs text-center bg-neutral-900/30">
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
                {/* Destination Selector Header */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h2 className="text-xs uppercase tracking-widest text-neutral-500 font-mono">Choose Destination</h2>
                    <button
                      onClick={() => setIsLogModalOpen(true)}
                      className="px-2.5 py-1 rounded bg-orange-500/10 border border-orange-500/20 hover:border-orange-500/50 text-orange-500 transition-all font-mono text-[9px] cursor-pointer flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Log Journey</span>
                    </button>
                  </div>
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

                {/* Step 4: The Voice Dispatch Tape Player */}
                <RetroVoiceDispatch quote={selectedDest.quote} />

                {/* Description */}
                <div className="space-y-2">
                  <h3 className="text-xs uppercase tracking-widest text-neutral-500 font-mono">Observations</h3>
                  <p className="text-sm text-neutral-400 leading-relaxed font-sans">{selectedDest.description}</p>
                </div>

                {/* Step 4: Environment HUD */}
                <EnvironmentHUD destinationId={selectedDest.id} />

                {/* Step 4: Passport Stamp (Tilt Interaction) */}
                <PassportStamps 
                  destinationId={selectedDest.id}
                  cityName={selectedDest.name}
                  countryName={selectedDest.country}
                />

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

                {/* Empty State */}
                {selectedDest.culinaryHighlights.length === 0 && (
                  <p className="text-xs text-neutral-500 italic text-center py-4 bg-neutral-900/20 border border-dashed border-neutral-850 rounded-lg">
                    No tasting dispatches logged for this destination.
                  </p>
                )}

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
                      
                      <p className="text-xs text-neutral-400 leading-relaxed font-sans mb-3">
                        {highlight.description}
                      </p>

                      {/* Step 5: Authenticity & Heat Meters */}
                      <div className="grid grid-cols-2 border-t border-neutral-900 pt-2.5 font-mono text-[9px] text-neutral-500">
                        <div className="flex items-center gap-1">
                          <span>HEAT:</span>
                          <span className="flex gap-0.5" title={`Spiciness: ${highlight.heatLevel}/5`}>
                            {Array.from({ length: 5 }).map((_, i) => (
                              <span 
                                key={i} 
                                className={`${i < highlight.heatLevel ? "text-red-500 text-glow-red opacity-100" : "text-neutral-800"}`}
                              >
                                🌶️
                              </span>
                            ))}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 justify-end">
                          <span>ADVENTURE:</span>
                          <span className="flex gap-0.5" title={`Adventurousness: ${highlight.authenticity}/5`}>
                            {Array.from({ length: 5 }).map((_, i) => (
                              <span 
                                key={i} 
                                className={`${i < highlight.authenticity ? "text-orange-500 text-glow-amber opacity-100" : "text-neutral-800"}`}
                              >
                                🔥
                              </span>
                            ))}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar Footer Details */}
        <div className="p-4 border-t border-neutral-800/60 bg-neutral-950 font-mono text-[10px] text-neutral-500 flex justify-between items-center mt-auto">
          <div className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${isSupabaseConfigured ? "bg-green-500 animate-pulse" : "bg-amber-500"}`}></span>
            <span>DB: {isSupabaseConfigured ? "SUPABASE LIVE" : "MOCK FALLBACK"}</span>
          </div>
          <span>Bourdain Travel Tool</span>
        </div>
      </aside>

      {/* Right Content Area: 3D Globe / Visual Showpiece */}
      <main className="flex-1 relative min-h-[400px] md:min-h-0 flex items-center justify-center bg-[#060607]">
        <TravelGlobeWrapper 
          destinations={destinationsList}
          selectedDestination={selectedDest}
          onSelectDestination={handleDestinationSelect}
          onGlobeClick={handleGlobeClick}
          tempFormCoords={tempPinCoords}
        />
      </main>

      {/* Slider Drawer for Developer Skills Portfolio */}
      <BuilderDrawer isOpen={isBuilderOpen} onClose={() => setIsBuilderOpen(false)} />

      {/* Log Journey Modal Overlay */}
      <LogJourneyModal
        isOpen={isLogModalOpen}
        onClose={handleCloseLogModal}
        onSave={handleSaveJourney}
        clickedCoords={clickedCoords}
        onClearClickedCoords={() => setClickedCoords(null)}
      />
    </div>
  );
}
