import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { N as runWithSessionTranscriptReadFence, j as SessionTranscriptReadFenceError } from "./session-accessor.sqlite-transcript-store-DmssQj1u.js";
import { a as publishSessionTranscriptUpdateByIdentity, d as resolveSessionTranscriptIdentity, m as withProjectedSessionTranscriptWriteLock, s as readSessionTranscriptEvents } from "./session-transcript-runtime-DS57FWaj.js";
//#region src/plugin-sdk/codex-session-transcript-runtime.ts
/** Reads the bundled Codex mirror strictly before one admitted user row. */
async function readCodexSessionTranscriptEventsBeforeAdmission(params, admission) {
	const target = await resolveSessionTranscriptIdentity(params);
	if (target.agentId !== admission.agentId || target.sessionId !== admission.sessionId || target.sessionKey !== admission.sessionKey) throw new SessionTranscriptReadFenceError("Current-turn transcript admission belongs to a different transcript target");
	return await runWithSessionTranscriptReadFence(admission, async () => await readSessionTranscriptEvents(params));
}
/** Runs the bundled Codex mirror under the transcript writer lock. */
async function withCodexSessionTranscriptMirrorWriteLock(params, run) {
	return await withProjectedSessionTranscriptWriteLock(params, run, (context, locked) => ({
		...context,
		appendMessageWithMessageSequence: (options) => locked.appendMessageWithMessageSequence({
			...options,
			...params.config !== void 0 ? { config: params.config } : {}
		}),
		readMessageFacts: async (factParams) => {
			const facts = await locked.readMessageFacts(factParams);
			const messagesByIdempotencyKey = /* @__PURE__ */ new Map();
			for (const [idempotencyKey, message] of facts.messagesByIdempotencyKey) if (isAgentMessageRecord(message)) messagesByIdempotencyKey.set(idempotencyKey, message);
			return {
				...facts,
				messagesByIdempotencyKey
			};
		}
	}), publishSessionTranscriptUpdateByIdentity);
}
function isAgentMessageRecord(value) {
	return isRecord(value) && typeof value.role === "string" && value.role.trim().length > 0;
}
//#endregion
export { withCodexSessionTranscriptMirrorWriteLock as n, readCodexSessionTranscriptEventsBeforeAdmission as t };
