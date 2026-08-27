import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { y as resolveIsNixMode } from "./paths-BBSTUjD5.js";
import { r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
import { y as setAgentEffectiveModelPrimary } from "./agent-scope-DigoIwHb.js";
import { n as normalizeAgentId } from "./agent-id-CeT3w4ap.js";
import { t as createSubsystemLogger } from "./subsystem-a4KzJVZG.js";
import { n as mutateConfigFileWithRetry } from "./mutate-C_fsUarr.js";
import "./config-B2bSneS2.js";
//#region src/agents/sticky-model-selection.ts
const log = createSubsystemLogger("agents/sticky-model-selection");
let warnedImmutableConfig = false;
/** Resolve preference only; callers must separately authorize config writes. */
function resolveStickyModelSelectionScope(params) {
	return params.scope ?? params.cfg.agents?.defaults?.modelSelectionScope ?? "effective";
}
/** Persists a validated session model selection at the agent's effective config layer. */
async function persistStickyModelSelection(params) {
	const model = normalizeOptionalString(params.model);
	if (!model) throw new Error("Sticky model selection must be non-empty.");
	const agentId = normalizeAgentId(params.agentId);
	const committed = await mutateConfigFileWithRetry({
		afterWrite: { mode: "auto" },
		mutate: (draft) => setAgentEffectiveModelPrimary(draft, agentId, model, params.target ? { target: params.target } : {})
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
export { resolveStickyModelSelectionScope as n, persistStickyModelSelectionBestEffort as t };
