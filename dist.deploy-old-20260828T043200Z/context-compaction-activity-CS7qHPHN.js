import { r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
import { t as log } from "./logger-ZAfp-Df-.js";
import { a as publishSessionTranscriptUpdateByIdentity, n as appendSessionTranscriptMessageByIdentity } from "./session-transcript-runtime-C9OhVQD-.js";
import "./agent-harness-runtime-DIZXsF4g.js";
//#region extensions/codex/src/app-server/context-compaction-activity.ts
const CONTEXT_COMPACTION_CUSTOM_TYPE = "openclaw.context-compaction";
async function persistCodexContextCompactionActivity(params) {
	const target = params.sessionTarget;
	if (!target?.sessionId || !target.sessionKey || !target.storePath) return;
	const activityId = `codex-context-compaction:${params.threadId}:${params.turnId}:${params.itemId}`;
	const message = {
		role: "custom",
		customType: CONTEXT_COMPACTION_CUSTOM_TYPE,
		content: "Context compacted",
		display: true,
		excludeFromContext: true,
		details: {
			kind: "context_compaction",
			backend: "codex-app-server",
			threadId: params.threadId,
			turnId: params.turnId,
			itemId: params.itemId,
			...params.runId ? { runId: params.runId } : {}
		},
		...params.runId ? { __openclaw: { runId: params.runId } } : {},
		timestamp: params.timestamp,
		idempotencyKey: activityId
	};
	try {
		const appended = await appendSessionTranscriptMessageByIdentity({
			agentId: target.agentId,
			sessionId: target.sessionId,
			sessionKey: target.sessionKey,
			storePath: target.storePath,
			config: params.config,
			cwd: params.cwd,
			eventId: activityId,
			message
		});
		if (!appended?.appended) return;
		await publishSessionTranscriptUpdateByIdentity({
			agentId: target.agentId,
			sessionId: target.sessionId,
			sessionKey: target.sessionKey,
			storePath: target.storePath,
			update: {
				message: appended.message,
				messageId: appended.messageId,
				...params.runId ? { runId: params.runId } : {}
			}
		});
	} catch (error) {
		log.warn("failed to persist codex context compaction activity", {
			error: formatErrorMessage(error),
			itemId: params.itemId
		});
	}
}
//#endregion
export { persistCodexContextCompactionActivity as t };
