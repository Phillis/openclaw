import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { _ as getNodeSqliteKysely, h as executeSqliteQuerySync } from "./openclaw-state-db.paths-gKE3myqW.js";
import { d as openOpenClawStateDatabase, h as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BciZ4rHE.js";
import { Ot as applySessionEntryReplacements } from "./session-accessor-CIiPoGwM.js";
import { o as resolveAllAgentSessionStoreTargetsSync } from "./targets-CdQ3kEkv.js";
import "./sessions-Bh837xaa.js";
import { t as SessionMutationAuthorizationChangedError } from "./session-sharing-YSn98RD0.js";
//#region src/gateway/session-groups.ts
const ensuredSidebarSectionDatabases = /* @__PURE__ */ new WeakSet();
const SIDEBAR_SECTIONS_SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS sidebar_sections (
  section_id TEXT NOT NULL PRIMARY KEY,
  position INTEGER NOT NULL
) STRICT;
`;
function dbFor(env) {
	return openOpenClawStateDatabase({ env }).db;
}
function kyselyFor(db) {
	return getNodeSqliteKysely(db);
}
function ensureSidebarSectionsSchema(env) {
	const database = openOpenClawStateDatabase({ env });
	if (ensuredSidebarSectionDatabases.has(database.db)) return;
	runOpenClawStateWriteTransaction(({ db }) => {
		db.exec(SIDEBAR_SECTIONS_SCHEMA_SQL);
	}, { env }, { operationLabel: "session-groups.sidebar-sections.schema.ensure" });
	ensuredSidebarSectionDatabases.add(database.db);
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
	return executeSqliteQuerySync(db, kyselyFor(db).selectFrom("session_groups").select(["name", "position"]).orderBy("position", "asc").orderBy("name", "asc")).rows.map((row) => ({
		name: row.name,
		position: row.position
	}));
}
function listSidebarSectionOrder(env = process.env) {
	ensureSidebarSectionsSchema(env);
	const db = dbFor(env);
	return executeSqliteQuerySync(db, kyselyFor(db).selectFrom("sidebar_sections").select("section_id").orderBy("position", "asc").orderBy("section_id", "asc")).rows.map((row) => row.section_id);
}
/** Replaces the ordered catalog. Sessions keep their category even when a name is dropped. */
function putSessionGroups(names, sectionOrder, env = process.env) {
	const normalized = normalizeGroupNames(names);
	const normalizedSectionOrder = sectionOrder === void 0 ? void 0 : normalizeSidebarSectionOrder(sectionOrder, normalized);
	if (normalizedSectionOrder) ensureSidebarSectionsSchema(env);
	const now = Date.now();
	runOpenClawStateWriteTransaction(({ db }) => {
		const kysely = kyselyFor(db);
		const existing = new Map(executeSqliteQuerySync(db, kysely.selectFrom("session_groups").select(["name", "created_at"])).rows.map((row) => [row.name, row.created_at]));
		executeSqliteQuerySync(db, kysely.deleteFrom("session_groups"));
		normalized.forEach((name, position) => {
			executeSqliteQuerySync(db, kysely.insertInto("session_groups").values({
				name,
				position,
				created_at: existing.get(name) ?? now
			}));
		});
		if (normalizedSectionOrder) {
			executeSqliteQuerySync(db, kysely.deleteFrom("sidebar_sections"));
			normalizedSectionOrder.forEach((sectionId, position) => {
				executeSqliteQuerySync(db, kysely.insertInto("sidebar_sections").values({
					section_id: sectionId,
					position
				}));
			});
		}
	}, { env });
	return normalized.map((name, position) => ({
		name,
		position
	}));
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
	ensureSidebarSectionsSchema(env);
	runOpenClawStateWriteTransaction(({ db }) => {
		const kysely = kyselyFor(db);
		const source = executeSqliteQuerySync(db, kysely.selectFrom("session_groups").selectAll().where("name", "=", from).limit(1)).rows[0];
		const targetExists = executeSqliteQuerySync(db, kysely.selectFrom("session_groups").select("name").where("name", "=", to).limit(1)).rows[0];
		const sourceSectionId = `category:${from}`;
		const targetSectionId = `category:${to}`;
		const targetSectionExists = executeSqliteQuerySync(db, kysely.selectFrom("sidebar_sections").select("section_id").where("section_id", "=", targetSectionId).limit(1)).rows[0];
		executeSqliteQuerySync(db, kysely.deleteFrom("session_groups").where("name", "=", from));
		if (targetSectionExists) executeSqliteQuerySync(db, kysely.deleteFrom("sidebar_sections").where("section_id", "=", sourceSectionId));
		else executeSqliteQuerySync(db, kysely.updateTable("sidebar_sections").set({ section_id: targetSectionId }).where("section_id", "=", sourceSectionId));
		if (targetExists) return;
		executeSqliteQuerySync(db, kysely.insertInto("session_groups").values({
			name: to,
			position: source?.position ?? 0,
			created_at: source?.created_at ?? Date.now()
		}));
	}, { env });
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
	ensureSidebarSectionsSchema(env);
	runOpenClawStateWriteTransaction(({ db }) => {
		const kysely = kyselyFor(db);
		executeSqliteQuerySync(db, kysely.deleteFrom("session_groups").where("name", "=", name));
		executeSqliteQuerySync(db, kysely.deleteFrom("sidebar_sections").where("section_id", "=", `category:${name}`));
	}, { env });
	const updatedSessions = await updateMemberCategories(params.cfg, name, void 0, env, params.assertTargetCurrent);
	return {
		groups: listSessionGroups(env),
		sectionOrder: listSidebarSectionOrder(env),
		updatedSessions
	};
}
//#endregion
export { putSessionGroups as a, listSidebarSectionOrder as i, ensureSessionGroupRegistered as n, renameSessionGroup as o, listSessionGroups as r, deleteSessionGroup as t };
