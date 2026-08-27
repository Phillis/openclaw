import { n as OpenClawConfig } from "./types.openclaw-DRR8P0H2.js";
import "./config-contracts-BoWM1_J1.js";
import { t as ResolvedDiscordAccount } from "./accounts-j6bsCYA9.js";
//#region extensions/discord/src/security-audit.d.ts
declare function collectDiscordSecurityAuditFindings(params: {
  cfg: OpenClawConfig;
  accountId?: string | null;
  account: ResolvedDiscordAccount;
  orderedAccountIds: string[];
  hasExplicitAccountPath: boolean;
}): Promise<{
  checkId: string;
  severity: "info" | "warn" | "critical";
  title: string;
  detail: string;
  remediation?: string;
}[]>;
//#endregion
export { collectDiscordSecurityAuditFindings as t };