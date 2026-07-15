import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import { Destination } from "@/data/destinations";

interface TravelGlobeWrapperProps {
  destinations: Destination[];
  selectedDestination: Destination | null;
  onSelectDestination: (dest: Destination) => void;
}

// Dynamically import the WebGL Globe component to disable server-side rendering (SSR)
// This prevents node-side reference errors to browser-only window/document APIs.
const TravelGlobe = dynamic(() => import("./TravelGlobe"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-neutral-950 font-mono text-neutral-400">
      <Loader2 className="w-8 h-8 text-orange-500 animate-spin mb-3" />
      <p className="text-xs uppercase tracking-widest text-glow-amber">Initializing WebGL Canvas</p>
      <p className="text-[10px] text-neutral-600 mt-1">Spinning up three.js environment...</p>
    </div>
  )
});

export default function TravelGlobeWrapper({ 
  destinations, 
  selectedDestination, 
  onSelectDestination 
}: TravelGlobeWrapperProps) {
  return (
    <div className="w-full h-full min-h-[400px] md:min-h-0 bg-neutral-950 relative">
      <TravelGlobe 
        destinations={destinations}
        selectedDestination={selectedDestination}
        onSelectDestination={onSelectDestination}
      />
    </div>
  );
}
