import { E as ProviderAuthContext, O as ProviderAuthResult } from "../../runtime-api-B8urSeFb.js";
import { i as OAuthCredential } from "../../types-CTMT6fqi.js";
import "../../provider-auth-D67Fy80c.js";
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