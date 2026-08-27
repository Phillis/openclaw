import { r as formatErrorMessage } from "./errors-CqPTYU6G.js";
import "./agent-scope-D9GLFAyB.js";
import { n as normalizeAgentId } from "./agent-id-Db0rqw_J.js";
import { a as listAgentIds, p as resolveDefaultAgentId, t as AgentSelectionRequiredError } from "./agent-scope-config-CsnnOL14.js";
import { t as ErrorCodes } from "./gateway-error-details-BWo6Le6w.js";
import { s as errorShape } from "./error-codes-CMSvT5-d.js";
import { t as resolveMemorySearchStaleness } from "./types-Dpy5yVLQ.js";
import { i as getActiveMemorySearchManagerCore } from "./memory-runtime-CVV4sSeL.js";
//#region src/gateway/server-methods/memory-search.ts
const DEFAULT_MAX_RESULTS = 20;
const MAX_RESULTS = 50;
function resolveSearchMode(status) {
	const statusMode = status.custom?.searchMode;
	if (statusMode === "hybrid" || statusMode === "fts-only") return statusMode;
	return status.provider === "none" || status.vector?.enabled === false ? "fts-only" : "hybrid";
}
function resolveSearchOptions(params) {
	const rawMaxResults = params.maxResults;
	if (rawMaxResults !== void 0 && (typeof rawMaxResults !== "number" || !Number.isFinite(rawMaxResults))) return null;
	const maxResults = Math.min(MAX_RESULTS, Math.max(1, Math.floor(rawMaxResults ?? DEFAULT_MAX_RESULTS)));
	const rawMinScore = params.minScore;
	if (rawMinScore !== void 0 && (typeof rawMinScore !== "number" || !Number.isFinite(rawMinScore))) return null;
	return {
		maxResults,
		...rawMinScore === void 0 ? {} : { minScore: rawMinScore }
	};
}
function hasUsableAgentIdInput(value) {
	return normalizeAgentId(`${value}a`) !== "a";
}
/** Operator-scoped search over the active agent memory index. */
const memorySearchHandlers = { "memory.search": async ({ params, respond, context }) => {
	const record = params && typeof params === "object" ? params : {};
	const query = typeof record.query === "string" ? record.query.trim() : "";
	if (!query) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "query must be a non-empty string"));
		return;
	}
	const searchOptions = resolveSearchOptions(record);
	if (!searchOptions) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "maxResults and minScore must be finite numbers when provided"));
		return;
	}
	const cfg = context.getRuntimeConfig();
	const hasAgentId = Object.hasOwn(record, "agentId");
	if (hasAgentId && typeof record.agentId !== "string") {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "agentId must be a string"));
		return;
	}
	if (hasAgentId && !hasUsableAgentIdInput(record.agentId)) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "unknown agentId"));
		return;
	}
	const requestedAgentId = hasAgentId ? normalizeAgentId(record.agentId) : null;
	if (requestedAgentId !== null && !listAgentIds(cfg).includes(requestedAgentId)) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "unknown agentId"));
		return;
	}
	let agentId = requestedAgentId;
	if (!agentId) try {
		agentId = resolveDefaultAgentId(cfg, {
			surface: "memory search",
			hint: "Pass agentId to select a configured agent."
		});
	} catch (error) {
		if (!(error instanceof AgentSelectionRequiredError)) throw error;
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, error.message));
		return;
	}
	let acquired;
	try {
		acquired = await getActiveMemorySearchManagerCore({
			cfg,
			agentId,
			purpose: "cli"
		});
	} catch (error) {
		respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, `memory search unavailable: ${formatErrorMessage(error)}`));
		return;
	}
	const { manager, error: acquireError } = acquired;
	if (!manager) {
		respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, acquireError ?? "memory search unavailable"));
		return;
	}
	try {
		const results = await manager.search(query, searchOptions);
		const status = manager.status();
		respond(true, {
			agentId,
			provider: status.provider,
			searchMode: resolveSearchMode(status),
			results,
			...resolveMemorySearchStaleness(status, agentId)
		}, void 0);
	} catch (error) {
		respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, `memory search failed: ${formatErrorMessage(error)}`));
	} finally {
		await manager.close?.().catch(() => {});
	}
} };
//#endregion
export { memorySearchHandlers };
