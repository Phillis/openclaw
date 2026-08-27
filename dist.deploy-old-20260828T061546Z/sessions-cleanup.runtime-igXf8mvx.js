import { f as resolveAgentWorkspaceDir } from "./agent-scope-config-CUBiGmG3.js";
import { v as extractPluginInstallRecordsFromInstalledPluginIndex } from "./installed-plugin-index-Cr71VmpU.js";
import { i as loadPluginMetadataSnapshot } from "./plugin-metadata-snapshot-BI5GxVU3.js";
import { n as loadPluginRegistryHandle } from "./loader-BcKpDiEM.js";
import { u as withPluginRuntimeRegistryScope } from "./gateway-request-scope-B19X7f09.js";
import { n as resolveManifestActivationPluginIds } from "./activation-planner-BdMmGHtb.js";
import "./sessions-BI8dPUCI.js";
import { n as resolveSessionCleanupAction, r as runSessionsCleanup } from "./cleanup-service-LQM2406D.js";
import { r as withActivatedPluginIds } from "./activation-context-DrJmxyjh.js";
//#region src/commands/sessions-cleanup.runtime.ts
function prepareCleanupHarnessOwners(config, workspaceDir) {
	const metadata = loadPluginMetadataSnapshot({
		config,
		workspaceDir
	});
	const harnessOwners = metadata.plugins.flatMap((plugin) => {
		const runtime = plugin.activation?.onAgentHarnesses?.[0];
		return runtime ? [{
			plugin,
			runtime
		}] : [];
	});
	const pluginIds = harnessOwners.flatMap(({ plugin, runtime }) => resolveManifestActivationPluginIds({
		config,
		workspaceDir,
		manifestRecords: [plugin],
		trigger: {
			kind: "agentHarness",
			runtime
		},
		requireExplicitManifestOwnerTrust: true
	})).toSorted();
	return {
		registry: loadPluginRegistryHandle({
			config: withActivatedPluginIds({
				config,
				pluginIds
			}),
			activationSourceConfig: config,
			workspaceDir,
			onlyPluginIds: pluginIds,
			manifestRegistry: metadata.manifestRegistry,
			discovery: metadata.discovery,
			installRecords: extractPluginInstallRecordsFromInstalledPluginIndex(metadata.index),
			throwOnLoadError: true
		}),
		excludedOwners: harnessOwners.filter(({ plugin }) => !pluginIds.includes(plugin.id)).map(({ plugin }) => plugin)
	};
}
function warnUnavailableCleanupOwners(owners, result, runtime) {
	const summary = result.appliedSummaries[0];
	const preview = result.previewResults[0];
	if (owners.excludedOwners.length === 0 || !summary || !preview || summary.missing + summary.dmScopeRetired + summary.modelRunPruned + summary.pruned + summary.capped === 0) return;
	const candidateHarnessIds = /* @__PURE__ */ new Set();
	let hasLegacyCandidate = false;
	for (const [key, entry] of Object.entries(preview.beforeStore)) {
		const action = resolveSessionCleanupAction({
			...preview,
			key
		});
		if (!entry.sessionId || action === "keep" || action === "archive-dashboard") continue;
		if (entry.agentHarnessId) candidateHarnessIds.add(entry.agentHarnessId);
		else hasLegacyCandidate = true;
	}
	const excluded = owners.excludedOwners.filter((plugin) => hasLegacyCandidate || plugin.activation?.onAgentHarnesses?.some((id) => candidateHarnessIds.has(id)));
	if (excluded.length > 0) runtime.error(`Warning: native session resources were not cleaned for unavailable harness owners: ${excluded.map((plugin) => plugin.id).toSorted().join(", ")}. Their plugins are disabled or not trusted; resources may remain. Enable or trust those plugins and use their repair flow.`);
}
/** Owns plugin preparation only for the local destructive CLI path. */
async function runLocalSessionsCleanup(params, runtime) {
	const ownersByWorkspace = /* @__PURE__ */ new Map();
	const results = [];
	for (const target of params.targets) {
		const workspaceDir = resolveAgentWorkspaceDir(params.cfg, target.agentId);
		let owners = ownersByWorkspace.get(workspaceDir);
		if (!owners) {
			owners = prepareCleanupHarnessOwners(params.cfg, workspaceDir);
			ownersByWorkspace.set(workspaceDir, owners);
		}
		const result = await withPluginRuntimeRegistryScope(owners.registry, () => runSessionsCleanup({
			...params,
			targets: [target]
		}));
		warnUnavailableCleanupOwners(owners, result, runtime);
		results.push(result);
	}
	const first = results[0];
	if (!first) return await runSessionsCleanup(params);
	return {
		mode: first.mode,
		previewResults: results.flatMap((result) => result.previewResults),
		appliedSummaries: results.flatMap((result) => result.appliedSummaries)
	};
}
//#endregion
export { runLocalSessionsCleanup };
