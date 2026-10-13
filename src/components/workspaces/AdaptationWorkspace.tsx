import React, { useState } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { Tooltip } from '../ui/Tooltip';
import { Sliders, ArrowRight, Zap, CheckCircle2, TrendingDown } from 'lucide-react';

export const AdaptationWorkspace: React.FC = () => {
  const {
    adaptationStrength,
    setAdaptationStrength,
    recoveryRate,
    setRecoveryRate,
    pulseRate,
    setPulseRate,
  } = useSimulation();

  // Generate adaptation curve data points across 0..60 ms
  const timePoints = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60];

  // Non-adaptive stays constant at ~100%
  // Adaptive drops exponentially based on adaptationStrength and recoveryRate
  const adaptiveCurve = timePoints.map((t) => {
    const decay = 1 - adaptationStrength * 0.7 * (1 - Math.exp(-t / (recoveryRate * 0.4)));
    return Math.round(decay * 100);
  });

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Title & Banner */}
      <div className="bg-[#0b1222] border border-[#18233c] rounded-2xl p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-950 text-teal-300 border border-teal-500/40">
              ION-CHANNEL KINETICS
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-950 text-blue-300 border border-blue-500/40">
              EXPERIMENT
            </span>
          </div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Sliders className="w-5 h-5 text-teal-400" />
            Neural Adaptation Laboratory
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Investigate forward masking, slow potassium channel accumulation, and spike frequency adaptation under sustained stimulation.
          </p>
        </div>

        {/* Process Flow Badge */}
        <div className="p-2.5 rounded-xl bg-[#0e1930] border border-teal-500/30 flex items-center gap-2 text-xs font-mono">
          <span className="text-teal-400 font-bold">Initial Onset</span>
          <ArrowRight className="w-3 h-3 text-slate-500" />
          <span className="text-cyan-300 font-bold">Pulse Train</span>
          <ArrowRight className="w-3 h-3 text-slate-500" />
          <span className="text-amber-400 font-bold">Adaptation</span>
          <ArrowRight className="w-3 h-3 text-slate-500" />
          <span className="text-purple-400 font-bold">Steady State</span>
        </div>
      </div>

      {/* Comparison: Non-Adaptive vs Adaptive Neuron */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Non-Adaptive */}
        <div className="bg-[#0b1222] border border-slate-700/60 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-300">
              Non-Adaptive Neuron (Phenomenological)
            </h3>
            <span className="text-xs font-mono text-slate-400">Flat Response</span>
          </div>
          <p className="text-xs text-slate-400">
            Fails to capture physiological adaptation; assumes the nerve fires with identical amplitude on pulse 100 as on pulse 1.
          </p>
          <div className="h-28 bg-[#070c18] rounded-xl p-3 flex items-center justify-center border border-[#18233c]">
            <svg viewBox="0 0 200 40" className="w-full h-full">
              <line x1="0" y1="20" x2="200" y2="20" stroke="#334155" strokeWidth="1" />
              {/* Identical height pulses */}
              {[15, 35, 55, 75, 95, 115, 135, 155, 175].map((x) => (
                <line
                  key={x}
                  x1={x}
                  y1="20"
                  x2={x}
                  y2="5"
                  stroke="#64748b"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              ))}
            </svg>
          </div>
        </div>

        {/* Adaptive */}
        <div className="bg-[#0b1222] border border-teal-500/40 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-teal-300 flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-teal-400" />
              Adaptive Neuron (BIO-CI Model)
            </h3>
            <span className="text-xs font-mono text-teal-300">Biologically Realistic</span>
          </div>
          <p className="text-xs text-slate-400">
            Slow adaptation current w(t) progressively elevates threshold, causing rapid initial decay to a sustainable steady-state plateau.
          </p>
          <div className="h-28 bg-[#070c18] rounded-xl p-3 flex items-center justify-center border border-[#18233c]">
            <svg viewBox="0 0 200 40" className="w-full h-full">
              <line x1="0" y1="20" x2="200" y2="20" stroke="#334155" strokeWidth="1" />
              {/* Decaying height pulses */}
              {[15, 35, 55, 75, 95, 115, 135, 155, 175].map((x, idx) => {
                const height = 18 * Math.exp(-idx * 0.28) + 4;
                return (
                  <line
                    key={x}
                    x1={x}
                    y1="20"
                    x2={x}
                    y2={20 - height}
                    stroke="#14b8a6"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                );
              })}
            </svg>
          </div>
        </div>
      </div>

      {/* Adaptation Response Curve Chart & Parameter Sliders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 bg-[#0b1222] border border-[#18233c] rounded-2xl p-5 shadow-xl">
          <h3 className="text-sm font-bold text-white mb-1">
            Response Amplitude vs Continuous Pulse Train Time (ms)
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            Onset firing rate decay matches mammalian auditory nerve fiber post-stimulus time histograms (PSTH).
          </p>

          <div className="h-44 w-full flex items-end justify-between gap-1.5 px-3 pb-2 bg-[#060a15] rounded-xl border border-[#18233c]">
            {timePoints.map((t, idx) => (
              <div key={t} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                <div
                  className="w-full rounded-t bg-gradient-to-t from-teal-700 to-cyan-400 transition-all shadow-[0_0_8px_rgba(20,184,166,0.3)]"
                  style={{ height: `${adaptiveCurve[idx]}%` }}
                />
                <span className="text-[9px] font-mono text-slate-400">{t}ms</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 bg-[#0b1222] border border-[#18233c] rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#18233c]">
            <h3 className="text-sm font-bold text-white">Adaptation Controls</h3>
            <span className="text-[10px] text-teal-400 font-mono">Channel Kinetics</span>
          </div>

          <div className="space-y-3.5 text-xs">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-slate-300 flex items-center">
                  Adaptation Strength
                  <Tooltip paramKey="adaptationStrength" />
                </span>
                <span className="text-teal-400 font-mono font-bold">{adaptationStrength}</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="0.9"
                step="0.05"
                value={adaptationStrength}
                onChange={(e) => setAdaptationStrength(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-slate-300 flex items-center">
                  Recovery Rate (τ_rec)
                  <Tooltip paramKey="recoveryRate" />
                </span>
                <span className="text-cyan-400 font-mono font-bold">{recoveryRate} ms</span>
              </div>
              <input
                type="range"
                min="5"
                max="80"
                step="1"
                value={recoveryRate}
                onChange={(e) => setRecoveryRate(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-slate-300 flex items-center">
                  Stimulus Pulse Rate
                  <Tooltip paramKey="pulseRate" />
                </span>
                <span className="text-slate-100 font-mono font-bold">{pulseRate} pps</span>
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
          </div>
        </div>
      </div>
    </div>
  );
};
