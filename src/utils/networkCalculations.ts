import { DnsQueryStep, HandshakeStep, PerformanceTelemetry } from '../types/network';

/**
 * Calculates Path Loss and RSSI (dBm) using modified Log-Distance Path Loss model
 * with retail store environmental obstacles (shelving, walls).
 */
export function calculateWifiSignal(
  clientPos: { x: number; y: number },
  apPos: { x: number; y: number },
  txPowerDbm: number = 20,
  frequencyGhz: 2.4 | 5 = 5,
  obstacleCount: number = 1
): { distanceMeters: number; rssi: number; snr: number; qualityPercent: number; theoreticalTxRateMbps: number } {
  // Store scale: 100 coordinate units = 30 meters
  const dx = (clientPos.x - apPos.x) * 0.3;
  const dy = (clientPos.y - apPos.y) * 0.3;
  const distanceMeters = Math.max(1, Math.sqrt(dx * dx + dy * dy));

  // Path loss exponent n: 2.0 free space, 3.2 in retail store with aisles and shelving
  const pathLossExponent = 3.2;
  // Reference path loss at 1m: ~40 dB for 2.4GHz, ~46 dB for 5GHz
  const refLoss = frequencyGhz === 5 ? 46.5 : 40.0;
  // Obstacle attenuation: ~3.5 dB per retail aisle/gondola shelf
  const obstacleAttenuation = obstacleCount * 3.5;

  const pathLoss = refLoss + 10 * pathLossExponent * Math.log10(distanceMeters) + obstacleAttenuation;
  const rssi = Math.round(txPowerDbm - pathLoss);

  // Background noise floor in busy retail space: -95 dBm
  const noiseFloor = -95;
  const snr = Math.max(0, rssi - noiseFloor);

  // Signal quality score (0 - 100)
  // -30 dBm = 100%, -90 dBm = 0%
  const qualityPercent = Math.min(100, Math.max(0, Math.round(((rssi - -90) / 60) * 100)));

  // Estimated 802.11ax PHY Rate based on SNR
  let txRate = 12;
  if (snr > 38) txRate = frequencyGhz === 5 ? 400 : 287;
  else if (snr > 30) txRate = frequencyGhz === 5 ? 288 : 172;
  else if (snr > 24) txRate = frequencyGhz === 5 ? 192 : 115;
  else if (snr > 18) txRate = frequencyGhz === 5 ? 120 : 72;
  else if (snr > 12) txRate = frequencyGhz === 5 ? 54 : 36;
  else if (snr > 6) txRate = 24;

  return {
    distanceMeters: Math.round(distanceMeters * 10) / 10,
    rssi,
    snr,
    qualityPercent,
    theoreticalTxRateMbps: txRate,
  };
}

/**
 * Builds step-by-step DNS Name Resolution sequence
 */
