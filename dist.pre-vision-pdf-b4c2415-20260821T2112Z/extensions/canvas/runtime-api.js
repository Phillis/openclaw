import { t as resolveHostedPluginSurfaceUrl } from "../../hosted-plugin-surface-url-D1_hpwo8.js";
import "../../gateway-runtime-Vk_KkezP.js";
import { c as isCanvasPluginEnabled, l as parseCanvasPluginConfig, n as CANVAS_HOST_PATH, o as canvasConfigSchema, r as CANVAS_WS_PATH, s as isCanvasHostEnabled, t as A2UI_PATH, u as resolveCanvasHostConfig } from "../../a2ui-shared-NG90QUpc.js";
import { n as handleA2uiHttpRequest, t as createCanvasHostHandler } from "../../server-CtjbSP__.js";
import { r as parseCanvasSnapshotPayload, t as canvasSnapshotTempPath } from "../../cli-helpers-CSkbUR0_.js";
import { n as registerNodesCanvasCommands } from "../../cli-CCU1F-66.js";
//#region extensions/canvas/src/host-url.ts
/**
* Canvas hosted-surface URL resolver.
*/
/** Resolves the externally visible Canvas host URL for a gateway/plugin surface. */
function resolveCanvasHostUrl(params) {
	return resolveHostedPluginSurfaceUrl({
		...params,
		port: params.canvasPort
	});
}
//#endregion
export { A2UI_PATH, CANVAS_HOST_PATH, CANVAS_WS_PATH, canvasConfigSchema, canvasSnapshotTempPath, createCanvasHostHandler, handleA2uiHttpRequest, isCanvasHostEnabled, isCanvasPluginEnabled, parseCanvasPluginConfig, parseCanvasSnapshotPayload, registerNodesCanvasCommands, resolveCanvasHostConfig, resolveCanvasHostUrl };
