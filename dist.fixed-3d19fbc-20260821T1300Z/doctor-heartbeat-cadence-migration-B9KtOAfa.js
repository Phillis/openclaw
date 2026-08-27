import { m as shortenHomePath } from "./utils-D9gvQMP6.js";
import { r as formatErrorMessage } from "./errors-CqPTYU6G.js";
import { t as formatCliCommand } from "./command-format-Dr_cCOb_.js";
import { b as tryResolveLegacyCompatibilityAgentId } from "./agent-scope-config-CsnnOL14.js";
import "./legacy.default-agent-owner-0YGX8Nyg.js";
import { a as loadCronJobsStoreWithConfigJobsReadOnly, u as resolveCronJobsStorePathFromConfig } from "./store-DPYCi6M7.js";
import { t as formatDurationCompact } from "./format-duration-DKk9BtRb.js";
import { t as CronService } from "./service-FuF1IsMy.js";
import { t as note } from "./note-C_xoKlB9.js";
import { g as resolveHeartbeatSchedulerSeed } from "./heartbeat-runner-session-CoYXSYw9.js";
import "./heartbeat-runner-DXheZqP2.js";
import { n as resolveHeartbeatMonitorSpecs, t as heartbeatMonitorAgentId } from "./heartbeat-monitor-D-Je4aOM.js";
import { isDeepStrictEqual } from "node:util";
//#region src/commands/doctor-heartbeat-cadence-migration.ts
/** Doctor-owned materialization of heartbeat cadence config into cron monitor rows. */
const HEARTBEAT_CADENCE_MIGRATION_CHECK_ID = "core/doctor/heartbeat-cadence-migration";
function createDoctorCronService(storePath, cfg) {
	const noop = () => {};
	const log = {
		debug: noop,
		info: noop,
		warn: noop,
		error: noop
	};
	return new CronService({
		storePath,
		cronEnabled: false,
		cronConfig: cfg.cron,
		resolveDefaultAgentId: () => tryResolveLegacyCompatibilityAgentId(cfg),
		log,
		enqueueSystemEvent: () => false,
		requestHeartbeat: noop,
		runIsolatedAgentJob: async () => ({
			status: "skipped",
			error: "doctor does not execute automations"
		})
	});
}
function declarativeFields(job) {
	return {
		schedule: job.schedule,
		pacing: job.pacing,
		trigger: job.trigger,
		payload: job.payload,
		delivery: job.delivery,
		displayName: job.displayName,
		enabled: job.enabled
	};
}
function resolveHeartbeatMonitorPlan(cfg, jobs, options = {}) {
	const specs = resolveHeartbeatMonitorSpecs(cfg, jobs, options);
	const existingByAgentId = /* @__PURE__ */ new Map();
	for (const job of jobs) {
		const agentId = heartbeatMonitorAgentId(job);
		if (agentId) existingByAgentId.set(agentId, job);
	}
	const desiredAgentIds = new Set(specs.map((spec) => spec.agentId));
	const changes = [];
	for (const spec of specs) {
		const existing = existingByAgentId.get(spec.agentId);
		if (!existing) {
			changes.push({
				kind: "create",
				agentId: spec.agentId,
				input: spec.input
			});
			continue;
		}
		if (!isDeepStrictEqual(declarativeFields(existing), declarativeFields(spec.input))) changes.push({
			kind: "update",
			agentId: spec.agentId,
			input: spec.input
		});
	}
	for (const [agentId, job] of existingByAgentId) if (!desiredAgentIds.has(agentId)) changes.push({
		kind: "remove",
		agentId,
		job
	});
	return { changes };
}
async function loadHeartbeatMonitorPlan(cfg, storePath, env) {
	const cron = createDoctorCronService(storePath, cfg);
	return {
		cron,
		plan: resolveHeartbeatMonitorPlan(cfg, await cron.list({ includeDisabled: true }), { schedulerSeed: resolveHeartbeatSchedulerSeed(void 0, { env }) })
	};
}
async function loadHeartbeatMonitorPlanReadOnly(cfg, storePath, env) {
	const loaded = await loadCronJobsStoreWithConfigJobsReadOnly(storePath, env);
	const schedulerSeed = resolveHeartbeatSchedulerSeed(void 0, {
		env,
		readOnly: true
	});
	return resolveHeartbeatMonitorPlan(cfg, loaded.store.jobs, { schedulerSeed });
}
function describePlannedChange(change) {
	if (change.kind === "remove") return `Remove stale heartbeat monitor for agent "${change.agentId}".`;
	const schedule = change.input.schedule;
	const cadence = schedule.kind === "every" ? formatDurationCompact(schedule.everyMs) : schedule.kind;
	return `${change.kind === "create" ? "Create" : "Update"} heartbeat monitor for agent "${change.agentId}" at ${cadence}.`;
}
function noteWarnings(warnings, storePath) {
	if (warnings.length === 0) return;
	note(`${warnings.join("\n")}\nCron store: ${shortenHomePath(storePath)}`, "Doctor warnings");
}
function cadenceFinding(params) {
	return {
		checkId: HEARTBEAT_CADENCE_MIGRATION_CHECK_ID,
		severity: "warning",
		message: describePlannedChange(params.change),
		path: params.storePath,
		target: params.change.agentId,
		requirement: `heartbeat-monitor-${params.change.kind}`,
		fixHint: `Run ${formatCliCommand("openclaw doctor --fix")} to materialize heartbeat cadence in cron.`
	};
}
/** Reports heartbeat monitor rows that do not yet match cadence config. */
async function collectHeartbeatCadenceMigrationFindings(cfg, env = process.env) {
	const storePath = resolveCronJobsStorePathFromConfig(cfg, env);
	try {
		return (await loadHeartbeatMonitorPlanReadOnly(cfg, storePath, env)).changes.map((change) => cadenceFinding({
			storePath,
			change
		}));
	} catch (error) {
		return [{
			checkId: HEARTBEAT_CADENCE_MIGRATION_CHECK_ID,
			severity: "error",
			message: `Heartbeat cadence could not be inspected: ${formatErrorMessage(error)}`,
			path: storePath,
			requirement: "heartbeat-monitor-inspection",
			fixHint: `Run ${formatCliCommand("openclaw doctor --fix")} after resolving the cron store error.`
		}];
	}
}
/** Creates or updates the stable monitor rows used by heartbeat execution. */
async function ensureHeartbeatMonitorJobs(cfg, storePath, env = process.env) {
	const cron = createDoctorCronService(storePath, cfg);
	const specs = resolveHeartbeatMonitorSpecs(cfg, await cron.list({ includeDisabled: true }), { schedulerSeed: resolveHeartbeatSchedulerSeed(void 0, { env }) });
	const monitors = /* @__PURE__ */ new Map();
	for (const spec of specs) {
		const result = await cron.add(spec.input, {
			enabledExplicit: true,
			systemOwned: true,
			matchesExisting: (job) => heartbeatMonitorAgentId(job) === spec.agentId
		});
		const job = "job" in result ? result.job : result;
		monitors.set(spec.agentId, job);
	}
	return monitors;
}
/** Previews or applies config-to-cron heartbeat cadence materialization. */
async function maybeMigrateHeartbeatCadenceToCron(params) {
	const env = params.env ?? process.env;
	const storePath = resolveCronJobsStorePathFromConfig(params.cfg, env);
	const changes = [];
	const warnings = [];
	if (!params.shouldRepair) {
		try {
			const plan = await loadHeartbeatMonitorPlanReadOnly(params.cfg, storePath, env);
			if (plan.changes.length > 0) note(plan.changes.map(describePlannedChange).join("\n"), "Heartbeat cadence migration preview");
		} catch (error) {
			warnings.push(`Could not inspect heartbeat monitor jobs: ${formatErrorMessage(error)}`);
		}
		noteWarnings(warnings, storePath);
		return {
			changes,
			warnings
		};
	}
	let cron;
	let plan;
	try {
		({cron, plan} = await loadHeartbeatMonitorPlan(params.cfg, storePath, env));
	} catch (error) {
		const warning = `Could not inspect heartbeat monitor jobs: ${formatErrorMessage(error)}`;
		noteWarnings([warning], storePath);
		return {
			changes,
			warnings: [warning]
		};
	}
	for (const change of plan.changes) try {
		if (change.kind === "remove") await cron.remove(change.job.id, { systemOwned: true });
		else await cron.add(change.input, {
			enabledExplicit: true,
			systemOwned: true,
			matchesExisting: (job) => heartbeatMonitorAgentId(job) === change.agentId
		});
		changes.push(describePlannedChange(change));
	} catch (error) {
		warnings.push(`Heartbeat monitor for agent "${change.agentId}" was not migrated: ${formatErrorMessage(error)}`);
	}
	if (changes.length > 0) note(changes.join("\n"), "Doctor changes");
	noteWarnings(warnings, storePath);
	return {
		changes,
		warnings
	};
}
//#endregion
export { ensureHeartbeatMonitorJobs as n, maybeMigrateHeartbeatCadenceToCron as r, collectHeartbeatCadenceMigrationFindings as t };
