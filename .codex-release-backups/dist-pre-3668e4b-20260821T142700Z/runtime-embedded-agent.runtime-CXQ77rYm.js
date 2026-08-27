import { r as getRuntimeConfig } from "./io-BTBpQ7uO.js";
import { t as getPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-BULcX9xX.js";
import "./config-CfeGo4K4.js";
import { o as prepareAgentRunAdmission, r as createOperationalRunInstanceRef } from "./admitted-run-context-Dl2hrF3z.js";
import { t as runEmbeddedAgent } from "./embedded-agent-CHigS-32.js";
//#region src/plugins/runtime/runtime-embedded-agent.runtime.ts
/** Lazy runtime adapter for plugin-owned embedded-agent execution. */
const runPluginEmbeddedAgent = async (params) => {
	const pluginId = getPluginRuntimeGatewayRequestScope()?.pluginId;
	if (!pluginId) throw new Error("Plugin embedded-agent execution requires an active plugin runtime scope.");
	if ("admittedRunContext" in params || "preparedRunAdmission" in params) throw new Error("Plugin embedded-agent execution cannot supply host run authority.");
	params.abortSignal?.throwIfAborted();
	const preparedRunAdmission = prepareAgentRunAdmission({
		cfg: params.config ?? getRuntimeConfig(),
		operationalRunInstance: createOperationalRunInstanceRef(params.runId),
		facts: {
			runId: params.runId,
			agentId: params.sessionTarget?.agentId ?? params.agentId ?? "main",
			ingress: {
				kind: "plugin",
				boundary: "plugin-runtime",
				rawSourceRef: pluginId,
				state: "present"
			}
		}
	});
	let closed = false;
	const close = () => {
		if (!closed) {
			closed = true;
			preparedRunAdmission.close();
		}
	};
	params.abortSignal?.addEventListener("abort", close, { once: true });
	try {
		params.abortSignal?.throwIfAborted();
		return await runEmbeddedAgent({
			...params,
			preparedRunAdmission
		});
	} finally {
		params.abortSignal?.removeEventListener("abort", close);
		close();
	}
};
//#endregion
export { runPluginEmbeddedAgent };
