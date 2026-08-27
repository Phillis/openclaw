import { D as OAuthProvider } from "./types-BFl3Ao02.js";
import { execSync } from "node:child_process";

//#region src/agents/cli-credentials.d.ts
/** Credential shape parsed from Claude Code CLI storage. */
type ClaudeCliCredential = {
  type: "oauth";
  provider: "anthropic";
  access: string;
  refresh: string;
  expires: number;
  subscriptionType?: string;
  rateLimitTier?: string;
  email?: string;
} | {
  type: "token";
  provider: "anthropic";
  token: string;
  expires: number;
  subscriptionType?: string;
  rateLimitTier?: string;
  email?: string;
} | {
  type: "api_key_helper";
  provider: "anthropic";
  helperHash: string;
};
/** Credential shape parsed from Codex CLI storage. */
type CodexCliCredential = {
  type: "oauth";
  provider: OAuthProvider;
  access: string;
  refresh: string;
  expires: number;
  accountId?: string;
  idToken?: string;
};
type ExecSyncFn = typeof execSync;
type ClaudeCliCredentialReadOptions = {
  allowKeychainPrompt?: boolean;
  tryKeychainWithoutPrompt?: boolean;
  onStoredCredentialUnreadable?: () => void;
  ttlMs?: number;
  platform?: NodeJS.Platform;
  homeDir?: string;
  execSync?: ExecSyncFn;
};
/** @deprecated Anthropic provider-owned CLI credential helper; do not use from third-party plugins. */
declare function readClaudeCliCredentialsCached(options?: ClaudeCliCredentialReadOptions): ClaudeCliCredential | null;
/** Reads Codex CLI credentials with optional short-lived cache and file fingerprinting. */
declare function readCodexCliCredentialsCached(options?: {
  codexHome?: string;
  allowKeychainPrompt?: boolean;
  ttlMs?: number;
  platform?: NodeJS.Platform;
  execSync?: ExecSyncFn;
}): CodexCliCredential | null;
//#endregion
export { readCodexCliCredentialsCached as n, readClaudeCliCredentialsCached as t };