import { L as isCodexAppServerPrewriteRequestCancellationError, V as CodexAppServerRpcError, l as isCodexAppServerStartSelectionChangedError } from "./shared-client-CueuLl3e.js";
import { i as assertCodexThreadResumeSubscription, r as CodexAppServerUnsafeSubscriptionError } from "./attempt-client-cleanup-gqxRxZ3G.js";
import { i as assertCodexThreadResumeResponse } from "./protocol-validators-DQMpwHD0.js";
//#region extensions/codex/src/app-server/thread-resume.ts
/** Owns Codex thread/resume subscription safety. */
/** Resumes one thread and retires the physical client when acceptance is indeterminate. */
async function resumeCodexAppServerThread(params) {
	const threadId = params.request.threadId;
	let response;
	try {
		response = assertCodexThreadResumeResponse(await params.client.request("thread/resume", params.request, {
			...params.timeoutMs !== void 0 ? { timeoutMs: params.timeoutMs } : {},
			...params.signal ? { signal: params.signal } : {}
		}));
		assertCodexThreadResumeSubscription(threadId, response.thread.id);
	} catch (error) {
		if (isCodexAppServerStartSelectionChangedError(error) || isCodexAppServerPrewriteRequestCancellationError(error)) throw error;
		if (error instanceof CodexAppServerRpcError) throw error;
		try {
			await params.abandonClient();
		} catch (abandonError) {
			throw new CodexAppServerUnsafeSubscriptionError(`Codex thread/resume client could not be retired for ${threadId}`, { cause: abandonError });
		}
		if (error instanceof CodexAppServerUnsafeSubscriptionError) throw error;
		throw new CodexAppServerUnsafeSubscriptionError(error instanceof Error ? error.message : `Codex thread/resume outcome is indeterminate for ${threadId}`, { cause: error });
	}
	return response;
}
//#endregion
export { resumeCodexAppServerThread as t };
