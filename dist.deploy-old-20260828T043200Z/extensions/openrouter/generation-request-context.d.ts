import { n as OpenClawConfig } from "../../types.openclaw-DRR8P0H2.js";
import "../../config-contracts-BoWM1_J1.js";
import { n as PinnedDispatcherPolicy } from "../../ssrf-DvMBKwmI.js";
import "../../fetch-guard-DNck_vGd.js";
import { t as resolveApiKeyForProvider } from "../../provider-auth-runtime-DA2TnK8n.js";
import "undici";
//#region extensions/openrouter/generation-request-context.d.ts
type OpenRouterAuthStore = Parameters<typeof resolveApiKeyForProvider>[0]["store"];
declare function resolveOpenRouterGenerationRequestContext(params: {
  cfg: OpenClawConfig;
  agentDir?: string;
  authStore?: OpenRouterAuthStore;
  capability: "audio" | "image" | "video";
  jsonContentType: boolean;
}): Promise<{
  baseUrl: string;
  allowPrivateNetwork: boolean;
  headers: Headers;
  dispatcherPolicy?: PinnedDispatcherPolicy;
}>;
//#endregion
export { resolveOpenRouterGenerationRequestContext };