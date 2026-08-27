import { t as FsSafeError } from "./errors-CQDiIdj7.js";
import { r as root } from "./fs-safe-CmrQUApq.js";
import { w as resolveStateDir } from "./paths-BBSTUjD5.js";
import { S as createConfigIO } from "./io-DlN5njvP.js";
import { An as executeSqliteQuerySync, Mn as getNodeSqliteKysely, h as runOpenClawStateWriteTransaction, jn as executeSqliteQueryTakeFirstSync } from "./openclaw-state-db-CeAO_dqo.js";
import { a as sha256Hex } from "./crypto-digest-IGAbV2KW.js";
import { i as logWarn } from "./logger-D4iLuGk3.js";
import "./config-B2bSneS2.js";
import { i as syncDirectoryIfSupported } from "./directory-durability-y-xIUhxC.js";
import { n as withOpenClawStateLease } from "./openclaw-state-lease-Bw2pQRks.js";
import { t as getGlobalHookRunner } from "./hook-runner-global-CWpWIBkz.js";
import { t as extractFrontmatterBlock } from "./frontmatter-4ex1ODAy.js";
import { t as canonicalizePath } from "./paths-Bf0MEhmU.js";
import { t as parseSkillFrontmatter } from "./frontmatter-BUnBwW_N.js";
import { t as resolveSkillWorkshopConfig } from "./config-Cjp42tXL.js";
import { n as resolveAllowedSkillSymlinkTargetRealPaths } from "./symlink-targets-BsV9JHNo.js";
import { A as readWorkspaceSkillFile, C as assertInsideWorkspace, D as normalizeWorkspaceSkillSupportPath, M as restoreWorkspaceSkillMutation, a as updateProposal, c as openSkillWorkshopStore, d as assertProposalId, f as assertSkillProposalEvaluationWithinLimit, i as readStoredProposal, j as readWorkspaceSupportFile, k as prepareWorkspaceSkillRestoration, l as MAX_SKILL_PROPOSAL_EVALUATION_BYTES, m as parseSkillProposalRollback, n as parseJson, o as databaseOptions, p as parseSkillProposalEvaluation, r as parseSkillProposalRow, s as ensureSkillWorkshopSchema, t as insertProposal, u as PROPOSAL_DRAFT_FILE, v as SKILL_WORKSHOP_MANIFEST_SCHEMA, w as assertWorkspaceSkillSupportPathSetIsFileOnly, x as MAX_WORKSPACE_SKILL_SUPPORT_FILE_BYTES, y as SKILL_WORKSHOP_ROLLBACK_SCHEMA } from "./store-sqlite-record-CsO0xTyk.js";
import { t as bumpSkillsSnapshotVersion } from "./refresh-state-DHnXO3IV.js";
import { t as removePathWithinRoot } from "./fs-safe-remove-B3egFJhN.js";
import { a as normalizeSkillIndexName } from "./skill-index-kr-4jQSx.js";
import path from "node:path";
import fs from "node:fs/promises";
import crypto, { randomUUID } from "node:crypto";
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
const MAX_SKILL_PROPOSAL_EVENT_DATA_BYTES = MAX_SKILL_PROPOSAL_EVALUATION_BYTES + 64 * 1024;
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
		const kysely = getNodeSqliteKysely(db);
		const current = executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("skill_workshop_proposals").selectAll().where("proposal_id", "=", params.expected.id));
		const currentRecord = current ? parseSkillProposalRow(current) : null;
		if (!current || !currentRecord || currentRecord.status !== "pending" || current.record_json !== JSON.stringify(params.expected)) return {
			state: "conflict",
			...currentRecord ? { current: currentRecord } : {}
		};
		if (params.invalidateRollback) executeSqliteQuerySync(db, kysely.deleteFrom("skill_workshop_proposal_rollbacks").where("proposal_id", "=", params.expected.id));
		updateProposal(db, current, params.record);
		return {
			state: "committed",
			event: appendSkillProposalEvent(db, params.event)
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
//#region src/skills/workshop/proposal-generation.ts
const PROPOSALS_REL_DIR = path.join("skill-workshop", "proposals");
const PROPOSAL_GENERATIONS_REL_DIR = "generations";
const GENERATION_DRAFT_PATTERN = /^generations\/([0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})\/PROPOSAL\.md$/u;
function resolveSkillWorkshopStateDir(options = {}) {
	return path.resolve(options.stateDir ?? resolveStateDir(options.env));
}
function proposalRelativeDir(proposalId) {
	assertProposalId(proposalId);
	return path.join(PROPOSALS_REL_DIR, proposalId);
}
function createSkillProposalGenerationDraftFile() {
	return `${PROPOSAL_GENERATIONS_REL_DIR}/${randomUUID()}/${PROPOSAL_DRAFT_FILE}`;
}
function proposalBundleRelativePath(record, relativePath) {
	return path.join(proposalRelativeDir(record.id), path.dirname(record.draftFile), relativePath);
}
async function stageSkillProposalGeneration(params) {
	const generationId = proposalGenerationId(params.record.draftFile);
	if (!generationId) throw new Error("Revised Skill Workshop proposals require a generation draft path.");
	const stateDir = resolveSkillWorkshopStateDir(params.store);
	const stateRoot = await root(stateDir);
	const proposalDir = proposalRelativeDir(params.record.id);
	const stagingDir = path.join(proposalDir, PROPOSAL_GENERATIONS_REL_DIR, `.staging-${generationId}`);
	const generationsDir = path.join(proposalDir, PROPOSAL_GENERATIONS_REL_DIR);
	const generationDir = path.join(generationsDir, generationId);
	try {
		await stateRoot.mkdir(stagingDir);
		await createDurableGenerationFile(stateRoot, path.join(stagingDir, PROPOSAL_DRAFT_FILE), params.content);
		for (const file of params.supportFiles ?? []) await createDurableGenerationFile(stateRoot, path.join(stagingDir, file.path), file.content);
		await stateRoot.move(stagingDir, generationDir, { overwrite: true });
		await syncDirectoryIfSupported(path.join(stateDir, generationsDir));
	} catch (error) {
		await removeGenerationPath(stateDir, stagingDir).catch(() => void 0);
		await removeGenerationPath(stateDir, generationDir).catch(() => void 0);
		throw error;
	}
}
async function createDurableGenerationFile(stateRoot, relativePath, content) {
	await stateRoot.create(relativePath, content, {
		encoding: "utf8",
		mkdir: true
	});
	const opened = await stateRoot.openWritable(relativePath, { writeMode: "update" });
	try {
		await opened.handle.sync();
	} finally {
		await opened.handle.close();
	}
}
async function discardSkillProposalGeneration(record, store) {
	const generationId = proposalGenerationId(record.draftFile);
	if (!generationId) return;
	await removeGenerationPath(resolveSkillWorkshopStateDir(store), path.join(proposalRelativeDir(record.id), PROPOSAL_GENERATIONS_REL_DIR, generationId));
}
/** Removes generations left unowned by a pre-commit crash. Caller holds the target lease. */
async function cleanupSkillProposalGenerations(record, store) {
	const stateDir = resolveSkillWorkshopStateDir(store);
	const stateRoot = await root(stateDir);
	const proposalDir = proposalRelativeDir(record.id);
	const generationsDir = path.join(proposalDir, PROPOSAL_GENERATIONS_REL_DIR);
	let entries;
	try {
		entries = await stateRoot.list(generationsDir);
	} catch (error) {
		if (error instanceof FsSafeError && error.code === "not-found") return;
		throw error;
	}
	const activeGenerationId = proposalGenerationId(record.draftFile);
	for (const entry of entries) {
		if (entry === activeGenerationId) continue;
		await removeGenerationPath(stateDir, path.join(generationsDir, entry));
	}
	if (!activeGenerationId) return;
	await retireLegacyProposalBundle(record, store);
}
function proposalGenerationId(draftFile) {
	return GENERATION_DRAFT_PATTERN.exec(draftFile)?.[1] ?? null;
}
async function retireLegacyProposalBundle(record, store) {
	const stateDir = resolveSkillWorkshopStateDir(store);
	const stateRoot = await root(stateDir);
	const proposalDir = proposalRelativeDir(record.id);
	let entries;
	try {
		entries = await stateRoot.list(proposalDir);
	} catch (error) {
		if (error instanceof FsSafeError && error.code === "not-found") return;
		throw error;
	}
	for (const entry of entries) if (entry !== PROPOSAL_GENERATIONS_REL_DIR) await removeGenerationPath(stateDir, path.join(proposalDir, entry));
}
async function removeGenerationPath(stateDir, relativePath) {
	await removePathWithinRoot({
		rootDir: stateDir,
		relativePath,
		recursive: true
	});
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
var SkillProposalDraftMissingError = class extends Error {
	constructor(proposalId, options) {
		super(`Skill proposal draft is missing: ${proposalId}. Reject and re-propose it.`, options);
		this.proposalId = proposalId;
	}
};
async function readSkillProposal(proposalId, options = {}, scope = {}, readOptions = {}) {
	let stored = readStoredProposal(proposalId, options);
	if (!stored || !isStoredProposalVisible(stored.row, scope)) return null;
	if (readOptions.reconcile === false) return await readSkillProposalBundle(stored.record, options);
	if (await reconcileInterruptedApply(proposalId, options, readOptions.config)) {
		stored = readStoredProposal(proposalId, options);
		if (!stored || !isStoredProposalVisible(stored.row, scope)) return null;
	}
	return await withSkillProposalTargetLock(stored.record, async () => {
		const current = readStoredProposal(proposalId, options);
		return current && isStoredProposalVisible(current.row, scope) ? await readSkillProposalBundle(current.record, options) : null;
	}, options);
}
async function readSkillProposalRecord(proposalId, options = {}, scope = {}, readOptions = {}) {
	let stored = readStoredProposal(proposalId, options);
	if (!stored || !isStoredProposalVisible(stored.row, scope)) return null;
	if (readOptions.reconcile !== false) await reconcileInterruptedApply(proposalId, options, readOptions.config);
	stored = readStoredProposal(proposalId, options);
	return stored && isStoredProposalVisible(stored.row, scope) ? stored.record : null;
}
async function writeSkillProposal(params) {
	assertProposalId(params.record.id);
	assertSkillProposalContentSize(params.content);
	ensureSkillWorkshopSchema(params.store);
	await stageSkillProposalGeneration(params);
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
			return appendSkillProposalEvent(db, params.event);
		}, databaseOptions(params.store), { operationLabel: "skill-workshop.proposal.create" });
	} catch (error) {
		const committed = readCommittedSkillProposalTransition({
			record: params.record,
			event: params.event,
			store: params.store
		});
		if (committed) return committed.event;
		if (readStoredProposal(params.record.id, params.store)?.row.record_json === JSON.stringify(params.record)) throw new Error("Created Skill Workshop proposal is missing its committed event.", { cause: error });
		await discardSkillProposalGeneration(params.record, params.store).catch(() => void 0);
		throw error;
	}
}
async function replaceSkillProposalDraft(params) {
	assertProposalId(params.record.id);
	assertSkillProposalContentSize(params.content);
	await cleanupSkillProposalGenerations(params.expected, params.store).catch((error) => {
		logWarn(`skill-workshop: failed to clean unowned proposal generations: ${String(error)}`);
	});
	await stageSkillProposalGeneration(params);
	let commit;
	try {
		commit = commitPendingSkillProposalTransition({
			expected: params.expected,
			record: params.record,
			event: params.event,
			store: params.store,
			operationLabel: "skill-workshop.revision.commit",
			invalidateRollback: true
		});
	} catch (error) {
		const committed = readCommittedSkillProposalTransition({
			record: params.record,
			event: params.event,
			store: params.store
		});
		if (!committed) {
			if (readStoredProposal(params.record.id, params.store)?.row.record_json === JSON.stringify(params.record)) throw new Error("Revised Skill Workshop proposal is missing its committed event.", { cause: error });
			await discardSkillProposalGeneration(params.record, params.store).catch(() => void 0);
			throw error;
		}
		commit = committed;
	}
	if (commit.state === "conflict") {
		await discardSkillProposalGeneration(params.record, params.store).catch(() => void 0);
		throw new Error("Skill proposal changed before revision commit.");
	}
	await cleanupSkillProposalGenerations(params.record, params.store).catch((error) => {
		logWarn(`skill-workshop: failed to retire prior proposal generation: ${String(error)}`);
	});
	return commit.event;
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
		draftContent = (await (await root(resolveSkillWorkshopStateDir(options))).read(proposalBundleRelativePath(stored.record, PROPOSAL_DRAFT_FILE), {
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
async function readProposalSupportFiles(record, stateRoot) {
	const out = [];
	for (const file of record.supportFiles ?? []) {
		const filePath = normalizeWorkspaceSkillSupportPath(file.path);
		const content = (await stateRoot.read(proposalBundleRelativePath(record, filePath), {
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
async function readSkillProposalBundle(record, options) {
	const stateRoot = await root(resolveSkillWorkshopStateDir(options));
	let draft;
	try {
		draft = await stateRoot.read(proposalBundleRelativePath(record, PROPOSAL_DRAFT_FILE), {
			hardlinks: "reject",
			maxBytes: MAX_PROPOSAL_BYTES,
			symlinks: "reject"
		});
	} catch (error) {
		if (error instanceof FsSafeError && error.code === "not-found") throw new SkillProposalDraftMissingError(record.id, { cause: error });
		throw error;
	}
	const supportFiles = await readProposalSupportFiles(record, stateRoot);
	return {
		record,
		revisionHash: hashSkillProposalRevision(record),
		content: draft.buffer.toString("utf8"),
		...supportFiles.length > 0 ? { supportFiles } : {}
	};
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
export { normalizeSkillProposalCorrelationId as A, clearSkillProposalRollback as C, createSkillProposalEvent as D, hashSkillProposalContent as E, stripProposalFrontmatterForSkill as F, hashSkillProposalRevision as M, readProposalFrontmatter as N, dispatchSkillProposalChanged as O, renderProposalMarkdown as P, listStoredSkillProposalEvents as S, writeSkillProposalRollback as T, pruneOlderSkillCollectionBackups as _, readSkillProposal as a, readCommittedSkillProposalTransition as b, replaceSkillProposalDraft as c, writeSkillProposal as d, createSkillProposalGenerationDraftFile as f, canonicalSkillCollectionWorkspace as g, withSkillProposalTargetLock as h, prepareSkillProposalSupportFiles as i, runSkillProposalEvaluators as j, hasSkillProposalEvaluators as k, resolveSkillProposalTarget as l, withSkillProposalCommitLock as m, createSkillProposalId as n, readSkillProposalManifest as o, withSkillCollectionLock as p, importLegacySkillProposal as r, readSkillProposalRecord as s, SkillProposalDraftMissingError as t, updateSkillProposalRecord as u, resolveSkillCollectionBackupRoot as v, readSkillProposalRollback as w, appendSkillProposalEvent as x, commitPendingSkillProposalTransition as y };
