import "./agent-scope-D9GLFAyB.js";
import "./agent-scope-config-CsnnOL14.js";
import "./model-selection-shared-0DI3vxkL.js";
import "./codex-route-model-ref-WCq2iqcj.js";
import "./provider-auth-aliases-bf2JoQuN.js";
import "./model-auth-markers-DzAepWRR.js";
import "./model-catalog-C8gwRpA7.js";
import "./common-ciEJghJz.js";
import { i as loadPreparedModelCatalog, n as getPreparedModelCatalogSnapshot } from "./prepared-model-catalog-DFpNDAcU.js";
import "./auth-profiles-TorfVJYv.js";
import "./model-auth-BgXCiN_L.js";
import "./model-thinking-default-B1YtMmAp.js";
import "./model-selection-BEGvRdL1.js";
import "./identity-C85RCD_6.js";
import "./embedded-agent-utils-D4SXH5E3.js";
import "./tts-QE2khNZ2.js";
import "./identity-avatar-CP0iSqOC.js";
import "./agent-command-CK_38BwD.js";
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
