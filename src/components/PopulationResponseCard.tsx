import React, { useRef, useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface PopulationResponseCardProps {
  amplitude: number;
  spatialSpread: number;
  pulseRate: number;
}

export const PopulationResponseCard: React.FC<PopulationResponseCardProps> = ({
  amplitude,
  spatialSpread,
  pulseRate,
}) => {
  const [metric, setMetric] = useState('Firing Rate');
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

    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
    }

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    // Margins
    const marginLeft = 42;
    const marginRight = 16;
    const marginTop = 18;
    const marginBottom = 28;

    const plotW = width - marginLeft - marginRight;
    const plotH = height - marginTop - marginBottom;

    // Background of plot
    ctx.fillStyle = '#060a15';
    ctx.fillRect(marginLeft, marginTop, plotW, plotH);

    // Y-axis grid & labels (200, 150, 100, 50, 0)
    const yTicks = [200, 150, 100, 50, 0];
    ctx.strokeStyle = 'rgba(30, 41, 59, 0.6)';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 4]);

    ctx.font = '10px JetBrains Mono, monospace';
    ctx.fillStyle = '#64748b';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';

    yTicks.forEach((val) => {
      const y = marginTop + plotH - (val / 200) * plotH;
      ctx.beginPath();
      ctx.moveTo(marginLeft, y);
      ctx.lineTo(marginLeft + plotW, y);
      ctx.stroke();

      ctx.fillText(`${val}`, marginLeft - 6, y);
    });

    // X-axis grid & labels (0, 20, 40, 60, 80, 100)
    const xTicks = [0, 20, 40, 60, 80, 100];
    ctx.textAlign = 'center';

    xTicks.forEach((val) => {
      const x = marginLeft + (val / 100) * plotW;
      ctx.beginPath();
      ctx.moveTo(x, marginTop);
      ctx.lineTo(x, marginTop + plotH);
      ctx.stroke();

      ctx.fillText(`${val}`, x, height - 10);
    });

    ctx.setLineDash([]);

    // Y-axis title
    ctx.save();
    ctx.translate(11, marginTop + plotH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.font = '10px Inter, sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.textAlign = 'center';
    ctx.fillText('Firing Rate (Hz)', 0, 0);
    ctx.restore();

    // X-axis title
    ctx.font = '10px Inter, sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.textAlign = 'center';
    ctx.fillText('Time (ms)', marginLeft + plotW / 2, height - 1);

    // Dynamic scale ratios
    const ampRatio = amplitude / 450;
    const spreadRatio = spatialSpread / 42;

    // Build the exact multi-peak shape from the screenshot
    const computeCurve = (type: 'total' | 'near' | 'distant') => {
      const pts: { x: number; y: number }[] = [];
      const numSteps = 140;

      for (let i = 0; i <= numSteps; i++) {
        const t = (i / numSteps) * 100; // ms

        // Peaks precisely located at ~23ms, ~47ms, ~71ms, ~91ms matching the screenshot wave!
        const p1 = Math.exp(-Math.pow((t - 23) / 7.5, 2)) * 135;
        const p2 = Math.exp(-Math.pow((t - 47) / 8.5, 2)) * 162;
        const p3 = Math.exp(-Math.pow((t - 71) / 8.0, 2)) * 145;
        const p4 = Math.exp(-Math.pow((t - 91) / 7.0, 2)) * 122;
        const baseline = 8 + Math.sin(t * 0.08) * 3;

        let rawRate = (p1 + p2 + p3 + p4 + baseline) * ampRatio;

        if (type === 'near') {
          rawRate = rawRate * 0.52;
        } else if (type === 'distant') {
          rawRate = rawRate * 0.18 * spreadRatio;
        }

        const capped = Math.max(0, Math.min(198, rawRate));
        const px = marginLeft + (t / 100) * plotW;
        const py = marginTop + plotH - (capped / 200) * plotH;
        pts.push({ x: px, y: py });
      }
      return pts;
    };

    const drawFilledCurve = (
      pts: { x: number; y: number }[],
      strokeColor: string,
      fillColor: string,
      glowColor: string
    ) => {
      if (pts.length === 0) return;

      // Fill area
      ctx.beginPath();
      ctx.moveTo(pts[0].x, marginTop + plotH);
      pts.forEach((p) => ctx.lineTo(p.x, p.y));
      ctx.lineTo(pts[pts.length - 1].x, marginTop + plotH);
      ctx.closePath();
      ctx.fillStyle = fillColor;
      ctx.fill();

      // Stroke line
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      pts.forEach((p) => ctx.lineTo(p.x, p.y));
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 2.2;
      ctx.shadowColor = glowColor;
      ctx.shadowBlur = 8;
      ctx.stroke();
      ctx.shadowBlur = 0;
    };

    // 1. Distant Fibers (Orange)
    const distantPts = computeCurve('distant');
    drawFilledCurve(
      distantPts,
      '#f97316',
      'rgba(249, 115, 22, 0.18)',
      'rgba(249, 115, 22, 0.5)'
    );

    // 2. Near Fibers (Magenta / Purple)
    const nearPts = computeCurve('near');
    drawFilledCurve(
      nearPts,
      '#c084fc',
      'rgba(192, 132, 252, 0.22)',
      'rgba(192, 132, 252, 0.55)'
    );

    // 3. Total Population (Electric Cyan)
    const totalPts = computeCurve('total');
    drawFilledCurve(
      totalPts,
      '#38bdf8',
      'rgba(56, 189, 248, 0.2)',
      'rgba(56, 189, 248, 0.7)'
    );

    ctx.restore();
  }, [amplitude, spatialSpread, pulseRate, metric]);

  return (
    <div className="bg-[#0b1222] border border-[#18233c] rounded-2xl p-4 shadow-xl flex flex-col justify-between h-full">
      <div>
        {/* Header & Controls */}
        <div className="flex items-start justify-between mb-2">
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide">
              Population Response
            </h2>
            <p className="text-xs text-slate-400">Aggregate neural response</p>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-slate-400">Metric</span>
            <div className="relative">
              <select
                value={metric}
                onChange={(e) => setMetric(e.target.value)}
                className="appearance-none bg-[#11192e] text-slate-200 text-xs font-semibold px-2.5 py-1 pr-6 rounded-lg border border-[#1e2e50] focus:outline-none focus:border-cyan-400 cursor-pointer"
              >
                <option value="Firing Rate">Firing Rate</option>
                <option value="Synchrony">Synchrony</option>
                <option value="Vector Strength">Vector Strength</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-1.5 top-2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-[11px] mb-2 font-medium text-slate-300">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(56,189,248,0.7)]" />
            <span>Total Population</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400 shadow-[0_0_6px_rgba(192,132,252,0.7)]" />
            <span>Near Fibers</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-400 shadow-[0_0_6px_rgba(249,115,22,0.7)]" />
            <span>Distant Fibers</span>
          </div>
        </div>

        {/* Canvas Plot */}
        <div className="relative h-60 bg-[#060a15] rounded-xl overflow-hidden border border-[#18233c]">
          <canvas ref={canvasRef} className="w-full h-full block" />
        </div>
      </div>
    </div>
  );
};
