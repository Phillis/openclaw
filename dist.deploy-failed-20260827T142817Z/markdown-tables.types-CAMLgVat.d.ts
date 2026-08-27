import { r as OpenClawConfig } from "./types.openclaw-a_kGc1gJ.js";
import { x as MarkdownTableMode } from "./types.base-DUfwpzwr.js";

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