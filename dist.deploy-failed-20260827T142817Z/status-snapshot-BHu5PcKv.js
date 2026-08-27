import { v as uniqueStrings } from "./string-normalization-e_fvmxMf.js";
import { a as projectPluginDependencyHealth, r as buildPluginDependencyStatus, s as tracePluginLifecyclePhase } from "./discovery-C2Bhkw0t.js";
import { r as getRuntimeConfig } from "./io-D1h6pxaD.js";
import { a as loadPluginRegistrySnapshotWithMetadata, c as resolvePluginControlPlaneWorkspace, s as appendPluginControlPlaneWorkspaceDiagnostic } from "./plugin-registry-snapshot-CiUpn9fa.js";
import "./plugin-registry-Bt5nAmAy.js";
import { s as resolvePluginMetadataSnapshot } from "./plugin-metadata-snapshot-BfWhFzZN.js";
import { k as createEmptyPluginRegistry } from "./runtime-CTbL314X.js";
import "./config-CW-q_d35.js";
//#region src/plugins/status-snapshot.ts
/** Builds plugin status reports from persisted metadata without importing full plugin runtimes. */
function buildPluginRecordFromInstalledIndex(plugin, manifest) {
	const format = plugin.format ?? manifest?.format ?? "openclaw";
	const bundleFormat = plugin.bundleFormat ?? manifest?.bundleFormat;
	return {
		id: plugin.pluginId,
		name: manifest?.name ?? plugin.packageName ?? plugin.pluginId,
		...plugin.packageVersion || manifest?.version ? { version: plugin.packageVersion ?? manifest?.version } : {},
		...manifest?.description ? { description: manifest.description } : {},
		format,
		...bundleFormat ? { bundleFormat } : {},
		...manifest?.kind ? { kind: manifest.kind } : {},
		source: plugin.source ?? plugin.manifestPath,
		rootDir: plugin.rootDir,
		origin: plugin.origin,
		enabled: plugin.enabled,
		compat: plugin.compat,
		syntheticAuthRefs: [...plugin.syntheticAuthRefs ?? manifest?.syntheticAuthRefs ?? []],
		status: plugin.enabled ? "loaded" : "disabled",
		toolNames: uniqueStrings(manifest?.contracts?.tools ?? []),
		hookNames: [],
		channelIds: [...manifest?.channels ?? []],
		cliBackendIds: [...manifest?.cliBackends ?? [], ...manifest?.setup?.cliBackends ?? []],
		providerIds: [...manifest?.providers ?? []],
		embeddingProviderIds: [...manifest?.contracts?.embeddingProviders ?? []],
		speechProviderIds: [...manifest?.contracts?.speechProviders ?? []],
		realtimeTranscriptionProviderIds: [...manifest?.contracts?.realtimeTranscriptionProviders ?? []],
		realtimeVoiceProviderIds: [...manifest?.contracts?.realtimeVoiceProviders ?? []],
		mediaUnderstandingProviderIds: [...manifest?.contracts?.mediaUnderstandingProviders ?? []],
		transcriptSourceProviderIds: [...manifest?.contracts?.transcriptSourceProviders ?? []],
		imageGenerationProviderIds: [...manifest?.contracts?.imageGenerationProviders ?? []],
		videoGenerationProviderIds: [...manifest?.contracts?.videoGenerationProviders ?? []],
		musicGenerationProviderIds: [...manifest?.contracts?.musicGenerationProviders ?? []],
		webFetchProviderIds: [...manifest?.contracts?.webFetchProviders ?? []],
		webSearchProviderIds: [...manifest?.contracts?.webSearchProviders ?? []],
		migrationProviderIds: [...manifest?.contracts?.migrationProviders ?? []],
		memoryEmbeddingProviderIds: [...manifest?.contracts?.memoryEmbeddingProviders ?? []],
		agentHarnessIds: [],
		cliCommands: [],
		services: [],
		gatewayDiscoveryServiceIds: [],
		commands: [...manifest?.commandAliases?.map((alias) => alias.name) ?? []],
		httpRoutes: 0,
		hookCount: 0,
		configSchema: Boolean(manifest?.configSchema),
		contracts: manifest?.contracts,
		dependencyStatus: plugin.origin === "bundled" ? void 0 : buildPluginDependencyStatus({
			rootDir: plugin.rootDir,
			dependencies: manifest?.packageDependencies,
			optionalDependencies: manifest?.packageOptionalDependencies
		})
	};
}
/** Resolves the best available plugin registry snapshot and annotates dependency status. */
function buildPluginRegistrySnapshotReport(params) {
	const config = params?.config ?? getRuntimeConfig();
	const env = params?.env ?? process.env;
	const workspace = resolvePluginControlPlaneWorkspace({
		config,
		env,
		workspaceDir: params?.workspaceDir
	});
	const result = tracePluginLifecyclePhase("plugin registry snapshot", () => loadPluginRegistrySnapshotWithMetadata({
		config,
		env: params?.env,
		workspaceDir: workspace.workspaceDir
	}), { surface: "status" });
	const manifestByPluginId = resolvePluginMetadataSnapshot({
		index: result.snapshot,
		config,
		env,
		workspaceDir: workspace.workspaceDir
	}).byPluginId;
	return projectPluginDependencyHealth({
		workspaceDir: workspace.workspaceDir,
		workspaceScope: workspace.workspaceScope,
		...createEmptyPluginRegistry(),
		plugins: result.snapshot.plugins.map((plugin) => buildPluginRecordFromInstalledIndex(plugin, manifestByPluginId.get(plugin.pluginId))),
		diagnostics: appendPluginControlPlaneWorkspaceDiagnostic(result.snapshot.diagnostics, workspace),
		registrySource: result.source,
		registryDiagnostics: result.diagnostics
	});
}
//#endregion
export { buildPluginRegistrySnapshotReport as t };
