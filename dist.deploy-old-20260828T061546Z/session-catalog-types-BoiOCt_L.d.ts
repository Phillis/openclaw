import { U as SessionCatalogPullRequestSummary } from "./channel-id.types-BshMre9Z.js";
import "./session-catalog-BF6GFto-.js";
import { t as ClaudeTranscriptItem } from "./session-catalog-transcript-D2tmIkUf.js";
//#region extensions/anthropic/session-catalog-types.d.ts
type ClaudeSessionSource = "claude-cli" | "claude-desktop";
type ClaudeSessionCatalogSession = {
  threadId: string;
  name?: string | null;
  cwd?: string;
  status: "stored";
  createdAt?: number;
  updatedAt?: number;
  recencyAt?: number | null;
  source: ClaudeSessionSource;
  modelProvider: "anthropic";
  cliVersion?: string;
  gitBranch?: string;
  customGroup?: string;
  pullRequest?: SessionCatalogPullRequestSummary;
  archived: false;
};
type ClaudeSessionCatalogPage = {
  sessions: ClaudeSessionCatalogSession[];
  nextCursor?: string;
};
type ClaudeSessionCatalogHost = ClaudeSessionCatalogPage & {
  hostId: string;
  label: string;
  kind: "gateway" | "node";
  connected: boolean;
  nodeId?: string;
  canContinueClaude?: boolean;
  canOpenTerminalClaude?: boolean;
  error?: {
    code: string;
    message: string;
  };
};
type ClaudeSessionCatalogResult = {
  hosts: ClaudeSessionCatalogHost[];
};
type ClaudeSessionTranscriptPage = {
  hostId: string;
  label: string;
  threadId: string;
  items: ClaudeTranscriptItem[];
  nextCursor?: string;
};
//#endregion
export { ClaudeSessionTranscriptPage as a, ClaudeSessionCatalogSession as i, ClaudeSessionCatalogPage as n, ClaudeSessionCatalogResult as r, ClaudeSessionCatalogHost as t };