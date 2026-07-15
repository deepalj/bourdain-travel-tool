"use client";

import { useEffect, useRef } from "react";
import Globe from "react-globe.gl";
import { Destination } from "@/data/destinations";

interface TravelGlobeProps {
  destinations: Destination[];
  selectedDestination: Destination | null;
  onSelectDestination: (dest: Destination) => void;
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
  onSelectDestination 
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

      // Optionally restart slow autoRotate after a delay if user stops interacting
      const timeout = setTimeout(() => {
        // Only restart if the current selection is still this destination
        if (selectedDestination) {
          // Keep it paused while focused, but we could enable slow rotation if desired
        }
      }, 5000);

      return () => clearTimeout(timeout);
    } else if (globeRef.current && !selectedDestination) {
      // Resume auto-rotation if nothing is selected
      const controls = globeRef.current.controls();
      controls.autoRotate = true;
    }
  }, [selectedDestination]);

  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing flex items-center justify-center">
      <Globe
        ref={globeRef}
        backgroundColor="rgba(0, 0, 0, 0)" // Transparent to blend with app dark gradient
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        
        // Marker Points
        pointsData={destinations}
        pointLat="lat"
        pointLng="lng"
        pointColor={() => "#f97316"}
        pointAltitude={0.06}
        pointRadius={0.35}
        pointsMerge={false}
        pointLabel={(d: any) => `
          <div class="bg-neutral-950/90 border border-orange-500/30 text-white p-3 rounded-md shadow-xl backdrop-blur-sm max-w-xs font-mono">
            <h4 class="font-serif text-sm font-bold text-orange-500 mb-0.5">${d.name}</h4>
            <p class="text-[10px] text-neutral-400 mb-1">${d.country} • ${d.coordinates}</p>
            <p class="text-[9px] italic text-neutral-300 leading-normal border-t border-neutral-800/80 pt-1.5">
              "${d.quote.substring(0, 80)}..."
            </p>
          </div>
        `}
        onPointClick={(point: any) => {
          onSelectDestination(point as Destination);
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
      </div>
    </div>
  );
}
