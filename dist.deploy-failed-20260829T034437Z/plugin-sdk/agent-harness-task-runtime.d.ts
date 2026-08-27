import "../types.core-Cp9FLfUP.js";
import "../types-BdTyUrVT.js";
import "../types.openclaw-BssW6c46.js";
import "../types-Kt4lh6nX.js";
import "../input-provenance-tG11qAd-.js";
import "../index-Be5VqmCY.js";
import { t as DeliveryContext } from "../delivery-context.types-D9JsPwhy.js";
import "../types.public-B6kp1nO6.js";
import { Hr as DetachedTaskLifecycleRuntime, Ur as TaskRecord, Vr as DetachedTaskFinalizeParams, Wr as GatewayContextResolver, r as AgentHarnessTaskRuntimeScope, ri as AgentInternalEvent } from "../types-CiLdD6DO.js";
import "../config-dyztAPSU.js";
import "../bundle-mcp-DF3euytK.js";
import "../deliver-contracts-Crp5klYL.js";
import "../sessions-6q8pRxwr.js";
import "../session-manager-Dxs2hJ-i.js";
import "../call-Dz7phXol.js";
//#region src/agents/subagents/announce/subagent-announce-dispatch.d.ts
/**
 * Subagent announcement dispatch strategy.
 *
 * Completion handoff and requester-visible replies use this to choose between
 * steering a subagent and directly delivering a message, with phase evidence.
 */
