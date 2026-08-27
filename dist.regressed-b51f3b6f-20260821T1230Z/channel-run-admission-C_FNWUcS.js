import { o as consumeChannelAdmissionEvidence, u as recordChannelAdmissionDecision } from "./admission-evidence-UgNy_kxM.js";
import { o as prepareAgentRunAdmission, r as createOperationalRunInstanceRef } from "./admitted-run-context-BxSN0sUe.js";
//#region src/auto-reply/reply/channel-run-admission.ts
/** Adapt one opaque channel carrier to the canonical admitted-run facts and decision FIFO. */
function consumeChannelRunAdmission(evidence) {
	const admission = consumeChannelAdmissionEvidence(evidence);
	return Object.freeze({
		ingressState: admission.ingressState,
		facts: Object.freeze({
			invoker: admission.invoker,
			...admission.assuranceRef ? { assurance: [{
				kind: "channel-admission",
				rawEvidenceRef: admission.assuranceRef,
				strength: "boundary-verified"
			}] } : {}
		}),
		onAdmitted: (context) => {
			const token = context.executionIdentityToken;
			if (token && admission.decisionCoverage) recordChannelAdmissionDecision({
				contextId: token.contextId,
				executionId: token.executionId,
				runId: token.runId,
				occurredAt: token.createdAt,
				coverageState: admission.decisionCoverage
			});
		}
	});
}
/** Defer evidence consumption until the selected runtime actually admits the run. */
function prepareChannelRunAdmission(params) {
	const operationalRunInstance = createOperationalRunInstanceRef(params.runId);
	let prepared;
	let closed = false;
	return Object.freeze({
		operationalRunInstance,
		admit: (runtimeKind, runtimeInstanceId) => {
			if (closed) return Promise.reject(/* @__PURE__ */ new Error("prepared execution context is already closed"));
			if (!prepared) {
				const channelAdmission = consumeChannelRunAdmission(params.evidence);
				prepared = prepareAgentRunAdmission({
					cfg: params.cfg,
					operationalRunInstance,
					facts: {
						runId: params.runId,
						agentId: params.agentId,
						ingress: {
							kind: params.ingressKind,
							boundary: params.boundary,
							state: channelAdmission.ingressState
						},
						...channelAdmission.facts
					},
					onAdmitted: channelAdmission.onAdmitted
				});
			}
			return prepared.admit(runtimeKind, runtimeInstanceId);
		},
		close: () => {
			closed = true;
			prepared?.close();
		}
	});
}
//#endregion
export { prepareChannelRunAdmission as n, consumeChannelRunAdmission as t };
