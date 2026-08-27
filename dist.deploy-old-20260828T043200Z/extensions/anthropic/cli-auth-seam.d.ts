//#region extensions/anthropic/cli-auth-seam.d.ts
type ClaudeCliAuthStatus = {
  status: "available";
} | {
  status: "missing" | "unreadable";
};
/** Ask Claude CLI whether its own login is usable without reading token material. */
declare function probeClaudeCliAuthStatus(params?: {
  command?: string;
  env?: NodeJS.ProcessEnv;
}): ClaudeCliAuthStatus;
//#endregion
export { probeClaudeCliAuthStatus };