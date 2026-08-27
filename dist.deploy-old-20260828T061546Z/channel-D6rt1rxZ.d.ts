import { z as BaseProbeResult } from "./types.adapters-DVrIc5zd.js";
import { n as ChannelPlugin } from "./types.public-DowZo4tb.js";
import "./runtime-api-BmuqI6om.js";
import { t as ResolvedMSTeamsAccount } from "./channel-config-BEoYuxTH.js";
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