import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.js";
import { r as formatErrorMessage } from "./errors-CqPTYU6G.js";
import { t as callGatewayTool } from "./gateway-A68ONVQZ.js";
import { n as resolveNodeIdFromNodeList, t as resolveNodeFromNodeList } from "./node-resolve-D2_WjEZg.js";
import { n as parsePairingList, t as parseNodeList } from "./node-list-parse-B-QeHrg4.js";
//#region src/agents/tools/nodes-utils.ts
/**
* Nodes lookup helpers.
*
* Loads paired nodes from Gateway and resolves requested/default nodes with legacy pair-list fallback.
*/
function messageFromError(error) {
	if (error instanceof Error) return error.message;
	if (typeof error === "string") return error;
	if (typeof error === "object" && error !== null && "message" in error && typeof error.message === "string") return error.message;
	if (typeof error === "object" && error !== null) try {
		return JSON.stringify(error);
	} catch {
		return "";
	}
	return "";
}
function shouldFallbackToPairList(error) {
	const message = normalizeOptionalLowercaseString(messageFromError(error)) ?? "";
	if (!message.includes("node.list")) return false;
	return message.includes("unknown method") || message.includes("method not found") || message.includes("not implemented") || message.includes("unsupported");
}
async function loadNodes(opts, signal) {
	try {
		return parseNodeList(await callGatewayTool("node.list", opts, {}, { signal }));
	} catch (error) {
		if (!shouldFallbackToPairList(error)) throw error;
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
function formatNodeIdList(nodes) {
	return nodes.length > 0 ? nodes.map((node) => node.nodeId).toSorted().join(", ") : "none";
}
/**
* Resolves a capability-gated node from the FULL node list, keeping control off
* the wrong device. An exact node-id match (case-sensitive, then -insensitive to
* mirror display-name matching) is checked against every node first, so an
* ineligible id can never fall through to an eligible node that merely shares its
* display name. Display-name/query resolution runs only among eligible nodes and
* rejects ambiguity. Any tool that filters nodes by capability must resolve
* through here rather than handing a pre-filtered list to {@link resolveNodeIdFromList}.
*/
function resolveEligibleNodeFromList(nodes, query, isEligible, messages) {
	const eligible = nodes.filter(isEligible);
	const trimmed = query?.trim();
	if (trimmed) {
		const eligibleIds = formatNodeIdList(eligible);
		const lowerTrimmed = trimmed.toLowerCase();
		const exactNode = nodes.find((node) => node.nodeId === trimmed) ?? nodes.find((node) => node.nodeId.toLowerCase() === lowerTrimmed);
		if (exactNode) {
			if (!isEligible(exactNode)) throw new Error(messages.ineligibleExact(trimmed, eligibleIds));
			return exactNode;
		}
		try {
			const nodeId = resolveNodeIdFromList(eligible, trimmed, false);
			const match = eligible.find((node) => node.nodeId === nodeId);
			if (match) return match;
		} catch (err) {
			throw new Error(messages.nameResolveFailed(formatErrorMessage(err), eligibleIds), { cause: err });
		}
		throw new Error(`node not found: ${trimmed}`);
	}
	const only = eligible.length === 1 ? eligible.at(0) : void 0;
	if (only) return only;
	if (eligible.length === 0) throw new Error(messages.noneEligible());
	throw new Error(messages.multipleEligible(eligible));
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
export { resolveNodeIdFromList as a, resolveEligibleNodeFromList as i, resolveAgentNode as n, selectDefaultNodeFromList as o, resolveAgentNodeId as r, listNodes as t };
