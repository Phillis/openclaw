import { t as coerceErrorMessage } from "./error-coercion-DisD0JTb.js";
import "./src-BkwWvwB2.js";
import { t as stableStringify } from "./stable-stringify-DoZ6Yalc.js";
import { t as FsSafeError } from "./errors-hdcLXK2n.js";
import { r as root } from "./fs-safe-X_oyl7Rx.js";
import "./agent-scope-D9GLFAyB.js";
import { n as normalizeAgentId } from "./agent-id-Db0rqw_J.js";
import { l as resolveAgentDir, r as listAgentEntries } from "./agent-scope-config-CsnnOL14.js";
import { l as resolveSessionTranscriptsDirForAgent } from "./paths-CfFmgJmW.js";
import { r as getRuntimeConfig } from "./io-BTBpQ7uO.js";
import { t as parseClawHubPluginSpec } from "./clawhub-spec-Er3Np6VI.js";
import { n as loadInstalledPluginIndexInstallRecords } from "./installed-plugin-index-record-reader-CDDyVBh4.js";
import { d as openOpenClawStateDatabase, h as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BciZ4rHE.js";
import { a as sha256Hex } from "./crypto-digest-PR8Utwzg.js";
import { o as normalizeClawHubSha256Integrity } from "./clawhub-artifacts-jssX92XQ.js";
import { r as normalizeConfiguredMcpServers } from "./mcp-config-normalize-D7pPWik2.js";
import { h as applyDefaultCronToolsAllow } from "./store-DPYCi6M7.js";
import { I as createTrustedCronScheduledToolPolicy, _ as normalizeCronJobCreate } from "./row-codec-RY4IJt5w.js";
import "./config-CfeGo4K4.js";
import { i as closeOpenClawAgentDatabaseByPath } from "./openclaw-agent-db-C8vnaZ56.js";
import { A as resolveOpenClawAgentSqlitePath } from "./openclaw-agent-db-maintenance-CAGHh5rr.js";
import "./installed-plugin-index-records-1BeSqHzt.js";
import { t as MAX_WORKSPACE_BOOTSTRAP_FILE_BYTES } from "./workspace-bootstrap-read-DvPqI1Oj.js";
import { c as readWorkspaceStateSnapshot, i as deleteWorkspaceState, s as prepareWorkspaceStateDeletion } from "./workspace-state-store-CdlAG1ee.js";
import { c as prepareLegacyWorkspaceStateReset, l as removeLegacyWorkspaceStateForReset } from "./workspace-legacy-state-Cj3sm-nM.js";
import { S as resolveWorkspaceBootstrapStatus, n as DEFAULT_BOOTSTRAP_FILENAME } from "./workspace-Bhf9rmeb.js";
import { c as moveToTrash } from "./onboard-helpers-CPYqMvEB.js";
import "./sessions-Bh837xaa.js";
import { l as digestClawAgentConfig, n as deleteCachedClawInstallSchemaVersion } from "./provenance-runtime-read-BnGip8J4.js";
import { n as maintainClawPackageLifecycleLease, t as acquireClawPackageLifecycleLease } from "./claw-package-lifecycle-lease-CWn7tj2F.js";
import { S as snapshotCommittedSkillArtifactBestEffort, a as resolveClawHubSkillStatusLinkSync, b as dispatchCommittedSkillChangeBestEffort, d as formatClawHubSkillRef, f as parseRequestedClawHubSkillRef, h as untrackClawHubSkill, u as digestClawHubSkillTree, v as resolveWorkspaceSkillInstallDir, x as hasCommittedSkillChangeHooks } from "./clawhub-Br58P2LA.js";
import { t as resolveCronJobConfigRevision } from "./config-revision-CorYfjz-.js";
import { a as pruneAgentConfig } from "./agents.config-BgVfIBCV.js";
import { t as listConfiguredMcpServers } from "./mcp-config-BBRFx0BA.js";
import { n as unsetConfiguredMcpServer } from "./mcp-config-mutation-B2CX_dfY.js";
import { t as withPluginLifecycleLease } from "./plugin-lifecycle-lease-say_7LA7.js";
import { n as inspectBundlePluginArtifact, r as inspectNativePluginArtifact, t as PLUGIN_ARTIFACT_ADAPTER_IDENTITY } from "./install-artifact-inspection-DFeoJtJW.js";
import { c as readClawPackageRefs, d as updateClawPackageRefStatus, s as readClawInstallRecords, u as updateClawInstallRecordStatus } from "./provenance-pOtPo3ra.js";
import { t as findOverlappingWorkspaceAgentIds } from "./agent-delete-safety-CYN-n-yx.js";
import { n as deleteAgentConfigEntry, t as AgentConfigPreconditionError } from "./agents-config-mutations-D9KfZBmP.js";
import { C as digestClawMcpServer, E as readClawMcpServerRefs, O as reconcileClawMcpServerRefs, S as deleteClawMcpServerRef, T as planClawMcpServerRemoval, t as parseClawMarkdown, v as CLAW_OUTPUT_STABILITY, x as clawMcpRemovalSelector } from "./reader-CSq0jq16.js";
import { t as runPluginUninstallCommand } from "./plugins-uninstall-command-Bq9159D-.js";
import { r as resolvePluginInstallRequestContext } from "./plugin-install-config-policy-DL7SNZmO.js";
import { createHash, randomUUID } from "node:crypto";
import path, { isAbsolute, relative, resolve, sep } from "node:path";
import fs, { realpath } from "node:fs/promises";
//#region src/claws/cron.ts
const CLAW_CRON_REF_SCHEMA_VERSION = "openclaw.clawCronRef.v1";
var ClawCronInstallError = class extends Error {
	constructor(code, message, cronJobs) {
		super(message);
		this.code = code;
		this.cronJobs = cronJobs;
		this.name = "ClawCronInstallError";
	}
};
function rowToRef(row) {
	return {
		schemaVersion: CLAW_CRON_REF_SCHEMA_VERSION,
		agentId: row.agent_id,
		manifestId: row.manifest_id,
		declarationKey: row.declaration_key,
		...row.scheduler_job_id ? { schedulerJobId: row.scheduler_job_id } : {},
		status: row.status,
		job: JSON.parse(row.job_json),
		...row.error ? { error: row.error } : {},
		createdAtMs: Number(row.created_at_ms),
		updatedAtMs: Number(row.updated_at_ms)
	};
}
function persistPendingRef(plan, job, options) {
	const nowMs = options.nowMs ?? Date.now();
	const declarationKey = `claw:${plan.agent.finalId}:${job.id}`;
	const existing = openOpenClawStateDatabase(options).db.prepare(`SELECT schema_version, agent_id, manifest_id, declaration_key, scheduler_job_id,
              status, job_json, error, created_at_ms, updated_at_ms
         FROM claw_cron_refs
        WHERE agent_id = ? AND manifest_id = ?`).get(plan.agent.finalId, job.id);
	if (existing) {
		const ref = rowToRef(existing);
		if (ref.declarationKey !== declarationKey || JSON.stringify(ref.job) !== JSON.stringify(job)) throw new ClawCronInstallError("cron_provenance_conflict", `Cron declaration ${JSON.stringify(job.id)} differs from its pending ownership record.`, [ref]);
		if (ref.status === "complete") return ref;
		return updateRef(ref, { status: "pending" }, options);
	}
	const record = {
		schemaVersion: CLAW_CRON_REF_SCHEMA_VERSION,
		agentId: plan.agent.finalId,
		manifestId: job.id,
		declarationKey,
		status: "pending",
		job,
		createdAtMs: nowMs,
		updatedAtMs: nowMs
	};
	runOpenClawStateWriteTransaction(({ db }) => {
		db.prepare(`INSERT INTO claw_cron_refs (
         agent_id, manifest_id, schema_version, declaration_key, scheduler_job_id,
         status, job_json, error, created_at_ms, updated_at_ms
       ) VALUES (
         @agent_id, @manifest_id, @schema_version, @declaration_key, NULL,
         @status, @job_json, NULL, @created_at_ms, @updated_at_ms
       )`).run({
			agent_id: record.agentId,
			manifest_id: record.manifestId,
			schema_version: record.schemaVersion,
			declaration_key: record.declarationKey,
			status: record.status,
			job_json: JSON.stringify(record.job),
			created_at_ms: nowMs,
			updated_at_ms: nowMs
		});
	}, options);
	return record;
}
function updateRef(ref, update, options) {
	const updated = {
		...ref,
		...update,
		updatedAtMs: options.nowMs ?? Date.now()
	};
	runOpenClawStateWriteTransaction(({ db }) => {
		db.prepare(`UPDATE claw_cron_refs
          SET scheduler_job_id = @scheduler_job_id,
              status = @status,
              error = @error,
              updated_at_ms = @updated_at_ms
        WHERE agent_id = @agent_id AND manifest_id = @manifest_id`).run({
			agent_id: ref.agentId,
			manifest_id: ref.manifestId,
			scheduler_job_id: update.schedulerJobId ?? null,
			status: update.status,
			error: update.error ?? null,
			updated_at_ms: updated.updatedAtMs
		});
	}, options);
	return updated;
}
function clawCronSchedulerJobFromResult(value) {
	if (!value || typeof value !== "object") return;
	const record = value;
	if (typeof record.id === "string" && record.id) return { id: record.id };
	const job = record.job;
	if (job && typeof job === "object" && typeof job.id === "string") return { id: job.id };
}
function schedulerJobByDeclarationKey(value, declarationKey) {
	if (!value || typeof value !== "object") return;
	const jobs = value.jobs;
	if (!Array.isArray(jobs)) return;
	const matches = jobs.filter((job) => Boolean(job) && typeof job === "object" && job.declarationKey === declarationKey && typeof job.id === "string");
	const match = matches.length === 1 ? matches[0] : void 0;
	return match ? { id: match.id } : void 0;
}
function clawCronGatewayInput(agentId, ref) {
	const job = ref.job;
	return {
		name: job.name ?? job.id,
		declarationKey: ref.declarationKey,
		...job.name ? { displayName: job.name } : {},
		owner: { agentId },
		enabled: true,
		agentId,
		schedule: {
			kind: "cron",
			expr: job.schedule.cron,
			...job.schedule.timezone ? { tz: job.schedule.timezone } : {}
		},
		sessionTarget: job.session === "main" ? `session:agent:${agentId}:main` : job.session,
		wakeMode: "now",
		payload: {
			kind: "agentTurn",
			message: job.message
		},
		delivery: job.delivery ? {
			mode: job.delivery.mode,
			...job.delivery.channel ? { channel: job.delivery.channel } : {}
		} : { mode: "none" }
	};
}
function clawCronGatewayJobMatchesRef(agentId, ref, value) {
	if (!value || typeof value !== "object") return false;
	const live = value;
	const expected = normalizeCronJobCreate(clawCronGatewayInput(agentId, ref));
	if (!expected || typeof live.id !== "string" || typeof live.createdAtMs !== "number" || typeof live.updatedAtMs !== "number" || !live.state) return false;
	const comparableLive = {
		...live,
		payload: { ...live.payload }
	};
	applyDefaultCronToolsAllow(expected);
	applyDefaultCronToolsAllow(comparableLive);
	const expectedWithPolicy = {
		...expected,
		...comparableLive.scheduledToolPolicy ? { scheduledToolPolicy: createTrustedCronScheduledToolPolicy() } : {}
	};
	try {
		return resolveCronJobConfigRevision({
			...expectedWithPolicy,
			id: live.id,
			createdAtMs: live.createdAtMs,
			updatedAtMs: live.updatedAtMs,
			state: live.state
		}) === resolveCronJobConfigRevision(comparableLive);
	} catch {
		return false;
	}
}
async function installClawCronJobs(plan, options = {}) {
	const actions = plan.actions.filter((action) => action.kind === "cronJob");
	if (actions.length === 0) return [];
	if (!options.gateway) throw new ClawCronInstallError("cron_gateway_required", "Claw automations require the gateway-owned cron.add API.", []);
	const refs = [];
	let agentAvailable = false;
	for (const action of actions) {
		const details = action.details;
		if (!details?.id) throw new ClawCronInstallError("cron_plan_invalid", `Cron action ${action.id} is invalid.`, refs);
		const pending = persistPendingRef(plan, {
			id: details.id,
			...details.name ? { name: details.name } : {},
			schedule: details.schedule,
			session: details.session,
			message: details.message,
			...details.delivery ? { delivery: details.delivery } : {}
		}, options);
		refs.push(pending);
		if (pending.status === "complete" && pending.schedulerJobId) continue;
		let result;
		try {
			if (!agentAvailable) {
				await options.gateway.waitUntilAgentAvailable?.(plan.agent.finalId);
				agentAvailable = true;
			}
			if (options.gateway.list) result = schedulerJobByDeclarationKey(await options.gateway.list(plan.agent.finalId), pending.declarationKey);
			result ??= clawCronSchedulerJobFromResult(await options.gateway.add(clawCronGatewayInput(plan.agent.finalId, pending)));
			if (!result) throw new Error("cron.add returned no scheduler job id");
		} catch (error) {
			const message = coerceErrorMessage(error);
			refs[refs.length - 1] = updateRef(pending, {
				status: "pending",
				error: message
			}, options);
			throw new ClawCronInstallError("cron_install_failed", message, refs);
		}
		try {
			refs[refs.length - 1] = updateRef(pending, {
				status: "complete",
				schedulerJobId: result.id
			}, options);
		} catch (error) {
			throw new ClawCronInstallError("cron_provenance_failed", `cron.add succeeded, but its scheduler id could not be persisted: ${coerceErrorMessage(error)}`, refs);
		}
	}
	return refs;
}
function readClawCronRefs(agentId, options = {}) {
	const database = openOpenClawStateDatabase(options);
	if (options.readOnly && !database.db.prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'claw_cron_refs'").get()) return [];
	return database.db.prepare(`SELECT schema_version, agent_id, manifest_id, declaration_key, scheduler_job_id,
              status, job_json, error, created_at_ms, updated_at_ms
         FROM claw_cron_refs
        WHERE agent_id = ?
        ORDER BY manifest_id`).all(agentId).map(rowToRef);
}
function deleteClawCronRef(agentId, manifestId, options = {}) {
	runOpenClawStateWriteTransaction(({ db }) => {
		db.prepare("DELETE FROM claw_cron_refs WHERE agent_id = ? AND manifest_id = ?").run(agentId, manifestId);
	}, options);
}
function markClawCronRefRemoved(agentId, manifestId, options = {}) {
	const ref = readClawCronRefs(agentId, options).find((candidate) => candidate.manifestId === manifestId);
	return ref ? updateRef(ref, { status: "removed" }, options) : void 0;
}
function upsertClawCronRef(ref, options = {}) {
	runOpenClawStateWriteTransaction(({ db }) => {
		db.prepare(`INSERT INTO claw_cron_refs (
         agent_id, manifest_id, schema_version, declaration_key, scheduler_job_id,
         status, job_json, error, created_at_ms, updated_at_ms
       ) VALUES (
         @agent_id, @manifest_id, @schema_version, @declaration_key, @scheduler_job_id,
         @status, @job_json, @error, @created_at_ms, @updated_at_ms
       )
       ON CONFLICT(agent_id, manifest_id) DO UPDATE SET
         schema_version = excluded.schema_version,
         declaration_key = excluded.declaration_key,
         scheduler_job_id = excluded.scheduler_job_id,
         status = excluded.status,
         job_json = excluded.job_json,
         error = excluded.error,
         updated_at_ms = excluded.updated_at_ms`).run({
			agent_id: ref.agentId,
			manifest_id: ref.manifestId,
			schema_version: ref.schemaVersion,
			declaration_key: ref.declarationKey,
			scheduler_job_id: ref.schedulerJobId ?? null,
			status: ref.status,
			job_json: JSON.stringify(ref.job),
			error: ref.error ?? null,
			created_at_ms: ref.createdAtMs,
			updated_at_ms: ref.updatedAtMs
		});
	}, options);
}
//#endregion
//#region src/claws/lifecycle-delete-support.ts
var ClawRemoveError = class extends Error {
	constructor(code, message) {
		super(message);
		this.code = code;
		this.name = "ClawRemoveError";
	}
};
function clawStateTableExists(db, name) {
	return Boolean(db.prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = ?").get(name));
}
function rowToWorkspaceFile$1(row) {
	return {
		schemaVersion: row.schema_version,
		agentId: row.agent_id,
		workspace: row.workspace,
		path: row.target_path,
		sourcePath: row.source_path,
		contentDigest: row.content_digest,
		status: row.status,
		createdAtMs: Number(row.created_at_ms),
		updatedAtMs: Number(row.updated_at_ms)
	};
}
function readAllClawWorkspaceFiles(options) {
	const database = openOpenClawStateDatabase(options);
	if (!clawStateTableExists(database.db, "claw_workspace_files")) return [];
	return database.db.prepare(`SELECT schema_version, agent_id, workspace, target_path, source_path,
              content_digest, status, created_at_ms, updated_at_ms
         FROM claw_workspace_files
        ORDER BY agent_id, target_path`).all().map(rowToWorkspaceFile$1);
}
function synthesizeOrphanInstall(params) {
	const updatedAtMs = params.updatedAtMs ?? 0;
	return {
		schemaVersion: "openclaw.clawInstallRecord.v1",
		claw: {
			kind: "development",
			name: params.clawName ?? `orphan:${params.agentId}`,
			version: "0.0.0",
			packageRoot: "",
			manifestPath: "",
			integrityKind: "development-snapshot",
			integrity: "sha256:orphan",
			byteLength: 0
		},
		manifestSchemaVersion: 1,
		planIntegrity: "sha256:orphan",
		agentId: params.agentId,
		workspace: params.workspace ?? "",
		agentConfigDigest: "sha256:missing",
		agentOwnedPaths: [],
		status: "partial",
		addedAtMs: updatedAtMs,
		updatedAtMs
	};
}
function deletionEffects(config, agentId, fallbackWorkspace = "") {
	const agent = listAgentEntries(config).find((candidate) => candidate.id === agentId);
	const pruned = pruneAgentConfig(config, agentId);
	const workspace = agent?.workspace ?? fallbackWorkspace;
	const agentDir = resolveAgentDir(config, agentId);
	const sessionsDir = resolveSessionTranscriptsDirForAgent(agentId);
	const workspaceSharedWith = workspace ? findOverlappingWorkspaceAgentIds(config, agentId, workspace) : [];
	return {
		pruned,
		workspace,
		agentDir,
		sessionsDir,
		workspaceSharedWith,
		workspaceRetained: workspaceSharedWith.length > 0
	};
}
/** Inventories cron jobs that would retain a reference to a removed agent. */
function readAttachedCronJobs(agentId, options) {
	const database = openOpenClawStateDatabase(options);
	if (!clawStateTableExists(database.db, "cron_jobs")) return [];
	return database.db.prepare(`SELECT job_id AS id, name, enabled, agent_id AS agentId, owner_agent_id AS ownerAgentId
         FROM cron_jobs
        WHERE agent_id = ? OR owner_agent_id = ?
        ORDER BY job_id`).all(agentId, agentId).map((row) => {
		const value = row;
		return {
			id: value.id,
			name: value.name,
			enabled: value.enabled === 1,
			agentId: value.agentId,
			ownerAgentId: value.ownerAgentId
		};
	});
}
/** Returns true when removing a workspace would discard anything outside Claw provenance. */
async function workspaceContainsUntrackedEntries(workspaceRoot, trackedPaths) {
	const tracked = new Set(trackedPaths.map((entry) => path.normalize(entry)));
	const trackedDirectories = /* @__PURE__ */ new Set();
	for (const trackedPath of tracked) {
		let parent = path.dirname(trackedPath);
		while (parent && parent !== ".") {
			trackedDirectories.add(parent);
			const next = path.dirname(parent);
			if (next === parent) break;
			parent = next;
		}
	}
	const walk = async (absoluteDir, relativeDir = "") => {
		const entries = await fs.readdir(absoluteDir, { withFileTypes: true });
		for (const entry of entries) {
			const relativeEntry = path.join(relativeDir, entry.name);
			if (entry.isDirectory() && !entry.isSymbolicLink()) {
				if (!trackedDirectories.has(path.normalize(relativeEntry))) return true;
				if (await walk(path.join(absoluteDir, entry.name), relativeEntry)) return true;
				continue;
			}
			if (!tracked.has(path.normalize(relativeEntry))) return true;
		}
		return false;
	};
	try {
		return await walk(workspaceRoot);
	} catch (error) {
		return error.code !== "ENOENT";
	}
}
/** Applies canonical post-config filesystem cleanup and reports every failed effect. */
async function cleanupClawAgentFilesystem(params) {
	const errors = [];
	const trashPath = params.trashPath ?? moveToTrash;
	const workspaceSharedWith = params.targets.workspaceDir ? findOverlappingWorkspaceAgentIds(params.nextConfig, params.agentId, params.targets.workspaceDir) : [];
	if (params.targets.workspaceDir && !params.retainWorkspace && workspaceSharedWith.length === 0) {
		const legacyPlan = prepareLegacyWorkspaceStateReset(params.targets.workspaceDir);
		const statePlan = prepareWorkspaceStateDeletion(params.targets.workspaceDir);
		if (await trashPath(params.targets.workspaceDir, params.runtime)) try {
			const legacyCleanup = await removeLegacyWorkspaceStateForReset(legacyPlan);
			for (const warning of legacyCleanup.warnings) params.runtime.log(warning);
			deleteWorkspaceState(statePlan);
		} catch (error) {
			errors.push(coerceErrorMessage(error));
		}
		else errors.push(`Could not trash workspace ${params.targets.workspaceDir}.`);
	}
	if (!await trashPath(params.targets.agentDir, params.runtime)) errors.push(`Could not trash agent state ${params.targets.agentDir}.`);
	if (!await trashPath(params.targets.sessionsDir, params.runtime)) errors.push(`Could not trash session transcripts ${params.targets.sessionsDir}.`);
	return errors;
}
const clawRemoveQuietRuntime = {
	log: (..._args) => void 0,
	error: (..._args) => void 0,
	exit: (code) => {
		throw new Error(`Unexpected exit during Claw removal cleanup: ${code ?? 1}`);
	}
};
async function inspectDigestOwnedWorkspaceFile(record, maxBytes = 1024 * 1024) {
	try {
		const workspace = await root(record.workspace, {
			hardlinks: "reject",
			maxBytes,
			symlinks: "reject"
		});
		if (!await workspace.exists(record.path)) return { state: "missing" };
		const content = await workspace.readBytes(record.path, { maxBytes });
		return { state: `sha256:${createHash("sha256").update(content).digest("hex")}` === record.contentDigest ? "unchanged" : "modified" };
	} catch (error) {
		if (error.code === "ENOENT") return { state: "missing" };
		return {
			state: "unsafe",
			message: coerceErrorMessage(error)
		};
	}
}
async function inspectClawWorkspaceFile(record) {
	return {
		...record,
		...await inspectDigestOwnedWorkspaceFile(record)
	};
}
async function inspectClawBootstrap(install, options) {
	const nativeState = await resolveWorkspaceBootstrapStatus(install.workspace, options);
	const setupState = readWorkspaceStateSnapshot(install.workspace, options).setup;
	const base = {
		workspace: install.workspace,
		path: DEFAULT_BOOTSTRAP_FILENAME,
		...install.bootstrap
	};
	const nativeBootstrapConsumed = typeof setupState.setupCompletedAt === "string" || typeof setupState.bootstrapSeededAt === "string";
	if (nativeState === "complete" && (!install.bootstrap || nativeBootstrapConsumed)) return {
		...base,
		state: "complete"
	};
	if (!install.bootstrap) return {
		...base,
		state: nativeState
	};
	const bootstrapSeedingPending = install.status === "pending" || install.status === "partial" || install.status === "workspace_ready";
	if (bootstrapSeedingPending) try {
		await fs.lstat(install.workspace);
	} catch (error) {
		if (error.code === "ENOENT") return {
			...base,
			state: "missing"
		};
	}
	const inspected = await inspectDigestOwnedWorkspaceFile({
		workspace: install.workspace,
		path: DEFAULT_BOOTSTRAP_FILENAME,
		contentDigest: install.bootstrap.contentDigest
	}, MAX_WORKSPACE_BOOTSTRAP_FILE_BYTES);
	if (inspected.state === "unchanged") return {
		...base,
		state: "pending"
	};
	if (inspected.state === "modified" || inspected.state === "unsafe") return {
		...base,
		state: inspected.state,
		...inspected.message ? { message: inspected.message } : {}
	};
	if (bootstrapSeedingPending) return {
		...base,
		state: "missing"
	};
	return {
		...base,
		state: "unknown",
		message: "BOOTSTRAP.md disappeared during inspection."
	};
}
async function removeClawWorkspaceFile(record, maxBytes = 1024 * 1024) {
	if (record.state === "missing") return {
		path: record.path,
		action: "missing"
	};
	if (record.state === "modified") return {
		path: record.path,
		action: "retainedModified"
	};
	try {
		const workspace = await root(record.workspace, {
			hardlinks: "reject",
			maxBytes,
			symlinks: "reject"
		});
		if (!await workspace.exists(record.path)) return {
			path: record.path,
			action: "missing"
		};
		const stagedPath = `${record.path}.openclaw-claw-remove-${randomUUID()}`;
		await workspace.move(record.path, stagedPath, { overwrite: false });
		const content = await workspace.readBytes(stagedPath, { maxBytes });
		if (`sha256:${createHash("sha256").update(content).digest("hex")}` !== record.contentDigest) {
			await workspace.move(stagedPath, record.path, { overwrite: false });
			return {
				path: record.path,
				action: "retainedModified"
			};
		}
		await workspace.remove(stagedPath);
		return {
			path: record.path,
			action: "deleted"
		};
	} catch (error) {
		return {
			path: record.path,
			action: "error",
			message: error instanceof FsSafeError ? `${error.code}: ${error.message}` : String(error)
		};
	}
}
function releaseClawRemoveRows(agentId, files, complete, options) {
	runOpenClawStateWriteTransaction(({ db }) => {
		if (clawStateTableExists(db, "claw_workspace_files")) for (const file of files.filter((candidate) => candidate.action !== "error")) db.prepare("DELETE FROM claw_workspace_files WHERE agent_id = ? AND target_path = ?").run(agentId, file.path);
		if (!complete) return;
		if (clawStateTableExists(db, "claw_package_refs")) db.prepare("DELETE FROM claw_package_refs WHERE agent_id = ?").run(agentId);
		if (clawStateTableExists(db, "claw_installs")) db.prepare("DELETE FROM claw_installs WHERE agent_id = ?").run(agentId);
	}, options);
	if (complete) deleteCachedClawInstallSchemaVersion(agentId, options);
}
//#endregion
//#region src/claws/lifecycle-bootstrap-removal.ts
function clawBootstrapStateBlocksRemove(record) {
	return Boolean(record.install.bootstrap && (record.bootstrap.state === "unsafe" || record.bootstrap.state === "unknown"));
}
function planClawBootstrapRemoval(record) {
	if (!record.install.bootstrap) return;
	const blocked = clawBootstrapStateBlocksRemove(record);
	return {
		kind: "bootstrap",
		id: record.bootstrap.path,
		action: record.bootstrap.state === "pending" ? "delete" : "retain",
		target: `${record.bootstrap.workspace}:${record.bootstrap.path}`,
		blocked,
		details: {
			expectedState: record.bootstrap.state,
			contentDigest: record.install.bootstrap.contentDigest,
			sourcePath: record.install.bootstrap.sourcePath,
			lifecycle: "native-seed-once"
		},
		...record.bootstrap.state === "modified" ? { reason: "Local bootstrap content changed; preserve the file." } : record.bootstrap.state === "complete" ? { reason: "Native onboarding already consumed the bootstrap." } : {}
	};
}
async function removeClawBootstrap(record) {
	if (!record.install.bootstrap) return;
	if (record.bootstrap.state === "pending") return removeClawWorkspaceFile({
		workspace: record.bootstrap.workspace,
		path: record.bootstrap.path,
		contentDigest: record.install.bootstrap.contentDigest,
		state: "unchanged"
	}, MAX_WORKSPACE_BOOTSTRAP_FILE_BYTES);
	return record.bootstrap.state === "modified" ? {
		path: record.bootstrap.path,
		action: "retainedModified"
	} : {
		path: record.bootstrap.path,
		action: "missing"
	};
}
//#endregion
//#region src/claws/lifecycle-config-removal.ts
function digestClawAgentRemovalSurface(config, agentId) {
	const normalizedId = normalizeAgentId(agentId);
	const surface = {
		bindings: (config.bindings ?? []).filter((binding) => normalizeAgentId(binding.agentId) === normalizedId),
		agentToAgentAllow: (config.tools?.agentToAgent?.allow ?? []).filter((entry) => entry === normalizedId)
	};
	return `sha256:${createHash("sha256").update(stableStringify(surface)).digest("hex")}`;
}
async function claimClawAgentConfigRemoval(params) {
	if (params.commitConfig) {
		let result;
		await params.commitConfig((config) => {
			const effects = deletionEffects(config, params.agentId, params.fallbackWorkspace);
			const agent = listAgentEntries(config).find((candidate) => candidate.id === params.agentId);
			if (agent && digestClawAgentConfig(agent) !== params.expectedDigest || digestClawAgentRemovalSurface(config, params.agentId) !== params.expectedRemovalSurfaceDigest) throw params.onModified();
			result = {
				agentRemoved: Boolean(agent),
				...params.trashPath ? { cleanupTargets: {
					workspaceDir: effects.workspace,
					agentDir: effects.agentDir,
					sessionsDir: effects.sessionsDir
				} } : {},
				configBeforeDelete: config,
				nextConfig: effects.pruned.config
			};
			return effects.pruned.config;
		});
		if (!result) throw new Error("Claw config removal did not run its commit transform.");
		return result;
	}
	const configBeforeDelete = params.config ?? getRuntimeConfig();
	try {
		const committed = await deleteAgentConfigEntry({
			agentId: params.agentId,
			allowConfigSizeDrop: true,
			allowMissing: params.expectedState === "missing",
			fallbackWorkspace: params.fallbackWorkspace,
			validateConfig: (config) => {
				if (digestClawAgentRemovalSurface(config, params.agentId) !== params.expectedRemovalSurfaceDigest) throw params.onModified();
			},
			validate: (agent) => {
				if (params.expectedState === "missing") throw params.onModified();
				if (digestClawAgentConfig(agent) !== params.expectedDigest) throw params.onModified();
			}
		});
		const fallbackEffects = deletionEffects(configBeforeDelete, params.agentId, params.fallbackWorkspace);
		return {
			agentRemoved: Boolean(committed.result),
			cleanupTargets: committed.result ?? {
				workspaceDir: fallbackEffects.workspace,
				agentDir: fallbackEffects.agentDir,
				sessionsDir: fallbackEffects.sessionsDir
			},
			configBeforeDelete,
			nextConfig: committed.nextConfig
		};
	} catch (error) {
		if (!(error instanceof AgentConfigPreconditionError)) throw error;
		const latestConfig = getRuntimeConfig();
		if (listAgentEntries(latestConfig).some((agent) => agent.id === params.agentId)) throw params.onModified();
		const effects = deletionEffects(latestConfig, params.agentId, params.fallbackWorkspace);
		return {
			agentRemoved: false,
			cleanupTargets: {
				workspaceDir: effects.workspace,
				agentDir: effects.agentDir,
				sessionsDir: effects.sessionsDir
			},
			configBeforeDelete,
			nextConfig: latestConfig
		};
	}
}
//#endregion
//#region src/claws/lifecycle-mcp-removal.ts
async function removeClawMcpServers(params) {
	const listed = params.options.sourceMcpServers ? void 0 : params.options.listMcpServers ? await params.options.listMcpServers() : params.options.config ? void 0 : await listConfiguredMcpServers();
	if (listed && !listed.ok) throw new ClawRemoveError("mcp_config_unavailable", listed.error);
	const configured = listed?.ok ? listed.mcpServers : normalizeConfiguredMcpServers(params.options.sourceMcpServers ?? params.options.config?.mcp?.servers);
	const unsetMcpServer = params.options.unsetMcpServer ?? unsetConfiguredMcpServer;
	const mcpServers = [];
	for (const server of params.servers) {
		if (planClawMcpServerRemoval(server, params.options).action === "release") {
			deleteClawMcpServerRef(params.agentId, server.name, params.options);
			mcpServers.push({
				name: server.name,
				action: server.state === "missing" ? "missing" : "released"
			});
			continue;
		}
		const expectedServer = configured[server.name];
		if (!expectedServer) {
			if (server.state === "present") throw new ClawRemoveError("mcp_cleanup_changed", `MCP server ${JSON.stringify(server.name)} disappeared during removal.`);
			deleteClawMcpServerRef(params.agentId, server.name, params.options);
			mcpServers.push({
				name: server.name,
				action: "missing"
			});
			continue;
		}
		if (digestClawMcpServer(expectedServer) !== server.configDigest) throw new ClawRemoveError("mcp_cleanup_changed", `MCP server ${JSON.stringify(server.name)} changed during removal.`);
		try {
			const result = await unsetMcpServer({
				name: server.name,
				expectedServer
			});
			if (!result.ok) throw new Error(result.error);
			deleteClawMcpServerRef(params.agentId, server.name, params.options);
			mcpServers.push({
				name: server.name,
				action: result.removed ? "removed" : "missing"
			});
		} catch (error) {
			const message = coerceErrorMessage(error);
			mcpServers.push({
				name: server.name,
				action: "error",
				message
			});
			return {
				mcpServers,
				error: message
			};
		}
	}
	return { mcpServers };
}
//#endregion
//#region src/claws/lifecycle-remove-contract.ts
const CLAW_REMOVE_PLAN_SCHEMA_VERSION = "openclaw.clawRemovePlan.v1";
//#endregion
//#region src/plugins/plugin-install-preflight.ts
/** Resolves one installed plugin by its stable ClawHub package identity. */
async function resolveInstalledClawHubPlugin(params) {
	const records = await (params.loadInstallRecords ?? loadInstalledPluginIndexInstallRecords)();
	const matches = Object.entries(records).filter(([, record]) => (record.clawhubPackage ?? parseClawHubPluginSpec(record.spec ?? "")?.name ?? parseClawHubPluginSpec(record.resolvedSpec ?? "")?.name) === params.clawhubPackage);
	if (matches.length === 0) return { status: "missing" };
	if (matches.length > 1) return {
		status: "ambiguous",
		pluginIds: matches.map(([pluginId]) => pluginId).toSorted()
	};
	const match = matches[0];
	if (!match) return { status: "missing" };
	const [pluginId, record] = match;
	return {
		status: "found",
		pluginId,
		record,
		installedVersion: record.resolvedVersion ?? record.version
	};
}
async function preflightPluginInstall(params) {
	const resolved = resolvePluginInstallRequestContext({
		rawSpec: params.rawSpec,
		...params.marketplace ? { marketplace: params.marketplace } : {},
		installKind: "plugin"
	});
	if (!resolved.ok) return {
		ok: false,
		code: "invalid_plugin_spec",
		error: resolved.error
	};
	const records = await (params.loadInstallRecords ?? loadInstalledPluginIndexInstallRecords)();
	const installedEntry = Object.entries(records).find(([, record]) => (record.clawhubPackage ?? parseClawHubPluginSpec(record.spec ?? "")?.name) === params.clawhubPackage);
	const installedId = installedEntry?.[0];
	const installed = installedEntry?.[1];
	const installedVersion = installed?.resolvedVersion ?? installed?.version;
	if (!installedVersion || !installedId) return {
		ok: true,
		action: "install",
		request: resolved.request
	};
	if (installedVersion === params.expectedVersion) return {
		ok: true,
		action: "reuse",
		request: resolved.request,
		installedId,
		installedVersion,
		...installed?.integrity ? { installedIntegrity: installed.integrity } : {},
		...installed?.installedAt ? { installedAt: installed.installedAt } : {}
	};
	return {
		ok: false,
		code: "plugin_version_conflict",
		request: resolved.request,
		installedVersion,
		expectedVersion: params.expectedVersion
	};
}
//#endregion
//#region src/skills/lifecycle/clawhub-uninstall.ts
async function planClawHubSkillUninstall(params) {
	let requestedRef;
	try {
		requestedRef = parseRequestedClawHubSkillRef(params.slug);
	} catch (error) {
		return {
			ok: false,
			code: "ambiguous",
			error: String(error)
		};
	}
	const slug = requestedRef.slug;
	const targetDir = resolveWorkspaceSkillInstallDir(params.workspaceDir, slug);
	const link = resolveClawHubSkillStatusLinkSync({
		workspaceDir: params.workspaceDir,
		skillDir: targetDir,
		skillKey: slug
	});
	if (!link) return {
		ok: false,
		code: "missing",
		error: `Skill ${JSON.stringify(slug)} is not a tracked ClawHub install.`
	};
	if (!link.valid || !link.skillFile || !link.fileTreeSha256) return {
		ok: false,
		code: "ambiguous",
		error: link.valid ? `Skill ${JSON.stringify(slug)} has no complete installed-file digest.` : link.reason
	};
	if (requestedRef.ownerHandle && link.ownerHandle !== requestedRef.ownerHandle) {
		const trackedRef = link.ownerHandle ? `@${link.ownerHandle}/${slug}` : slug;
		return {
			ok: false,
			code: "ambiguous",
			error: `Skill ${JSON.stringify(slug)} is tracked as ${trackedRef}, not @${requestedRef.ownerHandle}/${slug}.`
		};
	}
	if (requestedRef.requestedReference && link.requestedReference !== requestedRef.requestedReference) return {
		ok: false,
		code: "ambiguous",
		error: `Skill ${JSON.stringify(slug)} is not tracked from ${requestedRef.requestedReference}.`
	};
	if (link.installedVersion !== params.expectedVersion) return {
		ok: false,
		code: "modified",
		error: `Skill ${JSON.stringify(slug)} is at ${link.installedVersion}, expected ${params.expectedVersion}.`
	};
	const skillFilePath = path.join(targetDir, link.skillFile.path);
	let content;
	try {
		const stat = await fs.lstat(targetDir);
		if (!stat.isDirectory() || stat.isSymbolicLink()) return {
			ok: false,
			code: "ambiguous",
			error: `Skill ${JSON.stringify(slug)} is not a regular managed directory.`
		};
		content = await fs.readFile(skillFilePath);
	} catch (error) {
		return {
			ok: false,
			code: "missing",
			error: String(error)
		};
	}
	if (sha256Hex(content) !== link.skillFile.sha256) return {
		ok: false,
		code: "modified",
		error: `Skill ${JSON.stringify(slug)} has local SKILL.md changes.`
	};
	let fileTreeSha256;
	try {
		fileTreeSha256 = await digestClawHubSkillTree(targetDir);
	} catch (error) {
		return {
			ok: false,
			code: "ambiguous",
			error: String(error)
		};
	}
	if (fileTreeSha256 !== link.fileTreeSha256) return {
		ok: false,
		code: "modified",
		error: `Skill ${JSON.stringify(slug)} has local file changes.`
	};
	return {
		ok: true,
		plan: {
			workspaceDir: params.workspaceDir,
			requestedRef: requestedRef.requestedReference ?? formatClawHubSkillRef(requestedRef),
			slug,
			version: link.installedVersion,
			installedAt: link.installedAt,
			targetDir,
			skillFilePath: link.skillFile.path,
			skillFileSha256: link.skillFile.sha256,
			fileTreeSha256
		}
	};
}
async function applyClawHubSkillUninstall(plan, deps = {}) {
	const current = await planClawHubSkillUninstall({
		workspaceDir: plan.workspaceDir,
		slug: plan.requestedRef,
		expectedVersion: plan.version
	});
	if (!current.ok) return {
		ok: false,
		error: current.error
	};
	const shouldDispatchChange = hasCommittedSkillChangeHooks();
	const before = shouldDispatchChange ? await snapshotCommittedSkillArtifactBestEffort({
		skillDir: plan.targetDir,
		skillKey: plan.slug,
		source: "clawhub",
		sourceVersion: plan.version
	}) : void 0;
	const stagedDir = `${plan.targetDir}.openclaw-skill-remove-${randomUUID()}`;
	let staged = false;
	let restoreTracking;
	const rename = deps.rename ?? fs.rename;
	try {
		await rename(plan.targetDir, stagedDir);
		staged = true;
		if (sha256Hex(await (deps.readFile ?? fs.readFile)(path.join(stagedDir, plan.skillFilePath))) !== plan.skillFileSha256) {
			await rename(stagedDir, plan.targetDir);
			return {
				ok: false,
				error: `Skill ${JSON.stringify(plan.slug)} changed during removal.`
			};
		}
		if (await digestClawHubSkillTree(stagedDir) !== plan.fileTreeSha256) {
			await rename(stagedDir, plan.targetDir);
			return {
				ok: false,
				error: `Skill ${JSON.stringify(plan.slug)} changed during removal.`
			};
		}
		restoreTracking = await (deps.untrack ?? untrackClawHubSkill)(plan.workspaceDir, plan.slug);
		await (deps.removeDir ?? fs.rm)(stagedDir, {
			recursive: true,
			force: false
		});
		if (shouldDispatchChange) await dispatchCommittedSkillChangeBestEffort({
			action: "removed",
			source: "clawhub",
			workspaceDir: plan.workspaceDir,
			before
		});
		return { ok: true };
	} catch (error) {
		const rollbackErrors = [];
		try {
			await restoreTracking?.();
		} catch (rollbackError) {
			rollbackErrors.push(`could not restore lockfile: ${String(rollbackError)}`);
		}
		if (staged) try {
			await rename(stagedDir, plan.targetDir);
		} catch (rollbackError) {
			rollbackErrors.push(`could not restore skill directory: ${String(rollbackError)}`);
		}
		return {
			ok: false,
			error: `${String(error)}${rollbackErrors.length > 0 ? `; rollback incomplete: ${rollbackErrors.join("; ")}` : ""}`
		};
	}
}
//#endregion
//#region src/claws/package-remove.ts
function sameArtifact(left, right) {
	return left.kind === right.kind && left.source === right.source && left.ref === right.ref;
}
function sameVersionedArtifact(left, right) {
	return sameArtifact(left, right) && left.version === right.version;
}
function clawPackageRemovalSelector(packageRef) {
	return `${packageRef.kind}:${packageRef.ref}@${packageRef.version}`;
}
function sameRecordedState(left, right) {
	return left.status === right.status && left.relationship === right.relationship && left.origin === right.origin && (left.independentOwner === right.independentOwner || right.independentOwner && !left.independentOwner);
}
function otherClawAgentIds(params) {
	return params.refs.filter((candidate) => {
		if (candidate.agentId === params.packageRef.agentId || !sameArtifact(candidate, params.packageRef) || params.statuses && !params.statuses.has(candidate.status)) return false;
		if (params.packageRef.kind === "plugin") return true;
		return params.installs.some((install) => install.agentId === candidate.agentId && install.workspace === params.workspace);
	}).map((candidate) => candidate.agentId).toSorted();
}
function hasAnotherClawOwner(params) {
	return otherClawAgentIds(params).length > 0;
}
function ownerInstallIsNewer(installedAt, packageRef) {
	const timestamp = typeof installedAt === "number" ? installedAt : Date.parse(installedAt ?? "");
	return Number.isFinite(timestamp) && timestamp > packageRef.updatedAtMs;
}
function pluginIntegrityMatches(actual, expected) {
	if (!actual) return false;
	const normalizedActual = normalizeClawHubSha256Integrity(actual);
	const normalizedExpected = normalizeClawHubSha256Integrity(expected);
	return normalizedActual && normalizedExpected ? normalizedActual === normalizedExpected : actual === expected;
}
async function inspectClawPackage(install, packageRef, deps = {}) {
	if (packageRef.status !== "complete") return {
		...packageRef,
		state: "incomplete",
		message: "Package installation is incomplete."
	};
	if (packageRef.kind === "plugin") {
		const resolution = await (deps.resolvePlugin ?? resolveInstalledClawHubPlugin)({ clawhubPackage: packageRef.ref });
		if (resolution.status !== "found") return {
			...packageRef,
			state: resolution.status,
			message: resolution.status === "ambiguous" ? "Installed plugin identity is ambiguous." : "Installed plugin is missing."
		};
		if (resolution.installedVersion !== packageRef.version || !pluginIntegrityMatches(resolution.record.integrity, packageRef.integrity)) return {
			...packageRef,
			state: "modified",
			message: "Installed plugin version changed after the Claw was added."
		};
		return {
			...packageRef,
			independentOwner: packageRef.independentOwner || ownerInstallIsNewer(resolution.record.installedAt, packageRef),
			state: "present"
		};
	}
	if (!install.workspace) return {
		...packageRef,
		state: "ambiguous",
		message: "Skill workspace provenance is missing."
	};
	const skill = await (deps.planSkill ?? planClawHubSkillUninstall)({
		workspaceDir: install.workspace,
		slug: packageRef.ref,
		expectedVersion: packageRef.version
	});
	return skill.ok ? {
		...packageRef,
		independentOwner: packageRef.independentOwner || ownerInstallIsNewer(skill.plan.installedAt, packageRef),
		state: "present"
	} : {
		...packageRef,
		state: skill.code,
		message: skill.error
	};
}
async function planClawPackageRemovals(install, packages, options = {}) {
	const deps = options.deps ?? {};
	const cleanup = options.referencedCleanup ?? { mode: "retain" };
	const selected = new Set(cleanup.selected ?? []);
	const allRefs = (deps.readPackageRefs ?? readClawPackageRefs)(options);
	let cachedInstalls;
	const allInstalls = () => cachedInstalls ??= (deps.readInstallRecords ?? readClawInstallRecords)(options);
	const decisions = [];
	for (const packageRef of packages) {
		const affectedClawAgentIds = otherClawAgentIds({
			packageRef,
			workspace: install.workspace,
			refs: allRefs,
			installs: packageRef.kind === "plugin" || !install.workspace ? [] : allInstalls(),
			statuses: /* @__PURE__ */ new Set(["pending", "complete"])
		});
		const retain = (reason) => {
			decisions.push({
				packageRef,
				workspace: install.workspace,
				action: "retain",
				reason,
				affectedClawAgentIds
			});
		};
		if (packageRef.status !== "complete") {
			retain("Package installation is incomplete.");
			continue;
		}
		const selector = clawPackageRemovalSelector(packageRef);
		const explicitlySelected = cleanup.mode === "remove-selected" && selected.has(selector);
		const managedCleanup = packageRef.relationship === "managed";
		if (explicitlySelected && managedCleanup) {
			decisions.push({
				packageRef,
				workspace: install.workspace,
				action: "retain",
				blocked: true,
				reason: "--remove-referenced only accepts resources with a referenced relationship.",
				affectedClawAgentIds
			});
			continue;
		}
		if (!managedCleanup && !explicitlySelected && cleanup.mode !== "remove-if-unused") {
			retain(packageRef.origin === "claw-introduced" ? "Claw add introduced this shared requirement; removal releases its dependency edge and retains the artifact. Use its canonical owner separately to uninstall it." : "Referenced resources are retained unless a separate cleanup mode selects them.");
			continue;
		}
		if (!explicitlySelected && affectedClawAgentIds.length > 0) {
			retain("Another Claw still references this package.");
			continue;
		}
		if (!explicitlySelected && (packageRef.independentOwner || packageRef.origin === "pre-existing")) {
			retain("Package has a current non-Claw owner or pre-existing origin.");
			continue;
		}
		let pluginId;
		let ownerIsNewer;
		let skillPlan;
		if (packageRef.kind === "plugin") {
			const resolution = await (deps.resolvePlugin ?? resolveInstalledClawHubPlugin)({ clawhubPackage: packageRef.ref });
			if (resolution.status !== "found") {
				retain(resolution.status === "ambiguous" ? "Installed plugin identity is ambiguous." : "Installed plugin is missing.");
				continue;
			}
			if (resolution.installedVersion !== packageRef.version || !pluginIntegrityMatches(resolution.record.integrity, packageRef.integrity)) {
				retain("Installed plugin changed after the Claw was added.");
				continue;
			}
			pluginId = resolution.pluginId;
			ownerIsNewer = ownerInstallIsNewer(resolution.record.installedAt, packageRef);
		} else {
			if (!install.workspace) {
				retain("Skill workspace provenance is missing.");
				continue;
			}
			const skill = await (deps.planSkill ?? planClawHubSkillUninstall)({
				workspaceDir: install.workspace,
				slug: packageRef.ref,
				expectedVersion: packageRef.version
			});
			if (!skill.ok) {
				retain(skill.error);
				continue;
			}
			skillPlan = skill.plan;
			ownerIsNewer = ownerInstallIsNewer(skill.plan.installedAt, packageRef);
		}
		const independentlyOwned = packageRef.independentOwner || ownerIsNewer;
		const hasConflicts = affectedClawAgentIds.length > 0 || independentlyOwned || packageRef.origin === "pre-existing";
		if (!explicitlySelected && hasConflicts) {
			retain(affectedClawAgentIds.length > 0 ? "Another Claw still references this package." : "Package has a current non-Claw owner or pre-existing origin.");
			continue;
		}
		if (!explicitlySelected && packageRef.origin !== "claw-introduced") {
			retain("Only Claw-introduced referenced resources qualify for remove-if-unused.");
			continue;
		}
		if (explicitlySelected && hasConflicts && !cleanup.allowConflicts) {
			decisions.push({
				packageRef,
				workspace: install.workspace,
				action: "retain",
				blocked: true,
				reason: "Selected resource has other Claw dependents, a non-Claw owner, or pre-existing origin; explicit conflict override is required.",
				affectedClawAgentIds,
				...pluginId ? { pluginId } : {},
				...skillPlan ? { skillPlan } : {}
			});
			continue;
		}
		decisions.push({
			packageRef,
			workspace: install.workspace,
			action: "uninstall",
			...explicitlySelected && cleanup.allowConflicts ? { allowConflicts: true } : {},
			affectedClawAgentIds,
			...pluginId ? { pluginId } : {},
			...skillPlan ? { skillPlan } : {}
		});
	}
	return decisions;
}
async function applyClawPackageRemovals(decisions, options = {}) {
	if (!decisions.some((decision) => decision.packageRef.kind === "plugin")) return await applyClawPackageRemovalsUnlocked(decisions, options);
	return await withPluginLifecycleLease({
		...options.env ? { env: options.env } : {},
		...options.path ? { path: options.path } : {},
		...options.database ? { database: options.database } : {}
	}, async () => await applyClawPackageRemovalsUnlocked(decisions, options));
}
async function applyClawPackageRemovalsUnlocked(decisions, options) {
	const deps = options.deps ?? {};
	const results = [];
	for (const decision of decisions) {
		const base = {
			kind: decision.packageRef.kind,
			ref: decision.packageRef.ref,
			version: decision.packageRef.version
		};
		let packageLease = null;
		let claimed = false;
		let externalMutationStarted = false;
		try {
			const leaseArtifact = decision.packageRef.kind === "skill" ? {
				kind: decision.packageRef.kind,
				source: decision.packageRef.source,
				ref: decision.packageRef.ref,
				workspace: decision.workspace
			} : {
				kind: decision.packageRef.kind,
				source: decision.packageRef.source,
				ref: decision.packageRef.ref
			};
			const acquiredLease = (deps.acquirePackageLease ?? acquireClawPackageLifecycleLease)(leaseArtifact, {
				env: options.env,
				path: options.path,
				required: true
			});
			if (!acquiredLease) throw new Error(`Could not acquire package lifecycle lease for ${decision.packageRef.ref}.`);
			packageLease = maintainClawPackageLifecycleLease(acquiredLease);
			const currentRefs = (deps.readPackageRefs ?? readClawPackageRefs)(options);
			const currentInstalls = decision.packageRef.kind === "plugin" ? [] : (deps.readInstallRecords ?? readClawInstallRecords)(options);
			const currentRef = currentRefs.find((candidate) => candidate.agentId === decision.packageRef.agentId && sameVersionedArtifact(candidate, decision.packageRef));
			if (decision.blocked) throw new Error(decision.reason ?? "Package cleanup is blocked.");
			if (decision.action === "retain") {
				if (!currentRef || !sameRecordedState(currentRef, decision.packageRef)) throw new Error(`Package ${decision.packageRef.ref}@${decision.packageRef.version} ownership changed after removal planning.`);
				if (currentRef.status === "complete") {
					(deps.claimPackageRef ?? updateClawPackageRefStatus)(currentRef, "pending", options);
					claimed = true;
				}
				if (decision.reason === "Another Claw still references this package.") {
					const postClaimRefs = (deps.readPackageRefs ?? readClawPackageRefs)(options);
					const postClaimInstalls = decision.packageRef.kind === "plugin" ? [] : (deps.readInstallRecords ?? readClawInstallRecords)(options);
					if (!hasAnotherClawOwner({
						packageRef: decision.packageRef,
						workspace: decision.workspace,
						refs: postClaimRefs,
						installs: postClaimInstalls,
						statuses: /* @__PURE__ */ new Set(["complete"])
					})) throw new Error(`Package ${decision.packageRef.ref}@${decision.packageRef.version} no longer has another surviving Claw owner.`);
				}
				results.push({
					...base,
					action: "retained",
					reason: decision.reason
				});
				continue;
			}
			const sharedPackage = hasAnotherClawOwner({
				packageRef: decision.packageRef,
				workspace: decision.workspace,
				refs: currentRefs,
				installs: currentInstalls,
				statuses: /* @__PURE__ */ new Set(["complete"])
			});
			if (!currentRef || currentRef.status !== "complete" || !sameRecordedState(currentRef, decision.packageRef) || sharedPackage && !decision.allowConflicts) throw new Error(`Package ${decision.packageRef.ref}@${decision.packageRef.version} ownership changed after removal planning.`);
			(deps.claimPackageRef ?? updateClawPackageRefStatus)(currentRef, "pending", options);
			claimed = true;
			const postClaimRefs = (deps.readPackageRefs ?? readClawPackageRefs)(options);
			const postClaimInstalls = decision.packageRef.kind === "plugin" ? [] : (deps.readInstallRecords ?? readClawInstallRecords)(options);
			const postClaimRef = postClaimRefs.find((candidate) => candidate.agentId === decision.packageRef.agentId && sameVersionedArtifact(candidate, decision.packageRef));
			const postClaimShared = hasAnotherClawOwner({
				packageRef: decision.packageRef,
				workspace: decision.workspace,
				refs: postClaimRefs,
				installs: postClaimInstalls,
				statuses: /* @__PURE__ */ new Set(["complete"])
			});
			if (!postClaimRef || postClaimRef.status !== "pending" || postClaimRef.relationship !== decision.packageRef.relationship || postClaimRef.origin !== decision.packageRef.origin || postClaimRef.independentOwner !== decision.packageRef.independentOwner && !decision.packageRef.independentOwner || postClaimShared && !decision.allowConflicts) throw new Error(`Package ${decision.packageRef.ref}@${decision.packageRef.version} ownership changed while claiming removal.`);
			if (decision.packageRef.kind === "plugin") {
				if (!decision.pluginId) throw new Error("Plugin removal plan is missing canonical install identity.");
				const resolution = await (deps.resolvePlugin ?? resolveInstalledClawHubPlugin)({ clawhubPackage: decision.packageRef.ref });
				if (resolution.status !== "found" || resolution.pluginId !== decision.pluginId || resolution.installedVersion !== decision.packageRef.version || !pluginIntegrityMatches(resolution.record.integrity, decision.packageRef.integrity) || ownerInstallIsNewer(resolution.record.installedAt, decision.packageRef)) throw new Error(`Plugin ${decision.packageRef.ref}@${decision.packageRef.version} changed after removal planning.`);
				externalMutationStarted = true;
				await (deps.uninstallPlugin ?? runPluginUninstallCommand)(decision.pluginId, {
					force: true,
					invalidateRuntimeCache: false,
					clawManaged: true
				});
			} else {
				if (!decision.skillPlan) throw new Error("Skill removal plan is missing canonical uninstall state.");
				externalMutationStarted = true;
				const removed = await (deps.uninstallSkill ?? applyClawHubSkillUninstall)(decision.skillPlan);
				if (!removed.ok) throw new Error(removed.error);
			}
			packageLease.assertCurrent();
			(deps.claimPackageRef ?? updateClawPackageRefStatus)(decision.packageRef, "complete", options);
			results.push({
				...base,
				action: "uninstalled"
			});
		} catch (error) {
			if (claimed) try {
				(deps.claimPackageRef ?? updateClawPackageRefStatus)(decision.packageRef, externalMutationStarted ? "failed" : "complete", options);
			} catch {}
			results.push({
				...base,
				action: "error",
				reason: coerceErrorMessage(error)
			});
		} finally {
			try {
				packageLease?.release();
			} catch {}
		}
	}
	return results;
}
//#endregion
//#region src/claws/workspace.ts
const CLAW_WORKSPACE_FILE_RECORD_SCHEMA_VERSION = "openclaw.clawWorkspaceFileRecord.v1";
const MAX_CLAW_WORKSPACE_FILE_BYTES = 1024 * 1024;
var ClawWorkspaceWriteError = class extends Error {
	constructor(diagnostics, createdFiles) {
		super("Claw workspace file creation failed");
		this.diagnostics = diagnostics;
		this.createdFiles = createdFiles;
		this.name = "ClawWorkspaceWriteError";
	}
};
var ClawWorkspaceSourceAliasError = class extends Error {};
function rowToWorkspaceFile(row) {
	return {
		schemaVersion: CLAW_WORKSPACE_FILE_RECORD_SCHEMA_VERSION,
		agentId: row.agent_id,
		workspace: row.workspace,
		path: row.target_path,
		sourcePath: row.source_path,
		contentDigest: row.content_digest,
		status: row.status,
		createdAtMs: Number(row.created_at_ms),
		updatedAtMs: Number(row.updated_at_ms)
	};
}
function diagnostic(action, code, message) {
	return {
		level: "error",
		code,
		phase: "mutation",
		path: `$.workspace[${JSON.stringify(action.id)}]`,
		message
	};
}
function contentDigest(content) {
	return `sha256:${createHash("sha256").update(content).digest("hex")}`;
}
function containedRelativePath(root, path) {
	const child = relative(root, path);
	if (child === ".." || child.startsWith(`..${sep}`) || isAbsolute(child)) return;
	return child;
}
async function readClawWorkspaceActionSource(params) {
	if (!params.action.source) throw new Error("Workspace file action lacks a source.");
	const sourcePath = resolve(params.action.source);
	const sourceRelative = containedRelativePath(params.packageRoot, sourcePath);
	if (!sourceRelative) throw new Error("Workspace file source must remain inside the Claw package.");
	const read = await params.sourceRoot.read(sourceRelative, {
		hardlinks: "reject",
		maxBytes: MAX_CLAW_WORKSPACE_FILE_BYTES,
		symlinks: "reject"
	});
	if (resolve(read.realPath) !== sourcePath) throw new ClawWorkspaceSourceAliasError("Workspace source no longer resolves to the consented file.");
	if (params.action.sourceKind !== "clawMarkdownBody") return {
		content: read.buffer,
		sourcePath,
		sourceRelative
	};
	const parsed = parseClawMarkdown(read.buffer, sourcePath);
	if (!parsed.ok) throw new Error(parsed.diagnostics.map((item) => item.message).join("; "));
	return {
		content: parsed.body,
		sourcePath,
		sourceRelative
	};
}
function persistWorkspaceFile(record, options) {
	runOpenClawStateWriteTransaction(({ db }) => {
		db.prepare(`INSERT INTO claw_workspace_files (
         agent_id, target_path, schema_version, workspace, source_path,
         content_digest, status, created_at_ms, updated_at_ms
       ) VALUES (
         @agent_id, @target_path, @schema_version, @workspace, @source_path,
         @content_digest, @status, @created_at_ms, @updated_at_ms
       )`).run({
			agent_id: record.agentId,
			target_path: record.path,
			schema_version: record.schemaVersion,
			workspace: record.workspace,
			source_path: record.sourcePath,
			content_digest: record.contentDigest,
			status: record.status,
			created_at_ms: record.createdAtMs,
			updated_at_ms: record.updatedAtMs
		});
	}, options);
}
function readWorkspaceFile(agentId, targetPath, options) {
	return runOpenClawStateWriteTransaction(({ db }) => {
		const row = db.prepare(`SELECT schema_version, agent_id, workspace, target_path, source_path,
              content_digest, status, created_at_ms, updated_at_ms
         FROM claw_workspace_files
        WHERE agent_id = ? AND target_path = ?`).get(agentId, targetPath);
		if (!row) return;
		if (row.schema_version !== "openclaw.clawWorkspaceFileRecord.v1" || row.status !== "pending" && row.status !== "complete" && row.status !== "failed") throw new Error(`Claw workspace file ${JSON.stringify(targetPath)} has unsupported provenance state.`);
		return {
			schemaVersion: CLAW_WORKSPACE_FILE_RECORD_SCHEMA_VERSION,
			agentId: row.agent_id,
			workspace: row.workspace,
			path: row.target_path,
			sourcePath: row.source_path,
			contentDigest: row.content_digest,
			status: row.status,
			createdAtMs: Number(row.created_at_ms),
			updatedAtMs: Number(row.updated_at_ms)
		};
	}, options);
}
function sameWorkspaceFileOwner(existing, expected) {
	return existing.schemaVersion === expected.schemaVersion && existing.agentId === expected.agentId && existing.workspace === expected.workspace && existing.path === expected.path && existing.sourcePath === expected.sourcePath && existing.contentDigest === expected.contentDigest;
}
function updateWorkspaceFileStatus(record, expectedStatuses, options) {
	runOpenClawStateWriteTransaction(({ db }) => {
		const expectedPlaceholders = expectedStatuses.map(() => "?").join(", ");
		const result = db.prepare(`UPDATE claw_workspace_files
          SET status = ?, updated_at_ms = ?
        WHERE agent_id = ? AND target_path = ?
          AND status IN (${expectedPlaceholders})`).run(record.status, record.updatedAtMs, record.agentId, record.path, ...expectedStatuses);
		if (Number(result.changes) !== 1) throw new Error(`Claw workspace file ${JSON.stringify(record.path)} changed ownership state concurrently.`);
	}, options);
}
function upsertClawWorkspaceFile(record, options = {}) {
	runOpenClawStateWriteTransaction(({ db }) => {
		db.prepare(`INSERT INTO claw_workspace_files (
         agent_id, target_path, schema_version, workspace, source_path,
         content_digest, status, created_at_ms, updated_at_ms
       ) VALUES (
         @agent_id, @target_path, @schema_version, @workspace, @source_path,
         @content_digest, @status, @created_at_ms, @updated_at_ms
       )
       ON CONFLICT(agent_id, target_path) DO UPDATE SET
         schema_version = excluded.schema_version,
         workspace = excluded.workspace,
         source_path = excluded.source_path,
         content_digest = excluded.content_digest,
         status = excluded.status,
         created_at_ms = excluded.created_at_ms,
         updated_at_ms = excluded.updated_at_ms`).run({
			agent_id: record.agentId,
			target_path: record.path,
			schema_version: record.schemaVersion,
			workspace: record.workspace,
			source_path: record.sourcePath,
			content_digest: record.contentDigest,
			status: record.status,
			created_at_ms: record.createdAtMs,
			updated_at_ms: record.updatedAtMs
		});
	}, options);
}
function deleteClawWorkspaceFileRecord(agentId, path, options = {}) {
	runOpenClawStateWriteTransaction(({ db }) => {
		db.prepare("DELETE FROM claw_workspace_files WHERE agent_id = ? AND target_path = ?").run(agentId, path);
	}, options);
}
function workspaceFileActions(plan) {
	return plan.actions.filter((action) => action.kind === "workspaceFile");
}
function readClawWorkspaceFiles(agentId, options = {}) {
	const database = openOpenClawStateDatabase(options);
	if (options.readOnly && !database.db.prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'claw_workspace_files'").get()) return [];
	return database.db.prepare(`SELECT schema_version, agent_id, workspace, target_path, source_path,
              content_digest, status, created_at_ms, updated_at_ms
         FROM claw_workspace_files
        WHERE agent_id = ?
        ORDER BY target_path`).all(agentId).map(rowToWorkspaceFile);
}
async function createClawWorkspaceFiles(plan, options = {}) {
	const actions = workspaceFileActions(plan);
	if (actions.length === 0) return [];
	const workspaceRoot = await realpath(resolve(plan.agent.workspace));
	const packageRoot = await realpath(resolve(plan.claw.packageRoot));
	const source = await root(packageRoot, {
		hardlinks: "reject",
		maxBytes: MAX_CLAW_WORKSPACE_FILE_BYTES,
		symlinks: "reject"
	});
	const workspace = await root(workspaceRoot, {
		hardlinks: "reject",
		maxBytes: MAX_CLAW_WORKSPACE_FILE_BYTES,
		symlinks: "reject"
	});
	const createdFiles = [];
	const nowMs = options.nowMs ?? Date.now();
	for (const action of actions) try {
		if (!action.source || !action.digest) throw new ClawWorkspaceWriteError([diagnostic(action, "workspace_file_plan_invalid", "File action lacks source or digest.")], createdFiles);
		const targetRelative = containedRelativePath(workspaceRoot, resolve(action.target));
		if (!targetRelative) throw new ClawWorkspaceWriteError([diagnostic(action, "workspace_file_path_escape", "Workspace file source and destination must remain inside their owned roots.")], createdFiles);
		const resolvedSource = await readClawWorkspaceActionSource({
			action,
			packageRoot,
			sourceRoot: source
		});
		const digest = contentDigest(resolvedSource.content);
		if (digest !== action.digest) throw new ClawWorkspaceWriteError([diagnostic(action, "workspace_source_changed", `Workspace source for ${JSON.stringify(action.id)} changed after planning.`)], createdFiles);
		const expectedRecord = {
			schemaVersion: CLAW_WORKSPACE_FILE_RECORD_SCHEMA_VERSION,
			agentId: plan.agent.finalId,
			workspace: workspace.rootReal,
			path: targetRelative.replaceAll(sep, "/"),
			sourcePath: resolvedSource.sourceRelative.replaceAll(sep, "/"),
			contentDigest: digest,
			status: "pending",
			createdAtMs: nowMs,
			updatedAtMs: nowMs
		};
		const existingRecord = readWorkspaceFile(expectedRecord.agentId, expectedRecord.path, options);
		if (existingRecord && !sameWorkspaceFileOwner(existingRecord, expectedRecord)) throw new ClawWorkspaceWriteError([diagnostic(action, "workspace_file_ownership_conflict", `Workspace destination ${JSON.stringify(targetRelative)} is already claimed by different Claw provenance.`)], createdFiles);
		if (await workspace.exists(targetRelative)) {
			if (!existingRecord || existingRecord.status === "failed") throw new ClawWorkspaceWriteError([diagnostic(action, "workspace_file_collision", `Workspace destination ${JSON.stringify(targetRelative)} already exists.`)], createdFiles);
			if (contentDigest((await workspace.read(targetRelative, {
				hardlinks: "reject",
				maxBytes: MAX_CLAW_WORKSPACE_FILE_BYTES,
				symlinks: "reject"
			})).buffer) !== expectedRecord.contentDigest) throw new ClawWorkspaceWriteError([diagnostic(action, "workspace_file_drift", `Claw-owned workspace destination ${JSON.stringify(targetRelative)} no longer matches its recorded content.`)], createdFiles);
			const previousStatus = existingRecord.status;
			existingRecord.status = "complete";
			existingRecord.updatedAtMs = nowMs;
			updateWorkspaceFileStatus(existingRecord, [previousStatus], options);
			createdFiles.push(existingRecord);
			continue;
		}
		const record = existingRecord ?? expectedRecord;
		if (existingRecord) {
			const previousStatus = record.status;
			record.status = "pending";
			record.updatedAtMs = nowMs;
			updateWorkspaceFileStatus(record, [previousStatus], options);
		} else persistWorkspaceFile(record, options);
		try {
			await workspace.write(targetRelative, resolvedSource.content, {
				mkdir: true,
				overwrite: false
			});
			record.status = "complete";
			updateWorkspaceFileStatus(record, ["pending"], options);
			createdFiles.push(record);
		} catch (error) {
			record.status = "failed";
			try {
				updateWorkspaceFileStatus(record, ["pending"], options);
			} catch {
				record.status = "pending";
			}
			createdFiles.push(record);
			throw error;
		}
	} catch (error) {
		if (error instanceof ClawWorkspaceWriteError) throw error;
		throw new ClawWorkspaceWriteError([diagnostic(action, error instanceof ClawWorkspaceSourceAliasError ? "workspace_file_path_alias" : error instanceof FsSafeError ? `workspace_file_${error.code}` : "workspace_file_io_error", coerceErrorMessage(error))], createdFiles);
	}
	return createdFiles;
}
//#endregion
//#region src/claws/lifecycle-status.ts
const CLAW_STATUS_SCHEMA_VERSION = "openclaw.clawStatus.v1";
async function inspectClawPackageCompatibility(params) {
	const inspected = await inspectClawPackage(params.install, params.packageRef, params.packageDeps);
	if (!params.packageRef.extension || inspected.state !== "present") return inspected;
	let current;
	if (params.packagePreflight) {
		const preflight = await params.packagePreflight(params.packageRef, params.install.workspace);
		if (!preflight.ok) {
			inspected.extensionCompatibility = {
				state: "unavailable",
				mapped: [],
				unavailable: [],
				message: preflight.message ?? "Canonical extension inspection is unavailable."
			};
			return inspected;
		}
		current = {
			detectedFormat: preflight.detectedFormat,
			mapped: preflight.mapped ?? [],
			unavailable: preflight.unavailable ?? [],
			adapterIdentity: preflight.adapterIdentity
		};
	} else {
		const recorded = params.packageRef.extension;
		const artifact = recorded.detectedFormat === "openclaw" ? inspectNativePluginArtifact() : inspectBundlePluginArtifact({
			format: recorded.detectedFormat,
			capabilities: [...recorded.mapped, ...recorded.unavailable]
		});
		current = {
			detectedFormat: recorded.detectedFormat,
			mapped: artifact.mapped,
			unavailable: artifact.unavailable,
			adapterIdentity: PLUGIN_ARTIFACT_ADAPTER_IDENTITY
		};
	}
	const recorded = {
		detectedFormat: params.packageRef.extension.detectedFormat,
		mapped: params.packageRef.extension.mapped,
		unavailable: params.packageRef.extension.unavailable,
		adapterIdentity: params.packageRef.extension.adapterIdentity
	};
	inspected.extensionCompatibility = {
		state: stableStringify(current) === stableStringify(recorded) ? "compatible" : "drifted",
		detectedFormat: current.detectedFormat,
		mapped: current.mapped,
		unavailable: current.unavailable,
		adapterIdentity: current.adapterIdentity
	};
	return inspected;
}
function inspectMcpServer(ref, configuredServers) {
	if (ref.status === "pending" || ref.status === "failed") return {
		...ref,
		state: ref.status
	};
	const server = configuredServers[ref.name];
	if (!server) return {
		...ref,
		state: "missing"
	};
	return {
		...ref,
		state: digestClawMcpServer(server) === ref.configDigest ? "present" : "modified"
	};
}
async function readClawStatus(target, options = {}) {
	const config = options.config ?? getRuntimeConfig();
	const listedMcp = options.sourceMcpServers ? void 0 : options.listMcpServers ? await options.listMcpServers() : options.config ? void 0 : await listConfiguredMcpServers();
	if (listedMcp && !listedMcp.ok) throw new ClawRemoveError("mcp_config_unavailable", listedMcp.error);
	const sourceConfig = listedMcp?.ok ? listedMcp.config : config;
	const configuredMcpServers = normalizeConfiguredMcpServers(options.sourceMcpServers ?? sourceConfig.mcp?.servers);
	const allInstalls = readClawInstallRecords(options);
	const installAgentIds = new Set(allInstalls.map((install) => install.agentId));
	const allPackageRefs = readClawPackageRefs(options);
	const allWorkspaceFiles = readAllClawWorkspaceFiles(options);
	const orphanAgentIds = /* @__PURE__ */ new Set();
	for (const packageRef of allPackageRefs) if (!installAgentIds.has(packageRef.agentId)) orphanAgentIds.add(packageRef.agentId);
	for (const file of allWorkspaceFiles) if (!installAgentIds.has(file.agentId)) orphanAgentIds.add(file.agentId);
	const orphanInstalls = [...orphanAgentIds].map((agentId) => {
		const packageRef = allPackageRefs.find((candidate) => candidate.agentId === agentId);
		const file = allWorkspaceFiles.find((candidate) => candidate.agentId === agentId);
		return synthesizeOrphanInstall({
			agentId,
			clawName: packageRef?.clawName,
			workspace: file?.workspace,
			updatedAtMs: Math.max(packageRef?.updatedAtMs ?? 0, file?.updatedAtMs ?? 0)
		});
	});
	const installs = [...allInstalls, ...orphanInstalls].filter((install) => !target || install.agentId === target || install.claw.name === target);
	const records = [];
	const packagePreflight = options.packagePreflight;
	for (const install of installs) {
		const agent = listAgentEntries(config).find((candidate) => candidate.id === install.agentId);
		const packageRefs = allPackageRefs.filter((packageRef) => packageRef.agentId === install.agentId);
		const workspaceFiles = installAgentIds.has(install.agentId) ? readClawWorkspaceFiles(install.agentId, options) : allWorkspaceFiles.filter((file) => file.agentId === install.agentId);
		const bootstrap = installAgentIds.has(install.agentId) ? await inspectClawBootstrap(install, options) : {
			state: "unknown",
			workspace: install.workspace,
			path: "BOOTSTRAP.md"
		};
		records.push({
			install,
			...installAgentIds.has(install.agentId) ? {} : { orphaned: true },
			agentState: !agent ? "missing" : digestClawAgentConfig(agent) === install.agentConfigDigest ? "present" : "modified",
			bootstrapState: bootstrap.state,
			bootstrap,
			workspaceFiles: await Promise.all(workspaceFiles.map(inspectClawWorkspaceFile)),
			packages: await Promise.all(packageRefs.map(async (packageRef) => await inspectClawPackageCompatibility({
				install,
				packageRef,
				packageDeps: options.packageDeps,
				packagePreflight
			}))),
			mcpServers: (options.readOnly ? readClawMcpServerRefs(install.agentId, options) : reconcileClawMcpServerRefs(install.agentId, configuredMcpServers, options)).map((ref) => inspectMcpServer(ref, configuredMcpServers)),
			cronJobs: readClawCronRefs(install.agentId, options)
		});
	}
	return {
		schemaVersion: CLAW_STATUS_SCHEMA_VERSION,
		stability: CLAW_OUTPUT_STABILITY,
		...target ? { target } : {},
		records,
		summary: {
			claws: records.length,
			partial: records.filter((record) => record.install.status !== "complete").length,
			pendingBootstrap: records.filter((record) => record.bootstrapState === "pending").length,
			missingAgents: records.filter((record) => record.agentState === "missing").length,
			driftedFiles: records.flatMap((record) => record.workspaceFiles).filter((file) => file.state !== "unchanged").length,
			packageRefs: records.flatMap((record) => record.packages).length,
			missingPackages: records.flatMap((record) => record.packages).filter((pkg) => pkg.state === "missing").length,
			driftedPackages: records.flatMap((record) => record.packages).filter((pkg) => pkg.state === "modified" || pkg.state === "ambiguous" || pkg.extensionCompatibility?.state === "drifted").length,
			unavailableExtensions: records.flatMap((record) => record.packages).filter((pkg) => pkg.extensionCompatibility?.state === "unavailable").length,
			incompletePackages: records.flatMap((record) => record.packages).filter((pkg) => pkg.state === "incomplete").length,
			mcpServerRefs: records.flatMap((record) => record.mcpServers).length,
			driftedMcpServers: records.flatMap((record) => record.mcpServers).filter((server) => server.state === "modified" || server.state === "missing").length,
			unresolvedMcpServerRefs: records.flatMap((record) => record.mcpServers).filter((server) => server.state === "pending" || server.state === "failed").length,
			cronRefs: records.flatMap((record) => record.cronJobs).length,
			unresolvedCronRefs: records.flatMap((record) => record.cronJobs).filter((cron) => cron.status !== "complete" || !cron.schedulerJobId).length
		}
	};
}
//#endregion
//#region src/claws/package-remove-plan.ts
function projectClawPackageRemovePlan(params) {
	const selected = new Set(params.cleanup?.selected ?? []);
	const blockers = [];
	const actions = params.decisions.map((decision) => {
		const pkg = decision.packageRef;
		const selector = clawPackageRemovalSelector(pkg);
		selected.delete(selector);
		if (decision.blocked) blockers.push({
			code: "referenced_cleanup_requires_override",
			message: `${selector}: ${decision.reason ?? "explicit conflict override is required"}`
		});
		const inspected = params.inspections.find((candidate) => candidate.kind === pkg.kind && candidate.source === pkg.source && candidate.ref === pkg.ref && candidate.version === pkg.version);
		return {
			kind: "packageRef",
			id: selector,
			action: decision.action === "uninstall" ? "uninstall" : "release",
			target: `${pkg.source}:${pkg.ref}@${pkg.version}`,
			blocked: Boolean(decision.blocked),
			details: {
				expectedState: inspected?.state ?? "incomplete",
				status: pkg.status,
				relationship: pkg.relationship,
				origin: pkg.origin,
				introducedByClawAdd: pkg.origin === "claw-introduced",
				independentOwner: pkg.independentOwner,
				affectedClawAgentIds: decision.affectedClawAgentIds,
				cleanupMode: params.cleanup?.mode ?? "retain",
				availableCleanupModes: pkg.relationship === "referenced" ? [
					"retain",
					"remove-if-unused",
					"remove-selected"
				] : ["remove"]
			},
			...decision.reason ? { reason: decision.reason } : {}
		};
	});
	for (const selector of selected) blockers.push({
		code: "referenced_cleanup_not_found",
		message: `Selected referenced resource ${JSON.stringify(selector)} is not owned by this Claw.`
	});
	return {
		actions,
		blockers
	};
}
//#endregion
//#region src/claws/lifecycle-state.ts
const CLAW_REMOVE_RESULT_SCHEMA_VERSION = "openclaw.clawRemoveResult.v1";
async function buildClawRemovePlan(target, options = {}) {
	const status = await readClawStatus(target, options);
	const blockers = [];
	if (status.records.length === 0) blockers.push({
		code: "claw_not_found",
		message: `No installed Claw matches ${JSON.stringify(target)}.`
	});
	else if (status.records.length > 1) blockers.push({
		code: "claw_ambiguous",
		message: `Claw name ${JSON.stringify(target)} matches multiple agents; use an agent id.`
	});
	const record = status.records.length === 1 ? status.records[0] : void 0;
	if (record?.agentState === "modified") blockers.push({
		code: "agent_modified",
		message: `Agent ${JSON.stringify(record.install.agentId)} changed after add.`
	});
	for (const file of record?.workspaceFiles ?? []) if (file.state === "unsafe") blockers.push({
		code: "workspace_file_unsafe",
		message: `${file.path}: ${file.message ?? "unsafe file"}`
	});
	if (record && clawBootstrapStateBlocksRemove(record)) blockers.push({
		code: "bootstrap_cleanup_uncertain",
		message: `BOOTSTRAP.md has ${record.bootstrap.state} ownership state and must be reconciled before removal.`
	});
	for (const server of record?.mcpServers ?? []) if (server.state === "pending") blockers.push({
		code: "mcp_cleanup_uncertain",
		message: `MCP server ${JSON.stringify(server.name)} has ${server.state} ownership state and must be reconciled before removal.`
	});
	for (const cron of record?.cronJobs ?? []) if (cron.status !== "removed" && (cron.status !== "complete" || !cron.schedulerJobId)) blockers.push({
		code: "cron_cleanup_uncertain",
		message: `Cron declaration ${JSON.stringify(cron.manifestId)} has ${cron.status} ownership state and must be reconciled before removal.`
	});
	const actions = [];
	if (record) {
		const selectedResources = options.referencedCleanup?.selected ?? [];
		const packageCleanup = options.referencedCleanup ? {
			...options.referencedCleanup,
			selected: selectedResources.filter((selector) => !selector.startsWith("mcp:"))
		} : void 0;
		const mcpCleanup = options.referencedCleanup ? {
			...options.referencedCleanup,
			selected: selectedResources.filter((selector) => selector.startsWith("mcp:"))
		} : void 0;
		const packagePlan = projectClawPackageRemovePlan({
			decisions: await planClawPackageRemovals(record.install, record.packages, {
				...options,
				deps: options.packageDeps,
				referencedCleanup: packageCleanup
			}),
			inspections: record.packages,
			cleanup: packageCleanup
		});
		blockers.push(...packagePlan.blockers);
		const effects = deletionEffects(options.config ?? getRuntimeConfig(), record.install.agentId, record.install.workspace);
		const workspaceHasModifiedFiles = record.workspaceFiles.some((file) => file.state === "modified") || record.bootstrap.state === "modified";
		const trackedWorkspacePaths = [...record.workspaceFiles.map((file) => file.path), ...record.install.bootstrap && record.bootstrap.state === "pending" ? [record.bootstrap.path] : []];
		const workspaceHasUntrackedEntries = await workspaceContainsUntrackedEntries(record.install.workspace, trackedWorkspacePaths);
		const attachedJobs = readAttachedCronJobs(record.install.agentId, options);
		const ownedSchedulerJobIds = new Set(record.cronJobs.filter((cron) => cron.status !== "removed" && cron.schedulerJobId).map((cron) => cron.schedulerJobId));
		for (const job of attachedJobs.filter((candidate) => !ownedSchedulerJobIds.has(candidate.id))) blockers.push({
			code: "agent_job_attached",
			message: `Cron job ${JSON.stringify(job.id)} still references agent ${JSON.stringify(record.install.agentId)}; reassign or remove it first.`
		});
		actions.push({
			kind: "agent",
			id: record.install.agentId,
			action: "remove",
			target: `agents.entries[${JSON.stringify(record.install.agentId)}]`,
			blocked: record.agentState === "modified",
			details: {
				expectedState: record.agentState,
				configDigest: record.install.agentConfigDigest,
				removalSurfaceDigest: digestClawAgentRemovalSurface(options.config ?? getRuntimeConfig(), record.install.agentId),
				ownedPaths: record.install.agentOwnedPaths
			},
			...record.agentState === "modified" ? { reason: "Agent config digest changed." } : {}
		});
		if (effects.pruned.removedBindings > 0) actions.push({
			kind: "configBinding",
			id: record.install.agentId,
			action: "remove",
			target: `bindings[agentId=${record.install.agentId}]`,
			blocked: record.agentState === "modified",
			details: { count: effects.pruned.removedBindings }
		});
		if (effects.pruned.removedAllow > 0) actions.push({
			kind: "agentAllow",
			id: record.install.agentId,
			action: "remove",
			target: `tools.agentToAgent.allow[${record.install.agentId}]`,
			blocked: record.agentState === "modified",
			details: { count: effects.pruned.removedAllow }
		});
		if (effects.workspace) actions.push({
			kind: "workspace",
			id: record.install.agentId,
			action: effects.workspaceRetained || workspaceHasModifiedFiles || workspaceHasUntrackedEntries ? "retain" : "trash",
			target: effects.workspace,
			blocked: record.agentState === "modified",
			details: {
				retained: effects.workspaceRetained || workspaceHasModifiedFiles || workspaceHasUntrackedEntries,
				sharedWith: effects.workspaceSharedWith
			},
			...effects.workspaceRetained ? { reason: "Workspace overlaps another agent." } : workspaceHasModifiedFiles ? { reason: "Workspace contains locally modified Claw-managed files." } : workspaceHasUntrackedEntries ? { reason: "Workspace contains files or directories not managed by this Claw." } : {}
		});
		if (effects.agentDir) actions.push({
			kind: "agentState",
			id: record.install.agentId,
			action: "trash",
			target: effects.agentDir,
			blocked: record.agentState === "modified"
		});
		actions.push({
			kind: "sessionIndex",
			id: record.install.agentId,
			action: "delete",
			target: `session store entries for agent:${record.install.agentId}`,
			blocked: record.agentState === "modified"
		});
		actions.push({
			kind: "sessionTranscripts",
			id: record.install.agentId,
			action: "trash",
			target: effects.sessionsDir,
			blocked: record.agentState === "modified"
		});
		for (const job of attachedJobs) actions.push({
			kind: "scheduledJob",
			id: job.id,
			action: "retain",
			target: `cron_jobs:${job.id}`,
			blocked: true,
			reason: "Operator-owned scheduled work must be reassigned or removed explicitly.",
			details: {
				name: job.name,
				enabled: job.enabled,
				agentId: job.agentId,
				ownerAgentId: job.ownerAgentId
			}
		});
		for (const file of record.workspaceFiles) actions.push({
			kind: "workspaceFile",
			id: file.path,
			action: file.state === "unchanged" ? "delete" : "retain",
			target: `${file.workspace}:${file.path}`,
			blocked: file.state === "unsafe",
			details: {
				expectedState: file.state,
				contentDigest: file.contentDigest,
				workspace: file.workspace
			},
			...file.state === "modified" ? { reason: "Local content changed; preserve the file." } : {}
		});
		const bootstrapAction = planClawBootstrapRemoval(record);
		if (bootstrapAction) actions.push(bootstrapAction);
		actions.push(...packagePlan.actions);
		const unmatchedMcpSelectors = new Set(mcpCleanup?.selected ?? []);
		for (const server of record.mcpServers) {
			const blocked = server.state === "pending";
			const decision = planClawMcpServerRemoval(server, {
				...options,
				referencedCleanup: mcpCleanup
			});
			unmatchedMcpSelectors.delete(clawMcpRemovalSelector(server));
			if (decision.blocked) blockers.push({
				code: "referenced_cleanup_requires_override",
				message: `${clawMcpRemovalSelector(server)}: ${decision.reason ?? "explicit conflict override is required"}`
			});
			actions.push({
				kind: "mcpServer",
				id: server.name,
				action: blocked ? "retain" : decision.action,
				target: `mcp.servers.${server.name}`,
				blocked,
				details: {
					expectedState: server.state,
					configDigest: server.configDigest,
					relationship: server.relationship,
					origin: server.origin,
					independentOwner: server.independentOwner,
					affectedClawAgentIds: decision.affectedClawAgentIds,
					cleanupMode: mcpCleanup?.mode ?? "retain",
					availableCleanupModes: server.relationship === "referenced" ? [
						"retain",
						"remove-if-unused",
						"remove-selected"
					] : ["remove"]
				},
				...blocked ? { reason: `MCP ownership state is ${server.state}.` } : decision.reason ? { reason: decision.reason } : {}
			});
		}
		for (const selector of unmatchedMcpSelectors) blockers.push({
			code: "referenced_cleanup_not_found",
			message: `Selected referenced resource ${JSON.stringify(selector)} is not owned by this Claw.`
		});
		for (const cron of record.cronJobs) {
			const blocked = cron.status !== "removed" && (cron.status !== "complete" || !cron.schedulerJobId);
			actions.push({
				kind: "cronJob",
				id: cron.manifestId,
				action: blocked ? "retain" : "remove",
				target: cron.schedulerJobId ?? cron.declarationKey,
				blocked,
				details: {
					expectedStatus: cron.status,
					declarationKey: cron.declarationKey,
					schedulerJobId: cron.schedulerJobId,
					job: cron.job
				},
				...blocked ? { reason: `Cron ownership state is ${cron.status}.` } : {}
			});
		}
		actions.push({
			kind: "installRecord",
			id: record.install.agentId,
			action: "remove",
			target: `claw_installs:${record.install.agentId}`,
			blocked: false,
			details: {
				expectedStatus: record.install.status,
				planIntegrity: record.install.planIntegrity,
				sourceIntegrity: record.install.claw.integrity
			}
		});
	}
	const planIdentity = {
		target,
		agentId: record?.install.agentId,
		actions,
		blockers
	};
	return {
		schemaVersion: CLAW_REMOVE_PLAN_SCHEMA_VERSION,
		stability: CLAW_OUTPUT_STABILITY,
		dryRun: true,
		mutationAllowed: false,
		planIntegrity: `sha256:${createHash("sha256").update(stableStringify(planIdentity)).digest("hex")}`,
		target,
		...record ? { agentId: record.install.agentId } : {},
		actions,
		blockers
	};
}
async function applyClawRemovePlan(plan, options = {}) {
	if (options.consentPlanIntegrity !== plan.planIntegrity) throw new ClawRemoveError("plan_integrity_mismatch", "Consent does not match the current Claw remove plan; run remove --dry-run again.");
	if (plan.blockers.length > 0 || !plan.agentId) throw new ClawRemoveError("remove_blocked", "The Claw remove plan contains blockers.");
	if ((await buildClawRemovePlan(plan.target, options)).planIntegrity !== plan.planIntegrity) throw new ClawRemoveError("remove_changed", "Claw-owned state changed after remove planning.");
	const agentId = plan.agentId;
	const expectedRemovalSurfaceDigest = plan.actions.find((action) => action.kind === "agent" && action.id === agentId)?.details?.removalSurfaceDigest;
	if (typeof expectedRemovalSurfaceDigest !== "string") throw new ClawRemoveError("remove_changed", "Claw remove plan is missing config state.");
	const record = (await readClawStatus(plan.agentId, options)).records[0];
	if (!record || record.agentState === "modified" || clawBootstrapStateBlocksRemove(record) || record.workspaceFiles.some((file) => file.state === "unsafe") || record.mcpServers.some((server) => server.state === "pending")) throw new ClawRemoveError("remove_changed", "Claw-owned state changed after remove planning.");
	const packageDecisions = await planClawPackageRemovals(record.install, record.packages, {
		...options,
		deps: options.packageDeps,
		referencedCleanup: options.referencedCleanup ? {
			...options.referencedCleanup,
			selected: (options.referencedCleanup.selected ?? []).filter((selector) => !selector.startsWith("mcp:"))
		} : void 0
	});
	const plannedPackages = plan.actions.filter((action) => action.kind === "packageRef").map((action) => `${action.id}:${action.action}`).toSorted();
	const currentPackages = packageDecisions.map((decision) => `${decision.packageRef.kind}:${decision.packageRef.ref}@${decision.packageRef.version}:${decision.action === "uninstall" ? "uninstall" : "release"}`).toSorted();
	if (JSON.stringify(plannedPackages) !== JSON.stringify(currentPackages)) throw new ClawRemoveError("remove_changed", "Package ownership changed after remove planning.");
	const plannedMcpServers = plan.actions.filter((action) => action.kind === "mcpServer").map((action) => `${action.id}:${action.action}`).toSorted();
	const currentMcpServers = record.mcpServers.map((server) => `${server.name}:${planClawMcpServerRemoval(server, options).action}`).toSorted();
	if (JSON.stringify(plannedMcpServers) !== JSON.stringify(currentMcpServers)) throw new ClawRemoveError("remove_changed", "MCP ownership changed after remove planning.");
	const mcpRemoval = await removeClawMcpServers({
		agentId: plan.agentId,
		servers: record.mcpServers,
		options
	});
	const mcpServers = mcpRemoval.mcpServers;
	if (mcpRemoval.error) {
		updateClawInstallRecordStatus(agentId, "partial", options);
		return {
			schemaVersion: CLAW_REMOVE_RESULT_SCHEMA_VERSION,
			stability: CLAW_OUTPUT_STABILITY,
			dryRun: false,
			status: "partial",
			agentId,
			agentRemoved: false,
			workspaceFiles: [],
			packages: [],
			mcpServers,
			cronJobs: [],
			packageRefsReleased: 0,
			error: {
				code: "mcp_cleanup_failed",
				message: mcpRemoval.error
			}
		};
	}
	const cronJobs = [];
	for (const cron of record.cronJobs) {
		if (cron.status !== "removed" && (!cron.schedulerJobId || cron.status !== "complete")) throw new ClawRemoveError("cron_cleanup_uncertain", `Cron declaration ${JSON.stringify(cron.manifestId)} is not safely removable.`);
		if (cron.status !== "removed" && (!options.cronGateway?.get || !options.cronGateway.remove)) throw new ClawRemoveError("cron_gateway_required", "Claw cron jobs require the gateway-owned cron.get and cron.remove APIs.");
		try {
			if (cron.status !== "removed") {
				const live = await options.cronGateway.get(cron.schedulerJobId);
				if (live != null && !clawCronGatewayJobMatchesRef(plan.agentId, cron, live)) throw new Error(`Cron declaration ${JSON.stringify(cron.manifestId)} changed after planning.`);
				if (live != null) try {
					await options.cronGateway.remove(cron.schedulerJobId);
				} catch (removeError) {
					if (await options.cronGateway.get(cron.schedulerJobId) != null) throw removeError;
				}
				markClawCronRefRemoved(plan.agentId, cron.manifestId, options);
			}
			deleteClawCronRef(plan.agentId, cron.manifestId, options);
			cronJobs.push({
				manifestId: cron.manifestId,
				schedulerJobId: cron.schedulerJobId,
				action: "removed"
			});
		} catch (error) {
			const message = coerceErrorMessage(error);
			cronJobs.push({
				manifestId: cron.manifestId,
				schedulerJobId: cron.schedulerJobId,
				action: "error",
				message
			});
			updateClawInstallRecordStatus(agentId, "partial", options);
			return {
				schemaVersion: CLAW_REMOVE_RESULT_SCHEMA_VERSION,
				stability: CLAW_OUTPUT_STABILITY,
				dryRun: false,
				status: "partial",
				agentId: plan.agentId,
				agentRemoved: false,
				workspaceFiles: [],
				packages: [],
				mcpServers,
				cronJobs,
				packageRefsReleased: 0,
				error: {
					code: "cron_cleanup_failed",
					message
				}
			};
		}
	}
	const { agentRemoved, cleanupTargets, configBeforeDelete, nextConfig: committedNextConfig } = await claimClawAgentConfigRemoval({
		agentId,
		expectedDigest: record.install.agentConfigDigest,
		expectedRemovalSurfaceDigest,
		expectedState: record.agentState,
		fallbackWorkspace: record.install.workspace,
		config: options.config,
		commitConfig: options.commitConfig,
		trashPath: options.trashPath,
		onModified: () => new ClawRemoveError("agent_modified", "Agent config changed during remove.")
	});
	if (!options.commitConfig || options.purgeSessions) await (options.purgeSessions ?? (await import("./cleanup-service-IdSvqBaG.js")).purgeAgentSessionStoreEntries)(configBeforeDelete, agentId);
	closeOpenClawAgentDatabaseByPath(resolveOpenClawAgentSqlitePath({
		agentId,
		env: options.env
	}));
	const packages = await applyClawPackageRemovals(packageDecisions.toSorted((left, right) => Number(left.packageRef.relationship === "referenced") - Number(right.packageRef.relationship === "referenced")), {
		...options,
		deps: options.packageDeps
	});
	const packageErrors = packages.filter((pkg) => pkg.action === "error");
	if (packageErrors.length > 0) {
		updateClawInstallRecordStatus(agentId, "partial", options);
		return {
			schemaVersion: CLAW_REMOVE_RESULT_SCHEMA_VERSION,
			stability: CLAW_OUTPUT_STABILITY,
			dryRun: false,
			status: "partial",
			agentId: plan.agentId,
			agentRemoved,
			workspaceFiles: [],
			packages,
			mcpServers,
			cronJobs,
			packageRefsReleased: 0,
			error: {
				code: "package_cleanup_failed",
				message: packageErrors.map((pkg) => pkg.reason).join("; ")
			}
		};
	}
	const workspaceFiles = [];
	for (const file of record.workspaceFiles) workspaceFiles.push(await removeClawWorkspaceFile(file));
	const bootstrap = await removeClawBootstrap(record);
	const cleanupErrors = workspaceFiles.filter((file) => file.action === "error").map((file) => file.message ?? `Could not remove ${file.path}.`);
	if (bootstrap?.action === "error") cleanupErrors.push(bootstrap.message ?? `Could not remove ${bootstrap.path}.`);
	if (cleanupErrors.length === 0 && cleanupTargets && committedNextConfig) {
		const workspaceHasRemainingEntries = await workspaceContainsUntrackedEntries(cleanupTargets.workspaceDir, record.workspaceFiles.map((file) => file.path));
		cleanupErrors.push(...await cleanupClawAgentFilesystem({
			agentId,
			nextConfig: committedNextConfig,
			targets: cleanupTargets,
			runtime: clawRemoveQuietRuntime,
			trashPath: options.trashPath,
			retainWorkspace: workspaceHasRemainingEntries || bootstrap?.action === "retainedModified" || workspaceFiles.some((file) => file.action === "retainedModified")
		}));
	}
	const complete = cleanupErrors.length === 0;
	if (!complete) updateClawInstallRecordStatus(agentId, "partial", options);
	releaseClawRemoveRows(plan.agentId, workspaceFiles, complete, options);
	return {
		schemaVersion: CLAW_REMOVE_RESULT_SCHEMA_VERSION,
		stability: CLAW_OUTPUT_STABILITY,
		dryRun: false,
		status: complete ? "complete" : "partial",
		agentId: plan.agentId,
		agentRemoved,
		...bootstrap ? { bootstrap } : {},
		workspaceFiles,
		packages,
		mcpServers,
		cronJobs,
		packageRefsReleased: complete ? record.packages.length : 0,
		...complete ? {} : { error: {
			code: "workspace_cleanup_failed",
			message: cleanupErrors.join("; ")
		} }
	};
}
//#endregion
export { readClawCronRefs as C, installClawCronJobs as S, ClawCronInstallError as _, CLAW_WORKSPACE_FILE_RECORD_SCHEMA_VERSION as a, clawCronSchedulerJobFromResult as b, deleteClawWorkspaceFileRecord as c, upsertClawWorkspaceFile as d, preflightPluginInstall as f, CLAW_CRON_REF_SCHEMA_VERSION as g, ClawRemoveError as h, readClawStatus as i, readClawWorkspaceActionSource as l, CLAW_REMOVE_PLAN_SCHEMA_VERSION as m, applyClawRemovePlan as n, ClawWorkspaceWriteError as o, resolveInstalledClawHubPlugin as p, buildClawRemovePlan as r, createClawWorkspaceFiles as s, CLAW_REMOVE_RESULT_SCHEMA_VERSION as t, readClawWorkspaceFiles as u, clawCronGatewayInput as v, upsertClawCronRef as w, deleteClawCronRef as x, clawCronGatewayJobMatchesRef as y };
