import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { a as addTimerTimeoutGraceMs, p as clampPositiveTimerTimeoutMs, w as parseStrictPositiveInteger, x as parseStrictFiniteNumber } from "./number-coercion-CLj0HTDM.js";
import { r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
import { r as defaultRuntime } from "./runtime-LRpY2Icg.js";
import { r as theme } from "./theme-vjDs9tao.js";
import { n as callGatewayFromCli } from "./gateway-rpc-DJvB3IVo.js";
import { f as isGatewayClientRequestError } from "./call-BFtOrd_w.js";
import { n as resolveNodeFromNodeList } from "./node-resolve-Cxs-SER3.js";
import "./error-runtime-CmA1H4Zg.js";
import "./number-runtime-Cy4drVnh.js";
import "./string-coerce-runtime-C8jKEm3h.js";
import "./runtime-D4qrS2PM.js";
import "./gateway-runtime-BOxS77yr.js";
import { n as runCommandWithRuntime } from "./cli-utils-DKdcuZ9M.js";
import "./cli-runtime-BSWt0Rlh.js";
import { randomUUID } from "node:crypto";
//#region extensions/canvas/src/cli.ts
/**
* Canvas node CLI command registration and runtime dependency wiring.
*/
const DEFAULT_CANVAS_NODE_INVOKE_TIMEOUT_MS = 3e4;
const CANVAS_NODE_INVOKE_TRANSPORT_GRACE_MS = 1e4;
function parseTimeoutMs(raw) {
	if (raw === void 0 || raw === null) return;
	const parsed = parseStrictPositiveInteger(raw);
	if (parsed === void 0) throw new Error("--invoke-timeout must be a positive integer.");
	return parsed;
}
function parseCanvasFiniteNumberOption(raw, flag) {
	if (!raw) return;
	const parsed = parseStrictFiniteNumber(raw);
	if (parsed === void 0) throw new Error(`${flag} must be a number.`);
	return parsed;
}
function parseNodeCandidates(raw) {
	const payload = raw && typeof raw === "object" ? raw : {};
	return (Array.isArray(payload.nodes) ? payload.nodes : Array.isArray(payload.paired) ? payload.paired : []).map((entry) => {
		if (!entry || typeof entry !== "object") return null;
		const node = entry;
		if (typeof node.nodeId !== "string") return null;
		const candidate = { nodeId: node.nodeId };
		if (typeof node.displayName === "string") candidate.displayName = node.displayName;
		if (typeof node.remoteIp === "string") candidate.remoteIp = node.remoteIp;
		if (typeof node.connected === "boolean") candidate.connected = node.connected;
		if (typeof node.clientId === "string") candidate.clientId = node.clientId;
		return candidate;
	}).filter((entry) => entry !== null);
}
function unauthorizedHintForMessage(message) {
	const haystack = normalizeLowercaseStringOrEmpty(message);
	if (haystack.includes("unauthorizedclient") || haystack.includes("bridge client is not authorized") || haystack.includes("unsigned bridge clients are not allowed")) return [
		"peekaboo bridge rejected the client.",
		"sign the peekaboo CLI (TeamID Y5PE65HELJ) or launch the host with",
		"PEEKABOO_ALLOW_UNSIGNED_SOCKET_CLIENTS=1 for local dev."
	].join(" ");
	return null;
}
/** Creates the default Canvas CLI dependency bundle backed by the OpenClaw gateway CLI. */
function createDefaultCanvasCliDependencies() {
	const nodesCallOpts = (cmd, defaults) => cmd.option("--url <url>", "Gateway WebSocket URL (defaults to gateway.remote.url when configured)").option("--token <token>", "Gateway token (if required)").option("--timeout <ms>", "Timeout in ms", String(defaults?.timeoutMs ?? 1e4)).option("--json", "Output JSON", false);
	const callGatewayCli = async (method, opts, params, callOpts) => {
		const timeout = String(callOpts?.transportTimeoutMs ?? opts.timeout ?? 1e4);
		return await callGatewayFromCli(method, {
			...opts,
			timeout
		}, params, { progress: opts.json !== true });
	};
	return {
		defaultRuntime,
		nodesCallOpts,
		runNodesCommand: (label, action) => runCommandWithRuntime(defaultRuntime, action, (err) => {
			const message = formatErrorMessage(err);
			defaultRuntime.error(theme.error(`nodes ${label} failed: ${message}`));
			const hint = unauthorizedHintForMessage(message);
			if (hint) defaultRuntime.error(theme.warn(hint));
			defaultRuntime.exit(1);
		}),
		getNodesTheme: () => ({ ok: theme.success }),
		parseTimeoutMs,
		resolveNodeId: async (opts, query) => {
			let raw;
			try {
				raw = await callGatewayCli("node.list", opts, {});
			} catch (error) {
				if (!isGatewayClientRequestError(error) || error.gatewayCode !== "INVALID_REQUEST" || error.retryable || error.message !== "unknown method: node.list") throw error;
				raw = await callGatewayCli("node.pair.list", opts, {});
			}
			return resolveNodeFromNodeList(parseNodeCandidates(raw), query).nodeId;
		},
		buildNodeInvokeParams: ({ nodeId, command, params, timeoutMs }) => ({
			nodeId,
			command,
			params,
			idempotencyKey: randomUUID(),
			...typeof timeoutMs === "number" && Number.isFinite(timeoutMs) ? { timeoutMs } : {}
		}),
		callGatewayCli
	};
}
async function invokeCanvas(deps, opts, command, params) {
	const timeoutMs = clampPositiveTimerTimeoutMs(deps.parseTimeoutMs(opts.invokeTimeout) ?? DEFAULT_CANVAS_NODE_INVOKE_TIMEOUT_MS) ?? DEFAULT_CANVAS_NODE_INVOKE_TIMEOUT_MS;
	const nodeId = await deps.resolveNodeId(opts, normalizeOptionalString(opts.node) ?? "");
	const invokeParams = deps.buildNodeInvokeParams({
		nodeId,
		command,
		params,
		timeoutMs
	});
	const configuredGatewayTimeoutMs = parseStrictPositiveInteger(opts.timeout ?? 1e4);
	if (configuredGatewayTimeoutMs === void 0) return await deps.callGatewayCli("node.invoke", opts, invokeParams);
	const transportTimeoutMs = Math.max(clampPositiveTimerTimeoutMs(configuredGatewayTimeoutMs) ?? DEFAULT_CANVAS_NODE_INVOKE_TIMEOUT_MS, addTimerTimeoutGraceMs(timeoutMs, CANVAS_NODE_INVOKE_TRANSPORT_GRACE_MS) ?? timeoutMs);
	return await deps.callGatewayCli("node.invoke", opts, invokeParams, { transportTimeoutMs });
}
/** Prints the complete invocation response for machines or the existing human acknowledgement. */
function writeCanvasInvokeResult(deps, opts, result, message) {
	if (opts.json) {
		deps.defaultRuntime.writeJson(result);
		return;
	}
	const { ok } = deps.getNodesTheme();
	deps.defaultRuntime.log(ok(message));
}
/** Registers Canvas subcommands under the nodes CLI command group. */
function registerNodesCanvasCommands(nodes, deps) {
	const canvas = nodes.command("canvas").description("Present widget documents on a paired macOS panel");
	deps.nodesCallOpts(canvas.command("present").description("Show the canvas (optionally with a target URL/path)").requiredOption("--node <idOrNameOrIp>", "Node id, name, or IP").option("--target <urlOrPath>", "Target URL/path (optional)").option("--x <px>", "Placement x coordinate").option("--y <px>", "Placement y coordinate").option("--width <px>", "Placement width").option("--height <px>", "Placement height").option("--invoke-timeout <ms>", "Node invoke timeout in ms").action(async (opts) => {
		await deps.runNodesCommand("canvas present", async () => {
			const placement = {
				x: parseCanvasFiniteNumberOption(opts.x, "--x"),
				y: parseCanvasFiniteNumberOption(opts.y, "--y"),
				width: parseCanvasFiniteNumberOption(opts.width, "--width"),
				height: parseCanvasFiniteNumberOption(opts.height, "--height")
			};
			const params = {};
			if (opts.target) params.url = opts.target;
			if (Number.isFinite(placement.x) || Number.isFinite(placement.y) || Number.isFinite(placement.width) || Number.isFinite(placement.height)) params.placement = placement;
			writeCanvasInvokeResult(deps, opts, await invokeCanvas(deps, opts, "canvas.present", params), "canvas present ok");
		});
	}));
	deps.nodesCallOpts(canvas.command("hide").description("Hide the canvas").requiredOption("--node <idOrNameOrIp>", "Node id, name, or IP").option("--invoke-timeout <ms>", "Node invoke timeout in ms").action(async (opts) => {
		await deps.runNodesCommand("canvas hide", async () => {
			writeCanvasInvokeResult(deps, opts, await invokeCanvas(deps, opts, "canvas.hide", void 0), "canvas hide ok");
		});
	}));
	deps.nodesCallOpts(canvas.command("navigate").description("Navigate the canvas to a URL").argument("<url>", "Target URL/path").requiredOption("--node <idOrNameOrIp>", "Node id, name, or IP").option("--invoke-timeout <ms>", "Node invoke timeout in ms").action(async (url, opts) => {
		await deps.runNodesCommand("canvas navigate", async () => {
			writeCanvasInvokeResult(deps, opts, await invokeCanvas(deps, opts, "canvas.navigate", { url }), "canvas navigate ok");
		});
	}));
}
//#endregion
export { registerNodesCanvasCommands as n, createDefaultCanvasCliDependencies as t };
