import "./model-auth-markers-CYmICvL9.js";
import "./agent-runtime-BOXRUj3V.js";
import { i as resolveCodexAppServerRuntimeOptions } from "./config-CMOB-0yw.js";
import { n as readCodexAppServerUsage } from "./request-C8ZSIhyj.js";
import { t as buildCodexAppServerUsageSnapshot } from "./rate-limits-Dl7sb89S.js";
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
