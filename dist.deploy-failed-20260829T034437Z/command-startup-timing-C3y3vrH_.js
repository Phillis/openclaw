//#region src/cli/command-startup-timing.ts
let diagnosticsTimelineModulePromise;
function hasDiagnosticsTimelinePath(env) {
	return Boolean(env.OPENCLAW_DIAGNOSTICS_TIMELINE_PATH?.trim());
}
function loadDiagnosticsTimelineModule() {
	diagnosticsTimelineModulePromise ??= import("./diagnostics-timeline-Cmlzzf8z.js");
	return diagnosticsTimelineModulePromise;
}
/** Measures command-specific work hidden inside Commander parse/action dispatch. */
async function measureCliCommandStartup(stage, run, options = {}) {
	const env = options.env ?? process.env;
	if (!hasDiagnosticsTimelinePath(env)) return await run();
	const { measureDiagnosticsTimelineSpan } = await loadDiagnosticsTimelineModule();
	return await measureDiagnosticsTimelineSpan("cli.command-startup", run, {
		config: options.config,
		env,
		phase: "cli.command-startup",
		attributes: { stage }
	});
}
//#endregion
export { measureCliCommandStartup as t };
