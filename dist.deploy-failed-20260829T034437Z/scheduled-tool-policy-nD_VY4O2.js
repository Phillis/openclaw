import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { L as normalizeCronScheduledToolCallerOrigin, R as normalizeCronScheduledToolPolicy } from "./row-codec-LoN9q1nV.js";
//#region src/agents/scheduled-tool-policy.ts
/** Separates a scheduled creator's authorization identity from its delivery route. */
function resolveScheduledToolCallerContext(params) {
	const policy = params.scheduledToolPolicy;
	const origin = policy?.mode === "account" ? policy.ownerOrigin : void 0;
	return {
		accountId: policy?.ownerAccountId ?? params.accountId,
		...policy ? { scheduled: true } : {},
		...origin?.kind === "local" ? { local: true } : {},
		channel: origin?.kind === "external" ? origin.channel : origin?.kind === "local" ? void 0 : policy?.mode === "account" ? null : params.channel
	};
}
/** Builds scheduled policy context only when both the cap and trusted owner exist. */
function resolveScheduledToolPolicyContext(params) {
	if (params.toolsAllow === void 0) return;
	const rawPolicy = params.scheduledToolPolicy;
	const policy = normalizeCronScheduledToolPolicy(isRecord(rawPolicy) && rawPolicy.mode === "account" ? {
		version: rawPolicy.version,
		mode: rawPolicy.mode,
		ownerSessionKey: rawPolicy.ownerSessionKey,
		ownerAccountId: rawPolicy.ownerAccountId
	} : rawPolicy);
	if (!policy || policy.mode === "trusted") return policy;
	return {
		...policy,
		ownerOrigin: normalizeCronScheduledToolCallerOrigin(params.callerOrigin ?? (isRecord(rawPolicy) ? rawPolicy.ownerOrigin : void 0))
	};
}
//#endregion
export { resolveScheduledToolPolicyContext as n, resolveScheduledToolCallerContext as t };
