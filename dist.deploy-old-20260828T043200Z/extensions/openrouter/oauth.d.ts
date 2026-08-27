import { D as ProviderAuthMethod } from "../../runtime-api-IAhSVA75.js";
import { n as startProviderOAuthLoopbackCallbackServer } from "../../provider-auth-runtime-DA2TnK8n.js";
//#region extensions/openrouter/oauth.d.ts
type OpenRouterOAuthLoginOptions = {
  createPkce?: () => {
    verifier: string;
    challenge: string;
  };
  createState?: () => string;
  fetchImpl?: typeof fetch;
  startCallback?: typeof startProviderOAuthLoopbackCallbackServer;
};
declare function createOpenRouterOAuthAuthMethod(options?: OpenRouterOAuthLoginOptions): ProviderAuthMethod;
//#endregion
export { createOpenRouterOAuthAuthMethod };