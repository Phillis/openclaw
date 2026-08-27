import { a as addTimerTimeoutGraceMs, p as clampPositiveTimerTimeoutMs } from "./number-coercion-oCkfUEEq.js";
import { r as readRegularFile } from "./regular-file-CXw3t-8J.js";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-BBjU-hqW.js";
import { _ as readToolStringParam, o as imageResultFromFile, p as readPositiveIntegerParam, u as readFiniteNumberParam } from "./common-BGOZLJ2_.js";
import { a as wrapExternalContent } from "./external-content-IQUFD6xt.js";
import { t as jsonResult } from "./tool-results-BCM3fdVS.js";
import { t as callGatewayTool } from "./gateway-O0XoIBU1.js";
import { a as resolveNodeIdFromList, t as listNodes } from "./nodes-utils-DYTIeeDl.js";
import "./temp-path-ChKDkme1.js";
import "./number-runtime-CoAPZzJY.js";
import "./agent-harness-runtime-BKIMCmtd.js";
import "./security-runtime-Bm9RUgAZ.js";
import "./channel-actions-CeWsyukw.js";
import "./param-readers-BF3rNe0k.js";
import { n as validateSupportedA2UIJsonl } from "./a2ui-jsonl-DeIxQ_ge.js";
import { t as CanvasToolSchema } from "./tool-schema-DqB1uxnU.js";
import { n as normalizeCanvasSnapshotFileExtension, r as parseCanvasSnapshotPayload } from "./cli-helpers-DyWLcrfn.js";
import { randomUUID } from "node:crypto";
import path from "node:path";
import fs from "node:fs/promises";
//#region extensions/canvas/src/tool.ts
/**
* Agent-facing Canvas tool implementation for node canvas commands and
* snapshots.
*/
const CANVAS_JSONL_MAX_BYTES = 16 * 1024 * 1024;
const DEFAULT_CANVAS_NODE_INVOKE_TIMEOUT_MS = 3e4;
const CANVAS_NODE_INVOKE_TRANSPORT_GRACE_MS = 1e4;
function readGatewayCallOptions(params) {
	return {
		gatewayUrl: readToolStringParam(params, "gatewayUrl", { trim: false }),
		gatewayToken: readToolStringParam(params, "gatewayToken", { trim: false }),
		timeoutMs: readPositiveIntegerParam(params, "timeoutMs")
	};
}
async function resolveNodeId(opts, query, allowDefault = false) {
	return resolveNodeIdFromList(await listNodes(opts), query, allowDefault);
}
async function writeBase64ToTempFile(params) {
	const dir = resolvePreferredOpenClawTmpDir();
	await fs.mkdir(dir, {
		recursive: true,
		mode: 448
	});
	const ext = `.${normalizeCanvasSnapshotFileExtension(params.ext)}`;
	const filePath = path.join(dir, `openclaw-canvas-snapshot-${randomUUID()}${ext}`);
	await fs.writeFile(filePath, Buffer.from(params.base64, "base64"));
	return filePath;
}
function isPathInsideRoot(root, candidate) {
	const relative = path.relative(root, candidate);
	return relative === "" || relative !== "" && !relative.startsWith("..") && !path.isAbsolute(relative);
}
async function readJsonlFromPath(jsonlPath, workspaceDir) {
	const trimmed = jsonlPath.trim();
	if (!trimmed) return "";
	const workspaceRoot = path.resolve(workspaceDir ?? process.cwd());
	const resolved = path.resolve(workspaceRoot, trimmed);
	const [workspaceReal, resolvedReal] = await Promise.all([fs.realpath(workspaceRoot), fs.realpath(resolved)]);
	if (!isPathInsideRoot(workspaceReal, resolvedReal)) throw new Error("jsonlPath outside workspace");
	return (await readRegularFile({
		filePath: resolvedReal,
		maxBytes: CANVAS_JSONL_MAX_BYTES
	})).buffer.toString("utf8");
}
function resolveCanvasImageSanitizationLimits(config) {
	const configured = config?.agents?.defaults?.imageMaxDimensionPx;
	if (typeof configured !== "number" || !Number.isFinite(configured)) return {};
	return { maxDimensionPx: Math.max(1, Math.floor(configured)) };
}
/** Creates the model-facing Canvas tool used to invoke paired node canvas commands. */
function createCanvasTool(options) {
	const imageSanitization = resolveCanvasImageSanitizationLimits(options?.config);
	return {
		label: "Canvas",
		name: "canvas",
		resultContentSource: "network",
		description: "Control node canvases (present/hide/navigate/eval/snapshot/A2UI). Use snapshot to capture the rendered UI.",
		parameters: CanvasToolSchema,
		execute: async (_toolCallId, args) => {
			const params = args;
			const action = readToolStringParam(params, "action", { required: true });
			const gatewayOpts = readGatewayCallOptions(params);
			const nodeQuery = readToolStringParam(params, "node", { trim: true });
			const invoke = async (command, invokeParams) => {
				const nodeId = await resolveNodeId(gatewayOpts, nodeQuery, true);
				const timeoutMs = clampPositiveTimerTimeoutMs(gatewayOpts.timeoutMs ?? DEFAULT_CANVAS_NODE_INVOKE_TIMEOUT_MS) ?? DEFAULT_CANVAS_NODE_INVOKE_TIMEOUT_MS;
				const transportTimeoutMs = addTimerTimeoutGraceMs(timeoutMs, CANVAS_NODE_INVOKE_TRANSPORT_GRACE_MS) ?? timeoutMs;
				return await callGatewayTool("node.invoke", {
					...gatewayOpts,
					timeoutMs: transportTimeoutMs
				}, {
					nodeId,
					command,
					params: invokeParams,
					timeoutMs,
					idempotencyKey: randomUUID(),
					...options?.agentSessionKey ? { sessionKey: options.agentSessionKey } : {}
				});
			};
			switch (action) {
				case "present": {
					const placement = {
						x: readFiniteNumberParam(params, "x"),
						y: readFiniteNumberParam(params, "y"),
						width: readFiniteNumberParam(params, "width"),
						height: readFiniteNumberParam(params, "height")
					};
					const invokeParams = {};
					const presentTarget = readToolStringParam(params, "target", { trim: true }) ?? readToolStringParam(params, "url", { trim: true });
					if (presentTarget) invokeParams.url = presentTarget;
					if (Number.isFinite(placement.x) || Number.isFinite(placement.y) || Number.isFinite(placement.width) || Number.isFinite(placement.height)) invokeParams.placement = placement;
					await invoke("canvas.present", invokeParams);
					return jsonResult({ ok: true });
				}
				case "hide":
					await invoke("canvas.hide", void 0);
					return jsonResult({ ok: true });
				case "navigate":
					await invoke("canvas.navigate", { url: readToolStringParam(params, "url", { trim: true }) ?? readToolStringParam(params, "target", {
						required: true,
						trim: true,
						label: "url"
					}) });
					return jsonResult({ ok: true });
				case "eval": {
					const result = (await invoke("canvas.eval", { javaScript: readToolStringParam(params, "javaScript", { required: true }) }))?.payload?.result;
					if (typeof result === "string") return {
						content: [{
							type: "text",
							text: result ? wrapExternalContent(result.replace(/^([^\S\n]*)(MEDIA:)/gim, "$1[neutralized] $2"), {
								source: "browser",
								includeWarning: false
							}) : result
						}],
						details: { result }
					};
					return jsonResult({ ok: true });
				}
				case "snapshot": {
					const formatRaw = typeof params.outputFormat === "string" && params.outputFormat.trim() ? params.outputFormat.trim().toLowerCase() : "png";
					const payload = parseCanvasSnapshotPayload((await invoke("canvas.snapshot", {
						format: formatRaw === "jpg" || formatRaw === "jpeg" ? "jpeg" : "png",
						maxWidth: readPositiveIntegerParam(params, "maxWidth"),
						quality: readFiniteNumberParam(params, "quality", {
							min: 0,
							max: 1
						})
					}))?.payload);
					return await imageResultFromFile({
						label: "canvas:snapshot",
						path: await writeBase64ToTempFile({
							base64: payload.base64,
							ext: payload.format === "jpeg" ? "jpg" : payload.format
						}),
						details: {
							format: payload.format,
							media: { outbound: false }
						},
						imageSanitization
					});
				}
				case "a2ui_push": {
					const jsonl = typeof params.jsonl === "string" && params.jsonl.trim() ? params.jsonl : typeof params.jsonlPath === "string" && params.jsonlPath.trim() ? await readJsonlFromPath(params.jsonlPath, options?.workspaceDir) : "";
					if (!jsonl.trim()) throw new Error("jsonl or jsonlPath required");
					validateSupportedA2UIJsonl(jsonl);
					await invoke("canvas.a2ui.pushJSONL", { jsonl });
					return jsonResult({ ok: true });
				}
				case "a2ui_reset":
					await invoke("canvas.a2ui.reset", void 0);
					return jsonResult({ ok: true });
				default: throw new Error(`Unknown action: ${action}`);
			}
		}
	};
}
//#endregion
export { createCanvasTool };
