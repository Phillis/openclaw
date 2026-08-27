import { n as ENV_SECRET_REF_ID_RE } from "./types.secrets-Bre8L6Ts.js";
import { i as registerSecretValueForRedaction } from "./secret-redaction-registry-gIFE-2_j.js";
import { s as getAgentRunContext } from "./agent-run-registry-t4kvUyNQ.js";
import { g as SecretStoreValidationError, i as listSecretStoreEntries } from "./secret-store-CxIqAOaM.js";
import { t as ErrorCodes } from "./gateway-error-details-C2IaYyht.js";
import { Gn as validateQuestionRequestParams, Kn as validateQuestionResolveParams, Un as validateQuestionGetParams, Wn as validateQuestionListParams, qn as validateQuestionWaitAnswerParams } from "./src-4dv5TpeQ.js";
import { i as resolveStoredSessionKeyForAgentStore } from "./session-store-key-DRF7yKG5.js";
import { d as errorShape, t as formatValidationErrors } from "./validation-errors-rELRlKfn.js";
import { n as resolveRequestedSessionAgentId } from "./session-request-agent-C9E8iDY4.js";
import { n as handleQuestionChannelResolved, t as handleQuestionChannelRequested } from "./question-channel-runtime-Ck_NSQzo.js";
import { n as hasOperatorBoundary } from "./operator-role-policy-Bvt-UeJ1.js";
import { a as authorizeSessionSharing, d as isGatewayAdmin, g as resolveSessionSharingTarget, o as authorizeSessionSharingTarget, u as createSessionListEntryFilter } from "./session-sharing-C4OmHGYo.js";
import { n as QuestionManagerError, r as QuestionManagerErrorCodes } from "./question-manager-DAwr3A8G.js";
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
function questionNotFound(id) {
	return errorShape(ErrorCodes.INVALID_REQUEST, `question '${id}' was not found`, { details: { reason: QuestionManagerErrorCodes.NOT_FOUND } });
}
function authorizeQuestionRecord(params) {
	if (isGatewayAdmin(params.client) || !hasOperatorBoundary(params.client, params.cfg) || !params.question.sessionKey) return null;
	const target = resolveSessionSharingTarget({
		cfg: params.cfg,
		sessionKey: params.question.sessionKey,
		agentId: params.question.agentId
	});
	const canSeeSession = target && (createSessionListEntryFilter({
		cfg: params.cfg,
		client: params.client
	})?.(target.canonicalKey, target.entry) ?? true);
	if (!target || !canSeeSession) return questionNotFound(params.question.id);
	return params.access === "mutate" ? authorizeSessionSharingTarget({
		cfg: params.cfg,
		client: params.client,
		target
	}) : null;
}
function normalizeQuestions(params) {
	const ids = /* @__PURE__ */ new Set();
	return params.questions.map((question) => {
		if (ids.has(question.questionId)) throw new QuestionRequestValidationError(`duplicate question id '${question.questionId}'`);
		ids.add(question.questionId);
		if (question.options.length === 1) throw new QuestionRequestValidationError(`question '${question.questionId}' must have either no options or 2 to 4 options`);
		const binding = question.secretStore;
		if (question.isSecret && !binding) throw new QuestionRequestValidationError(`question '${question.questionId}': secret questions are not supported yet`);
		if (binding) {
			if (!question.isSecret) throw new QuestionRequestValidationError(`question '${question.questionId}': secret store binding requires a secret question`);
			if (params.questions.length !== 1 || question.options.length !== 0 || question.multiSelect) throw new QuestionRequestValidationError(`question '${question.questionId}': secret store requests require one free-text, single-select question`);
			if (!ENV_SECRET_REF_ID_RE.test(binding.name)) throw new QuestionRequestValidationError(`question '${question.questionId}': invalid secret store entry name`);
			if (binding.kind !== "secret" && binding.kind !== "env") throw new QuestionRequestValidationError(`question '${question.questionId}': invalid secret store entry kind`);
			if ((binding.allowedHosts?.length ?? 0) > 128) throw new QuestionRequestValidationError(`question '${question.questionId}': secret store allowed hosts exceed the limit`);
			if (binding.kind === "env" && binding.allowedHosts !== void 0) throw new QuestionRequestValidationError("Allowed hosts apply only to secret entries.");
			const existing = listSecretStoreEntries({ scope: { kind: "team" } }).find((entry) => entry.name === binding.name);
			if (existing) return {
				...question,
				secretStoreExisting: {
					updatedAtMs: existing.updatedAtMs,
					...existing.updatedBy ? { updatedBy: existing.updatedBy } : {}
				}
			};
		}
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
function createQuestionHandlers(manager, storeWriteService) {
	return {
		"question.request": ({ params, respond, context, client }) => {
			if (!validateQuestionRequestParams(params)) {
				validationError("question.request", validateQuestionRequestParams.errors, respond);
				return;
			}
			const request = params;
			if (request.questions.some((question) => question.secretStore) && !request.runId) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "secret store questions must carry the requesting runId"));
				return;
			}
			if (request.questions.some((question) => question.secretStore) && !isGatewayAdmin(client)) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "secret store questions require an operator.admin client"));
				return;
			}
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
				if (sessionKey && hasOperatorBoundary(client, context.getRuntimeConfig())) {
					const authorizationError = authorizeSessionSharing({
						cfg: context.getRuntimeConfig(),
						client,
						sessionKey,
						agentId: requestedSession?.ok ? requestedSession.agentId : void 0
					});
					if (authorizationError) {
						respond(false, void 0, authorizationError);
						return;
					}
				}
				const record = manager.request({
					...request.id ? { id: request.id } : {},
					questions: normalizeQuestions(request),
					...requestedSession?.ok ? { agentId: requestedSession.agentId } : request.agentId ? { agentId: request.agentId } : {},
					...sessionKey ? { sessionKey } : {},
					...request.runId ? { runId: request.runId } : {},
					timeoutMs: request.timeoutMs ?? DEFAULT_QUESTION_TIMEOUT_MS,
					onResolved: (event) => {
						handleQuestionChannelResolved(event);
						if (sessionKey && context.getRuntimeConfig().gateway?.roles) context.broadcast("question.resolved", event, {
							sessionKeys: [sessionKey],
							...requestedSession?.ok ? { agentId: requestedSession.agentId } : {}
						});
						else context.broadcast("question.resolved", event);
					}
				});
				handleQuestionChannelRequested(record);
				if (sessionKey && context.getRuntimeConfig().gateway?.roles) context.broadcast("question.requested", record, {
					sessionKeys: [sessionKey],
					...requestedSession?.ok ? { agentId: requestedSession.agentId } : {}
				});
				else context.broadcast("question.requested", record);
				respond(true, {
					id: record.id,
					expiresAtMs: record.expiresAtMs
				}, void 0);
			} catch (error) {
				if (error instanceof QuestionRequestValidationError) {
					respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, error.message));
					return;
				}
				if (!managerError(error, respond)) {
					if (request.questions.some((question) => question.secretStore)) {
						respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "Secret store entry metadata is unavailable."));
						return;
					}
					throw error;
				}
			}
		},
		"question.waitAnswer": async ({ params, respond, client, context }) => {
			if (!validateQuestionWaitAnswerParams(params)) {
				validationError("question.waitAnswer", validateQuestionWaitAnswerParams.errors, respond);
				return;
			}
			const request = params;
			try {
				const question = manager.get(request.id);
				if (question) {
					const authorizationError = authorizeQuestionRecord({
						cfg: context.getRuntimeConfig(),
						client,
						question,
						access: "read"
					});
					if (authorizationError) {
						respond(false, void 0, authorizationError);
						return;
					}
				}
				const answer = await manager.waitAnswer(request.id, request.timeoutMs);
				const resolvedQuestion = manager.get(request.id);
				if (resolvedQuestion) {
					const authorizationError = authorizeQuestionRecord({
						cfg: context.getRuntimeConfig(),
						client,
						question: resolvedQuestion,
						access: "read"
					});
					if (authorizationError) {
						respond(false, void 0, authorizationError);
						return;
					}
				}
				respond(true, answer, void 0);
			} catch (error) {
				if (!managerError(error, respond)) throw error;
			}
		},
		"question.resolve": async ({ params, respond, client, context }) => {
			if (!validateQuestionResolveParams(params)) {
				validationError("question.resolve", validateQuestionResolveParams.errors, respond);
				return;
			}
			const request = params;
			try {
				const question = manager.get(request.id);
				if (question) {
					const authorizationError = authorizeQuestionRecord({
						cfg: context.getRuntimeConfig(),
						client,
						question,
						access: "mutate"
					});
					if (authorizationError) {
						respond(false, void 0, authorizationError);
						return;
					}
				}
				if ("cancel" in request) {
					respond(true, manager.cancel(request.id, request.resolvedBy), void 0);
					return;
				}
				const secretQuestion = question?.questions[0];
				const binding = secretQuestion?.secretStore;
				if (!binding || !question) {
					if (request.secretStoreAllowedHosts !== void 0) {
						respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "Secret store allowed hosts require a store-bound question."));
						return;
					}
					respond(true, manager.resolve(request.id, request.answers, request.resolvedBy), void 0);
					return;
				}
				if (question.status !== "pending") throw new QuestionManagerError(QuestionManagerErrorCodes.ALREADY_TERMINAL, `question '${request.id}' is already ${question.status}`);
				const submittedAnswers = request.answers.answers;
				const values = Object.hasOwn(submittedAnswers, secretQuestion.questionId) ? submittedAnswers[secretQuestion.questionId] : void 0;
				const value = values?.[0];
				if (Object.keys(submittedAnswers).length !== 1 || values?.length !== 1 || value === void 0) {
					respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `question '${secretQuestion.questionId}' requires exactly one secret value`));
					return;
				}
				registerSecretValueForRedaction(value);
				const allowedHosts = request.secretStoreAllowedHosts ?? binding.allowedHosts;
				if (binding.kind === "env" && allowedHosts !== void 0) {
					respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "Allowed hosts apply only to secret entries."));
					return;
				}
				if (!question.runId || !getAgentRunContext(question.runId)) {
					respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "the agent run that requested this credential is no longer active", { details: { reason: "QUESTION_REQUESTER_INACTIVE" } }));
					return;
				}
				try {
					await storeWriteService.write({
						name: binding.name,
						value,
						kind: binding.kind,
						...allowedHosts !== void 0 ? { allowedHosts } : {},
						updatedBy: storeWriteService.resolveUpdatedBy(client)
					});
				} catch (error) {
					respond(false, void 0, errorShape(error instanceof SecretStoreValidationError ? ErrorCodes.INVALID_REQUEST : ErrorCodes.UNAVAILABLE, error instanceof SecretStoreValidationError ? error.message : "Secret store entry could not be saved."));
					return;
				}
				respond(true, manager.resolve(request.id, { answers: { [secretQuestion.questionId]: ["stored"] } }, request.resolvedBy), void 0);
			} catch (error) {
				if (!managerError(error, respond)) throw error;
			}
		},
		"question.get": ({ params, respond, client, context }) => {
			if (!validateQuestionGetParams(params)) {
				validationError("question.get", validateQuestionGetParams.errors, respond);
				return;
			}
			const id = params.id;
			const question = manager.get(id);
			if (!question) {
				respond(false, void 0, questionNotFound(id));
				return;
			}
			const authorizationError = authorizeQuestionRecord({
				cfg: context.getRuntimeConfig(),
				client,
				question,
				access: "read"
			});
			if (authorizationError) {
				respond(false, void 0, authorizationError);
				return;
			}
			respond(true, { question }, void 0);
		},
		"question.list": ({ params, respond, client, context }) => {
			if (!validateQuestionListParams(params)) {
				validationError("question.list", validateQuestionListParams.errors, respond);
				return;
			}
			const cfg = context.getRuntimeConfig();
			respond(true, { questions: manager.list().filter((question) => !authorizeQuestionRecord({
				cfg,
				client,
				question,
				access: "read"
			})) }, void 0);
		}
	};
}
//#endregion
export { createQuestionHandlers };
