import { i as getOrCreatePromise } from "./lazy-promise-DGqyc4Y4.js";
import { w as resolveStateDir } from "./paths-CqeDjSA4.js";
import { a as loadNodeHostConfig } from "./config-BWm1RSBz.js";
//#region src/node-host/local-id.ts
const localNodeIdByStateDir = /* @__PURE__ */ new Map();
/**
* Resolve the same-install node host from canonical shared SQLite state.
* Node-host config changes require restart, so this fact stays process-stable.
*/
async function resolveLocalNodeId(env = process.env) {
	const stateDir = resolveStateDir(env);
	return await getOrCreatePromise(localNodeIdByStateDir, stateDir, async () => (await loadNodeHostConfig(env))?.nodeId ?? null, { cacheRejections: false });
}
//#endregion
export { resolveLocalNodeId as t };
