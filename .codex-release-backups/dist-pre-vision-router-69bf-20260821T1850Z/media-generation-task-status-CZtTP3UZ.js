import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { M as resolveNonNegativeIntegerOption } from "./number-coercion-oCkfUEEq.js";
import "./src-BkwWvwB2.js";
import { t as stableStringify } from "./stable-stringify-DoZ6Yalc.js";
import { h as resolveSessionAgentId } from "./agent-scope-D9GLFAyB.js";
import { c as parseAgentSessionKey } from "./session-key-utils-D8x_bjrd.js";
import { r as getRuntimeConfig } from "./io-BTBpQ7uO.js";
import "./config-CfeGo4K4.js";
import { C as listFreshTasksForOwnerKey, k as listTasksForOwnerKey } from "./task-registry-D_1U9wJQ.js";
import "./runtime-internal-CrD_yPVB.js";
//#region src/agents/session-async-task-status.ts
/**
* Session async-task lookup helpers for avoiding duplicate long-running work
* and reporting the active task back through tool/status metadata.
*/
const DEFAULT_ACTIVE_STATUSES = /* @__PURE__ */ new Set(["queued", "running"]);
/** Find the active queued/running task that matches a session and optional filters. */
function findActiveSessionTask(params) {
	const normalizedSessionKey = normalizeOptionalString(params.sessionKey);
	if (!normalizedSessionKey) return;
	const statuses = params.statuses ?? DEFAULT_ACTIVE_STATUSES;
	const taskKind = normalizeOptionalString(params.taskKind);
	const taskLabel = normalizeOptionalString(params.task);
	const sourceIdPrefix = normalizeOptionalString(params.sourceIdPrefix);
	const matches = listTasksForOwnerKey(normalizedSessionKey).filter((task) => {
		if (task.scopeKind !== "session") return false;
		if (params.runtime && task.runtime !== params.runtime) return false;
		if (!statuses.has(task.status)) return false;
		if (taskKind && task.taskKind !== taskKind) return false;
		if (taskLabel) {
			if (normalizeOptionalString(task.task) !== taskLabel) return false;
		}
		if (sourceIdPrefix) {
			const sourceId = normalizeOptionalString(task.sourceId) ?? "";
			if (sourceId !== sourceIdPrefix && !sourceId.startsWith(`${sourceIdPrefix}:`)) return false;
		}
		return true;
	});
	if (matches.length === 0) return;
	return matches.find((task) => task.status === "running") ?? matches[0];
}
/** Build tool details that point callers at the already-active async task. */
function buildSessionAsyncTaskStatusDetails(task) {
	return {
		async: true,
		active: true,
		existingTask: true,
		status: task.status,
		task: {
			taskId: task.taskId,
			...task.runId ? { runId: task.runId } : {}
		},
		...task.taskKind ? { taskKind: task.taskKind } : {},
		...task.progressSummary ? { progressSummary: task.progressSummary } : {},
		...task.sourceId ? { sourceId: task.sourceId } : {}
	};
}
//#endregion
//#region src/agents/media-generation-task-status-shared.ts
/**
* Shared media generation task status and duplicate-guard helpers.
*
* Image/video task modules use this to track recent starts, find active
* background tasks, and build consistent user/prompt status messages.
*/
/** Marks media as ready while requester delivery is still being confirmed. */
const MEDIA_GENERATION_DELIVERING_COMPLETION_PROGRESS = "Generated media; delivering completion";
const recentMediaGenerationTaskStarts = /* @__PURE__ */ new Map();
const RECENT_MEDIA_GENERATION_TASK_START_CACHE_MS = 2 * 6e4;
/** Builds a stable request key for media generation duplicate detection. */
function buildMediaGenerationRequestKey(value) {
	return stableStringify(value);
}
function buildRecentMediaGenerationTaskKey(params) {
	const sessionKey = normalizeOptionalString(params.sessionKey);
	const taskKind = normalizeOptionalString(params.taskKind);
	const sourcePrefix = normalizeOptionalString(params.sourcePrefix);
	if (!sessionKey || !taskKind || !sourcePrefix) return;
	return `${params.agentId?.trim() ?? "unknown"}\0${sessionKey}\0${taskKind}\0${sourcePrefix}`;
}
function isRecentMediaGenerationTaskRecord(params) {
	const activityAt = params.task.endedAt ?? params.task.lastEventAt ?? params.task.startedAt ?? params.task.createdAt;
	return Number.isFinite(activityAt) && params.nowMs - activityAt <= params.maxAgeMs;
}
function pruneRecentMediaGenerationTaskStarts(params) {
	for (const [key, entries] of recentMediaGenerationTaskStarts.entries()) {
		if (params.preserveKey === key) continue;
		const freshEntries = entries.filter((entry) => isRecentMediaGenerationTaskRecord({
			task: entry.task,
			...params
		}));
		if (freshEntries.length > 0) recentMediaGenerationTaskStarts.set(key, freshEntries);
		else recentMediaGenerationTaskStarts.delete(key);
	}
}
function mediaGenerationSourceMatches(task, sourcePrefix) {
	const sourceId = task.sourceId?.trim() ?? "";
	return sourceId === sourcePrefix || sourceId.startsWith(`${sourcePrefix}:`);
}
function mediaGenerationTaskLabelMatches(task, taskLabel) {
	return normalizeOptionalString(task.task) === taskLabel;
}
function resolveMediaGenerationTaskRequesterAgentId(task) {
	const explicit = normalizeOptionalString(task.requesterAgentId);
	if (explicit) return explicit;
	const ownerKey = normalizeOptionalString(task.ownerKey ?? task.requesterSessionKey);
	const parsed = parseAgentSessionKey(ownerKey)?.agentId;
	if (parsed) return parsed;
	if (!ownerKey) return;
	try {
		return resolveSessionAgentId({
			config: getRuntimeConfig(),
			sessionKey: ownerKey
		});
	} catch {
		return;
	}
}
function isTaskStillBlockingDuplicateGuard(task) {
	return task.status === "queued" || task.status === "running";
}
function isTaskRecentSuccessfulDuplicate(params) {
	return params.task.status === "succeeded" && params.task.terminalOutcome !== "blocked" && Boolean(params.requestKey && params.cachedRequestKey === params.requestKey) && isRecentMediaGenerationTaskRecord({
		task: params.task,
		maxAgeMs: params.maxAgeMs,
		nowMs: params.nowMs
	});
}
function recentMediaGenerationTaskStartMatches(left, right) {
	if (left.requestKey && right.requestKey) return left.requestKey === right.requestKey;
	if (left.task.runId && right.task.runId) return left.task.runId === right.task.runId;
	return left.task.taskId === right.task.taskId;
}
function findPersistedTaskForRecentMediaGenerationStart(params) {
	return listFreshTasksForOwnerKey(params.sessionKey).find((task) => {
		if (task.runtime !== "cli" || task.scopeKind !== "session" || task.taskKind !== params.taskKind || !mediaGenerationSourceMatches(task, params.sourcePrefix) || params.agentId && resolveMediaGenerationTaskRequesterAgentId(task) !== params.agentId) return false;
		if (task.taskId === params.cachedTask.taskId) return true;
		return Boolean(task.runId && task.runId === params.cachedTask.runId);
	});
}
/** Records a just-started media task so duplicate guards work before persistence. */
function recordRecentMediaGenerationTaskStartForSession(params) {
	const key = buildRecentMediaGenerationTaskKey(params);
	const sessionKey = normalizeOptionalString(params.sessionKey);
	if (!key || !sessionKey) return;
	const nowMs = params.nowMs ?? Date.now();
	pruneRecentMediaGenerationTaskStarts({
		maxAgeMs: RECENT_MEDIA_GENERATION_TASK_START_CACHE_MS,
		nowMs,
		preserveKey: key
	});
	const entry = {
		requestKey: normalizeOptionalString(params.requestKey),
		task: {
			taskId: params.taskId,
			runtime: "cli",
			taskKind: params.taskKind,
			sourceId: params.providerId?.trim() ? `${params.sourcePrefix}:${params.providerId.trim()}` : params.sourcePrefix,
			requesterSessionKey: sessionKey,
			requesterAgentId: params.agentId,
			ownerKey: sessionKey,
			scopeKind: "session",
			...params.runId ? { runId: params.runId } : {},
			task: params.taskLabel,
			status: "running",
			deliveryStatus: "not_applicable",
			notifyPolicy: "silent",
			createdAt: nowMs,
			startedAt: nowMs,
			lastEventAt: nowMs,
			progressSummary: params.progressSummary
		}
	};
	const previousEntries = (recentMediaGenerationTaskStarts.get(key) ?? []).filter((entryLocal) => isRecentMediaGenerationTaskRecord({
		task: entryLocal.task,
		maxAgeMs: RECENT_MEDIA_GENERATION_TASK_START_CACHE_MS,
		nowMs
	}));
	recentMediaGenerationTaskStarts.set(key, [...previousEntries.filter((previousEntry) => !recentMediaGenerationTaskStartMatches(previousEntry, entry)), entry]);
}
/** Finds a recent started media task from memory or persisted task state. */
function findRecentStartedMediaGenerationTaskForSession(params) {
	const key = buildRecentMediaGenerationTaskKey(params);
	const sessionKey = normalizeOptionalString(params.sessionKey);
	if (!key || !sessionKey) return;
	const nowMs = params.nowMs ?? Date.now();
	const maxAgeMs = resolveNonNegativeIntegerOption(params.maxAgeMs, 0);
	const taskLabel = normalizeOptionalString(params.taskLabel);
	pruneRecentMediaGenerationTaskStarts({
		maxAgeMs,
		nowMs,
		preserveKey: key
	});
	const entries = recentMediaGenerationTaskStarts.get(key);
	if (!entries?.length) return;
	const retainedEntries = [];
	for (const entry of entries.toReversed()) {
		const task = entry.task;
		const persistedTask = findPersistedTaskForRecentMediaGenerationStart({
			sessionKey,
			agentId: params.agentId,
			cachedTask: task,
			taskKind: params.taskKind,
			sourcePrefix: params.sourcePrefix
		});
		if (persistedTask) {
			const persistedTaskLabelMatches = !taskLabel || mediaGenerationTaskLabelMatches(persistedTask, taskLabel);
			if (isTaskStillBlockingDuplicateGuard(persistedTask) && persistedTaskLabelMatches) return persistedTask;
			if (isTaskRecentSuccessfulDuplicate({
				task: persistedTask,
				requestKey: params.requestKey,
				cachedRequestKey: entry.requestKey,
				maxAgeMs,
				nowMs
			})) return persistedTask;
			if (isRecentMediaGenerationTaskRecord({
				task: persistedTask,
				maxAgeMs,
				nowMs
			})) retainedEntries.push(entry);
			continue;
		}
		if (isRecentMediaGenerationTaskRecord({
			task,
			maxAgeMs,
			nowMs
		})) {
			const cachedTaskLabelMatches = !taskLabel || mediaGenerationTaskLabelMatches(task, taskLabel);
			if (isTaskStillBlockingDuplicateGuard(task) && cachedTaskLabelMatches) return { ...task };
			retainedEntries.push(entry);
		}
	}
	if (retainedEntries.length > 0) recentMediaGenerationTaskStarts.set(key, retainedEntries.toReversed());
	else recentMediaGenerationTaskStarts.delete(key);
}
/** Clears in-memory duplicate guards between tests. */
function resetRecentMediaGenerationDuplicateGuardsForTests() {
	recentMediaGenerationTaskStarts.clear();
}
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.mediaGenerationDuplicateGuardTestApi")] = { resetRecentMediaGenerationDuplicateGuardsForTests };
/** Extracts a provider id from a media task source id with the given prefix. */
function getMediaGenerationTaskProviderId(task, sourcePrefix) {
	const sourceId = task.sourceId?.trim() ?? "";
	if (!sourceId.startsWith(`${sourcePrefix}:`)) return;
	return sourceId.slice(`${sourcePrefix}:`.length).trim() || void 0;
}
/** Finds the highest-priority active media generation task for a session. */
function findActiveMediaGenerationTaskForSession(params) {
	return listActiveMediaGenerationTasksForSession(params)[0];
}
/** Lists active media generation tasks for a session, preferring running tasks. */
function listActiveMediaGenerationTasksForSession(params) {
	const sessionKey = normalizeOptionalString(params.sessionKey);
	if (!sessionKey) return [];
	const taskLabel = normalizeOptionalString(params.taskLabel);
	const sourcePrefix = normalizeOptionalString(params.sourcePrefix);
	const matches = listFreshTasksForOwnerKey(sessionKey).filter((task) => {
		if (task.runtime !== "cli" || task.scopeKind !== "session" || task.taskKind !== params.taskKind || !isTaskStillBlockingDuplicateGuard(task)) return false;
		if (params.agentId && resolveMediaGenerationTaskRequesterAgentId(task) !== params.agentId) return false;
		if (sourcePrefix && !mediaGenerationSourceMatches(task, sourcePrefix)) return false;
		if (taskLabel && !mediaGenerationTaskLabelMatches(task, taskLabel)) return false;
		if (params.excludeDeliveringCompletion && task.progressSummary === "Generated media; delivering completion") return false;
		return true;
	});
	return [...matches.filter((task) => task.status === "running"), ...matches.filter((task) => task.status !== "running")];
}
/** Finds a task that should block duplicate media generation for a session. */
function findDuplicateGuardMediaGenerationTaskForSession(params) {
	return findRecentStartedMediaGenerationTaskForSession(params) ?? findActiveMediaGenerationTaskForSession({
		sessionKey: params.sessionKey,
		agentId: params.agentId,
		taskKind: params.taskKind,
		sourcePrefix: params.sourcePrefix,
		taskLabel: params.taskLabel
	}) ?? void 0;
}
/** Builds structured status details for one media generation task. */
function buildMediaGenerationTaskStatusDetails(params) {
	const provider = getMediaGenerationTaskProviderId(params.task, params.sourcePrefix);
	return {
		...buildSessionAsyncTaskStatusDetails(params.task),
		active: isTaskStillBlockingDuplicateGuard(params.task),
		...provider ? { provider } : {}
	};
}
/** Builds structured status details for a list of media generation tasks. */
function buildMediaGenerationTaskStatusListDetails(params) {
	return {
		async: true,
		active: true,
		existingTask: true,
		taskCount: params.tasks.length,
		tasks: params.tasks.map((task) => buildMediaGenerationTaskStatusDetails({
			task,
			sourcePrefix: params.sourcePrefix
		}))
	};
}
/** Builds user-facing status text for one media generation task. */
function buildMediaGenerationTaskStatusText(params) {
	const provider = getMediaGenerationTaskProviderId(params.task, params.sourcePrefix);
	const active = params.task.status === "queued" || params.task.status === "running" || params.task.terminalOutcome === "blocked";
	return [
		active ? `${params.nounLabel} task ${params.task.taskId} is already ${params.task.status}${provider ? ` with ${provider}` : ""}.` : `${params.nounLabel} task ${params.task.taskId} recently ${params.task.status}${provider ? ` with ${provider}` : ""}.`,
		params.task.progressSummary ? `Progress: ${params.task.progressSummary}.` : null,
		params.duplicateGuard ? active ? `Do not call ${params.toolName} again for this request. Wait for the completion event; the completion agent will send the finished ${params.completionLabel} here.` : `Do not call ${params.toolName} again for the same request; this recent ${params.completionLabel} generation already completed.` : `Wait for the completion event; the completion agent will send the finished ${params.completionLabel} here when it's ready.`
	].filter((entry) => Boolean(entry)).join("\n");
}
/** Builds user-facing status text for multiple active media generation tasks. */
function buildMediaGenerationTaskStatusListText(params) {
	const nounLabel = normalizeLowercaseStringOrEmpty(params.nounLabel);
	return [
		`${params.tasks.length} active ${nounLabel} tasks are queued or running for this session.`,
		...params.tasks.map((task) => {
			const provider = getMediaGenerationTaskProviderId(task, params.sourcePrefix);
			const runId = task.runId ? ` (run ${task.runId})` : "";
			const progress = task.progressSummary ? ` Progress: ${task.progressSummary}.` : "";
			return `- Task ${task.taskId}${runId} is ${task.status}${provider ? ` with ${provider}` : ""}.${progress}`;
		}),
		`Wait for the completion events; the completion agent will send the finished ${params.completionLabel} here when each is ready.`,
		`Only start a new ${params.toolName} call if the user clearly asks for different/new ${params.completionLabel}.`
	].join("\n");
}
/** Builds prompt context warning an agent about an active media generation task. */
function buildActiveMediaGenerationTaskPromptContextForSession(params) {
	const task = findActiveMediaGenerationTaskForSession({
		sessionKey: params.sessionKey,
		agentId: params.agentId,
		taskKind: params.taskKind,
		sourcePrefix: params.sourcePrefix,
		excludeDeliveringCompletion: true
	});
	if (!task) return;
	const provider = getMediaGenerationTaskProviderId(task, params.sourcePrefix);
	return [
		`An active ${normalizeLowercaseStringOrEmpty(params.nounLabel)} background task already exists for this session.`,
		`Task ${task.taskId} is currently ${task.status}${provider ? ` via ${provider}` : ""}.`,
		task.progressSummary ? `Current progress: ${task.progressSummary}.` : null,
		`Do not call \`${params.toolName}\` again for the same request while that task is queued or running.`,
		`If the user asks for progress or whether the work is async, explain the active task state or call \`${params.toolName}\` with \`action:"status"\` instead of starting a new generation.`,
		`Only start a new \`${params.toolName}\` call if the user clearly asks for different/new ${params.completionLabel}.`
	].filter((entry) => Boolean(entry)).join("\n");
}
/** Specializes shared task lookup, duplicate guards, and status text for one media tool. */
function createMediaGenerationTaskStatusOwner(params) {
	const taskIdentity = {
		taskKind: params.taskKind,
		sourcePrefix: params.toolName
	};
	const taskPresentation = {
		sourcePrefix: params.toolName,
		nounLabel: params.nounLabel,
		toolName: params.toolName
	};
	return {
		findActiveTaskForSession(sessionKey, request) {
			return findActiveMediaGenerationTaskForSession({
				...taskIdentity,
				sessionKey,
				taskLabel: request?.prompt,
				agentId: request?.agentId
			});
		},
		listActiveTasksForSession(sessionKey, agentId) {
			return listActiveMediaGenerationTasksForSession({
				...taskIdentity,
				sessionKey,
				agentId
			});
		},
		findDuplicateGuardTaskForSession(sessionKey, request) {
			return findDuplicateGuardMediaGenerationTaskForSession({
				...taskIdentity,
				sessionKey,
				taskLabel: request?.prompt,
				requestKey: request?.requestKey,
				agentId: request?.agentId,
				maxAgeMs: RECENT_MEDIA_GENERATION_TASK_START_CACHE_MS
			});
		},
		buildTaskStatusDetails(task) {
			return buildMediaGenerationTaskStatusDetails({
				task,
				sourcePrefix: params.toolName
			});
		},
		buildTaskStatusListDetails(tasks) {
			return buildMediaGenerationTaskStatusListDetails({
				tasks,
				sourcePrefix: params.toolName
			});
		},
		buildTaskStatusText(task, options) {
			return buildMediaGenerationTaskStatusText({
				...taskPresentation,
				task,
				completionLabel: params.completionLabel,
				duplicateGuard: options?.duplicateGuard
			});
		},
		buildTaskStatusListText(tasks) {
			return buildMediaGenerationTaskStatusListText({
				...taskPresentation,
				tasks,
				completionLabel: params.promptCompletionLabel
			});
		},
		buildActiveTaskPromptContextForSession(sessionKey, agentId) {
			return buildActiveMediaGenerationTaskPromptContextForSession({
				...taskIdentity,
				...taskPresentation,
				sessionKey,
				agentId,
				completionLabel: params.promptCompletionLabel
			});
		}
	};
}
//#endregion
//#region src/agents/media-generation-task-status.ts
/**
* Image generation task status helpers.
*
* These wrap the shared media task status helpers with image-specific task kind,
* source id, duplicate-guard timing, and prompt/status wording.
*/
const IMAGE_GENERATION_TASK_KIND = "image_generation";
/** Image generation keeps multi-task status and prompt-specific duplicate lookup. */
const { findActiveTaskForSession: findActiveImageGenerationTaskForSession, listActiveTasksForSession: listActiveImageGenerationTasksForSession, findDuplicateGuardTaskForSession: findDuplicateGuardImageGenerationTaskForSession, buildTaskStatusDetails: buildImageGenerationTaskStatusDetails, buildTaskStatusListDetails: buildImageGenerationTaskStatusListDetails, buildTaskStatusText: buildImageGenerationTaskStatusText, buildTaskStatusListText: buildImageGenerationTaskStatusListText, buildActiveTaskPromptContextForSession: buildActiveImageGenerationTaskPromptContextForSession } = createMediaGenerationTaskStatusOwner({
	taskKind: IMAGE_GENERATION_TASK_KIND,
	toolName: "image_generate",
	nounLabel: "Image generation",
	completionLabel: "image",
	promptCompletionLabel: "images"
});
/**
* Music-generation task status adapters. The module specializes the shared
* media-generation task helpers with music task ids, duplicate guards, and
* user-facing status text.
*/
/** Task kind used for music generation task registry records. */
const MUSIC_GENERATION_TASK_KIND = "music_generation";
/** Binds music-specific task identity, duplicate guards, and visible status text. */
const { findActiveTaskForSession: findActiveMusicGenerationTaskForSession, findDuplicateGuardTaskForSession: findDuplicateGuardMusicGenerationTaskForSession, buildTaskStatusDetails: buildMusicGenerationTaskStatusDetails, buildTaskStatusText: buildMusicGenerationTaskStatusText, buildActiveTaskPromptContextForSession: buildActiveMusicGenerationTaskPromptContextForSession } = createMediaGenerationTaskStatusOwner({
	taskKind: MUSIC_GENERATION_TASK_KIND,
	toolName: "music_generate",
	nounLabel: "Music generation",
	completionLabel: "music",
	promptCompletionLabel: "music tracks"
});
/**
* Video generation task status helpers.
*
* These wrap the generic media task status helpers with video-specific kind,
* source, labels, duplicate-guard timing, and prompt-context wording.
*/
const VIDEO_GENERATION_TASK_KIND = "video_generation";
/** Binds video-specific task identity, duplicate guards, and visible status text. */
const { findActiveTaskForSession: findActiveVideoGenerationTaskForSession, findDuplicateGuardTaskForSession: findDuplicateGuardVideoGenerationTaskForSession, buildTaskStatusDetails: buildVideoGenerationTaskStatusDetails, buildTaskStatusText: buildVideoGenerationTaskStatusText, buildActiveTaskPromptContextForSession: buildActiveVideoGenerationTaskPromptContextForSession } = createMediaGenerationTaskStatusOwner({
	taskKind: VIDEO_GENERATION_TASK_KIND,
	toolName: "video_generate",
	nounLabel: "Video generation",
	completionLabel: "video",
	promptCompletionLabel: "videos"
});
//#endregion
export { buildMediaGenerationRequestKey as C, MEDIA_GENERATION_DELIVERING_COMPLETION_PROGRESS as S, findActiveSessionTask as T, findActiveVideoGenerationTaskForSession as _, buildActiveMusicGenerationTaskPromptContextForSession as a, findDuplicateGuardVideoGenerationTaskForSession as b, buildImageGenerationTaskStatusListDetails as c, buildMusicGenerationTaskStatusDetails as d, buildMusicGenerationTaskStatusText as f, findActiveMusicGenerationTaskForSession as g, findActiveImageGenerationTaskForSession as h, buildActiveImageGenerationTaskPromptContextForSession as i, buildImageGenerationTaskStatusListText as l, buildVideoGenerationTaskStatusText as m, MUSIC_GENERATION_TASK_KIND as n, buildActiveVideoGenerationTaskPromptContextForSession as o, buildVideoGenerationTaskStatusDetails as p, VIDEO_GENERATION_TASK_KIND as r, buildImageGenerationTaskStatusDetails as s, IMAGE_GENERATION_TASK_KIND as t, buildImageGenerationTaskStatusText as u, findDuplicateGuardImageGenerationTaskForSession as v, recordRecentMediaGenerationTaskStartForSession as w, listActiveImageGenerationTasksForSession as x, findDuplicateGuardMusicGenerationTaskForSession as y };
