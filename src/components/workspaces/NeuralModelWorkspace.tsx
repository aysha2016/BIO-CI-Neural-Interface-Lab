import React, { useRef, useEffect } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { Tooltip } from '../ui/Tooltip';
import { Brain, Zap, Activity, Info } from 'lucide-react';

export const NeuralModelWorkspace: React.FC = () => {
  const {
    modelType,
    setModelType,
    membranePotential,
    setMembranePotential,
    threshold,
    setThreshold,
    membraneTimeConstant,
    setMembraneTimeConstant,
    refractoryDuration,
    setRefractoryDuration,
    adaptationStrength,
    setAdaptationStrength,
    recoveryRate,
    setRecoveryRate,
    synapticDecay,
    setSynapticDecay,
    amplitude,
    pulseRate,
  } = useSimulation();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Live simulation of membrane potential trace over 20 ms
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    if (!width || !height || width <= 0 || height <= 0) {
      return;
    }

    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
    }

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = '#060a15';
    ctx.fillRect(0, 0, width, height);

    const marginLeft = 50;
    const marginRight = 20;
    const marginTop = 20;
    const marginBottom = 30;
    const plotW = width - marginLeft - marginRight;
    const plotH = height - marginTop - marginBottom;

    // Voltage range: -90 mV to +40 mV
    const vMin = -90;
    const vMax = 40;
    const vToY = (v: number) => marginTop + plotH - ((v - vMin) / (vMax - vMin)) * plotH;
    const tToX = (t: number) => marginLeft + (t / 20) * plotW;

    // Voltage Gridlines
    const vGrid = [-80, -70, -55, 0, 30];
    ctx.strokeStyle = 'rgba(30, 41, 59, 0.6)';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 4]);

    ctx.font = '10px JetBrains Mono, monospace';
    ctx.fillStyle = '#64748b';
    ctx.textAlign = 'right';

    vGrid.forEach((v) => {
      const y = vToY(v);
      ctx.beginPath();
      ctx.moveTo(marginLeft, y);
      ctx.lineTo(marginLeft + plotW, y);
      ctx.stroke();

      let label = `${v} mV`;
      if (v === -70) label += ' (Rest)';
      if (v === threshold) label += ' (Thresh)';
      ctx.fillText(label, marginLeft - 6, y + 3);
    });

    // Time ticks (0..20 ms)
    for (let t = 0; t <= 20; t += 5) {
      const x = tToX(t);
      ctx.beginPath();
      ctx.moveTo(x, marginTop);
      ctx.lineTo(x, marginTop + plotH);
      ctx.stroke();
      ctx.textAlign = 'center';
      ctx.fillText(`${t} ms`, x, height - 10);
    }

    ctx.setLineDash([]);

    // Draw Threshold reference line
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.6)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(marginLeft, vToY(threshold));
    ctx.lineTo(marginLeft + plotW, vToY(threshold));
    ctx.stroke();

    // Generate simulated membrane voltage curve
    const dt = 0.05; // ms
    const points: { x: number; y: number }[] = [];
    let v = membranePotential;
    let w = 0; // adaptation variable
    let lastSpikeTime = -100;

    // Stimulus pulse times
    const pulsePeriod = 1000 / pulseRate;
    const stimTimes = [2.0, 2.0 + pulsePeriod, 2.0 + 2 * pulsePeriod, 2.0 + 3 * pulsePeriod].filter(
      (t) => t < 20
    );

    for (let t = 0; t <= 20; t += dt) {
      const timeSinceSpike = t - lastSpikeTime;
      const isAbsoluteRefractory = timeSinceSpike < 0.7;

      // Check external stimulation current
      let iStim = 0;
      stimTimes.forEach((st) => {
        if (t >= st && t < st + 0.1) {
          iStim = (amplitude / 450) * 45;
        }
      });

      if (isAbsoluteRefractory) {
        v = -85; // deep hyperpolarization
      } else {
        // Subthreshold membrane dynamics
        const dv =
          (-(v - membranePotential) - w + iStim) /
          (membraneTimeConstant * (modelType === 'biological' ? 1.2 : 1.0));
        v += dv * dt;

        // Adaptation variable update
        if (modelType === 'adaptive') {
          const dw = (adaptationStrength * (v - membranePotential) - w) / recoveryRate;
          w += dw * dt;
        }

        // Spike detection
        if (v >= threshold) {
          points.push({ x: tToX(t), y: vToY(30) }); // action potential peak
          lastSpikeTime = t;
          v = -85; // reset
          if (modelType === 'adaptive') {
            w += adaptationStrength * 10;
          }
        }
      }

      points.push({ x: tToX(t), y: vToY(Math.max(-88, Math.min(35, v))) });
    }

    // Draw membrane trace
    if (points.length > 0) {
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      points.forEach((p) => ctx.lineTo(p.x, p.y));
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.shadowColor = 'rgba(56, 189, 248, 0.6)';
      ctx.shadowBlur = 8;
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    ctx.restore();
  }, [
    modelType,
    membranePotential,
    threshold,
    membraneTimeConstant,
    refractoryDuration,
    adaptationStrength,
    recoveryRate,
    amplitude,
    pulseRate,
  ]);

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Title & Research Question Banner */}
      <div className="bg-[#0b1222] border border-[#18233c] rounded-2xl p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/40">
              RESEARCH WORKSPACE
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-950 text-blue-300 border border-blue-500/40">
              SIMULATION
            </span>
          </div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Brain className="w-5 h-5 text-cyan-400" />
            Auditory Nerve Neural Model
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Evaluate biophysical differences between simplified point neurons and adaptive multi-compartment dynamics.
          </p>
        </div>

        {/* Model Type Selector */}
        <div className="flex items-center gap-1.5 bg-[#101a30] p-1.5 rounded-xl border border-[#1e2f4f]">
          {(['simplified', 'biological', 'adaptive'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setModelType(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                modelType === type
                  ? 'bg-cyan-600 text-white shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {type === 'simplified' && 'Simplified Point'}
              {type === 'biological' && 'Biologically Inspired'}
              {type === 'adaptive' && 'Adaptive Spiking'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Voltage Canvas & Parameters */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Voltage Trace Canvas */}
        <div className="lg:col-span-8 bg-[#0b1222] border border-[#18233c] rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  Membrane Potential Response ($V_m(t)$)
                </h3>
                <p className="text-xs text-slate-400">
                  Subthreshold electrotonus, regenerative spike discharge, and refractory recovery.
                </p>
              </div>

              {/* Status indicators */}
              <div className="flex items-center gap-3 text-[11px] text-slate-300">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(56,189,248,0.8)]" />
                  Voltage Trace
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  Threshold ({threshold} mV)
                </span>
              </div>
            </div>

            <div className="h-64 bg-[#060a15] rounded-xl overflow-hidden border border-[#18233c]">
              <canvas ref={canvasRef} className="w-full h-full block" />
            </div>
          </div>

          {/* Model Mathematical Equation Box */}
          <div className="mt-4 p-3.5 bg-[#090f1e] border border-[#1a2948] rounded-xl text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-cyan-300 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-yellow-400" />
                Model Governing Differential Equation:
              </span>
              <span className="text-[10px] text-slate-500">
                Computational demonstration (non-clinical)
              </span>
            </div>

            {modelType === 'simplified' && (
              <div className="font-mono bg-[#060a14] p-2 rounded text-cyan-300 text-center border border-[#14203a]">
                τ_m · (dV/dt) = -(V - V_rest) + R_m · I_stim(t), &nbsp; if V ≥ V_th → Spike & V ← V_reset
              </div>
            )}
            {modelType === 'biological' && (
              <div className="font-mono bg-[#060a14] p-2 rounded text-cyan-300 text-center border border-[#14203a]">
                C_m · (dV/dt) = -g_Na·m³h·(V - E_Na) - g_K·n⁴·(V - E_K) - g_L·(V - E_L) + I_stim(t)
              </div>
            )}
            {modelType === 'adaptive' && (
              <div className="font-mono bg-[#060a14] p-2 rounded text-cyan-300 text-center border border-[#14203a]">
                τ_m · (dV/dt) = -(V - V_rest) - w(t) + I_stim(t), &nbsp; τ_w · (dw/dt) = a·(V - V_rest) - w
              </div>
            )}
          </div>
        </div>

        {/* Neural Parameters Sliders */}
        <div className="lg:col-span-4 bg-[#0b1222] border border-[#18233c] rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#18233c]">
            <h3 className="text-sm font-bold text-white">Neural Biophysics Parameters</h3>
            <span className="text-[10px] text-cyan-400 font-mono">Live Sync</span>
          </div>

          <div className="space-y-3.5 text-xs">
            {/* Resting Potential */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-slate-300 flex items-center">
                  Resting Potential
                  <Tooltip paramKey="threshold" />
                </span>
                <span className="text-slate-100 font-mono font-semibold">{membranePotential} mV</span>
              </div>
              <input
                type="range"
                min="-85"
                max="-60"
                value={membranePotential}
                onChange={(e) => setMembranePotential(Number(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Threshold */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-slate-300 flex items-center">
                  Spike Threshold
                  <Tooltip paramKey="threshold" />
                </span>
                <span className="text-rose-400 font-mono font-bold">{threshold} mV</span>
              </div>
              <input
                type="range"
                min="-65"
                max="-40"
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Membrane Time Constant */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-slate-300 flex items-center">
                  Membrane Time Constant (τ_m)
                  <Tooltip paramKey="membraneTimeConstant" />
                </span>
                <span className="text-slate-100 font-mono font-semibold">{membraneTimeConstant} ms</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.5"
                step="0.05"
                value={membraneTimeConstant}
                onChange={(e) => setMembraneTimeConstant(Number(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Refractory Duration */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-slate-300 flex items-center">
                  Refractory Period (ARP + RRP)
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

            {/* Adaptation Strength */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-slate-300 flex items-center">
                  Adaptation Strength
                  <Tooltip paramKey="adaptationStrength" />
                </span>
                <span className="text-slate-100 font-mono font-semibold">{adaptationStrength}</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.05"
                value={adaptationStrength}
                onChange={(e) => setAdaptationStrength(Number(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Recovery Rate */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-slate-300 flex items-center">
                  Recovery Rate
                  <Tooltip paramKey="recoveryRate" />
                </span>
                <span className="text-slate-100 font-mono font-semibold">{recoveryRate} ms</span>
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

            {/* Synaptic Decay */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-slate-300 flex items-center">
                  Synaptic Decay
                  <Tooltip paramKey="membraneTimeConstant" />
                </span>
                <span className="text-slate-100 font-mono font-semibold">{synapticDecay} ms</span>
              </div>
              <input
                type="range"
                min="1"
                max="15"
                step="0.5"
                value={synapticDecay}
                onChange={(e) => setSynapticDecay(Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
