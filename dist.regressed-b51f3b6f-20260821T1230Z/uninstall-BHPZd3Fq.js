import { f as resolveHomeDir, p as shortenHomeInString } from "./utils-DEqefz4f.js";
import { c as isNixMode } from "./paths-CqeDjSA4.js";
import { r as formatErrorMessage } from "./errors-CSNUPl5U.js";
import { t as formatCliCommand } from "./command-format-Dr_cCOb_.js";
import "./config-Dl8DJbzM.js";
import { a as resolveGatewayService } from "./service-BoInmOOR.js";
import { c as prepareLegacyWorkspaceStateReset, l as removeLegacyWorkspaceStateForReset } from "./workspace-legacy-state-i2unYb2K.js";
import { n as stylePromptMessage, r as stylePromptTitle } from "./prompt-style-BQVvtDcR.js";
import { a as removeStateAndLinkedPaths, i as removePath, o as removeWorkspaceDirs } from "./cleanup-utils-CAt2PsMZ.js";
import { t as styleSelectParams } from "./prompt-select-styled-params-CvMQXWIw.js";
import { t as resolveCleanupPlanFromDisk } from "./cleanup-plan-BP7QCtq9.js";
import path from "node:path";
import { cancel, confirm, isCancel, multiselect } from "@clack/prompts";
//#region src/commands/uninstall.ts
const multiselectStyled = (params) => multiselect(styleSelectParams(params));
function buildScopeSelection(opts) {
	const hadExplicit = Boolean(opts.all || opts.service || opts.state || opts.workspace || opts.app);
	const scopes = /* @__PURE__ */ new Set();
	if (opts.all || opts.service) scopes.add("service");
	if (opts.all || opts.state) scopes.add("state");
	if (opts.all || opts.workspace) scopes.add("workspace");
	if (opts.all || opts.app) scopes.add("app");
	return {
		scopes,
		hadExplicit
	};
}
async function stopAndUninstallService(runtime) {
	if (isNixMode) {
		runtime.error(`Nix mode detected; service uninstall is disabled. Manage the service through your Nix profile instead, then run ${formatCliCommand("openclaw status")} to verify.`);
		return false;
	}
	const service = resolveGatewayService();
	let loaded;
	try {
		loaded = await service.isLoaded({ env: process.env });
	} catch (err) {
		runtime.error(`Gateway service check failed: ${formatErrorMessage(err)}. Run ${formatCliCommand("openclaw gateway status --deep")} for service diagnostics.`);
		return false;
	}
	if (!loaded) runtime.log(`Gateway service ${service.notLoadedText}.`);
	let stopped = true;
	if (loaded) try {
		await service.stop({
			env: process.env,
			stdout: process.stdout
		});
	} catch (err) {
		stopped = false;
		runtime.error(`Gateway stop failed: ${formatErrorMessage(err)}. Run ${formatCliCommand("openclaw gateway status --deep")} before retrying uninstall.`);
	}
	try {
		await service.uninstall({
			env: process.env,
			stdout: process.stdout
		});
	} catch (err) {
		runtime.error(`Gateway uninstall failed: ${formatErrorMessage(err)}. Run ${formatCliCommand("openclaw gateway status --deep")} for the service state.`);
		return false;
	}
	return stopped;
}
async function removeMacApp(runtime, dryRun) {
	if (process.platform !== "darwin") return;
	await removePath("/Applications/OpenClaw.app", runtime, {
		dryRun,
		label: "/Applications/OpenClaw.app"
	});
}
function logBackupRecommendation(runtime) {
	runtime.log(`Recommended first: ${formatCliCommand("openclaw backup create")}`);
}
/** Runs the uninstall flow for selected service/state/workspace/app scopes. */
async function uninstallCommand(runtime, opts) {
	const { scopes, hadExplicit } = buildScopeSelection(opts);
	const interactive = !opts.nonInteractive;
	if (!interactive && !opts.yes) {
		runtime.error(`Non-interactive uninstall requires --yes. Preview first with ${formatCliCommand("openclaw uninstall --dry-run --all")}.`);
		runtime.exit(1);
		return;
	}
	if (!hadExplicit) {
		if (!interactive) {
			runtime.error(`Non-interactive uninstall requires explicit scopes. Use --all, or choose scopes such as --service --state.`);
			runtime.exit(1);
			return;
		}
		const selection = await multiselectStyled({
			message: "Uninstall which components?",
			options: [
				{
					value: "service",
					label: "Gateway service",
					hint: "launchd / systemd / schtasks"
				},
				{
					value: "state",
					label: "State + config",
					hint: "~/.openclaw"
				},
				{
					value: "workspace",
					label: "Workspace",
					hint: "agent files"
				},
				{
					value: "app",
					label: "macOS app",
					hint: "/Applications/OpenClaw.app"
				}
			],
			initialValues: [
				"service",
				"state",
				"workspace"
			]
		});
		if (isCancel(selection)) {
			cancel(stylePromptTitle("Uninstall cancelled.") ?? "Uninstall cancelled.");
			runtime.exit(0);
			return;
		}
		for (const value of selection) scopes.add(value);
	}
	if (scopes.size === 0) {
		runtime.log("Nothing selected.");
		return;
	}
	if (interactive && !opts.yes) {
		const ok = await confirm({ message: stylePromptMessage("Proceed with uninstall?") });
		if (isCancel(ok) || !ok) {
			cancel(stylePromptTitle("Uninstall cancelled.") ?? "Uninstall cancelled.");
			runtime.exit(0);
			return;
		}
	}
	const dryRun = Boolean(opts.dryRun);
	let stateRemoved = false;
	const { stateDir, configPath, oauthDir, configInsideState, oauthInsideState, workspaceDirs } = resolveCleanupPlanFromDisk();
	if (scopes.has("state") || scopes.has("workspace")) logBackupRecommendation(runtime);
	if (scopes.has("service")) {
		if (dryRun) runtime.log("[dry-run] remove gateway service");
		else if (!await stopAndUninstallService(runtime)) {
			runtime.exit(1);
			return;
		}
	}
	if (scopes.has("state")) {
		if (!scopes.has("workspace")) for (const workspaceDir of workspaceDirs) {
			const legacyCleanup = await removeLegacyWorkspaceStateForReset(prepareLegacyWorkspaceStateReset(workspaceDir), { dryRun });
			for (const removedPath of legacyCleanup.removedPaths) if (dryRun) runtime.log(`[dry-run] remove ${shortenHomeInString(removedPath)}`);
			for (const warning of legacyCleanup.warnings) runtime.error(warning);
		}
		stateRemoved = await removeStateAndLinkedPaths({
			stateDir,
			configPath,
			oauthDir,
			configInsideState,
			oauthInsideState
		}, runtime, {
			dryRun,
			preservePaths: scopes.has("workspace") ? [] : workspaceDirs
		});
	}
	if (scopes.has("workspace")) await removeWorkspaceDirs(workspaceDirs, runtime, {
		dryRun,
		removeStateRows: !scopes.has("state") || !stateRemoved
	});
	if (scopes.has("app")) await removeMacApp(runtime, dryRun);
	runtime.log("CLI still installed. Remove via npm/pnpm if desired.");
	if (scopes.has("state") && !scopes.has("workspace")) {
		const home = resolveHomeDir();
		if (home && workspaceDirs.some((dir) => dir.startsWith(path.resolve(home)))) runtime.log("Tip: workspaces were preserved. Re-run with --workspace to remove them.");
	}
}
//#endregion
export { uninstallCommand };
