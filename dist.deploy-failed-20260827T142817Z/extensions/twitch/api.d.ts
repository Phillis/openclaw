import { I as PluginRuntime } from "../../types-7E39v2Gx.js";
import { n as OpenClawConfig } from "../../types.openclaw-3CDavCPO.js";
import { d as RuntimeEnv } from "../../manifest-registry-C8uX5p6j.js";
import { B as ChannelLogSink, H as ChannelMessageActionContext, L as ChannelAccountSnapshot, R as ChannelCapabilities, U as ChannelMeta, V as ChannelMessageActionAdapter, a as ChannelResolveKind, d as ChannelOutboundContext, i as ChannelGatewayContext, n as WizardPrompter, o as ChannelResolveResult, s as ChannelStatusAdapter, t as ChannelPlugin, u as ChannelOutboundAdapter, x as OutboundDeliveryResult } from "../../types.public-B49gnGnS.js";
import { t as twitchPlugin } from "../../plugin-DW-K0dKf.js";

//#region extensions/twitch/src/runtime.d.ts
declare const setTwitchRuntime: (next: PluginRuntime) => void, getTwitchRuntime: () => PluginRuntime;
//#endregion
export { type ChannelAccountSnapshot, type ChannelCapabilities, type ChannelGatewayContext, type ChannelLogSink, type ChannelMessageActionAdapter, type ChannelMessageActionContext, type ChannelMeta, type ChannelOutboundAdapter, type ChannelOutboundContext, type ChannelPlugin, type ChannelResolveKind, type ChannelResolveResult, type ChannelStatusAdapter, type OpenClawConfig, type OutboundDeliveryResult, type RuntimeEnv, type WizardPrompter, setTwitchRuntime, twitchPlugin };