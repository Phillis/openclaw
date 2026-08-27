import { n as OpenClawConfig } from "../../types.openclaw-DRR8P0H2.js";
import "../../provider-onboard-cxNMThub.js";
//#region extensions/xai/onboard.d.ts
declare const XAI_DEFAULT_MODEL_REF = "xai/grok-4.3";
declare const XAI_OAUTH_DEFAULT_MODEL_REF = "xai/auto";
declare function applyXaiProviderConfig(cfg: OpenClawConfig): OpenClawConfig;
declare function applyXaiConfig(cfg: OpenClawConfig): OpenClawConfig;
declare function applyXaiOAuthConfig(cfg: OpenClawConfig): OpenClawConfig;
//#endregion
export { XAI_DEFAULT_MODEL_REF, XAI_OAUTH_DEFAULT_MODEL_REF, applyXaiConfig, applyXaiOAuthConfig, applyXaiProviderConfig };