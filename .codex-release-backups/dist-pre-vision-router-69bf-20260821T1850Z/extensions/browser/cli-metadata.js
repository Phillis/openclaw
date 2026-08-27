import { t as definePluginEntry } from "../../plugin-entry-Ckewxva0.js";
import { t as isBrowserMachineOutput } from "../../cli-output-mode-DliOl6d6.js";
//#region extensions/browser/cli-metadata.ts
/**
* Browser CLI metadata entry. It registers the `openclaw browser` command lazily
* so command discovery does not load the full browser runtime.
*/
/** Plugin entry that contributes Browser CLI commands. */
var cli_metadata_default = definePluginEntry({
	id: "browser",
	name: "Browser",
	description: "Default browser tool plugin",
	register(api) {
		api.registerCli(async ({ program }) => {
			const { registerBrowserCli } = await import("../../browser-cli-CWQQ05Ye.js");
			registerBrowserCli(program, process.argv, api.rootDir);
		}, {
			commands: ["browser"],
			descriptors: [{
				name: "browser",
				description: "Manage OpenClaw's dedicated browser (Chrome/Chromium)",
				hasSubcommands: true,
				machineOutput: isBrowserMachineOutput
			}]
		});
	}
});
//#endregion
export { cli_metadata_default as default };
