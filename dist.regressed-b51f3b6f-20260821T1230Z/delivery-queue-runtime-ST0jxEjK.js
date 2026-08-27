import { r as createLazyRuntimeModule } from "./lazy-runtime-CgCh8H_K.js";
import { m as runWithGatewayIndependentRootWorkAdmission } from "./gateway-work-admission-QDz202p9.js";
import { t as drainPendingDeliveriesCore } from "./delivery-queue-recovery-5IPw6isX.js";
//#region src/plugin-sdk/delivery-queue-runtime.ts
const loadOutboundDeliverRuntime = createLazyRuntimeModule(() => import("./deliver-runtime-D7oG6UaE.js"));
/**
* Drain queued outbound payloads after a channel reconnect or transport recovery.
* When no deliver function is provided, the heavy outbound delivery runtime is
* loaded lazily so importing this SDK subpath does not eagerly bind send internals.
*/
async function drainPendingDeliveries(opts) {
	await runWithGatewayIndependentRootWorkAdmission(async () => {
		const deliver = opts.deliver ?? (await loadOutboundDeliverRuntime()).deliverOutboundPayloadsInternal;
		await drainPendingDeliveriesCore({
			...opts,
			deliver
		});
	});
}
//#endregion
export { drainPendingDeliveries as t };
