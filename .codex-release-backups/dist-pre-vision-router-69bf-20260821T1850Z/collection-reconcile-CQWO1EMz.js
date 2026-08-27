import { r as asNullableRecord } from "./record-coerce-DItp3I4t.js";
import { s as pathExists } from "./absolute-path-DBVN5h2m.js";
import { r as root } from "./fs-safe-X_oyl7Rx.js";
import { _ as getNodeSqliteKysely, g as executeSqliteQueryTakeFirstSync, h as executeSqliteQuerySync } from "./openclaw-state-db.paths-gKE3myqW.js";
import { d as openOpenClawStateDatabase, h as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BciZ4rHE.js";
import { a as sha256Hex } from "./crypto-digest-PR8Utwzg.js";
import { i as logWarn } from "./logger-frf2HPJn.js";
import { a as normalizeSkillIndexName } from "./skill-index-CEvOAhOd.js";
import { t as bumpSkillsSnapshotVersion } from "./refresh-state-DHnXO3IV.js";
import { t as clearCuratedSkillLifecycle } from "./curator-XlkqyZug.js";
import { t as resolveSkillWorkshopConfig } from "./config-Cjp42tXL.js";
import { S as snapshotCommittedSkillArtifactBestEffort, b as dispatchCommittedSkillChangeBestEffort, x as hasCommittedSkillChangeHooks } from "./clawhub-Br58P2LA.js";
import { t as buildWorkspaceSkillStatus } from "./status-BqwnYiuT.js";
import { c as prepareWorkspaceSkillMutation, f as restoreWorkspaceSkillMutation, n as applyWorkspaceSkillMutation } from "./workspace-skill-write-easKKFn3.js";
import { K as stripProposalFrontmatterForSkill, _ as resolveSkillCollectionBackupRoot, f as withSkillCollectionLock, g as pruneOlderSkillCollectionBackups, h as canonicalSkillCollectionWorkspace } from "./store-B-ZL-1gP.js";
import { c as readSkillProposalTargetTreeSha256, n as prepareSkillProposalDraft } from "./proposal-draft-zkJQJamp.js";
import { n as withOpenClawStateLease } from "./openclaw-state-lease-CzwHXlqF.js";
import { t as removePathWithinRoot } from "./fs-safe-remove-CINlCDxp.js";
import { n as isWorkspaceOwnedSkillTarget, t as assertWritableSkillTarget } from "./workspace-skill-read-BoyRD5Al.js";
import { randomUUID } from "node:crypto";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/skills/workshop/collection-contracts.ts
const MAX_RECONCILED_SKILL_BYTES = 24e4;
//#endregion
//#region src/skills/workshop/collection-byte-limits.ts
async function assertCollectionReadsCurrent(current, readSkillHashes, maxBytes) {
	let totalBytes = 0;
	for (const skill of current) {
		const content = await fs.readFile(skill.filePath, "utf8");
		totalBytes += Buffer.byteLength(content);
		if (totalBytes > maxBytes) throw new Error(`Writable skill collection exceeds the ${maxBytes}-byte review limit.`);
		if (readSkillHashes.get(skill.name) !== sha256Hex(content)) throw new Error(`Skill changed after it was read: ${skill.name}`);
	}
}
async function assertResultCollectionBytes(current, plan, prepared, maxBytes) {
	const currentByName = new Map(current.map((skill) => [skill.name, skill]));
	const preparedByName = new Map(prepared.map((mutation) => [path.basename(mutation.skillDir), mutation]));
	let totalBytes = 0;
	for (const entry of plan) {
		if (entry.action === "drop") continue;
		const existing = currentByName.get(entry.name);
		const mutation = preparedByName.get(entry.name);
		if (mutation) totalBytes += Buffer.byteLength(mutation.skillFile.content);
		else if (existing) totalBytes += (await fs.stat(existing.filePath)).size;
		else throw new Error(`Resulting skill is missing: ${entry.name}`);
		if (totalBytes > maxBytes) throw new Error(`Resulting skill collection exceeds the ${maxBytes}-byte review limit.`);
	}
}
async function assertCollectionMutationCurrent(current, expectedTreeHashes, prepared) {
	for (const skill of current) {
		const expectedTreeHash = expectedTreeHashes.get(skill.name);
		if (!expectedTreeHash || await readSkillProposalTargetTreeSha256(skill.baseDir) !== expectedTreeHash) throw new Error(`Skill tree changed before collection mutation: ${skill.name}`);
	}
	for (const mutation of prepared) if (mutation.mode === "create" && await pathExists(mutation.skillDir)) throw new Error(`New skill directory changed before collection mutation: ${mutation.skillDir}`);
}
//#endregion
//#region src/skills/workshop/collection-plan.ts
function validateSkillCollectionPlan(input, current, readSkillHashes, maxDecisions, approvedSkillNamesByAgent) {
	if (input.length > maxDecisions) throw new Error(`A skill collection can contain at most ${maxDecisions} decisions.`);
	const currentNames = new Set(current.map((skill) => skill.name));
	const unread = current.map((skill) => skill.name).filter((name) => !readSkillHashes.has(name));
	if (unread.length > 0) throw new Error(`Read every current skill before reconciling: ${unread.join(", ")}`);
	const seen = /* @__PURE__ */ new Set();
	for (const entry of input) {
		const normalized = normalizeSkillIndexName(entry.name);
		if (!normalized || normalized !== entry.name) throw new Error(`Invalid skill name: ${entry.name}`);
		if (seen.has(entry.name)) throw new Error(`Duplicate skill decision: ${entry.name}`);
		seen.add(entry.name);
		if (entry.action !== "write" && !currentNames.has(entry.name)) throw new Error(`Cannot ${entry.action} a skill that does not exist: ${entry.name}`);
		if (entry.action === "drop" && !entry.reason.trim()) throw new Error(`Drop reason required: ${entry.name}`);
		if (entry.action === "write" && (!entry.description.trim() || !entry.content.trim())) throw new Error(`Complete description and content required: ${entry.name}`);
	}
	const missing = current.map((skill) => skill.name).filter((name) => !seen.has(name));
	if (missing.length > 0) throw new Error(`Every current skill needs one decision: ${missing.join(", ")}`);
	for (const approvedNames of approvedSkillNamesByAgent ?? []) if (approvedNames.size > 0 && !input.some((entry) => entry.action !== "drop" && approvedNames.has(entry.name))) throw new Error("Every sharing agent must retain a visible skill after reconciliation.");
	return [...input];
}
//#endregion
//#region src/skills/workshop/collection-review-state.ts
const CURATOR_STATE_ID = 1;
const REVIEW_INTERVAL_MS = 1440 * 6e4;
const REVIEW_CLAIM_MS = 11 * 6e4;
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
function parseReviewTimes(value) {
	if (!value) return {};
	try {
		const reviews = asNullableRecord(JSON.parse(value))?.collectionReviewSuccess;
		const record = asNullableRecord(reviews);
		if (!record) return {};
		return Object.fromEntries(Object.entries(record).filter((entry) => typeof entry[1] === "number" && Number.isFinite(entry[1])));
	} catch {
		return {};
	}
}
function isSkillCollectionReviewDue(workspaceDir, nowMs, options = {}) {
	const database = openOpenClawStateDatabase(options);
	const kysely = getNodeSqliteKysely(database.db);
	const lastSuccess = parseReviewTimes(executeSqliteQueryTakeFirstSync(database.db, kysely.selectFrom("skill_curator_state").select("last_result_json").where("id", "=", CURATOR_STATE_ID))?.last_result_json)[workspaceKey(workspaceDir)];
	return lastSuccess === void 0 || nowMs - lastSuccess >= REVIEW_INTERVAL_MS;
}
function recordSkillCollectionReviewSuccess(workspaceDir, nowMs, options = {}) {
	runOpenClawStateWriteTransaction(({ db }) => {
		const kysely = getNodeSqliteKysely(db);
		const reviews = parseReviewTimes(executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("skill_curator_state").select("last_result_json").where("id", "=", CURATOR_STATE_ID))?.last_result_json);
		reviews[workspaceKey(workspaceDir)] = nowMs;
		const lastResultJson = JSON.stringify({ collectionReviewSuccess: reviews });
		executeSqliteQuerySync(db, kysely.insertInto("skill_curator_state").values({
			id: CURATOR_STATE_ID,
			last_attempt_at_ms: nowMs,
			last_success_at_ms: nowMs,
			last_error: null,
			last_result_json: lastResultJson
		}).onConflict((conflict) => conflict.column("id").doUpdateSet({
			last_attempt_at_ms: nowMs,
			last_success_at_ms: nowMs,
			last_error: null,
			last_result_json: lastResultJson
		})));
	}, options);
}
//#endregion
//#region src/skills/workshop/collection-rollback.ts
async function rollbackSkillCollectionMutation(params) {
	const errors = [];
	for (const mutation of params.appliedWrites.toReversed()) try {
		await restoreWorkspaceSkillMutation(mutation);
		if (mutation.mode === "create") await fs.rmdir(mutation.skillDir).catch((error) => {
			const code = asNullableRecord(error)?.code;
			if (code !== "ENOENT" && code !== "ENOTEMPTY" && code !== "EEXIST") throw error;
		});
	} catch (error) {
		errors.push(error);
	}
	const workspaceRoot = await root(params.workspaceDir);
	for (const skill of params.droppedSkills.toReversed()) try {
		const baseRelativePath = relativeSkillCollectionPath(params.workspaceDir, skill.baseDir);
		if (await workspaceRoot.exists(baseRelativePath)) throw new Error(`Dropped skill changed before restoration: ${skill.name}`);
		await workspaceRoot.move(relativeSkillCollectionPath(params.workspaceDir, skill.stagedDir), baseRelativePath, { overwrite: true });
	} catch (error) {
		errors.push(error);
	}
	if (errors.length > 0) throw new AggregateError(errors, "Failed to restore the previous skill collection.");
}
async function stageSkillCollectionDrop(params) {
	const stagedDir = path.join(path.dirname(params.baseDir), `.openclaw-drop-${path.basename(params.baseDir)}-${randomUUID()}`);
	await (await root(params.workspaceDir)).move(relativeSkillCollectionPath(params.workspaceDir, params.baseDir), relativeSkillCollectionPath(params.workspaceDir, stagedDir), { overwrite: true });
	return {
		name: params.name,
		baseDir: params.baseDir,
		stagedDir
	};
}
async function discardStagedSkillCollectionDrops(workspaceDir, droppedSkills) {
	for (const skill of droppedSkills) await removeSkillCollectionDirectory(workspaceDir, skill.stagedDir).catch((error) => {
		logWarn(`skill-workshop: failed to discard staged skill drop: ${String(error)}`);
	});
}
async function restoreSkillCollectionBackupTransaction(params) {
	const rollbackDir = path.join(params.backupDir, `.restore-${randomUUID()}`);
	try {
		await fs.mkdir(path.join(rollbackDir, "workspace"), { recursive: true });
		for (const relativeDir of params.resultSkillDirs) await fs.cp(path.join(params.workspaceDir, relativeDir), path.join(rollbackDir, "workspace", relativeDir), {
			recursive: true,
			errorOnExist: true,
			force: false,
			preserveTimestamps: true
		});
	} catch (error) {
		await discardRestoreSnapshot(params.backupDir, rollbackDir);
		throw error;
	}
	let discardSnapshot = false;
	try {
		await restoreSkillCollectionBackup(params);
		discardSnapshot = true;
	} catch (error) {
		try {
			await restoreSkillCollectionBackup({
				workspaceDir: params.workspaceDir,
				backupDir: rollbackDir,
				skillDirs: params.resultSkillDirs,
				resultSkillDirs: [.../* @__PURE__ */ new Set([...params.skillDirs, ...params.resultSkillDirs])]
			});
			discardSnapshot = true;
		} catch (rollbackError) {
			const failure = new Error("Skill collection restore failed and the current collection was not restored.", { cause: error });
			Object.assign(failure, { rollbackError });
			throw failure;
		}
		throw error;
	} finally {
		if (discardSnapshot) await discardRestoreSnapshot(params.backupDir, rollbackDir);
	}
}
async function restoreSkillCollectionBackup(params) {
	const removeDirs = /* @__PURE__ */ new Set([...params.skillDirs.map((relativeDir) => path.join(params.workspaceDir, relativeDir)), ...params.resultSkillDirs.map((relativeDir) => path.join(params.workspaceDir, relativeDir))]);
	for (const skillDir of [...removeDirs].toSorted((left, right) => right.length - left.length)) if (await pathExists(skillDir)) await removeSkillCollectionDirectory(params.workspaceDir, skillDir);
	for (const relativeDir of params.skillDirs) {
		await fs.mkdir(path.dirname(path.join(params.workspaceDir, relativeDir)), { recursive: true });
		await fs.cp(path.join(params.backupDir, "workspace", relativeDir), path.join(params.workspaceDir, relativeDir), {
			recursive: true,
			errorOnExist: true,
			force: false,
			preserveTimestamps: true
		});
	}
}
async function discardRestoreSnapshot(backupDir, rollbackDir) {
	await removePathWithinRoot({
		rootDir: backupDir,
		relativePath: path.basename(rollbackDir),
		recursive: true,
		force: true
	}).catch((error) => {
		logWarn(`skill-workshop: failed to discard restore snapshot: ${String(error)}`);
	});
}
async function removeSkillCollectionDirectory(workspaceDir, skillDir) {
	await removePathWithinRoot({
		rootDir: workspaceDir,
		relativePath: relativeSkillCollectionPath(workspaceDir, skillDir),
		recursive: true,
		force: false
	});
}
function relativeSkillCollectionPath(workspaceDir, skillDir) {
	const relativePath = path.relative(workspaceDir, skillDir);
	if (!relativePath || relativePath === ".." || path.isAbsolute(relativePath) || relativePath.startsWith(`..${path.sep}`)) throw new Error(`Skill directory must be inside the workspace: ${skillDir}`);
	return relativePath;
}
//#endregion
//#region src/skills/workshop/collection-reconcile.ts
const BACKUP_SCHEMA = "openclaw.skill-collection-backup.v1";
function listWritableSkillCollection(workspaceDir, options = {}) {
	const byFile = /* @__PURE__ */ new Map();
	const agentIds = options.agentIds?.length ? options.agentIds : [options.agentId];
	for (const agentId of agentIds) {
		const status = buildWorkspaceSkillStatus(workspaceDir, {
			config: options.config,
			...agentId ? { agentId } : {}
		});
		for (const skill of status.skills) {
			if (!skill.eligible || skill.blockedByAgentFilter) continue;
			try {
				assertWritableSkillTarget(workspaceDir, skill);
			} catch {
				continue;
			}
			if (!isWorkspaceOwnedSkillTarget(workspaceDir, skill)) continue;
			const filePath = path.resolve(skill.filePath);
			byFile.set(filePath, {
				name: skill.skillKey,
				baseDir: path.resolve(skill.baseDir),
				filePath,
				...skill.description ? { description: skill.description } : {}
			});
		}
	}
	return [...byFile.values()].toSorted((left, right) => left.name.localeCompare(right.name));
}
async function reconcileSkillCollection(params) {
	const workspaceDir = canonicalSkillCollectionWorkspace(params.workspaceDir);
	const commit = await withSkillCollectionLock(workspaceDir, async () => {
		const current = listWritableSkillCollection(workspaceDir, {
			config: params.config,
			agentId: params.agentId,
			agentIds: params.agentIds
		});
		const currentByName = new Map(current.map((skill) => [skill.name, skill]));
		if (currentByName.size !== current.length) throw new Error("Writable skill names must be unique before collection reconciliation.");
		const plan = validateSkillCollectionPlan(params.plan, current, params.readSkillHashes, 200, params.approvedSkillNamesByAgent);
		await assertCollectionReadsCurrent(current, params.readSkillHashes, MAX_RECONCILED_SKILL_BYTES);
		if (plan.every((entry) => entry.action === "keep")) {
			let backupId = await latestCommittedBackupId(resolveSkillCollectionBackupRoot(workspaceDir, params.env));
			if (!backupId) {
				const backup = await createCollectionBackup({
					workspaceDir,
					current,
					plan,
					env: params.env
				});
				try {
					await assertCollectionMutationCurrent(current, params.readSkillTreeHashes, []);
					await commitCollectionBackup(workspaceDir, backup);
				} catch (error) {
					await discardPendingCollectionBackup(backup);
					throw error;
				}
				backupId = backup.manifest.id;
			} else await assertCollectionMutationCurrent(current, params.readSkillTreeHashes, []);
			clearCuratedSkillLifecycle(current.map((skill) => skill.filePath), params.env ? { env: params.env } : {});
			recordSkillCollectionReviewSuccess(workspaceDir, Date.now(), params.env ? { env: params.env } : {});
			return {
				result: {
					backupId,
					kept: plan.map((entry) => entry.name),
					written: [],
					dropped: []
				},
				changes: []
			};
		}
		const prepared = await prepareWrites({
			workspaceDir,
			current,
			plan,
			config: params.config
		});
		await assertResultCollectionBytes(current, plan, prepared, MAX_RECONCILED_SKILL_BYTES);
		const backup = await createCollectionBackup({
			workspaceDir,
			current,
			plan,
			env: params.env
		});
		const shouldDispatch = hasCommittedSkillChangeHooks();
		const before = /* @__PURE__ */ new Map();
		if (shouldDispatch) for (const entry of plan) {
			const existing = currentByName.get(entry.name);
			if (entry.action === "keep" || !existing) continue;
			before.set(entry.name, await snapshotCommittedSkillArtifactBestEffort({
				skillDir: existing.baseDir,
				skillKey: existing.name,
				source: "workshop"
			}));
		}
		try {
			await assertCollectionMutationCurrent(current, params.readSkillTreeHashes, prepared);
		} catch (error) {
			await discardPendingCollectionBackup(backup);
			throw error;
		}
		const appliedWrites = [];
		const droppedSkills = [];
		try {
			for (const mutation of prepared) {
				await applyWorkspaceSkillMutation(mutation);
				appliedWrites.push(mutation);
			}
			for (const entry of plan) {
				if (entry.action !== "drop") continue;
				const skill = currentByName.get(entry.name);
				droppedSkills.push(await stageSkillCollectionDrop({
					...skill,
					workspaceDir
				}));
			}
			await commitCollectionBackup(workspaceDir, backup);
		} catch (error) {
			try {
				await rollbackSkillCollectionMutation({
					workspaceDir,
					appliedWrites,
					droppedSkills
				});
			} catch (restoreError) {
				throw new Error(`Skill collection reconciliation failed (${String(error)}) and backup ${backup.manifest.id} could not be restored.`, { cause: restoreError });
			}
			await discardPendingCollectionBackup(backup);
			throw error;
		}
		bumpSkillsSnapshotVersion({ reason: "workshop" });
		await discardStagedSkillCollectionDrops(workspaceDir, droppedSkills);
		clearCuratedSkillLifecycle(current.map((skill) => skill.filePath), params.env ? { env: params.env } : {});
		recordSkillCollectionReviewSuccess(workspaceDir, Date.now(), params.env ? { env: params.env } : {});
		await pruneOlderSkillCollectionBackups(backup.backupRoot, backup.manifest.id);
		const changes = [];
		if (shouldDispatch) for (const entry of plan) {
			if (entry.action === "keep") continue;
			const existing = currentByName.get(entry.name);
			const skillDir = existing?.baseDir ?? path.join(workspaceDir, "skills", entry.name);
			changes.push({
				action: entry.action === "drop" ? "removed" : existing ? "updated" : "created",
				before: before.get(entry.name),
				after: entry.action === "write" ? await snapshotCommittedSkillArtifactBestEffort({
					skillDir,
					skillKey: entry.name,
					source: "workshop"
				}) : void 0
			});
		}
		return {
			result: {
				backupId: backup.manifest.id,
				kept: plan.filter((entry) => entry.action === "keep").map((entry) => entry.name),
				written: plan.filter((entry) => entry.action === "write").map((entry) => entry.name),
				dropped: plan.filter((entry) => entry.action === "drop").map((entry) => ({
					name: entry.name,
					reason: entry.reason
				}))
			},
			changes
		};
	}, params.env ? { env: params.env } : {});
	for (const change of commit.changes) await dispatchCommittedSkillChangeBestEffort({
		...change,
		source: "workshop",
		workspaceDir
	});
	return commit.result;
}
async function restoreLatestSkillCollectionBackup(params) {
	const workspaceDir = canonicalSkillCollectionWorkspace(params.workspaceDir);
	const commit = await withSkillCollectionLock(workspaceDir, async () => {
		const backupRoot = resolveSkillCollectionBackupRoot(workspaceDir, params.env);
		if (!await pathExists(backupRoot)) throw new Error("No skill collection backup is available.");
		const backupId = await latestCommittedBackupId(backupRoot);
		if (!backupId) throw new Error("No skill collection backup is available.");
		const backupDir = path.join(backupRoot, backupId);
		const manifest = await readCollectionBackupManifest({
			backupDir,
			backupId,
			workspaceDir
		});
		await assertCollectionResultUnchanged(workspaceDir, manifest);
		const affectedDirs = [.../* @__PURE__ */ new Set([...manifest.skillDirs, ...manifest.resultSkillDirs])];
		const shouldDispatch = hasCommittedSkillChangeHooks();
		const before = /* @__PURE__ */ new Map();
		const beforeExists = /* @__PURE__ */ new Set();
		for (const relativeDir of affectedDirs) {
			const skillDir = path.join(workspaceDir, relativeDir);
			if (await pathExists(skillDir)) beforeExists.add(relativeDir);
			if (shouldDispatch) before.set(relativeDir, await snapshotCommittedSkillArtifactBestEffort({
				skillDir,
				skillKey: path.basename(relativeDir),
				source: "workshop"
			}));
		}
		await assertCollectionResultUnchanged(workspaceDir, manifest);
		try {
			await restoreSkillCollectionBackupTransaction({
				workspaceDir,
				backupDir,
				skillDirs: manifest.skillDirs,
				resultSkillDirs: manifest.resultSkillDirs
			});
		} finally {
			bumpSkillsSnapshotVersion({ reason: "workshop" });
		}
		const changes = [];
		if (shouldDispatch) for (const relativeDir of affectedDirs) {
			const skillDir = path.join(workspaceDir, relativeDir);
			const afterExists = await pathExists(skillDir);
			if (!beforeExists.has(relativeDir) && !afterExists) continue;
			changes.push({
				action: !beforeExists.has(relativeDir) ? "created" : afterExists ? "updated" : "removed",
				before: before.get(relativeDir),
				after: afterExists ? await snapshotCommittedSkillArtifactBestEffort({
					skillDir,
					skillKey: path.basename(relativeDir),
					source: "workshop"
				}) : void 0
			});
		}
		const restored = manifest.skillDirs.map((relativeDir) => path.basename(relativeDir));
		const restoredDirs = new Set(manifest.skillDirs);
		return {
			result: {
				backupId,
				restored,
				removed: manifest.resultSkillDirs.filter((relativeDir) => !restoredDirs.has(relativeDir)).map((relativeDir) => path.basename(relativeDir))
			},
			changes
		};
	}, params.env ? { env: params.env } : {});
	for (const change of commit.changes) await dispatchCommittedSkillChangeBestEffort({
		...change,
		source: "workshop",
		workspaceDir
	});
	return commit.result;
}
async function prepareWrites(params) {
	const workshop = resolveSkillWorkshopConfig(params.config);
	const currentByName = new Map(params.current.map((skill) => [skill.name, skill]));
	const writes = [];
	for (const entry of params.plan) {
		if (entry.action !== "write") continue;
		const existing = currentByName.get(entry.name);
		const skillDir = existing?.baseDir ?? path.join(params.workspaceDir, "skills", entry.name);
		const skillFile = existing?.filePath ?? path.join(skillDir, "SKILL.md");
		if (!existing && await pathExists(skillDir)) throw new Error(`New skill directory already exists: ${skillDir}`);
		const draft = prepareSkillProposalDraft({
			name: entry.name,
			description: entry.description,
			content: entry.content,
			fallbackFrontmatterContent: existing ? await fs.readFile(existing.filePath, "utf8") : void 0,
			date: (/* @__PURE__ */ new Date()).toISOString(),
			maxSkillBytes: workshop.maxSkillBytes
		});
		if (!draft.ok) throw draft.error.cause;
		if (draft.value.scan.critical > 0) throw new Error(`Skill security scan rejected ${entry.name}.`);
		writes.push(await prepareWorkspaceSkillMutation({
			workspaceDir: params.workspaceDir,
			skillDir,
			skillFile,
			content: stripProposalFrontmatterForSkill(draft.value.content),
			mode: existing ? "update" : "create",
			symlinkPolicy: {
				allowWrites: false,
				allowedTargetRealPaths: []
			}
		}));
	}
	return writes;
}
async function createCollectionBackup(params) {
	const backupRoot = resolveSkillCollectionBackupRoot(params.workspaceDir, params.env);
	const id = `${(/* @__PURE__ */ new Date()).toISOString().replaceAll(":", "-")}-${randomUUID().slice(0, 8)}`;
	const backupDir = path.join(backupRoot, `.pending-${id}`);
	const committedBackupDir = path.join(backupRoot, id);
	const skillDirs = [...new Set(params.current.map((skill) => path.relative(params.workspaceDir, skill.baseDir)))].toSorted();
	const currentByName = new Map(params.current.map((skill) => [skill.name, skill]));
	const manifest = {
		schema: BACKUP_SCHEMA,
		id,
		createdAt: (/* @__PURE__ */ new Date()).toISOString(),
		workspaceDir: params.workspaceDir,
		skillDirs,
		resultSkillDirs: params.plan.filter((entry) => entry.action !== "drop").map((entry) => {
			const existing = currentByName.get(entry.name);
			return path.relative(params.workspaceDir, existing?.baseDir ?? path.join(params.workspaceDir, "skills", entry.name));
		}),
		resultSkillHashes: {}
	};
	await fs.mkdir(path.join(backupDir, "workspace"), { recursive: true });
	for (const relativeDir of skillDirs) await fs.cp(path.join(params.workspaceDir, relativeDir), path.join(backupDir, "workspace", relativeDir), {
		recursive: true,
		errorOnExist: true,
		force: false,
		preserveTimestamps: true
	});
	await fs.writeFile(path.join(backupDir, "manifest.json"), JSON.stringify(manifest, null, 2));
	return {
		backupDir,
		committedBackupDir,
		backupRoot,
		manifest
	};
}
async function commitCollectionBackup(workspaceDir, backup) {
	for (const relativeDir of backup.manifest.resultSkillDirs) backup.manifest.resultSkillHashes[relativeDir] = await readSkillProposalTargetTreeSha256(path.join(workspaceDir, relativeDir));
	await fs.writeFile(path.join(backup.backupDir, "manifest.json"), JSON.stringify(backup.manifest, null, 2));
	await fs.rename(backup.backupDir, backup.committedBackupDir);
}
async function discardPendingCollectionBackup(backup) {
	if (!await pathExists(backup.backupDir)) return;
	await removePathWithinRoot({
		rootDir: backup.backupRoot,
		relativePath: path.basename(backup.backupDir),
		recursive: true,
		force: true
	});
}
async function readCollectionBackupManifest(params) {
	const record = asNullableRecord(JSON.parse(await fs.readFile(path.join(params.backupDir, "manifest.json"), "utf8")));
	const skillDirs = readBackupSkillDirs(record?.skillDirs, "skillDirs", params.workspaceDir);
	const resultSkillDirs = readBackupSkillDirs(record?.resultSkillDirs, "resultSkillDirs", params.workspaceDir);
	const resultSkillHashes = asNullableRecord(record?.resultSkillHashes);
	if (record?.schema !== BACKUP_SCHEMA || record.id !== params.backupId || typeof record.createdAt !== "string" || typeof record.workspaceDir !== "string" || canonicalSkillCollectionWorkspace(record.workspaceDir) !== params.workspaceDir || !resultSkillHashes || Object.keys(resultSkillHashes).some((relativeDir) => !resultSkillDirs.includes(relativeDir))) throw new Error(`Invalid skill collection backup: ${params.backupId}`);
	const parsedResultSkillHashes = {};
	for (const relativeDir of resultSkillDirs) {
		const hash = resultSkillHashes[relativeDir];
		if (typeof hash !== "string") throw new Error(`Invalid skill collection backup: ${params.backupId}`);
		parsedResultSkillHashes[relativeDir] = hash;
	}
	for (const relativeDir of skillDirs) if (!await pathExists(path.join(params.backupDir, "workspace", relativeDir))) throw new Error(`Skill collection backup is incomplete: ${relativeDir}`);
	return {
		schema: BACKUP_SCHEMA,
		id: params.backupId,
		createdAt: record.createdAt,
		workspaceDir: params.workspaceDir,
		skillDirs,
		resultSkillDirs,
		resultSkillHashes: parsedResultSkillHashes
	};
}
async function assertCollectionResultUnchanged(workspaceDir, manifest) {
	const resultDirs = new Set(manifest.resultSkillDirs);
	for (const relativeDir of manifest.skillDirs) if (!resultDirs.has(relativeDir) && await pathExists(path.join(workspaceDir, relativeDir))) throw new Error(`Skill collection changed after cleanup: ${path.basename(relativeDir)}`);
	for (const relativeDir of manifest.resultSkillDirs) if (await readSkillProposalTargetTreeSha256(path.join(workspaceDir, relativeDir)) !== manifest.resultSkillHashes[relativeDir]) throw new Error(`Skill collection changed after cleanup: ${path.basename(relativeDir)}`);
}
function readBackupSkillDirs(value, label, workspaceDir) {
	if (!Array.isArray(value) || !value.every((entry) => typeof entry === "string")) throw new Error(`Invalid skill collection backup ${label}.`);
	const skillRoots = [path.join(workspaceDir, "skills"), path.join(workspaceDir, ".agents", "skills")];
	for (const relativeDir of value) {
		const absoluteDir = path.resolve(workspaceDir, relativeDir);
		if (!skillRoots.some((rootDir) => {
			const relativeToRoot = path.relative(rootDir, absoluteDir);
			return relativeToRoot && !path.isAbsolute(relativeToRoot) && !relativeToRoot.startsWith(`..${path.sep}`);
		})) throw new Error(`Skill collection backup path is outside the workspace: ${relativeDir}`);
	}
	return [...new Set(value)];
}
async function latestCommittedBackupId(backupRoot) {
	if (!await pathExists(backupRoot)) return;
	return (await fs.readdir(backupRoot, { withFileTypes: true })).filter((entry) => entry.isDirectory() && !entry.name.startsWith(".pending-")).map((entry) => entry.name).toSorted().at(-1);
}
//#endregion
export { withSkillCollectionReviewClaim as a, isSkillCollectionReviewDue as i, reconcileSkillCollection as n, MAX_RECONCILED_SKILL_BYTES as o, restoreLatestSkillCollectionBackup as r, listWritableSkillCollection as t };
