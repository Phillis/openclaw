import "./agent-scope-DigoIwHb.js";
import "./agent-scope-config-CUBiGmG3.js";
import "./model-selection-shared-I5TmV9jL.js";
import "./provider-auth-aliases-Csz_STEP.js";
import "./codex-route-model-ref-Du1KAbLA.js";
import "./model-auth-markers-CYmICvL9.js";
import "./model-catalog-BCGmKLlL.js";
import { a as loadPreparedModelCatalog, r as getPreparedModelCatalogSnapshot } from "./prepared-model-catalog-U3rYWrrQ.js";
import "./common-CI1GnPjt.js";
import "./auth-profiles-zge5bJtu.js";
import "./model-auth-e0nL7cI2.js";
import "./model-selection-DHDS-v4K.js";
import "./model-thinking-default-Bs5EBLjZ.js";
import "./identity-Cc11oAxY.js";
import "./embedded-agent-utils-91E_Bwfx.js";
import "./tts-DNxFkuxh.js";
import "./identity-avatar-DILEXnwu.js";
import "./agent-command-iuozXiiI.js";
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
