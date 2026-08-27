import { m as selectAgentSystemEvents, t as consumeSelectedSystemEventEntries, u as peekSystemEventEntries } from "./system-events-BVZAS_Ok.js";
import { r as clearReplyRunForResetBySessionId } from "./reply-run-registry-Ch9Ye6re.js";
import { t as clearEmbeddedSessionPromptStates } from "./session-prompt-state-CJQDP6Z0.js";
import { t as clearSessionQueues } from "./cleanup-BNML21Fq.js";
//#region src/auto-reply/reply/session-reset-cleanup.ts
/** Clears reset-related queues and system events for session keys. */
/** Clears queued follow-ups and pending system events visible to the resetting agent. */
function clearSessionResetRuntimeState(keys, opts) {
	clearEmbeddedSessionPromptStates(keys);
	const cleared = clearSessionQueues(keys);
	let systemEventsCleared = 0;
	for (const key of cleared.keys) {
		const removed = consumeSelectedSystemEventEntries(key, selectAgentSystemEvents(peekSystemEventEntries(key), opts.agentId));
		systemEventsCleared += removed.length;
	}
	if (opts.activeReplySessionId) clearReplyRunForResetBySessionId(opts.activeReplySessionId);
	return {
		...cleared,
		systemEventsCleared
	};
}
//#endregion
export { clearSessionResetRuntimeState as t };
