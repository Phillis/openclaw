import { r as asNullableRecord } from "./record-coerce-DItp3I4t.js";
import { n as withOpenClawStateLease } from "./openclaw-state-lease-DRTqyY7R.js";
import { n as resolveMcpTransportConfig } from "./mcp-transport-config-CZdVn5YO.js";
import { p as operatorMcpOAuthIdentity } from "./mcp-oauth-store--87F5Wew.js";
import { n as clearMcpOAuthRequesters, r as clearMcpOAuthServer } from "./mcp-oauth-inLDZQye.js";
import { n as mcpConfigInternal } from "./mcp-config-De1SycU1.js";
//#region src/agents/mcp-lifecycle-lease.ts
const MCP_LIFECYCLE_LEASE_SCOPE = "core:claw-mcp-lifecycle";
const MCP_LIFECYCLE_LEASE_MS = 5 * 6e4;
const MCP_LIFECYCLE_WAIT_MS = 10 * 6e4;
/** Serialize ownership decisions and global config mutations for one MCP server. */
async function withMcpLifecycleLease(name, options, run) {
	return await withOpenClawStateLease({
		scope: MCP_LIFECYCLE_LEASE_SCOPE,
		key: name.trim(),
		database: {
			scope: "shared",
			options: {
				...options.env ? { env: options.env } : {},
				...options.path ? { path: options.path } : {},
				...options.database ? { database: options.database } : {}
			}
		},
		leaseMs: MCP_LIFECYCLE_LEASE_MS,
		waitMs: MCP_LIFECYCLE_WAIT_MS,
		...options.signal ? { signal: options.signal } : {},
		leaseLabel: "Claw MCP lifecycle lease",
		operationLabel: "claws.mcp.lifecycle.lease"
	}, async (lease) => {
		lease.assertOwned();
		const result = await run();
		lease.assertOwned();
		return result;
	});
}
const withClawMcpLifecycleLease = withMcpLifecycleLease;
//#endregion
//#region src/agents/mcp-config-mutation.ts
/** Canonical configured-MCP mutations with OAuth credential lifecycle cleanup. */
function hasOAuthAuth(server) {
	return asNullableRecord(server)?.auth === "oauth";
}
function hasRequesterIdentity(server) {
	return hasOAuthAuth(server) && asNullableRecord(asNullableRecord(server)?.oauth)?.identity === "per-requester";
}
async function clearReplacedMcpOAuth(mutation) {
	if (!hasOAuthAuth(mutation.previous)) return;
	const previous = resolveMcpTransportConfig(mutation.name, mutation.previous);
	if (previous?.kind !== "http") return;
	const next = hasOAuthAuth(mutation.next) ? resolveMcpTransportConfig(mutation.name, mutation.next) : void 0;
	if (next?.kind === "http" && next.url === previous.url) {
		const wasRequester = hasRequesterIdentity(mutation.previous);
		if (wasRequester === hasRequesterIdentity(mutation.next)) return;
		if (wasRequester) {
			await clearMcpOAuthRequesters(operatorMcpOAuthIdentity(mutation.name, previous.url));
			return;
		}
	}
	await clearMcpOAuthServer(operatorMcpOAuthIdentity(mutation.name, previous.url));
}
async function withMcpOwnershipCoordination(params, run) {
	const name = params.name.trim();
	if (!name || params.recordIndependentOwner === false) return run();
	return withMcpLifecycleLease(name, {}, run);
}
function setConfiguredMcpServer(params) {
	return withMcpOwnershipCoordination(params, () => mcpConfigInternal.set(params, clearReplacedMcpOAuth));
}
function unsetConfiguredMcpServer(params) {
	return withMcpOwnershipCoordination(params, () => mcpConfigInternal.unset(params, clearReplacedMcpOAuth));
}
function updateConfiguredMcpServer(params) {
	return withMcpOwnershipCoordination(params, () => mcpConfigInternal.update(params, clearReplacedMcpOAuth));
}
function updateConfiguredMcpServerTools(params) {
	return withMcpOwnershipCoordination(params, () => mcpConfigInternal.updateTools(params, clearReplacedMcpOAuth));
}
//#endregion
export { withClawMcpLifecycleLease as a, updateConfiguredMcpServerTools as i, unsetConfiguredMcpServer as n, updateConfiguredMcpServer as r, setConfiguredMcpServer as t };
