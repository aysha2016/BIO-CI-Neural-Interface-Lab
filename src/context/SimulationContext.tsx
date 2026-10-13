import React, { createContext, useContext, useState, useMemo } from 'react';
import {
  ModelType,
  SimulationSettings,
  ExperimentRun,
} from '../types/simulation';

interface SimulationContextType {
  // Navigation & Modes
  activeTab: string;
  setActiveTab: (tab: string) => void;
  researchMode: boolean;
  setResearchMode: (val: boolean) => void;

  // Primary Electrode & Stimulation Parameters
  selectedElectrode: number;
  setSelectedElectrode: (num: number) => void;
  amplitude: number;
  setAmplitude: (num: number) => void;
  impedance: number;
  setImpedance: (num: number) => void;
  spatialSpread: number;
  setSpatialSpread: (num: number) => void;
  pulseWidth: number;
  setPulseWidth: (num: number) => void;
  pulseRate: number;
  setPulseRate: (num: number) => void;

  // Neural Biophysics
  modelType: ModelType;
  setModelType: (t: ModelType) => void;
  membranePotential: number;
  setMembranePotential: (v: number) => void;
  threshold: number;
  setThreshold: (v: number) => void;
  membraneTimeConstant: number;
  setMembraneTimeConstant: (v: number) => void;
  refractoryDuration: number;
  setRefractoryDuration: (v: number) => void;
  adaptationStrength: number;
  setAdaptationStrength: (v: number) => void;
  recoveryRate: number;
  setRecoveryRate: (v: number) => void;
  synapticDecay: number;
  setSynapticDecay: (v: number) => void;

  // Population & Anatomy
  tissueConductivity: number;
  setTissueConductivity: (v: number) => void;
  neuralSurvival: number;
  setNeuralSurvival: (v: number) => void;
  fiberHeterogeneity: number;
  setFiberHeterogeneity: (v: number) => void;
  numFibers: number;
  setNumFibers: (v: number) => void;

  // Settings & Experiments
  settings: SimulationSettings;
  updateSettings: (newSettings: Partial<SimulationSettings>) => void;
  experiments: ExperimentRun[];
  addExperiment: (exp: ExperimentRun) => void;
  deleteExperiment: (id: string) => void;
  lastSimTimestamp: string;

  // Synchronized Derived Biophysical Metrics
  metrics: {
    neuralSelectivity: number;
    spatialActivationWidth: number;
    spikeTimingPrecision: number;
    activationProbability: number;
    spikeSparsity: number;
    temporalFidelity: number;
    nearbyFibers: number;
    estimatedSpread: number;
  };

  runSimulationStep: () => void;
}

const defaultSettings: SimulationSettings = {
  dt: 10,
  frameRate: 60,
  animationSpeed: 1,
  randomSeed: 42,
  visualizationQuality: 'High',
  numFibers: 50,
  numElectrodes: 16,
  chartSmoothing: true,
  enableGpuSimulation: false,
  enableStochasticActivity: true,
  enableAdaptiveNeuron: true,
};

