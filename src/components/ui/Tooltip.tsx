import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';
import { PARAM_TOOLTIPS } from '../../data/tooltips';

interface TooltipProps {
  paramKey: string;
}

export const Tooltip: React.FC<TooltipProps> = ({ paramKey }) => {
  const [isOpen, setIsOpen] = useState(false);
  const data = PARAM_TOOLTIPS[paramKey];

  if (!data) return null;

  return (
    <div className="relative inline-flex items-center ml-1">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className="text-slate-400 hover:text-cyan-400 p-0.5 rounded transition-colors focus:outline-none cursor-pointer"
        aria-label={`Info about ${data.title}`}
      >
        <HelpCircle className="w-3.5 h-3.5" />
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 w-72 p-3 bg-[#0a1224] border border-cyan-500/40 rounded-xl shadow-2xl text-[11px] text-slate-200 pointer-events-none animate-fade-in backdrop-blur-md">
          <div className="font-bold text-cyan-300 text-xs mb-1.5 pb-1 border-b border-[#182645] flex items-center justify-between">
            <span>{data.title}</span>
            <span className="text-[9px] px-1.5 py-0.2 bg-cyan-950 text-cyan-400 rounded border border-cyan-500/30">
              Parameter
            </span>
          </div>

          <div className="space-y-1.5">
            <div>
              <span className="text-slate-400 font-semibold block text-[10px] uppercase tracking-wider">
                • What it represents
              </span>
              <p className="text-slate-300 leading-tight">{data.represents}</p>
            </div>

            <div>
              <span className="text-slate-400 font-semibold block text-[10px] uppercase tracking-wider">
                • Why it matters
              </span>
              <p className="text-slate-300 leading-tight">{data.whyMatters}</p>
            </div>

            <div>
              <span className="text-slate-400 font-semibold block text-[10px] uppercase tracking-wider">
                • How it affects simulation
              </span>
              <p className="text-cyan-200/90 leading-tight">{data.affects}</p>
            </div>
          </div>

          {/* Tooltip caret */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#0a1224]" />
        </div>
      )}
    </div>
  );
};
