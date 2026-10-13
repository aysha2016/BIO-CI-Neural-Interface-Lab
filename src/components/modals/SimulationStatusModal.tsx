import React from 'react';
import { X, CheckCircle, ShieldAlert, Cpu, Database, Hash, Clock, AlertTriangle } from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

interface SimulationStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SimulationStatusModal: React.FC<SimulationStatusModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { lastSimTimestamp, settings, modelType } = useSimulation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#0b1324] border border-[#23355e] rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#152342] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Simulation Engine Status</h3>
            <p className="text-xs text-slate-400">Real-time computational runtime diagnostics</p>
          </div>
        </div>

        <div className="space-y-3 text-xs">
          <div className="p-3 rounded-xl bg-[#0e172a] border border-[#1b2742] flex justify-between items-center">
            <span className="text-slate-400 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              Simulation Engine:
            </span>
            <span className="font-bold font-mono text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Active (Running)
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#0e172a] border border-[#1b2742] flex justify-between items-center">
            <span className="text-slate-400 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-purple-400" />
              Active Model Architecture:
            </span>
            <span className="font-bold font-mono text-cyan-300 capitalize">
              {modelType} Biomechanics
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#0e172a] border border-[#1b2742] flex justify-between items-center">
            <span className="text-slate-400 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              Clinical Validation:
            </span>
            <span className="font-bold font-mono text-rose-400">
              No (Non-Clinical Prototype)
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#0e172a] border border-[#1b2742] flex justify-between items-center">
            <span className="text-slate-400 flex items-center gap-2">
              <Database className="w-4 h-4 text-blue-400" />
              Dataset Source:
            </span>
            <span className="font-bold font-mono text-slate-200">
              Demonstration / Configurable
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#0e172a] border border-[#1b2742] flex justify-between items-center">
            <span className="text-slate-400 flex items-center gap-2">
              <Hash className="w-4 h-4 text-indigo-400" />
              Stochastic Random Seed:
            </span>
            <span className="font-bold font-mono text-cyan-400">
              {settings.randomSeed}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#0e172a] border border-[#1b2742] flex justify-between items-center">
            <span className="text-slate-400 flex items-center gap-2">
              <Clock className="w-4 h-4 text-teal-400" />
              Last Simulation Cycle:
            </span>
            <span className="font-mono text-slate-300">
              {lastSimTimestamp}
            </span>
          </div>
        </div>

        <div className="mt-4 p-3 bg-amber-950/40 border border-amber-500/40 rounded-xl text-[11px] text-amber-200/90 leading-tight">
          <strong>Important Research Notice:</strong> This software is an academic engineering model for studying electrode current propagation. Do not interpret data as patient diagnostic telemetry.
        </div>

        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
