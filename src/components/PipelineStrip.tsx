import React from 'react';
import { ChevronRight } from 'lucide-react';

interface PipelineStripProps {
  activeStep?: number;
  onSelectStep?: (idx: number) => void;
}

export const PipelineStrip: React.FC<PipelineStripProps> = ({
  activeStep = 3,
  onSelectStep,
}) => {
  const steps = [
    {
      title: 'Audio Input',
      renderIcon: () => (
        <svg viewBox="0 0 32 32" className="w-6 h-6">
          <rect x="3" y="10" width="2" height="12" rx="1" fill="#38bdf8" />
          <rect x="7" y="6" width="2" height="20" rx="1" fill="#38bdf8" />
          <rect x="11" y="3" width="2" height="26" rx="1" fill="#60a5fa" />
          <rect x="15" y="7" width="2" height="18" rx="1" fill="#38bdf8" />
          <rect x="19" y="4" width="2" height="24" rx="1" fill="#60a5fa" />
          <rect x="23" y="9" width="2" height="14" rx="1" fill="#38bdf8" />
          <rect x="27" y="12" width="2" height="8" rx="1" fill="#38bdf8" />
        </svg>
      ),
    },
    {
      title: 'CI Processor',
      renderIcon: () => (
        <svg viewBox="0 0 32 32" className="w-6 h-6">
          <rect x="6" y="6" width="20" height="20" rx="3" fill="#0f1f42" stroke="#38bdf8" strokeWidth="1.5" />
          <rect x="11" y="11" width="10" height="10" rx="1.5" fill="#1e3a8a" stroke="#60a5fa" strokeWidth="1" />
          <circle cx="16" cy="16" r="2" fill="#38bdf8" />
          {/* Pins */}
          <line x1="10" y1="3" x2="10" y2="6" stroke="#38bdf8" strokeWidth="1.5" />
          <line x1="16" y1="3" x2="16" y2="6" stroke="#38bdf8" strokeWidth="1.5" />
          <line x1="22" y1="3" x2="22" y2="6" stroke="#38bdf8" strokeWidth="1.5" />
          <line x1="10" y1="26" x2="10" y2="29" stroke="#38bdf8" strokeWidth="1.5" />
          <line x1="16" y1="26" x2="16" y2="29" stroke="#38bdf8" strokeWidth="1.5" />
          <line x1="22" y1="26" x2="22" y2="29" stroke="#38bdf8" strokeWidth="1.5" />
          <line x1="3" y1="10" x2="6" y2="10" stroke="#38bdf8" strokeWidth="1.5" />
          <line x1="3" y1="16" x2="6" y2="16" stroke="#38bdf8" strokeWidth="1.5" />
          <line x1="3" y1="22" x2="6" y2="22" stroke="#38bdf8" strokeWidth="1.5" />
          <line x1="26" y1="10" x2="29" y2="10" stroke="#38bdf8" strokeWidth="1.5" />
          <line x1="26" y1="16" x2="29" y2="16" stroke="#38bdf8" strokeWidth="1.5" />
          <line x1="26" y1="22" x2="29" y2="22" stroke="#38bdf8" strokeWidth="1.5" />
        </svg>
      ),
    },
    {
      title: 'Electrode Current',
      renderIcon: () => (
        <svg viewBox="0 0 32 32" className="w-6 h-6">
          <path
            d="M 3 16 L 9 16 L 11 6 L 15 26 L 18 10 L 21 16 L 29 16"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="11" cy="6" r="2" fill="#60a5fa" />
          <circle cx="15" cy="26" r="2" fill="#38bdf8" />
        </svg>
      ),
    },
    {
      title: '3D Electrical Field',
      renderIcon: () => (
        <svg viewBox="0 0 32 32" className="w-6 h-6">
          <circle cx="16" cy="16" r="12" fill="none" stroke="#2563eb" strokeWidth="1" strokeDasharray="2 2" />
          <ellipse cx="16" cy="16" rx="12" ry="5" fill="none" stroke="#06b6d4" strokeWidth="1.2" transform="rotate(-25 16 16)" />
          <ellipse cx="16" cy="16" rx="12" ry="5" fill="none" stroke="#f59e0b" strokeWidth="1.2" transform="rotate(25 16 16)" />
          <circle cx="16" cy="16" r="4" fill="url(#fieldGrad)" />
          <defs>
            <radialGradient id="fieldGrad">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="50%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#06b6d4" />
            </radialGradient>
          </defs>
        </svg>
      ),
    },
    {
      title: 'Auditory Nerve Fibers',
      renderIcon: () => (
        <svg viewBox="0 0 32 32" className="w-6 h-6">
          <circle cx="8" cy="16" r="3" fill="#38bdf8" />
          <path d="M 8 16 Q 16 12 24 6" fill="none" stroke="#38bdf8" strokeWidth="1.5" />
          <path d="M 8 16 Q 18 16 26 16" fill="none" stroke="#38bdf8" strokeWidth="1.5" />
          <path d="M 8 16 Q 16 20 24 26" fill="none" stroke="#38bdf8" strokeWidth="1.5" />
          <circle cx="24" cy="6" r="2" fill="#60a5fa" />
          <circle cx="26" cy="16" r="2" fill="#38bdf8" />
          <circle cx="24" cy="26" r="2" fill="#60a5fa" />
        </svg>
      ),
    },
    {
      title: 'Spiking Neural Response',
      renderIcon: () => (
        <svg viewBox="0 0 32 32" className="w-6 h-6">
          <line x1="3" y1="26" x2="29" y2="26" stroke="#475569" strokeWidth="1" />
          <rect x="6" y="16" width="1.5" height="10" fill="#c084fc" />
          <rect x="9" y="8" width="1.5" height="18" fill="#e879f9" />
          <rect x="13" y="14" width="1.5" height="12" fill="#c084fc" />
          <rect x="16" y="5" width="1.5" height="21" fill="#f43f5e" />
          <rect x="19" y="10" width="1.5" height="16" fill="#e879f9" />
          <rect x="23" y="18" width="1.5" height="8" fill="#c084fc" />
          <rect x="26" y="12" width="1.5" height="14" fill="#e879f9" />
        </svg>
      ),
    },
    {
      title: 'Central Decoder',
      renderIcon: () => (
        <svg viewBox="0 0 32 32" className="w-6 h-6">
          {/* Brain shape with neural network nodes */}
          <path
            d="M 12 7 C 8 7 5 10 5 15 C 5 19 8 23 12 25 L 16 25 L 20 25 C 24 23 27 19 27 15 C 27 10 24 7 20 7 C 18 5 14 5 12 7 Z"
            fill="none"
            stroke="#22d3ee"
            strokeWidth="1.5"
          />
          <line x1="16" y1="7" x2="16" y2="25" stroke="#22d3ee" strokeWidth="1" strokeDasharray="2 2" />
          <circle cx="11" cy="12" r="1.5" fill="#38bdf8" />
          <circle cx="11" cy="18" r="1.5" fill="#38bdf8" />
          <circle cx="21" cy="12" r="1.5" fill="#38bdf8" />
          <circle cx="21" cy="18" r="1.5" fill="#38bdf8" />
          <circle cx="16" cy="15" r="2" fill="#67e8f9" />
        </svg>
      ),
    },
  ];

  return (
    <div className="bg-[#0b1222] border border-[#18233c] rounded-2xl p-4 shadow-xl">
      <div className="mb-3">
        <h2 className="text-sm font-bold text-white tracking-wide">
          From Electrical Stimulation to Neural Spikes
        </h2>
        <p className="text-xs text-slate-400">
          Complete computational pipeline from sound to central decoding
        </p>
      </div>

      <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1 pt-1">
        {steps.map((step, idx) => {
          const isSelected = activeStep === idx;
          const isArrow = idx < steps.length - 1;

          return (
            <React.Fragment key={step.title}>
              <button
                onClick={() => onSelectStep?.(idx)}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl transition-all cursor-pointer min-w-[96px] flex-1 text-center group border ${
                  isSelected
                    ? 'bg-[#15274e] border-cyan-500/80 shadow-[0_0_16px_rgba(6,182,212,0.35)]'
                    : 'bg-[#0e1628]/80 border-[#1a253d] hover:bg-[#14203a] hover:border-[#28395a]'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center mb-1.5 transition-all ${
                    isSelected
                      ? 'bg-cyan-500/20 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                      : 'bg-[#121c33] group-hover:scale-105'
                  }`}
                >
                  {step.renderIcon()}
                </div>
                <span
                  className={`text-[11px] font-semibold tracking-tight ${
                    isSelected ? 'text-white' : 'text-slate-300'
                  }`}
                >
                  {step.title}
                </span>
              </button>

              {isArrow && (
                <div className="shrink-0 text-cyan-500/40 px-0.5">
                  <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
