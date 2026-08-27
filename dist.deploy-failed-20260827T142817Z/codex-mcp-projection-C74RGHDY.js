import "./cron-creator-authority-context-BG0LP5g5.js";
import "./bundle-mcp-codex-vZRsCV_N.js";
//#region src/plugin-sdk/codex-mcp-projection.ts
/** Materialize static configured MCP under a scheduled Codex authority envelope. */
async function materializeStaticMcpToolsForScheduledHarnessRun(params) {
	const { materializeStaticMcpToolsForScheduledHarnessRunCore: materialize } = await import("./agent-bundle-mcp-harness-DRQ7YNUN.js");
	return materialize(params);
}
/** Capture the final Codex dynamic-tool surface for cron creator authority. */
async function captureFinalCodexCronCreatorToolAllowlist(target, captureRef, tools) {
	const [{ captureFinalEffectiveCronCreatorToolAllowlist: capture }, { getPluginToolMeta }] = await Promise.all([import("./cron-tool-CdI7OCyh.js"), import("./plugins/tools.js")]);
	return capture(target, captureRef, tools, (tool) => getPluginToolMeta(tool));
}
//#endregion
export { materializeStaticMcpToolsForScheduledHarnessRun as n, captureFinalCodexCronCreatorToolAllowlist as t };
