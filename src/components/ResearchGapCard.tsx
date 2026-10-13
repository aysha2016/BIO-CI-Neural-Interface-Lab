import React from 'react';
import { ArrowRight } from 'lucide-react';
import neuronBg from '../assets/images/neural_neuron_arborization_1791818796635.jpg';

interface ResearchGapCardProps {
  onViewDetails: () => void;
}

export const ResearchGapCard: React.FC<ResearchGapCardProps> = ({ onViewDetails }) => {
  return (
    <div className="relative overflow-hidden bg-[#0c1428] border border-[#1e2f54] rounded-2xl p-5 flex flex-col justify-between shadow-xl h-full group">
      {/* High-res Biological Neuron Arborization Image */}
      <div className="absolute right-0 top-0 bottom-0 w-3/5 pointer-events-none overflow-hidden select-none">
        <img
          src={neuronBg}
          alt="Biological Neural Network"
          className="w-full h-full object-cover object-center opacity-60 mix-blend-screen scale-110 group-hover:scale-115 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0c1428] via-[#0c1428]/40 to-transparent" />
      </div>

      <div className="relative z-10 max-w-[70%]">
        <h3 className="text-base font-bold text-indigo-300 tracking-wide mb-1.5">
          Research Gap 1
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed font-normal">
          Current models are simplified and not fully biologically realistic.
        </p>
      </div>

      <div className="relative z-10 mt-4">
        <button
          onClick={onViewDetails}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-cyan-300 hover:text-white bg-[#142345]/90 hover:bg-[#1d3261] border border-cyan-500/40 hover:border-cyan-400 rounded-lg transition-all shadow-[0_0_12px_rgba(6,182,212,0.25)] cursor-pointer"
        >
          <span>View Details</span>
          <ArrowRight className="w-3.5 h-3.5 stroke-[2.2]" />
        </button>
      </div>
    </div>
  );
};

