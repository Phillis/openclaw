import { t as KeyedAsyncQueue } from "./keyed-async-queue-CTreGrmR.js";
import { J as releaseCodexAppServerLiveThread, K as isCodexAppServerLiveThreadClaimed, Y as retainCodexAppServerLiveThread, m as retainSharedCodexAppServerClientByInstanceId } from "./shared-client-fWU6PNZb.js";
import { a as closeCodexStartupClientBestEffort, d as unsubscribeCodexThreadBestEffort, r as CodexAppServerUnsafeSubscriptionError } from "./attempt-client-cleanup-Bh556tF7.js";
//#region extensions/codex/src/app-server/thread-ownership.ts
const nativeThreadOwners = new KeyedAsyncQueue();
/** Codex subscriptions belong to a physical connection, not the native thread ID alone. */
function isSameCodexAppServerThreadOwner(current, expected) {
	return current !== void 0 && expected !== void 0 && current.threadId === expected.threadId && current.clientId === expected.clientId;
}
/** Fences native subscription and commit together; Codex subscriptions are not reference-counted. */
async function withExclusiveCodexAppServerThread(params) {
	return await nativeThreadOwners.enqueue(`thread:${params.threadId}`, async () => {
		if (await params.bindingStore.hasOtherThreadOwner(params.threadId, params.identity)) throw new Error(`Codex thread ${params.threadId} is owned by another OpenClaw session or conversation.`);
		return await params.run();
	});
}
/** Serializes bound turns and retirement so detach cannot unsubscribe an active turn. */
async function withCodexConversationThreadActivity(bindingId, run) {
	return await nativeThreadOwners.enqueue(`conversation:${bindingId}`, run);
}
/** Publishes one owned persistent subscription into the shared bounded idle registry. */
async function retainCodexAppServerBindingSubscription(client, threadId, ownership) {
	return await retainCodexAppServerLiveThread(client, threadId, ownership?.release ?? (async (releasedThreadId) => {
		if (!await unsubscribeCodexThreadBestEffort(client, {
			threadId: releasedThreadId,
			timeoutMs: 5e3
		})) {
			await closeCodexStartupClientBestEffort(client);
			throw new CodexAppServerUnsafeSubscriptionError(`Codex thread subscription could not be released: ${releasedThreadId}`);
		}
	}), ownership?.configFingerprint, ownership?.serviceTier);
}
/** Rolls back the exact subscription Codex created before its binding was committed. */
async function rollbackCodexAppServerBindingSubscription(client, threadId, retained) {
	if (retained && await releaseCodexAppServerLiveThread(client, threadId)) return;
	if (isCodexAppServerLiveThreadClaimed(client, threadId)) return;
	if (!await unsubscribeCodexThreadBestEffort(client, {
		threadId,
		timeoutMs: 5e3
	})) await closeCodexStartupClientBestEffort(client);
}
/** Releases only the physical client and native thread recorded by the displaced binding owner. */
async function releaseCodexAppServerBindingSubscription(binding, options = {}) {
	const clientLease = retainSharedCodexAppServerClientByInstanceId(binding.clientId);
	if (!clientLease) return;
	try {
		if (await releaseCodexAppServerLiveThread(clientLease.client, binding.threadId)) return;
		if (isCodexAppServerLiveThreadClaimed(clientLease.client, binding.threadId)) throw new Error(`Codex thread ${binding.threadId} has an active run; stop it before changing its owner.`);
		if (!options.allowUntracked) return;
		if (!await unsubscribeCodexThreadBestEffort(clientLease.client, {
			threadId: binding.threadId,
			timeoutMs: 5e3
		})) {
			await closeCodexStartupClientBestEffort(clientLease.client);
			throw new CodexAppServerUnsafeSubscriptionError(`Codex retired thread subscription could not be released: ${binding.threadId}`);
		}
	} finally {
		clientLease.release();
	}
}
/** Clears and releases one exact conversation generation without touching its replacement. */
async function retireCodexConversationThreadBinding(params) {
	const expected = await params.bindingStore.read(params.identity);
	if (!expected || params.expectedThreadId && expected.threadId !== params.expectedThreadId) return false;
	return await params.bindingStore.withLease(params.identity, async () => {
		const current = await params.bindingStore.read(params.identity);
		if (current?.threadId !== expected.threadId || params.expectedStartId && current.conversationStartId !== params.expectedStartId) return false;
		await releaseCodexAppServerBindingSubscription(current, { allowUntracked: params.allowUntracked });
		const cleared = await params.bindingStore.mutate(params.identity, {
			kind: "clear",
			threadId: current.threadId
		});
		if (!cleared || !params.afterClear) return cleared;
		try {
			await params.afterClear();
			return true;
		} catch (error) {
			try {
				if (!await params.bindingStore.mutate(params.identity, {
					kind: "set",
					binding: current,
					if: { kind: "absent" }
				})) throw new Error("the previous Codex binding generation could not be restored", { cause: error });
			} catch (restorationError) {
				throw new AggregateError([error, restorationError], `Codex conversation detachment failed and native thread ${current.threadId} could not be restored; run /codex resume ${current.threadId} to recover it`, { cause: restorationError });
			}
			throw error;
		}
	});
}
//#endregion
export { rollbackCodexAppServerBindingSubscription as a, retireCodexConversationThreadBinding as i, releaseCodexAppServerBindingSubscription as n, withCodexConversationThreadActivity as o, retainCodexAppServerBindingSubscription as r, withExclusiveCodexAppServerThread as s, isSameCodexAppServerThreadOwner as t };
