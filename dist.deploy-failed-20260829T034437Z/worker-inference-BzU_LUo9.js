import { t as closedObject } from "./closed-object-DY9fiMP-.js";
import { R as WorkerProviderReplayStateSchema } from "./worker-admission-v0PuudgP.js";
import { a as NonEmptyString } from "./primitives-TdbrOFJ1.js";
import { d as WorkerIdentifierSchema, l as WorkerErrorResponseFrameSchema, m as WorkerTranscriptUsageSchema, n as LiveSequenceSchema, p as WorkerTranscriptAssistantDiagnosticSchema, r as LiveTextSchema, t as LiveIntegerSchema, u as WorkerFrameIdSchema } from "./worker-protocol-primitives-Ch87u2k0.js";
import { Value } from "typebox/value";
import { Type } from "typebox";
//#region packages/gateway-protocol/src/schema/session-classification.ts
/**
* Stable, non-sensitive classification for a session row.
*
* The taxonomy remains open so newer Gateways can add classifications without
* making otherwise compatible older clients reject the row.
*/
const SessionClassificationSchema = NonEmptyString;
/** Non-sensitive peer category derived from the session route, when known. */
const SessionPeerKindSchema = NonEmptyString;
//#endregion
//#region packages/gateway-protocol/src/schema/sessions-sharing-values.ts
const SessionVisibilitySchema = Type.Union([
	Type.Literal("shared"),
	Type.Literal("read-only"),
	Type.Literal("suggest"),
	Type.Literal("draft")
]);
const SessionSharingRoleSchema = Type.Union([
	Type.Literal("admin"),
	Type.Literal("owner"),
	Type.Literal("member"),
	Type.Literal("viewer")
]);
//#endregion
//#region packages/gateway-protocol/src/schema/sessions-row.ts
const SessionPermissionModeSchema = Type.Union([
	Type.Literal("read-only"),
	Type.Literal("guarded"),
	Type.Literal("workspace"),
	Type.Literal("full")
]);
const SessionToolOverridesSchema = closedObject({
	mcpServers: Type.Optional(Type.Record(Type.String({ minLength: 1 }), Type.Boolean())),
	mcpToolsDeny: Type.Optional(Type.Record(Type.String({ minLength: 1 }), Type.Array(NonEmptyString))),
	skills: Type.Optional(Type.Record(Type.String({ minLength: 1 }), Type.Boolean())),
	webSearch: Type.Optional(Type.Boolean())
});
/** Projected actor that caused a session node to be created. */
const SessionCreatedActorSchema = closedObject({
	type: Type.Union([
		Type.Literal("human"),
		Type.Literal("agent"),
		Type.Literal("system")
	]),
	id: Type.Optional(NonEmptyString),
	label: Type.Optional(NonEmptyString),
	/** Durable profile avatar route; absent for actors without a stored profile avatar. */
	avatarUrl: Type.Optional(NonEmptyString)
});
/** Mutable responsibility for one session; actor display data is projected at read time. */
const SessionOwnerSchema = closedObject({
	actor: SessionCreatedActorSchema,
	assignedBy: Type.Optional(SessionCreatedActorSchema),
	assignedAt: Type.Optional(Type.Number({ minimum: 0 }))
});
/** Stable Gateway session row fields; mutation envelopes may add null tombstones. */
const SessionRowSchema = Type.Object({
	key: Type.String(),
	sessionId: Type.Optional(Type.String()),
	incognito: Type.Optional(Type.Literal(true)),
	kind: Type.Union([
		Type.Literal("direct"),
		Type.Literal("group"),
		Type.Literal("global"),
		Type.Literal("unknown")
	]),
	label: Type.Optional(Type.String()),
	icon: Type.Optional(Type.String()),
	channelAvatarUrl: Type.Optional(NonEmptyString),
	boardFace: Type.Optional(Type.Union([Type.Literal("chat"), Type.Literal("dashboard")])),
	displayName: Type.Optional(Type.String()),
	derivedTitle: Type.Optional(Type.String()),
	lastMessagePreview: Type.Optional(Type.String()),
	channel: Type.Optional(Type.String()),
	/** Stable non-sensitive facts derived from the canonical session route. */
	classification: Type.Optional(SessionClassificationSchema),
	agentId: Type.Optional(NonEmptyString),
	accountId: Type.Optional(NonEmptyString),
	peerKind: Type.Optional(SessionPeerKindSchema),
	isMain: Type.Optional(Type.Boolean()),
	isBackground: Type.Optional(Type.Boolean()),
	chatType: Type.Optional(Type.Union([
		Type.Literal("direct"),
		Type.Literal("group"),
		Type.Literal("channel")
	])),
	updatedAt: Type.Optional(Type.Union([Type.Number(), Type.Null()])),
	archived: Type.Optional(Type.Boolean()),
	archivedAt: Type.Optional(Type.Number()),
	archivedBy: Type.Optional(SessionCreatedActorSchema),
	pinned: Type.Optional(Type.Boolean()),
	pinnedAt: Type.Optional(Type.Number()),
	unread: Type.Optional(Type.Boolean()),
	lastReadAt: Type.Optional(Type.Number()),
	markedUnreadAt: Type.Optional(Type.Number()),
	lastActivityAt: Type.Optional(Type.Number()),
	lastInteractionAt: Type.Optional(Type.Number()),
	status: Type.Optional(Type.Union([
		Type.Literal("queued"),
		Type.Literal("running"),
		Type.Literal("done"),
		Type.Literal("failed"),
		Type.Literal("killed"),
		Type.Literal("timeout")
	])),
	lastRunError: Type.Optional(Type.String()),
	/** Exact run that produced the latest terminal lifecycle projection. */
	lastRunId: Type.Optional(NonEmptyString),
	restartRecoveryStatus: Type.Optional(Type.Literal("tombstoned")),
	activeLeafEntryId: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
	spawnedBy: Type.Optional(Type.String()),
	parentSessionKey: Type.Optional(Type.String()),
	controlOwnerSessionKey: Type.Optional(Type.String()),
	childSessions: Type.Optional(Type.Array(Type.String())),
	forkedFromParent: Type.Optional(Type.Boolean()),
	spawnDepth: Type.Optional(Type.Number()),
	subagentRole: Type.Optional(Type.Union([Type.Literal("orchestrator"), Type.Literal("leaf")])),
	subagentControlScope: Type.Optional(Type.Union([Type.Literal("children"), Type.Literal("none")])),
	swarmGroupId: Type.Optional(Type.String()),
	worktree: Type.Optional(Type.Object({
		id: Type.String(),
		branch: Type.String(),
		repoRoot: Type.String()
	})),
	execNode: Type.Optional(Type.String()),
	execCwd: Type.Optional(Type.String()),
	spawnedWorkspaceDir: Type.Optional(Type.String()),
	spawnedCwd: Type.Optional(Type.String()),
	permissionMode: Type.Optional(SessionPermissionModeSchema),
	sessionRoot: Type.Optional(Type.String()),
	createdVia: Type.Optional(Type.Union([
		Type.Literal("operator"),
		Type.Literal("spawn"),
		Type.Literal("channel"),
		Type.Literal("cron"),
		Type.Literal("talk"),
		Type.Literal("run"),
		Type.Literal("plugin"),
		Type.Literal("internal")
	])),
	createdActor: Type.Optional(SessionCreatedActorSchema),
	owner: Type.Optional(SessionOwnerSchema),
	participants: Type.Optional(Type.Array(SessionCreatedActorSchema, { maxItems: 4 })),
	participantCount: Type.Optional(Type.Integer({ minimum: 0 })),
	visibility: Type.Optional(SessionVisibilitySchema),
	sharingRole: Type.Optional(SessionSharingRoleSchema),
	createdAt: Type.Optional(Type.Number()),
	forkSource: Type.Optional(Type.Object({
		sessionKey: Type.String(),
		sessionId: Type.String(),
		entryId: Type.Optional(Type.String())
	})),
	previousSessionId: Type.Optional(Type.String()),
	inputTokens: Type.Optional(Type.Number()),
	outputTokens: Type.Optional(Type.Number()),
	totalTokens: Type.Optional(Type.Number()),
	totalTokensFresh: Type.Optional(Type.Boolean()),
	contextTokens: Type.Optional(Type.Number()),
	estimatedCostUsd: Type.Optional(Type.Number()),
	model: Type.Optional(Type.String()),
	modelProvider: Type.Optional(Type.String()),
	/** Persisted override provenance; null means inherited, omission means not projected. */
	modelOverrideSource: Type.Optional(Type.Union([
		Type.Literal("user"),
		Type.Literal("auto"),
		Type.Null()
	])),
	toolOverrides: Type.Optional(SessionToolOverridesSchema)
}, { additionalProperties: true });
//#endregion
//#region packages/gateway-protocol/src/schema/worker-inference.ts
const WORKER_INFERENCE_PROTOCOL_FEATURE = "worker-inference-v1";
const WORKER_INFERENCE_METHODS = ["worker.inference.start", "worker.inference.cancel"];
const WORKER_PROTOCOL_MAX_INFERENCE_PAYLOAD_BYTES = 25 * 1024 * 1024;
const WORKER_INFERENCE_MAX_CONTEXT_MESSAGES = 1024;
const WORKER_INFERENCE_MAX_TOOLS = 256;
const WORKER_INFERENCE_MAX_OUTPUT_TOKENS = 1e6;
function workerInferenceObject(properties) {
	return closedObject(properties);
}
const InferenceTextSchema = Type.String({ maxLength: WORKER_PROTOCOL_MAX_INFERENCE_PAYLOAD_BYTES });
const OptionalInferenceTextSchema = Type.Optional(InferenceTextSchema);
const WorkerInferenceTextContentSchema = workerInferenceObject({
	type: Type.Literal("text"),
	text: InferenceTextSchema,
	textSignature: OptionalInferenceTextSchema
});
const WorkerInferenceImageContentSchema = workerInferenceObject({
	type: Type.Literal("image"),
	data: Type.String({
		minLength: 1,
		maxLength: WORKER_PROTOCOL_MAX_INFERENCE_PAYLOAD_BYTES
	}),
	mimeType: Type.String({
		minLength: 1,
		maxLength: 256
	})
});
const WorkerInferenceThinkingContentSchema = workerInferenceObject({
	type: Type.Literal("thinking"),
	thinking: InferenceTextSchema,
	thinkingSignature: OptionalInferenceTextSchema,
	redacted: Type.Optional(Type.Boolean())
});
const WorkerInferenceToolCallSchema = workerInferenceObject({
	type: Type.Literal("toolCall"),
	id: WorkerIdentifierSchema,
	name: WorkerIdentifierSchema,
	arguments: Type.Record(Type.String({
		minLength: 1,
		maxLength: 256
	}), Type.Unknown()),
	thoughtSignature: OptionalInferenceTextSchema,
	executionMode: Type.Optional(Type.Union([Type.Literal("sequential"), Type.Literal("parallel")]))
});
const WorkerInferenceUserMessageSchema = workerInferenceObject({
	role: Type.Literal("user"),
	content: Type.Union([InferenceTextSchema, Type.Array(Type.Union([WorkerInferenceTextContentSchema, WorkerInferenceImageContentSchema]), {
		minItems: 1,
		maxItems: 128
	})]),
	timestamp: LiveIntegerSchema,
	runtimeContextCarrier: Type.Optional(Type.Boolean())
});
const WorkerInferenceAssistantMessageProperties = {
	role: Type.Literal("assistant"),
	content: Type.Array(Type.Union([
		WorkerInferenceTextContentSchema,
		WorkerInferenceThinkingContentSchema,
		WorkerInferenceToolCallSchema
	]), { maxItems: 128 }),
	api: WorkerIdentifierSchema,
	provider: WorkerIdentifierSchema,
	model: WorkerIdentifierSchema,
	responseModel: Type.Optional(WorkerIdentifierSchema),
	responseId: Type.Optional(WorkerIdentifierSchema),
	providerReplay: Type.Optional(WorkerProviderReplayStateSchema),
	usage: WorkerTranscriptUsageSchema,
	timestamp: LiveIntegerSchema
};
const WorkerInferenceAssistantMessageSchema = workerInferenceObject({
	...WorkerInferenceAssistantMessageProperties,
	stopReason: Type.Union([
		Type.Literal("stop"),
		Type.Literal("length"),
		Type.Literal("toolUse")
	])
});
const WorkerInferenceContextAssistantMessageSchema = workerInferenceObject({
	...WorkerInferenceAssistantMessageProperties,
	diagnostics: Type.Optional(Type.Array(WorkerTranscriptAssistantDiagnosticSchema, { maxItems: 128 })),
	stopReason: Type.Union([
		Type.Literal("stop"),
		Type.Literal("length"),
		Type.Literal("toolUse"),
		Type.Literal("error"),
		Type.Literal("aborted")
	]),
	errorMessage: OptionalInferenceTextSchema,
	errorCode: Type.Optional(Type.String({ maxLength: 256 })),
	errorType: Type.Optional(Type.String({ maxLength: 256 })),
	errorBody: OptionalInferenceTextSchema
});
const WorkerInferenceMessageSchema = Type.Union([
	WorkerInferenceUserMessageSchema,
	WorkerInferenceContextAssistantMessageSchema,
	workerInferenceObject({
		role: Type.Literal("toolResult"),
		toolCallId: WorkerIdentifierSchema,
		toolName: WorkerIdentifierSchema,
		content: Type.Array(Type.Union([WorkerInferenceTextContentSchema, WorkerInferenceImageContentSchema]), { maxItems: 128 }),
		details: Type.Optional(Type.Unknown()),
		isError: Type.Boolean(),
		timestamp: LiveIntegerSchema
	})
]);
const WorkerInferenceToolSchema = workerInferenceObject({
	name: WorkerIdentifierSchema,
	description: LiveTextSchema,
	parameters: Type.Unknown()
});
const WorkerInferenceModelRefSchema = workerInferenceObject({
	provider: WorkerIdentifierSchema,
	model: WorkerIdentifierSchema
});
const WorkerInferenceContextSchema = workerInferenceObject({
	systemPrompt: Type.Optional(InferenceTextSchema),
	messages: Type.Array(WorkerInferenceMessageSchema, { maxItems: WORKER_INFERENCE_MAX_CONTEXT_MESSAGES }),
	tools: Type.Optional(Type.Array(WorkerInferenceToolSchema, { maxItems: WORKER_INFERENCE_MAX_TOOLS }))
});
const WorkerInferenceReasoningSchema = Type.Union([
	Type.Literal("off"),
	Type.Literal("minimal"),
	Type.Literal("low"),
	Type.Literal("medium"),
	Type.Literal("high"),
	Type.Literal("xhigh"),
	Type.Literal("adaptive"),
	Type.Literal("max")
]);
const WorkerInferenceThinkingBudgetSchema = Type.Integer({
	minimum: 0,
	maximum: WORKER_INFERENCE_MAX_OUTPUT_TOKENS
});
const WorkerInferenceThinkingBudgetsSchema = workerInferenceObject({
	minimal: Type.Optional(WorkerInferenceThinkingBudgetSchema),
	low: Type.Optional(WorkerInferenceThinkingBudgetSchema),
	medium: Type.Optional(WorkerInferenceThinkingBudgetSchema),
	high: Type.Optional(WorkerInferenceThinkingBudgetSchema),
	max: Type.Optional(WorkerInferenceThinkingBudgetSchema)
});
const WorkerInferenceOptionsSchema = workerInferenceObject({
	temperature: Type.Optional(Type.Number({
		minimum: 0,
		maximum: 2
	})),
	maxTokens: Type.Optional(Type.Integer({
		minimum: 1,
		maximum: WORKER_INFERENCE_MAX_OUTPUT_TOKENS
	})),
	reasoning: Type.Optional(WorkerInferenceReasoningSchema),
	thinkingBudgets: Type.Optional(WorkerInferenceThinkingBudgetsSchema)
});
const WorkerInferenceIdentityProperties = {
	runEpoch: LiveIntegerSchema,
	sessionId: WorkerIdentifierSchema,
	runId: WorkerIdentifierSchema,
	turnId: WorkerIdentifierSchema
};
const WorkerInferenceStartParamsSchema = workerInferenceObject({
	...WorkerInferenceIdentityProperties,
	modelRef: WorkerInferenceModelRefSchema,
	context: WorkerInferenceContextSchema,
	options: WorkerInferenceOptionsSchema
});
const WorkerInferenceStartResultSchema = workerInferenceObject({ status: Type.Union([Type.Literal("accepted"), Type.Literal("replayed")]) });
const WorkerInferenceErrorReasonSchema = Type.Union([
	Type.Literal("model-not-approved"),
	Type.Literal("invalid-context"),
	Type.Literal("epoch-mismatch"),
	Type.Literal("session-not-attached"),
	Type.Literal("provider-error"),
	Type.Literal("cancelled")
]);
const WorkerInferenceErrorShapeSchema = workerInferenceObject({
	code: Type.Union([Type.Literal("INVALID_REQUEST"), Type.Literal("UNAVAILABLE")]),
	message: Type.String({
		minLength: 1,
		maxLength: 256
	}),
	details: workerInferenceObject({ reason: WorkerInferenceErrorReasonSchema })
});
const WorkerInferenceStartRequestFrameSchema = workerInferenceObject({
	type: Type.Literal("req"),
	id: WorkerFrameIdSchema,
	method: Type.Literal(WORKER_INFERENCE_METHODS[0]),
	params: WorkerInferenceStartParamsSchema
});
const WorkerInferenceStartSuccessResponseFrameSchema = workerInferenceObject({
	type: Type.Literal("res"),
	id: WorkerFrameIdSchema,
	ok: Type.Literal(true),
	payload: WorkerInferenceStartResultSchema
});
const WorkerInferenceErrorResponseFrameSchema = workerInferenceObject({
	type: Type.Literal("res"),
	id: WorkerFrameIdSchema,
	ok: Type.Literal(false),
	error: WorkerInferenceErrorShapeSchema
});
const WorkerInferenceStartResponseFrameSchema = Type.Union([
	WorkerInferenceStartSuccessResponseFrameSchema,
	WorkerInferenceErrorResponseFrameSchema,
	WorkerErrorResponseFrameSchema
]);
const WorkerInferenceCancelParamsSchema = workerInferenceObject({ ...WorkerInferenceIdentityProperties });
const WorkerInferenceCancelResultSchema = workerInferenceObject({ status: Type.Literal("cancelled") });
const WorkerInferenceCancelRequestFrameSchema = workerInferenceObject({
	type: Type.Literal("req"),
	id: WorkerFrameIdSchema,
	method: Type.Literal(WORKER_INFERENCE_METHODS[1]),
	params: WorkerInferenceCancelParamsSchema
});
const WorkerInferenceCancelSuccessResponseFrameSchema = workerInferenceObject({
	type: Type.Literal("res"),
	id: WorkerFrameIdSchema,
	ok: Type.Literal(true),
	payload: WorkerInferenceCancelResultSchema
});
const WorkerInferenceCancelResponseFrameSchema = Type.Union([
	WorkerInferenceCancelSuccessResponseFrameSchema,
	WorkerInferenceErrorResponseFrameSchema,
	WorkerErrorResponseFrameSchema
]);
const WorkerInferenceResolvedModelSchema = workerInferenceObject({
	api: WorkerIdentifierSchema,
	provider: WorkerIdentifierSchema,
	model: WorkerIdentifierSchema
});
const WorkerInferenceStreamEventSchema = Type.Union([
	workerInferenceObject({
		type: Type.Literal("start"),
		resolvedModel: WorkerInferenceResolvedModelSchema,
		timestamp: LiveIntegerSchema
	}),
	workerInferenceObject({
		type: Type.Literal("text_start"),
		contentIndex: LiveIntegerSchema,
		contentSignature: OptionalInferenceTextSchema
	}),
	workerInferenceObject({
		type: Type.Literal("text_delta"),
		contentIndex: LiveIntegerSchema,
		delta: InferenceTextSchema
	}),
	workerInferenceObject({
		type: Type.Literal("text_end"),
		contentIndex: LiveIntegerSchema,
		contentSignature: OptionalInferenceTextSchema
	}),
	workerInferenceObject({
		type: Type.Literal("thinking_start"),
		contentIndex: LiveIntegerSchema
	}),
	workerInferenceObject({
		type: Type.Literal("thinking_delta"),
		contentIndex: LiveIntegerSchema,
		delta: InferenceTextSchema
	}),
	workerInferenceObject({
		type: Type.Literal("thinking_end"),
		contentIndex: LiveIntegerSchema,
		contentSignature: OptionalInferenceTextSchema
	}),
	workerInferenceObject({
		type: Type.Literal("toolcall_start"),
		contentIndex: LiveIntegerSchema,
		id: WorkerIdentifierSchema,
		toolName: WorkerIdentifierSchema
	}),
	workerInferenceObject({
		type: Type.Literal("toolcall_delta"),
		contentIndex: LiveIntegerSchema,
		delta: InferenceTextSchema
	}),
	workerInferenceObject({
		type: Type.Literal("toolcall_end"),
		contentIndex: LiveIntegerSchema
	})
]);
const WorkerInferenceEventParamsSchema = workerInferenceObject({
	...WorkerInferenceIdentityProperties,
	seq: LiveSequenceSchema,
	event: WorkerInferenceStreamEventSchema
});
const WorkerInferenceEventFrameSchema = workerInferenceObject({
	type: Type.Literal("event"),
	event: Type.Literal("worker.inference.event"),
	payload: WorkerInferenceEventParamsSchema
});
const WorkerInferenceTerminalDoneSchema = workerInferenceObject({
	type: Type.Literal("done"),
	message: WorkerInferenceAssistantMessageSchema
});
const WorkerInferenceTerminalErrorSchema = workerInferenceObject({
	type: Type.Literal("error"),
	reason: WorkerInferenceErrorReasonSchema,
	message: Type.String({
		minLength: 1,
		maxLength: 256
	}),
	usage: Type.Optional(WorkerTranscriptUsageSchema)
});
const WorkerInferenceTerminalOutcomeSchema = Type.Union([WorkerInferenceTerminalDoneSchema, WorkerInferenceTerminalErrorSchema]);
const WorkerInferenceTerminalParamsSchema = workerInferenceObject({
	...WorkerInferenceIdentityProperties,
	seq: LiveSequenceSchema,
	outcome: WorkerInferenceTerminalOutcomeSchema
});
const WorkerInferenceTerminalFrameSchema = workerInferenceObject({
	type: Type.Literal("event"),
	event: Type.Literal("worker.inference.terminal"),
	payload: WorkerInferenceTerminalParamsSchema
});
function isSafeWorkerInferenceJson(data) {
	const stack = [{
		depth: 0,
		value: data
	}];
	const seen = /* @__PURE__ */ new WeakSet();
	while (stack.length > 0) {
		const current = stack.pop();
		if (!current || current.depth > 32) return false;
		if (current.value === null || typeof current.value === "string" || typeof current.value === "boolean") continue;
		if (typeof current.value === "number") {
			if (!Number.isFinite(current.value)) return false;
			continue;
		}
		if (typeof current.value !== "object" || seen.has(current.value)) return false;
		seen.add(current.value);
		const values = Array.isArray(current.value) ? current.value : Object.values(current.value);
		for (const value of values) stack.push({
			depth: current.depth + 1,
			value
		});
	}
	return true;
}
function validateWorkerInferenceStartParams(data) {
	return isSafeWorkerInferenceJson(data) && Value.Check(WorkerInferenceStartParamsSchema, data);
}
function validateWorkerInferenceCancelParams(data) {
	return isSafeWorkerInferenceJson(data) && Value.Check(WorkerInferenceCancelParamsSchema, data);
}
function validateWorkerInferenceTerminalOutcome(data) {
	return isSafeWorkerInferenceJson(data) && Value.Check(WorkerInferenceTerminalOutcomeSchema, data);
}
function validateWorkerInferenceEventFrame(data) {
	return isSafeWorkerInferenceJson(data) && Value.Check(WorkerInferenceEventFrameSchema, data);
}
function validateWorkerInferenceTerminalFrame(data) {
	return isSafeWorkerInferenceJson(data) && Value.Check(WorkerInferenceTerminalFrameSchema, data);
}
//#endregion
export { SessionVisibilitySchema as C, SessionSharingRoleSchema as S, SessionPeerKindSchema as T, SessionCreatedActorSchema as _, WORKER_PROTOCOL_MAX_INFERENCE_PAYLOAD_BYTES as a, SessionRowSchema as b, WorkerInferenceModelRefSchema as c, WorkerInferenceStartResponseFrameSchema as d, validateWorkerInferenceCancelParams as f, validateWorkerInferenceTerminalOutcome as g, validateWorkerInferenceTerminalFrame as h, WORKER_INFERENCE_PROTOCOL_FEATURE as i, WorkerInferenceOptionsSchema as l, validateWorkerInferenceStartParams as m, WORKER_INFERENCE_MAX_OUTPUT_TOKENS as n, WorkerInferenceCancelRequestFrameSchema as o, validateWorkerInferenceEventFrame as p, WORKER_INFERENCE_METHODS as r, WorkerInferenceCancelResponseFrameSchema as s, WORKER_INFERENCE_MAX_CONTEXT_MESSAGES as t, WorkerInferenceStartRequestFrameSchema as u, SessionOwnerSchema as v, SessionClassificationSchema as w, SessionToolOverridesSchema as x, SessionPermissionModeSchema as y };
