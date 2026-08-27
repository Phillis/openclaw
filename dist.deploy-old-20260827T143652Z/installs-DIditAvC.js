import "./src-BkwWvwB2.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import { n as readConfigMachineState, r as updateConfigMachineState } from "./config-machine-state-DtXnQEX3.js";
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
