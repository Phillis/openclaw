import { h as DiscordAccountConfig, n as OpenClawConfig } from "./types.openclaw-LvSHMCsQ.js";
import { t as DiscordCredentialStatus } from "./token-CaFJdPYy.js";

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