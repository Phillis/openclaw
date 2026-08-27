import { E as OutboundMediaLoadOptions } from "./plugin-entry-SSZcu2d5.js";
import { n as OpenClawConfig } from "./types.openclaw-Dbu8qmVI.js";
import { D as ChannelOutboundAdapter, G as ChannelAccountSnapshot, dt as ChannelMessageSendTextContext, ft as MessageReceipt, ut as ChannelMessageSendMediaContext } from "./setup-wizard-types-DKtF7yYx.js";
import { t as ChannelPlugin } from "./types.public-uc4adrAK.js";
import "./channel-contract-cEm0yf9M.js";
import "./account-core-CWVw1iS6.js";
import { t as ResolvedSynologyChatAccount } from "./types-BwbWIEEj.js";
//#region extensions/synology-chat/src/gateway-runtime.d.ts
declare function collectSynologyGatewayRoutingFindings(params: {
  cfg: OpenClawConfig;
  account: ResolvedSynologyChatAccount;
}): {
  checkId: string;
  severity: "warn" | "critical";
  title: string;
  detail: string;
}[];
//#endregion
//#region extensions/synology-chat/src/channel.d.ts
declare const CHANNEL_ID = "synology-chat";
type SynologyChannelGatewayContext = {
  cfg: OpenClawConfig;
  accountId: string;
  abortSignal: AbortSignal;
  setStatus?: (patch: ChannelAccountSnapshot) => void;
  log?: {
    info: (message: string) => void;
    warn: (message: string) => void;
    error: (message: string) => void;
  };
};
type SynologyChannelOutboundContext = {
  cfg: OpenClawConfig;
  to: string;
  text?: string;
  mediaUrl?: string;
  accountId?: string | null;
  mediaAccess?: OutboundMediaLoadOptions["mediaAccess"];
  mediaLocalRoots?: readonly string[];
  mediaReadFile?: (filePath: string) => Promise<Buffer>;
  onPlatformSendDispatch?: () => Promise<void>;
};
type SynologyChannelSendTextContext = SynologyChannelOutboundContext & {
  text: string;
};
type SynologyChannelSendMediaContext = SynologyChannelOutboundContext & {
  mediaUrl: string;
};
type SynologyChatOutboundResult = {
  channel: typeof CHANNEL_ID;
  messageId: string;
  target: {
    kind: "chat";
    id: string;
  };
  receipt: MessageReceipt;
};
type SynologyChatPlugin = Omit<ChannelPlugin<ResolvedSynologyChatAccount>, "pairing" | "security" | "messaging" | "directory" | "outbound" | "gateway" | "agentPrompt"> & {
  pairing: {
    idLabel: string;
    normalizeAllowEntry?: (entry: string) => string;
    notifyApproval: (params: {
      cfg: OpenClawConfig;
      id: string;
    }) => Promise<void>;
  };
  security: {
    resolveDmPolicy: (params: {
      cfg: OpenClawConfig;
      account: ResolvedSynologyChatAccount;
    }) => {
      policy: string | null | undefined;
      allowFrom?: Array<string | number>;
      normalizeEntry?: (raw: string) => string;
    } | null;
    collectWarnings: (params: {
      cfg: OpenClawConfig;
      account: ResolvedSynologyChatAccount;
    }) => Array<string | ReturnType<typeof collectSynologyGatewayRoutingFindings>[number]>;
  };
  messaging: {
    targetPrefixes?: readonly string[];
    normalizeTarget: (target: string) => string | undefined;
    inferTargetChatType: NonNullable<ChannelPlugin<ResolvedSynologyChatAccount>["messaging"]>["inferTargetChatType"];
    resolveOutboundSessionRoute: NonNullable<ChannelPlugin<ResolvedSynologyChatAccount>["messaging"]>["resolveOutboundSessionRoute"];
    targetResolver: {
      looksLikeId: (id: string) => boolean;
      hint: string;
    };
  };
  directory: {
    self?: NonNullable<ChannelPlugin<ResolvedSynologyChatAccount>["directory"]>["self"];
    listPeers?: NonNullable<ChannelPlugin<ResolvedSynologyChatAccount>["directory"]>["listPeers"];
    listGroups?: NonNullable<ChannelPlugin<ResolvedSynologyChatAccount>["directory"]>["listGroups"];
  };
  outbound: {
    deliveryMode: "gateway";
    chunker: NonNullable<ChannelOutboundAdapter["chunker"]>;
    chunkerMode: NonNullable<ChannelOutboundAdapter["chunkerMode"]>;
    textChunkLimit: number;
    sanitizeText: NonNullable<ChannelOutboundAdapter["sanitizeText"]>;
    sendText: (ctx: SynologyChannelSendTextContext) => Promise<SynologyChatOutboundResult>;
    sendMedia: (ctx: SynologyChannelSendMediaContext) => Promise<SynologyChatOutboundResult>;
  };
  message: typeof synologyChatMessageAdapter;
  gateway: {
    startAccount: (ctx: SynologyChannelGatewayContext) => Promise<unknown>;
    stopAccount: (ctx: SynologyChannelGatewayContext) => Promise<void>;
  };
  agentPrompt: {
    messageToolHints: () => string[];
  };
};
declare const synologyChatMessageAdapter: {
  readonly id: "synology-chat";
  readonly durableFinal: {
    readonly capabilities: {
      readonly text: true;
      readonly media: true;
      readonly messageSendingHooks: true;
    };
  };
  readonly send: {
    readonly text: (ctx: ChannelMessageSendTextContext<OpenClawConfig>) => Promise<SynologyChatOutboundResult>;
    readonly media: (ctx: ChannelMessageSendMediaContext<OpenClawConfig>) => Promise<SynologyChatOutboundResult>;
  };
} & {
  receive: {};
};
declare const synologyChatPlugin: SynologyChatPlugin;
//#endregion
export { synologyChatPlugin as t };