import React, { useMemo } from 'react';

interface FiberSimulationCardProps {
  amplitude: number;
  spatialSpread: number;
}

interface FiberEntry {
  id: string;
  distance: string;
  baseRate: number;
  color: string;
}

const baseFibers: FiberEntry[] = [
  { id: 'Fiber 01', distance: '0.35 mm', baseRate: 128, color: '#38bdf8' },
  { id: 'Fiber 02', distance: '0.42 mm', baseRate: 96, color: '#60a5fa' },
  { id: 'Fiber 03', distance: '0.58 mm', baseRate: 84, color: '#818cf8' },
  { id: 'Fiber 04', distance: '0.61 mm', baseRate: 72, color: '#a855f7' },
  { id: 'Fiber 05', distance: '0.73 mm', baseRate: 56, color: '#c084fc' },
  { id: 'Fiber 06', distance: '0.81 mm', baseRate: 42, color: '#e879f9' },
  { id: 'Fiber 07', distance: '0.95 mm', baseRate: 28, color: '#f472b6' },
  { id: 'Fiber 08', distance: '1.12 mm', baseRate: 18, color: '#fb7185' },
  { id: 'Fiber 09', distance: '1.24 mm', baseRate: 12, color: '#f87171' },
  { id: 'Fiber 10', distance: '1.41 mm', baseRate: 8, color: '#fb923c' },
];

export const FiberSimulationCard: React.FC<FiberSimulationCardProps> = ({
  amplitude,
  spatialSpread,
}) => {
  const fibers = useMemo(() => {
    // If at default 450 µA, preserve screenshot values exactly: 128, 96, 84, 72, 56, 42, 28, 18, 12, 8
    if (amplitude === 450 && spatialSpread === 42) {
      return baseFibers.map((f) => ({ ...f, spikeRate: f.baseRate }));
    }

    const ampRatio = amplitude / 450;
    const spreadRatio = spatialSpread / 42;

    return baseFibers.map((f, idx) => {
      const distanceFactor = Math.exp(-idx * 0.28 * (1 / spreadRatio));
      const adjustedRate = Math.max(2, Math.round(f.baseRate * ampRatio * distanceFactor));
      return {
        ...f,
        spikeRate: adjustedRate,
      };
    });
  }, [amplitude, spatialSpread]);

  // Exact spike train rendering with orange action potentials and blue biphasic rebounds
  const renderWaveform = (rate: number, seed: number) => {
    const width = 180;
    const height = 18;
    const midY = height / 2;

    // Spike count proportional to rate
    const spikeCount = Math.max(1, Math.min(14, Math.round((rate / 128) * 11)));
    const spikePositions = Array.from({ length: spikeCount }, (_, i) => {
      return 12 + ((i + 0.5) / spikeCount) * (width - 24) + ((seed * 5 + i * 11) % 6) - 3;
    });

    return (
      <svg
        className="w-full h-4 overflow-visible"
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
      >
        {/* Baseline potential line */}
        <line
          x1="0"
          y1={midY}
          x2={width}
          y2={midY}
          stroke="#334155"
          strokeWidth="1"
        />

        {/* Action Potential Spikes (Orange depolarizing peak + small blue hyperpolarizing after-potential) */}
        {spikePositions.map((x, i) => {
          const spikeH = 6 + ((seed + i) % 3);
          return (
            <g key={i}>
              {/* Positive spike (Orange/Amber) */}
              <line
                x1={x}
                y1={midY}
                x2={x}
                y2={midY - spikeH}
                stroke="#f97316"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              {/* Rebound dip (Cyan/Blue) */}
              <line
                x1={x + 1}
                y1={midY}
                x2={x + 1}
                y2={midY + spikeH * 0.35}
                stroke="#38bdf8"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </g>
          );
        })}
      </svg>
    );
  };

  return (
    <div className="bg-[#0b1222] border border-[#18233c] rounded-2xl p-4 shadow-xl flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide">
              Individual Nerve Fiber Simulation
            </h2>
            <p className="text-xs text-slate-400">
              Simulated responses of multiple auditory nerve fibers to stimulation
            </p>
          </div>
          <span className="text-[11px] font-semibold text-slate-400">Spike Rate (Hz)</span>
        </div>

        {/* Fiber Rows */}
        <div className="space-y-1 mt-2.5 max-h-[265px] overflow-y-auto pr-1">
          {fibers.map((fiber, idx) => (
            <div
              key={fiber.id}
              className="flex items-center gap-2.5 px-2 py-1 rounded-lg bg-[#0d1629]/50 hover:bg-[#13203c] transition-colors border border-transparent hover:border-[#1e2f4f]"
            >
              {/* Fiber Name with color indicator */}
              <div className="flex items-center gap-1.5 w-18 shrink-0">
                <span
                  className="w-2 h-2 rounded-full shrink-0 shadow-[0_0_4px_currentColor]"
                  style={{ backgroundColor: fiber.color, color: fiber.color }}
                />
                <span className="text-xs font-semibold text-slate-300">{fiber.id}</span>
              </div>

              {/* Distance */}
              <div className="w-16 shrink-0 text-right">
                <span className="text-xs font-mono text-slate-400">{fiber.distance}</span>
              </div>

              {/* Waveform Trace */}
              <div className="flex-1 px-1">{renderWaveform(fiber.spikeRate, idx)}</div>

              {/* Spike Rate */}
              <div className="w-9 shrink-0 text-right">
                <span className="text-xs font-mono font-bold text-slate-200">
                  {fiber.spikeRate}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