type SubagentDeliveryPath = "steered" | "direct" | "queued" | "none";
type SubagentAnnounceDeliveryDisposition = "delivered" | "session_queued" | "intentional_non_delivery" | "retryable" | "ambiguous" | "permanent_failure";
/** Stable reasons an announcement delivery can fail without throwing. */
type SubagentAnnounceDeliveryFailureReason = "completion_handoff_pending" | "completion_handoff_unavailable" | "generated_media_missing" | "message_tool_delivery_missing" | "requester_abandoned" | "source_owner_changed" | "steer_dropped" | "visible_reply_missing";
/** Result of trying to deliver a subagent announcement. */
type SubagentAnnounceDeliveryResult = {
  delivered: boolean;
  path: SubagentDeliveryPath;
  deliveredAt?: number;
  enqueuedAt?: number;
  /** Direct completion that already sent the yielded requester's visible final. */
  requesterVisibleFinalDelivered?: true;
  reason?: SubagentAnnounceDeliveryFailureReason;
  error?: string;
  terminal?: boolean;
  disposition?: SubagentAnnounceDeliveryDisposition;
  missingMediaUrls?: string[];
  phases?: SubagentAnnounceDispatchPhaseResult[];
};
type SubagentAnnounceDispatchPhase = "steer-primary" | "direct-primary" | "steer-fallback";
type SubagentAnnounceDispatchPhaseResult = {
  phase: SubagentAnnounceDispatchPhase;
  delivered: boolean;
  path: SubagentDeliveryPath;
  deliveredAt?: number;
  enqueuedAt?: number;
  reason?: SubagentAnnounceDeliveryFailureReason;
  error?: string;
};
//#endregion
//#region src/agents/subagents/announce/subagent-announce-delivery.d.ts
declare function deliverSubagentAnnouncement(params: {
  requesterSessionKey: string;
  requesterAgentId?: string;
  announceId?: string;
  triggerMessage: string;
  steerMessage: string;
  internalEvents?: AgentInternalEvent[];
  summaryLine?: string;
  requesterSessionOrigin?: DeliveryContext;
  requesterOrigin?: DeliveryContext;
  completionDirectOrigin?: DeliveryContext;
  directOrigin?: DeliveryContext;
  sourceSessionKey?: string;
  sourceRunId?: string;
  sourceChannel?: string;
  sourceTool?: string;
  isSourceSessionEffectsAllowed?: () => boolean;
  isCompletionOwnedByRequesterYield?: () => boolean;
  targetRequesterSessionKey: string;
  requesterIsSubagent: boolean;
  expectsCompletionMessage: boolean;
  requireDirectDelivery?: boolean;
  requireVisibleReply?: boolean;
  bestEffortDeliver?: boolean;
  directIdempotencyKey: string;
  onDeliveryResult?: (delivery: SubagentAnnounceDeliveryResult) => void;
  signal?: AbortSignal;
  resolveGatewayContext?: GatewayContextResolver;
}): Promise<SubagentAnnounceDeliveryResult>;
//#endregion
//#region src/tasks/detached-task-runtime.d.ts
declare function createRunningTaskRun(...args: Parameters<DetachedTaskLifecycleRuntime["createRunningTaskRun"]>): ReturnType<DetachedTaskLifecycleRuntime["createRunningTaskRun"]>;
declare function recordTaskRunProgressByRunId(...args: Parameters<DetachedTaskLifecycleRuntime["recordTaskRunProgressByRunId"]>): ReturnType<DetachedTaskLifecycleRuntime["recordTaskRunProgressByRunId"]>;
declare function finalizeTaskRunByRunId(params: DetachedTaskFinalizeParams): TaskRecord[];
declare function setDetachedTaskDeliveryStatusByRunId(...args: Parameters<DetachedTaskLifecycleRuntime["setDetachedTaskDeliveryStatusByRunId"]>): ReturnType<DetachedTaskLifecycleRuntime["setDetachedTaskDeliveryStatusByRunId"]>;
//#endregion
//#region src/plugin-sdk/agent-harness-task-runtime.d.ts
type AgentHarnessTaskRuntimeId = Parameters<typeof createRunningTaskRun>[0]["runtime"];
type CreateRunningTaskRunParams = Parameters<typeof createRunningTaskRun>[0];
type RecordTaskRunProgressParams = Parameters<typeof recordTaskRunProgressByRunId>[0];
type FinalizeTaskRunParams = Parameters<typeof finalizeTaskRunByRunId>[0];
type SetDeliveryStatusParams = Parameters<typeof setDetachedTaskDeliveryStatusByRunId>[0];
/** Scope and naming options used to bind task operations to one requester session. */
type AgentHarnessTaskRuntimeScopeParams = {
  scope: AgentHarnessTaskRuntimeScope;
  runIdPrefix?: string;
} & ({
  runtime: Extract<AgentHarnessTaskRuntimeId, "subagent">;
  taskKind: string;
} | {
  runtime: Exclude<AgentHarnessTaskRuntimeId, "subagent">;
  taskKind?: string;
});
/** Create-task params with runtime and requester scope supplied by the scoped task runtime. */
type AgentHarnessScopedCreateRunningTaskRunParams = Omit<CreateRunningTaskRunParams, "runtime" | "taskKind" | "requesterSessionKey" | "ownerKey" | "scopeKind"> & {
  runId: string;
};
/** Progress params scoped to the requester session owned by the harness runtime. */
type AgentHarnessScopedRecordTaskRunProgressParams = Omit<RecordTaskRunProgressParams, "runtime" | "sessionKey">;
/** Finalization params scoped to the requester session owned by the harness runtime. */
type AgentHarnessScopedFinalizeTaskRunParams = Omit<FinalizeTaskRunParams, "runtime" | "sessionKey">;
/** Delivery-status params scoped to the requester session owned by the harness runtime. */
type AgentHarnessScopedSetDeliveryStatusParams = Omit<SetDeliveryStatusParams, "runtime" | "sessionKey">;
/** Scoped task runtime that prevents callers from mutating tasks outside their harness scope. */
type AgentHarnessTaskRuntime = {
  createRunningTaskRun(params: AgentHarnessScopedCreateRunningTaskRunParams): TaskRecord;
  tryCreateRunningTaskRun(params: AgentHarnessScopedCreateRunningTaskRunParams): TaskRecord | null;
  recordTaskRunProgressByRunId(params: AgentHarnessScopedRecordTaskRunProgressParams): TaskRecord[];
  finalizeTaskRunByRunId(params: AgentHarnessScopedFinalizeTaskRunParams): TaskRecord[];
  setDetachedTaskDeliveryStatusByRunId(params: AgentHarnessScopedSetDeliveryStatusParams): TaskRecord[];
  listTaskRecords(): TaskRecord[];
};
/** Completion states a harness task can report to its requester. */
type AgentHarnessCompletionStatus = "succeeded" | "failed" | "cancelled";
/** Delivery result returned after routing a harness task completion announcement. */
type AgentHarnessCompletionDelivery = Awaited<ReturnType<typeof deliverSubagentAnnouncement>>;
/** Creates a task runtime whose run ids and task records are constrained to one scope. */
declare function createAgentHarnessTaskRuntime(params: AgentHarnessTaskRuntimeScopeParams): AgentHarnessTaskRuntime;
/** Delivers a completed harness task result back to the requester or parent session. */
declare function deliverAgentHarnessTaskCompletion(params: {
  scope: AgentHarnessTaskRuntimeScope;
  childSessionKey: string;
  childSessionId: string;
  announceId: string;
  status: AgentHarnessCompletionStatus;
  statusLabel?: string;
  result: string;
  taskLabel?: string;
  announceType?: string;
  replyInstruction?: string;
  signal?: AbortSignal;
}): Promise<AgentHarnessCompletionDelivery>;
/** Returns true when completion delivery reached a persistent direct or steered path. */
declare function isDurableAgentHarnessCompletionDelivery(delivery: AgentHarnessCompletionDelivery): boolean;
//#endregion
export { AgentHarnessCompletionDelivery, AgentHarnessCompletionStatus, AgentHarnessScopedCreateRunningTaskRunParams, AgentHarnessScopedFinalizeTaskRunParams, AgentHarnessScopedRecordTaskRunProgressParams, AgentHarnessScopedSetDeliveryStatusParams, type TaskRecord as AgentHarnessTaskRecord, AgentHarnessTaskRuntime, type AgentHarnessTaskRuntimeScope, AgentHarnessTaskRuntimeScopeParams, createAgentHarnessTaskRuntime, deliverAgentHarnessTaskCompletion, isDurableAgentHarnessCompletionDelivery };