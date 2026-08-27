import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.js";
import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { a as writeRuntimeJson } from "./runtime-DtFIMC-W.js";
import { t as requestExitAfterOneShotOutput } from "./one-shot-exit-exEwhVsw.js";
import { t as modelKey } from "./model-key-CMdQNkZf.js";
import { i as resolveAgentModelPrimaryValue, r as resolveAgentModelFallbackValues } from "./model-input-ekSMR50U.js";
import { n as sanitizeTerminalText } from "./safe-text-DbwznzfG.js";
import "./model-ref-shared-poyRjWh_.js";
import { _ as resolveConfiguredModelRef, b as resolveModelRefFromString, i as buildModelAliasIndex } from "./model-selection-shared-DT9x3Cg2.js";
import { n as DEFAULT_MODEL, r as DEFAULT_PROVIDER } from "./defaults-CdX9UGcX.js";
import { c as loadManifestMetadataSnapshot } from "./manifest-contract-eligibility-DppTp7ET.js";
import { n as parseModelRef } from "./model-selection-normalize-Cvi2hnhD.js";
import { r as theme, t as colorize } from "./theme-vjDs9tao.js";
import { t as createModelAuthAvailabilityResolver } from "./model-auth-availability-BPn3FIdo.js";
import { r as createModelCatalogProviderAliasCanonicalizer, t as canonicalizeModelCatalogProviderAlias } from "./provider-aliases-FR75wU8X.js";
import { c as resolveModelsTargetAgent, d as ensureFlagCompatibility, f as formatTag, g as truncate, h as padTerminalCell, m as isRich, p as formatTokenK } from "./shared-B-IYMANI.js";
import { n as loadModelsConfigWithSource } from "./load-config-DZ-WyTLV.js";
import { n as formatErrorWithStack } from "./list.errors-DDA-CnZS.js";
//#region src/commands/models/list.auth-index.ts
/** Auth availability index for `openclaw models list` rows. */
function listValidatedSyntheticAuthProviderRefs(params) {
	if (params.metadataSnapshot.registryDiagnostics.length > 0 || params.metadataSnapshot.registrySource !== "persisted" && params.metadataSnapshot.registrySource !== "provided") return [];
	return params.metadataSnapshot.index.plugins.filter((plugin) => plugin.enabled).flatMap((plugin) => plugin.syntheticAuthRefs ?? []);
}
/** Builds one snapshot-scoped command adapter around the shared evaluator. */
function createModelListAuthIndex(params) {
	const env = params.env ?? process.env;
	const resolver = createModelAuthAvailabilityResolver({
		cfg: params.cfg,
		authStore: params.authStore,
		agentDir: params.agentDir,
		workspaceDir: params.workspaceDir,
		env,
		metadataSnapshot: params.metadataSnapshot,
		externalCliProviderIds: params.externalCliProviderIds,
		routeResolverFactory: params.routeResolverFactory,
		syntheticAuthProviderRefs: params.syntheticAuthProviderRefs ?? listValidatedSyntheticAuthProviderRefs({ metadataSnapshot: params.metadataSnapshot })
	});
	return {
		providerDiscoveryProviderIds: resolver.providerDiscoveryProviderIds,
		evaluateModelAuth: (provider, ref) => resolver.evaluateModelAuth(provider, ref)
	};
}
//#endregion
//#region src/commands/models/list.configured.ts
/** Resolves configured model refs and tags for model-list rows. */
const DISPLAY_MODEL_PARSE_OPTIONS$1 = { allowPluginNormalization: false };
/** Returns canonical configured model entries with default/fallback/image/configured tags. */
function resolveConfiguredEntries(cfg, metadataSnapshot) {
	const resolvedDefault = resolveConfiguredModelRef({
		cfg,
		defaultProvider: DEFAULT_PROVIDER,
		defaultModel: DEFAULT_MODEL,
		...DISPLAY_MODEL_PARSE_OPTIONS$1
	});
	const aliasIndex = buildModelAliasIndex({
		cfg,
		defaultProvider: DEFAULT_PROVIDER,
		...DISPLAY_MODEL_PARSE_OPTIONS$1
	});
	const order = [];
	const tagsByKey = /* @__PURE__ */ new Map();
	const aliasesByKey = /* @__PURE__ */ new Map();
	const canonicalizeProviderAlias = createModelCatalogProviderAliasCanonicalizer({
		cfg,
		metadataSnapshot
	});
	for (const [key, aliases] of aliasIndex.byKey.entries()) aliasesByKey.set(key, aliases);
	const addEntry = (ref, tag) => {
		const canonicalRef = canonicalizeProviderAlias.ref(ref);
		const key = modelKey(canonicalRef.provider, canonicalRef.model);
		const originalKey = modelKey(ref.provider, ref.model);
		if (originalKey !== key) {
			const aliases = aliasesByKey.get(originalKey);
			if (aliases) aliasesByKey.set(key, [.../* @__PURE__ */ new Set([...aliasesByKey.get(key) ?? [], ...aliases])]);
		}
		if (!tagsByKey.has(key)) {
			tagsByKey.set(key, /* @__PURE__ */ new Set());
			order.push(key);
		}
		tagsByKey.get(key)?.add(tag);
	};
	const addResolvedModelRef = (raw, tag) => {
		const resolved = resolveModelRefFromString({
			raw,
			defaultProvider: DEFAULT_PROVIDER,
			aliasIndex,
			...DISPLAY_MODEL_PARSE_OPTIONS$1
		});
		if (resolved) addEntry(resolved.ref, tag);
	};
	addEntry(resolvedDefault, "default");
	const modelFallbacks = resolveAgentModelFallbackValues(cfg.agents?.defaults?.model);
	const imageFallbacks = resolveAgentModelFallbackValues(cfg.agents?.defaults?.imageModel);
	const imagePrimary = resolveAgentModelPrimaryValue(cfg.agents?.defaults?.imageModel) ?? "";
	modelFallbacks.forEach((raw, idx) => {
		addResolvedModelRef(raw, `fallback#${idx + 1}`);
	});
	if (imagePrimary) addResolvedModelRef(imagePrimary, "image");
	imageFallbacks.forEach((raw, idx) => {
		addResolvedModelRef(raw, `img-fallback#${idx + 1}`);
	});
	for (const key of Object.keys(cfg.agents?.defaults?.models ?? {})) {
		if (key.trim().endsWith("/*")) continue;
		const resolved = resolveModelRefFromString({
			cfg,
			raw: key,
			defaultProvider: DEFAULT_PROVIDER,
			aliasIndex,
			...DISPLAY_MODEL_PARSE_OPTIONS$1
		});
		if (!resolved) continue;
		addEntry(resolved.ref, "configured");
	}
	return { entries: order.map((key) => {
		const slash = key.indexOf("/");
		return {
			key,
			ref: {
				provider: slash === -1 ? key : key.slice(0, slash),
				model: slash === -1 ? "" : key.slice(slash + 1)
			},
			tags: tagsByKey.get(key) ?? /* @__PURE__ */ new Set(),
			aliases: aliasesByKey.get(key) ?? []
		};
	}) };
}
//#endregion
//#region src/commands/models/list.table.ts
/** Terminal/JSON/plain table renderer for model-list rows. */
const MODEL_PAD = 42;
const INPUT_PAD = 10;
const CTX_PAD = 11;
const LOCAL_PAD = 5;
const AUTH_PAD = 5;
function formatContextLabel(row) {
	if (typeof row.contextTokens === "number" && Number.isFinite(row.contextTokens) && row.contextTokens > 0 && row.contextTokens !== row.contextWindow) return `${formatTokenK(row.contextTokens)}/${formatTokenK(row.contextWindow)}`;
	return formatTokenK(row.contextWindow);
}
/** Prints model-list rows in JSON, plain, or fixed-width terminal form. */
function printModelTable(rows, runtime, opts = {}) {
	if (opts.json) {
		writeRuntimeJson(runtime, {
			count: rows.length,
			models: rows
		});
		return;
	}
	if (opts.plain) {
		for (const row of rows) runtime.log(sanitizeTerminalText(row.key));
		return;
	}
	const rich = isRich(opts);
	const header = [
		padTerminalCell("Model", MODEL_PAD),
		padTerminalCell("Input", INPUT_PAD),
		padTerminalCell("Ctx", CTX_PAD),
		padTerminalCell("Local", LOCAL_PAD),
		padTerminalCell("Auth", AUTH_PAD),
		"Tags"
	].join(" ");
	runtime.log(rich ? theme.heading(header) : header);
	for (const row of rows) {
		const keyLabel = padTerminalCell(truncate(sanitizeTerminalText(row.key), MODEL_PAD), MODEL_PAD);
		const inputLabel = padTerminalCell(sanitizeTerminalText(row.input) || "-", INPUT_PAD);
		const ctxLabel = padTerminalCell(formatContextLabel(row), CTX_PAD);
		const localLabel = padTerminalCell(row.local === null ? "-" : row.local ? "yes" : "no", LOCAL_PAD);
		const authLabel = padTerminalCell(row.available === null ? "-" : row.available ? "yes" : "no", AUTH_PAD);
		const tags = row.tags.map(sanitizeTerminalText);
		const tagsLabel = tags.length > 0 ? rich ? tags.map((tag) => formatTag(tag, rich)).join(",") : tags.join(",") : "";
		const coloredInput = colorize(rich, row.input.includes("image") ? theme.accentBright : theme.info, inputLabel);
		const coloredLocal = colorize(rich, row.local === null ? theme.muted : row.local ? theme.success : theme.muted, localLabel);
		const coloredAuth = colorize(rich, row.available === null ? theme.muted : row.available ? theme.success : theme.error, authLabel);
		const line = [
			rich ? theme.accent(keyLabel) : keyLabel,
			coloredInput,
			ctxLabel,
			coloredLocal,
			coloredAuth,
			tagsLabel
		].join(" ");
		runtime.log(line);
	}
}
//#endregion
//#region src/commands/models/list.list-command.ts
/** Implementation of `openclaw models list`. */
const DISPLAY_MODEL_PARSE_OPTIONS = { allowPluginNormalization: false };
const promotionsModuleLoader = createLazyImportLoader(() => import("./list.promotions-BNzViWEq.js"));
const registryLoadModuleLoader = createLazyImportLoader(() => import("./list.registry-load-CRRDNVPC.js"));
const rowSourcesModuleLoader = createLazyImportLoader(() => import("./list.row-sources-CfhKZzTU.js"));
function loadRegistryLoadModule() {
	return registryLoadModuleLoader.load();
}
function loadRowSourcesModule() {
	return rowSourcesModuleLoader.load();
}
/** Lists configured, catalog, and runtime-discovered models as text, plain, or JSON. */
async function modelsListCommand(opts, runtime) {
	ensureFlagCompatibility(opts);
	const parsedProviderFilter = (() => {
		const raw = opts.provider?.trim();
		if (!raw) return;
		if (/\s/u.test(raw)) {
			runtime.error(`Invalid provider filter "${raw}". Use a provider id such as "moonshot", not a display label.`);
			process.exitCode = 1;
			return null;
		}
		return parseModelRef(`${raw}/_`, "openai", DISPLAY_MODEL_PARSE_OPTIONS)?.provider ?? normalizeLowercaseStringOrEmpty(raw);
	})();
	if (parsedProviderFilter === null) return;
	const humanReadable = !opts.json && !opts.plain;
	const [{ loadAuthProfileStoreWithoutExternalProfiles }, { resolveAgentWorkspaceDir }, { resolveDefaultAgentWorkspaceDir }] = await Promise.all([
		import("./store-D6_HDCuw.js"),
		import("./agent-scope-B7ocz6pI.js"),
		import("./workspace-DO4zlPVY.js")
	]);
	const { resolvedConfig: cfg } = await loadModelsConfigWithSource({
		commandName: "models list",
		runtime
	});
	const { agentId, agentDir } = resolveModelsTargetAgent(cfg, opts.agent);
	const authStore = loadAuthProfileStoreWithoutExternalProfiles(agentDir);
	const workspaceDir = resolveAgentWorkspaceDir(cfg, agentId) ?? resolveDefaultAgentWorkspaceDir();
	const metadataSnapshot = loadManifestMetadataSnapshot({
		config: cfg,
		workspaceDir,
		env: process.env
	});
	const providerFilter = parsedProviderFilter ? canonicalizeModelCatalogProviderAlias(parsedProviderFilter, {
		cfg,
		metadataSnapshot
	}) : void 0;
	const { entries } = resolveConfiguredEntries(cfg, metadataSnapshot);
	const authIndex = createModelListAuthIndex({
		cfg,
		authStore,
		agentDir,
		workspaceDir,
		metadataSnapshot,
		externalCliProviderIds: ["openai"]
	});
	let modelRegistry;
	let registryModels = [];
	let discoveredKeys = /* @__PURE__ */ new Set();
	let availableKeys;
	let availabilityErrorMessage;
	const configuredByKey = new Map(entries.map((entry) => [entry.key, entry]));
	const includePreparedCatalog = Boolean(opts.all || providerFilter);
	const providerDiscoveryProviderIds = (() => {
		if (opts.all && !providerFilter) return;
		if (providerFilter) return [providerFilter];
		return [.../* @__PURE__ */ new Set([
			...authIndex.providerDiscoveryProviderIds ?? [],
			...entries.map((entry) => entry.ref.provider),
			...Object.keys(cfg.models?.providers ?? {})
		])].toSorted((left, right) => left.localeCompare(right));
	})();
	const providerRuntimeDiscoveryProviderIds = providerFilter ? [providerFilter] : opts.all ? void 0 : [];
	const providerManifestFallbackProviderIds = !providerFilter && !opts.all ? authIndex.providerDiscoveryProviderIds : void 0;
	const loadRegistryState = async (optsLocal) => {
		const { loadListModelRegistry } = await loadRegistryLoadModule();
		const loaded = await loadListModelRegistry(cfg, {
			agentId,
			agentDir,
			providerFilter,
			normalizeModels: optsLocal?.normalizeModels ?? Boolean(providerFilter),
			loadAvailability: optsLocal?.loadAvailability,
			workspaceDir
		});
		modelRegistry = loaded.registry;
		registryModels = loaded.models;
		discoveredKeys = loaded.discoveredKeys;
		availableKeys = loaded.availableKeys;
		availabilityErrorMessage = loaded.availabilityErrorMessage;
	};
	try {
		if (includePreparedCatalog) await loadRegistryState();
		else if (!opts.all && opts.local) {
			const { loadConfiguredListModelRegistry } = await loadRegistryLoadModule();
			const loaded = await loadConfiguredListModelRegistry(cfg, entries, {
				agentId,
				agentDir,
				providerFilter,
				workspaceDir
			});
			modelRegistry = loaded.registry;
			discoveredKeys = loaded.discoveredKeys;
			availableKeys = loaded.availableKeys;
		}
	} catch (err) {
		runtime.error(`Model registry unavailable:\n${formatErrorWithStack(err)}`);
		process.exitCode = 1;
		return;
	}
	const promotionsModulePromise = humanReadable ? promotionsModuleLoader.load() : void 0;
	const promotionsRefreshPromise = promotionsModulePromise?.then((promotionsModule) => promotionsModule.startPromotionsFeedRefresh()).catch(() => void 0);
	const buildRowContext = (skipRuntimeModelSuppression) => ({
		cfg,
		agentId,
		agentDir,
		inheritedAuthDir: agentDir,
		authIndex,
		providerDiscoveryProviderIds,
		providerRuntimeDiscoveryProviderIds,
		providerManifestFallbackProviderIds,
		availableKeys,
		configuredByKey,
		discoveredKeys,
		filter: {
			provider: providerFilter,
			local: opts.local
		},
		skipRuntimeModelSuppression,
		metadataSnapshot,
		workspaceDir
	});
	const rows = [];
	if (includePreparedCatalog) {
		const { appendAllModelRowSources } = await loadRowSourcesModule();
		await appendAllModelRowSources({
			rows,
			entries,
			context: buildRowContext(false),
			modelRegistry,
			registryModels
		});
	} else {
		const { appendConfiguredModelRowSources } = await loadRowSourcesModule();
		await appendConfiguredModelRowSources({
			rows,
			entries,
			modelRegistry,
			context: buildRowContext(!modelRegistry)
		});
	}
	if (availabilityErrorMessage !== void 0) runtime.error(`Model availability lookup failed; falling back to auth heuristics for discovered models: ${availabilityErrorMessage}`);
	const promotionsModule = await (promotionsModulePromise ?? promotionsModuleLoader.load());
	try {
		promotionsModule.applyPromotionClaimTags(rows);
	} catch {}
	if (rows.length === 0 && !opts.json && !opts.plain) runtime.log("No models found.");
	else printModelTable(rows, runtime, opts);
	if (promotionsRefreshPromise) try {
		const refresh = await promotionsRefreshPromise;
		if (refresh) await promotionsModule.printAvailablePromotionsSection({
			configuredKeys: new Set(entries.map((entry) => entry.key)),
			refresh,
			runtime
		});
	} catch {}
	requestExitAfterOneShotOutput(runtime);
}
//#endregion
export { modelsListCommand };
