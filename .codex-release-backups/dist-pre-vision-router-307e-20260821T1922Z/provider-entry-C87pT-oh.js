import { u as normalizeStringEntries, v as uniqueStrings } from "./string-normalization-e_fvmxMf.js";
import { y as projectProviderCatalogResultToUnifiedTextRows } from "./loader-B4G6K_LK.js";
import { i as readRecordValue, r as isRecordWithoutThrowing, t as copyArrayEntries } from "./safe-record-CjQoFebO.js";
import { t as createProviderApiKeyAuthMethod } from "./provider-api-key-auth-CAO2g3HJ.js";
import { t as definePluginEntry } from "./plugin-entry-B4wzLSpS.js";
import { i as buildOpenAICompatibleProviderCatalog } from "./provider-catalog-live-runtime-mNrTsbWq.js";
import { c as readManifestProviderDefaultModelRef, d as buildSingleProviderApiKeyCatalog, r as buildManifestModelProviderConfig } from "./provider-catalog-shared-CPf2sXrg.js";
//#region src/plugin-sdk/provider-entry.ts
function resolveManifestProviderAuth(params) {
	const choice = params.manifest?.providerAuthChoices?.find((entry) => entry.provider === params.providerId && entry.method === "api-key");
	if (!choice) return [];
	const envVar = params.manifest?.setup?.providers?.find((entry) => entry.id === params.providerId)?.envVars?.[0];
	if (!choice.choiceLabel || !choice.optionKey || !choice.cliFlag?.startsWith("--") || !envVar) throw new Error(`Incomplete manifest API-key auth for provider "${params.providerId}"`);
	const defaultModel = readManifestProviderDefaultModelRef(params.manifest, params.providerId);
	const assistantVisibility = choice.assistantVisibility === "visible" || choice.assistantVisibility === "manual-only" ? choice.assistantVisibility : void 0;
	const onboardingScopes = choice.onboardingScopes?.filter((scope) => scope === "text-inference" || scope === "image-generation" || scope === "music-generation");
	return [{
		methodId: choice.method,
		label: choice.choiceLabel,
		...choice.choiceHint || choice.groupHint ? { hint: choice.choiceHint ?? choice.groupHint } : {},
		optionKey: choice.optionKey,
		flagName: choice.cliFlag,
		envVar,
		promptMessage: `Enter ${choice.choiceLabel}`,
		...defaultModel ? { defaultModel } : {},
		...params.overrides,
		wizard: params.overrides?.wizard === false ? false : {
			choiceId: choice.choiceId,
			choiceLabel: choice.choiceLabel,
			groupId: choice.groupId ?? params.providerId,
			groupLabel: choice.groupLabel ?? params.providerLabel,
			...choice.choiceHint ? { choiceHint: choice.choiceHint } : {},
			...choice.groupHint ? { groupHint: choice.groupHint } : {},
			...choice.assistantPriority !== void 0 ? { assistantPriority: choice.assistantPriority } : {},
			...assistantVisibility ? { assistantVisibility } : {},
			...choice.onboardingFeatured !== void 0 ? { onboardingFeatured: choice.onboardingFeatured } : {},
			...onboardingScopes?.length ? { onboardingScopes } : {},
			methodId: choice.method,
			...params.overrides?.wizard
		}
	}];
}
function resolveWizardSetup(params) {
	if (params.auth.wizard === false) return;
	const wizard = params.auth.wizard ?? {};
	const methodId = params.auth.methodId.trim();
	return {
		choiceId: wizard.choiceId ?? `${params.providerId}-${methodId}`,
		choiceLabel: wizard.choiceLabel ?? params.auth.label,
		...wizard.choiceHint ? { choiceHint: wizard.choiceHint } : {},
		...wizard.assistantPriority !== void 0 ? { assistantPriority: wizard.assistantPriority } : {},
		...wizard.assistantVisibility ? { assistantVisibility: wizard.assistantVisibility } : {},
		...wizard.onboardingFeatured !== void 0 ? { onboardingFeatured: wizard.onboardingFeatured } : {},
		groupId: wizard.groupId ?? params.providerId,
		groupLabel: wizard.groupLabel ?? params.providerLabel,
		...wizard.groupHint ?? params.auth.hint ? { groupHint: wizard.groupHint ?? params.auth.hint } : {},
		methodId,
		...wizard.onboardingScopes ? { onboardingScopes: wizard.onboardingScopes } : {},
		...wizard.modelAllowlist ? { modelAllowlist: wizard.modelAllowlist } : {},
		...wizard.modelSelection ? { modelSelection: wizard.modelSelection } : {}
	};
}
function copyProviderAuthOptions(value) {
	return copyArrayEntries(value).filter(isRecordWithoutThrowing);
}
function copyProviderAuthMethods(value) {
	return copyArrayEntries(value).filter(isRecordWithoutThrowing);
}
function resolveEnvVars(params) {
	const combined = normalizeStringEntries([...copyArrayEntries(params.envVars), ...(params.auth ?? []).map((entry) => readRecordValue(entry, "envVar")).filter(Boolean)]);
	return combined.length > 0 ? uniqueStrings(combined) : void 0;
}
async function runUnifiedTextCatalog(params) {
	const result = await params.catalog.run(params.ctx);
	return projectProviderCatalogResultToUnifiedTextRows({
		providerId: params.providerId,
		result,
		source: params.source
	});
}
/**
* Builds a plugin entry for providers whose runtime exports exactly one primary model provider.
*/
function defineSingleProviderPluginEntry(options) {
	return definePluginEntry({
		id: options.id,
		name: options.name,
		description: options.description,
		...options.kind ? { kind: options.kind } : {},
		...options.configSchema ? { configSchema: options.configSchema } : {},
		register(api) {
			const provider = typeof options.provider === "function" ? options.provider(api) : options.provider;
			if (provider) {
				const providerId = provider.id ?? options.id;
				if (!("run" in provider.catalog) && !provider.catalog.buildProvider && !options.manifest?.modelCatalog?.providers?.[providerId]) throw new Error(`Missing modelCatalog.providers.${providerId}`);
				const providerAuth = copyProviderAuthOptions(provider.auth ?? resolveManifestProviderAuth({
					manifest: options.manifest,
					providerId,
					providerLabel: provider.label,
					overrides: provider.manifestAuth
				}));
				const acceptedProviderAuth = [];
				const auth = providerAuth.flatMap((entry) => {
					try {
						const { wizard: _wizard, ...authParams } = entry;
						const wizard = resolveWizardSetup({
							providerId,
							providerLabel: provider.label,
							auth: entry
						});
						const method = createProviderApiKeyAuthMethod({
							...authParams,
							providerId,
							expectedProviders: entry.expectedProviders ?? [providerId],
							...wizard ? { wizard } : {}
						});
						acceptedProviderAuth.push(entry);
						return [method];
					} catch {
						return [];
					}
				});
				const envVars = resolveEnvVars({
					envVars: provider.envVars,
					auth: acceptedProviderAuth
				});
				auth.push(...copyProviderAuthMethods(provider.extraAuth));
				let catalog;
				if ("run" in provider.catalog) {
					const catalogRun = provider.catalog.run;
					catalog = {
						order: provider.catalog.order ?? "simple",
						run: catalogRun
					};
				} else {
					const buildProvider = provider.catalog.buildProvider ?? (() => buildManifestModelProviderConfig({
						providerId,
						catalog: options.manifest?.modelCatalog?.providers?.[providerId]
					}));
					catalog = {
						order: "simple",
						run: (ctx) => provider.catalog.liveModelDiscovery ? buildOpenAICompatibleProviderCatalog({
							ctx,
							providerId,
							buildProvider,
							...provider.catalog.allowExplicitBaseUrl ? { allowExplicitBaseUrl: true } : {},
							...provider.catalog.liveModelDiscovery === true ? {} : { modelDiscovery: provider.catalog.liveModelDiscovery }
						}) : buildSingleProviderApiKeyCatalog({
							ctx,
							providerId,
							buildProvider,
							...provider.catalog.allowExplicitBaseUrl ? { allowExplicitBaseUrl: true } : {}
						})
					};
				}
				const manifestStaticProvider = "run" in provider.catalog ? void 0 : provider.catalog.buildStaticProvider ?? (provider.catalog.buildProvider ? void 0 : () => buildManifestModelProviderConfig({
					providerId,
					catalog: options.manifest?.modelCatalog?.providers?.[providerId]
				}));
				const staticCatalog = "run" in provider.catalog ? provider.catalog.staticRun ? {
					order: provider.catalog.order ?? "simple",
					run: provider.catalog.staticRun
				} : void 0 : manifestStaticProvider ? {
					order: "simple",
					run: async () => ({ provider: await manifestStaticProvider() })
				} : void 0;
				api.registerProvider({
					id: providerId,
					label: provider.label,
					docsPath: provider.docsPath,
					...provider.aliases ? { aliases: provider.aliases } : {},
					...envVars ? { envVars } : {},
					auth,
					catalog,
					...staticCatalog ? { staticCatalog } : {},
					...Object.fromEntries(Object.entries(provider).filter(([key]) => ![
						"id",
						"label",
						"docsPath",
						"aliases",
						"envVars",
						"auth",
						"manifestAuth",
						"extraAuth",
						"catalog",
						"staticCatalog"
					].includes(key)))
				});
				api.registerModelCatalogProvider({
					provider: providerId,
					kinds: ["text"],
					...staticCatalog ? { staticCatalog: (ctx) => runUnifiedTextCatalog({
						providerId,
						catalog: staticCatalog,
						ctx,
						source: "static"
					}) } : {},
					liveCatalog: (ctx) => runUnifiedTextCatalog({
						providerId,
						catalog,
						ctx,
						source: "live"
					})
				});
			}
			options.register?.(api);
		}
	});
}
//#endregion
export { defineSingleProviderPluginEntry as t };
