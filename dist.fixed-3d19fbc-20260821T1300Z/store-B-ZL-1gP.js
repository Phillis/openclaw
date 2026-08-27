import "./src-BkwWvwB2.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { t as safeParseJson } from "./json-coercion-ighRFv8Y.js";
import { r as root } from "./fs-safe-X_oyl7Rx.js";
import { w as resolveStateDir } from "./paths-CqeDjSA4.js";
import { b as createConfigIO } from "./io-BTBpQ7uO.js";
import { _ as getNodeSqliteKysely, g as executeSqliteQueryTakeFirstSync, h as executeSqliteQuerySync } from "./openclaw-state-db.paths-gKE3myqW.js";
import { d as openOpenClawStateDatabase, h as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BciZ4rHE.js";
import { a as sha256Hex } from "./crypto-digest-PR8Utwzg.js";
import { i as logWarn } from "./logger-frf2HPJn.js";
import { n as ok, t as err } from "./result-BQGgYouL.js";
import "./config-CfeGo4K4.js";
import { t as getGlobalHookRunner } from "./hook-runner-global-BgVsqem2.js";
import { t as extractFrontmatterBlock } from "./frontmatter-4ex1ODAy.js";
import { a as normalizeSkillIndexName, o as canonicalizePath } from "./skill-index-CEvOAhOd.js";
import { t as parseSkillFrontmatter } from "./frontmatter-BE0jYufM.js";
import { t as bumpSkillsSnapshotVersion } from "./refresh-state-DHnXO3IV.js";
import { t as resolveSkillWorkshopConfig } from "./config-Cjp42tXL.js";
import { n as resolveAllowedSkillSymlinkTargetRealPaths } from "./symlink-targets-dMASWnA_.js";
import { d as readWorkspaceSupportFile, f as restoreWorkspaceSkillMutation, i as assertWorkspaceSkillSupportPathSetIsFileOnly, l as prepareWorkspaceSkillRestoration, r as assertInsideWorkspace, s as normalizeWorkspaceSkillSupportPath, t as MAX_WORKSPACE_SKILL_SUPPORT_FILE_BYTES, u as readWorkspaceSkillFile } from "./workspace-skill-write-easKKFn3.js";
import { n as withOpenClawStateLease } from "./openclaw-state-lease-CzwHXlqF.js";
import { t as removePathWithinRoot } from "./fs-safe-remove-CINlCDxp.js";
import crypto, { randomUUID } from "node:crypto";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/skills/workshop/frontmatter.ts
function yamlScalar(value) {
	return JSON.stringify(value);
}
/** Renders proposal markdown while preserving allowed original frontmatter fields. */
function renderProposalMarkdown(params) {
	const originalFrontmatter = extractFrontmatterBlock(params.content)?.block ?? (params.fallbackFrontmatterContent ? extractFrontmatterBlock(params.fallbackFrontmatterContent)?.block : void 0);
	const keptFrontmatter = originalFrontmatter ? filterFrontmatterBlock(originalFrontmatter, [
		"name",
		"description",
		"status",
		"version",
		"date"
	]) : "";
	const body = (extractFrontmatterBlock(params.content)?.body ?? normalizeNewlines(params.content)).trimStart();
	const version = params.version ?? "v1";
	const date = params.date ?? (/* @__PURE__ */ new Date()).toISOString();
	const markdown = `---\n${[
		`name: ${yamlScalar(params.name)}`,
		`description: ${yamlScalar(params.description)}`,
		"status: proposal",
		`version: ${yamlScalar(version)}`,
		`date: ${yamlScalar(date)}`,
		keptFrontmatter
	].filter(Boolean).join("\n")}\n---\n\n${body}`;
	return markdown.endsWith("\n") ? markdown : `${markdown}\n`;
}
function readProposalFrontmatter(content) {
	const frontmatter = parseSkillFrontmatter(content);
	const name = frontmatter.name?.trim();
	const description = frontmatter.description?.trim();
	const status = frontmatter.status?.trim().toLowerCase();
	if (!name || !description || status !== "proposal") return null;
	return {
		name,
		description
	};
}
function stripProposalFrontmatterForSkill(content) {
	const normalized = normalizeNewlines(content);
	const extracted = extractFrontmatterBlock(normalized);
	if (!extracted) return normalized.endsWith("\n") ? normalized : `${normalized}\n`;
	const body = extracted.body.replace(/^\n+/, "");
	const keptLines = extracted.block.split("\n").filter((line) => {
		const key = line.match(/^([\w-]+):/)?.[1]?.toLowerCase();
		return key !== "status" && key !== "version" && key !== "date";
	}).join("\n").trim();
	const result = keptLines ? `---\n${keptLines}\n---\n\n${body}` : body;
	return result.endsWith("\n") ? result : `${result}\n`;
}
function filterFrontmatterBlock(block, keysToDrop) {
	const drop = new Set(keysToDrop.map((key) => key.toLowerCase()));
	const lines = block.split("\n");
	const kept = [];
	let dropping = false;
	for (const line of lines) {
		const key = line.match(/^([\w-]+):/)?.[1]?.toLowerCase();
		if (key) dropping = drop.has(key);
		if (!dropping) kept.push(line);
	}
	return kept.join("\n").trim();
}
function normalizeNewlines(content) {
	return content.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n").replace(/\r/g, "\n");
}
//#endregion
//#region src/skills/workshop/revision-hash.ts
function hashSkillProposalRevision(record) {
	return sha256Hex(JSON.stringify({
		proposedVersion: record.proposedVersion,
		contentSha256: record.draftHash,
		supportFiles: (record.supportFiles ?? []).map((file) => ({
			path: file.path,
			sha256: file.hash,
			sizeBytes: file.sizeBytes
		})).toSorted((left, right) => left.path.localeCompare(right.path))
	}));
}
//#endregion
//#region src/skills/workshop/plugin-hooks.ts
const MAX_SKILL_PROPOSAL_CORRELATION_ID_LENGTH = 256;
function normalizeSkillProposalCorrelationId(value) {
	const normalized = value?.trim();
	if (!normalized) return;
	if (Array.from(normalized).length > MAX_SKILL_PROPOSAL_CORRELATION_ID_LENGTH) throw new Error(`Skill proposal correlation id exceeds ${MAX_SKILL_PROPOSAL_CORRELATION_ID_LENGTH} characters.`);
	return normalized;
}
function createSkillProposalEvent(params) {
	const correlationId = normalizeSkillProposalCorrelationId(params.correlationId);
	return {
		eventId: randomUUID(),
		proposalId: params.record.id,
		proposedVersion: params.record.proposedVersion,
		revisionHash: hashSkillProposalRevision(params.record),
		type: params.type,
		occurredAt: params.occurredAt ?? (/* @__PURE__ */ new Date()).toISOString(),
		actor: params.actor ?? { type: "system" },
		...correlationId ? { correlationId } : {},
		...params.payload ? { payload: params.payload } : {},
		...params.evaluation ? { evaluation: params.evaluation } : {}
	};
}
function hasSkillProposalEvaluators() {
	return getGlobalHookRunner()?.hasHooks("skill_proposal_evaluate") ?? false;
}
async function runSkillProposalEvaluators(event, ctx) {
	const runner = getGlobalHookRunner();
	if (!runner?.hasHooks("skill_proposal_evaluate")) return [];
	return await runner.runSkillProposalEvaluate(event, ctx);
}
async function dispatchSkillProposalChanged(params) {
	const runner = getGlobalHookRunner();
	if (!runner?.hasHooks("skill_proposal_changed")) return;
	await runner.runSkillProposalChanged({
		eventId: params.event.eventId,
		sequence: params.event.sequence,
		action: params.event.type,
		occurredAt: params.event.occurredAt,
		...params.event.correlationId ? { correlationId: params.event.correlationId } : {},
		proposal: {
			id: params.record.id,
			kind: params.record.kind,
			status: params.record.status,
			revision: params.record.proposedVersion,
			revisionSha256: params.event.revisionHash,
			skillName: params.record.target.skillName,
			skillKey: params.record.target.skillKey,
			skillFile: params.record.target.skillFile,
			...params.record.target.source ? { source: params.record.target.source } : {}
		},
		...params.evaluations ? { evaluations: params.evaluations } : {}
	}, {
		workspaceDir: params.workspaceDir,
		...params.agentId ? { agentId: params.agentId } : {}
	});
}
//#endregion
//#region src/skills/workshop/proposal-hash.ts
function hashSkillProposalContent(content) {
	return sha256Hex(content);
}
//#endregion
//#region src/skills/workshop/types.ts
/** Schema id for persisted skill workshop proposal records. */
const SKILL_WORKSHOP_SCHEMA = "openclaw.skill-workshop.proposal.v1";
const SKILL_WORKSHOP_MANIFEST_SCHEMA = "openclaw.skill-workshop.proposals-manifest.v1";
const SKILL_WORKSHOP_ROLLBACK_SCHEMA = "openclaw.skill-workshop.rollback.v1";
const MAX_SKILL_PROPOSAL_ORIGIN_RUN_IDS = 4096;
//#endregion
//#region src/skills/workshop/proposal-origin-validation.ts
function isValidOrigin(value) {
	if (value === void 0) return true;
	if (!isRecord(value)) return false;
	return [
		"agentId",
		"sessionKey",
		"runId",
		"messageId"
	].every((key) => {
		const item = value[key];
		return item === void 0 || typeof item === "string";
	});
}
function isValidRunIds(value) {
	if (value === void 0) return true;
	if (!Array.isArray(value) || value.length > 4096) return false;
	const ids = /* @__PURE__ */ new Set();
	for (const item of value) {
		if (typeof item !== "string" || !item.trim() || ids.has(item)) return false;
		ids.add(item);
	}
	return true;
}
function isValidMutationCounts(value, originRunIds) {
	if (value === void 0) return true;
	if (!isRecord(value)) return false;
	const allowedIds = new Set(originRunIds);
	const entries = Object.entries(value);
	return entries.length <= 4096 && entries.every(([runId, count]) => Boolean(runId.trim()) && allowedIds.has(runId) && typeof count === "number" && Number.isSafeInteger(count) && count > 0);
}
function hasValidProposalOriginProvenance(value) {
	return isValidOrigin(value.origin) && isValidRunIds(value.originRunIds) && isValidMutationCounts(value.originRunMutationCounts, value.originRunIds);
}
//#endregion
//#region src/skills/workshop/store-record.ts
const PROPOSAL_DRAFT_FILE = "PROPOSAL.md";
const MAX_SKILL_PROPOSAL_EVALUATION_BYTES = 512 * 1024;
const PROPOSAL_ID_PATTERN = /^[a-z0-9][a-z0-9-]{5,120}$/;
function assertSkillProposalEvaluationWithinLimit(evaluation) {
	if (Buffer.byteLength(JSON.stringify(evaluation), "utf8") > 524288) throw new Error(`Skill proposal evaluation exceeds ${MAX_SKILL_PROPOSAL_EVALUATION_BYTES} bytes.`);
}
function assertProposalId(proposalId) {
	if (!PROPOSAL_ID_PATTERN.test(proposalId)) throw new Error("Invalid skill proposal id.");
}
function validateSkillProposalRecord(raw) {
	if (!isRecord(raw)) return invalidMetadata("proposal");
	const record = raw;
	if (record.schema !== "openclaw.skill-workshop.proposal.v1" || !PROPOSAL_ID_PATTERN.test(record.id) || record.kind !== "create" && record.kind !== "update" || ![
		"pending",
		"applied",
		"rejected",
		"quarantined",
		"stale"
	].includes(record.status) || typeof record.title !== "string" || typeof record.description !== "string" || typeof record.createdAt !== "string" || typeof record.updatedAt !== "string" || record.autonomousCapture !== void 0 && !record.autonomousCapture || typeof record.draftHash !== "string" || record.draftFile !== "PROPOSAL.md" || !hasValidProposalOriginProvenance(record) || !isValidSupportFileList(record.supportFiles) || record.evaluation !== void 0 && !parseSkillProposalEvaluation(record.evaluation) || !record.target || typeof record.target !== "object" || typeof record.target.skillName !== "string" || typeof record.target.skillKey !== "string" || typeof record.target.skillDir !== "string" || typeof record.target.skillFile !== "string" || !record.scan || typeof record.scan !== "object") return invalidMetadata("proposal");
	return ok(record);
}
function parseSkillProposalRecord(raw) {
	const result = validateSkillProposalRecord(raw);
	return result.ok ? result.value : null;
}
function parseSkillProposalEvaluation(raw) {
	if (!isRecord(raw)) return null;
	const value = raw;
	if (typeof value.id === "string" && value.id.length > 0 && value.id.length <= 128 && typeof value.proposedVersion === "string" && typeof value.revisionHash === "string" && /^[a-f0-9]{64}$/i.test(value.revisionHash) && (value.trigger === "manual" || value.trigger === "apply") && typeof value.startedAt === "string" && typeof value.completedAt === "string" && (value.correlationId === void 0 || typeof value.correlationId === "string" && value.correlationId.length > 0 && Array.from(value.correlationId).length <= 256) && (value.targetTreeSha256 === void 0 || typeof value.targetTreeSha256 === "string" && /^[a-f0-9]{64}$/i.test(value.targetTreeSha256)) && Array.isArray(value.outcomes) && value.outcomes.length <= 64 && value.outcomes.every(isValidEvaluationOutcome)) return value;
	return null;
}
function isValidEvaluationOutcome(value) {
	if (!isRecord(value)) return false;
	const outcome = value;
	if (typeof outcome.evaluatorId !== "string" || outcome.evaluatorId.length === 0 || outcome.evaluatorId.length > 128 || typeof outcome.pluginId !== "string" || outcome.pluginId.length === 0 || outcome.pluginId.length > 128 || outcome.pluginVersion !== void 0 && (typeof outcome.pluginVersion !== "string" || outcome.pluginVersion.length > 128)) return false;
	if (outcome.status === "skipped") return true;
	if (outcome.status === "error") return typeof outcome.error === "string" && outcome.error.length <= 2e3;
	return outcome.status === "completed" && isValidEvaluationResult(outcome.result);
}
function isValidEvaluationResult(value) {
	if (!isRecord(value)) return false;
	const result = value;
	return (result.summary === void 0 || typeof result.summary === "string" && result.summary.length <= 8e3) && (result.evaluatorVersion === void 0 || typeof result.evaluatorVersion === "string" && result.evaluatorVersion.length <= 128) && (result.mode === void 0 || typeof result.mode === "string" && result.mode.length <= 128) && (result.decision === void 0 || [
		"pass",
		"revise",
		"block"
	].includes(result.decision)) && (result.decisionReason === void 0 || typeof result.decisionReason === "string" && result.decisionReason.length <= 2e3) && isValidEvaluationFindings(result.findings) && isValidEvaluationMetrics(result.metrics);
}
function isValidEvaluationFindings(value) {
	if (value === void 0) return true;
	return Array.isArray(value) && value.length <= 200 && value.every((finding) => finding && typeof finding === "object" && typeof finding.ruleId === "string" && finding.ruleId.length > 0 && finding.ruleId.length <= 256 && [
		"info",
		"warn",
		"critical"
	].includes(finding.severity) && typeof finding.message === "string" && finding.message.length > 0 && finding.message.length <= 4e3 && (finding.file === void 0 || typeof finding.file === "string" && finding.file.length <= 1024) && (finding.line === void 0 || Number.isSafeInteger(finding.line) && finding.line >= 1));
}
function isValidEvaluationMetrics(value) {
	if (value === void 0) return true;
	if (!isRecord(value)) return false;
	const entries = Object.entries(value);
	return entries.length <= 64 && entries.every(([key, metric]) => key.length > 0 && key.length <= 128 && (typeof metric === "string" && metric.length <= 4e3 || typeof metric === "number" && Number.isFinite(metric) || typeof metric === "boolean"));
}
function isValidSupportFileList(value) {
	if (value === void 0) return true;
	if (!Array.isArray(value) || value.length > 64) return false;
	const seen = /* @__PURE__ */ new Set();
	for (const item of value) {
		if (!isRecord(item)) return false;
		const file = item;
		if (typeof file.path !== "string" || typeof file.hash !== "string" || !/^[a-f0-9]{64}$/i.test(file.hash) || typeof file.sizeBytes !== "number" || !Number.isSafeInteger(file.sizeBytes) || file.sizeBytes < 0 || file.sizeBytes > 262144 || file.targetExisted !== void 0 && typeof file.targetExisted !== "boolean" || file.targetContentHash !== void 0 && (typeof file.targetContentHash !== "string" || !/^[a-f0-9]{64}$/i.test(file.targetContentHash))) return false;
		let normalized;
		try {
			normalized = normalizeWorkspaceSkillSupportPath(file.path);
		} catch {
			return false;
		}
		if (seen.has(normalized)) return false;
		seen.add(normalized);
	}
	return true;
}
function validateSkillProposalRollback(raw) {
	if (!isRecord(raw)) return invalidMetadata("rollback");
	const rollback = raw;
	if (rollback.schema !== "openclaw.skill-workshop.rollback.v1" || !PROPOSAL_ID_PATTERN.test(rollback.proposalId) || typeof rollback.writtenAt !== "string" || typeof rollback.targetSkillFile !== "string" || rollback.action !== "create" && rollback.action !== "update" || rollback.previousContentHash !== void 0 && (typeof rollback.previousContentHash !== "string" || !/^[a-f0-9]{64}$/i.test(rollback.previousContentHash)) || rollback.previousContent !== void 0 && typeof rollback.previousContent !== "string" || rollback.supportFiles !== void 0 && !Array.isArray(rollback.supportFiles)) return invalidMetadata("rollback");
	return ok(rollback);
}
function parseSkillProposalRollback(raw) {
	const result = validateSkillProposalRollback(raw);
	return result.ok ? result.value : null;
}
function invalidMetadata(kind) {
	return err({
		code: `invalid-${kind}-metadata`,
		message: `invalid ${kind} metadata`
	});
}
//#endregion
//#region src/skills/workshop/store-sqlite-schema.ts
const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS skill_workshop_proposals (
  proposal_id TEXT NOT NULL PRIMARY KEY,
  record_json TEXT NOT NULL,
  owner_agent_id TEXT,
  workspace_dir TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('create', 'update')),
  status TEXT NOT NULL CHECK (status IN ('pending', 'applied', 'rejected', 'quarantined', 'stale')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  draft_hash TEXT NOT NULL,
  origin_agent_id TEXT,
  origin_session_key TEXT,
  origin_run_id TEXT,
  origin_message_id TEXT,
  applied_at TEXT,
  rejected_at TEXT,
  quarantined_at TEXT,
  stale_at TEXT,
  status_reason TEXT
) STRICT;

CREATE TABLE IF NOT EXISTS skill_workshop_proposal_origin_runs (
  proposal_id TEXT NOT NULL,
  run_id TEXT NOT NULL,
  position INTEGER NOT NULL,
  mutation_count INTEGER NOT NULL CHECK (mutation_count > 0),
  PRIMARY KEY (proposal_id, run_id),
  FOREIGN KEY (proposal_id) REFERENCES skill_workshop_proposals(proposal_id) ON DELETE CASCADE
) STRICT;

CREATE TABLE IF NOT EXISTS skill_workshop_proposal_rollbacks (
  proposal_id TEXT NOT NULL PRIMARY KEY,
  written_at TEXT NOT NULL,
  target_skill_file TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('create', 'update')),
  previous_content_hash TEXT,
  previous_content TEXT,
  support_files_json TEXT,
  FOREIGN KEY (proposal_id) REFERENCES skill_workshop_proposals(proposal_id) ON DELETE CASCADE
) STRICT;

