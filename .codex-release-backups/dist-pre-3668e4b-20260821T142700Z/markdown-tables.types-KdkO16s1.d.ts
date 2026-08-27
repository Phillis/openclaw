import { r as OpenClawConfig } from "./types.openclaw-D3TBp_34.js";
import { x as MarkdownTableMode } from "./types.base-COwCxNSg.js";

//#region src/config/markdown-tables.types.d.ts
/** Parameters for resolving markdown table rendering per config and channel. */
type ResolveMarkdownTableModeParams = {
  cfg?: Partial<OpenClawConfig>;
  channel?: string | null;
  accountId?: string | null;
  supportsBlockTables?: boolean;
};
type ResolveMarkdownTableMode = (params: ResolveMarkdownTableModeParams) => MarkdownTableMode;
//#endregion
export { ResolveMarkdownTableModeParams as n, ResolveMarkdownTableMode as t };