import { t as ErrorCodes } from "./gateway-error-details-BWo6Le6w.js";
import { i as resolveStoredSessionKeyForAgentStore } from "./session-store-key-CoZdm5gl.js";
import { Bn as validateQuestionListParams, Hn as validateQuestionResolveParams, Un as validateQuestionWaitAnswerParams, Vn as validateQuestionRequestParams, zn as validateQuestionGetParams } from "./src-Bo4ezI_n.js";
import { l as formatValidationErrors, s as errorShape } from "./error-codes-CMSvT5-d.js";
import { t as resolveRequestedSessionAgentId } from "./session-request-agent-BeVvXvOY.js";
import { n as handleQuestionChannelResolved, t as handleQuestionChannelRequested } from "./question-channel-runtime-D0uwfjFt.js";
import { n as QuestionManagerError, r as QuestionManagerErrorCodes } from "./question-manager-DqQa8y-S.js";
//#region src/gateway/server-methods/question.ts
const DEFAULT_QUESTION_TIMEOUT_MS = 900 * 1e3;
var QuestionRequestValidationError = class extends Error {};
function validationError(method, errors, respond) {
	respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `invalid ${method} params: ${formatValidationErrors(errors)}`));
}
function managerError(error, respond) {
	if (!(error instanceof QuestionManagerError)) return false;
	respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, error.message, { details: { reason: error.code } }));
	return true;
}
function normalizeQuestions(params) {
	const ids = /* @__PURE__ */ new Set();
	return params.questions.map((question) => {
		if (ids.has(question.questionId)) throw new QuestionRequestValidationError(`duplicate question id '${question.questionId}'`);
		ids.add(question.questionId);
		if (question.options.length === 1) throw new QuestionRequestValidationError(`question '${question.questionId}' must have either no options or 2 to 4 options`);
		if (question.isSecret) throw new QuestionRequestValidationError(`question '${question.questionId}': secret questions are not supported yet`);
		const optionLabels = /* @__PURE__ */ new Set();
		for (const option of question.options) {
			const normalizedLabel = option.label.trim().toLowerCase();
			if (optionLabels.has(normalizedLabel)) throw new QuestionRequestValidationError(`question '${question.questionId}' has duplicate option label '${option.label}'`);
			optionLabels.add(normalizedLabel);
		}
		return question;
	});
}
/** Creates the lazily loaded question RPC surface for one Gateway lifetime. */
function createQuestionHandlers(manager) {
	return {
		"question.request": ({ params, respond, context }) => {
			if (!validateQuestionRequestParams(params)) {
				validationError("question.request", validateQuestionRequestParams.errors, respond);
				return;
			}
			const request = params;
			try {
				const requestedSession = request.sessionKey ? resolveRequestedSessionAgentId(context.getRuntimeConfig(), request.sessionKey, request.agentId) : void 0;
				if (requestedSession && !requestedSession.ok) {
					respond(false, void 0, requestedSession.error);
					return;
				}
				const sessionKey = request.sessionKey && requestedSession?.ok ? resolveStoredSessionKeyForAgentStore({
					cfg: context.getRuntimeConfig(),
					agentId: requestedSession.agentId,
					sessionKey: request.sessionKey
				}) : void 0;
				const record = manager.request({
					...request.id ? { id: request.id } : {},
					questions: normalizeQuestions(request),
					...requestedSession?.ok ? { agentId: requestedSession.agentId } : request.agentId ? { agentId: request.agentId } : {},
					...sessionKey ? { sessionKey } : {},
					...request.runId ? { runId: request.runId } : {},
					timeoutMs: request.timeoutMs ?? DEFAULT_QUESTION_TIMEOUT_MS,
					onResolved: (event) => {
						handleQuestionChannelResolved(event);
						context.broadcast("question.resolved", event);
					}
				});
				handleQuestionChannelRequested(record);
				context.broadcast("question.requested", record);
				respond(true, {
					id: record.id,
					expiresAtMs: record.expiresAtMs
				}, void 0);
			} catch (error) {
				if (error instanceof QuestionRequestValidationError) {
					respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, error.message));
					return;
				}
				if (!managerError(error, respond)) throw error;
			}
		},
		"question.waitAnswer": async ({ params, respond }) => {
			if (!validateQuestionWaitAnswerParams(params)) {
				validationError("question.waitAnswer", validateQuestionWaitAnswerParams.errors, respond);
				return;
			}
			const request = params;
			try {
				respond(true, await manager.waitAnswer(request.id, request.timeoutMs), void 0);
			} catch (error) {
				if (!managerError(error, respond)) throw error;
			}
		},
		"question.resolve": ({ params, respond }) => {
			if (!validateQuestionResolveParams(params)) {
				validationError("question.resolve", validateQuestionResolveParams.errors, respond);
				return;
			}
			const request = params;
			try {
				respond(true, "cancel" in request ? manager.cancel(request.id, request.resolvedBy) : manager.resolve(request.id, request.answers, request.resolvedBy), void 0);
			} catch (error) {
				if (!managerError(error, respond)) throw error;
			}
		},
		"question.get": ({ params, respond }) => {
			if (!validateQuestionGetParams(params)) {
				validationError("question.get", validateQuestionGetParams.errors, respond);
				return;
			}
			const id = params.id;
			const question = manager.get(id);
			if (!question) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `question '${id}' was not found`, { details: { reason: QuestionManagerErrorCodes.NOT_FOUND } }));
				return;
			}
			respond(true, { question }, void 0);
		},
		"question.list": ({ params, respond }) => {
			if (!validateQuestionListParams(params)) {
				validationError("question.list", validateQuestionListParams.errors, respond);
				return;
			}
			respond(true, { questions: manager.list() }, void 0);
		}
	};
}
//#endregion
export { createQuestionHandlers };
