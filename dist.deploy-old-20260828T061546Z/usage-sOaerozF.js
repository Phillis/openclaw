import "./model-auth-markers-Dy2BML3M.js";
import "./agent-runtime-dai5X0jZ.js";
import { i as resolveCodexAppServerRuntimeOptions } from "./config-Cup3m5Mg.js";
import { n as readCodexAppServerUsage } from "./request-D5ZqL_4v.js";
import { t as buildCodexAppServerUsageSnapshot } from "./rate-limits-DR7azd8a.js";
//#region extensions/codex/src/app-server/usage.ts
/** Handles the synthetic usage credential for a Codex-backed OpenAI route. */
async function fetchCodexAppServerUsageSnapshot(ctx, options = {}) {
	if (ctx.token !== "codex-app-server") return null;
	const appServer = resolveCodexAppServerRuntimeOptions({ pluginConfig: options.pluginConfig });
	const usage = await (options.readUsage ?? readCodexAppServerUsage)({
		timeoutMs: ctx.timeoutMs,
		agentDir: ctx.agentDir,
		...ctx.authProfileId ? { authProfileId: ctx.authProfileId } : {},
		config: ctx.config,
		startOptions: appServer.start
	});
	const snapshot = buildCodexAppServerUsageSnapshot(usage.rateLimits);
	const accountEmail = ctx.email ?? usage.accountEmail;
	return accountEmail && !snapshot.error ? {
		...snapshot,
		accountEmail
	} : snapshot;
}
//#endregion
export { fetchCodexAppServerUsageSnapshot };
