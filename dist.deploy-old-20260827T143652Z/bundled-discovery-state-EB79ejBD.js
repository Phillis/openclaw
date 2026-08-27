import { n as readConfigMachineState } from "./config-machine-state-DtXnQEX3.js";
//#region src/plugins/bundled-discovery-state.ts
function readBundledDiscoveryMode(options = {}) {
	const value = readConfigMachineState("plugins.bundledDiscovery", options);
	return value === "compat" || value === "allowlist" ? value : void 0;
}
//#endregion
export { readBundledDiscoveryMode as t };