const initialExperiments: ExperimentRun[] = [
  {
    id: 'EXP-1042',
    name: 'Spatial Spread Benchmark (Monopolar vs Focused)',
    researchQuestion: 'How does current spread influence the spatial selectivity of auditory nerve activation?',
    hypothesis: 'Reducing current spread should decrease cross-channel fiber recruitment and elevate speech representation fidelity.',
    timestamp: '2026-10-12 07:45:10',
    model: 'biological',
    electrode: 7,
    current: 450,
    pulseRate: 900,
    currentSpread: 42,
    neuralSurvival: 85,
    refractoryPeriod: 1.8,
    adaptation: 0.45,
    decoder: 'Adaptive-LIF',
    results: {
      selectivity: 0.72,
      activationWidth: 0.86,
      timingPrecision: 0.41,
      activationProb: 62,
      sparsity: 0.68,
      temporalFidelity: 0.74,
      meanFiringRate: 74,
      activatedFibersPercent: 76,
    },
    interpretation: 'Moderate 42% spread recruits ~38 fibers with strong phase-locking. Spatial selectivity 0.72 demonstrates distinct tonotopic envelope representation.',
  },
  {
    id: 'EXP-1038',
    name: 'High-Rate Refractory Entrainment Test',
    researchQuestion: 'Does stimulation above 1200 pps trigger neural adaptation fatigue in auditory nerve fibers?',
    hypothesis: 'At high rates exceeding inverse ARP, absolute refractoriness limits spike synchrony, causing phase slip.',
    timestamp: '2026-10-12 06:12:30',
    model: 'adaptive',
    electrode: 4,
    current: 520,
    pulseRate: 1500,
    currentSpread: 35,
    neuralSurvival: 90,
    refractoryPeriod: 2.2,
    adaptation: 0.65,
    decoder: 'Adaptive-LIF',
    results: {
      selectivity: 0.78,
      activationWidth: 0.72,
      timingPrecision: 0.58,
      activationProb: 74,
      sparsity: 0.54,
      temporalFidelity: 0.61,
      meanFiringRate: 112,
      activatedFibersPercent: 82,
    },
    interpretation: 'Elevated rate induced 28% drop in temporal fidelity due to accumulation in relative refractory period states.',
  },
];

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