export function buildDnsResolutionSteps(
  domain: string,
  recordType: 'A' | 'AAAA' | 'CNAME' | 'TXT' = 'A',
  ipAnswer: string = '203.0.113.88',
  isCachedLocally: boolean = false
): DnsQueryStep[] {
  const txId = '0x' + Math.floor(Math.random() * 65535).toString(16).padStart(4, '0').toUpperCase();

  if (isCachedLocally) {
    return [
      {
        stepNumber: 1,
        title: 'Client Local OS DNS Cache Lookup',
        actor: 'Client Host (OS Resolver)',
        targetServer: 'Local Memory Cache',
        queryType: recordType,
        question: `Lookup: ${domain} (IN ${recordType})`,
        response: `Cache HIT: ${domain} -> ${ipAnswer} (TTL remaining: 240s)`,
        detail: 'The client operating system checked its internal resolver cache (gethostbyname) and found a valid, unexpired entry.',
        packetInfo: {
          transactionId: txId,
          flags: '0x8180 (Standard query response, No error)',
          questionsCount: 1,
          answersCount: 1,
          authoritiesCount: 0,
        },
      },
    ];
  }

  const tld = domain.split('.').pop() || 'com';

  return [
    {
      stepNumber: 1,
      title: 'Local Cache Miss & Forwarding to Store Recursive Resolver',
      actor: 'Client Device',
      targetServer: 'Store Gateway DNS Resolver (192.168.10.1 / 172.16.0.1)',
      queryType: recordType,
      question: `Standard query 0x${txId.slice(2)} ${recordType} ${domain}`,
      response: 'Query received, cache miss at local gateway. Initiating recursive traversal.',
      detail: 'Client checks local cache and hosts file. No match found. Issues recursive query over UDP port 53 with RD (Recursion Desired) bit set to 1.',
      packetInfo: {
        transactionId: txId,
        flags: '0x0100 (Standard query, Recursion desired)',
        questionsCount: 1,
        answersCount: 0,
        authoritiesCount: 0,
      },
    },
    {
      stepNumber: 2,
      title: 'Recursive Resolver Queries Root Name Server (.)',
      actor: 'Store Recursive Resolver',
      targetServer: 'Root Name Server (e.g., 198.41.0.4 [a.root-servers.net])',
      queryType: recordType,
      question: `Query: ${domain} ${recordType}`,
      response: `Delegation Referral: Authority -> .${tld} TLD Name Servers (e.g., a.gtld-servers.net)`,
      detail: 'The recursive resolver contacts one of the 13 root name server clusters. The Root does not know the final IP, but returns NS records for the TLD.',
      packetInfo: {
        transactionId: '0x3A12',
        flags: '0x8000 (Response, Referral)',
        questionsCount: 1,
        answersCount: 0,
        authoritiesCount: 13,
      },
    },
    {
      stepNumber: 3,
      title: 'Recursive Resolver Queries TLD Name Server (.com / .net)',
      actor: 'Store Recursive Resolver',
      targetServer: `TLD Server (.${tld} Name Server [192.5.6.30])`,
      queryType: recordType,
      question: `Query: ${domain} ${recordType}`,
      response: `Delegation Referral: Authoritative NS for ${domain.split('.').slice(-2).join('.')}`,
      detail: 'The TLD name server inspects the domain registry and provides Glue records pointing to the domain\'s Authoritative DNS servers.',
      packetInfo: {
        transactionId: '0x5C89',
        flags: '0x8000 (Response, Referral)',
        questionsCount: 1,
        answersCount: 0,
        authoritiesCount: 4,
      },
    },
    {
      stepNumber: 4,
      title: 'Recursive Resolver Queries Authoritative Name Server',
      actor: 'Store Recursive Resolver',
      targetServer: 'Authoritative DNS (ns1.retailcloud.net [204.79.197.200])',
      queryType: recordType,
      question: `Query: ${domain} ${recordType}`,
      response: `Answer: ${domain} 300 IN ${recordType} ${ipAnswer}`,
      detail: 'The Authoritative Name Server holds the official master zone file. It returns the final A record answer with Authoritative Answer (AA=1) flag.',
      packetInfo: {
        transactionId: '0x992B',
        flags: '0x8400 (Authoritative Answer, No error)',
        questionsCount: 1,
        answersCount: 1,
        authoritiesCount: 2,
      },
    },
    {
      stepNumber: 5,
      title: 'Recursive Resolver Caches Record & Responds to Client',
      actor: 'Store Recursive Resolver',
      targetServer: 'Client Device',
      queryType: recordType,
      question: `Response to ${domain} query`,
      response: `Final Answer: ${domain} -> ${ipAnswer} (TTL: 300s)`,
      detail: 'The resolver stores the answer in its local DNS cache for 300 seconds to accelerate future client queries, then sends UDP reply back to the store device.',
      packetInfo: {
        transactionId: txId,
        flags: '0x8180 (Standard response, Recursion available)',
        questionsCount: 1,
        answersCount: 1,
        authoritiesCount: 0,
      },
    },
  ];
}

