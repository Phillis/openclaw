import { o as parseExecutionIdentityAdmissionToken } from "./execution-identity-admission-Tv8ni-9_.js";
//#region src/audit/execution-owner-binding.ts
function isRetainedExecutionOwnerBinding(result) {
	return result === "bound" || result === "already-bound";
}
/** Extracts only an admitted exact identity; operational run correlation cannot bind owner rows. */
function executionOwnerBindingFromAdmission(admitted) {
	if (!admitted.executionIdentityToken) return;
	const token = parseExecutionIdentityAdmissionToken(admitted.executionIdentityToken);
	if (token.runId !== admitted.operationalRunInstance.runId) throw new Error("owner execution binding disagrees with the admitted run");
	return {
		contextId: token.contextId,
		executionId: token.executionId
	};
}
function classifyExecutionOwnerBinding(current, binding) {
	if (current.contextId === null && current.executionId === null) return "unbound";
	return current.contextId === binding.contextId && current.executionId === binding.executionId ? "already-bound" : "mismatch";
}
/** Adds one exact owner write after admission resolves, never inside the admission callback. */
function withPostAdmissionExecutionOwnerBinding(prepared, bind) {
	let bound = false;
	return Object.freeze({
		operationalRunInstance: prepared.operationalRunInstance,
		admit: async (runtimeKind, runtimeInstanceId) => {
			const admitted = await prepared.admit(runtimeKind, runtimeInstanceId);
			if (!bound) {
				bound = true;
				bind(admitted);
			}
			return admitted;
		},
		close: prepared.close
	});
}
/** Requires both exact admission and actual execution start, in either runtime order. */
function createExecutionStartedOwnerBinding(bind) {
	let admitted;
	let executionStarted = false;
	let bound = false;
	const bindIfReady = () => {
		if (bound || !admitted || !executionStarted) return;
		bound = true;
		bind(admitted);
	};
	return {
		onPostAdmission: (context) => {
			admitted = context;
			bindIfReady();
		},
		onExecutionStarted: () => {
			executionStarted = true;
			bindIfReady();
		}
	};
}
//#endregion
export { withPostAdmissionExecutionOwnerBinding as a, isRetainedExecutionOwnerBinding as i, createExecutionStartedOwnerBinding as n, executionOwnerBindingFromAdmission as r, classifyExecutionOwnerBinding as t };
