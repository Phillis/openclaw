import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { y as resolveIsNixMode } from "./paths-CqeDjSA4.js";
import { r as formatErrorMessage } from "./errors-CqPTYU6G.js";
import { y as setAgentEffectiveModelPrimary } from "./agent-scope-D9GLFAyB.js";
import { n as normalizeAgentId } from "./agent-id-Db0rqw_J.js";
import { t as createSubsystemLogger } from "./subsystem-DNgaGOch.js";
import { n as mutateConfigFileWithRetry } from "./mutate-B2SI65Vd.js";
import "./config-CfeGo4K4.js";
//#region src/agents/sticky-model-selection.ts
const log = createSubsystemLogger("agents/sticky-model-selection");
let warnedImmutableConfig = false;
/** Persists a validated session model selection at the agent's effective config layer. */
async function persistStickyModelSelection(params) {
	const model = normalizeOptionalString(params.model);
	if (!model) throw new Error("Sticky model selection must be non-empty.");
	const agentId = normalizeAgentId(params.agentId);
	const committed = await mutateConfigFileWithRetry({
		afterWrite: { mode: "auto" },
		mutate: (draft) => setAgentEffectiveModelPrimary(draft, agentId, model)
	});
	if (!committed.result) throw new Error("Sticky model config mutation did not return its write target.");
	log.info(`persisted sticky model selection agentId=${agentId} model=${model} target=${committed.result}`);
	return committed.result;
}
/** Starts a best-effort sticky write without delaying or failing the session mutation. */
function persistStickyModelSelectionBestEffort(params) {
	if (resolveIsNixMode()) {
		if (!warnedImmutableConfig) {
			warnedImmutableConfig = true;
			log.warn(`skipped sticky model persistence agentId=${params.agentId} model=${params.model} reason=config is immutable in OPENCLAW_NIX_MODE`);
		}
		return "skipped-immutable";
	}
	persistStickyModelSelection(params).catch((error) => {
		log.warn(`failed sticky model persistence agentId=${params.agentId} model=${params.model} reason=${formatErrorMessage(error)}`);
	});
	return "requested";
}
//#endregion
export { persistStickyModelSelectionBestEffort as t };
