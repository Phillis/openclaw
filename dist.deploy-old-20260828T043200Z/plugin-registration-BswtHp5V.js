import { r as createLazyRuntimeModule } from "./lazy-runtime-CgCh8H_K.js";
import { n as isTruthyEnvValue } from "./env-ChWDbSFK.js";
import { t as createSubsystemLogger } from "./subsystem-a4KzJVZG.js";
import "./runtime-env-_YEv0JPQ.js";
import { t as isBrowserMachineOutput } from "./cli-output-mode-gjNkcUO8.js";
import { n as BROWSER_REQUEST_GATEWAY_SCOPE, t as BROWSER_REQUEST_GATEWAY_METHOD } from "./browser-gateway-contract-B6OC_gCs.js";
import { n as BROWSER_PROXY_UPLOAD_COMMAND, t as BROWSER_PROXY_COMMAND } from "./browser-node-commands-CIbUPKdY.js";
import { i as describeBrowserTool, n as createBrowserToolSchema, o as parseBrowserTabToolBinding, r as resolveBrowserToolCapabilities, t as BrowserToolOutputSchema } from "./browser-tool.schema-BWj6HgcC.js";
import { a as resolveProfile, r as resolveBrowserConfig } from "./config-HQZ6_yJ9.js";
import { t as getBrowserProfileCapabilities } from "./profile-capabilities-DWXzOQqP.js";
import { s as initializeBrowserSessionTabStore } from "./session-tab-store-BnSgCuum.js";
import { t as configureSystemProfileImportStateStore } from "./system-profile-import-state-DFy4mHBX.js";
//#region extensions/browser/plugin-registration.ts
const EAGER_BROWSER_CONTROL_SERVICE_ENV = "OPENCLAW_EAGER_BROWSER_CONTROL_SERVER";
const logger = createSubsystemLogger("browser");
const loadBrowserRegistrationRuntimeModule = createLazyRuntimeModule(() => import("./extensions/browser/register.runtime.js"));
const loadBrowserUploadCleanupRuntimeModule = createLazyRuntimeModule(() => import("./browser-proxy-upload-cleanup.runtime.js"));
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
function createLazyBrowserTool(opts, config) {
	const bindingResult = opts?.runToolBinding === void 0 ? void 0 : parseBrowserTabToolBinding(opts.runToolBinding);
	if (bindingResult && !bindingResult.ok) throw new Error(`invalid browser run binding: ${bindingResult.error}`);
	const targetDefault = opts?.sandboxBridgeUrl ? "sandbox" : "host";
	const hostHint = opts?.allowHostControl === false ? "Host target blocked by policy." : "Host target allowed.";
	const boundProfile = bindingResult?.ok && bindingResult.binding.target === "host" ? resolveProfile(resolveBrowserConfig(config?.browser, config), bindingResult.binding.profile) : void 0;
	const capabilities = resolveBrowserToolCapabilities({
		tabBound: bindingResult?.ok,
		evaluateEnabled: config?.browser?.evaluateEnabled !== false,
		...boundProfile ? { profileCapabilities: getBrowserProfileCapabilities(boundProfile) } : {}
	});
	return {
		label: "Browser",
		name: "browser",
		resultContentSource: "network",
		description: describeBrowserTool({
			targetDefault,
			hostHint,
			capabilities
		}),
		parameters: createBrowserToolSchema(capabilities),
		outputSchema: BrowserToolOutputSchema,
		execute: async (toolCallId, args, signal, onUpdate) => {
			const { createBrowserTool } = await loadBrowserRegistrationRuntimeModule();
			return await createBrowserTool(bindingResult?.ok ? {
				...opts,
				runToolBinding: bindingResult.binding,
				toolCapabilities: capabilities
			} : {
				...opts,
				toolCapabilities: capabilities
			}).execute(toolCallId, args, signal, onUpdate);
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
		...ctx.agentId ? { agentId: ctx.agentId } : {},
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
			loadBrowserUploadCleanupRuntimeModule().then(({ ensureBrowserProxyUploadCleanup }) => ensureBrowserProxyUploadCleanup()).catch((error) => {
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
			const { createBrowserPluginService, stopBrowserControlService } = await loadBrowserRegistrationRuntimeModule();
			service = createBrowserPluginService({ stopOnDemand: stopBrowserControlService });
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
				const loadedRuntime = loadBrowserRegistrationRuntimeModule.peek();
				if (!loadedRuntime) return;
				const { stopBrowserControlService } = await loadedRuntime;
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
	api.registerTool(((ctx) => {
		const config = ctx.getRuntimeConfig?.() ?? ctx.runtimeConfig ?? ctx.config;
		return createLazyBrowserTool(createBrowserToolOptions(ctx), config);
	}));
	api.registerCli(async ({ program }) => {
		const { registerBrowserCli } = await import("./browser-cli-Ca9rhB79.js");
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
			await loadBrowserRegistrationRuntimeModule();
			const { handleGatewayExtensionUpgrade } = await import("./gateway-relay-route-FuUB1-XJ.js");
			return await handleGatewayExtensionUpgrade(req, socket, head);
		}
	});
	api.registerService(createLazyBrowserPluginService());
}
//#endregion
export { registerBrowserPlugin as i, browserPluginReload as n, browserSecurityAuditCollectors as r, browserPluginNodeHostCommands as t };
