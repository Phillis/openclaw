import { r as createLazyRuntimeModule } from "./lazy-runtime-CgCh8H_K.js";
import { r as formatErrorMessage } from "./errors-CSNUPl5U.js";
import { n as normalizeAgentId } from "./agent-id-Db0rqw_J.js";
import "./error-runtime-CmlvK1A3.js";
import "./routing-DG_rmd7A.js";
//#region extensions/memory-core/src/memory/search-manager.ts
const managerRuntimeLoader = createLazyRuntimeModule(() => import("./extensions/memory-core/manager-runtime.js"));
const loadManagerRuntime = managerRuntimeLoader;
async function getMemorySearchManager(params) {
	const startedAt = Date.now();
	return {
		...await getBuiltinMemorySearchManager(params),
		debug: {
			backend: "builtin",
			purpose: params.purpose ?? "default",
			managerMs: Math.max(0, Date.now() - startedAt)
		}
	};
}
async function getBuiltinMemorySearchManager(params) {
	try {
		const { MemoryIndexManager } = await loadManagerRuntime();
		return { manager: await MemoryIndexManager.get(params) };
	} catch (err) {
		return {
			manager: null,
			error: formatErrorMessage(err)
		};
	}
}
async function closeAllMemorySearchManagers() {
	if (!managerRuntimeLoader.peek()) return;
	const { closeAllMemoryIndexManagers } = await loadManagerRuntime();
	await closeAllMemoryIndexManagers();
}
async function closeMemorySearchManager(params) {
	if (!managerRuntimeLoader.peek()) return;
	const { closeMemoryIndexManagersForAgent } = await loadManagerRuntime();
	await closeMemoryIndexManagersForAgent({ agentId: normalizeAgentId(params.agentId) });
}
//#endregion
export { closeMemorySearchManager as n, getMemorySearchManager as r, closeAllMemorySearchManagers as t };
