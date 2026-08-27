import { r as formatErrorMessage } from "./errors-CSNUPl5U.js";
import { n as normalizeAgentId } from "./agent-id-Db0rqw_J.js";
import { t as ErrorCodes } from "./gateway-error-details-BWo6Le6w.js";
import { ca as validateTaskSuggestionsCreateParams, la as validateTaskSuggestionsDismissParams, sa as validateTaskSuggestionsAcceptParams, ua as validateTaskSuggestionsListParams } from "./src-Bo4ezI_n.js";
import { l as formatValidationErrors, s as errorShape } from "./error-codes-CMSvT5-d.js";
import "./sessions-D-jhKYGW.js";
import { s as resolveSessionWorkStartError } from "./lifecycle-BOW0O5mU.js";
import { E as loadGatewaySessionEntryReadOnly } from "./session-utils-row-CB3Fore5.js";
import { i as insideGitCheckout } from "./git-DHuziQrS.js";
import { t as resolveRequestedSessionAgentId } from "./session-request-agent-BeVvXvOY.js";
import "./session-utils-DZT0oaJU.js";
import { i as resolveVisibleActiveSessionRunState } from "./session-active-runs-DKnYoEyq.js";
import { t as handleChatSend } from "./chat-send-handler-8-IJ9Sou.js";
import { n as listWorkerProfiles } from "./environments-BEBo9dmI.js";
import { t as buildDashboardSessionKey } from "./session-create-service-BZ4Qzo_v.js";
import { t as sessionCreateHandlers } from "./sessions-create-t3rYyMLf.js";
import { t as sessionDeleteHandlers } from "./sessions-delete-B8d74dIp.js";
import { t as sessionDispatchHandlers } from "./sessions-dispatch-RU6h7-PH.js";
import { randomUUID } from "node:crypto";
import path from "node:path";
//#region src/gateway/task-suggestion-registry.ts
const MAX_TASK_SUGGESTIONS = 100;
const MAX_TASK_SUGGESTION_RETAINED_BYTES = 2 * 1024 * 1024;
const suggestions = /* @__PURE__ */ new Map();
let retainedSuggestionBytes = 0;
function retainedBytesForSuggestion(suggestion) {
	return Buffer.byteLength(JSON.stringify(suggestion)) + 1;
}
function planTaskSuggestionEvictions(suggestionBytes) {
	let projectedCount = suggestions.size + 1;
	let projectedBytes = retainedSuggestionBytes + suggestionBytes + 1;
	const planned = [];
	for (const status of [
		"dismissed",
		"accepted",
		"pending"
	]) for (const [taskId, record] of suggestions) {
		if (projectedCount <= MAX_TASK_SUGGESTIONS && projectedBytes <= MAX_TASK_SUGGESTION_RETAINED_BYTES) return planned;
		if (record.status !== status) continue;
		planned.push([taskId, record]);
		projectedCount -= 1;
		projectedBytes -= retainedBytesForSuggestion(record.suggestion);
	}
	return projectedCount <= MAX_TASK_SUGGESTIONS && projectedBytes <= MAX_TASK_SUGGESTION_RETAINED_BYTES ? planned : null;
}
/** Records one suggestion without starting work. IDs intentionally vanish on restart. */
function createTaskSuggestion(params) {
	const suggestion = {
		id: `task_${randomUUID()}`,
		title: params.title.trim(),
		prompt: params.prompt.trim(),
		tldr: params.tldr.trim(),
		cwd: params.cwd,
		sessionKey: params.sessionKey,
		...params.agentId ? { agentId: params.agentId } : {},
		createdAt: Date.now()
	};
	const suggestionBytes = retainedBytesForSuggestion(suggestion);
	const plannedEvictions = planTaskSuggestionEvictions(suggestionBytes);
	if (!plannedEvictions) return { status: "full" };
	const evictedPendingTaskIds = [];
	for (const [taskId, record] of plannedEvictions) {
		retainedSuggestionBytes -= retainedBytesForSuggestion(record.suggestion);
		suggestions.delete(taskId);
		if (record.status === "pending") evictedPendingTaskIds.push(taskId);
	}
	suggestions.set(suggestion.id, {
		status: "pending",
		suggestion
	});
	retainedSuggestionBytes += suggestionBytes;
	return {
		status: "created",
		suggestion,
		evictedPendingTaskIds
	};
}
/** Lists newest suggestions first, optionally scoped to their source chat. */
function listTaskSuggestions(params) {
	return [...suggestions.values()].filter((record) => record.status === "pending").map((record) => record.suggestion).filter((suggestion) => (!params.sessionKey || suggestion.sessionKey === params.sessionKey) && (!params.agentId || suggestion.agentId === params.agentId)).toReversed();
}
/** Claims one suggestion before any privileged worktree/session side effects begin. */
function beginTaskSuggestionAcceptance(taskId) {
	const record = suggestions.get(taskId);
	if (!record) return { status: "missing" };
	if (record.status === "accepted") return {
		status: "accepted",
		sessionKey: record.sessionKey
	};
	if (record.status !== "pending") return { status: record.status };
	suggestions.set(taskId, {
		status: "accepting",
		suggestion: record.suggestion
	});
	return {
		status: "claimed",
		suggestion: record.suggestion
	};
}
/** Restores a claim when session creation fails before an acceptance result exists. */
function cancelTaskSuggestionAcceptance(taskId) {
	const record = suggestions.get(taskId);
	if (record?.status === "accepting") {
		suggestions.set(taskId, {
			status: "pending",
			suggestion: record.suggestion
		});
		return record.suggestion;
	}
}
/** Retires a claimed suggestion when partial side effects cannot be rolled back safely. */
function abandonTaskSuggestionAcceptance(taskId) {
	const record = suggestions.get(taskId);
	if (record?.status !== "accepting") return false;
	suggestions.set(taskId, {
		status: "dismissed",
		suggestion: record.suggestion
	});
	return true;
}
/** Retains the created session key so retries return the same accepted task. */
function completeTaskSuggestionAcceptance(taskId, sessionKey) {
	const record = suggestions.get(taskId);
	if (record?.status === "accepting") suggestions.set(taskId, {
		status: "accepted",
		suggestion: record.suggestion,
		sessionKey
	});
}
/** Dismisses only a pending suggestion; accepted or in-flight tasks stay immutable. */
function dismissTaskSuggestion(taskId) {
	const record = suggestions.get(taskId);
	if (record?.status !== "pending") return false;
	suggestions.set(taskId, {
		status: "dismissed",
		suggestion: record.suggestion
	});
	return true;
}
//#endregion
//#region src/gateway/server-methods/task-suggestions.ts
function invalidParams(method, errors) {
	return errorShape(ErrorCodes.INVALID_REQUEST, `invalid ${method} params: ${formatValidationErrors(errors)}`);
}
const activeAcceptances = /* @__PURE__ */ new Map();
function abandonSuggestedTaskAcceptance(taskId, options) {
	if (abandonTaskSuggestionAcceptance(taskId)) options.context.broadcast("task.suggestion", {
		action: "resolved",
		taskId,
		resolution: "expired"
	}, { dropIfSlow: true });
}
async function rollbackSuggestedTaskSession(params) {
	let deletionResponse;
	try {
		const deleteSession = sessionDeleteHandlers["sessions.delete"];
		if (!deleteSession) return false;
		await deleteSession({
			...params.options,
			params: {
				key: params.key,
				...params.agentId ? { agentId: params.agentId } : {},
				deleteTranscript: true,
				emitLifecycleHooks: false
			},
			respond: (ok, payload) => {
				if (!ok || !payload || typeof payload !== "object" || typeof payload.deleted !== "boolean") {
					deletionResponse = { ok: false };
					return;
				}
				deletionResponse = {
					ok: true,
					worktreePreserved: payload.worktreePreserved !== void 0
				};
			}
		});
	} catch {
		return false;
	}
	if (!deletionResponse?.ok || deletionResponse.worktreePreserved) return false;
	try {
		return !loadGatewaySessionEntryReadOnly(params.key, { agentId: params.agentId }).entry;
	} catch {
		return false;
	}
}
async function failSuggestedTaskSession(params) {
	if (await rollbackSuggestedTaskSession({
		key: params.sessionKey,
		agentId: params.agentId,
		options: params.options
	})) {
		const restored = cancelTaskSuggestionAcceptance(params.taskId);
		if (restored) params.options.context.broadcast("task.suggestion", {
			action: "created",
			suggestion: restored
		}, { dropIfSlow: true });
		return {
			ok: false,
			error: params.error
		};
	}
	abandonSuggestedTaskAcceptance(params.taskId, params.options);
	return {
		ok: false,
		error: errorShape(ErrorCodes.UNAVAILABLE, `${params.error.message}; failed to roll back the partial suggested task session`)
	};
}
function finishSuggestedTaskAcceptance(params) {
	completeTaskSuggestionAcceptance(params.taskId, params.sessionKey);
	params.options.context.broadcast("task.suggestion", {
		action: "resolved",
		taskId: params.taskId,
		resolution: "accepted"
	}, { dropIfSlow: true });
	return {
		ok: true,
		result: {
			taskId: params.taskId,
			key: params.sessionKey
		}
	};
}
function failSuggestedTaskDelivery(params) {
	const restored = cancelTaskSuggestionAcceptance(params.taskId);
	if (restored) params.options.context.broadcast("task.suggestion", {
		action: "created",
		suggestion: restored
	}, { dropIfSlow: true });
	return {
		ok: false,
		error: params.error
	};
}
function resolveSuggestionOwner(suggestion, options) {
	return resolveRequestedSessionAgentId(options.context.getRuntimeConfig(), suggestion.sessionKey, suggestion.agentId);
}
async function sendSuggestedTaskPrompt(params) {
	let response;
	const chatParams = {
		sessionKey: params.sessionKey,
		agentId: params.agentId,
		...params.sessionId ? { sessionId: params.sessionId } : {},
		message: params.suggestion.prompt,
		...params.activeRunId ? {
			queueMode: "steer",
			expectedRunId: params.activeRunId
		} : {},
		idempotencyKey: `task-suggestion:${params.taskId}`
	};
	await handleChatSend({
		...params.options,
		req: {
			...params.options.req,
			method: "chat.send",
			params: chatParams
		},
		params: chatParams,
		respond: (...args) => {
			response = args;
		}
	});
	return response;
}
async function createSuggestedTaskSession(params) {
	let sessionResponse;
	const sourceOwner = resolveSuggestionOwner(params.suggestion, params.options);
	if (!sourceOwner.ok) return {
		ok: false,
		error: sourceOwner.error
	};
	const agentId = normalizeAgentId(sourceOwner.agentId);
	const sessionKey = buildDashboardSessionKey(agentId);
	const fail = (key, error) => failSuggestedTaskSession({
		taskId: params.taskId,
		sessionKey: key,
		agentId,
		options: params.options,
		error
	});
	try {
		await sessionCreateHandlers["sessions.create"]?.({
			...params.options,
			params: {
				key: sessionKey,
				agentId,
				parentSessionKey: params.suggestion.sessionKey,
				label: params.suggestion.title,
				...params.mode === "cloud" ? {} : { task: params.suggestion.prompt },
				...params.mode === "local" ? {} : { worktree: true },
				cwd: params.suggestion.cwd
			},
			respond: (...args) => {
				sessionResponse = args;
			}
		});
	} catch (error) {
		return await fail(sessionKey, errorShape(ErrorCodes.UNAVAILABLE, formatErrorMessage(error)));
	}
	if (!sessionResponse) return await fail(sessionKey, errorShape(ErrorCodes.UNAVAILABLE, "sessions.create did not respond"));
	const [ok, payload, sessionError] = sessionResponse;
	if (!ok) return await fail(sessionKey, sessionError ?? errorShape(ErrorCodes.UNAVAILABLE, "failed to create suggested task"));
	const key = payload && typeof payload === "object" && typeof payload.key === "string" ? payload.key : void 0;
	if (!key) return await fail(sessionKey, errorShape(ErrorCodes.UNAVAILABLE, "sessions.create returned no session key"));
	if (params.mode === "cloud") {
		let dispatchResponse;
		try {
			await sessionDispatchHandlers["sessions.dispatch"]?.({
				...params.options,
				params: {
					key,
					agentId,
					profileId: params.cloudProfileId
				},
				respond: (...args) => {
					dispatchResponse = args;
				}
			});
		} catch (error) {
			return await fail(key, errorShape(ErrorCodes.UNAVAILABLE, formatErrorMessage(error)));
		}
		if (!dispatchResponse?.[0]) return await fail(key, dispatchResponse?.[2] ?? errorShape(ErrorCodes.UNAVAILABLE, dispatchResponse ? "failed to dispatch suggested task" : "sessions.dispatch did not respond"));
		let sendResponse;
		try {
			sendResponse = await sendSuggestedTaskPrompt({
				taskId: params.taskId,
				suggestion: params.suggestion,
				options: params.options,
				sessionKey: key,
				agentId
			});
		} catch (error) {
			return await fail(key, errorShape(ErrorCodes.UNAVAILABLE, formatErrorMessage(error)));
		}
		if (!sendResponse?.[0]) return await fail(key, sendResponse?.[2] ?? errorShape(ErrorCodes.UNAVAILABLE, sendResponse ? "failed to deliver suggested task" : "chat.send did not respond"));
		return finishSuggestedTaskAcceptance({
			taskId: params.taskId,
			sessionKey: key,
			options: params.options
		});
	}
	const result = payload;
	if (result.runStarted !== true) {
		const runMessage = result.runError && typeof result.runError === "object" && typeof result.runError.message === "string" ? result.runError.message : "initial task did not start";
		return await fail(key, errorShape(ErrorCodes.UNAVAILABLE, runMessage));
	}
	return finishSuggestedTaskAcceptance({
		taskId: params.taskId,
		sessionKey: key,
		options: params.options
	});
}
async function deliverSuggestedTaskToSourceSession(params) {
	const sourceOwner = resolveSuggestionOwner(params.suggestion, params.options);
	if (!sourceOwner.ok) return {
		ok: false,
		error: sourceOwner.error
	};
	const agentId = normalizeAgentId(sourceOwner.agentId);
	const fail = (error) => failSuggestedTaskDelivery({
		taskId: params.taskId,
		options: params.options,
		error
	});
	let source;
	try {
		source = loadGatewaySessionEntryReadOnly(params.suggestion.sessionKey, { agentId });
	} catch (error) {
		return fail(errorShape(ErrorCodes.UNAVAILABLE, formatErrorMessage(error)));
	}
	if (!source.entry?.sessionId) return fail(errorShape(ErrorCodes.INVALID_REQUEST, "source session no longer exists; start it in a worktree instead"));
	const lifecycleError = resolveSessionWorkStartError(source.canonicalKey, source.entry);
	if (lifecycleError) return fail(errorShape(ErrorCodes.INVALID_REQUEST, lifecycleError));
	let activeRunState;
	try {
		activeRunState = resolveVisibleActiveSessionRunState({
			context: params.options.context,
			requestedKey: params.suggestion.sessionKey,
			canonicalKey: source.canonicalKey,
			sessionId: source.entry.sessionId,
			agentId
		});
	} catch (error) {
		return fail(errorShape(ErrorCodes.UNAVAILABLE, formatErrorMessage(error)));
	}
	if (activeRunState.active && activeRunState.runIds.length !== 1) {
		const message = activeRunState.runIds.length === 0 ? "active session run has no exact dispatch identity; refresh and retry" : "session has multiple active runs; choose the target run before accepting the task suggestion";
		return fail(errorShape(ErrorCodes.INVALID_REQUEST, message, {
			retryable: false,
			details: {
				code: "SESSION_SUGGESTION_ACTIVE_RUN_AMBIGUOUS",
				sessionKey: params.suggestion.sessionKey
			}
		}));
	}
	let sendResponse;
	try {
		sendResponse = await sendSuggestedTaskPrompt({
			taskId: params.taskId,
			suggestion: params.suggestion,
			options: params.options,
			sessionKey: params.suggestion.sessionKey,
			agentId,
			sessionId: source.entry.sessionId,
			activeRunId: activeRunState.runIds[0]
		});
	} catch (error) {
		return fail(errorShape(ErrorCodes.UNAVAILABLE, formatErrorMessage(error)));
	}
	if (!sendResponse?.[0]) return fail(sendResponse?.[2] ?? errorShape(ErrorCodes.UNAVAILABLE, sendResponse ? "failed to deliver suggested task" : "chat.send did not respond"));
	return finishSuggestedTaskAcceptance({
		taskId: params.taskId,
		sessionKey: params.suggestion.sessionKey,
		options: params.options
	});
}
const taskSuggestionsHandlers = {
	"taskSuggestions.list": ({ params, respond, context }) => {
		if (!validateTaskSuggestionsListParams(params)) {
			respond(false, void 0, invalidParams("taskSuggestions.list", validateTaskSuggestionsListParams.errors));
			return;
		}
		const requestedSessionKey = params.sessionKey;
		const sessionOwner = requestedSessionKey ? resolveRequestedSessionAgentId(context.getRuntimeConfig(), requestedSessionKey, params.agentId) : void 0;
		if (sessionOwner && !sessionOwner.ok) {
			respond(false, void 0, sessionOwner.error);
			return;
		}
		respond(true, { suggestions: listTaskSuggestions({
			...params,
			...sessionOwner ? { agentId: sessionOwner.agentId } : {}
		}) }, void 0);
	},
	"taskSuggestions.create": ({ params, respond, context }) => {
		if (!validateTaskSuggestionsCreateParams(params)) {
			respond(false, void 0, invalidParams("taskSuggestions.create", validateTaskSuggestionsCreateParams.errors));
			return;
		}
		if (!path.isAbsolute(params.cwd)) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "task suggestion cwd must be absolute"));
			return;
		}
		if (!insideGitCheckout(params.cwd)) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "task suggestion cwd must be inside a git checkout"));
			return;
		}
		const requestedAgentId = params.agentId ? normalizeAgentId(params.agentId) : void 0;
		const sourceOwner = resolveRequestedSessionAgentId(context.getRuntimeConfig(), params.sessionKey, requestedAgentId);
		if (!sourceOwner.ok) {
			respond(false, void 0, sourceOwner.error);
			return;
		}
		const agentId = normalizeAgentId(sourceOwner.agentId);
		const created = createTaskSuggestion({
			...params,
			agentId
		});
		if (created.status === "full") {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "task suggestion registry is busy", { retryable: true }));
			return;
		}
		const { suggestion } = created;
		for (const taskId of created.evictedPendingTaskIds) context.broadcast("task.suggestion", {
			action: "resolved",
			taskId,
			resolution: "expired"
		}, { dropIfSlow: true });
		context.broadcast("task.suggestion", {
			action: "created",
			suggestion
		}, { dropIfSlow: true });
		respond(true, {
			taskId: suggestion.id,
			suggestion
		}, void 0);
	},
	"taskSuggestions.accept": async (options) => {
		const { params, respond } = options;
		if (!validateTaskSuggestionsAcceptParams(params)) {
			respond(false, void 0, invalidParams("taskSuggestions.accept", validateTaskSuggestionsAcceptParams.errors));
			return;
		}
		const mode = params.mode ?? "worktree";
		let cloudProfileId;
		if (mode === "cloud") {
			const profiles = listWorkerProfiles(options.context);
			if (profiles.length === 0) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "no cloud worker profiles configured"));
				return;
			}
			cloudProfileId = params.cloudProfileId;
			if (!cloudProfileId || !profiles.some((profile) => profile.id === cloudProfileId)) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, cloudProfileId ? `unknown cloud worker profile: ${cloudProfileId}` : "cloudProfileId is required for cloud mode"));
				return;
			}
		}
		const active = activeAcceptances.get(params.taskId);
		if (active) {
			const outcome = await active;
			respond(outcome.ok, outcome.ok ? outcome.result : void 0, outcome.ok ? void 0 : outcome.error);
			return;
		}
		const acceptance = beginTaskSuggestionAcceptance(params.taskId);
		if (acceptance.status === "accepted") {
			respond(true, {
				taskId: params.taskId,
				key: acceptance.sessionKey
			}, void 0);
			return;
		}
		if (acceptance.status !== "claimed") {
			respond(false, void 0, errorShape(acceptance.status === "accepting" ? ErrorCodes.UNAVAILABLE : ErrorCodes.INVALID_REQUEST, `task suggestion cannot be accepted: ${acceptance.status}`));
			return;
		}
		const pending = (mode === "session" ? deliverSuggestedTaskToSourceSession({
			taskId: params.taskId,
			suggestion: acceptance.suggestion,
			options
		}) : createSuggestedTaskSession({
			taskId: params.taskId,
			suggestion: acceptance.suggestion,
			options,
			mode,
			...cloudProfileId ? { cloudProfileId } : {}
		})).catch((error) => {
			abandonSuggestedTaskAcceptance(params.taskId, options);
			throw error;
		});
		activeAcceptances.set(params.taskId, pending);
		try {
			const outcome = await pending;
			respond(outcome.ok, outcome.ok ? outcome.result : void 0, outcome.ok ? void 0 : outcome.error);
		} finally {
			activeAcceptances.delete(params.taskId);
		}
	},
	"taskSuggestions.dismiss": ({ params, respond, context }) => {
		if (!validateTaskSuggestionsDismissParams(params)) {
			respond(false, void 0, invalidParams("taskSuggestions.dismiss", validateTaskSuggestionsDismissParams.errors));
			return;
		}
		const dismissed = dismissTaskSuggestion(params.taskId);
		if (dismissed) context.broadcast("task.suggestion", {
			action: "resolved",
			taskId: params.taskId,
			resolution: "dismissed"
		}, { dropIfSlow: true });
		respond(true, {
			taskId: params.taskId,
			dismissed
		}, void 0);
	}
};
//#endregion
export { taskSuggestionsHandlers };
