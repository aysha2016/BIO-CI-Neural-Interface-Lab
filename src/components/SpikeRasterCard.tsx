import React, { useRef, useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface SpikeRasterCardProps {
  amplitude: number;
  spatialSpread: number;
  pulseRate: number;
}

export const SpikeRasterCard: React.FC<SpikeRasterCardProps> = ({
  amplitude,
  spatialSpread,
  pulseRate,
}) => {
  const [timeWindow, setTimeWindow] = useState('100 ms');
  const [colorBy, setColorBy] = useState('Activation');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

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

    // Margins for axes
    const marginLeft = 38;
    const marginRight = 15;
    const marginTop = 15;
    const marginBottom = 28;

    const plotW = width - marginLeft - marginRight;
    const plotH = height - marginTop - marginBottom;

    // Background of plot
    ctx.fillStyle = '#060a15';
    ctx.fillRect(marginLeft, marginTop, plotW, plotH);

    // Grid lines for Time (X-axis: 0, 20, 40, 60, 80, 100 ms)
    const timeSteps = [0, 20, 40, 60, 80, 100];
    ctx.strokeStyle = 'rgba(30, 41, 59, 0.6)';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 4]);

    ctx.font = '10px JetBrains Mono, monospace';
    ctx.fillStyle = '#64748b';
    ctx.textAlign = 'center';

    timeSteps.forEach((t) => {
      const x = marginLeft + (t / 100) * plotW;
      ctx.beginPath();
      ctx.moveTo(x, marginTop);
      ctx.lineTo(x, marginTop + plotH);
      ctx.stroke();

      // Label below
      ctx.fillText(`${t}`, x, height - 10);
    });

    // Y-axis grid & labels (Fiber #: 1, 10, 30, 40, 50 matching screenshot)
    const fiberLabels = [1, 10, 30, 40, 50];
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';

    fiberLabels.forEach((fNum) => {
      const y = marginTop + ((fNum - 1) / 49) * plotH;
      ctx.beginPath();
      ctx.moveTo(marginLeft, y);
      ctx.lineTo(marginLeft + plotW, y);
      ctx.stroke();

      ctx.fillText(`${fNum}`, marginLeft - 6, y);
    });

    ctx.setLineDash([]);

    // Y-axis title
    ctx.save();
    ctx.translate(11, marginTop + plotH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.font = '10px Inter, sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.textAlign = 'center';
    ctx.fillText('Fiber #', 0, 0);
    ctx.restore();

    // X-axis title
    ctx.font = '10px Inter, sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.textAlign = 'center';
    ctx.fillText('Time (ms)', marginLeft + plotW / 2, height - 1);

    // ==========================================
    // Generate Dense Multi-fiber Spikes matching raster screenshot
    // ==========================================
    const totalFibers = 50;
    const ampRatio = amplitude / 450;
    const spreadRatio = spatialSpread / 42;

    // Pulse peak intervals
    const burstTimes = [12, 23, 35, 47, 59, 71, 83, 91];

    let seed = 1337;
    const random = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    for (let f = 1; f <= totalFibers; f++) {
      const fiberNorm = (f - 1) / 49;
      const y = marginTop + fiberNorm * plotH;

      // Distance attenuation
      const recruitmentProb = Math.exp(-fiberNorm * 2.5 * (1 / spreadRatio)) * ampRatio;

      // Dense temporal grid
      for (let t = 2; t < 100; t += 1.8) {
        // Check if near a pulse burst
        let nearestBurstDist = 999;
        burstTimes.forEach((bt) => {
          const d = Math.abs(t - bt);
          if (d < nearestBurstDist) nearestBurstDist = d;
        });

        const burstBoost = nearestBurstDist < 2.5 ? 2.8 : 0.4;
        const fireChance = recruitmentProb * burstBoost * 0.45;

        if (random() < fireChance) {
          const jitter = (random() - 0.5) * 0.9;
          const x = marginLeft + ((t + jitter) / 100) * plotW;

          // Rate estimate for color
          const localRate = Math.min(150, Math.round(recruitmentProb * burstBoost * 45));

          let dotColor = '#38bdf8';
          if (localRate > 110) {
            dotColor = '#facc15'; // yellow/orange peak
          } else if (localRate > 75) {
            dotColor = '#4ade80'; // bright green
          } else if (localRate > 40) {
            dotColor = '#22d3ee'; // cyan
          } else {
            dotColor = '#3b82f6'; // deep blue
          }

          ctx.fillStyle = dotColor;
          ctx.beginPath();
          ctx.arc(x, y, 1.4, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    ctx.restore();
  }, [amplitude, spatialSpread, pulseRate, timeWindow, colorBy]);

  return (
    <div className="bg-[#0b1222] border border-[#18233c] rounded-2xl p-4 shadow-xl flex flex-col justify-between h-full">
      <div>
        {/* Header & Controls */}
        <div className="flex items-start justify-between mb-2">
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide">
              Neural Response (Spike Raster)
            </h2>
            <p className="text-xs text-slate-400">
              Simulated neural activity across fiber population
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Time Window */}
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-slate-400">Time Window</span>
              <div className="relative">
                <select
                  value={timeWindow}
                  onChange={(e) => setTimeWindow(e.target.value)}
                  className="appearance-none bg-[#11192e] text-slate-200 text-xs font-semibold px-2 py-1 pr-5 rounded-lg border border-[#1e2e50] cursor-pointer"
                >
                  <option value="50 ms">50 ms</option>
                  <option value="100 ms">100 ms</option>
                  <option value="200 ms">200 ms</option>
                </select>
                <ChevronDown className="w-3 h-3 text-slate-400 absolute right-1 top-2 pointer-events-none" />
              </div>
            </div>

            {/* Color by */}
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-slate-400">Color by</span>
              <div className="relative">
                <select
                  value={colorBy}
                  onChange={(e) => setColorBy(e.target.value)}
                  className="appearance-none bg-[#11192e] text-slate-200 text-xs font-semibold px-2 py-1 pr-5 rounded-lg border border-[#1e2e50] cursor-pointer"
                >
                  <option value="Activation">Activation</option>
                  <option value="Latency">Latency</option>
                </select>
                <ChevronDown className="w-3 h-3 text-slate-400 absolute right-1 top-2 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Canvas & Colorbar */}
        <div className="relative h-60 bg-[#060a15] rounded-xl overflow-hidden border border-[#18233c] flex">
          <canvas ref={canvasRef} className="w-full h-full block flex-1" />

          {/* Colorbar for Spike Rate (Right) */}
          <div className="w-14 p-2 flex flex-col items-center justify-between text-[10px] text-slate-400 bg-[#0a1122]/90 border-l border-[#18233c]/80 select-none">
            <span className="text-[9px] font-semibold text-slate-300 text-center leading-tight">
              Firing Rate (Hz)
            </span>
            <span className="text-yellow-400 font-bold font-mono">150</span>
            <div className="w-2 flex-1 my-1 rounded-full bg-gradient-to-b from-yellow-400 via-green-400 via-cyan-400 to-blue-700 shadow-inner" />
            <span className="text-blue-400 font-bold font-mono">0</span>
          </div>
        </div>
      </div>
    </div>
  );
};
