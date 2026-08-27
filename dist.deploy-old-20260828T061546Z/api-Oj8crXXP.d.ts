import "./plugin-entry-DyrRrRy2.js";
import "./config-Cpzyu638.js";
import "./gateway-runtime-VZZQ2vTC.js";
import "./qr-image-AAaQyFSR.js";
//#region src/shared/device-bootstrap-profile.d.ts
/** Closed purpose codes carried by specialized bootstrap tokens. */
type DeviceBootstrapPurpose = "control-ui" | "control-ui-owner" | "mobile-full" | "voice-node" | "cloud-worker";
/** Normalized roles/scopes carried by a bootstrap token during device handoff. */
type DeviceBootstrapProfile = {
  roles: string[];
  scopes: string[];
  purpose?: DeviceBootstrapPurpose;
};
/** Caller-provided bootstrap profile before role/scope normalization and bounding. */
type DeviceBootstrapProfileInput = {
  roles?: readonly string[];
  scopes?: readonly string[];
  purpose?: DeviceBootstrapPurpose;
};
/** Existing least-privilege setup-code/QR profile. */
declare const PAIRING_SETUP_BOOTSTRAP_PROFILE: DeviceBootstrapProfile;
//#endregion
//#region src/infra/device-pairing.types.d.ts
/** Pending device pairing request awaiting owner approval. */
type DevicePairingPendingRequest = {
  requestId: string;
  deviceId: string;
  publicKey: string;
  displayName?: string;
  platform?: string;
  deviceFamily?: string;
  clientId?: string;
  clientMode?: string;
  browserOrigin?: string;
  role?: string;
  roles?: string[];
  scopes?: string[];
  remoteIp?: string;
  silent?: boolean;
  isRepair?: boolean;
  ts: number;
};
/** Bearer token issued to one paired device role. */
type DeviceAuthToken = {
  token: string;
  role: string;
  scopes: string[];
  issuer?: {
    kind: "shared-gateway-auth";
    generation: string;
  };
  createdAtMs: number;
  rotatedAtMs?: number;
  revokedAtMs?: number;
  lastUsedAtMs?: number;
};
/**
 * How the latest pairing approval was granted. "silent" is a same-host local
 * policy approval and the only prune-eligible kind: local clients re-pair
 * silently and cannot collide with another machine's records. "trusted-cidr"
 * and "ssh-verified" are also non-interactive but cross hosts, so they are
 * never pruned automatically (display metadata is not a machine identity).
 * "trusted-proxy" records were approved from an authenticated proxy identity.
 * "owner" and "bootstrap" approvals required a user action. None of these
 * cross-host or interactive approval kinds are pruned automatically.
 */
type PairedDeviceApprovalKind = "owner" | "silent" | "trusted-cidr" | "trusted-proxy" | "ssh-verified" | "bootstrap";
/**
 * Approved node capability surface for a node-role device. Device pairing
 * grants connection auth; this grants command/capability exposure (node
 * command gating). displayName here is the operator-facing node name set at
 * approval or via node.rename; it must not be clobbered by reconnect
 * metadata refreshes, which is why it lives apart from the device fields.
 */
type PairedDeviceNodeSurface = {
  displayName?: string;
  version?: string;
  coreVersion?: string;
  uiVersion?: string;
  modelIdentifier?: string;
  caps?: string[];
  commands?: string[];
  permissions?: Record<string, boolean>;
  bins?: string[];
  /** Last current-generation runner publication explicitly enabled session hosting. */
  sessionHost?: boolean;
  createdAtMs: number;
  approvedAtMs: number;
  lastConnectedAtMs?: number;
  lastDisconnectedAtMs?: number;
};
/**
 * Pending node-surface approval awaiting an operator decision (one per
 * device). Carries its own metadata snapshot so approval UIs can show what
 * the node declared at request time. `revision` guards the reconnect-vs-
 * approve race: reconnect cleanup only deletes the revision it observed, so
 * a refreshed request survives concurrent approval flows.
 */
