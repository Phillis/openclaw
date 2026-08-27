import "./plugin-entry-DyrRrRy2.js";
import { z as BaseProbeResult } from "./types.adapters-DVrIc5zd.js";
import { n as ChannelPlugin } from "./types.public-DowZo4tb.js";
import "./channel-contract-gwjjjQO_.js";
import "./channel-core-C-trAnc0.js";
import { t as ResolvedMatrixAccount } from "./accounts-BllrwKKg.js";
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