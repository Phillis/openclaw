import { r as SsrFPolicy, t as LookupFn } from "./ssrf-CIroieCz.js";
//#region src/plugin-sdk/ssrf-policy.d.ts
/** Compatibility wrapper for callers that already use the canonical dangerous flag name. */
declare function ssrfPolicyFromDangerouslyAllowPrivateNetwork(dangerouslyAllowPrivateNetwork: boolean | null | undefined): SsrFPolicy | undefined;
/** Allows cleartext HTTP only when the target is loopback/private or DNS-pins to private IPs. */
declare function assertHttpUrlTargetsPrivateNetwork(url: string, params?: {
  dangerouslyAllowPrivateNetwork?: boolean | null;
  allowPrivateNetwork?: boolean | null;
  lookupFn?: LookupFn;
  errorMessage?: string;
}): Promise<void>;
//#endregion
export { ssrfPolicyFromDangerouslyAllowPrivateNetwork as n, assertHttpUrlTargetsPrivateNetwork as t };