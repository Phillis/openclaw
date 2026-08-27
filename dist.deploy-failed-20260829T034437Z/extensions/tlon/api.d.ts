import { O as fetchWithSsrFGuard, tt as ReplyPayload, u as PluginRuntime } from "../../plugin-entry-BZAeuuKK.js";
import { n as OpenClawConfig } from "../../types.openclaw-CZEJqSSW.js";
import { N as RuntimeEnv } from "../../target-registry-types-Ny7UXMrh.js";
import { d as LookupFn, h as isBlockedHostnameOrIp, m as SsrFPolicy, p as SsrFBlockedError } from "../../types-Cu0KgzqG.js";
import { n as createDedupeCache, t as createLoggerBackedRuntime } from "../../runtime-api-Bb8YjPoK.js";
import "../../plugin-runtime-DYJVcb_O.js";
import { t as ssrfPolicyFromDangerouslyAllowPrivateNetwork } from "../../ssrf-runtime-BvO_PP7L.js";
import { t as tlonPlugin } from "../../channel-CicyN9z6.js";
//#region extensions/tlon/src/runtime.d.ts
declare const setTlonRuntime: (next: PluginRuntime) => void, getTlonRuntime: () => PluginRuntime;
//#endregion
export { type LookupFn, type OpenClawConfig, type ReplyPayload, type RuntimeEnv, SsrFBlockedError, type SsrFPolicy, createDedupeCache, createLoggerBackedRuntime, fetchWithSsrFGuard, isBlockedHostnameOrIp, setTlonRuntime, ssrfPolicyFromDangerouslyAllowPrivateNetwork, tlonPlugin };