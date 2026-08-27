import { t as resolveMemoryBackendConfig } from "./backend-config-D3tXhXDP.js";
import "./memory-core-host-runtime-files-B1FCGhDz.js";
import { p as configureMemoryCoreDreamingState } from "./dreaming-state-B0qd2W7q.js";
import { n as closeMemorySearchManager, r as getMemorySearchManager, t as closeAllMemorySearchManagers } from "./memory-C9fU0lET.js";
import { t as classifyWorkspaceMemoryPaths } from "./workspace-path-classifier-BUJz32jW.js";
//#region extensions/memory-core/src/runtime-provider.ts
function createMemoryRuntime(host = {}) {
	if (host.openKeyedStore) configureMemoryCoreDreamingState(host.openKeyedStore);
	return {
		async getMemorySearchManager(params) {
			const { manager, debug, error } = await getMemorySearchManager({
				...params,
				...host.acquireLocalService ? { acquireLocalService: host.acquireLocalService } : {}
			});
			return {
				manager,
				debug,
				error
			};
		},
		resolveMemoryBackendConfig(params) {
			return resolveMemoryBackendConfig(params);
		},
		async authorizeSearchHits(params) {
			const { filterMemorySearchHitsBySessionVisibility } = await import("./session-search-visibility-Cmqu-RNU.js");
			return await filterMemorySearchHitsBySessionVisibility(params);
		},
		classifyWorkspaceMemoryPaths,
		async closeAllMemorySearchManagers() {
			await closeAllMemorySearchManagers();
		},
		async closeMemorySearchManager(params) {
			await closeMemorySearchManager(params);
		}
	};
}
const memoryRuntime = createMemoryRuntime();
//#endregion
export { memoryRuntime as n, createMemoryRuntime as t };
