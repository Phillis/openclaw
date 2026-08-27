import { At as PluginLogger } from "../../plugin-entry-Bvo-51M-.js";
import { n as OpenClawConfig } from "../../types.openclaw-BjZ8Xxcu.js";
import "../../config-contracts-DBboNIpX.js";
import { r as createOpenAIQuicksilverBrowserSessionBroker } from "../../realtime-quicksilver-session-YacfgqWj.js";
//#region extensions/openai/realtime-quicksilver-session-owner.d.ts
type BrokerSession = ReturnType<typeof createOpenAIQuicksilverBrowserSessionBroker>;
type BrokerParams = {
  getConfig: () => OpenClawConfig | undefined;
  logger: Pick<PluginLogger, "debug" | "warn">;
};
declare function acquireOpenAIQuicksilverBrowserSessionBroker(params: BrokerParams): BrokerSession;
declare function releaseOpenAIQuicksilverBrowserSessionBroker(session: BrokerSession): Promise<void>;
//#endregion
export { acquireOpenAIQuicksilverBrowserSessionBroker, releaseOpenAIQuicksilverBrowserSessionBroker };