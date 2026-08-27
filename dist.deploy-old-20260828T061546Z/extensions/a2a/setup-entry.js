import { n as defineBundledChannelSetupEntry } from "../../channel-entry-contract-DmYo-ZOH.js";
//#region extensions/a2a/setup-entry.ts
var setup_entry_default = defineBundledChannelSetupEntry({
	importMetaUrl: import.meta.url,
	plugin: {
		specifier: "./setup-plugin-api.js",
		exportName: "a2aChannelSetupPlugin"
	},
	runtime: {
		specifier: "./api.js",
		exportName: "setA2aChannelRuntime"
	}
});
//#endregion
export { setup_entry_default as default };
