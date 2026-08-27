import "./plugin-entry-SSZcu2d5.js";
import { t as ChannelPlugin } from "./types.public-uc4adrAK.js";
import { t as ResolvedBuzzAccount } from "./types-CQzyvX7x.js";
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