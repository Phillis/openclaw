import { n as OpenClawConfig } from "./types.openclaw-BjZ8Xxcu.js";
import "./types-CippcftS.js";
import "./config-contracts-DBboNIpX.js";
import "./types-CW5W8UCv.js";
import "./types.adapters-UsYT95C9.js";
import "./types.public-BgN3WB8T.js";
import { t as BindingTargetKind } from "./session-binding.types-6Nwx4KtX.js";
import "./pairing-messages-CtA9fPmO.js";
import "./conversation-binding-AU6ixlQH.js";
//#region extensions/feishu/src/thread-bindings.d.ts
type FeishuBindingTargetKind = "subagent" | "acp";
type FeishuThreadBindingRecord = {
  accountId: string;
  conversationId: string;
  parentConversationId?: string;
  deliveryTo?: string;
  deliveryThreadId?: string;
  targetKind: FeishuBindingTargetKind;
  targetSessionKey: string;
  agentId?: string;
  label?: string;
  boundBy?: string;
  boundAt: number;
  lastActivityAt: number;
};
type FeishuThreadBindingManager = {
  accountId: string;
  getByConversationId: (conversationId: string) => FeishuThreadBindingRecord | undefined;
  listBySessionKey: (targetSessionKey: string) => FeishuThreadBindingRecord[];
  bindConversation: (params: {
    conversationId: string;
    parentConversationId?: string;
    targetKind: BindingTargetKind;
    targetSessionKey: string;
    metadata?: Record<string, unknown>;
  }) => FeishuThreadBindingRecord | null;
  touchConversation: (conversationId: string, at?: number) => FeishuThreadBindingRecord | null;
  unbindConversation: (conversationId: string) => FeishuThreadBindingRecord | null;
  unbindBySessionKey: (targetSessionKey: string) => FeishuThreadBindingRecord[];
  stop: () => void;
};
declare function createFeishuThreadBindingManager(params: {
  accountId?: string;
  cfg: OpenClawConfig;
}): FeishuThreadBindingManager;
declare function getFeishuThreadBindingManager(accountId?: string): FeishuThreadBindingManager | null;
//#endregion
export { getFeishuThreadBindingManager as n, createFeishuThreadBindingManager as t };