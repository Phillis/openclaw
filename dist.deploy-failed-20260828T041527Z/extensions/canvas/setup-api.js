import { t as definePluginEntry } from "../../plugin-entry-BIDZMa3K.js";
import { t as migrateCanvasHostConfig } from "../../config-migration-BD3ComIy.js";
//#region extensions/canvas/setup-api.ts
/**
* Canvas setup entrypoint that exposes config migrations.
*/
var setup_api_default = definePluginEntry({
	id: "canvas",
	name: "Canvas Setup",
	description: "Lightweight Canvas setup hooks",
	register(api) {
		api.registerConfigMigration((config) => migrateCanvasHostConfig(config));
	}
});
//#endregion
export { setup_api_default as default };
