import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.js";
import { t as GatewayClientRequestError } from "./request-error-DOHu7KKj.js";
import { n as resolveNodeFromNodeList, r as resolveNodeIdFromNodeList } from "./node-resolve-Cxs-SER3.js";
import { t as callGatewayTool } from "./gateway-D8V0DEy4.js";
import { n as parsePairingList, t as parseNodeList } from "./node-list-parse-B-QeHrg4.js";
//#region src/agents/tools/nodes-utils.ts
/**
* Nodes lookup helpers.
*
* Loads paired nodes from Gateway and resolves requested/default nodes with legacy pair-list fallback.
*/
async function loadNodes(opts, signal) {
	try {
		return parseNodeList(await callGatewayTool("node.list", opts, {}, { signal }));
	} catch (error) {
		if (!(error instanceof GatewayClientRequestError) || error.gatewayCode !== "INVALID_REQUEST" || error.retryable || error.message !== "unknown method: node.list" || error.retryAfterMs !== void 0 && (!Number.isInteger(error.retryAfterMs) || error.retryAfterMs < 0)) throw error;
		const { paired } = parsePairingList(await callGatewayTool("node.pair.list", opts, {}, { signal }));
		return paired.map((n) => ({
			nodeId: n.nodeId,
			displayName: n.displayName,
			platform: n.platform,
			remoteIp: n.remoteIp
		}));
	}
}
function isLocalMacNode(node) {
	return normalizeOptionalLowercaseString(node.platform)?.startsWith("mac") === true && typeof node.nodeId === "string" && node.nodeId.startsWith("mac-");
}
function compareNewestTimestamp(a, b) {
	const aValue = Number.isFinite(a) ? a ?? 0 : -1;
	return (Number.isFinite(b) ? b ?? 0 : -1) - aValue;
}
function compareDefaultNodeOrder(a, b, recencyField) {
	const recencyOrder = compareNewestTimestamp(a[recencyField], b[recencyField]);
	if (recencyOrder !== 0) return recencyOrder;
	return a.nodeId.localeCompare(b.nodeId);
}
/** Selects the implicit node target when a tool call omits an explicit node query. */
function selectDefaultNodeFromList(nodes, options = {}) {
	const capability = options.capability?.trim();
	const withCapability = capability ? nodes.filter((n) => Array.isArray(n.caps) ? n.caps.includes(capability) : true) : nodes;
	if (withCapability.length === 0) return null;
	const connected = withCapability.filter((n) => n.connected);
	const candidates = connected.length > 0 ? connected : withCapability;
	if (candidates.length === 1) return candidates.at(0) ?? null;
	if (options.preferLocalMac ?? true) {
		const local = candidates.filter(isLocalMacNode);
		if (local.length === 1) return local.at(0) ?? null;
	}
	if ((options.fallback ?? "none") === "none") return null;
	const recencyField = connected.length > 0 ? "connectedAtMs" : "lastSeenAtMs";
	return [...candidates].toSorted((a, b) => compareDefaultNodeOrder(a, b, recencyField))[0] ?? null;
}
function pickDefaultNode(nodes) {
	return selectDefaultNodeFromList(nodes, {
		capability: "canvas",
		fallback: "first",
		preferLocalMac: true
	});
}
/** Lists Gateway nodes, falling back to paired-node records for older Gateway versions. */
async function listNodes(opts, signal) {
	return loadNodes(opts, signal);
}
/** Resolves a node id from an already-loaded node list using shared node matching rules. */
function resolveNodeIdFromList(nodes, query, allowDefault = false, options = {}) {
	return resolveNodeIdFromNodeList(nodes, query, {
		allowDefault,
		allowCompactDisplayName: options.allowCompactDisplayName,
		pickDefaultNode
	});
}
/** Loads nodes from the Gateway and resolves the requested or default node id. */
async function resolveAgentNodeId(opts, query, allowDefault = false) {
	return (await resolveAgentNode(opts, query, allowDefault)).nodeId;
}
/** Loads nodes from the Gateway and returns the requested or default node record. */
async function resolveAgentNode(opts, query, allowDefault = false) {
	return resolveNodeFromNodeList(await loadNodes(opts), query, {
		allowDefault,
		pickDefaultNode
	});
}
//#endregion
export { selectDefaultNodeFromList as a, resolveNodeIdFromList as i, resolveAgentNode as n, resolveAgentNodeId as r, listNodes as t };
