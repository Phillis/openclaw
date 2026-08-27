import { L as GatewayClientMode, R as GatewayClientName } from "./types.core-D43joVXt.js";
import { H as HelloOk, V as EventFrame, z as ConnectParams } from "./index-Cf_fvo6T.js";

//#region packages/gateway-client/src/protocol-request.d.ts
type GatewayProtocolRequestOptions = {
  timeoutMs?: number | null;
  expectFinal?: boolean;
  onSent?: () => void;
  onAccepted?: (payload: unknown) => void;
  signal?: AbortSignal;
};
//#endregion
//#region packages/gateway-client/src/client.d.ts
type DeviceIdentity = {
  deviceId: string;
  privateKeyPem: string;
  publicKeyPem: string;
};
type DeviceAuthTokenRecord = {
  token?: string;
  scopes?: string[];
};
type GatewayClientHostDeps = {
  loadOrCreateDeviceIdentity?: () => DeviceIdentity | undefined;
  signDevicePayload?: (privateKeyPem: string, payload: string) => string;
  publicKeyRawBase64UrlFromPem?: (publicKeyPem: string) => string;
  loadDeviceAuthToken?: (params: {
    deviceId: string;
    role: string;
    env?: NodeJS.ProcessEnv;
  }) => DeviceAuthTokenRecord | null;
  storeDeviceAuthToken?: (params: {
    deviceId: string;
    role: string;
    token: string;
    scopes: string[];
    env?: NodeJS.ProcessEnv;
  }) => void;
  clearDeviceAuthToken?: (params: {
    deviceId: string;
    role: string;
    env?: NodeJS.ProcessEnv;
  }) => void;
  beforeConnect?: () => void;
  registerGatewayLoopbackBypass?: (url: string) => (() => void) | undefined;
  logDebug?: (message: string) => void;
  logError?: (message: string) => void;
  redactForLog?: (message: string) => string;
  normalizeTlsFingerprint?: (fingerprint: string | undefined) => string;
};
type GatewayClientRequestOptions = GatewayProtocolRequestOptions;
type GatewayReconnectPausedInfo = {
  code: number;
  reason: string;
  detailCode: string | null;
};
type GatewayClientCloseInfo = {
  phase: "pre-hello" | "post-hello";
  socketOpened: boolean;
  transportValidated: boolean;
  connectRequestSent?: boolean;
  transientPreHelloCleanClose: boolean;
  connectError?: Error;
};
type GatewayClientOptions$1 = {
  url?: string;
  origin?: string;
  connectChallengeTimeoutMs?: number;
  /**
   * Server-side pre-auth handshake budget. Config-derived local clients use
   * this to keep the connect-challenge watchdog aligned with the gateway.
   */
  preauthHandshakeTimeoutMs?: number;
  tickWatchMinIntervalMs?: number;
  tickWatchTimeoutMs?: number;
  requestTimeoutMs?: number;
  token?: string;
  bootstrapToken?: string; /** Prefer one setup credential for the first successful device-auth exchange. */
  preferBootstrapToken?: boolean;
  deviceToken?: string;
  password?: string;
  approvalRuntimeToken?: string;
  agentRuntimeIdentityToken?: string;
  instanceId?: string;
  clientName?: GatewayClientName;
  clientDisplayName?: string;
  clientVersion?: string;
  clientBuildId?: string;
  platform?: string;
  deviceFamily?: string;
  mode?: GatewayClientMode;
  role?: string;
  scopes?: string[];
  caps?: string[];
  commands?: string[];
  computerUse?: ConnectParams["computerUse"];
  workerRuns?: ConnectParams["workerRuns"];
  permissions?: Record<string, boolean>;
  pathEnv?: string;
  env?: NodeJS.ProcessEnv;
  deviceIdentity?: DeviceIdentity | null;
  hostDeps?: GatewayClientHostDeps;
  minProtocol?: number;
  maxProtocol?: number;
  tlsFingerprint?: string;
  onEvent?: (evt: EventFrame) => void;
  onHelloOk?: (hello: HelloOk) => void;
  onConnectError?: (err: Error) => void;
  onReconnectPaused?: (info: GatewayReconnectPausedInfo) => void;
  onClose?: (code: number, reason: string, info?: GatewayClientCloseInfo) => void;
  onGap?: (info: {
    expected: number;
    received: number;
  }) => void;
};
type GatewayClientConnectionMetadata = {
  clientName?: GatewayClientName;
  hasDeviceIdentity: boolean;
  mode?: GatewayClientMode;
  preauthHandshakeTimeoutMs?: number;
};
//#endregion
//#region packages/gateway-client/src/readiness.d.ts
type GatewayClientStartable = {
  start(): void;
};
/** Timeout and abort controls for delaying client start until the loop can process IO. */
type GatewayClientStartReadinessOptions = {
  timeoutMs?: number;
  clientOptions?: Pick<GatewayClientOptions$1, "connectChallengeTimeoutMs" | "env" | "preauthHandshakeTimeoutMs">;
  signal?: AbortSignal;
};
//#endregion
//#region src/gateway/client.d.ts
type GatewayClientOptions = GatewayClientOptions$1 & {
  /** Exact normalized remote gateway scope for origin-bound device credentials. */deviceAuthScope?: string;
};
declare class GatewayClient {
  #private;
  constructor(opts: GatewayClientOptions);
  start(): void;
  stop(): void;
  stopAndWait(opts?: {
    timeoutMs?: number;
  }): Promise<void>;
  request<T = Record<string, unknown>>(method: string, params?: unknown, opts?: GatewayClientRequestOptions): Promise<T>;
  getConnectionMetadata(): GatewayClientConnectionMetadata;
  updateNodeManifest(manifest: {
    caps: string[];
    commands: string[];
    computerUse?: GatewayClientOptions$1["computerUse"];
  }): void;
}
//#endregion
export { GatewayReconnectPausedInfo as a, GatewayClientStartable as i, GatewayClientOptions as n, GatewayClientStartReadinessOptions as r, GatewayClient as t };