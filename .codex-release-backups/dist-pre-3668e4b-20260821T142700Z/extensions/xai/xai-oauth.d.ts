import { S as ProviderAuthContext, w as ProviderAuthResult } from "../../types-CbXjz50O.js";
import { i as OAuthCredential } from "../../types-DNsozq2A.js";
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