import "../types-B4QsRB1k.js";
import { n as ShouldHandleTextCommandsParams, t as CommandNormalizeOptions } from "../commands-registry.types-DlqupOSw.js";
//#region src/auto-reply/commands-registry-normalize.d.ts
/** Normalizes command text to canonical aliases, removing bot mentions when appropriate. */
declare function normalizeCommandBody(raw: string, options?: CommandNormalizeOptions): string;
//#endregion
//#region src/auto-reply/commands-text-routing.d.ts
/** Decides whether text slash commands remain active for the current surface/config pair. */
declare function shouldHandleTextCommands(params: ShouldHandleTextCommandsParams): boolean;
//#endregion
export { normalizeCommandBody, shouldHandleTextCommands };