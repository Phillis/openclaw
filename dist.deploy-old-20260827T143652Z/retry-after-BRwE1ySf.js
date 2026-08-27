import { c as asFiniteNumberInRange, x as parseStrictFiniteNumber } from "./number-coercion-oCkfUEEq.js";
import "./number-runtime-CoAPZzJY.js";
//#region extensions/discord/src/retry-after.ts
const RETRY_AFTER_BODY_SECONDS_RE = /^(?:\d+\.?\d*|\.\d+)$/;
const MAX_SAFE_RETRY_AFTER_SECONDS = Number.MAX_SAFE_INTEGER / 1e3;
function parseDiscordRetryAfterBodySeconds(value) {
	return asFiniteNumberInRange(typeof value === "number" ? value : typeof value === "string" && RETRY_AFTER_BODY_SECONDS_RE.test(value.trim()) ? parseStrictFiniteNumber(value.trim()) : void 0, {
		min: 0,
		max: MAX_SAFE_RETRY_AFTER_SECONDS
	});
}
//#endregion
export { parseDiscordRetryAfterBodySeconds as t };
