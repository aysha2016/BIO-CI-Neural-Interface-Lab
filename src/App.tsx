/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SimulationProvider, useSimulation } from './context/SimulationContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { OverviewWorkspace } from './components/workspaces/OverviewWorkspace';
import { NeuralModelWorkspace } from './components/workspaces/NeuralModelWorkspace';
import { CochleaElectrodesWorkspace } from './components/workspaces/CochleaElectrodesWorkspace';
import { ElectricalFieldWorkspace } from './components/workspaces/ElectricalFieldWorkspace';
import { NerveFiberSimulationWorkspace } from './components/workspaces/NerveFiberSimulationWorkspace';
import { RefractoryPeriodWorkspace } from './components/workspaces/RefractoryPeriodWorkspace';
import { AdaptationWorkspace } from './components/workspaces/AdaptationWorkspace';
import { FiberPopulationWorkspace } from './components/workspaces/FiberPopulationWorkspace';
import { PatientSpecificWorkspace } from './components/workspaces/PatientSpecificWorkspace';
import { SnnDecoderWorkspace } from './components/workspaces/SnnDecoderWorkspace';
import { AiOptimizationWorkspace } from './components/workspaces/AiOptimizationWorkspace';
import { ExperimentsWorkspace } from './components/workspaces/ExperimentsWorkspace';
import { ResearchInsightsWorkspace } from './components/workspaces/ResearchInsightsWorkspace';

// Modals
import { ResearchGapModal } from './components/ResearchGapModal';
import { AiAssistantModal } from './components/AiAssistantModal';
import { ExportModal } from './components/ExportModal';
import { SimulationStatusModal } from './components/modals/SimulationStatusModal';
import { ResearchDocumentationModal } from './components/modals/ResearchDocumentationModal';
import { SimulationSettingsModal } from './components/modals/SimulationSettingsModal';
import { ModelFidelityModal } from './components/modals/ModelFidelityModal';
import { MetricDetailModal } from './components/modals/MetricDetailModal';

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
        </main>
      </div>

      {/* Modals Collection */}
      <SimulationStatusModal
        isOpen={isStatusOpen}
        onClose={() => setIsStatusOpen(false)}
      />

      <ResearchDocumentationModal
        isOpen={isDocsOpen}
        onClose={() => setIsDocsOpen(false)}
      />

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />

      <SimulationSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      <AiAssistantModal
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
      />

      <ResearchGapModal
        isOpen={isResearchGapOpen}
        onClose={() => setIsResearchGapOpen(false)}
      />

      <ModelFidelityModal
        isOpen={isModelFidelityOpen}
        onClose={() => setIsModelFidelityOpen(false)}
        selectedCategory={selectedFidelityCategory}
      />

      <MetricDetailModal
        metricName={selectedMetricName}
        onClose={() => setSelectedMetricName(null)}
      />
    </div>
  );
}

export default function App() {
  return (
    <SimulationProvider>
      <MainAppContent />
    </SimulationProvider>
  );
}
