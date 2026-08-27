import { t as createAbortError } from "./abort-signal-DEbc_zqk.js";
import { r as attachInternalToolExecutionPreparer, s as getInternalToolExecutionPreparer } from "./internal-hooks-BK9FsMLA.js";
import { d as copyAgentToolMetadata } from "./gateway-A68ONVQZ.js";
//#region src/agents/agent-tools.abort.ts
/**
* Abort-signal wrapping for agent tools.
* Combines per-call cancellation with run-level aborts while preserving
* identity-backed metadata on wrapped tools.
*/
function throwAbortError() {
	throw createAbortError("Aborted");
}
/**
* Races a tool execute promise against the combined abort signal so an abort
* settles the wrapped call immediately instead of awaiting the tool forever.
* JavaScript cannot cancel a running promise: a tool that never observes the
* signal keeps executing in the background and may settle later, but its late
* settlement is detached here so the result never lands in an aborted run.
* Tool settlements pass through untouched to preserve tool error semantics,
* including non-Error rejections.
*/
function raceWithAbortSignal(promise, signal, yieldRunSignal) {
	return new Promise((resolve, reject) => {
		const onAbort = () => {
			signal.removeEventListener("abort", onAbort);
			const reason = yieldRunSignal?.reason;
			if (yieldRunSignal?.aborted && signal.reason === reason && reason?.code === "sessions_yield" && reason.turnHandoff === true) return;
			reject(createAbortError("Aborted"));
		};
		signal.addEventListener("abort", onAbort, { once: true });
		promise.then((value) => {
			signal.removeEventListener("abort", onAbort);
			resolve(value);
		}, (error) => {
			signal.removeEventListener("abort", onAbort);
			reject(error);
		});
		if (signal.aborted) onAbort();
	});
}
/** Wrap a tool so every execute call observes the supplied run abort signal. */
function wrapToolWithAbortSignal(tool, abortSignal) {
	if (!abortSignal) return tool;
	const execute = tool.execute;
	if (!execute) return tool;
	const wrappedTool = {
		...tool,
		execute: async (toolCallId, params, signal, onUpdate) => {
			const combinedSignal = signal ? AbortSignal.any([signal, abortSignal]) : abortSignal;
			if (combinedSignal.aborted) throwAbortError();
			return await raceWithAbortSignal(execute(toolCallId, params, combinedSignal, onUpdate), combinedSignal, tool.name === "sessions_yield" ? abortSignal : void 0);
		}
	};
	copyAgentToolMetadata(tool, wrappedTool);
	const sourcePreparer = getInternalToolExecutionPreparer(tool);
	if (sourcePreparer) attachInternalToolExecutionPreparer(wrappedTool, async (params) => {
		const combinedSignal = params.signal ? AbortSignal.any([params.signal, abortSignal]) : abortSignal;
		if (combinedSignal.aborted) throwAbortError();
		const yieldRunSignal = tool.name === "sessions_yield" ? abortSignal : void 0;
		const sourcePreparation = sourcePreparer({
			...params,
			signal: combinedSignal
		});
		let prepared;
		try {
			prepared = await raceWithAbortSignal(sourcePreparation, combinedSignal, yieldRunSignal);
		} catch (error) {
			sourcePreparation.then((latePreparation) => latePreparation.dispose(), () => void 0);
			throw error;
		}
		if (prepared.kind === "immediate") return prepared;
		return {
			kind: "ready",
			args: prepared.args,
			execute: (onImplementationStart) => {
				if (combinedSignal.aborted) throwAbortError();
				return raceWithAbortSignal(prepared.execute(onImplementationStart), combinedSignal, yieldRunSignal);
			},
			dispose: prepared.dispose
		};
	});
	return wrappedTool;
}
//#endregion
export { wrapToolWithAbortSignal as t };
