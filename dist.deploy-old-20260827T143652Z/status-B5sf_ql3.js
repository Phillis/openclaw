import { a as projectPluginDependencyHealth, r as buildPluginDependencyStatus, s as tracePluginLifecyclePhase } from "./discovery-C2Bhkw0t.js";
import { r as getRuntimeConfig } from "./io-CeQckj5v.js";
import { r as hasKind } from "./slots-BTFPUFBt.js";
import { s as resolveCompatibilityHostVersion } from "./version-o4XN9fka.js";
import { s as normalizePluginsConfig } from "./config-state-CpuWFwzR.js";
import { v as extractPluginInstallRecordsFromInstalledPluginIndex } from "./installed-plugin-index-CqyEIHSI.js";
import { c as resolvePluginControlPlaneWorkspace, s as appendPluginControlPlaneWorkspaceDiagnostic } from "./plugin-registry-snapshot-wrChZCpl.js";
import { r as listImportedBundledPluginFacadeIds } from "./facade-loader-C99kTj0r.js";
import { i as loadPluginMetadataSnapshot } from "./plugin-metadata-snapshot-BV6-k_Y4.js";
import { n as normalizeOpenClawVersionBase } from "./version-CG_bbh3U.js";
import { v as listImportedRuntimePluginIds } from "./runtime-g0R28Sy0.js";
import { i as resolveCompatibleRuntimePluginRegistry, n as loadPluginRegistryHandle } from "./loader-DNWV84an.js";
import "./config-Dl8DJbzM.js";
import { n as resolveBundledProviderCompatPluginIds } from "./providers-o7UIOzTf.js";
import { t as withBundledPluginEnablementCompat } from "./bundled-compat-DA9iwXlO.js";
import "./facade-runtime-CUuLg79-.js";
import { n as inspectBundleMcpRuntimeSupport, r as inspectNativePluginMcpRuntimeSupport } from "./bundle-mcp-Biidb2Hy.js";
import { i as resolvePluginRuntimeLoadContext, t as buildPluginRuntimeLoadOptions } from "./load-context-BOX7sK1g.js";
import { t as inspectBundleLspRuntimeSupport } from "./bundle-lsp-rzsaKN7u.js";
import { t as resolveEffectivePluginIds } from "./effective-plugin-ids-CwYFosoT.js";
import { t as loadPluginMetadataRegistrySnapshot } from "./metadata-registry-loader-CQNm0lSl.js";
import "./status-snapshot-quqdCrH2.js";
//#region src/plugins/inspect-shape.ts
function buildPluginCapabilityEntries(plugin, report) {
	return [
		{
			kind: "cli-backend",
			ids: plugin.cliBackendIds ?? []
		},
		{
			kind: "text-inference",
			ids: plugin.providerIds
		},
		{
			kind: "embedding",
			ids: plugin.embeddingProviderIds
		},
		{
			kind: "speech",
			ids: plugin.speechProviderIds
		},
		{
			kind: "realtime-transcription",
			ids: plugin.realtimeTranscriptionProviderIds
		},
		{
			kind: "realtime-voice",
			ids: plugin.realtimeVoiceProviderIds
		},
		{
			kind: "media-understanding",
			ids: plugin.mediaUnderstandingProviderIds
		},
		{
			kind: "transcript-source",
			ids: plugin.transcriptSourceProviderIds
		},
		{
			kind: "document-extractors",
			ids: plugin.contracts?.documentExtractors ?? []
		},
		{
			kind: "image-generation",
			ids: plugin.imageGenerationProviderIds
		},
		{
			kind: "video-generation",
			ids: plugin.videoGenerationProviderIds
		},
		{
			kind: "music-generation",
			ids: plugin.musicGenerationProviderIds
		},
		{
			kind: "web-search",
			ids: plugin.webSearchProviderIds
		},
		{
			kind: "worker-provider",
			ids: plugin.contracts?.workerProviders ?? []
		},
		{
			kind: "session-catalog",
			ids: report.sessionCatalogs.filter((entry) => entry.pluginId === plugin.id).map((entry) => entry.provider.id)
		},
		{
			kind: "agent-harness",
			ids: plugin.agentHarnessIds
		},
		{
			kind: "context-engine",
			ids: plugin.status === "loaded" && hasKind(plugin.kind, "context-engine") ? plugin.contextEngineIds ?? [] : []
		},
		{
			kind: "channel",
			ids: plugin.channelIds
		}
	].filter((entry) => entry.ids.length > 0);
}
function derivePluginInspectShape(params) {
	if (params.capabilityCount > 1) return "hybrid-capability";
	if (params.capabilityCount === 1) return "plain-capability";
	if (params.typedHookCount + params.customHookCount > 0 && params.toolCount === 0 && params.commandCount === 0 && params.cliCount === 0 && params.serviceCount === 0 && params.gatewayDiscoveryServiceCount === 0 && params.gatewayMethodCount === 0 && params.httpRouteCount === 0) return "hook-only";
	return "non-capability";
}
function buildPluginShapeSummary(params) {
	const capabilities = buildPluginCapabilityEntries(params.plugin, params.report);
	const typedHookCount = params.report.typedHooks.filter((entry) => entry.pluginId === params.plugin.id).length;
	const customHookCount = params.report.hooks.filter((entry) => entry.pluginId === params.plugin.id).length;
	const toolCount = params.report.tools.filter((entry) => entry.pluginId === params.plugin.id).length;
	const gatewayMethodCount = (params.report.gatewayMethodDescriptors ?? []).filter((descriptor) => descriptor.owner.kind === "plugin" && descriptor.owner.pluginId === params.plugin.id).length;
	const capabilityCount = capabilities.length;
	return {
		shape: derivePluginInspectShape({
			capabilityCount,
			typedHookCount,
			customHookCount,
			toolCount,
			commandCount: params.plugin.commands.length,
			cliCount: params.plugin.cliCommands.length,
			serviceCount: params.plugin.services.length,
			gatewayDiscoveryServiceCount: params.plugin.gatewayDiscoveryServiceIds.length,
			gatewayMethodCount,
			httpRouteCount: params.plugin.httpRoutes
		}),
		capabilityMode: capabilityCount === 0 ? "none" : capabilityCount === 1 ? "plain" : "hybrid",
		capabilityCount,
		capabilities
	};
}
//#endregion
//#region src/plugins/status.ts
function buildCompatibilityNoticesForInspect(inspect) {
	const warnings = [];
	if (inspect.shape === "hook-only") warnings.push({
		pluginId: inspect.plugin.id,
		code: "hook-only",
		compatCode: "hook-only-plugin-shape",
		severity: "info",
		message: "is hook-only. This remains a supported compatibility path, but it has not migrated to explicit capability registration yet."
	});
	if ((inspect.plugin.memoryEmbeddingProviderIds.length > 0 || (inspect.plugin.contracts?.memoryEmbeddingProviders?.length ?? 0) > 0 || inspect.hasRuntimeMemoryEmbeddingProviderRegistration) && inspect.plugin.origin !== "bundled") warnings.push({
		pluginId: inspect.plugin.id,
		code: "deprecated-memory-embedding-provider-api",
		compatCode: "deprecated-memory-embedding-provider-api",
		severity: "warn",
		message: "uses deprecated memory-specific embedding provider API; use api.registerEmbeddingProvider and contracts.embeddingProviders for new embedding providers."
	});
	if (usesRemovedSessionTranscriptFileApi(inspect)) warnings.push({
		pluginId: inspect.plugin.id,
		code: "removed-session-transcript-file-api",
		compatCode: "removed-session-transcript-file-api",
		severity: "warn",
		message: "references removed session/transcript file APIs; migrate to session identity, SessionTranscriptUpdate.target, and Gateway/runtime session helpers."
	});
	return warnings;
}
const removedSessionTranscriptFileApiMarkers = [
	"saveSessionStore",
	"resolveSessionTranscriptPathInDir",
	"resolveAndPersistSessionFile",
	"readLatestAssistantTextFromSessionTranscript",
	"SessionTranscriptUpdate.sessionFile",
	"sessionFiles",
	"transcriptPath",
	"sessionFile"
];
function usesRemovedSessionTranscriptFileApi(inspect) {
	if (inspect.plugin.origin === "bundled") return false;
	return [inspect.plugin.error, ...inspect.diagnostics.map((diagnostic) => diagnostic.message)].filter((message) => typeof message === "string" && message.length > 0).some((message) => removedSessionTranscriptFileApiMarkers.some((marker) => message.includes(marker)));
}
function resolveReportedPluginVersion(plugin, env) {
	if (plugin.origin !== "bundled") return plugin.version;
	return normalizeOpenClawVersionBase(resolveCompatibilityHostVersion(env)) ?? normalizeOpenClawVersionBase(plugin.version) ?? plugin.version;
}
function buildPluginReport(params, loadModules) {
	const rawConfig = params?.config ?? getRuntimeConfig();
	const workspace = resolvePluginControlPlaneWorkspace({
		config: rawConfig,
		env: params?.env,
		workspaceDir: params?.workspaceDir
	});
	const initialWorkspaceDir = workspace.workspaceDir;
	const metadataSnapshot = params?.metadataSnapshot ?? loadPluginMetadataSnapshot({
		config: rawConfig,
		env: params?.env ?? process.env,
		workspaceDir: initialWorkspaceDir,
		...params?.onlyPluginIds !== void 0 ? { pluginIds: params.onlyPluginIds } : {}
	});
	const baseContext = {
		...resolvePluginRuntimeLoadContext({
			config: rawConfig,
			env: params?.env,
			logger: params?.logger,
			workspaceDir: initialWorkspaceDir,
			onlyPluginIds: params?.onlyPluginIds,
			manifestRegistry: metadataSnapshot.manifestRegistry
		}),
		installRecords: extractPluginInstallRecordsFromInstalledPluginIndex(metadataSnapshot.index)
	};
	const workspaceDir = baseContext.workspaceDir ?? initialWorkspaceDir;
	const context = workspaceDir === baseContext.workspaceDir ? baseContext : {
		...baseContext,
		workspaceDir
	};
	const manifestByPluginId = metadataSnapshot.byPluginId;
	const config = context.config;
	const runtimeCompatConfig = withBundledPluginEnablementCompat({
		config,
		pluginIds: resolveBundledProviderCompatPluginIds({
			config,
			workspaceDir,
			env: params?.env,
			manifestRegistry: metadataSnapshot.manifestRegistry
		})
	});
	const onlyPluginIds = params?.effectiveOnly === true ? resolveEffectivePluginIds({
		config: rawConfig,
		workspaceDir,
		env: params?.env ?? process.env,
		metadataSnapshot
	}) : params?.onlyPluginIds === void 0 ? void 0 : [...params.onlyPluginIds];
	const registry = loadModules ? tracePluginLifecyclePhase("runtime plugin registry load", () => loadPluginRegistryHandle(buildPluginRuntimeLoadOptions(context, {
		config: runtimeCompatConfig,
		activationSourceConfig: rawConfig,
		workspaceDir,
		env: params?.env,
		loadModules,
		cache: false,
		onlyPluginIds
	})), {
		surface: "status",
		onlyPluginCount: onlyPluginIds?.length
	}) : tracePluginLifecyclePhase("plugin registry snapshot", () => loadPluginMetadataRegistrySnapshot({
		config: runtimeCompatConfig,
		activationSourceConfig: rawConfig,
		workspaceDir,
		env: params?.env,
		logger: params?.logger,
		loadModules: false,
		onlyPluginIds,
		manifestRegistry: metadataSnapshot.manifestRegistry,
		runtimeContext: context
	}), {
		surface: "status",
		onlyPluginCount: onlyPluginIds?.length
	});
	const importedPluginIds = /* @__PURE__ */ new Set([
		...loadModules ? registry.plugins.filter((plugin) => plugin.status === "loaded" && plugin.format !== "bundle").map((plugin) => plugin.id) : [],
		...listImportedRuntimePluginIds(),
		...listImportedBundledPluginFacadeIds()
	]);
	return projectPluginDependencyHealth({
		workspaceDir,
		workspaceScope: workspace.workspaceScope,
		...registry,
		diagnostics: appendPluginControlPlaneWorkspaceDiagnostic(registry.diagnostics, workspace),
		plugins: registry.plugins.map((plugin) => Object.assign({}, plugin, {
			imported: plugin.format !== `bundle` && importedPluginIds.has(plugin.id),
			version: resolveReportedPluginVersion(plugin, params?.env),
			dependencyStatus: plugin.dependencyStatus ?? (plugin.origin === "bundled" ? void 0 : buildPluginDependencyStatus({
				rootDir: plugin.rootDir,
				dependencies: manifestByPluginId.get(plugin.id)?.packageDependencies,
				optionalDependencies: manifestByPluginId.get(plugin.id)?.packageOptionalDependencies
			}))
		}))
	});
}
function buildPluginSnapshotReport(params) {
	return buildPluginReport(params, false);
}
function buildPluginDiagnosticsReport(params) {
	return buildPluginReport(params, true);
}
function buildPluginInspectReport(params) {
	const rawConfig = params.config ?? getRuntimeConfig();
	const config = params.resolvedConfig ?? resolvePluginRuntimeLoadContext({
		config: rawConfig,
		env: params.env,
		logger: params.logger,
		workspaceDir: params.workspaceDir
	}).config;
	const report = params.report ?? buildPluginDiagnosticsReport({
		config: rawConfig,
		logger: params.logger,
		workspaceDir: params.workspaceDir,
		env: params.env
	});
	const plugin = report.plugins.find((entry) => entry.id === params.id || entry.name === params.id);
	if (!plugin) return null;
	const typedHooks = report.typedHooks.filter((entry) => entry.pluginId === plugin.id).map((entry) => ({
		name: entry.hookName,
		priority: entry.priority
	})).toSorted((a, b) => a.name.localeCompare(b.name));
	const customHooks = report.hooks.filter((entry) => entry.pluginId === plugin.id).map((entry) => ({
		name: entry.entry.hook.name,
		events: [...entry.events].toSorted()
	})).toSorted((a, b) => a.name.localeCompare(b.name));
	const tools = report.tools.filter((entry) => entry.pluginId === plugin.id).map((entry) => ({
		names: [...entry.names],
		optional: entry.optional
	}));
	const diagnostics = report.diagnostics.filter((entry) => entry.pluginId === plugin.id);
	const policyEntry = normalizePluginsConfig(config.plugins).entries[plugin.id];
	const shapeSummary = buildPluginShapeSummary({
		plugin,
		report
	});
	const shape = shapeSummary.shape;
	const gatewayMethods = (report.gatewayMethodDescriptors ?? []).filter((descriptor) => descriptor.owner.kind === "plugin" && descriptor.owner.pluginId === plugin.id).map((descriptor) => descriptor.name);
	let mcpServers = [];
	if (plugin.rootDir) {
		const mcpSupport = plugin.format === "bundle" && plugin.bundleFormat ? inspectBundleMcpRuntimeSupport({
			pluginId: plugin.id,
			rootDir: plugin.rootDir,
			bundleFormat: plugin.bundleFormat
		}) : plugin.mcpServers ? inspectNativePluginMcpRuntimeSupport({
			rootDir: plugin.rootDir,
			mcpServers: plugin.mcpServers
		}) : void 0;
		if (mcpSupport) {
			const stdioServerNames = new Set(mcpSupport.stdioServerNames);
			mcpServers = [...mcpSupport.supportedServerNames.map((name) => ({
				name,
				hasStdioTransport: stdioServerNames.has(name)
			})), ...mcpSupport.unsupportedServerNames.map((name) => ({
				name,
				hasStdioTransport: false,
				unsupported: true
			}))];
		}
	}
	let lspServers = [];
	if (plugin.format === "bundle" && plugin.bundleFormat && plugin.rootDir) {
		const lspSupport = inspectBundleLspRuntimeSupport({
			pluginId: plugin.id,
			rootDir: plugin.rootDir,
			bundleFormat: plugin.bundleFormat
		});
		lspServers = [...lspSupport.supportedServerNames.map((name) => ({
			name,
			hasStdioTransport: true
		})), ...lspSupport.unsupportedServerNames.map((name) => ({
			name,
			hasStdioTransport: false
		}))];
	}
	const compatibility = buildCompatibilityNoticesForInspect({
		plugin,
		shape,
		diagnostics,
		hasRuntimeMemoryEmbeddingProviderRegistration: report.memoryEmbeddingProviders.some((entry) => entry.pluginId === plugin.id)
	});
	return {
		workspaceDir: report.workspaceDir,
		plugin,
		shape,
		capabilityMode: shapeSummary.capabilityMode,
		capabilityCount: shapeSummary.capabilityCount,
		capabilities: shapeSummary.capabilities,
		typedHooks,
		customHooks,
		tools,
		commands: [...plugin.commands],
		cliCommands: [...plugin.cliCommands],
		services: [...plugin.services],
		gatewayDiscoveryServices: [...plugin.gatewayDiscoveryServiceIds],
		gatewayMethods,
		mcpServers,
		lspServers,
		httpRouteCount: plugin.httpRoutes,
		bundleCapabilities: plugin.bundleCapabilities ?? [],
		diagnostics,
		policy: {
			allowPromptInjection: policyEntry?.hooks?.allowPromptInjection,
			allowConversationAccess: policyEntry?.hooks?.allowConversationAccess,
			hookTimeoutMs: policyEntry?.hooks?.timeoutMs,
			hookTimeouts: policyEntry?.hooks?.timeouts ? { ...policyEntry.hooks.timeouts } : void 0,
			allowModelOverride: policyEntry?.subagent?.allowModelOverride,
			allowedModels: [...policyEntry?.subagent?.allowedModels ?? []],
			hasAllowedModelsConfig: policyEntry?.subagent?.hasAllowedModelsConfig === true
		},
		compatibility
	};
}
function buildAllPluginInspectReports(params) {
	const rawConfig = params?.config ?? getRuntimeConfig();
	const config = resolvePluginRuntimeLoadContext({
		config: rawConfig,
		env: params?.env,
		logger: params?.logger,
		workspaceDir: params?.workspaceDir
	}).config;
	const report = params?.report ?? buildPluginDiagnosticsReport({
		config: rawConfig,
		logger: params?.logger,
		workspaceDir: params?.workspaceDir,
		env: params?.env
	});
	return report.plugins.map((plugin) => buildPluginInspectReport({
		id: plugin.id,
		config: rawConfig,
		logger: params?.logger,
		workspaceDir: params?.workspaceDir,
		env: params?.env,
		resolvedConfig: config,
		report
	})).filter((entry) => entry !== null);
}
function buildPluginCompatibilityWarnings(params) {
	return buildPluginCompatibilityNotices(params).map(formatPluginCompatibilityNotice);
}
function buildPluginCompatibilityNotices(params) {
	return buildAllPluginInspectReports(params).flatMap((inspect) => inspect.compatibility);
}
function buildPluginCompatibilitySnapshotNotices(params) {
	const report = buildPluginSnapshotReport(params);
	const runtimeRegistry = resolveCompatibleRuntimePluginRegistry(buildPluginRuntimeLoadOptions(resolvePluginRuntimeLoadContext(params)));
	const registeredPlugins = new Map(runtimeRegistry?.plugins.map((plugin) => [plugin.id, plugin]));
	const registrationReport = runtimeRegistry ? {
		...report,
		...runtimeRegistry,
		workspaceDir: report.workspaceDir,
		plugins: report.plugins.map((plugin) => ({
			...plugin,
			...registeredPlugins.get(plugin.id),
			imported: plugin.imported
		}))
	} : report;
	return buildPluginCompatibilityNotices({
		...params,
		report: registrationReport
	});
}
function formatPluginCompatibilityNotice(notice) {
	return `${notice.pluginId} ${notice.message}`;
}
function summarizePluginCompatibility(notices) {
	return {
		noticeCount: notices.length,
		pluginCount: new Set(notices.map((notice) => notice.pluginId)).size
	};
}
//#endregion
export { buildPluginDiagnosticsReport as a, formatPluginCompatibilityNotice as c, buildPluginCompatibilityWarnings as i, summarizePluginCompatibility as l, buildPluginCompatibilityNotices as n, buildPluginInspectReport as o, buildPluginCompatibilitySnapshotNotices as r, buildPluginSnapshotReport as s, buildAllPluginInspectReports as t };
