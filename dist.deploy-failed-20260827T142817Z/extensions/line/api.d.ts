import { H as ReplyPayload, r as OpenClawPluginApi, z as PluginRuntime } from "../../types-DYqBZyXL.js";
import { n as OpenClawConfig } from "../../types.openclaw-Djf9z9fV.js";
import { V as ChannelAccountSnapshot } from "../../setup-wizard-types-BJbOEFA2.js";
import { t as ChannelPlugin } from "../../types.public-Lu0oYEHg.js";
import { f as ResolvedLineAccount } from "../../accounts-CvfZVWLk.js";
import { t as linePlugin } from "../../channel-pEt7INdG.js";

//#region extensions/line/src/channel.setup.d.ts
declare const lineSetupPlugin: ChannelPlugin<ResolvedLineAccount>;
//#endregion
export { type ChannelAccountSnapshot, type ChannelPlugin, type OpenClawConfig, type OpenClawPluginApi, type PluginRuntime, type ReplyPayload, type ResolvedLineAccount, linePlugin, lineSetupPlugin };