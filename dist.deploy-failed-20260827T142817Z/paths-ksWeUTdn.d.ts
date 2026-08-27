//#region src/config/sessions/paths.d.ts
declare function resolveSessionTranscriptsDirForAgent(agentId: string, env?: NodeJS.ProcessEnv, homedir?: () => string): string;
declare class SessionStoreAgentIdRequiredError extends Error {
  constructor();
}
/** Resolves fixed literal paths without an owner; derived or templated paths require agentId. */
declare function resolveSessionStorePathCore(store?: string, opts?: {
  agentId?: string;
  env?: NodeJS.ProcessEnv;
}): string;
//#endregion
export { resolveSessionStorePathCore as n, resolveSessionTranscriptsDirForAgent as r, SessionStoreAgentIdRequiredError as t };