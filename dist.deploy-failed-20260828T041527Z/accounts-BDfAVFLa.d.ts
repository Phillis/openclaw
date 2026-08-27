import "./plugin-entry-bE5OaTNY.js";
import { b as GoogleChatAccountConfig } from "./types.openclaw-D3Ap19Na.js";
import "./config-Cpzyu638.js";
import "./types.adapters-DVrIc5zd.js";
import { t as tryReadSecretFileSync } from "./secret-file-BYqO_IpG.js";
//#region extensions/googlechat/src/accounts.d.ts
type CredentialUnavailableDiagnostic = Extract<ReturnType<typeof tryReadSecretFileSync>, {
  status: "configured_unavailable";
}>["diagnostic"];
type GoogleChatCredentialSource = "file" | "inline" | "env" | "none";
type ResolvedGoogleChatAccount = {
  accountId: string;
  name?: string;
  enabled: boolean;
  config: GoogleChatAccountConfig;
  credentialSource: GoogleChatCredentialSource;
  credentials?: Record<string, unknown>;
  credentialsFile?: string;
  tokenStatus?: "available" | "configured_unavailable" | "missing";
  credentialDiagnostics?: CredentialUnavailableDiagnostic[];
};
//#endregion
export { ResolvedGoogleChatAccount as t };