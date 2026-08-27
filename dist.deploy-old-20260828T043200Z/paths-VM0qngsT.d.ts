import { r as OpenClawConfig } from "./types.openclaw-Cjm06lg9.js";
import "./types-336a6ztO.js";
//#region src/config/paths.d.ts
/**
 * State directory for mutable data (sessions, logs, caches).
 * Can be overridden via OPENCLAW_STATE_DIR.
 * Default: ~/.openclaw
 */
declare function resolveStateDir(env?: NodeJS.ProcessEnv, homedir?: () => string): string;
declare let STATE_DIR: string;
/** Resolves the legacy credentials directory retained for Doctor and backup ownership. */
declare function resolveOAuthDir(env?: NodeJS.ProcessEnv, stateDir?: string): string;
declare function resolveGatewayPort(cfg?: OpenClawConfig, env?: NodeJS.ProcessEnv): number;
//#endregion
export { resolveStateDir as i, resolveGatewayPort as n, resolveOAuthDir as r, STATE_DIR as t };