import { n as OpenClawConfig, t as ConfigFileSnapshot } from "./types.openclaw-D3Ap19Na.js";
import "./types-vfwkTnFP.js";
import "./manifest-registry-DdCvbEOK.js";
import "./plugin-metadata-snapshot.types-9gBeaSYD.js";
import "json5";
//#region src/config/runtime-snapshot.d.ts
type ConfigWriteAfterWrite = {
  mode: "auto";
} | {
  mode: "restart";
  reason: string;
} | {
  mode: "none";
  reason: string;
};
type ConfigWriteFollowUp = {
  mode: "auto";
  requiresRestart: false;
} | {
  mode: "none";
  reason: string;
  requiresRestart: false;
} | {
  mode: "restart";
  reason: string;
  requiresRestart: true;
};
//#endregion
//#region src/config/mutate.d.ts
type ConfigReplaceResult = {
  path: string;
  previousHash: string | null;
  snapshot: ConfigFileSnapshot;
  nextConfig: OpenClawConfig;
  persistedHash: string | null;
  afterWrite: ConfigWriteAfterWrite;
  followUp: ConfigWriteFollowUp;
};
//#endregion
//#region src/config/paths.d.ts
/**
 * State directory for mutable data (sessions, logs, caches).
 * Can be overridden via OPENCLAW_STATE_DIR.
 * Default: ~/.openclaw
 */
declare function resolveStateDir(env?: NodeJS.ProcessEnv, homedir?: () => string): string;
declare function resolveGatewayPort(cfg?: OpenClawConfig, env?: NodeJS.ProcessEnv): number;
//#endregion
export { ConfigWriteAfterWrite as i, resolveStateDir as n, ConfigReplaceResult as r, resolveGatewayPort as t };