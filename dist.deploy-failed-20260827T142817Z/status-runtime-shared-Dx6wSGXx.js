import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.js";
import "./agent-scope-BizOtGGz.js";
import { n as normalizeAgentId } from "./agent-id-Db0rqw_J.js";
import { a as listAgentIds, g as resolveSystemAgentTargetAgentId, l as resolveAgentDir } from "./agent-scope-config-BdXMWufB.js";
import { a as listOpenAIAuthProfileProvidersForAgentRuntime } from "./openai-routing-BGuHAkXI.js";
import { w as resolveDefaultModelForAgent } from "./codex-route-model-ref-Bw2nFxxx.js";
import { t as resolveAgentHarnessPolicy } from "./policy-BHrZvZfs.js";
import "./program-args-C4pvyUF9.js";
import { a as resolveGatewayService, i as readGatewayServiceState } from "./service-CJsmassN.js";
import "./model-selection-BhpnS-Rv.js";
import { t as resolveModelAuthLabel } from "./model-auth-label-C5vnjQNq.js";
import { i as shouldUseCodexSyntheticUsageForRuntime, n as mergeUsageSummaries, r as resolveUsageCredentialType, t as buildCodexSyntheticUsageAuth } from "./codex-synthetic-usage-VnOvEYpQ.js";
import { t as resolveNodeService } from "./node-service-CLleNF9L.js";
import { t as summarizeGatewayServiceLayout } from "./service-layout-DxLOwPd3.js";
import { a as buildStatusOverviewSurfaceRows, t as buildGatewayStatusJsonPayload } from "./format-CpHI926M.js";
import { t as formatDaemonRuntimeShort } from "./status.format-CUfvMj2K.js";
//#region src/commands/status-overview-surface.ts
/** Converts the full status scan result into the shared overview surface. */
function buildStatusOverviewSurfaceFromScan(params) {
	return {
		cfg: params.scan.cfg,
		update: params.scan.update,
		tailscaleMode: params.scan.tailscaleMode,
		tailscaleDns: params.scan.tailscaleDns,
		tailscaleHttpsUrl: params.scan.tailscaleHttpsUrl,
		...params.scan.advertisedControlUiLinks ? { advertisedControlUiLinks: params.scan.advertisedControlUiLinks } : {},
		gatewayMode: params.scan.gatewayMode,
		remoteUrlMissing: params.scan.remoteUrlMissing,
		gatewayConnection: params.scan.gatewayConnection,
		gatewayReachable: params.scan.gatewayReachable,
		gatewayProbe: params.scan.gatewayProbe,
		gatewayProbeAuth: params.scan.gatewayProbeAuth,
		gatewayProbeAuthWarning: params.scan.gatewayProbeAuthWarning,
		gatewaySelf: params.scan.gatewaySelf,
		gatewayService: params.gatewayService,
		nodeService: params.nodeService,
		nodeOnlyGateway: params.nodeOnlyGateway
	};
}
/** Converts the lighter status-all overview scan into the shared overview surface. */
function buildStatusOverviewSurfaceFromOverview(params) {
	return buildStatusOverviewSurfaceFromScan({
		scan: {
			...params.overview,
			...params.overview.gatewaySnapshot
		},
		gatewayService: params.gatewayService,
		nodeService: params.nodeService,
		nodeOnlyGateway: params.nodeOnlyGateway
	});
}
/** Builds overview rows from an already-normalized surface. */
function buildStatusOverviewRowsFromSurface(params) {
	const { surface, ...options } = params;
	return buildStatusOverviewSurfaceRows({
		...surface,
		...options
	});
}
/** Builds the gateway JSON payload from the gateway portion of an overview surface. */
function buildStatusGatewayJsonPayloadFromSurface(params) {
	return buildGatewayStatusJsonPayload(params.surface);
}
//#endregion
//#region src/commands/status.service-summary.ts
function normalizeServiceWrapperPath(command) {
	return command?.environment?.["OPENCLAW_WRAPPER"]?.trim() || void 0;
}
/** Reads a daemon service summary, falling back to unknown when service inspection fails. */
async function readServiceStatusSummary(service, fallbackLabel, timeoutMs) {
	try {
		const state = await readGatewayServiceState(service, {
			env: process.env,
			timeoutMs
		});
		const layout = await summarizeGatewayServiceLayout(state.command).catch(() => void 0);
		const wrapperPath = normalizeServiceWrapperPath(state.command);
		const managedByOpenClaw = state.installed;
		const externallyManaged = !managedByOpenClaw && state.running;
		const installed = managedByOpenClaw || externallyManaged;
		const loadedText = externallyManaged ? "running (externally managed)" : state.loaded ? service.loadedText : service.notLoadedText;
		return {
			label: service.label,
			installed,
			loaded: state.loaded,
			managedByOpenClaw,
			externallyManaged,
			loadedText,
			runtime: state.runtime,
			...layout ? { layout } : {},
			...wrapperPath ? { wrapperPath } : {}
		};
	} catch {
		return {
			label: fallbackLabel,
			installed: null,
			loaded: false,
			managedByOpenClaw: false,
			externallyManaged: false,
			loadedText: "unknown",
			runtime: void 0
		};
	}
}
//#endregion
//#region src/commands/status.daemon.ts
async function buildDaemonStatusSummary(serviceLabel, timeoutMs) {
	const summary = await readServiceStatusSummary(serviceLabel === "gateway" ? resolveGatewayService() : resolveNodeService(), serviceLabel === "gateway" ? "Daemon" : "Node", timeoutMs);
	return {
		label: summary.label,
		installed: summary.installed,
		loaded: summary.loaded,
		managedByOpenClaw: summary.managedByOpenClaw,
		externallyManaged: summary.externallyManaged,
		loadedText: summary.loadedText,
		runtime: summary.runtime,
		runtimeShort: formatDaemonRuntimeShort(summary.runtime),
		layout: summary.layout,
		wrapperPath: summary.wrapperPath
	};
}
/** Returns the gateway daemon status summary. */
async function getDaemonStatusSummary(timeoutMs) {
	return await buildDaemonStatusSummary("gateway", timeoutMs);
}
/** Returns the node service status summary. */
async function getNodeDaemonStatusSummary(timeoutMs) {
	return await buildDaemonStatusSummary("node", timeoutMs);
}
//#endregion
//#region src/commands/status-runtime-shared.ts
const providerUsageLoader = createLazyImportLoader(() => import("./provider-usage-BfpbCdnP.js"));
const securityAuditModuleLoader = createLazyImportLoader(() => import("./audit.runtime.js"));
const readOnlyChannelPluginsModuleLoader = createLazyImportLoader(() => import("./read-only-Cdsva2o0.js"));
const gatewayCallModuleLoader = createLazyImportLoader(() => import("./call-n89JPEIA.js"));
function loadProviderUsage() {
	return providerUsageLoader.load();
}
function loadSecurityAuditModule() {
	return securityAuditModuleLoader.load();
}
function loadReadOnlyChannelPluginsModule() {
	return readOnlyChannelPluginsModuleLoader.load();
}
function loadGatewayCallModule() {
	return gatewayCallModuleLoader.load();
}
function shouldUseConfiguredCodexSyntheticUsage(params) {
	const configuredDefault = resolveDefaultModelForAgent({
		cfg: params.config,
		agentId: params.agentId,
		allowPluginNormalization: false
	});
	const policy = resolveAgentHarnessPolicy({
		config: params.config,
		agentId: params.agentId,
		provider: configuredDefault.provider,
		modelId: configuredDefault.model
	});
	if (!shouldUseCodexSyntheticUsageForRuntime({
		provider: configuredDefault.provider,
		effectiveHarness: policy.runtime
	})) return false;
	return resolveUsageCredentialType(resolveModelAuthLabel({
		provider: configuredDefault.provider,
		acceptedProviderIds: listOpenAIAuthProfileProvidersForAgentRuntime({
			provider: configuredDefault.provider,
			harnessRuntime: policy.runtime,
			config: params.config
		}),
		cfg: params.config,
		agentDir: params.agentDir,
		includeExternalProfiles: false
	})) !== "api_key";
}
/** Runs the lightweight security audit used by status JSON/all output. */
async function resolveStatusSecurityAudit(params) {
	const { runSecurityAudit } = await loadSecurityAuditModule();
	const { resolveReadOnlyChannelPluginsForConfig } = await loadReadOnlyChannelPluginsModule();
	const readOnlyPlugins = resolveReadOnlyChannelPluginsForConfig(params.config, {
		activationSourceConfig: params.sourceConfig,
		includeSetupFallbackPlugins: false
	});
	return await runSecurityAudit({
		config: params.config,
		sourceConfig: params.sourceConfig,
		deep: false,
		...params.timeoutMs !== void 0 ? { deepTimeoutMs: params.timeoutMs } : {},
		includeFilesystem: true,
		includeChannelSecurity: true,
		loadPluginSecurityCollectors: false,
		...readOnlyPlugins.missingConfiguredChannelIds.length === 0 ? { plugins: readOnlyPlugins.plugins } : {}
	});
}
/** Loads provider usage for status output from an explicit or ambient system-agent scope. */
async function resolveStatusUsageSummary(params) {
	const { loadProviderUsageSummary } = await loadProviderUsage();
	const rawAgentId = params.agentId?.trim();
	if (params.agentId !== void 0 && !rawAgentId) throw new Error("--agent must not be blank");
	const agentId = rawAgentId ? normalizeAgentId(rawAgentId) : void 0;
	if (agentId && !listAgentIds(params.config).includes(agentId)) throw new Error(`Unknown agent id "${agentId}". Run \`openclaw agents list\` to see configured agents.`);
	let resolvedAgentId = agentId;
	let agentDir = params.agentDir;
	if (!agentDir) {
		resolvedAgentId ??= resolveSystemAgentTargetAgentId(params.config);
		agentDir = resolveAgentDir(params.config, resolvedAgentId);
	}
	const usage = await loadProviderUsageSummary({
		timeoutMs: params.timeoutMs,
		config: params.config,
		agentDir
	});
	if (!shouldUseConfiguredCodexSyntheticUsage({
		config: params.config,
		agentDir,
		agentId: resolvedAgentId
	})) return usage;
	return mergeUsageSummaries(usage, await loadProviderUsageSummary({
		timeoutMs: params.timeoutMs,
		providers: ["openai"],
		auth: [buildCodexSyntheticUsageAuth()],
		config: params.config,
		agentDir
	}));
}
/** Exposes the lazily loaded provider-usage module for callers that need its helpers. */
async function loadStatusProviderUsageModule() {
	return await loadProviderUsage();
}
/** Calls gateway health and lets errors propagate to deep status callers. */
async function resolveStatusGatewayHealth(params) {
	const { callGateway } = await loadGatewayCallModule();
	return await callGateway({
		method: "health",
		params: { probe: true },
		timeoutMs: params.timeoutMs,
		config: params.config
	});
}
/** Calls gateway health but converts unreachable/failing probes into an error object. */
async function resolveStatusGatewayHealthSafe(params) {
	if (!params.gatewayReachable) return { error: params.gatewayProbeError ?? "gateway unreachable" };
	const { callGateway } = await loadGatewayCallModule();
	return await callGateway({
		method: "health",
		params: { probe: true },
		timeoutMs: params.timeoutMs,
		config: params.config,
		...params.callOverrides
	}).catch((err) => ({ error: String(err) }));
}
/** Reads gateway delivery diagnostics when reachable, returning null on failures. */
async function resolveStatusGatewayDiagnosticsSafe(params) {
	if (!params.gatewayReachable) return null;
	const { callGateway } = await loadGatewayCallModule();
	return await callGateway({
		method: "diagnostics.stability",
		params: {
			limit: 1e3,
			...params.type ? { type: params.type } : {}
		},
		timeoutMs: params.timeoutMs,
		config: params.config,
		...params.callOverrides
	}).catch(() => null);
}
/** Reads the most recent gateway heartbeat only when the gateway probe succeeded. */
async function resolveStatusLastHeartbeat(params) {
	if (!params.gatewayReachable) return null;
	const { callGateway } = await loadGatewayCallModule();
	return await callGateway({
		method: "last-heartbeat",
		params: {},
		timeoutMs: params.timeoutMs,
		config: params.config
	}).catch(() => null);
}
const DEFAULT_SERVICE_PROBE_TIMEOUT_MS = 5e3;
/** Resolves launchd/systemd summaries for the gateway and node services together. */
async function resolveStatusServiceSummaries(timeoutMs) {
	const probeTimeoutMs = timeoutMs ?? DEFAULT_SERVICE_PROBE_TIMEOUT_MS;
	return await Promise.all([getDaemonStatusSummary(probeTimeoutMs), getNodeDaemonStatusSummary(probeTimeoutMs)]);
}
/** Resolves optional usage/deep runtime details plus service summaries for status output. */
async function resolveStatusRuntimeDetails(params) {
	const resolveUsageSummary = params.resolveUsage ?? resolveStatusUsageSummary;
	const resolveGatewayHealthSummary = params.resolveHealth ?? resolveStatusGatewayHealth;
	const usage = params.usage ? await resolveUsageSummary({
		timeoutMs: params.timeoutMs,
		config: params.config,
		...params.agentId ? { agentId: params.agentId } : {}
	}) : void 0;
	const health = params.deep ? params.suppressHealthErrors ? await resolveGatewayHealthSummary({
		config: params.config,
		timeoutMs: params.timeoutMs
	}).catch((error) => ({ error: String(error) })) : await resolveGatewayHealthSummary({
		config: params.config,
		timeoutMs: params.timeoutMs
	}) : void 0;
	const lastHeartbeat = params.deep ? await resolveStatusLastHeartbeat({
		config: params.config,
		timeoutMs: params.timeoutMs,
		gatewayReachable: params.gatewayReachable
	}) : null;
	const [gatewayService, nodeService] = await resolveStatusServiceSummaries(params.timeoutMs);
	return {
		usage,
		health,
		lastHeartbeat,
		gatewayService,
		nodeService
	};
}
/** Resolves the full runtime snapshot, including optional security audit, for status JSON/text. */
async function resolveStatusRuntimeSnapshot(params) {
	return {
		securityAudit: params.includeSecurityAudit ? await (params.resolveSecurityAudit ?? resolveStatusSecurityAudit)({
			config: params.config,
			sourceConfig: params.sourceConfig,
			timeoutMs: params.timeoutMs
		}) : void 0,
		...await resolveStatusRuntimeDetails({
			config: params.config,
			timeoutMs: params.timeoutMs,
			...params.agentId ? { agentId: params.agentId } : {},
			usage: params.usage,
			deep: params.deep,
			gatewayReachable: params.gatewayReachable,
			suppressHealthErrors: params.suppressHealthErrors,
			resolveUsage: params.resolveUsage,
			resolveHealth: params.resolveHealth
		})
	};
}
//#endregion
export { resolveStatusRuntimeSnapshot as a, resolveStatusUsageSummary as c, buildStatusOverviewSurfaceFromOverview as d, buildStatusOverviewSurfaceFromScan as f, resolveStatusGatewayHealthSafe as i, buildStatusGatewayJsonPayloadFromSurface as l, resolveStatusGatewayDiagnosticsSafe as n, resolveStatusSecurityAudit as o, resolveStatusGatewayHealth as r, resolveStatusServiceSummaries as s, loadStatusProviderUsageModule as t, buildStatusOverviewRowsFromSurface as u };
