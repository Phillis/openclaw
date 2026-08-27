import { r as createLazyRuntimeModule } from "./lazy-runtime-CgCh8H_K.js";
import { w as resolveStateDir } from "./paths-BBSTUjD5.js";
import { t as formatCliCommand } from "./command-format-HwSAdvXB.js";
import { r as stylePromptTitle } from "./prompt-style-BQVvtDcR.js";
import fs from "node:fs";
import { intro, outro } from "@clack/prompts";
//#region src/flows/doctor-health.ts
const intro$1 = (message) => intro(stylePromptTitle(message) ?? message);
const outro$1 = (message) => outro(stylePromptTitle(message) ?? message);
const loadConfigModule = createLazyRuntimeModule(() => import("./config/config.js"));
async function assertDoctorDatabaseSchemasCompatible() {
	const [databasePreflight, agentDatabase, stateDatabase] = await Promise.all([
		import("./openclaw-database-preflight-DYma-5IC.js"),
		import("./openclaw-agent-db-Cmprgm7a.js"),
		import("./openclaw-state-db-Bxqq7Rsp.js")
	]);
	const databaseSchemas = databasePreflight.preflightOpenClawDatabaseSchemas({
		env: process.env,
		supportedVersions: {
			state: stateDatabase.OPENCLAW_STATE_SCHEMA_VERSION,
			agent: agentDatabase.OPENCLAW_AGENT_SCHEMA_VERSION
		}
	});
	if (databaseSchemas.incompatible.length > 0) throw new databasePreflight.OpenClawDatabaseSchemaPreflightError(databaseSchemas.incompatible, { operation: "doctor" });
	const unreadableStateDatabase = databaseSchemas.indeterminate.find((database) => database.kind === "state");
	if (unreadableStateDatabase) throw new Error(`Doctor cannot continue because the shared state database is unreadable: ${unreadableStateDatabase.path}: ${unreadableStateDatabase.reason}. The database was left unchanged; doctor will not recreate it because that could discard persistent operator data. Stop the Gateway and other OpenClaw processes, then restore this file from a verified backup or repair it manually. After recovery, run ${formatCliCommand("openclaw doctor --fix")} again. See ${stateDatabase.OPENCLAW_DATABASE_SCHEMA_DOCS_URL}.`);
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
	const effectiveRuntime = runtime ?? (await import("./runtime-BO0y5md7.js")).defaultRuntime;
	const stateDirExistedAtStart = stateDirectoryExistsAtDoctorStart();
	intro$1("OpenClaw doctor");
	const { createDoctorPrompter } = await import("./doctor-prompter-BEXPJ_9X.js");
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
	const { maybeOfferUpdateBeforeDoctor } = await import("./doctor-update-3kAKihU4.js");
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
	const { maybeRepairUiProtocolFreshness } = await import("./doctor-ui-MPRRtrjl.js");
	const { noteSourceInstallIssues } = await import("./doctor-install-DyDK4XUD.js");
	const { noteStalePluginRuntimeSymlinks } = await import("./plugin-runtime-symlinks-BZgUJrul.js");
	const { noteStartupOptimizationHints } = await import("./doctor-platform-notes-CHP5TbF5.js");
	await maybeRepairUiProtocolFreshness(effectiveRuntime, prompter);
	noteSourceInstallIssues(root);
	await noteStalePluginRuntimeSymlinks(root);
	noteStartupOptimizationHints();
	const { loadAndMaybeMigrateDoctorConfig } = await import("./doctor-config-flow-7KpkDYe7.js");
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
	const { runDoctorHealthContributions } = await import("./doctor-health-contributions-RS9m2wBq.js");
	await runDoctorHealthContributions(ctx);
	if (ctx.configWriteRefusal) {
		outro$1(ctx.configResultWriteCommitted === true ? "Doctor finished, but some config fixes were not applied." : "Doctor finished, but config fixes were not applied.");
		effectiveRuntime.exit(1);
		return;
	}
	if (ctx.postInstallDoctorResult) {
		const { UPDATE_POST_INSTALL_DOCTOR_ADVISORY_EXIT_CODE, UPDATE_POST_INSTALL_DOCTOR_RESULT_PATH_ENV, writeUpdatePostInstallDoctorResult } = await import("./update-doctor-result-DpZ1G9Ee.js");
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
