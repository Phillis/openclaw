import { d as resolveConfigDir } from "./utils-DEqefz4f.js";
import { w as resolveStateDir } from "./paths-CqeDjSA4.js";
import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.js";
import os from "node:os";
import path from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/plugins/install-root-context.ts
const pluginInstallRootContext = resolveGlobalSingleton(Symbol.for("openclaw.pluginInstallRootContext"), () => new AsyncLocalStorage());
/** Resolve the ordinary operator-owned plugin roots before a run redirects state. */
function resolvePluginInstallRoots(env = process.env, homedir = os.homedir) {
	const configDir = resolveConfigDir(env, homedir);
	return Object.freeze({
		extensionsDir: path.join(configDir, "extensions"),
		gitDir: path.join(configDir, "git"),
		npmDir: path.join(configDir, "npm"),
		stateDir: resolveStateDir(env, homedir)
	});
}
/** Return run-pinned install roots, or resolve the caller's ordinary roots. */
function resolveActivePluginInstallRoots(env = process.env, homedir = os.homedir) {
	return pluginInstallRootContext.getStore() ?? resolvePluginInstallRoots(env, homedir);
}
/** Return whether the current run pinned operator-owned plugin install roots. */
function hasActivePluginInstallRoots() {
	return pluginInstallRootContext.getStore() !== void 0;
}
/**
* Keep plugin discovery on one operator-owned install generation while a run
* redirects OPENCLAW_STATE_DIR for ephemeral sessions and runtime state.
*/
function withPluginInstallRoots(roots, run) {
	return pluginInstallRootContext.run(roots, run);
}
//#endregion
export { withPluginInstallRoots as i, resolveActivePluginInstallRoots as n, resolvePluginInstallRoots as r, hasActivePluginInstallRoots as t };
