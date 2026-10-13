import React from 'react';
import { X, Activity, TrendingUp, Info } from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

interface MetricDetailModalProps {
  metricName: string | null;
  onClose: () => void;
}

interface MetricInfoData {
  title: string;
  definition: string;
  formula: string;
  currentValue: (metrics: any) => string;
  previousValue: string;
  interpretation: string;
  clinicalNote: string;
}

const METRIC_DETAILS: Record<string, MetricInfoData> = {
  'Neural Selectivity': {
    title: 'Neural Selectivity',
    definition: 'Quantifies the spatial confinement of auditory nerve excitation to the target tonotopic frequency region, penalizing current leakage into flanking channels.',
    formula: 'Selectivity = I_{target} / (I_{target} + ∑ I_{flanking})',
    currentValue: (m) => `${m.neuralSelectivity}`,
    previousValue: '0.64 (Previous EXP-1038)',
    interpretation: 'A value of 0.72 indicates strong spatial channel confinement. Reducing current spread will drive this metric closer to 0.90.',
    clinicalNote: 'SIMULATED VALUE: Demonstrates computational channel isolation. Does not represent patient psychophysical pitch discrimination.',
  },
  'Spatial Activation Width': {
    title: 'Spatial Activation Width',
    definition: 'The full-width at half-maximum (FWHM) in millimeters of recruited nerve fibers along the modiolar spiral wall.',
    formula: 'Width_{FWHM} = 2 · √(2 · ln 2) · σ_{spread}',
    currentValue: (m) => `${m.spatialActivationWidth} mm`,
    previousValue: '1.18 mm (Monopolar baseline)',
    interpretation: '0.86 mm represents focused spatial activation. Monopolar stimulation typically spans 1.2–2.0 mm, causing substantial pitch blur.',
    clinicalNote: 'SIMULATED VALUE: Calculated from Laplace volume conduction. Biological tissue impedance varies across patients.',
  },
  'Spike Timing Precision': {
    title: 'Spike Timing Precision',
    definition: 'The standard deviation (jitter) of first-spike latency across the recruited nerve fiber population in response to electrical pulse onsets.',
    formula: 'Precision = σ(t_{spike} - t_{pulse})',
    currentValue: (m) => `${m.spikeTimingPrecision} ms`,
    previousValue: '0.50 ms',
    interpretation: 'Sub-millisecond jitter (0.41 ms) provides high temporal resolution essential for sound localization via interaural time differences (ITD).',
    clinicalNote: 'SIMULATED VALUE: Incorporates microscopic stochastic sodium channel gating noise.',
  },
  'Activation Probability': {
    title: 'Activation Probability',
    definition: 'The percentage likelihood that an auditory nerve fiber within the effective field radius fires an all-or-none action potential on a given stimulus pulse.',
    formula: 'P_{spike} = 1 - exp(-λ(V_{membrane}) · dt)',
    currentValue: (m) => `${m.activationProbability}%`,
    previousValue: '54%',
    interpretation: '62% activation ensures robust neural recruitment without requiring excessive electric current that would exhaust battery lifespan.',
    clinicalNote: 'SIMULATED VALUE: Computed from transmembrane potential depolarization relative to threshold.',
  },
  'Spike Sparsity': {
    title: 'Spike Sparsity',
    definition: 'The proportion of silent inter-spike intervals relative to total temporal capacity, reflecting energy efficiency and event-driven coding.',
    formula: 'Sparsity = 1 - (Spikes_{observed} / Spikes_{maximum})',
    currentValue: (m) => `${m.spikeSparsity}`,
    previousValue: '0.55',
    interpretation: 'A sparsity of 0.68 reflects efficient event-driven spike coding, mirroring biological sparse coding in the primary auditory cortex.',
    clinicalNote: 'SIMULATED VALUE: Metric designed for benchmarking neuromorphic spiking neural network decoders.',
  },
  'Temporal Fidelity': {
    title: 'Temporal Fidelity',
    definition: 'The vector strength and phase-locking synchrony of the simulated spike train to the periodic fundamental frequency of the acoustic envelope.',
    formula: 'Fidelity = √( (∑ cos θ_i)² + (∑ sin θ_i)² ) / N',
    currentValue: (m) => `${m.temporalFidelity}`,
    previousValue: '0.64',
    interpretation: '0.74 represents strong temporal envelope preservation, enabling downstream SNN decoders to distinguish voiced speech pitch.',
    clinicalNote: 'SIMULATED VALUE: Based on post-stimulus time histogram synchrony in the presence of simulated adaptation.',
  },
};

export const MetricDetailModal: React.FC<MetricDetailModalProps> = ({
  metricName,
  onClose,
}) => {
  const { metrics } = useSimulation();

  if (!metricName) return null;

  const data = METRIC_DETAILS[metricName] || METRIC_DETAILS['Neural Selectivity'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#0b1324] border border-[#23355e] rounded-2xl max-w-lg w-full p-6 shadow-2xl relative space-y-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#152342] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider font-bold text-cyan-400">
              Metric Deep Dive
            </div>
            <h3 className="text-base font-bold text-white">{data.title}</h3>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">{data.definition}</p>

        {/* Current Value vs Previous */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-[#0e172a] rounded-xl border border-cyan-500/40">
            <span className="text-[10px] text-slate-400 block">Current Simulation Value:</span>
            <span className="text-lg font-bold font-mono text-cyan-300">
              {data.currentValue(metrics)}
            </span>
          </div>

          <div className="p-3 bg-[#0e172a] rounded-xl border border-[#1b2742]">
            <span className="text-[10px] text-slate-400 block">Benchmark Run:</span>
            <span className="text-sm font-bold font-mono text-slate-300 mt-1 block">
              {data.previousValue}
            </span>
          </div>
        </div>

        {/* Mathematical formulation */}
        <div className="p-3 bg-[#080d19] rounded-xl border border-[#16233e] text-xs space-y-1">
          <span className="text-[10px] text-slate-400 font-semibold block">Mathematical Definition:</span>
          <div className="font-mono text-cyan-300 text-center py-1">{data.formula}</div>
        </div>

        {/* Scientific Interpretation */}
        <div className="p-3 bg-[#0e1830] rounded-xl border border-cyan-500/30 text-xs space-y-1">
          <span className="font-bold text-cyan-300 block">Interpretation in this Run:</span>
          <p className="text-slate-300 text-[11px] leading-relaxed">{data.interpretation}</p>
        </div>

        {/* Disclaimer Note */}
        <div className="text-[10.5px] text-amber-300/80 p-2.5 rounded-lg bg-amber-950/30 border border-amber-500/30 leading-tight">
          <strong>Non-Clinical Simulation Metric:</strong> {data.clinicalNote}
        </div>

        <div className="flex justify-end pt-2">
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
