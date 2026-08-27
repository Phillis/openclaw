import { l as PluginRuntime } from "../../plugin-entry-C1So83n6.js";
import { i as resolveDefaultBuzzAccountId, n as listBuzzAccountIds, r as resolveBuzzAccount, t as ResolvedBuzzAccount } from "../../types-BmoqTCUI.js";
import { t as buzzPlugin } from "../../channel-BA4NUJyJ.js";
//#region extensions/buzz/src/runtime.d.ts
declare const setBuzzRuntime: (next: PluginRuntime) => void, getBuzzRuntime: () => PluginRuntime;
//#endregion
export { type ResolvedBuzzAccount, buzzPlugin, getBuzzRuntime, listBuzzAccountIds, resolveBuzzAccount, resolveDefaultBuzzAccountId, setBuzzRuntime };