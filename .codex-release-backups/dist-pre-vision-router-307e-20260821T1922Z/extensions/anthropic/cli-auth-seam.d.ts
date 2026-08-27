import { t as ClaudeCliCredential } from "../../cli-credentials-DwrY1q2u.js";

//#region extensions/anthropic/cli-auth-seam.d.ts
/** Read Claude CLI credentials for interactive setup paths. */
declare function readClaudeCliCredentialsForSetup(): ClaudeCliCredential | null;
/** Read Claude CLI credentials for setup checks that must not prompt. */
declare function readClaudeCliCredentialsForSetupNonInteractive(): {
  readonly status: "available";
  readonly credential: ClaudeCliCredential;
} | {
  readonly status: "unreadable" | "missing";
  readonly credential?: undefined;
};
/** Read Claude CLI credentials for runtime without keychain prompts. */
declare function readClaudeCliCredentialsForRuntime(): ClaudeCliCredential | null;
//#endregion
export { readClaudeCliCredentialsForRuntime, readClaudeCliCredentialsForSetup, readClaudeCliCredentialsForSetupNonInteractive };