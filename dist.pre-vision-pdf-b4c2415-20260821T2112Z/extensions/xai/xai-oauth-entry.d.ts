import { C as ProviderAuthMethod } from "../../types-CbXjz50O.js";
import { i as OAuthCredential } from "../../types-DNsozq2A.js";
//#region extensions/xai/xai-oauth-entry.d.ts
declare function createXaiOAuthAuthMethod(): ProviderAuthMethod;
declare function createXaiDeviceCodeAuthMethod(): ProviderAuthMethod;
declare function refreshXaiOAuthCredential(credential: OAuthCredential): Promise<OAuthCredential>;
//#endregion
export { createXaiDeviceCodeAuthMethod, createXaiOAuthAuthMethod, refreshXaiOAuthCredential };