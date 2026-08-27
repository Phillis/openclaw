import { t as loggingState } from "./state-CNIDfzP9.js";
//#region src/cli/json-output-mode.ts
/** Detects CLI JSON mode before Commander parses options, stopping at the argv sentinel. */
function hasJsonOutputFlag(argv) {
	for (const arg of argv) {
		if (arg === "--") return false;
		if (arg === "--json" || arg.startsWith("--json=")) return true;
	}
	return false;
}
/** Keeps structured JSON stdout clean by routing incidental console logs to stderr. */
async function withConsoleLogsRoutedToStderrForJson(argv, run, options = {}) {
	const forceStderr = hasJsonOutputFlag(argv) || options.machineOutput;
	if (!forceStderr && !options.restoreChanges) return run();
	const previousForceStderr = loggingState.forceConsoleToStderr;
	const previousEarlyRestore = loggingState.earlyConsoleRoutingRestore;
	if (forceStderr) {
		loggingState.earlyConsoleRoutingRestore = previousForceStderr;
		loggingState.forceConsoleToStderr = true;
	}
	try {
		return await run();
	} finally {
		if (!options.retainRoutingUntilProcessExit) {
			loggingState.forceConsoleToStderr = previousForceStderr;
			loggingState.earlyConsoleRoutingRestore = previousEarlyRestore;
		}
	}
}
/** Let resolved command metadata override conservative early literal-flag routing. */
function applyResolvedCommandOutputMode(machineOutput) {
	const restore = loggingState.earlyConsoleRoutingRestore;
	if (!machineOutput && restore !== null) loggingState.forceConsoleToStderr = restore;
}
/** Route startup diagnostics to stderr while a command's output mode is still being discovered. */
async function withConsoleLogsRoutedToStderr(run) {
	const previousForceStderr = loggingState.forceConsoleToStderr;
	loggingState.forceConsoleToStderr = true;
	try {
		return await run();
	} finally {
		loggingState.forceConsoleToStderr = previousForceStderr;
	}
}
//#endregion
export { withConsoleLogsRoutedToStderrForJson as i, hasJsonOutputFlag as n, withConsoleLogsRoutedToStderr as r, applyResolvedCommandOutputMode as t };
