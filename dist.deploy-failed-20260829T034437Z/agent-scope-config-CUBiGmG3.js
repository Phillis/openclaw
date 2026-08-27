import { g as readStringValue, l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { c as resolveUserPath } from "./home-dir-BFvskzn8.js";
import "./utils-Bw16L5tB.js";
import { w as resolveStateDir } from "./paths-BBSTUjD5.js";
import { t as formatCliCommand } from "./command-format-HwSAdvXB.js";
import { n as normalizeAgentId } from "./agent-id-CeT3w4ap.js";
import { r as LEGACY_IMPLICIT_AGENT_ID } from "./session-key-Dbce_H9p.js";
import { r as registerResolvedAgentDir } from "./agent-dir-registry-CEecLw_T.js";
import { n as resolveDefaultAgentWorkspaceDir } from "./workspace-default-DNxmF3kK.js";
import path from "node:path";
//#region src/config/legacy.default-agent-owner-state.ts
const legacyDefaultAgentIdByConfig = /* @__PURE__ */ new WeakMap();
function setRetainedLegacyDefaultAgentId(config, agentId) {
	if (agentId) legacyDefaultAgentIdByConfig.set(config, agentId);
	else legacyDefaultAgentIdByConfig.delete(config);
}
function getRetainedLegacyDefaultAgentId(config) {
	return legacyDefaultAgentIdByConfig.get(config);
}
//#endregion
//#region src/config/model-policy-allowlist-migration.ts
const MODEL_POLICY_ALLOWLIST_MIGRATION_MARKER = "modelPolicyAllowlist";
function hasModelPolicyAllowlistMigrationMarker(value) {
	if (isRecord(value) && isRecord(value.meta) && isRecord(value.meta.migrations) && value.meta.migrations["modelPolicyAllowlist"] === true) return true;
	return false;
}
/** Any policy object opts into the explicit model-policy semantics. */
function isExplicitModelPolicy(value) {
	return isRecord(value);
}
/** A per-agent policy replaces inherited defaults only when it owns `allow`. */
function hasExplicitModelPolicyAllow(value) {
	return isExplicitModelPolicy(value) && Object.hasOwn(value, "allow");
}
function computeModelPolicyAllowlist(params) {
	if (hasModelPolicyAllowlistMigrationMarker(params.root)) return null;
	return collectLegacyDefaultModelAllowRefs(params.defaults);
}
function collectLegacyDefaultModelAllowRefs(defaults) {
	if (!isRecord(defaults)) return null;
	if (isExplicitModelPolicy(defaults.modelPolicy)) return null;
	if (!isRecord(defaults.models)) return null;
	const refs = Object.keys(defaults.models).filter((key) => key.trim().length > 0);
	return refs.length > 0 ? refs : null;
}
//#endregion
//#region src/agents/agent-scope-config.ts
/** Resolves configured agent ids, directories, workspaces, and merged agent defaults. */
var AgentSelectionRequiredError = class extends Error {
	constructor(agentIds, context) {
		const surface = context?.surface ?? "this operation";
		const hint = context?.hint ?? "Select an agent explicitly; CLI callers can pass --agent <id>, channels can add a binding, and ambient services can set their agentId target.";
		super(`Multiple agents are configured, but ${surface} has no explicit owner. ${hint}`);
		this.code = "AGENT_SELECTION_REQUIRED";
		this.name = "AgentSelectionRequiredError";
		this.agentIds = agentIds;
		this.surface = surface;
		this.hint = hint;
	}
};
/** Strip null bytes from paths to prevent ENOTDIR errors. */
function stripNullBytes(s) {
	return s.replaceAll("\0", "");
}
/** Lists valid configured agent entries from config. */
function listAgentEntriesWithSource(cfg) {
	const roster = readAgentRosterProperty(cfg);
	if (roster?.kind === "entries" && isRecord(roster.value)) return Object.entries(roster.value).flatMap(([id, entry]) => isRecord(entry) ? [{
		entry: {
			...entry,
			id
		},
		source: {
			kind: "entries",
			key: id
		}
	}] : []);
	if (roster?.kind !== "list" || !Array.isArray(roster.value)) return [];
	return roster.value.flatMap((entry, index) => entry !== null && typeof entry === "object" ? [{
		entry,
		source: {
			kind: "list",
			index
		}
	}] : []);
}
/** Lists valid configured agent entries from either supported representation. */
function listAgentEntries(cfg) {
	return listAgentEntriesWithSource(cfg).map(({ entry }) => entry);
}
/** Converts either supported roster representation into the canonical keyed shape. */
function toAgentEntriesRecord(entries) {
	return Object.fromEntries(entries.map((entry) => {
		const { id, ...config } = entry;
		return [id, config];
	}));
}
/** Reads the explicitly owned raw roster without normalizing malformed values. */
function readAgentRosterProperty(raw) {
	if (!raw || typeof raw !== "object" || Array.isArray(raw)) return;
	const agents = raw.agents;
	if (!agents || typeof agents !== "object" || Array.isArray(agents)) return;
	const entries = agents["entries"];
	if (Object.hasOwn(agents, "entries") && entries !== void 0) return {
		kind: "entries",
		value: entries
	};
	const list = agents["list"];
	if (Object.hasOwn(agents, "list") && list !== void 0) return {
		kind: "list",
		value: list
	};
}
/** True when raw config explicitly owns either supported roster representation. */
function hasAgentRosterProperty(raw) {
	return readAgentRosterProperty(raw) !== void 0;
}
/** Lists unique configured agent ids. */
function listAgentIds(cfg) {
	const agents = listAgentEntries(cfg);
	if (agents.length === 0 && !hasAgentRosterProperty(cfg)) return [LEGACY_IMPLICIT_AGENT_ID];
	const seen = /* @__PURE__ */ new Set();
	const ids = [];
	for (const entry of agents) {
		const id = normalizeAgentId(entry?.id);
		if (seen.has(id)) continue;
		seen.add(id);
		ids.push(id);
	}
	return ids;
}
/** Returns a configured agent id or throws the canonical CLI selection error. */
function resolveConfiguredAgentId(cfg, agentId) {
	if (!listAgentIds(cfg).includes(agentId)) throw new Error(`Unknown agent id "${agentId}". Run ${formatCliCommand("openclaw agents list")} to see configured agents.`);
	return agentId;
}
function tryResolveSoleAgentId(cfg) {
	const agents = listAgentEntries(cfg);
	if (agents.length === 0) {
		if (!hasAgentRosterProperty(cfg)) return LEGACY_IMPLICIT_AGENT_ID;
		return;
	}
	return agents.length === 1 ? normalizeAgentId(agents[0].id) : void 0;
}
function resolveSoleAgentId(cfg, context) {
	const sole = tryResolveSoleAgentId(cfg);
	if (sole) return sole;
	const agentIds = listAgentIds(cfg);
	if (agentIds.length === 0) throw new Error("No agents configured. Run `openclaw onboard` or `openclaw agents add` first.");
	throw new AgentSelectionRequiredError(agentIds, context);
}
function tryResolveRawLegacyDefaultAgentId(cfg) {
	if (cfg.agents?.ownership === "explicit") return;
	const marked = listAgentEntries(cfg).filter((entry) => entry.default === true);
	return marked.length === 1 ? normalizeAgentId(marked[0].id) : void 0;
}
/** Resolves sole/raw legacy owners plus the retained in-process migration owner. */
function tryResolveLegacyCompatibilityAgentId(cfg) {
	const retainedAgentId = getRetainedLegacyDefaultAgentId(cfg);
	return retainedAgentId && listAgentIds(cfg).includes(retainedAgentId) ? retainedAgentId : tryResolveDefaultAgentId(cfg);
}
/** Resolves the owner for ambient system work and explicit requests. */
function tryResolveAmbientOwnerAgentId(cfg, requestedAgentId) {
	const explicitAgentId = normalizeOptionalString(requestedAgentId) ?? normalizeOptionalString(cfg.agents?.defaults?.systemAgent?.agentId);
	return explicitAgentId ? normalizeAgentId(explicitAgentId) : tryResolveLegacyCompatibilityAgentId(cfg);
}
/** Ambient owner for surfaces that must fail loudly rather than act on the wrong agent. */
function resolveAmbientOwnerAgentId(cfg, requestedAgentId, context) {
	return tryResolveAmbientOwnerAgentId(cfg, requestedAgentId) ?? resolveSoleAgentId(cfg, context);
}
/** Resolves a CLI operation owner while preserving legacy default markers outside explicit fleets. */
function resolveAgentOperationAgentId(cfg, requestedAgentId, context) {
	if (requestedAgentId !== void 0 || cfg.agents?.ownership === "explicit") return resolveAmbientOwnerAgentId(cfg, requestedAgentId, context);
	return tryResolveLegacyCompatibilityAgentId(cfg) ?? resolveDefaultAgentId(cfg, context);
}
/**
* @deprecated Ambient system work uses resolveAmbientOwnerAgentId so the configured
* system agent is honored; explicit-selection surfaces use resolveSoleAgentId. This
* accepts raw shipped markers only for input compatibility.
*/
function resolveDefaultAgentId(cfg, context) {
	return tryResolveRawLegacyDefaultAgentId(cfg) ?? resolveSoleAgentId(cfg, context);
}
/** @deprecated Use tryResolveSoleAgentId; accepts raw shipped markers only for input compatibility. */
function tryResolveDefaultAgentId(cfg) {
	return tryResolveRawLegacyDefaultAgentId(cfg) ?? tryResolveSoleAgentId(cfg);
}
function resolveAgentEntry(cfg, agentId) {
	const id = normalizeAgentId(agentId);
	const roster = readAgentRosterProperty(cfg);
	if (roster?.kind === "entries" && isRecord(roster.value)) {
		const entries = roster.value;
		for (const key in entries) {
			if (!Object.hasOwn(entries, key)) continue;
			const entry = entries[key];
			if (isRecord(entry) && normalizeAgentId(key) === id) return {
				...entry,
				id: key
			};
		}
		return;
	}
	if (roster?.kind === "list" && Array.isArray(roster.value)) return roster.value.find((entry) => entry !== null && typeof entry === "object" && normalizeAgentId(entry.id) === id);
}
/** Resolves the authored entry object for in-place canonical config mutations. */
function resolveMutableAgentEntry(cfg, agentId) {
	const id = normalizeAgentId(agentId);
	const roster = readAgentRosterProperty(cfg);
	if (roster?.kind === "entries" && roster.value && typeof roster.value === "object") {
		const entries = roster.value;
		const key = Object.keys(entries).find((candidate) => normalizeAgentId(candidate) === id);
		return key ? entries[key] : void 0;
	}
	if (roster?.kind === "list" && Array.isArray(roster.value)) return roster.value.find((entry) => normalizeAgentId(entry?.id) === id);
}
/** Resolves merged config for one agent id. */
function resolveAgentConfig(cfg, agentId) {
	const id = normalizeAgentId(agentId);
	const entry = resolveAgentEntry(cfg, id) ?? (!hasAgentRosterProperty(cfg) && id === "main" ? { id } : void 0);
	if (!entry) return;
	const agentDefaults = cfg.agents?.defaults;
	return {
		name: readStringValue(entry.name),
		workspace: readStringValue(entry.workspace),
		agentDir: readStringValue(entry.agentDir),
		model: typeof entry.model === "string" || entry.model && typeof entry.model === "object" ? entry.model : void 0,
		...entry.models ? { models: entry.models } : {},
		...entry.params ? { params: entry.params } : {},
		...entry.runtime ? { runtime: entry.runtime } : {},
		...hasExplicitModelPolicyAllow(entry.modelPolicy) ? { modelPolicy: entry.modelPolicy } : {},
		...entry.agentRuntime ? { agentRuntime: entry.agentRuntime } : {},
		utilityModel: readStringValue(entry.utilityModel),
		thinkingDefault: entry.thinkingDefault,
		verboseDefault: entry.verboseDefault ?? agentDefaults?.verboseDefault,
		reasoningDefault: entry.reasoningDefault,
		fastModeDefault: entry.fastModeDefault ?? agentDefaults?.fastModeDefault,
		contextInjection: entry.contextInjection,
		bootstrapMaxChars: entry.bootstrapMaxChars,
		bootstrapTotalMaxChars: entry.bootstrapTotalMaxChars,
		experimental: typeof entry.experimental === "object" && entry.experimental ? {
			...agentDefaults?.experimental,
			...entry.experimental
		} : agentDefaults?.experimental,
		skills: Array.isArray(entry.skills) ? entry.skills : void 0,
		memory: entry.memory,
		humanDelay: entry.humanDelay,
		typingMode: entry.typingMode ?? agentDefaults?.typingMode,
		tts: entry.tts,
		contextLimits: typeof entry.contextLimits === "object" && entry.contextLimits ? {
			...agentDefaults?.contextLimits,
			...entry.contextLimits
		} : agentDefaults?.contextLimits,
		heartbeat: entry.heartbeat,
		identity: entry.identity,
		groupChat: entry.groupChat,
		subagents: typeof entry.subagents === "object" && entry.subagents ? entry.subagents : void 0,
		embeddedAgent: typeof entry.embeddedAgent === "object" && entry.embeddedAgent ? entry.embeddedAgent : void 0,
		sandbox: entry.sandbox,
		tools: entry.tools
	};
}
function resolveAgentContextLimits(cfg, agentId) {
	const defaults = cfg?.agents?.defaults?.contextLimits;
	if (!cfg || !agentId) return defaults;
	return resolveAgentConfig(cfg, agentId)?.contextLimits ?? defaults;
}
function tryResolveInheritedWorkspaceAgentId(cfg) {
	return tryResolveLegacyCompatibilityAgentId(cfg);
}
function resolveAgentWorkspaceDir(cfg, agentId, env = process.env) {
	const id = normalizeAgentId(agentId);
	const configured = resolveAgentConfig(cfg, id)?.workspace?.trim();
	if (configured) return stripNullBytes(resolveUserPath(configured, env));
	const inheritedWorkspaceAgentId = tryResolveInheritedWorkspaceAgentId(cfg);
	const fallback = cfg.agents?.defaults?.workspace?.trim();
	if (inheritedWorkspaceAgentId && id === inheritedWorkspaceAgentId) {
		if (fallback) return stripNullBytes(resolveUserPath(fallback, env));
		return stripNullBytes(resolveDefaultAgentWorkspaceDir(env));
	}
	if (fallback) return stripNullBytes(path.join(resolveUserPath(fallback, env), id));
	const stateDir = resolveStateDir(env);
	return stripNullBytes(path.join(stateDir, `workspace-${id}`));
}
function tryResolveConfiguredAgentWorkspaceDir(cfg, env = process.env) {
	const inheritedWorkspaceAgentId = tryResolveInheritedWorkspaceAgentId(cfg);
	if (inheritedWorkspaceAgentId) return resolveAgentWorkspaceDir(cfg, inheritedWorkspaceAgentId, env);
	const configured = cfg.agents?.defaults?.workspace?.trim();
	return configured ? stripNullBytes(resolveUserPath(configured, env)) : void 0;
}
function resolveAgentDir(cfg, agentId, env = process.env) {
	const id = normalizeAgentId(agentId);
	const configured = resolveAgentConfig(cfg, id)?.agentDir?.trim();
	if (configured) {
		const agentDir = resolveUserPath(configured, env);
		registerResolvedAgentDir({
			agentId: id,
			agentDir,
			env
		});
		return agentDir;
	}
	const root = resolveStateDir(env);
	const agentDir = path.join(root, "agents", id, "agent");
	registerResolvedAgentDir({
		agentId: id,
		agentDir,
		env
	});
	return agentDir;
}
function resolveDefaultAgentDir(cfg, env = process.env) {
	return resolveAgentDir(cfg, resolveAmbientOwnerAgentId(cfg), env);
}
//#endregion
export { getRetainedLegacyDefaultAgentId as A, tryResolveLegacyCompatibilityAgentId as C, hasExplicitModelPolicyAllow as D, computeModelPolicyAllowlist as E, hasModelPolicyAllowlistMigrationMarker as O, tryResolveDefaultAgentId as S, MODEL_POLICY_ALLOWLIST_MIGRATION_MARKER as T, resolveMutableAgentEntry as _, listAgentIds as a, tryResolveAmbientOwnerAgentId as b, resolveAgentContextLimits as c, resolveAgentOperationAgentId as d, resolveAgentWorkspaceDir as f, resolveDefaultAgentId as g, resolveDefaultAgentDir as h, listAgentEntriesWithSource as i, setRetainedLegacyDefaultAgentId as j, isExplicitModelPolicy as k, resolveAgentDir as l, resolveConfiguredAgentId as m, hasAgentRosterProperty as n, readAgentRosterProperty as o, resolveAmbientOwnerAgentId as p, listAgentEntries as r, resolveAgentConfig as s, AgentSelectionRequiredError as t, resolveAgentEntry as u, resolveSoleAgentId as v, tryResolveSoleAgentId as w, tryResolveConfiguredAgentWorkspaceDir as x, toAgentEntriesRecord as y };
