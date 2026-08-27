import { m as ProviderThinkingProfile } from "../../plugin-entry-BZAeuuKK.js";
import { n as OpenClawConfig } from "../../types.openclaw-CZEJqSSW.js";
import { o as ModelProviderConfig } from "../../types.models-DQnz5K9u.js";
import "../../provider-model-types-Dy05kVgC.js";
import { applyAnthropicConfigDefaults } from "./config-defaults.js";
import "../../config-runtime-Cb6u-e_t.js";
//#region extensions/anthropic/provider-policy-api.d.ts
/** Profile ids that native Claude auth has retired from OpenClaw ownership. */
declare const deprecatedProfileIds: readonly ["anthropic:claude-cli"];
/** Normalize Anthropic provider config without importing runtime registration. */
declare function normalizeConfig(params: {
  provider: string;
  providerConfig: ModelProviderConfig;
}): ModelProviderConfig;
/** Apply Anthropic config defaults through the provider-policy seam. */
declare function applyConfigDefaults(params: Parameters<typeof applyAnthropicConfigDefaults>[0]): OpenClawConfig;
/** Resolve Claude thinking profile for Anthropic or Claude CLI providers. */
declare function resolveThinkingProfile(params: {
  provider: string;
  modelId: string;
  params?: Record<string, unknown>;
}): {
  readonly levels: readonly [{
    readonly id: "off";
  }];
  readonly defaultLevel: "off";
} | ProviderThinkingProfile | null;
//#endregion
export { applyConfigDefaults, deprecatedProfileIds, normalizeConfig, resolveThinkingProfile };