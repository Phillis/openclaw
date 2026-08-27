import { y as OperatorScope } from "./types.openclaw-D3TBp_34.js";
import { L as GatewayClientMode, R as GatewayClientName } from "./types.core-CInSoozE.js";
import { Command } from "commander";

//#region src/infra/device-identity-store.d.ts
type DeviceIdentity = {
  deviceId: string;
  publicKeyPem: string;
  privateKeyPem: string;
};
//#endregion
//#region src/cli/gateway-rpc.types.d.ts
/** Common gateway RPC flags accepted by direct gateway command helpers. */
type GatewayRpcOpts = {
  url?: string;
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
}): Promise<Record<string, unknown>>;
//#endregion
export { callGatewayFromCli as n, GatewayRpcOpts as r, addGatewayClientOptions as t };