import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import "./src-BkwWvwB2.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import { a as isPathInside } from "./path-D138yf8v.js";
import "./path-safety-C2hsuc07.js";
import { _ as getNodeSqliteKysely, g as executeSqliteQueryTakeFirstSync } from "./openclaw-state-db.paths-DmtKty-F.js";
import { h as runOpenClawStateWriteTransaction } from "./openclaw-state-db-DlCMR4eQ.js";
import { a as sha256Hex } from "./crypto-digest-PR8Utwzg.js";
import { a as normalizeSkillIndexName } from "./skill-index-CEvOAhOd.js";
import { t as bumpSkillsSnapshotVersion } from "./refresh-state-DHnXO3IV.js";
import { t as resolveSkillWorkshopConfig } from "./config-Cjp42tXL.js";
import { S as snapshotCommittedSkillArtifactBestEffort, b as dispatchCommittedSkillChangeBestEffort, x as hasCommittedSkillChangeHooks } from "./clawhub-DU4Rfpsl.js";
import { n as resolveSkillStatusEntry, t as buildWorkspaceSkillStatus } from "./status-B6UMGB3b.js";
import { n as resolveAllowedSkillSymlinkTargetRealPaths } from "./symlink-targets-Cwce114b.js";
import { a as isWorkspaceSkillMutationApplied, c as prepareWorkspaceSkillMutation, d as readWorkspaceSupportFile, f as restoreWorkspaceSkillMutation, n as applyWorkspaceSkillMutation, o as isWorkspaceSkillMutationRestored, r as assertInsideWorkspace, u as readWorkspaceSkillFile } from "./workspace-skill-write-BmSx-_PN.js";
import { A as assertProposalId, B as hasSkillProposalEvaluators, C as readSkillProposalRollback, D as updateProposal, E as readStoredProposal, F as SKILL_WORKSHOP_ROLLBACK_SCHEMA, H as runSkillProposalEvaluators, I as SKILL_WORKSHOP_SCHEMA, K as stripProposalFrontmatterForSkill, L as hashSkillProposalContent, O as databaseOptions, R as createSkillProposalEvent, S as clearSkillProposalRollback, T as parseSkillProposalRow, U as hashSkillProposalRevision, V as normalizeSkillProposalCorrelationId, W as readProposalFrontmatter, a as readSkillProposal, b as appendSkillProposalEvent, c as replaceSkillProposalDraft, d as writeSkillProposal, i as readProposalSupportFiles, j as assertSkillProposalEvaluationWithinLimit, k as ensureSkillWorkshopSchema, l as resolveSkillProposalTarget, m as withSkillProposalTargetLock, o as readSkillProposalManifest, p as withSkillProposalCommitLock, s as readSkillProposalRecord, t as createSkillProposalId, u as updateSkillProposalRecord, v as commitPendingSkillProposalTransition, w as writeSkillProposalRollback, x as listStoredSkillProposalEvents, y as readCommittedSkillProposalTransition, z as dispatchSkillProposalChanged } from "./store-B2Ee7vWz.js";
import { a as resolveUpdateProposalDescription, c as readSkillProposalTargetTreeSha256, n as prepareSkillProposalDraft, o as scanProposalBundle, s as buildSkillProposalEvaluationBundles, t as nextProposalVersion } from "./proposal-draft-CjHlAtkv.js";
import { t as assertWritableSkillTarget } from "./workspace-skill-read-qxU-3GeX.js";
import { randomUUID } from "node:crypto";
import path from "node:path";
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
		const supportFiles = await dependencies.readProposalSupportFiles(record, storeOptions$2(input.env));
		if (!readProposalFrontmatter(content)) throw new Error("Proposal draft must include proposal frontmatter.");
		const scan = scanProposalBundle(content, supportFiles);
		if (scan.state !== "clean") await quarantineSkillProposalAfterScan({
			input,
			record,
			scan
		});
		assertInsideWorkspace(input.workspaceDir, record.target.skillFile, "skill file");
		assertInsideWorkspace(input.workspaceDir, record.target.skillDir, "skill directory");
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
			...commit.state === "committed" && commit.event ? { event: commit.event } : {},
			skillChange: shouldDispatchSkillChange ? {
				before: beforeSkill,
				after: afterSkill
			} : void 0
		};
	}, storeOptions$2(input.env)));
	if (result.event) await dispatchSkillProposalChanged({
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
	if (commit.state !== "committed" || !commit.event) throw new Error("Failed to record stale Skill Workshop proposal.");
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
	if (commit.state !== "committed" || !commit.event) throw new Error("Failed to record quarantined Skill Workshop proposal.");
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
	if (committed) return committed.event ?? null;
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
	for (const proposal of manifest.proposals) {
		if (proposal.kind !== "create" || proposal.status !== "pending") continue;
		const read = await readSkillProposal(proposal.id, store, scope);
		if (read) await reconcilePendingCreateProposal(read, options);
	}
	return await readSkillProposalManifest(store, scope);
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
	return await hydrateProposalSupportFiles(await reconcilePendingCreateProposal(read, options), options.env);
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
async function hydrateProposalSupportFiles(read, env) {
	const supportFiles = await readProposalSupportFiles(read.record, storeOptions$1(env));
	return supportFiles.length === 0 ? read : {
		...read,
		supportFiles: supportFiles.map((file) => ({
			path: file.path,
			content: file.content
		}))
	};
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
async function evaluateSkillProposal(input) {
	const correlationId = normalizeSkillProposalCorrelationId(input.correlationId);
	const shouldRunEvaluators = hasSkillProposalEvaluators();
	const { read, bundles } = await withSkillProposalTargetLock((await readRequiredProposal(input.proposalId, input.workspaceDir, input.env, input.agentId)).record, async () => {
		const read = await readRequiredProposal(input.proposalId, input.workspaceDir, input.env, input.agentId, { reconcile: false });
		if (read.record.status !== "pending") throw new Error(`Only pending proposals can be evaluated. Current status: ${read.record.status}.`);
		assertExpectedRevisionHash(read.revisionHash, input.expectedRevisionHash);
		if (hashSkillProposalContent(read.content) !== read.record.draftHash) throw new Error("Proposal draft changed without updating proposal metadata.");
		const supportFiles = await readProposalSupportFiles(read.record, storeOptions(input.env));
		if (shouldRunEvaluators && read.record.kind === "create" && await readWorkspaceSkillFile(read.record.target.skillFile) !== null) throw new SkillProposalCreateTargetConflictError(`Skill proposal ${read.record.id} changed before evaluation started.`);
		return {
			read,
			bundles: shouldRunEvaluators ? await buildSkillProposalEvaluationBundles({
				proposal: read,
				supportFiles
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
		try {
			await readProposalSupportFiles(current.record, storeOptions(input.env));
		} catch {
			throw new Error(`Skill proposal ${read.record.id} changed while evaluation was running.`);
		}
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
	if (normalized && normalized !== actual) throw new Error(`Skill proposal revision changed (expected ${normalized}, current ${actual}); reload and retry.`);
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
//#region src/skills/workshop/service.ts
var SkillProposalStaleTargetError = class extends Error {};
function proposalStoreOptions(env) {
	return env ? { env } : {};
}
const APPLY_TRANSITION_DEPENDENCIES = {
	assertExpectedRevisionHash,
	evaluateSkillProposal,
	isCreateTargetConflict: (error) => error instanceof SkillProposalCreateTargetConflictError,
	readProposalSupportFiles,
	readRequiredProposal
};
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
		draftFile: "PROPOSAL.md",
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
	const event = await writeSkillProposal({
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
		store: proposalStoreOptions(input.env)
	});
	if (event) await dispatchSkillProposalChanged({
		event,
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
	const first = body.indexOf(patch.oldString);
	if (first === -1) throw new Error("Patch oldString not found in the live skill body. Read the skill and quote the exact current text.");
	if (body.includes(patch.oldString, first + 1)) throw new Error("Patch oldString matches more than once in the live skill body. Quote a longer unique span.");
	return `${body.slice(0, first)}${patch.newString}${body.slice(first + patch.oldString.length)}`;
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
		draftFile: "PROPOSAL.md",
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
	const event = await writeSkillProposal({
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
		store: proposalStoreOptions(input.env)
	});
	if (event) await dispatchSkillProposalChanged({
		event,
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
		const supportFiles = input.supportFiles === void 0 ? await readProposalSupportFiles(record, proposalStoreOptions(input.env)) : input.supportFiles;
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
		const previousSupportFiles = record.supportFiles;
		const revised = {
			...record,
			description,
			updatedAt: now,
			proposedVersion: nextVersion,
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
			record: revised,
			previousSupportFiles,
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
	if (revisedResult.event) await dispatchSkillProposalChanged({
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
async function markProposal(input, status) {
	const result = await withPendingSkillProposalMutation(input, status, async (read) => {
		const now = (/* @__PURE__ */ new Date()).toISOString();
		const record = {
			...read.record,
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
	});
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
function normalizeRequired(value, label) {
	const normalized = normalizeOptionalString(value);
	if (!normalized) throw new Error(`${label} is required.`);
	return normalized;
}
//#endregion
export { proposeUpdateSkill as a, reviseSkillProposal as c, getSkillProposalRunProgress as d, inspectSkillProposal as f, proposeCreateSkill as i, evaluateSkillProposal as l, resolvePendingSkillProposal as m, applySkillProposal as n, quarantineSkillProposal as o, listSkillProposals as p, composeSkillBodyPatch as r, rejectSkillProposal as s, SkillProposalStaleTargetError as t, listSkillProposalEvents as u };
