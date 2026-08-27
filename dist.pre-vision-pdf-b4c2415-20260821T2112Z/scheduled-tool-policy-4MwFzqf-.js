import { L as normalizeCronScheduledToolPolicy } from "./row-codec-BXU8Ei5n.js";
//#region src/agents/scheduled-tool-policy.ts
/** Builds scheduled policy context only when both the cap and trusted owner exist. */
function resolveScheduledToolPolicyContext(params) {
	if (params.toolsAllow === void 0) return;
	return normalizeCronScheduledToolPolicy(params.scheduledToolPolicy);
}
//#endregion
export { resolveScheduledToolPolicyContext as t };
