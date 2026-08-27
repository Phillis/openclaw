import { r as createLazyRuntimeModule } from "./lazy-runtime-CgCh8H_K.js";
import { w as resolveStateDir } from "./paths-CqeDjSA4.js";
import { r as stylePromptTitle } from "./prompt-style-BQVvtDcR.js";
import fs from "node:fs";
import { intro, outro } from "@clack/prompts";
//#region src/flows/doctor-health.ts
const intro$1 = (message) => intro(stylePromptTitle(message) ?? message);
const outro$1 = (message) => outro(stylePromptTitle(message) ?? message);
const loadConfigModule = createLazyRuntimeModule(() => import("./config/config.js"));
async function assertDoctorDatabaseSchemasCompatible() {
	const [databasePreflight, agentDatabase, stateDatabase] = await Promise.all([
		import("./openclaw-database-preflight-DXYZASdW.js"),
		import("./openclaw-agent-db-B1pM2_Ig.js"),
		import("./openclaw-state-db-CL0AokY4.js")
	]);
	const databaseSchemas = databasePreflight.preflightOpenClawDatabaseSchemas({
		env: process.env,
		supportedVersions: {
			state: stateDatabase.OPENCLAW_STATE_SCHEMA_VERSION,
			agent: agentDatabase.OPENCLAW_AGENT_SCHEMA_VERSION
		}
	});
	if (databaseSchemas.incompatible.length > 0) throw new databasePreflight.OpenClawDatabaseSchemaPreflightError(databaseSchemas.incompatible, { operation: "doctor" });
}
function stateDirectoryExistsAtDoctorStart() {
	try {
		return fs.statSync(resolveStateDir()).isDirectory();
	} catch {
		return false;
	}
}
/** Runs the full interactive doctor flow against the provided or default runtime. */
async function runDoctorHealthFlow(runtime, options = {}) {
	const effectiveRuntime = runtime ?? (await import("./runtime-Dn74rUMz.js")).defaultRuntime;
	const stateDirExistedAtStart = stateDirectoryExistsAtDoctorStart();
	intro$1("OpenClaw doctor");
	const { createDoctorPrompter } = await import("./doctor-prompter-DQ16qESM.js");
	const prompter = createDoctorPrompter({
		runtime: effectiveRuntime,
		options
	});
	const { resolveOpenClawPackageRoot } = await import("./openclaw-root-BTdHor8F.js");
	const root = await resolveOpenClawPackageRoot({
		moduleUrl: import.meta.url,
		argv1: process.argv[1],
		cwd: process.cwd()
	});
	const { maybeOfferUpdateBeforeDoctor } = await import("./doctor-update-DDEP-Jpr.js");
	if ((await maybeOfferUpdateBeforeDoctor({
		runtime: effectiveRuntime,
		options,
		root,
		confirm: (p) => prompter.confirm(p),
		outro: outro$1
	})).handled) return;
	await assertDoctorDatabaseSchemasCompatible();
	if (options.repair === true || options.yes === true || options.generateGatewayToken === true) {
		const { assertConfigWriteAllowedInCurrentMode } = await loadConfigModule();
		assertConfigWriteAllowedInCurrentMode();
	}
	const { maybeRepairUiProtocolFreshness } = await import("./doctor-ui-DPPAsW87.js");
	const { noteSourceInstallIssues } = await import("./doctor-install-BtCWsbsP.js");
	const { noteStalePluginRuntimeSymlinks } = await import("./plugin-runtime-symlinks-CCZxjVw8.js");
	const { noteStartupOptimizationHints } = await import("./doctor-platform-notes-Qj2vD7er.js");
	await maybeRepairUiProtocolFreshness(effectiveRuntime, prompter);
	noteSourceInstallIssues(root);
	await noteStalePluginRuntimeSymlinks(root);
	noteStartupOptimizationHints();
	const { loadAndMaybeMigrateDoctorConfig } = await import("./doctor-config-flow-DuPGajjA.js");
	const configResult = await loadAndMaybeMigrateDoctorConfig({
		options,
		confirm: (p) => prompter.confirm(p),
		runtime: effectiveRuntime,
		prompter
	});
	const { CONFIG_PATH } = await loadConfigModule();
	const ctx = {
		runtime: effectiveRuntime,
		options,
		prompter,
		configResult,
		cfg: configResult.cfg,
		cfgForPersistence: structuredClone(configResult.cfg),
		sourceConfigValid: configResult.sourceConfigValid ?? true,
		configPath: configResult.path ?? CONFIG_PATH,
		stateDirExistedAtStart,
		runWithPluginMetadataSnapshot: configResult.runWithPluginMetadataSnapshot,
		invalidatePluginMetadataSnapshot: configResult.invalidatePluginMetadataSnapshot
	};
	const { runDoctorHealthContributions } = await import("./doctor-health-contributions-DWtckEYu.js");
	await runDoctorHealthContributions(ctx);
	if (ctx.postInstallDoctorResult) {
		const { UPDATE_POST_INSTALL_DOCTOR_ADVISORY_EXIT_CODE, UPDATE_POST_INSTALL_DOCTOR_RESULT_PATH_ENV, writeUpdatePostInstallDoctorResult } = await import("./update-doctor-result-Diw84sfn.js");
		const resultPath = process.env[UPDATE_POST_INSTALL_DOCTOR_RESULT_PATH_ENV]?.trim();
		if (resultPath) {
			await writeUpdatePostInstallDoctorResult({
				resultPath,
				result: ctx.postInstallDoctorResult
			});
			effectiveRuntime.exit(UPDATE_POST_INSTALL_DOCTOR_ADVISORY_EXIT_CODE);
			return;
		}
	}
	outro$1("Doctor complete.");
}
//#endregion
export { runDoctorHealthFlow };
