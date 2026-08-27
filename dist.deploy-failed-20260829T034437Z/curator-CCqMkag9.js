import { g as onTrustedInternalDiagnosticEvent } from "./diagnostic-events-BGzDm6gu.js";
import { t as createSubsystemLogger } from "./subsystem-a4KzJVZG.js";
import { An as executeSqliteQuerySync, Mn as getNodeSqliteKysely, d as openOpenClawStateDatabase, h as runOpenClawStateWriteTransaction } from "./openclaw-state-db-CeAO_dqo.js";
import { r as readConfigMachineState } from "./config-machine-state-FNVGu8mV.js";
import { t as canonicalizePath } from "./paths-Bf0MEhmU.js";
import { r as parseSkillProposalRow } from "./store-sqlite-record-CsO0xTyk.js";
import { a as normalizeSkillIndexName } from "./skill-index-kr-4jQSx.js";
import { n as readSkillReviewOutcomes } from "./collection-review-state-B1qe-PAk.js";
import fs from "node:fs";
import path from "node:path";
//#region src/skills/workshop/curator.ts
const log = createSubsystemLogger("skills/curator");
const SKILL_LIFECYCLE_CURATION_RETIRED_MESSAGE = "Skill lifecycle curation is retired. The weekly collection review manages the skill collection; pin, unpin, and restore no longer exist.";
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
/** Single reader for recorded usage; callers pass canonical skill files. */
function readSkillUsageByFile(skillFiles, options = {}) {
	if (skillFiles.length === 0) return /* @__PURE__ */ new Map();
	const { database, kysely } = curatorDb(options);
	const rows = executeSqliteQuerySync(database.db, kysely.selectFrom("skill_usage").select([
		"skill_file",
		"last_used_at_ms",
		"use_count"
	]).where("skill_file", "in", [...skillFiles])).rows;
	return new Map(rows.map((row) => [row.skill_file, {
		lastUsedAtMs: row.last_used_at_ms,
		useCount: row.use_count
	}]));
}
function getSkillCuratorStatus(options = {}) {
	const { database, kysely } = curatorDb(options);
	const state = readConfigMachineState("skills.curatorState", options);
	const reviewOutcomes = readSkillReviewOutcomes(options);
	const proposalRows = executeSqliteQuerySync(database.db, kysely.selectFrom("skill_workshop_proposals").selectAll().where("kind", "=", "create").where("status", "=", "applied").orderBy("applied_at", "asc").orderBy("proposal_id", "asc")).rows;
	const curatedByFile = /* @__PURE__ */ new Map();
	for (const row of proposalRows) {
		const record = parseSkillProposalRow(row);
		if (!record || record.createdBy !== "skill-workshop" || !record.appliedAt) continue;
		const appliedAtMs = Date.parse(record.appliedAt);
		const skillFile = canonicalizePath(record.target.skillFile);
		if (!Number.isFinite(appliedAtMs) || !fs.existsSync(skillFile)) continue;
		const existing = curatedByFile.get(skillFile);
		if (existing) {
			existing.createdAtMs = Math.min(existing.createdAtMs, appliedAtMs);
			continue;
		}
		curatedByFile.set(skillFile, {
			skillFile,
			skillKey: canonicalSkillKey(record.target.skillKey || record.target.skillName),
			skillName: record.target.skillName,
			createdAtMs: appliedAtMs
		});
	}
	const curatedSkills = [...curatedByFile.values()].toSorted((left, right) => left.skillFile.localeCompare(right.skillFile));
	const usageByFile = readSkillUsageByFile(curatedSkills.map((skill) => skill.skillFile), options);
	const skills = curatedSkills.map((skill) => {
		const usage = usageByFile.get(skill.skillFile);
		return {
			skillFile: skill.skillFile,
			skillKey: skill.skillKey,
			skillName: skill.skillName,
			createdAtMs: skill.createdAtMs,
			state: "active",
			pinned: false,
			stateChangedAtMs: skill.createdAtMs,
			lastUsedAtMs: usage?.lastUsedAtMs ?? null,
			useCount: usage?.useCount ?? 0,
			archivedReason: null
		};
	});
	return {
		lastAttemptAtMs: state?.lastAttemptAtMs ?? null,
		lastSuccessAtMs: state?.lastSuccessAtMs ?? null,
		lastError: state?.lastError ?? null,
		collectionReview: reviewOutcomes.collectionReviews,
		experienceReview: reviewOutcomes.experienceReviews,
		counts: {
			active: skills.length,
			stale: 0,
			archived: 0
		},
		skills,
		overlaps: []
	};
}
function recordSkillUsage(event, options = {}) {
	const rawSkillFile = event.skillFile?.trim();
	if (!rawSkillFile || !path.isAbsolute(rawSkillFile)) {
		log.debug(`skipping skill usage without file identity: ${event.skillName}`);
		return;
	}
	const skillFile = canonicalizePath(path.resolve(rawSkillFile));
	const skillKey = canonicalSkillKey(event.skillName);
	runOpenClawStateWriteTransaction(({ db }) => {
		executeSqliteQuerySync(db, getNodeSqliteKysely(db).insertInto("skill_usage").values({
			skill_file: skillFile,
			skill_key: skillKey,
			skill_name: event.skillName,
			skill_source: event.skillSource,
			first_used_at_ms: event.ts,
			last_used_at_ms: event.ts,
			use_count: 1,
			last_agent_id: event.agentId ?? null
		}).onConflict((conflict) => conflict.column("skill_file").doUpdateSet((eb) => ({
			skill_key: skillKey,
			skill_name: event.skillName,
			skill_source: event.skillSource,
			first_used_at_ms: eb.fn("min", [eb.ref("first_used_at_ms"), eb.val(event.ts)]),
			last_used_at_ms: eb.fn("max", [eb.ref("last_used_at_ms"), eb.val(event.ts)]),
			use_count: eb("use_count", "+", 1),
			last_agent_id: eb.case().when("last_used_at_ms", "<=", event.ts).then(event.agentId ?? null).else(eb.ref("last_agent_id")).end()
		}))));
	}, options);
}
/** Listener failures must never propagate into the tool execution that emitted usage. */
function registerSkillUsageTracking(options = {}) {
	return onTrustedInternalDiagnosticEvent((event, metadata, privateData) => {
		if (!metadata.trusted || event.type !== "skill.used") return;
		try {
			recordSkillUsage({
				...event,
				skillFile: privateData.skillUsage?.skillFile
			}, options);
		} catch (error) {
			log.warn(`failed to record skill usage: ${String(error)}`);
		}
	});
}
function clearSkillUsageForRemovedSkills(skillFiles, options = {}) {
	if (skillFiles.length === 0) return;
	runOpenClawStateWriteTransaction(({ db }) => {
		executeSqliteQuerySync(db, getNodeSqliteKysely(db).deleteFrom("skill_usage").where("skill_file", "in", skillFiles.map((skillFile) => canonicalizePath(skillFile))));
	}, options);
}
//#endregion
export { registerSkillUsageTracking as a, readSkillUsageByFile as i, clearSkillUsageForRemovedSkills as n, getSkillCuratorStatus as r, SKILL_LIFECYCLE_CURATION_RETIRED_MESSAGE as t };
