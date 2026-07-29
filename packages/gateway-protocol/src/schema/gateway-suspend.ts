// Gateway Protocol schemas for cooperative host suspension.
import type { Static } from "typebox";
import { Type } from "typebox";
import { closedObject } from "./closed-object.js";

const SuspensionTokenSchema = Type.String({ minLength: 1, maxLength: 128, pattern: "\\S" });
const Sha256Schema = Type.String({ pattern: "^[a-f0-9]{64}$" });
const ReleaseRequestIdSchema = Type.String({
  pattern: "^handoff-v2-release:[a-f0-9]{32}$",
});
const CountSchema = Type.Integer({ minimum: 0 });
const PositiveCountSchema = Type.Integer({ minimum: 1 });

export const GATEWAY_SUSPEND_MODE_LEGACY = "legacy-auto-expire/v1";
export const GATEWAY_SUSPEND_MODE_DURABLE = "handoff-durable-hold/v1";
export const GatewaySuspendModeSchema = Type.Union([
  Type.Literal(GATEWAY_SUSPEND_MODE_LEGACY),
  Type.Literal(GATEWAY_SUSPEND_MODE_DURABLE),
]);

export const GatewaySuspendTaskBlockerSchema = closedObject({
  taskId: Type.String(),
  status: Type.Literal("running"),
  runtime: Type.Union([
    Type.Literal("subagent"),
    Type.Literal("acp"),
    Type.Literal("cli"),
    Type.Literal("cron"),
  ]),
  runId: Type.Optional(Type.String()),
  label: Type.Optional(Type.String()),
  title: Type.Optional(Type.String()),
});

export const GatewaySuspendBlockerSchema = closedObject({
  kind: Type.Union([
    Type.Literal("queue"),
    Type.Literal("reply"),
    Type.Literal("embedded-run"),
    Type.Literal("background-exec"),
    Type.Literal("cron-run"),
    Type.Literal("task"),
    Type.Literal("root-request"),
    Type.Literal("session-admission"),
    Type.Literal("session-mutation"),
    Type.Literal("chat-run"),
    Type.Literal("queued-turn"),
    Type.Literal("terminal-persistence"),
    Type.Literal("terminal-session"),
  ]),
  count: CountSchema,
  message: Type.String(),
  task: Type.Optional(GatewaySuspendTaskBlockerSchema),
});

export const GatewaySuspendPrepareParamsSchema = closedObject({
  requestId: SuspensionTokenSchema,
  suspensionId: Type.Optional(SuspensionTokenSchema),
  gatewayInstanceId: Type.Optional(SuspensionTokenSchema),
  gatewayPid: PositiveCountSchema,
  launchdRunCount: PositiveCountSchema,
  suspendMode: Type.Optional(GatewaySuspendModeSchema),
});

export const GatewaySuspendPrepareBusyResultSchema = closedObject({
  status: Type.Literal("busy"),
  reason: Type.Union([Type.Literal("active-work"), Type.Literal("gateway-draining")]),
  retryAfterMs: CountSchema,
  activeCount: CountSchema,
  blockers: Type.Array(GatewaySuspendBlockerSchema),
});

export const GatewaySuspendPrepareReadyResultSchema = closedObject({
  status: Type.Literal("ready"),
  suspensionId: SuspensionTokenSchema,
  gatewayInstanceId: SuspensionTokenSchema,
  gatewayPid: PositiveCountSchema,
  launchdRunCount: PositiveCountSchema,
  expiresAtMs: CountSchema,
  suspendMode: GatewaySuspendModeSchema,
  activeCount: CountSchema,
  blockers: Type.Array(GatewaySuspendBlockerSchema),
});

export const GatewaySuspendPrepareResultSchema = Type.Union([
  GatewaySuspendPrepareBusyResultSchema,
  GatewaySuspendPrepareReadyResultSchema,
]);

export const GatewaySuspendActiveStatusParamsSchema = closedObject({
  suspensionId: SuspensionTokenSchema,
  gatewayInstanceId: SuspensionTokenSchema,
  suspendMode: Type.Optional(GatewaySuspendModeSchema),
});

export const GatewaySuspendReleaseStatusParamsSchema = closedObject({
  releaseRequestId: ReleaseRequestIdSchema,
  releaseAuthoritySha256: Sha256Schema,
  suspendMode: Type.Literal(GATEWAY_SUSPEND_MODE_DURABLE),
});

export const GatewaySuspendStatusParamsSchema = Type.Union([
  GatewaySuspendActiveStatusParamsSchema,
  GatewaySuspendReleaseStatusParamsSchema,
]);

export const GatewaySuspendStatusRunningResultSchema = closedObject({
  status: Type.Literal("running"),
  gatewayInstanceId: SuspensionTokenSchema,
  suspendMode: GatewaySuspendModeSchema,
});

export const GatewaySuspendStatusReadyResultSchema = closedObject({
  status: Type.Literal("ready"),
  gatewayInstanceId: SuspensionTokenSchema,
  expiresAtMs: CountSchema,
  suspendMode: GatewaySuspendModeSchema,
});

