import { t as definePluginEntry } from "./plugin-entry-B4wzLSpS.js";
import "./core-Bqt7fa3M.js";
//#region extensions/reef/src/cli-metadata.ts
function registerReefCliMetadata(api) {
	api.registerCli(async ({ program }) => {
		const { registerReefCli } = await import("./cli-BrHIuHb2.js");
		registerReefCli({ program });
	}, { descriptors: [{
		name: "reef",
		description: "Register on a Reef relay and manage guarded claw-to-claw friendships",
		hasSubcommands: true
	}] });
}
//#endregion
//#region extensions/reef/cli-metadata.ts
var cli_metadata_default = definePluginEntry({
	id: "reef",
	name: "Reef",
	description: "Guarded end-to-end encrypted claw channel",
	register: registerReefCliMetadata
});
//#endregion
export { registerReefCliMetadata as n, cli_metadata_default as t };
