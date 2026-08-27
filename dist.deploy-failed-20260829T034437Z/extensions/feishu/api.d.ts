import { b as OpenClawPluginApi } from "../../plugin-entry-DF9X1uwv.js";
import "../../types.openclaw-BjZ8Xxcu.js";
import "../../config-DZJJLaRw.js";
import "../../types.adapters-UsYT95C9.js";
import { r as WizardPrompter } from "../../setup-wizard-types-CTl56MML.js";
import "../../channel-contract-BTByoES9.js";
import "../../setup-helpers-775K7_O6.js";
import { t as feishuPlugin } from "../../channel-H--9Ivwi.js";
import { a as parseFeishuDirectConversationId, i as parseFeishuConversationId, n as buildFeishuConversationId, o as parseFeishuTargetId, r as buildFeishuModelOverrideParentCandidates, t as FeishuGroupSessionScope } from "../../conversation-id-CBFuWL3u.js";
import "../../setup-D8bin8hp.js";
import { i as setFeishuNamedAccountEnabled, n as runFeishuLogin, r as feishuSetupAdapter, t as feishuSetupWizard } from "../../setup-surface-DwjLm4K8.js";
import { n as getFeishuThreadBindingManager, t as createFeishuThreadBindingManager } from "../../thread-bindings-CQDyyraS.js";
import "@larksuiteoapi/node-sdk";
import "@clack/prompts";
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
type FeishuSubagentDeliveryTargetResult = {
  origin: {
    channel: "feishu";
    accountId?: string;
    to?: string;
    threadId?: string | number;
  };
} | undefined;
declare function handleFeishuSubagentDeliveryTarget(event: FeishuSubagentDeliveryTargetEvent): FeishuSubagentDeliveryTargetResult;
declare function handleFeishuSubagentEnded(event: FeishuSubagentEndedEvent): void;
//#endregion
//#region src/wizard/clack-prompter.d.ts
declare function createClackPrompter(output?: NodeJS.WriteStream): WizardPrompter;
//#endregion
export { type FeishuGroupSessionScope, buildFeishuConversationId, buildFeishuModelOverrideParentCandidates, createClackPrompter, createFeishuThreadBindingManager, feishuPlugin, feishuSetupAdapter, feishuSetupWizard, getFeishuThreadBindingManager, handleFeishuSubagentDeliveryTarget, handleFeishuSubagentEnded, parseFeishuConversationId, parseFeishuDirectConversationId, parseFeishuTargetId, registerFeishuBitableTools, registerFeishuChatTools, registerFeishuDocTools, registerFeishuDriveTools, registerFeishuPermTools, registerFeishuWikiTools, runFeishuLogin, setFeishuNamedAccountEnabled };