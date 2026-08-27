import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.js";
import { B as resolveOpenClawAgentSqlitePath } from "./openclaw-agent-db-maintenance-_0tYy-zT.js";
import { t as resolveMemorySearchConfig } from "./memory-search-B-lfdaLt.js";
import { i as resolveSharedMemoryStatusSnapshot } from "./status.scan.shared-B_rlfnz5.js";
//#region src/commands/status.scan-memory.ts
const statusScanDepsRuntimeModuleLoader = createLazyImportLoader(() => import("./status.scan.deps.runtime.js"));
/** Returns the owning agent database path for built-in memory. */
function resolveDefaultMemoryDatabasePath(agentId) {
	return resolveOpenClawAgentSqlitePath({ agentId });
}
/** Resolves memory index/cache status for the current status scan. */
async function resolveStatusMemoryStatusSnapshot(params) {
	const { getMemorySearchManager } = await statusScanDepsRuntimeModuleLoader.load();
	return await resolveSharedMemoryStatusSnapshot({
		cfg: params.cfg,
		agentStatus: params.agentStatus,
		memoryPlugin: params.memoryPlugin,
		resolveMemoryConfig: resolveMemorySearchConfig,
		getMemorySearchManager,
		requireDefaultDatabasePath: params.requireDefaultDatabasePath
	});
}
//#endregion
export { resolveStatusMemoryStatusSnapshot as n, resolveDefaultMemoryDatabasePath as t };
