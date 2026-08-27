import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.js";
import { r as applyLoggingConfig } from "./logger-ij8OHrrv.js";
import { n as runExec } from "./exec-D2kbpwdA.js";
import { t as createEmptyTaskRegistrySummary } from "./task-registry.summary-BwpoHlXv.js";
import { i as createEmptyTaskAuditSummary } from "./task-registry.audit.shared-CN77q0s9.js";
import { r as resolveOsSummary } from "./os-summary-q1rQKLEc.js";
import { t as resolveGatewayAuthTokenSourceConflict } from "./auth-token-source-conflict-DI2LzhtV.js";
import { n as resolveGatewayProbeSnapshot, t as buildTailscaleHttpsUrl } from "./status.scan.shared-GMDC05ge.js";
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
			configPath: params.configPath,
			env: params.env,
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
			controlUiBasePath: params.cfg.gateway?.controlUi?.basePath
		})
	};
}
//#endregion
//#region src/commands/status.scan-overview.ts
const statusScanDepsRuntimeModuleLoader = createLazyImportLoader(() => import("./status.scan.deps.runtime.js"));
const statusAgentLocalModuleLoader = createLazyImportLoader(() => import("./status.agent-local-Duzmlka0.js"));
const statusUpdateModuleLoader = createLazyImportLoader(() => import("./status.update-BhCKv2iH.js"));
const statusScanRuntimeModuleLoader = createLazyImportLoader(() => import("./status.scan.runtime.js"));
const gatewayCallModuleLoader = createLazyImportLoader(() => import("./call-Dplee5Oc.js"));
const statusSummaryModuleLoader = createLazyImportLoader(() => import("./summary-fqm-JWlv.js"));
const channelPluginIdsModuleLoader = createLazyImportLoader(() => import("./channel-plugin-ids-B8Pn-XAG.js"));
const configModuleLoader = createLazyImportLoader(() => import("./config/config.js"));
const controlUiLinksModuleLoader = createLazyImportLoader(() => import("./control-ui-links-vkwfYEkc.js"));
const commandConfigResolutionModuleLoader = createLazyImportLoader(() => import("./command-config-resolution-BRy4wFnA.js"));
const commandSecretTargetsModuleLoader = createLazyImportLoader(() => import("./command-secret-targets-DQ7I5BEr.js"));
async function resolveStatusChannelsStatus(params) {
	if (!params.gatewayReachable) return null;
	const { callGateway } = await gatewayCallModuleLoader.load();
	return await callGateway({
		config: params.cfg,
		configPath: params.configPath,
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
	const { snapshot } = await (await import("./command-config-snapshot-B4cENAio.js")).readCommandConfigSnapshot({
		observe: false,
		skipPluginValidation: true
	});
	const testRuntime = env.VITEST === "true" || env.VITEST_POOL_ID !== void 0 || env.NODE_ENV === "test";
	const coldStart = !snapshot.exists && !(params.allowMissingConfigFastPath && testRuntime);
	const skipMissingConfig = coldStart && params.allowMissingConfigFastPath === true;
	const sourceConfig = skipMissingConfig ? {} : snapshot.sourceConfig;
	const loadedConfig = skipMissingConfig ? {} : snapshot.runtimeConfig;
	const configDiagnostics = skipMissingConfig || snapshot.valid ? null : {
		path: snapshot.path,
		issues: snapshot.issues
	};
	const { resolvedConfig: cfg, diagnostics } = skipMissingConfig ? {
		resolvedConfig: loadedConfig,
		diagnostics: []
	} : await commandConfigResolutionModuleLoader.load().then(async ({ resolveCommandConfigWithSecrets }) => resolveCommandConfigWithSecrets({
		config: loadedConfig,
		commandName: params.commandName,
		targetIds: (await commandSecretTargetsModuleLoader.load()).getStatusCommandSecretTargetIds(loadedConfig, env, { includeChannelTargets: params.includeChannelSecretTargets }),
		mode: "read_only_status",
		...params.runtime ? { runtime: params.runtime } : {}
	}));
	const tokenConflict = resolveGatewayAuthTokenSourceConflict({
		cfg: sourceConfig,
		env
	});
	const secretDiagnostics = tokenConflict ? [...diagnostics, tokenConflict.diagnostic] : diagnostics;
	applyLoggingConfig(cfg.logging);
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
		configPath: snapshot.path,
		env,
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
	let runtimeDegradation = null;
	if (gatewaySnapshot.gatewayReachable) {
		const status = await gatewayCallModuleLoader.load().then(({ callGateway }) => callGateway({
			config: cfg,
			configPath: snapshot.path,
			method: "status",
			params: { includeChannelSummary: false },
			timeoutMs: Math.min(5e3, params.opts.timeoutMs ?? 1e4),
			...gatewaySnapshot.gatewayCallOverrides
		}).catch(() => null));
		runtimeDegradation = status && {
			degradedSecretOwners: status.degradedSecretOwners ?? [],
			degradedPlugins: status.degradedPlugins ?? []
		};
	}
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
			configPath: snapshot.path,
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
		configDiagnostics,
		secretDiagnostics,
		osSummary,
		tailscaleMode: bootstrap.tailscaleMode,
		tailscaleDns,
		tailscaleHttpsUrl,
		...advertisedControlUiLinks ? { advertisedControlUiLinks } : {},
		update,
		gatewaySnapshot,
		runtimeDegradation,
		channelsStatus,
		channelIssues,
		channels,
		agentStatus
	};
}
/** Resolves the summary object from overview data, preserving cold-start fast-path behavior. */
async function resolveStatusSummaryFromOverview(params) {
	if (params.overview.skipColdStartNetworkChecks) return buildColdStartStatusSummary();
	const summary = await statusSummaryModuleLoader.load().then(({ getStatusSummary }) => getStatusSummary({
		config: params.overview.cfg,
		sourceConfig: params.overview.sourceConfig,
		includeChannelSummary: false
	}));
	return params.overview.runtimeDegradation ? {
		...summary,
		...params.overview.runtimeDegradation
	} : summary;
}
//#endregion
export { resolveStatusSummaryFromOverview as n, collectStatusScanOverview as t };
