import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { qa as validateWorkerAdmissionHandshake } from "./src-BlUKtAtD.js";
//#region src/infra/node-runner-inventory.ts
const NODE_RUNNER_INVENTORY_UPDATE_METHOD = "node.runnerInventory.update";
const NODE_WORKER_SUPERVISOR_PROTOCOL_FEATURE = "node-worker-supervisor-v1";
/** Parses the closed reconnect-scoped node-host runner declaration. */
function parseNodeRunnerInventoryDeclaration(value) {
	if (!isRecord(value)) return null;
	const keys = Object.keys(value);
	if (keys.length < 1 || keys.length > 2 || !Object.hasOwn(value, "protocolFeatures") || keys.some((key) => key !== "protocolFeatures" && key !== "workerRuns") || !Array.isArray(value.protocolFeatures) || value.protocolFeatures.length > 1) return null;
	let protocolFeatures;
	if (value.protocolFeatures.length === 0) protocolFeatures = [];
	else if (value.protocolFeatures[0] === "node-worker-supervisor-v1") protocolFeatures = [NODE_WORKER_SUPERVISOR_PROTOCOL_FEATURE];
	else return null;
	const workerRuns = value.workerRuns;
	if (workerRuns !== void 0) {
		if (protocolFeatures.length === 0 || !validateWorkerAdmissionHandshake(workerRuns)) return null;
		return {
			protocolFeatures,
			workerRuns: structuredClone(workerRuns)
		};
	}
	return { protocolFeatures };
}
//#endregion
export { NODE_WORKER_SUPERVISOR_PROTOCOL_FEATURE as n, parseNodeRunnerInventoryDeclaration as r, NODE_RUNNER_INVENTORY_UPDATE_METHOD as t };
