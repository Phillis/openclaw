import { i as OpenClawConfig } from "./types.openclaw-D9FrGbix.js";
import { c as SessionAcpMeta } from "./types-Bst3_XVW.js";
import { o as SessionEntry } from "./types-DWuuepH4.js";
import { DatabaseSync } from "node:sqlite";
//#region src/acp/runtime/session-meta.d.ts
type AcpSessionStoreEntry = {
  cfg: OpenClawConfig;
  agentId?: string;
  storePath: string;
  sessionKey: string;
  storeSessionKey: string;
  entry?: SessionEntry;
  acp?: SessionAcpMeta;
  storeReadFailed?: boolean;
};
declare function readAcpSessionEntry(params: {
  sessionKey: string;
  agentId?: string;
  cfg?: OpenClawConfig;
  clone?: boolean;
  env?: NodeJS.ProcessEnv;
  databasePath?: string;
}): AcpSessionStoreEntry | null;
declare function listAcpSessionEntries(params: {
  cfg?: OpenClawConfig;
  env?: NodeJS.ProcessEnv;
  clone?: boolean;
  databasePath?: string;
}): Promise<AcpSessionStoreEntry[]>;
declare function upsertAcpSessionMeta(params: {
  sessionKey: string;
  agentId?: string;
  cfg?: OpenClawConfig;
  env?: NodeJS.ProcessEnv;
  databasePath?: string;
  now?: () => number;
  skipMaintenance?: boolean;
  takeCacheOwnership?: boolean;
  mutate: (current: SessionAcpMeta | undefined, entry: SessionEntry | undefined) => SessionAcpMeta | null | undefined;
}): Promise<SessionEntry | null>;
//#endregion
export { readAcpSessionEntry as n, upsertAcpSessionMeta as r, listAcpSessionEntries as t };