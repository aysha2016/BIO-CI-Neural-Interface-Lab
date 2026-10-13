import { ParameterTooltipData } from '../types/simulation';

export const PARAM_TOOLTIPS: Record<string, ParameterTooltipData> = {
  amplitude: {
    title: 'Current Amplitude (µA)',
    represents: 'The peak electrical current delivered through the active electrode contact during cathodic phase.',
    whyMatters: 'Determines the electric potential gradient across nerve fiber membranes to trigger action potentials.',
    affects: 'Higher amplitude recruits more auditory nerve fibers further from the electrode, increasing overall firing rate but expanding spatial spread.',
  },
  impedance: {
    title: 'Electrode Impedance (kΩ)',
    represents: 'The electrical resistance and capacitive reactance at the electrode-tissue perilymph interface.',
    whyMatters: 'Reflects contact integrity, protein coating, fibrous tissue growth, and voltage required for charge delivery.',
    affects: 'Higher impedance increases compliance voltage requirements and local voltage drop around the electrode.',
  },
  spatialSpread: {
    title: 'Current Spread (%)',
    represents: 'The spatial dispersion of electrical current through fluid and bone tissue away from the electrode.',
    whyMatters: 'Cochlear implants rely on tonotopic channel isolation; wide spread causes channel crosstalk and degrades speech perception.',
    affects: 'Higher values produce broad activation of neighboring fibers, decreasing neural selectivity and speech formant discrimination.',
  },
  pulseWidth: {
    title: 'Pulse Width (µs)',
    represents: 'Duration of the individual cathodic and anodic phases of the biphasic current pulse.',
    whyMatters: 'Governs charge per phase ($Q = I \\times t_{pw}$) essential for charge-balanced safe neural excitation.',
    affects: 'Longer pulse widths lower the required threshold current amplitude but reduce maximum achievable stimulation rate.',
  },
  pulseRate: {
    title: 'Pulse Rate (pps)',
    represents: 'Stimulation frequency in pulses-per-second delivered by the cochlear implant processor.',
    whyMatters: 'Determines temporal envelope sampling and interacts directly with auditory nerve fiber refractoriness and adaptation.',
    affects: 'High rates (>1000 pps) improve temporal envelope resolution but trigger refractory fatigue and spike rate adaptation.',
  },
  refractoryDuration: {
    title: 'Refractory Duration (ms)',
    represents: 'The combined absolute (ARP ~0.7ms) and relative (RRP ~1.5-3.0ms) recovery periods following an action potential.',
    whyMatters: 'Biophysical ion channel gating recovery limits how rapidly a single nerve fiber can fire consecutive spikes.',
    affects: 'Longer refractory periods decrease high-frequency pulse entrainment and increase inter-spike interval (ISI) dispersion.',
  },
  adaptationStrength: {
    title: 'Adaptation Strength',
    represents: 'Rate of spike frequency reduction and threshold elevation during continuous electrical pulse train delivery.',
    whyMatters: 'Real auditory nerves adapt significantly over tens of milliseconds due to slow potassium channels and ion depletion.',
    affects: 'Stronger adaptation reduces steady-state firing rates relative to onset bursts, modulating temporal contrast.',
  },
  recoveryRate: {
    title: 'Recovery Rate (ms)',
    represents: 'Time constant for the fiber to return to its un-adapted, baseline resting threshold after stimulation ceases.',
    whyMatters: 'Dictates forward masking in cochlear implants, where preceding pulses suppress responses to subsequent pulses.',
    affects: 'Slower recovery produces longer forward masking periods across overlapping acoustic phonemes.',
  },
  membraneTimeConstant: {
    title: 'Membrane Time Constant (τ_m, ms)',
    represents: 'Product of membrane resistance and capacitance (R_m × C_m), defining passive subthreshold voltage integration time.',
    whyMatters: 'Determines how quickly the axon membrane charges and discharges in response to extracellular electrical stimulation.',
    affects: 'Shorter time constants require faster pulse rise times; longer time constants permit temporal summation of multiphasic pulses.',
  },
  threshold: {
    title: 'Spike Threshold (mV)',
    represents: 'Critical transmembrane potential required to activate regenerative fast voltage-gated sodium channels (Na_v).',
    whyMatters: 'Governs the transition from subthreshold passive electrotonus to an all-or-none action potential.',
    affects: 'Higher threshold requires stronger electrical field strength to elicit spikes, reducing fiber recruitment.',
  },
  neuralSurvival: {
    title: 'Neural Survival (%)',
    represents: 'The proportion of viable spiral ganglion neurons (SGNs) remaining in Rosenthal’s canal across the cochlea.',
    whyMatters: 'Sensorineural hearing loss often causes progressive retrograde degeneration of peripheral dendrites and somas.',
    affects: 'Reduced survival diminishes overall spike population count, increases dynamic range requirements, and reduces pitch discrimination.',
  },
  fiberHeterogeneity: {
    title: 'Fiber Heterogeneity',
    represents: 'Stochastic variance in diameter, threshold, ion-channel density, and distance across the simulated auditory nerve population.',
    whyMatters: 'Real human auditory nerves exhibit substantial diversity across spontaneous rate classes (high, medium, low-SR).',
    affects: 'Higher heterogeneity produces a smooth population rate-level sigmoid curve instead of an abrupt all-or-none threshold step.',
  },
  tissueConductivity: {
    title: 'Tissue Conductivity (σ, S/m)',
    represents: 'Conductivity of cochlear fluid (perilymph ~1.4 S/m) and surrounding modiolar bone (~0.016 S/m).',
    whyMatters: 'Dictates current flow pathways according to Laplace’s volume conduction equation.',
    affects: 'Lower bone conductivity traps current within the fluid scala, enhancing longitudinal spread toward neighboring turns.',
  },
};
