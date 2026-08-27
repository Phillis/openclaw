import { x as resolvePersistedSessionStoreOwnerForKey } from "./agent-scope-DigoIwHb.js";
import { C as tryResolveLegacyCompatibilityAgentId } from "./agent-scope-config-CUBiGmG3.js";
import { c as parseAgentSessionKey } from "./session-key-utils-Di3FvABa.js";
import "./legacy.default-agent-owner-CL_-T11Y.js";
//#region src/agents/subagent-requester-owner.ts
/** Resolves the durable requester owner for legacy rows that predate requesterAgentId. */
function resolveSubagentRequesterAgentId(cfg, entry) {
	if (entry.requesterAgentId) return entry.requesterAgentId;
	const parsedAgentId = parseAgentSessionKey(entry.requesterSessionKey)?.agentId;
	if (parsedAgentId) return parsedAgentId;
	const persisted = resolvePersistedSessionStoreOwnerForKey(cfg, entry.requesterSessionKey);
	return persisted.kind === "configured" ? persisted.agentId : persisted.kind === "none" ? tryResolveLegacyCompatibilityAgentId(cfg) : void 0;
}
/** Materializes the compatibility owner once so every registry selector sees the same tuple. */
function backfillSubagentRequesterAgentIds(cfg, entries) {
	let changed = 0;
	for (const entry of entries) {
		if (entry.requesterAgentId) continue;
		const requesterAgentId = resolveSubagentRequesterAgentId(cfg, entry);
		if (!requesterAgentId) continue;
		entry.requesterAgentId = requesterAgentId;
		changed += 1;
	}
	return changed;
}
//#endregion
export { resolveSubagentRequesterAgentId as n, backfillSubagentRequesterAgentIds as t };
