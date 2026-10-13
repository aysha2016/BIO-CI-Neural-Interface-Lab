export type ModelType = 'simplified' | 'biological' | 'adaptive';

export interface ElectrodeParams {
  id: number;
  name: string;
  amplitude: number; // µA
  impedance: number; // kΩ
  spatialSpread: number; // %
  pulseWidth: number; // µs
  pulseRate: number; // pps
  frequencyTonotopic: number; // Hz (Greenwood)
  insertionAngle: number; // degrees
  nearbyFibers: number;
  activationProb: number; // %
  estimatedSpread: number; // mm
}

export interface FiberData {
  id: number;
  name: string;
  distance: number; // mm
  threshold: number; // µA
  latency: number; // ms
  excitability: number; // 0..1
  survival: boolean;
  spikeRate: number; // Hz
  waveformData: number[];
}

export interface SimulationSettings {
  dt: number; // µs (e.g. 10)
  frameRate: number; // fps (60)
  animationSpeed: number; // 1x, 2x, etc.
  randomSeed: number; // 42
  visualizationQuality: 'Standard' | 'High' | 'Ultra';
  numFibers: number; // 20 - 100
  numElectrodes: number; // 16 or 22
  chartSmoothing: boolean;
  enableGpuSimulation: boolean;
  enableStochasticActivity: boolean;
  enableAdaptiveNeuron: boolean;
}

export interface ExperimentRun {
  id: string;
  name: string;
  researchQuestion: string;
  hypothesis: string;
  timestamp: string;
  model: ModelType;
  electrode: number;
  current: number;
  pulseRate: number;
  currentSpread: number;
  neuralSurvival: number;
  refractoryPeriod: number;
  adaptation: number;
  decoder: 'LIF' | 'Adaptive-LIF';
  results: {
    selectivity: number;
    activationWidth: number;
    timingPrecision: number;
    activationProb: number;
    sparsity: number;
    temporalFidelity: number;
    meanFiringRate: number;
    activatedFibersPercent: number;
  };
  interpretation: string;
}

export interface ScientificInsight {
  id: string;
  category: 'PAPER FINDING' | 'SIMULATION' | 'RESEARCH HYPOTHESIS';
  title: string;
  description: string;
  parameterContext: string;
  reference?: string;
}

export interface ParameterTooltipData {
  title: string;
  represents: string;
  whyMatters: string;
  affects: string;
}
