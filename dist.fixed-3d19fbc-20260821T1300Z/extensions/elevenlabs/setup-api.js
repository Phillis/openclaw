import { t as definePluginEntry } from "../../plugin-entry-Ckewxva0.js";
import { n as migrateElevenLabsLegacyTalkConfig } from "../../config-compat-DRnArMlG.js";
//#region extensions/elevenlabs/setup-api.ts
var setup_api_default = definePluginEntry({
	id: "elevenlabs",
	name: "ElevenLabs Setup",
	description: "Lightweight ElevenLabs setup hooks",
	register(api) {
		api.registerConfigMigration((config) => migrateElevenLabsLegacyTalkConfig(config));
	}
});
//#endregion
export { setup_api_default as default };