type PairedDevicePendingNodeSurface = {
  requestId: string;
  revision: string;
  displayName?: string;
  platform?: string;
  version?: string;
  coreVersion?: string;
  uiVersion?: string;
  clientId?: string;
  clientMode?: string;
  deviceFamily?: string;
  modelIdentifier?: string;
  caps?: string[];
  commands?: string[];
  permissions?: Record<string, boolean>;
  remoteIp?: string;
  silent?: boolean;
  ts: number;
};
/** Persisted approved device record, including durable approval and active role tokens. */
type PairedDevice = {
  deviceId: string;
  publicKey: string;
  displayName?: string;
  operatorLabel?: string;
  platform?: string;
  deviceFamily?: string;
  clientId?: string;
  clientMode?: string;
  browserOrigin?: string;
  role?: string;
  roles?: string[];
  scopes?: string[];
  approvedScopes?: string[];
  remoteIp?: string;
  tokens?: Record<string, DeviceAuthToken>;
  approvedVia?: PairedDeviceApprovalKind;
  nodeSurface?: PairedDeviceNodeSurface;
  pendingNodeSurface?: PairedDevicePendingNodeSurface;
  createdAtMs: number;
  approvedAtMs: number;
  lastSeenAtMs?: number;
  lastSeenReason?: string;
};
/** Persisted bootstrap token state, including binding and role/scope redemption progress. */
type DeviceBootstrapTokenRecord = {
  token: string;
  setupId?: string;
  ts: number;
  deviceId?: string;
  publicKey?: string;
  profile?: DeviceBootstrapProfile;
  redeemedProfile?: DeviceBootstrapProfile;
  pendingProfile?: DeviceBootstrapProfile;
  issuedAtMs: number;
  lastUsedAtMs?: number;
};
//#endregion
//#region src/infra/device-pairing.d.ts
/** Combined pending/paired view returned by pairing list APIs. */
type DevicePairingList = {
  pending: DevicePairingPendingRequest[];
  paired: PairedDevice[];
};
declare function listDevicePairing(baseDir?: string): Promise<DevicePairingList>;
//#endregion
//#region src/shared/tailscale-status.d.ts
type TailscaleStatusCommandResult = {
  code: number | null;
  stdout: string;
};
type TailscaleStatusCommandRunner = (argv: string[], opts: {
  timeoutMs: number;
}) => Promise<TailscaleStatusCommandResult>;
/** Runs known Tailscale status commands and returns the first DNS name or tailnet IP found. */
declare function resolveTailnetHostWithRunner(runCommandWithTimeout?: TailscaleStatusCommandRunner): Promise<string | null>;
/** Finds persistent HTTPS Serve routes whose root proxy targets this gateway port. */
declare function resolveTailscaleServeGatewayUrlsWithRunner(gatewayPort: number, runCommandWithTimeout?: TailscaleStatusCommandRunner): Promise<string[]>;
//#endregion
//#region src/shared/gateway-bind-url.d.ts
type GatewayBindUrlResult = {
  url: string;
  source: "gateway.bind=custom" | "gateway.bind=tailnet" | "gateway.bind=lan";
} | {
  error: string;
} | null;
/** Resolves the externally advertised gateway URL for non-loopback bind modes. */
declare function resolveGatewayBindUrl(params: {
  bind?: string;
  customBindHost?: string;
  scheme: "ws" | "wss";
  port: number;
  pickTailnetHost: () => string | null;
  pickLanHost: () => string | null;
}): GatewayBindUrlResult;
//#endregion
//#region src/infra/device-pairing-approval.d.ts
/** Paired-device access metadata refreshed when an existing device reconnects. */
type DevicePairingAccessMetadata = Pick<PairedDevice, "displayName" | "remoteIp" | "lastSeenAtMs" | "lastSeenReason">;
/** Authorization failure categories for owner approval and bootstrap approval flows. */
type DevicePairingForbiddenReason = "caller-scopes-required" | "caller-missing-scope" | "scope-outside-requested-roles" | "bootstrap-role-not-allowed" | "bootstrap-scope-not-allowed";
/** Structured forbidden result with the missing/disallowed role or scope when known. */
type DevicePairingForbiddenResult = {
  status: "forbidden";
  reason: DevicePairingForbiddenReason;
  scope?: string;
  role?: string;
};
/** Pairing approval outcome: approved, forbidden with reason, or request not found. */
type ApproveDevicePairingResult = {
  status: "approved";
  requestId: string;
  device: PairedDevice;
  /** Existing connected node transports must be retired before success is returned. */
  nodePairingGenerationChanged?: true;
} | DevicePairingForbiddenResult | null;
/** Approve a pending request with optional caller-scope checks for operator grants. */
declare function approveDevicePairing(requestId: string, baseDir?: string): Promise<ApproveDevicePairingResult>;
declare function approveDevicePairing(requestId: string, options: {
  callerScopes?: readonly string[];
  accessMetadata?: DevicePairingAccessMetadata;
  approvedVia?: Extract<PairedDeviceApprovalKind, "owner" | "silent" | "trusted-cidr" | "trusted-proxy" | "ssh-verified">;
  /**
   * Replace the pending scopes only for a brand-new operator device, or — under
   * trusted-proxy approval — for a known operator device re-requesting with its
   * already-paired public key. The live role set is rechecked under the pairing
   * lock so a merged request cannot inherit non-operator access through browser
   * auto-approval.
   */
  autoApproveNewDeviceScopes?: readonly string[];
}, baseDir?: string): Promise<ApproveDevicePairingResult>;
//#endregion
//#region src/infra/device-bootstrap.d.ts
type DeviceBootstrapTokenIssueParams = {
  baseDir?: string;
  profile?: DeviceBootstrapProfileInput;
  roles?: readonly string[];
  scopes?: readonly string[];
};
/** Issue a short-lived generic bootstrap token with a bounded role/scope handoff profile. */
declare function issueDeviceBootstrapToken(params?: DeviceBootstrapTokenIssueParams): Promise<{
  token: string;
  expiresAtMs: number;
}>;
/** Remove every outstanding bootstrap token from the pairing state file. */
declare function clearDeviceBootstrapTokens(params?: {
  baseDir?: string;
}): Promise<{
  removed: number;
}>;
/** Revoke one bootstrap token and return its record for best-effort restore flows. */
declare function revokeDeviceBootstrapToken(params: {
  token: string;
  baseDir?: string;
}): Promise<{
  removed: boolean;
  record?: DeviceBootstrapTokenRecord;
}>;
//#endregion
//#region src/plugin-sdk/run-command.d.ts
/** Captured process result returned by plugin command execution helpers. */
type PluginCommandRunResult = {
  /** Process exit code, with `1` used when the command failed before spawning or did not report one. */
  code: number;
  /** Captured standard output as UTF-8 text. */
  stdout: string;
  /** Captured standard error, normalized to include timeout or thrown-error messages. */
  stderr: string;
};
/** Options for commands that are launched on behalf of a plugin runtime. */
type PluginCommandRunOptions = {
  /** Executable and arguments, with the command name in the first slot. */
  argv: string[];
  /** Hard execution limit in milliseconds before the command is terminated. */
  timeoutMs: number;
  /** Working directory for the child process. Defaults to the current process directory. */
  cwd?: string;
  /** Environment passed to the child process. Defaults to the current process environment. */
  env?: NodeJS.ProcessEnv;
};
/** Run a plugin-managed command with timeout handling and normalized stdout/stderr results. */
declare function runPluginCommandWithTimeout(options: PluginCommandRunOptions): Promise<PluginCommandRunResult>;
//#endregion
//#region src/infra/tmp-openclaw-dir.d.ts
type SecureDirStat = {
  isDirectory(): boolean;
  isSymbolicLink(): boolean;
  mode?: number;
  uid?: number;
};
/** Injectable filesystem/platform hooks for resolving the preferred temp root in tests. */
type ResolvePreferredOpenClawTmpDirOptions = {
  accessSync?: (path: string, mode?: number) => void;
  chmodSync?: (path: string, mode: number) => void;
  getuid?: () => number | undefined;
  lstatSync?: (path: string) => SecureDirStat;
  mkdirSync?: (path: string, opts: {
    recursive: boolean;
    mode?: number;
  }) => void;
  platform?: NodeJS.Platform;
  preferredDir?: string;
  tmpdir?: () => string;
  warn?: (message: string) => void;
};
/** Resolves a safe OpenClaw temp root, falling back to user-scoped os.tmpdir paths when needed. */
declare function resolvePreferredOpenClawTmpDir(options?: ResolvePreferredOpenClawTmpDirOptions): string;
//#endregion
export { revokeDeviceBootstrapToken as a, resolveTailnetHostWithRunner as c, DeviceBootstrapProfile as d, PAIRING_SETUP_BOOTSTRAP_PROFILE as f, issueDeviceBootstrapToken as i, resolveTailscaleServeGatewayUrlsWithRunner as l, runPluginCommandWithTimeout as n, approveDevicePairing as o, clearDeviceBootstrapTokens as r, resolveGatewayBindUrl as s, resolvePreferredOpenClawTmpDir as t, listDevicePairing as u };