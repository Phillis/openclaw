import { Et as GroupPolicy } from "./types.openclaw-n6JIVcIK.js";
import "./config-contracts-B5xWKcfz.js";
//#region extensions/zalo/src/group-access.d.ts
declare function resolveZaloRuntimeGroupPolicy(params: {
  providerConfigPresent: boolean;
  groupPolicy?: GroupPolicy;
  defaultGroupPolicy?: GroupPolicy;
}): {
  groupPolicy: GroupPolicy;
  providerMissingFallbackApplied: boolean;
};
//#endregion
export { resolveZaloRuntimeGroupPolicy as t };