import React, { useState, useEffect } from 'react';
import { DNS_RECORDS_CATALOG } from '../data/storeTopology';
import { DnsQueryStep, DnsRecord } from '../types/network';
import { buildDnsResolutionSteps } from '../utils/networkCalculations';
import {
  Globe,
  Server,
  Database,
  ArrowRight,
  RotateCcw,
  Play,
  Pause,
  CheckCircle,
  FileText,
  Clock,
  ShieldCheck,
  Terminal,
} from 'lucide-react';

export const DnsResolutionDemo: React.FC = () => {
  const [selectedRecord, setSelectedRecord] = useState<DnsRecord>(DNS_RECORDS_CATALOG[0]);
  const [customDomain, setCustomDomain] = useState<string>('');
  const [isCachedLocally, setIsCachedLocally] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Compute steps
  const activeDomain = customDomain.trim() || selectedRecord.domain;
  const activeRecordType = selectedRecord.type;
  const activeIpAnswer = selectedRecord.value;

  const steps: DnsQueryStep[] = buildDnsResolutionSteps(
    activeDomain,
    activeRecordType,
    activeIpAnswer,
    isCachedLocally
  );

  // Auto-play interval
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, steps.length]);

  const currentStep = steps[currentStepIndex] || steps[0];

  const handleSelectDomain = (record: DnsRecord) => {
    setSelectedRecord(record);
    setCustomDomain('');
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  const handleReset = () => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  return (
    <div className="space-y-6">
      {/* Title & Introduction */}
      <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800">
        <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <Globe className="w-5 h-5 text-indigo-400" />
          DNS Name Resolution Simulator
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
          The Domain Name System ) translates human-readable store service addresses into routable IP addresses. Experience the hierarchical query traversal from Client OS cache &rarr; Recursive Resolver &rarr; Root (.) &rarr; TLD &rarr; Authoritative Name Servers.
        </p>
      </div>

      {/* Preset Domain Pickers */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-lg bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-medium text-slate-400 mr-1">Target Service:</span>
          {DNS_RECORDS_CATALOG.map((rec) => (
            <button
              key={rec.domain}
              onClick={() => handleSelectDomain(rec)}
              className={`px-3 py-1.5 text-xs rounded transition-colors cursor-pointer ${
                activeDomain === rec.domain
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'bg-slate-800/70 hover:bg-slate-800 text-slate-300'
              }`}
            >
              {rec.domain}
            </button>
          ))}
        </div>

        {/* Cache Mode Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setIsCachedLocally(!isCachedLocally);
              setCurrentStepIndex(0);
            }}
            className={`px-3 py-1.5 text-xs rounded border transition-colors cursor-pointer flex items-center gap-1.5 ${
              isCachedLocally
                ? 'bg-emerald-950/70 border-emerald-700 text-emerald-300 font-medium'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            {isCachedLocally ? 'Local Cache: WARM (Hit)' : 'Local Cache: COLD (Miss)'}
          </button>
        </div>
      </div>

      {/* Resolution Visual Pipeline */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-slate-800">
          <div>
            <span className="text-xs text-slate-400">Resolving Hostname:</span>
            <div className="text-base font-bold font-mono text-indigo-400">
              {activeDomain} &rarr; {activeIpAnswer}
            </div>
          </div>

          {/* Stepper Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentStepIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentStepIndex === 0}
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
              onClick={() => setCurrentStepIndex((prev) => Math.min(steps.length - 1, prev + 1))}
              disabled={currentStepIndex === steps.length - 1}
              className="px-2.5 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Next Step
            </button>
            <button
              onClick={handleReset}
              className="p-1.5 text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 cursor-pointer"
              title="Reset"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Visual Node Flow Diagram */}
        <div className="relative py-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative z-10">
            {/* Node 1: Client Host */}
            <div
              className={`p-3.5 rounded-lg border text-center transition-all ${
                currentStepIndex === 0
                  ? 'bg-indigo-950/80 border-indigo-400 ring-2 ring-indigo-500/50 scale-105'
                  : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}
            >
              <div className="w-8 h-8 mx-auto rounded-full bg-slate-800 flex items-center justify-center text-slate-300 mb-2">
                <Terminal className="w-4 h-4" />
              </div>
              <div className="text-xs font-bold text-white">Client Device</div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">OS Cache & Stub</div>
              {currentStepIndex === 0 && (
                <span className="mt-2 inline-block px-1.5 py-0.5 rounded text-[9px] font-mono bg-indigo-500 text-white font-semibold">
                  ACTIVE
                </span>
              )}
            </div>

            {/* Node 2: Recursive Resolver */}
            <div
              className={`p-3.5 rounded-lg border text-center transition-all ${
                currentStepIndex >= 1 && (currentStepIndex === 1 || currentStepIndex === 4)
                  ? 'bg-indigo-950/80 border-indigo-400 ring-2 ring-indigo-500/50 scale-105'
                  : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}
            >
              <div className="w-8 h-8 mx-auto rounded-full bg-slate-800 flex items-center justify-center text-slate-300 mb-2">
                <Server className="w-4 h-4" />
              </div>
              <div className="text-xs font-bold text-white">Store Gateway Resolver</div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">192.168.10.1 (UDP:53)</div>
              {(currentStepIndex === 1 || currentStepIndex === 4) && (
                <span className="mt-2 inline-block px-1.5 py-0.5 rounded text-[9px] font-mono bg-indigo-500 text-white font-semibold">
                  ACTIVE
                </span>
              )}
            </div>

            {/* Node 3: Root Server */}
            <div
              className={`p-3.5 rounded-lg border text-center transition-all ${
                currentStepIndex === 1
                  ? 'bg-indigo-950/80 border-indigo-400 ring-2 ring-indigo-500/50 scale-105'
                  : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}
            >
              <div className="w-8 h-8 mx-auto rounded-full bg-slate-800 flex items-center justify-center text-slate-300 mb-2">
                <Globe className="w-4 h-4" />
              </div>
              <div className="text-xs font-bold text-white">Root Server (.)</div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">a.root-servers.net</div>
              {currentStepIndex === 1 && (
                <span className="mt-2 inline-block px-1.5 py-0.5 rounded text-[9px] font-mono bg-indigo-500 text-white font-semibold">
                  REFERRAL
                </span>
              )}
            </div>

            {/* Node 4: TLD Server */}
            <div
              className={`p-3.5 rounded-lg border text-center transition-all ${
                currentStepIndex === 2
                  ? 'bg-indigo-950/80 border-indigo-400 ring-2 ring-indigo-500/50 scale-105'
                  : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}
            >
              <div className="w-8 h-8 mx-auto rounded-full bg-slate-800 flex items-center justify-center text-slate-300 mb-2">
                <Database className="w-4 h-4" />
              </div>
              <div className="text-xs font-bold text-white">TLD Name Server</div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">.{activeDomain.split('.').pop()} Server</div>
              {currentStepIndex === 2 && (
                <span className="mt-2 inline-block px-1.5 py-0.5 rounded text-[9px] font-mono bg-indigo-500 text-white font-semibold">
                  DELEGATION
                </span>
              )}
            </div>

            {/* Node 5: Authoritative Server */}
            <div
              className={`p-3.5 rounded-lg border text-center transition-all ${
                currentStepIndex === 3
                  ? 'bg-indigo-950/80 border-indigo-400 ring-2 ring-indigo-500/50 scale-105'
                  : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}
            >
              <div className="w-8 h-8 mx-auto rounded-full bg-slate-800 flex items-center justify-center text-slate-300 mb-2">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="text-xs font-bold text-white">Authoritative DNS</div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">ns1.retailcloud.net</div>
              {currentStepIndex === 3 && (
                <span className="mt-2 inline-block px-1.5 py-0.5 rounded text-[9px] font-mono bg-emerald-500 text-white font-semibold">
                  ANSWER (AA=1)
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Step Detail Card */}
        <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-400 font-mono">
              STEP {currentStep.stepNumber} OF {steps.length}: {currentStep.title}
            </span>
            <span className="text-[11px] text-slate-400">
              {currentStep.actor} &rarr; {currentStep.targetServer}
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {currentStep.detail}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs font-mono">
            <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase block font-sans">Query Wire Message:</span>
              <span className="text-slate-200">{currentStep.question}</span>
            </div>
            <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase block font-sans">DNS Wire Response:</span>
              <span className="text-emerald-400">{currentStep.response}</span>
            </div>
          </div>
        </div>

        {/* DNS Wire Packet Dissector (Wireshark-like Header Inspection) */}
        <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-3">
          <h4 className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-indigo-400" />
            RFC 1035 DNS Protocol Wire Header & Frame Breakdown
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs font-mono">
            <div className="p-2 rounded bg-slate-900 border border-slate-800/80">
              <span className="text-[10px] text-slate-500 block font-sans">Transaction ID</span>
              <span className="text-indigo-400 font-bold">{currentStep.packetInfo.transactionId}</span>
            </div>
            <div className="p-2 rounded bg-slate-900 border border-slate-800/80">
              <span className="text-[10px] text-slate-500 block font-sans">Flags</span>
              <span className="text-slate-200">{currentStep.packetInfo.flags.split(' ')[0]}</span>
            </div>
            <div className="p-2 rounded bg-slate-900 border border-slate-800/80">
              <span className="text-[10px] text-slate-500 block font-sans">Questions</span>
              <span className="text-slate-300">{currentStep.packetInfo.questionsCount} (IN A)</span>
            </div>
            <div className="p-2 rounded bg-slate-900 border border-slate-800/80">
              <span className="text-[10px] text-slate-500 block font-sans">Answer RRs</span>
              <span className="text-emerald-400 font-bold">{currentStep.packetInfo.answersCount}</span>
            </div>
            <div className="p-2 rounded bg-slate-900 border border-slate-800/80">
              <span className="text-[10px] text-slate-500 block font-sans">Authority RRs</span>
              <span className="text-slate-300">{currentStep.packetInfo.authoritiesCount}</span>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-900 flex justify-between items-center">
            <span>Transport: <strong className="text-slate-200">UDP Port 53</strong> (Fallback to TCP for &gt;512 bytes)</span>
            <span>TTL Expiry: <strong className="text-slate-200">{selectedRecord.ttl} seconds</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};
