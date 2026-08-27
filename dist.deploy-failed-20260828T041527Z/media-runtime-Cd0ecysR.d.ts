import { n as OpenClawConfig } from "./types.openclaw-D3Ap19Na.js";
import "./types-vfwkTnFP.js";
import "./types.adapters-DVrIc5zd.js";
import "./types-Bt_rlgTI.js";
import "./fetch-C3O_qIWc.js";
import "./ssrf-Ck7fh8Hg.js";
import "./image-runtime-ChCwgdC8.js";
//#region src/channels/plugins/media-limits.d.ts
/** Resolves channel media limit bytes from account-specific config or agent defaults. */
declare function resolveChannelMediaMaxBytes(params: {
  cfg: OpenClawConfig;
  resolveChannelLimitMb: (params: {
    cfg: OpenClawConfig;
    accountId: string;
  }) => number | undefined;
  accountId?: string | null;
}): number | undefined;
//#endregion
export { resolveChannelMediaMaxBytes as t };