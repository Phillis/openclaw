import { zn as tryReadSecretFileSync } from "./acpx-D5fMZfg0.js";
import { P as TelegramAccountConfig, n as OpenClawConfig } from "./types.openclaw-Ca71eRYk.js";
import "./config-contracts-DfVpGCcF.js";
//#region extensions/telegram/src/account-inspect.d.ts
type CredentialUnavailableDiagnostic = Extract<ReturnType<typeof tryReadSecretFileSync>, {
  status: "configured_unavailable";
}>["diagnostic"];
type TelegramCredentialStatus = "available" | "configured_unavailable" | "missing";
type InspectedTelegramAccount = {
  accountId: string;
  enabled: boolean;
  name?: string;
  token: string;
  tokenSource: "env" | "tokenFile" | "config" | "none";
  tokenStatus: TelegramCredentialStatus;
  credentialDiagnostics?: CredentialUnavailableDiagnostic[];
  configured: boolean;
  config: TelegramAccountConfig;
};
declare function inspectTelegramAccount(params: {
  cfg: OpenClawConfig;
  accountId?: string | null;
  envToken?: string | null;
}): InspectedTelegramAccount;
//#endregion
export { TelegramCredentialStatus as n, inspectTelegramAccount as r, InspectedTelegramAccount as t };