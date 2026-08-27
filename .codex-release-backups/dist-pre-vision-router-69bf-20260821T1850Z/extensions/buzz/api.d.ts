import { I as PluginRuntime } from "../../types-BwmvzNiR.js";
import { i as resolveDefaultBuzzAccountId, n as listBuzzAccountIds, r as resolveBuzzAccount, t as ResolvedBuzzAccount } from "../../types-Bkr7kQl5.js";
import { t as buzzPlugin } from "../../channel-D81Dy8Zl.js";
//#region extensions/buzz/src/runtime.d.ts
declare const setBuzzRuntime: (next: PluginRuntime) => void, getBuzzRuntime: () => PluginRuntime;
//#endregion
export { type ResolvedBuzzAccount, buzzPlugin, getBuzzRuntime, listBuzzAccountIds, resolveBuzzAccount, resolveDefaultBuzzAccountId, setBuzzRuntime };