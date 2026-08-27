import { v as uniqueStrings } from "./string-normalization-e_fvmxMf.js";
import { r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
import { r as normalizeProviderId } from "./provider-id-DMd-TDFp.js";
import { t as createSubsystemLogger } from "./subsystem-a4KzJVZG.js";
import { n as enablePluginInConfig, r as enablePluginWithCapabilityConsent } from "./enable-DgqKtqMD.js";
import { n as resolvePluginProvidersCore } from "./providers.runtime-Bo9z2acL.js";
import { t as withPluginLifecycleLease } from "./plugin-lifecycle-lease-BZTAJyJS.js";
import { r as resolveManifestProviderAuthChoices } from "./provider-auth-choices-BGnacuDj.js";
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
	const discovery = await withPluginLifecycleLease({ env }, async () => {
		let discoveryConfig = params.config;
		const enabledChoices = [];
		for (const choice of choices) if ((await enablePluginWithCapabilityConsent(params.config, choice.pluginId, {
			env,
			workspaceDir: params.workspaceDir
		})).enabled) {
			discoveryConfig = enablePluginInConfig(discoveryConfig, choice.pluginId).config;
			enabledChoices.push(choice);
		}
		const providers = enabledChoices.length === 0 ? [] : resolvePluginProvidersCore({
			config: discoveryConfig,
			workspaceDir: params.workspaceDir,
			env,
			mode: "setup",
			includeUntrustedWorkspacePlugins: false,
			onlyPluginIds: uniqueStrings(enabledChoices.map((choice) => choice.pluginId))
		});
		return {
			discoveryConfig,
			enabledChoices,
			providers
		};
	});
	const detected = await Promise.all(discovery.enabledChoices.map(async (choice) => {
		const method = discovery.providers.find((candidate) => candidate.pluginId === choice.pluginId && normalizeProviderId(candidate.id) === normalizeProviderId(choice.providerId))?.auth.find((candidate) => normalizeProviderId(candidate.id) === normalizeProviderId(choice.methodId));
		if (!method?.appGuidedSetup?.detectAvailability) return;
		try {
			return await method.appGuidedSetup.detectAvailability({
				config: discovery.discoveryConfig,
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
