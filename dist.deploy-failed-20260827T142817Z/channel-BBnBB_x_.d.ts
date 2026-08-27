import { t as ChannelPlugin } from "./types.public-B49gnGnS.js";
import { t as ResolvedBuzzAccount } from "./types-21je2UrV.js";

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