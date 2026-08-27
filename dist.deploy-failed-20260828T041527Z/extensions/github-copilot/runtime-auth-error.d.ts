//#region extensions/github-copilot/runtime-auth-error.d.ts
type CopilotRuntimeAuthFailure = {
  reason: "http_error";
  status: number;
} | {
  reason: "timeout";
  timeoutMs: number;
  cause?: unknown;
};
declare class CopilotRuntimeAuthError extends Error {
  readonly code = "github_copilot_auth_failed";
  readonly reason: CopilotRuntimeAuthFailure["reason"];
  readonly status?: number;
  readonly timeoutMs?: number;
  constructor(failure: CopilotRuntimeAuthFailure);
}
//#endregion
export { CopilotRuntimeAuthError };