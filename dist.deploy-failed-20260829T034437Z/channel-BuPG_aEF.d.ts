import "./plugin-entry-DF9X1uwv.js";
import { z as BaseProbeResult } from "./types.adapters-UsYT95C9.js";
import { n as ChannelPlugin } from "./types.public-BgN3WB8T.js";
import "./channel-contract-BTByoES9.js";
import "./channel-core-CE1J7JSt.js";
import { t as ResolvedMatrixAccount } from "./accounts-CmzlM7J_.js";
import "./ssrf-dispatcher-BhUs6Wr8.js";
//#region extensions/matrix/src/matrix/probe.d.ts
type MatrixProbe = BaseProbeResult & {
  status?: number | null;
  elapsedMs: number;
  userId?: string | null;
};
//#endregion
//#region extensions/matrix/src/channel.d.ts
declare const matrixPlugin: ChannelPlugin<ResolvedMatrixAccount, MatrixProbe>;
//#endregion
export { matrixPlugin as t };