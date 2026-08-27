import { i as PluginConversationBindingResolutionDecision, n as PluginConversationBindingRequestParams, r as PluginConversationBindingRequestResult, t as PluginConversationBinding } from "./conversation-binding.types-DmwCs0ek.js";

//#region src/plugins/conversation-binding.d.ts
type PluginBindingApprovalDecision = PluginConversationBindingResolutionDecision;
type PluginBindingConversation = {
  channel: string;
  accountId: string;
  conversationId: string;
  parentConversationId?: string;
  threadId?: string | number;
};
type PendingPluginBindingRequest = {
  id: string;
  pluginId: string;
  pluginName?: string;
  pluginRoot: string;
  conversation: PluginBindingConversation;
  requestedBySenderId?: string;
  summary?: string;
  detachHint?: string;
  data?: Record<string, unknown>;
};
type PluginBindingApprovalAction = {
  approvalId: string;
  decision: PluginBindingApprovalDecision;
};
type PluginBindingResolveResult = {
  status: "approved";
  binding: PluginConversationBinding;
  request: PendingPluginBindingRequest;
  decision: Exclude<PluginBindingApprovalDecision, "deny">;
} | {
  status: "denied";
  request: PendingPluginBindingRequest;
} | {
  status: "expired";
};
declare function buildPluginBindingApprovalCustomId(approvalId: string, decision: PluginBindingApprovalDecision): string;
declare function parsePluginBindingApprovalCustomId(value: string): PluginBindingApprovalAction | null;
declare function requestPluginConversationBinding(params: {
  pluginId: string;
  pluginName?: string;
  pluginRoot: string;
  conversation: PluginBindingConversation;
  requestedBySenderId?: string;
  binding: PluginConversationBindingRequestParams | undefined;
}): Promise<PluginConversationBindingRequestResult>;
declare function resolvePluginConversationBindingApproval(params: {
  approvalId: string;
  decision: PluginBindingApprovalDecision;
  senderId?: string;
}): Promise<PluginBindingResolveResult>;
declare function buildPluginBindingResolvedText(params: PluginBindingResolveResult): string;
//#endregion
export { resolvePluginConversationBindingApproval as a, requestPluginConversationBinding as i, buildPluginBindingResolvedText as n, parsePluginBindingApprovalCustomId as r, buildPluginBindingApprovalCustomId as t };