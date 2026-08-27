import { r as readConfigMachineState } from "./config-machine-state-FNVGu8mV.js";
//#region src/hooks/configured.ts
function hasEnabledFlag(entry) {
	return entry?.enabled !== false;
}
function hasEnabledEntry(entries) {
	if (!entries) return false;
	return Object.values(entries).some(hasEnabledFlag);
}
function hasConfiguredInstalls(installs) {
	return installs ? Object.keys(installs).length > 0 : false;
}
function readConfiguredInstalls() {
	return readConfigMachineState("hooks.internal.installs");
}
/** Return whether config can load any internal hooks. */
function hasConfiguredInternalHooks(config) {
	const internal = config.hooks?.internal;
	const installs = readConfiguredInstalls();
	if (!internal) return hasConfiguredInstalls(installs);
	if (internal.enabled === false) return false;
	if (internal.enabled === true) return true;
	if (hasEnabledEntry(internal.entries)) return true;
	if ((internal.load?.extraDirs ?? []).some((dir) => dir.trim().length > 0)) return true;
	if (hasConfiguredInstalls(installs)) return true;
	return false;
}
/** Resolve explicitly configured internal hook names; null means all/discovered hooks may load. */
function resolveConfiguredInternalHookNames(config) {
	const internal = config.hooks?.internal;
	const installs = readConfiguredInstalls();
	if (internal?.enabled === false) return /* @__PURE__ */ new Set();
	const names = /* @__PURE__ */ new Set();
	let hasNamedEntries = false;
	for (const [name, entry] of Object.entries(internal?.entries ?? {})) {
		const trimmed = name.trim();
		if (!trimmed) continue;
		hasNamedEntries = true;
		if (hasEnabledFlag(entry)) names.add(trimmed);
	}
	for (const [installId, install] of Object.entries(installs ?? {})) {
		const hookNames = install.hooks ?? [];
		if (hookNames.length === 0 && installId.trim()) return null;
		for (const hookName of hookNames) {
			const trimmedHookName = hookName.trim();
			if (trimmedHookName) names.add(trimmedHookName);
		}
	}
	if ((internal?.load?.extraDirs ?? []).some((dir) => dir.trim().length > 0)) return null;
	if (hasNamedEntries || names.size > 0) return names;
	return internal?.enabled === true ? null : names;
}
//#endregion
export { resolveConfiguredInternalHookNames as n, hasConfiguredInternalHooks as t };
