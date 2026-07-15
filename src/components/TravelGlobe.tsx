"use client";

import { useEffect, useRef } from "react";
import Globe from "react-globe.gl";
import { Destination } from "@/data/destinations";

interface TravelGlobeProps {
  destinations: Destination[];
  selectedDestination: Destination | null;
  onSelectDestination: (dest: Destination) => void;
  onGlobeClick?: (coords: { lat: number; lng: number }) => void;
  tempFormCoords?: { lat: number; lng: number } | null;
}

// Chronological flight paths connecting Bourdain's destinations
const arcsData = [
  { startLat: 48.8566, startLng: 2.3522, endLat: 31.6295, endLng: -7.9811, color: '#f97316' }, // Paris to Marrakech
  { startLat: 31.6295, startLng: -7.9811, endLat: 21.0285, endLng: 105.8542, color: '#ef4444' }, // Marrakech to Hanoi
  { startLat: 21.0285, startLng: 105.8542, endLat: 35.6762, endLng: 139.6503, color: '#f97316' }, // Hanoi to Tokyo
  { startLat: 35.6762, startLng: 139.6503, endLat: 17.0732, endLng: -96.7266, color: '#ef4444' }, // Tokyo to Oaxaca
  { startLat: 17.0732, startLng: -96.7266, endLat: 48.8566, endLng: 2.3522, color: '#f97316' }, // Oaxaca to Paris
];

export default function TravelGlobe({ 
  destinations, 
  selectedDestination, 
  onSelectDestination,
  onGlobeClick,
  tempFormCoords
}: TravelGlobeProps) {
  const globeRef = useRef<any>(null);

  // Configure Globe controls and initial stance on mount
  useEffect(() => {
    if (globeRef.current) {
      const controls = globeRef.current.controls();
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.4;
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.minDistance = 200;
      controls.maxDistance = 500;
    }
  }, []);

  // Animate globe camera to fly to the coordinates of the selected destination
  useEffect(() => {
    if (globeRef.current && selectedDestination) {
      const controls = globeRef.current.controls();
      
      // Stop auto-rotation when focusing on a specific city
      controls.autoRotate = false;
      
      globeRef.current.pointOfView(
        {
          lat: selectedDestination.lat,
          lng: selectedDestination.lng,
          altitude: 1.8,
        },
        2200 // animation duration in ms
      );
    } else if (globeRef.current && !selectedDestination) {
      // Resume auto-rotation if nothing is selected
      const controls = globeRef.current.controls();
      controls.autoRotate = true;
    }
  }, [selectedDestination]);

  // Combine saved destinations with any unsaved coordinates clicked in the Log form
  const combinedPoints = [...destinations];
  if (tempFormCoords) {
    combinedPoints.push({
      id: "temp-form-marker",
      name: "Target Location",
      country: "Selected on Globe",
      lat: tempFormCoords.lat,
      lng: tempFormCoords.lng,
      coordinates: `${tempFormCoords.lat.toFixed(4)}° N, ${tempFormCoords.lng.toFixed(4)}° E`,
      quote: "Configure this location details inside the Log Journey form.",
      description: "Save this location in the form.",
      culinaryHighlights: [],
      lessonsLearned: [],
      status: "planned"
    });
  }

  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing flex items-center justify-center">
      <Globe
        ref={globeRef}
        backgroundColor="rgba(0, 0, 0, 0)" // Transparent to blend with app dark gradient
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        
        // Marker Points
        pointsData={combinedPoints}
        pointLat="lat"
        pointLng="lng"
        pointColor={(d: any) => d.id === "temp-form-marker" ? "#ef4444" : "#f97316"}
        pointAltitude={0.06}
        pointRadius={(d: any) => d.id === "temp-form-marker" ? 0.6 : 0.35}
        pointsMerge={false}
        pointLabel={(d: any) => `
          <div class="bg-neutral-950/90 border border-orange-500/30 text-white p-3 rounded-md shadow-xl backdrop-blur-sm max-w-xs font-mono">
            <h4 class="font-serif text-sm font-bold ${d.id === "temp-form-marker" ? "text-red-500" : "text-orange-500"} mb-0.5">${d.name}</h4>
            <p class="text-[10px] text-neutral-400 mb-1">${d.country} • ${d.coordinates}</p>
            <p class="text-[9px] italic text-neutral-300 leading-normal border-t border-neutral-800/80 pt-1.5">
              "${d.quote.substring(0, 80)}..."
            </p>
          </div>
        `}
        onPointClick={(point: any) => {
          if (point.id !== "temp-form-marker") {
            onSelectDestination(point as Destination);
          }
        }}
        onGlobeClick={(coords) => {
          if (onGlobeClick) {
            onGlobeClick({ lat: coords.lat, lng: coords.lng });
          }
        }}

        // Arcs (Flight paths)
        arcsData={arcsData}
        arcStartLat="startLat"
        arcStartLng="startLng"
        arcEndLat="endLat"
        arcEndLng="endLng"
        arcColor="color"
        arcDashLength={0.4}
        arcDashGap={4}
        arcDashAnimateTime={2500}
        arcStroke={0.5}
        arcAltitude={0.25}
      />

      {/* Floating Control HUD */}
      <div className="absolute bottom-6 left-6 font-mono text-[9px] text-neutral-500 border border-neutral-900/60 p-3 rounded bg-neutral-950/60 backdrop-blur-sm space-y-1 pointer-events-none select-none">
        <div className="text-orange-500/70 font-semibold">// ORBITAL METRICS</div>
        <div>RENDERER: WEBGL-THREEJS</div>
        <div>AUTO_ROTATE: {selectedDestination ? "PAUSED" : "ACTIVE"}</div>
        <div>DAMPING: ENABLED</div>
        {tempFormCoords && (
          <div className="text-red-400 font-bold border-t border-neutral-900 pt-1 mt-1 animate-pulse">
            * PLACING PIN: {tempFormCoords.lat.toFixed(2)} / {tempFormCoords.lng.toFixed(2)}
          </div>
        )}
      </div>
    </div>
  );
}
