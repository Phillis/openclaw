import { n as OpenClawConfig } from "../types.openclaw-DckSqIPo.js";
import { a as SessionEntry } from "../types-DPz-SxBl.js";
import { a as SessionTranscriptMemoryHitKeyParams, c as parseSessionTranscriptMemoryHitKey, i as SessionTranscriptMemoryHitKey, l as resolveSessionTranscriptMemoryHitKeyToSessionKeys, n as SessionTranscriptIdentity, o as SessionTranscriptReadParams, r as SessionTranscriptMemoryHitIdentity, s as formatSessionTranscriptMemoryHitKey, t as ResolveSessionTranscriptMemoryHitKeyParams } from "../session-transcript-memory-hit-CvRrX8sW.js";
//#region src/plugin-sdk/session-transcript-hit.d.ts
/** Loads the cross-session plugin view without process-only incognito rows. */
declare function loadCombinedSessionStoreForGateway(cfg: OpenClawConfig, opts?: {
  agentId?: string;
  configuredAgentsOnly?: boolean;
}): {
  storePath: string;
  store: {
    [k: string]: SessionEntry;
  };
};
/** Canonical session identity parsed from a transcript search-hit path. */
type SessionTranscriptHitIdentity = {
  stem: string;
  ownerAgentId?: string;
  archived: boolean;
};
/**
 * Derive transcript stem `S` from a memory search hit path for `source === "sessions"`.
 * Builtin index uses `sessions/<basename>.jsonl`.
 * Archived transcripts (`.jsonl.reset.<iso>` / `.jsonl.deleted.<iso>`) resolve
 * to the same stem as the live `.jsonl` they were rotated from.
 */
declare function extractTranscriptStemFromSessionsMemoryHit(hitPath: string): string | null;
/** Parse live/archive ownership metadata from a sessions-memory hit path. */
declare function extractTranscriptIdentityFromSessionsMemoryHit(hitPath: string): SessionTranscriptHitIdentity | null;
/**
 * Map transcript stem to canonical session store keys (all agents in the combined store).
 * Session tools visibility and agent-to-agent policy are enforced by the caller (e.g.
 * `createSessionVisibilityGuard`), including cross-agent cases.
 */
declare function resolveTranscriptStemToSessionKeys(params: {
  store: Record<string, SessionEntry>;
  stem: string;
  archivedOwnerAgentId?: string;
}): string[];
//#endregion
export { type ResolveSessionTranscriptMemoryHitKeyParams, SessionTranscriptHitIdentity, type SessionTranscriptIdentity, type SessionTranscriptMemoryHitIdentity, type SessionTranscriptMemoryHitKey, type SessionTranscriptMemoryHitKeyParams, type SessionTranscriptReadParams, extractTranscriptIdentityFromSessionsMemoryHit, extractTranscriptStemFromSessionsMemoryHit, formatSessionTranscriptMemoryHitKey, loadCombinedSessionStoreForGateway, parseSessionTranscriptMemoryHitKey, resolveSessionTranscriptMemoryHitKeyToSessionKeys, resolveTranscriptStemToSessionKeys };