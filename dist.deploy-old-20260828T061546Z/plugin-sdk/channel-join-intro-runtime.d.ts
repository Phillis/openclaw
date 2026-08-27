import { n as OpenClawConfig } from "../types.openclaw-DckSqIPo.js";
//#region src/channels/join-intro/join-intro-prompt.d.ts
type ChannelJoinedRoomContext = {
  /** Human room name, e.g. "#deploys" or "Design Team". */
  title?: string;
  /** Room purpose/topic/description, when the platform has one. */
  purpose?: string;
  /** Pinned or announcement text, when cheaply available. */
  pinned?: string;
  /** Recent messages oldest-first. Empty/omitted when unreadable. */
  recentMessages?: Array<{
    sender?: string;
    text: string;
  }>;
  /** Set when the platform structurally cannot read pre-join history. */
  historyUnavailable?: boolean;
};
//#endregion
//#region src/channels/join-intro/report-channel-room-join.d.ts
type ChannelJoinIntroOutcome = {
  kind: "posted";
} | {
  kind: "skipped";
  reason: "disabled" | "already-introduced" | "room-not-allowed" | "no-context";
} | {
  kind: "failed";
  reason: string;
};
type ChannelJoinIntroParams = {
  cfg: OpenClawConfig;
  channel: string;
  accountId?: string;
  conversationId: string;
  deliverTo: string;
  threadId?: string | number;
  route: {
    agentId: string;
    sessionKey: string;
  };
  inviterLabel?: string;
  roomAllowed: boolean;
  resolveRoomContext: (params: {
    messageLimit: number;
  }) => Promise<ChannelJoinedRoomContext | null>;
};
declare function reportChannelRoomJoin(params: ChannelJoinIntroParams): Promise<ChannelJoinIntroOutcome>;
//#endregion
export { type ChannelJoinIntroOutcome, type ChannelJoinedRoomContext, reportChannelRoomJoin };