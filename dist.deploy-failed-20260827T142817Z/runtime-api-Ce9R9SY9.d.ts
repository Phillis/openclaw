import { k as PluginRuntime } from "./types-Ci1t4mxf.js";
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
export { AllowlistMatch as n, setNextcloudTalkRuntime as t };