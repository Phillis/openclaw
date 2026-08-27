import "./src-BntaCZM-.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import { a as updateConfigMachineState, r as readConfigMachineState } from "./config-machine-state-FNVGu8mV.js";
//#region src/hooks/installs.ts
/** Read canonical hook install records from machine state. */
function readHookInstalls(options = {}) {
	return readConfigMachineState("hooks.internal.installs", options) ?? {};
}
/** Persist one hook install record in machine state. */
function recordHookInstall(cfg, update, options = {}) {
	const { hookId, ...record } = update;
	updateConfigMachineState("hooks.internal.installs", (current) => {
		const installs = {
			...current,
			[hookId]: {
				...current?.[hookId],
				...record,
				installedAt: record.installedAt ?? (/* @__PURE__ */ new Date()).toISOString()
			}
		};
		installs[hookId] = expectDefined(installs[hookId], "installs entry at hook id");
		return installs;
	}, options);
	return cfg;
}
//#endregion
export { recordHookInstall as n, readHookInstalls as t };
