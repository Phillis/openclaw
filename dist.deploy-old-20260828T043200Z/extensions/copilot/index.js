import { t as createCopilotAgentHarness } from "./harness-JQ8Wwq2t.js";
import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
import { isRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
//#region extensions/copilot/index.ts
function readPoolOptions(pluginConfig) {
	if (!isRecord(pluginConfig)) return;
	const pool = pluginConfig.pool;
	if (!isRecord(pool)) return;
	const idleTtlMs = pool.idleTtlMs;
	if (typeof idleTtlMs !== "number" || !Number.isFinite(idleTtlMs) || idleTtlMs < 1) return;
	return { idleTtlMs };
}
var copilot_default = definePluginEntry({
	id: "copilot",
	name: "GitHub Copilot agent runtime",
	description: "Registers the GitHub Copilot agent runtime.",
	register(api) {
		if (api.registrationMode !== "full") return;
		const poolOptions = readPoolOptions(api.pluginConfig);
		const sessionStore = api.runtime.state.openSyncKeyedStore({
			namespace: "sdk-sessions",
			maxEntries: 5e3,
			defaultTtlMs: 2160 * 60 * 60 * 1e3
		});
		api.registerAgentHarness(createCopilotAgentHarness({
			...poolOptions ? { poolOptions } : {},
			sessionStore
		}));
	}
});
//#endregion
export { copilot_default as default };
