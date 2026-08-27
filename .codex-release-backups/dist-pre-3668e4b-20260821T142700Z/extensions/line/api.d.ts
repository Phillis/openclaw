import { H as ReplyPayload, r as OpenClawPluginApi, z as PluginRuntime } from "../../types-CCx6rk6K.js";
import { n as OpenClawConfig } from "../../types.openclaw-LvSHMCsQ.js";
import { V as ChannelAccountSnapshot } from "../../setup-wizard-types-D4fC5oCf.js";
import { t as ChannelPlugin } from "../../types.public-5_n40NS2.js";
import { f as ResolvedLineAccount } from "../../accounts-BH4w2OeG.js";
import { t as linePlugin } from "../../channel-Dwkp_prG.js";

//#region extensions/line/src/channel.setup.d.ts
declare const lineSetupPlugin: ChannelPlugin<ResolvedLineAccount>;
//#endregion
export { type ChannelAccountSnapshot, type ChannelPlugin, type OpenClawConfig, type OpenClawPluginApi, type PluginRuntime, type ReplyPayload, type ResolvedLineAccount, linePlugin, lineSetupPlugin };