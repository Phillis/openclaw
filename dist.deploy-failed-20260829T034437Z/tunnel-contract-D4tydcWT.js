import { _ as NODE_WORKER_CAPACITY_EXHAUSTED_ERROR_CODE } from "./node-commands-DRxP7loh.js";
//#region src/gateway/worker-environments/tunnel-contract.ts
var WorkerTunnelOwnerDisconnectedError = class extends Error {
	constructor(message = "Worker tunnel owner is no longer connected") {
		super(message);
		this.name = "WorkerTunnelOwnerDisconnectedError";
	}
};
var WorkerRunnerUnavailableError = class extends Error {
	constructor() {
		super("The device runner is offline. Reconnect it, retry later, or bring the session back to this gateway.");
		this.code = "runner-offline";
		this.name = "WorkerRunnerUnavailableError";
	}
};
var WorkerRunnerCapacityError = class extends Error {
	constructor() {
		super("device worker capacity remained full");
		this.code = NODE_WORKER_CAPACITY_EXHAUSTED_ERROR_CODE;
		this.name = "WorkerRunnerCapacityError";
	}
};
//#endregion
export { WorkerRunnerUnavailableError as n, WorkerTunnelOwnerDisconnectedError as r, WorkerRunnerCapacityError as t };
