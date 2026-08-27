import { n as resolveActivePluginInstallRoots, t as hasActivePluginInstallRoots } from "./install-root-context-GQzXSH_D.js";
import { r as readConfigMachineState } from "./config-machine-state-DjliVw3j.js";
//#region src/plugins/bundled-discovery-state.ts
function readBundledDiscoveryMode(options = {}) {
	const value = readConfigMachineState("plugins.bundledDiscovery", options.path || options.database || !hasActivePluginInstallRoots() ? options : {
		...options,
		env: {
			...options.env ?? process.env,
			OPENCLAW_STATE_DIR: resolveActivePluginInstallRoots(options.env).stateDir
		}
	});
	return value === "compat" || value === "allowlist" ? value : void 0;
}
//#endregion
export { readBundledDiscoveryMode as t };
