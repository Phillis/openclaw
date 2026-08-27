import { D as ProviderAuthMethod } from "../../runtime-api-B8urSeFb.js";
import { i as OAuthCredential } from "../../types-CTMT6fqi.js";
import "../../provider-auth-D67Fy80c.js";
//#region extensions/xai/xai-oauth-entry.d.ts
declare function createXaiOAuthAuthMethod(): ProviderAuthMethod;
declare function createXaiDeviceCodeAuthMethod(): ProviderAuthMethod;
declare function refreshXaiOAuthCredential(credential: OAuthCredential): Promise<OAuthCredential>;
//#endregion
export { createXaiDeviceCodeAuthMethod, createXaiOAuthAuthMethod, refreshXaiOAuthCredential };