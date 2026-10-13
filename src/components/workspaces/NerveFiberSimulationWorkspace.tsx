import React, { useState, useMemo } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { Tooltip } from '../ui/Tooltip';
import { Activity, X, Zap, CheckCircle2, AlertCircle, Timer, Sliders } from 'lucide-react';

interface SingleFiberDetail {
  id: number;
  name: string;
  distance: number;
  threshold: number;
  latency: number;
  excitability: number;
  survival: boolean;
  spikeRate: number;
  status: 'activated' | 'delayed' | 'subthreshold';
}

export const NerveFiberSimulationWorkspace: React.FC = () => {
  const {
    amplitude,
    spatialSpread,
    numFibers,
    setNumFibers,
    fiberHeterogeneity,
    setFiberHeterogeneity,
    neuralSurvival,
    setNeuralSurvival,
    refractoryDuration,
    adaptationStrength,
  } = useSimulation();

  const [thresholdVariability, setThresholdVariability] = useState(15);
  const [selectedFiber, setSelectedFiber] = useState<SingleFiberDetail | null>(null);

  // Generate simulated fibers based on state parameters
  const fiberList: SingleFiberDetail[] = useMemo(() => {
    const list: SingleFiberDetail[] = [];
    const ampRatio = amplitude / 450;
    const spreadRatio = spatialSpread / 42;

    for (let i = 1; i <= Math.min(60, numFibers); i++) {
      const dist = Number((0.3 + (i - 1) * 0.035).toFixed(2));
      // Viability modulated by neural survival
      const isAlive = (i * 17) % 100 <= neuralSurvival;

      // Base threshold
      const baseThresh = 280 + (i - 1) * 12 + ((i * 31) % thresholdVariability) - thresholdVariability / 2;
      const latency = Number((0.65 + dist * 0.45 + ((i * 7) % 5) * 0.05).toFixed(2));
      const excitability = Number(Math.max(0.2, 1 - (dist / 2.5)).toFixed(2));

      // Calculate firing rate
      let rate = 0;
      let status: 'activated' | 'delayed' | 'subthreshold' = 'subthreshold';

      if (isAlive) {
        const stimulusAtFiber = amplitude * Math.exp(-dist * (1.2 / spreadRatio));
        if (stimulusAtFiber >= baseThresh * 0.9) {
          rate = Math.round(
            Math.max(4, 140 * Math.exp(-dist * 1.4 * (1 / spreadRatio)) * ampRatio)
          );
          status = latency > 1.2 ? 'delayed' : 'activated';
        }
      }

      list.push({
        id: i,
        name: `Fiber ${i < 10 ? '0' + i : i}`,
        distance: dist,
        threshold: Math.round(baseThresh),
        latency,
        excitability,
        survival: isAlive,
        spikeRate: rate,
        status,
      });
    }
    return list;
  }, [amplitude, spatialSpread, numFibers, neuralSurvival, thresholdVariability]);

  // Aggregate counts
  const activatedCount = fiberList.filter((f) => f.status === 'activated').length;
  const delayedCount = fiberList.filter((f) => f.status === 'delayed').length;
  const nonActivatedCount = fiberList.filter((f) => f.status === 'subthreshold').length;

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Title & Stats Banner */}
      <div className="bg-[#0b1222] border border-[#18233c] rounded-2xl p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/40">
              AUDITORY NERVE
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/40">
              MULTI-FIBER TIMELINE
            </span>
          </div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            Individual Auditory Nerve Fiber Simulation
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Model individual axon timelines, stochastic threshold variances, axonal conduction latencies, and survival states.
          </p>
        </div>

        {/* State Badges */}
        <div className="flex items-center gap-2 text-xs">
          <div className="px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 flex items-center gap-1.5 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Activated: {activatedCount}</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-amber-950/60 border border-amber-500/40 text-amber-300 flex items-center gap-1.5 font-semibold">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>Delayed: {delayedCount}</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 flex items-center gap-1.5 font-semibold">
            <span className="w-2 h-2 rounded-full bg-slate-500" />
            <span>Subthreshold: {nonActivatedCount}</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Fiber Timelines List & Population Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Fiber Timelines Container */}
        <div className="lg:col-span-8 bg-[#0b1222] border border-[#18233c] rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#18233c] text-xs font-semibold text-slate-400">
              <span className="w-24">Fiber ID / Dist</span>
              <span className="w-20 text-center">Latency</span>
              <span className="flex-1 text-center">Simulated Timeline (0-20ms)</span>
              <span className="w-16 text-right">Rate (Hz)</span>
            </div>

            {/* List with timeline ticks */}
            <div className="space-y-1.5 max-h-[460px] overflow-y-auto pr-1">
              {fiberList.map((fiber) => {
                const isSelected = selectedFiber?.id === fiber.id;
                return (
                  <button
                    key={fiber.id}
                    onClick={() => setSelectedFiber(fiber)}
                    className={`w-full flex items-center gap-3 p-2 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#152549] border-cyan-500/80 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                        : 'bg-[#0d1527] border-[#18233c] hover:bg-[#121e38] hover:border-[#22355c]'
                    }`}
                  >
                    {/* Fiber Name & Distance */}
                    <div className="w-24 shrink-0">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            !fiber.survival
                              ? 'bg-rose-500'
                              : fiber.status === 'activated'
                              ? 'bg-emerald-400'
                              : fiber.status === 'delayed'
                              ? 'bg-amber-400'
                              : 'bg-slate-600'
                          }`}
                        />
                        <span className="text-xs font-bold text-white">{fiber.name}</span>
                      </div>
                      <span className="text-[10.5px] text-slate-400 font-mono ml-3.5">
                        {fiber.distance} mm
                      </span>
                    </div>

                    {/* Latency */}
                    <div className="w-20 shrink-0 text-center text-xs font-mono text-slate-300">
                      {fiber.latency} ms
                    </div>

                    {/* Timeline Action Potential Graphic */}
                    <div className="flex-1 h-5 relative flex items-center bg-[#070c18] rounded px-2 border border-[#14203a]">
                      <div className="w-full h-0.5 bg-slate-800 absolute left-0 right-0" />
                      {fiber.survival && fiber.spikeRate > 0 && (
                        <div className="relative w-full h-full flex items-center">
                          {Array.from({ length: Math.min(8, Math.round(fiber.spikeRate / 18)) }).map(
                            (_, sIdx) => {
                              const leftPercent = 10 + sIdx * 12 + ((fiber.id * 7 + sIdx * 13) % 8);
                              return (
                                <div
                                  key={sIdx}
                                  className="absolute w-1 h-4 bg-orange-400 rounded-full shadow-[0_0_4px_rgba(249,115,22,0.8)]"
                                  style={{ left: `${leftPercent}%` }}
                                />
                              );
                            }
                          )}
                        </div>
                      )}
                      {!fiber.survival && (
                        <span className="text-[9px] text-rose-400 font-semibold italic mx-auto z-10">
                          Degenerated Axon
                        </span>
                      )}
                    </div>

                    {/* Spike Rate */}
                    <div className="w-16 shrink-0 text-right font-mono font-bold text-xs text-cyan-300">
                      {fiber.spikeRate > 0 ? `${fiber.spikeRate} Hz` : '0 Hz'}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Fiber Population Controls */}
        <div className="lg:col-span-4 bg-[#0b1222] border border-[#18233c] rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#18233c]">
            <h3 className="text-sm font-bold text-white">Fiber Population Parameters</h3>
            <span className="text-[10px] text-cyan-400 font-mono">Heterogeneity</span>
          </div>

          <div className="space-y-4 text-xs">
            {/* Number of Fibers */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-slate-300 flex items-center">
                  Simulated Fiber Count
                  <Tooltip paramKey="fiberHeterogeneity" />
                </span>
                <span className="text-slate-100 font-mono font-bold">{numFibers}</span>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                value={numFibers}
                onChange={(e) => setNumFibers(Number(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Neural Survival */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-slate-300 flex items-center">
                  SGC Neural Survival
                  <Tooltip paramKey="neuralSurvival" />
                </span>
                <span className="text-emerald-400 font-mono font-bold">{neuralSurvival}%</span>
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

            {/* Fiber Heterogeneity */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-slate-300 flex items-center">
                  Fiber Heterogeneity
                  <Tooltip paramKey="fiberHeterogeneity" />
                </span>
                <span className="text-cyan-400 font-mono font-bold">{fiberHeterogeneity}</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.8"
                step="0.05"
                value={fiberHeterogeneity}
                onChange={(e) => setFiberHeterogeneity(Number(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Threshold Variability */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-slate-300 flex items-center">
                  Threshold Variability (±µA)
                  <Tooltip paramKey="threshold" />
                </span>
                <span className="text-slate-100 font-mono font-bold">±{thresholdVariability} µA</span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                value={thresholdVariability}
                onChange={(e) => setThresholdVariability(Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>

          <div className="p-3 bg-[#0d1629] border border-[#1b2b4d] rounded-xl text-xs space-y-2">
            <span className="text-slate-300 font-bold block">Individual Fiber Inspector:</span>
            <p className="text-[11px] text-slate-400">
              Click any fiber row on the left to inspect detailed transmembrane kinetics, stimulus synchronization, and refractory recovery states.
            </p>
          </div>
        </div>
      </div>

      {/* Selected Fiber Detailed Inspector Modal */}
      {selectedFiber && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0b1324] border border-[#23355e] rounded-2xl max-w-lg w-full p-5 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#18233c]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-cyan-600/30 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-bold text-xs">
                  {selectedFiber.name.split(' ')[1]}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{selectedFiber.name} Inspector</h3>
                  <p className="text-[11px] text-slate-400">
                    Distance from active electrode: {selectedFiber.distance} mm
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedFiber(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#152342] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Biophysical Stats Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded-xl bg-[#090f1d] border border-[#16233e]">
                <span className="text-slate-400 block text-[10px]">Action Potential Threshold:</span>
                <span className="text-sm font-bold font-mono text-cyan-400">
                  {selectedFiber.threshold} µA
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#090f1d] border border-[#16233e]">
                <span className="text-slate-400 block text-[10px]">Conduction Latency:</span>
                <span className="text-sm font-bold font-mono text-purple-400">
                  {selectedFiber.latency} ms
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#090f1d] border border-[#16233e]">
                <span className="text-slate-400 block text-[10px]">Axon Excitability Factor:</span>
                <span className="text-sm font-bold font-mono text-emerald-400">
                  {selectedFiber.excitability}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#090f1d] border border-[#16233e]">
                <span className="text-slate-400 block text-[10px]">Steady Spike Rate:</span>
                <span className="text-sm font-bold font-mono text-white">
                  {selectedFiber.spikeRate} Hz
                </span>
              </div>
            </div>

            {/* Simulated Action Potential Plot */}
            <div className="p-3 bg-[#070c18] border border-[#16233e] rounded-xl space-y-1">
              <span className="text-[10px] text-slate-400 font-semibold block">
                Recorded Single-Axon Spike Waveform (Node of Ranvier):
              </span>
              <div className="h-20 w-full flex items-center justify-center">
                <svg viewBox="0 0 200 40" className="w-full h-full">
                  <line x1="0" y1="25" x2="200" y2="25" stroke="#334155" strokeWidth="1" />
                  <path
                    d="M 0 25 L 60 25 Q 75 24 85 20 L 95 2 L 105 38 L 115 28 L 130 25 L 200 25"
                    fill="none"
                    stroke="#f97316"
                    strokeWidth="2"
                  />
                  <circle cx="95" cy="2" r="3" fill="#ffffff" />
                </svg>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedFiber(null)}
                className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
