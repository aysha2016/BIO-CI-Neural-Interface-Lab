import React from 'react';
import { ChevronDown, Users, CheckCircle2, Ruler } from 'lucide-react';
import { Tooltip } from './ui/Tooltip';

interface ElectrodeParametersCardProps {
  selectedElectrode: number;
  setSelectedElectrode: (id: number) => void;
  amplitude: number;
  setAmplitude: (val: number) => void;
  impedance: number;
  setImpedance: (val: number) => void;
  spatialSpread: number;
  setSpatialSpread: (val: number) => void;
  pulseWidth: number;
  setPulseWidth: (val: number) => void;
  pulseRate: number;
  setPulseRate: (val: number) => void;
}

export const ElectrodeParametersCard: React.FC<ElectrodeParametersCardProps> = ({
  selectedElectrode,
  setSelectedElectrode,
  amplitude,
  setAmplitude,
  impedance,
  setImpedance,
  spatialSpread,
  setSpatialSpread,
  pulseWidth,
  setPulseWidth,
  pulseRate,
  setPulseRate,
}) => {
  // Dynamically calculate nearby fibers, activation prob and spread based on amplitude & spatialSpread
  const nearbyFibers = Math.round(20 + (amplitude / 1000) * 25 + (spatialSpread / 100) * 18);
  const activationProb = Math.min(
    98,
    Math.round((amplitude / 650) * 55 + (pulseWidth / 50) * 20 + 5)
  );
  const estimatedSpread = ((spatialSpread / 100) * 1.5 + (amplitude / 1000) * 0.4).toFixed(1);

  const electrodeOptions = Array.from({ length: 16 }, (_, i) => i + 1);

  return (
    <div className="bg-[#0b1222] border border-[#18233c] rounded-2xl p-4 shadow-xl flex flex-col justify-between h-full">
      <div>
        {/* Header */}
        <h2 className="text-sm font-bold text-white tracking-wide mb-3">
          Electrode Parameters
        </h2>

        {/* Selected Electrode Title & Dropdown */}
        <div className="flex items-center justify-between pb-3 border-b border-[#18233c]">
          <span className="text-cyan-400 font-bold text-sm tracking-wide">
            Electrode {selectedElectrode < 10 ? `0${selectedElectrode}` : selectedElectrode}
          </span>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400">Select Electrode</span>
            <div className="relative">
              <select
                value={selectedElectrode}
                onChange={(e) => setSelectedElectrode(Number(e.target.value))}
                className="appearance-none bg-[#11192e] text-slate-100 text-xs font-semibold px-2.5 py-1 pr-6 rounded-lg border border-[#1e2e50] focus:outline-none focus:border-cyan-400 cursor-pointer"
              >
                {electrodeOptions.map((num) => (
                  <option key={num} value={num}>
                    {num < 10 ? `0${num}` : num}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-1.5 top-2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Sliders Container with Tooltips */}
        <div className="space-y-3.5 mt-3.5">
          {/* Current Amplitude */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="text-slate-300 font-medium flex items-center">
                Current Amplitude
                <Tooltip paramKey="amplitude" />
              </span>
              <span className="text-slate-100 font-mono font-semibold">{amplitude} µA</span>
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

          {/* Impedance */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="text-slate-300 font-medium flex items-center">
                Impedance
                <Tooltip paramKey="impedance" />
              </span>
              <span className="text-slate-100 font-mono font-semibold">{impedance.toFixed(1)} kΩ</span>
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

          {/* Spatial Spread */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="text-slate-300 font-medium flex items-center">
                Spatial Spread
                <Tooltip paramKey="spatialSpread" />
              </span>
              <span className="text-slate-100 font-mono font-semibold">{spatialSpread}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="90"
              step="1"
              value={spatialSpread}
              onChange={(e) => setSpatialSpread(Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Pulse Width */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="text-slate-300 font-medium flex items-center">
                Pulse Width
                <Tooltip paramKey="pulseWidth" />
              </span>
              <span className="text-slate-100 font-mono font-semibold">{pulseWidth} µs</span>
            </div>
            <input
              type="range"
              min="10"
              max="60"
              step="1"
              value={pulseWidth}
              onChange={(e) => setPulseWidth(Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Pulse Rate */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="text-slate-300 font-medium flex items-center">
                Pulse Rate
                <Tooltip paramKey="pulseRate" />
              </span>
              <span className="text-slate-100 font-mono font-semibold">{pulseRate} pps</span>
            </div>
            <input
              type="range"
              min="300"
              max="2400"
              step="50"
              value={pulseRate}
              onChange={(e) => setPulseRate(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Stats Sub-Panel */}
      <div className="mt-4 p-3 bg-[#0d1629] border border-[#1b2b4d] rounded-xl space-y-2 text-xs">
        <div className="flex items-center justify-between text-slate-300">
          <span className="flex items-center gap-1.5 text-slate-400">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            Nearby Fibers
          </span>
          <span className="font-mono font-semibold text-slate-200">~ {nearbyFibers}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-slate-400">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Activation Probability
          </span>
          <span className="font-mono font-bold text-emerald-400">{activationProb}%</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-slate-400">
            <Ruler className="w-3.5 h-3.5 text-emerald-400" />
            Estimated Spread
          </span>
          <span className="font-mono font-bold text-emerald-400">{estimatedSpread} mm</span>
        </div>
      </div>
    </div>
  );
};
