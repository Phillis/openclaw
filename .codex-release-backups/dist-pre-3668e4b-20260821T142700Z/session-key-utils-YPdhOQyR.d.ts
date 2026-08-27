//#region src/sessions/session-key-utils.d.ts
type ParsedAgentSessionKey = {
  agentId: string;
  rest: string;
};
type ParsedThreadSessionSuffix = {
  baseSessionKey: string | undefined;
  threadId: string | undefined;
};
/**
 * Parse agent-scoped session keys in a canonical, case-insensitive way.
 * Returned values are canonicalized for stable comparisons/routing while
 * preserving provider-owned opaque peer IDs.
 */
declare function parseAgentSessionKey(sessionKey: string | undefined | null): ParsedAgentSessionKey | null;
declare function isCronSessionKey(sessionKey: string | undefined | null): boolean;
declare function isSubagentSessionKey(sessionKey: string | undefined | null): boolean;
declare function isAcpSessionKey(sessionKey: string | undefined | null): boolean;
declare function parseThreadSessionSuffix(sessionKey: string | undefined | null): ParsedThreadSessionSuffix;
//#endregion
export { parseThreadSessionSuffix as a, parseAgentSessionKey as i, isCronSessionKey as n, isSubagentSessionKey as r, isAcpSessionKey as t };