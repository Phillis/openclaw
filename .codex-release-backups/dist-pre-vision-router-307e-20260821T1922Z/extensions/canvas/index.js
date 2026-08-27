import { r as createLazyRuntimeModule } from "../../lazy-runtime-CgCh8H_K.js";
import { t as asNonArrayRecord } from "../../record-coerce-DItp3I4t.js";
import { r as formatErrorMessage } from "../../errors-CSNUPl5U.js";
import "../../error-runtime-CmlvK1A3.js";
import "../../string-coerce-runtime-D9ocX9lc.js";
import { t as definePluginEntry } from "../../plugin-entry-B4wzLSpS.js";
import { n as validateSupportedA2UIJsonl } from "../../a2ui-jsonl-DeIxQ_ge.js";
import { n as CANVAS_HOST_PATH, o as canvasConfigSchema, r as CANVAS_WS_PATH, s as isCanvasHostEnabled, t as A2UI_PATH } from "../../a2ui-shared-NG90QUpc.js";
import { t as CanvasToolSchema } from "../../tool-schema-DqB1uxnU.js";
//#region extensions/canvas/index.ts
const CANVAS_NODE_COMMANDS = [
	"canvas.present",
	"canvas.hide",
	"canvas.navigate",
	"canvas.eval",
	"canvas.snapshot",
	"canvas.a2ui.push",
	"canvas.a2ui.pushJSONL",
	"canvas.a2ui.reset"
];
function createLazyCanvasTool(params) {
	const loadTool = createLazyRuntimeModule(() => import("../../tool-CHQfWeDE.js").then(({ createCanvasTool }) => createCanvasTool({
		config: params.config,
		workspaceDir: params.workspaceDir,
		agentSessionKey: params.agentSessionKey
	})));
	return {
		label: "Canvas",
		name: "canvas",
		resultContentSource: "network",
		description: "Control node canvases (present/hide/navigate/eval/snapshot/A2UI). Use snapshot to capture the rendered UI.",
		parameters: CanvasToolSchema,
		execute: async (...args) => await (await loadTool()).execute(...args)
	};
}
var canvas_default = definePluginEntry({
	id: "canvas",
	name: "Canvas",
	description: "Experimental Canvas control and A2UI rendering surfaces for paired nodes.",
	configSchema: canvasConfigSchema,
	reload: { restartPrefixes: [
		"plugins.enabled",
		"plugins.allow",
		"plugins.deny",
		"plugins.entries.canvas"
	] },
	register(api) {
		if (isCanvasHostEnabled(api.config)) {
			const httpRouteHandlerLoader = createLazyRuntimeModule(() => import("../../http-route-sRCTkGMG.js").then(({ createCanvasHttpRouteHandler }) => createCanvasHttpRouteHandler({
				config: api.config,
				pluginConfig: api.pluginConfig,
				runtime: {
					log: (...args) => api.logger.info(args.map(String).join(" ")),
					error: (...args) => api.logger.error(args.map(String).join(" ")),
					exit: (code) => {
						throw new Error(`canvas host requested process exit ${code}`);
					}
				}
			})));
			const loadHttpRouteHandler = httpRouteHandlerLoader;
			const handleHttpRequest = async (req, res) => await (await loadHttpRouteHandler()).handleHttpRequest(req, res);
			const handleUpgrade = async (req, socket, head) => await (await loadHttpRouteHandler()).handleUpgrade(req, socket, head);
			const nodeCapability = { surface: "canvas" };
			api.registerHttpRoute({
				path: A2UI_PATH,
				auth: "plugin",
				match: "prefix",
				nodeCapability,
				handler: handleHttpRequest
			});
			api.registerHttpRoute({
				path: CANVAS_HOST_PATH,
				auth: "plugin",
				match: "prefix",
				nodeCapability,
				handler: handleHttpRequest
			});
			api.registerHttpRoute({
				path: CANVAS_WS_PATH,
				auth: "plugin",
				match: "exact",
				nodeCapability,
				handler: handleHttpRequest,
				handleUpgrade
			});
			api.registerService({
				id: "canvas-host",
				start: () => {},
				stop: async () => {
					await (await httpRouteHandlerLoader.peek())?.close();
				}
			});
		}
		api.registerNodeInvokePolicy({
			commands: CANVAS_NODE_COMMANDS,
			defaultPlatforms: [
				"ios",
				"android",
				"macos",
				"windows",
				"linux",
				"unknown"
			],
			foregroundRestrictedOnIos: true,
			handle: async (ctx) => {
				const params = asNonArrayRecord(ctx.params);
				if (ctx.command === "canvas.a2ui.pushJSONL" || ctx.command === "canvas.a2ui.push" && !Array.isArray(params.messages) && Object.hasOwn(params, "jsonl")) {
					const jsonl = typeof params.jsonl === "string" ? params.jsonl : "";
					try {
						validateSupportedA2UIJsonl(jsonl);
					} catch (error) {
						return {
							ok: false,
							code: "INVALID_A2UI_JSONL",
							message: formatErrorMessage(error)
						};
					}
				}
				return await ctx.invokeNode();
			}
		});
		api.registerTool((ctx) => createLazyCanvasTool({
			config: ctx.runtimeConfig ?? ctx.config,
			workspaceDir: ctx.workspaceDir,
			agentSessionKey: ctx.sessionKey
		}));
		api.registerNodeCliFeature(async ({ program }) => {
			const { createDefaultCanvasCliDependencies, registerNodesCanvasCommands } = await import("../../cli-BeKL4sZc.js");
			registerNodesCanvasCommands(program, createDefaultCanvasCliDependencies());
		}, { descriptors: [{
			name: "canvas",
			description: "Capture or render canvas content from a paired node",
			hasSubcommands: true
		}] });
	}
});
//#endregion
export { canvas_default as default };
