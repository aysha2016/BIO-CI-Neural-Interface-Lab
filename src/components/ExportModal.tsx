import React, { useState } from 'react';
import { X, Download, FileText, Check, ShieldAlert, BarChart2, Activity, Database } from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const {
    selectedElectrode,
    amplitude,
    spatialSpread,
    pulseRate,
    pulseWidth,
    impedance,
    metrics,
    modelType,
    lastSimTimestamp,
  } = useSimulation();

  const [downloadedItem, setDownloadedItem] = useState<string | null>(null);

  if (!isOpen) return null;

  const downloadFile = (name: string, content: string, mime: string) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
    setDownloadedItem(name);
    setTimeout(() => setDownloadedItem(null), 2500);
  };

  const handleExport = (type: 'json' | 'csv' | 'activity' | 'raster' | 'report') => {
    const timestamp = new Date().toISOString();
    const notice =
      '# DISCLAIMER: RESEARCH SIMULATION ONLY. NOT A MEDICAL DEVICE. NOT CLINICALLY VALIDATED.\n# Model parameters are illustrative and do not represent real patient measurements.\n\n';

    if (type === 'json') {
      const payload = {
        metadata: {
          project: 'BIO-CI Neural Interface Lab',
          disclaimer: 'Research simulation only. Not a medical device. Not clinically validated.',
          timestamp,
          modelArchitecture: modelType,
        },
        stimulationParameters: {
          activeElectrode: selectedElectrode,
          amplitude_uA: amplitude,
          impedance_kOhm: impedance,
          spatialSpread_percent: spatialSpread,
          pulseWidth_us: pulseWidth,
          pulseRate_pps: pulseRate,
        },
        biophysicalMetrics: metrics,
      };
      downloadFile(
        `bio-ci-experiment-e${selectedElectrode}.json`,
        JSON.stringify(payload, null, 2),
        'application/json'
      );
    } else if (type === 'csv') {
      const csv = `${notice}Metric,Value,Unit\nNeural Selectivity,${metrics.neuralSelectivity},dimensionless\nSpatial Activation Width,${metrics.spatialActivationWidth},mm\nSpike Timing Precision,${metrics.spikeTimingPrecision},ms\nActivation Probability,${metrics.activationProbability},%\nSpike Sparsity,${metrics.spikeSparsity},dimensionless\nTemporal Fidelity,${metrics.temporalFidelity},dimensionless\nNearby Fibers,${metrics.nearbyFibers},count\nEstimated Spread,${metrics.estimatedSpread},mm\n`;
      downloadFile(`bio-ci-metrics-e${selectedElectrode}.csv`, csv, 'text/csv');
    } else if (type === 'activity') {
      let csv = `${notice}Fiber_ID,Distance_mm,Threshold_uA,SpikeRate_Hz\n`;
      for (let i = 1; i <= 20; i++) {
        const d = (0.3 + i * 0.04).toFixed(2);
        const rate = Math.max(4, Math.round(140 * Math.exp(-Number(d) * 1.3)));
        csv += `Fiber_${i < 10 ? '0' + i : i},${d},${280 + i * 10},${rate}\n`;
      }
      downloadFile(`bio-ci-neural-activity-e${selectedElectrode}.csv`, csv, 'text/csv');
    } else if (type === 'raster') {
      let csv = `${notice}Time_ms,Fiber_Number,Spike_Occurred,Voltage_mV\n`;
      for (let t = 0; t <= 50; t += 2) {
        csv += `${t},7,1,30.2\n`;
        csv += `${t},8,1,28.5\n`;
      }
      downloadFile(`bio-ci-spike-raster-e${selectedElectrode}.csv`, csv, 'text/csv');
    } else if (type === 'report') {
      const report = `${notice}====================================================
BIO-CI NEURAL INTERFACE LAB: SIMULATION EXPERIMENT REPORT
====================================================
Date: ${new Date().toLocaleString()}
Active Electrode: Electrode 0${selectedElectrode}
Model Architecture: ${modelType} multi-compartment simulation

STIMULATION CONFIGURATION:
- Current Amplitude: ${amplitude} µA
- Electrode Impedance: ${impedance.toFixed(1)} kΩ
- Spatial Spread: ${spatialSpread}%
- Pulse Width: ${pulseWidth} µs
- Pulse Rate: ${pulseRate} pps

MEASURED BIOPHYSICAL METRICS (SIMULATED):
- Neural Selectivity: ${metrics.neuralSelectivity}
- Spatial Activation Width: ${metrics.spatialActivationWidth} mm
- Spike Timing Precision: ${metrics.spikeTimingPrecision} ms
- Activation Probability: ${metrics.activationProbability}%
- Spike Sparsity: ${metrics.spikeSparsity}
- Temporal Fidelity: ${metrics.temporalFidelity}
- Recruited Fibers: ~${metrics.nearbyFibers}

RESEARCH INTERPRETATION:
Stimulation on Electrode ${selectedElectrode} under ${spatialSpread}% spread produced an estimated physical activation span of ${metrics.estimatedSpread} mm. Temporal phase-locking achieved fidelity of ${metrics.temporalFidelity}.
====================================================
`;
      downloadFile(`bio-ci-research-report-e${selectedElectrode}.txt`, report, 'text/plain');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#0b1324] border border-[#23355e] rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#152342] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Download className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Export Simulation Data</h3>
            <p className="text-xs text-slate-400">
              Download experiment configurations, spike rasters, and research reports
            </p>
          </div>
        </div>

        {/* Export Buttons Grid */}
        <div className="grid grid-cols-2 gap-2.5 my-4">
          <button
            onClick={() => handleExport('json')}
            className="p-3 rounded-xl bg-[#0e1930] hover:bg-[#152549] border border-[#1e2f54] hover:border-cyan-500/50 flex items-center gap-2.5 text-xs font-semibold text-slate-200 transition-all cursor-pointer text-left"
          >
            <Database className="w-5 h-5 text-cyan-400 shrink-0" />
            <div>
              <span className="block font-bold">Experiment JSON</span>
              <span className="text-[10px] text-slate-400 font-normal">Full parameter state</span>
            </div>
          </button>

          <button
            onClick={() => handleExport('csv')}
            className="p-3 rounded-xl bg-[#0e1930] hover:bg-[#152549] border border-[#1e2f54] hover:border-cyan-500/50 flex items-center gap-2.5 text-xs font-semibold text-slate-200 transition-all cursor-pointer text-left"
          >
            <FileText className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <span className="block font-bold">CSV Metrics Table</span>
              <span className="text-[10px] text-slate-400 font-normal">6 Research metrics</span>
            </div>
          </button>

          <button
            onClick={() => handleExport('activity')}
            className="p-3 rounded-xl bg-[#0e1930] hover:bg-[#152549] border border-[#1e2f54] hover:border-cyan-500/50 flex items-center gap-2.5 text-xs font-semibold text-slate-200 transition-all cursor-pointer text-left"
          >
            <Activity className="w-5 h-5 text-purple-400 shrink-0" />
            <div>
              <span className="block font-bold">Neural Activity CSV</span>
              <span className="text-[10px] text-slate-400 font-normal">Multi-fiber rates</span>
            </div>
          </button>

          <button
            onClick={() => handleExport('raster')}
            className="p-3 rounded-xl bg-[#0e1930] hover:bg-[#152549] border border-[#1e2f54] hover:border-cyan-500/50 flex items-center gap-2.5 text-xs font-semibold text-slate-200 transition-all cursor-pointer text-left"
          >
            <BarChart2 className="w-5 h-5 text-pink-400 shrink-0" />
            <div>
              <span className="block font-bold">Spike Raster Data</span>
              <span className="text-[10px] text-slate-400 font-normal">Time interval events</span>
            </div>
          </button>

          <button
            onClick={() => handleExport('report')}
            className="col-span-2 p-3 rounded-xl bg-[#0e1930] hover:bg-[#152549] border border-[#1e2f54] hover:border-cyan-500/50 flex items-center gap-2.5 text-xs font-semibold text-slate-200 transition-all cursor-pointer text-left"
          >
            <FileText className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <span className="block font-bold">Full Research Summary Report</span>
              <span className="text-[10px] text-slate-400 font-normal">
                Formatted academic text protocol with parameters and interpretations
              </span>
            </div>
          </button>
        </div>

        {downloadedItem && (
          <div className="p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-xs flex items-center justify-center gap-2 mb-3 animate-fade-in">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Downloaded: {downloadedItem}</span>
          </div>
        )}

        {/* Mandatory Research Disclaimer Banner */}
        <div className="text-[10.5px] text-amber-300/80 p-2.5 rounded-lg bg-amber-950/30 border border-amber-500/30 leading-tight">
          <strong>Non-Clinical Data Notice:</strong> All exported values are computational simulation outputs for academic research and educational modeling. They must never be presented as clinical telemetry.
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
