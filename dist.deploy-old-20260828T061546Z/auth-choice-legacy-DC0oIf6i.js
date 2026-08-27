import { t as resolveManifestDeprecatedProviderAuthChoice } from "./provider-auth-choices-DZw3W3ra.js";
//#region src/commands/auth-choice-legacy.ts
const LEGACY_REPLACEMENT_AUTH_CHOICES = /* @__PURE__ */ new Set(["claude-cli"]);
function resolveLegacyCliBackendChoice(choice, params) {
	if (!LEGACY_REPLACEMENT_AUTH_CHOICES.has(choice)) return;
	return resolveManifestDeprecatedProviderAuthChoice(choice, params);
}
function resolveReplacementLabel(choiceLabel) {
	return choiceLabel.trim() || "the replacement auth choice";
}
/** Map old onboard auth choices to their current provider-backed choices. */
function normalizeLegacyOnboardAuthChoice(authChoice, params) {
	if (authChoice === "oauth") return "setup-token";
	if (typeof authChoice === "string") {
		const deprecatedChoice = resolveLegacyCliBackendChoice(authChoice, params);
		if (deprecatedChoice) return deprecatedChoice.choiceId;
	}
	return authChoice;
}
/** Return true when an auth choice is a deprecated provider alias. */
function isDeprecatedAuthChoice(authChoice, params) {
	return typeof authChoice === "string" && Boolean(resolveLegacyCliBackendChoice(authChoice, params));
}
/** Resolve the current replacement and warning text for a deprecated auth choice. */
function resolveDeprecatedAuthChoiceReplacement(authChoice, params) {
	if (typeof authChoice !== "string") return;
	const deprecatedChoice = resolveLegacyCliBackendChoice(authChoice, params);
	if (!deprecatedChoice) return;
	const replacementLabel = resolveReplacementLabel(deprecatedChoice.choiceLabel);
	return {
		normalized: deprecatedChoice.choiceId,
		message: `Auth choice "${authChoice}" is deprecated; using ${replacementLabel} setup instead.`
	};
}
/** Format the non-interactive error shown when a deprecated auth choice was supplied. */
function formatDeprecatedNonInteractiveAuthChoiceError(authChoice, params) {
	const replacement = resolveDeprecatedAuthChoiceReplacement(authChoice, params);
	if (!replacement) return;
	return [`Auth choice "${authChoice}" is deprecated.`, `Use "--auth-choice ${replacement.normalized}".`].join("\n");
}
//#endregion
export { resolveDeprecatedAuthChoiceReplacement as i, isDeprecatedAuthChoice as n, normalizeLegacyOnboardAuthChoice as r, formatDeprecatedNonInteractiveAuthChoiceError as t };
