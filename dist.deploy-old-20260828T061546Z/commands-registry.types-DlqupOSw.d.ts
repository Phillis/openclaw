import { n as OpenClawConfig } from "./types.openclaw-DckSqIPo.js";
import "./types-B4QsRB1k.js";
import "./thinking.shared-C7tD_Pkp.js";
//#region src/auto-reply/commands-registry.types.d.ts
/** Extra context used when normalizing slash command text. */
type CommandNormalizeOptions = {
  botUsername?: string;
  /** Strip an explicit command target only while channel bot identity is unavailable. */
  targetedCommandMode?: "pre-identity";
};
/** Inputs for deciding whether text slash commands should run on a surface. */
type ShouldHandleTextCommandsParams = {
  cfg: OpenClawConfig;
  surface: string;
  commandSource?: "text" | "native";
};
//#endregion
export { ShouldHandleTextCommandsParams as n, CommandNormalizeOptions as t };