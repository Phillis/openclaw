import { t as ErrorCodes } from "./gateway-error-details-C2IaYyht.js";
import { d as errorShape } from "./validation-errors-rELRlKfn.js";
import { n as getDiagnosticStabilitySnapshot, r as normalizeDiagnosticStabilityQuery } from "./diagnostic-stability-qy3YzwfS.js";
import { t as STATIC_COMMAND_LANES } from "./lanes-CB84sTdr.js";
import { a as getCommandLaneSnapshot, d as listCommandLaneTotals } from "./command-queue-CBS1Vl32.js";
//#region src/process/command-lane-diagnostics.ts
const STATIC_COMMAND_LANE_SET = new Set(STATIC_COMMAND_LANES);
function getCommandLaneDiagnostics() {
	const lanes = [...STATIC_COMMAND_LANES].toSorted().map((lane) => getCommandLaneSnapshot(lane));
	const dynamic = {
		laneCount: 0,
		activeCount: 0,
		queuedCount: 0,
		queuedLaneCount: 0
	};
	for (const totals of listCommandLaneTotals()) {
		if (STATIC_COMMAND_LANE_SET.has(totals.lane)) continue;
		dynamic.laneCount += 1;
		dynamic.activeCount += totals.activeCount;
		dynamic.queuedCount += totals.queuedCount;
		if (totals.queuedCount > 0) dynamic.queuedLaneCount += 1;
	}
	return {
		lanes,
		dynamic: dynamic.laneCount > 0 ? dynamic : null
	};
}
//#endregion
//#region src/gateway/server-methods/diagnostics.ts
/** Gateway handler for payload-free stability diagnostics. */
const diagnosticsHandlers = {
	"diagnostics.lanes": ({ respond }) => {
		respond(true, {
			ts: Date.now(),
			...getCommandLaneDiagnostics()
		}, void 0);
	},
	"diagnostics.stability": async ({ params, respond }) => {
		try {
			respond(true, getDiagnosticStabilitySnapshot(normalizeDiagnosticStabilityQuery(params)), void 0);
		} catch (err) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, err instanceof Error ? err.message : "invalid diagnostics.stability params"));
		}
	}
};
//#endregion
export { diagnosticsHandlers };
