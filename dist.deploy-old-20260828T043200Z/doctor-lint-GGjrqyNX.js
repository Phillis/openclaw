import { f as resolveConfigPath, w as resolveStateDir } from "./paths-BBSTUjD5.js";
import "./agent-scope-DigoIwHb.js";
import { S as tryResolveDefaultAgentId, f as resolveAgentWorkspaceDir } from "./agent-scope-config-CUBiGmG3.js";
import { S as createConfigIO, s as readConfigFileSnapshot } from "./io-DlN5njvP.js";
import { i as withPluginInstallRoots, r as resolvePluginInstallRoots } from "./install-root-context-GQzXSH_D.js";
import { Yt as resolveOpenClawStateSqlitePath } from "./openclaw-state-db-CeAO_dqo.js";
import { i as prepareSqliteReadOnlyLocationSync } from "./sqlite-readonly-location-BUsr5nKz.js";
import { s as maybeLoadDotEnvForConfig } from "./io.read-helpers-YVBmmwxJ.js";
import "./config-B2bSneS2.js";
import { i as configValidationIssuesToHealthFindings } from "./doctor-core-checks-em2tTm3K.js";
import { t as scrubDoctorErrorMessage } from "./doctor-error-message-cjWLuv7y.js";
import { i as listExtensionHealthChecksForDoctor } from "./health-check-registry-CBs_fO63.js";
import { n as healthFindingMeetsSeverity, r as parseHealthFindingSeverity } from "./health-checks-DrfuiOOz.js";
import { n as runDoctorLintChecks, t as exitCodeFromFindings } from "./doctor-lint-flow-D_i_G1sz.js";
import { n as resolveBundledHealthCheckPluginStateMode, t as registerBundledHealthChecks } from "./bundled-health-checks-B_qIGQyR.js";
import { t as resolveDoctorContributionHealthChecks } from "./doctor-health-contributions-DSdAHxlg.js";
import fs from "node:fs";
import path from "node:path";
//#region src/commands/doctor-lint.ts
/** CLI entrypoint for non-mutating doctor lint health checks. */
var DoctorLintStateSnapshotError = class extends Error {
	constructor(cause) {
		super(`Doctor lint could not prepare a private plugin-state snapshot: ${scrubDoctorErrorMessage(cause)}`, { cause });
		this.name = "DoctorLintStateSnapshotError";
	}
};
function detectMode(opts) {
	if (opts.json === true) return "json";
	return process.stdout.isTTY ? "human" : "json";
}
/**
* Runs registered doctor health checks in human or JSON mode and returns the lint exit code.
*
* Invalid config is reported before regular health checks because most checks need a parsed config
* and workspace root.
*/
async function runDoctorLintCli(runtime, opts) {
	const execution = await prepareDoctorLintExecution(runtime, opts);
	execution.writeOutput();
	return execution.exitCode;
}
/** Collect advisory doctor findings without writing output or repairing operator state. */
async function collectDoctorFindings(runtime) {
	return (await prepareDoctorLintExecution(runtime, { severityMin: "info" })).findings;
}
async function prepareDoctorLintExecution(runtime, opts) {
	const sevMin = opts.severityMin === void 0 ? "warning" : parseHealthFindingSeverity(opts.severityMin);
	if (sevMin === null) throw new Error("Invalid --severity-min value. Expected one of: info, warning, error.");
	maybeLoadDotEnvForConfig(process.env);
	const sourceEnv = { ...process.env };
	const pluginStateMode = resolveBundledHealthCheckPluginStateMode(opts);
	let execution;
	if (pluginStateMode === "direct") execution = await executeDoctorLint(runtime, opts, sevMin, {
		pluginMetadataEnv: sourceEnv,
		readConfigSnapshot: () => readConfigFileSnapshot({ observe: false }),
		sourceEnv,
		runWithPluginStateSnapshot: async (run) => await withReadOnlyPluginStateSnapshot(sourceEnv, run)
	});
	else if (pluginStateMode === "deferred") {
		const configIo = createConfigIO({
			env: sourceEnv,
			configPath: resolveConfigPath(sourceEnv, resolveStateDir(sourceEnv)),
			observe: false,
			pluginValidation: "core-only"
		});
		execution = await executeDoctorLint(runtime, opts, sevMin, {
			pluginMetadataEnv: sourceEnv,
			readConfigSnapshot: () => configIo.readConfigFileSnapshot(),
			sourceEnv,
			runWithPluginStateSnapshot: async (run) => await withReadOnlyPluginStateSnapshot(sourceEnv, run)
		});
	} else try {
		execution = await withReadOnlyPluginStateSnapshot(sourceEnv, async (pluginMetadataEnv) => {
			const sourceConfigPath = resolveConfigPath(sourceEnv, resolveStateDir(sourceEnv));
			const configIo = createConfigIO({
				env: sourceEnv,
				configPath: sourceConfigPath,
				observe: false
			});
			return await executeDoctorLint(runtime, opts, sevMin, {
				pluginMetadataEnv,
				readConfigSnapshot: () => configIo.readConfigFileSnapshot(),
				sourceEnv,
				runWithPluginStateSnapshot: async (run) => await run(pluginMetadataEnv)
			});
		});
	} catch (error) {
		if (!(error instanceof DoctorLintStateSnapshotError)) throw error;
		execution = createStateSnapshotFailureExecution(runtime, opts, sevMin, error);
	}
	return execution;
}
async function executeDoctorLint(runtime, opts, sevMin, stateView) {
	const snapshot = await stateView.readConfigSnapshot();
	if (snapshot.exists && !snapshot.valid) {
		const findings = configValidationIssuesToHealthFindings(snapshot.issues);
		const visible = findings.filter((finding) => healthFindingMeetsSeverity(finding, sevMin));
		return {
			exitCode: exitCodeFromFindings(findings, sevMin),
			findings: visible,
			writeOutput() {
				if (detectMode(opts) === "json") {
					writeJsonResult({
						ok: false,
						checksRun: 1,
						checksSkipped: 0,
						findings: visible
					});
					return;
				}
				runtime.error("doctor --lint: config file exists but does not parse cleanly.");
				for (const issue of snapshot.issues) {
					const issuePath = issue.path || "<root>";
					runtime.error(`- ${issuePath}: ${issue.message}`);
				}
			}
		};
	}
	const sourceEnv = { ...stateView.sourceEnv };
	const defaultAgentId = tryResolveDefaultAgentId(snapshot.config);
	const ctx = {
		mode: "lint",
		runtime,
		cfg: snapshot.config,
		cwd: defaultAgentId ? resolveAgentWorkspaceDir(snapshot.config, defaultAgentId) : process.cwd(),
		env: sourceEnv,
		allowExecSecretRefs: opts.allowExec === true,
		...snapshot.path !== void 0 ? { configPath: snapshot.path } : {}
	};
	registerBundledHealthChecks({
		cfg: snapshot.config,
		cwd: ctx.cwd,
		env: stateView.pluginMetadataEnv,
		runWithPluginStateSnapshot: stateView.runWithPluginStateSnapshot
	});
	const registeredExtensionChecks = listExtensionHealthChecksForDoctor([]);
	const onlyRegisteredExtensionChecks = opts.onlyIds !== void 0 && opts.onlyIds.length > 0 && opts.onlyIds.every((id) => registeredExtensionChecks.some((check) => check.id === id));
	const coreChecks = onlyRegisteredExtensionChecks ? [] : await resolveDoctorContributionHealthChecks();
	const extensionChecks = onlyRegisteredExtensionChecks ? registeredExtensionChecks : listExtensionHealthChecksForDoctor(coreChecks);
	const coreCtx = {
		...ctx,
		deep: opts.deep === true
	};
	const result = await runDoctorLintChecks(ctx, {
		checks: [...coreChecks.map((check) => withCoreLintContext(check, coreCtx)), ...extensionChecks],
		includeAllChecks: opts.includeAllChecks === true,
		...opts.skipIds && opts.skipIds.length > 0 ? { skipIds: opts.skipIds } : {},
		...opts.onlyIds && opts.onlyIds.length > 0 ? { onlyIds: opts.onlyIds } : {}
	});
	const visible = result.findings.filter((finding) => healthFindingMeetsSeverity(finding, sevMin));
	const exitCode = exitCodeFromFindings(result.findings, sevMin);
	return {
		exitCode,
		findings: visible,
		writeOutput() {
			if (detectMode(opts) === "json") {
				writeJsonResult({
					ok: exitCode === 0,
					checksRun: result.checksRun,
					checksSkipped: result.checksSkipped,
					findings: visible
				});
				return;
			}
			process.stdout.write(`doctor --lint: ran ${result.checksRun} check(s), ${visible.length} finding(s)\n`);
			if (visible.length === 0) {
				process.stdout.write("  no findings\n");
				return;
			}
			for (const f of visible) {
				const where = f.path !== void 0 ? ` ${f.path}` : "";
				const line = f.line !== void 0 ? `:${f.line}` : "";
				process.stdout.write(`  [${f.severity}] ${f.checkId}${where}${line} - ${f.message}\n`);
				if (f.fixHint !== void 0) process.stdout.write(`    fix: ${f.fixHint}\n`);
			}
		}
	};
}
async function withReadOnlyPluginStateSnapshot(sourceEnv, run) {
	const sourceDatabasePath = resolveOpenClawStateSqlitePath(sourceEnv);
	if (!fs.existsSync(sourceDatabasePath)) return await run(sourceEnv);
	let prepared;
	try {
		prepared = prepareSqliteReadOnlyLocationSync(sourceDatabasePath);
	} catch (error) {
		throw new DoctorLintStateSnapshotError(error);
	}
	let outcome;
	let runStarted = false;
	try {
		const privateStateDir = path.join(path.dirname(prepared.location), "openclaw-state");
		const privateDatabasePath = resolveOpenClawStateSqlitePath({
			...sourceEnv,
			OPENCLAW_STATE_DIR: privateStateDir
		});
		fs.mkdirSync(path.dirname(privateDatabasePath), {
			recursive: true,
			mode: 448
		});
		for (const suffix of [
			"",
			"-journal",
			"-shm",
			"-wal"
		]) {
			const sourcePath = `${prepared.location}${suffix}`;
			if (fs.existsSync(sourcePath)) fs.renameSync(sourcePath, `${privateDatabasePath}${suffix}`);
		}
		const sourceConfigPath = resolveConfigPath(sourceEnv, resolveStateDir(sourceEnv));
		const privateEnv = {
			...sourceEnv,
			OPENCLAW_CONFIG_PATH: sourceConfigPath,
			OPENCLAW_STATE_DIR: privateStateDir
		};
		outcome = {
			ok: true,
			value: await withPluginInstallRoots({
				...resolvePluginInstallRoots(sourceEnv),
				stateDir: privateStateDir
			}, async () => {
				runStarted = true;
				return await run(privateEnv);
			})
		};
	} catch (error) {
		outcome = {
			ok: false,
			error
		};
	}
	if (!prepared.cleanup()) throw new DoctorLintStateSnapshotError(/* @__PURE__ */ new Error("Temporary doctor lint state snapshot cleanup did not complete."));
	if (!outcome.ok) throw runStarted ? outcome.error : new DoctorLintStateSnapshotError(outcome.error);
	return outcome.value;
}
function createStateSnapshotFailureExecution(runtime, opts, sevMin, error) {
	const finding = {
		checkId: "core/doctor/lint-state-inspection",
		severity: "error",
		source: "doctor",
		target: "plugin-state",
		requirement: "read-only-plugin-state-inspection",
		message: `Doctor lint could not inspect plugin state without mutating the live state database (${scrubDoctorErrorMessage(error.cause ?? error)}).`,
		fixHint: "Keep the current Gateway running, resolve the state database inspection error, then rerun this check."
	};
	const visible = healthFindingMeetsSeverity(finding, sevMin) ? [finding] : [];
	return {
		exitCode: exitCodeFromFindings([finding], sevMin),
		findings: visible,
		writeOutput() {
			if (detectMode(opts) === "json") {
				writeJsonResult({
					ok: false,
					checksRun: 0,
					checksSkipped: 0,
					findings: visible
				});
				return;
			}
			runtime.error(`doctor --lint: ${finding.message}`);
			runtime.error(`fix: ${finding.fixHint}`);
		}
	};
}
function withCoreLintContext(check, ctx) {
	return {
		...check,
		detect(_ctx, scope) {
			return check.detect(ctx, scope);
		}
	};
}
function writeJsonResult(result) {
	process.stdout.write(JSON.stringify({
		ok: result.ok,
		checksRun: result.checksRun,
		checksSkipped: result.checksSkipped,
		findings: result.findings.map(toJsonFinding)
	}) + "\n");
}
function toJsonFinding(f) {
	return {
		checkId: f.checkId,
		severity: f.severity,
		message: f.message,
		...f.source !== void 0 ? { source: f.source } : {},
		...f.path !== void 0 ? { path: f.path } : {},
		...f.line !== void 0 ? { line: f.line } : {},
		...f.column !== void 0 ? { column: f.column } : {},
		...f.ocPath !== void 0 ? { ocPath: f.ocPath } : {},
		...f.target !== void 0 ? { target: f.target } : {},
		...f.requirement !== void 0 ? { requirement: f.requirement } : {},
		...f.fixHint !== void 0 ? { fixHint: f.fixHint } : {}
	};
}
//#endregion
export { collectDoctorFindings, runDoctorLintCli };
