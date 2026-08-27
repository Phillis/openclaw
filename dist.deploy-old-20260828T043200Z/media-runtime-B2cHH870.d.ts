import { n as OpenClawConfig } from "./types.openclaw-BjZ8Xxcu.js";
import "./types-CippcftS.js";
import "./types.adapters-UsYT95C9.js";
import "./types-KW--AyYr.js";
import "./fetch-BTq3eOuL.js";
import "./ssrf-Ck7fh8Hg.js";
import "./image-runtime-DwLbUqdk.js";
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