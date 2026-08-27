import { D as ProviderAuthMethod } from "../../runtime-api-IAhSVA75.js";
import { i as OAuthCredential } from "../../types-CMmxXHFm.js";
import "../../provider-auth-DGP_kfRF.js";
//#region extensions/xai/xai-oauth-entry.d.ts
declare function createXaiOAuthAuthMethod(): ProviderAuthMethod;
declare function createXaiDeviceCodeAuthMethod(): ProviderAuthMethod;
declare function refreshXaiOAuthCredential(credential: OAuthCredential): Promise<OAuthCredential>;
//#endregion
export { createXaiDeviceCodeAuthMethod, createXaiOAuthAuthMethod, refreshXaiOAuthCredential };