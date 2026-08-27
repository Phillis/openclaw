import { n as OpenClawConfig } from "./types.openclaw-R2xZRh0U.js";
import "./config-contracts-CGgezQeX.js";
//#region extensions/a2a/src/types.d.ts
type A2aPeerConfig = {
  token: string;
  url?: string;
  outboundToken?: string;
};
type A2aChannelConfig = {
  enabled?: boolean;
  configWrites?: boolean;
  advertisedUrl?: string;
  replyTimeoutMs?: number;
  rateLimitPerMinute?: number;
  exposeAgents?: string[];
  peers?: Record<string, A2aPeerConfig>;
};
type A2aCoreConfig = OpenClawConfig & {
  channels?: OpenClawConfig["channels"] & {
    a2a?: A2aChannelConfig;
  };
};
type ResolvedA2aChannelAccount = {
  accountId: string;
  enabled: boolean;
  configured: boolean;
  config: A2aChannelConfig;
};
//#endregion
export { ResolvedA2aChannelAccount as i, A2aCoreConfig as n, A2aPeerConfig as r, A2aChannelConfig as t };