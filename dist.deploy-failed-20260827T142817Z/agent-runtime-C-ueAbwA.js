import "./agent-scope-BizOtGGz.js";
import "./agent-scope-config-BdXMWufB.js";
import "./model-selection-shared-DT9x3Cg2.js";
import "./codex-route-model-ref-Bw2nFxxx.js";
import "./provider-auth-aliases-BN9nuenf.js";
import "./model-auth-markers-DJWHSR2r.js";
import "./model-catalog-D1JZ_G7y.js";
import "./common-BGOZLJ2_.js";
import { i as loadPreparedModelCatalog, n as getPreparedModelCatalogSnapshot } from "./prepared-model-catalog-BFweRhks.js";
import "./auth-profiles-DybBsKKK.js";
import "./model-auth-B7VlMZMb.js";
import "./model-thinking-default-CJJQK-S8.js";
import "./model-selection-BhpnS-Rv.js";
import "./identity-hPPJEi06.js";
import "./embedded-agent-utils-BD59s5tV.js";
import "./tts-C3n_GppM.js";
import "./identity-avatar-BuQ1R1pA.js";
import "./agent-command-BI3VYNa6.js";
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
