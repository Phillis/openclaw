import { i as ProviderRequestTransport, r as ProviderRequestCapability } from "../../provider-request-config-B67tGHJd.js";
import "../../provider-http-BQ0nquFZ.js";
//#region extensions/google/google-api-client-header.d.ts
declare function resolveGoogleApiClientHeaders(params?: {
  api?: string;
  baseUrl?: string;
  capability?: ProviderRequestCapability;
  transport?: ProviderRequestTransport;
}): Record<string, string>;
//#endregion
export { resolveGoogleApiClientHeaders };