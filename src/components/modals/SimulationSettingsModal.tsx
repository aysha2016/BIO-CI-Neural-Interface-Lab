import React, { useState } from 'react';
import { X, Settings, Sliders, Check, Cpu, Zap, Activity } from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

interface SimulationSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SimulationSettingsModal: React.FC<SimulationSettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { settings, updateSettings, numFibers, setNumFibers } = useSimulation();
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#0b1324] border border-[#23355e] rounded-2xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#152342] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Simulation Engine Settings</h3>
            <p className="text-xs text-slate-400">Numerical solver parameters and compute pipeline</p>
          </div>
        </div>

        <div className="space-y-4 text-xs text-slate-300">
          {/* Numerical Solvers */}
          <div className="space-y-3 p-3 bg-[#090f1e] rounded-xl border border-[#16233e]">
            <span className="font-bold text-cyan-300 block">Solver & Numerical Time Step</span>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">Time Step Resolution (dt)</label>
                <select
                  value={settings.dt}
                  onChange={(e) => updateSettings({ dt: Number(e.target.value) })}
                  className="w-full bg-[#111a31] border border-[#1e2f52] rounded-lg px-2.5 py-1.5 text-slate-100 font-mono"
                >
                  <option value={5}>5 µs (High Precision RK4)</option>
                  <option value={10}>10 µs (Standard Hodgkin-Huxley)</option>
                  <option value={25}>25 µs (Fast Preview)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Random Seed</label>
                <input
                  type="number"
                  value={settings.randomSeed}
                  onChange={(e) => updateSettings({ randomSeed: Number(e.target.value) })}
                  className="w-full bg-[#111a31] border border-[#1e2f52] rounded-lg px-2.5 py-1.5 text-slate-100 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Graphics & Frame Rate */}
          <div className="space-y-3 p-3 bg-[#090f1e] rounded-xl border border-[#16233e]">
            <span className="font-bold text-cyan-300 block">Visualization & Rendering</span>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">Frame Rate Limit</label>
                <select
                  value={settings.frameRate}
                  onChange={(e) => updateSettings({ frameRate: Number(e.target.value) })}
                  className="w-full bg-[#111a31] border border-[#1e2f52] rounded-lg px-2.5 py-1.5 text-slate-100 font-mono"
                >
                  <option value={60}>60 FPS (Smooth)</option>
                  <option value={30}>30 FPS (Power Saver)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Quality Preset</label>
                <select
                  value={settings.visualizationQuality}
                  onChange={(e) => updateSettings({ visualizationQuality: e.target.value as any })}
                  className="w-full bg-[#111a31] border border-[#1e2f52] rounded-lg px-2.5 py-1.5 text-slate-100"
                >
                  <option value="Standard">Standard Quality</option>
                  <option value="High">High Quality (Anti-aliased)</option>
                  <option value="Ultra">Ultra Volumetric Bloom</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span>Chart Curve Smoothing (Bezier Interpolation)</span>
              <button
                onClick={() => updateSettings({ chartSmoothing: !settings.chartSmoothing })}
                className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                  settings.chartSmoothing ? 'bg-cyan-500 justify-end' : 'bg-slate-700 justify-start'
                }`}
              >
                <span className="w-4 h-4 rounded-full bg-white shadow-sm" />
              </button>
            </div>
          </div>

          {/* Advanced Toggles */}
          <div className="space-y-2.5 p-3 bg-[#090f1e] rounded-xl border border-[#16233e]">
            <span className="font-bold text-cyan-300 block">Advanced Computational Engines</span>

            <div className="flex items-center justify-between p-1.5 rounded-lg bg-[#0d1629]">
              <span className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-purple-400" />
                Enable GPU Hardware Acceleration (WebGL / WebGPU)
              </span>
              <button
                onClick={() => updateSettings({ enableGpuSimulation: !settings.enableGpuSimulation })}
                className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                  settings.enableGpuSimulation ? 'bg-cyan-500 justify-end' : 'bg-slate-700 justify-start'
                }`}
              >
                <span className="w-4 h-4 rounded-full bg-white shadow-sm" />
              </button>
            </div>

            <div className="flex items-center justify-between p-1.5 rounded-lg bg-[#0d1629]">
              <span className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                Enable Stochastic Ion-Channel Gating Noise
              </span>
              <button
                onClick={() =>
                  updateSettings({
                    enableStochasticActivity: !settings.enableStochasticActivity,
                  })
                }
                className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                  settings.enableStochasticActivity ? 'bg-cyan-500 justify-end' : 'bg-slate-700 justify-start'
                }`}
              >
                <span className="w-4 h-4 rounded-full bg-white shadow-sm" />
              </button>
            </div>

            <div className="flex items-center justify-between p-1.5 rounded-lg bg-[#0d1629]">
              <span className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                Enable Adaptive Neuron Forward-Masking Model
              </span>
              <button
                onClick={() =>
                  updateSettings({
                    enableAdaptiveNeuron: !settings.enableAdaptiveNeuron,
                  })
                }
                className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                  settings.enableAdaptiveNeuron ? 'bg-cyan-500 justify-end' : 'bg-slate-700 justify-start'
                }`}
              >
                <span className="w-4 h-4 rounded-full bg-white shadow-sm" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            {saved ? <Check className="w-4 h-4" /> : null}
            <span>{saved ? 'Saved!' : 'Save & Apply'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
