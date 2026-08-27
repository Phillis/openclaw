import "./agent-scope-BizOtGGz.js";
import "./agent-scope-config-BdXMWufB.js";
import "./model-selection-shared-BSy9FczT.js";
import "./codex-route-model-ref-0uJOp6W2.js";
import "./provider-auth-aliases-BdBosV0l.js";
import "./model-auth-markers-B67UeNMn.js";
import "./model-catalog-DRC51wnt.js";
import "./common-BGOZLJ2_.js";
import { i as loadPreparedModelCatalog, n as getPreparedModelCatalogSnapshot } from "./prepared-model-catalog-BcJkNkF9.js";
import "./auth-profiles-C5SvE-Ih.js";
import "./model-auth-Dah4Ay9K.js";
import "./model-thinking-default-B9IHGxZs.js";
import "./model-selection-Adc4uFq_.js";
import "./identity-hPPJEi06.js";
import "./embedded-agent-utils-c5haLV7t.js";
import "./tts-6U7zcHmD.js";
import "./identity-avatar-BVkVT7Ex.js";
import "./agent-command-BIPK24tL.js";
//#region src/plugin-sdk/agent-runtime.ts
/** @deprecated Use loadPreparedModelCatalog or getPreparedModelCatalogSnapshot. */
async function loadModelCatalog(params = {}) {
	const { agentId, agentDir, cacheOnly, config, env, readOnly, workspaceDir } = params;
	const preparedParams = {
		...agentId ? { agentId } : {},
		...agentDir ? { agentDir } : {},
		...config ? { config } : {},
		...env ? { env } : {},
		...readOnly !== void 0 ? { readOnly } : {},
		...workspaceDir ? { workspaceDir } : {}
	};
	if (cacheOnly) return getPreparedModelCatalogSnapshot(preparedParams)?.entries ?? [];
	return await loadPreparedModelCatalog(preparedParams);
}
//#endregion
export { loadModelCatalog as t };
