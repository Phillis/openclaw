import { E as ProviderAuthContext, O as ProviderAuthResult } from "../../runtime-api-IAhSVA75.js";
import { i as OAuthCredential } from "../../types-CMmxXHFm.js";
import "../../provider-auth-DGP_kfRF.js";
//#region extensions/xai/xai-oauth.d.ts
type XaiOAuthFetchOptions = {
  fetchImpl?: typeof fetch;
  now?: () => number;
  signal?: AbortSignal;
};
declare function loginXaiDeviceCode(ctx: ProviderAuthContext): Promise<ProviderAuthResult>;
declare function refreshXaiOAuthCredential(credential: OAuthCredential, options?: XaiOAuthFetchOptions): Promise<OAuthCredential>;
//#endregion
export { loginXaiDeviceCode, refreshXaiOAuthCredential };