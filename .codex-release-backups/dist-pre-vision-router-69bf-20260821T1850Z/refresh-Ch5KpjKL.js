import { a as writeRuntimeJson } from "./runtime-DtFIMC-W.js";
import { r as getRuntimeConfig } from "./io-BTBpQ7uO.js";
import { i as refreshRemoteModelCatalog } from "./model-catalog-5PpQ61MN.js";
import "./config-CfeGo4K4.js";
//#region src/commands/models/refresh.ts
async function modelsRefreshCommand(options, runtime) {
	const result = await refreshRemoteModelCatalog({
		config: getRuntimeConfig(),
		force: true
	});
	if (options.json) {
		writeRuntimeJson(runtime, result, 0);
		if (result.status === "error") runtime.exit(1);
		return;
	}
	if (result.status === "disabled") {
		runtime.log("Remote catalog refresh is disabled (models.catalogRefresh.enabled=false)");
		return;
	}
	if (result.status === "error") {
		runtime.error(`Remote catalog refresh failed: ${result.error}`);
		runtime.exit(1);
		return;
	}
	runtime.log(`Remote catalog refresh: ${result.status} (${result.providers} providers, ${result.models} models; generated ${new Date(result.generatedAt).toISOString()})`);
	if (result.status === "updated") runtime.log("A running Gateway applies the updated catalog after its next restart.");
}
//#endregion
export { modelsRefreshCommand };
