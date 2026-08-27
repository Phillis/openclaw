//#region src/config/sessions/paths.d.ts
declare function resolveSessionTranscriptsDirForAgent(agentId: string, env?: NodeJS.ProcessEnv, homedir?: () => string): string;
/** Resolves fixed literal paths without an owner; derived or templated paths require agentId. */
declare function resolveSessionStorePathCore(store?: string, opts?: {
  agentId?: string;
  env?: NodeJS.ProcessEnv;
}): string;
//#endregion
export { resolveSessionTranscriptsDirForAgent as n, resolveSessionStorePathCore as t };