import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { t as sameFileIdentity } from "./file-identity-BUNb7Cm3.js";
import { l as isWithinDir } from "./path-CYL8StfC.js";
import "./fs-safe-X_oyl7Rx.js";
import { t as expandHomePrefix } from "./home-dir-DcrXWQPU.js";
import "./path-safety-D5Is7hSS.js";
import { w as resolveStateDir } from "./paths-CqeDjSA4.js";
import { n as normalizeAgentId, t as isValidAgentId } from "./agent-id-Db0rqw_J.js";
import { r as listAgentEntries } from "./agent-scope-config-CsnnOL14.js";
import { c as parseAgentSessionKey, o as normalizeSessionKeyPreservingOpaquePeerIds } from "./session-key-utils-D8x_bjrd.js";
import { n as DEFAULT_MAIN_KEY, r as LEGACY_IMPLICIT_AGENT_ID, u as normalizeMainKey } from "./session-key-D8GLfPr_.js";
import { t as resolvePersistedSessionStoreOwner } from "./session-store-owner-CLtsGq3M.js";
import { n as resolveAgentsDirFromSessionStorePath } from "./paths-CfFmgJmW.js";
import { n as readFileWindowFullySync } from "./file-read-DtMn74uz.js";
import { n as collectRelevantDoctorPluginIds, o as listPluginDoctorSessionStoreAgentIds } from "./doctor-contract-registry-Bji_8NSw.js";
import { n as canonicalizeMainSessionAlias } from "./main-session-Dth0X5B9.js";
import { t as normalizePersistedSessionEntryShape } from "./store-entry-shape-CnAfxmHQ.js";
import { c as resolveSessionStoreTargets, n as listConfiguredSessionStoreAgentIds, o as resolveAllAgentSessionStoreTargetsSync } from "./targets-CdQ3kEkv.js";
import { c as writeAcpSessionMetaForMigration } from "./session-meta-8cwXEOoU.js";
import { r as saveLegacySessionStore } from "./state-migrations.legacy-session-store-mibhzEk5.js";
import { a as readSessionStoreJson5, i as parseSessionStoreJson5, n as existsDir, o as safeReadDir, r as migrationFileExists } from "./state-migrations.fs-FfwaJiB8.js";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
//#region src/infra/state-migrations.session-surfaces.ts
function isSurfaceGroupKey(key) {
	return key.includes(":group:") || key.includes(":channel:");
}
function isLegacyGroupKey(key, surfaces = []) {
	const trimmed = key.trim();
	if (!trimmed) return false;
	const lower = normalizeLowercaseStringOrEmpty(trimmed);
	if (lower.startsWith("group:") || lower.startsWith("channel:")) return true;
	for (const surface of surfaces) if (surface.isLegacyGroupSessionKey?.(trimmed)) return true;
	return false;
}
//#endregion
//#region src/infra/state-migrations.session-store.ts
function isLegacyDefaultMainAliasKey(key, mainKey) {
	const lower = normalizeLowercaseStringOrEmpty(key.trim());
	const canonicalMainKey = normalizeMainKey(mainKey);
	return lower === `agent:main:main` || lower === `agent:main:${canonicalMainKey}`;
}
function resolveCanonicalAgentSessionOwner(key) {
	const parsed = parseAgentSessionKey(key);
	if (parsed === null || !isValidAgentId(parsed.agentId) || normalizeAgentId(parsed.agentId) !== parsed.agentId) return;
	return parsed.agentId;
}
function canonicalizeSessionKeyForAgent(params) {
	const raw = params.key.trim();
	if (!raw) return raw;
	const rawLower = normalizeLowercaseStringOrEmpty(raw);
	const legacyDefaultMainAlias = isLegacyDefaultMainAliasKey(rawLower, params.mainKey);
	const configuredAgentId = normalizeAgentId(params.agentId);
	const canonicalRowOwner = resolveCanonicalAgentSessionOwner(raw);
	const candidateOwner = params.preserveCanonicalAgentOwner ? canonicalRowOwner : void 0;
	const agentId = (candidateOwner === "main" && configuredAgentId !== "main" && legacyDefaultMainAlias ? void 0 : candidateOwner) ?? configuredAgentId;
	const normalized = normalizeSessionKeyPreservingOpaquePeerIds(raw);
	if (rawLower === "global" || rawLower === "unknown") return rawLower;
	if (params.preserveForeignMainAliases && legacyDefaultMainAlias) return params.key;
	const canonicalMain = canonicalizeMainSessionAlias({
		cfg: { session: {
			scope: params.scope,
			mainKey: params.mainKey
		} },
		agentId,
		sessionKey: normalized
	});
	if (params.scope === "global" && canonicalMain === "global") return canonicalMain;
	if (params.preserveAmbiguousKeys && (!canonicalRowOwner || legacyDefaultMainAlias)) return params.key;
	if (params.skipCrossAgentRemap) {
		const parsed = parseAgentSessionKey(raw);
		if (parsed && normalizeAgentId(parsed.agentId) !== agentId) return normalized;
		if (agentId !== "main" && (rawLower === "main" || rawLower === params.mainKey)) return rawLower;
	}
	if (canonicalMain !== normalized) return normalizeLowercaseStringOrEmpty(canonicalMain);
	const defaultPrefix = `agent:${LEGACY_IMPLICIT_AGENT_ID}:`;
	if (rawLower.startsWith(defaultPrefix) && agentId !== "main" && !params.skipCrossAgentRemap) {
		const rest = rawLower.slice(defaultPrefix.length);
		if (rest === "main" || rest === params.mainKey) {
			const remapped = `agent:${agentId}:${rest}`;
			return normalizeLowercaseStringOrEmpty(canonicalizeMainSessionAlias({
				cfg: { session: {
					scope: params.scope,
					mainKey: params.mainKey
				} },
				agentId,
				sessionKey: remapped
			}));
		}
	}
	if (rawLower.startsWith("agent:") && canonicalRowOwner) return normalized;
	if (rawLower.startsWith("subagent:")) return normalizeLowercaseStringOrEmpty(`agent:${agentId}:subagent:${raw.slice(9)}`);
	for (const surface of params.legacySessionSurfaces ?? []) {
		const canonicalized = surface.canonicalizeLegacySessionKey?.({
			key: raw,
			agentId
		});
		const normalizedCanonicalized = normalizeSessionKeyPreservingOpaquePeerIds(canonicalized);
		if (normalizedCanonicalized) return normalizedCanonicalized;
	}
	if (rawLower.startsWith("group:") || rawLower.startsWith("channel:")) return normalizeLowercaseStringOrEmpty(`agent:${agentId}:unknown:${raw}`);
	if (isSurfaceGroupKey(raw)) return `agent:${agentId}:${normalized}`;
	return normalizeSessionKeyPreservingOpaquePeerIds(`agent:${agentId}:${raw}`);
}
function pickLatestLegacyDirectEntry(store, legacySessionSurfaces = []) {
	let best = null;
	let bestUpdated = -1;
	for (const [key, entry] of Object.entries(store)) {
		if (!entry || typeof entry !== "object") continue;
		const normalized = key.trim();
		if (!normalized) continue;
		const normalizedLower = normalizeLowercaseStringOrEmpty(normalized);
		if (normalizedLower === "global") continue;
		if (normalizedLower.startsWith("agent:")) continue;
		if (normalizedLower.startsWith("subagent:")) continue;
		if (isLegacyGroupKey(normalized, legacySessionSurfaces) || isSurfaceGroupKey(normalized)) continue;
		const updatedAt = typeof entry.updatedAt === "number" ? entry.updatedAt : 0;
		if (updatedAt > bestUpdated) {
			bestUpdated = updatedAt;
			best = entry;
		}
	}
	return best;
}
function normalizeSessionEntry(entry, sessionKey) {
	const shaped = normalizePersistedSessionEntryShape(entry, { sessionKey });
	if (!shaped) return null;
	const normalized = { ...shaped };
	if (typeof normalized.sessionId === "string") normalized.updatedAt = typeof normalized.updatedAt === "number" && Number.isFinite(normalized.updatedAt) ? normalized.updatedAt : Date.now();
	const rec = normalized;
	if (typeof rec.groupChannel !== "string" && typeof rec.room === "string") rec.groupChannel = rec.room;
	delete rec.room;
	return normalized;
}
function resolveUpdatedAt(entry) {
	return typeof entry.updatedAt === "number" && Number.isFinite(entry.updatedAt) ? entry.updatedAt : 0;
}
function selectNewerSessionEntry(params) {
	if (!params.existing) return params.incoming;
	const existingUpdated = resolveUpdatedAt(params.existing);
	const incomingUpdated = resolveUpdatedAt(params.incoming);
	if (incomingUpdated > existingUpdated) return params.incoming;
	if (incomingUpdated < existingUpdated) return params.existing;
	return params.preferIncomingOnTie ? params.incoming : params.existing;
}
function canonicalizeSessionStore(params) {
	const canonical = Object.create(null);
	const meta = /* @__PURE__ */ new Map();
	const legacyKeys = [];
	for (const [key, entry] of Object.entries(params.store)) {
		if (!entry || typeof entry !== "object") continue;
		const canonicalKey = canonicalizeSessionKeyForAgent({
			key,
			agentId: params.agentId,
			mainKey: params.mainKey,
			scope: params.scope,
			skipCrossAgentRemap: params.skipCrossAgentRemap,
			preserveCanonicalAgentOwner: params.preserveCanonicalAgentOwner,
			preserveAmbiguousKeys: params.preserveAmbiguousKeys,
			preserveForeignMainAliases: params.preserveForeignMainAliases,
			legacySessionSurfaces: params.legacySessionSurfaces
		});
		const isCanonical = canonicalKey === key;
		if (!isCanonical) legacyKeys.push(key);
		const existing = canonical[canonicalKey];
		if (!existing) {
			canonical[canonicalKey] = entry;
			meta.set(canonicalKey, {
				isCanonical,
				updatedAt: resolveUpdatedAt(entry)
			});
			continue;
		}
		const existingMeta = meta.get(canonicalKey);
		const incomingUpdated = resolveUpdatedAt(entry);
		const existingUpdated = existingMeta?.updatedAt ?? resolveUpdatedAt(existing);
		if (incomingUpdated > existingUpdated) {
			canonical[canonicalKey] = entry;
			meta.set(canonicalKey, {
				isCanonical,
				updatedAt: incomingUpdated
			});
			continue;
		}
		if (incomingUpdated < existingUpdated) continue;
		if (existingMeta?.isCanonical && !isCanonical) continue;
		if (!existingMeta?.isCanonical && isCanonical) {
			canonical[canonicalKey] = entry;
			meta.set(canonicalKey, {
				isCanonical,
				updatedAt: incomingUpdated
			});
			continue;
		}
	}
	return {
		store: canonical,
		legacyKeys
	};
}
function isAmbiguousSharedStoreKey(key, mainKey, scope) {
	const raw = key.trim();
	const lower = normalizeLowercaseStringOrEmpty(raw);
	if (!raw || lower === "global" || lower === "unknown") return false;
	if (scope === "global" && canonicalizeMainSessionAlias({
		cfg: { session: {
			scope,
			mainKey
		} },
		agentId: "main",
		sessionKey: lower
	}) === "global") return false;
	return !resolveCanonicalAgentSessionOwner(raw) || isLegacyDefaultMainAliasKey(lower, mainKey);
}
function aliasedSessionStoreMigrationWarning(params) {
	return `Deferred ${params.subject} ${params.count} ambiguous session key(s) in aliased store ${params.storePath}; remove filesystem aliases or configure one canonical session.store path, then rerun openclaw doctor --fix`;
}
function unresolvedSessionStoreIdentityWarning(subject, storePath) {
	return `Deferred ${subject} for ${storePath}; filesystem identity could not be established for every configured store path. Restore path access or configure one canonical session.store path, then rerun openclaw doctor --fix`;
}
function distinctSessionStoreAliasWarning(subject, storePath) {
	return `Deferred ${subject} in aliased store ${storePath}; atomic replacement cannot update distinct filesystem aliases as one operation. Remove filesystem aliases or configure one canonical session.store path, then rerun openclaw doctor --fix`;
}
function resolveStaleLegacySessionFile(params) {
	if (!params.entry || typeof params.entry !== "object" || Array.isArray(params.entry)) return;
	const entry = params.entry;
	const rawSessionFile = entry.sessionFile;
	if (typeof rawSessionFile !== "string") return;
	const legacySessionFile = path.isAbsolute(rawSessionFile) ? path.resolve(rawSessionFile) : path.resolve(params.legacyDir, rawSessionFile);
	const relative = path.relative(path.resolve(params.legacyDir), legacySessionFile);
	if (relative.startsWith("..") || path.isAbsolute(relative) || migrationFileExists(legacySessionFile)) return;
	if (safeReadDir(path.dirname(params.legacyDir)).some((dirent) => dirent.isDirectory() && dirent.name.startsWith(`${path.basename(params.legacyDir)}.legacy-`) && migrationFileExists(path.join(path.dirname(params.legacyDir), dirent.name, path.basename(legacySessionFile))))) return;
	const parsed = path.parse(path.basename(legacySessionFile));
	if (safeReadDir(params.targetDir).some((dirent) => dirent.isFile() && dirent.name.startsWith(`${parsed.name}.legacy-`) && dirent.name.endsWith(parsed.ext))) return;
	const targetSessionFile = path.join(params.targetDir, path.basename(legacySessionFile));
	if (!migrationFileExists(targetSessionFile) || typeof entry.sessionId !== "string") return;
	const readFirstLine = () => {
		const fd = fs.openSync(targetSessionFile, "r");
		try {
			const buffer = Buffer.alloc(8192);
			const bytesRead = readFileWindowFullySync(fd, buffer, 0);
			if (bytesRead <= 0) return;
			const chunk = buffer.subarray(0, bytesRead).toString("utf8");
			const newline = chunk.indexOf("\n");
			return newline >= 0 ? chunk.slice(0, newline) : chunk;
		} finally {
			fs.closeSync(fd);
		}
	};
	try {
		const firstLine = readFirstLine();
		const header = firstLine ? JSON.parse(firstLine) : void 0;
		if (!header || typeof header !== "object" || Array.isArray(header)) return;
		if (header.type === "session") return header.id === entry.sessionId ? targetSessionFile : void 0;
		return (path.basename(entry.sessionId) === entry.sessionId ? `${entry.sessionId}.jsonl` : void 0) === path.basename(targetSessionFile) ? targetSessionFile : void 0;
	} catch {
		return;
	}
}
function sessionStoreMayNeedCanonicalization(params) {
	const storeAgentIds = new Set([...params.storeAgentIds].map((id) => normalizeAgentId(id)));
	const hasNonMainAgent = [...storeAgentIds].some((id) => id !== LEGACY_IMPLICIT_AGENT_ID);
	for (const key of Object.keys(params.store)) {
		const rawKey = key.trim();
		if (rawKey !== key) return true;
		if (!rawKey) continue;
		const lowerKey = normalizeLowercaseStringOrEmpty(rawKey);
		if (lowerKey !== rawKey) return true;
		if (lowerKey === "global" || lowerKey === "unknown") continue;
		if (params.preserveForeignMainAliases && isLegacyDefaultMainAliasKey(lowerKey, params.mainKey)) return true;
		if (lowerKey === "main" || lowerKey === params.mainKey) return true;
		if (lowerKey.startsWith("subagent:")) return true;
		if (lowerKey.startsWith("group:") || lowerKey.startsWith("channel:")) return true;
		if (!lowerKey.startsWith("agent:")) return true;
		const rowOwner = resolveCanonicalAgentSessionOwner(rawKey);
		if (!rowOwner) return true;
		const agentMainAlias = `agent:${rowOwner}:${DEFAULT_MAIN_KEY}`;
		const agentMainKey = `agent:${rowOwner}:${params.mainKey}`;
		if (lowerKey === agentMainAlias && (params.mainKey !== "main" || params.scope === "global")) return true;
		if (lowerKey === agentMainKey && params.scope === "global") return true;
		if (lowerKey === `agent:main:main` && (params.mainKey !== "main" || hasNonMainAgent || params.scope === "global")) return true;
		if (lowerKey === `agent:main:${params.mainKey}` && hasNonMainAgent && !storeAgentIds.has("main")) return true;
	}
	return false;
}
function listLegacySessionKeys(params) {
	const legacy = [];
	for (const key of Object.keys(params.store)) if (canonicalizeSessionKeyForAgent({
		key,
		agentId: params.agentId,
		mainKey: params.mainKey,
		scope: params.scope,
		skipCrossAgentRemap: params.preserveAmbiguousKeys,
		preserveCanonicalAgentOwner: params.preserveAmbiguousKeys,
		preserveAmbiguousKeys: params.preserveAmbiguousKeys,
		preserveForeignMainAliases: params.preserveForeignMainAliases,
		legacySessionSurfaces: params.legacySessionSurfaces
	}) !== key) legacy.push(key);
	return legacy;
}
function emptyDirOrMissing(dir) {
	if (!existsDir(dir)) return true;
	return safeReadDir(dir).length === 0;
}
function removeDirIfEmpty(dir) {
	if (!existsDir(dir)) return;
	if (!emptyDirOrMissing(dir)) return;
	try {
		fs.rmdirSync(dir);
	} catch {}
}
async function migrateOrphanedSessionKeys(params) {
	const changes = [];
	const warnings = [];
	const env = params.env ?? process.env;
	if (params.legacySessionSurfaces.failures.length > 0) return {
		changes,
		warnings: [...params.legacySessionSurfaces.failures]
	};
	const stateDir = resolveStateDir(env);
	const mainKey = normalizeMainKey(params.cfg.session?.mainKey);
	const scope = params.cfg.session?.scope;
	const storeConfig = params.cfg.session?.store;
	const persistedStoreOwner = resolvePersistedSessionStoreOwner(params.cfg);
	const persistedStoreAgentId = persistedStoreOwner.kind === "configured" ? persistedStoreOwner.agentId : void 0;
	const persistedStorePath = persistedStoreAgentId && storeConfig ? resolveStorePathFromTemplate(storeConfig, persistedStoreAgentId, env) : void 0;
	const pluginAgentIds = params.additionalAgentIds ?? listPluginDoctorSessionStoreAgentIds({
		config: params.cfg,
		env,
		pluginIds: collectRelevantDoctorPluginIds(params.cfg)
	});
	const pluginAgentIdSet = new Set(pluginAgentIds.map((id) => normalizeAgentId(id)));
	const storeMap = /* @__PURE__ */ new Map();
	const storeAliasCandidates = /* @__PURE__ */ new Map();
	const addToStoreMap = (p, id) => {
		const ownerId = persistedStoreAgentId && persistedStorePath && sessionStorePathsMatch(p, persistedStorePath) ? persistedStoreAgentId : id;
		const storePath = [...storeMap.keys()].find((candidate) => sessionStorePathsMatch(candidate, p)) ?? p;
		const aliasCandidates = storeAliasCandidates.get(storePath) ?? /* @__PURE__ */ new Set([storePath]);
		aliasCandidates.add(p);
		storeAliasCandidates.set(storePath, aliasCandidates);
		const existing = storeMap.get(storePath);
		if (existing) existing.add(ownerId);
		else storeMap.set(storePath, /* @__PURE__ */ new Set([ownerId]));
	};
	for (const configuredAgentId of listConfiguredSessionStoreAgentIds(params.cfg)) {
		const id = normalizeAgentId(configuredAgentId);
		addToStoreMap(storeConfig ? resolveStorePathFromTemplate(storeConfig, id, env) : path.join(stateDir, "agents", id, "sessions", "sessions.json"), id);
	}
	for (const pluginAgentId of pluginAgentIds) {
		const id = normalizeAgentId(pluginAgentId);
		addToStoreMap(storeConfig ? resolveStorePathFromTemplate(storeConfig, id, env) : path.join(stateDir, "agents", id, "sessions", "sessions.json"), id);
	}
	const agentsDir = path.join(stateDir, "agents");
	if (existsDir(agentsDir)) {
		for (const dirEntry of safeReadDir(agentsDir)) if (dirEntry.isDirectory()) {
			const diskAgentId = normalizeAgentId(dirEntry.name);
			if (diskAgentId) addToStoreMap(path.join(agentsDir, diskAgentId, "sessions", "sessions.json"), diskAgentId);
		}
	}
	for (const [mappedStorePath, storeAgentIds] of storeMap) {
		const storePaths = storeAliasCandidates.get(mappedStorePath) ?? /* @__PURE__ */ new Set([mappedStorePath]);
		const storePath = [...storePaths].find((candidate) => migrationFileExists(candidate));
		if (!storePath) continue;
		const pluginForeignMainAliasRisk = [...storeAgentIds].some((id) => pluginAgentIdSet.has(id) && id !== "main");
		let parsed;
		try {
			parsed = parseSessionStoreJson5(fs.readFileSync(storePath, "utf-8"));
		} catch (err) {
			warnings.push(`Could not read ${storePath}: ${String(err)}`);
			continue;
		}
		if (!parsed.ok || !sessionStoreMayNeedCanonicalization({
			store: parsed.store,
			storeAgentIds,
			mainKey,
			scope,
			preserveForeignMainAliases: pluginForeignMainAliasRisk
		})) continue;
		let working = parsed.store;
		let totalLegacy = 0;
		const storeAliases = resolveSessionStoreAliasPlan(storePath, storePaths);
		const hasDistinctAliases = storeAliases.hasDistinctAliases;
		const preserveAmbiguousKeys = storeAgentIds.size > 1;
		const preservedAmbiguousKeyCount = Object.keys(working).filter((key) => preserveAmbiguousKeys && isAmbiguousSharedStoreKey(key, mainKey, scope) || pluginForeignMainAliasRisk && isLegacyDefaultMainAliasKey(key, mainKey)).length;
		if (storeAliases.hasUnresolvedIdentity) {
			warnings.push(unresolvedSessionStoreIdentityWarning("session key migration", storePath));
			continue;
		}
		if (hasDistinctAliases && preservedAmbiguousKeyCount > 0) {
			warnings.push(aliasedSessionStoreMigrationWarning({
				subject: "migration of",
				count: preservedAmbiguousKeyCount,
				storePath
			}));
			continue;
		}
		if (storeAliases.hasFinalSymlink) {
			warnings.push(`Deferred session key migration in final-component symlink store ${storePath}; configure one canonical session.store path, then rerun openclaw doctor --fix`);
			continue;
		}
		if (hasDistinctAliases) {
			warnings.push(distinctSessionStoreAliasWarning("session key migration", storePath));
			continue;
		}
		for (const storeAgentId of storeAgentIds) {
			const { store: canonicalized, legacyKeys } = canonicalizeSessionStore({
				store: working,
				agentId: storeAgentId,
				mainKey,
				scope,
				skipCrossAgentRemap: preserveAmbiguousKeys,
				preserveCanonicalAgentOwner: true,
				preserveAmbiguousKeys,
				preserveForeignMainAliases: pluginForeignMainAliasRisk,
				legacySessionSurfaces: params.legacySessionSurfaces.surfaces
			});
			working = canonicalized;
			totalLegacy += legacyKeys.length;
		}
		if (preservedAmbiguousKeyCount > 0) warnings.push(`Preserved ${preservedAmbiguousKeyCount} ambiguous session key(s) in potentially shared store ${storePath}`);
		if (totalLegacy === 0) continue;
		const normalized = Object.create(null);
		for (const [key, entry] of Object.entries(working)) {
			const ne = normalizeSessionEntry(entry, key);
			if (ne) normalized[key] = ne;
		}
		try {
			await saveSessionStoreStrict(storePath, normalized);
			changes.push(`Canonicalized ${totalLegacy} orphaned session key(s) in ${storePath}`);
		} catch (err) {
			warnings.push(`Failed to write canonicalized store ${storePath}: ${String(err)}`);
		}
	}
	return {
		changes,
		warnings
	};
}
async function migrateLegacyAcpSessionMetadata(params) {
	const changes = [];
	const warnings = [];
	const env = params.env ?? process.env;
	if (params.legacySessionSurfaces.failures.length > 0) return {
		changes,
		warnings: [...params.legacySessionSurfaces.failures]
	};
	const now = params.now ?? (() => Date.now());
	const stateDir = resolveStateDir(env);
	const storeConfig = params.cfg.session?.store;
	const pluginAgentIds = params.pluginSessionStoreAgentIds ?? listPluginDoctorSessionStoreAgentIds({
		config: params.cfg,
		env,
		pluginIds: collectRelevantDoctorPluginIds(params.cfg)
	});
	const normalizedPluginAgentIds = new Set(pluginAgentIds.map((id) => normalizeAgentId(id)));
	const declaredAgentIds = /* @__PURE__ */ new Set([...listConfiguredSessionStoreAgentIds(params.cfg).map((id) => normalizeAgentId(id)), ...normalizedPluginAgentIds]);
	const declaredTargets = [...declaredAgentIds].map((agentId) => ({
		agentId,
		storePath: storeConfig ? resolveStorePathFromTemplate(storeConfig, agentId, env) : path.join(stateDir, "agents", agentId, "sessions", "sessions.json")
	}));
	const pluginTargets = declaredTargets.filter(({ agentId }) => agentId !== "main" && normalizedPluginAgentIds.has(agentId));
	const configuredAgents = listAgentEntries(params.cfg);
	const configuredAgentIds = new Set(configuredAgents.flatMap((entry) => entry?.id ? [normalizeAgentId(entry.id)] : []));
	const targets = resolveLegacyAcpMetadataSessionStoreTargets([...declaredAgentIds].some((agentId) => !configuredAgentIds.has(agentId)) ? {
		...params.cfg,
		agents: {
			...params.cfg.agents,
			list: [...configuredAgents, ...[...declaredAgentIds].filter((agentId) => !configuredAgentIds.has(agentId)).map((id) => ({ id }))]
		}
	} : params.cfg, env);
	const mainKey = normalizeMainKey(params.cfg.session?.mainKey);
	const scope = params.cfg.session?.scope;
	const storeGroups = [];
	for (const target of targets) {
		if (!migrationFileExists(target.storePath)) continue;
		const group = storeGroups.find(({ target: existing }) => sessionStorePathsMatch(existing.storePath, target.storePath));
		const matchingDeclaredTargets = declaredTargets.filter((declaredTarget) => sessionStorePathsMatch(target.storePath, declaredTarget.storePath));
		if (group) {
			group.agentIds.add(normalizeAgentId(target.agentId));
			group.aliasCandidates.add(target.storePath);
			for (const declaredTarget of matchingDeclaredTargets) {
				group.agentIds.add(declaredTarget.agentId);
				group.aliasCandidates.add(declaredTarget.storePath);
			}
			continue;
		}
		storeGroups.push({
			target,
			agentIds: /* @__PURE__ */ new Set([normalizeAgentId(target.agentId), ...matchingDeclaredTargets.map((declaredTarget) => declaredTarget.agentId)]),
			aliasCandidates: /* @__PURE__ */ new Set([target.storePath, ...matchingDeclaredTargets.map((declaredTarget) => declaredTarget.storePath)])
		});
	}
	for (const { target, agentIds, aliasCandidates } of storeGroups) {
		const storePath = target.storePath;
		const storeAliases = resolveSessionStoreAliasPlan(storePath, aliasCandidates);
		const pluginForeignMainAliasRisk = pluginTargets.some((pluginTarget) => sessionStorePathsMatch(storePath, pluginTarget.storePath));
		let parsed;
		try {
			parsed = readSessionStoreJson5(storePath);
		} catch (err) {
			warnings.push(`Could not read ${storePath}: ${String(err)}`);
			continue;
		}
		if (!parsed.ok) continue;
		const ambiguousKeyCount = Object.keys(parsed.store).filter((key) => isAmbiguousSharedStoreKey(key, mainKey, scope) || pluginForeignMainAliasRisk && isLegacyDefaultMainAliasKey(key, mainKey)).length;
		const hasLegacyAcpMetadata = Object.entries(parsed.store).some(([sessionKey, entry]) => normalizeSessionEntry(entry, sessionKey)?.acp !== void 0);
		if (hasLegacyAcpMetadata && storeAliases.hasUnresolvedIdentity) {
			warnings.push(unresolvedSessionStoreIdentityWarning("ACP metadata migration", storePath));
			continue;
		}
		if (hasLegacyAcpMetadata && storeAliases.hasFinalSymlink) {
			warnings.push(`Deferred ACP metadata migration in final-component symlink store ${storePath}; configure one canonical session.store path, then rerun openclaw doctor --fix`);
			continue;
		}
		if (hasLegacyAcpMetadata && storeAliases.hasDistinctAliases) {
			warnings.push(ambiguousKeyCount > 0 ? aliasedSessionStoreMigrationWarning({
				subject: "ACP metadata migration for",
				count: ambiguousKeyCount,
				storePath
			}) : distinctSessionStoreAliasWarning("ACP metadata migration", storePath));
			continue;
		}
		const normalized = Object.create(null);
		let migrated = 0;
		let preserved = 0;
		for (const [sessionKey, entry] of Object.entries(parsed.store)) {
			const normalizedEntry = normalizeSessionEntry(entry, sessionKey);
			if (!normalizedEntry) continue;
			if (normalizedEntry.acp) {
				const ambiguousSharedStoreKey = isAmbiguousSharedStoreKey(sessionKey, mainKey, scope);
				const ambiguousMultiOwnerKey = agentIds.size > 1 && ambiguousSharedStoreKey;
				const foreignMainAlias = pluginForeignMainAliasRisk && isLegacyDefaultMainAliasKey(sessionKey, mainKey);
				if (ambiguousMultiOwnerKey || foreignMainAlias) {
					preserved++;
					normalized[sessionKey] = normalizedEntry;
					continue;
				}
				writeAcpSessionMetaForMigration({
					sessionKey: canonicalizeSessionKeyForAgent({
						key: sessionKey,
						agentId: resolveCanonicalAgentSessionOwner(sessionKey) ?? target.agentId,
						mainKey,
						scope,
						skipCrossAgentRemap: true,
						legacySessionSurfaces: params.legacySessionSurfaces.surfaces
					}),
					sessionId: normalizedEntry.sessionId,
					lifecycleRevision: normalizedEntry.lifecycleRevision,
					meta: normalizedEntry.acp,
					env,
					now
				});
				delete normalizedEntry.acp;
				migrated++;
			}
			normalized[sessionKey] = normalizedEntry;
		}
		if (preserved > 0) warnings.push(`Preserved ACP metadata for ${preserved} ambiguous session key(s) in potentially shared store ${storePath}`);
		if (migrated === 0) continue;
		try {
			await saveSessionStoreStrict(storePath, normalized);
			changes.push(`Migrated ${migrated} ACP session metadata ${migrated === 1 ? "row" : "rows"} → shared SQLite state`);
		} catch (err) {
			warnings.push(`Failed to write ACP metadata migration source ${storePath}: ${String(err)}`);
		}
	}
	return {
		changes,
		warnings
	};
}
function resolveLegacyAcpMetadataSessionStoreTargets(cfg, env) {
	const stateDir = resolveStateDir(env);
	const agentsDirs = /* @__PURE__ */ new Set([path.join(stateDir, "agents")]);
	const targets = /* @__PURE__ */ new Map();
	const addTarget = (agentId, storePath) => {
		if (!isManagedLegacySessionStorePathSafe(storePath)) return;
		const agentsDir = resolveAgentsDirFromSessionStorePath(storePath);
		if (agentsDir) agentsDirs.add(agentsDir);
		if (!targets.has(storePath)) targets.set(storePath, {
			agentId,
			storePath
		});
	};
	for (const target of resolveAllAgentSessionStoreTargetsSync(cfg, { env })) addTarget(target.agentId, target.storePath);
	for (const target of resolveSessionStoreTargets(cfg, { allAgents: true }, { env })) addTarget(target.agentId, target.storePath);
	for (const agentsDir of agentsDirs) {
		if (!existsDir(agentsDir)) continue;
		for (const entry of safeReadDir(agentsDir)) {
			if (!entry.isDirectory()) continue;
			const agentId = normalizeAgentId(entry.name);
			const normalizedDirName = normalizeLowercaseStringOrEmpty(entry.name);
			if (agentId === "main" && normalizedDirName !== agentId) continue;
			addTarget(agentId, path.join(agentsDir, entry.name, "sessions", "sessions.json"));
		}
	}
	return [...targets.values()];
}
function isManagedLegacySessionStorePathSafe(storePath) {
	const resolvedStorePath = path.resolve(storePath);
	const agentsDir = resolveAgentsDirFromSessionStorePath(resolvedStorePath);
	if (!agentsDir) return true;
	if (!migrationFileExists(resolvedStorePath)) return true;
	try {
		const stat = fs.lstatSync(resolvedStorePath);
		if (stat.isSymbolicLink() || !stat.isFile()) return false;
		const resolvedAgentsDir = path.resolve(agentsDir);
		const realStorePath = fs.realpathSync.native(resolvedStorePath);
		return isWithinDir(fs.realpathSync.native(resolvedAgentsDir), realStorePath);
	} catch {
		return false;
	}
}
function resolveStorePathFromTemplate(template, agentId, env) {
	const expand = (s) => s.startsWith("~") ? expandHomePrefix(s, {
		env: env ?? process.env,
		homedir: os.homedir
	}) : s;
	if (template.includes("{agentId}")) return path.resolve(expand(template.replaceAll("{agentId}", agentId)));
	return path.resolve(expand(template));
}
function resolveSessionStorePathRelationship(left, right) {
	if (left === right) return "same";
	try {
		return sameFileIdentity(fs.statSync(left, { bigint: true }), fs.statSync(right, { bigint: true })) ? "same" : "different";
	} catch (err) {
		const code = err.code;
		if (code !== "ENOENT" && code !== "ENOTDIR") return "unknown";
		const resolvedLeft = resolvePathThroughExistingParents(left);
		const resolvedRight = resolvePathThroughExistingParents(right);
		if (resolvedLeft === void 0 || resolvedRight === void 0) return "unknown";
		return resolvedLeft === resolvedRight ? "same" : "different";
	}
}
function sessionStorePathsMatch(left, right) {
	return resolveSessionStorePathRelationship(left, right) !== "different";
}
function resolvePathThroughExistingParents(filePath) {
	const resolvedPath = path.resolve(filePath);
	const suffix = [path.basename(resolvedPath)];
	let parentPath = path.dirname(resolvedPath);
	while (true) try {
		return path.join(fs.realpathSync.native(parentPath), ...suffix);
	} catch (err) {
		const code = err.code;
		if (code !== "ENOENT" && code !== "ENOTDIR") return;
		const nextParent = path.dirname(parentPath);
		if (nextParent === parentPath) return;
		suffix.unshift(path.basename(parentPath));
		parentPath = nextParent;
	}
}
function sessionStorePathIsFinalSymlink(storePath) {
	try {
		return fs.lstatSync(storePath).isSymbolicLink();
	} catch {
		return false;
	}
}
function sessionStorePathsHaveDistinctEntries(left, right) {
	if (left === right) return false;
	try {
		if (fs.lstatSync(left).isSymbolicLink() || fs.lstatSync(right).isSymbolicLink()) return true;
		return fs.realpathSync.native(left) !== fs.realpathSync.native(right);
	} catch (err) {
		const code = err.code;
		if (code !== "ENOENT" && code !== "ENOTDIR") return true;
		const resolvedLeft = resolvePathThroughExistingParents(left);
		const resolvedRight = resolvePathThroughExistingParents(right);
		return resolvedLeft === void 0 || resolvedLeft !== resolvedRight;
	}
}
function resolveSessionStoreAliasPlan(storePath, candidatePaths) {
	let hasDistinctEntries = false;
	let hasFinalSymlink = sessionStorePathIsFinalSymlink(storePath);
	let hasUnresolvedIdentity = false;
	for (const candidatePath of candidatePaths) {
		const relationship = resolveSessionStorePathRelationship(storePath, candidatePath);
		if (relationship === "different") continue;
		if (relationship === "unknown") {
			hasUnresolvedIdentity = true;
			continue;
		}
		hasFinalSymlink ||= sessionStorePathIsFinalSymlink(candidatePath);
		if (sessionStorePathsHaveDistinctEntries(storePath, candidatePath)) hasDistinctEntries = true;
	}
	return {
		hasDistinctAliases: hasFinalSymlink || hasDistinctEntries || hasUnresolvedIdentity,
		hasFinalSymlink,
		hasUnresolvedIdentity
	};
}
function mergeSessionStoreAliasPlans(left, right) {
	if (!left) return right;
	return {
		hasDistinctAliases: left.hasDistinctAliases || right.hasDistinctAliases,
		hasFinalSymlink: left.hasFinalSymlink || right.hasFinalSymlink,
		hasUnresolvedIdentity: left.hasUnresolvedIdentity || right.hasUnresolvedIdentity
	};
}
async function saveSessionStoreStrict(storePath, store) {
	await saveLegacySessionStore(storePath, store, {
		requireWriteSuccess: true,
		skipMaintenance: true
	});
}
function resolveSessionStoreOwnership(params) {
	const targetStorePath = path.join(params.stateDir, "agents", params.targetAgentId, "sessions", "sessions.json");
	const configuredStore = params.cfg.session?.store;
	const resolveAgentStorePath = (agentId) => configuredStore ? resolveStorePathFromTemplate(configuredStore, agentId, params.env) : path.join(params.stateDir, "agents", agentId, "sessions", "sessions.json");
	const preserveForeignMainAliases = params.pluginSessionStoreAgentIds.some((pluginAgentId) => {
		const id = normalizeAgentId(pluginAgentId);
		if (id === "main") return false;
		return sessionStorePathsMatch(resolveAgentStorePath(id), targetStorePath);
	});
	const configuredOwnerStorePaths = [.../* @__PURE__ */ new Set([...listConfiguredSessionStoreAgentIds(params.cfg).map((id) => normalizeAgentId(id)), ...params.pluginSessionStoreAgentIds.map((id) => normalizeAgentId(id))])].map(resolveAgentStorePath);
	const preserveAmbiguousKeys = configuredOwnerStorePaths.filter((storePath) => sessionStorePathsMatch(storePath, targetStorePath)).length > 1;
	const candidateStorePaths = [...configuredOwnerStorePaths];
	const agentsDir = path.join(params.stateDir, "agents");
	for (const entry of safeReadDir(agentsDir)) if (entry.isDirectory()) candidateStorePaths.push(path.join(agentsDir, entry.name, "sessions", "sessions.json"));
	return {
		preserveAmbiguousKeys,
		preserveForeignMainAliases,
		targetStoreAliases: resolveSessionStoreAliasPlan(targetStorePath, candidateStorePaths)
	};
}
//#endregion
export { selectNewerSessionEntry as _, isAmbiguousSharedStoreKey as a, mergeSessionStoreAliasPlans as c, normalizeSessionEntry as d, pickLatestLegacyDirectEntry as f, saveSessionStoreStrict as g, resolveStaleLegacySessionFile as h, emptyDirOrMissing as i, migrateLegacyAcpSessionMetadata as l, resolveSessionStoreOwnership as m, canonicalizeSessionStore as n, isLegacyDefaultMainAliasKey as o, removeDirIfEmpty as p, distinctSessionStoreAliasWarning as r, listLegacySessionKeys as s, aliasedSessionStoreMigrationWarning as t, migrateOrphanedSessionKeys as u, unresolvedSessionStoreIdentityWarning as v };
