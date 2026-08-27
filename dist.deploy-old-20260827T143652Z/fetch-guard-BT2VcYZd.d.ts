import { n as PinnedDispatcherPolicy, r as SsrFPolicy, t as LookupFn } from "./ssrf-C1p3Hf59.js";
import { Dispatcher } from "undici";

//#region src/infra/net/pinned-dispatcher-pool.d.ts
type PinnedDispatcherLease = {
  dispatcher: Dispatcher;
  reused: boolean;
  release: () => Promise<void>;
};
type PinnedDispatcherPoolOptions = {
  maxEntries: number;
  idleTtlMs: number;
};
/**
 * Bounded cache of reusable DNS-pinned dispatchers.
 *
 * Callers must perform fresh DNS and SSRF validation before every acquisition
 * and include the resulting origin, address set, and connection policy in the key.
 */
declare class PinnedDispatcherPool {
  private readonly entries;
  private readonly ownedEntries;
  private readonly maxEntries;
  private readonly idleTtlMs;
  private closed;
  constructor(options: PinnedDispatcherPoolOptions);
  acquire(params: {
    key: string;
    groupKey: string;
    createDispatcher: () => Dispatcher;
  }): PinnedDispatcherLease | undefined;
  closeAll(): Promise<void>;
  private createLease;
  private retireEntry;
  private startClose;
}
//#endregion
//#region src/infra/net/fetch-guard.d.ts
type FetchLike = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
declare const GUARDED_FETCH_MODE: {
  readonly STRICT: "strict";
  readonly TRUSTED_ENV_PROXY: "trusted_env_proxy";
  readonly TRUSTED_EXPLICIT_PROXY: "trusted_explicit_proxy";
};
type GuardedFetchMode = (typeof GUARDED_FETCH_MODE)[keyof typeof GUARDED_FETCH_MODE];
type GuardedFetchOptions = {
  url: string;
  fetchImpl?: FetchLike;
  init?: RequestInit;
  capture?: false | {
    flowId?: string;
    meta?: Record<string, unknown>;
    sensitiveRequestHeaderNames?: readonly string[];
  };
  maxRedirects?: number;
  /**
   * Allow replaying unsafe request methods and bodies across cross-origin redirects.
   * Sensitive cross-origin headers (for example Authorization/Cookie) are still stripped.
   * Defaults to false.
   */
  allowCrossOriginUnsafeRedirectReplay?: boolean;
  timeoutMs?: number;
  signal?: AbortSignal;
  requireHttps?: boolean;
  policy?: SsrFPolicy;
  lookupFn?: LookupFn;
  dispatcherPolicy?: PinnedDispatcherPolicy;
  retainAuthorizationRedirectHostnameAllowlist?: string[];
  mode?: GuardedFetchMode;
  pinDns?: boolean; /** @deprecated use `mode: "trusted_env_proxy"` for trusted/operator-controlled URLs. */
  proxy?: "env";
  /**
   * @deprecated use `mode: "trusted_env_proxy"` instead.
   */
  dangerouslyAllowEnvProxyWithoutPinnedDns?: boolean;
  auditContext?: string; /** Internal opt-in for reusing freshly revalidated, direct pinned dispatchers. */
  dispatcherPool?: PinnedDispatcherPool;
};
type GuardedFetchResult = {
  response: Response;
  finalUrl: string;
  release: () => Promise<void>;
  refreshTimeout?: () => void;
  dispatcherReused?: boolean;
};
declare function fetchWithSsrFGuard(params: GuardedFetchOptions): Promise<GuardedFetchResult>;
//#endregion
export { fetchWithSsrFGuard as t };