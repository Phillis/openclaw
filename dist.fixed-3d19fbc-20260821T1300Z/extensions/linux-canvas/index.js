import { Ln as strictObject } from "../../schemas-C7gqXY2T.js";
import { n as buildPluginConfigSchema } from "../../config-schema-6BJZGtr6.js";
import { t as definePluginEntry } from "../../plugin-entry-Ckewxva0.js";
import { t as createLinuxCanvasCommands } from "../../api-Csjl8Ys2.js";
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
