import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { w as resolveStateDir } from "./paths-BBSTUjD5.js";
import "./agent-scope-DigoIwHb.js";
import { n as normalizeAgentId } from "./agent-id-CeT3w4ap.js";
import { C as tryResolveLegacyCompatibilityAgentId, S as tryResolveDefaultAgentId, r as listAgentEntries } from "./agent-scope-config-CUBiGmG3.js";
import { u as normalizeMainKey } from "./session-key-Dbce_H9p.js";
import "./legacy.default-agent-owner-CL_-T11Y.js";
import { n as SYSTEM_AGENT_ROSTER_ENTRIES } from "./agent-id-DC26pYcR.js";
import fs from "node:fs";
import path from "node:path";
//#region src/gateway/agent-list.ts
const OWNER_ROSTER_ENTRIES = SYSTEM_AGENT_ROSTER_ENTRIES;
function listExistingAgentIdsFromDisk() {
	const agentsDir = path.join(resolveStateDir(), "agents");
	try {
		return fs.readdirSync(agentsDir, { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => normalizeAgentId(entry.name)).filter(Boolean);
	} catch {
		return [];
	}
}
function resolveGatewayAgentSelectionState(cfg) {
	const configuredIds = listAgentEntries(cfg).map((entry) => normalizeAgentId(entry.id));
	const soleAgentId = tryResolveDefaultAgentId(cfg);
	if (soleAgentId) return {
		defaultId: normalizeAgentId(soleAgentId),
		ownership: "sole",
		selectionRequired: false
	};
	const legacyAgentId = tryResolveLegacyCompatibilityAgentId(cfg);
	const legacyCompatibleId = legacyAgentId ?? configuredIds[0];
	if (!legacyCompatibleId) throw new Error("Cannot project gateway agent ownership without a configured agent.");
	return {
		defaultId: normalizeAgentId(legacyCompatibleId),
		ownership: legacyAgentId ? "legacy" : "explicit",
		selectionRequired: !legacyAgentId
	};
}
/** Lists gateway-visible agents with canonical membership, ordering, and semantic kind. */
function listGatewayAgentsBasic(cfg) {
	const ownerEntries = new Map(OWNER_ROSTER_ENTRIES.map((entry) => [normalizeAgentId(entry.id), entry]));
	const selection = resolveGatewayAgentSelectionState(cfg);
	const defaultId = selection.defaultId;
	const mainKey = normalizeMainKey(cfg.session?.mainKey);
	const scope = cfg.session?.scope ?? "per-sender";
	const configuredById = /* @__PURE__ */ new Map();
	const explicitIds = /* @__PURE__ */ new Set();
	const diskIds = /* @__PURE__ */ new Set();
	const agentIds = /* @__PURE__ */ new Set();
	agentIds.add(normalizeAgentId(defaultId));
	for (const entry of listAgentEntries(cfg)) {
		if (!entry?.id) continue;
		const id = normalizeAgentId(entry.id);
		const configuredName = normalizeOptionalString(entry.name);
		const identityName = normalizeOptionalString(entry.identity?.name);
		configuredById.set(id, { name: configuredName ?? identityName });
		explicitIds.add(id);
		agentIds.add(id);
	}
	for (const id of listExistingAgentIdsFromDisk()) {
		diskIds.add(id);
		agentIds.add(id);
	}
	const allowedIds = explicitIds.size > 0 ? new Set(explicitIds) : null;
	const visibleIds = [...agentIds].filter((id) => !allowedIds || allowedIds.has(id) || diskIds.has(id) && ownerEntries.has(id));
	visibleIds.sort((a, b) => a.localeCompare(b));
	const orderedIds = defaultId && visibleIds.includes(defaultId) ? [defaultId, ...visibleIds.filter((id) => id !== defaultId)] : visibleIds;
	if (mainKey && !orderedIds.includes(mainKey) && (!allowedIds || allowedIds.has(mainKey))) orderedIds.push(mainKey);
	const agents = orderedIds.map((id) => ({
		id,
		kind: !explicitIds.has(id) && diskIds.has(id) ? ownerEntries.get(id)?.kind ?? "agent" : "agent",
		name: configuredById.get(id)?.name
	}));
	return {
		...selection,
		mainKey,
		scope,
		agents
	};
}
//#endregion
export { resolveGatewayAgentSelectionState as n, listGatewayAgentsBasic as t };
