import { h as resolveSessionAgentId } from "./agent-scope-DigoIwHb.js";
import { l as isUnscopedSessionKeySentinel } from "./session-key-Dbce_H9p.js";
import { o as resolveSessionStorePathCore } from "./paths-DVAvlIOc.js";
import { w as resolveSessionStorePathForScope } from "./session-accessor.sqlite-entry-Ik-U-wpI.js";
import { D as formatTokenCount } from "./sessions-BI8dPUCI.js";
import { n as formatUsd } from "./usage-format-CVbhwZGU.js";
import { a as loadCostUsageSummary, n as loadSessionCostSummary } from "./session-cost-usage-D4LdnKXV.js";
//#region src/auto-reply/reply/commands-session-cost.runtime.ts
async function formatSessionUsageCostSummary(params) {
	const agentId = (params.sessionKey && !isUnscopedSessionKeySentinel(params.sessionKey) ? resolveSessionAgentId({
		sessionKey: params.sessionKey,
		config: params.cfg,
		agentId: params.agentId
	}) : params.agentId) ?? "main";
	const sessionSummary = await loadSessionCostSummary({
		sessionId: params.sessionEntry?.sessionId,
		sessionEntry: params.sessionEntry,
		...params.sessionEntry?.sessionId && params.sessionKey ? { sessionTarget: {
			agentId,
			sessionId: params.sessionEntry.sessionId,
			sessionKey: params.sessionKey,
			storePath: resolveSessionStorePathForScope({
				agentId,
				sessionKey: params.sessionKey,
				storePath: params.storePath ?? resolveSessionStorePathCore(params.cfg.session?.store, { agentId })
			})
		} } : {},
		config: params.cfg,
		agentId
	});
	const summary = await loadCostUsageSummary({
		config: params.cfg,
		agentId
	});
	const sessionCost = formatUsd(sessionSummary?.totalCost);
	const sessionTokens = sessionSummary?.totalTokens ? formatTokenCount(sessionSummary.totalTokens) : void 0;
	const sessionSuffix = (sessionSummary?.missingCostEntries ?? 0) > 0 ? " (partial)" : "";
	const sessionLine = sessionCost || sessionTokens ? `Session ${sessionCost ?? "n/a"}${sessionSuffix}${sessionTokens ? ` · ${sessionTokens} tokens` : ""}` : "Session n/a";
	const todayKey = (/* @__PURE__ */ new Date()).toLocaleDateString("en-CA");
	const todayEntry = summary.daily.find((entry) => entry.date === todayKey);
	const todayCost = formatUsd(todayEntry?.totalCost);
	const todaySuffix = (todayEntry?.missingCostEntries ?? 0) > 0 ? " (partial)" : "";
	const todayLine = `Today ${todayCost ?? "n/a"}${todaySuffix}`;
	const last30Cost = formatUsd(summary.totals.totalCost);
	const last30Suffix = summary.totals.missingCostEntries > 0 ? " (partial)" : "";
	return `💸 Usage cost\n${sessionLine}\n${todayLine}\n${`Last 30d ${last30Cost ?? "n/a"}${last30Suffix}`}`;
}
//#endregion
export { formatSessionUsageCostSummary };
