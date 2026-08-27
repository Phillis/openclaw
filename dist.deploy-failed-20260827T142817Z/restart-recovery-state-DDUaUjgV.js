import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { l as asNonNegativeFiniteNumber } from "./number-coercion-oCkfUEEq.js";
import { s as normalizeDeliveryContext } from "./delivery-context.shared-D-qPZITK.js";
import { t as isDeliverableMessageChannel } from "./message-channel-normalize-rAbqRXlG.js";
import "./message-channel-T4W5YOto.js";
import { a as normalizeStoreSessionKey } from "./store-entry-BgSA4iwU.js";
import { B as collectActiveSessionWorkAdmissionIdentities } from "./agent-harness-session-key-D5rklW6u.js";
import crypto from "node:crypto";
import { isDeepStrictEqual } from "node:util";
//#region src/config/sessions/store-maintenance-preserve.ts
const preserveKeysProviders = /* @__PURE__ */ new Set();
/** Registers a provider for session maintenance preserve keys. */
function registerSessionMaintenancePreserveKeysProvider(provider) {
	preserveKeysProviders.add(provider);
	return () => {
		preserveKeysProviders.delete(provider);
	};
}
function addSessionMaintenancePreserveKey(keys, value) {
	const normalized = normalizeStoreSessionKey(value ?? "");
	if (normalized) keys.add(normalized);
}
function addSessionMaintenancePreserveKeys(keys, values) {
	for (const value of values ?? []) addSessionMaintenancePreserveKey(keys, value);
}
/** Collects normalized session keys that maintenance/pruning must preserve. */
function collectSessionMaintenancePreserveKeys(baseKeys) {
	const keys = /* @__PURE__ */ new Set();
	addSessionMaintenancePreserveKeys(keys, baseKeys);
	for (const provider of preserveKeysProviders) try {
		addSessionMaintenancePreserveKeys(keys, provider());
	} catch {}
	return keys.size > 0 ? keys : void 0;
}
/** Resolves store keys owned by active work, including aliases sharing a backing session id. */
function collectActiveSessionWorkAdmissionKeys(params) {
	const activeIdentities = collectActiveSessionWorkAdmissionIdentities(params.storePath);
	if (activeIdentities.size === 0) return;
	const normalizedIdentities = new Set(Array.from(activeIdentities, (identity) => normalizeStoreSessionKey(identity)));
	const keys = /* @__PURE__ */ new Set();
	for (const [key, entry] of Object.entries(params.store)) if (normalizedIdentities.has(normalizeStoreSessionKey(key)) || activeIdentities.has(entry.sessionId)) {
		keys.add(key);
		keys.add(normalizeStoreSessionKey(key));
	}
	return keys.size > 0 ? keys : void 0;
}
/** Collects every runtime and active-work key protected from automatic maintenance. */
function collectSessionMaintenancePreserveKeysForStore(params) {
	const keys = collectSessionMaintenancePreserveKeys(params.baseKeys) ?? /* @__PURE__ */ new Set();
	for (const key of collectActiveSessionWorkAdmissionKeys({
		storePath: params.storePath,
		store: params.store
	}) ?? []) keys.add(key);
	return keys.size > 0 ? keys : void 0;
}
function isTerminalSessionStatus(status) {
	return status === "done" || status === "failed" || status === "killed" || status === "timeout";
}
function isSessionPluginTraceLine(line) {
	const trimmed = line.trim();
	return trimmed.startsWith("🔎 ") || /(?:^|\s)(?:Debug|Trace):/.test(trimmed);
}
function resolveSessionPluginLines(entry, includeLine) {
	return Array.isArray(entry?.pluginDebugEntries) ? entry.pluginDebugEntries.flatMap((pluginEntry) => Array.isArray(pluginEntry?.lines) ? pluginEntry.lines.filter((line) => typeof line === "string" && line.trim().length > 0 && includeLine(line)) : []) : [];
}
function resolveSessionPluginStatusLines(entry) {
	return resolveSessionPluginLines(entry, (line) => !isSessionPluginTraceLine(line));
}
function resolveSessionPluginTraceLines(entry) {
	return resolveSessionPluginLines(entry, isSessionPluginTraceLine);
}
function normalizeSessionRuntimeModelFields(entry) {
	const normalizedModel = normalizeOptionalString(entry.model);
	const normalizedProvider = normalizeOptionalString(entry.modelProvider);
	let next = entry;
	if (!normalizedModel) {
		if (entry.model !== void 0 || entry.modelProvider !== void 0) {
			next = { ...next };
			delete next.model;
			delete next.modelProvider;
		}
		return next;
	}
	if (entry.model !== normalizedModel) {
		if (next === entry) next = { ...next };
		next.model = normalizedModel;
	}
	if (!normalizedProvider) {
		if (entry.modelProvider !== void 0) {
			if (next === entry) next = { ...next };
			delete next.modelProvider;
		}
		return next;
	}
	if (entry.modelProvider !== normalizedProvider) {
		if (next === entry) next = { ...next };
		next.modelProvider = normalizedProvider;
	}
	return next;
}
function setSessionRuntimeModel(entry, runtime) {
	const provider = runtime.provider.trim();
	const model = runtime.model.trim();
	if (!provider || !model) return false;
	entry.modelProvider = provider;
	entry.model = model;
	return true;
}
function resolveMergedUpdatedAt(existing, patch, options) {
	const now = options?.now ?? Date.now();
	const existingUpdatedAt = normalizeMergedUpdatedAt(existing?.updatedAt, now);
	const patchUpdatedAt = normalizeMergedUpdatedAt(patch.updatedAt, now);
	if (options?.policy === "preserve-activity" && existing) return existingUpdatedAt ?? patchUpdatedAt ?? now;
	return Math.max(existingUpdatedAt ?? 0, patchUpdatedAt ?? 0, now);
}
function normalizeMergedUpdatedAt(value, now) {
	if (typeof value !== "number" || !Number.isFinite(value) || value < 0) return;
	return Math.min(value, now);
}
function mergeSessionEntryWithPolicy(existing, patch, options) {
	const sessionId = patch.sessionId ?? existing?.sessionId ?? crypto.randomUUID();
	const updatedAt = resolveMergedUpdatedAt(existing, patch, options);
	if (!existing) return stripRetiredSessionEntryLocators(normalizeSessionRuntimeModelFields({
		...patch,
		sessionId,
		updatedAt,
		sessionStartedAt: patch.sessionStartedAt ?? updatedAt
	}));
	const next = {
		...existing,
		...patch,
		sessionId,
		updatedAt,
		sessionStartedAt: patch.sessionStartedAt ?? (existing.sessionId === sessionId ? existing.sessionStartedAt : updatedAt)
	};
	if (existing.createdVia !== void 0) next.createdVia = existing.createdVia;
	if (existing.createdActor !== void 0) next.createdActor = existing.createdActor;
	if (existing.createdAt !== void 0) next.createdAt = existing.createdAt;
	if (existing.projectId !== void 0) next.projectId = existing.projectId;
	if (existing.forkSource !== void 0) next.forkSource = existing.forkSource;
	if (Object.hasOwn(patch, "model") && !Object.hasOwn(patch, "modelProvider")) {
		const patchedModel = normalizeOptionalString(patch.model);
		const existingModel = normalizeOptionalString(existing.model);
		if (patchedModel && patchedModel !== existingModel) delete next.modelProvider;
	}
	return stripRetiredSessionEntryLocators(normalizeSessionRuntimeModelFields(next));
}
function stripRetiredSessionEntryLocators(entry) {
	const mutable = entry;
	delete mutable.sessionFile;
	delete mutable.transcriptPath;
	return entry;
}
function mergeSessionEntry(existing, patch) {
	return mergeSessionEntryWithPolicy(existing, patch);
}
function mergeSessionEntryPreserveActivity(existing, patch) {
	return mergeSessionEntryWithPolicy(existing, patch, { policy: "preserve-activity" });
}
function resolveSessionTotalTokens(entry) {
	return asNonNegativeFiniteNumber(entry?.totalTokens);
}
function resolveFreshSessionTotalTokens(entry) {
	const total = resolveSessionTotalTokens(entry);
	if (total === void 0) return;
	if (entry?.totalTokensFresh !== true || entry.totalTokensVersion !== 1) return;
	return total;
}
const DEFAULT_RESET_TRIGGERS = ["/new", "/reset"];
//#endregion
//#region src/plugins/session-entry-slot-keys.ts
const SESSION_ENTRY_RESERVED_SLOT_KEYS = /* @__PURE__ */ new Set([
	"__proto__",
	"constructor",
	"prototype",
	"lastHeartbeatText",
	"lastHeartbeatSentAt",
	"heartbeatIsolatedBaseSessionKey",
	"heartbeatTaskState",
	"pluginExtensions",
	"initializationPending",
	"pluginExtensionSlotKeys",
	"pluginNextTurnInjections",
	"sessionId",
	"lifecycleRevision",
	"updatedAt",
	"incognito",
	"archivedAt",
	"archivedBy",
	"pinnedAt",
	"lastReadAt",
	"agentStatus",
	"observerDigest",
	"markedUnreadAt",
	"lastActivityAt",
	"sessionFile",
	"transcriptPath",
	"spawnedBy",
	"completionOwnerSessionKey",
	"spawnedWorkspaceDir",
	"spawnedCwd",
	"sessionDiffBaseline",
	"worktree",
	"projectId",
	"parentSessionKey",
	"parentSessionId",
	"createdVia",
	"createdActor",
	"createdAt",
	"forkSource",
	"previousSessionId",
	"forkedFromParent",
	"spawnDepth",
	"swarmGroupId",
	"swarmCollector",
	"swarmOutputSchema",
	"subagentRole",
	"subagentControlScope",
	"inheritedToolPolicyVersion",
	"inheritedToolDeny",
	"inheritedToolAllow",
	"lifecycleRunId",
	"activeWriterRunId",
	"mainRestartRecovery",
	"subagentRecovery",
	"pluginOwnerId",
	"systemSent",
	"abortedLastRun",
	"restartRecoveryRuns",
	"restartRecoveryForceSafeTools",
	"goal",
	"sessionStartedAt",
	"ambientTranscriptWatermarks",
	"lastInteractionAt",
	"startedAt",
	"endedAt",
	"runtimeMs",
	"status",
	"lastRunError",
	"abortCutoffMessageSid",
	"abortCutoffTimestamp",
	"chatType",
	"thinkingLevel",
	"cronRunContinuation",
	"fastMode",
	"toolOverrides",
	"verboseLevel",
	"traceLevel",
	"reasoningLevel",
	"elevatedLevel",
	"ttsAuto",
	"lastTtsReadLatestHash",
	"lastTtsReadLatestAt",
	"execHost",
	"execSecurity",
	"execAsk",
	"execNode",
	"execCwd",
	"responseUsage",
	"usageFamilyKey",
	"usageFamilySessionIds",
	"providerOverride",
	"modelOverride",
	"agentRuntimeOverride",
	"modelOverrideSource",
	"modelOverrideRouteResolution",
	"modelOverrideFallbackOriginProvider",
	"modelOverrideFallbackOriginModel",
	"modelFallback",
	"authProfileOverride",
	"authProfileOverrideSource",
	"authProfileOverrideCompactionCount",
	"liveModelSwitchPending",
	"groupActivation",
	"groupActivationNeedsSystemIntro",
	"sendPolicy",
	"queueMode",
	"queueDebounceMs",
	"queueCap",
	"queueDrop",
	"inputTokens",
	"outputTokens",
	"totalTokens",
	"pendingFinalDelivery",
	"pendingDeliveryNotice",
	"restartRecoveryDeliveryContext",
	"restartRecoveryDeliveryMediaUrls",
	"restartRecoveryDisableMessageTool",
	"restartRecoverySuppressTextDelivery",
	"restartRecoveryDeliveryRequestFingerprint",
	"restartRecoveryDeliveryRunId",
	"restartRecoveryDeliverySourceRunId",
	"restartRecoveryBeforeAgentReplyState",
	"restartRecoveryDeliveryReceiptState",
	"restartRecoveryDeliveryToolCallId",
	"restartRecoveryRequesterAccountId",
	"restartRecoveryRequesterSenderId",
	"restartRecoverySameChannelThreadRequired",
	"restartRecoverySourceIngress",
	"restartRecoverySourceReplyDeliveryMode",
	"restartRecoveryTerminalDeliveryEvidence",
	"restartRecoveryTerminalRunIds",
	"totalTokensFresh",
	"totalTokensVersion",
	"estimatedCostUsd",
	"cacheRead",
	"cacheWrite",
	"modelProvider",
	"model",
	"modelSelectionLocked",
	"agentHarnessId",
	"agentHarnessEpoch",
	"agentHarnessLaneEpochs",
	"agentHarnessMigration",
	"fallbackNotice",
	"contextTokens",
	"contextBudgetStatus",
	"compactionCount",
	"compactionCheckpoints",
	"memoryFlush",
	"cliSessionIds",
	"cliSessionBindings",
	"acpSessionBinding",
	"claudeCliSessionId",
	"label",
	"category",
	"boardFace",
	"displayName",
	"delivery",
	"groupId",
	"subject",
	"groupChannel",
	"space",
	"skillsSnapshot",
	"systemPromptReport",
	"pluginDebugEntries",
	"hookExternalContentSource",
	"acp",
	"quotaSuspension",
	"pendingTranscriptRepair",
	"visibility"
]);
const RETIRED_SESSION_SLOT_KEYS = /* @__PURE__ */ new Set([
	"icon",
	"channel",
	"origin",
	"route",
	"deliveryContext",
	"lastChannel",
	"lastTo",
	"lastAccountId",
	"lastThreadId",
	"pendingFinalDeliveryCreatedAt",
	"pendingFinalDeliveryLastAttemptAt",
	"pendingFinalDeliveryAttemptCount",
	"pendingFinalDeliveryLastError",
	"pendingFinalDeliveryText",
	"pendingFinalDeliveryContext",
	"pendingFinalDeliveryIntentId",
	"fallbackNoticeSelectedModel",
	"fallbackNoticeActiveModel",
	"fallbackNoticeReason",
	"memoryFlushAt",
	"memoryFlushCompactionCount",
	"memoryFlushContextHash",
	"memoryFlushFailureCount",
	"memoryFlushLastFailedAt",
	"memoryFlushLastFailureError"
]);
const OBJECT_PROTOTYPE_RESERVED_SLOT_KEYS = /* @__PURE__ */ new Set(["prototype", ...Object.getOwnPropertyNames(Object.prototype)]);
const SESSION_ENTRY_SLOT_KEY_RE = /^[A-Za-z][A-Za-z0-9_]*$/u;
function normalizeSessionEntrySlotKey(value) {
	if (typeof value !== "string") return {
		ok: false,
		error: "sessionEntrySlotKey must be a string"
	};
	const key = value.trim();
	if (!key) return {
		ok: false,
		error: "sessionEntrySlotKey cannot be empty"
	};
	if (!SESSION_ENTRY_SLOT_KEY_RE.test(key)) return {
		ok: false,
		error: "sessionEntrySlotKey must be an identifier-style field name"
	};
	if (SESSION_ENTRY_RESERVED_SLOT_KEYS.has(key) || RETIRED_SESSION_SLOT_KEYS.has(key)) return {
		ok: false,
		error: `sessionEntrySlotKey is reserved by SessionEntry: ${key}`
	};
	if (OBJECT_PROTOTYPE_RESERVED_SLOT_KEYS.has(key)) return {
		ok: false,
		error: `sessionEntrySlotKey is reserved by Object: ${key}`
	};
	return {
		ok: true,
		key
	};
}
//#endregion
//#region src/config/sessions/restart-recovery-state.ts
/** Resolves only a complete durable channel claim; session-route fallbacks carry no authority. */
function resolveRestartRecoveryChannelAuthority(entry) {
	const sourceTurnId = normalizeOptionalString(entry.restartRecoveryDeliverySourceRunId);
	const deliveryContext = normalizeDeliveryContext(entry.restartRecoveryDeliveryContext);
	const channel = normalizeOptionalString(deliveryContext?.channel);
	const to = normalizeOptionalString(deliveryContext?.to);
	if (entry.restartRecoverySourceIngress !== "channel" || !sourceTurnId || !channel || !to || !isDeliverableMessageChannel(channel)) return;
	return {
		sourceTurnId,
		deliveryContext: {
			...deliveryContext,
			channel,
			to
		}
	};
}
function normalizeThreadId(value) {
	return normalizeOptionalString(value) ?? (typeof value === "number" && Number.isFinite(value) ? String(value) : void 0);
}
function normalizeStringArray(value) {
	if (!Array.isArray(value)) return;
	const values = Array.from(new Set(value.flatMap((item) => {
		const normalized = normalizeOptionalString(item);
		return normalized ? [normalized] : [];
	})));
	return values.length > 0 ? values : void 0;
}
function normalizePresentStringArray(value) {
	if (!Array.isArray(value)) return;
	return normalizeStringArray(value) ?? [];
}
function normalizeTerminalDeliveryEvidenceResult(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return;
	const record = value;
	const captured = record.captured === true ? true : void 0;
	const rawPayloads = Array.isArray(record.payloads) ? record.payloads : void 0;
	const payloads = rawPayloads ? rawPayloads.slice(0, 64).map((item) => {
		if (!item || typeof item !== "object" || Array.isArray(item)) return {};
		const payload = item;
		const mediaUrls = normalizeStringArray(payload.mediaUrls);
		const visible = typeof payload.visible === "boolean" ? payload.visible : void 0;
		const evidence = {};
		if (mediaUrls) evidence.mediaUrls = mediaUrls;
		if (visible !== void 0) evidence.visible = visible;
		return evidence;
	}) : void 0;
	const payloadsTruncated = record.payloadsTruncated === true || (rawPayloads?.length ?? 0) > 64 ? true : void 0;
	const rawStatus = record.deliveryStatus && typeof record.deliveryStatus === "object" ? record.deliveryStatus : void 0;
	const status = rawStatus?.status === "failed" || rawStatus?.status === "partial_failed" || rawStatus?.status === "sent" || rawStatus?.status === "suppressed" ? rawStatus.status : void 0;
	const payloadOutcomes = Array.isArray(rawStatus?.payloadOutcomes) ? rawStatus.payloadOutcomes.slice(0, 64).flatMap((item) => {
		if (!item || typeof item !== "object" || Array.isArray(item)) return [];
		const outcome = item;
		const outcomeStatus = outcome.status === "failed" || outcome.status === "sent" || outcome.status === "suppressed" ? outcome.status : void 0;
		if (!outcomeStatus || typeof outcome.index !== "number" || !Number.isInteger(outcome.index) || outcome.index < 0) return [];
		return [{
			index: outcome.index,
			status: outcomeStatus,
			...typeof outcome.sentBeforeError === "boolean" ? { sentBeforeError: outcome.sentBeforeError } : {}
		}];
	}) : void 0;
	const errorMessage = normalizeOptionalString(rawStatus?.errorMessage);
	const deliveryStatus = status ? {
		status,
		...errorMessage ? { errorMessage } : {},
		...payloadOutcomes?.length ? { payloadOutcomes } : {}
	} : void 0;
	const rawMessagingToolSentTargets = Array.isArray(record.messagingToolSentTargets) ? record.messagingToolSentTargets : void 0;
	const messagingToolSentTargets = rawMessagingToolSentTargets ? rawMessagingToolSentTargets.slice(0, 64).flatMap((item) => {
		if (!item || typeof item !== "object" || Array.isArray(item)) return [];
		const target = item;
		const provider = normalizeOptionalString(target.provider);
		const accountId = normalizeOptionalString(target.accountId);
		const to = normalizeOptionalString(target.to);
		const threadId = normalizeThreadId(target.threadId);
		const mediaUrls = normalizeStringArray(target.mediaUrls);
		const visible = typeof target.visible === "boolean" ? target.visible : void 0;
		if (!provider && !accountId && !to && !threadId && !mediaUrls && visible === void 0) return [];
		return [{
			...provider ? { provider } : {},
			...accountId ? { accountId } : {},
			...to ? { to } : {},
			...threadId ? { threadId } : {},
			...target.threadImplicit === true ? { threadImplicit: true } : {},
			...target.threadSuppressed === true ? { threadSuppressed: true } : {},
			...mediaUrls ? { mediaUrls } : {},
			...visible !== void 0 ? { visible } : {}
		}];
	}) : void 0;
	const messagingToolSentTargetsTruncated = record.messagingToolSentTargetsTruncated === true || (rawMessagingToolSentTargets?.length ?? 0) > 64 ? true : void 0;
	const messagingToolAggregateEvidenceUnaccounted = record.messagingToolAggregateEvidenceUnaccounted === true ? true : void 0;
	const restartUnsafeSideEffectsDetected = record.restartUnsafeSideEffectsDetected === true ? true : void 0;
	if (!captured && !payloads?.length && !payloadsTruncated && !deliveryStatus && !messagingToolSentTargets?.length && !messagingToolSentTargetsTruncated && !messagingToolAggregateEvidenceUnaccounted && !restartUnsafeSideEffectsDetected) return;
	return {
		...captured ? { captured } : {},
		...payloads?.length ? { payloads } : {},
		...payloadsTruncated ? { payloadsTruncated } : {},
		...deliveryStatus ? { deliveryStatus } : {},
		...messagingToolSentTargets?.length ? { messagingToolSentTargets } : {},
		...messagingToolSentTargetsTruncated ? { messagingToolSentTargetsTruncated } : {},
		...messagingToolAggregateEvidenceUnaccounted ? { messagingToolAggregateEvidenceUnaccounted } : {},
		...restartUnsafeSideEffectsDetected ? { restartUnsafeSideEffectsDetected } : {}
	};
}
function normalizeRestartRecoveryTerminalDeliveryEvidence(value) {
	if (!Array.isArray(value)) return;
	const evidence = [];
	for (const item of value) {
		if (!item || typeof item !== "object" || Array.isArray(item)) continue;
		const runId = normalizeOptionalString(item.runId);
		const result = normalizeTerminalDeliveryEvidenceResult(item);
		if (!runId || !result) continue;
		const previousIndex = evidence.findIndex((entry) => entry.runId === runId);
		if (previousIndex >= 0) evidence.splice(previousIndex, 1);
		evidence.push({
			runId,
			...result
		});
	}
	const bounded = evidence.slice(-64);
	return bounded.length > 0 ? bounded : void 0;
}
/** Keeps a bounded durable set of client runs that must never execute again. */
function normalizeRestartRecoveryTerminalRunIds(value) {
	if (!Array.isArray(value)) return;
	const runIds = [];
	for (const item of value) {
		const runId = normalizeOptionalString(item);
		if (!runId) continue;
		const previousIndex = runIds.indexOf(runId);
		if (previousIndex >= 0) runIds.splice(previousIndex, 1);
		runIds.push(runId);
	}
	const bounded = runIds.slice(-64);
	return bounded.length > 0 ? bounded : void 0;
}
function sameOptionalStringArray(left, right) {
	if (!Array.isArray(left) || !right) return left === void 0 && right === void 0;
	return left.length === right.length && left.every((value, index) => value === right[index]);
}
/** Compares normalized durable terminal-source tombstones by value and order. */
function sameRestartRecoveryTerminalRunIds(left, right) {
	return sameOptionalStringArray(left, normalizeRestartRecoveryTerminalRunIds(right));
}
/** Normalizes restart-claim fields while preserving an already-canonical array identity. */
function normalizeRestartRecoveryEntryFields(entry, assign) {
	const deliveryMediaUrls = normalizePresentStringArray(entry.restartRecoveryDeliveryMediaUrls);
	assign("restartRecoveryDeliveryMediaUrls", sameOptionalStringArray(entry.restartRecoveryDeliveryMediaUrls, deliveryMediaUrls) ? entry.restartRecoveryDeliveryMediaUrls : deliveryMediaUrls);
	assign("restartRecoveryDisableMessageTool", entry.restartRecoveryDisableMessageTool === true ? true : void 0);
	assign("restartRecoverySuppressTextDelivery", entry.restartRecoverySuppressTextDelivery === true ? true : void 0);
	assign("restartRecoveryBeforeAgentReplyState", entry.restartRecoveryBeforeAgentReplyState === "admitted" || entry.restartRecoveryBeforeAgentReplyState === "pending" || entry.restartRecoveryBeforeAgentReplyState === "continue" || entry.restartRecoveryBeforeAgentReplyState === "handled-silent" || entry.restartRecoveryBeforeAgentReplyState === "handled-reply" || entry.restartRecoveryBeforeAgentReplyState === "handled-unrecoverable" ? entry.restartRecoveryBeforeAgentReplyState : void 0);
	assign("restartRecoveryDeliveryReceiptState", entry.restartRecoveryDeliveryReceiptState === "terminal-pending" || entry.restartRecoveryDeliveryReceiptState === "delivered-terminal" ? entry.restartRecoveryDeliveryReceiptState : void 0);
	assign("restartRecoveryDeliveryToolCallId", normalizeOptionalString(entry.restartRecoveryDeliveryToolCallId));
	assign("restartRecoveryDeliveryRequestFingerprint", normalizeOptionalString(entry.restartRecoveryDeliveryRequestFingerprint));
	assign("restartRecoveryDeliveryRunId", normalizeOptionalString(entry.restartRecoveryDeliveryRunId));
	assign("restartRecoveryDeliverySourceRunId", normalizeOptionalString(entry.restartRecoveryDeliverySourceRunId));
	assign("restartRecoveryRequesterAccountId", normalizeOptionalString(entry.restartRecoveryRequesterAccountId));
	assign("restartRecoveryRequesterSenderId", normalizeOptionalString(entry.restartRecoveryRequesterSenderId));
	assign("restartRecoverySameChannelThreadRequired", entry.restartRecoverySameChannelThreadRequired === true ? true : void 0);
	assign("restartRecoverySourceIngress", entry.restartRecoverySourceIngress === "channel" || entry.restartRecoverySourceIngress === "control-ui" || entry.restartRecoverySourceIngress === "internal" ? entry.restartRecoverySourceIngress : void 0);
	assign("restartRecoverySourceReplyDeliveryMode", entry.restartRecoverySourceReplyDeliveryMode === "automatic" || entry.restartRecoverySourceReplyDeliveryMode === "message_tool_only" ? entry.restartRecoverySourceReplyDeliveryMode : void 0);
	const terminalDeliveryEvidence = normalizeRestartRecoveryTerminalDeliveryEvidence(entry.restartRecoveryTerminalDeliveryEvidence);
	assign("restartRecoveryTerminalDeliveryEvidence", isDeepStrictEqual(entry.restartRecoveryTerminalDeliveryEvidence, terminalDeliveryEvidence) ? entry.restartRecoveryTerminalDeliveryEvidence : terminalDeliveryEvidence);
	const terminalRunIds = normalizeRestartRecoveryTerminalRunIds(entry.restartRecoveryTerminalRunIds);
	assign("restartRecoveryTerminalRunIds", sameOptionalStringArray(entry.restartRecoveryTerminalRunIds, terminalRunIds) ? entry.restartRecoveryTerminalRunIds : terminalRunIds);
}
function mergeRestartRecoveryTerminalDeliveryEvidence(current, appended) {
	return normalizeRestartRecoveryTerminalDeliveryEvidence([...normalizeRestartRecoveryTerminalDeliveryEvidence(current) ?? [], ...normalizeRestartRecoveryTerminalDeliveryEvidence(appended) ?? []]);
}
function getRestartRecoveryTerminalDeliveryEvidence(entry, runId) {
	return normalizeRestartRecoveryTerminalDeliveryEvidence(entry?.restartRecoveryTerminalDeliveryEvidence)?.find((evidence) => evidence.runId === runId);
}
/** Appends new terminal ids without refreshing or evicting existing members. */
function mergeRestartRecoveryTerminalRunIds(current, appended) {
	const currentRunIds = normalizeRestartRecoveryTerminalRunIds(current) ?? [];
	const currentSet = new Set(currentRunIds);
	const appendedRunIds = (normalizeRestartRecoveryTerminalRunIds(appended) ?? []).filter((runId) => !currentSet.has(runId));
	return normalizeRestartRecoveryTerminalRunIds([...currentRunIds, ...appendedRunIds]);
}
function hasRestartRecoveryTerminalRun(entry, runId) {
	return normalizeRestartRecoveryTerminalRunIds(entry?.restartRecoveryTerminalRunIds)?.includes(runId) === true;
}
/** Matches durable source ownership regardless of the surrounding run status. */
function hasRestartRecoverySourceClaim(entry, sourceTurnId) {
	const normalizedSourceTurnId = normalizeOptionalString(sourceTurnId);
	return normalizedSourceTurnId !== void 0 && normalizeOptionalString(entry?.restartRecoveryDeliveryRunId) !== void 0 && normalizeOptionalString(entry?.restartRecoveryDeliverySourceRunId) === normalizedSourceTurnId;
}
function hasActiveRestartRecoverySourceClaim(entry, sourceTurnId) {
	return entry?.status === "running" && hasRestartRecoverySourceClaim(entry, sourceTurnId);
}
/** Clears exact active ownership and optionally records its client source as terminal. */
function buildRestartRecoveryClaimCleanupPatch(params) {
	const sourceRunId = normalizeOptionalString(params.terminalSourceRunId) ?? normalizeOptionalString(params.entry.restartRecoveryDeliverySourceRunId);
	const terminalRunIds = params.recordTerminalSource && (sourceRunId || params.terminalRunId) ? mergeRestartRecoveryTerminalRunIds(params.entry.restartRecoveryTerminalRunIds, [...sourceRunId ? [sourceRunId] : [], ...params.terminalRunId ? [params.terminalRunId] : []]) : void 0;
	const terminalDeliveryEvidence = params.recordTerminalSource && sourceRunId && params.terminalDeliveryEvidence ? mergeRestartRecoveryTerminalDeliveryEvidence(params.entry.restartRecoveryTerminalDeliveryEvidence, [{
		runId: sourceRunId,
		...params.terminalDeliveryEvidence
	}]) : void 0;
	return {
		restartRecoveryBeforeAgentReplyState: void 0,
		restartRecoveryDeliveryReceiptState: void 0,
		restartRecoveryDeliveryToolCallId: void 0,
		restartRecoveryDeliveryContext: void 0,
		restartRecoveryDeliveryMediaUrls: void 0,
		restartRecoveryDisableMessageTool: void 0,
		restartRecoverySuppressTextDelivery: void 0,
		restartRecoveryDeliveryRequestFingerprint: void 0,
		restartRecoveryDeliveryRunId: void 0,
		restartRecoveryDeliverySourceRunId: void 0,
		restartRecoveryRequesterAccountId: void 0,
		restartRecoveryRequesterSenderId: void 0,
		restartRecoverySameChannelThreadRequired: void 0,
		restartRecoverySourceIngress: void 0,
		restartRecoverySourceReplyDeliveryMode: void 0,
		restartRecoveryForceSafeTools: void 0,
		...terminalDeliveryEvidence ? { restartRecoveryTerminalDeliveryEvidence: terminalDeliveryEvidence } : {},
		...terminalRunIds ? { restartRecoveryTerminalRunIds: terminalRunIds } : {}
	};
}
//#endregion
export { collectSessionMaintenancePreserveKeysForStore as C, collectSessionMaintenancePreserveKeys as S, resolveSessionPluginStatusLines as _, hasRestartRecoveryTerminalRun as a, setSessionRuntimeModel as b, resolveRestartRecoveryChannelAuthority as c, DEFAULT_RESET_TRIGGERS as d, isTerminalSessionStatus as f, resolveFreshSessionTotalTokens as g, normalizeSessionRuntimeModelFields as h, hasRestartRecoverySourceClaim as i, sameRestartRecoveryTerminalRunIds as l, mergeSessionEntryPreserveActivity as m, getRestartRecoveryTerminalDeliveryEvidence as n, mergeRestartRecoveryTerminalRunIds as o, mergeSessionEntry as p, hasActiveRestartRecoverySourceClaim as r, normalizeRestartRecoveryEntryFields as s, buildRestartRecoveryClaimCleanupPatch as t, normalizeSessionEntrySlotKey as u, resolveSessionPluginTraceLines as v, registerSessionMaintenancePreserveKeysProvider as w, collectActiveSessionWorkAdmissionKeys as x, resolveSessionTotalTokens as y };
