import { g as readStringValue, l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { c as resolveUserPath } from "./home-dir-DcrXWQPU.js";
import "./utils-D9gvQMP6.js";
import { w as resolveStateDir } from "./paths-CqeDjSA4.js";
import { n as normalizeAgentId } from "./agent-id-Db0rqw_J.js";
import { r as LEGACY_IMPLICIT_AGENT_ID } from "./session-key-D8GLfPr_.js";
import { r as registerResolvedAgentDir } from "./agent-dir-registry-lkpKoZwG.js";
import { n as resolveDefaultAgentWorkspaceDir } from "./workspace-default-kpBt4Iki.js";
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
	if (roster?.kind === "entries" && roster.value && typeof roster.value === "object" && !Array.isArray(roster.value)) return Object.entries(roster.value).flatMap(([id, entry]) => entry !== null && typeof entry === "object" && !Array.isArray(entry) ? [{
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
/** Resolves the configured owner for ambient system work and explicit consults. */
function tryResolveSystemAgentTargetAgentId(cfg, requestedAgentId) {
	const configuredAgentId = normalizeOptionalString(requestedAgentId) ?? normalizeOptionalString(cfg.agents?.defaults?.systemAgent?.agentId);
	return configuredAgentId ? normalizeAgentId(configuredAgentId) : tryResolveSoleAgentId(cfg);
}
function resolveSystemAgentTargetAgentId(cfg, requestedAgentId, context) {
	const resolvedAgentId = tryResolveSystemAgentTargetAgentId(cfg, requestedAgentId);
	if (resolvedAgentId) return resolvedAgentId;
	return normalizeAgentId(resolveSoleAgentId(cfg, context ?? {
		surface: "system-agent consult routing",
		hint: "Set agents.defaults.systemAgent.agentId or pass an explicit consult agent id."
	}));
}
/** @deprecated Use resolveSoleAgentId; accepts raw shipped markers only for input compatibility. */
function resolveDefaultAgentId(cfg, context) {
	return tryResolveRawLegacyDefaultAgentId(cfg) ?? resolveSoleAgentId(cfg, context);
}
/** @deprecated Use tryResolveSoleAgentId; accepts raw shipped markers only for input compatibility. */
function tryResolveDefaultAgentId(cfg) {
	return tryResolveRawLegacyDefaultAgentId(cfg) ?? tryResolveSoleAgentId(cfg);
}
function resolveAgentEntry(cfg, agentId) {
	const id = normalizeAgentId(agentId);
	return listAgentEntries(cfg).find((entry) => normalizeAgentId(entry.id) === id);
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
		contextTokens: entry.contextTokens ?? agentDefaults?.contextTokens,
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
	return resolveAgentDir(cfg, tryResolveLegacyCompatibilityAgentId(cfg) ?? resolveDefaultAgentId(cfg), env);
}
//#endregion
export { MODEL_POLICY_ALLOWLIST_MIGRATION_MARKER as C, isExplicitModelPolicy as D, hasModelPolicyAllowlistMigrationMarker as E, getRetainedLegacyDefaultAgentId as O, tryResolveSystemAgentTargetAgentId as S, hasExplicitModelPolicyAllow as T, toAgentEntriesRecord as _, listAgentIds as a, tryResolveLegacyCompatibilityAgentId as b, resolveAgentContextLimits as c, resolveAgentWorkspaceDir as d, resolveDefaultAgentDir as f, resolveSystemAgentTargetAgentId as g, resolveSoleAgentId as h, listAgentEntriesWithSource as i, setRetainedLegacyDefaultAgentId as k, resolveAgentDir as l, resolveMutableAgentEntry as m, hasAgentRosterProperty as n, readAgentRosterProperty as o, resolveDefaultAgentId as p, listAgentEntries as r, resolveAgentConfig as s, AgentSelectionRequiredError as t, resolveAgentEntry as u, tryResolveConfiguredAgentWorkspaceDir as v, computeModelPolicyAllowlist as w, tryResolveSoleAgentId as x, tryResolveDefaultAgentId as y };
