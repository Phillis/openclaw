import { n as defineBundledChannelSetupEntry } from "../../channel-entry-contract-DmYo-ZOH.js";
//#region extensions/buzz/setup-entry.ts
var setup_entry_default = defineBundledChannelSetupEntry({
	importMetaUrl: import.meta.url,
	plugin: {
		specifier: "./setup-plugin-api.js",
		exportName: "buzzSetupPlugin"
	},
	secrets: {
		specifier: "./secret-contract-api.js",
		exportName: "channelSecrets"
	}
});
//#endregion
export { setup_entry_default as default };
