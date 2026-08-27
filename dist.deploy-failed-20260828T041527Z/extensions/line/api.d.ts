import { b as OpenClawPluginApi, pt as ReplyPayload, r as PluginRuntime } from "../../runtime-api-B8urSeFb.js";
import { n as OpenClawConfig } from "../../types.openclaw-R2xZRh0U.js";
import { j as ChannelAccountSnapshot, t as ChannelPlugin } from "../../channel-contract-C7AAps4m.js";
import { c as ResolvedLineAccount } from "../../types-BS7gDZzQ.js";
import "../../runtime-api-Cp9_5jio.js";
import { t as linePlugin } from "../../channel-CE2Tf_XM.js";
//#region extensions/line/src/channel.setup.d.ts
declare const lineSetupPlugin: ChannelPlugin<ResolvedLineAccount>;
//#endregion
export { type ChannelAccountSnapshot, type ChannelPlugin, type OpenClawConfig, type OpenClawPluginApi, type PluginRuntime, type ReplyPayload, type ResolvedLineAccount, linePlugin, lineSetupPlugin };