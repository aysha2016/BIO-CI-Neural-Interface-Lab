import React, { useState } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { ExperimentRun } from '../../types/simulation';
import { FlaskConical, Plus, Play, Trash2, Copy, BarChart2, CheckCircle, FileText } from 'lucide-react';

export const ExperimentsWorkspace: React.FC = () => {
  const {
    experiments,
    addExperiment,
    deleteExperiment,
    amplitude,
    spatialSpread,
    pulseRate,
    selectedElectrode,
    modelType,
    neuralSurvival,
    refractoryDuration,
    adaptationStrength,
    metrics,
  } = useSimulation();

  const [isCreating, setIsCreating] = useState(false);
  const [expName, setExpName] = useState('Tripolar Focused Steering Run');
  const [researchQ, setResearchQ] = useState(
    'How does reducing current spread to 25% improve formant decoding accuracy?'
  );
  const [hypothesis, setHypothesis] = useState(
    'Narrowing current spread will eliminate adjacent electrode fiber overlap.'
  );

  const handleRunNewExperiment = () => {
    const newId = `EXP-${Math.floor(1000 + Math.random() * 9000)}`;
    const newExp: ExperimentRun = {
      id: newId,
      name: expName,
      researchQuestion: researchQ,
      hypothesis,
      timestamp: new Date().toLocaleString(),
      model: modelType,
      electrode: selectedElectrode,
      current: amplitude,
      pulseRate,
      currentSpread: spatialSpread,
      neuralSurvival,
      refractoryPeriod: refractoryDuration,
      adaptation: adaptationStrength,
      decoder: 'Adaptive-LIF',
      results: {
        selectivity: metrics.neuralSelectivity,
        activationWidth: metrics.spatialActivationWidth,
        timingPrecision: metrics.spikeTimingPrecision,
        activationProb: metrics.activationProbability,
        sparsity: metrics.spikeSparsity,
        temporalFidelity: metrics.temporalFidelity,
        meanFiringRate: Math.round(75 * (amplitude / 450)),
        activatedFibersPercent: Math.round((metrics.nearbyFibers / 50) * 100),
      },
      interpretation: `Executed on ${modelType} model with Electrode ${selectedElectrode}. Measured selectivity of ${metrics.neuralSelectivity} with activation width ${metrics.spatialActivationWidth} mm.`,
    };

    addExperiment(newExp);
    setIsCreating(false);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Title & Action Banner */}
      <div className="bg-[#0b1222] border border-[#18233c] rounded-2xl p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-500/40">
              LABORATORY EXPERIMENTS
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/40">
              REPRODUCIBLE PROTOCOLS
            </span>
          </div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-amber-400" />
            Experiment Management & Comparative Benchmarks
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure test protocols, capture multi-parameter simulation runs, and evaluate comparative hypotheses.
          </p>
        </div>

        {/* Create Experiment Button */}
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] cursor-pointer flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>{isCreating ? 'Cancel Configuration' : 'Create Experiment'}</span>
        </button>
      </div>

      {/* Creation Drawer / Form */}
      {isCreating && (
        <div className="bg-[#0d162b] border border-cyan-500/40 rounded-2xl p-5 shadow-2xl space-y-4 animate-fade-in">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <FlaskConical className="w-4 h-4 text-cyan-400" />
            New Simulation Experiment Protocol
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Experiment Name</label>
              <input
                type="text"
                value={expName}
                onChange={(e) => setExpName(e.target.value)}
                className="w-full bg-[#10192e] border border-[#1e2f52] rounded-lg px-3 py-2 text-white font-semibold"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Target Research Question</label>
              <input
                type="text"
                value={researchQ}
                onChange={(e) => setResearchQ(e.target.value)}
                className="w-full bg-[#10192e] border border-[#1e2f52] rounded-lg px-3 py-2 text-cyan-300"
              />
            </div>
          </div>

          <div className="p-3 bg-[#080d19] rounded-xl border border-[#18233c] text-xs flex flex-wrap items-center justify-between gap-4">
            <span className="text-slate-400">Current Lab Parameters to Record:</span>
            <span className="font-mono text-cyan-300">Electrode 0{selectedElectrode}</span>
            <span className="font-mono text-cyan-300">{amplitude} µA</span>
            <span className="font-mono text-cyan-300">{spatialSpread}% Spread</span>
            <span className="font-mono text-cyan-300">{pulseRate} pps</span>
            <span className="font-mono text-cyan-300">{neuralSurvival}% Survival</span>
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsCreating(false)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleRunNewExperiment}
              className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-lg transition-all shadow-lg cursor-pointer flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>RUN EXPERIMENT</span>
            </button>
          </div>
        </div>
      )}

      {/* Experiments List */}
      <div className="space-y-4">
        {experiments.map((exp) => (
          <div
            key={exp.id}
            className="bg-[#0b1222] border border-[#18233c] hover:border-[#22355c] rounded-2xl p-5 shadow-xl transition-all space-y-3"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 pb-2 border-b border-[#18233c]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
                    {exp.id}
                  </span>
                  <h4 className="text-sm font-bold text-white">{exp.name}</h4>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5 italic">
                  “{exp.researchQuestion}”
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500 font-mono text-[11px]">{exp.timestamp}</span>
                <button
                  onClick={() => deleteExperiment(exp.id)}
                  className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                  title="Delete experiment"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Recorded Parameters Strip */}
            <div className="flex flex-wrap items-center gap-2 text-[11px]">
              <span className="px-2 py-0.5 rounded bg-[#10192e] text-slate-300 font-mono">
                Model: {exp.model}
              </span>
              <span className="px-2 py-0.5 rounded bg-[#10192e] text-slate-300 font-mono">
                Electrode: {exp.electrode}
              </span>
              <span className="px-2 py-0.5 rounded bg-[#10192e] text-slate-300 font-mono">
                Current: {exp.current} µA
              </span>
              <span className="px-2 py-0.5 rounded bg-[#10192e] text-slate-300 font-mono">
                Spread: {exp.currentSpread}%
              </span>
              <span className="px-2 py-0.5 rounded bg-[#10192e] text-slate-300 font-mono">
                Rate: {exp.pulseRate} pps
              </span>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
              <div className="p-2 rounded-xl bg-[#090f1d] border border-[#16233e]">
                <span className="text-[10px] text-slate-400 block">Selectivity:</span>
                <span className="font-bold font-mono text-cyan-300">{exp.results.selectivity}</span>
              </div>
              <div className="p-2 rounded-xl bg-[#090f1d] border border-[#16233e]">
                <span className="text-[10px] text-slate-400 block">Activation Width:</span>
                <span className="font-bold font-mono text-purple-300">{exp.results.activationWidth} mm</span>
              </div>
              <div className="p-2 rounded-xl bg-[#090f1d] border border-[#16233e]">
                <span className="text-[10px] text-slate-400 block">Timing Precision:</span>
                <span className="font-bold font-mono text-indigo-300">{exp.results.timingPrecision} ms</span>
              </div>
              <div className="p-2 rounded-xl bg-[#090f1d] border border-[#16233e]">
                <span className="text-[10px] text-slate-400 block">Activation Prob:</span>
                <span className="font-bold font-mono text-emerald-300">{exp.results.activationProb}%</span>
              </div>
              <div className="p-2 rounded-xl bg-[#090f1d] border border-[#16233e]">
                <span className="text-[10px] text-slate-400 block">Spike Sparsity:</span>
                <span className="font-bold font-mono text-slate-200">{exp.results.sparsity}</span>
              </div>
              <div className="p-2 rounded-xl bg-[#090f1d] border border-[#16233e]">
                <span className="text-[10px] text-slate-400 block">Temporal Fidelity:</span>
                <span className="font-bold font-mono text-pink-300">{exp.results.temporalFidelity}</span>
              </div>
            </div>

            {/* Interpretation */}
            <div className="p-3 bg-[#080d19] rounded-xl border border-[#16233e] text-[11px] text-slate-300 flex items-start gap-2">
              <FileText className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>{exp.interpretation}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
