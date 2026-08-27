import { n as ChannelPlugin } from "../../types.public-CU8FcKFm.js";
import { t as ResolvedRaftAccount } from "../../accounts-1EWGbFDJ.js";

//#region extensions/raft/src/channel.d.ts
type RaftProbe = {
  ok: true;
  cliFound: true;
  error: null;
} | {
  ok: false;
  cliFound: false;
  error: string;
};
declare const raftPlugin: ChannelPlugin<ResolvedRaftAccount, RaftProbe>;
//#endregion
export { raftPlugin };