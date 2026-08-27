import { a as createLazyRuntimeSurface, r as createLazyRuntimeModule } from "../../lazy-runtime-CgCh8H_K.js";
import { h as finiteSecondsToTimerSafeMilliseconds } from "../../number-coercion-oCkfUEEq.js";
import { c as isRecord } from "../../record-coerce-DItp3I4t.js";
import "../../number-runtime-CoAPZzJY.js";
import "../../string-coerce-runtime-D9ocX9lc.js";
import { t as tryDispatchAcpReplyHook } from "../../acpx-BYxN1N7k.js";
import "../../acp-runtime-backend-8lMP_XLg.js";
import { t as resolveNodeHostExecutable } from "../../node-host-CSUwJ8BY.js";
import { t as createAcpxRuntimeService } from "../../register.runtime-e0-tJTSE.js";
import "../../config-schema-CVRxSs1m.js";
import { a as PI_SESSION_READ_COMMAND, i as PI_SESSIONS_LIST_COMMAND, o as PI_TERMINAL_RESUME_COMMAND, r as piSessionStoreAvailable } from "../../pi-session-paths-WBbprMuq.js";
//#region extensions/acpx/src/pi-session-catalog-plugin.ts
const PI_SESSIONS_CAPABILITY = "pi-sessions";
const loadPiSessionCatalogModule = createLazyRuntimeModule(() => import("../../pi-session-catalog-runtime-CO_lGEBU.js"));
function fullConfigCatalogEnabled(config) {
	if (!isRecord(config) || !isRecord(config.plugins) || !isRecord(config.plugins.entries)) return true;
	const entry = config.plugins.entries.acpx;
	if (!isRecord(entry) || !isRecord(entry.config) || !isRecord(entry.config.piSessionCatalog)) return true;
	return entry.config.piSessionCatalog.enabled !== false;
}
function isPiSessionCatalogEnabled(pluginConfig) {
	return !isRecord(pluginConfig) || !isRecord(pluginConfig.piSessionCatalog) || pluginConfig.piSessionCatalog.enabled !== false;
}
function createPiSessionNodeHostCommands() {
	const storeAvailable = ({ config, env }) => fullConfigCatalogEnabled(config) && piSessionStoreAvailable(env);
	return [
		{
			command: PI_SESSIONS_LIST_COMMAND,
			cap: PI_SESSIONS_CAPABILITY,
			dangerous: false,
			isAvailable: storeAvailable,
			handle: async (paramsJSON) => await (await loadPiSessionCatalogModule()).listPiSessions(paramsJSON)
		},
		{
			command: PI_SESSION_READ_COMMAND,
			cap: PI_SESSIONS_CAPABILITY,
			dangerous: false,
			isAvailable: storeAvailable,
			handle: async (paramsJSON) => await (await loadPiSessionCatalogModule()).readPiSession(paramsJSON)
		},
		{
			command: PI_TERMINAL_RESUME_COMMAND,
			cap: PI_SESSIONS_CAPABILITY,
			dangerous: false,
			duplex: true,
			isAvailable: ({ config, env }) => storeAvailable({
				config,
				env
			}) && Boolean(resolveNodeHostExecutable("pi", {
				env,
				pathEnv: env.PATH ?? env.Path ?? "",
				strategy: "direct"
			})),
			handle: async (paramsJSON, io) => await (await loadPiSessionCatalogModule()).resumePiSession(paramsJSON, io)
		}
	];
}
function createPiSessionNodeInvokePolicies() {
	return [{
		commands: [
			PI_SESSIONS_LIST_COMMAND,
			PI_SESSION_READ_COMMAND,
			PI_TERMINAL_RESUME_COMMAND
		],
		defaultPlatforms: [
			"macos",
			"linux",
			"windows"
		],
		handle: (context) => context.command === "acpx.pi.terminal.resume.v1" ? { ok: true } : context.invokeNode()
	}];
}
function registerPiSessionCatalog(api) {
	if (!isPiSessionCatalogEnabled(api.pluginConfig)) return;
	const loadCatalogRuntime = createLazyRuntimeSurface(loadPiSessionCatalogModule, (module) => module.createPiSessionCatalogRuntime(api));
	api.registerSessionCatalog({
		id: "pi",
		label: "Pi",
		supportsProcessHomeIsolation: true,
		list: async (query) => await (await loadCatalogRuntime()).list(query),
		read: async (request) => await (await loadCatalogRuntime()).read(request),
		continueSession: async (request) => await (await loadCatalogRuntime()).continueSession(request),
		checkUpstreamActivity: async (probes, policy) => await (await loadCatalogRuntime()).checkUpstreamActivity(probes, policy),
		openTerminal: async (request) => await (await loadCatalogRuntime()).openTerminal(request)
	});
	for (const command of createPiSessionNodeHostCommands()) api.registerNodeHostCommand(command);
	for (const policy of createPiSessionNodeInvokePolicies()) api.registerNodeInvokePolicy(policy);
}
//#endregion
//#region extensions/acpx/index.ts
/**
* ACPX runtime plugin entry. It registers the embedded ACP backend service and
* wires reply-dispatch hooks into the plugin SDK runtime.
*/
function resolveReplyDispatchTimeoutMs(pluginConfig) {
	const timeoutSeconds = pluginConfig?.timeoutSeconds;
	return finiteSecondsToTimerSafeMilliseconds(typeof timeoutSeconds === "number" && Number.isFinite(timeoutSeconds) && timeoutSeconds > 0 ? timeoutSeconds : 120) ?? 1;
}
async function tryDispatchAcpReplyHookWithTimeout(event, ctx, timeoutMs) {
	const timeoutController = new AbortController();
	const timeout = setTimeout(() => timeoutController.abort(), timeoutMs);
	timeout.unref?.();
	const abortSignal = ctx.abortSignal ? AbortSignal.any([ctx.abortSignal, timeoutController.signal]) : timeoutController.signal;
	try {
		return await tryDispatchAcpReplyHook(event, {
			...ctx,
			abortSignal
		});
	} finally {
		clearTimeout(timeout);
	}
}
const plugin = {
	id: "acpx",
	name: "ACPX Runtime",
	description: "Embedded ACP runtime backend with plugin-owned session and transport management.",
	register(api) {
		const replyDispatchTimeoutMs = resolveReplyDispatchTimeoutMs(api.pluginConfig);
		registerPiSessionCatalog(api);
		api.registerService(createAcpxRuntimeService({
			pluginConfig: api.pluginConfig,
			openKeyedStore: (options) => api.runtime.state.openKeyedStore(options)
		}));
		api.on("reply_dispatch", (event, ctx) => tryDispatchAcpReplyHookWithTimeout(event, ctx, replyDispatchTimeoutMs), { timeoutMs: replyDispatchTimeoutMs });
	}
};
//#endregion
export { plugin as default };
