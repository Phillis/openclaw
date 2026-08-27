import { At as PluginLogger, Bt as RealtimeVoiceProviderPlugin } from "../../plugin-entry-Bvo-51M-.js";
import "../../realtime-voice-YZBAIZsD.js";
import { r as createOpenAIQuicksilverBrowserSessionBroker } from "../../realtime-quicksilver-session-YacfgqWj.js";
//#region extensions/openai/realtime-voice-provider.d.ts
type OpenAIQuicksilverBrowserSessionBroker = ReturnType<typeof createOpenAIQuicksilverBrowserSessionBroker>["broker"];
declare function buildOpenAIRealtimeVoiceProvider(options?: {
  quicksilverBrowserSessionBroker?: OpenAIQuicksilverBrowserSessionBroker;
  logger?: Pick<PluginLogger, "debug" | "warn">;
}): RealtimeVoiceProviderPlugin;
//#endregion
export { buildOpenAIRealtimeVoiceProvider };