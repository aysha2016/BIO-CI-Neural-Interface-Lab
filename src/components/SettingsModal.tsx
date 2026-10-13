import React, { useState } from 'react';
import { X, Settings, Sliders, Check } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [solverDt, setSolverDt] = useState('10 µs');
  const [axonType, setAxonType] = useState('Type I (Myelinated Spiral Ganglion)');
  const [dielectricPerilymph, setDielectricPerilymph] = useState('1.40 S/m');
  const [channelNoise, setChannelNoise] = useState(true);
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#0b1324] border border-[#23355e] rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#152342] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Biophysical Simulation Settings</h3>
            <p className="text-xs text-slate-400">Numerical solver parameters and tissue physics</p>
          </div>
        </div>

        <div className="space-y-3.5 text-xs text-slate-300 mb-5">
          <div>
            <label className="block text-slate-400 mb-1">Time Step Resolution (dt)</label>
            <select
              value={solverDt}
              onChange={(e) => setSolverDt(e.target.value)}
              className="w-full bg-[#111a31] border border-[#1e2f52] rounded-lg px-3 py-2 text-slate-100 font-mono"
            >
              <option value="5 µs">5 µs (High Precision RK4)</option>
              <option value="10 µs">10 µs (Standard Hodgkin-Huxley)</option>
              <option value="25 µs">25 µs (Fast Preview)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Auditory Nerve Fiber Morphology</label>
            <select
              value={axonType}
              onChange={(e) => setAxonType(e.target.value)}
              className="w-full bg-[#111a31] border border-[#1e2f52] rounded-lg px-3 py-2 text-slate-100"
            >
              <option value="Type I (Myelinated Spiral Ganglion)">
                Type I (95% Population, Myelinated Spiral Ganglion)
              </option>
              <option value="Type II (Unmyelinated Outer Hair Cell)">
                Type II (5% Population, Outer Hair Cell Projections)
              </option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Perilymph Conductivity (σ)</label>
            <input
              type="text"
              value={dielectricPerilymph}
              onChange={(e) => setDielectricPerilymph(e.target.value)}
              className="w-full bg-[#111a31] border border-[#1e2f52] rounded-lg px-3 py-2 text-slate-100 font-mono"
            />
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#0d1629] border border-[#1c2c4d]">
            <span>Microscopic Ion Channel Noise</span>
            <button
              onClick={() => setChannelNoise(!channelNoise)}
              className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors ${
                channelNoise ? 'bg-cyan-500 justify-end' : 'bg-slate-700 justify-start'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-white shadow-sm" />
            </button>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
          >
            {saved ? <Check className="w-3.5 h-3.5" /> : null}
            <span>{saved ? 'Saved!' : 'Save & Apply'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
