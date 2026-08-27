import { d as MemorySessionSyncTarget, n as MemoryEntryProvenance, u as MemorySessionKind } from "../types-Cyy1uoGn.js";
import { n as isCronRunSessionKey } from "../session-key-utils-Dm27D6pt.js";
import { t as isDreamingNarrativeSessionStoreKey } from "../openclaw-runtime-session-FaBbtyZD.js";
//#region src/config/sessions/artifacts.d.ts
/** Returns true for archived session artifacts and legacy store backup names. */
declare function isSessionArchiveArtifactName(fileName: string): boolean;
/** Returns true for transcript files counted in usage, including reset/deleted archives. */
declare function isUsageCountedSessionTranscriptFileName(fileName: string): boolean;
/** Extracts the session id from a usage-counted transcript filename. */
declare function parseUsageCountedSessionIdFromFileName(fileName: string): string | null;
//#endregion
//#region src/config/sessions/legacy-sqlite-marker.d.ts
type SqliteSessionFileMarker = {
  agentId: string;
  sessionId: string;
  storePath: string;
};
declare function parseSqliteSessionFileMarker(sessionFile: string | undefined): SqliteSessionFileMarker | undefined;
//#endregion
//#region packages/memory-host-sdk/src/host/query-expansion.d.ts
/** Returns true for low-value conversational tokens that should not drive FTS matching. */
declare function isQueryStopWordToken(token: string): boolean;
/**
 * Extract keywords from a conversational query for FTS search.
 *
 * Examples:
 * - "that thing we discussed about the API" → ["discussed", "API"]
 * - "之前讨论的那个方案" → ["讨论", "方案"]
 * - "what was the solution for the bug" → ["solution", "bug"]
 */
declare function extractKeywords(query: string, opts?: {
  ftsTokenizer?: "unicode61" | "trigram";
}): string[];
//#endregion
//#region packages/memory-host-sdk/src/host/session-transcript-corpus.d.ts
type SessionTranscriptCorpusArtifactKind = "active-session" | "retained-session" | "archive-artifact";
type SessionTranscriptCorpusOptions = {
  /** Include rotated SQLite transcript identities retained behind current logical sessions. */
  includeRetainedSqlite?: boolean;
};
type SessionTranscriptCorpusEntry = {
  agentId: string;
  sessionFile: string;
  sessionId: string;
  /** Canonical source revision used by derived transcript consumers. */
  contentRevision?: string;
  artifactKind: SessionTranscriptCorpusArtifactKind;
  sessionKey?: string;
  storePath?: string;
  /** Present when an active transcript is addressed by SQLite identity, not a JSONL path. */
  transcriptSource?: "sqlite";
  /** Session entry activity timestamp used when the source has no filesystem stat. */
  updatedAtMs?: number;
  /** True when this transcript belongs to an internal dreaming narrative run. */
  generatedByDreamingNarrative?: boolean;
  /** True when this transcript belongs to an isolated cron run session. */
  generatedByCronRun?: boolean;
  sessionKind?: MemorySessionKind;
};
/**
 * Lists transcript corpus entries for memory indexing.
 *
 * Active sessions come from the session accessor seam; retained reset/delete
 * transcript artifacts remain explicit file artifacts until core owns archive
 * artifact enumeration.
 */
declare function listSessionTranscriptCorpusEntriesForAgent(agentId: string, options?: SessionTranscriptCorpusOptions): Promise<SessionTranscriptCorpusEntry[]>;
//#endregion
//#region packages/memory-host-sdk/src/host/session-files.d.ts
type SessionFileEntry = {
  path: string;
  absPath: string;
  mtimeMs: number;
  size: number;
  hash: string;
  content: string;
  /** Maps each content line (0-indexed) to its 1-indexed JSONL source line. */
  lineMap: number[];
  /** Maps each content line (0-indexed) to epoch ms; 0 means unknown timestamp. */
  messageTimestampsMs: number[];
  /** Provenance aligned one-for-one with exported content lines. */
  lineProvenance: MemoryEntryProvenance[];
  /** True when this transcript belongs to an internal dreaming narrative run. */
  generatedByDreamingNarrative?: boolean;
  /** True when this transcript belongs to an isolated cron run session. */
  generatedByCronRun?: boolean;
  sessionKind: MemorySessionKind;
};
type SessionFileState = Pick<SessionFileEntry, "path" | "absPath" | "mtimeMs" | "size">;
type BuildSessionEntryOptions = {
  /** Optional preclassification from a caller-managed dreaming transcript lookup. */
  generatedByDreamingNarrative?: boolean;
  /** Optional preclassification from a caller-managed cron transcript lookup. */
  generatedByCronRun?: boolean;
  sessionKind?: MemorySessionKind;
  /** Session key for identity-backed transcript readers. */
  sessionKey?: string;
  /** Direct SQLite identity for live runtime transcripts. */
  agentId?: string;
  sessionId?: string;
  storePath?: string;
  /** Activity timestamp for transcript sources that do not have filesystem stats. */
  updatedAtMs?: number;
  /** Override for tests or specialized callers that need a tighter parse yield cadence. */
  parseYieldEveryLines?: number;
  /** Observe persisted messages before memory indexing drops tool-only content. */
  onTranscriptMessage?: (message: unknown, observedAt: number) => void;
};
type SessionTranscriptClassification = {
  dreamingNarrativeTranscriptPaths: ReadonlySet<string>;
  cronRunTranscriptPaths: ReadonlySet<string>;
};
type ResolvedMemorySessionSyncTarget = {
  agentId: string;
  sessionFile: string;
  sessionId: string;
};
type ResolvedSessionTranscriptIdentity = {
  agentId: string;
  sessionId: string;
  sessionKey?: string;
};
declare function normalizeSessionTranscriptPathForComparison(pathname: string): string;
declare function loadDreamingNarrativeTranscriptPathSetForAgent(agentId: string): ReadonlySet<string>;
declare function loadSessionTranscriptClassificationForAgent(agentId: string): SessionTranscriptClassification;
declare function listSessionFilesForAgent(agentId: string): Promise<string[]>;
declare function sessionPathForFile(absPath: string): string;
/** Returns the logical memory path for a live SQLite-backed session transcript. */
declare function sessionPathForSessionIdentity(agentId: string, sessionId: string): string;
/**
 * Parses a deprecated path-shaped memory sync hint only when it points at an
 * OpenClaw-owned usage-counted transcript in the canonical agent sessions dir.
 */
