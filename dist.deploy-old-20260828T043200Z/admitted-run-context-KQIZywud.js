import { r as claimAgentRunDelegatedAuthority, u as getAgentRunLifecycleGeneration, w as validateAgentRunDelegatedAuthority, y as releaseAgentRunDelegatedAuthority } from "./agent-run-registry-t4kvUyNQ.js";
import { c as executionIdentitySpawnAdmission, n as createExecutionIdentityAdmissionToken, r as enqueueExecutionIdentityContextAtAdmission } from "./execution-identity-admission-Tv8ni-9_.js";
import { n as isExecutionIdentityCollectionEnabled } from "./audit-config-BKFiXlHH.js";
import { randomUUID } from "node:crypto";
//#region src/agents/admitted-run-context.ts
/** Canonical operational instance and optional enabled execution-identity evidence. */
const delegatedAuthorityLeases = /* @__PURE__ */ new WeakMap();
const activeNativeHookRecoveryLeases = /* @__PURE__ */ new Map();
function bindAdmittedRunDelegatedAuthority(context) {
	activeNativeHookRecoveryLeases.delete(context.operationalRunInstance.runId);
	const lease = {
		authority: claimAgentRunDelegatedAuthority(context.operationalRunInstance),
		foregroundClosed: false
	};
	delegatedAuthorityLeases.set(context, lease);
}
/** Reads the immutable outer-run authority without reviving a closed claim. */
function getAdmittedRunDelegatedAuthority(context) {
	const lease = delegatedAuthorityLeases.get(context);
	return lease && !lease.foregroundClosed && validateAgentRunDelegatedAuthority(lease.authority) ? lease.authority : void 0;
}
/** Captures an exact admitted-run assertion for work that may cross an await boundary. */
function resolveAdmittedRunActiveAssertion(context, signal) {
	const operationalRunInstance = context.operationalRunInstance;
	const authority = getAdmittedRunDelegatedAuthority(context);
	if (!authority) return;
	return () => {
		if (signal?.aborted || context.operationalRunInstance !== operationalRunInstance || getAdmittedRunDelegatedAuthority(context) !== authority) throw new Error("admitted run authority is no longer active");
	};
}
/** Idempotently compare-releases the authority captured by this admission. */
function closeAdmittedRunDelegatedAuthority(context) {
	const lease = delegatedAuthorityLeases.get(context);
	if (!lease || lease.foregroundClosed) return false;
	lease.foregroundClosed = true;
	releaseAgentRunDelegatedAuthority(lease.authority);
	return true;
}
/** Recovery-only lease for the already-created native pre-tool policy callback. */
function retainAdmittedRunBeforeToolCallRecovery(context) {
	const lease = delegatedAuthorityLeases.get(context);
	const runId = context.operationalRunInstance.runId;
	if (!lease || lease.foregroundClosed || activeNativeHookRecoveryLeases.has(runId) || !validateAgentRunDelegatedAuthority(lease.authority)) return;
	activeNativeHookRecoveryLeases.set(runId, lease);
	const assertActive = () => {
		if (getAgentRunLifecycleGeneration() !== lease.authority.lifecycleGeneration || activeNativeHookRecoveryLeases.get(runId) !== lease) throw new Error("admitted run native hook recovery is no longer active");
	};
	return Object.freeze({
		assertActive,
		release: () => {
			if (activeNativeHookRecoveryLeases.get(runId) === lease) activeNativeHookRecoveryLeases.delete(runId);
		}
	});
}
/** Creates a one-shot recovery admission owned by the durable recovery resolver. */
function createExecutionIdentityRecoveryAdmission(params) {
	let consumed = false;
	return Object.freeze({
		retryOnly: params.retryOnly,
		consume: (runId) => {
			if (consumed) return Object.freeze({ accepted: false });
			consumed = true;
			if (params.expectedOperationalRunId !== void 0 && params.expectedOperationalRunId !== runId) return Object.freeze({ accepted: false });
			const token = params.expectedOperationalRunId !== void 0 || params.token?.runId === runId ? params.token : void 0;
			return Object.freeze({
				accepted: true,
				...token ? { token } : {}
			});
		}
	});
}
function createOperationalRunInstanceRef(runId) {
	return Object.freeze({
		instanceId: randomUUID(),
		runId
	});
}
/** Prepares a system-owned run without selecting its eventual execution runtime early. */
function prepareSystemAgentRunAdmission(cfg, runId, agentId, boundary) {
	return prepareAgentRunAdmission({
		cfg,
		operationalRunInstance: createOperationalRunInstanceRef(runId),
		facts: {
			runId,
			agentId,
			ingress: {
				kind: "system",
				boundary,
				state: "present"
			}
		}
	});
}
/**
* Freezes ingress facts before preparation while deferring allocation/capture until the
* authoritative runtime owner is selected immediately before execution.
*/
function prepareAgentRunAdmission(params) {
	const operationalRunInstance = params.operationalRunInstance;
	if (operationalRunInstance.runId !== params.facts.runId) throw new Error("operational run instance disagrees with prepared admission");
	let admittedRuntimeKind;
	let admittedRuntimeInstanceId;
	let admitted;
	let admittedContext;
	let closed = false;
	return Object.freeze({
		operationalRunInstance,
		close: () => {
			closed = true;
			if (admittedContext) closeAdmittedRunDelegatedAuthority(admittedContext);
			else admitted?.then(closeAdmittedRunDelegatedAuthority).catch(() => void 0);
		},
		admit: (runtimeKind, runtimeInstanceId) => {
			if (closed) return Promise.reject(/* @__PURE__ */ new Error("prepared execution context is already closed"));
			const fixedRuntimeKind = admittedRuntimeKind ??= runtimeKind;
			admittedRuntimeInstanceId ??= runtimeInstanceId?.trim() || void 0;
			admitted ??= (async () => {
				const facts = executionIdentitySpawnAdmission({
					operation: "attach",
					value: {
						...params.facts,
						runtime: { kind: fixedRuntimeKind }
					},
					extra: executionIdentitySpawnAdmission({
						operation: "read",
						value: params.facts
					})
				});
				const context = admitPreparedAgentRun({
					cfg: params.cfg,
					facts,
					operationalRunInstance,
					runtimeInstanceId: admittedRuntimeInstanceId,
					...params.recovery ? { recovery: params.recovery } : {}
				});
				admittedContext = context;
				try {
					await params.onAdmitted?.(context);
					if (closed || !getAdmittedRunDelegatedAuthority(context)) throw new Error("prepared execution authority closed during admission");
					return context;
				} catch (error) {
					closeAdmittedRunDelegatedAuthority(context);
					throw error;
				}
			})();
			return admitted;
		}
	});
}
/** Resolves a host-only continuation or validates an already-admitted internal caller. */
async function resolvePreparedRunAdmission(params) {
	if (params.admittedRunContext && params.preparedRunAdmission) throw new Error("run cannot carry both prepared and admitted execution contexts");
	const admitted = params.preparedRunAdmission ? await params.preparedRunAdmission.admit(params.runtimeKind, params.runtimeInstanceId) : params.admittedRunContext;
	if (!admitted || admitted.operationalRunInstance.runId !== params.runId) throw new Error("prepared execution context is unavailable or disagrees with the run");
	if (delegatedAuthorityLeases.get(admitted) && !getAdmittedRunDelegatedAuthority(admitted)) throw new Error("prepared execution authority is no longer active");
	return admitted;
}
function consumeRecoveryAdmission(params) {
	const consumed = typeof params.admission?.consume === "function" ? params.admission.consume(params.runId) : Object.freeze({ accepted: false });
	const token = consumed.token;
	if (!token) return consumed;
	return Object.freeze({
		accepted: consumed.accepted,
		token: Object.isFrozen(token) ? token : Object.freeze(token)
	});
}
/**
* Owns the single post-prepare allocation/adoption/capture decision for an execution.
* Queue loss remains audit loss only; the admitted execution keeps its exact token object.
*/
function admitPreparedAgentRun(params) {
	if (params.operationalRunInstance.runId !== params.facts.runId) throw new Error("operational run instance disagrees with prepared admission");
	const operationalRunInstance = params.operationalRunInstance;
	const recovery = consumeRecoveryAdmission({
		admission: params.recovery,
		runId: params.facts.runId
	});
	if (!isExecutionIdentityCollectionEnabled(params.cfg)) {
		const context = Object.freeze({ operationalRunInstance });
		bindAdmittedRunDelegatedAuthority(context);
		return context;
	}
	const executionIdentityToken = recovery.token ?? (!params.recovery || recovery.accepted && !params.recovery.retryOnly ? createExecutionIdentityAdmissionToken(params.facts.runId) : void 0);
	if (!executionIdentityToken) {
		const context = Object.freeze({ operationalRunInstance });
		bindAdmittedRunDelegatedAuthority(context);
		return context;
	}
	enqueueExecutionIdentityContextAtAdmission(params.facts, {
		enabled: true,
		token: executionIdentityToken,
		runtimeInstanceId: params.runtimeInstanceId,
		retryOnly: params.recovery?.retryOnly === true
	});
	const context = Object.freeze({
		operationalRunInstance,
		executionIdentityToken
	});
	bindAdmittedRunDelegatedAuthority(context);
	return context;
}
//#endregion
export { prepareAgentRunAdmission as a, resolvePreparedRunAdmission as c, getAdmittedRunDelegatedAuthority as i, retainAdmittedRunBeforeToolCallRecovery as l, createExecutionIdentityRecoveryAdmission as n, prepareSystemAgentRunAdmission as o, createOperationalRunInstanceRef as r, resolveAdmittedRunActiveAssertion as s, closeAdmittedRunDelegatedAuthority as t };
