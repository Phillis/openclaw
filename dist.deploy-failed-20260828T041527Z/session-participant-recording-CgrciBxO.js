import { X as recordSessionParticipant } from "./session-accessor-fcDZuc2H.js";
//#region src/sessions/session-participant-recording.ts
/** Defers participant history persistence so it can never delay or abort an admitted turn. */
function recordSessionParticipantBestEffort(params) {
	queueMicrotask(() => {
		try {
			recordSessionParticipant({
				agentId: params.agentId,
				sessionKey: params.sessionKey,
				storePath: params.storePath
			}, {
				actor: params.actor,
				promptedAt: params.promptedAt,
				sessionAgentId: params.agentId,
				source: params.source
			});
		} catch (error) {
			params.onError?.(error);
		}
	});
}
//#endregion
export { recordSessionParticipantBestEffort as t };
