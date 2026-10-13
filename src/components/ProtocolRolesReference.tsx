import React, { useState } from 'react';
import {
  BookOpen,
  Wifi,
  Globe,
  FileCode,
  Layers,
  ShieldCheck,
  Cpu,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

export const ProtocolRolesReference: React.FC = () => {
  const [selectedProtocol, setSelectedProtocol] = useState<'wifi' | 'dns' | 'http' | 'auxiliary'>('wifi');

  return (
    <div className="space-y-6">
      {/* Title & Introduction */}
      <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800">
        <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-400" />
          Protocol Roles & Architectural Integration (Assessment Level A2)
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
          Comprehensive technical analysis detailing how IEEE 802.11 Wi-Fi, DNS (RFC 1035), and HTTP/HTTPS (RFC 9110) interact within the modern retail store ecosystem to ensure high availability, security isolation, and compliance.
        </p>
      </div>

      {/* Protocol Selection Tabs */}
      <div className="flex items-center gap-2 p-1 bg-slate-900 rounded-lg border border-slate-800 flex-wrap">
        <button
          onClick={() => setSelectedProtocol('wifi')}
          className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors cursor-pointer flex items-center gap-2 ${
            selectedProtocol === 'wifi'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Wifi className="w-3.5 h-3.5" />
          1. Wi-Fi (IEEE 802.11ax)
        </button>

        <button
          onClick={() => setSelectedProtocol('dns')}
          className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors cursor-pointer flex items-center gap-2 ${
            selectedProtocol === 'dns'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          2. DNS (RFC 1035)
        </button>

        <button
          onClick={() => setSelectedProtocol('http')}
          className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors cursor-pointer flex items-center gap-2 ${
            selectedProtocol === 'http'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileCode className="w-3.5 h-3.5" />
          3. HTTP & HTTPS (RFC 9110 / TLS 1.3)
        </button>

        <button
          onClick={() => setSelectedProtocol('auxiliary')}
          className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors cursor-pointer flex items-center gap-2 ${
            selectedProtocol === 'auxiliary'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          4. Auxiliary (DHCP, ARP, 802.1Q, TCP)
        </button>
      </div>

      {/* Protocol Detailed Cards */}
      {selectedProtocol === 'wifi' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white">
                  IEEE 802.11ax (Wi-Fi 6) &mdash; Physical & Data Link Foundation
                </h3>
                <span className="text-xs text-indigo-400 font-mono">
                  OSI Model: Layer 1 (Physical) & Layer 2 (Data Link: MAC & LLC)
                </span>
              </div>
              <span className="px-2.5 py-1 text-xs rounded bg-indigo-950 text-indigo-300 border border-indigo-800 font-mono">
                OFDMA / 1024-QAM / MU-MIMO
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-300 leading-relaxed">
              <div className="space-y-3">
                <h4 className="font-bold text-white text-sm">Primary Roles in the Retail Store:</h4>
                <ul className="space-y-2 list-disc list-inside text-slate-400">
                  <li>
                    <strong className="text-slate-200">Untethered Operational Mobility:</strong> Eliminates vulnerable physical cables running across busy checkout floors and warehouse docks.
                  </li>
                  <li>
                    <strong className="text-slate-200">Multi-SSID Network Segmentation:</strong> A single physical AP broadcasts separate virtual SSIDs mapped to distinct 802.1Q VLANs (<code className="text-slate-200 font-mono">RetailGuest-WiFi</code> vs <code className="text-slate-200 font-mono">RetailStaff-Secure</code> vs <code className="text-slate-200 font-mono">StoreOps-POS-Locked</code>).
                  </li>
                  <li>
                    <strong className="text-slate-200">Over-the-Air Cryptography:</strong> Enforces WPA3-Personal SAE and WPA3-Enterprise (802.1X/EAP-TLS) with AES-GCMP 256-bit encryption, protecting cardholder payment data from RF sniffing.
                  </li>
                  <li>
                    <strong className="text-slate-200">Layer 2 Client Isolation:</strong> Prevents malicious shoppers from port-scanning or attacking fellow shoppers connected to public guest Wi-Fi.
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-white text-sm">Key Wi-Fi Mechanisms & Standards:</h4>
                <div className="space-y-2">
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <strong className="text-indigo-300 block mb-0.5">CSMA/CA (Carrier Sense Multiple Access with Collision Avoidance):</strong>
                    <span>Devices listen before talking. Uses RTS/CTS and random backoff slots to avoid packet collisions over shared RF airwaves.</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <strong className="text-indigo-300 block mb-0.5">802.11e WMM (Wi-Fi Multimedia QoS):</strong>
                    <span>Categorizes frames into 4 queues: Voice (AC_VO), Video (AC_VI), Best Effort (AC_BE), Background (AC_BK). Guarantees POS payments pass with minimal delay even during peak guest usage.</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <strong className="text-indigo-300 block mb-0.5">802.11k/v/r Fast BSS Transition:</strong>
                    <span>Enables warehouse associates to seamlessly roam between AP-Floor and AP-Warehouse in &lt;50ms without disconnecting active inventory scanning sessions.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedProtocol === 'dns' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white">
                  Domain Name System (DNS &mdash; RFC 1035) &mdash; Service Discovery & Name Resolution
                </h3>
                <span className="text-xs text-indigo-400 font-mono">
                  OSI Model: Layer 7 (Application) running over Layer 4 Transport (UDP/TCP: 53)
                </span>
              </div>
              <span className="px-2.5 py-1 text-xs rounded bg-indigo-950 text-indigo-300 border border-indigo-800 font-mono">
                Port 53 &bull; UDP Primary
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-300 leading-relaxed">
              <div className="space-y-3">
                <h4 className="font-bold text-white text-sm">Primary Roles in the Retail Store:</h4>
                <ul className="space-y-2 list-disc list-inside text-slate-400">
                  <li>
                    <strong className="text-slate-200">Decoupling Hostnames from Physical IPs:</strong> POS registers and staff mobile devices connect to logical domain names (<code className="text-slate-200 font-mono">pay.secure-transact.net</code>). If the payment processor rotates IP addresses or shifts data centers, the store experiences zero downtime.
                  </li>
                  <li>
                    <strong className="text-slate-200">Split-Horizon Internal DNS:</strong> Internal store hostnames like <code className="text-slate-200 font-mono">inventory.retailops.internal</code> resolve directly to the on-premise warehouse server (<code className="text-slate-200 font-mono">192.168.20.5</code>), keeping confidential stock queries within the local network.
                  </li>
                  <li>
                    <strong className="text-slate-200">Local Recursive Caching:</strong> The store router/gateway caches popular DNS responses locally with TTL timers, accelerating recurring requests to under 1ms.
                  </li>
                  <li>
                    <strong className="text-slate-200">Captive Portal Redirection:</strong> DNS interception on VLAN 30 captures unauthenticated guest browser requests and redirects them to the legal terms portal (<code className="text-slate-200 font-mono">login.guestwifi.local</code>).
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-white text-sm">DNS Message & Resolution Hierarchy:</h4>
                <div className="space-y-2">
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <strong className="text-indigo-300 block mb-0.5">Hierarchical Delegation:</strong>
                    <span>Local Resolver &rarr; Root Server (.) &rarr; TLD Server (.net / .com) &rarr; Authoritative Name Server. Recursion Desired (RD) bit ensures client receives final IP without running iterative queries itself.</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <strong className="text-indigo-300 block mb-0.5">Critical Resource Records (RRs):</strong>
                    <span><strong>A Record:</strong> Maps IPv4 address. <strong>CNAME Record:</strong> Canonical alias for cloud CDNs. <strong>TXT Record:</strong> Domain ownership & SPF security validation.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedProtocol === 'http' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white">
                  HTTP & HTTPS (RFC 9110 / TLS 1.3) &mdash; Application Data Exchange & Cryptography
                </h3>
                <span className="text-xs text-indigo-400 font-mono">
                  OSI Model: Layer 7 (Application) running over TCP:443 (TLS) or UDP:443 (HTTP/3 QUIC)
                </span>
              </div>
              <span className="px-2.5 py-1 text-xs rounded bg-indigo-950 text-indigo-300 border border-indigo-800 font-mono">
                Port 443 &bull; RESTful JSON
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-300 leading-relaxed">
              <div className="space-y-3">
                <h4 className="font-bold text-white text-sm">Primary Roles in the Retail Store:</h4>
                <ul className="space-y-2 list-disc list-inside text-slate-400">
                  <li>
                    <strong className="text-slate-200">Stateless RESTful API Communications:</strong> Standardized HTTP verbs (<code className="text-slate-200 font-mono">POST /v1/payments/authorize</code>, <code className="text-slate-200 font-mono">GET /items/SKU-99214</code>) model business transactions with clean JSON payloads.
                  </li>
                  <li>
                    <strong className="text-slate-200">PCI-DSS Cryptographic Compliance:</strong> Mandates TLS 1.3 encryption for cardholder data transmission. Pre-shared keys, ephemeral Diffie-Hellman (X25519), and AES-256-GCM ensure confidentiality and integrity.
                  </li>
                  <li>
                    <strong className="text-slate-200">Authentication & Token Passing:</strong> Authorization headers (<code className="text-slate-200 font-mono">Bearer jwt_token</code>) authenticate cashiers and store employees without storing plain credentials.
                  </li>
                  <li>
                    <strong className="text-slate-200">Idempotency in Financial Checkout:</strong> Custom headers (<code className="text-slate-200 font-mono">X-PCI-Idempotency-Key</code>) ensure network drop retransmits do not double-charge customer credit cards.
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-white text-sm">Protocol Layers in Action:</h4>
                <div className="space-y-2">
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <strong className="text-indigo-300 block mb-0.5">TCP 3-Way Handshake:</strong>
                    <span>SYN &rarr; SYN-ACK &rarr; ACK establishes reliable byte stream with flow control and sequence numbers before application data starts.</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <strong className="text-indigo-300 block mb-0.5">TLS 1.3 Security Handshake:</strong>
                    <span>1-RTT handshake negotiates symmetric session keys and verifies the payment server's X.509 digital certificate against trusted Root Certificate Authorities.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedProtocol === 'auxiliary' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white">
                  Auxiliary Network Protocols &mdash; The Supporting Infrastructure
                </h3>
                <span className="text-xs text-indigo-400 font-mono">
                  DHCP &bull; ARP &bull; IEEE 802.1Q &bull; NAT &bull; TCP
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="font-bold text-indigo-400 flex items-center justify-between">
                  <span>DHCP (Dynamic Host Configuration &mdash; RFC 2131)</span>
                  <span className="text-[10px] text-slate-500 font-mono">UDP 67/68</span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  Automatically leases IP addresses, Subnet Masks, Default Gateways, and DNS servers to roaming shoppers and associate tablets using the 4-step <strong>DORA</strong> (Discover, Offer, Request, Acknowledge) cycle. Employs short 2-hour lease times on Guest VLAN 30 to prevent pool exhaustion.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="font-bold text-indigo-400 flex items-center justify-between">
                  <span>IEEE 802.1Q (VLAN Tagging & Trunking)</span>
                  <span className="text-[10px] text-slate-500 font-mono">Layer 2 Tag</span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  Inserts a 4-byte VLAN identifier into Ethernet frames travelling along trunk cables between Access Points and the Core Managed Switch. Ensures POS data, staff data, and guest data remain logically segregated across shared physical switches.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="font-bold text-indigo-400 flex items-center justify-between">
                  <span>ARP (Address Resolution Protocol &mdash; RFC 826)</span>
                  <span className="text-[10px] text-slate-500 font-mono">Layer 2/3</span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  Translates known Layer 3 IPv4 addresses into Layer 2 physical 48-bit MAC addresses. On the store floor, devices broadcast ARP requests (&ldquo;Who has 192.168.10.1?&rdquo;) to locate the router gateway for outbound packet delivery.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="font-bold text-indigo-400 flex items-center justify-between">
                  <span>NAT (Network Address Translation &mdash; RFC 1631)</span>
                  <span className="text-[10px] text-slate-500 font-mono">Port Address Translation</span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  Maps hundreds of private RFC 1918 store addresses (<code className="text-slate-300">192.168.x.x</code>, <code className="text-slate-300">172.16.x.x</code>) to the single public routable IP assigned to the store ISP fiber uplink, shielding internal topology from external reconnaissance.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Summary Table: Protocol Cross-Layer Synergy */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <h4 className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-indigo-400" />
          Cross-Layer Protocol Lifecycle: A Complete Retail Transaction
        </h4>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-500 font-mono text-[11px]">
                <th className="py-2.5 px-3">Stage</th>
                <th className="py-2.5 px-3">Protocol</th>
                <th className="py-2.5 px-3">OSI Layer</th>
                <th className="py-2.5 px-3">Retail Action / Technical Purpose</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              <tr>
                <td className="py-2.5 px-3 font-semibold text-white">1. Connect</td>
                <td className="py-2.5 px-3 font-mono text-indigo-400">Wi-Fi (802.11ax)</td>
                <td className="py-2.5 px-3 font-mono text-slate-400">Layer 1 & 2</td>
                <td className="py-2.5 px-3">Device associates with AP; WPA3 4-way handshake establishes encrypted RF link.</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-white">2. Address</td>
                <td className="py-2.5 px-3 font-mono text-indigo-400">DHCP & ARP</td>
                <td className="py-2.5 px-3 font-mono text-slate-400">Layer 2 & 3</td>
                <td className="py-2.5 px-3">DORA exchange leases IP on tagged VLAN; ARP resolves default gateway MAC address.</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-white">3. Resolve</td>
                <td className="py-2.5 px-3 font-mono text-indigo-400">DNS (RFC 1035)</td>
                <td className="py-2.5 px-3 font-mono text-slate-400">Layer 7 (UDP)</td>
                <td className="py-2.5 px-3">Translates <code className="text-slate-200">pay.secure-transact.net</code> to IP <code className="text-slate-200">203.0.113.88</code> via recursive resolution.</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-white">4. Transport</td>
                <td className="py-2.5 px-3 font-mono text-indigo-400">TCP & TLS 1.3</td>
                <td className="py-2.5 px-3 font-mono text-slate-400">Layer 4 & 6</td>
                <td className="py-2.5 px-3">3-Way SYN/ACK handshake opens reliable stream; TLS negotiates cipher and verifies cloud cert.</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-white">5. Transact</td>
                <td className="py-2.5 px-3 font-mono text-indigo-400">HTTP/HTTPS (REST)</td>
                <td className="py-2.5 px-3 font-mono text-slate-400">Layer 7</td>
                <td className="py-2.5 px-3">POS issues <code className="text-slate-200">POST /v1/payments/authorize</code> with JSON payload; server returns 200 OK receipt.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
