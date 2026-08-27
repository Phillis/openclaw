import { r as createLazyRuntimeModule } from "./lazy-runtime-CgCh8H_K.js";
import { n as isTruthyEnvValue } from "./env-y-_yRnBE.js";
import { t as createSubsystemLogger } from "./subsystem-CDLhGl2-.js";
import "./runtime-env-COkbgBI4.js";
import { t as isBrowserMachineOutput } from "./cli-output-mode-DliOl6d6.js";
import { n as BROWSER_REQUEST_GATEWAY_SCOPE, t as BROWSER_REQUEST_GATEWAY_METHOD } from "./browser-gateway-contract-B6OC_gCs.js";
import { n as BROWSER_PROXY_UPLOAD_COMMAND, t as BROWSER_PROXY_COMMAND } from "./browser-node-commands-CIbUPKdY.js";
import { a as parseBrowserTabToolBinding, n as BrowserToolSchema, r as describeBrowserTool, t as BrowserToolOutputSchema } from "./browser-tool.schema-BOQMCdJY.js";
import { s as initializeBrowserSessionTabStore } from "./session-tab-store-CZSebDwT.js";
import { t as configureSystemProfileImportStateStore } from "./system-profile-import-state-DFy4mHBX.js";
//#region extensions/browser/plugin-registration.ts
const EAGER_BROWSER_CONTROL_SERVICE_ENV = "OPENCLAW_EAGER_BROWSER_CONTROL_SERVER";
const logger = createSubsystemLogger("browser");
const loadBrowserRegistrationRuntimeModule = createLazyRuntimeModule(() => import("./extensions/browser/register.runtime.js"));
function deriveChatTypeFromSessionKey(sessionKey) {
	const tokens = new Set(sessionKey?.toLowerCase().split(":").filter(Boolean) ?? []);
	if (tokens.has("group")) return "group";
	if (tokens.has("channel")) return "channel";
	if (tokens.has("direct") || tokens.has("dm")) return "direct";
}
const BROWSER_CLI_DESCRIPTOR = {
	name: "browser",
	description: "Manage OpenClaw's dedicated browser (Chrome/Chromium)",
	hasSubcommands: true,
	machineOutput: isBrowserMachineOutput
};
function createLazyBrowserTool(opts) {
	const bindingResult = opts?.runToolBinding === void 0 ? void 0 : parseBrowserTabToolBinding(opts.runToolBinding);
	if (bindingResult && !bindingResult.ok) throw new Error(`invalid browser run binding: ${bindingResult.error}`);
	return {
		label: "Browser",
		name: "browser",
		resultContentSource: "network",
		description: describeBrowserTool({
			targetDefault: opts?.sandboxBridgeUrl ? "sandbox" : "host",
			hostHint: opts?.allowHostControl === false ? "Host target blocked by policy." : "Host target allowed."
		}),
		parameters: BrowserToolSchema,
		outputSchema: BrowserToolOutputSchema,
		execute: async (toolCallId, args, signal, onUpdate) => {
			const { createBrowserTool } = await loadBrowserRegistrationRuntimeModule();
			return await createBrowserTool(bindingResult?.ok ? {
				...opts,
				runToolBinding: bindingResult.binding
			} : opts).execute(toolCallId, args, signal, onUpdate);
		}
	};
}
function createBrowserToolOptions(ctx) {
	const mediaChannel = ctx.deliveryContext?.channel ?? ctx.messageChannel;
	const mediaChatType = deriveChatTypeFromSessionKey(ctx.sessionKey);
	return {
		...ctx.browser?.sandboxBridgeUrl ? { sandboxBridgeUrl: ctx.browser.sandboxBridgeUrl } : {},
		...ctx.browser?.allowHostControl !== void 0 ? { allowHostControl: ctx.browser.allowHostControl } : {},
		...ctx.sessionKey ? { agentSessionKey: ctx.sessionKey } : {},
		...ctx.agentDir ? { agentDir: ctx.agentDir } : {},
		...ctx.workspaceDir ? { workspaceDir: ctx.workspaceDir } : {},
		...ctx.activeModel?.provider || ctx.activeModel?.modelId ? { activeModel: {
			provider: ctx.activeModel.provider,
			model: ctx.activeModel.modelId
		} } : {},
		...ctx.sessionKey || mediaChannel ? { mediaScope: {
			...ctx.sessionKey ? { sessionKey: ctx.sessionKey } : {},
			...mediaChannel ? { channel: mediaChannel } : {},
			...mediaChatType ? { chatType: mediaChatType } : {}
		} } : {},
		...ctx.toolBindings && Object.hasOwn(ctx.toolBindings, "browser") ? { runToolBinding: ctx.toolBindings.browser } : {}
	};
}
/** Browser plugin reload policy. */
const browserPluginReload = {
	restartPrefixes: ["browser"],
	hotPrefixes: ["browser.profiles"]
};
/** Node-host command descriptors exposed by the Browser plugin. */
function createBrowserProxyNodeHostCommand(command) {
	return {
		command,
		cap: "browser",
		isAvailable: ({ config }) => config.browser?.enabled !== false && config.nodeHost?.browserProxy?.enabled !== false,
		handle: async (paramsJSON, _io, context) => {
			const { runBrowserProxyCommand } = await loadBrowserRegistrationRuntimeModule();
			return await runBrowserProxyCommand(paramsJSON, command, context?.signal);
		},
		...command === "browser.proxy.upload.v1" ? { watchAvailability: () => {
			loadBrowserRegistrationRuntimeModule().then(({ ensureBrowserProxyUploadCleanup }) => ensureBrowserProxyUploadCleanup()).catch((error) => {
				logger.warn(`browser proxy upload cleanup startup failed: ${String(error)}`);
			});
		} } : {}
	};
}
const browserPluginNodeHostCommands = [createBrowserProxyNodeHostCommand(BROWSER_PROXY_COMMAND), createBrowserProxyNodeHostCommand(BROWSER_PROXY_UPLOAD_COMMAND)];
/** Security audit collectors contributed by the Browser plugin. */
const browserSecurityAuditCollectors = [async (ctx) => {
	const { collectBrowserSecurityAuditFindings } = await loadBrowserRegistrationRuntimeModule();
	return collectBrowserSecurityAuditFindings(ctx);
}];
function createLazyBrowserPluginService() {
	let service = null;
	const loadService = async () => {
		if (!service) {
			const { createBrowserPluginService } = await loadBrowserRegistrationRuntimeModule();
			service = createBrowserPluginService();
		}
		return service;
	};
	return {
		id: "browser-control",
		start: async (ctx) => {
			if (!isTruthyEnvValue(process.env[EAGER_BROWSER_CONTROL_SERVICE_ENV])) return;
			await (await loadService()).start(ctx);
		},
		stop: async (ctx) => {
			if (!service) {
				const { stopBrowserControlService } = await import("./control-service-DAbpOtGA.js");
				await stopBrowserControlService();
				return;
			}
			await service.stop?.(ctx);
		}
	};
}
/** Register Browser tool factories, CLI, gateway methods, services, and audits. */
function registerBrowserPlugin(api) {
	initializeBrowserSessionTabStore(api.runtime);
	configureSystemProfileImportStateStore(api.runtime.state.openKeyedStore({
		namespace: "browser.system-profile-import",
		maxEntries: 1
	}));
	api.registerTool(((ctx) => createLazyBrowserTool(createBrowserToolOptions(ctx))));
	api.registerCli(async ({ program }) => {
		const { registerBrowserCli } = await import("./browser-cli-nw69kn6E.js");
		registerBrowserCli(program, process.argv, api.rootDir);
	}, {
		commands: ["browser"],
		descriptors: [BROWSER_CLI_DESCRIPTOR]
	});
	api.registerGatewayMethod(BROWSER_REQUEST_GATEWAY_METHOD, async (opts) => {
		const { handleBrowserGatewayRequest } = await loadBrowserRegistrationRuntimeModule();
		return await handleBrowserGatewayRequest(opts);
	}, { scope: BROWSER_REQUEST_GATEWAY_SCOPE });
	api.registerHttpRoute({
		path: "/browser/extension",
		auth: "plugin",
		match: "exact",
		handler: (_req, res) => {
			res.writeHead(426, { "Content-Type": "text/plain" });
			res.end("Upgrade Required: connect the OpenClaw Chrome extension over WebSocket.");
		},
		handleUpgrade: async (req, socket, head) => {
			const { handleGatewayExtensionUpgrade } = await import("./gateway-relay-route-BdWSsDnH.js");
			return await handleGatewayExtensionUpgrade(req, socket, head);
		}
	});
	api.registerService(createLazyBrowserPluginService());
}
//#endregion
export { registerBrowserPlugin as i, browserPluginReload as n, browserSecurityAuditCollectors as r, browserPluginNodeHostCommands as t };
