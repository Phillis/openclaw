import { i as fetchConfiguredLocalOriginWithSsrFGuard } from "../fetch-guard-0-SfluKG.js";

//#region src/infra/net/proxy/proxy-lifecycle.d.ts
/**
 * Carve out the operator-managed external proxy for the Browser plugin's
 * loopback CDP probe to a Chromium instance OpenClaw spawned itself.
 *
 * The managed proxy installs a process-wide undici dispatcher that would
 * otherwise route `http://127.0.0.1:<cdpPort>/json/version` and the
 * `ws://127.0.0.1:<cdpPort>/devtools/...` upgrade through the external
 * forward proxy, which returns 502 because nothing on the proxy listens for
 * the loopback CDP port. The bypass restores direct loopback delivery for
 * the duration the caller holds the returned `unregister` callback.
 *
 * Loopback-gated by structure: non-loopback authorities (e.g. an `attachOnly`
 * profile pointing at a remote CDP service like Browserless/Browserbase) are
 * not bypassed and continue to traverse the external proxy as configured.
 *
 * Honors `proxy.loopbackMode`:
 * - `gateway-only` (default): register the bypass.
 * - `proxy`: do not bypass — operator opted into proxy-everything routing.
 * - `block`: throw — operator forbids loopback IPC under managed proxy.
 *
 * Note: A loopback `attachOnly` profile whose `cdpUrl` is e.g.
 * `http://127.0.0.1:<port>` would also satisfy this gate. This mirrors the
 * structural semantics of `registerManagedProxyGatewayLoopbackBypass` —
 * loopback IPC on this host is assumed to be operator-trusted.
 */
declare function registerManagedProxyBrowserCdpBypass(url: string): (() => void) | undefined;
//#endregion
export { fetchConfiguredLocalOriginWithSsrFGuard, registerManagedProxyBrowserCdpBypass };