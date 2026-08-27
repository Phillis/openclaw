import { n as inspectSessionBindingByConversation } from "../session-binding-service-B0hkzhLM.js";
//#region src/plugin-sdk/conversation-binding-inspection-runtime.ts
/**
* Inspect current-conversation binding state without refreshing binding liveness.
* `unavailable` is distinct from an authoritative empty binding result.
*/
function inspectConversationBinding(conversation) {
	return inspectSessionBindingByConversation(conversation);
}
//#endregion
export { inspectConversationBinding };
