import "./index-CbLguB1A.js";
import { n as OpenClawConfig } from "./types.openclaw-DckSqIPo.js";
import { n as SecretRef, t as SecretInput } from "./types.secrets-ktKWXaKr.js";
import { Oi as SecretInputMode } from "./types-DP7cDwEi.js";
//#region src/plugins/provider-auth-helpers.d.ts
type ApiKeyStorageOptions = {
  secretInputMode?: SecretInputMode;
  config?: OpenClawConfig;
};
declare function buildApiKeyCredential(provider: string, input: SecretInput, metadata?: Record<string, string>, options?: ApiKeyStorageOptions): {
  type: "api_key";
  provider: string;
  key?: string;
  keyRef?: SecretRef;
  metadata?: Record<string, string>;
};
declare function upsertApiKeyProfile(params: {
  provider: string;
  input: SecretInput;
  agentDir?: string;
  options?: ApiKeyStorageOptions;
  profileId?: string;
  metadata?: Record<string, string>;
}): string;
declare function applyAuthProfileConfig(cfg: OpenClawConfig, params: {
  profileId: string;
  provider: string;
  mode: "api_key" | "aws-sdk" | "oauth" | "token";
  email?: string;
  displayName?: string;
  preferProfileFirst?: boolean;
}): OpenClawConfig;
/**
 * Drops a profile from `auth.profiles`, every `auth.order` list, and provider-entry
 * `apiKey` references. An emptied provider order is deleted rather than left as
 * `[]`, because an authored empty order is a hard "select no profiles" instruction.
 */
declare function removeAuthProfileConfig(cfg: OpenClawConfig, profileId: string): OpenClawConfig;
//#endregion
export { upsertApiKeyProfile as a, removeAuthProfileConfig as i, applyAuthProfileConfig as n, buildApiKeyCredential as r, ApiKeyStorageOptions as t };