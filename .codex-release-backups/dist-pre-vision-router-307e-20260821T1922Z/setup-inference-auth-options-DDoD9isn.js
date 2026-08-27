import { t as compareProviderAuthChoiceGroups } from "./provider-auth-choice-order-CiFFDn0D.js";
//#region src/system-agent/setup-inference-auth-options.ts
function supportsSetupTextInference(scopes) {
	return !scopes || scopes.includes("text-inference");
}
function supportsSetupManualSecret(choice) {
	return supportsSetupTextInference(choice.onboardingScopes) && choice.appGuidedSecret === true;
}
function listSetupInferenceManualProviders(authChoices) {
	const choices = /* @__PURE__ */ new Map();
	for (const choice of authChoices) {
		const id = choice.choiceId.trim();
		if (!id || choices.has(id) || !supportsSetupManualSecret(choice)) continue;
		choices.set(id, {
			id,
			brandId: choice.providerId,
			...choice.groupLabel?.trim() ? { groupLabel: choice.groupLabel.trim() } : {},
			label: choice.choiceLabel,
			...choice.choiceHint?.trim() ? { hint: choice.choiceHint.trim() } : {},
			...choice.icon ? { icon: choice.icon } : {},
			...choice.website ? { website: choice.website } : {}
		});
	}
	return [...choices.values()].toSorted((a, b) => compareProviderAuthChoiceGroups({
		id: a.brandId ?? a.id,
		label: a.groupLabel ?? a.label
	}, {
		id: b.brandId ?? b.id,
		label: b.groupLabel ?? b.label
	}) || a.label.localeCompare(b.label, "en") || a.id.localeCompare(b.id, "en"));
}
function listSetupInferenceAuthOptions(authChoices) {
	const choices = /* @__PURE__ */ new Map();
	for (const choice of authChoices) {
		const id = choice.choiceId.trim();
		if (!id || choices.has(id) || !supportsSetupTextInference(choice.onboardingScopes) || choice.assistantVisibility === "manual-only" || !choice.appGuidedAuth) continue;
		choices.set(id, {
			metadata: choice,
			option: {
				id,
				brandId: choice.providerId,
				label: choice.choiceLabel,
				...choice.choiceHint?.trim() ? { hint: choice.choiceHint.trim() } : {},
				...choice.groupLabel?.trim() ? { groupLabel: choice.groupLabel.trim() } : {},
				...choice.icon ? { icon: choice.icon } : {},
				...choice.website ? { website: choice.website } : {},
				kind: choice.appGuidedAuth,
				featured: choice.onboardingFeatured === true
			}
		});
	}
	return [...choices.values()].toSorted((a, b) => Number(b.option.featured) - Number(a.option.featured) || compareProviderAuthChoiceGroups({
		id: a.metadata.groupId ?? a.metadata.providerId,
		label: a.metadata.groupLabel ?? a.metadata.choiceLabel
	}, {
		id: b.metadata.groupId ?? b.metadata.providerId,
		label: b.metadata.groupLabel ?? b.metadata.choiceLabel
	}) || (a.metadata.assistantPriority ?? 0) - (b.metadata.assistantPriority ?? 0) || a.option.label.localeCompare(b.option.label, "en") || a.option.id.localeCompare(b.option.id, "en")).map(({ option }) => option);
}
function listSetupInferencePrepareOptions(authChoices) {
	const choices = /* @__PURE__ */ new Map();
	for (const choice of authChoices) {
		const id = choice.choiceId.trim();
		if (!id || choices.has(id) || !supportsSetupTextInference(choice.onboardingScopes) || choice.assistantVisibility === "manual-only" || choice.appGuidedDiscovery !== true) continue;
		choices.set(id, {
			metadata: choice,
			option: {
				id,
				brandId: choice.providerId,
				label: choice.choiceLabel,
				...choice.choiceHint?.trim() ? { hint: choice.choiceHint.trim() } : {},
				...choice.appGuidedActionLabel?.trim() ? { actionLabel: choice.appGuidedActionLabel.trim() } : {},
				...choice.icon ? { icon: choice.icon } : {},
				...choice.website ? { website: choice.website } : {}
			}
		});
	}
	return [...choices.values()].toSorted((a, b) => compareProviderAuthChoiceGroups({
		id: a.metadata.groupId ?? a.metadata.providerId,
		label: a.metadata.groupLabel ?? a.metadata.choiceLabel
	}, {
		id: b.metadata.groupId ?? b.metadata.providerId,
		label: b.metadata.groupLabel ?? b.metadata.choiceLabel
	}) || (a.metadata.assistantPriority ?? 0) - (b.metadata.assistantPriority ?? 0) || a.option.label.localeCompare(b.option.label, "en") || a.option.id.localeCompare(b.option.id, "en")).map(({ option }) => option);
}
//#endregion
export { supportsSetupTextInference as a, supportsSetupManualSecret as i, listSetupInferenceManualProviders as n, listSetupInferencePrepareOptions as r, listSetupInferenceAuthOptions as t };
