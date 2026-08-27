import "./types-Sg3pk96c.js";
import "./types-cxNMThub.js";
import "./plugin-metadata-snapshot.types-BygsCokS.js";
import "./ssrf-DvMBKwmI.js";
//#region src/agents/provider-attribution.d.ts
/** Transport family used when resolving provider-specific request policy. */
type ProviderRequestTransport = "stream" | "websocket" | "http" | "media-understanding";
/** Capability family used when endpoint rules differ by media or LLM request type. */
type ProviderRequestCapability = "llm" | "audio" | "image" | "video" | "other";
//#endregion
//#region src/agents/provider-request-config.d.ts
/** Auth override accepted from sanitized provider/model request config. */
type ProviderRequestAuthOverride = {
  mode: "provider-default";
} | {
  mode: "authorization-bearer";
  token: string;
} | {
  mode: "header";
  headerName: string;
  value: string;
  prefix?: string;
};
/** TLS override accepted from sanitized provider/model request config. */
type ProviderRequestTlsOverride = {
  ca?: string;
  cert?: string;
  key?: string;
  passphrase?: string;
  serverName?: string;
  insecureSkipVerify?: boolean;
};
/** Proxy override accepted from sanitized provider/model request config. */
type ProviderRequestProxyOverride = {
  mode: "env-proxy";
  tls?: ProviderRequestTlsOverride;
} | {
  mode: "explicit-proxy";
  url: string;
  tls?: ProviderRequestTlsOverride;
};
/** Transport override block shared by provider and model request config. */
type ProviderRequestTransportOverrides = {
  headers?: Record<string, string>;
  auth?: ProviderRequestAuthOverride;
  proxy?: ProviderRequestProxyOverride;
  tls?: ProviderRequestTlsOverride;
};
/** Model-scoped transport overrides, including private-network policy. */
type ModelProviderRequestTransportOverrides = ProviderRequestTransportOverrides & {
  allowPrivateNetwork?: boolean;
};
//#endregion
export { ProviderRequestCapability as n, ProviderRequestTransport as r, ModelProviderRequestTransportOverrides as t };