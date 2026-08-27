import { b as resolvePersistedSessionStoreOwner } from "./agent-scope-DigoIwHb.js";
import { n as normalizeAgentId } from "./agent-id-CeT3w4ap.js";
import { c as parseAgentSessionKey } from "./session-key-utils-Di3FvABa.js";
import { t as isPerAgentSessionStoreConfig } from "./session-store-config-tR04nswt.js";
import { o as resolveSessionStorePathCore } from "./paths-DVAvlIOc.js";
import { t as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-C-yaBHT4.js";
import { p as readSessionEntryKeys } from "./session-accessor.sqlite-entry-store-BIW-GrsF.js";
import { r as resolveSqliteTargetFromSessionStorePath } from "./session-sqlite-target-10dvR_dO.js";
import { l as dedupeSessionStoreTargetsBySqliteTarget, n as listConfiguredSessionStoreAgentIds, s as resolveExistingAgentSessionStoreTargetsSync } from "./targets-CSCF74bk.js";
import fs from "node:fs";
import path from "node:path";
//#region src/config/sessions/targets-read-availability.ts
function resolveReadDefaultAgentId(cfg, targetAgentId) {
	const persistedOwner = resolvePersistedSessionStoreOwner(cfg);
	return persistedOwner.kind === "none" ? normalizeAgentId(targetAgentId) : persistedOwner.agentId;
}
function dedupeTargetsByStorePath(targets) {
	return [...new Map(targets.map((target) => [target.storePath, target])).values()];
}
function readSessionStoreTargetSnapshot(params) {
	const cacheKey = path.resolve(params.sqlitePath);
	const cached = params.cache?.get(cacheKey);
	if (cached) return cached;
	let snapshot;
	if (!fs.existsSync(params.sqlitePath)) snapshot = {
		available: false,
		reason: "database-missing"
	};
	else {
		const result = withOpenClawAgentDatabaseReadOnly((database) => {
			const scopedAgentIds = /* @__PURE__ */ new Set();
			let hasUnscopedRow = false;
			for (const sessionKey of readSessionEntryKeys(database)) {
				const parsed = parseAgentSessionKey(sessionKey);
				if (parsed) scopedAgentIds.add(normalizeAgentId(parsed.agentId));
				else hasUnscopedRow = true;
			}
			return {
				databaseAgentId: params.databaseAgentId,
				hasUnscopedRow,
				scopedAgentIds
			};
		}, {
			agentId: params.databaseAgentId,
			env: params.env,
			path: params.sqlitePath
		});
		snapshot = result.found ? {
			available: true,
			...result.value
		} : {
			available: false,
			reason: result.reason
		};
	}
	params.cache?.set(cacheKey, snapshot);
	return snapshot;
}
function resolveFixedSessionStoreTargetsReadOnly(cfg, requested, env, cache) {
	const storeConfig = cfg.session?.store;
	const defaultAgentId = resolveReadDefaultAgentId(cfg, requested);
	const fixedTarget = {
		agentId: requested,
		storePath: resolveSessionStorePathCore(storeConfig, {
			agentId: requested,
			env
		})
	};
	try {
		const configuredTargets = listConfiguredSessionStoreAgentIds(cfg).map((configuredAgentId) => ({
			agentId: configuredAgentId,
			storePath: resolveSessionStorePathCore(storeConfig, {
				agentId: configuredAgentId,
				env
			})
		}));
		if (!configuredTargets.some((target) => normalizeAgentId(target.agentId) === requested)) configuredTargets.push(fixedTarget);
		const resolvedTarget = resolveSqliteTargetFromSessionStorePath(fixedTarget.storePath, {
			agentId: requested,
			defaultAgentId,
			env
		});
		const snapshot = readSessionStoreTargetSnapshot({
			cache,
			databaseAgentId: normalizeAgentId(resolvedTarget.agentId ?? defaultAgentId),
			env,
			sqlitePath: resolvedTarget.path
		});
		if (!snapshot.available) return snapshot;
		if (snapshot.scopedAgentIds.has(requested)) return {
			available: true,
			targets: [fixedTarget]
		};
		if (!(resolvedTarget.shared === true || dedupeSessionStoreTargetsBySqliteTarget(configuredTargets, {
			defaultAgentId,
			env
		}).some((target) => normalizeAgentId(target.agentId) === requested))) return {
			available: false,
			reason: "read-failed"
		};
		return {
			available: true,
			targets: snapshot.databaseAgentId === requested && snapshot.hasUnscopedRow ? [fixedTarget] : []
		};
	} catch {
		return {
			available: false,
			reason: "read-failed"
		};
	}
}
/** Resolves every plausible store while preserving read availability and ownership. */
function resolveExistingAgentSessionStoreTargetsReadOnlyResult(cfg, agentId, params = {}) {
	const env = params.env ?? process.env;
	const requested = normalizeAgentId(agentId);
	if (!isPerAgentSessionStoreConfig(cfg.session?.store)) return resolveFixedSessionStoreTargetsReadOnly(cfg, requested, env, params.cache);
	const candidates = dedupeTargetsByStorePath([{
		agentId: requested,
		storePath: resolveSessionStorePathCore(cfg.session?.store, {
			agentId: requested,
			env
		})
	}, ...resolveExistingAgentSessionStoreTargetsSync(cfg, requested, { env })]);
	const targets = [];
	for (const target of candidates) {
		const defaultAgentId = resolveReadDefaultAgentId(cfg, target.agentId);
		const resolved = resolveSqliteTargetFromSessionStorePath(target.storePath, {
			agentId: target.agentId,
			defaultAgentId,
			env
		});
		const snapshot = readSessionStoreTargetSnapshot({
			cache: params.cache,
			databaseAgentId: normalizeAgentId(resolved.agentId ?? target.agentId),
			env,
			sqlitePath: resolved.path
		});
		if (!snapshot.available) {
			if (snapshot.reason === "database-missing") continue;
			return snapshot;
		}
		targets.push(target);
	}
	if (targets.length === 0) return {
		available: false,
		reason: "database-missing"
	};
	return {
		available: true,
		targets
	};
}
//#endregion
export { resolveExistingAgentSessionStoreTargetsReadOnlyResult as t };