/**
 * Builds full TCP + TLS 1.3 + HTTP/HTTPS Handshake & Lifecycle steps
 */
export function buildHttpLifecycleSteps(
  domain: string,
  urlPath: string,
  method: 'GET' | 'POST' | 'PUT',
  isHttps: boolean = true,
  statusCode: number = 200
): HandshakeStep[] {
  const clientEphemeralPort = '54210';
  const serverPort = isHttps ? '443' : '80';

  const steps: HandshakeStep[] = [
    {
      stepIndex: 1,
      phase: 'TCP',
      sender: `Client (${clientEphemeralPort})`,
      receiver: `Server (${serverPort})`,
      title: 'TCP SYN (Connection Initialization)',
      summary: 'Client initiates TCP 3-way handshake with initial sequence number (ISN).',
      protocolDetails: {
        flags: '[SYN] Seq=0 Win=65535 MSS=1460 WS=256',
        seqNumber: '1849204192',
      },
    },
    {
      stepIndex: 2,
      phase: 'TCP',
      sender: `Server (${serverPort})`,
      receiver: `Client (${clientEphemeralPort})`,
      title: 'TCP SYN-ACK (Synchronization Acknowledgment)',
      summary: 'Server acknowledges client ISN and sends its own synchronized sequence number.',
      protocolDetails: {
        flags: '[SYN, ACK] Seq=0 Ack=1 Win=65535 MSS=1460',
        seqNumber: '4019284102',
        ackNumber: '1849204193',
      },
    },
    {
      stepIndex: 3,
      phase: 'TCP',
      sender: `Client (${clientEphemeralPort})`,
      receiver: `Server (${serverPort})`,
      title: 'TCP ACK (Connection Established)',
      summary: 'Client acknowledges server sequence number. Reliable Layer 4 transport channel is open.',
      protocolDetails: {
        flags: '[ACK] Seq=1 Ack=1 Win=65535',
        ackNumber: '4019284103',
      },
    },
  ];

  if (isHttps) {
    steps.push(
      {
        stepIndex: 4,
        phase: 'TLS_1_3',
        sender: 'Client',
        receiver: 'Server',
        title: 'TLS 1.3 Client Hello & Key Share',
        summary: 'Client sends supported cryptographic cipher suites and Diffie-Hellman public key share.',
        protocolDetails: {
          cipherSuite: 'TLS_AES_256_GCM_SHA384, TLS_CHACHA20_POLY1305_SHA256',
          headers: {
            'Server Name Indication (SNI)': domain,
            'Supported TLS Version': '1.3 (0x0304)',
            'Key Exchange Group': 'X25519 (Curve25519)',
          },
        },
      },
      {
        stepIndex: 5,
        phase: 'TLS_1_3',
        sender: 'Server',
        receiver: 'Client',
        title: 'TLS 1.3 Server Hello, Certificate & Handshake Finished',
        summary: 'Server selects cipher, completes key agreement, presents X.509 digital certificate.',
        protocolDetails: {
          cipherSuite: 'TLS_AES_256_GCM_SHA384',
          headers: {
            'Selected Cipher': 'TLS_AES_256_GCM_SHA384',
            'Certificate Issuer': "DigiCert Global Root CA (PCI-DSS Validated)",
            'Handshake Latency': '1 RTT (0-RTT capable on resumption)',
          },
        },
      }
    );
  }

  steps.push(
    {
      stepIndex: steps.length + 1,
      phase: 'HTTP_REQUEST',
      sender: 'Client Device',
      receiver: 'Target Web API Server',
      title: `HTTP Request: ${method} ${urlPath}`,
      summary: `Client dispatches ${method} application request payload over encrypted transport.`,
      protocolDetails: {
        headers: {
          Host: domain,
          'User-Agent': 'RetailDevice/2.1 (POS-Engine)',
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Connection: 'keep-alive',
        },
      },
    },
    {
      stepIndex: steps.length + 1,
      phase: 'SERVER_PROCESSING',
      sender: 'API Backend Server',
      receiver: 'Database & Payment Gateway',
      title: 'Server Application Logic & Database Transaction',
      summary: 'Backend parses headers, validates authentication bearer token, and processes request.',
      protocolDetails: {
        headers: {
          'Time to First Byte (TTFB)': '28ms',
          'Database Query Time': '12ms',
          'PCI Audit Check': 'Passed (No unmasked PAN logged)',
        },
      },
    },
    {
      stepIndex: steps.length + 1,
      phase: 'HTTP_RESPONSE',
      sender: 'Target Web API Server',
      receiver: 'Client Device',
      title: `HTTP Response: ${statusCode} ${statusCode === 200 ? 'OK' : statusCode === 302 ? 'Found (Redirect)' : 'Error'}`,
      summary: 'Server returns HTTP response with JSON payload, caching policies, and session tokens.',
      protocolDetails: {
        headers: {
          Status: `${statusCode} OK`,
          'Content-Type': 'application/json; charset=utf-8',
          'Strict-Transport-Security': 'max-age=31536000',
          'Cache-Control': 'no-store, no-cache',
        },
      },
    }
  );

  return steps;
}

