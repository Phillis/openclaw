#!/usr/bin/env node
import { i as formatUncaughtError } from "./errors-CSNUPl5U.js";
import { t as formatCliFailureLines } from "./failure-output-CWIoHaZk.js";
import { n as runCliWithExitFinalization } from "./one-shot-exit-exEwhVsw.js";
import { t as tryHandleRootVersionFastPath } from "./entry.version-fast-path-UdolbsW0.js";
import { r as runFatalErrorHooks } from "./fatal-error-hooks-Cu2jsdBV.js";
import { t as isMainModule } from "./is-main-CH4EEB_R.js";
import { n as isBenignUncaughtExceptionError, o as isUncaughtExceptionHandled, t as installUnhandledRejectionHandler } from "./unhandled-rejections-ELdqUxS7.js";
import process from "node:process";
import { fileURLToPath } from "node:url";
//#region src/index.ts
let applyTemplate;
let createDefaultDeps;
let deriveSessionKey;
let describePortOwner;
let ensureBinary;
let ensurePortAvailable;
let getReplyFromConfig;
let handlePortError;
let loadConfig;
/** @deprecated Use SQLite-backed session APIs. Scheduled for removal after 2026-10-12. */
let loadSessionStore;
let monitorWebChannel;
let normalizeE164;
let PortInUseError;
let promptYesNo;
let resolveSessionKey;
let resolveStorePath;
let runCommandWithTimeout;
let runExec;
/** @deprecated Use SQLite-backed session APIs. Scheduled for removal after 2026-10-12. */
let saveSessionStore;
let waitForever;
async function loadLegacyCliDeps() {
	const { runCli } = await import("./cli/run-main.js");
	return { runCli };
}
async function runLegacyCliEntry(argv = process.argv, deps, options) {
	const { runCli } = deps ?? await loadLegacyCliDeps();
	await runCli(argv, options);
}
const isMain = isMainModule({ currentFile: fileURLToPath(import.meta.url) });
const handledRootVersion = isMain && tryHandleRootVersionFastPath(process.argv);
if (!isMain) ({applyTemplate, createDefaultDeps, deriveSessionKey, describePortOwner, ensureBinary, ensurePortAvailable, getReplyFromConfig, handlePortError, loadConfig, loadSessionStore, monitorWebChannel, normalizeE164, PortInUseError, promptYesNo, resolveSessionKey, resolveStorePath, runCommandWithTimeout, runExec, saveSessionStore, waitForever} = await import("./library-CIIanZ3Z.js"));
if (isMain && !handledRootVersion) {
	const { restoreRuntimeTerminalState } = await import("./runtime-Dn74rUMz.js");
	installUnhandledRejectionHandler();
	process.on("uncaughtException", (error) => {
		if (isUncaughtExceptionHandled(error)) return;
		if (isBenignUncaughtExceptionError(error)) {
			console.warn("[openclaw] Non-fatal uncaught exception (continuing):", formatUncaughtError(error));
			return;
		}
		for (const line of formatCliFailureLines({
			title: "OpenClaw hit an unexpected runtime error.",
			error,
			argv: process.argv
		})) console.error(line);
		for (const message of runFatalErrorHooks({
			reason: "uncaught_exception",
			error
		})) console.error("[openclaw]", message);
		restoreRuntimeTerminalState("uncaught exception", { resumeStdinIfPaused: false });
		process.exit(1);
	});
	runCliWithExitFinalization({
		run: async () => await runLegacyCliEntry(process.argv, void 0, { retainConsoleRoutingUntilProcessExit: true }),
		onError: (err) => {
			for (const line of formatCliFailureLines({
				title: "The CLI command failed.",
				error: err,
				argv: process.argv
			})) console.error(line);
			for (const message of runFatalErrorHooks({
				reason: "legacy_cli_failure",
				error: err
			})) console.error("[openclaw]", message);
			restoreRuntimeTerminalState("legacy cli failure", { resumeStdinIfPaused: false });
			process.exitCode = 1;
		}
	});
}
//#endregion
export { PortInUseError, applyTemplate, createDefaultDeps, deriveSessionKey, describePortOwner, ensureBinary, ensurePortAvailable, getReplyFromConfig, handlePortError, loadConfig, loadSessionStore, monitorWebChannel, normalizeE164, promptYesNo, resolveSessionKey, resolveStorePath, runCommandWithTimeout, runExec, runLegacyCliEntry, saveSessionStore, waitForever };
