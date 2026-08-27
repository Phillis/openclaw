import { n as isPluginMetadataSnapshotCompatible, s as resolvePluginMetadataSnapshot } from "./plugin-metadata-snapshot-BfWhFzZN.js";
import { c as createGatewayStartupMetadataPluginIdScope, l as isMetadataSnapshotScopedForGatewayStartup, o as resolveGatewayStartupPluginPlanFromRegistry } from "./gateway-startup-plugin-ids-6UecoKl9.js";
import { a as normalizeWorkerProviderIds } from "./worker-provider-config-B0KhVQMV.js";
import "./channel-plugin-ids-oAuJj65R.js";
//#region src/plugins/plugin-lookup-table.ts
const lookupTableMemoBySnapshot = /* @__PURE__ */ new WeakMap();
function loadPluginLookUpTable(params) {
	const requestedSnapshotConfig = params.activationSourceConfig ?? params.config;
	const workerProviderIds = normalizeWorkerProviderIds(params.workerProviderIds ?? []);
	const pluginIdScope = createGatewayStartupMetadataPluginIdScope({
		config: params.config,
		...params.activationSourceConfig !== void 0 ? { activationSourceConfig: params.activationSourceConfig } : {},
		env: params.env,
		workerProviderIds,
		ambientEnvTriggers: params.ambientEnvTriggers
	});
	const metadataSnapshot = params.metadataSnapshot && isPluginMetadataSnapshotCompatible({
		snapshot: params.metadataSnapshot,
		config: requestedSnapshotConfig,
		env: params.env,
		allowScopedSnapshot: true,
		workspaceDir: params.workspaceDir,
		index: params.index
	}) && isMetadataSnapshotScopedForGatewayStartup({
		metadataSnapshot: params.metadataSnapshot,
		pluginIdScope
	}) ? params.metadataSnapshot : resolvePluginMetadataSnapshot({
		config: requestedSnapshotConfig,
		workspaceDir: params.workspaceDir,
		env: params.env,
		allowWorkspaceScopedCurrent: params.workspaceDir === void 0,
		...params.index ? { index: params.index } : {},
		pluginIdScope
	});
	const memoKey = pluginIdScope.key;
	const memo = lookupTableMemoBySnapshot.get(metadataSnapshot)?.get(memoKey);
	if (memo) return memo;
	const { index, manifestRegistry } = metadataSnapshot;
	const startupPlanStartedAt = performance.now();
	const startup = resolveGatewayStartupPluginPlanFromRegistry({
		config: params.config,
		...params.activationSourceConfig !== void 0 ? { activationSourceConfig: params.activationSourceConfig } : {},
		env: params.env,
		index,
		manifestRegistry,
		workerProviderIds,
		ambientEnvTriggers: params.ambientEnvTriggers
	});
	const startupPlanMs = performance.now() - startupPlanStartedAt;
	const table = {
		...metadataSnapshot,
		startup,
		workerProviderIds,
		metrics: {
			...metadataSnapshot.metrics,
			startupPlanMs,
			totalMs: metadataSnapshot.metrics.totalMs + startupPlanMs,
			startupPluginCount: startup.pluginIds.length
		}
	};
	let memoByKey = lookupTableMemoBySnapshot.get(metadataSnapshot);
	if (!memoByKey) {
		memoByKey = /* @__PURE__ */ new Map();
		lookupTableMemoBySnapshot.set(metadataSnapshot, memoByKey);
	}
	memoByKey.set(memoKey, table);
	return table;
}
//#endregion
export { loadPluginLookUpTable as t };
