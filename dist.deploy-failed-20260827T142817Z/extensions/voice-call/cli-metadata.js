import { t as definePluginEntry } from "../../plugin-entry-B4wzLSpS.js";
import { t as VOICE_CALL_CLI_DESCRIPTOR } from "../../cli-output-mode-CpMZs2b4.js";
//#region extensions/voice-call/cli-metadata.ts
var cli_metadata_default = definePluginEntry({
	id: "voice-call",
	name: "Voice Call",
	description: "Voice call channel plugin",
	register(api) {
		api.registerCli(() => {}, {
			commands: ["voicecall"],
			descriptors: [VOICE_CALL_CLI_DESCRIPTOR]
		});
	}
});
//#endregion
export { cli_metadata_default as default };
