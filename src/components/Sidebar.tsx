import React from 'react';
import {
  Home,
  Brain,
  Disc,
  Radio,
  Activity,
  Timer,
  Sliders,
  Users,
  UserCheck,
  Cpu,
  Sparkles,
  FlaskConical,
  Microscope,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenModelFidelity: (category?: string) => void;
}

export const navItems = [
  { id: 'overview', label: 'Overview', icon: Home },
  { id: 'neural-model', label: 'Neural Model', icon: Brain },
  { id: 'cochlea-electrodes', label: 'Cochlea & Electrodes', icon: Disc },
  { id: 'electrical-field', label: 'Electrical Field', icon: Radio },
  { id: 'nerve-fiber-sim', label: 'Nerve Fiber Simulation', icon: Activity },
  { id: 'refractory-lab', label: 'Refractory Period Lab', icon: Timer },
  { id: 'adaptation-lab', label: 'Adaptation Lab', icon: Sliders },
  { id: 'fiber-population', label: 'Fiber Population', icon: Users },
  { id: 'patient-model', label: 'Patient-Specific Model', icon: UserCheck },
  { id: 'snn-decoder', label: 'SNN Decoder', icon: Cpu },
  { id: 'ai-optimization', label: 'AI Optimization', icon: Sparkles },
  { id: 'experiments', label: 'Experiments', icon: FlaskConical },
  { id: 'research-insights', label: 'Research Insights', icon: Microscope },
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onOpenModelFidelity,
}) => {
  return (
    <aside className="w-64 bg-[#0a0f1d] border-r border-[#18233c] flex flex-col justify-between shrink-0 select-none min-h-screen">
      {/* Logo & Brand */}
      <div>
        <div className="h-16 flex items-center px-6 border-b border-[#18233c]/60">
          <button
            onClick={() => setActiveTab('overview')}
            className="flex items-center gap-2 text-left cursor-pointer focus:outline-none"
          >
            <span className="text-2xl font-black tracking-wider text-cyan-400 drop-shadow-[0_0_12px_rgba(34,211,238,0.5)]">
              BIO-CI
            </span>
          </button>
        </div>

        {/* Navigation List */}
        <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-250px)]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#132347] text-white border border-[#2563eb]/60 shadow-[0_0_15px_rgba(37,99,235,0.25)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#111c33]'
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-cyan-400' : 'text-slate-400'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Model Fidelity Box */}
      <div className="p-3.5 m-3 bg-[#0d1629] border border-[#1e2f4f] rounded-xl">
        <button
          onClick={() => onOpenModelFidelity()}
          className="w-full flex items-center justify-between text-cyan-400 text-xs font-semibold mb-2.5 hover:text-cyan-300 transition-colors cursor-pointer text-left"
        >
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Model Fidelity</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        </button>

        <div className="space-y-2.5 text-[11px]">
          <div>
            <div className="flex justify-between text-slate-400 mb-1">
              <span>Simplified Model</span>
              <span className="text-purple-400 font-semibold">45%</span>
            </div>
            <div className="text-[10px] text-slate-500 mb-1">(--paper model)</div>
            <div className="h-1.5 w-full bg-[#1b263b] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                style={{ width: '45%' }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-slate-300 mb-1">
              <span className="text-cyan-300 font-medium">Proposed Biological Model</span>
              <span className="text-cyan-400 font-bold">90%</span>
            </div>
            <div className="text-[10px] text-slate-400 mb-1">(this prototype)</div>
            <div className="h-2 w-full bg-[#1b263b] rounded-full overflow-hidden shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)]">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-teal-400 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.6)]"
                style={{ width: '90%' }}
              />
            </div>
          </div>
        </div>

        <button
          onClick={() => onOpenModelFidelity()}
          className="w-full mt-2.5 pt-2 border-t border-[#182645] text-[10px] text-cyan-400/90 hover:text-cyan-300 flex items-center justify-center gap-1 font-semibold cursor-pointer"
        >
          <span>Compare All 8 Categories</span>
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>
    </aside>
  );
};
