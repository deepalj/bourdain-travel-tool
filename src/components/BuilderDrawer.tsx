"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Terminal, Cpu, Database, Award, Sparkles, ArrowUpRight } from "lucide-react";

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);
import { useState } from "react";

interface BuilderDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BuilderDrawer({ isOpen, onClose }: BuilderDrawerProps) {
  const [activeSubTab, setActiveSubTab] = useState<"skills" | "blueprint">("skills");

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-40 cursor-pointer"
          />

          {/* Drawer Slide Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[460px] md:w-[500px] bg-neutral-950/95 border-l border-neutral-800/80 shadow-2xl z-50 flex flex-col font-mono text-neutral-300 backdrop-blur-md"
          >
            {/* Grain Overlay inside Drawer */}
            <div className="pointer-events-none absolute inset-0 grain-overlay z-50 opacity-[0.02]" />

            {/* Header */}
            <div className="p-6 border-b border-neutral-800/60 bg-neutral-950 flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <Terminal className="w-5 h-5 text-orange-500 animate-pulse" />
                <div>
                  <h2 className="text-sm font-bold text-white tracking-wide">SYSTEM: BUILDER_LOG</h2>
                  <span className="text-[10px] text-neutral-500">ENGINEERING STUDENT DOS-V1.0</span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-md hover:bg-neutral-900 border border-transparent hover:border-neutral-800 text-neutral-400 hover:text-white transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Sub-tabs */}
            <div className="grid grid-cols-2 border-b border-neutral-800/60 text-xs text-center bg-neutral-900/30">
              <button
                onClick={() => setActiveSubTab("skills")}
                className={`py-3.5 border-b-2 transition-all ${
                  activeSubTab === "skills" 
                    ? "border-orange-500 text-orange-500 bg-orange-500/5 font-semibold" 
                    : "border-transparent text-neutral-400 hover:text-neutral-200"
                }`}
              >
                // SPECIALTIES
              </button>
              <button
                onClick={() => setActiveSubTab("blueprint")}
                className={`py-3.5 border-b-2 transition-all ${
                  activeSubTab === "blueprint" 
                    ? "border-orange-500 text-orange-500 bg-orange-500/5 font-semibold" 
                    : "border-transparent text-neutral-400 hover:text-neutral-200"
                }`}
              >
                // SYSTEM_METRICS
              </button>
            </div>

            {/* Content Drawer (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {activeSubTab === "skills" ? (
                <div className="space-y-6">
                  {/* Job Description Fit Intro */}
                  <div className="border border-orange-500/20 bg-orange-500/5 p-4 rounded-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full blur-xl pointer-events-none" />
                    <h3 className="text-xs font-bold text-orange-500 flex items-center gap-1.5 mb-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      TARGET PROFILE MATCH
                    </h3>
                    <p className="text-[11px] leading-relaxed text-neutral-300 font-sans">
                      &ldquo;Looking for an engineering student with strong frontend skills in React/Next.js, basic backend/database knowledge, comfort using AI coding tools... creative, detail-oriented, willing to take ownership.&rdquo;
                    </p>
                  </div>

                  {/* Skills Grid */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] text-neutral-500 uppercase tracking-wider">// TECHNICAL_INVENTORY</h4>
                    
                    {/* Front-End Detail */}
                    <div className="border border-neutral-800 bg-neutral-900/20 p-4 rounded-lg space-y-2">
                      <div className="flex items-center gap-2 text-white">
                        <Cpu className="w-4 h-4 text-orange-500" />
                        <span className="text-xs font-bold font-serif">Frontend Artistry</span>
                      </div>
                      <p className="text-[11px] text-neutral-400 font-sans leading-relaxed">
                        Strong capability in building gorgeous, reactive, dynamic web layouts. Comfortable styling with Tailwind and Vanilla CSS. Skilled at micro-animations (Framer Motion) and 3D rendering (WebGL/Three.js).
                      </p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        <span className="text-[9px] px-1.5 py-0.5 bg-neutral-900 border border-neutral-800 rounded">Next.js 15+</span>
                        <span className="text-[9px] px-1.5 py-0.5 bg-neutral-900 border border-neutral-800 rounded">React 19</span>
                        <span className="text-[9px] px-1.5 py-0.5 bg-neutral-900 border border-neutral-800 rounded">Framer Motion</span>
                        <span className="text-[9px] px-1.5 py-0.5 bg-neutral-900 border border-neutral-800 rounded">Three.js</span>
                      </div>
                    </div>

                    {/* Backend Detail */}
                    <div className="border border-neutral-800 bg-neutral-900/20 p-4 rounded-lg space-y-2">
                      <div className="flex items-center gap-2 text-white">
                        <Database className="w-4 h-4 text-orange-500" />
                        <span className="text-xs font-bold font-serif">Backend & Relational DBs</span>
                      </div>
                      <p className="text-[11px] text-neutral-400 font-sans leading-relaxed">
                        Strong database fundamentals. Familiar with SQL, schema designs (foreign keys, join queries), security practices (Row-Level Security / RLS policies), and full-stack integrations using Supabase client wrappers.
                      </p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        <span className="text-[9px] px-1.5 py-0.5 bg-neutral-900 border border-neutral-800 rounded">Supabase</span>
                        <span className="text-[9px] px-1.5 py-0.5 bg-neutral-900 border border-neutral-800 rounded">PostgreSQL</span>
                        <span className="text-[9px] px-1.5 py-0.5 bg-neutral-900 border border-neutral-800 rounded">Schema Design</span>
                        <span className="text-[9px] px-1.5 py-0.5 bg-neutral-900 border border-neutral-800 rounded">RLS policies</span>
                      </div>
                    </div>

                    {/* AI Tooling Comfort */}
                    <div className="border border-neutral-800 bg-neutral-900/20 p-4 rounded-lg space-y-2">
                      <div className="flex items-center gap-2 text-white">
                        <Terminal className="w-4 h-4 text-orange-500" />
                        <span className="text-xs font-bold font-serif">AI Assisted Development</span>
                      </div>
                      <p className="text-[11px] text-neutral-400 font-sans leading-relaxed">
                        Extremely comfortable working alongside advanced AI coding systems (Antigravity). Able to delegate tasks, review generated files, maintain architectural ownership, and iterate at 5x velocity.
                      </p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        <span className="text-[9px] px-1.5 py-0.5 bg-neutral-900 border border-neutral-800 rounded">Prompt Engineering</span>
                        <span className="text-[9px] px-1.5 py-0.5 bg-neutral-900 border border-neutral-800 rounded">AI Co-piloting</span>
                        <span className="text-[9px] px-1.5 py-0.5 bg-neutral-900 border border-neutral-800 rounded">Speed & Iteration</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* System Architecture Details */}
                  <div>
                    <h4 className="text-[10px] text-neutral-500 uppercase tracking-wider mb-3">// PORTFOLIO_BUILD_INFO</h4>
                    <div className="border border-neutral-800 rounded-lg overflow-hidden text-xs">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-neutral-800 bg-neutral-900/40 text-[10px] text-neutral-500 font-mono">
                            <th className="p-3">METRIC</th>
                            <th className="p-3 text-right">VALUE</th>
                          </tr>
                        </thead>
                        <tbody className="font-mono text-[11px]">
                          <tr className="border-b border-neutral-900">
                            <td className="p-3 text-neutral-400">Application Framework</td>
                            <td className="p-3 text-right text-white">Next.js 15+ (App Router)</td>
                          </tr>
                          <tr className="border-b border-neutral-900">
                            <td className="p-3 text-neutral-400">Rendering Mode</td>
                            <td className="p-3 text-right text-white">Dynamic SSR & Client WebGL</td>
                          </tr>
                          <tr className="border-b border-neutral-900">
                            <td className="p-3 text-neutral-400">3D Globe Implementation</td>
                            <td className="p-3 text-right text-white">Three.js / react-globe.gl</td>
                          </tr>
                          <tr className="border-b border-neutral-900">
                            <td className="p-3 text-neutral-400">Database Layer</td>
                            <td className="p-3 text-right text-white">Supabase (PostgreSQL)</td>
                          </tr>
                          <tr className="border-b border-neutral-900">
                            <td className="p-3 text-neutral-400">Animations Library</td>
                            <td className="p-3 text-right text-white">Framer Motion</td>
                          </tr>
                          <tr>
                            <td className="p-3 text-neutral-400">Styling System</td>
                            <td className="p-3 text-right text-white">Tailwind CSS v4</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Dev Stats */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="border border-neutral-800 bg-neutral-900/10 p-3 rounded-lg text-center">
                      <div className="text-[20px] font-bold text-white">100%</div>
                      <div className="text-[9px] text-neutral-500 mt-0.5">OWNERSHIP OF CODE</div>
                    </div>
                    <div className="border border-neutral-800 bg-neutral-900/10 p-3 rounded-lg text-center">
                      <div className="text-[20px] font-bold text-orange-500">100%</div>
                      <div className="text-[9px] text-neutral-500 mt-0.5">DETAIL ACCENTUATION</div>
                    </div>
                  </div>

                  {/* Call to Action */}
                  <div className="border border-neutral-800/80 bg-neutral-900/20 p-4 rounded-lg flex flex-col gap-3">
                    <div className="flex gap-2 items-center text-white">
                      <Award className="w-4 h-4 text-orange-500" />
                      <span className="text-xs font-bold font-serif">Contact Builder</span>
                    </div>
                    <p className="text-[11px] text-neutral-400 font-sans leading-relaxed">
                      This traveler&apos;s logbook showcases only a snapshot of my building capabilities. I&apos;m ready to step in and immediately improve real product features for your team.
                    </p>
                    <a
                      href="https://github.com/deepalj/bourdain-travel-tool"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 w-full bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-800 hover:border-neutral-700 py-2.5 px-3 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition-all text-center"
                    >
                      <GithubIcon className="w-3.5 h-3.5" />
                      <span>Review Code Repository</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-neutral-500" />
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-neutral-800/60 bg-neutral-950 text-[10px] text-neutral-500 flex justify-between items-center">
              <span>STATUS: NOMAD_ONLINE</span>
              <span>AUTHENTICATED</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
