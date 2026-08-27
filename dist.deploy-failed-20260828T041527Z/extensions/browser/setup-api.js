import { c as normalizeOptionalLowercaseString } from "../../string-coerce-CIXf7egm.js";
import { c as isRecord } from "../../record-coerce-DItp3I4t.js";
import { a as listAgentIds, s as resolveAgentConfig } from "../../agent-scope-config-CUBiGmG3.js";
import "../../string-coerce-runtime-C8jKEm3h.js";
import "../../agent-scope-runtime-D15-6dFI.js";
import { t as definePluginEntry } from "../../plugin-entry-BIDZMa3K.js";
//#region extensions/browser/setup-api.ts
function listContainsBrowser(value) {
	return Array.isArray(value) && value.some((entry) => normalizeOptionalLowercaseString(entry) === "browser");
}
function toolPolicyReferencesBrowser(value) {
	return isRecord(value) && (listContainsBrowser(value.allow) || listContainsBrowser(value.alsoAllow));
}
function hasBrowserToolReference(config) {
	if (toolPolicyReferencesBrowser(config.tools)) return true;
	return listAgentIds(config).some((agentId) => toolPolicyReferencesBrowser(resolveAgentConfig(config, agentId)?.tools));
}
/** Setup entry that detects existing Browser configuration references. */
var setup_api_default = definePluginEntry({
	id: "browser",
	name: "Browser Setup",
	description: "Lightweight Browser setup hooks",
	register(api) {
		api.registerAutoEnableProbe(({ config }) => {
			if (config.browser?.enabled === false || config.plugins?.entries?.browser?.enabled === false) return null;
			if (Object.hasOwn(config, "browser")) return "browser configured";
			if (config.plugins?.entries && Object.hasOwn(config.plugins.entries, "browser")) return "browser plugin configured";
			if (hasBrowserToolReference(config)) return "browser tool referenced";
			return null;
		});
	}
});
//#endregion
export { setup_api_default as default };
