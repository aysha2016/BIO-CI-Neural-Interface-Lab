import React, { useState } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { ElectricalFieldViewer } from '../ElectricalFieldViewer';
import { Tooltip } from '../ui/Tooltip';
import { Radio, AlertCircle, Info, Sparkles, Layers } from 'lucide-react';

export const ElectricalFieldWorkspace: React.FC = () => {
  const {
    spatialSpread,
    setSpatialSpread,
    amplitude,
    setAmplitude,
    impedance,
    setImpedance,
    tissueConductivity,
    setTissueConductivity,
    selectedElectrode,
    setSelectedElectrode,
    metrics,
  } = useSimulation();

  const [fieldViewMode, setFieldViewMode] = useState<
    'Field Contour' | 'Iso-potential Lines' | 'Volume Spread'
  >('Field Contour');

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Title & Scientific Purpose Banner */}
      <div className="bg-[#0b1222] border border-[#18233c] rounded-2xl p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/40">
              BIOELECTROMAGNETICS
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-500/40">
              VOLUME CONDUCTION
            </span>
          </div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Radio className="w-5 h-5 text-cyan-400" />
            Electrical Field Visualization & Tissue Propagation
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Model Laplace volume conduction through anisotropic cochlear fluid (perilymph) and modiolus bone.
          </p>
        </div>

        {/* Scientific Purpose Badge */}
        <div className="max-w-md p-3 rounded-xl bg-[#0e1930] border border-cyan-500/30 text-xs text-slate-300">
          <div className="flex items-center gap-1.5 text-cyan-300 font-bold mb-0.5">
            <Info className="w-3.5 h-3.5" />
            <span>Scientific Purpose</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-tight">
            Demonstrates why broader current spread activates neighboring neural populations, degrading speech formant discrimination in noise.
          </p>
        </div>
      </div>

      {/* Main Grid: Field Canvas & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Electrical Field Canvas Area */}
        <div className="lg:col-span-7 h-[420px]">
          <ElectricalFieldViewer
            spatialSpread={spatialSpread}
            setSpatialSpread={setSpatialSpread}
            amplitude={amplitude}
            fieldViewMode={fieldViewMode}
            setFieldViewMode={setFieldViewMode}
          />
        </div>

        {/* Detailed Controls & Neighbor Cross-talk Analysis */}
        <div className="lg:col-span-5 bg-[#0b1222] border border-[#18233c] rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#18233c]">
            <h3 className="text-sm font-bold text-white">Tissue & Electrode Field Controls</h3>
            <span className="text-[10px] font-mono text-cyan-400">Poisson Solver</span>
          </div>

          <div className="space-y-3.5 text-xs">
            {/* Current Amplitude */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-slate-300 flex items-center">
                  Current Amplitude (I_stim)
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

            {/* Electrode Impedance */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-slate-300 flex items-center">
                  Electrode Impedance (Z)
                  <Tooltip paramKey="impedance" />
                </span>
                <span className="text-slate-100 font-mono font-bold">{impedance.toFixed(1)} kΩ</span>
              </div>
              <input
                type="range"
                min="2"
                max="18"
                step="0.1"
                value={impedance}
                onChange={(e) => setImpedance(Number(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Tissue Conductivity */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-slate-300 flex items-center">
                  Perilymph Conductivity (σ)
                  <Tooltip paramKey="tissueConductivity" />
                </span>
                <span className="text-cyan-400 font-mono font-bold">{tissueConductivity.toFixed(2)} S/m</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.5"
                step="0.05"
                value={tissueConductivity}
                onChange={(e) => setTissueConductivity(Number(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Spatial Spread Slider */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-slate-300 flex items-center">
                  Current Spread (Tripolar to Monopolar)
                  <Tooltip paramKey="spatialSpread" />
                </span>
                <span className="text-cyan-400 font-mono font-bold">{spatialSpread}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="90"
                value={spatialSpread}
                onChange={(e) => setSpatialSpread(Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>

          {/* Neighbor Cross-talk Metric Panel */}
          <div className="p-3 bg-[#0d1629] border border-[#1b2b4d] rounded-xl space-y-2 text-xs">
            <div className="font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Channel Isolation & Neighboring Crosstalk</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 rounded bg-[#090f1d] border border-[#16233e]">
                <span className="text-slate-400 block">Spread Radius:</span>
                <span className="font-mono font-bold text-cyan-300">{metrics.estimatedSpread} mm</span>
              </div>
              <div className="p-2 rounded bg-[#090f1d] border border-[#16233e]">
                <span className="text-slate-400 block">Neural Selectivity:</span>
                <span className="font-mono font-bold text-emerald-400">{metrics.neuralSelectivity}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
