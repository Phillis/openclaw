import { t as ChannelId } from "./channel-id.types-CjcGKHk0.js";
import { t as ChannelPairingAdapter } from "./pairing.types-Bmz1GDuB.js";

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
export { UpsertChannelPairingRequestForAccount as i, ReadChannelAllowFromStoreForAccount as n, RemoveChannelAllowFromStoreEntryForAccount as r, PairingChannel as t };