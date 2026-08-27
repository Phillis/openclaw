import { n as signalProcessTree } from "./kill-tree-B-nnBWyI.js";
import { t as NODE_WORKER_CONNECTION_FAILURE_MESSAGE_TYPE } from "./node-supervisor-protocol-BIMk3zIL.js";
import { Option } from "commander";
//#region src/cli/worker-cli.ts
const WORKER_START_MESSAGE_TYPE = "openclaw-worker-start-v1";
function isWorkerStartMessage(value) {
	return typeof value === "object" && value !== null && !Array.isArray(value) && Object.keys(value).length === 1 && value.type === WORKER_START_MESSAGE_TYPE;
}
function createWorkerIpcLifetime() {
	if (!process.connected || !process.channel || typeof process.send !== "function") throw new Error("internal worker IPC mode requires a connected Node IPC channel");
	const abortController = new AbortController();
	let disposed = false;
	let started = false;
	let settled = false;
	let resolveStarted;
	let rejectStarted;
	const startedPromise = new Promise((resolve, reject) => {
		resolveStarted = resolve;
		rejectStarted = reject;
	});
	const rejectOrAbort = (error) => {
		if (!settled) {
			settled = true;
			rejectStarted(error);
			return;
		}
		abortController.abort(error);
	};
	const onMessage = (message) => {
		if (disposed) return;
		if (!isWorkerStartMessage(message) || settled) {
			rejectOrAbort(/* @__PURE__ */ new Error("invalid internal worker IPC start message"));
			return;
		}
		started = true;
		settled = true;
		resolveStarted(true);
	};
	const onDisconnect = () => {
		if (disposed) return;
		if (!settled) {
			settled = true;
			resolveStarted(false);
			return;
		}
		if (started) abortController.abort(/* @__PURE__ */ new Error("worker supervisor lifetime ended"));
	};
	process.on("message", onMessage);
	process.once("disconnect", onDisconnect);
	return {
		started: startedPromise,
		signal: abortController.signal,
		reportConnectionFailure: (cause) => {
			if (disposed || !process.connected || typeof process.send !== "function") return;
			const message = {
				type: NODE_WORKER_CONNECTION_FAILURE_MESSAGE_TYPE,
				cause: cause ?? null
			};
			try {
				process.send(message, () => {});
			} catch {}
		},
		terminateOwnedTree: () => {
			signalProcessTree(process.pid, "SIGKILL", { detached: process.platform !== "win32" });
		},
		dispose: () => {
			if (disposed) return;
			disposed = true;
			process.off("message", onMessage);
			process.off("disconnect", onDisconnect);
			if (process.connected) try {
				process.disconnect?.();
			} catch (error) {
				if (error.code !== "ERR_IPC_DISCONNECTED") throw error;
			}
		}
	};
}
/** Register the restricted cloud worker runtime entry point. */
function registerWorkerCli(program) {
	program.command("worker").description("Run the restricted cloud worker runtime").addOption(new Option("--internal-worker-ipc").hideHelp()).action(async (options) => {
		const { runWorkerCommand } = await import("./worker-command.runtime.js");
		await runWorkerCommand({
			input: process.stdin,
			...options.internalWorkerIpc ? { lifetime: createWorkerIpcLifetime() } : {},
			output: process.stdout
		});
	});
}
//#endregion
export { registerWorkerCli };
