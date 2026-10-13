export type DeviceRole = 'customer' | 'employee' | 'pos' | 'inventory' | 'iot' | 'infrastructure' | 'cloud';

export type VlanId = 10 | 20 | 30 | 40 | 50;

export interface VlanConfig {
  id: VlanId;
  name: string;
  description: string;
  subnet: string;
  gateway: string;
  dhcpRange: string;
  qosPriority: 'Voice (AC_VO)' | 'Video (AC_VI)' | 'Best Effort (AC_BE)' | 'Background (AC_BK)';
  isolation: boolean;
  color: string;
}

export interface NetworkDevice {
  id: string;
  name: string;
  type: 'smartphone' | 'tablet' | 'pos_terminal' | 'barcode_scanner' | 'laptop' | 'cctv_camera' | 'shelf_display' | 'ap' | 'switch' | 'gateway' | 'cloud_server';
  role: DeviceRole;
  vlan: VlanId;
  ip: string;
  mac: string;
  x: number; // percentage in store floorplan (0 - 100)
  y: number; // percentage in store floorplan (0 - 100)
  connectedApId?: string;
  currentSsid?: string;
  rssi?: number; // dBm
  snr?: number; // dB
  txRate?: number; // Mbps
  status: 'online' | 'associating' | 'offline';
}

export interface AccessPoint {
  id: string;
  name: string;
  location: string;
  x: number;
  y: number;
  ip: string;
  mac: string;
  model: string;
  radio24Channel: number; // 1, 6, 11
  radio24Width: 20 | 40;
  radio24Power: number; // dBm (e.g. 17)
  radio5Channel: number; // 36, 44, 149
  radio5Width: 20 | 40 | 80;
  radio5Power: number; // dBm (e.g. 20)
  ssidsBroadcast: string[];
  connectedClientsCount: number;
  coverageRadius: number; // for SVG visualization
}

export interface SsidProfile {
  id: string;
  ssid: string;
  vlan: VlanId;
  bandPreference: '2.4GHz' | '5GHz' | 'Dual (Band Steering)';
  securityMode: 'Open (Captive Portal)' | 'WPA3-Personal (SAE)' | 'WPA3-Enterprise (802.1X/EAP-TLS)';
  clientIsolation: boolean;
  bandwidthCapDownload: number; // Mbps, 0 = unlimited
  bandwidthCapUpload: number; // Mbps, 0 = unlimited
  wmmEnabled: boolean;
  targetUsers: string;
}

export interface DnsRecord {
  domain: string;
  type: 'A' | 'AAAA' | 'CNAME' | 'TXT';
  value: string;
  ttl: number; // seconds
  description: string;
  category: 'store_internal' | 'retail_cloud' | 'payment_gateway' | 'public_internet';
}

export interface DnsQueryStep {
  stepNumber: number;
  title: string;
  actor: string;
  targetServer: string;
  queryType: string;
  question: string;
  response: string;
  detail: string;
  packetInfo: {
    transactionId: string;
    flags: string;
    questionsCount: number;
    answersCount: number;
    authoritiesCount: number;
  };
}

export interface HttpEndpoint {
  id: string;
  method: 'GET' | 'POST' | 'PUT';
  url: string;
  serviceName: string;
  category: 'pos_payment' | 'inventory_sync' | 'loyalty_auth' | 'guest_captive' | 'public_web';
  requiredVlan: VlanId[];
  requestHeaders: Record<string, string>;
  requestBody?: string;
  responseStatus: number;
  responseHeaders: Record<string, string>;
  responseBody: string;
  typicalPayloadBytes: number;
  typicalProcessingMs: number;
}

export interface HandshakeStep {
  stepIndex: number;
  phase: 'TCP' | 'TLS_1_3' | 'HTTP_REQUEST' | 'SERVER_PROCESSING' | 'HTTP_RESPONSE';
  sender: string;
  receiver: string;
  title: string;
  summary: string;
  protocolDetails: {
    flags?: string;
    seqNumber?: string;
    ackNumber?: string;
    cipherSuite?: string;
    headers?: Record<string, string>;
  };
}

export interface TestScenario {
  id: string;
  title: string;
  actorDescription: string;
  sourceDeviceId: string;
  targetDomain: string;
  protocol: 'HTTP' | 'HTTPS' | 'DNS' | 'ICMP';
  endpointId?: string;
  description: string;
  expectedResult: 'allowed' | 'redirected' | 'blocked_by_firewall';
  securityVerification: string;
  tags: string[];
}

export interface PacketTraceLog {
  id: string;
  timestamp: string;
  phase: 'WIFI_ASSOCIATION' | 'DHCP_ASSIGN' | 'DNS_RESOLVE' | 'TCP_CONNECT' | 'TLS_NEGOTIATE' | 'HTTP_TRANSFER' | 'FIREWALL_RULE';
  fromNode: string;
  toNode: string;
  summary: string;
  status: 'success' | 'warning' | 'error' | 'info';
  layer: 'Layer 1/2 (Physical/DataLink)' | 'Layer 3 (Network)' | 'Layer 4 (Transport)' | 'Layer 7 (Application)';
}

export interface PerformanceTelemetry {
  wifiAirtimeLatencyMs: number;
  switchRouterLatencyMs: number;
  wanUplinkLatencyMs: number;
  serverProcessingMs: number;
  totalRoundTripTimeMs: number;
  packetLossPercent: number;
  jitterMs: number;
  concurrentClientsCount: number;
  channelUtilizationPercent: number;
  qosAdvantageFactor: number;
}
