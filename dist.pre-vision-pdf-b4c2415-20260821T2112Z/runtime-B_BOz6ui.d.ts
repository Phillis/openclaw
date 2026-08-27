import { n as OpenClawConfig } from "./types.openclaw-LvSHMCsQ.js";
import { r as AgentToolResult } from "./types-BH0Q4SbZ.js";
import { t as DiscordMessagingActionOptions } from "./runtime.messaging.shared-7sSnDCc2.js";

//#region extensions/discord/src/actions/runtime.d.ts
declare function handleDiscordAction(params: Record<string, unknown>, cfg: OpenClawConfig, options?: DiscordMessagingActionOptions): Promise<AgentToolResult<unknown>>;
//#endregion
export { handleDiscordAction as t };