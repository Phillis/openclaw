import { n as OpenClawConfig } from "./types.openclaw-Djf9z9fV.js";
import { r as AgentToolResult } from "./types-BH0Q4SbZ.js";
import { t as DiscordMessagingActionOptions } from "./runtime.messaging.shared-DtFtPvlR.js";

//#region extensions/discord/src/actions/runtime.d.ts
declare function handleDiscordAction(params: Record<string, unknown>, cfg: OpenClawConfig, options?: DiscordMessagingActionOptions): Promise<AgentToolResult<unknown>>;
//#endregion
export { handleDiscordAction as t };