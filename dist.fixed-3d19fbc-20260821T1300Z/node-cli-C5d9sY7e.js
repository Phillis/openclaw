import { F as resolveTimerTimeoutMs } from "./number-coercion-oCkfUEEq.js";
import { r as asNullableRecord } from "./record-coerce-DItp3I4t.js";
import { a as writeRuntimeJson, r as defaultRuntime } from "./runtime-DtFIMC-W.js";
import { n as VERSION } from "./version-o4XN9fka.js";
import { r as theme } from "./theme-vjDs9tao.js";
import { t as formatDocsLink } from "./links-ClIwBcy4.js";
import { r as formatInvalidPortOption } from "./error-format-BAHQH0iA.js";
import { n as loadDeviceIdentityIfPresent, o as publicKeyRawBase64UrlFromPem } from "./device-identity-C2_6nSqN.js";
import { t as createPendingRequestRegistry } from "./pending-request-registry-B-sdjY_C.js";
import { t as formatHelpExamples } from "./help-format-CAcwboTs.js";
import { a as loadNodeHostConfig } from "./config-DCSrH58d.js";
import { a as runNodeDaemonStop, c as resolveNodePairGatewayOptions, d as runStartupMigrations, f as prepareNodeHostRuntime, i as runNodeDaemonStatus, n as runNodeDaemonRestart, o as runNodeDaemonUninstall, r as runNodeDaemonStart, s as resolveNodeGatewayOptions, t as runNodeDaemonInstall, u as runNodeHost } from "./daemon-DKkNYDH2.js";
import { createInterface } from "node:readline";
//#region src/node-host/worker-support.ts
function parseNodeHostWorkerInput(line) {
	try {
		const parsed = asNullableRecord(JSON.parse(line));
		const type = typeof parsed?.type === "string" ? parsed.type : "";
		if (type === "invoke") {
			const request = asNullableRecord(parsed?.request);
			if (request && typeof request.id === "string" && typeof request.nodeId === "string" && typeof request.command === "string") return {
				type,
				request
			};
			return null;
		}
		if (type === "gateway-response") {
			const id = typeof parsed?.id === "string" ? parsed.id : "";
			if (!id) return null;
			return parsed?.ok === true ? {
				type,
				id,
				ok: true,
				result: parsed.result
			} : {
				type,
				id,
				ok: false,
				error: typeof parsed?.error === "string" ? parsed.error : "Gateway request failed"
			};
		}
		if (type === "invoke-input") {
			const invokeId = typeof parsed?.invokeId === "string" ? parsed.invokeId : "";
			const seq = typeof parsed?.seq === "number" ? parsed.seq : -1;
			const payloadJSON = typeof parsed?.payloadJSON === "string" ? parsed.payloadJSON : null;
			return invokeId && Number.isInteger(seq) && seq >= 0 && payloadJSON !== null ? {
				type,
				invokeId,
				seq,
				payloadJSON
			} : null;
		}
		if (type === "invoke-cancel") {
			const invokeId = typeof parsed?.invokeId === "string" ? parsed.invokeId : "";
			return invokeId ? {
				type,
				invokeId
			} : null;
		}
		return type === "stop" ? { type } : null;
	} catch {
		return null;
	}
}
var NodeHostWorkerBridgeClient = class {
	constructor(writeMessage) {
		this.writeMessage = writeMessage;
		this.nextRequestId = 1;
		this.pending = createPendingRequestRegistry();
	}
	async request(method, params, opts) {
		if (method === "node.invoke.result") {
			this.writeMessage({
				type: "invoke-result",
				result: params ?? {}
			});
			return {};
		}
		if (method === "node.event") {
			this.writeMessage({
				type: "node-event",
				event: params ?? {}
			});
			return {};
		}
		const id = `gateway-${this.nextRequestId++}`;
		const timeoutMs = resolveTimerTimeoutMs(opts?.timeoutMs, 15e3);
		const pending = this.pending.add(id, {
			value: void 0,
			timeoutMs,
			timeoutError: () => /* @__PURE__ */ new Error(`Gateway request timed out: ${method}`)
		});
		if (!pending) throw new Error(`Gateway request id collision: ${id}`);
		this.writeMessage({
			type: "gateway-request",
			id,
			method,
			params: params ?? {},
			timeoutMs
		});
		return await pending.promise;
	}
	handleResponse(message) {
		const pending = this.pending.take(message.id);
		if (!pending) return false;
		if (message.ok) pending.resolve(message.result);
		else pending.reject(new Error(message.error));
		return true;
	}
	close() {
		this.pending.rejectAll(/* @__PURE__ */ new Error("node-host worker stopped"));
	}
};
async function stopNodeHostWorkerFromSignal(input, stop, exitCode) {
	const stopped = stop(exitCode);
	input.close();
	await stopped;
}
//#endregion
//#region src/node-host/worker.ts
/** Private JSONL worker exposing the CLI node-host runtime to the macOS app. */
function writeMessage(message) {
	process.stdout.write(`${JSON.stringify(message)}\n`);
}
function writeStderrLine(message) {
	process.stderr.write(`${message}\n`);
}
function emitInventory(inventory) {
	writeMessage({
		type: "inventory",
		inventory
	});
}
async function runNodeHostWorker() {
	await runStartupMigrations({ log: {
		info: writeStderrLine,
		warn: writeStderrLine
	} });
	const prepared = await prepareNodeHostRuntime({
		enableDuplexPluginCommands: true,
		installedAppsSharingEnabled: (await loadNodeHostConfig())?.installedAppsSharing === true
	});
	const client = new NodeHostWorkerBridgeClient(writeMessage);
	let stopping = false;
	let resolveStopped;
	const stopped = new Promise((resolve) => {
		resolveStopped = resolve;
	});
	const stop = async (exitCode) => {
		if (stopping) return;
		stopping = true;
		try {
			client.close();
			await runtime.close();
			process.exitCode = exitCode;
		} finally {
			resolveStopped?.();
		}
	};
	const runtime = prepared.start({
		client,
		onInventoryChanged: emitInventory
	});
	writeMessage({
		type: "ready",
		version: VERSION,
		manifest: prepared.manifest,
		inventory: prepared.initialInventory
	});
	const input = createInterface({
		input: process.stdin,
		crlfDelay: Infinity
	});
	input.on("line", (line) => {
		const message = parseNodeHostWorkerInput(line);
		if (!message) {
			writeMessage({
				type: "protocol-error",
				error: "invalid worker request"
			});
			return;
		}
		if (message.type === "gateway-response") {
			client.handleResponse(message);
			return;
		}
		if (message.type === "stop") {
			input.close();
			stop(0);
			return;
		}
		if (message.type === "invoke-input") {
			runtime.handleInput(message.invokeId, message.seq, message.payloadJSON);
			return;
		}
		if (message.type === "invoke-cancel") {
			runtime.cancel(message.invokeId);
			return;
		}
		runtime.invoke(message.request);
	});
	input.on("close", () => void stop(0));
	process.once("SIGINT", () => void stopNodeHostWorkerFromSignal(input, stop, 130));
	process.once("SIGTERM", () => void stopNodeHostWorkerFromSignal(input, stop, 143));
	await stopped;
}
//#endregion
//#region src/cli/node-cli/identity.ts
/**
* Read-only by design: the SSH-verified pairing probe calls this remotely and
* must never mint a fresh identity on a host that has not run the node host.
*/
function runNodeIdentityShow(opts) {
	const identity = loadDeviceIdentityIfPresent();
	if (!identity) {
		defaultRuntime.error("no node device identity found (start the node host once with `openclaw node run` or `openclaw node install`)");
		defaultRuntime.exit(1);
		return;
	}
	const payload = {
		deviceId: identity.deviceId,
		publicKey: publicKeyRawBase64UrlFromPem(identity.publicKeyPem)
	};
	if (opts.json) {
		writeRuntimeJson(defaultRuntime, payload, 0);
		return;
	}
	defaultRuntime.log(`deviceId:  ${payload.deviceId}`);
	defaultRuntime.log(`publicKey: ${payload.publicKey}`);
}
//#endregion
//#region src/cli/node-cli/register.ts
function registerNodeCli(program) {
	const node = program.command("node").description("Run and manage the headless node host service").addHelpText("after", () => `\n${theme.heading("Examples:")}\n${formatHelpExamples([
		["openclaw node run --host 127.0.0.1 --port 18789", "Run the node host in the foreground."],
		["openclaw node status", "Check node host service status."],
		["openclaw node install", "Install the node host service."],
		["openclaw node start", "Start the installed node host service."],
		["openclaw node restart", "Restart the installed node host service."]
	])}\n\n${theme.muted("Docs:")} ${formatDocsLink("/cli/node", "docs.openclaw.ai/cli/node")}\n`);
	node.command("worker", { hidden: true }).description("Run the private macOS app node-host worker").action(async () => {
		await runNodeHostWorker();
	});
	node.command("run").description("Run the headless node host (foreground)").option("--pair <code-or-url>", "Pair with a setup code or oc-pair URL; explicit gateway flags take precedence").option("--host <host>", "Gateway host").option("--port <port>", "Gateway port").option("--context-path <path>", "Gateway WebSocket context path (e.g. /openclaw-gw)").option("--tls", "Use TLS for the gateway connection").option("--no-tls", "Disable TLS for the gateway connection").option("--tls-fingerprint <sha256>", "Expected TLS certificate fingerprint (sha256)").option("--node-id <id>", "Override the generated node instance id").option("--display-name <name>", "Override node display name").option("--share-installed-apps", "Share installed macOS applications with the Gateway").option("--no-share-installed-apps", "Disable installed application sharing").action(async (opts) => {
		let pair;
		try {
			pair = opts.pair ? resolveNodePairGatewayOptions(opts.pair) : void 0;
		} catch (error) {
			defaultRuntime.error(error instanceof Error ? error.message : String(error));
			defaultRuntime.exit(1);
			return;
		}
		const { host, port, contextPath, tls, tlsFingerprint, gatewayCandidates } = resolveNodeGatewayOptions(opts, await loadNodeHostConfig(), pair);
		if (port === null) {
			defaultRuntime.error(formatInvalidPortOption("--port"));
			defaultRuntime.exit(1);
			return;
		}
		if (opts.tls === false && opts.tlsFingerprint !== void 0) {
			defaultRuntime.error("--no-tls cannot be combined with --tls-fingerprint");
			defaultRuntime.exit(1);
			return;
		}
		await runNodeHost({
			gatewayHost: host,
			gatewayPort: port,
			gatewayTls: tls,
			gatewayTlsFingerprint: tlsFingerprint,
			gatewayContextPath: contextPath,
			gatewayCandidates,
			gatewayBootstrapToken: pair?.bootstrapToken,
			preferGatewayBootstrapToken: pair !== void 0,
			nodeId: opts.nodeId,
			displayName: opts.displayName,
			installedAppsSharing: opts.shareInstalledApps
		});
	});
	node.command("status").description("Show node host status").option("--json", "Output JSON", false).action(async (opts) => {
		await runNodeDaemonStatus(opts);
	});
	node.command("identity").description("Print the node host device identity (device id + public key)").option("--json", "Output JSON", false).action((opts) => {
		runNodeIdentityShow(opts);
	});
	node.command("install").description("Install the node host service (launchd/systemd/schtasks)").option("--host <host>", "Gateway host").option("--port <port>", "Gateway port").option("--context-path <path>", "Gateway WebSocket context path (e.g. /openclaw-gw)").option("--tls", "Use TLS for the gateway connection").option("--no-tls", "Disable TLS for the gateway connection").option("--tls-fingerprint <sha256>", "Expected TLS certificate fingerprint (sha256)").option("--node-id <id>", "Override the generated node instance id").option("--display-name <name>", "Override node display name").option("--share-installed-apps", "Share installed macOS applications with the Gateway").option("--no-share-installed-apps", "Disable installed application sharing").option("--runtime <runtime>", "Service runtime (node). Default: node").option("--force", "Reinstall/overwrite if already installed", false).option("--json", "Output JSON", false).action(async (opts) => {
		await runNodeDaemonInstall(opts);
	});
	for (const [name, action] of [
		["uninstall", runNodeDaemonUninstall],
		["stop", runNodeDaemonStop],
		["start", runNodeDaemonStart],
		["restart", runNodeDaemonRestart]
	]) node.command(name).description(`${name.charAt(0).toUpperCase()}${name.slice(1)} the node host service (launchd/systemd/schtasks)`).option("--json", "Output JSON", false).action(async (opts) => {
		await action(opts);
	});
}
//#endregion
export { registerNodeCli };
