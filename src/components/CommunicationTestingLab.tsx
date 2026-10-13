import React, { useState } from 'react';
import {
  INITIAL_DEVICES,
  PRESET_TEST_SCENARIOS,
  STORE_VLANS,
} from '../data/storeTopology';
import { PacketTraceLog, TestScenario } from '../types/network';
import {
  ShieldAlert,
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  Send,
  Terminal,
  Activity,
  Server,
  Radio,
  Lock,
} from 'lucide-react';

export const CommunicationTestingLab: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState<TestScenario>(PRESET_TEST_SCENARIOS[0]);
  const [customSourceId, setCustomSourceId] = useState<string>(INITIAL_DEVICES[2].id); // POS 1
  const [customTarget, setCustomTarget] = useState<string>('pay.secure-transact.net');
  const [customProtocol, setCustomProtocol] = useState<'HTTPS' | 'HTTP' | 'DNS' | 'ICMP'>('HTTPS');

  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<number>(-1);
  const [traceLogs, setTraceLogs] = useState<PacketTraceLog[]>([]);
  const [testOutcome, setTestOutcome] = useState<'allowed' | 'blocked' | 'idle'>('idle');

  const runScenarioTest = (scenario: TestScenario) => {
    setSelectedScenario(scenario);
    setIsRunning(true);
    setActiveStep(0);
    setTraceLogs([]);
    setTestOutcome('idle');

    const sourceDev = INITIAL_DEVICES.find((d) => d.id === scenario.sourceDeviceId) || INITIAL_DEVICES[0];
    const isRogue = scenario.expectedResult === 'blocked_by_firewall';

    const simulatedLogs: PacketTraceLog[] = [
      {
        id: 'log-1',
        timestamp: '15:42:01.102',
        phase: 'WIFI_ASSOCIATION',
        fromNode: sourceDev.name,
        toNode: sourceDev.connectedApId?.toUpperCase() || 'AP-01',
        summary: `802.11ax Data frame transmitted via SSID '${sourceDev.currentSsid}' (RSSI: ${sourceDev.rssi} dBm)`,
        status: 'info',
        layer: 'Layer 1/2 (Physical/DataLink)',
      },
      {
        id: 'log-2',
        timestamp: '15:42:01.106',
        phase: 'FIREWALL_RULE',
        fromNode: sourceDev.connectedApId?.toUpperCase() || 'AP-01',
        toNode: 'Core L3 Switch (802.1Q)',
        summary: `Frame encapsulated with 802.1Q Tag: VLAN ${sourceDev.vlan} (${STORE_VLANS[sourceDev.vlan]?.name.split(':')[1]?.trim()})`,
        status: 'info',
        layer: 'Layer 1/2 (Physical/DataLink)',
      },
      {
        id: 'log-3',
        timestamp: '15:42:01.109',
        phase: 'DNS_RESOLVE',
        fromNode: 'Core L3 Switch',
        toNode: 'Store Gateway (192.168.10.1)',
        summary: `DNS Query: Resolving '${scenario.targetDomain}' via UDP:53 forwarder`,
        status: 'success',
        layer: 'Layer 7 (Application)',
      },
      {
        id: 'log-4',
        timestamp: '15:42:01.115',
        phase: 'FIREWALL_RULE',
        fromNode: 'Next-Gen Retail Firewall',
        toNode: isRogue ? 'DROP_TABLE' : 'WAN Gateway / Cloud Uplink',
        summary: isRogue
          ? `SECURITY ALERT: ACL Rule #40 DENY: Guest VLAN 30 -> POS Subnet 192.168.10.0/24 (PCI-DSS Violation Detected)`
          : `Firewall ACL Rule #12 PERMIT: VLAN ${sourceDev.vlan} outbound stateful inspection passed`,
        status: isRogue ? 'error' : 'success',
        layer: 'Layer 3 (Network)',
      },
      {
        id: 'log-5',
        timestamp: '15:42:01.138',
        phase: isRogue ? 'FIREWALL_RULE' : 'HTTP_TRANSFER',
        fromNode: isRogue ? 'Next-Gen Firewall' : 'Target Cloud Service',
        toNode: sourceDev.name,
        summary: isRogue
          ? `ICMP Destination Administratively Prohibited / TCP RST injected by firewall.`
          : `${scenario.protocol} 200 OK: Transaction payload received and verified (Latency: 36ms)`,
        status: isRogue ? 'error' : 'success',
        layer: 'Layer 7 (Application)',
      },
    ];

    // Progressive step execution
    let currentIdx = 0;
    const interval = setInterval(() => {
      if (currentIdx < simulatedLogs.length) {
        setTraceLogs((prev) => [...prev, simulatedLogs[currentIdx]]);
        setActiveStep(currentIdx);
        currentIdx++;
      } else {
        clearInterval(interval);
        setIsRunning(false);
        setTestOutcome(isRogue ? 'blocked' : 'allowed');
      }
    }, 450);
  };

  const handleRunCustomTest = () => {
    const src = INITIAL_DEVICES.find((d) => d.id === customSourceId) || INITIAL_DEVICES[0];
    const isTargetPosSubnet = customTarget.includes('192.168.10');
    const isCrossVlanUnauthorized = src.vlan === 30 && isTargetPosSubnet;

    const customScenario: TestScenario = {
      id: 'custom-test',
      title: `Custom Test: ${src.name} &rarr; ${customTarget}`,
      actorDescription: `Custom transmission from ${src.name}`,
      sourceDeviceId: src.id,
      targetDomain: customTarget,
      protocol: customProtocol,
      description: `Testing packet path and firewall verification for ${src.name} to ${customTarget}`,
      expectedResult: isCrossVlanUnauthorized ? 'blocked_by_firewall' : 'allowed',
      securityVerification: isCrossVlanUnauthorized
        ? 'Firewall correctly isolates POS network from unauthorized clients.'
        : 'Authorized route permitted through retail gateway.',
      tags: ['Custom Lab', customProtocol, `VLAN ${src.vlan}`],
    };

    runScenarioTest(customScenario);
  };

  return (
    <div className="space-y-6">
      {/* Title & Introduction */}
      <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800">
        <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-indigo-400" />
          End-to-End Retail Communication & Security Testing Lab
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
          Verify data flow between in-store clients (customers, cashiers, stock associates) and target online services. Test firewall ACL isolation, PCI-DSS compliance enforcement, and real-time packet traversal logs.
        </p>
      </div>

      {/* Preset Test Scenarios Carousel */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {PRESET_TEST_SCENARIOS.map((sc) => (
          <button
            key={sc.id}
            onClick={() => runScenarioTest(sc)}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
              selectedScenario.id === sc.id
                ? 'bg-indigo-950/80 border-indigo-400 ring-1 ring-indigo-500'
                : 'bg-slate-900 border-slate-800 hover:bg-slate-800/80 text-slate-300'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold ${
                    sc.expectedResult === 'blocked_by_firewall'
                      ? 'bg-rose-950 text-rose-400 border border-rose-800'
                      : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  }`}
                >
                  {sc.expectedResult === 'blocked_by_firewall' ? 'SECURITY DROP' : 'PERMIT ROUTE'}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">{sc.protocol}</span>
              </div>

              <h4 className="text-xs font-bold text-white mb-1 leading-snug">
                {sc.title}
              </h4>
              <p className="text-[11px] text-slate-400 line-clamp-2">
                {sc.description}
              </p>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-indigo-400 font-medium">
              <span>Execute Scenario &rarr;</span>
            </div>
          </button>
        ))}
      </div>

      {/* Custom Transmission Sandbox Bar */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-white flex items-center gap-1.5">
            <Send className="w-3.5 h-3.5 text-indigo-400" />
            Interactive Custom Packet Injection Sandbox
          </span>
          <span className="text-[10px] text-slate-400">
            Probe any custom source device and destination endpoint
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="text-slate-400 block mb-1">Source Device</label>
            <select
              value={customSourceId}
              onChange={(e) => setCustomSourceId(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded bg-slate-950 border border-slate-800 text-white"
            >
              {INITIAL_DEVICES.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name.split('(')[0]} (VLAN {d.vlan})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Destination Address</label>
            <input
              type="text"
              value={customTarget}
              onChange={(e) => setCustomTarget(e.target.value)}
              placeholder="e.g. pay.secure-transact.net or 192.168.10.15"
              className="w-full px-2.5 py-1.5 rounded bg-slate-950 border border-slate-800 text-white font-mono"
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Protocol</label>
            <select
              value={customProtocol}
              onChange={(e) => setCustomProtocol(e.target.value as any)}
              className="w-full px-2.5 py-1.5 rounded bg-slate-950 border border-slate-800 text-white"
            >
              <option value="HTTPS">HTTPS (Port 443 TLS 1.3)</option>
              <option value="HTTP">HTTP (Port 80 Plaintext)</option>
              <option value="DNS">DNS Query (Port 53 UDP)</option>
              <option value="ICMP">ICMP Ping (Echo Request)</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleRunCustomTest}
              disabled={isRunning}
              className="w-full py-1.5 px-3 text-xs font-semibold rounded bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5" />
              Transmit Packet
            </button>
          </div>
        </div>
      </div>

      {/* Real-time Diagnostic Pipeline & Outcome */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Packet Stage Animation (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-emerald-400" />
              Physical & Logical Hop Progression
            </span>
            {isRunning && (
              <span className="text-[10px] font-mono text-indigo-400 animate-pulse">
                TRANSMITTING...
              </span>
            )}
          </div>

          <div className="space-y-3">
            {[
              { label: '1. Source Wi-Fi Card', desc: '802.11ax RF modulation to AP' },
              { label: '2. Access Point Controller', desc: '802.1Q VLAN Tagging & Ethernet conversion' },
              { label: '3. Core Switch (MDF)', desc: 'Layer 3 frame forwarding' },
              { label: '4. Next-Gen Retail Firewall', desc: 'Stateful ACL rule evaluation' },
              { label: '5. Gateway / Target Service', desc: 'Application service processing' },
            ].map((hop, idx) => (
              <div
                key={hop.label}
                className={`p-3 rounded-lg border transition-all text-xs ${
                  activeStep === idx
                    ? 'bg-indigo-950 border-indigo-400 ring-1 ring-indigo-500 scale-[1.02]'
                    : activeStep > idx
                    ? 'bg-slate-950 border-slate-800 text-slate-300'
                    : 'bg-slate-950/40 border-slate-900 text-slate-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-200">{hop.label}</span>
                  {activeStep > idx && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  )}
                  {activeStep === idx && (
                    <div className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                  )}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">{hop.desc}</div>
              </div>
            ))}
          </div>

          {/* Test Outcome Banner */}
          {testOutcome !== 'idle' && (
            <div
              className={`p-4 rounded-xl border space-y-1.5 ${
                testOutcome === 'blocked'
                  ? 'bg-rose-950/70 border-rose-800 text-rose-200'
                  : 'bg-emerald-950/70 border-emerald-800 text-emerald-200'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-xs">
                {testOutcome === 'blocked' ? (
                  <>
                    <XCircle className="w-4 h-4 text-rose-400" />
                    SECURITY DROP CONFIRMED (ACL ENFORCED)
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    COMMUNICATION TEST PASSED (ROUTE PERMITTED)
                  </>
                )}
              </div>
              <p className="text-[11px] leading-relaxed opacity-90">
                {selectedScenario.securityVerification}
              </p>
            </div>
          )}
        </div>

        {/* Live Packet Trace Log Table (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-indigo-400" />
              Live Wireshark-Style Packet Inspection Log
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              {traceLogs.length} Frames Captured
            </span>
          </div>

          {traceLogs.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500 rounded-lg bg-slate-950 border border-slate-800/60">
              Select any scenario above or click &ldquo;Transmit Packet&rdquo; to capture frames.
            </div>
          ) : (
            <div className="space-y-2 overflow-y-auto max-h-[360px] pr-1">
              {traceLogs.map((log) => (
                <div
                  key={log.id}
                  className={`p-3 rounded-lg border text-xs font-mono space-y-1 ${
                    log.status === 'error'
                      ? 'bg-rose-950/40 border-rose-900/80'
                      : log.status === 'warning'
                      ? 'bg-amber-950/40 border-amber-900/80'
                      : 'bg-slate-950 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-slate-500">
                    <span>{log.timestamp}</span>
                    <span className="text-indigo-400 font-sans">{log.layer}</span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-200">
                    <span className="text-slate-400">{log.fromNode}</span>
                    <ArrowRight className="w-3 h-3 text-slate-500 shrink-0" />
                    <span className="text-slate-200 font-semibold">{log.toNode}</span>
                  </div>

                  <div
                    className={`text-[11px] leading-normal font-sans pt-0.5 ${
                      log.status === 'error'
                        ? 'text-rose-300'
                        : log.status === 'success'
                        ? 'text-emerald-300'
                        : 'text-slate-300'
                    }`}
                  >
                    {log.summary}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
