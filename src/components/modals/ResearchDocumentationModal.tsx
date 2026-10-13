import React, { useState } from 'react';
import { X, Search, BookOpen, Layers, Cpu, Activity, AlertCircle, FileText } from 'lucide-react';

interface ResearchDocumentationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResearchDocumentationModal: React.FC<ResearchDocumentationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeDocTab, setActiveDocTab] = useState('Model Overview');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const docSections = [
    { id: 'Model Overview', label: 'Model Overview' },
    { id: 'Research Gap', label: 'Research Gap' },
    { id: 'Biological Assumptions', label: 'Biological Assumptions' },
    { id: 'Simulation Parameters', label: 'Simulation Parameters' },
    { id: 'Neural Model', label: 'Neural Model' },
    { id: 'Electrode Model', label: 'Electrode Model' },
    { id: 'Experiment Guide', label: 'Experiment Guide' },
    { id: 'Metrics', label: 'Metrics' },
    { id: 'Limitations', label: 'Limitations' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#0b1324] border border-[#23355e] rounded-2xl max-w-4xl w-full p-6 shadow-2xl relative flex flex-col h-[640px]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#18233c]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Research Documentation</h3>
              <p className="text-xs text-slate-400">
                Biophysical specifications, mathematical formulations, and experimental guidelines
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

        {/* Search Bar */}
        <div className="my-3 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documentation (e.g., refractoriness, Greenwood, Poisson, LIF)..."
            className="w-full bg-[#10192e] text-xs text-white rounded-xl pl-9 pr-4 py-2 border border-[#1e2f52] focus:outline-none focus:border-cyan-400"
          />
        </div>

        {/* Content Layout: Left Nav Tabs + Right Document Reader */}
        <div className="flex-1 flex gap-4 overflow-hidden pt-1">
          {/* Left Tabs */}
          <div className="w-52 shrink-0 border-r border-[#18233c] pr-3 space-y-1 overflow-y-auto">
            {docSections.map((sec) => (
              <button
                key={sec.id}
                onClick={() => setActiveDocTab(sec.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  activeDocTab === sec.id
                    ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#111c33]'
                }`}
              >
                {sec.label}
              </button>
            ))}
          </div>

          {/* Right Document Content */}
          <div className="flex-1 overflow-y-auto pr-2 text-xs text-slate-300 space-y-4">
            {activeDocTab === 'Model Overview' && (
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-white">BIO-CI Architectural Overview</h4>
                <p className="leading-relaxed">
                  The BIO-CI Neural Interface Lab is a computational neuroscience research platform designed to investigate the biophysical cause-and-effect chain linking audio processing to multi-electrode current injection, 3D volume conduction, stochastic auditory nerve action potential generation, and neuromorphic SNN phoneme decoding.
                </p>
                <div className="p-3 bg-[#080d19] border border-[#182645] rounded-xl space-y-1">
                  <span className="font-bold text-cyan-300 block">End-to-End Pipeline:</span>
                  <div className="font-mono text-[11px] text-slate-300">
                    Audio (16kHz) → CI Filterbank (22 Channels) → Biphasic Current Pulse → 3D Electrical Field (Poisson Solver) → Multi-compartment Axons → Spiking Response → SNN Decoder
                  </div>
                </div>
              </div>
            )}

            {activeDocTab === 'Research Gap' && (
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-white">The Central Research Gap</h4>
                <p className="leading-relaxed">
                  Existing literature predominantly models auditory nerve fibers as simplified point integrate-and-fire units with deterministic thresholds and static 1D current decay. In reality, human cochleas exhibit complex 3D volume conduction through anisotropic bone, spatial dispersion across unmyelinated nodes of Ranvier, sodium channel inactivation refractoriness, and forward masking adaptation.
                </p>
                <div className="p-3 bg-purple-950/30 border border-purple-500/30 rounded-xl space-y-1 text-purple-200">
                  <strong>Hypothesis:</strong> Biologically grounded differentiable models allow AI decoders to extract nuanced temporal timing cues that simplified models discard as noise.
                </div>
              </div>
            )}

            {activeDocTab === 'Biological Assumptions' && (
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-white">Biological Assumptions & Biophysical Bounds</h4>
                <ul className="space-y-2 list-disc list-inside text-slate-300 leading-relaxed">
                  <li><strong>Perilymph Conductivity:</strong> Homogeneous isotropic medium with σ = 1.40 S/m.</li>
                  <li><strong>Modiolar Bone Conductivity:</strong> Highly resistive dielectric barrier with σ = 0.016 S/m.</li>
                  <li><strong>Node of Ranvier Kinetics:</strong> Active fast sodium (I_Na) and slow persistent potassium (I_K) channel gating per Schwarz-Eikhof formulations.</li>
                  <li><strong>Absolute Refractory Period (ARP):</strong> Fixed at ~0.7 ms, during which voltage-gated Na+ channels remain fully inactivated.</li>
                  <li><strong>Relative Refractory Period (RRP):</strong> Exponential threshold restoration with time constant τ_rel = 1.5–3.5 ms.</li>
                </ul>
              </div>
            )}

            {activeDocTab === 'Simulation Parameters' && (
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-white">Global Parameter Catalog</h4>
                <p>Every parameter in the lab maps to a biophysical or engineering entity:</p>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                  <div className="p-2 bg-[#090f1e] rounded border border-[#16233e]">Current Amplitude: 100–900 µA</div>
                  <div className="p-2 bg-[#090f1e] rounded border border-[#16233e]">Spatial Spread: 10–90%</div>
                  <div className="p-2 bg-[#090f1e] rounded border border-[#16233e]">Pulse Rate: 200–2400 pps</div>
                  <div className="p-2 bg-[#090f1e] rounded border border-[#16233e]">Electrode Impedance: 2.0–18.0 kΩ</div>
                </div>
              </div>
            )}

            {activeDocTab === 'Neural Model' && (
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-white">Neural Modeling Implementations</h4>
                <p>Users can toggle between three progressive models:</p>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-300">
                  <li><strong>Simplified Point Neuron:</strong> Standard Leaky Integrate-and-Fire without channel noise or refractoriness.</li>
                  <li><strong>Biologically Inspired Model:</strong> Includes absolute refractoriness, latency jitter, and stochastic gating noise.</li>
                  <li><strong>Adaptive Spiking Model:</strong> Adds dynamic subthreshold adaptation currents w(t) to replicate forward masking.</li>
                </ol>
              </div>
            )}

            {activeDocTab === 'Electrode Model' && (
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-white">Cochlear Tonotopy & Electrode Physics</h4>
                <p className="leading-relaxed">
                  Electrodes 1 to 16/22 follow the Greenwood tonotopic position-frequency function:
                </p>
                <div className="font-mono bg-[#070c18] p-2 rounded text-cyan-300 text-center border border-[#16233e]">
                  F(x) = 165.4 × (10^(0.06 × x) - 1)
                </div>
                <p>Basal electrode 01 stimulates high frequencies (~20 kHz), while apical electrode 16 stimulates lower frequencies (~250 Hz).</p>
              </div>
            )}

            {activeDocTab === 'Experiment Guide' && (
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-white">How to Conduct an Experiment</h4>
                <p className="leading-relaxed">
                  1. Formulate a targeted hypothesis in the <strong>Experiments</strong> tab.<br />
                  2. Adjust specific stimulation controls (e.g. Current Spread from 42% to 25%).<br />
                  3. Observe real-time propagation across 3D Cochlea, Spike Raster, and Population Curves.<br />
                  4. Click <strong>Run Experiment</strong> to freeze and archive the parameter snapshot with derived metrics.
                </p>
              </div>
            )}

            {activeDocTab === 'Metrics' && (
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-white">The Six Core Research Metrics</h4>
                <ul className="space-y-2 list-disc list-inside">
                  <li><strong>Neural Selectivity:</strong> Spatial channel isolation ratio (0.0 to 1.0).</li>
                  <li><strong>Spatial Activation Width:</strong> Radial tissue span of recruited fibers (mm).</li>
                  <li><strong>Spike Timing Precision:</strong> First-spike latency standard deviation / jitter (ms).</li>
                  <li><strong>Activation Probability:</strong> Percentage chance of an action potential on a given pulse (%).</li>
                  <li><strong>Spike Sparsity:</strong> Silence fraction supporting neuromorphic efficiency (0.0 to 1.0).</li>
                  <li><strong>Temporal Fidelity:</strong> Vector strength phase-locking to stimulus envelope (0.0 to 1.0).</li>
                </ul>
              </div>
            )}

            {activeDocTab === 'Limitations' && (
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-white">Academic & Computational Limitations</h4>
                <p className="leading-relaxed">
                  • Simplified 3D Poisson conduction assumes quasi-static field behavior without capacitive tissue phase shifts.<br />
                  • Spiral ganglion survival is parameterized as a scalar density rather than a 3D histological volume.<br />
                  • <strong>This application is strictly an educational research prototype and must never be used for clinical decision-making.</strong>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[#18233c] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Close Documentation
          </button>
        </div>
      </div>
    </div>
  );
};