CREATE TABLE IF NOT EXISTS skill_workshop_proposal_events (
  sequence INTEGER PRIMARY KEY AUTOINCREMENT,
  event_id TEXT NOT NULL UNIQUE,
  proposal_id TEXT NOT NULL,
  proposed_version TEXT NOT NULL,
  revision_hash TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN (
    'created',
    'revised',
    'evaluation_completed',
    'applied',
    'rejected',
    'quarantined',
    'stale'
  )),
  occurred_at TEXT NOT NULL,
  actor_json TEXT NOT NULL,
  correlation_id TEXT,
  payload_json TEXT,
  FOREIGN KEY (proposal_id) REFERENCES skill_workshop_proposals(proposal_id) ON DELETE CASCADE
) STRICT;

CREATE INDEX IF NOT EXISTS idx_skill_workshop_proposal_events_proposal
  ON skill_workshop_proposal_events(proposal_id, sequence);
`;
const ensuredDatabases = /* @__PURE__ */ new WeakSet();
function databaseOptions(options = {}) {
	if (options.stateDir) return {
		...options.env ? { env: options.env } : {},
		path: path.join(path.resolve(options.stateDir), "state", "openclaw.sqlite")
	};
	return options.env ? { env: options.env } : {};
}
function ensureSkillWorkshopSchema(options = {}) {
	const dbOptions = databaseOptions(options);
	const database = openOpenClawStateDatabase(dbOptions);
	if (ensuredDatabases.has(database.db)) return;
	runOpenClawStateWriteTransaction(({ db }) => {
		db.exec(SCHEMA_SQL);
	}, dbOptions, { operationLabel: "skill-workshop.schema.ensure" });
	ensuredDatabases.add(database.db);
}
function openSkillWorkshopStore(options = {}) {
	ensureSkillWorkshopSchema(options);
	const database = openOpenClawStateDatabase(databaseOptions(options));
	return {
		database,
		kysely: getNodeSqliteKysely(database.db)
	};
}
//#endregion
//#region src/skills/workshop/store-sqlite-record.ts
function parseJson(value) {
	return value === null ? void 0 : safeParseJson(value);
}
function parseSkillProposalRow(row) {
	const record = parseSkillProposalRecord(parseJson(row.record_json));
	if (!record || record.id !== row.proposal_id || record.kind !== row.kind || record.status !== row.status || record.createdAt !== row.created_at || record.updatedAt !== row.updated_at || record.draftHash !== row.draft_hash || record.origin?.agentId !== (row.origin_agent_id ?? void 0) || record.origin?.sessionKey !== (row.origin_session_key ?? void 0) || record.origin?.runId !== (row.origin_run_id ?? void 0) || record.origin?.messageId !== (row.origin_message_id ?? void 0)) return null;
	return record;
}
function readStoredProposal(proposalId, options = {}) {
	const { database, kysely } = openSkillWorkshopStore(options);
	const row = executeSqliteQueryTakeFirstSync(database.db, kysely.selectFrom("skill_workshop_proposals").selectAll().where("proposal_id", "=", proposalId));
	if (!row) return null;
	const record = parseSkillProposalRow(row);
	return record ? {
		record,
		row
	} : null;
}
function proposalRowValues(params) {
	const { record } = params;
	return {
		proposal_id: record.id,
		record_json: JSON.stringify(record),
		owner_agent_id: params.ownerAgentId,
		workspace_dir: path.resolve(params.workspaceDir),
		kind: record.kind,
		status: record.status,
		created_at: record.createdAt,
		updated_at: record.updatedAt,
		draft_hash: record.draftHash,
		origin_agent_id: record.origin?.agentId ?? null,
		origin_session_key: record.origin?.sessionKey ?? null,
		origin_run_id: record.origin?.runId ?? null,
		origin_message_id: record.origin?.messageId ?? null,
		applied_at: record.appliedAt ?? null,
		rejected_at: record.rejectedAt ?? null,
		quarantined_at: record.quarantinedAt ?? null,
		stale_at: record.staleAt ?? null,
		status_reason: record.statusReason ?? null
	};
}
function replaceOriginRuns(database, record, kysely = getNodeSqliteKysely(database)) {
	executeSqliteQuerySync(database, kysely.deleteFrom("skill_workshop_proposal_origin_runs").where("proposal_id", "=", record.id));
	record.originRunIds?.forEach((runId, position) => {
		executeSqliteQuerySync(database, kysely.insertInto("skill_workshop_proposal_origin_runs").values({
			proposal_id: record.id,
			run_id: runId,
			position,
			mutation_count: record.originRunMutationCounts?.[runId] ?? 1
		}));
	});
}
function insertProposal(database, params) {
	const kysely = getNodeSqliteKysely(database);
	executeSqliteQuerySync(database, kysely.insertInto("skill_workshop_proposals").values(proposalRowValues(params)));
	replaceOriginRuns(database, params.record, kysely);
}
function updateProposal(database, current, record) {
	const kysely = getNodeSqliteKysely(database);
	const { proposal_id: _proposalId, ...values } = proposalRowValues({
		record,
		ownerAgentId: current.owner_agent_id,
		workspaceDir: current.workspace_dir
	});
	executeSqliteQuerySync(database, kysely.updateTable("skill_workshop_proposals").set(values).where("proposal_id", "=", record.id));
	replaceOriginRuns(database, record, kysely);
}
//#endregion
//#region src/skills/workshop/store-sqlite-rollback.ts
function removeOtherPendingTargetRollbacks(database, params) {
	const kysely = getNodeSqliteKysely(database);
	const rows = executeSqliteQuerySync(database, kysely.selectFrom("skill_workshop_proposal_rollbacks").innerJoin("skill_workshop_proposals", "skill_workshop_proposals.proposal_id", "skill_workshop_proposal_rollbacks.proposal_id").select("skill_workshop_proposal_rollbacks.proposal_id as proposalId").where("skill_workshop_proposal_rollbacks.target_skill_file", "=", params.targetSkillFile).where("skill_workshop_proposals.status", "=", "pending").where("skill_workshop_proposals.proposal_id", "!=", params.proposalId)).rows;
	for (const row of rows) executeSqliteQuerySync(database, kysely.deleteFrom("skill_workshop_proposal_rollbacks").where("proposal_id", "=", row.proposalId));
}
async function writeSkillProposalRollback(params) {
	assertProposalId(params.proposalId);
	ensureSkillWorkshopSchema(params.store);
	runOpenClawStateWriteTransaction(({ db }) => {
		const kysely = getNodeSqliteKysely(db);
		const proposal = executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("skill_workshop_proposals").select([
			"proposal_id",
			"kind",
			"status"
		]).where("proposal_id", "=", params.proposalId));
		if (!proposal) throw new Error(`Skill proposal not found: ${params.proposalId}`);
		if (proposal.status !== "pending") throw new Error(`Only pending proposals can be applied. Current status: ${proposal.status}.`);
		removeOtherPendingTargetRollbacks(db, {
			proposalId: params.proposalId,
			targetSkillFile: params.rollback.targetSkillFile
		});
		executeSqliteQuerySync(db, kysely.insertInto("skill_workshop_proposal_rollbacks").values({
			proposal_id: params.proposalId,
			written_at: params.rollback.writtenAt,
			target_skill_file: params.rollback.targetSkillFile,
			action: params.rollback.action,
			previous_content_hash: params.rollback.previousContentHash ?? null,
			previous_content: params.rollback.previousContent ?? null,
			support_files_json: params.rollback.supportFiles ? JSON.stringify(params.rollback.supportFiles) : null
		}).onConflict((conflict) => conflict.column("proposal_id").doUpdateSet({
			written_at: params.rollback.writtenAt,
			target_skill_file: params.rollback.targetSkillFile,
			action: params.rollback.action,
			previous_content_hash: params.rollback.previousContentHash ?? null,
			previous_content: params.rollback.previousContent ?? null,
			support_files_json: params.rollback.supportFiles ? JSON.stringify(params.rollback.supportFiles) : null
		})));
	}, databaseOptions(params.store), { operationLabel: "skill-workshop.rollback.write" });
}
async function readSkillProposalRollback(proposalId, options = {}) {
	assertProposalId(proposalId);
	const { database, kysely } = openSkillWorkshopStore(options);
	const row = executeSqliteQueryTakeFirstSync(database.db, kysely.selectFrom("skill_workshop_proposal_rollbacks").selectAll().where("proposal_id", "=", proposalId));
	if (!row) return null;
	return parseSkillProposalRollback({
		schema: SKILL_WORKSHOP_ROLLBACK_SCHEMA,
		proposalId: row.proposal_id,
		writtenAt: row.written_at,
		targetSkillFile: row.target_skill_file,
		action: row.action,
		...row.previous_content_hash ? { previousContentHash: row.previous_content_hash } : {},
		...row.previous_content !== null ? { previousContent: row.previous_content } : {},
		...row.support_files_json ? { supportFiles: parseJson(row.support_files_json) } : {}
	});
}
async function clearSkillProposalRollback(params) {
	assertProposalId(params.proposalId);
	ensureSkillWorkshopSchema(params.store);
	return runOpenClawStateWriteTransaction(({ db }) => {
		const kysely = getNodeSqliteKysely(db);
		const proposal = executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("skill_workshop_proposals").select(["record_json", "status"]).where("proposal_id", "=", params.proposalId));
		if (!proposal || proposal.status !== "pending" || proposal.record_json !== params.expectedRecordJson) return false;
		executeSqliteQuerySync(db, kysely.deleteFrom("skill_workshop_proposal_rollbacks").where("proposal_id", "=", params.proposalId));
		return true;
	}, databaseOptions(params.store), { operationLabel: "skill-workshop.rollback.clear" });
}
//#endregion
//#region src/skills/workshop/store-sqlite-event.ts
const STORED_EVENT_DATA_VERSION = 1;
const MAX_SKILL_PROPOSAL_EVENT_DATA_BYTES = 589824;
const MAX_SKILL_PROPOSAL_EVENTS_RESPONSE_BYTES = 2 * 1024 * 1024;
function appendSkillProposalEvent(database, event) {
	if (event.evaluation) assertSkillProposalEvaluationWithinLimit(event.evaluation);
	const storedData = event.payload || event.evaluation ? JSON.stringify([
		STORED_EVENT_DATA_VERSION,
		event.payload ?? null,
		event.evaluation ?? null
	]) : null;
	if (storedData && Buffer.byteLength(storedData, "utf8") > MAX_SKILL_PROPOSAL_EVENT_DATA_BYTES) throw new Error(`Skill proposal event data exceeds ${MAX_SKILL_PROPOSAL_EVENT_DATA_BYTES} bytes.`);
	const inserted = executeSqliteQueryTakeFirstSync(database, getNodeSqliteKysely(database).insertInto("skill_workshop_proposal_events").values({
		event_id: event.eventId,
		proposal_id: event.proposalId,
		proposed_version: event.proposedVersion,
		revision_hash: event.revisionHash,
		event_type: event.type,
		occurred_at: event.occurredAt,
		actor_json: JSON.stringify(event.actor),
		correlation_id: event.correlationId ?? null,
		payload_json: storedData
	}).returning("sequence"));
	if (!inserted) throw new Error(`Failed to append Skill Workshop event: ${event.eventId}`);
	return {
		...event,
		sequence: inserted.sequence
	};
}
function readStoredSkillProposalEvent(eventId, options = {}) {
	const { database, kysely } = openSkillWorkshopStore(options);
	const row = executeSqliteQueryTakeFirstSync(database.db, kysely.selectFrom("skill_workshop_proposal_events").selectAll().where("event_id", "=", eventId));
	return row ? parseStoredSkillProposalEventRow(row) : null;
}
function listStoredSkillProposalEvents(input, options = {}) {
	const { database, kysely } = openSkillWorkshopStore(options);
	const limit = Math.min(Math.max(input.limit ?? 100, 1), 200);
	let query = kysely.selectFrom("skill_workshop_proposal_events").innerJoin("skill_workshop_proposals", "skill_workshop_proposals.proposal_id", "skill_workshop_proposal_events.proposal_id").select([
		"skill_workshop_proposal_events.sequence",
		"skill_workshop_proposal_events.event_id",
		"skill_workshop_proposal_events.proposal_id",
		"skill_workshop_proposal_events.proposed_version",
		"skill_workshop_proposal_events.revision_hash",
		"skill_workshop_proposal_events.event_type",
		"skill_workshop_proposal_events.occurred_at",
		"skill_workshop_proposal_events.actor_json",
		"skill_workshop_proposal_events.correlation_id",
		"skill_workshop_proposal_events.payload_json"
	]).where("skill_workshop_proposal_events.sequence", ">", input.afterSequence ?? 0);
	if (input.proposalId) query = query.where("skill_workshop_proposal_events.proposal_id", "=", input.proposalId);
	if (input.agentId) query = query.where((eb) => eb.or([eb("skill_workshop_proposals.owner_agent_id", "=", input.agentId), ...input.workspaceDir ? [eb.and([eb("skill_workshop_proposals.owner_agent_id", "is", null), eb("skill_workshop_proposals.workspace_dir", "=", path.resolve(input.workspaceDir))])] : []]));
	else if (input.workspaceDir) query = query.where("skill_workshop_proposals.workspace_dir", "=", path.resolve(input.workspaceDir));
	const rows = executeSqliteQuerySync(database.db, query.orderBy("skill_workshop_proposal_events.sequence", "asc").limit(limit + 1)).rows;
	let hasMore = rows.length > limit;
	let responseBytes = 2;
	const events = [];
	for (const row of rows.slice(0, limit)) {
		const event = parseStoredSkillProposalEventRow(row);
		if (!event) continue;
		const eventBytes = Buffer.byteLength(JSON.stringify(event), "utf8") + 1;
		if (events.length > 0 && responseBytes + eventBytes > MAX_SKILL_PROPOSAL_EVENTS_RESPONSE_BYTES) {
			hasMore = true;
			break;
		}
		events.push(event);
		responseBytes += eventBytes;
	}
	return {
		events,
		...hasMore && events.length > 0 ? { nextSequence: events[events.length - 1].sequence } : {}
	};
}
function parseStoredSkillProposalEventRow(row) {
	const actor = parseSkillProposalEventActor(parseJson(row.actor_json));
	if (!actor || !isSkillProposalEventType(row.event_type)) return null;
	if (row.payload_json && Buffer.byteLength(row.payload_json, "utf8") > MAX_SKILL_PROPOSAL_EVENT_DATA_BYTES) throw new Error(`Stored Skill Workshop event ${row.event_id} exceeds ${MAX_SKILL_PROPOSAL_EVENT_DATA_BYTES} bytes and cannot be replayed safely.`);
	const storedData = parseSkillProposalEventData(parseJson(row.payload_json));
	return {
		sequence: row.sequence,
		eventId: row.event_id,
		proposalId: row.proposal_id,
		proposedVersion: row.proposed_version,
		revisionHash: row.revision_hash,
		type: row.event_type,
		occurredAt: row.occurred_at,
		actor,
		...row.correlation_id ? { correlationId: row.correlation_id } : {},
		...storedData.payload ? { payload: storedData.payload } : {},
		...storedData.evaluation ? { evaluation: storedData.evaluation } : {}
	};
}
function isSkillProposalEventType(value) {
	return [
		"created",
		"revised",
		"evaluation_completed",
		"applied",
		"rejected",
		"quarantined",
		"stale"
	].includes(value);
}
function parseSkillProposalEventActor(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return null;
	const actor = value;
	if (![
		"agent",
		"gateway",
		"plugin",
		"system"
	].includes(actor.type) || actor.id !== void 0 && typeof actor.id !== "string") return null;
	return actor;
}
function parseSkillProposalEventData(value) {
	if (value === void 0) return {};
	if (Array.isArray(value)) {
		if (value.length !== 3 || value[0] !== STORED_EVENT_DATA_VERSION) return {};
		const payload = parseSkillProposalEventPayload(value[1]);
		const evaluation = parseSkillProposalEvaluation(value[2]) ?? void 0;
		return {
			...payload ? { payload } : {},
			...evaluation ? { evaluation } : {}
		};
	}
	const payload = parseSkillProposalEventPayload(value);
	return payload ? { payload } : {};
}
function parseSkillProposalEventPayload(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return;
	const entries = Object.entries(value);
	if (entries.length > 32 || entries.some(([key, item]) => !key || key.length > 80 || item !== null && typeof item !== "string" && typeof item !== "number" && typeof item !== "boolean")) return;
	if (entries.length === 0) return {};
	return Object.fromEntries(entries);
}
//#endregion
//#region src/skills/workshop/store-sqlite-transition.ts
function commitPendingSkillProposalTransition(params) {
	ensureSkillWorkshopSchema(params.store);
	return runOpenClawStateWriteTransaction(({ db }) => {
		const current = executeSqliteQueryTakeFirstSync(db, getNodeSqliteKysely(db).selectFrom("skill_workshop_proposals").selectAll().where("proposal_id", "=", params.expected.id));
		const currentRecord = current ? parseSkillProposalRow(current) : null;
		if (!current || !currentRecord || currentRecord.status !== "pending" || current.record_json !== JSON.stringify(params.expected)) return {
			state: "conflict",
			...currentRecord ? { current: currentRecord } : {}
		};
		updateProposal(db, current, params.record);
		return {
			state: "committed",
			...params.event ? { event: appendSkillProposalEvent(db, params.event) } : {}
		};
	}, databaseOptions(params.store), { operationLabel: params.operationLabel });
}
function readCommittedSkillProposalTransition(params) {
	const stored = readStoredProposal(params.record.id, params.store);
	if (!stored || stored.row.record_json !== JSON.stringify(params.record)) return null;
	const event = readStoredSkillProposalEvent(params.event.eventId, params.store);
	if (!event || event.proposalId !== params.event.proposalId || event.proposedVersion !== params.event.proposedVersion || event.revisionHash !== params.event.revisionHash || event.type !== params.event.type) return null;
	return {
		state: "committed",
		event
	};
}
//#endregion
//#region src/skills/workshop/collection-paths.ts
const BACKUP_REL_DIR = path.join("skill-workshop", "collection-backups");
function canonicalSkillCollectionWorkspace(workspaceDir) {
	return canonicalizePath(path.resolve(workspaceDir));
}
function resolveSkillCollectionBackupRoot(workspaceDir, env) {
	return path.join(resolveStateDir(env), BACKUP_REL_DIR, sha256Hex(canonicalSkillCollectionWorkspace(workspaceDir)).slice(0, 16));
}
async function pruneOlderSkillCollectionBackups(backupRoot, keepId) {
	try {
		for (const entry of await fs.readdir(backupRoot, { withFileTypes: true })) if (entry.isDirectory() && entry.name !== keepId) await removePathWithinRoot({
			rootDir: backupRoot,
			relativePath: entry.name,
			recursive: true,
			force: true
		});
	} catch (error) {
		logWarn(`skill-workshop: failed to prune older collection backups: ${String(error)}`);
	}
}
//#endregion
//#region src/skills/workshop/target-lock.ts
const TARGET_LEASE_MS = 6e4;
const TARGET_LEASE_WAIT_MS = 5e3;
const COLLECTION_LEASE_MS = 10 * 6e4;
async function withSkillCollectionLock(workspaceDir, fn, options = {}) {
	ensureSkillWorkshopSchema(options);
	return await withOpenClawStateLease({
		scope: "skill-collection",
		key: hashSkillProposalContent(canonicalSkillCollectionWorkspace(workspaceDir)),
		database: {
			scope: "shared",
			options: databaseOptions(options)
		},
		leaseMs: COLLECTION_LEASE_MS,
		waitMs: TARGET_LEASE_WAIT_MS,
		leaseLabel: "skill collection lease",
		operationLabel: "skill-collection.commit"
	}, async () => await fn());
}
async function withSkillProposalTargetLock(record, fn, options = {}) {
	ensureSkillWorkshopSchema(options);
	return await withOpenClawStateLease({
		scope: "skill-workshop-target",
		key: hashSkillProposalContent(record.target.skillFile),
		database: {
			scope: "shared",
			options: databaseOptions(options)
		},
		leaseMs: TARGET_LEASE_MS,
		waitMs: TARGET_LEASE_WAIT_MS,
		leaseLabel: "Skill Workshop target lease",
		operationLabel: "skill-workshop.target-lease"
	}, async () => await fn());
}
async function withSkillProposalCommitLock(workspaceDir, record, fn, options = {}) {
	return await withSkillCollectionLock(workspaceDir, async () => await withSkillProposalTargetLock(record, fn, options), options);
}
//#endregion
//#region src/skills/workshop/reconcile-transition.ts
async function reconcileInterruptedSkillProposalApply(params) {
	return await withSkillProposalCommitLock(params.workspaceDir, params.record, async () => {
		const stored = readStoredProposal(params.record.id, params.store);
		if (!stored || stored.record.status !== "pending" || stored.row.record_json !== params.expectedRecordJson) return false;
		const rollback = await readSkillProposalRollback(params.record.id, params.store);
		if (!rollback || !resolveRecoveryRollback(stored.record, rollback)) return false;
		if (hashSkillProposalContent(params.draftContent) !== stored.record.draftHash) return false;
		let proposedContent;
		try {
			proposedContent = stripProposalFrontmatterForSkill(params.draftContent);
		} catch {
			return false;
		}
		const recovery = await inspectInterruptedApplyState({
			record: stored.record,
			rollback,
			proposedContent
		}).catch(() => null);
		if (!recovery) return false;
		if (recovery.state === "proposed") {
			const now = (/* @__PURE__ */ new Date()).toISOString();
			const applied = {
				...stored.record,
				status: "applied",
				updatedAt: now,
				appliedAt: now
			};
			if (commitPendingSkillProposalTransition({
				expected: stored.record,
				record: applied,
				event: createSkillProposalEvent({
					record: applied,
					type: "applied",
					occurredAt: now,
					payload: { recovered: true }
				}),
				store: params.store,
				operationLabel: "skill-workshop.apply.reconcile"
			}).state !== "committed") return false;
			bumpSkillsSnapshotVersion({
				workspaceDir: params.workspaceDir,
				reason: "workshop",
				changedPath: stored.record.target.skillFile
			});
			return true;
		}
		if (recovery.state === "partial") {
			const config = params.config ?? await createConfigIO({
				...params.store?.env ? { env: params.store.env } : {},
				pluginValidation: "skip"
			}).readBestEffortConfig();
			const workshopConfig = resolveSkillWorkshopConfig(config);
			const restoration = await prepareWorkspaceSkillRestoration({
				workspaceDir: params.workspaceDir,
				skillDir: stored.record.target.skillDir,
				skillFile: stored.record.target.skillFile,
				previousContent: rollback.previousContent ?? null,
				proposedContentHash: hashSkillProposalContent(proposedContent),
				supportFiles: recovery.supportFiles,
				mode: stored.record.kind,
				symlinkPolicy: {
					allowWrites: workshopConfig.allowSymlinkTargetWrites,
					allowedTargetRealPaths: workshopConfig.allowSymlinkTargetWrites ? resolveAllowedSkillSymlinkTargetRealPaths(config) : []
				}
			});
			try {
				await restoreWorkspaceSkillMutation(restoration);
			} finally {
				bumpSkillsSnapshotVersion({
					workspaceDir: params.workspaceDir,
					reason: "workshop",
					changedPath: stored.record.target.skillFile
				});
			}
		}
		return await clearSkillProposalRollback({
			proposalId: stored.record.id,
			expectedRecordJson: params.expectedRecordJson,
			store: params.store
		});
	}, params.store).catch(() => false);
}
function resolveRecoveryRollback(record, rollback) {
	if (rollback.proposalId !== record.id || rollback.action !== record.kind || path.resolve(rollback.targetSkillFile) !== path.resolve(record.target.skillFile)) return null;
	if (record.kind === "create") {
		if (rollback.previousContent !== void 0 || rollback.previousContentHash !== void 0) return null;
	} else if (rollback.previousContent === void 0 || rollback.previousContentHash === void 0 || hashSkillProposalContent(rollback.previousContent) !== rollback.previousContentHash) return null;
	const proposedSupport = new Map((record.supportFiles ?? []).map((file) => [file.path, file]));
	const rollbackSupport = /* @__PURE__ */ new Set();
	for (const file of rollback.supportFiles ?? []) {
		let normalizedPath;
		try {
			normalizedPath = normalizeWorkspaceSkillSupportPath(file.path);
		} catch {
			return null;
		}
		if (normalizedPath !== file.path || !proposedSupport.has(normalizedPath) || rollbackSupport.has(normalizedPath) || file.existed && (file.previousContent === void 0 || file.previousContentHash === void 0 || hashSkillProposalContent(file.previousContent) !== file.previousContentHash) || !file.existed && (file.previousContent !== void 0 || file.previousContentHash !== void 0)) return null;
		rollbackSupport.add(normalizedPath);
	}
	if ([...proposedSupport.keys()].some((filePath) => !rollbackSupport.has(filePath))) return null;
	return rollback;
}
async function inspectInterruptedApplyState(params) {
	const mainState = classifyRecoveryFileState({
		currentContent: await readWorkspaceSkillFile(params.record.target.skillFile),
		previousContent: params.rollback.previousContent ?? null,
		proposedHash: hashSkillProposalContent(params.proposedContent)
	});
	if (!mainState) throw new Error("Interrupted Skill Workshop apply target does not match recovery facts.");
	const rollbackSupport = new Map((params.rollback.supportFiles ?? []).map((file) => [file.path, file]));
	const supportFiles = [];
	const supportStates = [];
	for (const file of params.record.supportFiles ?? []) {
		const rollbackFile = rollbackSupport.get(file.path);
		if (!rollbackFile) throw new Error(`Missing rollback facts for support file: ${file.path}`);
		const currentSupportContent = await readWorkspaceSupportFile({
			skillDir: params.record.target.skillDir,
			relativePath: file.path
		});
		const previousSupportContent = rollbackFile.previousContent ?? null;
		const state = classifyRecoveryFileState({
			currentContent: currentSupportContent,
			previousContent: previousSupportContent,
			proposedHash: file.hash
		});
		if (!state) throw new Error(`Interrupted Skill Workshop support target does not match recovery facts: ${file.path}`);
		supportStates.push(state);
		supportFiles.push({
			path: file.path,
			previousContent: previousSupportContent,
			proposedContentHash: file.hash
		});
	}
	const states = [mainState, ...supportStates];
	return {
		state: states.every((state) => state === "proposed") ? "proposed" : states.every((state) => state === "previous") ? "previous" : "partial",
		supportFiles
	};
}
function classifyRecoveryFileState(params) {
	if (params.currentContent === params.previousContent) return "previous";
	if (params.currentContent !== null && hashSkillProposalContent(params.currentContent) === params.proposedHash) return "proposed";
	return null;
}
//#endregion
//#region src/skills/workshop/store.ts
const PROPOSALS_REL_DIR = path.join("skill-workshop", "proposals");
const MAX_PROPOSAL_BYTES = 1024 * 1024;
const MAX_PROPOSAL_SUPPORT_FILES_TOTAL_BYTES = 2 * 1024 * 1024;
/** Creates a stable proposal id from skill name, date, and random suffix. */
function createSkillProposalId(name, now = /* @__PURE__ */ new Date()) {
	const normalized = normalizeSkillIndexName(name) || "skill";
	const date = now.toISOString().slice(0, 10).replaceAll("-", "");
	const suffix = crypto.randomUUID().replaceAll("-", "").slice(0, 10);
	return `${normalized.slice(0, 60)}-${date}-${suffix}`;
}
function contentSizeBytes(content) {
	return Buffer.byteLength(content, "utf8");
}
function assertSkillProposalContentSize(content) {
	if (contentSizeBytes(content) > MAX_PROPOSAL_BYTES) throw new Error("Skill proposal is too large.");
}
function resolveSkillWorkshopStateDir(options = {}) {
	return path.resolve(options.stateDir ?? resolveStateDir(options.env));
}
function proposalRelativeDir(proposalId) {
	assertProposalId(proposalId);
	return path.join(PROPOSALS_REL_DIR, proposalId);
}
function prepareSkillProposalSupportFiles(input) {
	if (!input || input.length === 0) return [];
	if (input.length > 64) throw new Error(`A skill proposal can include at most 64 files.`);
	const seen = /* @__PURE__ */ new Set();
	let totalBytes = 0;
	const files = [];
	for (const file of input) {
		const filePath = normalizeWorkspaceSkillSupportPath(file.path);
		if (seen.has(filePath)) throw new Error(`Duplicate support file path: ${filePath}`);
		seen.add(filePath);
		const sizeBytes = contentSizeBytes(file.content);
		if (sizeBytes > 262144) throw new Error(`Support file is too large: ${filePath}`);
		if (file.content.includes("\0")) throw new Error(`Support files must be UTF-8 text: ${filePath}`);
		totalBytes += sizeBytes;
		if (totalBytes > MAX_PROPOSAL_SUPPORT_FILES_TOTAL_BYTES) throw new Error("Skill proposal support files exceed the total size limit.");
		files.push({
			path: filePath,
			sizeBytes,
			hash: hashSkillProposalContent(file.content),
			content: file.content
		});
	}
	assertWorkspaceSkillSupportPathSetIsFileOnly(files.map((file) => file.path));
	return files;
}
function resolveSkillProposalTarget(params) {
	const skillKey = normalizeSkillIndexName(params.skillName);
	if (!skillKey) throw new Error("Skill name must contain at least one letter or number.");
	const skillDir = path.resolve(params.workspaceDir, "skills", skillKey);
	const skillFile = path.join(skillDir, "SKILL.md");
	assertInsideWorkspace(params.workspaceDir, skillDir, "skill directory");
	assertInsideWorkspace(params.workspaceDir, skillFile, "skill file");
	return {
		skillKey,
		skillDir,
		skillFile
	};
}
function isStoredProposalVisible(row, scope) {
	if (!scope.agentId) return scope.workspaceDir ? path.resolve(row.workspace_dir) === path.resolve(scope.workspaceDir) : true;
	if (row.owner_agent_id === scope.agentId) return true;
	return row.owner_agent_id === null && scope.workspaceDir !== void 0 && path.resolve(row.workspace_dir) === path.resolve(scope.workspaceDir);
}
async function readSkillProposal(proposalId, options = {}, scope = {}, readOptions = {}) {
	let stored = readStoredProposal(proposalId, options);
	if (!stored || !isStoredProposalVisible(stored.row, scope)) return null;
	if (readOptions.reconcile !== false) await reconcileInterruptedApply(proposalId, options, readOptions.config);
	stored = readStoredProposal(proposalId, options);
	if (!stored || !isStoredProposalVisible(stored.row, scope)) return null;
	const draft = await (await root(resolveSkillWorkshopStateDir(options))).read(path.join(proposalRelativeDir(proposalId), PROPOSAL_DRAFT_FILE), {
		hardlinks: "reject",
		maxBytes: MAX_PROPOSAL_BYTES,
		symlinks: "reject"
	});
	return {
		record: stored.record,
		revisionHash: hashSkillProposalRevision(stored.record),
		content: draft.buffer.toString("utf8")
	};
}
async function readSkillProposalRecord(proposalId, options = {}, scope = {}) {
	let stored = readStoredProposal(proposalId, options);
	if (!stored || !isStoredProposalVisible(stored.row, scope)) return null;
	await reconcileInterruptedApply(proposalId, options);
	stored = readStoredProposal(proposalId, options);
	return stored && isStoredProposalVisible(stored.row, scope) ? stored.record : null;
}
async function writeSkillProposal(params) {
	assertProposalId(params.record.id);
	assertSkillProposalContentSize(params.content);
	ensureSkillWorkshopSchema(params.store);
	const stateRoot = await root(resolveSkillWorkshopStateDir(params.store));
	const relativeDir = proposalRelativeDir(params.record.id);
	await stateRoot.mkdir(relativeDir);
	await stateRoot.write(path.join(relativeDir, PROPOSAL_DRAFT_FILE), params.content, { encoding: "utf8" });
	for (const file of params.supportFiles ?? []) await stateRoot.write(path.join(relativeDir, file.path), file.content, {
		encoding: "utf8",
		mkdir: true
	});
	try {
		return runOpenClawStateWriteTransaction(({ db }) => {
			const kysely = getNodeSqliteKysely(db);
			if (executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("skill_workshop_proposals").select("proposal_id").where("proposal_id", "=", params.record.id))) throw new Error(`Skill proposal already exists: ${params.record.id}`);
			if ((executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("skill_workshop_proposals").select((eb) => eb.fn.countAll().as("count")).where("workspace_dir", "=", path.resolve(params.workspaceDir)).where("status", "in", ["pending", "quarantined"]))?.count ?? 0) >= params.maxPending) throw new Error(`Skill Workshop pending proposal limit reached (${params.maxPending}).`);
			insertProposal(db, {
				record: params.record,
				ownerAgentId: params.ownerAgentId ?? params.record.origin?.agentId ?? null,
				workspaceDir: params.workspaceDir
			});
			return params.event ? appendSkillProposalEvent(db, params.event) : void 0;
		}, databaseOptions(params.store), { operationLabel: "skill-workshop.proposal.create" });
	} catch (error) {
		await removePathWithinRoot({
			rootDir: resolveSkillWorkshopStateDir(params.store),
			relativePath: relativeDir,
			recursive: true
		}).catch(() => void 0);
		throw error;
	}
}
async function replaceSkillProposalDraft(params) {
	assertProposalId(params.record.id);
	assertSkillProposalContentSize(params.content);
	const stateRoot = await root(resolveSkillWorkshopStateDir(params.store));
	const relativeDir = proposalRelativeDir(params.record.id);
	await stateRoot.write(path.join(relativeDir, PROPOSAL_DRAFT_FILE), params.content, { encoding: "utf8" });
	const nextSupportPaths = /* @__PURE__ */ new Set();
	for (const file of params.supportFiles ?? []) {
		nextSupportPaths.add(file.path);
		await stateRoot.write(path.join(relativeDir, file.path), file.content, {
			encoding: "utf8",
			mkdir: true
		});
	}
	for (const file of params.previousSupportFiles ?? []) {
		const filePath = normalizeWorkspaceSkillSupportPath(file.path);
		if (!nextSupportPaths.has(filePath)) await stateRoot.remove(path.join(relativeDir, filePath)).catch(() => void 0);
	}
	return await updateSkillProposalRecord({
		record: params.record,
		store: params.store,
		invalidateRollback: true,
		event: params.event
	});
}
async function updateSkillProposalRecord(params) {
	assertProposalId(params.record.id);
	ensureSkillWorkshopSchema(params.store);
	return runOpenClawStateWriteTransaction(({ db }) => {
		const kysely = getNodeSqliteKysely(db);
		const current = executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("skill_workshop_proposals").selectAll().where("proposal_id", "=", params.record.id));
		if (!current || !parseSkillProposalRow(current)) throw new Error(`Skill proposal not found: ${params.record.id}`);
		if (params.invalidateRollback) executeSqliteQuerySync(db, kysely.deleteFrom("skill_workshop_proposal_rollbacks").where("proposal_id", "=", params.record.id));
		updateProposal(db, current, params.record);
		return params.event ? appendSkillProposalEvent(db, params.event) : void 0;
	}, databaseOptions(params.store), { operationLabel: "skill-workshop.proposal.update" });
}
function listStoredProposals(options, scope) {
	const { database, kysely } = openSkillWorkshopStore(options);
	let query = kysely.selectFrom("skill_workshop_proposals").selectAll();
	if (scope.agentId) query = query.where((eb) => eb.or([eb("owner_agent_id", "=", scope.agentId), ...scope.workspaceDir ? [eb.and([eb("owner_agent_id", "is", null), eb("workspace_dir", "=", path.resolve(scope.workspaceDir))])] : []]));
	else if (scope.workspaceDir) query = query.where("workspace_dir", "=", path.resolve(scope.workspaceDir));
	return executeSqliteQuerySync(database.db, query.orderBy("updated_at", "desc").orderBy("proposal_id", "asc")).rows.flatMap((row) => {
		const record = parseSkillProposalRow(row);
		return record ? [{
			record,
			row
		}] : [];
	});
}
async function readSkillProposalManifest(options = {}, scope = {}) {
	const before = listStoredProposals(options, scope);
	await Promise.all(before.filter(({ record }) => record.status === "pending").map(({ record }) => reconcileInterruptedApply(record.id, options)));
	const proposals = listStoredProposals(options, scope).map(({ record, row }) => manifestEntryFromRecord(record, row.workspace_dir, scope.workspaceDir));
	return {
		schema: SKILL_WORKSHOP_MANIFEST_SCHEMA,
		updatedAt: proposals[0]?.updatedAt ?? (/* @__PURE__ */ new Date(0)).toISOString(),
		proposals
	};
}
async function reconcileInterruptedApply(proposalId, options, config) {
	const stored = readStoredProposal(proposalId, options);
	if (!stored || stored.record.status !== "pending") return false;
	if (!await readSkillProposalRollback(proposalId, options)) return false;
	let draftContent;
	try {
		draftContent = (await (await root(resolveSkillWorkshopStateDir(options))).read(path.join(proposalRelativeDir(proposalId), PROPOSAL_DRAFT_FILE), {
			hardlinks: "reject",
			maxBytes: MAX_PROPOSAL_BYTES,
			symlinks: "reject"
		})).buffer.toString("utf8");
	} catch {
		return false;
	}
	return await reconcileInterruptedSkillProposalApply({
		record: stored.record,
		expectedRecordJson: stored.row.record_json,
		draftContent,
		workspaceDir: stored.row.workspace_dir,
		...config ? { config } : {},
		store: options
	});
}
async function readProposalSupportFiles(record, options = {}) {
	const stateRoot = await root(resolveSkillWorkshopStateDir(options));
	const out = [];
	for (const file of record.supportFiles ?? []) {
		const filePath = normalizeWorkspaceSkillSupportPath(file.path);
		const content = (await stateRoot.read(path.join(proposalRelativeDir(record.id), filePath), {
			hardlinks: "reject",
			maxBytes: MAX_WORKSPACE_SKILL_SUPPORT_FILE_BYTES,
			symlinks: "reject"
		})).buffer.toString("utf8");
		const sizeBytes = contentSizeBytes(content);
		const hash = hashSkillProposalContent(content);
		if (file.sizeBytes !== sizeBytes || file.hash !== hash) throw new Error(`Proposal support file changed without updating metadata: ${filePath}`);
		out.push({
			path: filePath,
			sizeBytes,
			hash,
			content
		});
	}
	assertWorkspaceSkillSupportPathSetIsFileOnly(out.map((file) => file.path));
	return out;
}
function importLegacySkillProposal(params) {
	assertProposalId(params.record.id);
	ensureSkillWorkshopSchema(params.store);
	return runOpenClawStateWriteTransaction(({ db }) => {
		const kysely = getNodeSqliteKysely(db);
		const current = executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("skill_workshop_proposals").selectAll().where("proposal_id", "=", params.record.id));
		if (current) {
			const existing = parseSkillProposalRow(current);
			if (!existing || existing.draftHash !== params.record.draftHash || existing.target.skillFile !== params.record.target.skillFile) throw new Error(`Legacy skill proposal conflicts with SQLite: ${params.record.id}`);
		} else insertProposal(db, {
			record: params.record,
			ownerAgentId: params.ownerAgentId ?? params.record.origin?.agentId ?? null,
			workspaceDir: params.workspaceDir
		});
		if (params.rollback) executeSqliteQuerySync(db, kysely.insertInto("skill_workshop_proposal_rollbacks").values({
			proposal_id: params.record.id,
			written_at: params.rollback.writtenAt,
			target_skill_file: params.rollback.targetSkillFile,
			action: params.rollback.action,
			previous_content_hash: params.rollback.previousContentHash ?? null,
			previous_content: params.rollback.previousContent ?? null,
			support_files_json: params.rollback.supportFiles ? JSON.stringify(params.rollback.supportFiles) : null
		}).onConflict((conflict) => conflict.column("proposal_id").doNothing()));
		return current ? "already-imported" : "imported";
	}, databaseOptions(params.store), { operationLabel: "doctor.skill-workshop.import" });
}
function manifestEntryFromRecord(record, boundWorkspaceDir, currentWorkspaceDir) {
	const workspaceMismatch = currentWorkspaceDir !== void 0 && path.resolve(boundWorkspaceDir) !== path.resolve(currentWorkspaceDir);
	return {
		id: record.id,
		kind: record.kind,
		status: record.status,
		title: record.title,
		description: record.description,
		skillName: record.target.skillName,
		skillKey: record.target.skillKey,
		createdAt: record.createdAt,
		updatedAt: record.updatedAt,
		scanState: record.scan.state,
		...workspaceMismatch ? { workspaceMismatch: true } : {}
	};
}
//#endregion
export { assertProposalId as A, hasSkillProposalEvaluators as B, readSkillProposalRollback as C, updateProposal as D, readStoredProposal as E, SKILL_WORKSHOP_ROLLBACK_SCHEMA as F, renderProposalMarkdown as G, runSkillProposalEvaluators as H, SKILL_WORKSHOP_SCHEMA as I, stripProposalFrontmatterForSkill as K, hashSkillProposalContent as L, validateSkillProposalRecord as M, validateSkillProposalRollback as N, databaseOptions as O, MAX_SKILL_PROPOSAL_ORIGIN_RUN_IDS as P, createSkillProposalEvent as R, clearSkillProposalRollback as S, parseSkillProposalRow as T, hashSkillProposalRevision as U, normalizeSkillProposalCorrelationId as V, readProposalFrontmatter as W, resolveSkillCollectionBackupRoot as _, readSkillProposal as a, appendSkillProposalEvent as b, replaceSkillProposalDraft as c, writeSkillProposal as d, withSkillCollectionLock as f, pruneOlderSkillCollectionBackups as g, canonicalSkillCollectionWorkspace as h, readProposalSupportFiles as i, assertSkillProposalEvaluationWithinLimit as j, ensureSkillWorkshopSchema as k, resolveSkillProposalTarget as l, withSkillProposalTargetLock as m, importLegacySkillProposal as n, readSkillProposalManifest as o, withSkillProposalCommitLock as p, prepareSkillProposalSupportFiles as r, readSkillProposalRecord as s, createSkillProposalId as t, updateSkillProposalRecord as u, commitPendingSkillProposalTransition as v, writeSkillProposalRollback as w, listStoredSkillProposalEvents as x, readCommittedSkillProposalTransition as y, dispatchSkillProposalChanged as z };
