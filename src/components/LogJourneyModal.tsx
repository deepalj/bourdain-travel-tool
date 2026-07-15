"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Plus, Trash2, Utensils, Award, BookOpen } from "lucide-react";
import { Destination, CulinaryHighlight } from "@/data/destinations";

interface LogJourneyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (dest: Destination) => void;
  clickedCoords: { lat: number; lng: number } | null;
  onClearClickedCoords: () => void;
}

export default function LogJourneyModal({
  isOpen,
  onClose,
  onSave,
  clickedCoords,
  onClearClickedCoords
}: LogJourneyModalProps) {
  // Main form fields
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [latStr, setLatStr] = useState("");
  const [lngStr, setLngStr] = useState("");
  const [quote, setQuote] = useState("");
  const [description, setDescription] = useState("");
  
  // Dynamic arrays
  const [culinaryList, setCulinaryList] = useState<CulinaryHighlight[]>([]);
  const [lessonsList, setLessonsList] = useState<string[]>([]);

  // Update Lat/Lng when user clicks the Globe
  if (clickedCoords) {
    setLatStr(clickedCoords.lat.toFixed(6));
    setLngStr(clickedCoords.lng.toFixed(6));
    // Clear in parent so user can manually edit if desired
    onClearClickedCoords();
  }

  // Handle adding dynamic culinary items
  const addCulinaryItem = () => {
    setCulinaryList([
      ...culinaryList,
      {
        dish: "",
        description: "",
        category: "street-food",
        heatLevel: 2,
        authenticity: 4
      }
    ]);
  };

  const removeCulinaryItem = (idx: number) => {
    setCulinaryList(culinaryList.filter((_, i) => i !== idx));
  };

  const updateCulinaryItem = (idx: number, field: keyof CulinaryHighlight, value: any) => {
    setCulinaryList(
      culinaryList.map((item, i) => (i === idx ? { ...item, [field]: value } : item))
    );
  };

  // Handle adding lessons
  const addLessonItem = () => {
    setLessonsList([...lessonsList, ""]);
  };

  const removeLessonItem = (idx: number) => {
    setLessonsList(lessonsList.filter((_, i) => i !== idx));
  };

  const updateLessonItem = (idx: number, value: string) => {
    setLessonsList(lessonsList.map((item, i) => (i === idx ? value : item)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!city || !country || !latStr || !lngStr || !quote || !description) {
      alert("Please fill in all mandatory fields (City, Country, Lat, Lng, Quote, Observations).");
      return;
    }

    const lat = parseFloat(latStr);
    const lng = parseFloat(lngStr);
    if (isNaN(lat) || isNaN(lng)) {
      alert("Latitude and Longitude must be valid numbers.");
      return;
    }

    // Prepare Destination payload
    const newDest: Destination = {
      id: `${country.toLowerCase().replace(/\s+/g, "-")}-${city.toLowerCase().replace(/\s+/g, "-")}`,
      name: city,
      country,
      lat,
      lng,
      coordinates: `${Math.abs(lat).toFixed(4)}° ${lat >= 0 ? "N" : "S"}, ${Math.abs(lng).toFixed(4)}° ${lng >= 0 ? "E" : "W"}`,
      quote,
      description,
      // Clean up empty highlights
      culinaryHighlights: culinaryList.filter(h => h.dish.trim() !== ""),
      // Clean up empty lessons
      lessonsLearned: lessonsList.filter(l => l.trim() !== ""),
      status: "visited"
    };

    onSave(newDest);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setCity("");
    setCountry("");
    setLatStr("");
    setLngStr("");
    setQuote("");
    setDescription("");
    setCulinaryList([]);
    setLessonsList([]);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 z-[100] cursor-pointer"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-neutral-950 border border-neutral-800 rounded-xl shadow-2xl z-[101] font-mono text-neutral-300 flex flex-col"
          >
            {/* Header */}
            <div className="p-5 border-b border-neutral-800/80 bg-neutral-900/40 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-orange-500 animate-pulse" />
                <h2 className="text-sm font-bold text-white tracking-wide">// LOG_NEW_DISPATCH</h2>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-md hover:bg-neutral-800 text-neutral-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6 flex-1 text-xs">
              {/* Globe Click Helper Banner */}
              <div className="border border-dashed border-orange-500/20 bg-orange-500/5 px-4 py-2.5 rounded-lg flex items-center gap-2 text-orange-500/80">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-ping" />
                <span>Tip: Click on the 3D Globe outside this form to automatically fill coordinates.</span>
              </div>

              {/* Core Location Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-neutral-500 uppercase block font-semibold">City Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hanoi"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-white focus:outline-none focus:border-orange-500/50"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-neutral-500 uppercase block font-semibold">Country *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vietnam"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-white focus:outline-none focus:border-orange-500/50"
                  />
                </div>
              </div>

              {/* Coordinates */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-neutral-500 uppercase block font-semibold">Latitude *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 21.0285"
                    value={latStr}
                    onChange={(e) => setLatStr(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-white focus:outline-none focus:border-orange-500/50"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-neutral-500 uppercase block font-semibold">Longitude *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 105.8542"
                    value={lngStr}
                    onChange={(e) => setLngStr(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-white focus:outline-none focus:border-orange-500/50"
                  />
                </div>
              </div>

              {/* Monologue Quote */}
              <div className="space-y-1.5">
                <label className="text-neutral-500 uppercase block font-semibold">Bourdain Quote *</label>
                <textarea
                  required
                  placeholder="Record a deep, poetic observation about the local culture..."
                  rows={2}
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-white focus:outline-none focus:border-orange-500/50 font-sans"
                />
              </div>

              {/* Observations */}
              <div className="space-y-1.5">
                <label className="text-neutral-500 uppercase block font-semibold">Observations & Thoughts *</label>
                <textarea
                  required
                  placeholder="What is the mood? What are the sights, the sounds?"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-white focus:outline-none focus:border-orange-500/50 font-sans"
                />
              </div>

              {/* Culinary Highlights Tab */}
              <div className="border-t border-neutral-900 pt-5 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-neutral-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Utensils className="w-4 h-4 text-orange-500/70" />
                    Culinary Highlights
                  </h3>
                  <button
                    type="button"
                    onClick={addCulinaryItem}
                    className="px-2.5 py-1.5 rounded bg-orange-500/10 border border-orange-500/20 hover:border-orange-500/50 text-orange-500 transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Food</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {culinaryList.map((item, idx) => (
                    <div key={idx} className="border border-neutral-900 bg-neutral-950 p-4 rounded-lg space-y-3 relative">
                      <button
                        type="button"
                        onClick={() => removeCulinaryItem(idx)}
                        className="absolute top-4 right-4 text-neutral-500 hover:text-red-500 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="grid grid-cols-2 gap-3 pr-8">
                        <div className="space-y-1">
                          <label className="text-neutral-500 block">Dish Name</label>
                          <input
                            type="text"
                            placeholder="e.g. Pho Bo"
                            value={item.dish}
                            onChange={(e) => updateCulinaryItem(idx, "dish", e.target.value)}
                            className="w-full bg-neutral-900 border border-neutral-800 rounded px-2.5 py-1.5 text-white focus:outline-none focus:border-orange-500/40"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-neutral-500 block">Category</label>
                          <select
                            value={item.category}
                            onChange={(e) => updateCulinaryItem(idx, "category", e.target.value)}
                            className="w-full bg-neutral-900 border border-neutral-800 rounded px-2.5 py-1.5 text-white focus:outline-none focus:border-orange-500/40"
                          >
                            <option value="street-food">🍢 Street Eats</option>
                            <option value="fine-dining">🍽️ Fine Dining</option>
                            <option value="local-specialty">☕ Local Specialty</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-neutral-500 block">Tasting Notes</label>
                        <textarea
                          placeholder="Describe the flavor, spices, texture..."
                          rows={2}
                          value={item.description}
                          onChange={(e) => updateCulinaryItem(idx, "description", e.target.value)}
                          className="w-full bg-neutral-900 border border-neutral-800 rounded px-2.5 py-1.5 text-white focus:outline-none focus:border-orange-500/40 font-sans"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-1">
                        {/* Heat Level Slider */}
                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-neutral-500">
                            <span>Spice/Heat Level</span>
                            <span className="text-orange-500 font-bold">🌶️ x {item.heatLevel}</span>
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

                        {/* Authenticity Slider */}
                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-neutral-500">
                            <span>Adventurousness</span>
                            <span className="text-orange-500 font-bold">🔥 x {item.authenticity}</span>
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
              </div>

              {/* Lessons Learned Tab */}
              <div className="border-t border-neutral-900 pt-5 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-neutral-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-orange-500/70" />
                    Lessons Learned
                  </h3>
                  <button
                    type="button"
                    onClick={addLessonItem}
                    className="px-2.5 py-1.5 rounded bg-orange-500/10 border border-orange-500/20 hover:border-orange-500/50 text-orange-500 transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Lesson</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {lessonsList.map((lesson, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <span className="text-neutral-500">▪</span>
                      <input
                        type="text"
                        placeholder="Write an insightful lesson learned from this location..."
                        value={lesson}
                        onChange={(e) => updateLessonItem(idx, e.target.value)}
                        className="flex-1 bg-neutral-900 border border-neutral-800 rounded px-2.5 py-1.5 text-white focus:outline-none focus:border-orange-500/40"
                      />
                      <button
                        type="button"
                        onClick={() => removeLessonItem(idx)}
                        className="p-2 text-neutral-500 hover:text-red-500 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="border-t border-neutral-900 pt-5 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900 rounded text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-600 border border-transparent hover:border-orange-400 text-black font-semibold rounded text-xs transition-all cursor-pointer"
                >
                  Save Dispatch
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
