import { r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
import { t as createSubsystemLogger } from "./subsystem-a4KzJVZG.js";
import { t as isDiagnosticFlagEnabled } from "./diagnostic-flags-Doha8xVC.js";
import { a as listContextEngineQuarantines } from "./registry-BL4inl-J.js";
import { n as countFailedDeliveryQueueEntries } from "./delivery-queue-sqlite-YQvmsrNF.js";
import { n as countFailedChannelIngressQueueEntries, t as countChannelIngressQueuePressure } from "./ingress-queue-health-ytiSSc2A.js";
//#region src/gateway/health/context-engine.ts
/** Projects active context-engine quarantines into the public health shape. */
function buildContextEngineHealthSummary() {
	const quarantined = listContextEngineQuarantines().map((entry) => {
		const summary = {
			engineId: entry.engineId,
			operation: entry.operation,
			reason: entry.reason,
			failedAt: entry.failedAt.getTime()
		};
		return entry.owner ? Object.assign(summary, { owner: entry.owner }) : summary;
	});
	return quarantined.length > 0 ? { quarantined } : void 0;
}
//#endregion
//#region src/gateway/health/delivery-queue.ts
const healthLog = createSubsystemLogger("health");
const debugHealth = (message, error) => {
	if (isDiagnosticFlagEnabled("health")) healthLog.info(message, { error: formatErrorMessage(error) });
};
function readQueueHealth(message, read) {
	try {
		return read();
	} catch (error) {
		debugHealth(message, error);
		return [];
	}
}
/** Builds redacted inbound pressure and dead-letter health for gateway snapshots. */
function buildDeliveryQueueHealthSummary(cachedIngressPressure) {
	const failed = readQueueHealth("outbound delivery queue health read failed", countFailedDeliveryQueueEntries);
	const ingressFailed = readQueueHealth("channel ingress failed queue health read failed", countFailedChannelIngressQueueEntries);
	const ingressPressure = cachedIngressPressure ?? readQueueHealth("channel ingress pressure health read failed", countChannelIngressQueuePressure);
	if (failed.length === 0 && ingressFailed.length === 0 && ingressPressure.length === 0) return;
	return {
		failed,
		...ingressFailed.length > 0 ? { ingressFailed } : {},
		...ingressPressure.length > 0 ? { ingressPressure } : {}
	};
}
//#endregion
export { buildContextEngineHealthSummary as n, buildDeliveryQueueHealthSummary as t };
