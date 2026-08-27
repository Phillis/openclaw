import { n as readConfigMachineState } from "./config-machine-state-4vCzA8Fc.js";
//#region src/plugins/bundled-discovery-state.ts
function readBundledDiscoveryMode(options = {}) {
	const value = readConfigMachineState("plugins.bundledDiscovery", options);
	return value === "compat" || value === "allowlist" ? value : void 0;
}
//#endregion
export { readBundledDiscoveryMode as t };
