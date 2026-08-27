import { At as PluginLogger, Bt as RealtimeVoiceProviderPlugin } from "../../plugin-entry-DyrRrRy2.js";
import "../../realtime-voice-CMgQVfpG.js";
import { r as createOpenAIQuicksilverBrowserSessionBroker } from "../../realtime-quicksilver-session-DB-H-4EF.js";
//#region extensions/openai/realtime-voice-provider.d.ts
type OpenAIQuicksilverBrowserSessionBroker = ReturnType<typeof createOpenAIQuicksilverBrowserSessionBroker>["broker"];
declare function buildOpenAIRealtimeVoiceProvider(options?: {
  quicksilverBrowserSessionBroker?: OpenAIQuicksilverBrowserSessionBroker;
  logger?: Pick<PluginLogger, "debug" | "warn">;
}): RealtimeVoiceProviderPlugin;
//#endregion
export { buildOpenAIRealtimeVoiceProvider };