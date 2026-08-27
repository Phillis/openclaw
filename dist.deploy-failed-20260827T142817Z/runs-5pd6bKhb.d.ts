//#region src/agents/embedded-agent-runner/runs.d.ts
type EmbeddedAgentQueueFailureReason = "no_active_run" | "not_streaming" | "stale_run" | "compacting" | "tool_authority_mismatch" | "image_input_unsupported" | "source_reply_delivery_mode_mismatch" | "task_suggestion_delivery_mode_mismatch" | "transcript_commit_wait_unsupported" | "runtime_rejected";
type EmbeddedAgentQueueMessageOutcome = {
  queued: true;
  sessionId: string;
  target: "embedded_run" | "reply_run";
  gatewayHealth: "live"; /** Present only when acceptance was irreversible but transcript confirmation failed. */
  transcriptCommit?: "unconfirmed";
  errorMessage?: string;
  deliveredAtMs?: number;
  enqueuedAtMs?: number;
} | {
  queued: false;
  sessionId: string;
  reason: EmbeddedAgentQueueFailureReason;
  gatewayHealth: "live";
  errorMessage?: string;
};
//#endregion
export { EmbeddedAgentQueueMessageOutcome as t };