/**
 * Calculates network performance metrics based on dynamic parameters
 */
export function calculatePerformanceMetrics(
  concurrentShoppers: number,
  isWmmQosEnabled: boolean,
  rssiDbm: number = -55,
  isFiberWan: boolean = true
): PerformanceTelemetry {
  // Wi-Fi Airtime contention: Increases non-linearly with client count
  // 802.11 CSMA/CA backoff exponential multiplier
  const contentionDelay = Math.pow(concurrentShoppers / 30, 1.4) * 4.5;
  const signalPenalty = Math.max(0, (-65 - rssiDbm) * 0.4);
  const wifiAirtimeLatencyMs = Math.round((6.0 + contentionDelay + signalPenalty) * 10) / 10;

  // Local enterprise switch latency (microsecond scale, rounded to ms)
  const switchRouterLatencyMs = 1.2;

  // WAN ISP Latency (Fiber ~14ms vs 4G LTE Backup ~48ms)
  const wanUplinkLatencyMs = isFiberWan ? 14.5 : 46.0;

  // Cloud server processing
  const serverProcessingMs = 32.0;

  // Jitter (variance in RTT)
  const baseJitter = 1.5 + (concurrentShoppers / 40) * 3.8;
  const jitterMs = Math.round(baseJitter * 10) / 10;

  // Packet loss (%)
  let packetLoss = 0.1;
  if (rssiDbm < -75) packetLoss += 2.4;
  if (concurrentShoppers > 80) packetLoss += (concurrentShoppers - 80) * 0.08;
  const packetLossPercent = Math.min(18.0, Math.round(packetLoss * 10) / 10);

  // Channel utilization (airtime occupancy)
  const channelUtilizationPercent = Math.min(96, Math.round(18 + (concurrentShoppers * 0.55)));

  // QoS benefit: POS Voice queue gets prioritized transmission slots (CWmin = 3 instead of 15)
  const qosAdvantageFactor = isWmmQosEnabled ? 3.4 : 1.0;
  const effectiveWifiLatency = isWmmQosEnabled ? Math.max(4.0, wifiAirtimeLatencyMs / 2.2) : wifiAirtimeLatencyMs;

  const totalRoundTripTimeMs = Math.round((effectiveWifiLatency + switchRouterLatencyMs + wanUplinkLatencyMs + serverProcessingMs) * 10) / 10;

  return {
    wifiAirtimeLatencyMs,
    switchRouterLatencyMs,
    wanUplinkLatencyMs,
    serverProcessingMs,
    totalRoundTripTimeMs,
    packetLossPercent,
    jitterMs,
    concurrentClientsCount: concurrentShoppers,
    channelUtilizationPercent,
    qosAdvantageFactor,
  };
}
