/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, Suspense, lazy } from 'react';
import { SimulationProvider, useSimulation } from './context/SimulationContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { OverviewWorkspace } from './components/workspaces/OverviewWorkspace';
import { ErrorBoundary } from './components/ErrorBoundary';

// Code-split secondary workspaces to reduce initial bundle size and speed up page load
const NeuralModelWorkspace = lazy(() => import('./components/workspaces/NeuralModelWorkspace').then(m => ({ default: m.NeuralModelWorkspace })));
const CochleaElectrodesWorkspace = lazy(() => import('./components/workspaces/CochleaElectrodesWorkspace').then(m => ({ default: m.CochleaElectrodesWorkspace })));
const ElectricalFieldWorkspace = lazy(() => import('./components/workspaces/ElectricalFieldWorkspace').then(m => ({ default: m.ElectricalFieldWorkspace })));
const NerveFiberSimulationWorkspace = lazy(() => import('./components/workspaces/NerveFiberSimulationWorkspace').then(m => ({ default: m.NerveFiberSimulationWorkspace })));
const RefractoryPeriodWorkspace = lazy(() => import('./components/workspaces/RefractoryPeriodWorkspace').then(m => ({ default: m.RefractoryPeriodWorkspace })));
const AdaptationWorkspace = lazy(() => import('./components/workspaces/AdaptationWorkspace').then(m => ({ default: m.AdaptationWorkspace })));
const FiberPopulationWorkspace = lazy(() => import('./components/workspaces/FiberPopulationWorkspace').then(m => ({ default: m.FiberPopulationWorkspace })));
const PatientSpecificWorkspace = lazy(() => import('./components/workspaces/PatientSpecificWorkspace').then(m => ({ default: m.PatientSpecificWorkspace })));
const SnnDecoderWorkspace = lazy(() => import('./components/workspaces/SnnDecoderWorkspace').then(m => ({ default: m.SnnDecoderWorkspace })));
const AiOptimizationWorkspace = lazy(() => import('./components/workspaces/AiOptimizationWorkspace').then(m => ({ default: m.AiOptimizationWorkspace })));
const ExperimentsWorkspace = lazy(() => import('./components/workspaces/ExperimentsWorkspace').then(m => ({ default: m.ExperimentsWorkspace })));
const ResearchInsightsWorkspace = lazy(() => import('./components/workspaces/ResearchInsightsWorkspace').then(m => ({ default: m.ResearchInsightsWorkspace })));

// Code-split modals
const ResearchGapModal = lazy(() => import('./components/ResearchGapModal').then(m => ({ default: m.ResearchGapModal })));
const AiAssistantModal = lazy(() => import('./components/AiAssistantModal').then(m => ({ default: m.AiAssistantModal })));
const ExportModal = lazy(() => import('./components/ExportModal').then(m => ({ default: m.ExportModal })));
const SimulationStatusModal = lazy(() => import('./components/modals/SimulationStatusModal').then(m => ({ default: m.SimulationStatusModal })));
const ResearchDocumentationModal = lazy(() => import('./components/modals/ResearchDocumentationModal').then(m => ({ default: m.ResearchDocumentationModal })));
const SimulationSettingsModal = lazy(() => import('./components/modals/SimulationSettingsModal').then(m => ({ default: m.SimulationSettingsModal })));
const ModelFidelityModal = lazy(() => import('./components/modals/ModelFidelityModal').then(m => ({ default: m.ModelFidelityModal })));
const MetricDetailModal = lazy(() => import('./components/modals/MetricDetailModal').then(m => ({ default: m.MetricDetailModal })));

const WorkspaceFallback = () => (
  <div className="flex flex-col items-center justify-center p-16 text-slate-400 min-h-[300px]">
    <div className="w-8 h-8 border-2 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin mb-3" />
    <span className="text-xs font-mono text-cyan-400 tracking-wider">Loading workspace module...</span>
  </div>
);

