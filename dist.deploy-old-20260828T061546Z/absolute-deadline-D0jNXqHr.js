import { n as MAX_TIMER_TIMEOUT_MS } from "./number-coercion-CLj0HTDM.js";
//#region src/utils/absolute-deadline.ts
const ABSOLUTE_DEADLINE_EXPIRED = Symbol("absolute deadline expired");
/** Bounds one operation by an absolute wall-clock deadline. */
async function awaitWithinDeadline(operation, deadlineAtMs) {
	if (deadlineAtMs === void 0) return await operation();
	if (Math.max(0, deadlineAtMs - Date.now()) === 0) return ABSOLUTE_DEADLINE_EXPIRED;
	let timer;
	try {
		const deadline = new Promise((resolve) => {
			const waitForDeadline = () => {
				const remainingMs = Math.max(0, deadlineAtMs - Date.now());
				if (remainingMs === 0) {
					resolve(ABSOLUTE_DEADLINE_EXPIRED);
					return;
				}
				timer = setTimeout(waitForDeadline, Math.min(remainingMs, MAX_TIMER_TIMEOUT_MS));
			};
			waitForDeadline();
		});
		return await Promise.race([deadline, operation().then((result) => Date.now() >= deadlineAtMs ? ABSOLUTE_DEADLINE_EXPIRED : result)]);
	} finally {
		if (timer !== void 0) clearTimeout(timer);
	}
}
//#endregion
export { awaitWithinDeadline as n, ABSOLUTE_DEADLINE_EXPIRED as t };
