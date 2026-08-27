import { t as definePluginEntry } from "../../plugin-entry-B4wzLSpS.js";
import { t as GOOGLE_MEET_CLI_DESCRIPTOR } from "../../cli-output-mode-DYci1shn.js";
//#region extensions/google-meet/cli-metadata.ts
var cli_metadata_default = definePluginEntry({
	id: "google-meet",
	name: "Google Meet",
	description: "Google Meet CLI metadata",
	register(api) {
		api.registerCli(() => {}, { descriptors: [GOOGLE_MEET_CLI_DESCRIPTOR] });
	}
});
//#endregion
export { cli_metadata_default as default };
