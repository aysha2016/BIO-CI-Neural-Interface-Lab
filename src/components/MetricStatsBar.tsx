import React from 'react';
import {
  Network,
  Target,
  GitBranch,
  Crosshair,
  BarChart2,
  Activity,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';

interface MetricStatsBarProps {
  amplitude: number;
  spatialSpread: number;
  onMetricClick?: (metricName: string) => void;
}

export const MetricStatsBar: React.FC<MetricStatsBarProps> = ({
  amplitude,
  spatialSpread,
  onMetricClick,
}) => {
  const { metrics } = useSimulation();

  const stats = [
    {
      label: 'Neural Selectivity',
      value: `${metrics.neuralSelectivity}`,
      change: '12%',
      arrow: 'up',
      icon: Network,
      bgGrad: 'from-blue-600/30 to-cyan-500/20 border-cyan-500/40 text-cyan-400',
    },
    {
      label: 'Spatial Activation Width',
      value: `${metrics.spatialActivationWidth} mm`,
      change: '28%',
      arrow: 'down',
      icon: Target,
      bgGrad: 'from-fuchsia-600/30 to-purple-500/20 border-purple-500/40 text-purple-400',
    },
    {
      label: 'Spike Timing Precision',
      value: `${metrics.spikeTimingPrecision} ms`,
      change: '18%',
      arrow: 'up',
      icon: GitBranch,
      bgGrad: 'from-indigo-600/30 to-violet-500/20 border-indigo-500/40 text-indigo-400',
    },
    {
      label: 'Activation Probability',
      value: `${metrics.activationProbability}%`,
      change: '15%',
      arrow: 'up',
      icon: Crosshair,
      bgGrad: 'from-blue-600/30 to-indigo-500/20 border-blue-500/40 text-blue-400',
    },
    {
      label: 'Spike Sparsity',
      value: `${metrics.spikeSparsity}`,
      change: '22%',
      arrow: 'up',
      icon: BarChart2,
      bgGrad: 'from-violet-600/30 to-purple-500/20 border-violet-500/40 text-violet-400',
    },
    {
      label: 'Temporal Fidelity',
      value: `${metrics.temporalFidelity}`,
      change: '16%',
      arrow: 'up',
      icon: Activity,
      bgGrad: 'from-pink-600/30 to-rose-500/20 border-rose-500/40 text-rose-400',
    },
  ];

  return (
    <div className="space-y-3 pt-1">
      {/* 6 KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              type="button"
              onClick={() => onMetricClick?.(item.label)}
              className="bg-[#0b1222] border border-[#18233c] hover:border-cyan-500/60 p-3 rounded-2xl flex items-center gap-3 transition-all shadow-md group text-left cursor-pointer hover:shadow-[0_0_15px_rgba(6,182,212,0.15)]"
            >
              {/* Circular Icon with gradient */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-gradient-to-tr border shadow-sm group-hover:scale-105 transition-transform ${item.bgGrad}`}
              >
                <Icon className="w-5 h-5 stroke-[2]" />
              </div>

              {/* Data Values */}
              <div className="min-w-0 flex-1">
                <div className="text-[10px] text-slate-400 truncate font-medium">
                  {item.label}
                </div>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-sm font-bold font-mono text-white">
                    {item.value}
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-400 flex items-center shrink-0">
                    {item.arrow === 'up' ? (
                      <ArrowUp className="w-2.5 h-2.5 stroke-[2.5]" />
                    ) : (
                      <ArrowDown className="w-2.5 h-2.5 stroke-[2.5]" />
                    )}
                    {item.change}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer Disclaimer Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-[#131d33]">
        <p>
          BIO-CI Neural Interface Lab • Research simulation only. Not a medical device. Not clinically validated.
        </p>
        <p>Model parameters are illustrative and do not represent real patient measurements.</p>
      </div>
    </div>
  );
};
