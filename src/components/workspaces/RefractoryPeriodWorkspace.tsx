import React, { useState } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { Tooltip } from '../ui/Tooltip';
import { Timer, Zap, CheckCircle2, XCircle, ArrowRight, Activity } from 'lucide-react';

export const RefractoryPeriodWorkspace: React.FC = () => {
  const {
    pulseRate,
    setPulseRate,
    refractoryDuration,
    setRefractoryDuration,
    amplitude,
    setAmplitude,
    metrics,
  } = useSimulation();

  const [pulseInterval, setPulseInterval] = useState(1.1); // ms

  // Calculate entrainment and firing probability under refractoriness
  const pulsePeriod = 1000 / pulseRate; // ms between pulses
  const arp = 0.7; // absolute refractory period in ms
  const rrp = Math.max(0.5, refractoryDuration - arp); // relative refractory period in ms

  // Without refractory: fires on every pulse if above threshold
  const probWithoutRefr = 100;
  // With refractory: if pulsePeriod < ARP, fires on at most 1 / ceil(ARP/pulsePeriod) pulses
  const probWithRefr = Math.round(
    Math.min(100, Math.max(15, (pulsePeriod / (arp + rrp * 0.5)) * 90))
  );

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Title & Research Question Banner */}
      <div className="bg-[#0b1222] border border-[#18233c] rounded-2xl p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-950 text-purple-300 border border-purple-500/40">
              TEMPORAL DYNAMICS
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/40">
              EXPERIMENT
            </span>
          </div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Timer className="w-5 h-5 text-purple-400" />
            Neural Refractory Period Experiment
          </h2>
          <div className="mt-1 text-xs">
            <span className="text-slate-400 font-semibold">Research Question: </span>
            <span className="text-cyan-300 font-medium">
              “How does refractory behavior change temporal neural coding?”
            </span>
          </div>
        </div>

        {/* Temporal Fidelity Status */}
        <div className="p-3 rounded-xl bg-[#0e1930] border border-purple-500/30 text-xs text-slate-300">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider">
            Simulated Temporal Precision:
          </div>
          <div className="text-sm font-bold font-mono text-purple-300">
            {metrics.spikeTimingPrecision} ms (Jitter)
          </div>
        </div>
      </div>

      {/* Side-by-Side Comparison: Without vs With Refractory Period */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* WITHOUT Refractory Card */}
        <div className="bg-[#0b1222] border border-rose-500/30 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-rose-400 flex items-center gap-2">
              <XCircle className="w-4 h-4 text-rose-500" />
              WITHOUT Refractory Period (Simplified Model)
            </h3>
            <span className="text-[10px] text-rose-300 font-mono">100% Entrainment</span>
          </div>
          <p className="text-xs text-slate-400">
            Artificial assumption: The neuron can fire indefinitely on every stimulus pulse with zero recovery delay.
          </p>

          {/* Pulse -> Spike Flow Visual */}
          <div className="p-3 bg-[#080d19] rounded-xl border border-[#1b263b] flex items-center justify-around text-xs font-mono">
            <div className="text-center">
              <span className="text-cyan-400 block font-bold">Pulse</span>
              <span className="text-[10px] text-slate-500">Stimulus</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
            <div className="text-center">
              <span className="text-emerald-400 block font-bold">Spike</span>
              <span className="text-[10px] text-slate-500">AP fired</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
            <div className="text-center">
              <span className="text-cyan-400 block font-bold">Pulse</span>
              <span className="text-[10px] text-slate-500">Stimulus</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
            <div className="text-center">
              <span className="text-emerald-400 block font-bold">Spike</span>
              <span className="text-[10px] text-slate-500">AP fired</span>
            </div>
          </div>

          <div className="p-2.5 bg-[#0e1628] rounded-xl text-xs flex justify-between items-center">
            <span className="text-slate-400">Spike Probability:</span>
            <span className="font-mono font-bold text-rose-400">{probWithoutRefr}%</span>
          </div>
        </div>

        {/* WITH Refractory Card */}
        <div className="bg-[#0b1222] border border-cyan-500/40 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-cyan-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              WITH Refractory Period (Biological Model)
            </h3>
            <span className="text-[10px] text-cyan-300 font-mono">Realistic Biophysics</span>
          </div>
          <p className="text-xs text-slate-400">
            Sodium channel inactivation (ARP ~0.7 ms) prevents consecutive firing, creating realistic stochastic rate suppression.
          </p>

          {/* Pulse -> Spike -> Refractory Flow Visual */}
          <div className="p-3 bg-[#080d19] rounded-xl border border-[#1b263b] flex items-center justify-around text-xs font-mono">
            <div className="text-center">
              <span className="text-cyan-400 block font-bold">Pulse</span>
              <span className="text-[10px] text-slate-500">Stimulus</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
            <div className="text-center">
              <span className="text-emerald-400 block font-bold">Spike</span>
              <span className="text-[10px] text-slate-500">AP fired</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
            <div className="text-center">
              <span className="text-purple-400 block font-bold">Refractory</span>
              <span className="text-[10px] text-slate-500">Suppressed</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
            <div className="text-center">
              <span className="text-amber-400 block font-bold">Recovery</span>
              <span className="text-[10px] text-slate-500">Elevated Thresh</span>
            </div>
          </div>

          <div className="p-2.5 bg-[#0e1628] rounded-xl text-xs flex justify-between items-center">
            <span className="text-slate-400">Spike Probability:</span>
            <span className="font-mono font-bold text-cyan-400">{probWithRefr}%</span>
          </div>
        </div>
      </div>

      {/* Experiment Controls & Inter-Spike Interval Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* ISI Distribution Chart */}
        <div className="lg:col-span-8 bg-[#0b1222] border border-[#18233c] rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white mb-1">
              Inter-Spike Interval (ISI) Histogram & Entrainment
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Pulse period is {pulsePeriod.toFixed(2)} ms. Refractory boundary imposes a hard cutoff at {refractoryDuration} ms.
            </p>

            {/* Bar chart representing ISI distribution */}
            <div className="h-44 w-full flex items-end justify-between gap-2 px-3 pb-2 bg-[#060a15] rounded-xl border border-[#18233c]">
              {[0.4, 0.8, 1.2, 1.6, 2.0, 2.4, 2.8, 3.2, 3.6, 4.0].map((bin, i) => {
                // If bin is less than ARP, height is near 0
                const isBlocked = bin < arp;
                const heightPercent = isBlocked
                  ? 2
                  : Math.max(8, Math.round(100 * Math.exp(-Math.pow((bin - Math.max(refractoryDuration, pulsePeriod)) / 0.8, 2))));
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                    <div
                      className={`w-full rounded-t transition-all ${
                        isBlocked
                          ? 'bg-rose-900/40 border-t border-rose-500'
                          : 'bg-gradient-to-t from-purple-700 to-cyan-400'
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    />
                    <span className="text-[9px] font-mono text-slate-400">{bin}ms</span>
                  </div>
                );
              })}
            </div>
            <div className="text-center text-[10px] text-slate-500 mt-2">
              Inter-Spike Interval (ms) — Red zone indicates absolute refractory suppression
            </div>
          </div>
        </div>

        {/* Experiment Controls */}
        <div className="lg:col-span-4 bg-[#0b1222] border border-[#18233c] rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#18233c]">
            <h3 className="text-sm font-bold text-white">Stimulation Controls</h3>
            <span className="text-[10px] text-purple-400 font-mono">Refractory Lab</span>
          </div>

          <div className="space-y-3.5 text-xs">
            {/* Pulse Rate */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-slate-300 flex items-center">
                  Pulse Rate
                  <Tooltip paramKey="pulseRate" />
                </span>
                <span className="text-cyan-400 font-mono font-bold">{pulseRate} pps</span>
              </div>
              <input
                type="range"
                min="200"
                max="2400"
                step="50"
                value={pulseRate}
                onChange={(e) => setPulseRate(Number(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Refractory Duration */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-slate-300 flex items-center">
                  Refractory Duration (ARP + RRP)
                  <Tooltip paramKey="refractoryDuration" />
                </span>
                <span className="text-purple-400 font-mono font-bold">{refractoryDuration} ms</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="4.0"
                step="0.1"
                value={refractoryDuration}
                onChange={(e) => setRefractoryDuration(Number(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Stimulus Amplitude */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-slate-300 flex items-center">
                  Stimulus Amplitude
                  <Tooltip paramKey="amplitude" />
                </span>
                <span className="text-slate-100 font-mono font-bold">{amplitude} µA</span>
              </div>
              <input
                type="range"
                min="100"
                max="900"
                step="10"
                value={amplitude}
                onChange={(e) => setAmplitude(Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
