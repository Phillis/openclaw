import { _ as ChannelRouteRef, n as GroupKeyResolution, pt as ChannelId } from "./types-CR4mN0O8.js";
import { gt as MsgContext, x as ChannelPairingAdapter } from "./types.adapters-DVrIc5zd.js";
//#region src/channels/session.types.d.ts
type InboundLastRouteUpdate = {
  sessionKey: string;
  channel: string;
  to: string;
  accountId?: string;
  threadId?: string | number;
  route?: ChannelRouteRef;
  mainDmOwnerPin?: {
    ownerRecipient: string;
    senderRecipient: string;
    onSkip?: (params: {
      ownerRecipient: string;
      senderRecipient: string;
    }) => void;
  };
};
/** Function contract for recording inbound channel session state. */
type RecordInboundSession = (params: {
  storePath: string;
  sessionKey: string;
  ctx: MsgContext;
  groupResolution?: GroupKeyResolution | null;
  createIfMissing?: boolean;
  updateLastRoute?: InboundLastRouteUpdate;
  onRecordError: (err: unknown) => void;
  trackSessionMetaTask?: (task: Promise<unknown>) => void;
}) => Promise<void>;
//#endregion
//#region src/pairing/pairing-store.types.d.ts
type PairingChannel = ChannelId;
/** Reads approved ids from a channel/account allowFrom store. */
type ReadChannelAllowFromStoreForAccount = (params: {
  channel: PairingChannel;
  accountId: string;
  env?: NodeJS.ProcessEnv;
}) => Promise<string[]>;
/** Deletes one approved id from a channel/account allowFrom store. */
type RemoveChannelAllowFromStoreEntryForAccount = (params: {
  channel: PairingChannel;
  entry: string | number;
  accountId: string;
  env?: NodeJS.ProcessEnv;
  pairingAdapter?: ChannelPairingAdapter;
}) => Promise<{
  changed: boolean;
  allowFrom: string[];
}>;
/** Creates or reuses a pending pairing request for one channel account. */
type UpsertChannelPairingRequestForAccount = (params: {
  channel: PairingChannel;
  id: string | number;
  accountId: string;
  meta?: Record<string, string | undefined | null>;
  env?: NodeJS.ProcessEnv;
  pairingAdapter?: ChannelPairingAdapter;
}) => Promise<{
  code: string;
  created: boolean;
}>;
//#endregion
//#region src/pairing/pairing-messages.d.ts
declare function buildPairingReply(params: {
  channel: PairingChannel;
  idLine: string;
  code: string;
}): string;
//#endregion
export { InboundLastRouteUpdate as a, UpsertChannelPairingRequestForAccount as i, ReadChannelAllowFromStoreForAccount as n, RecordInboundSession as o, RemoveChannelAllowFromStoreEntryForAccount as r, buildPairingReply as t };