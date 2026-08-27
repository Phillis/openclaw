import { l as movePathToTrash$1 } from "./fs-safe-C9N8pCh1.js";
import { t as CONFIG_DIR } from "./utils-DEqefz4f.js";
import { t as normalizeHostname } from "./hostname-_16721Le.js";
import "./browser-config-B_uQJIyR.js";
import "./config-ChuJBdOZ.js";
import { m as withExactHostnamePolicy, p as isCdpHostnameTrustedByPolicy, x as BrowserProfileUnavailableError } from "./tmp-openclaw-dir-dS-1ArW-.js";
import { r as CHROME_MCP_ENDPOINT_FLAGS } from "./chrome-mcp-contracts-BJ_4MsSp.js";
import { t as getBrowserProfileCapabilities } from "./profile-capabilities-BlUTzZZq.js";
import path from "node:path";
//#region extensions/browser/src/browser/cdp-reachability-policy.ts
const cdpControlSourcePolicyByScopedPolicy = /* @__PURE__ */ new WeakMap();
function withCdpControlHostname(profile, ssrfPolicy, requireAllowlistMatch = false) {
	const cdpHost = normalizeHostname(profile.cdpHost);
	if (!ssrfPolicy || !cdpHost) return ssrfPolicy;
	if (requireAllowlistMatch && !isCdpHostnameTrustedByPolicy(ssrfPolicy, cdpHost)) return ssrfPolicy;
	const scopedPolicy = withExactHostnamePolicy(ssrfPolicy, cdpHost);
	cdpControlSourcePolicyByScopedPolicy.set(scopedPolicy, ssrfPolicy);
	return scopedPolicy;
}
function hasPolicyEntries(values) {
	return (values ?? []).some((value) => value.trim().length > 0);
}
function requiresPinnedChromeMcpCdpTransport(cdpPolicy) {
	if (!cdpPolicy) return false;
	const policyIntent = cdpControlSourcePolicyByScopedPolicy.get(cdpPolicy) ?? cdpPolicy;
	return !(!(policyIntent.allowRfc2544BenchmarkRange === true || policyIntent.allowIpv6UniqueLocalRange === true || hasPolicyEntries(policyIntent.allowedHostnames) || hasPolicyEntries(policyIntent.hostnameAllowlist) || hasPolicyEntries(policyIntent.allowedOrigins)) && (policyIntent.dangerouslyAllowPrivateNetwork === true || policyIntent.allowPrivateNetwork === true));
}
function hasChromeMcpEndpointArg(args) {
	return (args ?? []).some((arg) => {
		const [name] = arg.split("=", 1);
		return CHROME_MCP_ENDPOINT_FLAGS.has(name ?? arg);
	});
}
function resolveCdpReachabilityPolicy(profile, ssrfPolicy) {
	const capabilities = getBrowserProfileCapabilities(profile);
	if (!capabilities.isRemote && profile.cdpIsLoopback && profile.driver === "openclaw") return;
	return withCdpControlHostname(profile, ssrfPolicy, capabilities.isRemote);
}
/** Alias used by callers that treat reachability and control as one CDP policy. */
const resolveCdpControlPolicy = resolveCdpReachabilityPolicy;
function assertChromeMcpCdpTransportAllowed(profile, cdpPolicy) {
	const hasExplicitEndpoint = Boolean(profile.cdpUrl) || hasChromeMcpEndpointArg(profile.mcpArgs);
	if (profile.driver !== "existing-session" || !hasExplicitEndpoint) return;
	if (!requiresPinnedChromeMcpCdpTransport(cdpPolicy)) return;
	throw new BrowserProfileUnavailableError(`Browser profile "${profile.name}" uses Chrome MCP with an explicit CDP endpoint, but the active Browser CDP policy requires OpenClaw to pin the approved endpoint. Chrome MCP cannot carry that pinned transport across its subprocess boundary. Use driver "openclaw" for guarded CDP endpoints, or remove cdpUrl and browserUrl/wsEndpoint mcpArgs from this existing-session profile so Chrome MCP attaches to a host-local Chrome profile.`);
}
//#endregion
//#region extensions/browser/src/browser/trash.ts
/**
* Trash helpers for data under the Browser-owned config subtree.
*/
/** Moves a path to trash only when it lives under allowed Browser roots. */
async function movePathToTrash(targetPath) {
	return await movePathToTrash$1(targetPath, { allowedRoots: [path.join(CONFIG_DIR, "browser")] });
}
//#endregion
export { resolveCdpReachabilityPolicy as i, assertChromeMcpCdpTransportAllowed as n, resolveCdpControlPolicy as r, movePathToTrash as t };
