"use client";

import { useState, useEffect } from "react";
import { Clock, Thermometer, Cloud, Wind } from "lucide-react";

interface EnvironmentHUDProps {
  destinationId: string;
}

interface EnvData {
  timezoneOffset: number;
  temperature: string;
  condition: string;
  notes: string;
}

const locationEnvData: Record<string, EnvData> = {
  "vietnam-hanoi": {
    timezoneOffset: 7,
    temperature: "32°C",
    condition: "Hazy & Humid",
    notes: "Smells of roasting coffee, diesel, and frying shallots."
  },
  "morocco-marrakech": {
    timezoneOffset: 1,
    temperature: "28°C",
    condition: "Dry & Dusty",
    notes: "Scent of mint tea, saffron, lamb, and burning cedarwood."
  },
  "japan-tokyo": {
    timezoneOffset: 9,
    temperature: "22°C",
    condition: "Overcast & Clean",
    notes: "Sounds of railway chimes, neon hum, and boiling dashi."
  },
  "france-paris": {
    timezoneOffset: 2,
    temperature: "19°C",
    condition: "Drizzly Rain",
    notes: "Aromas of fresh yeast, red wine, and damp stone pavements."
  },
  "mexico-oaxaca": {
    timezoneOffset: -6,
    temperature: "25°C",
    condition: "Sunlight & Clear",
    notes: "Tastes of toasted corn, chilies, chocolate, and oak smoke."
  }
};

export default function EnvironmentHUD({ destinationId }: EnvironmentHUDProps) {
  const env = locationEnvData[destinationId] || {
    timezoneOffset: 0,
    temperature: "20°C",
    condition: "Normal",
    notes: "Field notes recording..."
  };

  const [localTime, setLocalTime] = useState("");

  useEffect(() => {
    function calculateTime() {
      // Get UTC time
      const d = new Date();
      const utc = d.getTime() + d.getTimezoneOffset() * 60000;
      // Apply offset (in milliseconds)
      const localDate = new Date(utc + 3600000 * env.timezoneOffset);
      
      setLocalTime(localDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
      }));
    }

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [env.timezoneOffset]);

  return (
    <div className="space-y-3">
      <h3 className="text-xs uppercase tracking-widest text-neutral-500 font-mono">Local Environment</h3>
      
      <div className="grid grid-cols-2 gap-2 font-mono text-[10px]">
        {/* Local Clock */}
        <div className="border border-neutral-800/60 bg-neutral-950/40 p-3 rounded-lg flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-orange-500/70 flex-shrink-0" />
          <div className="overflow-hidden">
            <div className="text-neutral-500 text-[8px] uppercase">Local Time</div>
            <div className="text-neutral-200 font-semibold">{localTime || "00:00:00"}</div>
          </div>
        </div>

        {/* Local Temp / Climate */}
        <div className="border border-neutral-800/60 bg-neutral-950/40 p-3 rounded-lg flex items-center gap-2">
          <Thermometer className="w-3.5 h-3.5 text-orange-500/70 flex-shrink-0" />
          <div className="overflow-hidden">
            <div className="text-neutral-500 text-[8px] uppercase">Climate</div>
            <div className="text-neutral-200 font-semibold">{env.temperature} / {env.condition}</div>
          </div>
        </div>
      </div>

      {/* Atmospheric Notes (The Bourdain-esque touch) */}
      <div className="border border-neutral-800/60 bg-neutral-950/40 p-3 rounded-lg flex items-start gap-2 text-[10px] font-sans">
        <Wind className="w-3.5 h-3.5 text-orange-500/50 mt-0.5 flex-shrink-0" />
        <div>
          <span className="font-mono text-[8px] text-neutral-500 uppercase block mb-0.5">Atmospheric Notes</span>
          <p className="text-neutral-300 italic font-serif leading-relaxed">&ldquo;{env.notes}&rdquo;</p>
        </div>
      </div>
    </div>
  );
}
