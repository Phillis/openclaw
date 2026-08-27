import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import "./utils-Bw16L5tB.js";
import { n as normalizeAgentId } from "./agent-id-CeT3w4ap.js";
import { o as readAgentRosterProperty, r as listAgentEntries, w as tryResolveSoleAgentId } from "./agent-scope-config-CUBiGmG3.js";
import { n as resolveDefaultAgentWorkspaceDir } from "./workspace-default-DNxmF3kK.js";
import { t as isPerAgentSessionStoreConfig } from "./session-store-config-tR04nswt.js";
import { t as isChannelConfigMetadataKey } from "./config-metadata-aX1D2IMg.js";
import { i as tryGetLegacyDefaultAgentId, r as retainLegacyDefaultAgentId } from "./legacy.default-agent-owner-CL_-T11Y.js";
import { t as normalizeRouteBindingChannelId } from "./binding-scope-DG1HvdoC.js";
//#region src/config/legacy.default-agent-roles.ts
function isChannelWideBinding(binding, channelId) {
	const match = binding.match;
	return isRecord(match) && normalizeRouteBindingChannelId(typeof match.channel === "string" ? match.channel : void 0) === channelId && (typeof match.accountId === "string" ? match.accountId.trim() : void 0) === "*" && match.peer === void 0 && !normalizeOptionalString(typeof match.guildId === "string" ? match.guildId : void 0) && !normalizeOptionalString(typeof match.teamId === "string" ? match.teamId : void 0) && (!Array.isArray(match.roles) || match.roles.length === 0);
}
function listUnboundAmbientChannelIds(cfg, ambientChannelIds) {
	if (cfg.bindings && !Array.isArray(cfg.bindings)) return [];
	const bindings = (cfg.bindings ?? []).filter((binding) => isRecord(binding) && binding.type !== "acp");
	const channels = new Set(ambientChannelIds.map(normalizeRouteBindingChannelId).filter((id) => Boolean(id)));
	if (isRecord(cfg.channels)) for (const [id, value] of Object.entries(cfg.channels)) {
		const channelId = normalizeRouteBindingChannelId(id);
		if (channelId && !isChannelConfigMetadataKey(id) && (!isRecord(value) || value.enabled !== false)) channels.add(channelId);
	}
	return [...channels].toSorted().filter((channelId) => !bindings.some((binding) => isChannelWideBinding(binding, channelId)));
}
function materializeLegacyDefaultAgentRoles(cfg, legacyDefaultAgentId, options = {}) {
	const agentId = normalizeAgentId(legacyDefaultAgentId);
	let next = cfg;
	const insertedPaths = [];
	if (options.materializeWorkspace) {
		const entries = { ...next.agents?.entries };
		const entryKey = Object.keys(entries).find((candidate) => normalizeAgentId(candidate) === agentId);
		const entry = entryKey ? entries[entryKey] : void 0;
		const workspaceNeedsPin = entry !== void 0 && (!Object.hasOwn(entry, "workspace") || typeof entry.workspace === "string" && entry.workspace.trim().length === 0);
		if (entryKey && entry && workspaceNeedsPin) {
			entries[entryKey] = {
				...entry,
				workspace: normalizeOptionalString(next.agents?.defaults?.workspace) ?? resolveDefaultAgentWorkspaceDir(options.env)
			};
			next = {
				...next,
				agents: {
					...next.agents,
					entries
				}
			};
			insertedPaths.push([
				"agents",
				"entries",
				entryKey,
				"workspace"
			]);
		}
	}
	const channels = listUnboundAmbientChannelIds(cfg, options.ambientChannelIds ?? []);
	if (channels.length > 0) {
		next = {
			...next,
			bindings: [...Array.isArray(next.bindings) ? next.bindings : [], ...channels.map((channel) => ({
				agentId,
				match: {
					channel,
					accountId: "*"
				}
			}))]
		};
		insertedPaths.push(["bindings"]);
	}
	const rawDefaults = cfg.agents?.defaults;
	const defaults = isRecord(rawDefaults) ? rawDefaults : void 0;
	if (rawDefaults === void 0 || defaults) {
		const soleFallback = normalizeAgentId(tryResolveSoleAgentId(cfg) ?? "main");
		const unset = (key) => defaults?.[key] === void 0 || isRecord(defaults[key]) && !Object.hasOwn(defaults[key], "agentId");
		const materializedDefaults = { ...defaults };
		let changed = false;
		const materialize = (key, enabled) => {
			if (!enabled) return;
			materializedDefaults[key] = {
				...isRecord(materializedDefaults[key]) ? materializedDefaults[key] : {},
				agentId
			};
			insertedPaths.push([
				"agents",
				"defaults",
				key,
				"agentId"
			]);
			changed = true;
		};
		materialize("heartbeat", !listAgentEntries(cfg).some((entry) => entry.heartbeat) && defaults?.heartbeat === void 0);
		materialize("systemAgent", unset("systemAgent"));
		materialize("authInheritance", agentId !== soleFallback && unset("authInheritance"));
		materialize("sessionStore", options.materializeSessionStore !== false && !isPerAgentSessionStoreConfig(cfg.session?.store) && unset("sessionStore"));
		if (changed) next = {
			...next,
			agents: {
				...next.agents,
				defaults: materializedDefaults
			}
		};
	}
	const talk = isRecord(cfg.talk) ? cfg.talk : void 0;
	if ((cfg.talk === void 0 || talk) && (!talk || !Object.hasOwn(talk, "agentId"))) {
		next = {
			...next,
			talk: {
				...talk,
				agentId
			}
		};
		insertedPaths.push(["talk", "agentId"]);
	}
	return {
		config: next,
		insertedPaths
	};
}
//#endregion
//#region src/config/legacy.roster.ts
function migratePersistedImplicitMainRoster(raw, options = {}) {
	if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {
		config: raw,
		changed: false,
		diagnostics: []
	};
	const root = raw;
	if (Object.hasOwn(root, "agents") && (!root.agents || typeof root.agents !== "object" || Array.isArray(root.agents))) return {
		config: raw,
		changed: false,
		diagnostics: []
	};
	let agents = root.agents && typeof root.agents === "object" && !Array.isArray(root.agents) ? root.agents : {};
	let convertedLegacyList = false;
	let legacyRosterOrder;
	let rosterProperty = readAgentRosterProperty({
		...root,
		agents
	});
	if (rosterProperty?.kind === "list") {
		if (!Array.isArray(rosterProperty.value)) return {
			config: raw,
			changed: false,
			diagnostics: []
		};
		const legacyList = rosterProperty.value;
		if (legacyList.some((value) => !value || typeof value !== "object" || Array.isArray(value))) return {
			config: raw,
			changed: false,
			diagnostics: []
		};
		const legacyIds = /* @__PURE__ */ new Set();
		const legacyOrder = [];
		for (const value of legacyList) {
			const entry = value;
			if (typeof entry.id !== "string" || entry.id.trim() !== entry.id || !entry.id) return {
				config: raw,
				changed: false,
				diagnostics: []
			};
			const normalizedId = normalizeAgentId(entry.id);
			if (normalizedId !== entry.id || legacyIds.has(normalizedId)) return {
				config: raw,
				changed: false,
				diagnostics: []
			};
			legacyIds.add(normalizedId);
			legacyOrder.push(entry.id);
		}
		legacyRosterOrder = legacyOrder;
		const entries = Object.fromEntries(legacyList.map((value) => {
			const { id, ...config } = value;
			return [id, config];
		}));
		const { list: _list, ...rest } = agents;
		agents = {
			...rest,
			entries
		};
		convertedLegacyList = true;
		rosterProperty = readAgentRosterProperty({
			...root,
			agents
		});
	}
	const entries = rosterProperty?.kind === "entries" ? rosterProperty.value : void 0;
	if (!rosterProperty || entries && typeof entries === "object" && !Array.isArray(entries) && Object.keys(entries).length === 0) {
		if (agents.ownership === "explicit") return {
			config: convertedLegacyList ? {
				...root,
				agents
			} : raw,
			changed: convertedLegacyList,
			diagnostics: convertedLegacyList ? ["Moved agents.list to keyed agents.entries."] : []
		};
		return {
			config: {
				...root,
				agents: {
					...agents,
					entries: { main: {} }
				}
			},
			changed: true,
			diagnostics: convertedLegacyList ? ["Moved agents.list to keyed agents.entries."] : []
		};
	}
	if (!entries || typeof entries !== "object" || Array.isArray(entries)) return {
		config: raw,
		changed: false,
		diagnostics: []
	};
	const roster = entries;
	const validIds = legacyRosterOrder ?? Object.entries(roster).flatMap(([id, entry]) => entry && typeof entry === "object" && !Array.isArray(entry) ? [id] : []);
	if (validIds.length === 0) return {
		config: raw,
		changed: false,
		diagnostics: []
	};
	if (validIds.some((id) => {
		const entry = roster[id];
		return Object.hasOwn(entry, "default") && typeof entry.default !== "boolean";
	})) return {
		config: raw,
		changed: false,
		diagnostics: []
	};
	const markedIds = validIds.filter((id) => roster[id].default === true);
	const hasValidLegacyMarker = agents.ownership !== "explicit" && markedIds.length === 1;
	const legacyDefaultAgentId = tryGetLegacyDefaultAgentId(raw) ?? (validIds.length > 1 && hasValidLegacyMarker ? markedIds[0] : void 0);
	let nextRoot = {
		...root,
		agents
	};
	let insertedPaths = [];
	const diagnostics = convertedLegacyList ? ["Moved agents.list to keyed agents.entries."] : [];
	let changed = convertedLegacyList;
	if (legacyDefaultAgentId) {
		const materialized = materializeLegacyDefaultAgentRoles(nextRoot, legacyDefaultAgentId, options);
		nextRoot = materialized.config;
		insertedPaths = materialized.insertedPaths;
		if (insertedPaths.length > 0) {
			diagnostics.push("Materialized legacy per-surface agent ownership.");
			changed = true;
		}
	}
	if (hasValidLegacyMarker) {
		const nextAgents = nextRoot.agents ?? agents;
		const materializedEntries = nextAgents.entries ?? roster;
		nextRoot = {
			...nextRoot,
			agents: {
				...nextAgents,
				entries: Object.fromEntries(Object.entries(materializedEntries).map(([id, entry]) => {
					if (!entry || typeof entry !== "object" || Array.isArray(entry)) return [id, entry];
					const { default: _default, ...rest } = entry;
					return [id, rest];
				}))
			}
		};
		diagnostics.push("Removed retired agents.entries.*.default markers.");
		changed = true;
	}
	const config = changed ? nextRoot : raw;
	retainLegacyDefaultAgentId(config, legacyDefaultAgentId);
	return {
		config,
		changed,
		diagnostics,
		...insertedPaths.length > 0 ? { insertedPaths } : {},
		...legacyDefaultAgentId ? { retainedLegacyDefaultAgentId: legacyDefaultAgentId } : {}
	};
}
//#endregion
export { materializeLegacyDefaultAgentRoles as n, migratePersistedImplicitMainRoster as t };
