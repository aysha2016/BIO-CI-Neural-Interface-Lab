import React from 'react';
import { X, CheckCircle, AlertTriangle, Cpu, Network, Zap } from 'lucide-react';

interface ResearchGapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResearchGapModal: React.FC<ResearchGapModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#0b1324] border border-[#23355e] rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#152342] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <Network className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Research Gap 1: Biological Realism</h3>
            <p className="text-xs text-slate-400">
              Comparative Analysis: Phenomenological vs Biomechanically Realistic Models
            </p>
          </div>
        </div>

        {/* Content Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-5">
          {/* Simplified Model */}
          <div className="p-4 rounded-xl bg-[#0e172c] border border-rose-500/20 space-y-3">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4" />
              <span>Current Literature Models</span>
            </div>
            <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
              <li>
                <strong className="text-slate-200">Point Neurons:</strong> Single threshold,
                neglecting spatial dendrite-soma-axon propagation.
              </li>
              <li>
                <strong className="text-slate-200">Deterministic Firing:</strong> Fails to replicate
                stochastic ion-channel noise and subthreshold fluctuations.
              </li>
              <li>
                <strong className="text-slate-200">Static Spread:</strong> Assumes uniform volume
                conduction without bone/tissue dielectric anisotropy.
              </li>
              <li>
                <strong className="text-slate-200">Fidelity:</strong> ~45% experimental match.
              </li>
            </ul>
          </div>

          {/* Proposed Biological Model */}
          <div className="p-4 rounded-xl bg-[#0e1f38] border border-cyan-500/40 space-y-3 shadow-[0_0_15px_rgba(6,182,212,0.1)]">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
              <CheckCircle className="w-4 h-4" />
              <span>BIO-CI Multi-Compartment Model</span>
            </div>
            <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
              <li>
                <strong className="text-cyan-300">Active Nodes of Ranvier:</strong> Hodgkin-Huxley &
                Schwarz-Eikhof channel kinetics at unmyelinated nodes.
              </li>
              <li>
                <strong className="text-cyan-300">Stochastic Gating:</strong> Channel noise modeling
                spike jitter, absolute & relative refractory states.
              </li>
              <li>
                <strong className="text-cyan-300">3D Volume Conduction:</strong> Boundary Element
                Method (BEM) through modiolus, perilymph, and bone.
              </li>
              <li>
                <strong className="text-cyan-300">Fidelity:</strong> 90% benchmark match.
              </li>
            </ul>
          </div>
        </div>

        {/* Mathematical formulation */}
        <div className="p-3.5 bg-[#070d18] border border-[#1b2b4d] rounded-xl text-xs space-y-2">
          <div className="font-semibold text-slate-200 flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-yellow-400" />
            <span>Membrane Potential Cable Equation:</span>
          </div>
          <p className="font-mono text-cyan-300 bg-[#091122] p-2 rounded border border-[#182645] text-center">
            c_m · (dV_n/dt) = (V_(n-1) - 2·V_n + V_(n+1)) / R_a - I_ion + I_stim(t)
          </p>
          <p className="text-slate-400 text-[11px]">
            Where active sodium (I_Na), persistent potassium (I_K), and leak currents dynamically dictate axonal threshold and refractoriness.
          </p>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};
