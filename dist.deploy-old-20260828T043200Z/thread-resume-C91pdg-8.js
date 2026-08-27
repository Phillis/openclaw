import { J as isCodexAppServerPrewriteRequestCancellationError, N as isCodexAppServerStartupError, Q as CodexAppServerRpcError, q as isCodexAppServerOverloadError, u as isCodexAppServerStartSelectionChangedError } from "./shared-client-Cp-LIPgq.js";
import { d as unsubscribeCodexThreadBestEffort, i as assertCodexThreadResumeSubscription, r as CodexAppServerUnsafeSubscriptionError } from "./attempt-client-cleanup-DqoQNIj5.js";
import { o as assertCodexThreadResumeResponse } from "./protocol-validators-CpTKO3aJ.js";
import { t as CodexAppServerScopedRequestRejectedError } from "./request-rX38wt30.js";
//#region extensions/codex/src/app-server/thread-resume.ts
/** Owns Codex thread/resume subscription safety. */
/** Resumes one thread, releasing or isolating every possible native subscription. */
async function resumeCodexAppServerThread(params) {
	const threadId = params.request.threadId;
	let response;
	try {
		response = assertCodexThreadResumeResponse(await (params.requestResume ? params.requestResume(params.request) : params.client.request("thread/resume", params.request, {
			...params.timeoutMs !== void 0 ? { timeoutMs: params.timeoutMs } : {},
			...params.signal ? { signal: params.signal } : {},
			assertCurrent: params.assertCurrent
		})));
		assertCodexThreadResumeSubscription(threadId, response.thread.id);
	} catch (error) {
		if (params.isPrewriteOwnershipError?.(error) || isCodexAppServerStartSelectionChangedError(error) || isCodexAppServerStartupError(error) || error instanceof CodexAppServerScopedRequestRejectedError || isCodexAppServerPrewriteRequestCancellationError(error) || isCodexAppServerOverloadError(error)) throw error;
		if (error instanceof CodexAppServerRpcError) {
			if (await unsubscribeCodexThreadBestEffort(params.client, {
				threadId,
				timeoutMs: 5e3,
				assertCurrent: params.assertCurrent
			}).catch(() => false)) {
				params.onSubscriptionReleased?.();
				throw error;
			}
		}
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