export const SimulationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [researchMode, setResearchMode] = useState(true);

  // Electrode parameters
  const [selectedElectrode, setSelectedElectrode] = useState(7);
  const [amplitude, setAmplitude] = useState(450);
  const [impedance, setImpedance] = useState(8.2);
  const [spatialSpread, setSpatialSpread] = useState(42);
  const [pulseWidth, setPulseWidth] = useState(25);
  const [pulseRate, setPulseRate] = useState(900);

  // Biophysics
  const [modelType, setModelType] = useState<ModelType>('biological');
  const [membranePotential, setMembranePotential] = useState(-70);
  const [threshold, setThreshold] = useState(-55);
  const [membraneTimeConstant, setMembraneTimeConstant] = useState(0.35);
  const [refractoryDuration, setRefractoryDuration] = useState(1.8);
  const [adaptationStrength, setAdaptationStrength] = useState(0.45);
  const [recoveryRate, setRecoveryRate] = useState(25);
  const [synapticDecay, setSynapticDecay] = useState(5.0);

  // Population & Anatomy
  const [tissueConductivity, setTissueConductivity] = useState(1.4);
  const [neuralSurvival, setNeuralSurvival] = useState(85);
  const [fiberHeterogeneity, setFiberHeterogeneity] = useState(0.35);
  const [numFibers, setNumFibers] = useState(50);

  // Settings & Experiments
  const [settings, setSettings] = useState<SimulationSettings>(defaultSettings);
  const [experiments, setExperiments] = useState<ExperimentRun[]>(initialExperiments);
  const [lastSimTimestamp, setLastSimTimestamp] = useState<string>(
    new Date().toLocaleTimeString()
  );

  const updateSettings = (newSettings: Partial<SimulationSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const addExperiment = (exp: ExperimentRun) => {
    setExperiments((prev) => [exp, ...prev]);
  };

  const deleteExperiment = (id: string) => {
    setExperiments((prev) => prev.filter((e) => e.id !== id));
  };

  const runSimulationStep = () => {
    setLastSimTimestamp(new Date().toLocaleTimeString());
  };

  // Synchronized derived biophysical metrics calculation:
  // Propagates cause-and-effect across:
  // Amplitude, Spread, Refractory, Adaptation, Heterogeneity, Survival
  const metrics = useMemo(() => {
    // Spatial spread impact: wider spread lowers selectivity, increases activation width
    const spreadNorm = spatialSpread / 42;
    const ampNorm = amplitude / 450;
    const survivalNorm = neuralSurvival / 100;
    const refrNorm = refractoryDuration / 1.8;
    const adaptNorm = 1 - adaptationStrength * 0.3;

    // 1. Neural Selectivity: decreases with wider spread, increases with focused current
    const selectivity = Math.max(
      0.2,
      Math.min(0.98, 0.72 * (1 / Math.sqrt(spreadNorm)) * (modelType === 'biological' ? 1.05 : 0.88))
    );

    // 2. Spatial Activation Width: in mm, directly expands with spread and amplitude
    const activationWidth = Math.max(
      0.25,
      Number((0.86 * spreadNorm * Math.sqrt(ampNorm)).toFixed(2))
    );

    // 3. Spike Timing Precision: in ms, jitter degrades with higher refractory duration and low survival
    const timingPrecision = Math.max(
      0.15,
      Number((0.41 * Math.sqrt(refrNorm) * (1.1 - survivalNorm * 0.1)).toFixed(2))
    );

    // 4. Activation Probability (%): proportional to amplitude & survival, penalized by high threshold
    const activationProb = Math.min(
      98,
      Math.max(
        10,
        Math.round(62 * ampNorm * survivalNorm * (pulseWidth / 25) * adaptNorm)
      )
    );

    // 5. Spike Sparsity: fraction of silence vs burst, increases when fibers adapt
    const sparsity = Math.max(
      0.25,
      Math.min(0.95, Number((0.68 * (1 + (adaptationStrength - 0.45) * 0.4)).toFixed(2)))
    );

    // 6. Temporal Fidelity: how well spike timings track stimulus envelope
    const temporalFidelity = Math.max(
      0.3,
      Math.min(
        0.98,
        Number(
          (0.74 * (1 / Math.sqrt(refrNorm)) * survivalNorm * (pulseRate <= 1200 ? 1 : 0.85)).toFixed(2)
        )
      )
    );

    // Nearby fibers recruited
    const nearbyFibers = Math.round(
      Math.min(numFibers, (20 + ampNorm * 22 + (spatialSpread / 100) * 18) * survivalNorm)
    );

    // Estimated spread in mm
    const estimatedSpread = Number(
      ((spatialSpread / 100) * 1.5 + (amplitude / 1000) * 0.4).toFixed(1)
    );

    return {
      neuralSelectivity: Number(selectivity.toFixed(2)),
      spatialActivationWidth: activationWidth,
      spikeTimingPrecision: timingPrecision,
      activationProbability: activationProb,
      spikeSparsity: sparsity,
      temporalFidelity: temporalFidelity,
      nearbyFibers,
      estimatedSpread,
    };
  }, [
    amplitude,
    spatialSpread,
    pulseWidth,
    pulseRate,
    refractoryDuration,
    adaptationStrength,
    neuralSurvival,
    modelType,
    numFibers,
  ]);

  return (
    <SimulationContext.Provider
      value={{
        activeTab,
        setActiveTab,
        researchMode,
        setResearchMode,
        selectedElectrode,
        setSelectedElectrode,
        amplitude,
        setAmplitude,
        impedance,
        setImpedance,
        spatialSpread,
        setSpatialSpread,
        pulseWidth,
        setPulseWidth,
        pulseRate,
        setPulseRate,
        modelType,
        setModelType,
        membranePotential,
        setMembranePotential,
        threshold,
        setThreshold,
        membraneTimeConstant,
        setMembraneTimeConstant,
        refractoryDuration,
        setRefractoryDuration,
        adaptationStrength,
        setAdaptationStrength,
        recoveryRate,
        setRecoveryRate,
        synapticDecay,
        setSynapticDecay,
        tissueConductivity,
        setTissueConductivity,
        neuralSurvival,
        setNeuralSurvival,
        fiberHeterogeneity,
        setFiberHeterogeneity,
        numFibers,
        setNumFibers,
        settings,
        updateSettings,
        experiments,
        addExperiment,
        deleteExperiment,
        lastSimTimestamp,
        metrics,
        runSimulationStep,
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
};

export const useSimulation = () => {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error('useSimulation must be used within a SimulationProvider');
  }
  return context;
};
