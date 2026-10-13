import React from 'react';
import {
  Network,
  Radio,
  Globe,
  FileCode,
  ShieldAlert,
  BarChart3,
  BookOpen,
} from 'lucide-react';

export type ActiveTab = 'architecture' | 'dns' | 'http' | 'wifi' | 'testing' | 'performance' | 'protocols';

interface TopNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onQuickSimulate: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  activeTab,
  setActiveTab,
  onQuickSimulate,
}) => {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between gap-8 px-6 py-3.5 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      {/* Zone 1: Single element wordmark */}
      <div className="flex items-center gap-2.5 whitespace-nowrap shrink-0">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-500/20">
          <Network className="w-4 h-4" />
        </div>
        <span className="text-base font-bold tracking-tight text-white">
          RetailNet Studio
        </span>
      </div>

      {/* Zone 2: 4-5 clean single-line nav links */}
      <nav className="hidden lg:flex items-center gap-6 text-xs font-medium text-slate-400">
        <button
          onClick={() => setActiveTab('architecture')}
          className={`cursor-pointer transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'architecture' ? 'text-indigo-400 font-semibold' : 'hover:text-slate-200'
          }`}
        >
          Topology & Floorplan
        </button>

        <button
          onClick={() => setActiveTab('wifi')}
          className={`cursor-pointer transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'wifi' ? 'text-indigo-400 font-semibold' : 'hover:text-slate-200'
          }`}
        >
          Wi-Fi & RF Setup
        </button>

        <button
          onClick={() => setActiveTab('dns')}
          className={`cursor-pointer transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'dns' ? 'text-indigo-400 font-semibold' : 'hover:text-slate-200'
          }`}
        >
          DNS Resolution
        </button>

        <button
          onClick={() => setActiveTab('http')}
          className={`cursor-pointer transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'http' ? 'text-indigo-400 font-semibold' : 'hover:text-slate-200'
          }`}
        >
          HTTP & TLS Lifecycle
        </button>

        <button
          onClick={() => setActiveTab('testing')}
          className={`cursor-pointer transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'testing' ? 'text-indigo-400 font-semibold' : 'hover:text-slate-200'
          }`}
        >
          Testing & Scenarios
        </button>

        <button
          onClick={() => setActiveTab('performance')}
          className={`cursor-pointer transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'performance' ? 'text-indigo-400 font-semibold' : 'hover:text-slate-200'
          }`}
        >
          Performance Analytics
        </button>

        <button
          onClick={() => setActiveTab('protocols')}
          className={`cursor-pointer transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'protocols' ? 'text-indigo-400 font-semibold' : 'hover:text-slate-200'
          }`}
        >
          Protocol Roles (A2)
        </button>
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onQuickSimulate}
          className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-500 transition-colors whitespace-nowrap shrink-0 shadow-sm shadow-indigo-600/30 cursor-pointer"
        >
          Run Store Test
        </button>
      </div>
    </header>
  );
};
