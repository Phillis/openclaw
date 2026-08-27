import { u as normalizeStringEntries } from "./string-normalization-e_fvmxMf.js";
import { m as shortenHomePath } from "./utils-DEqefz4f.js";
import { t as formatCliCommand } from "./command-format-Dr_cCOb_.js";
import { a as writeRuntimeJson } from "./runtime-DtFIMC-W.js";
import { s as normalizeProviderId } from "./model-ref-shared-poyRjWh_.js";
import { t as findNormalizedProviderValue } from "./model-selection-normalize-Cvi2hnhD.js";
import { n as resolveProviderIdForAuth } from "./provider-auth-aliases-BdBosV0l.js";
import { r as resolveAuthStatePathForDisplay } from "./path-resolve-CttHagpC.js";
import { r as ensureAuthProfileStore } from "./store-BfXdFfLh.js";
import "./auth-profiles-C5SvE-Ih.js";
import { n as externalCliDiscoveryForProviderAuth } from "./external-cli-discovery-DM5kEN0f.js";
import { s as setAuthProfileOrder } from "./profiles-DNBe9hAz.js";
import "./model-selection-Adc4uFq_.js";
import { c as resolveModelsTargetAgent } from "./shared-LTsvgBex.js";
import { t as loadModelsConfig } from "./load-config-CuMHUIvn.js";
import { t as refreshRunningGatewayAuthState } from "./auth-refresh-DRoiulZT.js";
//#region src/commands/models/auth-order.ts
/** Commands for viewing and editing per-agent provider auth profile order. */
function describeOrder(store, provider, cfg) {
	const authProvider = resolveProviderIdForAuth(provider, { config: cfg });
	const canonical = findNormalizedProviderValue(store.order, authProvider);
	if (canonical !== void 0) return canonical;
	return Object.entries(store.order ?? {}).filter(([key]) => resolveProviderIdForAuth(key, { config: cfg }) === authProvider).toSorted(([left], [right]) => left.localeCompare(right))[0]?.[1] ?? [];
}
function describeOrderFallback(cfg, provider) {
	const authProvider = resolveProviderIdForAuth(provider, { config: cfg });
	const configuredOrder = findNormalizedProviderValue(cfg.auth?.order, authProvider) ?? findNormalizedProviderValue(cfg.auth?.order, provider);
	if (configuredOrder === void 0) return "selecting automatically";
	return configuredOrder.length > 0 ? `using order from config: ${configuredOrder.join(", ")}` : "config selects no profiles";
}
async function resolveAuthOrderContext(opts, runtime) {
	const rawProvider = opts.provider?.trim();
	if (!rawProvider) throw new Error(`Missing --provider. Run ${formatCliCommand("openclaw models auth list")} to see saved provider profiles.`);
	const provider = normalizeProviderId(rawProvider);
	const cfg = await loadModelsConfig({
		commandName: "models auth-order",
		runtime
	});
	const { agentId, agentDir } = resolveModelsTargetAgent(cfg, opts.agent);
	return {
		cfg,
		agentId,
		agentDir,
		provider
	};
}
/** Shows the configured auth profile priority order for a provider. */
async function modelsAuthOrderGetCommand(opts, runtime) {
	const { cfg, agentId, agentDir, provider } = await resolveAuthOrderContext(opts, runtime);
	const order = describeOrder(ensureAuthProfileStore(agentDir, { externalCli: externalCliDiscoveryForProviderAuth({
		cfg,
		provider
	}) }), provider, cfg);
	if (opts.json) {
		writeRuntimeJson(runtime, {
			agentId,
			agentDir,
			provider,
			authStatePath: shortenHomePath(resolveAuthStatePathForDisplay(agentDir)),
			order: order.length > 0 ? order : null
		});
		return;
	}
	runtime.log(`Agent: ${agentId}`);
	runtime.log(`Provider: ${provider}`);
	runtime.log(`Auth state store: ${shortenHomePath(resolveAuthStatePathForDisplay(agentDir))}`);
	runtime.log(order.length > 0 ? `Auth profile order override: ${order.join(", ")}` : `Auth profile order override: none (${describeOrderFallback(cfg, provider)})`);
}
/** Clears the configured auth profile priority order for a provider. */
async function modelsAuthOrderClearCommand(opts, runtime) {
	const { cfg, agentId, agentDir, provider } = await resolveAuthOrderContext(opts, runtime);
	if (!await setAuthProfileOrder({
		agentDir,
		provider: resolveProviderIdForAuth(provider, { config: cfg }),
		order: null
	})) throw new Error(`Failed to update auth state; the auth state lock may be busy. Wait a moment and rerun ${formatCliCommand("openclaw models auth order clear --provider " + provider)}.`);
	runtime.log(`Agent: ${agentId}`);
	runtime.log(`Provider: ${provider}`);
	runtime.log(`Auth profile order override cleared; ${describeOrderFallback(cfg, provider)}.`);
	await refreshRunningGatewayAuthState();
}
/** Sets the provider auth profile priority order after validating each profile id. */
async function modelsAuthOrderSetCommand(opts, runtime) {
	const { cfg, agentId, agentDir, provider } = await resolveAuthOrderContext(opts, runtime);
	const store = ensureAuthProfileStore(agentDir, { externalCli: externalCliDiscoveryForProviderAuth({
		cfg,
		provider
	}) });
	const providerKey = resolveProviderIdForAuth(provider, { config: cfg });
	const requested = normalizeStringEntries(opts.order ?? []);
	if (requested.length === 0) throw new Error(`Missing profile ids. Run ${formatCliCommand("openclaw models auth list --provider " + provider)} to choose one or more profile ids.`);
	for (const profileId of requested) {
		const cred = store.profiles[profileId];
		if (!cred) throw new Error(`Auth profile "${profileId}" not found in ${shortenHomePath(agentDir)}. Run ${formatCliCommand("openclaw models auth list --provider " + provider)} to see saved profiles.`);
		if (resolveProviderIdForAuth(cred.provider, { config: cfg }) !== providerKey) throw new Error(`Auth profile "${profileId}" is for ${cred.provider}, not ${provider}.`);
	}
	const updated = await setAuthProfileOrder({
		agentDir,
		provider: providerKey,
		order: requested
	});
	if (!updated) throw new Error(`Failed to update auth state; the auth state lock may be busy. Wait a moment and rerun ${formatCliCommand("openclaw models auth order set --provider " + provider + " <profileIds...>")}.`);
	runtime.log(`Agent: ${agentId}`);
	runtime.log(`Provider: ${provider}`);
	runtime.log(`Auth profile order override: ${describeOrder(updated, provider, cfg).join(", ")}`);
	await refreshRunningGatewayAuthState();
}
//#endregion
export { modelsAuthOrderClearCommand, modelsAuthOrderGetCommand, modelsAuthOrderSetCommand };
