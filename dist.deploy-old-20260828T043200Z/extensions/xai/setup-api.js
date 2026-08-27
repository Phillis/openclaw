import { c as isRecord } from "../../record-coerce-DItp3I4t.js";
import "../../string-coerce-runtime-C8jKEm3h.js";
import { t as definePluginEntry } from "../../plugin-entry-BIDZMa3K.js";
//#region extensions/xai/setup-api.ts
var setup_api_default = definePluginEntry({
	id: "xai",
	name: "xAI Setup",
	description: "Lightweight xAI setup hooks",
	register(api) {
		api.registerAutoEnableProbe(({ config }) => {
			const pluginConfig = config.plugins?.entries?.xai?.config;
			if (isRecord(pluginConfig) && (isRecord(pluginConfig.xSearch) || isRecord(pluginConfig.codeExecution))) return "xai tool configured";
			return null;
		});
	}
});
//#endregion
export { setup_api_default as default };
