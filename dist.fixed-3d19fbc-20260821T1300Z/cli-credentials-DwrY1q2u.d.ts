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
//#endregion
export { ClaudeCliCredential as t };