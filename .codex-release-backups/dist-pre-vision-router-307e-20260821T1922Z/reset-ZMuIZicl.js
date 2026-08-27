import { c as isNixMode } from "./paths-CqeDjSA4.js";
import { t as formatCliCommand } from "./command-format-Dr_cCOb_.js";
import "./config-Dl8DJbzM.js";
import { a as resolveGatewayService } from "./service-BoInmOOR.js";
import { n as stylePromptMessage, r as stylePromptTitle } from "./prompt-style-BQVvtDcR.js";
import { a as removeStateAndLinkedPaths, i as removePath, o as removeWorkspaceDirs, r as listAgentSessionDirs } from "./cleanup-utils-CAt2PsMZ.js";
import { t as selectStyled } from "./prompt-select-styled-w98xOWqw.js";
import { t as resolveCleanupPlanFromDisk } from "./cleanup-plan-BP7QCtq9.js";
import { cancel, confirm, isCancel } from "@clack/prompts";
//#region src/commands/reset.ts
/**
* Reset command implementation.
*
* It removes selected config/state/workspace surfaces after confirmation and
* stops managed gateway services before deleting broader state.
*/
async function stopGatewayIfRunning(runtime) {
	if (isNixMode) return true;
	const service = resolveGatewayService();
	let loaded;
	try {
		loaded = await service.isLoaded({ env: process.env });
	} catch (err) {
		runtime.error(`Gateway service check failed: ${String(err)}`);
		return false;
	}
	if (!loaded) return true;
	try {
		await service.stop({
			env: process.env,
			stdout: process.stdout
		});
		return true;
	} catch (err) {
		runtime.error(`Gateway stop failed: ${String(err)}`);
		return false;
	}
}
function logBackupRecommendation(runtime) {
	runtime.log(`Recommended first: ${formatCliCommand("openclaw backup create")}`);
}
/** Runs the reset command for config, credential/session, or full state scopes. */
async function resetCommand(runtime, opts) {
	const interactive = !opts.nonInteractive;
	if (!interactive && !opts.yes) {
		runtime.error("Non-interactive mode requires --yes.");
		runtime.exit(1);
		return;
	}
	let scope = opts.scope;
	if (!scope) {
		if (!interactive) {
			runtime.error("Non-interactive mode requires --scope.");
			runtime.exit(1);
			return;
		}
		const selection = await selectStyled({
			message: "Reset scope",
			options: [
				{
					value: "config",
					label: "Config only",
					hint: "openclaw.json"
				},
				{
					value: "config+creds+sessions",
					label: "Config + credentials + sessions",
					hint: "keeps workspace + auth profiles"
				},
				{
					value: "full",
					label: "Full reset",
					hint: "state dir + workspace"
				}
			],
			initialValue: "config+creds+sessions"
		});
		if (isCancel(selection)) {
			cancel(stylePromptTitle("Reset cancelled.") ?? "Reset cancelled.");
			runtime.exit(0);
			return;
		}
		scope = selection;
	}
	if (![
		"config",
		"config+creds+sessions",
		"full"
	].includes(scope)) {
		runtime.error("Invalid --scope. Expected \"config\", \"config+creds+sessions\", or \"full\".");
		runtime.exit(1);
		return;
	}
	if (interactive && !opts.yes) {
		const ok = await confirm({ message: stylePromptMessage(`Proceed with ${scope} reset?`) });
		if (isCancel(ok) || !ok) {
			cancel(stylePromptTitle("Reset cancelled.") ?? "Reset cancelled.");
			runtime.exit(0);
			return;
		}
	}
	const dryRun = Boolean(opts.dryRun);
	const { stateDir, configPath, oauthDir, configInsideState, oauthInsideState, workspaceDirs } = resolveCleanupPlanFromDisk();
	if (scope !== "config") {
		logBackupRecommendation(runtime);
		if (dryRun) runtime.log("[dry-run] stop gateway service");
		else if (!await stopGatewayIfRunning(runtime)) {
			runtime.exit(1);
			return;
		}
	}
	if (scope === "config") {
		await removePath(configPath, runtime, {
			dryRun,
			label: configPath
		});
		return;
	}
	if (scope === "config+creds+sessions") {
		await removePath(configPath, runtime, {
			dryRun,
			label: configPath
		});
		await removePath(oauthDir, runtime, {
			dryRun,
			label: oauthDir
		});
		const sessionDirs = await listAgentSessionDirs(stateDir).catch((error) => {
			runtime.error(`Failed to inspect session directories: ${String(error)}`);
			return [];
		});
		for (const dir of sessionDirs) await removePath(dir, runtime, {
			dryRun,
			label: dir
		});
		runtime.log(`Next: ${formatCliCommand("openclaw onboard --install-daemon")}`);
		return;
	}
	if (scope === "full") {
		await removeWorkspaceDirs(workspaceDirs, runtime, {
			dryRun,
			removeStateRows: !await removeStateAndLinkedPaths({
				stateDir,
				configPath,
				oauthDir,
				configInsideState,
				oauthInsideState
			}, runtime, { dryRun })
		});
		runtime.log(`Next: ${formatCliCommand("openclaw onboard --install-daemon")}`);
	}
}
//#endregion
export { resetCommand };
