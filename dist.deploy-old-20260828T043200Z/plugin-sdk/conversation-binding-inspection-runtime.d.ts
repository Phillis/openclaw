import { n as ConversationRef, o as SessionBindingRecord } from "../session-binding.types-iPttD8T3.js";
//#region src/plugin-sdk/conversation-binding-inspection-runtime.d.ts
/** Read-only result from the authoritative current-conversation binding store. */
type ConversationBindingInspection = {
  status: "available";
  binding: SessionBindingRecord | null;
} | {
  status: "unavailable";
};
/**
 * Inspect current-conversation binding state without refreshing binding liveness.
 * `unavailable` is distinct from an authoritative empty binding result.
 */
declare function inspectConversationBinding(conversation: ConversationRef): ConversationBindingInspection;
//#endregion
export { ConversationBindingInspection, inspectConversationBinding };