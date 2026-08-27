import { r as asNullableRecord } from "./record-coerce-DItp3I4t.js";
import { t as createSubsystemLogger } from "./subsystem-DNgaGOch.js";
import { _ as getNodeSqliteKysely, g as executeSqliteQueryTakeFirstSync, h as executeSqliteQuerySync } from "./openclaw-state-db.paths-gKE3myqW.js";
import { d as openOpenClawStateDatabase, h as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BciZ4rHE.js";
import { a as normalizeSkillIndexName, o as canonicalizePath } from "./skill-index-CEvOAhOd.js";
import { t as bumpSkillsSnapshotVersion } from "./refresh-state-DHnXO3IV.js";
//#region src/skills/workshop/curator.ts
const log = createSubsystemLogger("skills/curator");
const CURATOR_STATE_ID = 1;
let loggedArchivedSkillReadFailure = false;
function curatorDb(options = {}) {
	const database = openOpenClawStateDatabase(options);
	return {
		database,
		kysely: getNodeSqliteKysely(database.db)
	};
}
function canonicalSkillKey(name) {
	const key = normalizeSkillIndexName(name);
	if (!key) throw new Error(`Invalid skill name: ${name}`);
	return key;
}
function parseLifecycleState(value) {
	if (value === "active" || value === "stale" || value === "archived") return value;
	throw new Error(`Invalid legacy skill lifecycle state: ${value}`);
}
function parseOverlapCandidates(value) {
	if (!value) return [];
	try {
		const overlaps = asNullableRecord(JSON.parse(value))?.overlaps;
		if (!Array.isArray(overlaps)) return [];
		return overlaps.flatMap((entry) => {
			const overlap = asNullableRecord(entry);
			return overlap && typeof overlap.left === "string" && typeof overlap.right === "string" && typeof overlap.score === "number" ? [{
				left: overlap.left,
				right: overlap.right,
				score: overlap.score
			}] : [];
		});
	} catch {
		return [];
	}
}
function getSkillCuratorStatus(options = {}) {
	const { database, kysely } = curatorDb(options);
	const state = executeSqliteQueryTakeFirstSync(database.db, kysely.selectFrom("skill_curator_state").selectAll().where("id", "=", CURATOR_STATE_ID));
	const rows = executeSqliteQuerySync(database.db, kysely.selectFrom("skill_lifecycle").leftJoin("skill_usage", "skill_usage.skill_file", "skill_lifecycle.skill_file").select([
		"skill_lifecycle.skill_key as skillKey",
		"skill_lifecycle.skill_name as skillName",
		"skill_lifecycle.skill_file as skillFile",
		"skill_lifecycle.state as state",
		"skill_lifecycle.pinned as pinned",
		"skill_lifecycle.created_at_ms as createdAtMs",
		"skill_lifecycle.state_changed_at_ms as stateChangedAtMs",
		"skill_lifecycle.archived_reason as archivedReason",
		"skill_usage.last_used_at_ms as lastUsedAtMs",
		"skill_usage.use_count as useCount"
	]).orderBy("skill_lifecycle.skill_file", "asc")).rows;
	const counts = {
		active: 0,
		stale: 0,
		archived: 0
	};
	const skills = [];
	for (const row of rows) {
		const lifecycleState = parseLifecycleState(row.state);
		counts[lifecycleState] += 1;
		skills.push({
			...row,
			state: lifecycleState,
			pinned: row.pinned === 1,
			lastUsedAtMs: row.lastUsedAtMs ?? null,
			useCount: row.useCount ?? 0
		});
	}
	return {
		lastAttemptAtMs: state?.last_attempt_at_ms ?? null,
		lastSuccessAtMs: state?.last_success_at_ms ?? null,
		lastError: state?.last_error ?? null,
		counts,
		skills,
		overlaps: parseOverlapCandidates(state?.last_result_json)
	};
}
function updateLifecyclePin(skill, pinned, options) {
	const skillKey = canonicalSkillKey(skill);
	const firstSkillFile = runOpenClawStateWriteTransaction(({ db }) => {
		const kysely = getNodeSqliteKysely(db);
		const first = executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("skill_lifecycle").select("skill_file").where("skill_key", "=", skillKey).orderBy("skill_file", "asc"));
		if (!first) return null;
		return executeSqliteQuerySync(db, kysely.updateTable("skill_lifecycle").set({ pinned: pinned ? 1 : 0 }).where("skill_key", "=", skillKey)).numAffectedRows === 0n ? null : first.skill_file;
	}, options);
	if (!firstSkillFile) throw new Error(`Curated skill not found: ${skill}`);
	return getSkillCuratorStatus(options).skills.find((entry) => entry.skillFile === firstSkillFile);
}
function pinCuratedSkill(skill, options = {}) {
	return updateLifecyclePin(skill, true, options);
}
function unpinCuratedSkill(skill, options = {}) {
	return updateLifecyclePin(skill, false, options);
}
function restoreCuratedSkill(skill, options = {}) {
	const skillKey = canonicalSkillKey(skill);
	const nowMs = options.nowMs ?? Date.now();
	const firstSkillFile = runOpenClawStateWriteTransaction(({ db }) => {
		const kysely = getNodeSqliteKysely(db);
		const first = executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("skill_lifecycle").select("skill_file").where("skill_key", "=", skillKey).where("state", "=", "archived").orderBy("skill_file", "asc"));
		if (!first) return null;
		return executeSqliteQuerySync(db, kysely.updateTable("skill_lifecycle").set({
			state: "active",
			state_changed_at_ms: nowMs,
			archived_reason: null
		}).where("skill_key", "=", skillKey).where("state", "=", "archived")).numAffectedRows === 0n ? null : first.skill_file;
	}, options);
	if (!firstSkillFile) throw new Error(`Archived curated skill not found: ${skill}`);
	bumpSkillsSnapshotVersion({
		reason: "workshop",
		changedPath: firstSkillFile
	});
	return getSkillCuratorStatus(options).skills.find((entry) => entry.skillFile === firstSkillFile);
}
function getArchivedSkillFiles(options = {}) {
	try {
		const { database, kysely } = curatorDb(options);
		const rows = executeSqliteQuerySync(database.db, kysely.selectFrom("skill_lifecycle").select("skill_file").where("state", "=", "archived").orderBy("skill_file", "asc")).rows;
		return new Set(rows.map((row) => row.skill_file));
	} catch (error) {
		if (!loggedArchivedSkillReadFailure) {
			loggedArchivedSkillReadFailure = true;
			log.warn("failed to read archived skill state; loading without lifecycle filtering", { error: String(error) });
		}
		return /* @__PURE__ */ new Set();
	}
}
/** Clears age-based state after the collection model has made a content decision. */
function clearCuratedSkillLifecycle(skillFiles, options = {}) {
	if (skillFiles.length === 0) return;
	runOpenClawStateWriteTransaction(({ db }) => {
		executeSqliteQuerySync(db, getNodeSqliteKysely(db).deleteFrom("skill_lifecycle").where("skill_file", "in", skillFiles.map((skillFile) => canonicalizePath(skillFile))));
	}, options);
}
//#endregion
export { restoreCuratedSkill as a, pinCuratedSkill as i, getArchivedSkillFiles as n, unpinCuratedSkill as o, getSkillCuratorStatus as r, clearCuratedSkillLifecycle as t };
