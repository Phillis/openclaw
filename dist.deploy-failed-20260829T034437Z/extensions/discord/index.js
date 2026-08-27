import { t as defineBundledChannelEntry } from "../../channel-entry-contract-DmYo-ZOH.js";
import { t as registerDiscordActivities } from "../../activities-api-CIlpdwV8.js";
import { t as registerDiscordSubagentHooks } from "../../subagent-hooks-api-DlXQ6PCw.js";
import { t as registerDiscordTranscriptSourceProvider } from "../../transcripts-source-api-4J3hI_ak.js";
//#region extensions/discord/index.ts
var discord_default = defineBundledChannelEntry({
	id: "discord",
	name: "Discord",
	description: "Discord channel plugin",
	importMetaUrl: import.meta.url,
	plugin: {
		specifier: "./channel-plugin-api.js",
		exportName: "discordPlugin"
	},
	runtime: {
		specifier: "./runtime-setter-api.js",
		exportName: "setDiscordRuntime"
	},
	accountInspect: {
		specifier: "./account-inspect-api.js",
		exportName: "inspectDiscordReadOnlyAccount"
	},
	registerFull(api) {
		registerDiscordActivities(api);
		registerDiscordSubagentHooks(api);
	},
	registerCapabilities(api) {
		registerDiscordTranscriptSourceProvider(api);
	}
});
//#endregion
export { discord_default as default };