function MainAppContent() {
  const { activeTab, setActiveTab, researchMode, setResearchMode } = useSimulation();

  // Modals state
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isDocsOpen, setIsDocsOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isResearchGapOpen, setIsResearchGapOpen] = useState(false);
  const [isModelFidelityOpen, setIsModelFidelityOpen] = useState(false);
  const [selectedFidelityCategory, setSelectedFidelityCategory] = useState<string | null>(null);
  const [selectedMetricName, setSelectedMetricName] = useState<string | null>(null);

  const handleOpenFidelity = (category?: string) => {
    setSelectedFidelityCategory(category || null);
    setIsModelFidelityOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-row font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenModelFidelity={handleOpenFidelity}
      />

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Header */}
        <Header
          researchMode={researchMode}
          setResearchMode={setResearchMode}
          onOpenStatus={() => setIsStatusOpen(true)}
          onOpenDocs={() => setIsDocsOpen(true)}
          onOpenExport={() => setIsExportOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenAI={() => setIsAiOpen(true)}
        />

        {/* Dynamic Workspace Container */}
        <main className="flex-1 p-5 overflow-y-auto">
          {activeTab === 'overview' && (
            <OverviewWorkspace
              onOpenResearchGap={() => setIsResearchGapOpen(true)}
              onOpenMetricDetail={(metricName) => setSelectedMetricName(metricName)}
            />
          )}
          <Suspense fallback={<WorkspaceFallback />}>
            {activeTab === 'neural-model' && <NeuralModelWorkspace />}
            {activeTab === 'cochlea-electrodes' && <CochleaElectrodesWorkspace />}
            {activeTab === 'electrical-field' && <ElectricalFieldWorkspace />}
            {activeTab === 'nerve-fiber-sim' && <NerveFiberSimulationWorkspace />}
            {activeTab === 'refractory-lab' && <RefractoryPeriodWorkspace />}
            {activeTab === 'adaptation-lab' && <AdaptationWorkspace />}
            {activeTab === 'fiber-population' && <FiberPopulationWorkspace />}
            {activeTab === 'patient-model' && <PatientSpecificWorkspace />}
            {activeTab === 'snn-decoder' && <SnnDecoderWorkspace />}
            {activeTab === 'ai-optimization' && <AiOptimizationWorkspace />}
            {activeTab === 'experiments' && <ExperimentsWorkspace />}
            {activeTab === 'research-insights' && <ResearchInsightsWorkspace />}
          </Suspense>
        </main>
      </div>

      {/* Modals Collection (Lazy Loaded) */}
      <Suspense fallback={null}>
        {isStatusOpen && (
          <SimulationStatusModal
            isOpen={isStatusOpen}
            onClose={() => setIsStatusOpen(false)}
          />
        )}
        {isDocsOpen && (
          <ResearchDocumentationModal
            isOpen={isDocsOpen}
            onClose={() => setIsDocsOpen(false)}
          />
        )}
        {isExportOpen && (
          <ExportModal
            isOpen={isExportOpen}
            onClose={() => setIsExportOpen(false)}
          />
        )}
        {isSettingsOpen && (
          <SimulationSettingsModal
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
          />
        )}
        {isAiOpen && (
          <AiAssistantModal
            isOpen={isAiOpen}
            onClose={() => setIsAiOpen(false)}
          />
        )}
        {isResearchGapOpen && (
          <ResearchGapModal
            isOpen={isResearchGapOpen}
            onClose={() => setIsResearchGapOpen(false)}
          />
        )}
        {isModelFidelityOpen && (
          <ModelFidelityModal
            isOpen={isModelFidelityOpen}
            onClose={() => setIsModelFidelityOpen(false)}
            selectedCategory={selectedFidelityCategory}
          />
        )}
        {selectedMetricName && (
          <MetricDetailModal
            metricName={selectedMetricName}
            onClose={() => setSelectedMetricName(null)}
          />
        )}
      </Suspense>
    </div>
  );
}

export default function App() {
  React.useEffect(() => {
    if (typeof window.bioAppMounted === 'function') {
      window.bioAppMounted();
    }
  }, []);

  return (
    <ErrorBoundary>
      <SimulationProvider>
        <MainAppContent />
      </SimulationProvider>
    </ErrorBoundary>
  );
}
