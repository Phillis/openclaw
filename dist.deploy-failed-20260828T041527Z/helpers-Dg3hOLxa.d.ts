import "./types.openclaw-R2xZRh0U.js";
import "./channel-contract-C7AAps4m.js";
//#region src/channels/plugins/config-helpers.d.ts
/**
 * Clears selected fields from one account entry and reports whether configured data was removed.
 */
declare function clearAccountEntryFields<TAccountEntry extends object>(params: {
  accounts?: Record<string, TAccountEntry>;
  accountId: string;
  fields: string[];
  isValueSet?: (value: unknown) => boolean;
  markClearedOnFieldPresence?: boolean;
}): {
  nextAccounts?: Record<string, TAccountEntry>;
  changed: boolean;
  cleared: boolean;
};
//#endregion
export { clearAccountEntryFields as t };