import { z as BaseProbeResult } from "./types.adapters-UsYT95C9.js";
import { n as ChannelPlugin } from "./types.public-BgN3WB8T.js";
import "./runtime-api-C1hdWA4b.js";
import { t as ResolvedMSTeamsAccount } from "./channel-config-BP_KJgPM.js";
//#region extensions/msteams/src/probe.d.ts
type ProbeMSTeamsResult = BaseProbeResult<string> & {
  appId?: string;
  graph?: {
    ok: boolean;
    error?: string;
    roles?: string[];
    scopes?: string[];
  };
  delegatedAuth?: {
    ok: boolean;
    error?: string;
    scopes?: string[];
    userPrincipalName?: string;
  };
};
//#endregion
//#region extensions/msteams/src/channel.d.ts
declare const msteamsPlugin: ChannelPlugin<ResolvedMSTeamsAccount, ProbeMSTeamsResult>;
//#endregion
export { msteamsPlugin as t };