import { b as OpenClawPluginApi, pt as ReplyPayload, r as PluginRuntime } from "../../runtime-api-IAhSVA75.js";
import { n as OpenClawConfig } from "../../types.openclaw-DRR8P0H2.js";
import { j as ChannelAccountSnapshot, t as ChannelPlugin } from "../../channel-contract-Pji552cX.js";
import { c as ResolvedLineAccount } from "../../types-D3iU3vuO.js";
import "../../runtime-api-B2VvngFy.js";
import { t as linePlugin } from "../../channel-D3EBSXmB.js";
//#region extensions/line/src/channel.setup.d.ts
declare const lineSetupPlugin: ChannelPlugin<ResolvedLineAccount>;
//#endregion
export { type ChannelAccountSnapshot, type ChannelPlugin, type OpenClawConfig, type OpenClawPluginApi, type PluginRuntime, type ReplyPayload, type ResolvedLineAccount, linePlugin, lineSetupPlugin };