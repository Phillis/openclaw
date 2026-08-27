import { N as BaseProbeResult } from "./types.adapters-BCj_O1Hf.js";
import { n as ChannelPlugin } from "./types.public-C3sFjEH3.js";
import { t as ResolvedMSTeamsAccount } from "./channel-config-DUdFLYdP.js";

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