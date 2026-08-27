import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { Qt as validateModelsListParams } from "./src-Bo4ezI_n.js";
import { t as assertValidParams } from "./validation-CsGeElrb.js";
import { t as resolveAgentIdOrRespondError } from "./agent-id-shared-uNTkOYt3.js";
import { t as buildModelsListResult } from "./models-list-result-DbsoO6QG.js";
//#region src/gateway/server-methods/models.ts
const modelsHandlers = { "models.list": async ({ params, respond, context }) => {
	if (!assertValidParams(params, validateModelsListParams, "models.list", respond)) return;
	const resolved = resolveAgentIdOrRespondError({
		rawAgentId: params.agentId,
		respond,
		cfg: context.getRuntimeConfig(),
		normalize: normalizeOptionalString
	});
	if (!resolved) return;
	respond(true, await buildModelsListResult({
		context,
		agentId: resolved.agentId,
		params
	}), void 0);
} };
//#endregion
export { modelsHandlers };
