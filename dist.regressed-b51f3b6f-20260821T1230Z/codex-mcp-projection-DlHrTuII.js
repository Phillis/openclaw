import "./cron-creator-authority-context-HcTMUl6U.js";
import "./bundle-mcp-codex-DG1rYuI0.js";
//#region src/plugin-sdk/codex-mcp-projection.ts
/** Materialize static configured MCP under a scheduled Codex authority envelope. */
async function materializeStaticMcpToolsForScheduledHarnessRun(params) {
	const { materializeStaticMcpToolsForScheduledHarnessRunCore: materialize } = await import("./agent-bundle-mcp-harness-41a531S1.js");
	return materialize(params);
}
/** Capture the final Codex dynamic-tool surface for cron creator authority. */
async function captureFinalCodexCronCreatorToolAllowlist(target, captureRef, tools) {
	const [{ captureFinalEffectiveCronCreatorToolAllowlist: capture }, { getPluginToolMeta }] = await Promise.all([import("./cron-tool-BLHhiYxR.js"), import("./plugins/tools.js")]);
	return capture(target, captureRef, tools, (tool) => getPluginToolMeta(tool));
}
//#endregion
export { materializeStaticMcpToolsForScheduledHarnessRun as n, captureFinalCodexCronCreatorToolAllowlist as t };
