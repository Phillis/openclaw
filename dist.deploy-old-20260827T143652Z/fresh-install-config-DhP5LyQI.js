//#region src/cli/fresh-install-config.ts
const UNCONFIGURED_CONFIG_IGNORED_KEYS = /* @__PURE__ */ new Set(["$schema", "meta"]);
function isIncompleteWizardConfig(value) {
	return typeof value === "object" && value !== null && !Array.isArray(value) && Object.keys(value).every((key) => key === "securityAcknowledgedAt" || key === "accessMode");
}
function isUnconfiguredConfigSource(sourceConfig) {
	return Object.entries(sourceConfig).every(([key, value]) => UNCONFIGURED_CONFIG_IGNORED_KEYS.has(key) || key === "wizard" && isIncompleteWizardConfig(value));
}
//#endregion
export { isUnconfiguredConfigSource as t };
