import { m as runWithGatewayIndependentRootWorkAdmission } from "./gateway-work-admission-BNrqZgKC.js";
//#region src/gateway/server-idle-task.ts
/** Schedules one low-priority task, retrying until the gateway has no active request roots. */
function scheduleGatewayIdleTask(params) {
	let stopped = false;
	let timer = null;
	const schedule = (delayMs) => {
		if (stopped || params.isClosing()) return;
		timer = setTimeout(() => {
			timer = null;
			if (stopped || params.isClosing()) return;
			if (params.isBusy()) {
				schedule(params.retryDelayMs);
				return;
			}
			runWithGatewayIndependentRootWorkAdmission(async () => {
				if (stopped || params.isClosing()) return;
				if (params.isBusy()) {
					schedule(params.retryDelayMs);
					return;
				}
				await params.run();
			}).catch((error) => params.log.warn(`${params.errorMessage}: ${String(error)}`));
		}, delayMs);
		timer.unref?.();
	};
	schedule(params.delayMs);
	return { stop: () => {
		stopped = true;
		if (timer) {
			clearTimeout(timer);
			timer = null;
		}
	} };
}
//#endregion
export { scheduleGatewayIdleTask as t };
