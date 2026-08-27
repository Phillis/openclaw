import { a as MemoryReadResult, n as MemoryExtraPath } from "./types-DjvKORHD.js";
import { n as OpenClawConfig, t as MemoryCitationsMode } from "./config-utils-D-FmpNxc.js";

//#region packages/memory-host-sdk/src/host/read-file.d.ts
/** Read a validated memory markdown file from workspace or configured extra paths. */
declare function readMemoryFile(params: {
  workspaceDir: string;
  extraPaths?: MemoryExtraPath[];
  relPath: string;
  from?: number;
  lines?: number;
  defaultLines?: number;
  maxChars?: number;
}): Promise<MemoryReadResult>;
/** Resolve agent memory config and read one memory file for that agent. */
declare function readAgentMemoryFile(params: {
  cfg: OpenClawConfig;
  agentId: string;
  relPath: string;
  from?: number;
  lines?: number;
}): Promise<MemoryReadResult>;
//#endregion
//#region packages/memory-host-sdk/src/host/backend-config.d.ts
type ResolvedMemoryBackendConfig = {
  backend: "builtin";
  citations: MemoryCitationsMode;
};
declare function resolveMemoryBackendConfig(params: {
  cfg: OpenClawConfig;
  agentId: string;
}): ResolvedMemoryBackendConfig;
//#endregion
export { readMemoryFile as i, resolveMemoryBackendConfig as n, readAgentMemoryFile as r, ResolvedMemoryBackendConfig as t };