declare function parseCanonicalSessionSyncTargetFromPath(sessionFile: string): MemorySessionSyncTarget | null;
/**
 * Resolves a current transcript path back to the canonical session-store
 * identity when available, falling back to the usage-counted file identity.
 */
declare function resolveSessionIdentityForTranscriptFile(sessionFile: string): ResolvedSessionTranscriptIdentity | null;
/** Resolves only deprecated path-shaped sync targets; live identity uses corpus entries. */
declare function resolveSessionFileForSyncTarget(target: MemorySessionSyncTarget, defaultAgentId?: string): ResolvedMemorySessionSyncTarget | null;
declare function statSessionEntrySync(absPath: string, opts?: BuildSessionEntryOptions): SessionFileState | null;
declare function buildSessionEntry(absPath: string, opts?: BuildSessionEntryOptions): Promise<SessionFileEntry | null>;
//#endregion
//#region src/plugin-sdk/memory-core-host-engine-sessions.d.ts
type MemorySessionTarget = {
  agentId: string;
  sessionId: string;
  sessionKey?: string;
  resolution: "live" | "archived" | "unresolved";
  hookExternalContentSource: string | null;
  channel: string | null;
  accountId: string | null;
  chatType: string | null;
  createdAt?: number;
  participantIds: string[];
};
type MemorySessionSelectors = {
  agentId: string;
  sessionIds?: readonly string[];
  hookSources?: readonly string[];
  participants?: readonly string[];
  since?: string | number;
};
/** Read authoritative admission facts without creating a missing agent database. */
declare function loadMemorySessionMetadata(params: {
  agentId: string;
  sessionId: string;
  sessionKey?: string;
}): MemorySessionTarget | undefined;
/** Resolve retained archive identities after their live session rows disappear. */
declare function loadArchivedSessions(params: {
  agentId: string;
  sessionIds: readonly string[];
}): Array<{
  archiveName: string;
  sessionId: string;
  sessionKey: string;
  createdAt: number;
}>;
/** Resolve explicit memory-forget selectors against authoritative session owners. */
declare function resolveMemorySessionTargets(params: MemorySessionSelectors): MemorySessionTarget[];
//#endregion
export { type BuildSessionEntryOptions, MemorySessionSelectors, MemorySessionTarget, type ResolvedMemorySessionSyncTarget, type ResolvedSessionTranscriptIdentity, type SessionFileEntry, type SessionFileState, type SessionTranscriptClassification, type SessionTranscriptCorpusEntry, type SessionTranscriptCorpusOptions, buildSessionEntry, extractKeywords, isCronRunSessionKey, isDreamingNarrativeSessionStoreKey, isQueryStopWordToken, isSessionArchiveArtifactName, isUsageCountedSessionTranscriptFileName, listSessionFilesForAgent, listSessionTranscriptCorpusEntriesForAgent, loadArchivedSessions, loadDreamingNarrativeTranscriptPathSetForAgent, loadMemorySessionMetadata, loadSessionTranscriptClassificationForAgent, normalizeSessionTranscriptPathForComparison, parseCanonicalSessionSyncTargetFromPath, parseSqliteSessionFileMarker, parseUsageCountedSessionIdFromFileName, resolveMemorySessionTargets, resolveSessionFileForSyncTarget, resolveSessionIdentityForTranscriptFile, sessionPathForFile, sessionPathForSessionIdentity, statSessionEntrySync };