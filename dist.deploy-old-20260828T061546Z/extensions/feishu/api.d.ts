import { b as OpenClawPluginApi } from "../../plugin-entry-DyrRrRy2.js";
import "../../types.openclaw-D3Ap19Na.js";
import "../../config-Cpzyu638.js";
import "../../types.adapters-DVrIc5zd.js";
import { r as WizardPrompter } from "../../setup-wizard-types-BFO9MBX3.js";
import "../../channel-contract-gwjjjQO_.js";
import "../../setup-helpers-BRsuqhOh.js";
import { t as feishuPlugin } from "../../channel-BcJ_7srg.js";
import { a as parseFeishuDirectConversationId, i as parseFeishuConversationId, n as buildFeishuConversationId, o as parseFeishuTargetId, r as buildFeishuModelOverrideParentCandidates, t as FeishuGroupSessionScope } from "../../conversation-id-CBFuWL3u.js";
import "../../setup-Cg_c54xI.js";
import { i as setFeishuNamedAccountEnabled, n as runFeishuLogin, r as feishuSetupAdapter, t as feishuSetupWizard } from "../../setup-surface-CGz4zh0s.js";
import { n as getFeishuThreadBindingManager, t as createFeishuThreadBindingManager } from "../../thread-bindings-CIMXg_cd.js";
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