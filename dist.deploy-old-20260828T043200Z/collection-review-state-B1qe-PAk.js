import { r as asNullableRecord } from "./record-coerce-DItp3I4t.js";
import { r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
import { An as executeSqliteQuerySync, Mn as getNodeSqliteKysely, d as openOpenClawStateDatabase, h as runOpenClawStateWriteTransaction } from "./openclaw-state-db-CeAO_dqo.js";
import { a as sha256Hex } from "./crypto-digest-IGAbV2KW.js";
import { a as updateConfigMachineState, r as readConfigMachineState } from "./config-machine-state-FNVGu8mV.js";
import { n as withOpenClawStateLease } from "./openclaw-state-lease-Bw2pQRks.js";
import { o as databaseOptions, s as ensureSkillWorkshopSchema } from "./store-sqlite-record-CsO0xTyk.js";
import path from "node:path";
import { randomUUID } from "node:crypto";
//#region src/skills/workshop/collection-review-state.ts
const REVIEW_CLAIM_MS = 11 * 6e4;
const SKILL_COLLECTION_REVIEW_RETENTION_COUNT = 90;
const SKILL_COLLECTION_REVIEW_HISTORY_LIMIT = 20;
function workspaceKey(workspaceDir) {
	return sha256Hex(path.resolve(workspaceDir));
}
async function withSkillCollectionReviewClaim(workspaceDir, run, options = {}) {
	return await withOpenClawStateLease({
		scope: "skill-collection-review",
		key: workspaceKey(workspaceDir),
		database: {
			scope: "shared",
			options
		},
		leaseMs: REVIEW_CLAIM_MS,
		waitMs: 0,
		leaseLabel: "skill collection review claim",
		operationLabel: "skill-collection.review"
	}, async () => await run());
}
function reviewMap(state, field) {
	return asNullableRecord(state[field]) ?? {};
}
function readReviewState(options) {
	return asNullableRecord(readConfigMachineState("skills.curatorState", options)?.lastResult) ?? {};
}
function readSkillReviewOutcomes(options = {}) {
	const state = readReviewState(options);
	return {
		collectionReviews: reviewMap(state, "collectionReviews"),
		experienceReviews: reviewMap(state, "experienceReviews")
	};
}
function recordSkillCollectionReviewStatus(workspaceDir, review, options = {}) {
	const status = review.error !== void 0 ? {
		attemptedAtMs: review.attemptedAtMs,
		error: formatErrorMessage(review.error).slice(0, 300)
	} : {
		attemptedAtMs: review.attemptedAtMs,
		...review.succeededAtMs !== void 0 ? { succeededAtMs: review.succeededAtMs } : {}
	};
	recordWorkspaceReview("collectionReviews", workspaceDir, status, {
		lastAttemptAtMs: status.attemptedAtMs,
		...status.succeededAtMs !== void 0 ? { lastSuccessAtMs: status.succeededAtMs } : {},
		lastError: status.error ?? null
	}, options);
}
function recordSkillExperienceReviewOutcome(workspaceDir, review, options = {}) {
	recordWorkspaceReview("experienceReviews", workspaceDir, review, {}, options);
}
function recordWorkspaceReview(field, workspaceDir, review, columns, options) {
	updateConfigMachineState("skills.curatorState", (current) => {
		const state = asNullableRecord(current?.lastResult) ?? {};
		return {
			lastAttemptAtMs: 0,
			lastSuccessAtMs: null,
			lastError: null,
			...current,
			...columns,
			lastResult: {
				...state,
				[field]: {
					...asNullableRecord(state[field]),
					[workspaceKey(workspaceDir)]: review
				}
			}
		};
	}, options);
}
function parseStoredNames(value, field) {
	const parsed = JSON.parse(value);
	if (!Array.isArray(parsed) || !parsed.every((entry) => typeof entry === "string")) throw new Error(`Invalid ${field} in stored skill collection review.`);
	return parsed;
}
function parseStoredDrops(value) {
	const parsed = JSON.parse(value);
	if (!Array.isArray(parsed)) throw new Error("Invalid dropped entries in stored skill collection review.");
	return parsed.map((entry) => {
		const record = asNullableRecord(entry);
		if (!record || typeof record.name !== "string" || typeof record.reason !== "string") throw new Error("Invalid dropped entry in stored skill collection review.");
		return {
			name: record.name,
			reason: record.reason
		};
	});
}
function listSkillCollectionReviewOutcomes(workspaceDir, options = {}) {
	ensureSkillWorkshopSchema(options);
	const database = openOpenClawStateDatabase(databaseOptions(options));
	const kysely = getNodeSqliteKysely(database.db);
	return executeSqliteQuerySync(database.db, kysely.selectFrom("skill_workshop_collection_reviews").select([
		"backup_id",
		"create_time",
		"kept_names_json",
		"written_names_json",
		"dropped_json"
	]).where("workspace_dir", "=", path.resolve(workspaceDir)).orderBy("create_time", "desc").orderBy("review_id", "desc").limit(SKILL_COLLECTION_REVIEW_HISTORY_LIMIT)).rows.map((row) => ({
		createTime: row.create_time,
		backupId: row.backup_id,
		kept: parseStoredNames(row.kept_names_json, "kept names"),
		written: parseStoredNames(row.written_names_json, "written names"),
		dropped: parseStoredDrops(row.dropped_json)
	}));
}
function recordSkillCollectionReviewHistory(workspaceDir, nowMs, result, options = {}) {
	ensureSkillWorkshopSchema(options);
	runOpenClawStateWriteTransaction(({ db }) => {
		const kysely = getNodeSqliteKysely(db);
		const resolvedWorkspaceDir = path.resolve(workspaceDir);
		executeSqliteQuerySync(db, kysely.insertInto("skill_workshop_collection_reviews").values({
			review_id: randomUUID(),
			workspace_dir: resolvedWorkspaceDir,
			backup_id: result.backupId,
			create_time: nowMs,
			kept_names_json: JSON.stringify(result.kept),
			written_names_json: JSON.stringify(result.written),
			dropped_json: JSON.stringify(result.dropped)
		}));
		const retainedReviewIds = kysely.selectFrom("skill_workshop_collection_reviews").select("review_id").where("workspace_dir", "=", resolvedWorkspaceDir).orderBy("create_time", "desc").orderBy("review_id", "desc").limit(SKILL_COLLECTION_REVIEW_RETENTION_COUNT);
		executeSqliteQuerySync(db, kysely.deleteFrom("skill_workshop_collection_reviews").where("workspace_dir", "=", resolvedWorkspaceDir).where("review_id", "not in", retainedReviewIds));
	}, databaseOptions(options));
}
//#endregion
export { recordSkillExperienceReviewOutcome as a, recordSkillCollectionReviewStatus as i, readSkillReviewOutcomes as n, withSkillCollectionReviewClaim as o, recordSkillCollectionReviewHistory as r, listSkillCollectionReviewOutcomes as t };
