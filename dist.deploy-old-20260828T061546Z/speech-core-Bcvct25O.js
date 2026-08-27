import { x as parseStrictFiniteNumber } from "./number-coercion-CLj0HTDM.js";
import "./provider-http-errors-BXG5plR9.js";
import "./tts-config-DgBDj2SP.js";
import "./directives-r7hZudXu.js";
import "./tts-core-BU9EbufS.js";
//#region src/tts/directive-number.ts
function isInDirectiveNumberRange(value, range) {
	if (range.min !== void 0 && (range.minExclusive ? value <= range.min : value < range.min)) return false;
	if (range.max !== void 0 && (range.maxExclusive ? value >= range.max : value > range.max)) return false;
	return true;
}
/** Parse a numeric speech directive token and return provider overrides when policy allows it. */
function parseSpeechDirectiveNumberOverride(params) {
	if (!params.ctx.policy.allowVoiceSettings) return { handled: true };
	const value = parseStrictFiniteNumber(params.ctx.value);
	if (value === void 0 || !isInDirectiveNumberRange(value, params.range)) return {
		handled: true,
		warnings: [params.warning(params.ctx.value)]
	};
	const nextOverride = { [params.overrideKey]: value };
	return {
		handled: true,
		overrides: params.mergeCurrentOverrides ? {
			...params.ctx.currentOverrides,
			...nextOverride
		} : nextOverride
	};
}
//#endregion
export { parseSpeechDirectiveNumberOverride as t };
