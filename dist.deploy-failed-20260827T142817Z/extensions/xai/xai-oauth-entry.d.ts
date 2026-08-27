import { C as ProviderAuthMethod } from "../../types-R6eI-mj_.js";
import { i as OAuthCredential } from "../../types-Ct0Osq-j.js";
//#region extensions/xai/xai-oauth-entry.d.ts
declare function createXaiOAuthAuthMethod(): ProviderAuthMethod;
declare function createXaiDeviceCodeAuthMethod(): ProviderAuthMethod;
declare function refreshXaiOAuthCredential(credential: OAuthCredential): Promise<OAuthCredential>;
//#endregion
export { createXaiDeviceCodeAuthMethod, createXaiOAuthAuthMethod, refreshXaiOAuthCredential };