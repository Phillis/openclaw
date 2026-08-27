import { n as GATEWAY_CLIENT_IDS } from "./client-info-UYcIi_5g.js";
import { f as isApprovalRecordVisibleToClient } from "./approval-shared-C_QNR0ZK.js";
//#region src/gateway/server-methods/approval-request-delivery.ts
function resolveFirstSuccessfulApprovalDelivery(deliveryTasks) {
	return new Promise((resolve) => {
		let remaining = deliveryTasks.length;
		for (const delivery of deliveryTasks) delivery.then((delivered) => {
			if (delivered) {
				resolve(true);
				return;
			}
			remaining -= 1;
			if (remaining === 0) resolve(false);
		});
	});
}
/** Runs external approval deliveries concurrently and reports whether any route accepted. */
function runApprovalRequestDeliveries(params) {
	const isTargetVisible = (target) => isApprovalRecordVisibleToClient({
		record: params.record,
		client: { connect: {
			client: { id: GATEWAY_CLIENT_IDS.IOS_APP },
			device: { id: target.deviceId },
			scopes: [...target.scopes]
		} }
	});
	const deliveryTasks = [params.forward, params.iosPush].flatMap((delivery) => {
		if (!delivery) return [];
		const [run, errorLabel] = delivery;
		return [run(isTargetVisible).catch((err) => {
			params.context.logGateway?.error?.(`${errorLabel}: ${String(err)}`);
			return false;
		})];
	});
	if (deliveryTasks.length === 0) return false;
	return resolveFirstSuccessfulApprovalDelivery(deliveryTasks);
}
//#endregion
export { runApprovalRequestDeliveries as t };
