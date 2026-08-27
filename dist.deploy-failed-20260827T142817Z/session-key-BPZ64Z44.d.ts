//#region src/routing/session-key.d.ts
declare const DEFAULT_MAIN_KEY = "main";
declare function normalizeMainKey(value: string | undefined | null): string;
declare function resolveAgentIdFromSessionKey(sessionKey: string | undefined | null, configuredDefaultAgentId?: string): string;
declare function sanitizeAgentId(value: string | undefined | null): string;
declare function buildAgentMainSessionKey(params: {
  agentId: string;
  mainKey?: string | undefined;
}): string;
declare function buildGroupHistoryKey(params: {
  channel: string;
  accountId?: string | null;
  peerKind: "group" | "channel";
  peerId: string;
}): string;
declare function resolveThreadSessionKeys(params: {
  baseSessionKey: string;
  threadId?: string | null;
  parentSessionKey?: string;
  useSuffix?: boolean;
  normalizeThreadId?: (threadId: string) => string;
}): {
  sessionKey: string;
  parentSessionKey?: string;
};
//#endregion
export { resolveAgentIdFromSessionKey as a, normalizeMainKey as i, buildAgentMainSessionKey as n, resolveThreadSessionKeys as o, buildGroupHistoryKey as r, sanitizeAgentId as s, DEFAULT_MAIN_KEY as t };