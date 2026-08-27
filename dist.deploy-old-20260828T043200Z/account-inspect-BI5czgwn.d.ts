import { g as DiscordAccountConfig, n as OpenClawConfig } from "./types.openclaw-DRR8P0H2.js";
import "./config-contracts-BoWM1_J1.js";
import { t as DiscordCredentialStatus } from "./token-BtD2jwzP.js";
//#region extensions/discord/src/account-inspect.d.ts
type InspectedDiscordAccount = {
  accountId: string;
  enabled: boolean;
  name?: string;
  token: string;
  tokenSource: "env" | "config" | "none";
  tokenStatus: DiscordCredentialStatus;
  configured: boolean;
  config: DiscordAccountConfig;
};
declare function inspectDiscordAccount(params: {
  cfg: OpenClawConfig;
  accountId?: string | null;
  envToken?: string | null;
}): InspectedDiscordAccount;
//#endregion
export { inspectDiscordAccount as n, InspectedDiscordAccount as t };