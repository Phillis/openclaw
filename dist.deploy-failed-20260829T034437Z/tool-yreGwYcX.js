import { a as addTimerTimeoutGraceMs, p as clampPositiveTimerTimeoutMs } from "./number-coercion-CLj0HTDM.js";
import { _ as readToolStringParam, p as readPositiveIntegerParam, u as readFiniteNumberParam } from "./common-CI1GnPjt.js";
import { t as jsonResult } from "./tool-results-BCM3fdVS.js";
import { t as callGatewayTool } from "./gateway-aj3xYAQy.js";
import { t as listNodes } from "./nodes-utils-Cjfuq3J0.js";
import "./number-runtime-Cy4drVnh.js";
import "./agent-harness-runtime-Ckrwmynj.js";
import "./channel-actions-AIJ6nLei.js";
import "./param-readers-D1z2ybhD.js";
import { i as CanvasToolSchema, r as resolveCanvasNodeFromList, t as CANVAS_PRESENT_COMMAND } from "./node-eligibility-D_OlD7mW.js";
import { randomUUID } from "node:crypto";
//#region extensions/canvas/src/tool.ts
/** Agent-facing Canvas tool implementation for the macOS widget panel. */
const DEFAULT_CANVAS_NODE_INVOKE_TIMEOUT_MS = 3e4;
const CANVAS_NODE_INVOKE_TRANSPORT_GRACE_MS = 1e4;
function readGatewayCallOptions(params) {
	return {
		gatewayUrl: readToolStringParam(params, "gatewayUrl", { trim: false }),
		gatewayToken: readToolStringParam(params, "gatewayToken", { trim: false }),
		timeoutMs: readPositiveIntegerParam(params, "timeoutMs")
	};
}
async function resolveCanvasNode(opts, query) {
	return resolveCanvasNodeFromList(await listNodes(opts), query);
}
/** Creates the model-facing Canvas tool used to invoke paired node canvas commands. */
function createCanvasTool(options) {
	return {
		label: "Canvas",
		name: "canvas",
		resultContentSource: "network",
		description: "Present, hide, or navigate the widget panel on a paired macOS node.",
		parameters: CanvasToolSchema,
		execute: async (_toolCallId, args) => {
			const params = args;
			const action = readToolStringParam(params, "action", { required: true });
			const gatewayOpts = readGatewayCallOptions(params);
			const nodeQuery = readToolStringParam(params, "node", { trim: true });
			const invoke = async (command, invokeParams) => {
				const nodeId = (await resolveCanvasNode(gatewayOpts, nodeQuery)).nodeId;
				const timeoutMs = clampPositiveTimerTimeoutMs(gatewayOpts.timeoutMs ?? DEFAULT_CANVAS_NODE_INVOKE_TIMEOUT_MS) ?? DEFAULT_CANVAS_NODE_INVOKE_TIMEOUT_MS;
				const transportTimeoutMs = addTimerTimeoutGraceMs(timeoutMs, CANVAS_NODE_INVOKE_TRANSPORT_GRACE_MS) ?? timeoutMs;
				return {
					node: nodeId,
					result: await callGatewayTool("node.invoke", {
						...gatewayOpts,
						timeoutMs: transportTimeoutMs
					}, {
						nodeId,
						command,
						params: invokeParams,
						timeoutMs,
						idempotencyKey: randomUUID(),
						...options?.agentSessionKey ? { sessionKey: options.agentSessionKey } : {}
					})
				};
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
					const { node } = await invoke(CANVAS_PRESENT_COMMAND, invokeParams);
					return jsonResult({
						ok: true,
						node,
						...presentTarget ? { url: presentTarget } : {}
					});
				}
				case "hide": {
					const { node } = await invoke("canvas.hide", void 0);
					return jsonResult({
						ok: true,
						node
					});
				}
				case "navigate": {
					const url = readToolStringParam(params, "url", { trim: true }) ?? readToolStringParam(params, "target", {
						required: true,
						trim: true,
						label: "url"
					});
					const { node } = await invoke("canvas.navigate", { url });
					return jsonResult({
						ok: true,
						node,
						url
					});
				}
				default: throw new Error(`Unknown action: ${action}`);
			}
		}
	};
}
//#endregion
export { createCanvasTool };
