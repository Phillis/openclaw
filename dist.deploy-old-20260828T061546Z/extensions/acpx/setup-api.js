import { o as normalizeLowercaseStringOrEmpty } from "../../string-coerce-CIXf7egm.js";
import "../../string-coerce-runtime-C8jKEm3h.js";
import { t as definePluginEntry } from "../../plugin-entry-BIDZMa3K.js";
//#region extensions/acpx/setup-api.ts
/**
* ACPX setup plugin entry. It auto-enables setup when ACP config already points
* at the embedded ACPX runtime backend.
*/
var setup_api_default = definePluginEntry({
	id: "acpx",
	name: "ACPX Setup",
	description: "Lightweight ACPX setup hooks",
	register(api) {
		api.registerAutoEnableProbe(({ config }) => {
			const backendRaw = normalizeLowercaseStringOrEmpty(config.acp?.backend);
			return (config.acp?.enabled === true || config.acp?.dispatch?.enabled === true || backendRaw === "acpx") && (!backendRaw || backendRaw === "acpx") ? "ACP runtime configured" : null;
		});
	}
});
//#endregion
export { setup_api_default as default };
