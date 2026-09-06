// Fork (2026.9.2 upgrade): chat-send admission binding-ownership check, split
// out of chat-send-admission.ts to stay within the oxlint max-lines budget.
// Behavior is unchanged.
import { createAbortError } from "../../infra/abort-signal.js";
import { getAgentEventLifecycleGeneration } from "../../infra/agent-events.js";
import {
  isChatAbortControllerEntryAbortable,
  type ChatAbortControllerEntry,
} from "../chat-abort.js";

/**
 * Revalidate that the live chat-send admission still owns its session binding
 * before committing a transcript-side effect: a lost abort-controller binding,
 * a stale gateway lifecycle generation, a drained work admission, or a
 * projected session terminal all mean this admission no longer owns the turn.
 */
export function assertChatSendAdmissionOwnsBinding(params: {
  currentAbortControllerBinding: unknown;
  sessionBinding: ChatAbortControllerEntry;
  lifecycleGeneration: string;
  acquiredGatewayWorkAdmission: { isActive(): boolean };
}): void {
  const { sessionBinding } = params;
  if (
    params.currentAbortControllerBinding !== sessionBinding ||
    params.lifecycleGeneration !== getAgentEventLifecycleGeneration() ||
    !params.acquiredGatewayWorkAdmission.isActive() ||
    !isChatAbortControllerEntryAbortable(sessionBinding) ||
    sessionBinding.registrationCleanupRequested ||
    sessionBinding.projectSessionActive === false ||
    sessionBinding.projectSessionTerminalPending ||
    sessionBinding.projectSessionTerminalPersisted
  ) {
    throw createAbortError("chat session preparation no longer owns its admission");
  }
}
