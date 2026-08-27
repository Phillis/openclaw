import { l as PluginRuntime } from "./plugin-entry-SSZcu2d5.js";
import "./channel-contract-cEm0yf9M.js";
import "./config-contracts-OcWhZue9.js";
import "./secret-input-CHvO7eLi.js";
import "./runtime-store-r4OnsQxa.js";
//#region src/channels/logging.d.ts
/**
 * Shared channel diagnostic formatters exposed through the plugin SDK.
 * Keep messages compact and stable enough for plugin logs without making them machine contracts.
 */
/** Minimal logger callback shape exposed through channel SDK helpers. */
type LogFn = (message: string) => void;
/** Emits a normalized inbound-drop diagnostic for channel plugins. */
declare function logInboundDrop(params: {
  log: LogFn;
  channel: string;
  reason: string;
  target?: string;
}): void;
//#endregion
//#region src/channels/allowlist-match.d.ts
type AllowlistMatchSource = "wildcard" | "id" | "name" | "tag" | "username" | "prefixed-id" | "prefixed-user" | "prefixed-name" | "slug" | "localpart";
type AllowlistMatch<TSource extends string = AllowlistMatchSource> = {
  allowed: boolean;
  matchKey?: string;
  matchSource?: TSource;
};
//#endregion
//#region extensions/nextcloud-talk/src/runtime.d.ts
declare const setNextcloudTalkRuntime: (next: PluginRuntime) => void, getNextcloudTalkRuntime: () => PluginRuntime;
//#endregion
export { AllowlistMatch as n, logInboundDrop as r, setNextcloudTalkRuntime as t };