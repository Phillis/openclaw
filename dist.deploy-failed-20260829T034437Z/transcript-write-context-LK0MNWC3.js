import path from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/config/sessions/transcript-write-context.ts
const ownedTranscriptWriteContext = new AsyncLocalStorage();
function normalizeConcretePathForCompare(value) {
	const trimmed = value?.trim();
	if (!trimmed || !path.isAbsolute(trimmed) || !trimmed.endsWith(".jsonl")) return;
	return path.resolve(trimmed);
}
function contextMatches(params) {
	const normalizeTarget = (target) => {
		const agentId = target?.agentId?.trim();
		const sessionId = target?.sessionId?.trim();
		const sessionKey = target?.sessionKey?.trim();
		const storePath = target?.storePath?.trim();
		return sessionKey && storePath ? {
			agentId,
			sessionId,
			sessionKey,
			storePath: path.resolve(storePath)
		} : void 0;
	};
	const contextTarget = normalizeTarget(params.context.sessionTarget);
	const requestedTarget = normalizeTarget(params.sessionTarget);
	if (params.context.sessionTarget || params.sessionTarget) return Boolean(contextTarget && requestedTarget && contextTarget.sessionKey === requestedTarget.sessionKey && contextTarget.storePath === requestedTarget.storePath && (!contextTarget.agentId || !requestedTarget.agentId || contextTarget.agentId === requestedTarget.agentId) && (!contextTarget.sessionId || !requestedTarget.sessionId || contextTarget.sessionId === requestedTarget.sessionId));
	const contextSessionFile = normalizeConcretePathForCompare(params.context.sessionFile);
	const sessionFile = normalizeConcretePathForCompare(params.sessionFile);
	if (contextSessionFile && sessionFile) return contextSessionFile === sessionFile;
	const contextSessionKey = params.context.sessionKey?.trim();
	const sessionKey = params.sessionKey?.trim();
	return Boolean(contextSessionKey && sessionKey && contextSessionKey === sessionKey);
}
/** Runs transcript writes with the admitted run's teardown and writer-fence context. */
async function withOwnedSessionTranscriptWrites(context, run) {
	return await ownedTranscriptWriteContext.run(context, run);
}
/** Runs detached work without retaining an attempt-owned transcript context. */
function runWithoutOwnedSessionTranscriptWrites(run) {
	return ownedTranscriptWriteContext.exit(run);
}
function bindOwnedSessionTranscriptWrites(context, run) {
	return (...args) => ownedTranscriptWriteContext.run(context, () => run(...args));
}
/** Returns the matching admitted-run fence for a durable write boundary. */
function getOwnedSessionTranscriptWriterFence(params = {}) {
	const context = ownedTranscriptWriteContext.getStore();
	if (!context || Object.keys(params).length > 0 && !contextMatches({
		context,
		...params
	})) return;
	const target = context.sessionTarget;
	const expectedWriterRunId = target?.expectedWriterRunId?.trim();
	if (!expectedWriterRunId) return;
	const expectedLifecycleRevision = target?.expectedLifecycleRevision;
	return {
		...expectedLifecycleRevision !== void 0 ? { expectedLifecycleRevision } : {},
		expectedWriterRunId
	};
}
/** Applies the admitted-run fence inherited by a matching synchronous writer. */
function withOwnedSessionTranscriptWriterFence(scope) {
	const fence = getOwnedSessionTranscriptWriterFence({
		sessionKey: scope.sessionKey,
		sessionTarget: scope
	});
	return fence ? {
		...scope,
		...fence
	} : scope;
}
var SessionTranscriptWriterClaimReboundError = class extends Error {
	constructor(sessionKey) {
		super(`session writer claim changed before transcript persistence: ${sessionKey ?? "unknown"}`);
		this.name = "SessionTranscriptWriterClaimReboundError";
	}
};
async function runWithOwnedSessionTranscriptWrite(params, run) {
	const context = ownedTranscriptWriteContext.getStore();
	if (!context || !contextMatches({
		context,
		...params
	})) return await run();
	return await context.withTranscriptWrite(run);
}
//#endregion
export { runWithoutOwnedSessionTranscriptWrites as a, runWithOwnedSessionTranscriptWrite as i, bindOwnedSessionTranscriptWrites as n, withOwnedSessionTranscriptWriterFence as o, getOwnedSessionTranscriptWriterFence as r, withOwnedSessionTranscriptWrites as s, SessionTranscriptWriterClaimReboundError as t };