const GatewaySuspendReleaseBindingSchema = {
  schema: Type.Literal("openclaw-gateway-suspend-release/v1"),
  releaseRequestId: ReleaseRequestIdSchema,
  releaseAuthoritySha256: Sha256Schema,
  suspendRequestId: SuspensionTokenSchema,
  suspensionId: SuspensionTokenSchema,
  gatewayInstanceId: SuspensionTokenSchema,
  gatewayPid: PositiveCountSchema,
  launchdRunCount: PositiveCountSchema,
  suspendMode: Type.Literal(GATEWAY_SUSPEND_MODE_DURABLE),
  resumeBeforeMs: CountSchema,
  committedAtMs: CountSchema,
  requiredAdmissionReopened: Type.Literal(true),
  requiredSchedulerReopened: Type.Literal(true),
  nonReusable: Type.Literal(true),
};

export const GatewaySuspendReleaseCommittedReceiptSchema = closedObject({
  ...GatewaySuspendReleaseBindingSchema,
  status: Type.Literal("release_committed"),
});

export const GatewaySuspendReleaseCompletedReceiptSchema = closedObject({
  ...GatewaySuspendReleaseBindingSchema,
  status: Type.Literal("release_completed"),
  completedAtMs: CountSchema,
  admissionReopened: Type.Literal(true),
  schedulerReopened: Type.Literal(true),
});

export const GatewaySuspendReleaseReceiptSchema = Type.Union([
  GatewaySuspendReleaseCommittedReceiptSchema,
  GatewaySuspendReleaseCompletedReceiptSchema,
]);

export const GatewaySuspendReleaseRecoveryNeededResultSchema = closedObject({
  status: Type.Literal("release_recovery_needed"),
  retryAfterMs: CountSchema,
  releaseReceipt: GatewaySuspendReleaseCommittedReceiptSchema,
});

export const GatewaySuspendStatusResultSchema = Type.Union([
  GatewaySuspendStatusRunningResultSchema,
  GatewaySuspendStatusReadyResultSchema,
  GatewaySuspendReleaseCommittedReceiptSchema,
  GatewaySuspendReleaseCompletedReceiptSchema,
  GatewaySuspendReleaseRecoveryNeededResultSchema,
]);

export const GatewaySuspendLegacyResumeParamsSchema = closedObject({
  suspensionId: SuspensionTokenSchema,
  gatewayInstanceId: SuspensionTokenSchema,
  resumeBeforeMs: CountSchema,
  suspendMode: Type.Optional(Type.Literal(GATEWAY_SUSPEND_MODE_LEGACY)),
});

export const GatewaySuspendDurableResumeParamsSchema = closedObject({
  suspensionId: SuspensionTokenSchema,
  gatewayInstanceId: SuspensionTokenSchema,
  resumeBeforeMs: CountSchema,
  suspendMode: Type.Literal(GATEWAY_SUSPEND_MODE_DURABLE),
  releaseRequestId: ReleaseRequestIdSchema,
  releaseAuthoritySha256: Sha256Schema,
});

export const GatewaySuspendResumeParamsSchema = Type.Union([
  GatewaySuspendLegacyResumeParamsSchema,
  GatewaySuspendDurableResumeParamsSchema,
]);

export const GatewaySuspendLegacyResumeResultSchema = closedObject({
  ok: Type.Literal(true),
  status: Type.Literal("running"),
  resumed: Type.Boolean(),
  gatewayInstanceId: SuspensionTokenSchema,
  suspendMode: Type.Literal(GATEWAY_SUSPEND_MODE_LEGACY),
});

export const GatewaySuspendDurableResumeResultSchema = closedObject({
  ok: Type.Literal(true),
  status: Type.Literal("running"),
  resumed: Type.Boolean(),
  gatewayInstanceId: SuspensionTokenSchema,
  suspendMode: Type.Literal(GATEWAY_SUSPEND_MODE_DURABLE),
  releaseReceipt: GatewaySuspendReleaseCompletedReceiptSchema,
});

export const GatewaySuspendResumeResultSchema = Type.Union([
  GatewaySuspendLegacyResumeResultSchema,
  GatewaySuspendDurableResumeResultSchema,
]);

// Wire types derive directly from local schema consts so public d.ts graphs never
// pull in the ProtocolSchemas registry.
export type GatewaySuspendTaskBlocker = Static<typeof GatewaySuspendTaskBlockerSchema>;
export type GatewaySuspendBlocker = Static<typeof GatewaySuspendBlockerSchema>;
export type GatewaySuspendMode = Static<typeof GatewaySuspendModeSchema>;
export type GatewaySuspendReleaseCommittedReceipt = Static<
  typeof GatewaySuspendReleaseCommittedReceiptSchema
>;
export type GatewaySuspendReleaseCompletedReceipt = Static<
  typeof GatewaySuspendReleaseCompletedReceiptSchema
>;
export type GatewaySuspendReleaseReceipt = Static<typeof GatewaySuspendReleaseReceiptSchema>;
export type GatewaySuspendReleaseStatusParams = Static<
  typeof GatewaySuspendReleaseStatusParamsSchema
>;
export type GatewaySuspendPrepareParams = Static<typeof GatewaySuspendPrepareParamsSchema>;
export type GatewaySuspendPrepareResult = Static<typeof GatewaySuspendPrepareResultSchema>;
export type GatewaySuspendStatusParams = Static<typeof GatewaySuspendStatusParamsSchema>;
export type GatewaySuspendStatusResult = Static<typeof GatewaySuspendStatusResultSchema>;
export type GatewaySuspendResumeParams = Static<typeof GatewaySuspendResumeParamsSchema>;
export type GatewaySuspendResumeResult = Static<typeof GatewaySuspendResumeResultSchema>;
