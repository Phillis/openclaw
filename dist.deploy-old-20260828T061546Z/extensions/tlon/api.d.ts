import { O as fetchWithSsrFGuard, tt as ReplyPayload, u as PluginRuntime } from "../../plugin-entry-CX5-Xb96.js";
import { n as OpenClawConfig } from "../../types.openclaw-BZZbt-SF.js";
import { N as RuntimeEnv } from "../../target-registry-types-B_YdM07w.js";
import { d as LookupFn, h as isBlockedHostnameOrIp, m as SsrFPolicy, p as SsrFBlockedError } from "../../types-Ds-5L62q.js";
import { n as createDedupeCache, t as createLoggerBackedRuntime } from "../../runtime-api-Bh_0JeDR.js";
import "../../plugin-runtime-D6Il1-it.js";
import { t as ssrfPolicyFromDangerouslyAllowPrivateNetwork } from "../../ssrf-runtime-CZeSsMDU.js";
import { t as tlonPlugin } from "../../channel-BVAZtrtx.js";
//#region extensions/tlon/src/runtime.d.ts
declare const setTlonRuntime: (next: PluginRuntime) => void, getTlonRuntime: () => PluginRuntime;
//#endregion
export { type LookupFn, type OpenClawConfig, type ReplyPayload, type RuntimeEnv, SsrFBlockedError, type SsrFPolicy, createDedupeCache, createLoggerBackedRuntime, fetchWithSsrFGuard, isBlockedHostnameOrIp, setTlonRuntime, ssrfPolicyFromDangerouslyAllowPrivateNetwork, tlonPlugin };