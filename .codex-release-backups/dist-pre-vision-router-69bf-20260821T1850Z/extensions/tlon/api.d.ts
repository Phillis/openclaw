import { M as ReplyPayload, k as PluginRuntime } from "../../types-BC3VLVBd.js";
import { n as OpenClawConfig } from "../../types.openclaw-eGZBtvai.js";
import { j as RuntimeEnv } from "../../manifest-registry-BzRPksH-.js";
import { a as isBlockedHostnameOrIp, i as SsrFPolicy, r as SsrFBlockedError, t as LookupFn } from "../../ssrf-CX7egwMk.js";
import { o as fetchWithSsrFGuard } from "../../provider-request-config-B7W6uKKc.js";
import { t as createDedupeCache } from "../../reply-runtime-Bj1cOltM.js";
import { t as ssrfPolicyFromDangerouslyAllowPrivateNetwork } from "../../ssrf-runtime-DJG6cou9.js";
import { t as createLoggerBackedRuntime } from "../../runtime-api-DYPeJosx.js";
import { t as tlonPlugin } from "../../channel-rG4HQgDe.js";

//#region extensions/tlon/src/runtime.d.ts
declare const setTlonRuntime: (next: PluginRuntime) => void, getTlonRuntime: () => PluginRuntime;
//#endregion
export { type LookupFn, type OpenClawConfig, type ReplyPayload, type RuntimeEnv, SsrFBlockedError, type SsrFPolicy, createDedupeCache, createLoggerBackedRuntime, fetchWithSsrFGuard, isBlockedHostnameOrIp, setTlonRuntime, ssrfPolicyFromDangerouslyAllowPrivateNetwork, tlonPlugin };