import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { b as tryResolveAmbientOwnerAgentId } from "./agent-scope-config-CUBiGmG3.js";
import { $t as validateModelsListParams } from "./src-4dv5TpeQ.js";
import { t as assertValidParams } from "./validation-kYFXohur.js";
import { t as resolveAgentIdOrRespondError } from "./agent-id-shared-0q-ojjmE.js";
import { t as buildModelsListResult } from "./models-list-result-xGBxnTUp.js";
//#region src/gateway/server-methods/models.ts
const modelsHandlers = { "models.list": async ({ params, respond, context }) => {
	if (!assertValidParams(params, validateModelsListParams, "models.list", respond)) return;
	const cfg = context.getRuntimeConfig();
	const resolved = resolveAgentIdOrRespondError({
		rawAgentId: params.agentId ?? tryResolveAmbientOwnerAgentId(cfg),
		respond,
		cfg,
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
