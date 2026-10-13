import React, { useState } from 'react';
import {
  AccessPoint,
  NetworkDevice,
  VlanId,
} from '../types/network';
import {
  INITIAL_ACCESS_POINTS,
  INITIAL_DEVICES,
  STORE_VLANS,
} from '../data/storeTopology';
import {
  Wifi,
  Smartphone,
  Tablet,
  CreditCard,
  Barcode,
  Laptop,
  Camera,
  Layers,
  Shield,
  Server,
  Cloud,
  CheckCircle2,
  Sliders,
  Info,
} from 'lucide-react';

interface NetworkArchitectureViewProps {
  onSelectDeviceForTest?: (deviceId: string) => void;
}

export const NetworkArchitectureView: React.FC<NetworkArchitectureViewProps> = ({
  onSelectDeviceForTest,
}) => {
  const [selectedVlan, setSelectedVlan] = useState<VlanId | 'all'>('all');
  const [showRfHeatmap, setShowRfHeatmap] = useState<boolean>(true);
  const [selectedDevice, setSelectedDevice] = useState<NetworkDevice | null>(INITIAL_DEVICES[2]); // Default POS 1
  const [selectedAp, setSelectedAp] = useState<AccessPoint | null>(null);

  const filteredDevices = INITIAL_DEVICES.filter((dev) =>
    selectedVlan === 'all' ? true : dev.vlan === selectedVlan
  );

  const getDeviceIcon = (type: NetworkDevice['type']) => {
    switch (type) {
      case 'smartphone':
        return <Smartphone className="w-3.5 h-3.5" />;
      case 'tablet':
        return <Tablet className="w-3.5 h-3.5" />;
      case 'pos_terminal':
        return <CreditCard className="w-3.5 h-3.5" />;
      case 'barcode_scanner':
        return <Barcode className="w-3.5 h-3.5" />;
      case 'laptop':
        return <Laptop className="w-3.5 h-3.5" />;
      case 'cctv_camera':
        return <Camera className="w-3.5 h-3.5" />;
      default:
        return <Wifi className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Context */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl bg-slate-900/80 border border-slate-800">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white">
            Modern Retail Store Network Architecture
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Segmented multi-VLAN topology integrating Wi-Fi 6 (802.11ax), internal/external DNS name resolution, and secure HTTPS RESTful endpoints for guest shoppers and enterprise retail operations.
          </p>
        </div>

        {/* Quick KPI Strip */}
        <div className="flex items-center gap-4 text-xs font-mono tabular-nums text-slate-300 shrink-0">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-sans">Access Points</span>
            <span className="font-semibold text-slate-100">4 Enterprise APs</span>
          </div>
          <span className="text-slate-700">|</span>
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-sans">Active VLANs</span>
            <span className="font-semibold text-indigo-400">5 Segments</span>
          </div>
          <span className="text-slate-700">|</span>
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-sans">Core Uplink</span>
            <span className="font-semibold text-emerald-400">1 Gbps Fiber</span>
          </div>
        </div>
      </div>

      {/* Control Bar: VLAN Filter & Toggles */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-lg bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-medium text-slate-400 mr-1.5 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5" />
            VLAN Filter:
          </span>
          <button
            onClick={() => setSelectedVlan('all')}
            className={`px-2.5 py-1 text-xs rounded transition-colors cursor-pointer ${
              selectedVlan === 'all'
                ? 'bg-indigo-600 text-white font-medium'
                : 'text-slate-400 hover:text-slate-200 bg-slate-800/60'
            }`}
          >
            All Subnets
          </button>
          {Object.values(STORE_VLANS).map((vlan) => (
            <button
              key={vlan.id}
              onClick={() => setSelectedVlan(vlan.id)}
              className={`px-2.5 py-1 text-xs rounded transition-colors cursor-pointer flex items-center gap-1.5 ${
                selectedVlan === vlan.id
                  ? 'bg-slate-800 text-white font-semibold border'
                  : 'text-slate-400 hover:text-slate-200 bg-slate-800/40'
              }`}
              style={{
                borderColor: selectedVlan === vlan.id ? vlan.color : 'transparent',
              }}
            >
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: vlan.color }}
              />
              VLAN {vlan.id} ({vlan.name.split(':')[1]?.trim() || vlan.name})
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowRfHeatmap(!showRfHeatmap)}
            className={`px-3 py-1 text-xs rounded border transition-colors cursor-pointer flex items-center gap-1.5 ${
              showRfHeatmap
                ? 'bg-indigo-950/60 border-indigo-700 text-indigo-300 font-medium'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
          >
            <Wifi className="w-3.5 h-3.5" />
            {showRfHeatmap ? 'RF Coverage: Visible' : 'RF Coverage: Hidden'}
          </button>
        </div>
      </div>

      {/* Main Grid: Interactive Store Canvas (Left 70%) & Inspector (Right 30%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Interactive Floorplan / Topology */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-xl p-4 overflow-hidden relative">
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-800 text-xs text-slate-400">
            <span className="font-semibold text-slate-200">
              Interactive Store Floorplan & Wireless RF Propagation
            </span>
            <span>Click any node or AP to inspect configuration</span>
          </div>

          {/* SVG Floorplan & Canvas */}
          <div className="relative w-full aspect-[16/10] bg-slate-950 rounded-lg border border-slate-800/80 overflow-hidden select-none">
            {/* Store Zones Architectural Linework */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
              <defs>
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#1e293b" strokeWidth="0.3" strokeDasharray="1,1" />
                </pattern>
                <radialGradient id="apGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.25" />
                  <stop offset="60%" stopColor="#6366f1" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                </radialGradient>
              </defs>

              <rect width="100" height="100" fill="url(#grid)" />

              {/* Retail Architectural Boundaries */}
              {/* Entrance Zone */}
              <rect x="2" y="2" width="32" height="52" fill="#0f172a" fillOpacity="0.5" stroke="#334155" strokeWidth="0.5" strokeDasharray="1,1" />
              <text x="5" y="8" fill="#64748b" fontSize="2.8" fontWeight="bold">ZONE 1: ENTRANCE & FOYER</text>

              {/* Main Sales Floor */}
              <rect x="36" y="2" width="34" height="52" fill="#0f172a" fillOpacity="0.5" stroke="#334155" strokeWidth="0.5" strokeDasharray="1,1" />
              <text x="39" y="8" fill="#64748b" fontSize="2.8" fontWeight="bold">ZONE 2: SALES AISLES 1-6</text>

              {/* Merchandise Shelves representation */}
              <rect x="42" y="14" width="22" height="4" fill="#1e293b" rx="0.5" />
              <rect x="42" y="24" width="22" height="4" fill="#1e293b" rx="0.5" />
              <rect x="42" y="34" width="22" height="4" fill="#1e293b" rx="0.5" />
              <text x="44" y="17" fill="#475569" fontSize="2">Gondola Shelf A (Metal)</text>
              <text x="44" y="27" fill="#475569" fontSize="2">Gondola Shelf B (Metal)</text>
              <text x="44" y="37" fill="#475569" fontSize="2">Gondola Shelf C (Metal)</text>

              {/* Cash Wrap & Checkout */}
              <rect x="72" y="2" width="26" height="52" fill="#0f172a" fillOpacity="0.5" stroke="#334155" strokeWidth="0.5" strokeDasharray="1,1" />
              <text x="75" y="8" fill="#64748b" fontSize="2.8" fontWeight="bold">ZONE 3: CASH WRAP (POS)</text>

              {/* Checkout counters */}
              <rect x="76" y="16" width="18" height="10" fill="#1e293b" stroke="#475569" strokeWidth="0.4" rx="1" />
              <rect x="76" y="32" width="18" height="10" fill="#1e293b" stroke="#475569" strokeWidth="0.4" rx="1" />
              <text x="78" y="21" fill="#94a3b8" fontSize="2.2">Register 01 Counter</text>
              <text x="78" y="37" fill="#94a3b8" fontSize="2.2">Register 02 Counter</text>

              {/* Warehouse & Storage Backroom */}
              <rect x="2" y="58" width="68" height="40" fill="#0f172a" fillOpacity="0.6" stroke="#334155" strokeWidth="0.5" strokeDasharray="1,1" />
              <text x="5" y="64" fill="#64748b" fontSize="2.8" fontWeight="bold">ZONE 4: WAREHOUSE & INVENTORY DOCK</text>
              <rect x="8" y="70" width="20" height="20" fill="#1e293b" rx="1" />
              <text x="10" y="77" fill="#475569" fontSize="2">Pallet Storage</text>

              {/* Server Room / MDF (Main Distribution Facility) */}
              <rect x="72" y="58" width="26" height="40" fill="#1e1e38" fillOpacity="0.7" stroke="#6366f1" strokeWidth="0.6" rx="1" />
              <text x="75" y="64" fill="#818cf8" fontSize="2.8" fontWeight="bold">MDF: CORE RACK</text>
              <text x="75" y="70" fill="#64748b" fontSize="2">L3 Switch (802.1Q)</text>
              <text x="75" y="74" fill="#64748b" fontSize="2">NGFW Retail Gateway</text>
              <text x="75" y="78" fill="#64748b" fontSize="2">DHCP & DNS Forwarder</text>
              <text x="75" y="85" fill="#38bdf8" fontSize="2.2">WAN Uplink &rarr; 1G Fiber</text>

              {/* RF Heatmap Circles (if enabled) */}
              {showRfHeatmap &&
                INITIAL_ACCESS_POINTS.map((ap) => (
                  <g key={`rf-${ap.id}`}>
                    <circle
                      cx={ap.x}
                      cy={ap.y}
                      r={ap.coverageRadius}
                      fill="url(#apGlow)"
                    />
                    <circle
                      cx={ap.x}
                      cy={ap.y}
                      r={ap.coverageRadius}
                      fill="none"
                      stroke="#6366f1"
                      strokeWidth="0.4"
                      strokeDasharray="1,2"
                      opacity="0.4"
                    />
                    <circle
                      cx={ap.x}
                      cy={ap.y}
                      r={ap.coverageRadius * 0.5}
                      fill="none"
                      stroke="#6366f1"
                      strokeWidth="0.3"
                      opacity="0.6"
                    />
                  </g>
                ))}

              {/* Wireless links between devices and APs */}
              {filteredDevices.map((dev) => {
                const connectedAp = INITIAL_ACCESS_POINTS.find(
                  (a) => a.id === dev.connectedApId
                );
                if (!connectedAp) return null;
                const vlanColor = STORE_VLANS[dev.vlan]?.color || '#94a3b8';
                return (
                  <line
                    key={`link-${dev.id}`}
                    x1={dev.x}
                    y1={dev.y}
                    x2={connectedAp.x}
                    y2={connectedAp.y}
                    stroke={vlanColor}
                    strokeWidth="0.5"
                    strokeDasharray="1,1"
                    opacity="0.5"
                  />
                );
              })}

              {/* Wired Trunk Lines from APs to MDF Core Rack */}
              {INITIAL_ACCESS_POINTS.map((ap) => (
                <line
                  key={`trunk-${ap.id}`}
                  x1={ap.x}
                  y1={ap.y}
                  x2={74}
                  y2={72}
                  stroke="#475569"
                  strokeWidth="0.4"
                  strokeDasharray="2,2"
                  opacity="0.4"
                />
              ))}
            </svg>

            {/* Access Point Interactive Markers */}
            {INITIAL_ACCESS_POINTS.map((ap) => (
              <button
                key={ap.id}
                onClick={() => {
                  setSelectedAp(ap);
                  setSelectedDevice(null);
                }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 p-1.5 rounded-full border transition-all z-20 cursor-pointer ${
                  selectedAp?.id === ap.id
                    ? 'bg-indigo-600 border-white ring-2 ring-indigo-400 scale-125'
                    : 'bg-indigo-950/90 border-indigo-500 hover:scale-110 text-indigo-200'
                }`}
                style={{ left: `${ap.x}%`, top: `${ap.y}%` }}
                title={`${ap.name} - ${ap.location}`}
              >
                <Wifi className="w-4 h-4" />
                <span className="absolute left-1/2 -translate-x-1/2 top-full mt-1 px-1.5 py-0.5 rounded text-[9px] font-mono bg-slate-900/90 border border-slate-700 text-slate-200 whitespace-nowrap shadow pointer-events-none">
                  {ap.name.split(' ')[0]}
                </span>
              </button>
            ))}

            {/* Client Device Interactive Markers */}
            {filteredDevices.map((dev) => {
              const vlanInfo = STORE_VLANS[dev.vlan];
              const isSelected = selectedDevice?.id === dev.id;
              return (
                <button
                  key={dev.id}
                  onClick={() => {
                    setSelectedDevice(dev);
                    setSelectedAp(null);
                  }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 p-1.5 rounded-md border transition-all z-10 cursor-pointer ${
                    isSelected
                      ? 'border-white ring-2 ring-white scale-125 shadow-lg z-30'
                      : 'hover:scale-110'
                  }`}
                  style={{
                    left: `${dev.x}%`,
                    top: `${dev.y}%`,
                    backgroundColor: vlanInfo?.color || '#3b82f6',
                    borderColor: isSelected ? '#ffffff' : 'rgba(255,255,255,0.3)',
                    color: '#ffffff',
                  }}
                  title={`${dev.name} (${dev.ip})`}
                >
                  {getDeviceIcon(dev.type)}
                  <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 px-1 py-0.5 rounded text-[9px] font-mono bg-slate-950/90 border border-slate-700 text-slate-200 whitespace-nowrap shadow pointer-events-none">
                    {dev.name.split(' ')[0]}
                  </span>
                </button>
              );
            })}

            {/* Core MDF Rack Marker */}
            <div
              className="absolute left-[85%] top-[75%] -translate-x-1/2 -translate-y-1/2 p-2 bg-indigo-950 border border-indigo-500 rounded-lg text-indigo-300 flex flex-col items-center shadow-lg"
            >
              <Server className="w-5 h-5 text-indigo-400" />
              <span className="text-[10px] font-mono font-bold mt-0.5">MDF Switch</span>
            </div>
          </div>

          {/* Subnet Legend Bar */}
          <div className="mt-3 flex items-center justify-between text-xs text-slate-400 flex-wrap gap-2 pt-2 border-t border-slate-800">
            <span className="font-medium text-slate-300">VLAN Segment Subnets:</span>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-red-500" />
                POS (192.168.10.0/24)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-blue-500" />
                Staff (192.168.20.0/24)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
                Guest (172.16.0.0/22)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-amber-500" />
                IoT (10.0.40.0/24)
              </span>
            </div>
          </div>
        </div>

        {/* Right 30%: Node Detail Inspector */}
        <div className="lg:col-span-4 space-y-4">
          {selectedDevice && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div
                    className="p-1.5 rounded text-white"
                    style={{ backgroundColor: STORE_VLANS[selectedDevice.vlan]?.color }}
                  >
                    {getDeviceIcon(selectedDevice.type)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white leading-tight">
                      {selectedDevice.name}
                    </h3>
                    <span className="text-[11px] text-slate-400 font-mono">
                      Role: {selectedDevice.role.toUpperCase()}
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                  ONLINE
                </span>
              </div>

              {/* IP / Network Specs */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Assigned IPv4</span>
                  <span className="font-mono text-slate-200 font-semibold">{selectedDevice.ip}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">MAC Address</span>
                  <span className="font-mono text-slate-300">{selectedDevice.mac}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">VLAN Segment</span>
                  <span className="font-medium text-slate-200">
                    VLAN {selectedDevice.vlan} ({STORE_VLANS[selectedDevice.vlan]?.name.split(':')[1]?.trim()})
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Default Gateway</span>
                  <span className="font-mono text-slate-300">
                    {STORE_VLANS[selectedDevice.vlan]?.gateway}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Connected SSID</span>
                  <span className="font-medium text-indigo-400">{selectedDevice.currentSsid}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Associated AP</span>
                  <span className="text-slate-200">
                    {INITIAL_ACCESS_POINTS.find((a) => a.id === selectedDevice.connectedApId)?.name || 'AP-01'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Signal RSSI</span>
                  <span className="font-mono text-emerald-400 font-semibold">
                    {selectedDevice.rssi} dBm (Excellent)
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">QoS Priority Queue</span>
                  <span className="font-mono text-slate-300">
                    {STORE_VLANS[selectedDevice.vlan]?.qosPriority}
                  </span>
                </div>
              </div>

              {/* Security Policy Badge */}
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                  <Shield className="w-3.5 h-3.5 text-indigo-400" />
                  Isolation & Security Rules
                </div>
                <p className="text-[11px] text-slate-400 leading-normal">
                  {STORE_VLANS[selectedDevice.vlan]?.description}
                </p>
              </div>

              {onSelectDeviceForTest && (
                <button
                  onClick={() => onSelectDeviceForTest(selectedDevice.id)}
                  className="w-full py-2 px-3 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors cursor-pointer text-center"
                >
                  Test Online Communication for this Node &rarr;
                </button>
              )}
            </div>
          )}

          {selectedAp && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded bg-indigo-600 text-white">
                    <Wifi className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white leading-tight">
                      {selectedAp.name}
                    </h3>
                    <span className="text-[11px] text-slate-400">
                      {selectedAp.location}
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                  ACTIVE
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Hardware Standard</span>
                  <span className="font-medium text-slate-200">802.11ax (Wi-Fi 6)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Management IP</span>
                  <span className="font-mono text-slate-300">{selectedAp.ip}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">2.4 GHz Radio</span>
                  <span className="font-mono text-slate-200">
                    Ch {selectedAp.radio24Channel} ({selectedAp.radio24Width}MHz, {selectedAp.radio24Power}dBm)
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">5 GHz Radio</span>
                  <span className="font-mono text-slate-200">
                    Ch {selectedAp.radio5Channel} ({selectedAp.radio5Width}MHz, {selectedAp.radio5Power}dBm)
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Connected Clients</span>
                  <span className="font-mono text-emerald-400 font-semibold">
                    {selectedAp.connectedClientsCount} devices active
                  </span>
                </div>
              </div>

              {/* Broadcast SSIDs */}
              <div className="space-y-1.5">
                <span className="text-[11px] text-slate-400 font-medium">Broadcast SSIDs:</span>
                <div className="space-y-1">
                  {selectedAp.ssidsBroadcast.map((s) => (
                    <div
                      key={s}
                      className="flex items-center justify-between px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-xs"
                    >
                      <span className="font-medium text-indigo-300">{s}</span>
                      <span className="text-[10px] text-slate-500 font-mono">BSSID Active</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Architecture Structural Summary */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
            <h4 className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-indigo-400" />
              Network Core & Perimeter Design
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-200">Layer 3 Managed Switch:</strong> Handles 802.1Q trunking, routing internal traffic between VLAN 20 and local ERP servers.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-200">PCI-DSS Isolation (VLAN 10):</strong> POS registers cannot reach Guest VLAN 30 or Internet browsing ports. Only secure port 443 to authorized payment processors.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-200">Guest Client Isolation (VLAN 30):</strong> Layer 2 station isolation prevents shopper devices from discovering or attacking each other over Wi-Fi.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
