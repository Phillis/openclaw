//#region src/sessions/session-key-utils.d.ts
type ParsedAgentSessionKey = {
  agentId: string;
  rest: string;
};
/**
 * Parse agent-scoped session keys in a canonical, case-insensitive way.
 * Returned values are canonicalized for stable comparisons/routing while
 * preserving provider-owned opaque peer IDs.
 */
declare function parseAgentSessionKey(sessionKey: string | undefined | null): ParsedAgentSessionKey | null;
declare function isCronRunSessionKey(sessionKey: string | undefined | null): boolean;
//#endregion
export { isCronRunSessionKey as n, parseAgentSessionKey as r, ParsedAgentSessionKey as t };