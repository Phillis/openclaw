import { v as uniqueStrings } from "./string-normalization-e_fvmxMf.js";
import { r as formatErrorMessage } from "./errors-CSNUPl5U.js";
import { r as normalizeProviderId } from "./provider-id-DMd-TDFp.js";
import { t as createSubsystemLogger } from "./subsystem-CDLhGl2-.js";
import { n as enablePluginInConfig } from "./enable-DlxSFwiq.js";
import { n as resolvePluginProvidersCore } from "./providers.runtime-CAakL3j-.js";
import { r as resolveManifestProviderAuthChoices } from "./provider-auth-choices-Be8yPp6p.js";
//#region src/plugins/provider-setup-availability.ts
const log = createSubsystemLogger("plugins/provider-setup-availability");
function supportsTextInference(choice) {
	return !choice.onboardingScopes || choice.onboardingScopes.includes("text-inference");
}
/** Detect reachable provider-owned services for the classic setup picker. */
async function detectAvailableSetupProviderIds(params) {
	const env = params.env ?? process.env;
	const choices = resolveManifestProviderAuthChoices({
		config: params.config,
		workspaceDir: params.workspaceDir,
		env,
		includeUntrustedWorkspacePlugins: false
	}).filter((choice) => choice.appGuidedDiscovery === true && choice.assistantVisibility !== "manual-only" && supportsTextInference(choice));
	let discoveryConfig = params.config;
	const enabledChoices = choices.filter((choice) => {
		const enabled = enablePluginInConfig(discoveryConfig, choice.pluginId);
		discoveryConfig = enabled.config;
		return enabled.enabled;
	});
	if (enabledChoices.length === 0) return /* @__PURE__ */ new Set();
	const providers = resolvePluginProvidersCore({
		config: discoveryConfig,
		workspaceDir: params.workspaceDir,
		env,
		mode: "setup",
		includeUntrustedWorkspacePlugins: false,
		onlyPluginIds: uniqueStrings(enabledChoices.map((choice) => choice.pluginId))
	});
	const detected = await Promise.all(enabledChoices.map(async (choice) => {
		const method = providers.find((candidate) => candidate.pluginId === choice.pluginId && normalizeProviderId(candidate.id) === normalizeProviderId(choice.providerId))?.auth.find((candidate) => normalizeProviderId(candidate.id) === normalizeProviderId(choice.methodId));
		if (!method?.appGuidedSetup?.detectAvailability) return;
		try {
			return await method.appGuidedSetup.detectAvailability({
				config: discoveryConfig,
				env,
				workspaceDir: params.workspaceDir
			}) ? choice.providerId : void 0;
		} catch (error) {
			log.debug(`Provider availability detection failed for ${choice.choiceId}: ${formatErrorMessage(error)}`);
			return;
		}
	}));
	return new Set(detected.filter((providerId) => Boolean(providerId)));
}
//#endregion
export { detectAvailableSetupProviderIds };
