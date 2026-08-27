import { n as OpenClawConfig } from "./types.openclaw-6A5yUI1l.js";
//#region src/auto-reply/commands-registry.types.d.ts
/** Extra context used when normalizing slash command text. */
type CommandNormalizeOptions = {
  botUsername?: string;
};
/** Inputs for deciding whether text slash commands should run on a surface. */
type ShouldHandleTextCommandsParams = {
  cfg: OpenClawConfig;
  surface: string;
  commandSource?: "text" | "native";
};
//#endregion
export { ShouldHandleTextCommandsParams as n, CommandNormalizeOptions as t };