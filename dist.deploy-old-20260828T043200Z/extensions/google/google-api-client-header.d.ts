import { i as ProviderRequestTransport, r as ProviderRequestCapability } from "../../provider-request-config-BAddg9J0.js";
import "../../provider-http-CyNYsG6w.js";
//#region extensions/google/google-api-client-header.d.ts
declare function resolveGoogleApiClientHeaders(params?: {
  api?: string;
  baseUrl?: string;
  capability?: ProviderRequestCapability;
  transport?: ProviderRequestTransport;
}): Record<string, string>;
//#endregion
export { resolveGoogleApiClientHeaders };