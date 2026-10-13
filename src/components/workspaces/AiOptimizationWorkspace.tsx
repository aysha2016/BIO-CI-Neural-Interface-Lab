import React, { useState, useEffect } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { Tooltip } from '../ui/Tooltip';
import { Sparkles, Play, Pause, RefreshCw, CheckCircle2, TrendingUp, Cpu, Award } from 'lucide-react';

export const AiOptimizationWorkspace: React.FC = () => {
  const {
    amplitude,
    setAmplitude,
    spatialSpread,
    setSpatialSpread,
    pulseWidth,
    setPulseWidth,
    pulseRate,
    setPulseRate,
    selectedElectrode,
    metrics,
  } = useSimulation();

  const [optMethod, setOptMethod] = useState<
    'Bayesian' | 'Multi-objective Pareto' | 'Grid Search' | 'Gradient'
  >('Multi-objective Pareto');
  const [isRunning, setIsRunning] = useState(false);
  const [iteration, setIteration] = useState(24);
  const [bestConfig, setBestConfig] = useState({
    amplitude: 420,
    spatialSpread: 28,
    pulseWidth: 25,
    pulseRate: 900,
    score: 0.89,
  });

  // Animated optimization loop
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning) {
      timer = setInterval(() => {
        setIteration((it) => it + 1);
        // Perturb towards optimal values
        setBestConfig((prev) => ({
          amplitude: Math.max(380, Math.min(500, prev.amplitude + (Math.random() - 0.5) * 15)),
          spatialSpread: Math.max(22, Math.min(38, prev.spatialSpread + (Math.random() - 0.5) * 4)),
          pulseWidth: 25,
          pulseRate: 900,
          score: Math.min(0.96, Number((prev.score + 0.003).toFixed(3))),
        }));
      }, 350);
    }
    return () => clearInterval(timer);
  }, [isRunning]);

  const handleApplyBest = () => {
    setAmplitude(Math.round(bestConfig.amplitude));
    setSpatialSpread(Math.round(bestConfig.spatialSpread));
    setPulseWidth(bestConfig.pulseWidth);
    setPulseRate(bestConfig.pulseRate);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Title & Banner */}
      <div className="bg-[#0b1222] border border-[#18233c] rounded-2xl p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/40">
              ALGORITHMIC SEARCH
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-500/40">
              PARETO OPTIMIZATION
            </span>
          </div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            AI-Optimized Neural Stimulation
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Computationally optimize current amplitude, pulse rate, and tripolar steering to maximize neural selectivity while minimizing energy consumption.
          </p>
        </div>

        {/* Start / Pause Run Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-lg ${
              isRunning
                ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-900/40'
                : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-900/40'
            }`}
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isRunning ? 'Pause Optimizer' : 'Run AI Optimization'}</span>
          </button>
        </div>
      </div>

      {/* Objectives Strip */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-[#09152b] border border-cyan-500/30 space-y-1">
          <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            Maximization Objectives:
          </span>
          <p className="text-[11px] text-slate-300">
            • Neural Selectivity (focused spatial tonotopy) &nbsp; • Temporal Fidelity (phase-locking) &nbsp; • Speech Representation
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#130f28] border border-purple-500/30 space-y-1">
          <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-purple-400 transform rotate-180" />
            Minimization Constraints:
          </span>
          <p className="text-[11px] text-slate-300">
            • Current Spread (unintended neighbor crosstalk) &nbsp; • Battery Energy Proxy ($Q^2$) &nbsp; • Compliance Overvoltage
          </p>
        </div>
      </div>

      {/* Pareto Frontier & Best Configuration Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Pareto Frontier Canvas / Chart */}
        <div className="lg:col-span-8 bg-[#0b1222] border border-[#18233c] rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-white">
                  Multi-Objective Pareto Frontier (Selectivity vs Power)
                </h3>
                <p className="text-xs text-slate-400">
                  Iteration: #{iteration} evaluated configurations
                </p>
              </div>

              {/* Method dropdown */}
              <select
                value={optMethod}
                onChange={(e) => setOptMethod(e.target.value as any)}
                className="bg-[#11192e] text-slate-200 text-xs font-semibold px-2.5 py-1 rounded-lg border border-[#1e2e50]"
              >
                <option value="Multi-objective Pareto">Multi-objective Pareto</option>
                <option value="Bayesian">Bayesian Search</option>
                <option value="Gradient">Gradient-based</option>
                <option value="Grid Search">Grid Search</option>
              </select>
            </div>

            {/* Pareto Scatter Plot SVG */}
            <div className="h-60 w-full bg-[#060a15] rounded-xl border border-[#18233c] p-4 relative flex items-center justify-center">
              <svg viewBox="0 0 400 200" className="w-full h-full">
                {/* Axes */}
                <line x1="40" y1="170" x2="380" y2="170" stroke="#334155" strokeWidth="1" />
                <line x1="40" y1="20" x2="40" y2="170" stroke="#334155" strokeWidth="1" />

                {/* Axis Labels */}
                <text x="210" y="192" fill="#64748b" fontSize="10" textAnchor="middle">
                  Energy Proxy (Charge per Phase, nC)
                </text>
                <text x="15" y="100" fill="#64748b" fontSize="10" transform="rotate(-90 15 100)" textAnchor="middle">
                  Neural Selectivity
                </text>

                {/* Pareto Frontier Curve */}
                <path
                  d="M 60 150 Q 140 135 200 80 T 360 35"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                  strokeDasharray="4 2"
                />

                {/* Explored Configuration dots */}
                {[
                  { x: 75, y: 155, c: '#475569' },
                  { x: 95, y: 145, c: '#475569' },
                  { x: 120, y: 130, c: '#475569' },
                  { x: 160, y: 110, c: '#64748b' },
                  { x: 180, y: 95, c: '#60a5fa' },
                  { x: 220, y: 70, c: '#38bdf8' },
                  { x: 270, y: 55, c: '#38bdf8' },
                  { x: 310, y: 45, c: '#22d3ee' },
                  { x: 350, y: 38, c: '#facc15' },
                ].map((pt, i) => (
                  <circle key={i} cx={pt.x} cy={pt.y} r="3.5" fill={pt.c} />
                ))}

                {/* Current Active Configuration Marker */}
                <circle cx="220" cy="70" r="7" fill="none" stroke="#f97316" strokeWidth="2" className="animate-ping" />
                <circle cx="220" cy="70" r="5" fill="#f97316" />
                <text x="235" y="74" fill="#f97316" fontSize="10" fontWeight="bold">
                  Current Lab State
                </text>
              </svg>
            </div>
          </div>
        </div>

        {/* Best Discovered Configuration Panel */}
        <div className="lg:col-span-4 bg-[#0b1222] border border-[#18233c] rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-2">
              <Award className="w-4 h-4" />
              <span>Optimal Discovered Profile</span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-2.5 rounded-xl bg-[#0d1629] border border-[#1b2b4d] flex justify-between items-center">
                <span className="text-slate-400">Current Amplitude:</span>
                <span className="font-mono font-bold text-cyan-300">{Math.round(bestConfig.amplitude)} µA</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#0d1629] border border-[#1b2b4d] flex justify-between items-center">
                <span className="text-slate-400">Spatial Spread:</span>
                <span className="font-mono font-bold text-emerald-400">{Math.round(bestConfig.spatialSpread)}%</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#0d1629] border border-[#1b2b4d] flex justify-between items-center">
                <span className="text-slate-400">Pulse Width:</span>
                <span className="font-mono font-bold text-white">{bestConfig.pulseWidth} µs</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#0d1629] border border-[#1b2b4d] flex justify-between items-center">
                <span className="text-slate-400">Pareto Objective Score:</span>
                <span className="font-mono font-bold text-amber-400">{bestConfig.score} / 1.0</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleApplyBest}
            className="w-full py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs rounded-xl transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] cursor-pointer flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Apply Optimal Parameters to Lab</span>
          </button>
        </div>
      </div>
    </div>
  );
};
