import "../../acpx-BA25QFjp.js";
import { n as ChannelPlugin } from "../../types.public-DkxVn6s3.js";
import { t as ResolvedRaftAccount } from "../../accounts-o1SicKvc.js";
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