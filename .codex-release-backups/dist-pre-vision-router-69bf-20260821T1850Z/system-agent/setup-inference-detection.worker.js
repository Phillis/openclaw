import { t as listRecommendedToolInstalls } from "../recommended-tool-installs-D82Xprf0.js";
import { c as listManualSetupInferenceOptions, s as detectSetupInference } from "../setup-inference-BJJKxzdT.js";
import { parentPort, workerData } from "node:worker_threads";
//#region src/system-agent/setup-inference-detection.worker.ts
if (!parentPort) throw new Error("setup inference detection worker requires a parent port");
const port = parentPort;
try {
	const agentId = workerData && typeof workerData === "object" && typeof workerData.agentId === "string" ? workerData.agentId : void 0;
	const manual = await listManualSetupInferenceOptions({}, agentId);
	const partial = {
		candidates: [],
		unavailableCandidates: [],
		recommendedInstalls: listRecommendedToolInstalls(),
		...manual
	};
	port.postMessage({
		type: "partial",
		detection: partial
	});
	const detection = await detectSetupInference({}, agentId);
	port.postMessage({
		type: "result",
		detection
	});
} catch (error) {
	port.postMessage({
		ok: false,
		error: error instanceof Error ? error.message : String(error)
	});
} finally {
	port.close();
}
//#endregion
export {};
