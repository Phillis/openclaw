import { n as OpenClawConfig } from "./types.openclaw-BrHw7tim.js";
import { F as ChannelAccountSnapshot, T as ChannelOutboundAdapter, ct as ChannelMessageSendMediaContext, ft as OutboundMediaAccess, lt as ChannelMessageSendTextContext, ut as MessageReceipt } from "./setup-wizard-types-CzVLMkGu.js";
import { n as ChannelPlugin } from "./types.public-CzOChgut.js";
import { t as ResolvedSynologyChatAccount } from "./types-BwbWIEEj.js";

//#region src/plugin-sdk/outbound-media.d.ts
/** Media loading policy used before plugin media is handed to channel delivery. */
type OutboundMediaLoadOptions = {
  /** Maximum allowed media payload size before the load is rejected. */maxBytes?: number; /** Whether callers may load remote URLs, local files, or both. */
  mediaAccess?: OutboundMediaAccess; /** Approved local roots for file/path media; `"any"` disables root restriction. */
  mediaLocalRoots?: readonly string[] | "any"; /** Optional local file reader used by tests or plugin-specific filesystem adapters. */
  mediaReadFile?: (filePath: string) => Promise<Buffer>; /** Workspace root used when resolving relative local media paths. */
  workspaceDir?: string; /** Explicit proxy URL forwarded to shared outbound media loading policy. */
  proxyUrl?: string; /** Fetch implementation for remote media loads. */
  fetchImpl?: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>; /** Extra fetch options merged into remote media requests. */
  requestInit?: RequestInit; /** Whether shared media loading may optimize image payloads. */
  optimizeImages?: boolean; /** Allows explicit proxy DNS behavior to be trusted by the media fetch guard. */
  trustExplicitProxyDns?: boolean;
};
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
  chatId: string;
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
    }) => string[];
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