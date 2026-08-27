import { n as OpenClawConfig } from "./types.openclaw-R2xZRh0U.js";
import "./channel-contract-C7AAps4m.js";
import "./plugin-state-store.types-Cvq44_Mh.js";
import { c as ResolvedLineAccount } from "./types-BS7gDZzQ.js";
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