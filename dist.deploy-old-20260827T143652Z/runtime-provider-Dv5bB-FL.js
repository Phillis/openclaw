import { t as resolveMemoryBackendConfig } from "./backend-config-D3tXhXDP.js";
import "./memory-core-host-runtime-files-DzB4Pyg9.js";
import { p as configureMemoryCoreDreamingState } from "./dreaming-state-DWEtHClN.js";
import { n as closeMemorySearchManager, r as getMemorySearchManager, t as closeAllMemorySearchManagers } from "./memory-DV0ztLK3.js";
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
			const { filterMemorySearchHitsBySessionVisibility } = await import("./session-search-visibility-DvyxIJib.js");
			return await filterMemorySearchHitsBySessionVisibility(params);
		},
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
