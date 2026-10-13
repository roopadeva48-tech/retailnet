import React, { useState } from 'react';
import {
  INITIAL_ACCESS_POINTS,
  INITIAL_SSID_PROFILES,
  STORE_VLANS,
} from '../data/storeTopology';
import { AccessPoint, SsidProfile } from '../types/network';
import { calculateWifiSignal } from '../utils/networkCalculations';
import {
  Wifi,
  Radio,
  Sliders,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Zap,
  Layers,
  Activity,
  AlertTriangle,
} from 'lucide-react';

export const WifiConfigurationLab: React.FC = () => {
  const [ssidProfiles, setSsidProfiles] = useState<SsidProfile[]>(INITIAL_SSID_PROFILES);
  const [accessPoints, setAccessPoints] = useState<AccessPoint[]>(INITIAL_ACCESS_POINTS);
  const [selectedSsidId, setSelectedSsidId] = useState<string>('ssid-guest');
  const [selectedApId, setSelectedApId] = useState<string>('ap-entrance');

  // Probe Position on Store floor
  const [probePos, setProbePos] = useState<{ x: number; y: number }>({ x: 45, y: 35 });
  const [obstacleCount, setObstacleCount] = useState<number>(2);

  const activeSsid = ssidProfiles.find((s) => s.id === selectedSsidId) || ssidProfiles[0];
  const activeAp = accessPoints.find((a) => a.id === selectedApId) || accessPoints[0];

  // Calculate RF signal at probe position to the active AP
  const probeSignal = calculateWifiSignal(
    probePos,
    { x: activeAp.x, y: activeAp.y },
    activeAp.radio5Power,
    5,
    obstacleCount
  );

  const handleUpdateSsid = (field: keyof SsidProfile, value: any) => {
    setSsidProfiles((prev) =>
      prev.map((s) => (s.id === selectedSsidId ? { ...s, [field]: value } : s))
    );
  };

  const handleUpdateAp = (field: keyof AccessPoint, value: any) => {
    setAccessPoints((prev) =>
      prev.map((a) => (a.id === selectedApId ? { ...a, [field]: value } : a))
    );
  };

  return (
    <div className="space-y-6">
      {/* Title & Introduction */}
      <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800">
        <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <Radio className="w-5 h-5 text-indigo-400" />
          Wi-Fi 6 (802.11ax) Connectivity & RF Configuration Lab
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
          Configure multi-SSID wireless profiles, 2.4/5 GHz non-overlapping channel spectrum planning, 802.1X WPA3 Enterprise authentication, client isolation rules, and probe live RF signal propagation across the store floor.
        </p>
      </div>

      {/* Main Grid: Left SSID & AP Config (7 Cols) / Right RF Signal Prober (5 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: SSID & AP Configuration */}
        <div className="lg:col-span-7 space-y-6">
          {/* SSID Profile Management */}
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Wifi className="w-4 h-4 text-indigo-400" />
                Wireless Network Profiles (SSIDs)
              </span>
              <span className="text-[11px] text-slate-400">
                Segmented Multi-BSSID Broadcast
              </span>
            </div>

            {/* Profile Selector */}
            <div className="grid grid-cols-3 gap-2">
              {ssidProfiles.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedSsidId(s.id)}
                  className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                    selectedSsidId === s.id
                      ? 'bg-indigo-950/80 border-indigo-400 ring-1 ring-indigo-500'
                      : 'bg-slate-950 border-slate-800 hover:bg-slate-900 text-slate-400'
                  }`}
                >
                  <div className="text-xs font-bold text-white truncate">{s.ssid}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5 font-mono">
                    VLAN {s.vlan} &bull; {s.securityMode.split(' ')[0]}
                  </div>
                </button>
              ))}
            </div>

            {/* Active SSID Settings Form */}
            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">SSID Broadcast Name</label>
                  <input
                    type="text"
                    value={activeSsid.ssid}
                    onChange={(e) => handleUpdateSsid('ssid', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded bg-slate-900 border border-slate-800 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">VLAN Mapping (802.1Q)</label>
                  <select
                    value={activeSsid.vlan}
                    onChange={(e) => handleUpdateSsid('vlan', Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded bg-slate-900 border border-slate-800 text-white"
                  >
                    <option value={10}>VLAN 10: Store POS & Payments</option>
                    <option value={20}>VLAN 20: Staff & Operations</option>
                    <option value={30}>VLAN 30: Customer Guest Wi-Fi</option>
                    <option value={40}>VLAN 40: Store IoT & Telemetry</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Security Standard</label>
                  <select
                    value={activeSsid.securityMode}
                    onChange={(e) => handleUpdateSsid('securityMode', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded bg-slate-900 border border-slate-800 text-white"
                  >
                    <option value="Open (Captive Portal)">Open (Captive Portal)</option>
                    <option value="WPA3-Personal (SAE)">WPA3-Personal (SAE)</option>
                    <option value="WPA3-Enterprise (802.1X/EAP-TLS)">WPA3-Enterprise (802.1X/EAP-TLS)</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Radio Band Preference</label>
                  <select
                    value={activeSsid.bandPreference}
                    onChange={(e) => handleUpdateSsid('bandPreference', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded bg-slate-900 border border-slate-800 text-white"
                  >
                    <option value="Dual (Band Steering)">Dual (Band Steering to 5GHz)</option>
                    <option value="5GHz">5 GHz Dedicated (High Throughput)</option>
                    <option value="2.4GHz">2.4 GHz Only (Extended Range)</option>
                  </select>
                </div>
              </div>

              {/* Toggles: Client Isolation & WMM QoS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-center justify-between p-2.5 rounded bg-slate-900 border border-slate-800">
                  <div>
                    <span className="font-semibold text-slate-200 block">Client-to-Client Isolation</span>
                    <span className="text-[10px] text-slate-500">Prevent wireless peer snooping</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={activeSsid.clientIsolation}
                    onChange={(e) => handleUpdateSsid('clientIsolation', e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-2.5 rounded bg-slate-900 border border-slate-800">
                  <div>
                    <span className="font-semibold text-slate-200 block">WMM QoS Prioritization</span>
                    <span className="text-[10px] text-slate-500">802.11e multimedia queueing</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={activeSsid.wmmEnabled}
                    onChange={(e) => handleUpdateSsid('wmmEnabled', e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 cursor-pointer"
                  />
                </div>
              </div>

              {/* Bandwidth Limiter Slider */}
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-300">Download Rate Limit:</span>
                  <span className="font-mono text-indigo-400 font-bold">
                    {activeSsid.bandwidthCapDownload === 0 ? 'Unlimited (Line Rate)' : `${activeSsid.bandwidthCapDownload} Mbps`}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={activeSsid.bandwidthCapDownload}
                  onChange={(e) => handleUpdateSsid('bandwidthCapDownload', Number(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Access Point RF Radio & Channel Planning */}
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Radio className="w-4 h-4 text-indigo-400" />
                Access Point RF Radio & Channel Plan
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                {activeAp.name}
              </span>
            </div>

            {/* AP Selection Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {accessPoints.map((ap) => (
                <button
                  key={ap.id}
                  onClick={() => setSelectedApId(ap.id)}
                  className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                    selectedApId === ap.id
                      ? 'bg-indigo-950/80 border-indigo-400 ring-1 ring-indigo-500'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="text-xs font-bold text-white truncate">{ap.name.split(' ')[0]}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{ap.location.split(' ')[0]}</div>
                </button>
              ))}
            </div>

            {/* 2.4 GHz vs 5 GHz Radio Tuner */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* 2.4 GHz Radio */}
              <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-200">2.4 GHz Radio</span>
                  <span className="text-[10px] text-slate-500 font-mono">Channels 1, 6, 11</span>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Non-Overlapping Channel</label>
                  <select
                    value={activeAp.radio24Channel}
                    onChange={(e) => handleUpdateAp('radio24Channel', Number(e.target.value))}
                    className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-800 text-white"
                  >
                    <option value={1}>Channel 1 (2412 MHz)</option>
                    <option value={6}>Channel 6 (2437 MHz)</option>
                    <option value={11}>Channel 11 (2462 MHz)</option>
                  </select>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-400">Transmit Power:</span>
                    <span className="font-mono text-indigo-400">{activeAp.radio24Power} dBm</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="23"
                    value={activeAp.radio24Power}
                    onChange={(e) => handleUpdateAp('radio24Power', Number(e.target.value))}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* 5 GHz Radio */}
              <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-indigo-400">5 GHz Radio (High Capacity)</span>
                  <span className="text-[10px] text-slate-500 font-mono">UNII-1 & UNII-3</span>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">5 GHz Channel</label>
                  <select
                    value={activeAp.radio5Channel}
                    onChange={(e) => handleUpdateAp('radio5Channel', Number(e.target.value))}
                    className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-800 text-white"
                  >
                    <option value={36}>Channel 36 (5180 MHz - UNII-1)</option>
                    <option value={44}>Channel 44 (5220 MHz - UNII-1)</option>
                    <option value={149}>Channel 149 (5745 MHz - UNII-3)</option>
                    <option value={157}>Channel 157 (5785 MHz - UNII-3)</option>
                  </select>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-400">Channel Width:</span>
                    <span className="font-mono text-indigo-400">{activeAp.radio5Width} MHz</span>
                  </div>
                  <select
                    value={activeAp.radio5Width}
                    onChange={(e) => handleUpdateAp('radio5Width', Number(e.target.value))}
                    className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-800 text-white"
                  >
                    <option value={20}>20 MHz (High Density / Least Interference)</option>
                    <option value={40}>40 MHz (Balanced Retail Default)</option>
                    <option value={80}>80 MHz (Maximum Peak Throughput)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live RF Floorplan Signal Prober & Association Lifecycle */}
        <div className="lg:col-span-5 space-y-6">
          {/* Signal Prober */}
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-emerald-400" />
                Live RF Signal & Path Loss Prober
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                Active AP: {activeAp.name.split(' ')[0]}
              </span>
            </div>

            <p className="text-[11px] text-slate-400">
              Simulate device distance and store structural obstacles (metal shelving racks and perimeter walls) to calculate real-world RSSI and PHY rates.
            </p>

            {/* Mini Store Click/Drag Canvas */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Click inside to move Client Probe:</span>
                <span className="font-mono text-indigo-400">
                  X: {probePos.x}%, Y: {probePos.y}%
                </span>
              </div>

              <div
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
                  const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
                  setProbePos({ x, y });
                }}
                className="relative w-full aspect-[4/3] bg-slate-950 rounded-lg border border-slate-800 cursor-crosshair overflow-hidden select-none"
              >
                {/* Visual AP location */}
                <div
                  className="absolute -translate-x-1/2 -translate-y-1/2 p-2 rounded-full bg-indigo-600 text-white shadow-lg pointer-events-none"
                  style={{ left: `${activeAp.x}%`, top: `${activeAp.y}%` }}
                >
                  <Wifi className="w-3.5 h-3.5" />
                </div>

                {/* Probe client position */}
                <div
                  className="absolute -translate-x-1/2 -translate-y-1/2 p-1.5 rounded-md bg-emerald-500 text-white shadow-md pointer-events-none ring-2 ring-white"
                  style={{ left: `${probePos.x}%`, top: `${probePos.y}%` }}
                >
                  <div className="w-2 h-2 rounded-full bg-white animate-ping" />
                </div>

                {/* Line between AP and probe */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
                  <line
                    x1={activeAp.x}
                    y1={activeAp.y}
                    x2={probePos.x}
                    y2={probePos.y}
                    stroke="#10b981"
                    strokeWidth="0.8"
                    strokeDasharray="2,2"
                  />
                </svg>

                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-slate-900/90 text-[10px] text-slate-400 font-mono border border-slate-800">
                  Distance: {probeSignal.distanceMeters} meters
                </div>
              </div>
            </div>

            {/* Obstacle slider */}
            <div className="p-2.5 rounded bg-slate-950 border border-slate-800 space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Intervening Metal Shelves/Walls:</span>
                <span className="font-mono text-indigo-400 font-bold">{obstacleCount} obstacles</span>
              </div>
              <input
                type="range"
                min="0"
                max="5"
                value={obstacleCount}
                onChange={(e) => setObstacleCount(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>

            {/* Real-Time Signal Output Metrics */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 block font-sans">Received Signal (RSSI)</span>
                <span
                  className={`text-base font-bold ${
                    probeSignal.rssi > -65
                      ? 'text-emerald-400'
                      : probeSignal.rssi > -75
                      ? 'text-amber-400'
                      : 'text-rose-400'
                  }`}
                >
                  {probeSignal.rssi} dBm
                </span>
                <span className="text-[10px] text-slate-400 block font-sans mt-0.5">
                  {probeSignal.rssi > -65 ? 'Optimal Link' : probeSignal.rssi > -75 ? 'Acceptable' : 'Roaming Needed'}
                </span>
              </div>

              <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 block font-sans">Signal-to-Noise Ratio (SNR)</span>
                <span className="text-base font-bold text-indigo-400">
                  {probeSignal.snr} dB
                </span>
                <span className="text-[10px] text-slate-400 block font-sans mt-0.5">
                  Noise Floor: -95 dBm
                </span>
              </div>

              <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 block font-sans">Wi-Fi Link Quality</span>
                <span className="text-base font-bold text-slate-200">
                  {probeSignal.qualityPercent}%
                </span>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className="bg-indigo-500 h-full rounded-full"
                    style={{ width: `${probeSignal.qualityPercent}%` }}
                  />
                </div>
              </div>

              <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 block font-sans">Theoretical PHY Rate</span>
                <span className="text-base font-bold text-emerald-400">
                  {probeSignal.theoreticalTxRateMbps} Mbps
                </span>
                <span className="text-[10px] text-slate-400 block font-sans mt-0.5">
                  802.11ax MCS 7-9
                </span>
              </div>
            </div>
          </div>

          {/* 802.11 Association Lifecycle Summary */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <h4 className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-indigo-400" />
              IEEE 802.11 Wireless Association State Machine
            </h4>

            <div className="space-y-1.5 text-xs text-slate-400">
              <div className="p-2 rounded bg-slate-950 border border-slate-800/80">
                <span className="font-semibold text-slate-200">1. Discovery:</span> Probe Request / Beacon Frame (SSID broadcast on beacon interval 100ms).
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800/80">
                <span className="font-semibold text-slate-200">2. Authentication:</span> 802.11 Open System Auth or WPA3 SAE (Simultaneous Authentication of Equals).
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800/80">
                <span className="font-semibold text-slate-200">3. Association:</span> 802.11 Association Request/Response, AP assigns Association ID (AID).
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800/80">
                <span className="font-semibold text-slate-200">4. Key Exchange:</span> 4-Way WPA EAPOL Handshake derives Pairwise Transient Key (PTK) for AES-GCMP 256.
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800/80">
                <span className="font-semibold text-slate-200">5. IP Lease (DHCP):</span> DORA exchange assigns IP, Subnet mask, and DNS Resolver on tagged VLAN.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
