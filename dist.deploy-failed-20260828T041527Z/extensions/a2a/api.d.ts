import { dt as setA2aChannelRuntime, ut as getA2aChannelRuntime } from "../../runtime-api-B8urSeFb.js";
import { t as DEFAULT_ACCOUNT_ID } from "../../account-id-DOiPbHfW.js";
import { n as OpenClawConfig } from "../../types.openclaw-R2xZRh0U.js";
import "../../config-contracts-CGgezQeX.js";
import { i as ResolvedA2aChannelAccount, n as A2aCoreConfig, r as A2aPeerConfig, t as A2aChannelConfig } from "../../types-CJ1IUWdz.js";
import { t as a2aChannelPlugin } from "../../channel-DUfNqSmC.js";
//#region extensions/a2a/src/accounts.d.ts
declare function listA2aChannelAccountIds(cfg: OpenClawConfig): string[];
declare function resolveDefaultA2aChannelAccountId(): string;
declare function resolveA2aChannelAccount(params: {
  cfg: OpenClawConfig;
  accountId?: string | null;
}): ResolvedA2aChannelAccount;
//#endregion
export { type A2aChannelConfig, type A2aCoreConfig, type A2aPeerConfig, DEFAULT_ACCOUNT_ID, type ResolvedA2aChannelAccount, a2aChannelPlugin, getA2aChannelRuntime, listA2aChannelAccountIds, resolveA2aChannelAccount, resolveDefaultA2aChannelAccountId, setA2aChannelRuntime };