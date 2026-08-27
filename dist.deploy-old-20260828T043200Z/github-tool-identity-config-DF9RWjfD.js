import "./agent-scope-DigoIwHb.js";
import { _ as resolveMutableAgentEntry } from "./agent-scope-config-CUBiGmG3.js";
import { i as unsetConfigValueAtPath } from "./config-paths-D1t7OvDK.js";
import { n as mutateConfigFileWithRetry } from "./mutate-C_fsUarr.js";
import "./config-B2bSneS2.js";
import { s as matchesAgentLifecycleBinding } from "./agent-lifecycle-registry-D1dm9wFG.js";
import { t as applyAgentConfig } from "./agents.config-b213TBEZ.js";
import { isDeepStrictEqual } from "node:util";
//#region src/gateway/github-tool-identity-config.ts
function sameIdentity(left, right) {
	return isDeepStrictEqual(left ?? null, right);
}
async function updateGitHubToolIdentityConfig(params) {
	return (await mutateConfigFileWithRetry({
		afterWrite: { mode: "auto" },
		mutate: (draft) => {
			if (params.scope === "system") {
				if (params.expectedIdentity !== void 0 && !sameIdentity(draft.tools?.github, params.expectedIdentity)) throw new Error("GitHub identity changed while setup was in progress.");
				draft.tools ??= {};
				if (params.identity) draft.tools.github = params.identity;
				else unsetConfigValueAtPath(draft, ["tools", "github"]);
				return;
			}
			if (params.agentLifecycleBinding && !matchesAgentLifecycleBinding(draft, params.agentLifecycleBinding)) throw new Error("Agent changed while GitHub setup was in progress.");
			let entry = resolveMutableAgentEntry(draft, params.agentId);
			if (params.agentLifecycleBinding && !entry) throw new Error("Agent changed while GitHub setup was in progress.");
			if (params.expectedIdentity !== void 0 && !sameIdentity(entry?.tools?.github, params.expectedIdentity)) throw new Error("GitHub identity changed while setup was in progress.");
			if (!entry && params.identity && !params.agentLifecycleBinding) {
				Object.assign(draft, applyAgentConfig(draft, { agentId: params.agentId }));
				entry = resolveMutableAgentEntry(draft, params.agentId);
			}
			if (!entry) return;
			entry.tools ??= {};
			if (params.identity) entry.tools.github = params.identity;
			else unsetConfigValueAtPath(entry, ["tools", "github"]);
		}
	})).nextConfig;
}
//#endregion
export { updateGitHubToolIdentityConfig as t };
