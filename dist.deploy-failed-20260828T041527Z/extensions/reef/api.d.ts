import "../../plugin-entry-CX5-Xb96.js";
import { n as OpenClawConfig } from "../../types.openclaw-BZZbt-SF.js";
import { dt as ChannelMessageSendTextContext, ft as MessageReceipt, k as ChannelOutboundAdapter } from "../../setup-wizard-types-D9afUG0f.js";
import "../../config-runtime-BGpPj3qV.js";
import { a as ReefInboxConnection, c as WebSocketLike, i as ReefFriendManager, n as createConfiguredGuard, o as ReefProtocolCompatibilityError, s as ReefTransportClient, t as ReefMessageFlow } from "../../flow-D_k2jIp5.js";
import { a as ReefIngressMessage, c as RelayFriend, i as ReefDependencies, n as ReefAccount, o as ReefKeys, t as InboxEntry } from "../../types-DgaYWXxz.js";
import { t as reefPlugin } from "../../channel-0bpkRj73.js";
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