import { x as parseStrictFiniteNumber } from "./number-coercion-oCkfUEEq.js";
import "./provider-http-errors-DwYSuIHs.js";
import "./tts-config-FJpaUUd1.js";
import "./directives-C8r_PhR_.js";
import "./tts-core-r_d5AU_9.js";
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
