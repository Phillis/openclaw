import "./model-auth-markers-DzAepWRR.js";
import "./agent-runtime-CCLh0N8D.js";
import { x as resolveCodexAppServerRuntimeOptions } from "./session-binding-BpH4J33R.js";
import { t as buildCodexAppServerUsageSnapshot } from "./rate-limits-CiiXaSRg.js";
import { t as readCodexAppServerUsage } from "./request-BQTgc8FH.js";
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
