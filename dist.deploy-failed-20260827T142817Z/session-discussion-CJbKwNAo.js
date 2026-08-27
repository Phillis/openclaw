import { t as ErrorCodes } from "./gateway-error-details-BWo6Le6w.js";
import { i as resolveStoredSessionKeyForAgentStore } from "./session-store-key-CoZdm5gl.js";
import { ir as validateSessionDiscussionOpenResult, nr as validateSessionDiscussionInfoResult, rr as validateSessionDiscussionOpenParams, tr as validateSessionDiscussionInfoParams } from "./src-Bo4ezI_n.js";
import { l as formatValidationErrors, s as errorShape } from "./error-codes-CMSvT5-d.js";
import { t as resolveRequestedSessionAgentId } from "./session-request-agent-BeVvXvOY.js";
import { t as formatForLog } from "./ws-log-DAJ6wT2O.js";
import { t as getSessionDiscussionProvider } from "./session-discussion-registry-CvNFuWAx.js";
import { n as emitSessionsChanged } from "./session-change-event-BanWv5Vf.js";
import { t as assertValidParams } from "./validation-CsGeElrb.js";
import { a as maybeGenerateSessionTitle, n as hasExplicitSessionName } from "./dashboard-session-title-COLl4QjV.js";
import { a as loadAccessorSessionEntryForGatewayTarget } from "./sessions-shared-DhClIVMH.js";
//#region src/gateway/server-methods/session-discussion.ts
const DISCUSSION_TITLE_TIMEOUT_MS = 1e4;
async function maybeGenerateTitleBeforeDiscussionOpen(params) {
	try {
		const cfg = params.context.getRuntimeConfig();
		const resolved = loadAccessorSessionEntryForGatewayTarget({
			cfg,
			key: params.sessionKey,
			agentId: params.agentId
		});
		const { entry } = resolved;
		const sessionId = entry?.sessionId;
		if (!entry || !sessionId || hasExplicitSessionName(entry)) return;
		const observedTitleRequest = maybeGenerateSessionTitle({
			cfg,
			agentId: resolved.target.agentId,
			entry,
			sessionId,
			sessionKey: resolved.canonicalKey,
			storePath: resolved.storePath,
			userMessage: ""
		}).then(async (attempt) => {
			if (attempt.kind === "in-flight") {
				await attempt.settled.catch(() => {});
				return false;
			}
			return attempt.kind === "persisted";
		}).catch((error) => {
			params.context.logGateway.warn(`dashboard session title generation failed: ${formatForLog(error)}`);
			return false;
		});
		let timeout;
		let persisted = false;
		try {
			persisted = await Promise.race([observedTitleRequest, new Promise((resolve) => {
				timeout = setTimeout(() => resolve(false), DISCUSSION_TITLE_TIMEOUT_MS);
				timeout.unref?.();
			})]);
		} finally {
			if (timeout) clearTimeout(timeout);
		}
		if (persisted) emitSessionsChanged(params.context, {
			sessionKey: resolved.canonicalKey,
			agentId: resolved.target.agentId,
			reason: "chat.title"
		});
	} catch (error) {
		params.context.logGateway.warn(`dashboard session title generation failed: ${formatForLog(error)}`);
	}
}
const sessionDiscussionHandlers = {
	"session.discussion.info": async ({ params, respond, context }) => {
		if (!assertValidParams(params, validateSessionDiscussionInfoParams, "session.discussion.info", respond)) return;
		const requestedAgent = resolveRequestedSessionAgentId(context.getRuntimeConfig(), params.sessionKey, params.agentId);
		if (!requestedAgent.ok) {
			respond(false, void 0, requestedAgent.error);
			return;
		}
		const provider = getSessionDiscussionProvider();
		if (!provider) {
			respond(true, { state: "none" }, void 0);
			return;
		}
		try {
			const sessionKey = resolveStoredSessionKeyForAgentStore({
				cfg: context.getRuntimeConfig(),
				agentId: requestedAgent.agentId,
				sessionKey: params.sessionKey
			});
			const result = await provider.info({
				sessionKey,
				agentId: requestedAgent.agentId
			});
			if (!validateSessionDiscussionInfoResult(result)) {
				respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, `invalid session.discussion.info result: ${formatValidationErrors(validateSessionDiscussionInfoResult.errors)}`));
				return;
			}
			respond(true, result, void 0);
		} catch (error) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, error instanceof Error ? error.message : "session discussion provider failed"));
		}
	},
	"session.discussion.open": async ({ params, respond, context }) => {
		if (!assertValidParams(params, validateSessionDiscussionOpenParams, "session.discussion.open", respond)) return;
		const requestedAgent = resolveRequestedSessionAgentId(context.getRuntimeConfig(), params.sessionKey, params.agentId);
		if (!requestedAgent.ok) {
			respond(false, void 0, requestedAgent.error);
			return;
		}
		const provider = getSessionDiscussionProvider();
		if (!provider) {
			respond(true, { state: "none" }, void 0);
			return;
		}
		try {
			await maybeGenerateTitleBeforeDiscussionOpen({
				context,
				sessionKey: params.sessionKey,
				agentId: requestedAgent.agentId
			});
			const sessionKey = resolveStoredSessionKeyForAgentStore({
				cfg: context.getRuntimeConfig(),
				agentId: requestedAgent.agentId,
				sessionKey: params.sessionKey
			});
			const result = await provider.open({
				sessionKey,
				agentId: requestedAgent.agentId
			});
			if (!validateSessionDiscussionOpenResult(result)) {
				respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, `invalid session.discussion.open result: ${formatValidationErrors(validateSessionDiscussionOpenResult.errors)}`));
				return;
			}
			respond(true, result, void 0);
		} catch (error) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, error instanceof Error ? error.message : "session discussion provider failed"));
		}
	}
};
//#endregion
export { sessionDiscussionHandlers };
