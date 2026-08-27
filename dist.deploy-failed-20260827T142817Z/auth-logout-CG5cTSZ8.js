import { t as formatCliCommand } from "./command-format-Dr_cCOb_.js";
import { n as listProfilesForProvider } from "./profile-list-C3LUpGxc.js";
import { a as ensureAuthProfileStoreWithoutExternalProfiles } from "./store-DOJuehrg.js";
import "./auth-profiles-DybBsKKK.js";
import { i as removeAuthProfilesAcrossOwnerStores } from "./profiles-DfGTvDcU.js";
import { b as resolveProviderEntryApiKeyProfileReference } from "./model-auth-provider-config-CUFUPomY.js";
import { i as removeAuthProfileConfig, r as configReferencesAuthProfile } from "./provider-auth-helpers-c1dAduEh.js";
import { t as createClackPrompter } from "./clack-prompter-9tEHHVYQ.js";
import { r as logConfigUpdated } from "./logging-okmNZCKW.js";
import { c as resolveModelsTargetAgent, l as updateConfig } from "./shared-B-IYMANI.js";
import { t as loadModelsConfig } from "./load-config-DZ-WyTLV.js";
import { t as refreshRunningGatewayAuthState } from "./auth-refresh-Bn9g80Bp.js";
//#region src/commands/models/auth-logout.ts
/** Command for removing one saved model auth profile. */
function findProviderEntryBoundToProfile(params) {
	for (const provider of Object.keys(params.cfg.models?.providers ?? {})) {
		const reference = resolveProviderEntryApiKeyProfileReference({
			cfg: params.cfg,
			provider,
			store: params.store
		});
		if ((reference.kind === "profile" || reference.kind === "profile-incompatible") && reference.profileId === params.profileId) return provider;
	}
}
/** Removes a saved auth profile from the agent auth store and from config. */
async function modelsAuthLogoutCommand(opts, runtime) {
	const profileId = opts.profileId?.trim();
	if (!profileId) throw new Error(`Missing profile id. Run ${formatCliCommand("openclaw models auth list")} to see saved profile ids.`);
	const cfg = await loadModelsConfig({
		commandName: "models auth logout",
		runtime
	});
	const { agentId, agentDir } = resolveModelsTargetAgent(cfg, opts.agent);
	const store = ensureAuthProfileStoreWithoutExternalProfiles(agentDir);
	const credential = store.profiles[profileId];
	if (!credential) throw new Error(`Auth profile "${profileId}" not found for agent "${agentId}". Run ${formatCliCommand(`openclaw models auth list --agent ${agentId}`)} to see saved profile ids.`);
	const boundProvider = findProviderEntryBoundToProfile({
		cfg,
		store,
		profileId
	});
	if (boundProvider) throw new Error(`Auth profile "${profileId}" is referenced by models.providers.${boundProvider}.apiKey. Change that config value first, then rerun ${formatCliCommand(`openclaw models auth logout ${profileId}`)}.`);
	const description = `${profileId} (${credential.provider}/${credential.type})`;
	if (!opts.yes) {
		if (!process.stdin.isTTY) throw new Error(`Refusing to remove auth profile ${description} without confirmation. Pass --yes to remove it non-interactively.`);
		if (!await createClackPrompter().confirm({
			message: `Remove auth profile ${description} from agent ${agentId}?`,
			initialValue: false
		})) {
			runtime.log("Cancelled.");
			return;
		}
	}
	if (configReferencesAuthProfile(cfg, profileId)) {
		await updateConfig((current) => removeAuthProfileConfig(current, profileId));
		logConfigUpdated(runtime);
	}
	if (!await removeAuthProfilesAcrossOwnerStores({
		agentDir,
		profileIds: [profileId]
	})) throw new Error(`Failed to remove auth profile "${profileId}"; the auth store lock may be busy. Wait a moment and retry.`);
	await refreshRunningGatewayAuthState();
	runtime.log(`Agent: ${agentId}`);
	runtime.log(`Removed auth profile: ${description}`);
	if (listProfilesForProvider(store, credential.provider).filter((id) => id !== profileId).length === 0) runtime.log(`No auth profiles remain for ${credential.provider}. Run ${formatCliCommand(`openclaw models auth login --provider ${credential.provider}`)} to sign in again.`);
}
//#endregion
export { modelsAuthLogoutCommand };
