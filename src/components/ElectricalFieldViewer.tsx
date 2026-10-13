import React, { useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import fieldContourImg from '../assets/images/electrical_field_contour_1791818772961.jpg';

interface ElectricalFieldViewerProps {
  spatialSpread: number;
  setSpatialSpread: (val: number) => void;
  amplitude: number;
  fieldViewMode: 'Field Contour' | 'Iso-potential Lines' | 'Volume Spread';
  setFieldViewMode: (val: 'Field Contour' | 'Iso-potential Lines' | 'Volume Spread') => void;
}

export const ElectricalFieldViewer: React.FC<ElectricalFieldViewerProps> = ({
  spatialSpread,
  setSpatialSpread,
  amplitude,
  fieldViewMode,
  setFieldViewMode,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = new Image();
    img.src = fieldContourImg;
    img.onload = () => {
      imageRef.current = img;
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let phase = 0;

    const draw = () => {
      phase += 0.04;
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

      // 1. Draw High-Resolution Render
      if (imageRef.current && imageRef.current.complete) {
        ctx.drawImage(imageRef.current, 0, 0, width, height);

        // Dynamic spatial spread modulation overlay
        const centerX = width * 0.505;
        const centerY = height * 0.51;
        const spreadRadius = (width * 0.22 * (spatialSpread / 42));

        // Pulsing electric glow at electrode contact point
        const pulse = (Math.sin(phase) + 1) * 0.5;
        const centerGlow = ctx.createRadialGradient(
          centerX,
          centerY,
          2,
          centerX,
          centerY,
          spreadRadius * 0.45
        );
        centerGlow.addColorStop(0, 'rgba(255, 255, 255, 0.7)');
        centerGlow.addColorStop(0.3, 'rgba(249, 115, 22, 0.4)');
        centerGlow.addColorStop(1, 'rgba(249, 115, 22, 0)');
        ctx.fillStyle = centerGlow;
        ctx.beginPath();
        ctx.arc(centerX, centerY, spreadRadius * 0.45, 0, Math.PI * 2);
        ctx.fill();

        // Dynamic equipotential ring highlight
        ctx.strokeStyle = `rgba(56, 189, 248, ${0.4 + pulse * 0.3})`;
        ctx.lineWidth = 1.2;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.arc(centerX, centerY, spreadRadius * (0.85 + pulse * 0.05), 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      } else {
        // Fallback drawing if loading
        ctx.fillStyle = '#080d19';
        ctx.fillRect(0, 0, width, height);
      }

      ctx.restore();
      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animId);
  }, [spatialSpread, amplitude, fieldViewMode]);

  return (
    <div className="bg-[#0b1222] border border-[#18233c] rounded-2xl p-4 shadow-xl flex flex-col justify-between h-full">
      {/* Header & View Mode */}
      <div>
        <div className="flex items-start justify-between mb-2">
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide">
              Electrical Field Visualization
            </h2>
            <p className="text-xs text-slate-400">Current spread in cochlear tissue</p>
          </div>

          {/* View Mode Dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-slate-400">View Mode</span>
            <div className="relative">
              <select
                value={fieldViewMode}
                onChange={(e) => setFieldViewMode(e.target.value as any)}
                className="appearance-none bg-[#11192e] text-slate-200 text-xs font-semibold px-2.5 py-1 pr-6 rounded-lg border border-[#1e2e50] focus:outline-none focus:border-cyan-400 cursor-pointer"
              >
                <option value="Field Contour">Field Contour</option>
                <option value="Iso-potential Lines">Iso-potential Lines</option>
                <option value="Volume Spread">Volume Spread</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-1.5 top-2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* 3D Visualizer & Heatmap Scale Container */}
        <div className="relative h-44 bg-[#080d19] rounded-xl overflow-hidden border border-[#18233c] flex">
          <canvas ref={canvasRef} className="w-full h-full block flex-1" />

          {/* Field Strength Colorbar Legend (Right) */}
          <div className="w-16 p-2 flex flex-col items-center justify-between text-[10px] text-slate-400 bg-[#0a1122]/90 border-l border-[#18233c]/80 select-none">
            <span className="text-[9px] font-semibold text-slate-300">Field Strength</span>
            <span className="text-red-400 font-bold">High</span>
            {/* Colorbar strip */}
            <div className="w-2.5 flex-1 my-1 rounded-full bg-gradient-to-b from-red-500 via-yellow-400 via-green-400 via-cyan-400 to-blue-700 shadow-inner" />
            <span className="text-blue-400 font-bold">Low</span>
          </div>
        </div>
      </div>

      {/* Current Spread Slider */}
      <div className="mt-3 pt-3 border-t border-[#18233c]">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-slate-300 font-semibold">Current Spread</span>
          <span className="text-cyan-400 font-mono font-bold">{spatialSpread}%</span>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
          <span>Narrow (Bipolar)</span>
          <span className="text-slate-200 font-mono font-semibold">{spatialSpread}%</span>
          <span>Broad (Monopolar)</span>
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
  );
};
