import { r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
import { n as logError } from "./logger-D4iLuGk3.js";
import { r as logVerbose } from "./globals-GZNLg1ns.js";
import { s as requireCommandFlagEnabled } from "./command-gates-BN6pp6B0.js";
import { i as formatDetailedPluginHealth } from "./status-plugin-health-BdTMptTh.js";
import { t as buildStatusReplyParts } from "./status-text-BglSX_XA.js";
//#region src/auto-reply/reply/commands-status.ts
/** Builds /status replies using the command's authorized channel context. */
/** Builds a status reply or suppresses unauthorized status requests. */
async function buildStatusReply(params) {
	const { command } = params;
	if (!command.isAuthorizedSender) {
		logVerbose(`Ignoring /status from unauthorized sender: ${command.senderId || "<unknown>"}`);
		return;
	}
	try {
		const { text, presentation } = await buildStatusReplyParts({
			...params,
			statusChannel: command.channel,
			statusAccountId: command.accountId
		});
		return {
			text,
			presentation,
			presentationTextMode: "fallback"
		};
	} catch (error) {
		logError(`/status render failed: ${formatErrorMessage(error)}`);
		return { text: "⚠️ Status: error rendering response" };
	}
}
async function buildStatusPluginsReply(params) {
	const { command } = params;
	if (!command.isAuthorizedSender) {
		logVerbose(`Ignoring /status plugins from unauthorized sender: ${command.senderId || "<unknown>"}`);
		return;
	}
	const disabled = requireCommandFlagEnabled(params.cfg, {
		label: "/status plugins",
		configKey: "plugins"
	});
	if (disabled) return disabled.reply;
	try {
		const { collectInstalledPluginHealthSnapshot } = await import("./status-plugin-health.runtime.js");
		return { text: formatDetailedPluginHealth(await collectInstalledPluginHealthSnapshot({
			config: params.cfg,
			workspaceDir: params.workspaceDir
		})) };
	} catch (error) {
		logError(`/status plugins render failed: ${formatErrorMessage(error)}`);
		return { text: "⚠️ Plugins: health unavailable" };
	}
}
//#endregion
export { buildStatusReply as n, buildStatusPluginsReply as t };
