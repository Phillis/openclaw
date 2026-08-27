import { t as definePluginEntry } from "../../plugin-entry-Ckewxva0.js";
import "../../core-C2t7ybgt.js";
import { t as isMemoryMachineOutput } from "../../cli-output-mode-VTVEx4hB.js";
//#region extensions/memory-lancedb/cli-metadata.ts
var cli_metadata_default = definePluginEntry({
	id: "memory-lancedb",
	name: "Memory LanceDB",
	description: "LanceDB-backed memory provider",
	register(api) {
		api.registerCli(() => {}, { descriptors: [{
			name: "ltm",
			description: "Inspect and query LanceDB-backed memory",
			hasSubcommands: true,
			machineOutput: isMemoryMachineOutput
		}] });
	}
});
//#endregion
export { cli_metadata_default as default };
