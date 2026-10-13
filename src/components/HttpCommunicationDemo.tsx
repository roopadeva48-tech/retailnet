import React, { useState, useEffect } from 'react';
import { HTTP_ENDPOINTS_CATALOG } from '../data/storeTopology';
import { HandshakeStep, HttpEndpoint } from '../types/network';
import { buildHttpLifecycleSteps } from '../utils/networkCalculations';
import {
  FileCode,
  Lock,
  ArrowRight,
  RotateCcw,
  Play,
  Pause,
  Server,
  Layers,
  CheckCircle2,
  Cpu,
  Clock,
  Shield,
  Send,
} from 'lucide-react';

export const HttpCommunicationDemo: React.FC = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<HttpEndpoint>(HTTP_ENDPOINTS_CATALOG[0]);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activeSubTab, setActiveSubTab] = useState<'lifecycle' | 'raw_http' | 'protocol_comparison'>('lifecycle');

  const domain = new URL(selectedEndpoint.url).hostname;
  const path = new URL(selectedEndpoint.url).pathname;
  const isHttps = selectedEndpoint.url.startsWith('https://');

  const steps: HandshakeStep[] = buildHttpLifecycleSteps(
    domain,
    path,
    selectedEndpoint.method,
    isHttps,
    selectedEndpoint.responseStatus
  );

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setActiveStepIndex((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2200);
    }
    return () => clearInterval(timer);
  }, [isPlaying, steps.length]);

  const currentStep = steps[activeStepIndex] || steps[0];

  const handleSelectEndpoint = (ep: HttpEndpoint) => {
    setSelectedEndpoint(ep);
    setActiveStepIndex(0);
    setIsPlaying(false);
  };

  return (
    <div className="space-y-6">
      {/* Title & Introduction */}
      <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800">
        <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <FileCode className="w-5 h-5 text-indigo-400" />
          HTTP & TLS 1.3 Communication Lifecycle
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
          Modern retail operations rely on stateless RESTful HTTP requests over TLS 1.3 encrypted sessions. Experience the complete packet exchange sequence: TCP 3-Way Handshake &rarr; TLS 1.3 Cryptographic Key Exchange &rarr; Encrypted HTTP Application Request &rarr; Cloud Processing &rarr; HTTP Response.
        </p>
      </div>

      {/* Preset Transactions Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-lg bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-medium text-slate-400 mr-1">Retail Transaction:</span>
          {HTTP_ENDPOINTS_CATALOG.map((ep) => (
            <button
              key={ep.id}
              onClick={() => handleSelectEndpoint(ep)}
              className={`px-3 py-1.5 text-xs rounded transition-colors cursor-pointer flex items-center gap-1.5 ${
                selectedEndpoint.id === ep.id
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'bg-slate-800/70 hover:bg-slate-800 text-slate-300'
              }`}
            >
              <span
                className={`px-1 py-0.2 text-[9px] font-mono font-bold rounded ${
                  ep.method === 'POST' ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
                }`}
              >
                {ep.method}
              </span>
              <span>{ep.serviceName}</span>
            </button>
          ))}
        </div>

        {/* View Modes */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setActiveSubTab('lifecycle')}
            className={`px-2.5 py-1 text-xs rounded transition-colors cursor-pointer ${
              activeSubTab === 'lifecycle'
                ? 'bg-indigo-600 text-white font-medium'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Packet Exchange
          </button>
          <button
            onClick={() => setActiveSubTab('raw_http')}
            className={`px-2.5 py-1 text-xs rounded transition-colors cursor-pointer ${
              activeSubTab === 'raw_http'
                ? 'bg-indigo-600 text-white font-medium'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            HTTP Inspector
          </button>
          <button
            onClick={() => setActiveSubTab('protocol_comparison')}
            className={`px-2.5 py-1 text-xs rounded transition-colors cursor-pointer ${
              activeSubTab === 'protocol_comparison'
                ? 'bg-indigo-600 text-white font-medium'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            HTTP/1.1 vs 2 vs 3
          </button>
        </div>
      </div>

      {activeSubTab === 'lifecycle' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-6">
          {/* Header & Controls */}
          <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <span
                className={`px-2 py-0.5 text-xs font-mono font-bold rounded ${
                  selectedEndpoint.method === 'POST' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
                }`}
              >
                {selectedEndpoint.method}
              </span>
              <span className="font-mono text-xs text-slate-200 truncate max-w-md">
                {selectedEndpoint.url}
              </span>
              {isHttps && (
                <span className="flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded">
                  <Lock className="w-3 h-3" /> TLS 1.3 Encrypted
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveStepIndex((prev) => Math.max(0, prev - 1))}
                disabled={activeStepIndex === 0}
                className="px-2.5 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Back
              </button>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-3 py-1 text-xs font-semibold rounded bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5 cursor-pointer"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                {isPlaying ? 'Pause' : 'Auto-Play'}
              </button>
              <button
                onClick={() => setActiveStepIndex((prev) => Math.min(steps.length - 1, prev + 1))}
                disabled={activeStepIndex === steps.length - 1}
                className="px-2.5 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Next Step
              </button>
              <button
                onClick={() => {
                  setActiveStepIndex(0);
                  setIsPlaying(false);
                }}
                className="p-1.5 text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 cursor-pointer"
                title="Reset"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Sequence Timeline Bars */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Exchange Phase Progress</span>
              <span className="font-mono text-indigo-400">
                Step {activeStepIndex + 1} of {steps.length}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-1.5">
              {steps.map((st, idx) => (
                <button
                  key={st.stepIndex}
                  onClick={() => {
                    setActiveStepIndex(idx);
                    setIsPlaying(false);
                  }}
                  className={`p-2 rounded text-left transition-all border cursor-pointer ${
                    activeStepIndex === idx
                      ? 'bg-indigo-950 border-indigo-400 ring-1 ring-indigo-500'
                      : activeStepIndex > idx
                      ? 'bg-slate-950 border-slate-800 text-slate-400'
                      : 'bg-slate-950/40 border-slate-900 text-slate-600'
                  }`}
                >
                  <div className="text-[9px] font-mono text-slate-500 uppercase">
                    {st.phase}
                  </div>
                  <div className="text-[11px] font-semibold text-slate-200 truncate">
                    {st.title.split(' ')[0]} {st.title.split(' ')[1]}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Active Step Visual Representation */}
          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs font-bold font-mono text-indigo-400">
                PHASE: {currentStep.phase} &mdash; STEP {currentStep.stepIndex}: {currentStep.title}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-2">
                <span>{currentStep.sender}</span>
                <ArrowRight className="w-3.5 h-3.5 text-indigo-400" />
                <span>{currentStep.receiver}</span>
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {currentStep.summary}
            </p>

            {/* Protocol Wire Parameters */}
            <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-mono block">
                Wire Frame Protocol Parameters:
              </span>
              <div className="space-y-1.5 text-xs font-mono">
                {currentStep.protocolDetails.flags && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">TCP Control Flags:</span>
                    <span className="text-indigo-300 font-semibold">{currentStep.protocolDetails.flags}</span>
                  </div>
                )}
                {currentStep.protocolDetails.seqNumber && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Sequence Number (Raw):</span>
                    <span className="text-slate-200">{currentStep.protocolDetails.seqNumber}</span>
                  </div>
                )}
                {currentStep.protocolDetails.ackNumber && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Acknowledgment Number:</span>
                    <span className="text-slate-200">{currentStep.protocolDetails.ackNumber}</span>
                  </div>
                )}
                {currentStep.protocolDetails.cipherSuite && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Negotiated Cipher:</span>
                    <span className="text-emerald-400">{currentStep.protocolDetails.cipherSuite}</span>
                  </div>
                )}
                {currentStep.protocolDetails.headers &&
                  Object.entries(currentStep.protocolDetails.headers).map(([key, val]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-slate-400">{key}:</span>
                      <span className="text-slate-200">{val}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Raw HTTP Request & Response Inspector */}
      {activeSubTab === 'raw_http' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Client Request Inspector */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Send className="w-3.5 h-3.5 text-indigo-400" />
                Raw Client HTTP Request Headers
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                {selectedEndpoint.method} {path} HTTP/1.1
              </span>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 font-mono text-xs text-slate-300 space-y-1 overflow-x-auto">
              <div className="text-amber-400 font-semibold">
                {selectedEndpoint.method} {path} HTTP/1.1
              </div>
              {Object.entries(selectedEndpoint.requestHeaders).map(([k, v]) => (
                <div key={k}>
                  <span className="text-indigo-400">{k}</span>: {v}
                </div>
              ))}
            </div>

            {selectedEndpoint.requestBody && (
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-slate-400">Request JSON Body Payload:</span>
                <pre className="p-3 rounded-lg bg-slate-950 font-mono text-xs text-emerald-300 overflow-x-auto">
                  {selectedEndpoint.requestBody}
                </pre>
              </div>
            )}
          </div>

          {/* Server Response Inspector */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Raw Server HTTP Response Headers
              </span>
              <span className="text-[10px] font-mono text-emerald-400 font-semibold">
                HTTP/1.1 {selectedEndpoint.responseStatus} OK
              </span>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 font-mono text-xs text-slate-300 space-y-1 overflow-x-auto">
              <div className="text-emerald-400 font-semibold">
                HTTP/1.1 {selectedEndpoint.responseStatus} {selectedEndpoint.responseStatus === 200 ? 'OK' : 'Found'}
              </div>
              {Object.entries(selectedEndpoint.responseHeaders).map(([k, v]) => (
                <div key={k}>
                  <span className="text-indigo-400">{k}</span>: {v}
                </div>
              ))}
            </div>

            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-400">Response Body Payload:</span>
              <pre className="p-3 rounded-lg bg-slate-950 font-mono text-xs text-cyan-300 overflow-x-auto">
                {selectedEndpoint.responseBody}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Protocol Evolution Comparison (HTTP/1.1 vs HTTP/2 vs HTTP/3) */}
      {activeSubTab === 'protocol_comparison' && (
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            HTTP Protocol Evolution & Impact on Modern Retail Store Operations
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* HTTP/1.1 */}
            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2.5">
              <div className="font-bold text-slate-200">HTTP/1.1 (1997)</div>
              <div className="text-[11px] text-slate-400">
                Transport: Single TCP connection with keep-alive.
              </div>
              <div className="p-2 rounded bg-slate-900 text-rose-300 text-[11px]">
                <strong>Limitation:</strong> Head-of-line (HOL) blocking. Only one request/response at a time per TCP pipe.
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                In retail: Slow loading of multi-item digital catalog images; registers must open multiple parallel TCP connections, consuming Wi-Fi airtime.
              </p>
            </div>

            {/* HTTP/2 */}
            <div className="p-4 rounded-lg bg-slate-950 border border-indigo-900/60 space-y-2.5">
              <div className="font-bold text-indigo-400">HTTP/2 (2015)</div>
              <div className="text-[11px] text-slate-400">
                Transport: Single TCP connection with Binary Framing.
              </div>
              <div className="p-2 rounded bg-slate-900 text-indigo-300 text-[11px]">
                <strong>Advantage:</strong> Multiplexing & HPACK header compression. Dozens of requests stream over 1 connection.
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                In retail: Electronic shelf labels and POS registers stream real-time price updates concurrently without socket starvation.
              </p>
            </div>

            {/* HTTP/3 */}
            <div className="p-4 rounded-lg bg-slate-950 border border-emerald-900/60 space-y-2.5">
              <div className="font-bold text-emerald-400">HTTP/3 (QUIC / UDP) (2022)</div>
              <div className="text-[11px] text-slate-400">
                Transport: QUIC over UDP (0-RTT Handshake).
              </div>
              <div className="p-2 rounded bg-slate-900 text-emerald-300 text-[11px]">
                <strong>Advantage:</strong> Connection Migration & zero TCP head-of-line blocking on packet drops.
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                In retail: When a stock associate walks with a handheld scanner between Access Points (AP-Floor &rarr; AP-Warehouse), the QUIC connection persists seamlessly without dropping inventory transactions!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
