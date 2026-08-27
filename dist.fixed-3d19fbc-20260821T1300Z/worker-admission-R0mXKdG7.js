import { t as FAILOVER_REASONS } from "./failover-reasons-Mjd0tFtT.js";
import { n as GATEWAY_CLIENT_IDS, r as GATEWAY_CLIENT_MODES } from "./client-info-yubNQC1L.js";
import { t as closedObject } from "./closed-object-DY9fiMP-.js";
import { Type } from "typebox";
//#region packages/gateway-protocol/src/schema/since.ts
/** Adds protocol-vintage metadata without changing the schema's validated value shape. */
function withSince(train, schema) {
	Object.assign(schema, { "x-openclaw-since": train });
	return schema;
}
//#endregion
//#region packages/gateway-protocol/src/schema/failover-reason.ts
const failoverReasonLiteralSchemas = FAILOVER_REASONS.map((reason) => Type.Literal(reason));
/** Closed failure reasons shared by model fallback producers and protocol consumers. */
const FailoverReasonSchema = Type.Union(failoverReasonLiteralSchemas);
//#endregion
//#region packages/gateway-protocol/src/schema/worker-protocol-primitives.ts
const WORKER_PUBLIC_INGRESS_PATH = "/__openclaw__/worker";
const WORKER_PROTOCOL_MAX_IDENTIFIER_LENGTH = 256;
const WORKER_PROTOCOL_MAX_FRAME_ID_LENGTH = 128;
const WORKER_PROTOCOL_MAX_PAYLOAD_BYTES = 64 * 1024;
const WorkerIdentifierSchema = Type.String({
	minLength: 1,
	maxLength: 256,
	pattern: "^\\S(?:.*\\S)?$"
});
const WorkerFrameIdSchema = Type.String({
	minLength: 1,
	maxLength: 128
});
const WorkerAdmissionFailureReasonSchema = Type.Union([
	Type.Literal("invalid-credential"),
	Type.Literal("credential-expired"),
	Type.Literal("environment-mismatch"),
	Type.Literal("environment-unavailable"),
	Type.Literal("bundle-mismatch"),
	Type.Literal("version-mismatch"),
	Type.Literal("session-mismatch"),
	Type.Literal("placement-mismatch"),
	Type.Literal("owner-epoch-mismatch"),
	Type.Literal("rpc-set-mismatch"),
	Type.Literal("protocol-features-mismatch")
]);
const WorkerProtocolCloseReasonSchema = Type.Union([
	WorkerAdmissionFailureReasonSchema,
	Type.Literal("admission-rejected"),
	Type.Literal("invalid-handshake"),
	Type.Literal("protocol-mismatch"),
	Type.Literal("gateway-unavailable"),
	Type.Literal("invalid-frame"),
	Type.Literal("slow-consumer"),
	Type.Literal("method-not-allowed"),
	Type.Literal("invalid-heartbeat"),
	Type.Literal("credential-replaced"),
	Type.Literal("gateway-shutdown")
]);
const WorkerErrorCodeSchema = Type.Union([Type.Literal("INVALID_REQUEST"), Type.Literal("UNAVAILABLE")]);
const WorkerErrorDetailsSchema = closedObject({ reason: WorkerProtocolCloseReasonSchema });
const WorkerErrorShapeSchema = closedObject({
	code: WorkerErrorCodeSchema,
	message: Type.String({
		minLength: 1,
		maxLength: 256
	}),
	details: WorkerErrorDetailsSchema,
	retryable: Type.Optional(Type.Boolean()),
	retryAfterMs: Type.Optional(Type.Integer({ minimum: 0 }))
});
const WorkerErrorResponseFrameSchema = closedObject({
	type: Type.Literal("res"),
	id: WorkerFrameIdSchema,
	ok: Type.Literal(false),
	error: WorkerErrorShapeSchema
});
const WorkerTranscriptUsageSchema = closedObject({
	input: Type.Number({ minimum: 0 }),
	output: Type.Number({ minimum: 0 }),
	cacheRead: Type.Number({ minimum: 0 }),
	cacheWrite: Type.Number({ minimum: 0 }),
	contextUsage: Type.Optional(Type.Union([closedObject({
		state: Type.Literal("available"),
		promptTokens: Type.Number({ minimum: 0 }),
		totalTokens: Type.Number({ minimum: 0 })
	}), closedObject({ state: Type.Literal("unavailable") })])),
	totalTokens: Type.Number({ minimum: 0 }),
	cost: closedObject({
		input: Type.Number({ minimum: 0 }),
		output: Type.Number({ minimum: 0 }),
		cacheRead: Type.Number({ minimum: 0 }),
		cacheWrite: Type.Number({ minimum: 0 }),
		total: Type.Number({ minimum: 0 }),
		totalOrigin: Type.Optional(Type.Literal("provider-billed"))
	})
});
const WorkerTranscriptAssistantDiagnosticSchema = closedObject({
	type: WorkerIdentifierSchema,
	timestamp: Type.Integer({ minimum: 0 }),
	error: Type.Optional(closedObject({
		name: Type.Optional(Type.String({ maxLength: 256 })),
		message: Type.String({ maxLength: WORKER_PROTOCOL_MAX_PAYLOAD_BYTES }),
		stack: Type.Optional(Type.String({ maxLength: WORKER_PROTOCOL_MAX_PAYLOAD_BYTES })),
		code: Type.Optional(Type.Union([Type.String({ maxLength: 256 }), Type.Number()]))
	})),
	details: Type.Optional(Type.Record(Type.String({
		minLength: 1,
		maxLength: 256
	}), Type.Unknown()))
});
const LiveTextSchema = Type.String({ maxLength: WORKER_PROTOCOL_MAX_PAYLOAD_BYTES });
const LiveIntegerSchema = Type.Integer({
	minimum: 0,
	maximum: Number.MAX_SAFE_INTEGER
});
const LiveSequenceSchema = Type.Integer({
	minimum: 1,
	maximum: Number.MAX_SAFE_INTEGER
});
//#endregion
//#region packages/gateway-protocol/src/schema/worker-admission.ts
const WORKER_RPC_SET_VERSION = 1;
const WORKER_HEARTBEAT_INTERVAL_MS = 15e3;
const WORKER_PROTOCOL_METHODS = [
	"worker.heartbeat",
	"worker.transcript.commit",
	"worker.live-event",
	"worker.sessions.spawn",
	"worker.sessions.send"
];
const WORKER_TRANSCRIPT_COMMIT_PROTOCOL_FEATURE = "worker-transcript-commit-v1";
const WORKER_LIVE_EVENT_PROTOCOL_FEATURE = "worker-live-event-v1";
const WORKER_LAUNCH_V2_PROTOCOL_FEATURE = "worker-launch-v2";
const WORKER_EXECUTION_CONTEXT_PROTOCOL_FEATURE = "worker-execution-context-v1";
const WORKER_SESSION_TOOLS_PROTOCOL_FEATURE = "worker-session-tools-v1";
const WORKER_PROTOCOL_FEATURES = [
	"worker-heartbeat-v1",
	WORKER_TRANSCRIPT_COMMIT_PROTOCOL_FEATURE,
	WORKER_LIVE_EVENT_PROTOCOL_FEATURE,
	WORKER_EXECUTION_CONTEXT_PROTOCOL_FEATURE,
	WORKER_SESSION_TOOLS_PROTOCOL_FEATURE,
	"worker-inference-v1"
];
const WORKER_PROTOCOL_MAX_METHOD_LENGTH = 64;
const WORKER_PROTOCOL_MAX_FEATURES = 64;
const WORKER_PROTOCOL_MAX_FEATURE_LENGTH = 128;
const WORKER_TRANSCRIPT_MAX_BATCH_MESSAGES = 64;
const WORKER_TRANSCRIPT_MAX_CONTENT_PARTS = 128;
const WORKER_TRANSCRIPT_MAX_JSON_DEPTH = 32;
const WORKER_SESSION_TOOL_MAX_TEXT_LENGTH = 8 * 1024;
const WORKER_PROVIDER_REPLAY_MAX_DATA_BYTES = WORKER_PROTOCOL_MAX_PAYLOAD_BYTES;
const WorkerCredentialSchema = Type.String({
	minLength: 16,
	maxLength: 256
});
const WorkerProtocolFeatureSchema = Type.String({
	minLength: 1,
	maxLength: 128
});
/** Build identity presented by a worker before the gateway admits it. */
const WorkerAdmissionHandshakeSchema = withSince("2026.7", closedObject({
	bundleHash: Type.String({
		minLength: 64,
		maxLength: 64,
		pattern: "^[a-f0-9]{64}$"
	}),
	openclawVersion: Type.String({
		minLength: 1,
		maxLength: 128
	}),
	protocolFeatures: Type.Array(WorkerProtocolFeatureSchema, {
		maxItems: 64,
		uniqueItems: true
	})
}));
const WorkerConnectAdmissionCommonProperties = {
	environmentId: WorkerIdentifierSchema,
	credential: WorkerCredentialSchema,
	ownerEpoch: Type.Integer({
		minimum: 0,
		maximum: Number.MAX_SAFE_INTEGER
	}),
	rpcSetVersion: Type.Integer({
		minimum: 1,
		maximum: Number.MAX_SAFE_INTEGER
	}),
	handshake: WorkerAdmissionHandshakeSchema
};
const WorkerConnectAdmissionSchema = Type.Union([closedObject({
	...WorkerConnectAdmissionCommonProperties,
	sessionId: Type.Null(),
	runId: Type.Null()
}), closedObject({
	...WorkerConnectAdmissionCommonProperties,
	sessionId: WorkerIdentifierSchema,
	runId: WorkerIdentifierSchema
})]);
/** Dedicated first-frame payload accepted only on the worker ingress. */
const WorkerConnectParamsSchema = closedObject({
	minProtocol: Type.Integer({ minimum: 1 }),
	maxProtocol: Type.Integer({ minimum: 1 }),
	client: closedObject({
		id: Type.Literal(GATEWAY_CLIENT_IDS.WORKER),
		version: Type.String({
			minLength: 1,
			maxLength: 128
		}),
		platform: Type.String({
			minLength: 1,
			maxLength: 128
		}),
		mode: Type.Literal(GATEWAY_CLIENT_MODES.WORKER)
	}),
	role: Type.Literal("worker"),
	admission: WorkerConnectAdmissionSchema
});
const WorkerConnectRequestFrameSchema = closedObject({
	type: Type.Literal("req"),
	id: WorkerFrameIdSchema,
	method: Type.Literal("connect"),
	params: WorkerConnectParamsSchema
});
/** Minimal admission response; workers never receive the general gateway snapshot. */
const WorkerHelloOkSchema = closedObject({
	type: Type.Literal("worker-hello-ok"),
	environmentId: WorkerIdentifierSchema,
	sessionId: Type.Union([WorkerIdentifierSchema, Type.Null()]),
	ownerEpoch: Type.Integer({
		minimum: 0,
		maximum: Number.MAX_SAFE_INTEGER
	}),
	rpcSetVersion: Type.Integer({
		minimum: 1,
		maximum: Number.MAX_SAFE_INTEGER
	}),
	protocolFeatures: Type.Array(WorkerProtocolFeatureSchema, {
		maxItems: 64,
		uniqueItems: true
	}),
	credentialExpiresAtMs: Type.Integer({ minimum: 0 }),
	policy: closedObject({
		heartbeatIntervalMs: Type.Integer({ minimum: 1 }),
		maxPayload: Type.Integer({ minimum: 1 })
	})
});
const WorkerAdmissionSuccessResponseFrameSchema = closedObject({
	type: Type.Literal("res"),
	id: WorkerFrameIdSchema,
	ok: Type.Literal(true),
	payload: WorkerHelloOkSchema
});
const WorkerAdmissionResponseFrameSchema = Type.Union([WorkerAdmissionSuccessResponseFrameSchema, WorkerErrorResponseFrameSchema]);
const WorkerStatusSchema = Type.Union([
	Type.Literal("ready"),
	Type.Literal("busy"),
	Type.Literal("draining")
]);
const WorkerHeartbeatParamsSchema = closedObject({
	sentAtMs: Type.Integer({ minimum: 0 }),
	status: WorkerStatusSchema
});
const WorkerHeartbeatResultSchema = closedObject({
	receivedAtMs: Type.Integer({ minimum: 0 }),
	status: Type.Literal("ok"),
	ownerEpoch: Type.Integer({
		minimum: 0,
		maximum: Number.MAX_SAFE_INTEGER
	})
});
const WorkerHeartbeatRequestFrameSchema = closedObject({
	type: Type.Literal("req"),
	id: WorkerFrameIdSchema,
	method: Type.Literal(WORKER_PROTOCOL_METHODS[0]),
	params: WorkerHeartbeatParamsSchema
});
const WorkerHeartbeatSuccessResponseFrameSchema = closedObject({
	type: Type.Literal("res"),
	id: WorkerFrameIdSchema,
	ok: Type.Literal(true),
	payload: WorkerHeartbeatResultSchema
});
const WorkerHeartbeatResponseFrameSchema = Type.Union([WorkerHeartbeatSuccessResponseFrameSchema, WorkerErrorResponseFrameSchema]);
const WorkerSessionToolCallIdSchema = Type.String({
	minLength: 1,
	maxLength: 256
});
const WorkerSessionsSpawnParamsSchema = closedObject({
	toolCallId: WorkerSessionToolCallIdSchema,
	task: Type.String({
		minLength: 1,
		maxLength: WORKER_SESSION_TOOL_MAX_TEXT_LENGTH
	}),
	label: Type.Optional(Type.String({
		minLength: 1,
		maxLength: 256
	})),
	agentId: Type.Optional(WorkerIdentifierSchema),
	model: Type.Optional(Type.String({
		minLength: 1,
		maxLength: 256
	})),
	runTimeoutSeconds: Type.Optional(Type.Integer({
		minimum: 0,
		maximum: 86400
	}))
});
const WorkerSessionsSendParamsSchema = closedObject({
	toolCallId: WorkerSessionToolCallIdSchema,
	sessionKey: Type.String({
		minLength: 1,
		maxLength: 1024
	}),
	message: Type.String({
		minLength: 1,
		maxLength: WORKER_SESSION_TOOL_MAX_TEXT_LENGTH
	}),
	timeoutSeconds: Type.Optional(Type.Integer({
		minimum: 0,
		maximum: 86400
	}))
});
const WorkerSessionToolResultSchema = closedObject({ resultJson: Type.String({
	minLength: 2,
	maxLength: WORKER_PROTOCOL_MAX_PAYLOAD_BYTES
}) });
const WorkerSessionsSpawnResponseFrameSchema = Type.Union([closedObject({
	type: Type.Literal("res"),
	id: WorkerFrameIdSchema,
	ok: Type.Literal(true),
	payload: WorkerSessionToolResultSchema
}), WorkerErrorResponseFrameSchema]);
const WorkerSessionsSendResponseFrameSchema = Type.Union([closedObject({
	type: Type.Literal("res"),
	id: WorkerFrameIdSchema,
	ok: Type.Literal(true),
	payload: WorkerSessionToolResultSchema
}), WorkerErrorResponseFrameSchema]);
const WorkerTranscriptTextContentSchema = closedObject({
	type: Type.Literal("text"),
	text: Type.String({ maxLength: WORKER_PROTOCOL_MAX_PAYLOAD_BYTES }),
	textSignature: Type.Optional(Type.String({
		minLength: 1,
		maxLength: WORKER_PROTOCOL_MAX_PAYLOAD_BYTES
	}))
});
const WorkerTranscriptThinkingContentSchema = closedObject({
	type: Type.Literal("thinking"),
	thinking: Type.String({ maxLength: WORKER_PROTOCOL_MAX_PAYLOAD_BYTES }),
	thinkingSignature: Type.Optional(Type.String({
		minLength: 1,
		maxLength: WORKER_PROTOCOL_MAX_PAYLOAD_BYTES
	})),
	redacted: Type.Optional(Type.Boolean())
});
const WorkerTranscriptImageContentSchema = closedObject({
	type: Type.Literal("image"),
	data: Type.String({
		minLength: 1,
		maxLength: WORKER_PROTOCOL_MAX_PAYLOAD_BYTES
	}),
	mimeType: Type.String({
		minLength: 1,
		maxLength: 256
	})
});
const WorkerTranscriptToolCallSchema = closedObject({
	type: Type.Literal("toolCall"),
	id: WorkerIdentifierSchema,
	name: WorkerIdentifierSchema,
	arguments: Type.Record(Type.String({
		minLength: 1,
		maxLength: 256
	}), Type.Unknown()),
	thoughtSignature: Type.Optional(Type.String({
		minLength: 1,
		maxLength: WORKER_PROTOCOL_MAX_PAYLOAD_BYTES
	})),
	executionMode: Type.Optional(Type.Union([Type.Literal("sequential"), Type.Literal("parallel")]))
});
const WorkerReplayHashSchema = Type.String({
	minLength: 2,
	maxLength: 16,
	pattern: "^[a-z0-9]+$"
});
const WorkerProviderReplayStateSchema = closedObject({
	v: Type.Literal(1),
	type: WorkerIdentifierSchema,
	id: Type.Optional(Type.String({
		minLength: 1,
		maxLength: WORKER_PROTOCOL_MAX_PAYLOAD_BYTES
	})),
	data: Type.String({
		minLength: 1,
		maxLength: WORKER_PROVIDER_REPLAY_MAX_DATA_BYTES
	}),
	replayIndex: Type.Optional(Type.Integer({
		minimum: 0,
		maximum: Number.MAX_SAFE_INTEGER
	})),
	provider: WorkerIdentifierSchema,
	api: WorkerIdentifierSchema,
	model: WorkerIdentifierSchema,
	baseUrlHash: Type.Optional(WorkerReplayHashSchema),
	sessionHash: Type.Optional(WorkerReplayHashSchema),
	authProfileHash: Type.Optional(WorkerReplayHashSchema)
});
const WorkerTranscriptUserMessageSchema = closedObject({
	role: Type.Literal("user"),
	content: Type.Array(Type.Union([WorkerTranscriptTextContentSchema, WorkerTranscriptImageContentSchema]), {
		minItems: 1,
		maxItems: 128
	}),
	timestamp: Type.Integer({ minimum: 0 })
});
const WorkerTranscriptAssistantMessageSchema = closedObject({
	role: Type.Literal("assistant"),
	content: Type.Array(Type.Union([
		WorkerTranscriptTextContentSchema,
		WorkerTranscriptThinkingContentSchema,
		WorkerTranscriptToolCallSchema
	]), { maxItems: 128 }),
	api: WorkerIdentifierSchema,
	provider: WorkerIdentifierSchema,
	model: WorkerIdentifierSchema,
	responseModel: Type.Optional(WorkerIdentifierSchema),
	responseId: Type.Optional(WorkerIdentifierSchema),
	providerReplay: Type.Optional(WorkerProviderReplayStateSchema),
	diagnostics: Type.Optional(Type.Array(WorkerTranscriptAssistantDiagnosticSchema, { maxItems: 128 })),
	usage: WorkerTranscriptUsageSchema,
	stopReason: Type.Union([
		Type.Literal("stop"),
		Type.Literal("length"),
		Type.Literal("toolUse"),
		Type.Literal("error"),
		Type.Literal("aborted")
	]),
	errorMessage: Type.Optional(Type.String({ maxLength: WORKER_PROTOCOL_MAX_PAYLOAD_BYTES })),
	errorCode: Type.Optional(Type.String({ maxLength: 256 })),
	errorType: Type.Optional(Type.String({ maxLength: 256 })),
	errorBody: Type.Optional(Type.String({ maxLength: WORKER_PROTOCOL_MAX_PAYLOAD_BYTES })),
	timestamp: Type.Integer({ minimum: 0 })
});
const WorkerTranscriptToolResultMessageSchema = closedObject({
	role: Type.Literal("toolResult"),
	toolCallId: WorkerIdentifierSchema,
	toolName: WorkerIdentifierSchema,
	content: Type.Array(Type.Union([WorkerTranscriptTextContentSchema, WorkerTranscriptImageContentSchema]), { maxItems: 128 }),
	details: Type.Optional(Type.Unknown()),
	isError: Type.Boolean(),
	timestamp: Type.Integer({ minimum: 0 })
});
const WorkerTranscriptMessageSchema = Type.Union([
	WorkerTranscriptUserMessageSchema,
	WorkerTranscriptAssistantMessageSchema,
	WorkerTranscriptToolResultMessageSchema
]);
const WorkerTranscriptCommitParamsSchema = closedObject({
	runEpoch: Type.Integer({
		minimum: 0,
		maximum: Number.MAX_SAFE_INTEGER
	}),
	seq: Type.Integer({
		minimum: 1,
		maximum: Number.MAX_SAFE_INTEGER
	}),
	baseLeafId: Type.Union([WorkerIdentifierSchema, Type.Null()]),
	messages: Type.Array(WorkerTranscriptMessageSchema, {
		minItems: 1,
		maxItems: 64
	})
});
const WorkerTranscriptCommitResultSchema = closedObject({
	entryIds: Type.Array(WorkerIdentifierSchema, {
		minItems: 1,
		maxItems: 64
	}),
	newLeafId: WorkerIdentifierSchema
});
const WorkerTranscriptCommitErrorReasonSchema = Type.Union([
	Type.Literal("stale-base-leaf"),
	Type.Literal("epoch-mismatch"),
	Type.Literal("invalid-batch"),
	Type.Literal("session-not-attached")
]);
const WorkerTranscriptCommitErrorShapeSchema = closedObject({
	code: Type.Literal("INVALID_REQUEST"),
	message: Type.String({
		minLength: 1,
		maxLength: 256
	}),
	details: closedObject({ reason: WorkerTranscriptCommitErrorReasonSchema })
});
const WorkerTranscriptCommitRequestFrameSchema = closedObject({
	type: Type.Literal("req"),
	id: WorkerFrameIdSchema,
	method: Type.Literal(WORKER_PROTOCOL_METHODS[1]),
	params: WorkerTranscriptCommitParamsSchema
});
const WorkerTranscriptCommitSuccessResponseFrameSchema = closedObject({
	type: Type.Literal("res"),
	id: WorkerFrameIdSchema,
	ok: Type.Literal(true),
	payload: WorkerTranscriptCommitResultSchema
});
const WorkerTranscriptCommitErrorResponseFrameSchema = closedObject({
	type: Type.Literal("res"),
	id: WorkerFrameIdSchema,
	ok: Type.Literal(false),
	error: WorkerTranscriptCommitErrorShapeSchema
});
const WorkerTranscriptCommitResponseFrameSchema = Type.Union([
	WorkerTranscriptCommitSuccessResponseFrameSchema,
	WorkerTranscriptCommitErrorResponseFrameSchema,
	WorkerErrorResponseFrameSchema
]);
function workerLiveObject(properties) {
	return closedObject(properties);
}
const OptionalLiveTextSchema = Type.Optional(LiveTextSchema);
const OptionalLiveIntegerSchema = Type.Optional(LiveIntegerSchema);
const LiveIdentifierSchema = Type.String({
	minLength: 1,
	maxLength: WORKER_PROTOCOL_MAX_PAYLOAD_BYTES,
	pattern: "^\\S(?:.*\\S)?$"
});
const WorkerLiveAssistantPayloadSchema = workerLiveObject({
	text: LiveTextSchema,
	delta: LiveTextSchema,
	replace: Type.Optional(Type.Literal(true)),
	mediaUrls: Type.Optional(Type.Array(LiveIdentifierSchema, { maxItems: 128 })),
	phase: Type.Optional(Type.Union([Type.Literal("commentary"), Type.Literal("final_answer")])),
	itemId: Type.Optional(WorkerIdentifierSchema)
});
const WorkerLiveThinkingPayloadSchema = workerLiveObject({
	text: LiveTextSchema,
	delta: LiveTextSchema
});
const WorkerLiveToolCommonProperties = {
	name: WorkerIdentifierSchema,
	toolCallId: WorkerIdentifierSchema,
	hideFromChannelProgress: Type.Optional(Type.Literal(true))
};
const WorkerLiveToolPayloadSchema = Type.Union([
	workerLiveObject({
		...WorkerLiveToolCommonProperties,
		phase: Type.Literal("start"),
		args: Type.Unknown()
	}),
	workerLiveObject({
		...WorkerLiveToolCommonProperties,
		phase: Type.Literal("update"),
		partialResult: Type.Unknown()
	}),
	workerLiveObject({
		...WorkerLiveToolCommonProperties,
		phase: Type.Literal("result"),
		meta: OptionalLiveTextSchema,
		isError: Type.Boolean(),
		result: Type.Unknown(),
		toolErrorSummary: OptionalLiveTextSchema
	})
]);
const WorkerLiveApprovalCommonProperties = {
	kind: Type.Union([
		Type.Literal("exec"),
		Type.Literal("plugin"),
		Type.Literal("unknown")
	]),
	title: LiveTextSchema,
	itemId: Type.Optional(WorkerIdentifierSchema),
	toolCallId: Type.Optional(WorkerIdentifierSchema),
	approvalId: Type.Optional(WorkerIdentifierSchema),
	approvalSlug: Type.Optional(WorkerIdentifierSchema),
	command: OptionalLiveTextSchema,
	host: OptionalLiveTextSchema,
	reason: OptionalLiveTextSchema,
	scope: Type.Optional(Type.Union([Type.Literal("turn"), Type.Literal("session")])),
	message: OptionalLiveTextSchema
};
const WorkerLiveApprovalPayloadSchema = Type.Union([workerLiveObject({
	...WorkerLiveApprovalCommonProperties,
	phase: Type.Literal("requested"),
	status: Type.Union([Type.Literal("pending"), Type.Literal("unavailable")])
}), workerLiveObject({
	...WorkerLiveApprovalCommonProperties,
	phase: Type.Literal("resolved"),
	status: Type.Union([
		Type.Literal("approved"),
		Type.Literal("denied"),
		Type.Literal("failed")
	])
})]);
const WorkerLiveLifecycleStartPayloadSchema = workerLiveObject({
	phase: Type.Literal("start"),
	startedAt: LiveIntegerSchema
});
const WorkerLiveFallbackAttemptSchema = workerLiveObject({
	provider: LiveIdentifierSchema,
	model: LiveIdentifierSchema,
	error: LiveTextSchema,
	reason: Type.Optional(FailoverReasonSchema),
	authMode: Type.Optional(LiveIdentifierSchema),
	status: OptionalLiveIntegerSchema,
	code: Type.Optional(Type.String({
		minLength: 1,
		maxLength: WORKER_PROTOCOL_MAX_PAYLOAD_BYTES
	}))
});
const WorkerLiveFallbackCommonProperties = {
	selectedProvider: LiveIdentifierSchema,
	selectedModel: LiveIdentifierSchema,
	activeProvider: LiveIdentifierSchema,
	activeModel: LiveIdentifierSchema
};
const WorkerLiveLifecycleFallbackPayloadSchema = workerLiveObject({
	...WorkerLiveFallbackCommonProperties,
	phase: Type.Literal("fallback"),
	reasonSummary: LiveTextSchema,
	attemptSummaries: Type.Array(LiveTextSchema, { maxItems: 128 }),
	attempts: Type.Array(WorkerLiveFallbackAttemptSchema, { maxItems: 128 })
});
const WorkerLiveLifecycleFallbackClearedPayloadSchema = workerLiveObject({
	...WorkerLiveFallbackCommonProperties,
	phase: Type.Literal("fallback_cleared"),
	previousActiveModel: Type.Optional(LiveIdentifierSchema)
});
const WorkerLiveLifecycleFallbackStepPayloadSchema = workerLiveObject({
	phase: Type.Literal("fallback_step"),
	fallbackStepType: Type.Literal("fallback_step"),
	fallbackStepFromModel: LiveIdentifierSchema,
	fallbackStepToModel: Type.Optional(LiveIdentifierSchema),
	fallbackStepFromFailureReason: Type.Optional(FailoverReasonSchema),
	fallbackStepFromFailureDetail: OptionalLiveTextSchema,
	fallbackStepChainPosition: OptionalLiveIntegerSchema,
	fallbackStepFinalOutcome: Type.Union([
		Type.Literal("next_fallback"),
		Type.Literal("succeeded"),
		Type.Literal("chain_exhausted")
	])
});
const WorkerLiveLifecycleTerminalCommonProperties = {
	startedAt: OptionalLiveIntegerSchema,
	endedAt: LiveIntegerSchema,
	stopReason: Type.Optional(WorkerIdentifierSchema),
	yielded: Type.Optional(Type.Literal(true)),
	timeoutPhase: Type.Optional(Type.Union([
		Type.Literal("queue"),
		Type.Literal("preflight"),
		Type.Literal("provider"),
		Type.Literal("post_turn"),
		Type.Literal("gateway_draining")
	])),
	providerStarted: Type.Optional(Type.Boolean()),
	aborted: Type.Optional(Type.Boolean()),
	toolErrorSummary: OptionalLiveTextSchema,
	livenessState: Type.Optional(Type.Union([
		Type.Literal("working"),
		Type.Literal("paused"),
		Type.Literal("blocked"),
		Type.Literal("abandoned")
	])),
	replayInvalid: Type.Optional(Type.Literal(true))
};
const WorkerLiveLifecycleTerminalPayloadSchema = Type.Union([
	workerLiveObject({
		...WorkerLiveLifecycleTerminalCommonProperties,
		phase: Type.Literal("finishing"),
		error: OptionalLiveTextSchema
	}),
	workerLiveObject({
		...WorkerLiveLifecycleTerminalCommonProperties,
		phase: Type.Literal("end")
	}),
	workerLiveObject({
		...WorkerLiveLifecycleTerminalCommonProperties,
		phase: Type.Literal("error"),
		error: LiveTextSchema,
		fallbackExhaustedFailure: Type.Optional(Type.Literal(true))
	})
]);
const WorkerLiveLifecyclePayloadSchema = Type.Union([
	WorkerLiveLifecycleStartPayloadSchema,
	WorkerLiveLifecycleFallbackPayloadSchema,
	WorkerLiveLifecycleFallbackClearedPayloadSchema,
	WorkerLiveLifecycleFallbackStepPayloadSchema,
	WorkerLiveLifecycleTerminalPayloadSchema
]);
const WorkerLiveEventSchema = Type.Union([
	workerLiveObject({
		kind: Type.Literal("assistant"),
		payload: WorkerLiveAssistantPayloadSchema
	}),
	workerLiveObject({
		kind: Type.Literal("thinking"),
		payload: WorkerLiveThinkingPayloadSchema
	}),
	workerLiveObject({
		kind: Type.Literal("tool"),
		payload: WorkerLiveToolPayloadSchema
	}),
	workerLiveObject({
		kind: Type.Literal("approval"),
		payload: WorkerLiveApprovalPayloadSchema
	}),
	workerLiveObject({
		kind: Type.Literal("lifecycle"),
		payload: WorkerLiveLifecyclePayloadSchema
	})
]);
const WorkerLiveEventParamsSchema = workerLiveObject({
	runEpoch: LiveIntegerSchema,
	lastAckedSeq: LiveIntegerSchema,
	seq: LiveSequenceSchema,
	runId: WorkerIdentifierSchema,
	event: WorkerLiveEventSchema
});
const WorkerLiveEventResultSchema = workerLiveObject({ ackedSeq: LiveIntegerSchema });
const WorkerLiveEventErrorDetailsSchema = Type.Union([workerLiveObject({ reason: Type.Union([
	Type.Literal("epoch-mismatch"),
	Type.Literal("session-not-attached"),
	Type.Literal("invalid-event"),
	Type.Literal("capacity-exceeded")
]) }), workerLiveObject({
	reason: Type.Literal("resync-required"),
	ackedSeq: LiveIntegerSchema,
	expectedSeq: LiveSequenceSchema
})]);
const WorkerLiveEventErrorShapeSchema = workerLiveObject({
	code: Type.Literal("INVALID_REQUEST"),
	message: Type.String({
		minLength: 1,
		maxLength: 256
	}),
	details: WorkerLiveEventErrorDetailsSchema
});
const WorkerLiveEventRequestFrameSchema = workerLiveObject({
	type: Type.Literal("req"),
	id: WorkerFrameIdSchema,
	method: Type.Literal(WORKER_PROTOCOL_METHODS[2]),
	params: WorkerLiveEventParamsSchema
});
const WorkerLiveEventSuccessResponseFrameSchema = workerLiveObject({
	type: Type.Literal("res"),
	id: WorkerFrameIdSchema,
	ok: Type.Literal(true),
	payload: WorkerLiveEventResultSchema
});
const WorkerLiveEventErrorResponseFrameSchema = workerLiveObject({
	type: Type.Literal("res"),
	id: WorkerFrameIdSchema,
	ok: Type.Literal(false),
	error: WorkerLiveEventErrorShapeSchema
});
const WorkerLiveEventResponseFrameSchema = Type.Union([
	WorkerLiveEventSuccessResponseFrameSchema,
	WorkerLiveEventErrorResponseFrameSchema,
	WorkerErrorResponseFrameSchema
]);
//#endregion
export { WorkerFrameIdSchema as $, WorkerLiveEventSchema as A, WorkerTranscriptCommitRequestFrameSchema as B, WorkerHeartbeatResponseFrameSchema as C, WorkerLiveEventRequestFrameSchema as D, WorkerLiveEventParamsSchema as E, WorkerSessionsSpawnParamsSchema as F, LiveSequenceSchema as G, WorkerTranscriptCommitResultSchema as H, WorkerSessionsSpawnResponseFrameSchema as I, WORKER_PROTOCOL_MAX_IDENTIFIER_LENGTH as J, LiveTextSchema as K, WorkerTranscriptCommitErrorReasonSchema as L, WorkerSessionToolResultSchema as M, WorkerSessionsSendParamsSchema as N, WorkerLiveEventResponseFrameSchema as O, WorkerSessionsSendResponseFrameSchema as P, WorkerErrorResponseFrameSchema as Q, WorkerTranscriptCommitErrorShapeSchema as R, WorkerHeartbeatRequestFrameSchema as S, WorkerLiveEventErrorShapeSchema as T, WorkerTranscriptMessageSchema as U, WorkerTranscriptCommitResponseFrameSchema as V, LiveIntegerSchema as W, WORKER_PUBLIC_INGRESS_PATH as X, WORKER_PROTOCOL_MAX_PAYLOAD_BYTES as Y, WorkerAdmissionFailureReasonSchema as Z, WORKER_TRANSCRIPT_MAX_JSON_DEPTH as _, WORKER_PROTOCOL_FEATURES as a, withSince as at, WorkerConnectRequestFrameSchema as b, WORKER_PROTOCOL_MAX_METHOD_LENGTH as c, WORKER_RPC_SET_VERSION as d, WorkerIdentifierSchema as et, WORKER_SESSION_TOOLS_PROTOCOL_FEATURE as f, WORKER_TRANSCRIPT_MAX_CONTENT_PARTS as g, WORKER_TRANSCRIPT_MAX_BATCH_MESSAGES as h, WORKER_LIVE_EVENT_PROTOCOL_FEATURE as i, FailoverReasonSchema as it, WorkerProviderReplayStateSchema as j, WorkerLiveEventResultSchema as k, WORKER_PROTOCOL_METHODS as l, WORKER_TRANSCRIPT_COMMIT_PROTOCOL_FEATURE as m, WORKER_HEARTBEAT_INTERVAL_MS as n, WorkerTranscriptAssistantDiagnosticSchema as nt, WORKER_PROTOCOL_MAX_FEATURES as o, WORKER_SESSION_TOOL_MAX_TEXT_LENGTH as p, WORKER_PROTOCOL_MAX_FRAME_ID_LENGTH as q, WORKER_LAUNCH_V2_PROTOCOL_FEATURE as r, WorkerTranscriptUsageSchema as rt, WORKER_PROTOCOL_MAX_FEATURE_LENGTH as s, WORKER_EXECUTION_CONTEXT_PROTOCOL_FEATURE as t, WorkerProtocolCloseReasonSchema as tt, WORKER_PROVIDER_REPLAY_MAX_DATA_BYTES as u, WorkerAdmissionHandshakeSchema as v, WorkerLiveEventErrorDetailsSchema as w, WorkerHeartbeatParamsSchema as x, WorkerAdmissionResponseFrameSchema as y, WorkerTranscriptCommitParamsSchema as z };
