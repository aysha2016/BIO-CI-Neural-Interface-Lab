import React, { useState } from 'react';
import { X, ShieldCheck, Check, AlertTriangle, Minus, HelpCircle } from 'lucide-react';

interface ModelFidelityModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategory?: string | null;
}

interface FidelityItem {
  id: string;
  name: string;
  simplified: 'included' | 'simplified' | 'not_represented';
  biological: 'included' | 'simplified' | 'not_represented';
  description: string;
  impact: string;
}

export const FIDELITY_ITEMS: FidelityItem[] = [
  {
    id: 'refractoriness',
    name: 'Refractoriness (ARP & RRP)',
    simplified: 'not_represented',
    biological: 'included',
    description: 'Models sodium channel inactivation during the absolute (~0.7ms) and relative (1.5-3.0ms) refractory intervals.',
    impact: 'Without this, simplified models overestimate firing rates at >1000 pps, corrupting high-rate pulse entrainment.',
  },
  {
    id: 'adaptation',
    name: 'Adaptation & Forward Masking',
    simplified: 'not_represented',
    biological: 'included',
    description: 'Models slow potassium currents and ion depletion that decay continuous spike trains toward steady-state.',
    impact: 'Crucial for phoneme transition recognition where preceding sounds modulate auditory nerve sensitivity.',
  },
  {
    id: 'heterogeneity',
    name: 'Fiber Population Heterogeneity',
    simplified: 'simplified',
    biological: 'included',
    description: 'Implements stochastic variance in axon diameter, threshold, latency, and spontaneous rate classification.',
    impact: 'Eliminates unphysiological all-or-none step function threshold jumps in whole-nerve recruitment curves.',
  },
  {
    id: 'electrical_field',
    name: '3D Anisotropic Electrical Field',
    simplified: 'simplified',
    biological: 'included',
    description: 'Solves 3D Poisson volume conduction across perilymph fluid (1.4 S/m) and modiolus bone (0.016 S/m).',
    impact: 'Correctly reproduces broad current spread and spatial crosstalk that occurs in human scala tympani.',
  },
  {
    id: 'impedance',
    name: 'Electrode Complex Impedance',
    simplified: 'simplified',
    biological: 'included',
    description: 'Simulates tissue-carrier contact resistance and electrochemical capacitance.',
    impact: 'Essential for predicting compliance voltage limits and current steering efficacy across tripolar configurations.',
  },
  {
    id: 'anatomical',
    name: 'Anatomical Variations & Trajectory',
    simplified: 'simplified',
    biological: 'simplified',
    description: 'Models patient insertion depth angle (360°-540°) and distance from electrode to modiolus wall.',
    impact: 'Explains why perimodiolar arrays achieve 3-6 dB lower thresholds compared to lateral wall arrays.',
  },
  {
    id: 'survival',
    name: 'Neural Survival & Degeneration',
    simplified: 'not_represented',
    biological: 'included',
    description: 'Simulates segmental spiral ganglion cell (SGC) survival density along the basilar length.',
    impact: 'Represents severe sensorineural hearing loss where dead cochlear regions produce dead channels.',
  },
  {
    id: 'spiking',
    name: 'Stochastic Ion Channel Spiking',
    simplified: 'simplified',
    biological: 'included',
    description: 'Incorporates channel gating fluctuations causing spike latency jitter of ~0.41 ms.',
    impact: 'Prevents hypersynchrony artifacts that cause unnatural ringing in artificial point-neuron decoders.',
  },
];

export const ModelFidelityModal: React.FC<ModelFidelityModalProps> = ({
  isOpen,
  onClose,
  selectedCategory,
}) => {
  const [activeItem, setActiveItem] = useState<string>(
    selectedCategory || 'refractoriness'
  );

  if (!isOpen) return null;

  const currentDetail = FIDELITY_ITEMS.find((item) => item.id === activeItem) || FIDELITY_ITEMS[0];

  const renderBadge = (status: FidelityItem['simplified']) => {
    switch (status) {
      case 'included':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
            <Check className="w-3 h-3 stroke-[3]" />
            <span>✓ Included</span>
          </span>
        );
      case 'simplified':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/30">
            <Minus className="w-3 h-3 stroke-[3]" />
            <span>~ Simplified</span>
          </span>
        );
      case 'not_represented':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-500/30">
            <X className="w-3 h-3 stroke-[3]" />
            <span>× Not represented</span>
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#0b1324] border border-[#23355e] rounded-2xl max-w-3xl w-full p-6 shadow-2xl relative flex flex-col h-[560px]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#18233c]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Model Fidelity Breakdown</h3>
              <p className="text-xs text-slate-400">
                Detailed comparison: Simplified Literature Model (45%) vs BIO-CI Biological Model (90%)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#152342] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Layout: Table of Categories + Detail explanation */}
        <div className="flex-1 flex gap-4 overflow-hidden pt-3">
          {/* Categories List */}
          <div className="w-64 shrink-0 border-r border-[#18233c] pr-3 space-y-1.5 overflow-y-auto">
            {FIDELITY_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveItem(item.id)}
                className={`w-full text-left p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer flex items-center justify-between ${
                  activeItem === item.id
                    ? 'bg-[#15274e] border-cyan-500 text-white shadow-md'
                    : 'bg-[#0e1628] border-transparent text-slate-400 hover:bg-[#131f38] hover:text-slate-200'
                }`}
              >
                <span className="truncate">{item.name}</span>
              </button>
            ))}
          </div>

          {/* Active Detail Display */}
          <div className="flex-1 overflow-y-auto pr-2 space-y-4 text-xs text-slate-300">
            <div>
              <h4 className="text-sm font-bold text-white mb-1">{currentDetail.name}</h4>
              <p className="text-slate-400 leading-relaxed">{currentDetail.description}</p>
            </div>

            {/* Side by Side Badges */}
            <div className="grid grid-cols-2 gap-3 p-3 bg-[#080d19] rounded-xl border border-[#18233c]">
              <div>
                <span className="text-[10.5px] text-slate-400 block mb-1">
                  Simplified Literature Model:
                </span>
                {renderBadge(currentDetail.simplified)}
              </div>

              <div>
                <span className="text-[10.5px] text-cyan-400 block mb-1">
                  BIO-CI Biological Model:
                </span>
                {renderBadge(currentDetail.biological)}
              </div>
            </div>

            {/* Why it Matters in Research */}
            <div className="p-3.5 bg-[#0e172a] rounded-xl border border-cyan-500/30 space-y-1.5">
              <span className="text-xs font-bold text-cyan-300 block">
                Research & Information Impact:
              </span>
              <p className="text-[11.5px] text-slate-300 leading-relaxed">
                {currentDetail.impact}
              </p>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-[#18233c] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
