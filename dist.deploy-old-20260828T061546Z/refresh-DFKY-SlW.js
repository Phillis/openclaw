import { t as ExpectedCliError } from "./failure-output-CdUzE2dC.js";
import { a as writeRuntimeJson } from "./runtime-LRpY2Icg.js";
import { n as getRuntimeConfig } from "./io-ClLVsBMp.js";
import "./config-B_0xOnKq.js";
import { n as refreshRemoteModelCatalog } from "./remote-refresh-BunhUNB9.js";
//#region src/commands/models/refresh.ts
async function modelsRefreshCommand(options, runtime) {
	const result = await refreshRemoteModelCatalog({
		config: getRuntimeConfig(),
		force: true
	});
	if (result.status === "error") {
		const message = `Remote catalog refresh failed: ${result.error}`;
		throw new ExpectedCliError({
			message,
			humanOutput: message,
			machineOutput: message
		});
	}
	if (options.json) {
		writeRuntimeJson(runtime, result, 0);
		return;
	}
	if (result.status === "disabled") {
		runtime.log("Remote catalog refresh is disabled (models.catalogRefresh.enabled=false)");
		return;
	}
	runtime.log(`Remote catalog refresh: ${result.status} (${result.providers} providers, ${result.models} models; generated ${new Date(result.generatedAt).toISOString()})`);
	if (result.status === "updated") runtime.log("A running Gateway applies the updated catalog after its next restart.");
}
//#endregion
export { modelsRefreshCommand };
