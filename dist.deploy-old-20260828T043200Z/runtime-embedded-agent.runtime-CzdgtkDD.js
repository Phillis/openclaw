import { n as getRuntimeConfig } from "./io-DlN5njvP.js";
import { i as getPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-B19X7f09.js";
import "./config-B2bSneS2.js";
import { n as recordRuntimeActionDecision } from "./runtime-action-decision-C4JNkXkP.js";
import { a as prepareAgentRunAdmission, i as getAdmittedRunDelegatedAuthority, r as createOperationalRunInstanceRef } from "./admitted-run-context-KQIZywud.js";
import { t as runEmbeddedAgent } from "./embedded-agent-B-kid8Al.js";
import { randomUUID } from "node:crypto";
//#region src/plugins/runtime/runtime-embedded-agent.runtime.ts
/** Lazy runtime adapter for plugin-owned embedded-agent execution. */
const runPluginEmbeddedAgent = async (params) => {
	const pluginId = getPluginRuntimeGatewayRequestScope()?.pluginId;
	if (!pluginId) throw new Error("Plugin embedded-agent execution requires an active plugin runtime scope.");
	if ("admittedRunContext" in params || "preparedRunAdmission" in params) throw new Error("Plugin embedded-agent execution cannot supply host run authority.");
	params.abortSignal?.throwIfAborted();
	const decisionOccurrenceId = randomUUID();
	let admittedRunContext;
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
		},
		onAdmitted: (context) => {
			admittedRunContext = context;
			const token = context.executionIdentityToken;
			recordRuntimeActionDecision({
				token,
				family: "plugin",
				operation: "run",
				outcome: "allowed",
				coverageState: "enforced",
				reasonCode: "plugin_runtime_owner_admitted",
				owner: "plugin-runtime",
				decisionBoundary: "plugin.runtime.run-embedded-agent",
				policyRefs: ["plugin:registered-owner", "run:admission"],
				summary: "The registered plugin owner passed exact run admission.",
				remediation: [],
				discriminator: JSON.stringify([
					pluginId,
					params.runId,
					decisionOccurrenceId,
					"admission"
				])
			});
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
		const result = await runEmbeddedAgent({
			...params,
			preparedRunAdmission
		});
		if (admittedRunContext && getAdmittedRunDelegatedAuthority(admittedRunContext)) recordRuntimeActionDecision({
			token: admittedRunContext.executionIdentityToken,
			family: "plugin",
			operation: "run",
			outcome: "allowed",
			coverageState: "attribution-only",
			reasonCode: "plugin_runtime_completed",
			owner: "plugin-runtime",
			decisionBoundary: "plugin.runtime.run-embedded-agent",
			summary: "The plugin-owned runtime completed; this is attribution, not authorization.",
			remediation: [],
			discriminator: JSON.stringify([
				pluginId,
				params.runId,
				decisionOccurrenceId,
				"completion"
			])
		});
		return result;
	} finally {
		params.abortSignal?.removeEventListener("abort", close);
		close();
	}
};
//#endregion
export { runPluginEmbeddedAgent };
