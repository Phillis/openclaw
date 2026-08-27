import "./plugin-entry-CX5-Xb96.js";
import { m as SsrFPolicy } from "./types-Ds-5L62q.js";
import "./legacy-private-network-migration-Blg2MFU5.js";
//#region src/plugin-sdk/ssrf-policy.d.ts
/** Compatibility wrapper for callers that already use the canonical dangerous flag name. */
declare function ssrfPolicyFromDangerouslyAllowPrivateNetwork(dangerouslyAllowPrivateNetwork: boolean | null | undefined): SsrFPolicy | undefined;
//#endregion
export { ssrfPolicyFromDangerouslyAllowPrivateNetwork as t };