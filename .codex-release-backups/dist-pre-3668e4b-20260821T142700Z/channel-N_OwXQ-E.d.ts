import { N as BaseProbeResult } from "./types.adapters-BxgsWXLj.js";
import { n as ChannelPlugin } from "./types.public-BPaS4Hyv.js";
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