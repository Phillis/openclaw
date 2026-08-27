import "./agent-scope-BizOtGGz.js";
import "./agent-scope-config-BdXMWufB.js";
import "./model-selection-shared-BSy9FczT.js";
import "./codex-route-model-ref-0uJOp6W2.js";
import "./provider-auth-aliases-BdBosV0l.js";
import "./model-auth-markers-B67UeNMn.js";
import "./model-catalog-Cc-9qe8i.js";
import "./common-BGOZLJ2_.js";
import { i as loadPreparedModelCatalog, n as getPreparedModelCatalogSnapshot } from "./prepared-model-catalog-lswR6K7d.js";
import "./auth-profiles-i3N9ji0c.js";
import "./model-auth-Dv8Z8nNS.js";
import "./model-thinking-default-B9IHGxZs.js";
import "./model-selection-CMo6Emvk.js";
import "./identity-hPPJEi06.js";
import "./embedded-agent-utils-c5haLV7t.js";
import "./tts-D0461XUk.js";
import "./identity-avatar-BVkVT7Ex.js";
import "./agent-command-ej-Gvag6.js";
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
