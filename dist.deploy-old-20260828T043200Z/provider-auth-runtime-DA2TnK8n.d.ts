import { g as resolveApiKeyForProviderCore } from "./runtime-api-IAhSVA75.js";
import "./types.openclaw-DRR8P0H2.js";
import "./types-Sg3pk96c.js";
import "./plugin-state-store.types-aSCieMta.js";
import "./provider-auth-helpers-Ckz4sTPJ.js";
//#region src/plugin-sdk/provider-auth-runtime.d.ts
type ProviderOAuthLoopbackCallbackResult = {
  type: "authorization_code";
  code: string;
  state: string;
} | {
  type: "oauth_error";
  error: string;
  errorDescription?: string;
};
type ProviderOAuthLoopbackCallbackServer = {
  waitForCallback: () => Promise<ProviderOAuthLoopbackCallbackResult>;
  close: () => Promise<void>;
};
type ProviderOAuthLoopbackRenderedResponse = {
  body: string;
  contentType: string;
};
type ProviderOAuthLoopbackCorsOriginResolver = (originHeader: string | string[] | undefined) => string | undefined;
/**
 * Binds a hardened loopback listener before returning so provider plugins can open the browser
 * only after the callback route is ready. Invalid request candidates remain nonterminal.
 */
declare function startProviderOAuthLoopbackCallbackServer(params: {
  redirectUrl: string | URL;
  expectedState: string;
  timeoutMs: number;
  signal?: AbortSignal;
  bindHostname?: string;
  resolveCorsOrigin?: ProviderOAuthLoopbackCorsOriginResolver;
  renderSuccess?: () => ProviderOAuthLoopbackRenderedResponse;
  renderError?: (message: string) => ProviderOAuthLoopbackRenderedResponse;
}): Promise<ProviderOAuthLoopbackCallbackServer>;
type ResolveApiKeyForProvider = typeof resolveApiKeyForProviderCore;
/**
 * Resolves provider API-key auth through the runtime auth module when available.
 */
declare function resolveApiKeyForProvider(
/** Provider auth lookup params forwarded to the runtime auth module. */
params: Parameters<ResolveApiKeyForProvider>[0]): Promise<Awaited<ReturnType<ResolveApiKeyForProvider>>>;
//#endregion
export { startProviderOAuthLoopbackCallbackServer as n, resolveApiKeyForProvider as t };