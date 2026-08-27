import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.js";
import { n as loadActivatedBundledPluginPublicSurfaceModuleSync } from "./facade-runtime-Tnp-oiQo.js";
import { A as createPodmanSandboxBackend, M as podmanSandboxBackendManager, i as sshSandboxBackendManager, j as dockerSandboxBackendManager, k as createDockerSandboxBackend, n as createSshSandboxBackend, r as resolveSshRuntimePaths } from "./ssh-backend-SWxgR7nm.js";
//#region src/agents/sandbox/backend.ts
/**
* Sandbox backend registry.
*
* Stores process-wide backend factories so core and plugins can register local container, SSH, or custom sandbox providers.
*/
const SANDBOX_BACKEND_FACTORIES_STATE_KEY = Symbol.for("openclaw.sandboxBackendFactories");
function getSandboxBackendFactories() {
	const globalStore = globalThis;
	globalStore[SANDBOX_BACKEND_FACTORIES_STATE_KEY] ??= /* @__PURE__ */ new Map();
	return globalStore[SANDBOX_BACKEND_FACTORIES_STATE_KEY];
}
function normalizeSandboxBackendId(id) {
	const normalized = normalizeOptionalLowercaseString(id);
	if (!normalized) throw new Error("Sandbox backend id must not be empty.");
	return normalized;
}
/** Register or replace a sandbox backend and return a restore callback. */
function registerSandboxBackend(id, registration) {
	const normalizedId = normalizeSandboxBackendId(id);
	const resolved = typeof registration === "function" ? { factory: registration } : registration;
	const factories = getSandboxBackendFactories();
	const previous = factories.get(normalizedId);
	factories.set(normalizedId, resolved);
	return () => {
		const currentFactories = getSandboxBackendFactories();
		if (previous) {
			currentFactories.set(normalizedId, previous);
			return;
		}
		currentFactories.delete(normalizedId);
	};
}
/** Look up a sandbox backend factory by normalized backend id. */
function getSandboxBackendFactory(id) {
	return getSandboxBackendFactories().get(normalizeSandboxBackendId(id))?.factory ?? null;
}
/** Look up optional lifecycle management hooks for a registered backend. */
function getSandboxBackendManager(id) {
	return getSandboxBackendFactories().get(normalizeSandboxBackendId(id))?.manager ?? null;
}
/** Look up optional backend workdir resolution that does not start the runtime. */
function getSandboxBackendWorkdirResolver(id) {
	return getSandboxBackendFactories().get(normalizeSandboxBackendId(id))?.resolveWorkdir ?? null;
}
/** Resolve a backend factory or throw the user-facing configuration error. */
function requireSandboxBackendFactory(id) {
	const factory = getSandboxBackendFactory(id);
	if (factory) return factory;
	throw new Error([`Sandbox backend "${id}" is not registered.`, "Load the plugin that provides it, or set agents.defaults.sandbox.backend=docker."].join("\n"));
}
registerSandboxBackend("docker", {
	factory: createDockerSandboxBackend,
	manager: dockerSandboxBackendManager,
	resolveWorkdir: ({ cfg }) => cfg.docker.workdir
});
registerSandboxBackend("podman", {
	factory: createPodmanSandboxBackend,
	manager: podmanSandboxBackendManager,
	resolveWorkdir: ({ cfg }) => cfg.docker.workdir
});
registerSandboxBackend("ssh", {
	factory: createSshSandboxBackend,
	manager: sshSandboxBackendManager,
	resolveWorkdir: ({ cfg, scopeKey }) => resolveSshRuntimePaths(cfg.ssh.workspaceRoot, scopeKey).remoteWorkspaceDir
});
//#endregion
//#region src/plugin-sdk/browser-bridge.ts
function loadFacadeModule() {
	return loadActivatedBundledPluginPublicSurfaceModuleSync({
		dirName: "browser",
		artifactBasename: "runtime-api.js"
	});
}
/** Starts the browser bridge runtime from the activated browser plugin facade. */
async function startBrowserBridgeServer(params) {
	return await loadFacadeModule().startBrowserBridgeServer(params);
}
/** Stops a browser bridge server previously returned by startBrowserBridgeServer. */
async function stopBrowserBridgeServer(server) {
	await loadFacadeModule().stopBrowserBridgeServer(server);
}
//#endregion
//#region src/agents/sandbox/browser-bridges.ts
/**
* In-process browser bridge registry keyed by sandbox session.
*
* The prune path uses this table to stop bridge servers when backing containers expire.
*/
const BROWSER_BRIDGES = /* @__PURE__ */ new Map();
/** Stop and remove only the cached bridge instance the caller inspected. */
async function stopCachedBrowserBridge(sessionKey, expected) {
	if (BROWSER_BRIDGES.get(sessionKey) !== expected) return;
	await stopBrowserBridgeServer(expected.bridge.server);
	if (BROWSER_BRIDGES.get(sessionKey) === expected) BROWSER_BRIDGES.delete(sessionKey);
}
/** Drain every cached bridge that still owns one sandbox container. */
async function stopCachedBrowserBridgesForContainer(containerName) {
	for (;;) {
		const match = [...BROWSER_BRIDGES].find(([, cached]) => cached.containerName === containerName);
		if (!match) return;
		await stopCachedBrowserBridge(match[0], match[1]);
	}
}
//#endregion
export { getSandboxBackendFactory as a, registerSandboxBackend as c, startBrowserBridgeServer as i, requireSandboxBackendFactory as l, stopCachedBrowserBridge as n, getSandboxBackendManager as o, stopCachedBrowserBridgesForContainer as r, getSandboxBackendWorkdirResolver as s, BROWSER_BRIDGES as t };
