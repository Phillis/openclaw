import "./types-CiLdD6DO.js";
import { c as PluginHookReplyDispatchEvent, l as PluginHookReplyDispatchResult, s as PluginHookReplyDispatchContext } from "./hook-types-CUXXcZtC.js";
//#region src/plugin-sdk/acpx.d.ts
/**
 * Dispatch a plugin reply hook through ACP when the event targets an ACP-bound session.
 * Returns a handled result only when ACP consumes the reply; otherwise callers continue normal delivery.
 */
declare function tryDispatchAcpReplyHook(event: PluginHookReplyDispatchEvent, ctx: PluginHookReplyDispatchContext): Promise<PluginHookReplyDispatchResult | void>;
//#endregion
export { tryDispatchAcpReplyHook as t };