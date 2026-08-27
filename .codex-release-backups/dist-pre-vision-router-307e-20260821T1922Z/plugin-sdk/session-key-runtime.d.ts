import { t as ParsedAgentSessionKey } from "../session-key-utils-Dnjnq3Ss.js";

//#region src/routing/session-key.d.ts
declare function resolveAgentIdFromSessionKey(sessionKey: string | undefined | null, configuredDefaultAgentId?: string): string;
//#endregion
export { type ParsedAgentSessionKey, resolveAgentIdFromSessionKey };