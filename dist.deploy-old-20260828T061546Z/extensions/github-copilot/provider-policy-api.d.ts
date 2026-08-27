import { f as ProviderDefaultThinkingPolicyContext } from "../../plugin-entry-C1So83n6.js";
//#region extensions/github-copilot/provider-policy-api.d.ts
declare function resolveThinkingProfile(context: ProviderDefaultThinkingPolicyContext): {
  levels: ({
    id: "xhigh" | "max";
  } | {
    id: "off";
  } | {
    id: "minimal";
  } | {
    id: "low";
  } | {
    id: "medium";
  } | {
    id: "high";
  })[];
} | null;
//#endregion
export { resolveThinkingProfile };