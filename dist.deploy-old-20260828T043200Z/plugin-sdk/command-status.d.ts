import { r as OpenClawConfig } from "../types.openclaw-Cjm06lg9.js";
import { n as SkillCommandSpec } from "../types-BGVJFv2Y.js";
//#region src/auto-reply/command-status-builders.d.ts
/** Builds the compact slash-command help text shown by `/help`. */
declare function buildHelpMessage(cfg?: OpenClawConfig): string;
/** Options for rendering `/commands` output for a specific channel surface. */
type CommandsMessageOptions = {
  page?: number;
  surface?: string;
  forcePaginatedList?: boolean;
};
/** Rendered `/commands` text plus pagination metadata for channel-native lists. */
type CommandsMessageResult = {
  text: string;
  totalPages: number;
  currentPage: number;
  hasNext: boolean;
  hasPrev: boolean;
};
/** Builds `/commands` text, returning only the rendered message body. */
declare function buildCommandsMessage(cfg?: OpenClawConfig, skillCommands?: SkillCommandSpec[], options?: CommandsMessageOptions): string;
/** Builds `/commands` text and pagination metadata for surfaces with native list controls. */
declare function buildCommandsMessagePaginated(cfg?: OpenClawConfig, skillCommands?: SkillCommandSpec[], options?: CommandsMessageOptions): CommandsMessageResult;
//#endregion
export { type CommandsMessageOptions, type CommandsMessageResult, buildCommandsMessage, buildCommandsMessagePaginated, buildHelpMessage };