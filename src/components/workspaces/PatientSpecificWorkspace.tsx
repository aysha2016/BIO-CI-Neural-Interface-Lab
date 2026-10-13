import React, { useState } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { Tooltip } from '../ui/Tooltip';
import { UserCheck, ShieldAlert, Sparkles, ArrowRight, Layers, Cpu } from 'lucide-react';

export const PatientSpecificWorkspace: React.FC = () => {
  const {
    neuralSurvival,
    setNeuralSurvival,
    impedance,
    setImpedance,
    selectedElectrode,
    amplitude,
    metrics,
  } = useSimulation();

  const [insertionDepth, setInsertionDepth] = useState(420); // degrees
  const [scalarPlacement, setScalarPlacement] = useState<'scala_tympani' | 'translocated'>(
    'scala_tympani'
  );
  const [modiolarDistance, setModiolarDistance] = useState(0.45); // mm
  const [fiberDensityGradient, setFiberDensityGradient] = useState<'basal_drop' | 'uniform' | 'patchy'>(
    'basal_drop'
  );

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Title & Important Research Disclaimer Banner */}
      <div className="bg-[#0b1222] border border-[#18233c] rounded-2xl p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-500/40 flex items-center gap-1">
              <ShieldAlert className="w-3 h-3 text-amber-400" />
              NON-CLINICAL CONCEPT PROTOTYPE
            </span>
          </div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-cyan-400" />
            Conceptual Patient-Specific Research Model
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Demonstrates parameterization of patient CT/MRI anatomy, scalar insertion trajectory, and residual spiral ganglion survival.
          </p>
        </div>

        {/* Mandatory Non-Clinical Label */}
        <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 max-w-sm text-xs text-amber-200/90 leading-tight">
          <strong>Research Simulation Only:</strong> This module is an academic engineering demonstration of personalized parameterization. It does not provide clinical diagnostic or surgical predictions.
        </div>
      </div>

      {/* Conceptual 3-Step Pipeline Card */}
      <div className="bg-[#0b1222] border border-[#18233c] rounded-2xl p-5 shadow-xl">
        <h3 className="text-sm font-bold text-white mb-3">
          Conceptual Parameterization Architecture
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-[#090f1d] border border-[#18233c] space-y-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-xs">
              01
            </div>
            <h4 className="text-xs font-bold text-white">Generic Cochlear Template</h4>
            <p className="text-[11px] text-slate-400 leading-tight">
              Standardized logarithmic 2.5-turn cochlea with uniform perilymph conductivity and homogeneous nerve spacing.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#090f1d] border border-cyan-500/40 space-y-2 shadow-[0_0_12px_rgba(6,182,212,0.1)]">
            <div className="w-7 h-7 rounded-lg bg-cyan-600/20 text-cyan-400 flex items-center justify-center font-bold text-xs">
              02
            </div>
            <h4 className="text-xs font-bold text-cyan-300">Patient-Specific Parameterization</h4>
            <p className="text-[11px] text-slate-300 leading-tight">
              Calibrated insertion angle ({insertionDepth}°), modiolar proximity ({modiolarDistance} mm), and spiral ganglion survival ({neuralSurvival}%).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#090f1d] border border-purple-500/40 space-y-2 shadow-[0_0_12px_rgba(168,85,247,0.1)]">
            <div className="w-7 h-7 rounded-lg bg-purple-600/20 text-purple-400 flex items-center justify-center font-bold text-xs">
              03
            </div>
            <h4 className="text-xs font-bold text-purple-300">Personalized Neural Activation</h4>
            <p className="text-[11px] text-slate-300 leading-tight">
              Simulated multi-channel recruitment tailored to individual residual neural health and electrode-modiolar gap.
            </p>
          </div>
        </div>
      </div>

      {/* Patient Parameters Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 bg-[#0b1222] border border-[#18233c] rounded-2xl p-5 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white">Anatomical & Surgical Parameters</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Insertion Depth Angle */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-slate-300">Array Insertion Angle</span>
                <span className="font-mono text-cyan-400 font-bold">{insertionDepth}° (~2.3 turns)</span>
              </div>
              <input
                type="range"
                min="300"
                max="540"
                step="10"
                value={insertionDepth}
                onChange={(e) => setInsertionDepth(Number(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Modiolar Distance */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-slate-300">Electrode-Modiolar Gap</span>
                <span className="font-mono text-cyan-400 font-bold">{modiolarDistance} mm</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="1.2"
                step="0.05"
                value={modiolarDistance}
                onChange={(e) => setModiolarDistance(Number(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Residual Neural Survival */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-slate-300">SGC Neural Survival</span>
                <span className="font-mono text-emerald-400 font-bold">{neuralSurvival}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={neuralSurvival}
                onChange={(e) => setNeuralSurvival(Number(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Electrode Scalar Placement */}
            <div>
              <label className="block text-slate-300 mb-1">Electrode Array Trajectory</label>
              <select
                value={scalarPlacement}
                onChange={(e) => setScalarPlacement(e.target.value as any)}
                className="w-full bg-[#111a31] border border-[#1e2f52] rounded-lg px-3 py-2 text-slate-100"
              >
                <option value="scala_tympani">Ideal Scala Tympani (Perimodiolar)</option>
                <option value="translocated">Scalar Translocation to Scala Vestibuli</option>
              </select>
            </div>
          </div>
        </div>

        {/* Future Research Roadmap Card */}
        <div className="lg:col-span-4 bg-[#0b1222] border border-[#18233c] rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Future Research Directions</span>
          </div>

          <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
            <li>Automated CT/micro-CT segmentation using 3D deep vision models.</li>
            <li>Differentiable Poisson-Nernst-Planck volume conduction solvers.</li>
            <li>Closed-loop electrically evoked compound action potential (ECAP) telemetry auto-tuning.</li>
            <li>End-to-end gradient backpropagation from acoustic loss to electrode current maps.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
