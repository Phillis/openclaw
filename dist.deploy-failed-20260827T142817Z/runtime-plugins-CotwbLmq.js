import { c as resolveUserPath } from "./home-dir-DcrXWQPU.js";
import "./utils-DEqefz4f.js";
import { s as normalizePluginsConfig } from "./config-state-CpuWFwzR.js";
import { t as getCurrentPluginMetadataSnapshot } from "./current-plugin-metadata-snapshot-B1YRfQOc.js";
import { d as getActivePluginRegistry } from "./runtime-CTbL314X.js";
import { n as loadPluginRegistryHandle } from "./loader-CwiP0Igf.js";
import { a as withPluginRuntimeRegistryScope, t as getPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-BULcX9xX.js";
import { t as collectConfiguredAgentHarnessRuntimes } from "./harness-runtimes-D0IsOwBn.js";
import { a as promoteMatchingRuntimeContextEngineRegistrations } from "./registry-DOMV71ew.js";
import { i as listRuntimePluginIdsFromRegistry } from "./active-runtime-registry-DA-5LJYr.js";
import { r as resolveAgentRuntimePluginLoadPlan } from "./runtime-plugin-load-plan-B6zJFbSL.js";
//#region src/agents/runtime-plugins.ts
function resolveStartupPluginIdsFromCurrentSnapshot(params) {
	const pluginIds = getCurrentPluginMetadataSnapshot({
		config: params.config,
		env: params.env,
		workspaceDir: params.workspaceDir
	})?.startup?.pluginIds;
	if (!Array.isArray(pluginIds)) return;
	return pluginIds.filter((pluginId) => typeof pluginId === "string");
}
function resolveAgentRuntimePluginRegistryLoad(params) {
	const workspaceDir = typeof params.workspaceDir === "string" && params.workspaceDir.trim() ? resolveUserPath(params.workspaceDir) : void 0;
	if (params.config && !normalizePluginsConfig(params.config.plugins).enabled) return { loadOptions: {
		config: params.config,
		activationSourceConfig: params.config,
		...params.env ? { env: params.env } : {},
		workspaceDir,
		onlyPluginIds: [],
		runtimeOptions: params.allowGatewaySubagentBinding ? { allowGatewaySubagentBinding: true } : void 0
	} };
	const requestPluginRegistry = getPluginRuntimeGatewayRequestScope()?.pluginRegistry;
	const startupPluginIds = params.basePluginIds !== void 0 ? [...params.basePluginIds] : requestPluginRegistry ? listRuntimePluginIdsFromRegistry(requestPluginRegistry) : resolveStartupPluginIdsFromCurrentSnapshot({
		config: params.config,
		env: params.env,
		workspaceDir
	});
	const plan = resolveAgentRuntimePluginLoadPlan({
		config: params.config,
		workspaceDir: workspaceDir ?? process.cwd(),
		...startupPluginIds === void 0 ? {} : { basePluginIds: startupPluginIds },
		selections: [...collectConfiguredAgentHarnessRuntimes(params.config ?? {}).map((runtime) => ({
			runtime,
			provider: "",
			modelId: ""
		})), ...params.selections ?? []]
	});
	return { loadOptions: {
		config: plan.config,
		...plan.config ? { activationSourceConfig: plan.config } : {},
		...params.env ? { env: params.env } : {},
		workspaceDir,
		...startupPluginIds === void 0 || plan.pluginIds === void 0 ? {} : { onlyPluginIds: plan.pluginIds },
		...startupPluginIds === void 0 ? {} : { channelPluginLoadIntent: "full" },
		runtimeOptions: params.allowGatewaySubagentBinding ? { allowGatewaySubagentBinding: true } : void 0
	} };
}
/** Loads the registry handle owned by an agent prepared-runtime generation. */
function loadAgentRuntimePluginRegistryHandle(params) {
	const pluginRegistry = loadPluginRegistryHandle({
		...resolveAgentRuntimePluginRegistryLoad(params).loadOptions,
		activate: false
	});
	const activeRegistry = getActivePluginRegistry();
	if (activeRegistry) promoteMatchingRuntimeContextEngineRegistrations(pluginRegistry, activeRegistry);
	return pluginRegistry;
}
/** Binds a scoped plugin generation when a direct host has no Gateway owner. */
async function withAgentPluginRegistry(params) {
	if (getPluginRuntimeGatewayRequestScope()?.pluginRegistry) return await params.run();
	return await withPluginRuntimeRegistryScope(loadAgentRuntimePluginRegistryHandle({
		basePluginIds: [],
		config: params.config,
		workspaceDir: params.workspaceDir
	}), params.run);
}
//#endregion
export { withAgentPluginRegistry as n, loadAgentRuntimePluginRegistryHandle as t };
