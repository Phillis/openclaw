// Shared summary types returned by gateway health and rendered by the CLI.
/** Health snapshot for one configured channel account. */
export type ChannelAccountHealthSummary = {
  accountId: string;
  configured?: boolean;
  linked?: boolean;
  authAgeMs?: number | null;
  probe?: unknown;
  lastProbeAt?: number | null;
  [key: string]: unknown;
};

/** Channel-level health summary with optional per-account details. */
export type ChannelHealthSummary = ChannelAccountHealthSummary & {
  accounts?: Record<string, ChannelAccountHealthSummary>;
};

/** Agent heartbeat and session-store health metadata. */
export type AgentHealthSummary = {
  agentId: string;
  name?: string;
  isDefault: boolean;
  heartbeat: import("../infra/heartbeat-summary.js").HeartbeatSummary;
  sessions: HealthSummary["sessions"];
};

/** Plugin load error details safe for the health payload. */
export type PluginHealthErrorSummary = {
  id: string;
  origin: string;
  activated: boolean;
  activationSource?: string;
  activationReason?: string;
  failurePhase?: string;
  error: string;
};

/** Plugin registry health summary. */
export type PluginHealthSummary = {
  loaded: string[];
  errors: PluginHealthErrorSummary[];
};

/** Context engine quarantine entry included in health output. */
export type ContextEngineHealthQuarantineSummary = {
  engineId: string;
  owner?: string;
  operation: string;
  reason: string;
  failedAt: number;
};

/** Context engine health summary. */
export type ContextEngineHealthSummary = {
  quarantined: ContextEngineHealthQuarantineSummary[];
};

/** Optional model pricing cache health reported by the gateway. */
export type ModelPricingHealthSummary =
  import("../gateway/model-pricing-cache-state.js").GatewayModelPricingHealth;

/** Compact status chip state for local capability summaries. */
export type HealthCapabilityState = "ok" | "warn" | "off" | "missing" | "unknown";

/** Current gateway runtime package/install provenance. */
export type HealthRuntimeInstallSummary = {
  state: HealthCapabilityState;
  detail: string;
  packageRoot?: string;
  packageVersion?: string;
  sourceCheckout?: boolean;
};

/** Memory backend readiness surfaced in health output. */
export type HealthMemoryCapabilitySummary = {
  state: HealthCapabilityState;
  detail: string;
  backend?: "builtin" | "qmd";
  provider?: string;
  pluginSlot?: string | null;
};

/** Aggregated model/provider auth readiness surfaced in health output. */
export type HealthAuthCapabilitySummary = {
  state: HealthCapabilityState;
  detail: string;
  providers: number;
  counts: {
    ok: number;
    expiring: number;
    expired: number;
    missing: number;
    static: number;
  };
};

/** One local CLI/runtime probe included in the capability cache. */
export type HealthAgentRuntimeProbeSummary = {
  id: string;
  label: string;
  command: string;
  available: boolean;
};

/** Local CLI/runtime probe rollup surfaced in health output. */
export type HealthAgentRuntimesCapabilitySummary = {
  state: HealthCapabilityState;
  detail: string;
  probes: HealthAgentRuntimeProbeSummary[];
};

/** Cached local capability snapshot for runtime install, memory, auth, and CLIs. */
export type HealthLocalCapabilitiesSummary = {
  checkedAt: number;
  runtime: HealthRuntimeInstallSummary;
  memory?: HealthMemoryCapabilitySummary;
  auth?: HealthAuthCapabilitySummary;
  agentRuntimes?: HealthAgentRuntimesCapabilitySummary;
};

/** One remote endpoint probe included in the capability cache. */
export type HealthRemoteEndpointProbeSummary = {
  id: string;
  label: string;
  state: HealthCapabilityState;
  detail: string;
  url?: string;
  status?: number;
  elapsedMs?: number;
};

/** Remote model/embedding/reranker endpoint rollup surfaced in health output. */
export type HealthRemoteModelEndpointsCapabilitySummary = {
  state: HealthCapabilityState;
  detail: string;
  probes: HealthRemoteEndpointProbeSummary[];
};

/** Configured remote Gateway reachability surfaced in health output. */
export type HealthRemoteGatewayCapabilitySummary = {
  state: HealthCapabilityState;
  detail: string;
  url?: string;
  status?: number;
  elapsedMs?: number;
};

/** One remote node capability snapshot derived from connected node probes. */
export type HealthRemoteNodeCapabilitySummary = {
  nodeId: string;
  displayName?: string;
  platform?: string;
  deviceFamily?: string;
  connected: boolean;
  supportsSystemRun: boolean;
  supportsSystemWhich: boolean;
  binCount: number;
  binProbeCheckedAt?: number;
};

/** Cached remote capability snapshot for connected node surfaces and probed bins. */
export type HealthRemoteCapabilitiesSummary = {
  checkedAt: number;
  /** Network dependency probes used by health/status. */
  modelEndpoints?: HealthRemoteModelEndpointsCapabilitySummary;
  gateway?: HealthRemoteGatewayCapabilitySummary;
  /** Legacy remote-node skill probe rollup kept for runtime helper compatibility. */
  state?: HealthCapabilityState;
  detail?: string;
  connectedNodes?: number;
  eligibleNodes?: number;
  probedBins?: number;
  nodes?: HealthRemoteNodeCapabilitySummary[];
};

/** Full gateway health payload consumed by `openclaw health`. */
export type HealthSummary = {
  ok: true;
  ts: number;
  durationMs: number;
  eventLoop?: import("../gateway/server/event-loop-health.js").GatewayEventLoopHealth;
  plugins?: PluginHealthSummary;
  contextEngines?: ContextEngineHealthSummary;
  modelPricing?: ModelPricingHealthSummary;
  localCapabilities?: HealthLocalCapabilitiesSummary;
  remoteCapabilities?: HealthRemoteCapabilitiesSummary;
  channels: Record<string, ChannelHealthSummary>;
  channelOrder: string[];
  channelLabels: Record<string, string>;
  heartbeatSeconds: number;
  defaultAgentId: string;
  agents: AgentHealthSummary[];
  sessions: {
    path: string;
    count: number;
    recent: Array<{
      key: string;
      updatedAt: number | null;
      age: number | null;
    }>;
  };
};
