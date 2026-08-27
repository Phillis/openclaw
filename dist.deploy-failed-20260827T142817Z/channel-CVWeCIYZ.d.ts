import { N as BaseProbeResult } from "./types.adapters-BCj_O1Hf.js";
import { n as ChannelPlugin } from "./types.public-C3sFjEH3.js";
import { n as ZcaUserInfo, t as ResolvedZalouserAccount } from "./accounts-DZLwPqsN.js";
//#region extensions/zalouser/src/probe.d.ts
type ZalouserProbeResult = BaseProbeResult<string> & {
  user?: ZcaUserInfo;
  elapsedMs?: number;
};
//#endregion
//#region extensions/zalouser/src/channel.d.ts
declare const zalouserPlugin: ChannelPlugin<ResolvedZalouserAccount, ZalouserProbeResult>;
//#endregion
export { zalouserPlugin as t };