import { n as PinnedDispatcherPolicy, o as createPinnedLookup } from "../ssrf-DMQl3JA2.js";
import { o as withTrustedEnvProxyGuardedFetchMode } from "../fetch-guard-0-SfluKG.js";
import { a as resolveEnvHttpProxyUrl, i as resolveEnvHttpProxyAgentOptions, n as hasEnvHttpProxyConfigured, o as shouldUseEnvHttpProxyForUrl, r as matchesNoProxy, t as hasEnvHttpProxyAgentConfigured } from "../proxy-env-MXKaepi-.js";
import { Agent, AgentOptions } from "node:http";
import { AgentOptions as AgentOptions$1 } from "node:https";

//#region src/infra/net/undici-runtime.d.ts
/** Runtime-loaded undici constructors/functions used where static imports would affect globals. */
type UndiciRuntimeDeps = {
  Agent: typeof import("undici").Agent;
  EnvHttpProxyAgent: typeof import("undici").EnvHttpProxyAgent;
  FormData?: typeof import("undici").FormData;
  ProxyAgent: typeof import("undici").ProxyAgent;
  fetch: typeof import("undici").fetch;
};
type UndiciEnvHttpProxyAgentOptions = ConstructorParameters<UndiciRuntimeDeps["EnvHttpProxyAgent"]>[0];
type UndiciProxyAgentOptions = ConstructorParameters<UndiciRuntimeDeps["ProxyAgent"]>[0];
/** Loads undici lazily, allowing tests to inject constructors without global side effects. */
/**
 * Creates an EnvHttpProxyAgent with OpenClaw proxy TLS, IP-safe proxy pools,
 * timeout propagation, and HTTP/1-only dispatch.
 */
declare function createHttp1EnvHttpProxyAgent(options?: UndiciEnvHttpProxyAgentOptions, timeoutMs?: number): import("undici").EnvHttpProxyAgent;
/**
 * Creates a fixed ProxyAgent with the same HTTP/1, managed TLS, timeout, and
 * IP-safe proxy connection policy used by env proxy dispatchers.
 */
declare function createHttp1ProxyAgent(options: UndiciProxyAgentOptions, timeoutMs?: number): import("undici").ProxyAgent;
//#endregion
//#region src/infra/fetch.d.ts
/**
 * Wraps fetch so Node-compatible duplex bodies, normalized headers, and foreign
 * AbortSignal implementations work against runtimes expecting native signals.
 */
declare function wrapFetchWithAbortSignal(fetchImpl: typeof fetch): typeof fetch;
/** Resolves an optional fetch implementation, wrapping it when fetch is available. */
declare function resolveFetch(fetchImpl?: typeof fetch): typeof fetch | undefined;
//#endregion
//#region src/infra/net/proxy/proxy-tls.d.ts
/** TLS trust material passed to proxy clients for OpenClaw-managed HTTPS proxies. */
type ManagedProxyTlsOptions = Readonly<{
  ca?: string;
}>;
//#endregion
//#region src/infra/net/proxy/active-managed-proxy-tls.d.ts
type ManagedProxyTlsEnv$1 = NodeJS.ProcessEnv;
type ResolveActiveManagedProxyTlsOptionsParams = {
  proxyUrl?: string;
  env?: ManagedProxyTlsEnv$1;
};
/** Resolves managed proxy TLS trust only when the target proxy is OpenClaw's active proxy. */
declare function resolveActiveManagedProxyTlsOptions(params?: ResolveActiveManagedProxyTlsOptionsParams): ManagedProxyTlsOptions | undefined;
//#endregion
//#region src/infra/net/proxy/managed-proxy-undici.d.ts
type ManagedProxyTlsEnv = NodeJS.ProcessEnv;
type AddActiveManagedProxyTlsOptionsParams = {
  env?: ManagedProxyTlsEnv;
};
/** Adds active managed proxy TLS options to env proxy agent options. */
declare function addActiveManagedProxyTlsOptions(options: undefined, params?: AddActiveManagedProxyTlsOptionsParams): {
  proxyTls: ManagedProxyTlsOptions;
} | undefined;
/** Adds active managed proxy TLS options to explicit proxy agent options. */
declare function addActiveManagedProxyTlsOptions<TOptions extends object>(options: TOptions, params?: AddActiveManagedProxyTlsOptionsParams): TOptions | (TOptions & {
  proxyTls: Record<string, unknown>;
});
declare function addActiveManagedProxyTlsOptions<TOptions extends object>(options: TOptions | undefined, params?: AddActiveManagedProxyTlsOptionsParams): TOptions | (TOptions & {
  proxyTls: Record<string, unknown>;
}) | {
  proxyTls: ManagedProxyTlsOptions;
} | undefined;
//#endregion
//#region src/infra/net/node-proxy-agent.d.ts
type NodeProxyProtocol = "http" | "https";
type NodeProxyAgentOptions = AgentOptions & AgentOptions$1;
/** Selects either ambient env proxy resolution or a caller-supplied fixed proxy URL. */
type CreateNodeProxyAgentOptions = {
  mode: "env";
  targetUrl: string | URL;
  protocol?: NodeProxyProtocol;
  agentOptions?: NodeProxyAgentOptions;
} | {
  mode: "explicit";
  proxyUrl: string | URL;
  protocol?: NodeProxyProtocol;
  agentOptions?: NodeProxyAgentOptions;
};
/** Creates a Node HTTP(S) agent for explicit proxy URLs; unsupported protocols throw. */
declare function createNodeProxyAgent(options: Extract<CreateNodeProxyAgentOptions, {
  mode: "explicit";
}>): Agent;
/** Creates a Node HTTP(S) agent from env proxy settings, or undefined when bypassed. */
declare function createNodeProxyAgent(options: Extract<CreateNodeProxyAgentOptions, {
  mode: "env";
}>): Agent | undefined;
//#endregion
//#region src/infra/net/proxy-fetch.d.ts
/**
 * Create a fetch function that routes requests through the given HTTP proxy.
 * Uses undici's ProxyAgent under the hood.
 */
declare function makeProxyFetch(proxyUrl: string): typeof fetch;
/** Return the explicit proxy URL attached by {@link makeProxyFetch}, if present. */
declare function getProxyUrlFromFetch(fetchImpl?: typeof fetch): string | undefined;
//#endregion
//#region src/plugin-sdk/fetch-runtime.d.ts
declare function responseWithRelease(response: Response, release: () => Promise<void>): Response;
//#endregion
export { type CreateNodeProxyAgentOptions, type PinnedDispatcherPolicy, addActiveManagedProxyTlsOptions, createHttp1EnvHttpProxyAgent, createHttp1ProxyAgent, createNodeProxyAgent, createPinnedLookup, getProxyUrlFromFetch, hasEnvHttpProxyAgentConfigured, hasEnvHttpProxyConfigured, makeProxyFetch, matchesNoProxy, resolveActiveManagedProxyTlsOptions, resolveEnvHttpProxyAgentOptions, resolveEnvHttpProxyUrl, resolveFetch, responseWithRelease, shouldUseEnvHttpProxyForUrl, withTrustedEnvProxyGuardedFetchMode, wrapFetchWithAbortSignal };