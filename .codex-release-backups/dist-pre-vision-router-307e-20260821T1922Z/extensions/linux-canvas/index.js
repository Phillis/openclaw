import { Ln as strictObject } from "../../schemas-CZ9Toj_c.js";
import { n as buildPluginConfigSchema } from "../../config-schema-CkCZDriU.js";
import { t as definePluginEntry } from "../../plugin-entry-B4wzLSpS.js";
import { t as createLinuxCanvasCommands } from "../../api-BniLfaKN.js";
var linux_canvas_default = definePluginEntry({
	id: "linux-canvas",
	name: "Linux Canvas",
	description: "Canvas rendering bridge for the OpenClaw Linux desktop app.",
	configSchema: buildPluginConfigSchema(strictObject({})),
	register(api) {
		for (const command of createLinuxCanvasCommands()) api.registerNodeHostCommand(command);
	}
});
//#endregion
export { linux_canvas_default as default };
