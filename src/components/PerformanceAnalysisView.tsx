import React, { useState } from 'react';
import { calculatePerformanceMetrics } from '../utils/networkCalculations';
import {
  BarChart3,
  Sliders,
  Zap,
  Activity,
  Layers,
  Clock,
  Wifi,
  Radio,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export const PerformanceAnalysisView: React.FC = () => {
  const [concurrentShoppers, setConcurrentShoppers] = useState<number>(45);
  const [isWmmQosEnabled, setIsWmmQosEnabled] = useState<boolean>(true);
  const [clientRssi, setClientRssi] = useState<number>(-58);
  const [isFiberWan, setIsFiberWan] = useState<boolean>(true);

  const metrics = calculatePerformanceMetrics(
    concurrentShoppers,
    isWmmQosEnabled,
    clientRssi,
    isFiberWan
  );

  // Compare metrics with QoS disabled to demonstrate impact
  const metricsWithoutQos = calculatePerformanceMetrics(
    concurrentShoppers,
    false,
    clientRssi,
    isFiberWan
  );

  return (
    <div className="space-y-6">
      {/* Title & Introduction */}
      <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800">
        <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-indigo-400" />
          Retail Wireless Network Performance & QoS Analysis
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
          Evaluate airtime contention, end-to-end round-trip latency (RTT) decomposition, packet jitter, and channel saturation under peak store traffic. Discover how 802.11e WMM Quality of Service prevents guest bandwidth hogging from stalling mission-critical POS payments.
        </p>
      </div>

      {/* Interactive Controls Deck */}
      <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <span className="text-xs font-bold text-white flex items-center gap-1.5">
            <Sliders className="w-4 h-4 text-indigo-400" />
            Live Traffic Simulation Controls
          </span>
          <span className="text-[11px] text-slate-400">
            Real-Time Contention Modeling
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          {/* Slider: Concurrent Shoppers */}
          <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">Active Shoppers on Wi-Fi:</span>
              <span className="font-mono text-indigo-400 font-bold tabular-nums">
                {concurrentShoppers} devices
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="150"
              step="5"
              value={concurrentShoppers}
              onChange={(e) => setConcurrentShoppers(Number(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>5 (Quiet)</span>
              <span>75 (Normal)</span>
              <span>150 (Black Friday)</span>
            </div>
          </div>

          {/* Slider: Wi-Fi Signal RSSI */}
          <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">Device Signal (RSSI):</span>
              <span
                className={`font-mono font-bold tabular-nums ${
                  clientRssi > -65
                    ? 'text-emerald-400'
                    : clientRssi > -75
                    ? 'text-amber-400'
                    : 'text-rose-400'
                }`}
              >
                {clientRssi} dBm
              </span>
            </div>
            <input
              type="range"
              min="-88"
              max="-40"
              value={clientRssi}
              onChange={(e) => setClientRssi(Number(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>-88 (Fringe)</span>
              <span>-65 (Good)</span>
              <span>-40 (Near AP)</span>
            </div>
          </div>

          {/* Toggle: WMM QoS Priority */}
          <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 flex flex-col justify-between">
            <div>
              <span className="text-slate-300 font-semibold block">802.11e WMM QoS</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">
                Voice (AC_VO) queue for POS
              </span>
            </div>
            <button
              onClick={() => setIsWmmQosEnabled(!isWmmQosEnabled)}
              className={`w-full py-1.5 px-3 rounded text-xs font-semibold transition-colors cursor-pointer text-center mt-2 ${
                isWmmQosEnabled
                  ? 'bg-emerald-950 border border-emerald-700 text-emerald-300'
                  : 'bg-rose-950 border border-rose-800 text-rose-300'
              }`}
            >
              {isWmmQosEnabled ? 'QoS: ENABLED (Prioritized)' : 'QoS: DISABLED (Best Effort)'}
            </button>
          </div>

          {/* Toggle: WAN Uplink Type */}
          <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 flex flex-col justify-between">
            <div>
              <span className="text-slate-300 font-semibold block">Store WAN Connection</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">
                Primary vs Backup failover
              </span>
            </div>
            <button
              onClick={() => setIsFiberWan(!isFiberWan)}
              className={`w-full py-1.5 px-3 rounded text-xs font-semibold transition-colors cursor-pointer text-center mt-2 ${
                isFiberWan
                  ? 'bg-indigo-950 border border-indigo-700 text-indigo-300'
                  : 'bg-amber-950 border border-amber-800 text-amber-300'
              }`}
            >
              {isFiberWan ? '1 Gbps Fiber (14ms)' : '4G Backup Link (46ms)'}
            </button>
          </div>
        </div>
      </div>

      {/* Main KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono tabular-nums">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] text-slate-500 uppercase block font-sans">
            Total End-to-End Latency (RTT)
          </span>
          <span className="text-2xl font-bold text-white mt-1 block">
            {metrics.totalRoundTripTimeMs} ms
          </span>
          <span className="text-[11px] text-emerald-400 font-sans mt-0.5 block">
            POS SLA Target: &lt; 150 ms (Met)
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] text-slate-500 uppercase block font-sans">
            Wireless Airtime Contention
          </span>
          <span className="text-2xl font-bold text-indigo-400 mt-1 block">
            {metrics.wifiAirtimeLatencyMs} ms
          </span>
          <span className="text-[11px] text-slate-400 font-sans mt-0.5 block">
            CSMA/CA Backoff Window
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] text-slate-500 uppercase block font-sans">
            RF Channel Utilization
          </span>
          <span
            className={`text-2xl font-bold mt-1 block ${
              metrics.channelUtilizationPercent > 80
                ? 'text-rose-400'
                : metrics.channelUtilizationPercent > 55
                ? 'text-amber-400'
                : 'text-emerald-400'
            }`}
          >
            {metrics.channelUtilizationPercent}%
          </span>
          <span className="text-[11px] text-slate-400 font-sans mt-0.5 block">
            {metrics.channelUtilizationPercent > 80 ? 'Heavy Contention' : 'Healthy Capacity'}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] text-slate-500 uppercase block font-sans">
            Packet Loss / Retransmit Rate
          </span>
          <span
            className={`text-2xl font-bold mt-1 block ${
              metrics.packetLossPercent > 5 ? 'text-rose-400' : 'text-emerald-400'
            }`}
          >
            {metrics.packetLossPercent}%
          </span>
          <span className="text-[11px] text-slate-400 font-sans mt-0.5 block">
            Jitter: &plusmn;{metrics.jitterMs} ms
          </span>
        </div>
      </div>

      {/* Latency Waterfall Breakdown & QoS Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Waterfall Breakdown (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-indigo-400" />
              Round-Trip Latency (RTT) Segment Waterfall
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              Sum = {metrics.totalRoundTripTimeMs} ms
            </span>
          </div>

          <div className="space-y-3 text-xs">
            {/* Wi-Fi Segment */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-300 font-medium">1. Wi-Fi 6 Wireless Airtime (RF Access)</span>
                <span className="font-mono text-indigo-400 font-bold">
                  {metrics.wifiAirtimeLatencyMs} ms
                </span>
              </div>
              <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-500 h-full rounded-full transition-all"
                  style={{
                    width: `${Math.min(100, (metrics.wifiAirtimeLatencyMs / metrics.totalRoundTripTimeMs) * 100)}%`,
                  }}
                />
              </div>
            </div>

            {/* Switching / Router Segment */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-300 font-medium">2. Core Switch & Firewall Forwarding</span>
                <span className="font-mono text-slate-200 font-bold">
                  {metrics.switchRouterLatencyMs} ms
                </span>
              </div>
              <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-slate-400 h-full rounded-full transition-all"
                  style={{
                    width: `${Math.min(100, (metrics.switchRouterLatencyMs / metrics.totalRoundTripTimeMs) * 100)}%`,
                  }}
                />
              </div>
            </div>

            {/* WAN Uplink Segment */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-300 font-medium">
                  3. WAN ISP Uplink ({isFiberWan ? '1G Fiber' : '4G Backup'})
                </span>
                <span className="font-mono text-cyan-400 font-bold">
                  {metrics.wanUplinkLatencyMs} ms
                </span>
              </div>
              <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-cyan-500 h-full rounded-full transition-all"
                  style={{
                    width: `${Math.min(100, (metrics.wanUplinkLatencyMs / metrics.totalRoundTripTimeMs) * 100)}%`,
                  }}
                />
              </div>
            </div>

            {/* Cloud Server Segment */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-300 font-medium">4. Cloud API Server Execution & Database RTT</span>
                <span className="font-mono text-emerald-400 font-bold">
                  {metrics.serverProcessingMs} ms
                </span>
              </div>
              <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all"
                  style={{
                    width: `${Math.min(100, (metrics.serverProcessingMs / metrics.totalRoundTripTimeMs) * 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* WMM QoS Comparison Card (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-emerald-400" />
              QoS Impact: Critical POS vs Guest Traffic
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
              <div className="flex justify-between font-semibold">
                <span className="text-slate-200">With 802.11e WMM Enabled (AC_VO):</span>
                <span className="font-mono text-emerald-400">{metrics.totalRoundTripTimeMs} ms</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-normal">
                POS registers access the wireless medium with shortest Arbitrary Inter-Frame Space (AIFS=2) and smaller contention windows (CWmin=3). Transactions finish immediately.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
              <div className="flex justify-between font-semibold">
                <span className="text-slate-200">Without QoS (Best Effort Default):</span>
                <span className="font-mono text-rose-400">{metricsWithoutQos.totalRoundTripTimeMs} ms</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-normal">
                POS registers must compete equally against 100+ shoppers downloading videos or browsing social media, leading to payment timeouts and customer queue delays.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-indigo-950/40 border border-indigo-900/60 text-indigo-200 text-[11px] leading-relaxed">
              <strong>Architecture Takeaway:</strong> By binding VLAN 10 to WMM Voice (AC_VO) on the AP controller, retail checkout availability is mathematically insulated from customer Wi-Fi usage.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
