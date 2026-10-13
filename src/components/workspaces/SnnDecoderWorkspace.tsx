import React, { useState } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { Tooltip } from '../ui/Tooltip';
import { Cpu, ArrowRight, Zap, Network, Activity, BarChart2 } from 'lucide-react';

export const SnnDecoderWorkspace: React.FC = () => {
  const {
    metrics,
    modelType,
    refractoryDuration,
    membraneTimeConstant,
    synapticDecay,
  } = useSimulation();

  const [decoderType, setDecoderType] = useState<'LIF' | 'Adaptive-LIF'>('Adaptive-LIF');
  const [snnNeurons, setSnnNeurons] = useState(128);

  const pipelineStages = [
    'Auditory Nerve Spikes',
    'Spike Encoding',
    'LIF / ALIF Layers',
    'Temporal Processing',
    'SNN Readout',
    'Phoneme / Spatial Readout',
  ];

  // Derived SNN metrics
  const snnLatency = (1.25 + (1 / metrics.neuralSelectivity) * 0.3).toFixed(2);
  const snnAccuracy = (82.5 + metrics.neuralSelectivity * 12.0 - (metrics.spatialActivationWidth - 0.8) * 6).toFixed(1);

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Title & Banner */}
      <div className="bg-[#0b1222] border border-[#18233c] rounded-2xl p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/40">
              NEUROMORPHIC COMPUTING
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-950 text-purple-300 border border-purple-500/40">
              SPIKING NEURAL NETWORK
            </span>
          </div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            Spiking Neural Network (SNN) Central Auditory Decoder
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Decodes spatio-temporal peripheral auditory nerve spike patterns into speech phonemes and spatial auditory maps.
          </p>
        </div>

        {/* Decoder Type Switcher */}
        <div className="flex items-center gap-1.5 bg-[#101a30] p-1.5 rounded-xl border border-[#1e2f4f]">
          {(['LIF', 'Adaptive-LIF'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setDecoderType(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                decoderType === t
                  ? 'bg-cyan-600 text-white shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* SNN Pipeline Steps Strip */}
      <div className="bg-[#0b1222] border border-[#18233c] rounded-2xl p-4 shadow-xl">
        <div className="flex items-center justify-between gap-2 overflow-x-auto py-1">
          {pipelineStages.map((stage, i) => (
            <React.Fragment key={stage}>
              <div className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-[#0e172a] border border-[#1e293b] min-w-[120px] text-center">
                <span className="text-[10px] text-cyan-400 font-mono font-bold mb-0.5">
                  Stage 0{i + 1}
                </span>
                <span className="text-xs font-semibold text-slate-200">{stage}</span>
              </div>
              {i < pipelineStages.length - 1 && (
                <ArrowRight className="w-4 h-4 text-cyan-500/50 shrink-0" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* SNN Performance Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#0b1222] border border-[#18233c] rounded-2xl p-4 shadow-md">
          <span className="text-[10.5px] text-slate-400">Phoneme Recognition Accuracy</span>
          <div className="text-xl font-bold font-mono text-cyan-400 mt-0.5">
            {snnAccuracy}%
          </div>
          <span className="text-[10px] text-emerald-400 font-semibold">+13.8% over point neurons</span>
        </div>

        <div className="bg-[#0b1222] border border-[#18233c] rounded-2xl p-4 shadow-md">
          <span className="text-[10.5px] text-slate-400">Synaptic Latency</span>
          <div className="text-xl font-bold font-mono text-purple-400 mt-0.5">
            {snnLatency} ms
          </div>
          <span className="text-[10px] text-slate-500">Sub-2ms edge inference</span>
        </div>

        <div className="bg-[#0b1222] border border-[#18233c] rounded-2xl p-4 shadow-md">
          <span className="text-[10.5px] text-slate-400">Spike Sparsity</span>
          <div className="text-xl font-bold font-mono text-emerald-400 mt-0.5">
            {metrics.spikeSparsity}
          </div>
          <span className="text-[10px] text-slate-500">Event-driven energy efficiency</span>
        </div>

        <div className="bg-[#0b1222] border border-[#18233c] rounded-2xl p-4 shadow-md">
          <span className="text-[10.5px] text-slate-400">Temporal Precision</span>
          <div className="text-xl font-bold font-mono text-white mt-0.5">
            {metrics.spikeTimingPrecision} ms
          </div>
          <span className="text-[10px] text-slate-500">Synchronized phase locking</span>
        </div>
      </div>

      {/* Visualizations Grid: SNN Output Spike Raster & Layer Dynamics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 bg-[#0b1222] border border-[#18233c] rounded-2xl p-5 shadow-xl">
          <h3 className="text-sm font-bold text-white mb-1">
            Cochlear Nucleus & Inferior Colliculus Layer SNN Raster
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            Feedforward propagation from {snnNeurons} leaky integrate-and-fire hidden units.
          </p>

          <div className="h-48 w-full bg-[#060a15] rounded-xl border border-[#18233c] p-3 relative overflow-hidden flex flex-col justify-between">
            {/* Simulated SNN Layer Raster dots */}
            <div className="w-full h-full relative">
              {Array.from({ length: 48 }).map((_, rIdx) => {
                const yPercent = (rIdx / 47) * 90 + 5;
                const spikePositions = [12, 18, 25, 42, 58, 64, 76, 88];
                return (
                  <div key={rIdx} className="absolute left-0 right-0" style={{ top: `${yPercent}%` }}>
                    {spikePositions.map((sp, sIdx) => {
                      if ((rIdx * 13 + sIdx * 7) % 3 === 0) return null;
                      return (
                        <div
                          key={sIdx}
                          className="absolute w-1 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_4px_rgba(6,182,212,0.8)]"
                          style={{ left: `${sp + ((rIdx * 5) % 8) - 4}%` }}
                        />
                      );
                    })}
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between text-[10px] font-mono text-slate-500 pt-1 border-t border-[#131e33]">
              <span>0 ms (Onset)</span>
              <span>25 ms</span>
              <span>50 ms</span>
              <span>75 ms</span>
              <span>100 ms</span>
            </div>
          </div>
        </div>

        {/* Decoder Parameters */}
        <div className="lg:col-span-4 bg-[#0b1222] border border-[#18233c] rounded-2xl p-5 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white">SNN Layer Hyperparameters</h3>

          <div className="space-y-3.5 text-xs">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-slate-300">Hidden Units</span>
                <span className="font-mono text-cyan-400 font-bold">{snnNeurons}</span>
              </div>
              <input
                type="range"
                min="32"
                max="256"
                step="16"
                value={snnNeurons}
                onChange={(e) => setSnnNeurons(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-slate-300">Membrane Time Constant (τ_m)</span>
                <span className="font-mono text-slate-200">{membraneTimeConstant} ms</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="2.0"
                step="0.1"
                value={membraneTimeConstant}
                disabled
                className="w-full opacity-60"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-slate-300">Synaptic Decay (τ_s)</span>
                <span className="font-mono text-slate-200">{synapticDecay} ms</span>
              </div>
              <input
                type="range"
                min="1"
                max="15"
                step="0.5"
                value={synapticDecay}
                disabled
                className="w-full opacity-60"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
