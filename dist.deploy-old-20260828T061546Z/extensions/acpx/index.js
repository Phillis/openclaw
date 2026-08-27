import { a as createLazyRuntimeSurface, r as createLazyRuntimeModule } from "../../lazy-runtime-CgCh8H_K.js";
import { c as isRecord } from "../../record-coerce-DItp3I4t.js";
import { h as finiteSecondsToTimerSafeMilliseconds } from "../../number-coercion-CLj0HTDM.js";
import "../../number-runtime-Cy4drVnh.js";
import "../../string-coerce-runtime-C8jKEm3h.js";
import { t as tryDispatchAcpReplyHook } from "../../acpx-tpjmJjt_.js";
import "../../acp-runtime-backend-DETXl_wR.js";
import { t as resolveNodeHostExecutable } from "../../node-host-B926ObkZ.js";
import { r as createSessionCatalogNodeHostBindings } from "../../session-catalog-BZ2h3pGe.js";
import { t as createAcpxRuntimeService } from "../../register.runtime-D5e3nDjs.js";
import "../../config-schema-B6gh9hLL.js";
import { a as PI_SESSIONS_CAPABILITY, c as PI_SESSION_READ_COMMAND, l as PI_TERMINAL_RESUME_COMMAND, o as PI_SESSIONS_LIST_COMMAND, r as piSessionStoreAvailable, s as PI_SESSION_ID_PATTERN } from "../../pi-session-paths-Ct9dzRs7.js";
//#region extensions/acpx/src/pi-session-catalog-plugin.ts
const loadPiSessionCatalogModule = createLazyRuntimeModule(() => import("../../pi-session-catalog-runtime-CTvR_JEa.js"));
function fullConfigCatalogEnabled(config) {
	if (!isRecord(config) || !isRecord(config.plugins) || !isRecord(config.plugins.entries)) return true;
	const entry = config.plugins.entries.acpx;
	if (!isRecord(entry) || !isRecord(entry.config) || !isRecord(entry.config.piSessionCatalog)) return true;
	return entry.config.piSessionCatalog.enabled !== false;
}
function isPiSessionCatalogEnabled(pluginConfig) {
	return !isRecord(pluginConfig) || !isRecord(pluginConfig.piSessionCatalog) || pluginConfig.piSessionCatalog.enabled !== false;
}
function createPiSessionNodeHostBindings() {
	const storeAvailable = ({ config, env }) => fullConfigCatalogEnabled(config) && piSessionStoreAvailable(env);
	return createSessionCatalogNodeHostBindings({
		capability: PI_SESSIONS_CAPABILITY,
		listCommand: PI_SESSIONS_LIST_COMMAND,
		readCommand: PI_SESSION_READ_COMMAND,
		terminalCommand: PI_TERMINAL_RESUME_COMMAND,
		sessionIdPattern: PI_SESSION_ID_PATTERN,
		executable: "pi",
		args: (threadId) => ["--session", threadId],
		listAvailable: storeAvailable,
		terminalAvailable: ({ config, env }) => storeAvailable({
			config,
			env
		}) && Boolean(resolveNodeHostExecutable("pi", {
			env,
			pathEnv: env.PATH ?? env.Path ?? "",
			strategy: "direct"
		})),
		parseParams: (paramsJSON) => {
			if (!paramsJSON) return;
			try {
				return JSON.parse(paramsJSON);
			} catch (error) {
				throw new Error("Pi session parameters must be valid JSON", { cause: error });
			}
		},
		list: async (params) => await (await loadPiSessionCatalogModule()).listPiSessions(params),
		read: async (params) => await (await loadPiSessionCatalogModule()).readPiSession(params),
		requireSession: async (threadId) => await (await loadPiSessionCatalogModule()).requireLocalPiSession(threadId),
		terminalIoRequiredMessage: "Pi terminal command requires duplex transport",
		terminalUnavailableMessage: "Pi CLI is unavailable",
		invalidThreadIdMessage: "INVALID_REQUEST: threadId is invalid"
	});
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
	const nodeHost = createPiSessionNodeHostBindings();
	for (const command of nodeHost.commands) api.registerNodeHostCommand(command);
	for (const policy of nodeHost.policies) api.registerNodeInvokePolicy(policy);
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
