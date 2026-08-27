import { a as isPathInside } from "./path-D138yf8v.js";
import { r as readRegularFile } from "./regular-file-Dwz6p59y.js";
import "./path-guards-CQoZeoCG.js";
import { m as shortenHomePath } from "./utils-Bw16L5tB.js";
import { t as escapeRegExp } from "./regexp-BZyMFTlj.js";
import { w as resolveStateDir } from "./paths-BBSTUjD5.js";
import { r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
import { t as formatCliCommand } from "./command-format-HwSAdvXB.js";
import "./agent-scope-DigoIwHb.js";
import { f as resolveAgentWorkspaceDir } from "./agent-scope-config-CUBiGmG3.js";
import "./regular-file-C2hsuc07.js";
import { u as resolveCronJobsStorePathFromConfig } from "./store-pLPqGtqL.js";
import { t as CRON_JOB_SCRATCH_MAX_BYTES } from "./scratch-contract-DyG_7g0F.js";
import { n as resolveHeartbeatAgents } from "./heartbeat-config-Cdcr8ZQq.js";
import { t as note } from "./note-YH_0kY-3.js";
import { n as hashCronScratchSource, o as writeCronJobScratch, r as readCronJobScratchState, t as deleteCronJobScratch } from "./scratch-store-G70Hkv0i.js";
import { n as ensureHeartbeatMonitorJobs } from "./doctor-heartbeat-cadence-migration-D4z3UQOy.js";
import path from "node:path";
import fs from "node:fs/promises";
import { TextDecoder } from "node:util";
//#region src/commands/doctor-heartbeat-scratch-migration.ts
/** Doctor-owned migration from workspace HEARTBEAT.md files into cron job scratch. */
const HEARTBEAT_SCRATCH_MIGRATION_CHECK_ID = "core/doctor/heartbeat-scratch-migration";
const LEGACY_HEARTBEAT_FILENAME = "HEARTBEAT.md";
const utf8Decoder = new TextDecoder("utf-8", { fatal: true });
async function readHeartbeatSource(cfg, agentId, options) {
	const workspaceDir = resolveAgentWorkspaceDir(cfg, agentId);
	const heartbeatPath = path.join(workspaceDir, LEGACY_HEARTBEAT_FILENAME);
	let sourceStat;
	try {
		sourceStat = await fs.lstat(heartbeatPath);
		const orphanClaim = await findStaleHeartbeatClaim(heartbeatPath);
		if (orphanClaim) throw new Error(`both ${heartbeatPath} and an interrupted migration claim at ${orphanClaim} exist; reconcile them manually before rerunning doctor`);
	} catch (error) {
		if (error.code !== "ENOENT") throw error;
		const staleClaim = await findStaleHeartbeatClaim(heartbeatPath);
		if (!staleClaim) return;
		if (!options?.recoverClaims) throw new Error(`an interrupted migration claim exists at ${staleClaim}; run openclaw doctor --fix to restore it`, { cause: error });
		await restoreClaimNoClobber(staleClaim, heartbeatPath);
		sourceStat = await fs.lstat(heartbeatPath);
	}
	if (!sourceStat.isFile() && !sourceStat.isSymbolicLink()) throw new Error("HEARTBEAT.md must be a regular file or contained symlink");
	if (sourceStat.isFile() && sourceStat.nlink > 1) throw new Error("HEARTBEAT.md has multiple hard links; refusing automatic removal");
	const workspaceRealPath = await fs.realpath(workspaceDir);
	const sourceRealPath = await fs.realpath(heartbeatPath);
	if (sourceRealPath !== workspaceRealPath && !isPathInside(workspaceRealPath, sourceRealPath)) throw new Error("HEARTBEAT.md symlink target escapes the agent workspace");
	const file = await readRegularFile({
		filePath: sourceRealPath,
		maxBytes: CRON_JOB_SCRATCH_MAX_BYTES
	});
	let content;
	try {
		content = utf8Decoder.decode(file.buffer);
	} catch {
		throw new Error("HEARTBEAT.md is not valid UTF-8");
	}
	return {
		path: heartbeatPath,
		entryKey: path.join(workspaceRealPath, LEGACY_HEARTBEAT_FILENAME),
		content,
		sha256: hashCronScratchSource(content)
	};
}
function archivePathForSource(agentId, sha256, env) {
	const safeAgentId = agentId.replace(/[^A-Za-z0-9._-]+/g, "-");
	return path.join(resolveStateDir(env), "backups", "heartbeat-migration", `${safeAgentId}-${sha256}.md`);
}
const HEARTBEAT_CLAIM_INFIX = ".doctor-importing-";
const HEARTBEAT_CLAIM_CHANGED_ERROR = "HeartbeatClaimChangedError";
/** Interrupted-claim sibling for a missing canonical heartbeat path. */
async function findStaleHeartbeatClaim(heartbeatPath) {
	const dir = path.dirname(heartbeatPath);
	const claimPattern = new RegExp(`^${escapeRegExp(path.basename(heartbeatPath))}${escapeRegExp(HEARTBEAT_CLAIM_INFIX)}\\d+-[0-9a-f]{12}$`);
	let entries;
	try {
		entries = await fs.readdir(dir);
	} catch {
		return;
	}
	const claims = entries.filter((entry) => claimPattern.test(entry));
	if (claims.length > 1) throw new Error(`multiple interrupted migration claims exist for ${heartbeatPath}; remove or restore the stale .doctor-importing-* files manually`);
	const claim = claims[0];
	if (!claim) return;
	const ownerPid = Number(claim.slice(claim.lastIndexOf(HEARTBEAT_CLAIM_INFIX) + 18).split("-")[0]);
	if (Number.isSafeInteger(ownerPid) && ownerPid !== process.pid && isProcessAlive(ownerPid)) throw new Error(`a migration claim for ${heartbeatPath} is held by running process ${ownerPid}; wait for that doctor run to finish`);
	return path.join(dir, claim);
}
function isProcessAlive(pid) {
	try {
		process.kill(pid, 0);
		return true;
	} catch (error) {
		return error.code === "EPERM";
	}
}
/**
* Restore a claim without clobbering: `link` fails with EEXIST when another
* process recreated the destination while we held the claim, so both files
* survive (the recreation in place, the claimed original at a conflict path).
*/
async function restoreClaimNoClobber(claimPath, destinationPath) {
	try {
		await fs.link(claimPath, destinationPath);
		await fs.unlink(claimPath);
	} catch (error) {
		if (error.code !== "EEXIST") throw error;
		const conflictPath = `${claimPath}.conflict-${Date.now()}`;
		await fs.rename(claimPath, conflictPath);
		throw new Error(`HEARTBEAT.md was recreated during migration; the claimed original is preserved at ${conflictPath}`, { cause: error });
	}
}
/**
* Move the source aside and prove the claimed bytes still match what was read.
* The claim happens before any scratch write so a concurrent edit can never
* leave stale content committed while the replacement file is restored.
*/
async function claimHeartbeatSource(source) {
	const claimPath = `${source.path}${HEARTBEAT_CLAIM_INFIX}${process.pid}-${source.sha256.slice(0, 12)}`;
	await fs.rename(source.path, claimPath);
	const restore = async (cause) => {
		await restoreClaimNoClobber(claimPath, source.path).catch((restoreError) => {
			throw restoreError instanceof Error && restoreError.message.includes("preserved at") ? restoreError : new Error(`HEARTBEAT.md migration claim could not be restored from ${claimPath}`, { cause: cause ?? restoreError });
		});
	};
	try {
		const workspaceRealPath = await fs.realpath(path.dirname(source.path));
		const claimRealPath = await fs.realpath(claimPath);
		if (claimRealPath !== workspaceRealPath && !isPathInside(workspaceRealPath, claimRealPath)) throw new Error("claimed HEARTBEAT.md target escapes the agent workspace");
		const claimed = await readRegularFile({
			filePath: claimRealPath,
			maxBytes: CRON_JOB_SCRATCH_MAX_BYTES
		});
		if (hashCronScratchSource(utf8Decoder.decode(claimed.buffer)) !== source.sha256) throw new Error("HEARTBEAT.md changed before the migration claim was acquired");
	} catch (error) {
		await restore(error);
		throw error;
	}
	return {
		claimPath,
		restore,
		release: async ({ archivePath }) => {
			const failChanged = async (message, cause) => {
				const error = new Error(message, cause !== void 0 ? { cause } : void 0);
				error.name = HEARTBEAT_CLAIM_CHANGED_ERROR;
				await restore(error).catch(() => void 0);
				throw error;
			};
			let finalContent;
			try {
				const workspaceRealPath = await fs.realpath(path.dirname(source.path));
				const claimRealPath = await fs.realpath(claimPath);
				if (claimRealPath !== workspaceRealPath && !isPathInside(workspaceRealPath, claimRealPath)) throw new Error("claimed HEARTBEAT.md target escapes the agent workspace");
				const finalBytes = await readRegularFile({
					filePath: claimRealPath,
					maxBytes: CRON_JOB_SCRATCH_MAX_BYTES
				});
				finalContent = utf8Decoder.decode(finalBytes.buffer);
			} catch (error) {
				await failChanged("claimed HEARTBEAT.md could not be re-verified before removal", error);
				throw error;
			}
			if (hashCronScratchSource(finalContent) !== source.sha256) await failChanged("HEARTBEAT.md changed while the migration claim was held");
			let recreated;
			try {
				await fs.lstat(source.path);
				recreated = true;
			} catch (error) {
				if (error.code !== "ENOENT") await failChanged("could not verify the original HEARTBEAT.md path before removal", error);
				recreated = false;
			}
			if (recreated) await failChanged("HEARTBEAT.md was recreated while the migration claim was held");
			if ((await fs.lstat(claimPath)).isSymbolicLink()) {
				await fs.unlink(claimPath);
				return;
			}
			try {
				await fs.rename(claimPath, archivePath);
			} catch (error) {
				if (error.code !== "EXDEV") throw error;
				await fs.unlink(claimPath);
			}
		}
	};
}
async function archiveSource(params) {
	const archivePath = archivePathForSource(params.agentId, params.source.sha256, params.env);
	await fs.mkdir(path.dirname(archivePath), {
		recursive: true,
		mode: 448
	});
	try {
		await fs.writeFile(archivePath, params.source.content, {
			flag: "wx",
			mode: 384
		});
	} catch (error) {
		if (error.code !== "EEXIST") throw error;
		if (hashCronScratchSource(await fs.readFile(archivePath, "utf8")) !== params.source.sha256) throw new Error(`heartbeat migration archive collision at ${archivePath}`, { cause: error });
	}
}
function migrationFinding(params) {
	return {
		checkId: HEARTBEAT_SCRATCH_MIGRATION_CHECK_ID,
		severity: params.severity ?? "warning",
		message: params.message,
		path: params.path,
		target: params.agentId,
		requirement: params.requirement,
		fixHint: `Run ${formatCliCommand("openclaw doctor --fix")} to migrate HEARTBEAT.md into cron scratch.`
	};
}
/** Reports remaining workspace heartbeat files without changing them. */
async function collectHeartbeatScratchMigrationFindings(cfg) {
	const findings = [];
	for (const agent of resolveHeartbeatAgents(cfg)) {
		const heartbeatPath = path.join(resolveAgentWorkspaceDir(cfg, agent.agentId), LEGACY_HEARTBEAT_FILENAME);
		try {
			if (!await readHeartbeatSource(cfg, agent.agentId)) continue;
			findings.push(migrationFinding({
				agentId: agent.agentId,
				path: heartbeatPath,
				requirement: "legacy-heartbeat-file",
				message: `Agent "${agent.agentId}" still stores heartbeat instructions in HEARTBEAT.md.`
			}));
		} catch (error) {
			findings.push(migrationFinding({
				agentId: agent.agentId,
				path: heartbeatPath,
				requirement: "heartbeat-file-migration-blocked",
				severity: "error",
				message: `Agent "${agent.agentId}" HEARTBEAT.md cannot be migrated: ${formatErrorMessage(error)}`
			}));
		}
	}
	return findings;
}
/** Migrates each enrolled agent's heartbeat file into its stable monitor job. */
async function maybeMigrateHeartbeatFilesToScratch(params) {
	const env = params.env ?? process.env;
	const storePath = resolveCronJobsStorePathFromConfig(params.cfg, env);
	const changes = [];
	const warnings = [];
	if (!params.shouldRepair) {
		for (const agent of resolveHeartbeatAgents(params.cfg)) try {
			const source = await readHeartbeatSource(params.cfg, agent.agentId);
			if (source) note(`${shortenHomePath(source.path)} will migrate into scratch for Heartbeat (${agent.agentId}).`, "Heartbeat migration preview");
		} catch (error) {
			warnings.push(`Agent "${agent.agentId}" HEARTBEAT.md cannot be migrated: ${formatErrorMessage(error)}`);
		}
		if (warnings.length > 0) note(warnings.join("\n"), "Doctor warnings");
		return {
			changes,
			warnings
		};
	}
	let monitors;
	try {
		monitors = await ensureHeartbeatMonitorJobs(params.cfg, storePath, env);
	} catch (error) {
		return {
			changes,
			warnings: [`Could not prepare heartbeat monitor jobs: ${formatErrorMessage(error)}`]
		};
	}
	const groups = /* @__PURE__ */ new Map();
	for (const [agentId, monitor] of monitors) {
		let source;
		try {
			source = await readHeartbeatSource(params.cfg, agentId, { recoverClaims: true });
		} catch (error) {
			warnings.push(`Agent "${agentId}" HEARTBEAT.md was not migrated: ${formatErrorMessage(error)}`);
			continue;
		}
		if (!source) continue;
		const group = groups.get(source.entryKey) ?? {
			source,
			agents: []
		};
		group.agents.push([agentId, monitor]);
		groups.set(source.entryKey, group);
	}
	for (const { source, agents } of groups.values()) {
		let blocked = false;
		const plannedRevisionByJobId = /* @__PURE__ */ new Map();
		for (const [agentId, monitor] of agents) {
			const state = readCronJobScratchState(storePath, monitor.id, { env });
			const current = state.scratch;
			plannedRevisionByJobId.set(monitor.id, state.currentRevision);
			if (state.currentRevision > 0 && !current) {
				warnings.push(`Agent "${agentId}" scratch was explicitly unset; ${shortenHomePath(source.path)} was left unchanged.`);
				blocked = true;
			} else if (current && current.content !== source.content && current.sourceSha256 !== source.sha256) {
				warnings.push(`Agent "${agentId}" already has different cron scratch; ${shortenHomePath(source.path)} was left unchanged.`);
				blocked = true;
			}
		}
		if (blocked) continue;
		try {
			await archiveSource({
				agentId: agents[0][0],
				source,
				env
			});
		} catch (error) {
			warnings.push(`${shortenHomePath(source.path)} was not migrated: ${formatErrorMessage(error)}. Rerun doctor to retry safely.`);
			continue;
		}
		let claim;
		try {
			claim = await claimHeartbeatSource(source);
		} catch (error) {
			warnings.push(`${shortenHomePath(source.path)} was not migrated: ${formatErrorMessage(error)}. Rerun doctor to retry safely.`);
			continue;
		}
		let importedAll = true;
		const groupChanges = [];
		const committedThisRun = [];
		for (const [agentId, monitor] of agents) try {
			const state = readCronJobScratchState(storePath, monitor.id, { env });
			if (state.scratch?.sourceSha256 !== source.sha256) {
				const write = writeCronJobScratch({
					storePath,
					jobId: monitor.id,
					content: source.content,
					expectedRevision: plannedRevisionByJobId.get(monitor.id) ?? state.currentRevision,
					sourceSha256: source.sha256,
					options: { env }
				});
				if (!write.ok) throw new Error("scratch changed during migration");
				committedThisRun.push({
					agentId,
					monitor,
					previous: state.scratch,
					newRevision: write.currentRevision
				});
			}
			const verified = readCronJobScratchState(storePath, monitor.id, { env }).scratch;
			if (!verified || verified.content !== source.content || verified.sourceSha256 !== source.sha256) throw new Error("scratch verification failed after write");
			groupChanges.push(`Migrated ${shortenHomePath(source.path)} into cron scratch for ${monitor.displayName ?? monitor.name}.`);
		} catch (error) {
			warnings.push(`Agent "${agentId}" scratch was not finalized: ${formatErrorMessage(error)}. Rerun doctor to retry safely.`);
			importedAll = false;
		}
		const rollbackCommitted = () => {
			for (const commit of committedThisRun.toReversed()) {
				if (!commit.previous) {
					if (!deleteCronJobScratch(storePath, commit.monitor.id, { env }, { expectedRevision: commit.newRevision })) warnings.push(`Agent "${commit.agentId}" scratch changed before the migration rollback; leaving current scratch in place.`);
					continue;
				}
				if (!writeCronJobScratch({
					storePath,
					jobId: commit.monitor.id,
					content: commit.previous.content,
					expectedRevision: commit.newRevision,
					sourceSha256: commit.previous.sourceSha256,
					options: { env }
				}).ok) warnings.push(`Agent "${commit.agentId}" scratch changed before the migration rollback; leaving current scratch in place.`);
			}
		};
		if (!importedAll) {
			rollbackCommitted();
			try {
				await claim.restore(void 0);
			} catch (error) {
				warnings.push(formatErrorMessage(error));
			}
			continue;
		}
		try {
			await claim.release({ archivePath: archivePathForSource(agents[0][0], source.sha256, env) });
			changes.push(...groupChanges);
		} catch (error) {
			if (error instanceof Error && error.name === HEARTBEAT_CLAIM_CHANGED_ERROR) {
				rollbackCommitted();
				warnings.push(`${shortenHomePath(source.path)} was not migrated: ${formatErrorMessage(error)}. Rerun doctor to retry safely.`);
				continue;
			}
			changes.push(...groupChanges);
			warnings.push(`${shortenHomePath(source.path)} was migrated but not removed: ${formatErrorMessage(error)}. Rerun doctor to retry safely.`);
		}
	}
	if (changes.length > 0) note(changes.join("\n"), "Doctor changes");
	if (warnings.length > 0) note(warnings.join("\n"), "Doctor warnings");
	return {
		changes,
		warnings
	};
}
//#endregion
export { collectHeartbeatScratchMigrationFindings, maybeMigrateHeartbeatFilesToScratch };
