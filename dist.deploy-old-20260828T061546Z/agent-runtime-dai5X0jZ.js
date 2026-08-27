import "./agent-scope-DigoIwHb.js";
import "./agent-scope-config-CUBiGmG3.js";
import "./model-selection-shared-DbjoXfPH.js";
import "./provider-auth-aliases-BoHcdoGc.js";
import "./codex-route-model-ref-BJZ-8dtR.js";
import "./model-auth-markers-Dy2BML3M.js";
import "./model-catalog-SLrvGBJu.js";
import { a as loadPreparedModelCatalog, r as getPreparedModelCatalogSnapshot } from "./prepared-model-catalog-hBq_POnm.js";
import "./common-CI1GnPjt.js";
import "./auth-profiles-wr_j3m1O.js";
import "./model-auth-BWLQILnV.js";
import "./model-selection-Cp8EGD61.js";
import "./model-thinking-default-DduLSMYL.js";
import "./identity-Cc11oAxY.js";
import "./embedded-agent-utils-DlrP62Rs.js";
import "./tts-CPk-KJAA.js";
import "./identity-avatar-Dd7hUjNQ.js";
import "./agent-command-BGJF3gqo.js";
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
