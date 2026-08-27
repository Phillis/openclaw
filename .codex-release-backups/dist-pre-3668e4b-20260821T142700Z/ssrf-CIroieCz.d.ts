import { LookupAddress, lookup } from "node:dns";
import { Dispatcher } from "undici";

//#region src/infra/net/ssrf.d.ts
type LookupFn = (hostname: string, options: {
  all: true;
}) => Promise<LookupAddress[]>;
type SsrFPolicy = {
  allowPrivateNetwork?: boolean;
  dangerouslyAllowPrivateNetwork?: boolean;
  allowRfc2544BenchmarkRange?: boolean;
  /**
   * Exempt addresses in `fc00::/7` (IPv6 Unique Local Address block, RFC 4193)
   * from the SSRF private-IP block. Companion to
   * `allowRfc2544BenchmarkRange` for fake-ip proxy stacks (sing-box, Clash,
   * Surge) that resolve foreign domains to ULA addresses alongside the IPv4
   * 198.18.0.0/15 range. See #74351.
   */
  allowIpv6UniqueLocalRange?: boolean;
  allowedHostnames?: string[];
  /**
   * Exact HTTP origins that may promote only the current request hostname into
   * `allowedHostnames`. Evaluated per URL inside the redirect loop.
   */
  allowedOrigins?: string[];
  hostnameAllowlist?: string[];
};
type PinnedHostname = {
  hostname: string;
  addresses: string[];
  lookup: typeof lookup;
};
type PinnedHostnameOverride = {
  hostname: string;
  addresses: string[];
};
type PinnedDispatcherPolicy = {
  mode: "direct";
  connect?: Record<string, unknown>;
  pinnedHostname?: PinnedHostnameOverride;
} | {
  mode: "env-proxy";
  connect?: Record<string, unknown>;
  proxyTls?: Record<string, unknown>;
  pinnedHostname?: PinnedHostnameOverride;
} | {
  mode: "explicit-proxy";
  proxyUrl: string;
  allowPrivateProxy?: boolean;
  proxyTls?: Record<string, unknown>;
  pinnedHostname?: PinnedHostnameOverride;
};
declare function resolvePinnedHostnameWithPolicy(hostname: string, params?: {
  lookupFn?: LookupFn;
  policy?: SsrFPolicy;
}): Promise<PinnedHostname>;
declare function createPinnedDispatcher(pinned: PinnedHostname, policy?: PinnedDispatcherPolicy, ssrfPolicy?: SsrFPolicy, timeoutMs?: number): Dispatcher;
declare function closeDispatcher(dispatcher?: Dispatcher | null): Promise<void>;
//#endregion
export { createPinnedDispatcher as a, closeDispatcher as i, PinnedDispatcherPolicy as n, resolvePinnedHostnameWithPolicy as o, SsrFPolicy as r, LookupFn as t };