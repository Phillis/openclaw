import "./plugin-entry-C1So83n6.js";
import { t as ChannelPlugin } from "./types.public-sCKQgPph.js";
import { t as ResolvedBuzzAccount } from "./types-BmoqTCUI.js";
//#region extensions/buzz/src/channel.d.ts
type BuzzProbeResult = {
  ok: true;
  publicKey: string;
  roomCount: number;
  rooms: Array<{
    id: string;
    name: string;
  }>;
};
declare const buzzPlugin: ChannelPlugin<ResolvedBuzzAccount, BuzzProbeResult, unknown>;
//#endregion
export { buzzPlugin as t };