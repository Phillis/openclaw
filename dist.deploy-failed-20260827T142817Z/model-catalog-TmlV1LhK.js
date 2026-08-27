import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { s as asFiniteNumber } from "./number-coercion-oCkfUEEq.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { g as normalizeUniqueTrimmedStringList } from "./string-normalization-e_fvmxMf.js";
import "./utils-DEqefz4f.js";
import { t as isBlockedObjectKey } from "./prototype-keys-CuYw53fZ.js";
import { r as normalizeProviderId } from "./provider-id-DMd-TDFp.js";
import { At as boolean, Dn as partialRecord, Et as array, Kn as tuple, Nn as record, Rn as string, Tn as object, Xn as union, Zn as unknown, dn as literal, wn as number, yt as _enum } from "./schemas-CZ9Toj_c.js";
import { f as MODEL_CATALOG_APIS, p as MODEL_CATALOG_THINKING_LEVELS, u as normalizeModelCatalog } from "./manifest-BmA-DH7w.js";
import { n as VERSION } from "./version-o4XN9fka.js";
import { s as parseRegistryNpmSpec } from "./npm-registry-spec-D3pNhy09.js";
import { t as parseClawHubPluginSpec } from "./clawhub-spec-Er3Np6VI.js";
import { _ as getNodeSqliteKysely, g as executeSqliteQueryTakeFirstSync, h as executeSqliteQuerySync } from "./openclaw-state-db.paths-D5QeoU_L.js";
import { d as openOpenClawStateDatabase, h as runOpenClawStateWriteTransaction } from "./openclaw-state-db-CXrhNigN.js";
import { d as readResponseWithLimit } from "./http-body-D5I0NwSl.js";
import { t as planManifestModelCatalogRows } from "./manifest-planner-CU46ZL6r.js";
import { t as compareOpenClawVersions } from "./version-CG_bbh3U.js";
import { n as fetchConfiguredLocalOriginWithSsrFGuard, r as fetchWithSsrFGuard } from "./fetch-guard-Bk80Ti5l.js";
import { createRequire } from "node:module";
//#region src/model-catalog/provider-index/normalize.ts
const OPENCLAW_PROVIDER_INDEX_VERSION = 1;
function normalizeSafeKey(value) {
	const key = normalizeOptionalString(value) ?? "";
	return key && !isBlockedObjectKey(key) ? key : "";
}
function normalizeInstall(value) {
	if (!isRecord(value)) return;
	const clawhubSpec = normalizeOptionalString(value.clawhubSpec);
	const parsedClawHub = clawhubSpec ? parseClawHubPluginSpec(clawhubSpec) : null;
	const npmSpec = normalizeOptionalString(value.npmSpec);
	const parsedNpm = npmSpec ? parseRegistryNpmSpec(npmSpec) : null;
	if (!parsedClawHub && !parsedNpm) return;
	const defaultChoice = value.defaultChoice === "clawhub" && parsedClawHub ? "clawhub" : value.defaultChoice === "npm" && parsedNpm ? "npm" : void 0;
	const minHostVersion = normalizeOptionalString(value.minHostVersion);
	const expectedIntegrity = normalizeOptionalString(value.expectedIntegrity);
	return {
		...parsedClawHub ? { clawhubSpec } : {},
		...parsedNpm ? { npmSpec: parsedNpm.raw } : {},
		...defaultChoice ? { defaultChoice } : {},
		...minHostVersion ? { minHostVersion } : {},
		...expectedIntegrity ? { expectedIntegrity } : {}
	};
}
function normalizePlugin(value) {
	if (!isRecord(value)) return;
	const id = normalizeSafeKey(value.id);
	if (!id) return;
	const packageName = normalizeOptionalString(value.package) ?? "";
	const source = normalizeOptionalString(value.source) ?? "";
	const install = normalizeInstall(value.install);
	return {
		id,
		...packageName ? { package: packageName } : {},
		...source ? { source } : {},
		...install ? { install } : {}
	};
}
function normalizePreviewCatalog(params) {
	const provider = normalizeModelCatalog({ providers: { [params.providerId]: params.value } }, { ownedProviders: /* @__PURE__ */ new Set([params.providerId]) })?.providers?.[params.providerId];
	if (!provider) return;
	for (const model of provider.models) model.status ??= "preview";
	return provider;
}
function normalizeOnboardingScopes(value) {
	const scopes = normalizeUniqueTrimmedStringList(value).filter((scope) => scope === "text-inference" || scope === "image-generation" || scope === "music-generation");
	return scopes.length > 0 ? scopes : void 0;
}
function normalizeAssistantVisibility(value) {
	return value === "visible" || value === "manual-only" ? value : void 0;
}
function normalizeAuthChoice(params) {
	if (!isRecord(params.value)) return;
	const method = normalizeSafeKey(params.value.method);
	const choiceId = normalizeSafeKey(params.value.choiceId);
	const choiceLabel = normalizeOptionalString(params.value.choiceLabel) ?? "";
	if (!method || !choiceId || !choiceLabel) return;
	const choiceHint = normalizeOptionalString(params.value.choiceHint);
	const groupId = normalizeSafeKey(params.value.groupId) || params.providerId;
	const groupLabel = normalizeOptionalString(params.value.groupLabel) ?? params.providerName;
	const groupHint = normalizeOptionalString(params.value.groupHint);
	const optionKey = normalizeSafeKey(params.value.optionKey);
	const cliFlag = normalizeOptionalString(params.value.cliFlag);
	const cliOption = normalizeOptionalString(params.value.cliOption);
	const cliDescription = normalizeOptionalString(params.value.cliDescription);
	const assistantPriority = asFiniteNumber(params.value.assistantPriority);
	const assistantVisibility = normalizeAssistantVisibility(params.value.assistantVisibility);
	const onboardingScopes = normalizeOnboardingScopes(params.value.onboardingScopes);
	return {
		method,
		choiceId,
		choiceLabel,
		...choiceHint ? { choiceHint } : {},
		...assistantPriority !== void 0 ? { assistantPriority } : {},
		...assistantVisibility ? { assistantVisibility } : {},
		...groupId ? { groupId } : {},
		...groupLabel ? { groupLabel } : {},
		...groupHint ? { groupHint } : {},
		...optionKey ? { optionKey } : {},
		...cliFlag ? { cliFlag } : {},
		...cliOption ? { cliOption } : {},
		...cliDescription ? { cliDescription } : {},
		...onboardingScopes ? { onboardingScopes } : {}
	};
}
function normalizeAuthChoices(params) {
	if (!Array.isArray(params.value)) return;
	const choices = params.value.map((value) => normalizeAuthChoice({
		...params,
		value
	})).filter((choice) => Boolean(choice));
	return choices.length > 0 ? choices : void 0;
}
function normalizeProvider(rawProviderId, value) {
	if (!isRecord(value)) return;
	const providerId = normalizeProviderId(rawProviderId);
	if (!providerId) return;
	const id = normalizeProviderId(normalizeOptionalString(value.id) ?? "");
	if (id && id !== providerId) return;
	const name = normalizeOptionalString(value.name) ?? "";
	const plugin = normalizePlugin(value.plugin);
	if (!name || !plugin) return;
	const docs = normalizeOptionalString(value.docs) ?? "";
	const categories = normalizeUniqueTrimmedStringList(value.categories);
	const authChoices = normalizeAuthChoices({
		providerId,
		providerName: name,
		value: value.authChoices
	});
	const previewCatalog = normalizePreviewCatalog({
		providerId,
		value: value.previewCatalog
	});
	return {
		id: providerId,
		name,
		plugin,
		...docs ? { docs } : {},
		...categories.length > 0 ? { categories } : {},
		...authChoices ? { authChoices } : {},
		...previewCatalog ? { previewCatalog } : {}
	};
}
function normalizeOpenClawProviderIndex(value) {
	if (!isRecord(value) || value.version !== OPENCLAW_PROVIDER_INDEX_VERSION) return;
	if (!isRecord(value.providers)) return;
	const providers = {};
	for (const [rawProviderId, rawProvider] of Object.entries(value.providers)) {
		const providerId = normalizeProviderId(rawProviderId);
		if (!providerId || isBlockedObjectKey(providerId)) continue;
		const provider = normalizeProvider(providerId, rawProvider);
		if (provider) providers[providerId] = provider;
	}
	return {
		version: OPENCLAW_PROVIDER_INDEX_VERSION,
		providers: Object.fromEntries(Object.entries(providers).toSorted(([left], [right]) => left.localeCompare(right)))
	};
}
//#endregion
//#region src/model-catalog/provider-index/openclaw-provider-index.ts
const OPENCLAW_PROVIDER_INDEX = {
	version: 1,
	providers: {
		moonshot: {
			id: "moonshot",
			name: "Moonshot AI",
			plugin: { id: "moonshot" },
			docs: "/providers/moonshot",
			categories: ["cloud", "llm"],
			previewCatalog: { models: [
				{
					id: "kimi-k2.6",
					name: "Kimi K2.6",
					input: ["text", "image"],
					contextWindow: 262144
				},
				{
					id: "kimi-k3",
					name: "Kimi K3",
					reasoning: true,
					input: ["text", "image"],
					contextWindow: 1048576
				},
				{
					id: "kimi-k2.7-code",
					name: "Kimi K2.7 Code",
					reasoning: true,
					input: ["text", "image"],
					contextWindow: 262144
				},
				{
					id: "kimi-k2.7-code-highspeed",
					name: "Kimi K2.7 Code HighSpeed",
					reasoning: true,
					input: ["text", "image"],
					contextWindow: 262144
				}
			] }
		},
		deepseek: {
			id: "deepseek",
			name: "DeepSeek",
			plugin: { id: "deepseek" },
			docs: "/providers/deepseek",
			categories: ["cloud", "llm"],
			previewCatalog: { models: [
				{
					id: "deepseek-v4-flash",
					name: "DeepSeek V4 Flash",
					input: ["text"],
					reasoning: true,
					contextWindow: 1e6
				},
				{
					id: "deepseek-v4-pro",
					name: "DeepSeek V4 Pro",
					input: ["text"],
					reasoning: true,
					contextWindow: 1e6
				},
				{
					id: "deepseek-chat",
					name: "DeepSeek Chat",
					input: ["text"],
					contextWindow: 1e6
				},
				{
					id: "deepseek-reasoner",
					name: "DeepSeek Reasoner",
					input: ["text"],
					reasoning: true,
					contextWindow: 1e6
				}
			] }
		}
	}
};
//#endregion
//#region src/model-catalog/provider-index/load.ts
function loadOpenClawProviderIndex(source = OPENCLAW_PROVIDER_INDEX) {
	return normalizeOpenClawProviderIndex(source) ?? {
		version: 1,
		providers: {}
	};
}
//#endregion
//#region packages/model-catalog-core/src/remote-catalog-bundle.ts
const REMOTE_CATALOG_MAX_FUTURE_SKEW_MS = 1440 * 6e4;
const stringMapSchema = record(string(), string());
const pricingTierSchema = object({
	input: number().finite().nonnegative(),
	output: number().finite().nonnegative(),
	cacheRead: number().finite().nonnegative(),
	cacheWrite: number().finite().nonnegative(),
	range: union([tuple([number().finite().nonnegative()]), tuple([number().finite().nonnegative(), number().finite().nonnegative()])])
}).strict();
const costSchema = object({
	input: number().finite().nonnegative().optional(),
	output: number().finite().nonnegative().optional(),
	cacheRead: number().finite().nonnegative().optional(),
	cacheWrite: number().finite().nonnegative().optional(),
	tieredPricing: array(pricingTierSchema).optional()
}).strict();
const hostedPricingSchema = object({
	input: number().finite().nonnegative(),
	output: number().finite().nonnegative(),
	cacheRead: number().finite().nonnegative().optional(),
	cacheWrite: number().finite().nonnegative().optional(),
	tieredPricing: array(pricingTierSchema).optional()
}).strict();
const modelSchema = object({
	id: string().trim().min(1),
	name: string().optional(),
	api: _enum(MODEL_CATALOG_APIS).optional(),
	baseUrl: string().optional(),
	headers: stringMapSchema.optional(),
	input: array(_enum([
		"text",
		"image",
		"document"
	])).optional(),
	reasoning: boolean().optional(),
	contextWindow: number().finite().positive().optional(),
	contextTokens: number().int().positive().optional(),
	maxTokens: number().finite().positive().optional(),
	thinkingLevelMap: partialRecord(_enum(MODEL_CATALOG_THINKING_LEVELS), string().nullable()).optional(),
	cost: costSchema.optional(),
	compat: record(string(), unknown()).optional(),
	mediaInput: record(string(), unknown()).optional(),
	status: _enum([
		"available",
		"preview",
		"deprecated",
		"disabled"
	]).optional(),
	statusReason: string().optional(),
	replaces: array(string()).optional(),
	replacedBy: string().optional(),
	tags: array(string()).optional()
});
const remoteModelCatalogProviderSchema = object({
	baseUrl: string().optional(),
	api: _enum(MODEL_CATALOG_APIS).optional(),
	headers: stringMapSchema.optional(),
	defaultModel: string().optional(),
	defaultUtilityModel: string().optional(),
	models: array(modelSchema).min(1)
}).strict().superRefine((provider, context) => {
	const seen = /* @__PURE__ */ new Set();
	for (const [index, model] of provider.models.entries()) {
		if (seen.has(model.id)) context.addIssue({
			code: "custom",
			message: `duplicate model id: ${model.id}`,
			path: [
				"models",
				index,
				"id"
			]
		});
		seen.add(model.id);
	}
});
const remoteModelCatalogBundleSchema = object({
	schemaVersion: literal(1),
	generatedAt: number().int().positive().refine((value) => value <= Date.now() + REMOTE_CATALOG_MAX_FUTURE_SKEW_MS, { message: "generatedAt is implausibly far in the future" }),
	minVersion: string().trim().min(1).optional(),
	sourceCommit: string().trim().min(1),
	providers: record(string().trim().min(1), remoteModelCatalogProviderSchema),
	pricing: record(string().trim().min(1), hostedPricingSchema).optional()
}).strict();
function parseRemoteModelCatalogBundle(value) {
	return remoteModelCatalogBundleSchema.parse(value);
}
function stripRemoteTransportOverrides(value) {
	if (Array.isArray(value)) return value.map(stripRemoteTransportOverrides);
	if (!value || typeof value !== "object") return value;
	return Object.fromEntries(Object.entries(value).filter(([key]) => key !== "baseUrl" && key !== "headers").map(([key, entry]) => [key, stripRemoteTransportOverrides(entry)]));
}
/** Removes every transport endpoint/header override before remote data reaches persistence. */
function sanitizeRemoteModelCatalogBundle(bundle) {
	return stripRemoteTransportOverrides(bundle);
}
function validateAndSanitizeRemoteModelCatalogBundle(value) {
	return sanitizeRemoteModelCatalogBundle(parseRemoteModelCatalogBundle(value));
}
//#endregion
//#region src/model-catalog/bundled-catalog-stamp.ts
const BUILD_INFO_CANDIDATES = [
	"../build-info.json",
	"../../build-info.json",
	"./build-info.json"
];
/** Reads the package build stamp once through Node's JSON module cache. */
function bundledCatalogGeneratedAt(moduleUrl = import.meta.url) {
	const require = createRequire(moduleUrl);
	for (const candidate of BUILD_INFO_CANDIDATES) try {
		const info = require(candidate);
		if (typeof info.builtAt !== "string") continue;
		const generatedAt = Date.parse(info.builtAt);
		if (Number.isFinite(generatedAt) && generatedAt > 0) return generatedAt;
	} catch {}
}
//#endregion
//#region src/model-catalog/remote-store.ts
const ensuredDatabases = /* @__PURE__ */ new WeakSet();
const REMOTE_MODEL_CATALOG_SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS model_catalog_remote (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  bundle_json TEXT NOT NULL,
  generated_at INTEGER NOT NULL,
  min_version TEXT,
  source_url TEXT NOT NULL,
  etag TEXT,
  last_modified TEXT,
  checked_at INTEGER NOT NULL
) STRICT;
`;
function ensureRemoteModelCatalogSchema(options = {}) {
	const database = openOpenClawStateDatabase(options);
	if (ensuredDatabases.has(database.db)) return;
	runOpenClawStateWriteTransaction(({ db }) => {
		db.exec(REMOTE_MODEL_CATALOG_SCHEMA_SQL);
	}, options, { operationLabel: "model-catalog.remote.schema.ensure" });
	ensuredDatabases.add(database.db);
}
function openDatabase(options) {
	ensureRemoteModelCatalogSchema(options);
	return openOpenClawStateDatabase(options);
}
function readRemoteModelCatalog(options = {}) {
	const state = openDatabase(options);
	const db = getNodeSqliteKysely(state.db);
	return executeSqliteQueryTakeFirstSync(state.db, db.selectFrom("model_catalog_remote").selectAll().where("id", "=", 1));
}
function writeRemoteModelCatalog(row, options = {}) {
	ensureRemoteModelCatalogSchema(options);
	return runOpenClawStateWriteTransaction(({ db: sqlite }) => {
		const db = getNodeSqliteKysely(sqlite);
		const current = executeSqliteQueryTakeFirstSync(sqlite, db.selectFrom("model_catalog_remote").selectAll().where("id", "=", 1));
		if (current && current.source_url === row.source_url && (current.generated_at > row.generated_at || current.generated_at === row.generated_at && current.bundle_json !== row.bundle_json)) return {
			status: "retained-newer",
			row: current
		};
		executeSqliteQuerySync(sqlite, db.insertInto("model_catalog_remote").values({
			id: 1,
			...row
		}).onConflict((conflict) => conflict.column("id").doUpdateSet({
			bundle_json: row.bundle_json,
			generated_at: row.generated_at,
			min_version: row.min_version,
			source_url: row.source_url,
			etag: row.etag,
			last_modified: row.last_modified,
			checked_at: row.checked_at
		})));
		return { status: "written" };
	}, options, { operationLabel: "model-catalog.remote.write" });
}
function markRemoteModelCatalogChecked(checkedAt, metadata, options = {}) {
	ensureRemoteModelCatalogSchema(options);
	return runOpenClawStateWriteTransaction(({ db: sqlite }) => {
		let query = getNodeSqliteKysely(sqlite).updateTable("model_catalog_remote").set({
			checked_at: checkedAt,
			...metadata.etag !== void 0 ? { etag: metadata.etag } : {},
			...metadata.lastModified !== void 0 ? { last_modified: metadata.lastModified } : {}
		}).where("id", "=", 1).where("source_url", "=", metadata.expected.source_url).where("generated_at", "=", metadata.expected.generated_at);
		query = metadata.expected.etag === null ? query.where("etag", "is", null) : query.where("etag", "=", metadata.expected.etag);
		query = metadata.expected.last_modified === null ? query.where("last_modified", "is", null) : query.where("last_modified", "=", metadata.expected.last_modified);
		return executeSqliteQuerySync(sqlite, query).numAffectedRows === 1n;
	}, options, { operationLabel: "model-catalog.remote.checked" });
}
//#endregion
//#region src/model-catalog/remote-refresh.ts
const DEFAULT_REMOTE_MODEL_CATALOG_URL = "https://catalog.openclaw.ai/models/v1/catalog.json";
const REMOTE_MODEL_CATALOG_TTL_MS = 360 * 6e4;
const REMOTE_MODEL_CATALOG_TIMEOUT_MS = 15e3;
const REMOTE_MODEL_CATALOG_MAX_BYTES = 4 * 1024 * 1024;
function isRemoteModelCatalogRefreshEnabled(config) {
	return config.models?.catalogRefresh?.enabled !== false;
}
function resolveRemoteCatalogUrl(config) {
	return config.models?.catalogRefresh?.url?.trim() || DEFAULT_REMOTE_MODEL_CATALOG_URL;
}
function bundleCounts(bundle) {
	const providers = Object.values(bundle.providers);
	return {
		providers: providers.length,
		models: providers.reduce((total, provider) => total + provider.models.length, 0)
	};
}
function storedCounts(bundleJson) {
	const bundle = validateAndSanitizeRemoteModelCatalogBundle(JSON.parse(bundleJson));
	return {
		...bundleCounts(bundle),
		generatedAt: bundle.generatedAt
	};
}
function assertCompatibleMinVersion(bundle) {
	if (!bundle.minVersion) return;
	const comparison = compareOpenClawVersions(VERSION, bundle.minVersion);
	if (comparison === null) throw new Error(`invalid remote catalog minVersion: ${bundle.minVersion}`);
	if (comparison < 0) throw new Error(`remote catalog requires OpenClaw ${bundle.minVersion} or newer (current ${VERSION})`);
}
function isExplicitLocalHttpUrl(config, url) {
	if (!config.models?.catalogRefresh?.url) return false;
	const parsed = new URL(url);
	return parsed.protocol === "http:" && (parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1" || parsed.hostname === "[::1]");
}
async function refreshRemoteModelCatalog(params) {
	if (!isRemoteModelCatalogRefreshEnabled(params.config)) return {
		status: "disabled",
		providers: 0,
		models: 0
	};
	const databaseOptions = params.databaseOptions ?? {};
	const now = (params.now ?? Date.now)();
	try {
		const url = resolveRemoteCatalogUrl(params.config);
		const stored = readRemoteModelCatalog(databaseOptions);
		const activeStored = stored?.source_url === url ? stored : void 0;
		if (!params.force && activeStored && now - activeStored.checked_at < 216e5) return {
			status: "fresh",
			nextCheckInMs: Math.max(0, REMOTE_MODEL_CATALOG_TTL_MS - (now - activeStored.checked_at)),
			...storedCounts(activeStored.bundle_json)
		};
		const headers = new Headers({ Accept: "application/json" });
		if (activeStored?.etag) headers.set("If-None-Match", activeStored.etag);
		if (activeStored?.last_modified) headers.set("If-Modified-Since", activeStored.last_modified);
		const fetchParams = {
			url,
			init: { headers },
			timeoutMs: REMOTE_MODEL_CATALOG_TIMEOUT_MS,
			signal: params.signal,
			fetchImpl: params.fetchImpl,
			auditContext: "remote-model-catalog"
		};
		const explicitOverride = Boolean(params.config.models?.catalogRefresh?.url);
		const localHttp = isExplicitLocalHttpUrl(params.config, url);
		let guarded;
		if (explicitOverride) {
			const configuredOrigin = new URL(url).origin;
			guarded = await fetchConfiguredLocalOriginWithSsrFGuard({
				...fetchParams,
				configuredLocalOriginBaseUrl: configuredOrigin,
				policy: { allowedOrigins: [configuredOrigin] },
				requireHttps: !localHttp
			});
		} else guarded = await fetchWithSsrFGuard({
			...fetchParams,
			requireHttps: true
		});
		try {
			if (guarded.response.status === 304) {
				if (!activeStored) throw new Error("remote catalog returned 304 without a stored bundle");
				return {
					status: "unchanged",
					...storedCounts((markRemoteModelCatalogChecked(now, {
						expected: activeStored,
						etag: guarded.response.headers.get("etag") ?? activeStored.etag,
						lastModified: guarded.response.headers.get("last-modified") ?? activeStored.last_modified
					}, databaseOptions) ? activeStored : readRemoteModelCatalog(databaseOptions))?.bundle_json ?? activeStored.bundle_json)
				};
			}
			if (!guarded.response.ok) throw new Error(`remote catalog request failed: HTTP ${guarded.response.status}`);
			const body = await readResponseWithLimit(guarded.response, REMOTE_MODEL_CATALOG_MAX_BYTES, { chunkTimeoutMs: REMOTE_MODEL_CATALOG_TIMEOUT_MS });
			const bundle = validateAndSanitizeRemoteModelCatalogBundle(JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(body)));
			assertCompatibleMinVersion(bundle);
			const bundleJson = JSON.stringify(bundle);
			const unchanged = activeStored?.bundle_json === bundleJson;
			const writeResult = writeRemoteModelCatalog({
				bundle_json: bundleJson,
				generated_at: bundle.generatedAt,
				min_version: bundle.minVersion ?? null,
				source_url: url,
				etag: guarded.response.headers.get("etag"),
				last_modified: guarded.response.headers.get("last-modified"),
				checked_at: now
			}, databaseOptions);
			if (writeResult.status === "retained-newer") return {
				status: "unchanged",
				...storedCounts(writeResult.row.bundle_json)
			};
			const bundledGeneratedAt = (params.bundledGeneratedAt ?? bundledCatalogGeneratedAt)();
			return {
				status: unchanged || bundledGeneratedAt === void 0 || bundle.generatedAt <= bundledGeneratedAt ? "unchanged" : "updated",
				generatedAt: bundle.generatedAt,
				...bundleCounts(bundle)
			};
		} finally {
			await guarded.release();
		}
	} catch (error) {
		return {
			status: "error",
			error: String(error),
			providers: 0,
			models: 0
		};
	}
}
//#endregion
//#region src/model-catalog/remote-overlay.ts
let cachedOverlay;
let readBundledGeneratedAt = bundledCatalogGeneratedAt;
let readStoredCatalog = readRemoteModelCatalog;
function isCompatible(bundle) {
	if (!bundle.minVersion) return true;
	const comparison = compareOpenClawVersions(VERSION, bundle.minVersion);
	return comparison !== null && comparison >= 0;
}
function getActiveRemoteModelCatalog(config) {
	if (!isRemoteModelCatalogRefreshEnabled(config)) return;
	try {
		const sourceUrl = resolveRemoteCatalogUrl(config);
		if (cachedOverlay?.sourceUrl === sourceUrl) return cachedOverlay.value ?? void 0;
		const bundledGeneratedAt = readBundledGeneratedAt();
		if (bundledGeneratedAt === void 0) {
			cachedOverlay = {
				sourceUrl,
				value: null
			};
			return;
		}
		const stored = readStoredCatalog();
		if (!stored || stored.source_url !== sourceUrl) {
			cachedOverlay = {
				sourceUrl,
				value: null
			};
			return;
		}
		const bundle = validateAndSanitizeRemoteModelCatalogBundle(JSON.parse(stored.bundle_json));
		if (bundle.generatedAt <= bundledGeneratedAt || !isCompatible(bundle)) {
			cachedOverlay = {
				sourceUrl,
				value: null
			};
			return;
		}
		const value = {
			providers: bundle.providers,
			...bundle.pricing ? { pricing: bundle.pricing } : {}
		};
		cachedOverlay = {
			sourceUrl,
			value
		};
		return value;
	} catch {
		cachedOverlay = void 0;
		return;
	}
}
function getRemoteModelCatalogOverlay(config) {
	return getActiveRemoteModelCatalog(config)?.providers;
}
function getRemoteModelCatalogPricing(config) {
	return getActiveRemoteModelCatalog(config)?.pricing;
}
function resetRemoteModelCatalogOverlayForTest() {
	cachedOverlay = void 0;
}
function setRemoteModelCatalogOverlaySourcesForTest(sources) {
	cachedOverlay = void 0;
	readBundledGeneratedAt = sources?.bundledGeneratedAt ?? bundledCatalogGeneratedAt;
	readStoredCatalog = sources?.readStoredCatalog ?? readRemoteModelCatalog;
}
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.remoteModelCatalogOverlayTestApi")] = {
	resetRemoteModelCatalogOverlayForTest,
	setRemoteModelCatalogOverlaySourcesForTest
};
//#endregion
//#region src/model-catalog/index.ts
function planEffectiveModelCatalogRows(params) {
	const remoteOverlay = getRemoteModelCatalogOverlay(params.config);
	return planManifestModelCatalogRows({
		registry: params.registry,
		...params.providerFilter ? { providerFilter: params.providerFilter } : {},
		...remoteOverlay ? { remoteOverlay } : {},
		...params.selection ? { selection: params.selection } : {}
	});
}
//#endregion
export { loadOpenClawProviderIndex as a, refreshRemoteModelCatalog as i, getRemoteModelCatalogPricing as n, REMOTE_MODEL_CATALOG_TTL_MS as r, planEffectiveModelCatalogRows as t };
