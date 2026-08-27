import { a as writeRuntimeJson } from "./runtime-LRpY2Icg.js";
import { r as readBackupFreshness } from "./backup-health-Dx0sUrEb.js";
import { m as resolveStatusUpdateChannelInfo } from "./format-DzOpGxRr.js";
import { a as resolveStatusRuntimeSnapshot, f as buildStatusOverviewSurfaceFromScan, l as buildStatusGatewayJsonPayloadFromSurface } from "./status-runtime-shared-CRkpabcE.js";
//#region src/commands/status-json-payload.ts
/** Combines scan summary, overview surface, services, agents, diagnostics, and optional deep probes. */
function buildStatusJsonPayload(params) {
	const channelInfo = resolveStatusUpdateChannelInfo({
		updateConfigChannel: params.surface.cfg.update?.channel ?? void 0,
		update: params.surface.update
	});
	return {
		...params.summary,
		os: params.osSummary,
		update: params.surface.update,
		updateChannel: channelInfo.channel,
		updateChannelSource: channelInfo.source,
		memory: params.memory,
		memoryPlugin: params.memoryPlugin,
		gateway: buildStatusGatewayJsonPayloadFromSurface({ surface: params.surface }),
		gatewayService: params.surface.gatewayService,
		nodeService: params.surface.nodeService,
		agents: params.agents,
		...params.configDiagnostics ? { configDiagnostics: params.configDiagnostics } : {},
		secretDiagnostics: params.secretDiagnostics,
		...params.securityAudit ? { securityAudit: params.securityAudit } : {},
		...params.pluginCompatibility ? { pluginCompatibility: {
			count: params.pluginCompatibility.length,
			warnings: params.pluginCompatibility
		} } : {},
		...params.health || params.usage || params.lastHeartbeat ? {
			health: params.health,
			usage: params.usage,
			lastHeartbeat: params.lastHeartbeat
		} : {}
	};
}
//#endregion
//#region src/commands/status-json-runtime.ts
/** Builds the status JSON object from a completed scan plus optional runtime/deep probes. */
async function resolveStatusJsonOutput(params) {
	const { scan, opts } = params;
	const { securityAudit, usage, health, lastHeartbeat, gatewayService, nodeService } = await resolveStatusRuntimeSnapshot({
		config: scan.cfg,
		sourceConfig: scan.sourceConfig,
		timeoutMs: opts.timeoutMs,
		...opts.agent ? { agentId: opts.agent } : {},
		usage: opts.usage,
		deep: opts.deep,
		gatewayReachable: scan.gatewayReachable,
		includeSecurityAudit: params.includeSecurityAudit,
		suppressHealthErrors: params.suppressHealthErrors
	});
	const payload = buildStatusJsonPayload({
		summary: scan.summary,
		surface: buildStatusOverviewSurfaceFromScan({
			scan,
			gatewayService,
			nodeService
		}),
		osSummary: scan.osSummary,
		memory: scan.memory,
		memoryPlugin: scan.memoryPlugin,
		agents: scan.agentStatus,
		configDiagnostics: scan.configDiagnostics,
		secretDiagnostics: scan.secretDiagnostics,
		securityAudit,
		health,
		usage,
		lastHeartbeat,
		pluginCompatibility: params.includePluginCompatibility ? scan.pluginCompatibility : void 0
	});
	const backups = readBackupFreshness(scan.env ?? {});
	if (backups.latest || backups.latestOk) Object.assign(payload, { backups });
	return payload;
}
//#endregion
//#region src/commands/status-json-command.ts
/** Prevents --agent from implying that the aggregate status report itself is agent-scoped. */
function assertStatusUsageAgentScope(opts) {
	if (opts.agent !== void 0 && opts.usage !== true) throw new Error("--agent is only valid with --usage");
}
/** Runs the fast status scan, resolves optional deep fields, and writes JSON through the runtime. */
async function runStatusJsonCommand(params) {
	assertStatusUsageAgentScope(params.opts);
	const scan = await params.scanStatusJsonFast({
		timeoutMs: params.opts.timeoutMs,
		all: params.opts.all
	}, params.runtime);
	writeRuntimeJson(params.runtime, await resolveStatusJsonOutput({
		scan,
		opts: params.opts,
		includeSecurityAudit: params.includeSecurityAudit,
		includePluginCompatibility: params.includePluginCompatibility,
		suppressHealthErrors: params.suppressHealthErrors
	}));
}
//#endregion
export { runStatusJsonCommand as n, assertStatusUsageAgentScope as t };
