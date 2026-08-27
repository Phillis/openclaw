import { O as ProviderAuthMethod } from "../../types-7E39v2Gx.js";
//#region extensions/openrouter/oauth.d.ts
type OpenRouterOAuthCallbackResult = {
  code: string;
  state: string;
};
type OpenRouterOAuthLoginOptions = {
  createPkce?: () => {
    verifier: string;
    challenge: string;
  };
  createState?: () => string;
  fetchImpl?: typeof fetch;
  waitForCallback?: typeof waitForOpenRouterOAuthCallback;
};
declare function waitForOpenRouterOAuthCallback(params: {
  expectedState: string;
  timeoutMs?: number;
  onProgress?: (message: string) => void;
  signal?: AbortSignal;
}): Promise<OpenRouterOAuthCallbackResult>;
declare function createOpenRouterOAuthAuthMethod(options?: OpenRouterOAuthLoginOptions): ProviderAuthMethod;
//#endregion
export { createOpenRouterOAuthAuthMethod };