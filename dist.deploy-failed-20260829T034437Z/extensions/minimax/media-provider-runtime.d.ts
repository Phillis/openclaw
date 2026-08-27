import { nn as resolveApiKeyForProviderCore } from "../../acpx-D5fMZfg0.js";
import "../../types.openclaw-Ca71eRYk.js";
import "../../config-CxevWhLB.js";
import "../../provider-auth-helpers-DJGlcJP1.js";
import { n as postJsonRequest, t as fetchWithTimeoutGuarded } from "../../shared-7_Odzgui.js";
import "../../provider-http-CyNYsG6w.js";
//#region src/plugin-sdk/provider-auth-runtime.d.ts
type ResolveApiKeyForProvider = typeof resolveApiKeyForProviderCore;
/**
 * Resolves provider API-key auth through the runtime auth module when available.
 */
declare function resolveApiKeyForProvider(
/** Provider auth lookup params forwarded to the runtime auth module. */
params: Parameters<ResolveApiKeyForProvider>[0]): Promise<Awaited<ReturnType<ResolveApiKeyForProvider>>>;
//#endregion
//#region extensions/minimax/media-provider-runtime.d.ts
declare const DEFAULT_MINIMAX_MEDIA_BASE_URL = "https://api.minimax.io";
type MinimaxBaseResp = {
  status_code?: number;
  status_msg?: string;
};
type MinimaxRequestPolicy = Pick<Parameters<typeof postJsonRequest>[0], "allowPrivateNetwork" | "dispatcherPolicy">;
declare function resolveMinimaxMediaBaseUrl(cfg: Parameters<typeof resolveApiKeyForProvider>[0]["cfg"], providerId: string): string;
declare function assertMinimaxBaseResp(baseResp: MinimaxBaseResp | undefined, context: string): void;
declare function normalizeMinimaxHexAudio(data: string, label: string): string;
declare function resolveMinimaxGuardedRequestOptions(policy: MinimaxRequestPolicy): Parameters<typeof fetchWithTimeoutGuarded>[4] | undefined;
//#endregion
export { DEFAULT_MINIMAX_MEDIA_BASE_URL, MinimaxBaseResp, MinimaxRequestPolicy, assertMinimaxBaseResp, normalizeMinimaxHexAudio, resolveMinimaxGuardedRequestOptions, resolveMinimaxMediaBaseUrl };