import React, { useState } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { Microscope, Bookmark, BookOpen, AlertCircle, Lightbulb } from 'lucide-react';
import { ScientificInsight } from '../../types/simulation';

const initialInsights: ScientificInsight[] = [
  {
    id: 'INS-01',
    category: 'SIMULATION',
    title: 'Broad Current Spread Induces Neighboring Channel Crosstalk',
    description:
      'In our 3D Poisson conduction model, spatial spread exceeding 40% expands the effective radial activation width beyond 0.85 mm, recruiting neighboring fibers associated with adjacent electrodes.',
    parameterContext: 'Spatial Spread: 42% • Current: 450 µA',
  },
  {
    id: 'INS-02',
    category: 'PAPER FINDING',
    title: 'Absolute Refractoriness Suppresses Entrainment Above 1200 pps',
    description:
      'Literature electrophysiological studies in feline and human cochleas demonstrate that an absolute refractory period of ~0.7 ms imposes a strict upper limit on 1:1 pulse-to-spike phase-locking.',
    parameterContext: 'Refractory Duration: 1.8 ms • Pulse Rate: 900 pps',
    reference: 'Miller et al. (2001), Bruce et al. (1999)',
  },
  {
    id: 'INS-03',
    category: 'RESEARCH HYPOTHESIS',
    title: 'Differentiable Multi-Compartment Models Enable End-to-End AI Tuning',
    description:
      'Formulating the electrode-to-spike forward model with surrogate gradients will permit end-to-end backpropagation from downstream phoneme loss directly to speech processor filterbank currents.',
    parameterContext: 'SNN Decoder • Gradient Optimization',
  },
  {
    id: 'INS-04',
    category: 'SIMULATION',
    title: 'Fiber Heterogeneity Smooths Population Rate-Level Dynamics',
    description:
      'Introducing stochastic threshold variance (±15 µA) and latency dispersion eliminates unrealistic step-function all-or-none population jumps, reproducing physiological monotonic growth.',
    parameterContext: 'Heterogeneity: 0.35 • Survival: 85%',
  },
  {
    id: 'INS-05',
    category: 'PAPER FINDING',
    title: 'Perimodiolar Placement Halves Required Threshold Current',
    description:
      'Physical proximity between electrode carrier and modiolus wall reduces perilymph current shunting, decreasing required stimulation thresholds by 3–6 dB compared to lateral wall arrays.',
    parameterContext: 'Modiolar Gap: 0.45 mm',
    reference: 'Cohen et al. (2006)',
  },
  {
    id: 'INS-06',
    category: 'RESEARCH HYPOTHESIS',
    title: 'Patient-Specific SGC Degeneration Maps Predict Speech-in-Noise Gaps',
    description:
      'Incorporating CT-derived segmental spiral ganglion survival densities into pre-operative planning could guide channel dropout algorithms to bypass dead cochlear regions.',
    parameterContext: 'Patient-Specific Model • SGC Survival',
  },
];

export const ResearchInsightsWorkspace: React.FC = () => {
  const [filter, setFilter] = useState<'ALL' | 'PAPER FINDING' | 'SIMULATION' | 'RESEARCH HYPOTHESIS'>('ALL');

  const filtered = filter === 'ALL' ? initialInsights : initialInsights.filter((i) => i.category === filter);

  const getBadgeStyle = (cat: ScientificInsight['category']) => {
    switch (cat) {
      case 'PAPER FINDING':
        return 'bg-blue-950 text-blue-300 border-blue-500/40';
      case 'SIMULATION':
        return 'bg-emerald-950 text-emerald-300 border-emerald-500/40';
      case 'RESEARCH HYPOTHESIS':
        return 'bg-purple-950 text-purple-300 border-purple-500/40';
    }
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Title & Banner */}
      <div className="bg-[#0b1222] border border-[#18233c] rounded-2xl p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/40">
              ACADEMIC SYNTHESIS
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-500/40">
              SCIENTIFIC RIGOR
            </span>
          </div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Microscope className="w-5 h-5 text-cyan-400" />
            Research Insights & Categorized Literature Analysis
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Every observation is explicitly classified into verified literature findings, simulated prototype outputs, or open hypotheses.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#101a30] p-1.5 rounded-xl border border-[#1e2f4f]">
          {(['ALL', 'PAPER FINDING', 'SIMULATION', 'RESEARCH HYPOTHESIS'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filter === tab
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Insights Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-[#0b1222] border border-[#18233c] hover:border-[#22355c] rounded-2xl p-5 shadow-xl space-y-3 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider border uppercase shadow-sm ${getBadgeStyle(
                    item.category
                  )}`}
                >
                  {item.category}
                </span>
                <span className="text-[10px] font-mono text-slate-500">{item.id}</span>
              </div>

              <h3 className="text-sm font-bold text-white leading-snug">{item.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed mt-2">{item.description}</p>
            </div>

            <div className="pt-3 border-t border-[#152038] flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-400 gap-1">
              <span className="font-mono text-cyan-300/80">{item.parameterContext}</span>
              {item.reference && (
                <span className="italic text-slate-500">Ref: {item.reference}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
