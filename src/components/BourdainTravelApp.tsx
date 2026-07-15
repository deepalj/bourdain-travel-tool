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
  Plus,
  Trash2,
  Sparkles,
  ArrowLeft,
  Edit3
} from "lucide-react";
import { Destination, CulinaryHighlight } from "@/data/destinations";
import { fetchDestinations, saveDestination } from "@/utils/dataService";
import { isSupabaseConfigured } from "@/utils/supabase";
import { generateBourdainQuote, generateBourdainDescription } from "@/utils/bourdainGenerator";
import TravelGlobeWrapper from "@/components/TravelGlobeWrapper";
import RetroVoiceDispatch from "@/components/RetroVoiceDispatch";
import PassportStamps from "@/components/PassportStamps";
import EnvironmentHUD from "@/components/EnvironmentHUD";
import BuilderDrawer from "@/components/BuilderDrawer";

export default function BourdainTravelApp() {
  const [destinationsList, setDestinationsList] = useState<Destination[]>([]);
  const [selectedDestId, setSelectedDestId] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"journal" | "culinary">("journal");
  const [isLoading, setIsLoading] = useState(true);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);

  // Embedded Sidebar Form States
  const [isLoggingNewPlace, setIsLoggingNewPlace] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formCity, setFormCity] = useState("");
  const [formCountry, setFormCountry] = useState("");
  const [formLat, setFormLat] = useState("");
  const [formLng, setFormLng] = useState("");
  const [formQuote, setFormQuote] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formCulinary, setFormCulinary] = useState<CulinaryHighlight[]>([]);
  const [formLessons, setFormLessons] = useState<string[]>([]);
  
  // Coordinates targeted via globe clicks
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

  // Capture globe clicks to auto-fill Latitude and Longitude
  const handleGlobeClick = (coords: { lat: number; lng: number }) => {
    if (isLoggingNewPlace) {
      setFormLat(coords.lat.toFixed(6));
      setFormLng(coords.lng.toFixed(6));
      setTempPinCoords(coords);
    }
  };

  // Populate form with current selected destination values to trigger Edit Mode
  const handleEditClick = () => {
    if (!selectedDest) return;
    setFormCity(selectedDest.name);
    setFormCountry(selectedDest.country);
    setFormLat(selectedDest.lat.toString());
    setFormLng(selectedDest.lng.toString());
    setFormQuote(selectedDest.quote);
    setFormDesc(selectedDest.description);
    setFormCulinary([...selectedDest.culinaryHighlights]);
    setFormLessons([...selectedDest.lessonsLearned]);
    setTempPinCoords({ lat: selectedDest.lat, lng: selectedDest.lng });
    setIsEditing(true);
    setIsLoggingNewPlace(true);
  };

  // Generate Bourdain-esque quotes and observations on the fly
  const handleGenerateAI = () => {
    if (!formCity || !formCountry) {
      alert("Please enter City and Country names first to synthesize dispatches.");
      return;
    }
    const firstDish = formCulinary[0]?.dish || "";
    setFormQuote(generateBourdainQuote(formCity, formCountry, firstDish));
    setFormDesc(generateBourdainDescription(formCity, formCountry, firstDish));
  };

  // Dynamic lists handlers inside form
  const addCulinaryItem = () => {
    setFormCulinary([
      ...formCulinary,
      { dish: "", description: "", category: "street-food", heatLevel: 2, authenticity: 4 }
    ]);
  };

  const removeCulinaryItem = (idx: number) => {
    setFormCulinary(formCulinary.filter((_, i) => i !== idx));
  };

  const updateCulinaryItem = (idx: number, field: keyof CulinaryHighlight, value: any) => {
    setFormCulinary(formCulinary.map((item, i) => i === idx ? { ...item, [field]: value } : item));
  };

  const addLessonItem = () => {
    setFormLessons([...formLessons, ""]);
  };

  const removeLessonItem = (idx: number) => {
    setFormLessons(formLessons.filter((_, i) => i !== idx));
  };

  const updateLessonItem = (idx: number, value: string) => {
    setFormLessons(formLessons.map((item, i) => i === idx ? value : item));
  };

  // Save or Update new place
  const handleSaveJourney = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCity || !formCountry || !formLat || !formLng || !formQuote || !formDesc) {
      alert("Please complete all required fields.");
      return;
    }

    const lat = parseFloat(formLat);
    const lng = parseFloat(formLng);
    if (isNaN(lat) || isNaN(lng)) {
      alert("Invalid coordinates.");
      return;
    }

    // Reuse selected ID if editing, otherwise generate a URL-friendly one
    const newId = isEditing && selectedDest 
      ? selectedDest.id 
      : `${formCountry.toLowerCase().replace(/\s+/g, "-")}-${formCity.toLowerCase().replace(/\s+/g, "-")}`;

    const newDest: Destination = {
      id: newId,
      name: formCity,
      country: formCountry,
      lat,
      lng,
      coordinates: `${Math.abs(lat).toFixed(4)}° ${lat >= 0 ? "N" : "S"}, ${Math.abs(lng).toFixed(4)}° ${lng >= 0 ? "E" : "W"}`,
      quote: formQuote,
      description: formDesc,
      culinaryHighlights: formCulinary.filter(c => c.dish.trim() !== ""),
      lessonsLearned: formLessons.filter(l => l.trim() !== ""),
      status: "visited"
    };

    const success = await saveDestination(newDest);
    if (success) {
      if (isEditing) {
        setDestinationsList(prev => prev.map(d => d.id === newId ? newDest : d));
      } else {
        setDestinationsList(prev => [...prev, newDest]);
      }
      setSelectedDestId(newDest.id);
      resetForm();
    } else {
      alert("Failed to save travel dispatch to Supabase.");
    }
  };

  const resetForm = () => {
    setIsLoggingNewPlace(false);
    setIsEditing(false);
    setFormCity("");
    setFormCountry("");
    setFormLat("");
    setFormLng("");
    setFormQuote("");
    setFormDesc("");
    setFormCulinary([]);
    setFormLessons([]);
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
        className="absolute top-6 right-6 z-35 bg-neutral-950/85 hover:bg-neutral-900 border border-neutral-800 text-white rounded-full py-2.5 px-4 flex items-center gap-2 font-mono text-xs shadow-xl backdrop-blur-md transition-all hover:scale-105 active:scale-95 group hover:border-orange-500/50 cursor-pointer"
      >
        <Cpu className="w-4 h-4 text-orange-500 group-hover:animate-pulse" />
        <span>Builder Log</span>
      </button>

      {/* Left Sidebar: Journal / Stats */}
      <aside className="w-full md:w-[420px] lg:w-[460px] flex-shrink-0 flex flex-col border-b md:border-b-0 md:border-r border-neutral-800/60 bg-neutral-950/85 backdrop-blur-md z-10 overflow-hidden">
        {/* Header Section */}
        <div className="p-6 border-b border-neutral-800/60 flex-shrink-0">
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
            &ldquo;If I&apos;m advocate for anything, it&apos;s to move. As far as you can, as much as you can.&rdquo;
          </p>
        </div>

        {/* Dynamic Navigation Tabs (Field Notes & Tasting Log) */}
        {!isLoggingNewPlace && (
          <div className="grid grid-cols-2 border-b border-neutral-800/60 font-mono text-xs text-center bg-neutral-900/30 flex-shrink-0">
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
        )}

        {/* Tab Content OR Log Form (Scrollable Area) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <AnimatePresence mode="wait">
            {isLoggingNewPlace ? (
              /* ==================== EMBEDDED JOURNAL LOG & EDIT FORM ==================== */
              <motion.div
                key="log-form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5 text-[11px] font-mono"
              >
                <div className="flex items-center gap-2 border-b border-neutral-900 pb-3">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="p-1.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white transition-all cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                  <div>
                    <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                      {isEditing ? "// EDIT_DISPATCH" : "// RECORD_JOURNEY"}
                    </h2>
                    <span className="text-[9px] text-neutral-500 uppercase">
                      {isEditing ? "Modify Log & Tasting Log" : "Interactive Field Form"}
                    </span>
                  </div>
                </div>

                {/* Globe Click Notification */}
                <div className="border border-dashed border-orange-500/20 bg-orange-500/5 px-3 py-2 rounded-lg text-orange-500/80 text-[10px] leading-normal animate-pulse">
                  * Click anywhere on the 3D globe to automatically capture Latitude and Longitude.
                </div>

                <form onSubmit={handleSaveJourney} className="space-y-4">
                  {/* City & Country */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-neutral-500 uppercase block text-[9px] font-semibold">City Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Hanoi"
                        value={formCity}
                        onChange={(e) => setFormCity(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded px-2.5 py-1.5 text-white focus:outline-none focus:border-orange-500/40"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-neutral-500 uppercase block text-[9px] font-semibold">Country *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Vietnam"
                        value={formCountry}
                        onChange={(e) => setFormCountry(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded px-2.5 py-1.5 text-white focus:outline-none focus:border-orange-500/40"
                      />
                    </div>
                  </div>

                  {/* Coordinates */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-neutral-500 uppercase block text-[9px] font-semibold">Latitude *</label>
                      <input
                        type="text"
                        required
                        placeholder="Globe click fills..."
                        value={formLat}
                        onChange={(e) => setFormLat(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded px-2.5 py-1.5 text-white focus:outline-none focus:border-orange-500/40"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-neutral-500 uppercase block text-[9px] font-semibold">Longitude *</label>
                      <input
                        type="text"
                        required
                        placeholder="Globe click fills..."
                        value={formLng}
                        onChange={(e) => setFormLng(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded px-2.5 py-1.5 text-white focus:outline-none focus:border-orange-500/40"
                      />
                    </div>
                  </div>

                  {/* Dynamic Synthesizer Trigger */}
                  <button
                    type="button"
                    onClick={handleGenerateAI}
                    className="w-full bg-orange-500/10 border border-orange-500/30 hover:border-orange-500/50 text-orange-500 hover:text-white py-2 px-3 rounded flex items-center justify-center gap-1.5 transition-all text-[10px] font-semibold cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                    <span>Auto-Generate Bourdain Dispatch</span>
                  </button>

                  {/* Quote */}
                  <div className="space-y-1">
                    <label className="text-neutral-500 uppercase block text-[9px] font-semibold">Bourdain Quote *</label>
                    <textarea
                      required
                      placeholder="Poetic travel quote or auto-generate above..."
                      rows={2}
                      value={formQuote}
                      onChange={(e) => setFormQuote(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded px-2.5 py-1.5 text-white focus:outline-none focus:border-orange-500/40 font-sans"
                    />
                  </div>

                  {/* Observations */}
                  <div className="space-y-1">
                    <label className="text-neutral-500 uppercase block text-[9px] font-semibold">Observations *</label>
                    <textarea
                      required
                      placeholder="General description, mood, sensory details..."
                      rows={3}
                      value={formDesc}
                      onChange={(e) => setFormDesc(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded px-2.5 py-1.5 text-white focus:outline-none focus:border-orange-500/40 font-sans"
                    />
                  </div>

                  {/* Culinary list */}
                  <div className="border-t border-neutral-900 pt-3.5 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] uppercase font-bold text-neutral-400">Foods & Tasting Log</span>
                      <button
                        type="button"
                        onClick={addCulinaryItem}
                        className="px-2 py-1 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-300 rounded flex items-center gap-1 cursor-pointer text-[9px]"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Dish</span>
                      </button>
                    </div>

                    {formCulinary.map((item, idx) => (
                      <div key={idx} className="border border-neutral-900 bg-neutral-950 p-3 rounded-lg space-y-2.5 relative">
                        <button
                          type="button"
                          onClick={() => removeCulinaryItem(idx)}
                          className="absolute top-2 right-2 text-neutral-500 hover:text-red-500 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        <div className="grid grid-cols-2 gap-2 pr-6">
                          <input
                            type="text"
                            required
                            placeholder="Dish name"
                            value={item.dish}
                            onChange={(e) => updateCulinaryItem(idx, "dish", e.target.value)}
                            className="w-full bg-neutral-900 border border-neutral-800 rounded px-2 py-1 text-white"
                          />
                          <select
                            value={item.category}
                            onChange={(e) => updateCulinaryItem(idx, "category", e.target.value)}
                            className="w-full bg-neutral-900 border border-neutral-800 rounded px-2 py-1 text-white"
                          >
                            <option value="street-food">🍢 Street Eats</option>
                            <option value="fine-dining">🍽️ Fine Dining</option>
                            <option value="local-specialty">☕ Specialty</option>
                          </select>
                        </div>

                        <textarea
                          placeholder="Short tasting description..."
                          rows={1}
                          value={item.description}
                          onChange={(e) => updateCulinaryItem(idx, "description", e.target.value)}
                          className="w-full bg-neutral-900 border border-neutral-800 rounded px-2 py-1 text-white font-sans"
                        />

                        <div className="grid grid-cols-2 gap-3 text-[9px] text-neutral-500 pt-0.5">
                          <div className="space-y-0.5">
                            <div className="flex justify-between">
                              <span>Spice Level</span>
                              <span className="text-orange-500">🌶️x{item.heatLevel}</span>
                            </div>
                            <input
                              type="range"
                              min="1"
                              max="5"
                              value={item.heatLevel}
                              onChange={(e) => updateCulinaryItem(idx, "heatLevel", parseInt(e.target.value))}
                              className="w-full accent-orange-500 cursor-pointer bg-neutral-900"
                            />
                          </div>
                          <div className="space-y-0.5">
                            <div className="flex justify-between">
                              <span>Adventure</span>
                              <span className="text-orange-500">🔥x{item.authenticity}</span>
                            </div>
                            <input
                              type="range"
                              min="1"
                              max="5"
                              value={item.authenticity}
                              onChange={(e) => updateCulinaryItem(idx, "authenticity", parseInt(e.target.value))}
                              className="w-full accent-orange-500 cursor-pointer bg-neutral-900"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Lessons list */}
                  <div className="border-t border-neutral-900 pt-3.5 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] uppercase font-bold text-neutral-400">Lessons Learned</span>
                      <button
                        type="button"
                        onClick={addLessonItem}
                        className="px-2 py-1 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-300 rounded flex items-center gap-1 cursor-pointer text-[9px]"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add lesson</span>
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      {formLessons.map((lesson, idx) => (
                        <div key={idx} className="flex gap-1.5 items-center">
                          <input
                            type="text"
                            placeholder="Lessons details..."
                            value={lesson}
                            onChange={(e) => updateLessonItem(idx, e.target.value)}
                            className="flex-1 bg-neutral-900 border border-neutral-800 rounded px-2 py-1 text-white"
                          />
                          <button
                            type="button"
                            onClick={() => removeLessonItem(idx)}
                            className="p-1.5 text-neutral-500 hover:text-red-500 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="border-t border-neutral-900 pt-4 flex justify-end gap-2.5 font-mono">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-3 py-1.5 border border-neutral-850 hover:bg-neutral-900 rounded cursor-pointer font-semibold text-[10px]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-orange-500 hover:bg-orange-600 text-black rounded cursor-pointer font-semibold text-[10px]"
                    >
                      {isEditing ? "Save Changes" : "Save Dispatch"}
                    </button>
                  </div>
                </form>
              </motion.div>
            ) : (
              /* ==================== NORMAL FIELD NOTES / TASTING LOG TABS ==================== */
              <>
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
                        <div className="flex gap-2">
                          <button
                            onClick={handleEditClick}
                            className="px-2.5 py-1 rounded bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-300 transition-all font-mono text-[9px] cursor-pointer flex items-center gap-1"
                            title="Edit this log entry"
                          >
                            <Edit3 className="w-3 h-3 text-orange-500/70" />
                            <span>Edit Log</span>
                          </button>
                          <button
                            onClick={() => setIsLoggingNewPlace(true)}
                            className="px-2.5 py-1 rounded bg-orange-500/10 border border-orange-500/20 hover:border-orange-500/50 text-orange-500 transition-all font-mono text-[9px] cursor-pointer flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Log Journey</span>
                          </button>
                        </div>
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

                    {/* Step 4/5: Dynamic Environment HUD (Timezone clocks calculated dynamically) */}
                    <EnvironmentHUD destination={selectedDest} />

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
                      <h2 className="text-xs uppercase tracking-widest text-neutral-500 font-mono font-bold">Local Offerings in {selectedDest.name}</h2>
                      <div className="flex gap-2 items-center">
                        <button
                          onClick={handleEditClick}
                          className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-300 font-mono text-[9px] cursor-pointer flex items-center gap-1"
                          title="Edit tasting dispatches"
                        >
                          <Edit3 className="w-2.5 h-2.5 text-orange-500/70" />
                          <span>Edit Log</span>
                        </button>
                        <span className="text-[10px] text-neutral-400 font-mono bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">{selectedDest.country}</span>
                      </div>
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
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar Footer Details */}
        <div className="p-4 border-t border-neutral-800/60 bg-neutral-950 font-mono text-[10px] text-neutral-500 flex justify-between items-center mt-auto flex-shrink-0">
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
          selectedDestination={isLoggingNewPlace ? null : selectedDest}
          onSelectDestination={handleDestinationSelect}
          onGlobeClick={handleGlobeClick}
          tempFormCoords={tempPinCoords}
        />
      </main>

      {/* Slider Drawer for Developer Skills Portfolio */}
      <BuilderDrawer isOpen={isBuilderOpen} onClose={() => setIsBuilderOpen(false)} />
    </div>
  );
}
