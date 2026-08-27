import { t as closedObject } from "./closed-object-DY9fiMP-.js";
import { Type } from "typebox";
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
export { WORKER_PROTOCOL_MAX_IDENTIFIER_LENGTH as a, WorkerAdmissionFailureReasonSchema as c, WorkerIdentifierSchema as d, WorkerProtocolCloseReasonSchema as f, WORKER_PROTOCOL_MAX_FRAME_ID_LENGTH as i, WorkerErrorResponseFrameSchema as l, WorkerTranscriptUsageSchema as m, LiveSequenceSchema as n, WORKER_PROTOCOL_MAX_PAYLOAD_BYTES as o, WorkerTranscriptAssistantDiagnosticSchema as p, LiveTextSchema as r, WORKER_PUBLIC_INGRESS_PATH as s, LiveIntegerSchema as t, WorkerFrameIdSchema as u };
