import { n as OpenClawConfig } from "./types.openclaw-DRR8P0H2.js";
import "./channel-contract-Pji552cX.js";
import "./plugin-state-store.types-aSCieMta.js";
import { c as ResolvedLineAccount } from "./types-D3iU3vuO.js";
//#region extensions/line/src/accounts.d.ts
declare function resolveLineAccount(params: {
  cfg: OpenClawConfig;
  accountId?: string;
}): ResolvedLineAccount;
declare function listLineAccountIds(cfg: OpenClawConfig): string[];
declare function resolveDefaultLineAccountId(cfg: OpenClawConfig): string;
declare function normalizeAccountId(accountId: string | undefined): string;
//#endregion
export { resolveLineAccount as i, normalizeAccountId as n, resolveDefaultLineAccountId as r, listLineAccountIds as t };