import { r as OAuthPrompt, t as OAuthCredentials } from "./provider-oauth-runtime-D9CxXQu2.js";
//#region extensions/openai/openai-chatgpt-oauth-flow.runtime.d.ts
/**
 * Login with OpenAI Codex OAuth
 *
 * @param options.onAuth - Called with URL and instructions when auth starts
 * @param options.onPrompt - Called to prompt user for manual code paste (fallback if no onManualCodeInput)
 * @param options.onProgress - Optional progress messages
 * @param options.onManualCodeInput - Optional promise that resolves with user-pasted code.
 *                                    Races with browser callback - whichever completes first wins.
 *                                    Useful for showing paste input immediately alongside browser flow.
 * @param options.originator - OAuth originator parameter (defaults to "openclaw")
 */
declare function loginOpenAICodex(options: {
  onAuth: (info: {
    url: string;
    instructions?: string;
  }) => Promise<void> | void;
  onPrompt: (prompt: OAuthPrompt) => Promise<string>;
  onProgress?: (message: string) => void;
  onManualCodeInput?: () => Promise<string>;
  originator?: string;
  signal?: AbortSignal;
}): Promise<OAuthCredentials>;
/**
 * Refresh OpenAI Codex OAuth token
 */
declare function refreshOpenAICodexToken(refreshToken: string): Promise<OAuthCredentials>;
//#endregion
export { refreshOpenAICodexToken as n, loginOpenAICodex as t };