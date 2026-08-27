import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { An as executeSqliteQuerySync, Bt as tableHasColumn, Mn as getNodeSqliteKysely, Rt as ensureColumn, d as openOpenClawStateDatabase, h as runOpenClawStateWriteTransaction } from "./openclaw-state-db-CeAO_dqo.js";
import { r as readConfigMachineState } from "./config-machine-state-FNVGu8mV.js";
import { At as applySessionEntryReplacements } from "./session-accessor-B-FKZX9M.js";
import { o as resolveAllAgentSessionStoreTargetsSync } from "./targets-Bo3OPXck.js";
import "./sessions-CdrF1uzY.js";
import { t as SessionMutationAuthorizationChangedError } from "./session-sharing-C4OmHGYo.js";
//#region src/gateway/session-groups.ts
var SessionGroupNotFoundError = class extends Error {
	constructor(name) {
		super(`unknown session group: ${name}`);
		this.name = "SessionGroupNotFoundError";
	}
};
const ensuredSessionGroupDefaultsDatabases = /* @__PURE__ */ new WeakSet();
const SIDEBAR_SECTION_ORDER_STATE_KEY = "sidebar.sectionOrder";
function dbFor(env) {
	return openOpenClawStateDatabase({ env }).db;
}
function kyselyFor(db) {
	return getNodeSqliteKysely(db);
}
function updateSidebarSectionOrder(db, update) {
	const kysely = kyselyFor(db);
	const row = executeSqliteQuerySync(db, kysely.selectFrom("config_machine_state").select("value_json").where("state_key", "=", SIDEBAR_SECTION_ORDER_STATE_KEY)).rows[0];
	const next = update(row ? JSON.parse(row.value_json) : void 0);
	if (!next) return;
	const valueJson = JSON.stringify(next);
	const updatedAtMs = Date.now();
	executeSqliteQuerySync(db, kysely.insertInto("config_machine_state").values({
		state_key: SIDEBAR_SECTION_ORDER_STATE_KEY,
		value_json: valueJson,
		updated_at_ms: updatedAtMs
	}).onConflict((conflict) => conflict.column("state_key").doUpdateSet({
		value_json: valueJson,
		updated_at_ms: updatedAtMs
	})));
}
function hasSessionGroupDefaultsSchema(db) {
	return tableHasColumn(db, "session_groups", "cwd") && tableHasColumn(db, "session_groups", "worktree");
}
function normalizeGroupNames(names) {
	const seen = /* @__PURE__ */ new Set();
	const normalized = [];
	for (const raw of names) {
		const name = normalizeOptionalString(raw);
		if (!name || seen.has(name)) continue;
		seen.add(name);
		normalized.push(name);
	}
	return normalized;
}
function normalizeSidebarSectionOrder(sectionOrder, groupNames) {
	const groups = new Set(groupNames);
	const seen = /* @__PURE__ */ new Set();
	const normalized = [];
	for (const raw of sectionOrder) {
		const sectionId = raw.trim();
		let canonical = null;
		if (sectionId === "ungrouped" || sectionId === "groups" || sectionId === "work") canonical = sectionId;
		else if (sectionId.startsWith("category:")) {
			const name = normalizeOptionalString(sectionId.slice(9));
			if (name && groups.has(name)) canonical = `category:${name}`;
		} else if (sectionId.startsWith("catalog:")) {
			const catalogId = normalizeOptionalString(sectionId.slice(8));
			if (catalogId) canonical = `catalog:${catalogId}`;
		}
		if (!canonical || seen.has(canonical)) continue;
		seen.add(canonical);
		normalized.push(canonical);
	}
	return normalized;
}
function listSessionGroups(env = process.env) {
	const db = dbFor(env);
	return executeSqliteQuerySync(db, kyselyFor(db).selectFrom("session_groups").select(["name", "position"]).orderBy("position", "asc").orderBy("name", "asc")).rows;
}
function listSessionGroupDefaults(env = process.env) {
	const db = dbFor(env);
	if (!hasSessionGroupDefaultsSchema(db)) return listSessionGroups(env).map(({ name }) => ({ name }));
	return executeSqliteQuerySync(db, kyselyFor(db).selectFrom("session_groups").select([
		"name",
		"cwd",
		"worktree"
	]).orderBy("position", "asc").orderBy("name", "asc")).rows.map((row) => {
		const group = { name: row.name };
		if (row.cwd) group.cwd = row.cwd;
		if (row.worktree !== null) group.worktree = row.worktree === 1;
		return group;
	});
}
function listSidebarSectionOrder(env = process.env) {
	return readConfigMachineState(SIDEBAR_SECTION_ORDER_STATE_KEY, { env }) ?? [];
}
/** Replaces the ordered catalog. Sessions keep their category even when a name is dropped. */
function putSessionGroups(names, sectionOrder, env = process.env) {
	const normalized = normalizeGroupNames(names);
	const normalizedSectionOrder = sectionOrder === void 0 ? void 0 : normalizeSidebarSectionOrder(sectionOrder, normalized);
	const now = Date.now();
	runOpenClawStateWriteTransaction(({ db }) => {
		const kysely = kyselyFor(db);
		const existing = new Map(executeSqliteQuerySync(db, kysely.selectFrom("session_groups").select(["name", "created_at"])).rows.map((row) => [row.name, row]));
		executeSqliteQuerySync(db, normalized.length === 0 ? kysely.deleteFrom("session_groups") : kysely.deleteFrom("session_groups").where("name", "not in", normalized));
		normalized.forEach((name, position) => {
			executeSqliteQuerySync(db, existing.get(name) ? kysely.updateTable("session_groups").set({ position }).where("name", "=", name) : kysely.insertInto("session_groups").values({
				name,
				position,
				created_at: now
			}));
		});
		if (normalizedSectionOrder) updateSidebarSectionOrder(db, () => normalizedSectionOrder);
	}, { env });
	return listSessionGroups(env);
}
/**
* Absorbs a category assigned through sessions.patch so the catalog keeps
* covering every group an operator UI can observe, appended at the end.
*/
function ensureSessionGroupRegistered(name, env = process.env) {
	const normalized = normalizeOptionalString(name);
	if (!normalized) return false;
	let inserted = false;
	runOpenClawStateWriteTransaction(({ db }) => {
		const kysely = kyselyFor(db);
		if (executeSqliteQuerySync(db, kysely.selectFrom("session_groups").select("name").where("name", "=", normalized).limit(1)).rows[0]) return;
		inserted = true;
		const maxRow = executeSqliteQuerySync(db, kysely.selectFrom("session_groups").select("position").orderBy("position", "desc").limit(1)).rows[0];
		executeSqliteQuerySync(db, kysely.insertInto("session_groups").values({
			name: normalized,
			position: (maxRow?.position ?? -1) + 1,
			created_at: Date.now()
		}));
	}, { env });
	return inserted;
}
function renameCatalogEntry(from, to, env) {
	runOpenClawStateWriteTransaction(({ db }) => {
		const kysely = kyselyFor(db);
		const hasDefaults = hasSessionGroupDefaultsSchema(db);
		const source = executeSqliteQuerySync(db, hasDefaults ? kysely.selectFrom("session_groups").selectAll().where("name", "=", from).limit(1) : kysely.selectFrom("session_groups").select([
			"name",
			"position",
			"created_at"
		]).where("name", "=", from).limit(1)).rows[0];
		if (!source) throw new SessionGroupNotFoundError(from);
		const targetExists = executeSqliteQuerySync(db, kysely.selectFrom("session_groups").select("name").where("name", "=", to).limit(1)).rows[0];
		const sourceSectionId = `category:${from}`;
		const targetSectionId = `category:${to}`;
		executeSqliteQuerySync(db, kysely.deleteFrom("session_groups").where("name", "=", from));
		updateSidebarSectionOrder(db, (current) => {
			if (!current?.includes(sourceSectionId)) return;
			return current.includes(targetSectionId) ? current.filter((sectionId) => sectionId !== sourceSectionId) : current.map((sectionId) => sectionId === sourceSectionId ? targetSectionId : sectionId);
		});
		if (targetExists) return;
		const base = {
			name: to,
			position: source.position,
			created_at: source.created_at
		};
		executeSqliteQuerySync(db, kysely.insertInto("session_groups").values(hasDefaults ? {
			...base,
			cwd: "cwd" in source && typeof source.cwd === "string" ? source.cwd : null,
			worktree: "worktree" in source && typeof source.worktree === "number" ? source.worktree : null
		} : base));
	}, { env });
}
function updateSessionGroupDefaults(name, defaults, env = process.env) {
	const normalized = normalizeOptionalString(name);
	if (!normalized) throw new Error("group defaults update requires a non-empty name");
	const database = openOpenClawStateDatabase({ env });
	let updated = false;
	let defaultsSchemaEnsured = false;
	runOpenClawStateWriteTransaction(({ db }) => {
		const kysely = kyselyFor(db);
		if (!executeSqliteQuerySync(db, kysely.selectFrom("session_groups").select("name").where("name", "=", normalized).limit(1)).rows[0]) return;
		if (!ensuredSessionGroupDefaultsDatabases.has(db)) {
			ensureColumn(db, "session_groups", "cwd TEXT");
			ensureColumn(db, "session_groups", "worktree INTEGER");
			defaultsSchemaEnsured = true;
		}
		updated = executeSqliteQuerySync(db, kysely.updateTable("session_groups").set({
			cwd: normalizeOptionalString(defaults.cwd) ?? null,
			worktree: defaults.worktree ? 1 : 0
		}).where("name", "=", normalized)).numAffectedRows === 1n;
	}, { env });
	if (defaultsSchemaEnsured) ensuredSessionGroupDefaultsDatabases.add(database.db);
	return updated ? listSessionGroupDefaults(env) : null;
}
/**
* Bulk-updates member session categories across every agent store without
* bumping updatedAt: group maintenance must not reshuffle recency ordering.
*/
async function updateMemberCategories(cfg, from, to, env, assertTargetCurrent) {
	let updated = 0;
	for (const target of resolveAllAgentSessionStoreTargetsSync(cfg, { env })) updated += await applySessionEntryReplacements({
		storePath: target.storePath,
		update: (entries) => {
			const replacements = entries.flatMap(({ sessionKey, entry }) => {
				if (entry.category?.trim() !== from) return [];
				try {
					assertTargetCurrent?.({
						agentId: target.agentId,
						sessionKey
					});
				} catch (error) {
					if (error instanceof SessionMutationAuthorizationChangedError) return [];
					throw error;
				}
				const next = { ...entry };
				if (to === void 0) delete next.category;
				else next.category = to;
				return [{
					sessionKey,
					entry: next
				}];
			});
			return {
				replacements,
				result: replacements.length
			};
		}
	});
	return updated;
}
async function renameSessionGroup(params) {
	const env = params.env ?? process.env;
	const from = normalizeOptionalString(params.name);
	const to = normalizeOptionalString(params.to);
	if (!from || !to) throw new Error("group rename requires non-empty names");
	if (from !== to) {
		params.assertCurrent?.();
		renameCatalogEntry(from, to, env);
	}
	const updatedSessions = from === to ? 0 : await updateMemberCategories(params.cfg, from, to, env, params.assertTargetCurrent);
	return {
		groups: listSessionGroups(env),
		sectionOrder: listSidebarSectionOrder(env),
		updatedSessions
	};
}
async function deleteSessionGroup(params) {
	const env = params.env ?? process.env;
	const name = normalizeOptionalString(params.name);
	if (!name) throw new Error("group delete requires a non-empty name");
	params.assertCurrent?.();
	runOpenClawStateWriteTransaction(({ db }) => {
		executeSqliteQuerySync(db, kyselyFor(db).deleteFrom("session_groups").where("name", "=", name));
		const sectionId = `category:${name}`;
		updateSidebarSectionOrder(db, (current) => current?.includes(sectionId) ? current.filter((section) => section !== sectionId) : void 0);
	}, { env });
	const updatedSessions = await updateMemberCategories(params.cfg, name, void 0, env, params.assertTargetCurrent);
	return {
		groups: listSessionGroups(env),
		sectionOrder: listSidebarSectionOrder(env),
		updatedSessions
	};
}
//#endregion
export { listSessionGroups as a, renameSessionGroup as c, listSessionGroupDefaults as i, updateSessionGroupDefaults as l, deleteSessionGroup as n, listSidebarSectionOrder as o, ensureSessionGroupRegistered as r, putSessionGroups as s, SessionGroupNotFoundError as t };
