import "./cron-creator-authority-context-HcTMUl6U.js";
import "./bundle-mcp-codex-D1L1h1lc.js";
//#region src/plugin-sdk/codex-mcp-projection.ts
/** Materialize static configured MCP under a scheduled Codex authority envelope. */
async function materializeStaticMcpToolsForScheduledHarnessRun(params) {
	const { materializeStaticMcpToolsForScheduledHarnessRunCore: materialize } = await import("./agent-bundle-mcp-harness-D23xm-5I.js");
	return materialize(params);
}
/** Capture the final Codex dynamic-tool surface for cron creator authority. */
async function captureFinalCodexCronCreatorToolAllowlist(target, captureRef, tools) {
	const [{ captureFinalEffectiveCronCreatorToolAllowlist: capture }, { getPluginToolMeta }] = await Promise.all([import("./cron-tool-B5dzpUeJ.js"), import("./plugins/tools.js")]);
	return capture(target, captureRef, tools, (tool) => getPluginToolMeta(tool));
}
//#endregion
export { materializeStaticMcpToolsForScheduledHarnessRun as n, captureFinalCodexCronCreatorToolAllowlist as t };
