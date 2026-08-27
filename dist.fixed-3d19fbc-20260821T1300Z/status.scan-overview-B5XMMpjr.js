import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.js";
import { f as resolveConfigPath } from "./paths-CqeDjSA4.js";
import { n as runExec } from "./exec-Cmwsxh9J.js";
import { t as createEmptyTaskRegistrySummary } from "./task-registry.summary-BwpoHlXv.js";
import { n as createEmptyTaskAuditSummary } from "./task-registry.audit.shared-CycXrHpp.js";
import { r as resolveOsSummary } from "./os-summary-q1rQKLEc.js";
import { t as resolveGatewayAuthTokenSourceConflict } from "./auth-token-source-conflict-Bv2r7TNj.js";
import { n as resolveGatewayProbeSnapshot, t as buildTailscaleHttpsUrl } from "./status.scan.shared-C9P5gP2K.js";
import { existsSync } from "node:fs";
//#region src/commands/status.scan.bootstrap-shared.ts
function buildColdStartUpdateResult() {
	return {
		root: null,
		installKind: "unknown",
		packageManager: "unknown"
	};
}
function buildColdStartAgentLocalStatuses() {
	return {
		defaultId: "main",
		agents: [],
		totalSessions: 0,
		bootstrapPendingCount: 0
	};
}
/** Builds an empty summary for cold-start status paths that skip network and session work. */
function buildColdStartStatusSummary() {
	return {
		runtimeVersion: null,
		heartbeat: {
			defaultAgentId: "main",
			agents: []
		},
		channelSummary: [],
		queuedSystemEvents: [],
		degradedSecretOwners: [],
		tasks: createEmptyTaskRegistrySummary(),
		taskAudit: createEmptyTaskAuditSummary(),
		sessions: {
			paths: [],
			count: 0,
			defaults: {
				model: null,
				contextTokens: null
			},
			recent: [],
			byAgent: []
		}
	};
}
function shouldSkipStatusScanNetworkChecks(params) {
	return params.coldStart && !params.hasConfiguredChannels && params.all !== true;
}
/** Starts the common async probes used by status scans and exposes their promises to callers. */
async function createStatusScanCoreBootstrap(params) {
	const tailscaleMode = params.cfg.gateway?.tailscale?.mode ?? "off";
	const skipColdStartNetworkChecks = shouldSkipStatusScanNetworkChecks({
		coldStart: params.coldStart,
		hasConfiguredChannels: params.hasConfiguredChannels,
		all: params.opts.all
	});
	const statusTimeoutMs = params.opts.timeoutMs ?? 1e4;
	const updateTimeoutMs = Math.min(params.opts.all ? 6500 : 2500, statusTimeoutMs);
	const tailscaleTimeoutMs = Math.min(1200, statusTimeoutMs);
	const tailscaleDnsPromise = tailscaleMode === "off" ? Promise.resolve(null) : params.getTailnetHostname((cmd, args) => runExec(cmd, args, {
		timeoutMs: tailscaleTimeoutMs,
		maxBuffer: 2e5
	})).catch(() => null);
	return {
		tailscaleMode,
		tailscaleDnsPromise,
		updatePromise: skipColdStartNetworkChecks || params.skipUpdateCheck === true ? Promise.resolve(buildColdStartUpdateResult()) : params.getUpdateCheckResult({
			timeoutMs: updateTimeoutMs,
			fetchGit: params.fetchGitUpdate ?? true,
			includeRegistry: params.includeRegistryUpdate ?? true,
			updateConfigChannel: params.cfg.update?.channel ?? null
		}),
		agentStatusPromise: skipColdStartNetworkChecks ? Promise.resolve(buildColdStartAgentLocalStatuses()) : params.getAgentLocalStatuses(params.cfg),
		gatewayProbePromise: resolveGatewayProbeSnapshot({
			cfg: params.cfg,
			opts: {
				...params.opts,
				...params.gatewayProbeTimeoutMs !== void 0 ? { timeoutMs: params.gatewayProbeTimeoutMs } : {},
				...skipColdStartNetworkChecks ? { skipProbe: true } : {},
				localStatusRpcFallback: params.includeLocalStatusRpcFallback !== false
			}
		}),
		skipColdStartNetworkChecks,
		resolveTailscaleHttpsUrl: async () => buildTailscaleHttpsUrl({
			tailscaleMode,
			tailscaleDns: await tailscaleDnsPromise,
			serviceName: params.cfg.gateway?.tailscale?.serviceName,
			controlUiBasePath: params.cfg.gateway?.controlUi?.basePath
		})
	};
}
//#endregion
//#region src/commands/status.scan.config-shared.ts
/** Returns true when tests should avoid the missing-config cold-start fast path. */
function shouldSkipStatusScanMissingConfigFastPath(env = process.env) {
	return env.VITEST === "true" || env.VITEST_POOL_ID !== void 0 || env.NODE_ENV === "test";
}
/** Returns whether status should treat this run as a no-config cold start. */
function resolveStatusScanColdStart(params) {
	const env = params?.env ?? process.env;
	return !(params?.allowMissingConfigFastPath === true && shouldSkipStatusScanMissingConfigFastPath(env)) && !existsSync(resolveConfigPath(env));
}
/** Loads best-effort config, resolves read-only secrets, and appends status secret diagnostics. */
async function loadStatusScanCommandConfig(params) {
	const env = params.env ?? process.env;
	const coldStart = resolveStatusScanColdStart({
		env,
		allowMissingConfigFastPath: params.allowMissingConfigFastPath
	});
	const configSnapshot = coldStart && params.allowMissingConfigFastPath === true ? {
		config: {},
		sourceConfig: {}
	} : await params.readConfigSnapshot();
	const loadedConfig = configSnapshot.config;
	const sourceConfig = configSnapshot.sourceConfig;
	const { resolvedConfig, diagnostics } = coldStart && params.allowMissingConfigFastPath === true ? {
		resolvedConfig: loadedConfig,
		diagnostics: []
	} : await params.resolveConfig(loadedConfig);
	const tokenConflict = resolveGatewayAuthTokenSourceConflict({
		cfg: sourceConfig,
		env
	});
	return {
		coldStart,
		sourceConfig,
		resolvedConfig,
		secretDiagnostics: tokenConflict ? [...diagnostics, tokenConflict.diagnostic] : diagnostics
	};
}
//#endregion
//#region src/commands/status.scan-overview.ts
const statusScanDepsRuntimeModuleLoader = createLazyImportLoader(() => import("./status.scan.deps.runtime.js"));
const statusAgentLocalModuleLoader = createLazyImportLoader(() => import("./status.agent-local-KPZm3oQA.js"));
const statusUpdateModuleLoader = createLazyImportLoader(() => import("./status.update-B3tZRO9w.js"));
const statusScanRuntimeModuleLoader = createLazyImportLoader(() => import("./status.scan.runtime.js"));
const gatewayCallModuleLoader = createLazyImportLoader(() => import("./call-DrR5WyUw.js"));
const statusSummaryModuleLoader = createLazyImportLoader(() => import("./summary-B-7VvRCB.js"));
const channelPluginIdsModuleLoader = createLazyImportLoader(() => import("./channel-plugin-ids-DQa7NuQe.js"));
const configModuleLoader = createLazyImportLoader(() => import("./config/config.js"));
const controlUiLinksModuleLoader = createLazyImportLoader(() => import("./control-ui-links-DByEu-g2.js"));
const commandConfigResolutionModuleLoader = createLazyImportLoader(() => import("./command-config-resolution-DWEhiM2P.js"));
const commandSecretTargetsModuleLoader = createLazyImportLoader(() => import("./command-secret-targets-CtRjlfoY.js"));
async function resolveStatusChannelsStatus(params) {
	if (!params.gatewayReachable) return null;
	const { callGateway } = await gatewayCallModuleLoader.load();
	return await callGateway({
		config: params.cfg,
		method: "channels.status",
		params: {
			probe: false,
			timeoutMs: Math.min(8e3, params.opts.timeoutMs ?? 1e4)
		},
		timeoutMs: Math.min(params.opts.all ? 5e3 : 2500, params.opts.timeoutMs ?? 1e4),
		...params.useGatewayCallOverrides === true ? params.gatewayCallOverrides ?? {} : {}
	}).catch(() => null);
}
/** Collects the common status scan data shared by text, JSON, and status-all commands. */
async function collectStatusScanOverview(params) {
	const env = params.env ?? process.env;
	if (params.labels?.loadingConfig) params.progress?.setLabel(params.labels.loadingConfig);
	const { coldStart, sourceConfig, resolvedConfig: cfg, secretDiagnostics } = await loadStatusScanCommandConfig({
		env,
		commandName: params.commandName,
		allowMissingConfigFastPath: params.allowMissingConfigFastPath,
		readConfigSnapshot: async () => (await configModuleLoader.load()).readBestEffortConfigSnapshot({
			observe: false,
			skipPluginValidation: params.skipConfigPluginValidation
		}),
		resolveConfig: async (loadedConfig) => await (await commandConfigResolutionModuleLoader.load()).resolveCommandConfigWithSecrets({
			config: loadedConfig,
			commandName: params.commandName,
			targetIds: (await commandSecretTargetsModuleLoader.load()).getStatusCommandSecretTargetIds(loadedConfig, env, { includeChannelTargets: params.includeChannelSecretTargets }),
			mode: "read_only_status",
			...params.runtime ? { runtime: params.runtime } : {}
		})
	});
	params.progress?.tick();
	const hasConfiguredChannels = params.resolveHasConfiguredChannels ? await params.resolveHasConfiguredChannels(cfg, sourceConfig) : await channelPluginIdsModuleLoader.load().then(({ hasConfiguredChannelsForReadOnlyScope }) => hasConfiguredChannelsForReadOnlyScope({
		config: cfg,
		activationSourceConfig: sourceConfig
	}));
	const osSummary = resolveOsSummary();
	const gatewayProbeTimeoutMs = typeof params.gatewayProbeTimeoutMs === "function" ? params.gatewayProbeTimeoutMs(cfg) : params.gatewayProbeTimeoutMs;
	const bootstrap = await createStatusScanCoreBootstrap({
		coldStart,
		cfg,
		hasConfiguredChannels,
		opts: params.opts,
		skipUpdateCheck: params.skipUpdateCheck,
		fetchGitUpdate: params.fetchGitUpdate,
		includeRegistryUpdate: params.includeRegistryUpdate,
		includeLocalStatusRpcFallback: params.includeLocalStatusRpcFallback,
		gatewayProbeTimeoutMs,
		getTailnetHostname: async (runner) => {
			return await statusScanDepsRuntimeModuleLoader.load().then(({ getTailnetHostname }) => getTailnetHostname(runner));
		},
		getUpdateCheckResult: async (updateParams) => await statusUpdateModuleLoader.load().then(({ getUpdateCheckResult }) => getUpdateCheckResult(updateParams)),
		getAgentLocalStatuses: async (bootstrapCfg) => await statusAgentLocalModuleLoader.load().then(({ getAgentLocalStatuses }) => getAgentLocalStatuses(bootstrapCfg))
	});
	if (params.labels?.checkingTailscale) params.progress?.setLabel(params.labels.checkingTailscale);
	const tailscaleDns = await bootstrap.tailscaleDnsPromise;
	params.progress?.tick();
	if (params.labels?.checkingForUpdates) params.progress?.setLabel(params.labels.checkingForUpdates);
	const update = await bootstrap.updatePromise;
	params.progress?.tick();
	if (params.labels?.resolvingAgents) params.progress?.setLabel(params.labels.resolvingAgents);
	const agentStatus = await bootstrap.agentStatusPromise;
	params.progress?.tick();
	if (params.labels?.probingGateway) params.progress?.setLabel(params.labels.probingGateway);
	const gatewaySnapshot = await bootstrap.gatewayProbePromise;
	params.progress?.tick();
	const tailscaleHttpsUrl = await bootstrap.resolveTailscaleHttpsUrl();
	const advertisedControlUiLinks = params.includeAdvertisedControlUiLinks === true && cfg.gateway?.controlUi?.enabled !== false ? await controlUiLinksModuleLoader.load().then(async ({ resolveAdvertisedControlUiLinks }) => resolveAdvertisedControlUiLinks({
		port: (await configModuleLoader.load()).resolveGatewayPort(cfg),
		bind: cfg.gateway?.bind,
		customBindHost: cfg.gateway?.customBindHost,
		basePath: cfg.gateway?.controlUi?.basePath,
		tlsEnabled: cfg.gateway?.tls?.enabled === true
	})) : void 0;
	const includeChannelsData = params.includeChannelsData !== false;
	const includeLiveChannelStatus = params.includeLiveChannelStatus !== false;
	const { channelsStatus, channelIssues, channels } = includeChannelsData ? await (async () => {
		if (params.labels?.queryingChannelStatus) params.progress?.setLabel(params.labels.queryingChannelStatus);
		const channelsStatusLocal = includeLiveChannelStatus ? await resolveStatusChannelsStatus({
			cfg,
			gatewayReachable: gatewaySnapshot.gatewayReachable,
			opts: params.opts,
			gatewayCallOverrides: gatewaySnapshot.gatewayCallOverrides,
			useGatewayCallOverrides: params.useGatewayCallOverridesForChannelsStatus
		}) : null;
		params.progress?.tick();
		const { collectChannelStatusIssues, buildChannelsTable } = await statusScanRuntimeModuleLoader.load().then(({ statusScanRuntime }) => statusScanRuntime);
		const channelIssuesLocal = channelsStatusLocal ? collectChannelStatusIssues(channelsStatusLocal) : [];
		if (params.labels?.summarizingChannels) params.progress?.setLabel(params.labels.summarizingChannels);
		const channelsLocal = await buildChannelsTable(cfg, {
			showSecrets: params.showSecrets,
			sourceConfig,
			includeSetupFallbackPlugins: params.includeChannelSetupRuntimeFallback !== false,
			liveChannelStatus: channelsStatusLocal,
			...params.channelCredentialResolutionSkipped === true ? { credentialResolutionSkipped: true } : {}
		});
		params.progress?.tick();
		return {
			channelsStatus: channelsStatusLocal,
			channelIssues: channelIssuesLocal,
			channels: channelsLocal
		};
	})() : {
		channelsStatus: null,
		channelIssues: [],
		channels: {
			rows: [],
			details: []
		}
	};
	return {
		env,
		coldStart,
		hasConfiguredChannels,
		skipColdStartNetworkChecks: bootstrap.skipColdStartNetworkChecks,
		cfg,
		sourceConfig,
		secretDiagnostics,
		osSummary,
		tailscaleMode: bootstrap.tailscaleMode,
		tailscaleDns,
		tailscaleHttpsUrl,
		...advertisedControlUiLinks ? { advertisedControlUiLinks } : {},
		update,
		gatewaySnapshot,
		channelsStatus,
		channelIssues,
		channels,
		agentStatus
	};
}
/** Resolves the summary object from overview data, preserving cold-start fast-path behavior. */
async function resolveStatusSummaryFromOverview(params) {
	if (params.overview.skipColdStartNetworkChecks) return buildColdStartStatusSummary();
	return await statusSummaryModuleLoader.load().then(({ getStatusSummary }) => getStatusSummary({
		config: params.overview.cfg,
		sourceConfig: params.overview.sourceConfig,
		includeChannelSummary: false
	}));
}
//#endregion
export { resolveStatusSummaryFromOverview as n, collectStatusScanOverview as t };
