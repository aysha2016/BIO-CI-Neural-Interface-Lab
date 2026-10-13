import React, { useState } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { CochleaViewer3D } from '../CochleaViewer3D';
import { Tooltip } from '../ui/Tooltip';
import { Disc, Layers, Zap, Info, CheckCircle2 } from 'lucide-react';

export const CochleaElectrodesWorkspace: React.FC = () => {
  const {
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
    metrics,
  } = useSimulation();

  const [activeView, setActiveView] = useState<'3d' | 'cross-section' | 'longitudinal'>('3d');

  // Greenwood tonotopic frequency calculation for electrode index 1..16
  const getElectrodeFreq = (e: number) => {
    // e=1 is base (20 kHz), e=16 is apex (250 Hz)
    const normDist = (16 - e) / 15; // 1 at base, 0 at apex
    const freq = Math.round(165.4 * (Math.pow(10, 0.06 * (normDist * 33)) - 1));
    return freq;
  };

  const electrodeList = Array.from({ length: 16 }, (_, i) => {
    const id = i + 1;
    const freq = getElectrodeFreq(id);
    const isSelected = id === selectedElectrode;
    const isNearby = Math.abs(id - selectedElectrode) <= 1;
    return {
      id,
      name: `Electrode ${id < 10 ? '0' + id : id}`,
      freq,
      impedance: (7.5 + ((id * 3) % 4) * 0.4).toFixed(1),
      isSelected,
      isNearby,
    };
  });

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Title Banner */}
      <div className="bg-[#0b1222] border border-[#18233c] rounded-2xl p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/40">
              COCHLEAR ANATOMY
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-950 text-purple-300 border border-purple-500/40">
              3D VISUALIZATION
            </span>
          </div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Disc className="w-5 h-5 text-cyan-400" />
            Cochlea & Electrode Array Workspace
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Interactive multi-electrode array placement along the scala tympani spiral and tonotopic frequency mapping.
          </p>
        </div>

        {/* Selected Electrode Callout Badge */}
        <div className="px-4 py-2 rounded-xl bg-[#111c33] border border-cyan-500/50 flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-orange-400 animate-pulse shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
          <div>
            <div className="text-[10px] text-slate-400">Active Channel</div>
            <div className="text-xs font-bold text-white font-mono">
              Electrode {selectedElectrode < 10 ? '0' + selectedElectrode : selectedElectrode} •{' '}
              {getElectrodeFreq(selectedElectrode)} Hz
            </div>
          </div>
        </div>
      </div>

      {/* 3D Visualizer & Electrode Array Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* 3D Centerpiece Viewer */}
        <div className="lg:col-span-8 h-[480px]">
          <CochleaViewer3D
            selectedElectrode={selectedElectrode}
            setSelectedElectrode={setSelectedElectrode}
            amplitude={amplitude}
            spatialSpread={spatialSpread}
            activeView={activeView}
            setActiveView={setActiveView}
          />
        </div>

        {/* Electrode Array Channels List */}
        <div className="lg:col-span-4 bg-[#0b1222] border border-[#18233c] rounded-2xl p-4 shadow-xl flex flex-col justify-between h-[480px]">
          <div>
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#18233c]">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                Electrode Channels (1-16)
              </h3>
              <span className="text-[10px] text-slate-400">Click to Select</span>
            </div>

            <div className="space-y-1 overflow-y-auto max-h-[290px] pr-1">
              {electrodeList.map((e) => (
                <button
                  key={e.id}
                  onClick={() => setSelectedElectrode(e.id)}
                  className={`w-full flex items-center justify-between p-2 rounded-lg text-xs font-medium transition-all cursor-pointer border ${
                    e.isSelected
                      ? 'bg-[#16274e] border-cyan-500 text-white shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                      : e.isNearby
                      ? 'bg-[#10192e] border-orange-500/40 text-slate-200'
                      : 'bg-[#0d1527] border-transparent text-slate-400 hover:bg-[#131f38] hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        e.isSelected
                          ? 'bg-orange-400 shadow-[0_0_6px_rgba(249,115,22,1)]'
                          : e.isNearby
                          ? 'bg-amber-300'
                          : 'bg-slate-600'
                      }`}
                    />
                    <span className="font-semibold">{e.name}</span>
                  </div>

                  <div className="flex items-center gap-3 font-mono text-[11px]">
                    <span className="text-cyan-400">{e.freq} Hz</span>
                    <span className="text-slate-500">{e.impedance} kΩ</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Active Electrode Details Panel */}
          <div className="p-3 bg-[#0d1629] border border-[#1b2b4d] rounded-xl space-y-1.5 text-xs">
            <div className="flex justify-between font-bold text-cyan-300">
              <span>Channel Specifics</span>
              <span>Electrode {selectedElectrode < 10 ? '0' + selectedElectrode : selectedElectrode}</span>
            </div>
            <div className="flex justify-between text-slate-300 text-[11px]">
              <span>Estimated Spread</span>
              <span className="font-mono text-emerald-400">{metrics.estimatedSpread} mm</span>
            </div>
            <div className="flex justify-between text-slate-300 text-[11px]">
              <span>Nearby Fibers Recruited</span>
              <span className="font-mono text-white">~ {metrics.nearbyFibers}</span>
            </div>
            <div className="flex justify-between text-slate-300 text-[11px]">
              <span>Activation Probability</span>
              <span className="font-mono text-emerald-400">{metrics.activationProbability}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
