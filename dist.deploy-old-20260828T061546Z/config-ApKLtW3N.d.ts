import { n as OpenClawConfig, t as ConfigFileSnapshot } from "./types.openclaw-DckSqIPo.js";
import "./types-B4QsRB1k.js";
import "./manifest-registry-DlXWkAjt.js";
import "./plugin-metadata-snapshot-N0cS4S-r.js";
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
//#region src/config/io.runtime.d.ts
declare function getRuntimeConfig(options?: {
  skipPluginValidation?: boolean;
  pin?: boolean;
  skipShellEnvFallback?: boolean;
}): OpenClawConfig;
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
//#endregion
export { ConfigWriteAfterWrite as i, ConfigReplaceResult as n, getRuntimeConfig as r, resolveStateDir as t };