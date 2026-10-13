import React, { useState } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { Tooltip } from '../ui/Tooltip';
import { Users, BarChart2, PieChart, Activity } from 'lucide-react';

export const FiberPopulationWorkspace: React.FC = () => {
  const {
    numFibers,
    fiberHeterogeneity,
    setFiberHeterogeneity,
    neuralSurvival,
    setNeuralSurvival,
    amplitude,
    spatialSpread,
    metrics,
  } = useSimulation();

  const [popMode, setPopMode] = useState<'homogeneous' | 'heterogeneous'>('heterogeneous');

  // Compute statistics
  const isHomogeneous = popMode === 'homogeneous';
  const meanThreshold = 340;
  const stdDevThreshold = isHomogeneous ? 5 : Math.round(45 * (fiberHeterogeneity / 0.35));
  const meanLatency = 1.05;
  const stdDevLatency = isHomogeneous ? 0.02 : 0.22;
  const activatedPercent = Math.min(
    100,
    Math.round(((metrics.nearbyFibers / numFibers) * 100))
  );

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Title & Mode Switch Banner */}
      <div className="bg-[#0b1222] border border-[#18233c] rounded-2xl p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-500/40">
              POPULATION BIOPHYSICS
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/40">
              STOCHASTIC DISTRIBUTIONS
            </span>
          </div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-400" />
            Auditory Nerve Fiber Population Dynamics
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Evaluate how heterogeneous axon diameters, spontaneous rate classes (high/medium/low-SR), and spatial dispersion alter dynamic range.
          </p>
        </div>

        {/* Population Mode Selector */}
        <div className="flex items-center gap-1.5 bg-[#101a30] p-1.5 rounded-xl border border-[#1e2f4f]">
          <button
            onClick={() => setPopMode('homogeneous')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              popMode === 'homogeneous'
                ? 'bg-indigo-600 text-white shadow-[0_0_12px_rgba(99,102,241,0.4)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Homogeneous
          </button>
          <button
            onClick={() => setPopMode('heterogeneous')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              popMode === 'heterogeneous'
                ? 'bg-cyan-600 text-white shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Heterogeneous
          </button>
        </div>
      </div>

      {/* Population Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#0b1222] border border-[#18233c] rounded-2xl p-4 shadow-md">
          <span className="text-[10.5px] text-slate-400">Mean AP Threshold</span>
          <div className="text-xl font-bold font-mono text-cyan-400 mt-0.5">
            {meanThreshold} µA
          </div>
          <span className="text-[10px] text-slate-500">Std Dev: ±{stdDevThreshold} µA</span>
        </div>

        <div className="bg-[#0b1222] border border-[#18233c] rounded-2xl p-4 shadow-md">
          <span className="text-[10.5px] text-slate-400">Mean Conduction Latency</span>
          <div className="text-xl font-bold font-mono text-purple-400 mt-0.5">
            {meanLatency} ms
          </div>
          <span className="text-[10px] text-slate-500">Std Dev: ±{stdDevLatency} ms</span>
        </div>

        <div className="bg-[#0b1222] border border-[#18233c] rounded-2xl p-4 shadow-md">
          <span className="text-[10.5px] text-slate-400">Population Recruitment</span>
          <div className="text-xl font-bold font-mono text-emerald-400 mt-0.5">
            {activatedPercent}%
          </div>
          <span className="text-[10px] text-slate-500">
            {metrics.nearbyFibers} of {numFibers} fibers
          </span>
        </div>

        <div className="bg-[#0b1222] border border-[#18233c] rounded-2xl p-4 shadow-md">
          <span className="text-[10.5px] text-slate-400">Neural Survival Density</span>
          <div className="text-xl font-bold font-mono text-white mt-0.5">
            {neuralSurvival}%
          </div>
          <span className="text-[10px] text-slate-500">Viable spiral ganglion somas</span>
        </div>
      </div>

      {/* Histograms & Distributions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Threshold Distribution Histogram */}
        <div className="bg-[#0b1222] border border-[#18233c] rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-cyan-400" />
              Threshold Distribution Histogram
            </h3>
            <span className="text-[10px] font-mono text-slate-400">
              {popMode === 'homogeneous' ? 'Narrow Gaussian' : 'Broad Gaussian'}
            </span>
          </div>

          <div className="h-44 w-full flex items-end justify-between gap-1.5 px-3 pb-2 bg-[#060a15] rounded-xl border border-[#18233c]">
            {[240, 270, 300, 330, 360, 390, 420, 450, 480].map((th) => {
              const distFromMean = Math.abs(th - meanThreshold);
              const heightPercent = isHomogeneous
                ? distFromMean <= 30
                  ? 95 - distFromMean * 2
                  : 4
                : Math.max(8, Math.round(90 * Math.exp(-Math.pow(distFromMean / stdDevThreshold, 2))));

              return (
                <div key={th} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                  <div
                    className="w-full rounded-t bg-gradient-to-t from-indigo-700 to-cyan-400 transition-all"
                    style={{ height: `${heightPercent}%` }}
                  />
                  <span className="text-[9px] font-mono text-slate-400">{th}µA</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Latency Distribution Histogram */}
        <div className="bg-[#0b1222] border border-[#18233c] rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-purple-400" />
              Axon Conduction Latency Distribution
            </h3>
            <span className="text-[10px] font-mono text-slate-400">Myelinated Axon Jitter</span>
          </div>

          <div className="h-44 w-full flex items-end justify-between gap-1.5 px-3 pb-2 bg-[#060a15] rounded-xl border border-[#18233c]">
            {[0.6, 0.8, 1.0, 1.2, 1.4, 1.6, 1.8].map((lat) => {
              const dist = Math.abs(lat - meanLatency);
              const heightPercent = isHomogeneous
                ? dist <= 0.1
                  ? 92
                  : 5
                : Math.max(6, Math.round(92 * Math.exp(-Math.pow(dist / stdDevLatency, 2))));

              return (
                <div key={lat} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                  <div
                    className="w-full rounded-t bg-gradient-to-t from-purple-700 to-pink-400 transition-all"
                    style={{ height: `${heightPercent}%` }}
                  />
                  <span className="text-[9px] font-mono text-slate-400">{lat}ms</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
