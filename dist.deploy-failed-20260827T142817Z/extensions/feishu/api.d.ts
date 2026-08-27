import { g as OpenClawPluginApi } from "../../plugin-entry-GuVBIlyS.js";
import { t as feishuPlugin } from "../../channel-CL6sO6WP.js";
import { a as parseFeishuDirectConversationId, i as parseFeishuConversationId, n as buildFeishuConversationId, o as parseFeishuTargetId, r as buildFeishuModelOverrideParentCandidates, t as FeishuGroupSessionScope } from "../../conversation-id-CBFuWL3u.js";
import { i as setFeishuNamedAccountEnabled, n as runFeishuLogin, r as feishuSetupAdapter, t as feishuSetupWizard } from "../../setup-surface-D5L1lBLg.js";
import { n as getFeishuThreadBindingManager, t as createFeishuThreadBindingManager } from "../../thread-bindings-CtBrBNTI.js";
import { t as createClackPrompter } from "../../setup-runtime-CZM6oJ9h.js";
//#region extensions/feishu/src/docx.d.ts
declare function registerFeishuDocTools(api: OpenClawPluginApi): void;
//#endregion
//#region extensions/feishu/src/chat.d.ts
declare function registerFeishuChatTools(api: OpenClawPluginApi): void;
//#endregion
//#region extensions/feishu/src/wiki.d.ts
declare function registerFeishuWikiTools(api: OpenClawPluginApi): void;
//#endregion
//#region extensions/feishu/src/drive.d.ts
declare function registerFeishuDriveTools(api: OpenClawPluginApi): void;
//#endregion
//#region extensions/feishu/src/perm.d.ts
declare function registerFeishuPermTools(api: OpenClawPluginApi): void;
//#endregion
//#region extensions/feishu/src/bitable.d.ts
declare function registerFeishuBitableTools(api: OpenClawPluginApi): void;
//#endregion
//#region extensions/feishu/src/subagent-hooks.d.ts
type FeishuSubagentContext = {
  requesterSessionKey?: string;
};
type FeishuSubagentSpawningEvent = {
  threadRequested?: boolean;
  requester?: {
    channel?: string;
    accountId?: string;
    to?: string;
    threadId?: string | number;
  };
  childSessionKey: string;
  agentId?: string;
  label?: string;
};
type FeishuSubagentDeliveryTargetEvent = {
  expectsCompletionMessage?: boolean;
  requesterOrigin?: {
    channel?: string;
    accountId?: string;
    to?: string;
    threadId?: string | number;
  };
  childSessionKey: string;
  requesterSessionKey?: string;
};
type FeishuSubagentEndedEvent = {
  accountId?: string;
  targetSessionKey: string;
};
type FeishuSubagentSpawningResult = {
  status: "ok";
  threadBindingReady?: boolean;
  deliveryOrigin?: {
    channel: "feishu";
    accountId?: string;
    to?: string;
    threadId?: string | number;
  };
} | {
  status: "error";
  error: string;
} | undefined;
type FeishuSubagentDeliveryTargetResult = {
  origin: {
    channel: "feishu";
    accountId?: string;
    to?: string;
    threadId?: string | number;
  };
} | undefined;
declare function handleFeishuSubagentSpawning(event: FeishuSubagentSpawningEvent, ctx: FeishuSubagentContext): Promise<FeishuSubagentSpawningResult>;
declare function handleFeishuSubagentDeliveryTarget(event: FeishuSubagentDeliveryTargetEvent): FeishuSubagentDeliveryTargetResult;
declare function handleFeishuSubagentEnded(event: FeishuSubagentEndedEvent): void;
//#endregion
export { type FeishuGroupSessionScope, buildFeishuConversationId, buildFeishuModelOverrideParentCandidates, createClackPrompter, createFeishuThreadBindingManager, feishuPlugin, feishuSetupAdapter, feishuSetupWizard, getFeishuThreadBindingManager, handleFeishuSubagentDeliveryTarget, handleFeishuSubagentEnded, handleFeishuSubagentSpawning, parseFeishuConversationId, parseFeishuDirectConversationId, parseFeishuTargetId, registerFeishuBitableTools, registerFeishuChatTools, registerFeishuDocTools, registerFeishuDriveTools, registerFeishuPermTools, registerFeishuWikiTools, runFeishuLogin, setFeishuNamedAccountEnabled };