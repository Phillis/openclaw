import "./src-BntaCZM-.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { t as safeParseJson } from "./json-coercion-ighRFv8Y.js";
import { a as isPathInside } from "./path-D138yf8v.js";
import { s as pathExists } from "./absolute-path-CYFPfAjt.js";
import { r as root } from "./fs-safe-CmrQUApq.js";
import "./path-safety-C2hsuc07.js";
import { n as ok, t as err } from "./result-BQGgYouL.js";
import { At as boolean, Bt as discriminatedUnion, Et as array, Lt as custom, Rn as string, Xn as union, Zn as unknown, dn as literal, fn as looseObject, hn as map, wn as number, yt as _enum } from "./schemas-CZ9Toj_c.js";
import { An as executeSqliteQuerySync, Mn as getNodeSqliteKysely, Rt as ensureColumn, d as openOpenClawStateDatabase, h as runOpenClawStateWriteTransaction, jn as executeSqliteQueryTakeFirstSync } from "./openclaw-state-db-CeAO_dqo.js";
import { a as sha256Hex } from "./crypto-digest-IGAbV2KW.js";
import { t as findContainingAllowedSkillSymlinkTarget } from "./symlink-targets-BsV9JHNo.js";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/skills/lifecycle/workspace-skill-write.ts
const ALLOWED_SUPPORT_FILE_ROOTS = new Set("assets examples references scripts templates".split(" "));
const MAX_WORKSPACE_SKILL_SUPPORT_FILE_BYTES = 256 * 1024;
function normalizeWorkspaceSkillSupportPath(input) {
	const trimmed = input.trim();
	if (!trimmed) throw new Error("Support file path is required.");
	if (trimmed.includes("\\")) throw new Error("Support file paths must use forward slashes.");
	if (path.posix.isAbsolute(trimmed)) throw new Error("Support file paths must be relative.");
	if (trimmed.split("/").some((part) => !part || part === "." || part === ".." || part.startsWith("."))) throw new Error("Support file paths must use plain relative path segments.");
	if (!ALLOWED_SUPPORT_FILE_ROOTS.has(trimmed.split("/")[0] ?? "")) throw new Error(`Support file paths must be under one of: ${[...ALLOWED_SUPPORT_FILE_ROOTS].join(", ")}.`);
	if (trimmed === "PROPOSAL.md" || trimmed === "SKILL.md") throw new Error("Support files cannot replace the proposal or skill markdown file.");
	return trimmed;
}
function assertWorkspaceSkillSupportPathSetIsFileOnly(paths) {
	const sorted = paths.toSorted((a, b) => a.localeCompare(b));
	for (const filePath of sorted) if (!filePath.includes("/")) throw new Error("Support file paths must include a file below an allowed support directory.");
	for (let index = 1; index < sorted.length; index += 1) {
		const previous = sorted[index - 1];
		const current = sorted[index];
		if (previous && current?.startsWith(`${previous}/`)) throw new Error(`Support file paths cannot overlap: ${previous} and ${current}`);
	}
}
async function readWorkspaceSkillFile(filePath) {
	if (!await pathExists(filePath)) return null;
	return (await (await root(path.dirname(filePath))).read(path.basename(filePath), {
		hardlinks: "reject",
		maxBytes: 1024 * 1024,
		symlinks: "reject"
	})).buffer.toString("utf8");
}
async function readWorkspaceSupportFile(params) {
	const relativePath = normalizeWorkspaceSkillSupportPath(params.relativePath);
	if (!await pathExists(path.join(params.skillDir, ...relativePath.split("/")))) return null;
	return (await (await root(params.skillDir)).read(relativePath, {
		hardlinks: "reject",
		maxBytes: MAX_WORKSPACE_SKILL_SUPPORT_FILE_BYTES,
		symlinks: "reject"
	})).buffer.toString("utf8");
}
async function prepareWorkspaceSkillMutation(params) {
	assertInsideWorkspace(params.workspaceDir, params.skillDir, "skill directory");
	const supportFiles = normalizeSupportFiles(params.supportFiles ?? []);
	const skillTarget = await resolveWorkspaceSkillWriteTarget({
		workspaceDir: params.workspaceDir,
		filePath: params.skillFile,
		symlinkPolicy: params.symlinkPolicy
	});
	const previousContent = await readWorkspaceSkillFile(params.skillFile);
	if (params.mode === "create" && previousContent !== null) throw new Error(`Target skill already exists: ${params.skillFile}`);
	if (params.mode === "update" && previousContent === null) throw new Error(`Target skill is missing: ${params.skillFile}`);
	const preparedSupportFiles = [];
	for (const file of supportFiles) {
		const filePath = path.join(params.skillDir, ...file.path.split("/"));
		const target = await resolveWorkspaceSkillWriteTarget({
			workspaceDir: params.workspaceDir,
			filePath,
			symlinkPolicy: params.symlinkPolicy
		});
		const previousSupportContent = await readWorkspaceSupportFile({
			skillDir: params.skillDir,
			relativePath: file.path
		});
		if (params.mode === "create" && previousSupportContent !== null) throw new Error(`Target support file already exists: ${filePath}`);
		preparedSupportFiles.push({
			path: file.path,
			filePath,
			...target,
			previousContent: previousSupportContent,
			content: file.content,
			proposedContentHash: sha256Hex(file.content)
		});
	}
	return {
		mode: params.mode,
		workspaceDir: params.workspaceDir,
		skillDir: params.skillDir,
		skillFile: {
			filePath: params.skillFile,
			...skillTarget,
			previousContent,
			content: params.content,
			proposedContentHash: sha256Hex(params.content)
		},
		supportFiles: preparedSupportFiles
	};
}
async function prepareWorkspaceSkillRestoration(params) {
	assertInsideWorkspace(params.workspaceDir, params.skillDir, "skill directory");
	const supportFiles = (params.supportFiles ?? []).map((file) => ({
		path: normalizeWorkspaceSkillSupportPath(file.path),
		previousContent: file.previousContent,
		proposedContentHash: file.proposedContentHash
	}));
	assertWorkspaceSkillSupportPathSetIsFileOnly(supportFiles.map((file) => file.path));
	const skillTarget = await resolveWorkspaceSkillWriteTarget({
		workspaceDir: params.workspaceDir,
		filePath: params.skillFile,
		symlinkPolicy: params.symlinkPolicy
	});
	const preparedSupportFiles = [];
	for (const file of supportFiles) {
		const filePath = path.join(params.skillDir, ...file.path.split("/"));
		const target = await resolveWorkspaceSkillWriteTarget({
			workspaceDir: params.workspaceDir,
			filePath,
			symlinkPolicy: params.symlinkPolicy
		});
		preparedSupportFiles.push({
			path: file.path,
			filePath,
			...target,
			previousContent: file.previousContent,
			content: file.previousContent ?? "",
			proposedContentHash: file.proposedContentHash
		});
	}
	return {
		mode: params.mode,
		workspaceDir: params.workspaceDir,
		skillDir: params.skillDir,
		skillFile: {
			filePath: params.skillFile,
			...skillTarget,
			previousContent: params.previousContent,
			content: params.previousContent ?? "",
			proposedContentHash: params.proposedContentHash
		},
		supportFiles: preparedSupportFiles
	};
}
async function applyWorkspaceSkillMutation(mutation, writeFile = writeWorkspaceSkillFile) {
	const written = [];
	const writtenSupportPaths = [];
	try {
		for (const file of mutation.supportFiles) {
			await writePreparedWorkspaceFile(file, mutation.mode === "update", writeFile);
			written.push(file);
			writtenSupportPaths.push(file.path);
		}
		await writePreparedWorkspaceFile(mutation.skillFile, mutation.mode === "update", writeFile);
	} catch (error) {
		try {
			await restorePreparedWorkspaceFiles(written.toReversed());
		} catch (restoreError) {
			const failure = new Error(`Skill write failed and ${writtenSupportPaths.length} support file restoration(s) failed.`, { cause: error });
			Object.assign(failure, { restoreError });
			throw failure;
		}
		throw error;
	}
}
async function restoreWorkspaceSkillMutation(mutation) {
	await restorePreparedWorkspaceFiles(mutation.mode === "create" ? [mutation.skillFile, ...mutation.supportFiles.toReversed()] : [...mutation.supportFiles.toReversed(), mutation.skillFile]);
}
async function isWorkspaceSkillMutationApplied(mutation) {
	if (await readPreparedWorkspaceFile(mutation.skillFile, 1024 * 1024) !== mutation.skillFile.content) return false;
	for (const file of mutation.supportFiles) if (await readPreparedWorkspaceFile(file, 262144) !== file.content) return false;
	return true;
}
async function isWorkspaceSkillMutationRestored(mutation) {
	try {
		if (await readPreparedWorkspaceFile(mutation.skillFile, 1024 * 1024) !== mutation.skillFile.previousContent) return false;
		for (const file of mutation.supportFiles) if (await readPreparedWorkspaceFile(file, 262144) !== file.previousContent) return false;
		return true;
	} catch {
		return false;
	}
}
function normalizeSupportFiles(supportFiles) {
	const normalized = supportFiles.map((file) => ({
		...file,
		path: normalizeWorkspaceSkillSupportPath(file.path)
	}));
	assertWorkspaceSkillSupportPathSetIsFileOnly(normalized.map((file) => file.path));
	return normalized;
}
async function writePreparedWorkspaceFile(file, overwrite, writeFile) {
	try {
		await writeFile(file, overwrite);
	} catch (error) {
		const currentContent = await readPreparedWorkspaceFile(file, 1024 * 1024).catch(() => null);
		if (currentContent === file.content && currentContent !== file.previousContent) try {
			await restorePreparedWorkspaceFiles([file]);
		} catch (restoreError) {
			const failure = new Error("Skill write failed after commit and restoration failed.", { cause: error });
			Object.assign(failure, { restoreError });
			throw failure;
		}
		throw error;
	}
}
async function writeWorkspaceSkillFile(file, overwrite) {
	await (await root(file.rootDir)).write(file.relativePath, file.content, {
		encoding: "utf8",
		mkdir: true,
		overwrite
	});
}
async function restorePreparedWorkspaceFiles(files) {
	const errors = [];
	for (const file of files) try {
		const currentContent = await readPreparedWorkspaceFile(file, 1024 * 1024);
		if (currentContent === file.previousContent) continue;
		if (currentContent === null || sha256Hex(currentContent) !== file.proposedContentHash) throw new Error(`Workspace skill target changed before restoration: ${file.filePath}`);
		const targetRoot = await root(file.rootDir);
		if (file.previousContent === null) await targetRoot.remove(file.relativePath).catch((error) => {
			if (error?.code !== "ENOENT") throw error;
		});
		else await targetRoot.write(file.relativePath, file.previousContent, {
			encoding: "utf8",
			mkdir: true,
			overwrite: true
		});
	} catch (error) {
		errors.push(error);
	}
	if (errors.length > 0) throw new AggregateError(errors, "Failed to restore the previous workspace skill state.");
}
async function readPreparedWorkspaceFile(file, maxBytes) {
	if (!await pathExists(path.join(file.rootDir, file.relativePath))) return null;
	return (await (await root(file.rootDir)).read(file.relativePath, {
		hardlinks: "reject",
		maxBytes,
		symlinks: "reject"
	})).buffer.toString("utf8");
}
async function resolveWorkspaceSkillWriteTarget(params) {
	assertInsideWorkspace(params.workspaceDir, params.filePath, "skill file");
	const workspaceDir = path.resolve(params.workspaceDir);
	const filePath = path.resolve(params.filePath);
	const aliasTarget = await resolveWorkspaceAliasTarget({
		workspaceDir,
		filePath
	});
	if (!aliasTarget) return {
		rootDir: workspaceDir,
		relativePath: path.relative(workspaceDir, filePath)
	};
	const allowedRoot = params.symlinkPolicy.allowWrites ? findContainingAllowedSkillSymlinkTarget(params.symlinkPolicy.allowedTargetRealPaths, aliasTarget.realTarget) : null;
	if (!allowedRoot) throw new Error(`Skill file resolves through an untrusted symlink target: ${params.filePath}. Configure skills.load.allowSymlinkTargets and enable skills.workshop.allowSymlinkTargetWrites for intentional Skill Workshop symlink writes.`);
	return {
		rootDir: allowedRoot,
		relativePath: path.relative(allowedRoot, aliasTarget.realTarget)
	};
}
async function resolveWorkspaceAliasTarget(params) {
	const workspaceRealPath = await tryRealpath(params.workspaceDir) ?? params.workspaceDir;
	const realTarget = await resolveRealPathThroughExistingAncestors(params.workspaceDir, params.filePath);
	return isPathInside(workspaceRealPath, realTarget) ? null : { realTarget };
}
async function resolveRealPathThroughExistingAncestors(workspaceDir, filePath) {
	const segments = path.relative(workspaceDir, filePath).split(path.sep).filter(Boolean);
	let lexicalCursor = workspaceDir;
	let realCursor = await tryRealpath(workspaceDir) ?? workspaceDir;
	for (const segment of segments) {
		lexicalCursor = path.join(lexicalCursor, segment);
		realCursor = await tryRealpath(lexicalCursor) ?? path.join(realCursor, segment);
	}
	return path.resolve(realCursor);
}
async function tryRealpath(filePath) {
	try {
		return await fs.realpath(filePath);
	} catch {
		return null;
	}
}
function assertInsideWorkspace(workspaceDir, targetPath, label) {
	const resolvedWorkspaceDir = path.resolve(workspaceDir);
	const resolvedTarget = path.resolve(targetPath);
	if (resolvedTarget !== resolvedWorkspaceDir && !isPathInside(resolvedWorkspaceDir, resolvedTarget)) throw new Error(`${label} must stay inside the workspace.`);
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
const PROPOSAL_DRAFT_FILE_PATTERN = /^(?:PROPOSAL\.md|generations\/[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\/PROPOSAL\.md)$/u;
const sha256Schema = string().regex(/^[a-f0-9]{64}$/i);
const skillProposalFindingSchema = looseObject({
	ruleId: string().min(1).max(256),
	severity: _enum([
		"info",
		"warn",
		"critical"
	]),
	message: string().min(1).max(4e3),
	file: string().max(1024).optional(),
	line: number().refine(Number.isSafeInteger).refine((value) => value >= 1).optional()
});
const skillProposalMetricValueSchema = union([
	string().max(4e3),
	number().finite(),
	boolean()
]);
const skillProposalMetricsSchema = custom(isRecord).transform((metrics) => new Map(Object.entries(metrics))).pipe(map(string().min(1).max(128), skillProposalMetricValueSchema)).refine((metrics) => metrics.size <= 64);
const skillProposalEvaluationResultSchema = looseObject({
	summary: string().max(8e3).optional(),
	evaluatorVersion: string().max(128).optional(),
	mode: string().max(128).optional(),
	decision: _enum([
		"pass",
		"revise",
		"block"
	]).optional(),
	decisionReason: string().max(2e3).optional(),
	findings: array(skillProposalFindingSchema).max(200).optional(),
	metrics: skillProposalMetricsSchema.optional()
});
const skillProposalEvaluationOutcomeBaseShape = {
	evaluatorId: string().min(1).max(128),
	pluginId: string().min(1).max(128),
	pluginVersion: string().max(128).optional()
};
const skillProposalEvaluationOutcomeSchema = discriminatedUnion("status", [
	looseObject({
		...skillProposalEvaluationOutcomeBaseShape,
		status: literal("skipped")
	}),
	looseObject({
		...skillProposalEvaluationOutcomeBaseShape,
		status: literal("error"),
		error: string().max(2e3)
	}),
	looseObject({
		...skillProposalEvaluationOutcomeBaseShape,
		status: literal("completed"),
		result: skillProposalEvaluationResultSchema
	})
]);
const skillProposalEvaluationSchema = looseObject({
	id: string().min(1).max(128),
	proposedVersion: string(),
	revisionHash: sha256Schema,
	trigger: _enum(["manual", "apply"]),
	startedAt: string(),
	completedAt: string(),
	correlationId: string().min(1).refine((value) => Array.from(value).length <= 256).optional(),
	targetTreeSha256: sha256Schema.optional(),
	outcomes: array(skillProposalEvaluationOutcomeSchema).max(64)
});
const skillProposalSupportFilesSchema = array(looseObject({
	path: string(),
	hash: sha256Schema,
	sizeBytes: number().refine(Number.isSafeInteger).refine((value) => value >= 0 && value <= 262144),
	targetExisted: boolean().optional(),
	targetContentHash: sha256Schema.optional()
})).max(64).superRefine((files, context) => {
	const seen = /* @__PURE__ */ new Set();
	for (const [index, file] of files.entries()) {
		let normalized;
		try {
			normalized = normalizeWorkspaceSkillSupportPath(file.path);
		} catch {
			context.addIssue({
				code: "custom",
				message: "invalid support path",
				path: [index, "path"]
			});
			continue;
		}
		if (seen.has(normalized)) context.addIssue({
			code: "custom",
			message: "duplicate support path",
			path: [index, "path"]
		});
		seen.add(normalized);
	}
});
const skillProposalRecordSchema = looseObject({
	schema: literal(SKILL_WORKSHOP_SCHEMA),
	id: string().regex(PROPOSAL_ID_PATTERN),
	kind: _enum(["create", "update"]),
	status: _enum([
		"pending",
		"applied",
		"rejected",
		"quarantined",
		"stale"
	]),
	title: string(),
	description: string(),
	createdAt: string(),
	updatedAt: string(),
	autonomousCapture: literal(true).optional(),
	draftHash: string(),
	draftFile: string().regex(PROPOSAL_DRAFT_FILE_PATTERN),
	origin: unknown().optional(),
	originRunIds: unknown().optional(),
	originRunMutationCounts: unknown().optional(),
	supportFiles: skillProposalSupportFilesSchema.optional(),
	evaluation: skillProposalEvaluationSchema.optional(),
	target: looseObject({
		skillName: string(),
		skillKey: string(),
		skillDir: string(),
		skillFile: string()
	}),
	scan: custom((value) => value !== null && typeof value === "object")
}).refine(hasValidProposalOriginProvenance);
const skillProposalRollbackSchema = looseObject({
	schema: literal(SKILL_WORKSHOP_ROLLBACK_SCHEMA),
	proposalId: string().regex(PROPOSAL_ID_PATTERN),
	writtenAt: string(),
	targetSkillFile: string(),
	action: _enum(["create", "update"]),
	previousContentHash: sha256Schema.optional(),
	previousContent: string().optional(),
	supportFiles: array(unknown()).optional()
});
function assertSkillProposalEvaluationWithinLimit(evaluation) {
	if (Buffer.byteLength(JSON.stringify(evaluation), "utf8") > 524288) throw new Error(`Skill proposal evaluation exceeds ${MAX_SKILL_PROPOSAL_EVALUATION_BYTES} bytes.`);
}
function assertProposalId(proposalId) {
	if (!PROPOSAL_ID_PATTERN.test(proposalId)) throw new Error("Invalid skill proposal id.");
}
function validateSkillProposalRecord(raw) {
	if (!skillProposalRecordSchema.safeParse(raw).success) return invalidMetadata("proposal");
	return ok(raw);
}
function parseSkillProposalRecord(raw) {
	const result = validateSkillProposalRecord(raw);
	return result.ok ? result.value : null;
}
function parseSkillProposalEvaluation(raw) {
	return skillProposalEvaluationSchema.safeParse(raw).success ? raw : null;
}
function validateSkillProposalRollback(raw) {
	if (!skillProposalRollbackSchema.safeParse(raw).success) return invalidMetadata("rollback");
	return ok(raw);
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
  status_reason TEXT,
  claim_released_time INTEGER
) STRICT;

CREATE TABLE IF NOT EXISTS skill_workshop_collection_reviews (
  review_id TEXT NOT NULL PRIMARY KEY,
  workspace_dir TEXT NOT NULL,
  backup_id TEXT NOT NULL,
  create_time INTEGER NOT NULL,
  kept_names_json TEXT NOT NULL,
  written_names_json TEXT NOT NULL,
  dropped_json TEXT NOT NULL
) STRICT;

CREATE INDEX IF NOT EXISTS idx_skill_workshop_collection_reviews_workspace_time
  ON skill_workshop_collection_reviews(workspace_dir, create_time DESC, review_id DESC);

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
		ensureColumn(db, "skill_workshop_proposals", "claim_released_time INTEGER");
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
		status_reason: record.statusReason ?? null,
		claim_released_time: params.claimReleasedTime
	};
}
function insertProposal(database, params) {
	executeSqliteQuerySync(database, getNodeSqliteKysely(database).insertInto("skill_workshop_proposals").values(proposalRowValues({
		...params,
		claimReleasedTime: null
	})));
}
function updateProposal(database, current, record) {
	const kysely = getNodeSqliteKysely(database);
	const { proposal_id: _proposalId, ...values } = proposalRowValues({
		record,
		ownerAgentId: current.owner_agent_id,
		workspaceDir: current.workspace_dir,
		claimReleasedTime: current.claim_released_time
	});
	executeSqliteQuerySync(database, kysely.updateTable("skill_workshop_proposals").set(values).where("proposal_id", "=", record.id));
}
//#endregion
export { readWorkspaceSkillFile as A, assertInsideWorkspace as C, normalizeWorkspaceSkillSupportPath as D, isWorkspaceSkillMutationRestored as E, restoreWorkspaceSkillMutation as M, prepareWorkspaceSkillMutation as O, applyWorkspaceSkillMutation as S, isWorkspaceSkillMutationApplied as T, MAX_SKILL_PROPOSAL_ORIGIN_RUN_IDS as _, updateProposal as a, SKILL_WORKSHOP_SCHEMA as b, openSkillWorkshopStore as c, assertProposalId as d, assertSkillProposalEvaluationWithinLimit as f, validateSkillProposalRollback as g, validateSkillProposalRecord as h, readStoredProposal as i, readWorkspaceSupportFile as j, prepareWorkspaceSkillRestoration as k, MAX_SKILL_PROPOSAL_EVALUATION_BYTES as l, parseSkillProposalRollback as m, parseJson as n, databaseOptions as o, parseSkillProposalEvaluation as p, parseSkillProposalRow as r, ensureSkillWorkshopSchema as s, insertProposal as t, PROPOSAL_DRAFT_FILE as u, SKILL_WORKSHOP_MANIFEST_SCHEMA as v, assertWorkspaceSkillSupportPathSetIsFileOnly as w, MAX_WORKSPACE_SKILL_SUPPORT_FILE_BYTES as x, SKILL_WORKSHOP_ROLLBACK_SCHEMA as y };
