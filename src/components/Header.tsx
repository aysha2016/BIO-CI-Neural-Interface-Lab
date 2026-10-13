import React from 'react';
import { BookOpen, Download, Settings, Sparkles } from 'lucide-react';

interface HeaderProps {
  researchMode: boolean;
  setResearchMode: (val: boolean) => void;
  onOpenStatus: () => void;
  onOpenDocs: () => void;
  onOpenExport: () => void;
  onOpenSettings: () => void;
  onOpenAI: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  researchMode,
  setResearchMode,
  onOpenStatus,
  onOpenDocs,
  onOpenExport,
  onOpenSettings,
  onOpenAI,
}) => {
  return (
    <header className="h-16 px-6 border-b border-[#18233c] bg-[#090e1b]/95 backdrop-blur-md flex items-center justify-between sticky top-0 z-20">
      {/* Title & Tagline */}
      <div className="flex items-center gap-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <span className="text-cyan-400 font-extrabold tracking-wider">BIO-CI</span>
              <span className="text-slate-100 font-bold">Neural Interface Lab</span>
            </h1>
          </div>
          <p className="text-xs text-slate-400 font-normal">
            Biologically Realistic Cochlear Implant–Auditory Nerve Simulation
          </p>
        </div>

        {/* Research Simulation Badge - Clickable to open Simulation Status */}
        <button
          onClick={onOpenStatus}
          className="hidden sm:flex items-center gap-2 px-3 py-1 bg-emerald-950/60 hover:bg-emerald-950/90 border border-emerald-500/40 hover:border-emerald-400 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.15)] transition-all cursor-pointer group"
          title="Click to view Simulation Engine Status"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
          <span className="text-[10px] font-semibold tracking-wider text-emerald-300 uppercase group-hover:text-emerald-200">
            Research Simulation
          </span>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Research Mode toggle */}
        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-[#11192e] border border-[#1e2c4c]">
          <span className="text-xs text-slate-300 font-medium">Research Mode</span>
          <button
            onClick={() => setResearchMode(!researchMode)}
            className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
              researchMode ? 'bg-cyan-500 justify-end' : 'bg-slate-700 justify-start'
            }`}
            aria-label="Toggle Research Mode"
            title={researchMode ? 'Research Mode ON: Advanced biophysical parameters exposed' : 'Research Mode OFF: Simplified demonstration parameters'}
          >
            <span className="w-4 h-4 rounded-full bg-white shadow-md transform transition-transform" />
          </button>
        </div>

        {/* Icon Action Buttons */}
        <button
          onClick={onOpenDocs}
          className="p-2 text-slate-400 hover:text-cyan-300 hover:bg-[#131f3b] rounded-lg border border-transparent hover:border-[#1f325c] transition-all cursor-pointer"
          title="Searchable Research Documentation"
        >
          <BookOpen className="w-4 h-4" />
        </button>

        <button
          onClick={onOpenExport}
          className="p-2 text-slate-400 hover:text-cyan-300 hover:bg-[#131f3b] rounded-lg border border-transparent hover:border-[#1f325c] transition-all cursor-pointer"
          title="Export Experiment & Simulation Data"
        >
          <Download className="w-4 h-4" />
        </button>

        <button
          onClick={onOpenSettings}
          className="p-2 text-slate-400 hover:text-cyan-300 hover:bg-[#131f3b] rounded-lg border border-transparent hover:border-[#1f325c] transition-all cursor-pointer"
          title="Simulation Settings & Solver Controls"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* AI Assistant Button */}
        <button
          onClick={onOpenAI}
          className="relative w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-[0_0_12px_rgba(6,182,212,0.4)] hover:shadow-[0_0_18px_rgba(6,182,212,0.7)] transition-all transform hover:scale-105 cursor-pointer"
          title="AI Research Assistant"
        >
          <span>AI</span>
          <Sparkles className="w-2.5 h-2.5 absolute -top-0.5 -right-0.5 text-yellow-300" />
        </button>
      </div>
    </header>
  );
};
