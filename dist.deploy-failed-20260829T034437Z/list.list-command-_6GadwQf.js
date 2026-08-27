import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.js";
import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { t as formatCliCommand } from "./command-format-HwSAdvXB.js";
import { t as ExpectedCliError } from "./failure-output-CdUzE2dC.js";
import { a as writeRuntimeJson, o as writeRuntimeStdout } from "./runtime-LRpY2Icg.js";
import { t as requestExitAfterOneShotOutput } from "./one-shot-exit-CvLNCpcm.js";
import { n as sanitizeTerminalText } from "./safe-text-DbwznzfG.js";
import "./defaults-CdX9UGcX.js";
import { c as loadManifestMetadataSnapshot } from "./manifest-contract-eligibility-CZWL79I8.js";
import { n as parseModelRef } from "./model-selection-normalize-DRjRnS6Y.js";
import { r as theme, t as colorize } from "./theme-vjDs9tao.js";
import { a as resolveLegacyInheritedAuthDir } from "./legacy-inherited-auth-dir-DSU8DSTr.js";
import { t as createModelAuthAvailabilityResolver } from "./model-auth-availability-vVAUHumA.js";
import { t as resolveConfiguredModelEntries } from "./configured-model-entries-Cmo49BSz.js";
import { i as createModelCatalogProviderAliasCanonicalizer } from "./model-reference-validation-scUyn4nF.js";
import { d as ensureFlagCompatibility, f as formatTag, g as truncate, h as padTerminalCell, m as isRich, p as formatTokenK, s as resolveModelsTargetAgent } from "./shared-BOd9kz9I.js";
import { n as loadModelsConfigWithSource } from "./load-config-Dz0OthVE.js";
import { t as formatErrorWithStack } from "./list.errors-CvTPa0Ln.js";
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
		for (const row of rows) writeRuntimeStdout(runtime, sanitizeTerminalText(row.key));
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
const promotionsModuleLoader = createLazyImportLoader(() => import("./list.promotions-CxSfDgQI.js"));
const registryModuleLoader = createLazyImportLoader(() => import("./list.registry-BNRBy8Gf.js"));
const rowSourcesModuleLoader = createLazyImportLoader(() => import("./list.row-sources-CHXg-AEP.js"));
/** Lists configured, catalog, and runtime-discovered models as text, plain, or JSON. */
async function modelsListCommand(opts, runtime) {
	ensureFlagCompatibility(opts);
	const rawProviderFilter = opts.provider?.trim();
	const parsedProviderFilter = (() => {
		if (!rawProviderFilter) return;
		if (/\s/u.test(rawProviderFilter)) {
			const message = `Invalid provider filter "${sanitizeTerminalText(rawProviderFilter)}". Use a provider id such as "moonshot", not a display label.`;
			throw new ExpectedCliError({
				message,
				humanOutput: message,
				machineOutput: message
			});
		}
		return parseModelRef(`${rawProviderFilter}/_`, "openai", DISPLAY_MODEL_PARSE_OPTIONS)?.provider ?? normalizeLowercaseStringOrEmpty(rawProviderFilter);
	})();
	const humanReadable = !opts.json && !opts.plain;
	const [{ loadAuthProfileStoreWithoutExternalProfiles }, { resolveAgentWorkspaceDir }, { resolveDefaultAgentWorkspaceDir }] = await Promise.all([
		import("./store-D8BrctY_.js"),
		import("./agent-scope-WWPxWnDc.js"),
		import("./workspace-C3Kj3aBH.js")
	]);
	const { resolvedConfig: cfg } = await loadModelsConfigWithSource({
		commandName: "models list",
		runtime
	});
	const { agentId, agentDir } = resolveModelsTargetAgent(cfg, opts.agent, { kind: "read" });
	const workspaceDir = resolveAgentWorkspaceDir(cfg, agentId) ?? resolveDefaultAgentWorkspaceDir();
	const metadataSnapshot = loadManifestMetadataSnapshot({
		config: cfg,
		workspaceDir,
		env: process.env
	});
	const providerAliasCanonicalizer = createModelCatalogProviderAliasCanonicalizer({
		cfg,
		metadataSnapshot
	});
	const providerFilter = parsedProviderFilter ? providerAliasCanonicalizer.provider(parsedProviderFilter) : void 0;
	const { entries } = resolveConfiguredModelEntries({
		cfg,
		agentId,
		...DISPLAY_MODEL_PARSE_OPTIONS,
		canonicalizeRef: providerAliasCanonicalizer.ref
	});
	if (providerFilter) {
		if (!new Set([
			...metadataSnapshot.owners.providers.keys(),
			...metadataSnapshot.owners.modelCatalogProviders.keys(),
			...Object.keys(cfg.models?.providers ?? {}),
			...entries.map((entry) => entry.ref.provider)
		].map((providerId) => providerAliasCanonicalizer.provider(providerId))).has(providerFilter)) {
			const message = `Unknown provider filter "${sanitizeTerminalText(rawProviderFilter ?? providerFilter)}" for this installation. Run ${formatCliCommand("openclaw plugins list --json")} to see installed providers, or configure it under models.providers.`;
			throw new ExpectedCliError({
				message,
				humanOutput: message,
				machineOutput: message
			});
		}
	}
	const inheritedAuthDir = resolveLegacyInheritedAuthDir(cfg);
	const authIndex = createModelListAuthIndex({
		cfg,
		authStore: inheritedAuthDir ? loadAuthProfileStoreWithoutExternalProfiles(agentDir, { inheritedAuthDir }) : loadAuthProfileStoreWithoutExternalProfiles(agentDir),
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
	try {
		if (includePreparedCatalog) {
			const { loadModelRegistry } = await registryModuleLoader.load();
			const loaded = await loadModelRegistry(cfg, {
				agentId,
				agentDir,
				providerFilter,
				normalizeModels: Boolean(providerFilter),
				workspaceDir
			});
			modelRegistry = loaded.registry;
			registryModels = loaded.models;
			discoveredKeys = loaded.discoveredKeys;
			availableKeys = loaded.availableKeys;
			availabilityErrorMessage = loaded.availabilityErrorMessage;
		} else if (!opts.all && opts.local) {
			const { loadConfiguredListModelRegistry } = await registryModuleLoader.load();
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
		const message = `Model registry unavailable: ${err instanceof Error ? err.message : String(err)}`;
		throw new ExpectedCliError({
			message,
			humanOutput: `Model registry unavailable:\n${formatErrorWithStack(err)}`,
			machineOutput: message
		});
	}
	const promotionsModulePromise = humanReadable ? promotionsModuleLoader.load() : void 0;
	const promotionsRefreshPromise = promotionsModulePromise?.then((promotionsModule) => promotionsModule.startPromotionsFeedRefresh()).catch(() => void 0);
	const rowContext = {
		cfg,
		agentId,
		agentDir,
		...inheritedAuthDir ? { inheritedAuthDir } : {},
		authIndex,
		canonicalizeProvider: providerAliasCanonicalizer.provider,
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
		metadataSnapshot,
		workspaceDir
	};
	const rows = [];
	if (includePreparedCatalog) {
		const { appendAllModelRowSources } = await rowSourcesModuleLoader.load();
		await appendAllModelRowSources({
			rows,
			entries,
			context: rowContext,
			modelRegistry,
			registryModels
		});
	} else {
		const { appendConfiguredModelRowSources } = await rowSourcesModuleLoader.load();
		await appendConfiguredModelRowSources({
			rows,
			entries,
			modelRegistry,
			context: rowContext
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
