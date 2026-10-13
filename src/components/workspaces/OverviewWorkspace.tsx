import React, { useState } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { PipelineStrip } from '../PipelineStrip';
import { ResearchGapCard } from '../ResearchGapCard';
import { CochleaViewer3D } from '../CochleaViewer3D';
import { ElectrodeParametersCard } from '../ElectrodeParametersCard';
import { ElectricalFieldViewer } from '../ElectricalFieldViewer';
import { FiberSimulationCard } from '../FiberSimulationCard';
import { SpikeRasterCard } from '../SpikeRasterCard';
import { PopulationResponseCard } from '../PopulationResponseCard';
import { MetricStatsBar } from '../MetricStatsBar';
import { HelpCircle, Sparkles, Brain } from 'lucide-react';

interface OverviewWorkspaceProps {
  onOpenResearchGap: () => void;
  onOpenMetricDetail: (metricName: string) => void;
}

export const OverviewWorkspace: React.FC<OverviewWorkspaceProps> = ({
  onOpenResearchGap,
  onOpenMetricDetail,
}) => {
  const {
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
    researchMode,
  } = useSimulation();

  const [activeView, setActiveView] = useState<'3d' | 'cross-section' | 'longitudinal'>('3d');
  const [fieldViewMode, setFieldViewMode] = useState<
    'Field Contour' | 'Iso-potential Lines' | 'Volume Spread'
  >('Field Contour');
  const [activePipelineStep, setActivePipelineStep] = useState(3);

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Research Question & Central Hypothesis Header Banner */}
      <div className="bg-[#0b1222] border border-[#18233c] rounded-2xl p-4 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-400 px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/30">
                Core Research Inquiry
              </span>
            </div>
            <h2 className="text-sm font-bold text-white mt-0.5">
              “How does a biologically realistic representation of cochlear implant stimulation affect the neural information available to an AI decoder?”
            </h2>
          </div>
        </div>

        {/* Current Lab Config Summary Pill */}
        <div className="flex items-center gap-2 text-xs font-mono bg-[#111c33] px-3.5 py-1.5 rounded-xl border border-[#1e2f52] shrink-0 text-slate-300">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>E{selectedElectrode < 10 ? '0' + selectedElectrode : selectedElectrode}</span>
          <span>•</span>
          <span>{amplitude} µA</span>
          <span>•</span>
          <span>{spatialSpread}% Spread</span>
          <span>•</span>
          <span>{pulseRate} pps</span>
        </div>
      </div>

      {/* Row 1: Pipeline Strip + Research Gap 1 */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-stretch">
        <div className="xl:col-span-9">
          <PipelineStrip
            activeStep={activePipelineStep}
            onSelectStep={(idx) => setActivePipelineStep(idx)}
          />
        </div>
        <div className="xl:col-span-3">
          <ResearchGapCard onViewDetails={onOpenResearchGap} />
        </div>
      </div>

      {/* Row 2: 3D Cochlear Visualization + Electrode Parameters + Electrical Field */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* 3D Centerpiece */}
        <div className="lg:col-span-6 xl:col-span-6">
          <CochleaViewer3D
            selectedElectrode={selectedElectrode}
            setSelectedElectrode={setSelectedElectrode}
            amplitude={amplitude}
            spatialSpread={spatialSpread}
            activeView={activeView}
            setActiveView={setActiveView}
          />
        </div>

        {/* Electrode Parameters Slider Card */}
        <div className="lg:col-span-3 xl:col-span-3">
          <ElectrodeParametersCard
            selectedElectrode={selectedElectrode}
            setSelectedElectrode={setSelectedElectrode}
            amplitude={amplitude}
            setAmplitude={setAmplitude}
            impedance={impedance}
            setImpedance={setImpedance}
            spatialSpread={spatialSpread}
            setSpatialSpread={setSpatialSpread}
            pulseWidth={pulseWidth}
            setPulseWidth={setPulseWidth}
            pulseRate={pulseRate}
            setPulseRate={setPulseRate}
          />
        </div>

        {/* Electrical Field Visualization */}
        <div className="lg:col-span-3 xl:col-span-3">
          <ElectricalFieldViewer
            spatialSpread={spatialSpread}
            setSpatialSpread={setSpatialSpread}
            amplitude={amplitude}
            fieldViewMode={fieldViewMode}
            setFieldViewMode={setFieldViewMode}
          />
        </div>
      </div>

      {/* Row 3: Fiber Simulation + Spike Raster + Population Response */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        <div className="lg:col-span-4">
          <FiberSimulationCard
            amplitude={amplitude}
            spatialSpread={spatialSpread}
          />
        </div>

        <div className="lg:col-span-4">
          <SpikeRasterCard
            amplitude={amplitude}
            spatialSpread={spatialSpread}
            pulseRate={pulseRate}
          />
        </div>

        <div className="lg:col-span-4">
          <PopulationResponseCard
            amplitude={amplitude}
            spatialSpread={spatialSpread}
            pulseRate={pulseRate}
          />
        </div>
      </div>

      {/* Bottom KPI Metrics (6 Cards) */}
      <MetricStatsBar
        amplitude={amplitude}
        spatialSpread={spatialSpread}
        onMetricClick={onOpenMetricDetail}
      />
    </div>
  );
};
