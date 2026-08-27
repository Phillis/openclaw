import { n as OpenClawConfig } from "../../types.openclaw-DhIzMzKO.js";
import { C as ChannelOutboundAdapter, lt as ChannelMessageSendTextContext, ut as MessageReceipt } from "../../types.adapters-BxgsWXLj.js";
import { a as ReefInboxConnection, c as WebSocketLike, i as ReefFriendManager, n as createConfiguredGuard, o as ReefProtocolCompatibilityError, s as ReefTransportClient, t as ReefMessageFlow } from "../../flow-BUPw2XD6.js";
import { a as ReefIngressMessage, c as RelayFriend, i as ReefDependencies, n as ReefAccount, o as ReefKeys, t as InboxEntry } from "../../types-DpvnQcmq.js";
import { t as reefPlugin } from "../../channel-Da0gChTQ.js";
//#region extensions/reef/src/outbound.d.ts
declare const reefOutboundAdapter: ChannelOutboundAdapter;
declare const reefMessageAdapter: {
  readonly id: "reef";
  readonly durableFinal: {
    readonly capabilities: {
      readonly text: true;
      readonly replyTo: true;
      readonly thread: true;
    };
  };
  readonly send: {
    readonly text: (ctx: ChannelMessageSendTextContext<OpenClawConfig>) => Promise<{
      receipt: MessageReceipt;
      messageId: string;
    }>;
  };
  readonly receive: {
    readonly defaultAckPolicy: "after_receive_record";
    readonly supportedAckPolicies: readonly ["after_receive_record"];
  };
} & {
  receive: {
    readonly defaultAckPolicy: "after_receive_record";
    readonly supportedAckPolicies: readonly ["after_receive_record"];
  };
};
//#endregion
export { type InboxEntry, type ReefAccount, type ReefDependencies, ReefFriendManager, ReefInboxConnection, type ReefIngressMessage, type ReefKeys, ReefMessageFlow, ReefProtocolCompatibilityError, ReefTransportClient, type RelayFriend, type WebSocketLike, createConfiguredGuard, reefMessageAdapter, reefOutboundAdapter, reefPlugin };