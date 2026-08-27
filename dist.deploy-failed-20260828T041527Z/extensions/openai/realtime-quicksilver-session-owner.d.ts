import { At as PluginLogger } from "../../plugin-entry-bE5OaTNY.js";
import { n as OpenClawConfig } from "../../types.openclaw-D3Ap19Na.js";
import "../../config-contracts-yQGnmAhr.js";
import { r as createOpenAIQuicksilverBrowserSessionBroker } from "../../realtime-quicksilver-session-Oke0XI9y.js";
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