import { t as createDeferredCore } from "../../deferred-D0La5CRk.js";
import { n as encodeServiceChildMessage, t as GRACEFUL_CANCEL_TIMEOUT_MS } from "../../cancellation-policy-BlW8itUn.js";
import { spawn } from "node:child_process";
import { Socket } from "node:net";
import { pipeline } from "node:stream";
//#region src/process/supervisor/service-child-group-anchor.ts
const LINEAGE_EXIT_OBSERVATION_MS = 100;
function commandStdio(start) {
	const stdio = [
		start.stdinMode === "inherit" ? "inherit" : "pipe",
		"pipe",
		"pipe"
	];
	if (start.secretFd !== void 0) {
		while (stdio.length <= start.secretFd) stdio.push("ignore");
		stdio[start.secretFd] = start.secretFd;
	}
	let lineageFd = 3;
	while (stdio[lineageFd] !== void 0 && stdio[lineageFd] !== "ignore") lineageFd += 1;
	while (stdio.length <= lineageFd) stdio.push("ignore");
	stdio[lineageFd] = "pipe";
	return {
		stdio,
		lineageFd
	};
}
function delay(ms) {
	return new Promise((resolve) => {
		setTimeout(resolve, ms).unref?.();
	});
}
function runServiceChildGroupAnchor() {
	let start;
	let state = "starting";
	let sequence = 0;
	let lastHostSequence = 0;
	let command;
	let control;
	let rootSettlementStarted = false;
	let rootResultDelivery;
	let rootExit;
	let stdoutDrained = false;
	let stderrDrained = false;
	let lineageClosed = false;
	let forceCleanup = false;
	const forceCleanupRequested = createDeferredCore();
	const lineageDone = createDeferredCore();
	const rootExited = createDeferredCore();
	const rootSettledDone = createDeferredCore();
	const startupErrorAcknowledged = createDeferredCore();
	const send = async (message) => {
		if (!start || !control || control.destroyed) return;
		sequence += 1;
		await new Promise((resolve) => {
			const framed = {
				...message,
				generation: start.generation,
				sequence
			};
			control.write(encodeServiceChildMessage(framed), () => resolve());
		});
	};
	const closeAuthority = async (reason, hardKill) => {
		if (!start || state === "closed") return;
		state = "closed";
		await send({
			type: "closing",
			reason
		});
		if (hardKill) {
			process.kill(0, "SIGKILL");
			return;
		}
		control?.end(() => process.exit(0));
	};
	const reportStartupFailure = async (error) => {
		await send({
			type: "startup-error",
			error
		});
		await startupErrorAcknowledged.promise;
		await closeAuthority("lineage-lost", false);
	};
	const requestCleanup = async (reason, signal = "SIGTERM") => {
		if (!start || state === "closed") return;
		if (state === "closing") {
			forceCleanup ||= signal === "SIGKILL";
			if (forceCleanup) forceCleanupRequested.resolve();
			return;
		}
		state = "closing";
		forceCleanup = signal === "SIGKILL";
		const termGraceDone = delay(GRACEFUL_CANCEL_TIMEOUT_MS);
		if (!forceCleanup) {
			process.kill(0, "SIGTERM");
			await Promise.race([
				lineageDone.promise,
				termGraceDone,
				forceCleanupRequested.promise
			]);
		}
		if (state !== "closing" || !start) return;
		if (lineageClosed && !rootExit && !forceCleanup) await Promise.race([
			rootExited.promise,
			termGraceDone,
			forceCleanupRequested.promise
		]);
		if (state !== "closing" || !start) return;
		if (lineageClosed && rootExit && !forceCleanup) {
			await Promise.race([
				rootSettledDone.promise,
				termGraceDone,
				forceCleanupRequested.promise
			]);
			if (state !== "closing" || !start) return;
		}
		await closeAuthority(reason, true);
	};
	const onControlMessage = (message) => {
		if (!start || message.generation !== start.generation || message.sequence <= lastHostSequence || state === "closed") return;
		lastHostSequence = message.sequence;
		if (message.type === "startup-error-ack") {
			startupErrorAcknowledged.resolve();
			return;
		}
		requestCleanup("cancel", message.signal);
	};
	const startCommand = async (next) => {
		if (next.controlFd === void 0) {
			process.exitCode = 1;
			return;
		}
		start = next;
		control = new Socket({
			fd: start.controlFd,
			readable: true,
			writable: true
		});
		control.setEncoding("utf8");
		let pending = "";
		control.on("data", (chunk) => {
			pending += chunk;
			for (;;) {
				const newline = pending.indexOf("\n");
				if (newline < 0) break;
				const line = pending.slice(0, newline);
				pending = pending.slice(newline + 1);
				try {
					onControlMessage(JSON.parse(line));
				} catch {
					requestCleanup("parent-lost");
				}
			}
		});
		control.once("close", () => {
			if (state !== "closed") requestCleanup("parent-lost");
		});
		control.once("error", () => {
			if (state !== "closed") requestCleanup("parent-lost");
		});
		const { stdio, lineageFd } = commandStdio(start);
		try {
			command = spawn(start.command, start.args, {
				cwd: start.cwd,
				env: start.env,
				stdio,
				detached: false,
				windowsHide: true
			});
		} catch (error) {
			await reportStartupFailure(error instanceof Error ? error.message : String(error));
			return;
		}
		const lineage = command.stdio[lineageFd];
		if (!lineage) {
			await send({
				type: "startup-error",
				error: "command lineage pipe was not created"
			});
			await requestCleanup("lineage-lost", "SIGKILL");
			return;
		}
		const markLineageClosed = () => {
			if (lineageClosed) return;
			lineageClosed = true;
			lineageDone.resolve();
			if (state === "active") (async () => {
				if (!rootExit) await Promise.race([rootExited.promise, delay(LINEAGE_EXIT_OBSERVATION_MS)]);
				if (state !== "active") return;
				if (rootExit && rootSettlementStarted) await rootSettledDone.promise;
				if (state !== "active") return;
				requestCleanup("lineage-lost");
			})();
		};
		lineage.once("end", markLineageClosed);
		lineage.once("close", markLineageClosed);
		lineage.once("error", markLineageClosed);
		const settleRoot = async () => {
			if (rootSettlementStarted || !rootResultDelivery || !stdoutDrained || !stderrDrained) return;
			rootSettlementStarted = true;
			await rootResultDelivery;
			rootSettledDone.resolve();
			if (lineageClosed && state === "active") await closeAuthority("lineage-closed", false);
		};
		pipeline(command.stdout, process.stdout, () => {
			stdoutDrained = true;
			settleRoot();
		});
		pipeline(command.stderr, process.stderr, () => {
			stderrDrained = true;
			settleRoot();
		});
		if (start.stdinMode !== "inherit" && command.stdin) {
			process.stdin.pipe(command.stdin);
			if (start.stdinMode === "pipe-closed" && process.stdin.readableEnded) command.stdin.end();
		}
		command.once("error", (error) => {
			if (state === "starting") reportStartupFailure(error.message);
		});
		command.once("spawn", () => {
			if (!command?.pid || state !== "starting") return;
			state = "active";
			send({
				type: "ready",
				commandPid: command.pid,
				anchorPid: process.pid
			});
		});
		command.once("exit", (code, signal) => {
			rootExit = {
				code,
				signal
			};
			rootResultDelivery = send({
				type: "root-result",
				code,
				signal
			});
			rootExited.resolve();
			settleRoot();
		});
	};
	process.on("SIGTERM", () => {
		if (state === "active") requestCleanup("parent-lost");
	});
	process.on("SIGINT", () => {
		if (state === "active") requestCleanup("parent-lost");
	});
	process.once("disconnect", () => {
		if (state !== "closed") requestCleanup("parent-lost");
	});
	process.on("message", (raw) => {
		const message = raw;
		if (message.type === "start" && state === "starting") startCommand(message);
		else if (message.type === "parent-loss" && message.generation === start?.generation) requestCleanup("parent-lost");
	});
}
runServiceChildGroupAnchor();
//#endregion
export { runServiceChildGroupAnchor };
