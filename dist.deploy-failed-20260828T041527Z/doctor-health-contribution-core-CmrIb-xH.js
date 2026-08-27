import { t as defineSplitHealthCheckInput } from "./health-check-adapter-CWLXSjNJ.js";
import { r as resolveDoctorWorkspaceDir } from "./doctor-health-contribution-utils-0nWpp2v1.js";
//#region src/flows/doctor-health-contribution.ts
function createDoctorHealthContribution(params) {
	const healthChecks = normalizeHealthChecks(params.id, params.healthChecks);
	const healthCheckIds = params.healthCheckIds ?? healthChecks.map((check) => check.id);
	if (params.run === void 0 && healthChecks.length === 0) throw new Error(`doctor contribution ${params.id} must define run or healthChecks`);
	return {
		id: params.id,
		kind: "core",
		surface: "health",
		option: {
			value: params.id,
			label: params.label,
			...params.hint ? { hint: params.hint } : {}
		},
		source: "doctor",
		healthChecks,
		healthCheckIds,
		...params.required ? { required: true } : {},
		run: params.run ?? ((ctx) => runStructuredDoctorHealthContribution({
			contributionId: params.id,
			ctx,
			checks: healthChecks
		}))
	};
}
function normalizeHealthChecks(contributionId, healthChecks) {
	if (healthChecks === void 0) return [];
	const checks = Array.isArray(healthChecks) ? healthChecks : [healthChecks];
	return checks.map((check) => normalizeContributionHealthCheck(check, contributionId, checks.length));
}
function normalizeContributionHealthCheck(check, contributionId, count) {
	const id = check.id ?? (count === 1 ? deriveCoreHealthCheckId(contributionId) : void 0);
	if (id === void 0) throw new Error(`doctor contribution ${contributionId} must specify health check ids when it declares multiple healthChecks`);
	const identity = {
		id,
		kind: check.kind ?? "core",
		source: check.source ?? "doctor"
	};
	return "run" in check ? {
		...check,
		...identity,
		sourceContract: "run"
	} : {
		...check,
		...identity,
		sourceContract: "split"
	};
}
function deriveCoreHealthCheckId(contributionId) {
	return contributionId.startsWith("doctor:") ? `core/doctor/${contributionId.slice(7)}` : `core/doctor/${contributionId}`;
}
async function runStructuredDoctorHealthContribution(params) {
	if (params.checks.length === 0) throw new Error(`doctor contribution ${params.contributionId} has no structured health`);
	const { runDoctorHealthRepairs } = await import("./doctor-repair-flow-Bm5RV5cL.js");
	const workspaceDir = resolveDoctorWorkspaceDir(params.ctx.cfg, params.ctx.env);
	const dryRun = !params.ctx.prompter.shouldRepair;
	const result = await runDoctorHealthRepairs({
		mode: "fix",
		runtime: params.ctx.runtime,
		cfg: params.ctx.cfg,
		cwd: workspaceDir,
		configPath: params.ctx.configPath,
		dryRun,
		allowExecSecretRefs: params.ctx.options.allowExec === true
	}, {
		checks: params.checks,
		dryRun
	});
	params.ctx.cfg = result.config;
	renderStructuredHealthFindings(params.ctx, result.findings);
	for (const warning of result.warnings) params.ctx.runtime.error(warning);
	for (const change of result.changes) params.ctx.runtime.log(change);
}
function renderStructuredHealthFindings(ctx, findings) {
	for (const finding of findings) {
		const write = finding.severity === "error" ? ctx.runtime.error : ctx.runtime.log;
		const where = finding.path !== void 0 ? ` ${finding.path}` : "";
		const line = finding.line !== void 0 ? `:${finding.line}` : "";
		write(`[${finding.severity}] ${finding.checkId}${where}${line} - ${finding.message}`);
		if (finding.fixHint !== void 0) ctx.runtime.log(`  fix: ${finding.fixHint}`);
	}
}
//#endregion
//#region src/flows/doctor-health-contribution-core.ts
const loadHealthCheckRegistryModule = async () => await import("./health-check-registry-BzU8tXic.js");
function withDoctorHealthCheckFacts(ctx, input) {
	return {
		...input,
		...ctx.runWithPluginMetadataSnapshot ? { runWithPluginMetadataSnapshot: ctx.runWithPluginMetadataSnapshot } : {}
	};
}
async function runStructuredHealthRepairs(ctx, resolveCoreChecks) {
	if (!ctx.prompter.shouldRepair) return;
	const { registerBundledHealthChecks } = await import("./bundled-health-checks-5WDem18W.js");
	const { listExtensionHealthChecksForDoctor } = await loadHealthCheckRegistryModule();
	const { runDoctorHealthRepairs } = await import("./doctor-repair-flow-Bm5RV5cL.js");
	const { note } = await import("./terminal-core/note.js");
	const workspaceDir = resolveDoctorWorkspaceDir(ctx.cfg, ctx.env);
	registerBundledHealthChecks({
		cfg: ctx.cfg,
		cwd: workspaceDir
	});
	const checks = listExtensionHealthChecksForDoctor(await resolveCoreChecks()).map(defineSplitHealthCheckInput);
	const result = await runDoctorHealthRepairs(withDoctorHealthCheckFacts(ctx, {
		mode: "fix",
		runtime: ctx.runtime,
		cfg: ctx.cfg,
		cwd: workspaceDir,
		configPath: ctx.configPath
	}), { checks });
	ctx.cfg = result.config;
	if (result.changes.length > 0) note(result.changes.join("\n"), "Doctor changes");
	if (result.warnings.length > 0) note(result.warnings.join("\n"), "Doctor warnings");
}
async function runCoreContributionHealth(ctx, checkIds) {
	if (checkIds.length === 0) return;
	const { CORE_HEALTH_CHECKS } = await import("./doctor-core-checks-ByxOipGh.js");
	const { runDoctorHealthRepairs } = await import("./doctor-repair-flow-Bm5RV5cL.js");
	const { note } = await import("./terminal-core/note.js");
	const selectedIds = new Set(checkIds);
	const checks = CORE_HEALTH_CHECKS.filter((check) => selectedIds.has(check.id));
	if (checks.length === 0) return;
	const workspaceDir = resolveDoctorWorkspaceDir(ctx.cfg, ctx.env);
	const dryRun = !ctx.prompter.shouldRepair;
	const result = await runDoctorHealthRepairs(withDoctorHealthCheckFacts(ctx, {
		mode: "fix",
		runtime: ctx.runtime,
		cfg: ctx.cfg,
		cwd: workspaceDir,
		configPath: ctx.configPath,
		dryRun
	}), {
		checks,
		dryRun
	});
	ctx.cfg = result.config;
	renderStructuredHealthFindings(ctx, dryRun ? result.findings : result.remainingFindings);
	if (result.changes.length > 0) note(result.changes.join("\n"), "Doctor changes");
	if (result.warnings.length > 0) note(result.warnings.join("\n"), "Doctor warnings");
}
function formatHealthFindings(findings) {
	return findings.map((finding) => {
		const lines = [`- ${finding.message}`];
		if (finding.path) lines.push(`  path: ${finding.path}`);
		if (finding.requirement) lines.push(`  issue: ${finding.requirement}`);
		if (finding.fixHint) lines.push(`  fix: ${finding.fixHint}`);
		return lines.join("\n");
	}).join("\n");
}
async function runCoreHealthFindingNote(ctx, checkId) {
	const { CORE_HEALTH_CHECKS } = await import("./doctor-core-checks-ByxOipGh.js");
	const { note } = await import("./terminal-core/note.js");
	const check = CORE_HEALTH_CHECKS.find((candidate) => candidate.id === checkId);
	if (!check) return;
	const findings = await check.detect(withDoctorHealthCheckFacts(ctx, {
		mode: "doctor",
		runtime: ctx.runtime,
		cfg: ctx.cfg,
		cwd: resolveDoctorWorkspaceDir(ctx.cfg, ctx.env),
		configPath: ctx.configPath,
		allowExecSecretRefs: ctx.options.allowExec === true
	}));
	if (findings.length === 0) return;
	const information = findings.filter((finding) => finding.severity === "info");
	const warnings = findings.filter((finding) => finding.severity !== "info");
	if (information.length > 0) note(formatHealthFindings(information), "Doctor information");
	if (warnings.length > 0) {
		ctx.healthOk = false;
		note(formatHealthFindings(warnings), "Doctor warnings");
	}
}
//#endregion
export { createDoctorHealthContribution as i, runCoreHealthFindingNote as n, runStructuredHealthRepairs as r, runCoreContributionHealth as t };
