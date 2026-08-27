import "./config-contracts-yQGnmAhr.js";
import { t as tryReadSecretFileSync } from "./secret-file-BYqO_IpG.js";
//#region extensions/msteams/src/channel-config.d.ts
type ResolvedMSTeamsAccount = {
  accountId: string;
  enabled: boolean;
  configured: boolean;
  tokenStatus: "available" | "configured_unavailable" | "missing";
  credentialDiagnostics?: Extract<ReturnType<typeof tryReadSecretFileSync>, {
    status: "configured_unavailable";
  }>["diagnostic"][];
};
//#endregion
export { ResolvedMSTeamsAccount as t };