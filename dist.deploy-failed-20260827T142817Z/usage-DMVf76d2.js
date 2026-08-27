import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { p as readProviderJsonResponse } from "./provider-http-errors-BH2HGv8j.js";
import { s as buildCopilotIdeHeaders } from "./copilot-dynamic-headers-C42FH9jo.js";
import "./provider-auth-DVDSRG1v.js";
import "./string-coerce-runtime-D9ocX9lc.js";
import "./provider-http-DfD6NQiF.js";
import { r as clampPercent, t as PROVIDER_LABELS } from "./provider-usage.shared-DxRYR38m.js";
import { S as fetchJson, x as buildUsageHttpErrorSnapshot } from "./provider-usage-1oom5YwM.js";
import { t as PUBLIC_GITHUB_COPILOT_DOMAIN } from "./domain-Bbe8oFEv.js";
//#region extensions/github-copilot/usage.ts
async function fetchCopilotUsage(token, timeoutMs, fetchFn, githubDomain = PUBLIC_GITHUB_COPILOT_DOMAIN) {
	const res = await fetchJson(`https://api.${githubDomain}/copilot_internal/user`, { headers: {
		Authorization: `token ${token}`,
		...buildCopilotIdeHeaders({ includeApiVersion: true })
	} }, timeoutMs, fetchFn);
	if (!res.ok) {
		await res.body?.cancel().catch(() => void 0);
		return buildUsageHttpErrorSnapshot({
			provider: "github-copilot",
			status: res.status
		});
	}
	const payload = await readProviderJsonResponse(res, "github-copilot-usage");
	const data = isRecord(payload) ? payload : {};
	const windows = [];
	if (data.quota_snapshots?.premium_interactions) {
		const remaining = data.quota_snapshots.premium_interactions.percent_remaining;
		windows.push({
			label: "Premium",
			usedPercent: clampPercent(100 - (remaining ?? 0))
		});
	}
	if (data.quota_snapshots?.chat) {
		const remaining = data.quota_snapshots.chat.percent_remaining;
		windows.push({
			label: "Chat",
			usedPercent: clampPercent(100 - (remaining ?? 0))
		});
	}
	return {
		provider: "github-copilot",
		displayName: PROVIDER_LABELS["github-copilot"],
		windows,
		plan: data.copilot_plan
	};
}
//#endregion
export { fetchCopilotUsage as t };
