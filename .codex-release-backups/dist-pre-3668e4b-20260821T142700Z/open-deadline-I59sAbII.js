import { i as toErrorObject } from "./error-coercion-DisD0JTb.js";
import "./errors-CqPTYU6G.js";
//#region src/gateway/terminal/open-deadline.ts
const TERMINAL_OPEN_DEADLINE_MS = 3e4;
var TerminalOpenDeadlineError = class extends Error {
	constructor() {
		super("terminal open timed out");
		this.name = "TerminalOpenDeadlineError";
	}
};
function createTerminalOpenDeadline() {
	return {
		expiresAtMs: Date.now() + TERMINAL_OPEN_DEADLINE_MS,
		controller: new AbortController()
	};
}
function expireTerminalOpenDeadline(deadline) {
	if (!deadline.controller.signal.aborted) deadline.controller.abort(new TerminalOpenDeadlineError());
	return toErrorObject(deadline.controller.signal.reason, "Terminal open timed out");
}
async function waitForTerminalOpenDeadline(run, deadline) {
	if (deadline.controller.signal.aborted || Date.now() >= deadline.expiresAtMs) throw expireTerminalOpenDeadline(deadline);
	return await new Promise((resolve, reject) => {
		const onAbort = () => {
			clearTimeout(timer);
			reject(expireTerminalOpenDeadline(deadline));
		};
		const timer = setTimeout(() => expireTerminalOpenDeadline(deadline), Math.max(0, deadline.expiresAtMs - Date.now()));
		deadline.controller.signal.addEventListener("abort", onAbort, { once: true });
		let promise;
		try {
			promise = run();
		} catch (error) {
			if (deadline.controller.signal.aborted || Date.now() >= deadline.expiresAtMs) {
				expireTerminalOpenDeadline(deadline);
				return;
			}
			clearTimeout(timer);
			deadline.controller.signal.removeEventListener("abort", onAbort);
			reject(toErrorObject(error, "Terminal open failed"));
			return;
		}
		promise.then((value) => {
			if (deadline.controller.signal.aborted || Date.now() >= deadline.expiresAtMs) {
				expireTerminalOpenDeadline(deadline);
				return;
			}
			clearTimeout(timer);
			deadline.controller.signal.removeEventListener("abort", onAbort);
			resolve(value);
		}, (error) => {
			if (deadline.controller.signal.aborted || Date.now() >= deadline.expiresAtMs) {
				expireTerminalOpenDeadline(deadline);
				return;
			}
			clearTimeout(timer);
			deadline.controller.signal.removeEventListener("abort", onAbort);
			reject(toErrorObject(error, "Terminal open failed"));
		});
	});
}
//#endregion
export { waitForTerminalOpenDeadline as i, TerminalOpenDeadlineError as n, createTerminalOpenDeadline as r, TERMINAL_OPEN_DEADLINE_MS as t };
