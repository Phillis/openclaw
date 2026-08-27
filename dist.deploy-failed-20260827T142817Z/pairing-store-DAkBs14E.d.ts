import { _ as ChannelRouteRef, i as GroupKeyResolution, t as ChannelId } from "./channel-id.types-Baik2yF6.js";
import { Ot as MsgContext, x as ChannelPairingAdapter } from "./types.adapters-BCj_O1Hf.js";

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
//#region src/pairing/pairing-store.d.ts
declare function readChannelAllowFromStore(channel: PairingChannel, env?: NodeJS.ProcessEnv, accountId?: string): Promise<string[]>;
//#endregion
export { UpsertChannelPairingRequestForAccount as a, RemoveChannelAllowFromStoreEntryForAccount as i, buildPairingReply as n, InboundLastRouteUpdate as o, ReadChannelAllowFromStoreForAccount as r, RecordInboundSession as s, readChannelAllowFromStore as t };