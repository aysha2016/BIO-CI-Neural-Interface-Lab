import React, { useRef, useEffect, useState } from 'react';
import { RotateCw, ZoomIn, Scissors, Eye, Zap } from 'lucide-react';
import cochleaRenderImg from '../assets/images/cochlea_3d_render_1791818745652.jpg';

interface CochleaViewer3DProps {
  selectedElectrode: number;
  setSelectedElectrode: (id: number) => void;
  amplitude: number;
  spatialSpread: number;
  activeView: '3d' | 'cross-section' | 'longitudinal';
  setActiveView: (view: '3d' | 'cross-section' | 'longitudinal') => void;
}

export const CochleaViewer3D: React.FC<CochleaViewer3DProps> = ({
  selectedElectrode,
  setSelectedElectrode,
  amplitude,
  spatialSpread,
  activeView,
  setActiveView,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  // Visual toggles
  const [showField, setShowField] = useState(true);
  const [showFibers, setShowFibers] = useState(true);
  const [showAnatomy, setShowAnatomy] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Rotation angles (pitch & yaw)
  const [rotX, setRotX] = useState(0);
  const [rotY, setRotY] = useState(0);
  const isDraggingRef = useRef(false);
  const lastMouseRef = useRef({ x: 0, y: 0 });

  // Load the photorealistic background render
  useEffect(() => {
    const img = new Image();
    img.src = cochleaRenderImg;
    img.onload = () => {
      imageRef.current = img;
    };
  }, []);

  // Handle Mouse Drag for 3D rotation
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true;
    lastMouseRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - lastMouseRef.current.x;
    const dy = e.clientY - lastMouseRef.current.y;
    lastMouseRef.current = { x: e.clientX, y: e.clientY };

    setRotY((prev) => prev + dx * 0.005);
    setRotX((prev) => Math.max(-0.4, Math.min(0.4, prev + dy * 0.005)));
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setZoomLevel((prev) => Math.max(0.7, Math.min(2.0, prev - e.deltaY * 0.0012)));
  };

  // Canvas render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = 0;

    const render = () => {
      time += 0.03;

      if (autoRotate && !isDraggingRef.current) {
        setRotY((prev) => prev + 0.001);
      }

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

      // Deep dark navy/black background
      ctx.fillStyle = '#070b16';
      ctx.fillRect(0, 0, width, height);

      // 1. Draw High-Resolution Biological 3D Render
      if (imageRef.current && imageRef.current.complete) {
        ctx.save();
        // Center with slight 3D rotation transform
        ctx.translate(width / 2, height / 2);
        ctx.scale(zoomLevel, zoomLevel);
        ctx.rotate(rotY * 0.15);

        // Aspect ratio cover/fit
        const img = imageRef.current;
        const imgAspect = img.width / img.height;
        const canvasAspect = width / height;

        let drawW = width;
        let drawH = height;
        if (canvasAspect > imgAspect) {
          drawW = width;
          drawH = width / imgAspect;
        } else {
          drawH = height;
          drawW = height * imgAspect;
        }

        // Draw image centered
        ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);

        // Add subtle biological deep-blue atmosphere vignette
        const vignette = ctx.createRadialGradient(0, 0, Math.min(width, height) * 0.35, 0, 0, Math.max(width, height) * 0.75);
        vignette.addColorStop(0, 'rgba(7, 11, 22, 0)');
        vignette.addColorStop(0.7, 'rgba(7, 11, 22, 0.4)');
        vignette.addColorStop(1, 'rgba(5, 8, 17, 0.85)');
        ctx.fillStyle = vignette;
        ctx.fillRect(-drawW / 2, -drawH / 2, drawW, drawH);

        ctx.restore();
      }

      // Coordinates for Active Electrode (Electrode 07 is at ~41% width, ~50% height in this view)
      const e7X = width * 0.408 + Math.sin(time * 0.5) * 0.8;
      const e7Y = height * 0.498 + Math.cos(time * 0.5) * 0.8;

      // 2. Draw Dynamic Electrical Field if toggled
      if (showField) {
        const spreadRadius = (28 + (spatialSpread / 100) * 48) * zoomLevel;
        const ampIntensity = Math.min(1.3, amplitude / 420);

        // Radiant orange/golden electric aura
        const auraGrad = ctx.createRadialGradient(e7X, e7Y, 3, e7X, e7Y, spreadRadius);
        auraGrad.addColorStop(0, `rgba(255, 237, 213, ${0.9 * ampIntensity})`);
        auraGrad.addColorStop(0.25, `rgba(249, 115, 22, ${0.7 * ampIntensity})`);
        auraGrad.addColorStop(0.65, `rgba(234, 88, 12, ${0.35 * ampIntensity})`);
        auraGrad.addColorStop(1, 'rgba(234, 88, 12, 0)');

        ctx.fillStyle = auraGrad;
        ctx.beginPath();
        ctx.arc(e7X, e7Y, spreadRadius, 0, Math.PI * 2);
        ctx.fill();

        // Pulsing electric field contour rings
        const ringPulse = (Math.sin(time * 3) + 1) * 0.5;
        ctx.strokeStyle = `rgba(251, 146, 60, ${0.75 * ampIntensity})`;
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.arc(e7X, e7Y, spreadRadius * (0.55 + ringPulse * 0.08), 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = `rgba(253, 186, 116, ${0.45 * ampIntensity})`;
        ctx.beginPath();
        ctx.arc(e7X, e7Y, spreadRadius * (0.88 + ringPulse * 0.05), 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        // Dynamic electric discharge sparks radiating outward
        const sparkCount = 8;
        ctx.strokeStyle = `rgba(254, 215, 170, ${0.85 * ampIntensity})`;
        ctx.lineWidth = 1.2;
        for (let s = 0; s < sparkCount; s++) {
          const angle = (s / sparkCount) * Math.PI * 2 + time * 1.5;
          const dist = (spreadRadius * 0.35 + Math.sin(time * 5 + s) * 12);
          ctx.beginPath();
          ctx.moveTo(e7X, e7Y);
          ctx.lineTo(e7X + Math.cos(angle) * dist, e7Y + Math.sin(angle) * dist);
          ctx.stroke();
        }
      }

      // 3. Draw Radiant Golden Nerve Fibers (if toggled)
      if (showFibers) {
        // Glowing action potential pulses flowing along the fibers
        const pulseT = (time * 1.8) % 1;
        const fiberArcs = [
          { x1: e7X, y1: e7Y, cx: width * 0.55, cy: height * 0.52, x2: width * 0.65, y2: height * 0.58 },
          { x1: e7X, y1: e7Y, cx: width * 0.52, cy: height * 0.44, x2: width * 0.63, y2: height * 0.48 },
          { x1: e7X, y1: e7Y, cx: width * 0.54, cy: height * 0.58, x2: width * 0.62, y2: height * 0.64 },
        ];

        fiberArcs.forEach((arc) => {
          ctx.strokeStyle = 'rgba(250, 204, 21, 0.45)';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(arc.x1, arc.y1);
          ctx.quadraticCurveTo(arc.cx, arc.cy, arc.x2, arc.y2);
          ctx.stroke();

          // Action potential spark dot
          const px = (1 - pulseT) * (1 - pulseT) * arc.x1 + 2 * (1 - pulseT) * pulseT * arc.cx + pulseT * pulseT * arc.x2;
          const py = (1 - pulseT) * (1 - pulseT) * arc.y1 + 2 * (1 - pulseT) * pulseT * arc.cy + pulseT * pulseT * arc.y2;
          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = '#facc15';
          ctx.shadowBlur = 6;
          ctx.beginPath();
          ctx.arc(px, py, 1.6, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        });
      }

      // 4. Draw Active Electrode Glowing Center Ring
      ctx.shadowColor = 'rgba(249, 115, 22, 1)';
      ctx.shadowBlur = 16;
      ctx.fillStyle = '#ffedd5';
      ctx.beginPath();
      ctx.arc(e7X, e7Y, 6 * zoomLevel, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#f97316';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(e7X, e7Y, 8.5 * zoomLevel, 0, Math.PI * 2);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // 5. Draw "Electrode 07" Callout Pin
      const tagX = e7X - 5;
      const tagY = e7Y - 32;

      // Leader line
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(e7X, e7Y - 8);
      ctx.lineTo(tagX + 35, tagY + 10);
      ctx.stroke();

      // Pin badge box
      const badgeW = 76;
      const badgeH = 20;
      ctx.fillStyle = 'rgba(11, 18, 34, 0.92)';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(tagX, tagY - badgeH / 2, badgeW, badgeH, 5);
      ctx.fill();
      ctx.stroke();

      ctx.font = 'bold 10.5px Inter, sans-serif';
      ctx.fillStyle = '#f8fafc';
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';
      ctx.fillText(
        `Electrode ${selectedElectrode < 10 ? '0' + selectedElectrode : selectedElectrode}`,
        tagX + badgeW / 2,
        tagY
      );

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [
    rotX,
    rotY,
    autoRotate,
    zoomLevel,
    selectedElectrode,
    amplitude,
    spatialSpread,
    showField,
    showFibers,
    showAnatomy,
    activeView,
  ]);

  return (
    <div className="relative bg-[#090f1e] border border-[#18233c] rounded-2xl overflow-hidden shadow-2xl flex flex-col h-full">
      {/* Top Header of Card */}
      <div className="p-4 pb-2 flex items-center justify-between border-b border-[#18233c]/60 bg-[#0a1021]/80 backdrop-blur-sm z-10">
        <div>
          <h2 className="text-base font-bold text-white tracking-wide">
            3D Cochlear Visualization
          </h2>
          <p className="text-xs text-slate-400">
            Interactive cochlea with electrode array, electrical field and auditory nerve fibers
          </p>
        </div>

        {/* View Mode Segmented Tabs */}
        <div className="flex items-center gap-1 bg-[#101a30] p-1 rounded-lg border border-[#1e2f4f]">
          <button
            onClick={() => setActiveView('3d')}
            className={`px-3 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
              activeView === '3d'
                ? 'bg-[#2563eb] text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            3D View
          </button>
          <button
            onClick={() => setActiveView('cross-section')}
            className={`px-3 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
              activeView === 'cross-section'
                ? 'bg-[#2563eb] text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Cross Section
          </button>
          <button
            onClick={() => setActiveView('longitudinal')}
            className={`px-3 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
              activeView === 'longitudinal'
                ? 'bg-[#2563eb] text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Longitudinal
          </button>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="relative flex-1 min-h-[380px] cursor-grab active:cursor-grabbing select-none overflow-hidden">
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          className="w-full h-full block"
        />

        {/* Floating HUD Controls Overlay (Top Left) */}
        <div className="absolute top-4 left-4 bg-[#0a1122]/90 backdrop-blur-md border border-[#1e2d4d] rounded-xl p-2.5 shadow-2xl space-y-2 select-none w-44 z-10">
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              autoRotate
                ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-300 hover:bg-[#14203a]'
            }`}
          >
            <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
            <span>Rotate</span>
          </button>

          <button
            onClick={() => setZoomLevel((z) => (z >= 1.6 ? 1 : z + 0.3))}
            className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-[#14203a] transition-all cursor-pointer"
          >
            <ZoomIn className="w-3.5 h-3.5 text-slate-400" />
            <span>Zoom {zoomLevel !== 1 ? `(${Math.round(zoomLevel * 100)}%)` : ''}</span>
          </button>

          <button
            onClick={() =>
              setActiveView(activeView === 'cross-section' ? '3d' : 'cross-section')
            }
            className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeView === 'cross-section'
                ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-300 hover:bg-[#14203a]'
            }`}
          >
            <Scissors className="w-3.5 h-3.5 text-slate-400" />
            <span>Cross Section</span>
          </button>

          <div className="pt-2 border-t border-[#18233c] space-y-2">
            {/* Show Field Toggle */}
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-orange-400 shadow-[0_0_6px_rgba(251,146,60,0.8)]" />
                Show Field
              </span>
              <button
                onClick={() => setShowField(!showField)}
                className={`w-8 h-4 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                  showField ? 'bg-cyan-500 justify-end' : 'bg-slate-700 justify-start'
                }`}
              >
                <span className="w-3 h-3 rounded-full bg-white shadow-sm" />
              </button>
            </div>

            {/* Show Fibers Toggle */}
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-yellow-400 shadow-[0_0_6px_rgba(250,204,21,0.8)]" />
                Show Fibers
              </span>
              <button
                onClick={() => setShowFibers(!showFibers)}
                className={`w-8 h-4 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                  showFibers ? 'bg-cyan-500 justify-end' : 'bg-slate-700 justify-start'
                }`}
              >
                <span className="w-3 h-3 rounded-full bg-white shadow-sm" />
              </button>
            </div>

            {/* Show Anatomy Toggle */}
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(56,189,248,0.8)]" />
                Show Anatomy
              </span>
              <button
                onClick={() => setShowAnatomy(!showAnatomy)}
                className={`w-8 h-4 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                  showAnatomy ? 'bg-cyan-500 justify-end' : 'bg-slate-700 justify-start'
                }`}
              >
                <span className="w-3 h-3 rounded-full bg-white shadow-sm" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Legend */}
        <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-6 text-[11px] font-medium text-slate-300 pointer-events-none z-10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(56,189,248,0.8)]" />
            <span>Cochlear Spiral</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300 shadow-[0_0_4px_rgba(203,213,225,0.6)]" />
            <span>Electrode Array</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-[0_0_6px_rgba(249,115,22,0.8)]" />
            <span>Electrical Field</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 shadow-[0_0_6px_rgba(250,204,21,0.8)]" />
            <span>Auditory Nerve Fibers</span>
          </div>
        </div>
      </div>
    </div>
  );
};
