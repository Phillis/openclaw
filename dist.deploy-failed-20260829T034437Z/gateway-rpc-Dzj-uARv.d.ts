import { b as OperatorScope } from "./types.openclaw-Cjm06lg9.js";
import "./types-336a6ztO.js";
import { L as GatewayClientMode, R as GatewayClientName } from "./types.core-CECrTHHY.js";
import "./client-CG7Y8enA.js";
import { Command } from "commander";
//#region src/infra/device-identity-store.d.ts
type DeviceIdentity = {
  deviceId: string;
  publicKeyPem: string;
  privateKeyPem: string;
};
//#endregion
//#region src/gateway/connection-details.d.ts
/** Resolved gateway target plus redacted display text for diagnostics. */
type GatewayConnectionDetails = {
  url: string;
  urlSource: string;
  bindDetail?: string;
  remoteFallbackNote?: string;
  message: string;
};
//#endregion
//#region src/gateway/transport-error.d.ts
type GatewayTransportErrorKind = "closed" | "timeout";
declare class GatewayTransportError extends Error {
  readonly kind: GatewayTransportErrorKind;
  readonly connectionDetails: GatewayConnectionDetails;
  readonly code?: number;
  readonly reason?: string;
  readonly timeoutMs?: number;
  constructor(params: {
    kind: GatewayTransportErrorKind;
    message: string;
    connectionDetails: GatewayConnectionDetails;
    code?: number;
    reason?: string;
    timeoutMs?: number;
  });
}
declare function isGatewayTransportError(value: unknown): value is GatewayTransportError;
//#endregion
//#region src/gateway/call.d.ts
declare function isGatewayClientRequestError(value: unknown): value is Error & {
  gatewayCode: string;
  details?: unknown;
  retryable: boolean;
  retryAfterMs?: number;
};
//#endregion
//#region src/cli/gateway-rpc.types.d.ts
/** Common gateway RPC flags accepted by direct gateway command helpers. */
type GatewayRpcOpts = {
  url?: string;
  port?: string;
  token?: string;
  password?: string;
  timeout?: string;
  expectFinal?: boolean;
  json?: boolean;
};
//#endregion
//#region src/cli/gateway-rpc.d.ts
declare function addGatewayClientOptions(cmd: Command, defaults?: {
  timeoutMs?: number;
}): Command;
declare function callGatewayFromCli(method: string, opts: GatewayRpcOpts, params?: unknown, extra?: {
  clientName?: GatewayClientName;
  mode?: GatewayClientMode;
  deviceIdentity?: DeviceIdentity | null;
  signal?: AbortSignal;
  expectFinal?: boolean;
  progress?: boolean;
  scopes?: OperatorScope[];
  sharedStateMode?: "read-only";
}): Promise<Record<string, unknown>>;
//#endregion
export { isGatewayTransportError as a, isGatewayClientRequestError as i, callGatewayFromCli as n, GatewayRpcOpts as r, addGatewayClientOptions as t };