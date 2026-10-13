import React, { useState } from 'react';
import { TopNav, ActiveTab } from './components/TopNav';
import { NetworkArchitectureView } from './components/NetworkArchitectureView';
import { DnsResolutionDemo } from './components/DnsResolutionDemo';
import { HttpCommunicationDemo } from './components/HttpCommunicationDemo';
import { WifiConfigurationLab } from './components/WifiConfigurationLab';
import { CommunicationTestingLab } from './components/CommunicationTestingLab';
import { PerformanceAnalysisView } from './components/PerformanceAnalysisView';
import { ProtocolRolesReference } from './components/ProtocolRolesReference';
import {
  Network,
  Radio,
  Globe,
  FileCode,
  ShieldCheck,
  BarChart3,
  BookOpen,
  ArrowRight,
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('architecture');

  const handleQuickSimulate = () => {
    setActiveTab('testing');
  };

  const handleSelectDeviceForTest = (deviceId: string) => {
    setActiveTab('testing');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Bar Navigation adhering to 3-zone contract */}
      <TopNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onQuickSimulate={handleQuickSimulate}
      />

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Sub-Header Breadcrumb / Quick Module Switcher */}
        <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-slate-800/80 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="text-slate-500">Retail Wireless Simulation</span>
            <span className="text-slate-700">/</span>
            <span className="text-indigo-400 font-semibold uppercase tracking-wider text-[11px]">
              {activeTab === 'architecture' && '1. Topology & Store Floorplan'}
              {activeTab === 'wifi' && '2. Wi-Fi 6 & RF Spectrum Configuration'}
              {activeTab === 'dns' && '3. DNS Hierarchical Resolution (RFC 1035)'}
              {activeTab === 'http' && '4. HTTP REST & TLS 1.3 Communication'}
              {activeTab === 'testing' && '5. End-to-End Testing & Security Sandbox'}
              {activeTab === 'performance' && '6. Network Performance & QoS Analytics'}
              {activeTab === 'protocols' && '7. Protocol Technical Reference (A2 Specification)'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-500 font-mono">
              Store Profile: Flagship Retail Model (4 APs, 5 VLANs, PCI-DSS Level 1)
            </span>
          </div>
        </div>

        {/* View Component Rendering */}
        {activeTab === 'architecture' && (
          <NetworkArchitectureView onSelectDeviceForTest={handleSelectDeviceForTest} />
        )}

        {activeTab === 'wifi' && <WifiConfigurationLab />}

        {activeTab === 'dns' && <DnsResolutionDemo />}

        {activeTab === 'http' && <HttpCommunicationDemo />}

        {activeTab === 'testing' && <CommunicationTestingLab />}

        {activeTab === 'performance' && <PerformanceAnalysisView />}

        {activeTab === 'protocols' && <ProtocolRolesReference />}
      </main>

      {/* Clean Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">RetailNet Studio</span>
            <span>&bull;</span>
            <span>IEEE 802.11ax, DNS & HTTP Network Engineering Workbench</span>
          </div>
          <div className="flex items-center gap-6">
            <button
              onClick={() => setActiveTab('architecture')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Architecture
            </button>
            <button
              onClick={() => setActiveTab('testing')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Security Testing
            </button>
            <button
              onClick={() => setActiveTab('protocols')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Protocol Specification (A2)
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
