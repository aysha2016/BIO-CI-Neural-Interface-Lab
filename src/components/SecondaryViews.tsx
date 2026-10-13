import React from 'react';
import { ArrowLeft, Timer, Sliders, Users, UserCheck, Cpu, Sparkles, FlaskConical, Microscope } from 'lucide-react';

interface SecondaryViewsProps {
  activeTab: string;
  onReturnToOverview: () => void;
  selectedElectrode: number;
  amplitude: number;
  spatialSpread: number;
}

export const SecondaryViews: React.FC<SecondaryViewsProps> = ({
  activeTab,
  onReturnToOverview,
  selectedElectrode,
  amplitude,
  spatialSpread,
}) => {
  return (
    <div className="bg-[#0b1222] border border-[#18233c] rounded-2xl p-6 shadow-xl space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-[#18233c]">
        <div className="flex items-center gap-3">
          <button
            onClick={onReturnToOverview}
            className="p-2 rounded-lg bg-[#111c33] hover:bg-[#182849] border border-[#1e2f50] text-cyan-300 transition-colors flex items-center gap-1.5 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Main Lab</span>
          </button>
          <h2 className="text-lg font-bold text-white capitalize">
            {activeTab.replace('-', ' ')}
          </h2>
        </div>
        <span className="text-xs text-slate-400 font-mono">
          Electrode 0{selectedElectrode} • {amplitude} µA • {spatialSpread}% Spread
        </span>
      </div>

      {activeTab === 'refractory-lab' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-[#0e172e] border border-[#1e2f52] space-y-2">
            <h3 className="text-sm font-bold text-cyan-300 flex items-center gap-2">
              <Timer className="w-4 h-4" />
              Absolute & Relative Refractory Period Dynamics
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              When an auditory nerve fiber fires an action potential, voltage-gated Na+ channels enter inactivation. During the <strong>Absolute Refractory Period (ARP ~0.7 ms)</strong>, no stimulus however large can elicit a spike. During the <strong>Relative Refractory Period (RRP ~1.5 - 3.5 ms)</strong>, elevated threshold and reduced spike amplitude occur.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-[#090f1e] border border-[#182645]">
              <div className="text-xs text-slate-400">Measured ARP (Node 1)</div>
              <div className="text-xl font-bold font-mono text-cyan-400 mt-1">0.68 ms</div>
              <p className="text-[11px] text-slate-500 mt-1">Hodgkin-Huxley inactivation gate h &lt; 0.05</p>
            </div>
            <div className="p-4 rounded-xl bg-[#090f1e] border border-[#182645]">
              <div className="text-xs text-slate-400">RRP Half-Recovery (τ_rel)</div>
              <div className="text-xl font-bold font-mono text-purple-400 mt-1">1.82 ms</div>
              <p className="text-[11px] text-slate-500 mt-1">Exponential threshold restoration</p>
            </div>
            <div className="p-4 rounded-xl bg-[#090f1e] border border-[#182645]">
              <div className="text-xs text-slate-400">Max Entrainment Frequency</div>
              <div className="text-xl font-bold font-mono text-emerald-400 mt-1">640 Hz</div>
              <p className="text-[11px] text-slate-500 mt-1">Phase-locked 1:1 firing limit</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'adaptation-lab' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-[#0e172e] border border-[#1e2f52] space-y-2">
            <h3 className="text-sm font-bold text-cyan-300 flex items-center gap-2">
              <Sliders className="w-4 h-4" />
              Short-Term & Long-Term Neural Adaptation
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Continuous high-rate electrical pulse trains induce significant spike rate decay. Initial onset firing rates of ~300 Hz decay to a steady state of ~80 Hz over 50 ms due to slow potassium channel accumulation and extracellular ion accumulation.
            </p>
          </div>
          <div className="h-44 bg-[#070c18] rounded-xl border border-[#16233e] flex items-center justify-center p-4">
            <div className="w-full text-center">
              <div className="text-xs text-slate-400 mb-2">Adaptation Curve (Firing Rate vs Time in continuous train)</div>
              <div className="h-24 w-full flex items-end justify-center gap-1.5 px-4">
                {[100, 85, 70, 58, 48, 42, 38, 35, 33, 31, 30, 29, 28, 28, 27].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full bg-gradient-to-t from-cyan-600 to-teal-400 rounded-t"
                      style={{ height: `${h}%` }}
                    />
                    <span className="text-[9px] text-slate-500">{i * 5}ms</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'snn-decoder' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-[#0e172e] border border-[#1e2f52] space-y-2">
            <h3 className="text-sm font-bold text-cyan-300 flex items-center gap-2">
              <Cpu className="w-4 h-4" />
              Spiking Neural Network (SNN) Central Auditory Decoder
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Decodes 22-channel peripheral cochlear implant spike trains through a 3-layer leaky integrate-and-fire (LIF) network emulating the Cochlear Nucleus and Inferior Colliculus.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#090f1e] border border-[#182645]">
              <div className="text-xs text-slate-400">Phoneme Recognition Accuracy</div>
              <div className="text-2xl font-bold font-mono text-cyan-400 mt-1">88.4%</div>
              <div className="text-[11px] text-emerald-400 mt-1">+14.2% over simplified point models</div>
            </div>
            <div className="p-4 rounded-xl bg-[#090f1e] border border-[#182645]">
              <div className="text-xs text-slate-400">Synaptic Latency</div>
              <div className="text-2xl font-bold font-mono text-purple-400 mt-1">1.45 ms</div>
              <div className="text-[11px] text-slate-400 mt-1">Ultra-low latency edge neuromorphic processing</div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'patient-model' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-[#0e172e] border border-[#1e2f52] space-y-2">
            <h3 className="text-sm font-bold text-cyan-300 flex items-center gap-2">
              <UserCheck className="w-4 h-4" />
              Patient-Specific Anatomy & SGC Survival Density
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Patient CT/MRI segmentation accounts for electrode scalar translocation, insertion depth angle (420° deep basal-to-apical), and spiral ganglion cell (SGC) degeneration patches along the basilar length.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-lg bg-[#090f1e] border border-[#182645]">
              <div className="text-[11px] text-slate-400">Insertion Angle</div>
              <div className="text-sm font-bold font-mono text-slate-200 mt-1">452° (2.3 Turns)</div>
            </div>
            <div className="p-3 rounded-lg bg-[#090f1e] border border-[#182645]">
              <div className="text-[11px] text-slate-400">Mean SGC Survival</div>
              <div className="text-sm font-bold font-mono text-emerald-400 mt-1">68.5%</div>
            </div>
            <div className="p-3 rounded-lg bg-[#090f1e] border border-[#182645]">
              <div className="text-[11px] text-slate-400">Scala Placement</div>
              <div className="text-sm font-bold font-mono text-cyan-400 mt-1">Scala Tympani (Pure)</div>
            </div>
          </div>
        </div>
      )}

      {activeTab !== 'refractory-lab' &&
        activeTab !== 'adaptation-lab' &&
        activeTab !== 'snn-decoder' &&
        activeTab !== 'patient-model' && (
          <div className="p-8 text-center bg-[#090f1e] rounded-xl border border-[#182645] space-y-3">
            <Microscope className="w-10 h-10 text-cyan-400 mx-auto" />
            <h3 className="text-base font-bold text-white capitalize">
              {activeTab.replace('-', ' ')} Exploration Module
            </h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              This research module is synchronizing with the central simulation engine. All current electrode parameters (Electrode {selectedElectrode}, {amplitude} µA) are linked directly to the main visualization pipeline.
            </p>
            <button
              onClick={onReturnToOverview}
              className="mt-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              Return to Primary Lab View
            </button>
          </div>
        )}
    </div>
  );
};
