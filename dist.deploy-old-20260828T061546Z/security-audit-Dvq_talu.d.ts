import { n as OpenClawConfig } from "./types.openclaw-R2xZRh0U.js";
import "./config-contracts-CGgezQeX.js";
import { t as ResolvedDiscordAccount } from "./accounts-BA9QOPWH.js";
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