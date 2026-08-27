import { n as resolveRuntimeWorkerUrl, t as resolveRuntimeWorkerArgv } from "../../runtime-worker-url-DTpp6ccf.js";
import { spawn } from "node:child_process";
//#region src/process/supervisor/service-child-relay.ts
function reserveIpcFd(stdio) {
	let fd = 3;
	while (stdio[fd] !== void 0 && stdio[fd] !== "ignore") fd += 1;
	while (stdio.length <= fd) stdio.push("ignore");
	stdio[fd] = "ipc";
}
function runServiceChildRelay() {
	let generation;
	let anchor;
	let parentLost = false;
	const report = (message) => {
		if (!process.connected) return;
		try {
			process.send?.(message);
		} catch {}
	};
	const notifyParentLoss = () => {
		if (parentLost) return;
		parentLost = true;
		if (anchor?.connected) anchor.send({
			type: "parent-loss",
			generation
		});
	};
	process.once("disconnect", notifyParentLoss);
	process.once("SIGTERM", notifyParentLoss);
	process.once("SIGINT", notifyParentLoss);
	process.once("message", (raw) => {
		const start = raw;
		if (!start || start.type !== "start" || !start.generation) {
			process.exitCode = 1;
			return;
		}
		generation = start.generation;
		if (start.controlFd === void 0) {
			report({
				type: "relay-error",
				generation,
				error: "service child control fd is missing"
			});
			process.exitCode = 1;
			return;
		}
		const anchorUrl = resolveRuntimeWorkerUrl({
			currentModuleUrl: import.meta.url,
			sourceWorkerName: "service-child-group-anchor",
			distWorkerPath: "process/supervisor/service-child-group-anchor.js"
		});
		const stdio = [
			"inherit",
			"inherit",
			"inherit"
		];
		while (stdio.length <= start.controlFd) stdio.push("ignore");
		stdio[start.controlFd] = start.controlFd;
		if (start.secretFd !== void 0) {
			while (stdio.length <= start.secretFd) stdio.push("ignore");
			stdio[start.secretFd] = start.secretFd;
		}
		reserveIpcFd(stdio);
		try {
			anchor = spawn(process.execPath, resolveRuntimeWorkerArgv(anchorUrl), {
				stdio,
				detached: true,
				windowsHide: true,
				env: process.env
			});
		} catch (error) {
			report({
				type: "relay-error",
				generation,
				error: error instanceof Error ? error.message : String(error)
			});
			process.exitCode = 1;
			return;
		}
		if (!anchor.connected) {
			report({
				type: "relay-error",
				generation,
				error: "anchor lifecycle IPC was not created"
			});
			anchor.kill("SIGKILL");
			process.exitCode = 1;
			return;
		}
		process.stdout.destroy();
		process.stderr.destroy();
		anchor.once("spawn", () => {
			anchor?.send(start);
			if (parentLost) anchor?.send({
				type: "parent-loss",
				generation
			});
		});
		anchor.once("error", (error) => {
			report({
				type: "relay-error",
				generation,
				error: error.message
			});
		});
		anchor.once("exit", (code, signal) => {
			report({
				type: "anchor-exit",
				generation,
				code,
				signal
			});
			process.exit(code === 0 || signal === "SIGKILL" ? 0 : 1);
		});
	});
}
runServiceChildRelay();
//#endregion
export { runServiceChildRelay };
