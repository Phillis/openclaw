import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import "./src-BntaCZM-.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import { a as isPathInside } from "./path-D138yf8v.js";
import { s as pathExists } from "./absolute-path-CYFPfAjt.js";
import { o as walkDirectory, r as root } from "./fs-safe-CmrQUApq.js";
import { r as readLocalFileSafely } from "./root-impl-BbMR4leC.js";
import "./path-safety-C2hsuc07.js";
import { n as ok, t as err } from "./result-BQGgYouL.js";
import { Mn as getNodeSqliteKysely, h as runOpenClawStateWriteTransaction, jn as executeSqliteQueryTakeFirstSync } from "./openclaw-state-db-CeAO_dqo.js";
import { a as sha256Hex } from "./crypto-digest-IGAbV2KW.js";
import { t as resolveSkillWorkshopConfig } from "./config-Cjp42tXL.js";
import { n as resolveAllowedSkillSymlinkTargetRealPaths } from "./symlink-targets-BsV9JHNo.js";
import { A as readWorkspaceSkillFile, C as assertInsideWorkspace, D as normalizeWorkspaceSkillSupportPath, E as isWorkspaceSkillMutationRestored, M as restoreWorkspaceSkillMutation, O as prepareWorkspaceSkillMutation, S as applyWorkspaceSkillMutation, T as isWorkspaceSkillMutationApplied, a as updateProposal, b as SKILL_WORKSHOP_SCHEMA, d as assertProposalId, f as assertSkillProposalEvaluationWithinLimit, i as readStoredProposal, j as readWorkspaceSupportFile, o as databaseOptions, r as parseSkillProposalRow, s as ensureSkillWorkshopSchema, x as MAX_WORKSPACE_SKILL_SUPPORT_FILE_BYTES, y as SKILL_WORKSHOP_ROLLBACK_SCHEMA } from "./store-sqlite-record-CsO0xTyk.js";
import { D as dispatchCommittedSkillChangeBestEffort, O as hasCommittedSkillChangeHooks, k as snapshotCommittedSkillArtifactBestEffort } from "./clawhub-uninstall-DlSCFUnc.js";
import { t as bumpSkillsSnapshotVersion } from "./refresh-state-DHnXO3IV.js";
import { A as normalizeSkillProposalCorrelationId, C as clearSkillProposalRollback, D as createSkillProposalEvent, E as hashSkillProposalContent, F as stripProposalFrontmatterForSkill, M as hashSkillProposalRevision, N as readProposalFrontmatter, O as dispatchSkillProposalChanged, P as renderProposalMarkdown, S as listStoredSkillProposalEvents, T as writeSkillProposalRollback, a as readSkillProposal, b as readCommittedSkillProposalTransition, c as replaceSkillProposalDraft, d as writeSkillProposal, f as createSkillProposalGenerationDraftFile, h as withSkillProposalTargetLock, i as prepareSkillProposalSupportFiles, j as runSkillProposalEvaluators, k as hasSkillProposalEvaluators, l as resolveSkillProposalTarget, m as withSkillProposalCommitLock, n as createSkillProposalId, o as readSkillProposalManifest, s as readSkillProposalRecord, t as SkillProposalDraftMissingError, u as updateSkillProposalRecord, w as readSkillProposalRollback, x as appendSkillProposalEvent, y as commitPendingSkillProposalTransition } from "./store-B2Qbdth0.js";
import { a as isWorkshopOwnedSkillDir, t as assertWritableSkillTarget } from "./workspace-skill-read-eFGJaOyq.js";
import { i as scanSource, r as scanSkillContent } from "./scanner-CGvy32Lb.js";
import { a as normalizeSkillIndexName } from "./skill-index-kr-4jQSx.js";
import { n as resolveSkillStatusEntry, t as buildWorkspaceSkillStatus } from "./status-CFSwEllv.js";
import path from "node:path";
import fs from "node:fs/promises";
import { randomUUID } from "node:crypto";
//#region src/skills/workshop/proposal-bundle.ts
const MAX_EVALUATION_FILES = 256;
const MAX_EVALUATION_FILE_BYTES = 1024 * 1024;
const MAX_EVALUATION_BUNDLE_BYTES = 8 * 1024 * 1024;
const EXCLUDED_ROOT_DIRS = /* @__PURE__ */ new Set([
	".clawhub",
	".clawdhub",
	".openclaw"
]);
async function buildSkillProposalEvaluationBundles(params) {
	const targetFiles = await readSkillTreeFiles(params.proposal.record.target.skillDir);
	const targetTreeSha256 = hashSkillTree(targetFiles);
	const skillMdPath = params.proposal.record.kind === "create" ? "SKILL.md" : resolveTargetSkillRelativePath(params.proposal, targetFiles, { recordedTargetExists: await pathExists(params.proposal.record.target.skillFile) });
	const candidateSkillMd = fileFromBuffer(skillMdPath, Buffer.from(stripProposalFrontmatterForSkill(params.proposal.content), "utf8"));
	const proposedFiles = params.supportFiles.map((file) => fileFromBuffer(file.path, Buffer.from(file.content, "utf8")));
	const candidateFiles = new Map(targetFiles.map((file) => [file.path, file]));
	if (params.proposal.record.kind === "create") {
		if (await pathExists(params.proposal.record.target.skillFile)) throw new Error(`Target skill already exists: ${params.proposal.record.target.skillFile}`);
		candidateFiles.set(candidateSkillMd.path, candidateSkillMd);
		for (const file of proposedFiles) {
			const targetFile = path.join(params.proposal.record.target.skillDir, file.path);
			if (await pathExists(targetFile)) throw new Error(`Target support file already exists: ${targetFile}`);
			candidateFiles.set(file.path, file);
		}
		return {
			candidate: snapshotFromFiles([...candidateFiles.values()], skillMdPath),
			targetTreeSha256
		};
	}
	const baseline = snapshotFromFiles(targetFiles, skillMdPath);
	candidateFiles.set(candidateSkillMd.path, candidateSkillMd);
	for (const file of proposedFiles) candidateFiles.set(file.path, file);
	return {
		baseline,
		candidate: snapshotFromFiles([...candidateFiles.values()], skillMdPath),
		targetTreeSha256
	};
}
async function readSkillProposalTargetTreeSha256(skillDir) {
	return hashSkillTree(await readSkillTreeFiles(skillDir));
}
async function readSkillTreeFiles(skillDir) {
	if (!await pathExists(skillDir)) return [];
	const scanned = await walkDirectory(skillDir, {
		maxDepth: 16,
		maxEntries: MAX_EVALUATION_FILES * 2,
		symlinks: "include"
	});
	if (scanned.truncated) throw new Error(`Skill evaluation bundle exceeds ${MAX_EVALUATION_FILES} files.`);
	const skillRoot = await root(skillDir);
	const files = [];
	let totalBytes = 0;
	for (const entry of scanned.entries.toSorted((a, b) => a.relativePath.localeCompare(b.relativePath))) {
		const portablePath = entry.relativePath.split(path.sep).join("/");
		if (!portablePath || EXCLUDED_ROOT_DIRS.has(portablePath.split("/")[0] ?? "") || entry.kind === "directory") continue;
		if (entry.kind !== "file") throw new Error(`Skill evaluation bundle contains unsupported entry: ${portablePath}`);
		const read = await skillRoot.read(entry.relativePath, {
			hardlinks: "reject",
			maxBytes: MAX_EVALUATION_FILE_BYTES,
			symlinks: "reject"
		});
		totalBytes += read.buffer.byteLength;
		if (totalBytes > MAX_EVALUATION_BUNDLE_BYTES) throw new Error(`Skill evaluation bundle exceeds ${MAX_EVALUATION_BUNDLE_BYTES} total bytes.`);
		files.push(fileFromBuffer(portablePath, read.buffer));
	}
	return files;
}
function fileFromBuffer(relativePath, content) {
	const utf8 = content.toString("utf8");
	const isUtf8 = !utf8.includes("\0") && Buffer.from(utf8, "utf8").equals(content);
	return {
		path: relativePath,
		content: isUtf8 ? utf8 : content.toString("base64"),
		encoding: isUtf8 ? "utf8" : "base64",
		sha256: sha256Hex(content),
		sizeBytes: content.byteLength
	};
}
function snapshotFromFiles(inputFiles, skillMdPath) {
	const files = inputFiles.toSorted((a, b) => a.path.localeCompare(b.path));
	assertEvaluationBundleWithinLimits(files);
	const skillMd = files.find((file) => file.path === skillMdPath);
	if (!skillMd) throw new Error(`Skill evaluation bundle is missing ${skillMdPath}.`);
	return {
		skillMd,
		files: files.filter((file) => file.path !== skillMdPath),
		treeSha256: hashSkillTree(files)
	};
}
function assertEvaluationBundleWithinLimits(files) {
	if (files.length > MAX_EVALUATION_FILES) throw new Error(`Skill evaluation bundle exceeds ${MAX_EVALUATION_FILES} files.`);
	let totalBytes = 0;
	for (const file of files) {
		if (file.sizeBytes > MAX_EVALUATION_FILE_BYTES) throw new Error(`Skill evaluation bundle file exceeds ${MAX_EVALUATION_FILE_BYTES} bytes: ${file.path}.`);
		totalBytes += file.sizeBytes;
	}
	if (totalBytes > MAX_EVALUATION_BUNDLE_BYTES) throw new Error(`Skill evaluation bundle exceeds ${MAX_EVALUATION_BUNDLE_BYTES} total bytes.`);
}
function hashSkillTree(files) {
	return sha256Hex(JSON.stringify(files.toSorted((a, b) => a.path.localeCompare(b.path)).map((file) => ({
		path: file.path,
		sha256: file.sha256,
		sizeBytes: file.sizeBytes
	}))));
}
function resolveTargetSkillRelativePath(proposal, targetFiles, options) {
	const relativePath = path.relative(path.resolve(proposal.record.target.skillDir), path.resolve(proposal.record.target.skillFile));
	if (!relativePath || path.isAbsolute(relativePath) || relativePath.startsWith(`..${path.sep}`)) throw new Error("Skill evaluation target file must be inside the skill directory.");
	const portablePath = relativePath.split(path.sep).join("/");
	if (targetFiles.some((file) => file.path === portablePath)) return portablePath;
	if (!options.recordedTargetExists) return portablePath;
	const caseMatches = targetFiles.filter((file) => file.path.toLowerCase() === portablePath.toLowerCase());
	if (caseMatches.length === 1) return caseMatches[0].path;
	if (caseMatches.length > 1) throw new Error(`Skill evaluation target filename is ambiguous: ${portablePath}.`);
	return portablePath;
}
//#endregion
//#region src/skills/workshop/proposal-scan.ts
function scanProposalBundle(content, supportFiles = [], metadata = []) {
	const scannedAt = (/* @__PURE__ */ new Date()).toISOString();
	const findings = [
		...scanSkillContent(content, "PROPOSAL.md"),
		...scanSource(content, "PROPOSAL.md"),
		...supportFiles.flatMap((file) => [
			...scanSkillContent(file.path, "support-file-path").filter((finding) => finding.ruleId === "literal-secret"),
			...scanSkillContent(file.content, file.path),
			...scanSource(file.content, file.path)
		]),
		...metadata.flatMap((entry) => entry.content ? scanSkillContent(entry.content, entry.file).filter((finding) => finding.ruleId === "literal-secret") : [])
	];
	const critical = findings.filter((finding) => finding.severity === "critical").length;
	const warn = findings.filter((finding) => finding.severity === "warn").length;
	const info = findings.filter((finding) => finding.severity === "info").length;
	return {
		state: critical > 0 ? "failed" : "clean",
		scannedAt,
		critical,
		warn,
		info,
		findings
	};
}
function assertProposalContainsNoLiteralSecrets(scan) {
	const finding = scan.findings.find((entry) => entry.ruleId === "literal-secret");
	if (!finding) return;
	throw new Error(`Skill proposal contains a recognized literal credential in ${finding.file}; replace it with a SecretRef or placeholder.`);
}
//#endregion
//#region src/skills/workshop/apply-transition.ts
const SKILL_PROPOSAL_APPLY_TRANSITIONS = {
	pending: {
		apply_failed: "pending",
		apply_succeeded: "applied",
		scan_failed: "quarantined",
		target_changed: "stale"
	},
	applied: {},
	rejected: {},
	quarantined: {},
	stale: {}
};
var SkillProposalLifecycleError = class extends Error {
	constructor(message, record, event) {
		super(message);
		this.record = record;
		this.event = event;
	}
};
function resolveSkillProposalApplyTransition(status, outcome) {
	return SKILL_PROPOSAL_APPLY_TRANSITIONS[status][outcome] ?? null;
}
async function applySkillProposalTransition(input, dependencies) {
	const recoveryReadOptions = input.config ? { config: input.config } : void 0;
	const lockedReadOptions = {
		...input.config ? { config: input.config } : {},
		reconcile: false
	};
	const initial = await dependencies.readRequiredProposal(input.proposalId, input.workspaceDir, input.env, input.agentId, recoveryReadOptions);
	if (initial.record.status !== "pending") throw new Error(`Only pending proposals can be applied. Current status: ${initial.record.status}.`);
	dependencies.assertExpectedRevisionHash(initial.revisionHash, input.expectedRevisionHash);
	let evaluated;
	try {
		evaluated = await dependencies.evaluateSkillProposal({
			workspaceDir: input.workspaceDir,
			...input.agentId ? { agentId: input.agentId } : {},
			...input.eventActor ? { eventActor: input.eventActor } : {},
			...input.env ? { env: input.env } : {},
			proposalId: input.proposalId,
			expectedRevisionHash: initial.revisionHash,
			...input.correlationId ? { correlationId: input.correlationId } : {},
			trigger: "apply"
		});
	} catch (error) {
		if (dependencies.isCreateTargetConflict(error)) await withSkillProposalLifecycleDispatch(input, withSkillProposalTargetLock(initial.record, async () => {
			const current = await dependencies.readRequiredProposal(input.proposalId, input.workspaceDir, input.env, input.agentId, lockedReadOptions);
			if (current.record.status === "pending" && current.record.kind === "create" && await readWorkspaceSkillFile(current.record.target.skillFile) !== null) await markSkillProposalStale({
				record: current.record,
				reason: "Target skill was created after proposal creation.",
				message: "Target skill was created after proposal creation; proposal marked stale.",
				input
			});
			throw error;
		}, storeOptions$2(input.env)));
		throw error;
	}
	const blocking = evaluated.evaluation.outcomes.find((outcome) => outcome.status === "completed" && outcome.result.decision === "block");
	if (blocking?.status === "completed") throw new Error(blocking.result.decisionReason || `Skill proposal apply blocked by evaluator ${blocking.evaluatorId}.`);
	const result = await withSkillProposalLifecycleDispatch(input, withSkillProposalCommitLock(input.workspaceDir, evaluated.record, async () => {
		const read = await dependencies.readRequiredProposal(input.proposalId, input.workspaceDir, input.env, input.agentId, lockedReadOptions);
		const { record, content } = read;
		if (record.status !== "pending") throw new Error(`Only pending proposals can be applied. Current status: ${record.status}.`);
		dependencies.assertExpectedRevisionHash(read.revisionHash, evaluated.evaluation.revisionHash);
		if (hashSkillProposalContent(content) !== record.draftHash) throw new Error("Proposal draft changed without updating proposal metadata.");
		const supportFiles = read.supportFiles ?? [];
		if (!readProposalFrontmatter(content)) throw new Error("Proposal draft must include proposal frontmatter.");
		const scan = scanProposalBundle(content, supportFiles);
		if (scan.state !== "clean") await quarantineSkillProposalAfterScan({
			input,
			record,
			scan
		});
		assertInsideWorkspace(input.workspaceDir, record.target.skillFile, "skill file");
		assertInsideWorkspace(input.workspaceDir, record.target.skillDir, "skill directory");
		const operatorActor = input.eventActor?.type === "gateway" || input.eventActor?.type === "system";
		if (record.kind === "update" && !operatorActor && !isWorkshopOwnedSkillDir(input.workspaceDir, record.target.skillDir, storeOptions$2(input.env))) throw new Error(`Skill Workshop does not own this skill path: ${record.target.skillKey}`);
		const workshopConfig = resolveSkillWorkshopConfig(input.config);
		const symlinkPolicy = {
			allowWrites: workshopConfig.allowSymlinkTargetWrites,
			allowedTargetRealPaths: workshopConfig.allowSymlinkTargetWrites ? resolveAllowedSkillSymlinkTargetRealPaths(input.config) : []
		};
		if (record.evaluation?.id !== evaluated.evaluation.id) throw new Error("Skill proposal evaluation changed before apply; retry the operation.");
		if (evaluated.evaluation.targetTreeSha256) {
			let currentTargetTreeSha256;
			try {
				currentTargetTreeSha256 = await readSkillProposalTargetTreeSha256(record.target.skillDir);
			} catch {
				throw new Error("Skill target changed after evaluation; retry the operation.");
			}
			if (currentTargetTreeSha256 !== evaluated.evaluation.targetTreeSha256) throw new Error("Skill target changed after evaluation; retry the operation.");
		}
		const mutation = await prepareWorkspaceSkillMutation({
			workspaceDir: input.workspaceDir,
			skillDir: record.target.skillDir,
			skillFile: record.target.skillFile,
			content: stripProposalFrontmatterForSkill(content),
			supportFiles,
			mode: record.kind,
			symlinkPolicy
		});
		await assertApplyTargetUnchanged(record, mutation, input);
		const shouldDispatchSkillChange = hasCommittedSkillChangeHooks();
		const beforeSkill = shouldDispatchSkillChange && record.kind === "update" ? await snapshotCommittedSkillArtifactBestEffort({
			skillDir: record.target.skillDir,
			skillKey: record.target.skillKey,
			source: "workshop"
		}) : void 0;
		const rollback = createSkillProposalRollbackFromMutation(record, mutation);
		await writeSkillProposalRollback({
			proposalId: record.id,
			rollback,
			store: storeOptions$2(input.env)
		});
		try {
			await applyWorkspaceSkillMutation(mutation);
		} catch (error) {
			if (await isWorkspaceSkillMutationRestored(mutation).catch(() => false)) await clearSkillProposalRollback({
				proposalId: record.id,
				expectedRecordJson: JSON.stringify(record),
				store: storeOptions$2(input.env)
			}).catch(() => false);
			throw error;
		}
		const afterSkill = shouldDispatchSkillChange ? await snapshotCommittedSkillArtifactBestEffort({
			skillDir: record.target.skillDir,
			skillKey: record.target.skillKey,
			source: "workshop",
			sourceVersion: record.proposedVersion
		}) : void 0;
		const now = (/* @__PURE__ */ new Date()).toISOString();
		const applied = {
			...record,
			status: requiredApplyStatus("apply_succeeded"),
			updatedAt: now,
			appliedAt: now,
			statusReason: normalizeOptionalString(input.reason),
			scan
		};
		const eventInput = createSkillProposalEvent({
			record: applied,
			type: "applied",
			actor: input.eventActor,
			...input.correlationId ? { correlationId: input.correlationId } : {},
			occurredAt: now,
			payload: { targetSkillFile: record.target.skillFile }
		});
		let commit;
		try {
			commit = commitPendingSkillProposalTransition({
				expected: record,
				record: applied,
				event: eventInput,
				store: storeOptions$2(input.env),
				operationLabel: "skill-workshop.apply.commit"
			});
		} catch (error) {
			const recoveredEvent = await recoverAfterApplyCommitFailure({
				error,
				expected: record,
				applied,
				event: eventInput,
				mutation,
				env: input.env,
				workspaceDir: input.workspaceDir
			});
			if (!recoveredEvent) throw error;
			commit = {
				state: "committed",
				event: recoveredEvent
			};
		}
		if (commit.state === "conflict") {
			const error = /* @__PURE__ */ new Error("Skill proposal changed before apply status commit.");
			const recoveredEvent = await recoverAfterApplyCommitFailure({
				error,
				expected: record,
				applied,
				event: eventInput,
				mutation,
				env: input.env,
				workspaceDir: input.workspaceDir
			});
			if (!recoveredEvent) throw error;
			commit = {
				state: "committed",
				event: recoveredEvent
			};
		}
		bumpSkillsSnapshotVersion({
			workspaceDir: input.workspaceDir,
			reason: "workshop",
			changedPath: record.target.skillFile
		});
		return {
			result: {
				record: applied,
				targetSkillFile: record.target.skillFile
			},
			event: commit.event,
			skillChange: shouldDispatchSkillChange ? {
				before: beforeSkill,
				after: afterSkill
			} : void 0
		};
	}, storeOptions$2(input.env)));
	await dispatchSkillProposalChanged({
		event: result.event,
		record: result.result.record,
		workspaceDir: input.workspaceDir,
		...input.agentId ? { agentId: input.agentId } : {}
	});
	if (result.skillChange) await dispatchCommittedSkillChangeBestEffort({
		action: result.result.record.kind === "create" ? "created" : "updated",
		source: "workshop",
		workspaceDir: input.workspaceDir,
		before: result.skillChange.before,
		after: result.skillChange.after,
		proposal: {
			id: result.result.record.id,
			revision: result.result.record.proposedVersion,
			revisionSha256: hashSkillProposalRevision(result.result.record)
		}
	});
	return result.result;
}
async function withSkillProposalLifecycleDispatch(input, operation) {
	try {
		return await operation;
	} catch (error) {
		if (error instanceof SkillProposalLifecycleError) await dispatchSkillProposalChanged({
			event: error.event,
			record: error.record,
			workspaceDir: input.workspaceDir,
			...input.agentId ? { agentId: input.agentId } : {}
		});
		throw error;
	}
}
async function assertSkillProposalSupportTargetUnchanged(params) {
	const { record, file, currentContent } = params;
	if (file.targetExisted === false && currentContent !== null) await markSkillProposalStale({
		record,
		reason: `Target support file changed after proposal creation: ${file.path}`,
		message: "Target support file changed after proposal creation; proposal marked stale.",
		input: params.input
	});
	if (file.targetExisted === true) {
		if ((currentContent === null ? void 0 : hashSkillProposalContent(currentContent)) !== file.targetContentHash) await markSkillProposalStale({
			record,
			reason: `Target support file changed after proposal creation: ${file.path}`,
			message: "Target support file changed after proposal creation; proposal marked stale.",
			input: params.input
		});
	}
}
function transitionPendingSkillProposalToStale(params) {
	const now = (/* @__PURE__ */ new Date()).toISOString();
	const stale = {
		...params.record,
		status: requiredApplyStatus("target_changed"),
		updatedAt: now,
		staleAt: now,
		statusReason: params.reason
	};
	const commit = commitPendingSkillProposalTransition({
		expected: params.record,
		record: stale,
		event: createSkillProposalEvent({
			record: stale,
			type: "stale",
			actor: params.input.eventActor,
			...params.input.correlationId ? { correlationId: params.input.correlationId } : {},
			occurredAt: now
		}),
		store: storeOptions$2(params.input.env),
		operationLabel: "skill-workshop.stale.commit"
	});
	if (commit.state !== "committed") throw new Error("Failed to record stale Skill Workshop proposal.");
	return {
		record: stale,
		event: commit.event
	};
}
async function markSkillProposalStale(params) {
	const transition = transitionPendingSkillProposalToStale(params);
	throw new SkillProposalLifecycleError(params.message, transition.record, transition.event);
}
function createSkillProposalRollback(params) {
	return {
		schema: SKILL_WORKSHOP_ROLLBACK_SCHEMA,
		proposalId: params.proposalId,
		writtenAt: (/* @__PURE__ */ new Date()).toISOString(),
		targetSkillFile: params.targetSkillFile,
		action: params.action,
		...params.previousContent !== void 0 ? {
			previousContent: params.previousContent,
			previousContentHash: hashSkillProposalContent(params.previousContent)
		} : {},
		...params.supportFiles && params.supportFiles.length > 0 ? { supportFiles: params.supportFiles } : {}
	};
}
async function quarantineSkillProposalAfterScan(params) {
	const now = (/* @__PURE__ */ new Date()).toISOString();
	const updated = {
		...params.record,
		status: requiredApplyStatus("scan_failed"),
		updatedAt: now,
		quarantinedAt: now,
		scan: {
			...params.scan,
			state: "quarantined"
		},
		statusReason: "Proposal scan failed."
	};
	const commit = commitPendingSkillProposalTransition({
		expected: params.record,
		record: updated,
		event: createSkillProposalEvent({
			record: updated,
			type: "quarantined",
			actor: params.input.eventActor,
			...params.input.correlationId ? { correlationId: params.input.correlationId } : {},
			occurredAt: now
		}),
		store: storeOptions$2(params.input.env),
		operationLabel: "skill-workshop.quarantine.commit"
	});
	if (commit.state !== "committed") throw new Error("Failed to record quarantined Skill Workshop proposal.");
	throw new SkillProposalLifecycleError("Proposal scan failed; proposal was quarantined.", updated, commit.event);
}
async function assertApplyTargetUnchanged(record, mutation, input) {
	if (record.kind === "update" && record.target.currentContentHash && mutation.skillFile.previousContent !== null && hashSkillProposalContent(mutation.skillFile.previousContent) !== record.target.currentContentHash) await markSkillProposalStale({
		record,
		reason: "Target skill changed after proposal creation.",
		message: "Target skill changed after proposal creation; proposal marked stale.",
		input
	});
	for (const file of mutation.supportFiles) {
		const supportRecord = record.supportFiles?.find((entry) => entry.path === file.path);
		if (record.kind === "update" && supportRecord) await assertSkillProposalSupportTargetUnchanged({
			record,
			file: supportRecord,
			currentContent: file.previousContent,
			input
		});
	}
}
function createSkillProposalRollbackFromMutation(record, mutation) {
	return createSkillProposalRollback({
		proposalId: record.id,
		targetSkillFile: record.target.skillFile,
		action: record.kind,
		...mutation.skillFile.previousContent !== null ? { previousContent: mutation.skillFile.previousContent } : {},
		...mutation.supportFiles.length > 0 ? { supportFiles: mutation.supportFiles.map((file) => file.previousContent === null ? {
			path: file.path,
			existed: false
		} : {
			path: file.path,
			existed: true,
			previousContent: file.previousContent,
			previousContentHash: hashSkillProposalContent(file.previousContent)
		}) } : {}
	});
}
async function recoverAfterApplyCommitFailure(params) {
	const committed = readCommittedSkillProposalTransition({
		record: params.applied,
		event: params.event,
		store: storeOptions$2(params.env)
	});
	if (committed) return committed.event;
	if (readStoredProposal(params.expected.id, storeOptions$2(params.env))?.record.status === "applied") throw new Error("Applied Skill Workshop transition is missing its committed event.", { cause: params.error });
	requiredApplyStatus("apply_failed");
	if (!await isWorkspaceSkillMutationApplied(params.mutation).catch(() => false)) return null;
	try {
		try {
			await restoreWorkspaceSkillMutation(params.mutation);
		} finally {
			bumpSkillsSnapshotVersion({
				workspaceDir: params.workspaceDir,
				reason: "workshop",
				changedPath: params.expected.target.skillFile
			});
		}
	} catch (restoreError) {
		const failure = new Error("Skill proposal apply failed after filesystem mutation and requires reconciliation.", { cause: params.error });
		Object.assign(failure, { restoreError });
		throw failure;
	}
	await clearSkillProposalRollback({
		proposalId: params.expected.id,
		expectedRecordJson: JSON.stringify(params.expected),
		store: storeOptions$2(params.env)
	}).catch(() => false);
	return null;
}
function requiredApplyStatus(outcome) {
	const status = resolveSkillProposalApplyTransition("pending", outcome);
	if (!status) throw new Error(`Invalid pending Skill Workshop apply transition: ${outcome}`);
	return status;
}
function storeOptions$2(env) {
	return env ? { env } : {};
}
//#endregion
//#region src/skills/workshop/proposal-draft.ts
const MAX_PROPOSAL_DRAFT_BYTES = 1024 * 1024;
const MAX_PROPOSAL_DIRECTORY_ENTRIES = 256;
const MAX_SKILL_PROPOSAL_DESCRIPTION_BYTES = 160;
function prepareSkillProposalDraft(input) {
	try {
		assertProposalDescriptionWithinLimit(input.description);
		assertProposalContentWithinLimit(input.content, input.maxSkillBytes);
		const supportFiles = prepareSkillProposalSupportFiles(input.supportFiles);
		const content = renderProposalMarkdown({
			name: input.name,
			description: input.description,
			content: input.content,
			fallbackFrontmatterContent: input.fallbackFrontmatterContent,
			version: input.version,
			date: input.date
		});
		const goal = normalizeOptionalString(input.goal);
		const evidence = normalizeOptionalString(input.evidence);
		const scan = scanProposalBundle(content, supportFiles, [
			...input.secretScanMetadata ?? [],
			{
				file: "description",
				content: input.description
			},
			{
				file: "goal",
				content: goal
			},
			{
				file: "evidence",
				content: evidence
			}
		]);
		assertProposalContainsNoLiteralSecrets(scan);
		return ok({
			content,
			description: input.description,
			draftHash: hashSkillProposalContent(content),
			scan,
			supportFiles,
			...goal ? { goal } : {},
			...evidence ? { evidence } : {}
		});
	} catch (cause) {
		const error = cause instanceof Error ? cause : new Error(String(cause));
		return err({
			cause: error,
			message: error.message
		});
	}
}
function resolveUpdateProposalDescription(inputDescription, currentDescription) {
	const supplied = normalizeOptionalString(inputDescription);
	if (supplied) return supplied;
	return truncateUtf8(currentDescription.trim(), MAX_SKILL_PROPOSAL_DESCRIPTION_BYTES);
}
function nextProposalVersion(version) {
	const match = /^v(\d+)$/.exec(version.trim());
	if (!match) return "v2";
	const current = Number.parseInt(match[1] ?? "1", 10);
	return `v${Number.isSafeInteger(current) && current > 0 ? current + 1 : 2}`;
}
async function readSkillProposalDraftFile(filePath) {
	return decodeProposalTextFile((await readLocalFileSafely({
		filePath,
		maxBytes: MAX_PROPOSAL_DRAFT_BYTES
	})).buffer, filePath);
}
async function readSkillProposalDraftDirectory(dirPath) {
	const absoluteDir = path.resolve(dirPath);
	const draftRoot = await root(absoluteDir);
	const proposal = await draftRoot.read("PROPOSAL.md", {
		hardlinks: "reject",
		maxBytes: MAX_PROPOSAL_DRAFT_BYTES,
		symlinks: "reject"
	});
	const scanned = await walkDirectory(absoluteDir, {
		maxDepth: 8,
		maxEntries: MAX_PROPOSAL_DIRECTORY_ENTRIES,
		symlinks: "include"
	});
	if (scanned.truncated) throw new Error("Proposal directory has too many entries.");
	const supportFiles = [];
	for (const entry of scanned.entries.toSorted((a, b) => a.relativePath.localeCompare(b.relativePath))) {
		const relativePath = toPortableRelativePath(entry.relativePath);
		if (!relativePath || relativePath === "PROPOSAL.md") continue;
		if (entry.kind === "directory") continue;
		if (entry.kind !== "file") throw new Error(`Proposal support file must be a regular file: ${relativePath}`);
		const supportPath = normalizeWorkspaceSkillSupportPath(relativePath);
		if (((await fs.stat(entry.path)).mode & 73) !== 0) throw new Error(`Proposal support files must not be executable: ${relativePath}`);
		const read = await draftRoot.read(relativePath, {
			hardlinks: "reject",
			maxBytes: MAX_WORKSPACE_SKILL_SUPPORT_FILE_BYTES,
			symlinks: "reject"
		});
		supportFiles.push({
			path: supportPath,
			content: decodeProposalTextFile(read.buffer, relativePath)
		});
	}
	return {
		content: decodeProposalTextFile(proposal.buffer, "PROPOSAL.md"),
		supportFiles
	};
}
function decodeProposalTextFile(buffer, label) {
	const content = buffer.toString("utf8");
	if (!Buffer.from(content, "utf8").equals(buffer) || content.includes("\0")) throw new Error(`Proposal files must be UTF-8 text: ${label}`);
	return content;
}
function assertProposalDescriptionWithinLimit(description) {
	const sizeBytes = Buffer.byteLength(description, "utf8");
	if (sizeBytes > MAX_SKILL_PROPOSAL_DESCRIPTION_BYTES) throw new Error(`Skill proposal description is too large (${sizeBytes} bytes, max ${MAX_SKILL_PROPOSAL_DESCRIPTION_BYTES}).`);
}
function assertProposalContentWithinLimit(content, maxSkillBytes) {
	const sizeBytes = Buffer.byteLength(content, "utf8");
	if (sizeBytes > maxSkillBytes) throw new Error(`Skill proposal content is too large (${sizeBytes} bytes, max ${maxSkillBytes}).`);
}
function truncateUtf8(value, maxBytes) {
	let out = "";
	let sizeBytes = 0;
	for (const char of value) {
		const charBytes = Buffer.byteLength(char, "utf8");
		if (sizeBytes + charBytes > maxBytes) break;
		out += char;
		sizeBytes += charBytes;
	}
	return out.trimEnd();
}
function toPortableRelativePath(relativePath) {
	return relativePath.split(path.sep).join("/");
}
//#endregion
//#region src/skills/workshop/service-query.ts
function storeOptions$1(env) {
	return env ? { env } : {};
}
function proposalScope(options) {
	return {
		...options.agentId ? { agentId: options.agentId } : {},
		...options.workspaceDir ? { workspaceDir: options.workspaceDir } : {}
	};
}
async function listSkillProposals(options = {}) {
	const store = storeOptions$1(options.env);
	const scope = proposalScope(options);
	const manifest = await readSkillProposalManifest(store, scope);
	const missingDrafts = /* @__PURE__ */ new Set();
	for (const proposal of manifest.proposals) {
		if (proposal.kind !== "create" || proposal.status !== "pending") continue;
		let read;
		try {
			read = await readSkillProposal(proposal.id, store, scope);
		} catch (error) {
			if (!(error instanceof SkillProposalDraftMissingError)) throw error;
			missingDrafts.add(error.proposalId);
			continue;
		}
		if (read) await reconcilePendingCreateProposal(read, options);
	}
	const reconciled = await readSkillProposalManifest(store, scope);
	for (const proposal of reconciled.proposals) if (missingDrafts.has(proposal.id)) proposal.degradedState = "draft-missing";
	return reconciled;
}
async function getSkillProposalRunProgress(options) {
	const store = storeOptions$1(options.env);
	const manifest = await readSkillProposalManifest(store, options);
	const ids = [];
	let mutationCount = 0;
	for (const proposal of manifest.proposals) {
		const record = await readSkillProposalRecord(proposal.id, store, options);
		if (!record) continue;
		if (record.origin?.runId === options.runId || record.originRunIds?.includes(options.runId)) {
			ids.push(record.id);
			mutationCount += record.originRunMutationCounts?.[options.runId] ?? 1;
		}
	}
	return {
		mutationCount,
		proposalIds: ids
	};
}
async function inspectSkillProposal(proposalId, options = {}) {
	const read = await readSkillProposal(proposalId, storeOptions$1(options.env), proposalScope(options));
	if (!read) return null;
	return await reconcilePendingCreateProposal(read, options);
}
async function resolvePendingSkillProposal(input) {
	const proposalId = normalizeOptionalString(input.proposalId);
	if (proposalId) {
		const direct = await reconcilePendingCreateProposal(await readRequiredProposal(proposalId, input.workspaceDir, input.env, input.agentId), input);
		if (direct.record.status !== "pending") throw new Error(`Only pending proposals can be revised. Current status: ${direct.record.status}.`);
		return direct;
	}
	const name = normalizeOptionalString(input.name);
	if (!name) throw new Error("proposal_id or name required.");
	const matches = (await listSkillProposals({
		agentId: input.agentId,
		workspaceDir: input.workspaceDir,
		env: input.env
	})).proposals.filter((proposal) => proposal.status === "pending" && proposalMatchesName(proposal, name));
	if (matches.length === 0) throw new Error(`No pending skill proposal matched: ${name}`);
	if (matches.length > 1) {
		const candidates = matches.slice(0, 8).map((proposal) => `${proposal.id} (${proposal.skillKey})`).join(", ");
		throw new Error(`Multiple pending skill proposals matched ${name}: ${candidates}`);
	}
	const matched = await reconcilePendingCreateProposal(await readRequiredProposal(expectDefined(matches[0], "matches capture group 0").id, input.workspaceDir, input.env, input.agentId), input);
	if (matched.record.status !== "pending") throw new Error(`Only pending proposals can be revised. Current status: ${matched.record.status}.`);
	return matched;
}
async function readRequiredProposal(proposalId, workspaceDir, env, agentId, readOptions = {}) {
	const read = await readSkillProposal(proposalId, storeOptions$1(env), {
		...agentId ? { agentId } : {},
		...workspaceDir ? { workspaceDir } : {}
	}, readOptions);
	if (!read) throw new Error(`Skill proposal not found: ${proposalId}`);
	return read;
}
async function reconcilePendingCreateProposal(read, options) {
	const workspaceDir = options.workspaceDir;
	if (!workspaceDir || read.record.kind !== "create" || read.record.status !== "pending") return read;
	const resolvedWorkspaceDir = path.resolve(workspaceDir);
	const resolvedTarget = path.resolve(read.record.target.skillFile);
	if (options.agentId && resolvedTarget !== resolvedWorkspaceDir && !isPathInside(resolvedWorkspaceDir, resolvedTarget)) return read;
	const store = storeOptions$1(options.env);
	const scope = proposalScope(options);
	const reconciled = await withSkillProposalCommitLock(workspaceDir, read.record, async () => {
		const current = await readSkillProposal(read.record.id, store, scope, { reconcile: false });
		if (!current || current.record.kind !== "create" || current.record.status !== "pending") return { read: current ?? read };
		assertInsideWorkspace(workspaceDir, current.record.target.skillFile, "skill file");
		if (await readSkillProposalRollback(current.record.id, store)) return { read: current };
		if (await readWorkspaceSkillFile(current.record.target.skillFile) === null) return { read: current };
		const transition = transitionPendingSkillProposalToStale({
			record: current.record,
			reason: "Target skill was created after proposal creation.",
			input: {
				workspaceDir,
				...options.agentId ? { agentId: options.agentId } : {},
				eventActor: { type: "system" },
				...options.env ? { env: options.env } : {}
			}
		});
		return {
			read: {
				...current,
				record: transition.record,
				revisionHash: hashSkillProposalRevision(transition.record)
			},
			transition
		};
	}, store);
	if (reconciled.transition) await dispatchSkillProposalChanged({
		event: reconciled.transition.event,
		record: reconciled.transition.record,
		workspaceDir,
		...options.agentId ? { agentId: options.agentId } : {}
	});
	return reconciled.read;
}
function proposalMatchesName(proposal, name) {
	const normalizedName = normalizeSkillIndexName(name);
	return [
		proposal.id,
		proposal.skillName,
		proposal.skillKey,
		proposal.title,
		proposal.description
	].some((candidate) => {
		if (!candidate) return false;
		if (candidate === name || candidate.toLowerCase() === name.toLowerCase()) return true;
		const normalizedCandidate = normalizeSkillIndexName(candidate);
		return Boolean(normalizedName && normalizedCandidate && (normalizedCandidate === normalizedName || normalizedCandidate.includes(normalizedName) || normalizedName.includes(normalizedCandidate)));
	});
}
//#endregion
//#region src/skills/workshop/store-evaluation.ts
function recordSkillProposalEvaluation(params) {
	assertProposalId(params.proposalId);
	ensureSkillWorkshopSchema(params.store);
	return runOpenClawStateWriteTransaction(({ db }) => {
		const current = executeSqliteQueryTakeFirstSync(db, getNodeSqliteKysely(db).selectFrom("skill_workshop_proposals").selectAll().where("proposal_id", "=", params.proposalId));
		const record = current ? parseSkillProposalRow(current) : null;
		if (!current || !record) throw new Error(`Skill proposal not found: ${params.proposalId}`);
		if (record.status !== "pending" || record.proposedVersion !== params.expectedProposedVersion || hashSkillProposalRevision(record) !== params.expectedRevisionHash) throw new Error("Skill proposal changed while evaluation was running; discard the stale evaluation and retry.");
		const next = {
			...record,
			updatedAt: params.evaluation.completedAt,
			evaluation: params.evaluation
		};
		updateProposal(db, current, next);
		return {
			record: next,
			event: appendSkillProposalEvent(db, params.event)
		};
	}, databaseOptions(params.store), { operationLabel: "skill-workshop.proposal.evaluate" });
}
function readSkillProposalEvents(input, options = {}) {
	return listStoredSkillProposalEvents(input, options);
}
//#endregion
//#region src/skills/workshop/service-evaluation.ts
const MAX_EVALUATION_OUTCOMES = 64;
const MAX_EVALUATION_FINDINGS = 200;
const MAX_EVALUATION_METRICS = 64;
var SkillProposalCreateTargetConflictError = class extends Error {};
var SkillProposalRevisionChangedError = class extends Error {
	constructor(expectedRevisionHash, currentRevisionHash) {
		super(`Skill proposal revision changed (expected ${expectedRevisionHash}, current ${currentRevisionHash}); reload and retry.`);
		this.expectedRevisionHash = expectedRevisionHash;
		this.currentRevisionHash = currentRevisionHash;
		this.name = "SkillProposalRevisionChangedError";
	}
};
async function evaluateSkillProposal(input) {
	const correlationId = normalizeSkillProposalCorrelationId(input.correlationId);
	const shouldRunEvaluators = hasSkillProposalEvaluators();
	const { read, bundles } = await withSkillProposalTargetLock((await readRequiredProposal(input.proposalId, input.workspaceDir, input.env, input.agentId)).record, async () => {
		const read = await readRequiredProposal(input.proposalId, input.workspaceDir, input.env, input.agentId, { reconcile: false });
		if (read.record.status !== "pending") throw new Error(`Only pending proposals can be evaluated. Current status: ${read.record.status}.`);
		assertExpectedRevisionHash(read.revisionHash, input.expectedRevisionHash);
		if (hashSkillProposalContent(read.content) !== read.record.draftHash) throw new Error("Proposal draft changed without updating proposal metadata.");
		if (shouldRunEvaluators && read.record.kind === "create" && await readWorkspaceSkillFile(read.record.target.skillFile) !== null) throw new SkillProposalCreateTargetConflictError(`Skill proposal ${read.record.id} changed before evaluation started.`);
		return {
			read,
			bundles: shouldRunEvaluators ? await buildSkillProposalEvaluationBundles({
				proposal: read,
				supportFiles: read.supportFiles ?? []
			}) : void 0
		};
	}, storeOptions(input.env));
	const startedAt = (/* @__PURE__ */ new Date()).toISOString();
	const rawOutcomes = bundles ? await runSkillProposalEvaluators({
		...correlationId ? { correlationId } : {},
		proposal: {
			id: read.record.id,
			kind: read.record.kind,
			revision: read.record.proposedVersion,
			revisionSha256: read.revisionHash,
			...read.record.target.currentContentHash ? { targetCurrentSha256: read.record.target.currentContentHash } : {}
		},
		skill: {
			name: read.record.target.skillName,
			skillKey: read.record.target.skillKey,
			description: read.record.description,
			...read.record.target.source ? { source: read.record.target.source } : {}
		},
		candidate: bundles.candidate,
		...bundles.baseline ? { baseline: bundles.baseline } : {},
		reason: input.trigger === "apply" ? "apply" : "manual"
	}, {
		workspaceDir: input.workspaceDir,
		...input.agentId ? { agentId: input.agentId } : {}
	}) : [];
	const completedAt = (/* @__PURE__ */ new Date()).toISOString();
	const evaluation = {
		id: randomUUID(),
		proposedVersion: read.record.proposedVersion,
		revisionHash: read.revisionHash,
		trigger: input.trigger ?? "manual",
		startedAt,
		completedAt,
		...correlationId ? { correlationId } : {},
		...bundles ? { targetTreeSha256: bundles.targetTreeSha256 } : {},
		outcomes: normalizeEvaluationOutcomes(rawOutcomes)
	};
	assertSkillProposalEvaluationWithinLimit(evaluation);
	const eventInput = createSkillProposalEvent({
		record: {
			...read.record,
			evaluation
		},
		type: "evaluation_completed",
		actor: input.eventActor,
		...correlationId ? { correlationId } : {},
		occurredAt: completedAt,
		payload: {
			evaluationId: evaluation.id,
			trigger: evaluation.trigger,
			outcomeCount: evaluation.outcomes.length
		},
		evaluation
	});
	const stored = await withSkillProposalTargetLock(read.record, async () => {
		const current = await readRequiredProposal(input.proposalId, input.workspaceDir, input.env, input.agentId, { reconcile: false });
		if (current.record.status !== "pending" || current.record.proposedVersion !== read.record.proposedVersion || current.revisionHash !== read.revisionHash || hashSkillProposalContent(current.content) !== current.record.draftHash) throw new Error(`Skill proposal ${read.record.id} changed while evaluation was running.`);
		if (bundles) {
			let currentTargetTreeSha256;
			try {
				currentTargetTreeSha256 = await readSkillProposalTargetTreeSha256(current.record.target.skillDir);
			} catch {
				throw new Error(`Skill proposal ${read.record.id} changed while evaluation was running.`);
			}
			if (currentTargetTreeSha256 !== bundles.targetTreeSha256) throw new Error(`Skill proposal ${read.record.id} changed while evaluation was running.`);
		}
		return recordSkillProposalEvaluation({
			proposalId: read.record.id,
			expectedProposedVersion: read.record.proposedVersion,
			expectedRevisionHash: read.revisionHash,
			evaluation,
			event: eventInput,
			store: storeOptions(input.env)
		});
	}, storeOptions(input.env));
	await dispatchSkillProposalChanged({
		event: stored.event,
		record: stored.record,
		workspaceDir: input.workspaceDir,
		...input.agentId ? { agentId: input.agentId } : {},
		evaluations: evaluation.outcomes
	});
	return {
		record: stored.record,
		evaluation
	};
}
function listSkillProposalEvents(input) {
	return readSkillProposalEvents(input, storeOptions(input.env));
}
function assertExpectedRevisionHash(actual, expected) {
	const normalized = normalizeOptionalString(expected);
	if (normalized && normalized !== actual) throw new SkillProposalRevisionChangedError(normalized, actual);
}
function normalizeEvaluationOutcomes(outcomes) {
	if (outcomes.length > MAX_EVALUATION_OUTCOMES) throw new Error(`Skill proposal evaluation returned more than ${MAX_EVALUATION_OUTCOMES} outcomes.`);
	return outcomes.map((outcome) => {
		const attribution = {
			evaluatorId: boundedRequired(outcome.evaluatorId, 128, outcome.pluginId),
			pluginId: boundedRequired(outcome.pluginId, 128, "unknown-plugin"),
			...outcome.pluginVersion ? { pluginVersion: boundedRequired(outcome.pluginVersion, 128, "unknown") } : {}
		};
		if (outcome.status === "skipped") return {
			...attribution,
			status: "skipped"
		};
		if (outcome.status === "error") return {
			...attribution,
			status: "error",
			error: boundedRequired(outcome.error, 2e3, "Evaluator failed.")
		};
		const result = normalizeEvaluationResult(outcome.result);
		return result ? {
			...attribution,
			status: "completed",
			result
		} : {
			...attribution,
			status: "error",
			error: "Evaluator returned an invalid result."
		};
	});
}
function normalizeEvaluationResult(result) {
	if (!result || typeof result !== "object" || Array.isArray(result)) return null;
	const findings = normalizeFindings(result.findings);
	const metrics = normalizeMetrics(result.metrics);
	if (result.findings !== void 0 && !findings) return null;
	if (result.metrics !== void 0 && !metrics) return null;
	if (result.decision !== void 0 && ![
		"pass",
		"revise",
		"block"
	].includes(result.decision)) return null;
	const summary = boundedOptional(result.summary, 8e3);
	const evaluatorVersion = boundedOptional(result.evaluatorVersion, 128);
	const mode = boundedOptional(result.mode, 128);
	const decisionReason = boundedOptional(result.decisionReason, 2e3);
	return {
		...summary ? { summary } : {},
		...findings ? { findings } : {},
		...metrics ? { metrics } : {},
		...evaluatorVersion ? { evaluatorVersion } : {},
		...mode ? { mode } : {},
		...result.decision ? { decision: result.decision } : {},
		...decisionReason ? { decisionReason } : {}
	};
}
function normalizeFindings(findings) {
	if (findings === void 0) return;
	if (!Array.isArray(findings) || findings.length > MAX_EVALUATION_FINDINGS) return;
	const normalized = [];
	for (const finding of findings) {
		if (!finding || typeof finding !== "object" || ![
			"info",
			"warn",
			"critical"
		].includes(finding.severity) || !finding.ruleId || !finding.message || finding.line !== void 0 && (!Number.isSafeInteger(finding.line) || finding.line < 1)) return;
		const file = boundedOptional(finding.file, 1024);
		normalized.push({
			ruleId: boundedRequired(finding.ruleId, 256, "unknown"),
			severity: finding.severity,
			message: boundedRequired(finding.message, 4e3, "Invalid finding."),
			...file ? { file } : {},
			...finding.line !== void 0 ? { line: finding.line } : {}
		});
	}
	return normalized;
}
function normalizeMetrics(metrics) {
	if (metrics === void 0) return;
	if (!metrics || typeof metrics !== "object" || Array.isArray(metrics)) return;
	const entries = Object.entries(metrics);
	if (entries.length > MAX_EVALUATION_METRICS) return;
	const normalized = {};
	for (const [key, value] of entries) {
		if (!key || key.length > 128 || typeof value !== "string" && typeof value !== "number" && typeof value !== "boolean" || typeof value === "number" && !Number.isFinite(value)) return;
		normalized[key] = typeof value === "string" ? truncateUtf16Safe(value, 4e3) : value;
	}
	return normalized;
}
function boundedRequired(value, maxLength, fallback) {
	return truncateUtf16Safe(normalizeOptionalString(value) ?? fallback, maxLength);
}
function boundedOptional(value, maxLength) {
	const normalized = normalizeOptionalString(value);
	return normalized === void 0 ? void 0 : truncateUtf16Safe(normalized, maxLength);
}
function storeOptions(env) {
	return env ? { env } : {};
}
//#endregion
//#region src/skills/workshop/service-propose.ts
var SkillProposalStaleTargetError = class extends Error {};
function proposalStoreOptions$1(env) {
	return env ? { env } : {};
}
function normalizeProposalOrigin(origin) {
	const agentId = normalizeOptionalString(origin?.agentId);
	const sessionKey = normalizeOptionalString(origin?.sessionKey);
	const runId = normalizeOptionalString(origin?.runId);
	const messageId = normalizeOptionalString(origin?.messageId);
	if (!agentId && !sessionKey && !runId && !messageId) return;
	return {
		...agentId ? { agentId } : {},
		...sessionKey ? { sessionKey } : {},
		...runId ? { runId } : {},
		...messageId ? { messageId } : {}
	};
}
function mergeProposalOriginRunProvenance(record, origin) {
	const ids = new Set(record?.originRunIds);
	const counts = { ...record?.originRunMutationCounts };
	if (record?.origin?.runId) ids.add(record.origin.runId);
	for (const runId of ids) counts[runId] ??= 1;
	if (origin?.runId) {
		ids.add(origin.runId);
		counts[origin.runId] = (counts[origin.runId] ?? 0) + 1;
	}
	if (ids.size > 4096) throw new Error("Skill proposal run provenance exceeds the supported limit.");
	return {
		...ids.size > 0 ? { originRunIds: [...ids] } : {},
		...Object.keys(counts).length > 0 ? { originRunMutationCounts: counts } : {}
	};
}
async function proposeCreateSkill(input) {
	const name = normalizeRequired(input.name, "Skill name");
	const description = normalizeRequired(input.description, "Skill description");
	const config = resolveSkillWorkshopConfig(input.config);
	const target = resolveSkillProposalTarget({
		workspaceDir: input.workspaceDir,
		skillName: name
	});
	if (await readWorkspaceSkillFile(target.skillFile) !== null) throw new Error(`Skill already exists at ${target.skillFile}.`);
	const now = (/* @__PURE__ */ new Date()).toISOString();
	const prepared = prepareSkillProposalDraft({
		name: target.skillKey,
		description,
		content: input.content,
		date: now,
		maxSkillBytes: config.maxSkillBytes,
		supportFiles: input.supportFiles,
		secretScanMetadata: [{
			file: "skill-name",
			content: name
		}],
		goal: input.goal,
		evidence: input.evidence
	});
	if (!prepared.ok) throw prepared.error.cause;
	const { content: proposalContent, draftHash, evidence, goal, scan, supportFiles } = prepared.value;
	const id = createSkillProposalId(name);
	const origin = normalizeProposalOrigin({
		...input.origin,
		agentId: input.origin?.agentId ?? input.agentId
	});
	const originRunProvenance = mergeProposalOriginRunProvenance(void 0, origin);
	const record = {
		schema: SKILL_WORKSHOP_SCHEMA,
		id,
		kind: "create",
		status: "pending",
		title: `Create ${name}`,
		description,
		createdAt: now,
		updatedAt: now,
		createdBy: input.createdBy ?? "skill-workshop",
		...input.autonomousCapture ? { autonomousCapture: true } : {},
		...origin ? { origin } : {},
		...originRunProvenance,
		proposedVersion: "v1",
		draftFile: createSkillProposalGenerationDraftFile(),
		draftHash,
		target: {
			skillName: name,
			skillKey: target.skillKey,
			skillDir: target.skillDir,
			skillFile: target.skillFile,
			source: "openclaw-workspace"
		},
		scan,
		...supportFiles.length > 0 ? { supportFiles: await buildSupportFileMetadata(supportFiles) } : {},
		...goal ? { goal } : {},
		...evidence ? { evidence } : {}
	};
	await dispatchSkillProposalChanged({
		event: await writeSkillProposal({
			record,
			content: proposalContent,
			supportFiles,
			workspaceDir: input.workspaceDir,
			ownerAgentId: input.agentId,
			maxPending: config.maxPending,
			event: createSkillProposalEvent({
				record,
				type: "created",
				actor: input.eventActor
			}),
			store: proposalStoreOptions$1(input.env)
		}),
		record,
		workspaceDir: input.workspaceDir,
		...input.agentId ? { agentId: input.agentId } : {}
	});
	return {
		record,
		revisionHash: hashSkillProposalRevision(record),
		content: proposalContent
	};
}
/** Applies a reviewer patch to the live body: unique-match replace, or append when oldString is empty. */
function composeSkillBodyPatch(body, patch) {
	if (!patch.oldString) {
		if (!patch.newString.trim()) throw new Error("Patch newString must not be empty when appending.");
		return `${body.trimEnd()}\n\n${patch.newString.trim()}\n`;
	}
	const { start, end } = findUniqueSkillPatchSpan(body, patch.oldString);
	return `${body.slice(0, start)}${patch.newString}${body.slice(end)}`;
}
/** Resolves the one exact live-body span that a targeted patch may replace. */
function findUniqueSkillPatchSpan(body, oldString) {
	const first = body.indexOf(oldString);
	if (first === -1) throw new Error("Patch oldString not found in the live skill body. Read the skill and quote the exact current text.");
	if (body.includes(oldString, first + 1)) throw new Error("Patch oldString matches more than once in the live skill body. Quote a longer unique span.");
	return {
		start: first,
		end: first + oldString.length
	};
}
async function proposeUpdateSkill(input) {
	const skillName = normalizeRequired(input.skillName, "Skill name");
	const config = resolveSkillWorkshopConfig(input.config);
	const targetSkill = resolveSkillStatusEntry(buildWorkspaceSkillStatus(input.workspaceDir, {
		config: input.config,
		agentId: input.agentId
	}).skills, skillName);
	if (!targetSkill) throw new Error(`Skill not found: ${skillName}`);
	assertWritableSkillTarget(input.workspaceDir, targetSkill);
	const currentContent = await readWorkspaceSkillFile(targetSkill.filePath);
	if (currentContent === null) throw new Error(`Skill file is missing: ${targetSkill.filePath}`);
	if (input.expectedCurrentContentHash !== void 0 && sha256Hex(currentContent) !== input.expectedCurrentContentHash) throw new SkillProposalStaleTargetError("Skill changed since the reviewer's read: read it again and redraft the update.");
	const draftContent = input.composePatch !== void 0 ? composeSkillBodyPatch(stripProposalFrontmatterForSkill(currentContent), input.composePatch) : input.content;
	if (draftContent === void 0) throw new Error("Update proposal requires content or composePatch.");
	const description = resolveUpdateProposalDescription(input.description, targetSkill.description);
	const now = (/* @__PURE__ */ new Date()).toISOString();
	const prepared = prepareSkillProposalDraft({
		name: targetSkill.skillKey,
		description,
		content: draftContent,
		fallbackFrontmatterContent: currentContent,
		date: now,
		maxSkillBytes: config.maxSkillBytes,
		supportFiles: input.supportFiles,
		goal: input.goal,
		evidence: input.evidence
	});
	if (!prepared.ok) throw prepared.error.cause;
	const { content: proposalContent, draftHash, evidence, goal, scan, supportFiles } = prepared.value;
	const id = createSkillProposalId(targetSkill.skillKey || targetSkill.name);
	const origin = normalizeProposalOrigin({
		...input.origin,
		agentId: input.origin?.agentId ?? input.agentId
	});
	const originRunProvenance = mergeProposalOriginRunProvenance(void 0, origin);
	const record = {
		schema: SKILL_WORKSHOP_SCHEMA,
		id,
		kind: "update",
		status: "pending",
		title: `Update ${targetSkill.name}`,
		description,
		createdAt: now,
		updatedAt: now,
		createdBy: input.createdBy ?? "skill-workshop",
		...input.autonomousCapture ? { autonomousCapture: true } : {},
		...origin ? { origin } : {},
		...originRunProvenance,
		proposedVersion: "v1",
		draftFile: createSkillProposalGenerationDraftFile(),
		draftHash,
		target: {
			skillName: targetSkill.name,
			skillKey: targetSkill.skillKey,
			skillDir: targetSkill.baseDir,
			skillFile: targetSkill.filePath,
			source: targetSkill.source,
			currentContentHash: hashSkillProposalContent(currentContent)
		},
		scan,
		...supportFiles.length > 0 ? { supportFiles: await buildSupportFileMetadata(supportFiles, targetSkill.baseDir) } : {},
		...goal ? { goal } : {},
		...evidence ? { evidence } : {}
	};
	await dispatchSkillProposalChanged({
		event: await writeSkillProposal({
			record,
			content: proposalContent,
			supportFiles,
			workspaceDir: input.workspaceDir,
			ownerAgentId: input.agentId ?? origin?.agentId,
			maxPending: config.maxPending,
			event: createSkillProposalEvent({
				record,
				type: "created",
				actor: input.eventActor
			}),
			store: proposalStoreOptions$1(input.env)
		}),
		record,
		workspaceDir: input.workspaceDir,
		...input.agentId ? { agentId: input.agentId } : {}
	});
	return {
		record,
		revisionHash: hashSkillProposalRevision(record),
		content: proposalContent
	};
}
async function buildSupportFileMetadata(files, targetSkillDir) {
	const out = [];
	for (const file of files) {
		const metadata = {
			path: file.path,
			sizeBytes: file.sizeBytes,
			hash: file.hash
		};
		if (targetSkillDir) {
			const targetContent = await readWorkspaceSupportFile({
				skillDir: targetSkillDir,
				relativePath: file.path
			});
			metadata.targetExisted = targetContent !== null;
			if (targetContent !== null) metadata.targetContentHash = hashSkillProposalContent(targetContent);
		}
		out.push(metadata);
	}
	return out;
}
function normalizeRequired(value, label) {
	const normalized = normalizeOptionalString(value);
	if (!normalized) throw new Error(`${label} is required.`);
	return normalized;
}
//#endregion
//#region src/skills/workshop/service.ts
function proposalStoreOptions(env) {
	return env ? { env } : {};
}
const APPLY_TRANSITION_DEPENDENCIES = {
	assertExpectedRevisionHash,
	evaluateSkillProposal,
	isCreateTargetConflict: (error) => error instanceof SkillProposalCreateTargetConflictError,
	readRequiredProposal
};
async function reviseSkillProposal(input) {
	if (input.content === void 0 && input.supportFiles === void 0 && input.description === void 0 && input.goal === void 0 && input.evidence === void 0) throw new Error("Skill proposal revision requires at least one changed field.");
	const config = resolveSkillWorkshopConfig(input.config);
	const revisedResult = await withSkillProposalLifecycleDispatch(input, withPendingSkillProposalMutation(input, "revised", async (read) => {
		const { record } = read;
		assertInsideWorkspace(input.workspaceDir, record.target.skillFile, "skill file");
		assertInsideWorkspace(input.workspaceDir, record.target.skillDir, "skill directory");
		if (record.kind === "create") {
			if (await readWorkspaceSkillFile(record.target.skillFile) !== null) await markSkillProposalStale({
				record,
				reason: "Target skill was created after proposal creation.",
				message: "Target skill was created after proposal creation; proposal marked stale.",
				input
			});
		} else {
			const currentContent = await readWorkspaceSkillFile(record.target.skillFile);
			if (currentContent === null) throw new Error(`Target skill is missing: ${record.target.skillFile}`);
			if (record.target.currentContentHash && hashSkillProposalContent(currentContent) !== record.target.currentContentHash) await markSkillProposalStale({
				record,
				reason: "Target skill changed after proposal creation.",
				message: "Target skill changed after proposal creation; proposal marked stale.",
				input
			});
			await assertSupportTargetsUnchanged(record, input);
		}
		const supportFiles = input.supportFiles === void 0 ? read.supportFiles ?? [] : input.supportFiles;
		const requestedContent = input.content ?? read.content;
		const nextVersion = nextProposalVersion(record.proposedVersion);
		const description = normalizeOptionalString(input.description) ?? record.description;
		const now = (/* @__PURE__ */ new Date()).toISOString();
		const prepared = prepareSkillProposalDraft({
			name: record.target.skillKey,
			description,
			content: requestedContent,
			fallbackFrontmatterContent: read.content,
			version: nextVersion,
			date: now,
			maxSkillBytes: config.maxSkillBytes,
			supportFiles,
			goal: input.goal === void 0 ? record.goal : input.goal,
			evidence: input.evidence === void 0 ? record.evidence : input.evidence
		});
		if (!prepared.ok) throw prepared.error.cause;
		const { content: proposalContent, draftHash, evidence, goal, scan, supportFiles: preparedSupportFiles } = prepared.value;
		const supportFileMetadata = preparedSupportFiles.length > 0 ? await buildSupportFileMetadata(preparedSupportFiles, record.kind === "update" ? record.target.skillDir : void 0) : [];
		const origin = normalizeProposalOrigin(input.origin);
		const originRunProvenance = mergeProposalOriginRunProvenance(record, origin);
		const revised = {
			...record,
			description,
			updatedAt: now,
			proposedVersion: nextVersion,
			draftFile: createSkillProposalGenerationDraftFile(),
			draftHash,
			scan,
			...origin ? { origin } : {},
			...originRunProvenance
		};
		delete revised.evaluation;
		if (preparedSupportFiles.length > 0) revised.supportFiles = supportFileMetadata;
		else delete revised.supportFiles;
		if (goal) revised.goal = goal;
		else delete revised.goal;
		if (evidence) revised.evidence = evidence;
		else delete revised.evidence;
		const event = await replaceSkillProposalDraft({
			expected: record,
			record: revised,
			content: proposalContent,
			supportFiles: preparedSupportFiles,
			event: createSkillProposalEvent({
				record: revised,
				type: "revised",
				actor: input.eventActor,
				...input.correlationId ? { correlationId: input.correlationId } : {},
				occurredAt: now
			}),
			store: proposalStoreOptions(input.env)
		});
		return {
			read: {
				record: revised,
				revisionHash: hashSkillProposalRevision(revised),
				content: proposalContent
			},
			event
		};
	}));
	await dispatchSkillProposalChanged({
		event: revisedResult.event,
		record: revisedResult.read.record,
		workspaceDir: input.workspaceDir,
		...input.agentId ? { agentId: input.agentId } : {}
	});
	return revisedResult.read;
}
async function rejectSkillProposal(input) {
	return await markProposal(input, "rejected");
}
async function quarantineSkillProposal(input) {
	const result = await withPendingSkillProposalMutation(input, "quarantined", async (read) => {
		const now = (/* @__PURE__ */ new Date()).toISOString();
		const record = {
			...read.record,
			status: "quarantined",
			updatedAt: now,
			quarantinedAt: now,
			statusReason: normalizeOptionalString(input.reason),
			scan: {
				...read.record.scan,
				state: "quarantined"
			}
		};
		return {
			record,
			event: await updateSkillProposalRecord({
				record,
				event: createSkillProposalEvent({
					record,
					type: "quarantined",
					actor: input.eventActor,
					...input.correlationId ? { correlationId: input.correlationId } : {},
					occurredAt: now
				}),
				store: proposalStoreOptions(input.env)
			})
		};
	});
	if (result.event) await dispatchSkillProposalChanged({
		event: result.event,
		record: result.record,
		workspaceDir: input.workspaceDir,
		...input.agentId ? { agentId: input.agentId } : {}
	});
	return result.record;
}
async function applySkillProposal(input) {
	return await applySkillProposalTransition(input, APPLY_TRANSITION_DEPENDENCIES);
}
async function markProposal(input, status) {
	const scope = {
		...input.agentId ? { agentId: input.agentId } : {},
		workspaceDir: input.workspaceDir
	};
	const initial = await readSkillProposalRecord(input.proposalId, proposalStoreOptions(input.env), scope);
	if (!initial) throw new Error(`Skill proposal not found: ${input.proposalId}`);
	const result = await withSkillProposalTargetLock(initial, async () => {
		const current = await readSkillProposalRecord(input.proposalId, proposalStoreOptions(input.env), scope, { reconcile: false });
		if (!current) throw new Error(`Skill proposal not found: ${input.proposalId}`);
		if (current.status !== "pending") throw new Error(`Only pending proposals can be rejected. Current status: ${current.status}.`);
		assertExpectedRevisionHash(hashSkillProposalRevision(current), input.expectedRevisionHash);
		const now = (/* @__PURE__ */ new Date()).toISOString();
		const record = {
			...current,
			status,
			updatedAt: now,
			rejectedAt: now,
			statusReason: normalizeOptionalString(input.reason)
		};
		return {
			record,
			event: await updateSkillProposalRecord({
				record,
				event: createSkillProposalEvent({
					record,
					type: status,
					actor: input.eventActor,
					...input.correlationId ? { correlationId: input.correlationId } : {},
					occurredAt: now
				}),
				store: proposalStoreOptions(input.env)
			})
		};
	}, proposalStoreOptions(input.env));
	if (result.event) await dispatchSkillProposalChanged({
		event: result.event,
		record: result.record,
		workspaceDir: input.workspaceDir,
		...input.agentId ? { agentId: input.agentId } : {}
	});
	return result.record;
}
async function withPendingSkillProposalMutation(input, action, fn) {
	const recoveryReadOptions = input.config ? { config: input.config } : void 0;
	const lockedReadOptions = {
		...input.config ? { config: input.config } : {},
		reconcile: false
	};
	return await withSkillProposalTargetLock((await readRequiredProposal(input.proposalId, input.workspaceDir, input.env, input.agentId, recoveryReadOptions)).record, async () => {
		const read = await readRequiredProposal(input.proposalId, input.workspaceDir, input.env, input.agentId, lockedReadOptions);
		if (read.record.status !== "pending") throw new Error(`Only pending proposals can be ${action}. Current status: ${read.record.status}.`);
		assertExpectedRevisionHash(read.revisionHash, input.expectedRevisionHash);
		if (hashSkillProposalContent(read.content) !== read.record.draftHash) throw new Error("Proposal draft changed without updating proposal metadata.");
		return await fn(read);
	}, proposalStoreOptions(input.env));
}
async function assertSupportTargetsUnchanged(record, input) {
	if (record.kind !== "update" || !record.supportFiles) return;
	for (const file of record.supportFiles) {
		if (file.targetExisted === void 0) continue;
		await assertSkillProposalSupportTargetUnchanged({
			record,
			file,
			currentContent: await readWorkspaceSupportFile({
				skillDir: record.target.skillDir,
				relativePath: file.path
			}),
			input
		});
	}
}
//#endregion
export { resolvePendingSkillProposal as _, SkillProposalStaleTargetError as a, readSkillProposalDraftFile as b, proposeCreateSkill as c, assertExpectedRevisionHash as d, evaluateSkillProposal as f, listSkillProposals as g, inspectSkillProposal as h, reviseSkillProposal as i, proposeUpdateSkill as l, getSkillProposalRunProgress as m, quarantineSkillProposal as n, composeSkillBodyPatch as o, listSkillProposalEvents as p, rejectSkillProposal as r, findUniqueSkillPatchSpan as s, applySkillProposal as t, SkillProposalRevisionChangedError as u, prepareSkillProposalDraft as v, readSkillProposalTargetTreeSha256 as x, readSkillProposalDraftDirectory as y };
