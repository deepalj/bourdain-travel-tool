"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import { Award } from "lucide-react";

interface PassportStampsProps {
  destinationId: string;
  cityName: string;
  countryName: string;
}

// Visual configurations for different vintage passport stamps
const stampStyles: Record<string, {
  color: string;
  bgColor: string;
  borderColor: string;
  rotation: number;
  shape: "circle" | "octagon" | "rectangle" | "oval";
  date: string;
  subtitle: string;
}> = {
  "vietnam-hanoi": {
    color: "text-red-500/80",
    bgColor: "bg-red-500/5",
    borderColor: "border-red-500/40",
    rotation: -8,
    shape: "circle",
    date: "12 DEC 2002",
    subtitle: "HANOI • ENTRY"
  },
  "morocco-marrakech": {
    color: "text-amber-500/80",
    bgColor: "bg-amber-500/5",
    borderColor: "border-amber-500/40",
    rotation: 6,
    shape: "octagon",
    date: "25 OCT 2008",
    subtitle: "MARRAKECH • DOUANE"
  },
  "japan-tokyo": {
    color: "text-rose-400/80",
    bgColor: "bg-rose-500/5",
    borderColor: "border-rose-400/40",
    rotation: -4,
    shape: "oval",
    date: "04 APR 2011",
    subtitle: "TOKYO NARITA • ADMITTED"
  },
  "france-paris": {
    color: "text-blue-500/80",
    bgColor: "bg-blue-500/5",
    borderColor: "border-blue-500/40",
    rotation: 12,
    shape: "rectangle",
    date: "18 JUN 1999",
    subtitle: "PARIS CDG • FR"
  },
  "mexico-oaxaca": {
    color: "text-emerald-500/80",
    bgColor: "bg-emerald-500/5",
    borderColor: "border-emerald-500/40",
    rotation: -10,
    shape: "rectangle",
    date: "30 NOV 2015",
    subtitle: "OAXACA • INMIGRACIÓN"
  }
};

export default function PassportStamps({ destinationId, cityName, countryName }: PassportStampsProps) {
  const stamp = stampStyles[destinationId] || {
    color: "text-orange-500/80",
    bgColor: "bg-orange-500/5",
    borderColor: "border-orange-500/40",
    rotation: 5,
    shape: "circle",
    date: "VISITED",
    subtitle: "NOMAD RECORD"
  };

  // Framer Motion 3D Tilt Effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-50, 50], [15, -15]);
  const rotateY = useTransform(x, [-50, 50], [-15, 15]);

  function handleMouse(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = event.clientX - rect.left - width / 2;
    const mouseY = event.clientY - rect.top - height / 2;
    x.set(mouseX);
    y.set(mouseY);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <div className="space-y-3">
      <h3 className="text-xs uppercase tracking-widest text-neutral-500 font-mono">Passport Stamps</h3>
      <div 
        className="w-full flex items-center justify-center p-6 border border-neutral-800/40 rounded-xl bg-neutral-950/20 perspective-1000 cursor-help"
        onMouseMove={handleMouse}
        onMouseLeave={handleMouseLeave}
      >
        <motion.div
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          animate={{ rotate: stamp.rotation }}
          whileHover={{ scale: 1.05 }}
          className={`flex flex-col items-center justify-center p-6 border-2 border-dashed ${stamp.borderColor} ${stamp.bgColor} ${stamp.color} select-none transition-all duration-300 shadow-lg`}
          // Adapt border styles and shapes
          {...(stamp.shape === "circle" && { className: `rounded-full w-36 h-36 border-2 border-dashed ${stamp.borderColor} ${stamp.bgColor} ${stamp.color} select-none flex flex-col items-center justify-center text-center p-4` })}
          {...(stamp.shape === "oval" && { className: `rounded-[50%] w-40 h-28 border-2 border-dashed ${stamp.borderColor} ${stamp.bgColor} ${stamp.color} select-none flex flex-col items-center justify-center text-center p-4` })}
          {...(stamp.shape === "octagon" && { className: `clip-path-octagon border-2 border-double w-36 h-36 ${stamp.borderColor} ${stamp.bgColor} ${stamp.color} select-none flex flex-col items-center justify-center text-center p-4` })}
          {...(stamp.shape === "rectangle" && { className: `border-4 border-double w-44 h-26 ${stamp.borderColor} ${stamp.bgColor} ${stamp.color} select-none flex flex-col items-center justify-center text-center p-4` })}
        >
          <Award className="w-5 h-5 mb-1.5 opacity-80" />
          <span className="font-mono text-[9px] tracking-widest uppercase opacity-70">{stamp.subtitle}</span>
          <span className="font-serif font-black text-sm tracking-tight my-0.5">{cityName.toUpperCase()}</span>
          <span className="font-mono text-[10px] font-bold border-t border-b border-current py-0.5 px-2 my-1">
            {stamp.date}
          </span>
          <span className="font-mono text-[8px] uppercase opacity-75">{countryName}</span>
        </motion.div>
      </div>
    </div>
  );
}
