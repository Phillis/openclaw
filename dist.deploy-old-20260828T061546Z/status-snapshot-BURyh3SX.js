import { v as uniqueStrings } from "./string-normalization-e_fvmxMf.js";
import { a as projectPluginDependencyHealth, r as buildPluginDependencyStatus, s as tracePluginLifecyclePhase } from "./discovery-KmR2BWJK.js";
import { n as getRuntimeConfig } from "./io-ClLVsBMp.js";
import { r as resolveInstalledPluginIndexInstallOwner } from "./installed-plugin-index-install-owner-Bd-Byre8.js";
import { p as loadPluginRegistrySnapshotWithMetadata, s as resolvePluginMetadataSnapshot } from "./plugin-metadata-snapshot-BI5GxVU3.js";
import { n as resolvePluginControlPlaneWorkspace, t as appendPluginControlPlaneWorkspaceDiagnostic } from "./control-plane-workspace-BkM5PRVy.js";
import "./plugin-registry-BcpcjwxL.js";
import { t as createEmptyPluginRegistry } from "./registry-empty-55wlVNzO.js";
import "./config-B_0xOnKq.js";
import { c as resolveAcceptedSurfaceCurrent, h as mergePluginDeclaredSurfaces, m as buildPluginCapabilitySummary, o as formatPluginCapabilityConsentRequired } from "./capability-consent-WudatxYT.js";
//#region src/plugins/status-snapshot.ts
/** Builds plugin status reports from persisted metadata without importing full plugin runtimes. */
/** Report enabled managed plugins whose current manifest lacks recorded operator consent. */
function collectPluginCapabilityConsentDiagnostics(params) {
	const diagnostics = [];
	const surfacesByOwner = /* @__PURE__ */ new Map();
	const incompleteOwners = /* @__PURE__ */ new Set();
	for (const plugin of params.index.plugins) {
		const installOwner = resolveInstalledPluginIndexInstallOwner(plugin);
		if (!installOwner) continue;
		const manifest = params.manifests.get(plugin.pluginId);
		if (!manifest) {
			incompleteOwners.add(installOwner);
			continue;
		}
		const { declared } = buildPluginCapabilitySummary({
			manifest,
			origin: plugin.origin
		});
		const surfaces = surfacesByOwner.get(installOwner);
		if (surfaces) surfaces.push(declared);
		else surfacesByOwner.set(installOwner, [declared]);
	}
	const currentAcceptanceByOwner = /* @__PURE__ */ new Map();
	for (const plugin of params.index.plugins) {
		if (!plugin.enabled || plugin.origin === "bundled") continue;
		const installOwner = resolveInstalledPluginIndexInstallOwner(plugin);
		const installRecord = installOwner ? params.index.installRecords[installOwner] : void 0;
		const surfaces = installOwner ? surfacesByOwner.get(installOwner) : void 0;
		if (!installOwner || !installRecord) continue;
		let accepted = currentAcceptanceByOwner.get(installOwner);
		if (accepted === void 0) {
			accepted = surfaces !== void 0 && !incompleteOwners.has(installOwner) && resolveAcceptedSurfaceCurrent(installRecord, mergePluginDeclaredSurfaces(surfaces));
			currentAcceptanceByOwner.set(installOwner, accepted);
		}
		if (!accepted) diagnostics.push({
			level: "warn",
			pluginId: plugin.pluginId,
			message: formatPluginCapabilityConsentRequired(plugin.pluginId)
		});
	}
	return diagnostics;
}
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
	const diagnostics = [...result.snapshot.diagnostics, ...collectPluginCapabilityConsentDiagnostics({
		index: result.snapshot,
		manifests: manifestByPluginId
	})];
	return projectPluginDependencyHealth({
		workspaceDir: workspace.workspaceDir,
		workspaceScope: workspace.workspaceScope,
		...createEmptyPluginRegistry(),
		plugins: result.snapshot.plugins.map((plugin) => buildPluginRecordFromInstalledIndex(plugin, manifestByPluginId.get(plugin.pluginId))),
		diagnostics: appendPluginControlPlaneWorkspaceDiagnostic(diagnostics, workspace),
		registrySource: result.source,
		registryDiagnostics: result.diagnostics
	});
}
//#endregion
export { collectPluginCapabilityConsentDiagnostics as n, buildPluginRegistrySnapshotReport as t };
