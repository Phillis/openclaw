import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { v as uniqueStrings } from "./string-normalization-e_fvmxMf.js";
import "./utils-DEqefz4f.js";
import { r as formatErrorMessage } from "./errors-CSNUPl5U.js";
import { n as MANIFEST_KEY } from "./legacy-names-NIXaj2oi.js";
import { t as BUNDLED_OFFICIAL_EXTERNAL_PLUGIN_CATALOGS } from "./official-external-plugin-bundled-catalogs-B1B9VBeU.js";
import { d as readResponseWithLimit, i as cancelUnreadResponseBody } from "./http-body-D5I0NwSl.js";
import { o as normalizeClawHubSha256Integrity } from "./clawhub-artifacts-BRS02t8t.js";
import { createHash } from "node:crypto";
//#region src/plugins/official-external-plugin-catalog.ts
/** Reads official external plugin/channel/provider catalogs into manifest-like metadata. */
var HostedCatalogSnapshotWriteError = class extends Error {
	constructor(originalError) {
		super("hosted catalog snapshot write failed");
		this.name = "HostedCatalogSnapshotWriteError";
		this.originalError = originalError;
	}
};
var HostedCatalogSignedFeedMonotonicityError = class extends Error {
	constructor(message) {
		super(message);
		this.name = "HostedCatalogSignedFeedMonotonicityError";
	}
};
const SUPPORTED_OFFICIAL_EXTERNAL_CATALOG_FEED_SCHEMA_VERSIONS = /* @__PURE__ */ new Set([1, 2]);
const DEFAULT_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_FEED_URL = "https://clawhub.ai/v1/feeds/plugins";
const DEFAULT_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_FEED_PROFILE = "clawhub-public";
const DEFAULT_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_FEED_ID = "clawhub-official";
const DEFAULT_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_CLAWHUB_SOURCE_REF = "public-clawhub";
const DEFAULT_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_NPM_SOURCE_REF = "public-npm";
const DEFAULT_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_CLAWHUB_TRUSTED_KEYS = [];
const DEFAULT_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_PROFILE_CONFIG = {
	feeds: { [DEFAULT_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_FEED_PROFILE]: {
		url: DEFAULT_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_FEED_URL,
		feedId: DEFAULT_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_FEED_ID
	} },
	sources: {
		[DEFAULT_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_CLAWHUB_SOURCE_REF]: {
			type: "clawhub",
			baseUrl: "https://clawhub.ai"
		},
		[DEFAULT_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_NPM_SOURCE_REF]: {
			type: "npm",
			registry: "https://registry.npmjs.org/"
		}
	}
};
const DEFAULT_HOSTED_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_TIMEOUT_MS = 5e3;
const DEFAULT_HOSTED_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_MAX_BYTES = 1024 * 1024;
const DEFAULT_HOSTED_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_CHUNK_TIMEOUT_MS = 5e3;
const DSSE_ENVELOPE_MEDIA_TYPE = "application/vnd.dsse+json";
const OFFICIAL_EXTERNAL_PLUGIN_CATALOG_FEED_HOSTNAME_ALLOWLIST = ["clawhub.ai"];
const ISO_CALENDAR_DATE_PREFIX_RE = /^(\d{4})-(\d{2})-(\d{2})/u;
function parseOfficialExternalPluginCatalogTimestamp(value) {
	const timestamp = value.trim();
	const parsed = Date.parse(timestamp);
	if (!Number.isFinite(parsed)) return;
	const calendarDate = ISO_CALENDAR_DATE_PREFIX_RE.exec(timestamp);
	if (!calendarDate) return parsed;
	const year = Number(calendarDate[1]);
	const month = Number(calendarDate[2]);
	const day = Number(calendarDate[3]);
	const daysInMonth = [
		31,
		year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0) ? 29 : 28,
		31,
		30,
		31,
		30,
		31,
		31,
		30,
		31,
		30,
		31
	];
	return month >= 1 && month <= 12 && day >= 1 && day <= daysInMonth[month - 1] ? parsed : void 0;
}
function isOfficialExternalPluginCatalogSequence(value) {
	return typeof value === "number" && Number.isSafeInteger(value) && value >= 0;
}
function isOfficialExternalPluginCatalogFeed(raw) {
	if (!isRecord(raw)) return false;
	const sequence = raw.sequence;
	const generatedAt = raw.generatedAt;
	const generatedAtMs = typeof generatedAt === "string" ? parseOfficialExternalPluginCatalogTimestamp(generatedAt) : void 0;
	const entries = raw.entries;
	return typeof raw.schemaVersion === "number" && SUPPORTED_OFFICIAL_EXTERNAL_CATALOG_FEED_SCHEMA_VERSIONS.has(raw.schemaVersion) && typeof raw.id === "string" && raw.id.trim().length > 0 && typeof generatedAt === "string" && generatedAt.trim().length > 0 && generatedAtMs !== void 0 && isOfficialExternalPluginCatalogSequence(sequence) && Array.isArray(entries);
}
function parseOfficialExternalPluginCatalogEntries(raw) {
	if (Array.isArray(raw)) return raw.filter((entry) => isRecord(entry));
	if (isOfficialExternalPluginCatalogFeed(raw)) return raw.entries.filter((entry) => isRecord(entry));
	if (!isRecord(raw)) return [];
	if ("schemaVersion" in raw) return [];
	const list = raw.entries ?? raw.packages ?? raw.plugins;
	if (!Array.isArray(list)) return [];
	return list.filter((entry) => isRecord(entry));
}
function normalizeHostedCatalogHeader(value) {
	return normalizeOptionalString(value) || void 0;
}
function sha256Hex(value) {
	return `sha256:${createHash("sha256").update(value).digest("hex")}`;
}
function resolveHostedCatalogFeedUrl(raw) {
	let parsed;
	try {
		parsed = new URL(raw.trim());
	} catch {
		throw new Error("hosted catalog feed URL is invalid");
	}
	if (parsed.protocol !== "https:") throw new Error("hosted catalog feed URL must use HTTPS");
	if (parsed.username || parsed.password) throw new Error("hosted catalog feed URL must not include credentials");
	if (parsed.search || parsed.hash) throw new Error("hosted catalog feed URL must not include query strings or fragments");
	return parsed;
}
function resolveOfficialExternalPluginCatalogProfileConfig(config) {
	const configuredDefaultFeed = config?.feeds?.[DEFAULT_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_FEED_PROFILE];
	const bundledVerification = DEFAULT_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_CLAWHUB_TRUSTED_KEYS.length > 0 ? {
		mode: "signed",
		keys: DEFAULT_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_CLAWHUB_TRUSTED_KEYS
	} : void 0;
	const defaultFeed = DEFAULT_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_PROFILE_CONFIG.feeds?.[DEFAULT_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_FEED_PROFILE] ?? {
		url: DEFAULT_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_FEED_URL,
		feedId: DEFAULT_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_FEED_ID
	};
	return {
		feeds: {
			...config?.feeds,
			[DEFAULT_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_FEED_PROFILE]: {
				...defaultFeed,
				...bundledVerification ? { verification: bundledVerification } : {},
				...configuredDefaultFeed
			}
		},
		sources: {
			...DEFAULT_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_PROFILE_CONFIG.sources,
			...config?.sources
		}
	};
}
function resolveHostedCatalogFeedSource(params) {
	const explicitFeedUrl = normalizeOptionalString(params.feedUrl);
	const explicitProfileName = normalizeOptionalString(params.feedProfile);
	if (explicitFeedUrl) {
		const url = resolveHostedCatalogFeedUrl(explicitFeedUrl);
		if (!OFFICIAL_EXTERNAL_PLUGIN_CATALOG_FEED_HOSTNAME_ALLOWLIST.includes(url.hostname)) throw new Error("hosted catalog feed URL hostname is not allowed");
		const defaultProfile = explicitProfileName === void 0 ? resolveOfficialExternalPluginCatalogProfileConfig(params.catalogConfig).feeds[DEFAULT_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_FEED_PROFILE] : void 0;
		const profileName = explicitProfileName ?? (defaultProfile && resolveHostedCatalogFeedUrl(defaultProfile.url).href === url.href ? DEFAULT_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_FEED_PROFILE : void 0);
		const profileConfig = profileName === void 0 ? void 0 : resolveOfficialExternalPluginCatalogProfileConfig(params.catalogConfig);
		const profile = profileName === void 0 ? void 0 : profileConfig?.feeds[profileName];
		if (profileName !== void 0 && !profile) throw new Error(`hosted catalog feed profile "${profileName}" is not configured`);
		return {
			url,
			hostnameAllowlist: OFFICIAL_EXTERNAL_PLUGIN_CATALOG_FEED_HOSTNAME_ALLOWLIST,
			...profile?.feedId ? { expectedFeedId: profile.feedId } : {},
			...profile?.verification ? { verification: profile.verification } : {}
		};
	}
	const profileName = explicitProfileName ?? DEFAULT_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_FEED_PROFILE;
	const profile = resolveOfficialExternalPluginCatalogProfileConfig(params.catalogConfig).feeds[profileName];
	if (!profile) throw new Error(`hosted catalog feed profile "${profileName}" is not configured`);
	const url = resolveHostedCatalogFeedUrl(profile.url);
	return {
		url,
		hostnameAllowlist: uniqueStrings([...OFFICIAL_EXTERNAL_PLUGIN_CATALOG_FEED_HOSTNAME_ALLOWLIST, url.hostname]),
		...profile.feedId ? { expectedFeedId: profile.feedId } : {},
		verification: profile.verification
	};
}
function getOfficialExternalPluginCatalogSourceRefs(config) {
	return new Set(Object.keys(resolveOfficialExternalPluginCatalogProfileConfig(config).sources));
}
function getFeedEntryInstallCandidateRecords(entry) {
	const candidates = (isRecord(entry.install) ? entry.install : void 0)?.candidates;
	if (!Array.isArray(candidates)) return [];
	return candidates.filter((candidate) => isRecord(candidate));
}
function getFeedEntryInstallCandidates(entry) {
	if (normalizeOptionalString(entry.state) !== "available") return [];
	if (normalizeOptionalString(entry.publisher?.trust) !== "official") return [];
	return getFeedEntryInstallCandidateRecords(entry);
}
function shouldRequireManifestInstallSourceRef(params) {
	const feedUrl = normalizeOptionalString(params.feedUrl);
	if (feedUrl) try {
		return resolveHostedCatalogFeedUrl(feedUrl).href !== resolveHostedCatalogFeedUrl(DEFAULT_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_FEED_URL).href;
	} catch {
		return true;
	}
	const profileName = normalizeOptionalString(params.feedProfile) ?? DEFAULT_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_FEED_PROFILE;
	if (profileName !== DEFAULT_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_FEED_PROFILE) return true;
	const profileUrl = normalizeOptionalString(resolveOfficialExternalPluginCatalogProfileConfig(params.catalogConfig).feeds[profileName]?.url);
	try {
		return resolveHostedCatalogFeedUrl(profileUrl ?? DEFAULT_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_FEED_URL).href !== resolveHostedCatalogFeedUrl(DEFAULT_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_FEED_URL).href;
	} catch {
		return true;
	}
}
function getManifestInstallSourceRefCandidate(entry) {
	const install = getOfficialExternalPluginCatalogManifest(entry)?.install;
	if (!install) return;
	if (!Boolean(normalizeOptionalString(install.clawhubSpec) || normalizeOptionalString(install.npmSpec) || normalizeOptionalString(install.localPath))) return;
	return {
		sourceRef: normalizeOptionalString(install.sourceRef),
		package: normalizeOptionalString(install.npmSpec) ?? normalizeOptionalString(install.clawhubSpec)
	};
}
function validateOfficialExternalPluginCatalogEntrySourceRefs(entry, params) {
	const configuredSourceRefs = getOfficialExternalPluginCatalogSourceRefs(params?.catalogConfig);
	const errors = [];
	let candidates = getFeedEntryInstallCandidateRecords(entry);
	if (params?.requireManifestInstallSourceRef) {
		const manifestCandidate = getManifestInstallSourceRefCandidate(entry);
		if (manifestCandidate) candidates = [...candidates, manifestCandidate];
		else if (candidates.length === 0) candidates = [{}];
	}
	for (const candidate of candidates) {
		const sourceRef = normalizeOptionalString(candidate.sourceRef);
		if (!sourceRef) errors.push("feed install candidate is missing sourceRef");
		else if (!configuredSourceRefs.has(sourceRef)) errors.push(`feed install candidate references unknown sourceRef "${sourceRef}"`);
	}
	return errors;
}
function filterOfficialExternalPluginCatalogEntriesBySourceRefs(entries, params) {
	return entries.filter((entry) => validateOfficialExternalPluginCatalogEntrySourceRefs(entry, params).length === 0);
}
function parseHostedCatalogContentLength(raw, maxBytes) {
	const normalized = normalizeOptionalString(raw);
	if (!normalized) return;
	if (!/^\d+$/.test(normalized)) throw new Error("hosted catalog feed has invalid content-length");
	const size = Number(normalized);
	if (!Number.isSafeInteger(size) || size > maxBytes) throw new Error(`hosted catalog feed exceeds ${maxBytes} bytes`);
}
async function readHostedCatalogResponseText(params) {
	parseHostedCatalogContentLength(params.response.headers.get("content-length"), params.maxBytes);
	if (!params.response.body || typeof params.response.body.getReader !== "function") throw new Error("hosted catalog feed streaming response body unavailable");
	const buffer = await readResponseWithLimit(params.response, params.maxBytes, {
		chunkTimeoutMs: params.chunkTimeoutMs,
		onOverflow: ({ maxBytes }) => /* @__PURE__ */ new Error(`hosted catalog feed exceeds ${maxBytes} bytes`),
		onIdleTimeout: ({ chunkTimeoutMs }) => /* @__PURE__ */ new Error(`hosted catalog feed read timed out after ${chunkTimeoutMs}ms`)
	});
	return new TextDecoder("utf-8", { fatal: true }).decode(buffer);
}
function bundledOfficialExternalPluginCatalogEntries() {
	return BUNDLED_OFFICIAL_EXTERNAL_PLUGIN_CATALOGS.flatMap((source) => filterOfficialExternalPluginCatalogEntriesBySourceRefs(parseOfficialExternalPluginCatalogEntries(source)));
}
function dedupeOfficialExternalPluginCatalogEntries(entries) {
	const resolved = /* @__PURE__ */ new Map();
	for (const entry of entries) {
		const key = resolveOfficialExternalPluginCatalogEntryKey(entry);
		if (key && !resolved.has(key)) resolved.set(key, entry);
	}
	return [...resolved.values()];
}
function resolveOfficialExternalPluginCatalogEntryKey(entry) {
	const pluginId = resolveOfficialExternalPluginId(entry);
	if (pluginId) return `${normalizeOptionalString(entry.kind) ?? "plugin"}:${pluginId}`;
	const name = normalizeOptionalString(entry.name);
	if (name) return name;
	const id = normalizeOptionalString(entry.id);
	if (id) return `${normalizeOptionalString(entry.kind) ?? normalizeOptionalString(entry.type) ?? "plugin"}:${id}`;
}
function bundledFallbackResult(error, metadata) {
	return {
		source: "bundled-fallback",
		entries: listOfficialExternalPluginCatalogEntries(),
		error: formatErrorMessage(error),
		...metadata ? { metadata } : {}
	};
}
function emptyBundledFallbackResult(error) {
	return {
		source: "bundled-fallback",
		entries: [],
		error: formatErrorMessage(error)
	};
}
async function parseHostedCatalogFeedBody(params) {
	const raw = JSON.parse(params.body);
	if (params.verification?.mode === "signed") {
		const { verifyOfficialExternalPluginCatalogSignedEnvelope } = await import("./official-external-plugin-catalog-envelope-DYipt8ao.js");
		const threshold = params.verification.threshold ?? 1;
		const verification = verifyOfficialExternalPluginCatalogSignedEnvelope(raw, {
			trustedKeys: params.verification.keys,
			threshold,
			...params.allowLegacyBetaEnvelope ? { allowLegacyBetaEnvelope: true } : {}
		});
		if (!verification.ok) {
			const invalidTimestampSequence = verification.error === "invalid-payload" && "authenticatedPayload" in verification ? readOfficialExternalPluginCatalogInvalidTimestampSequence(verification.authenticatedPayload) : void 0;
			if (invalidTimestampSequence !== void 0) throw new HostedCatalogFeedTimestampError(verification.message, invalidTimestampSequence);
			throw new Error(verification.message);
		}
		if (params.expectedFeedId && verification.feed.id !== params.expectedFeedId) throw new Error(`hosted catalog feed id "${verification.feed.id}" did not match expected "${params.expectedFeedId}"`);
		const generatedAtMs = parseOfficialExternalPluginCatalogTimestamp(verification.feed.generatedAt);
		const expiresAt = normalizeOptionalString(verification.feed.expiresAt);
		if (generatedAtMs === void 0) throw new Error("hosted catalog signed feed requires a valid generatedAt value");
		let expired;
		if (!expiresAt) {
			if (params.allowMissingExpiry !== true) throw new Error("hosted catalog signed feed requires a valid expiresAt value");
			expired = true;
		} else {
			const expiresAtMs = parseOfficialExternalPluginCatalogTimestamp(expiresAt);
			if (expiresAtMs === void 0) throw new Error("hosted catalog signed feed requires a valid expiresAt value");
			if (expiresAtMs <= generatedAtMs) throw new Error("hosted catalog signed feed expiresAt must be later than generatedAt");
			expired = expiresAtMs <= params.now.getTime();
		}
		if (expired && params.allowExpired !== true) throw new Error(expiresAt ? `hosted catalog signed feed expired at ${expiresAt}` : "hosted catalog signed feed has no expiresAt");
		return {
			feed: enforceHostedCatalogFeedInstallAuthority(verification.feed),
			trust: {
				mode: "signed",
				signedBy: verification.signedBy,
				signatureCount: verification.signatureCount ?? 1,
				threshold,
				verifiedAt: params.verifiedAt
			},
			...expired ? { expired: true } : {}
		};
	}
	if (!isOfficialExternalPluginCatalogFeed(raw)) throw new Error("hosted catalog feed did not match a supported schema version");
	if (params.expectedFeedId && raw.id !== params.expectedFeedId) throw new Error(`hosted catalog feed id "${raw.id}" did not match expected "${params.expectedFeedId}"`);
	return { feed: enforceHostedCatalogFeedInstallAuthority(raw) };
}
function enforceHostedCatalogFeedInstallAuthority(feed) {
	if (feed.schemaVersion < 2) return feed;
	return {
		...feed,
		entries: feed.entries.map((entry) => {
			const state = normalizeOptionalString(entry.state);
			const publisherTrust = normalizeOptionalString(entry.publisher?.trust);
			return state === "available" && publisherTrust === "official" ? entry : removeOfficialExternalPluginCatalogInstallAuthority(entry);
		})
	};
}
var HostedCatalogFeedTimestampError = class extends Error {
	constructor(message, sequence) {
		super(message);
		this.sequence = sequence;
	}
};
function readOfficialExternalPluginCatalogInvalidTimestampSequence(raw) {
	if (!isRecord(raw)) return;
	if (typeof raw.generatedAt === "string" && parseOfficialExternalPluginCatalogTimestamp(raw.generatedAt) !== void 0) return;
	const normalized = {
		...raw,
		generatedAt: "1970-01-01T00:00:00.000Z"
	};
	return isOfficialExternalPluginCatalogFeed(normalized) ? normalized.sequence : void 0;
}
async function loadHostedCatalogSnapshotResult(params) {
	assertSnapshotMatchesRequestValidators({
		snapshot: params.snapshot,
		ifNoneMatch: params.ifNoneMatch,
		ifModifiedSince: params.ifModifiedSince
	});
	const checksum = sha256Hex(params.snapshot.body);
	if (checksum !== params.snapshot.metadata.checksum) throw new Error("hosted catalog snapshot checksum mismatch");
	if (params.expectedSha256 && params.expectedSha256 !== checksum) throw new Error("hosted catalog snapshot checksum did not match expected checksum");
	const parsed = await parseHostedCatalogFeedBody({
		body: params.snapshot.body,
		expectedFeedId: params.expectedFeedId,
		verification: params.verification,
		verifiedAt: params.snapshot.trust?.verifiedAt ?? params.snapshot.savedAt,
		allowLegacyBetaEnvelope: true,
		now: params.now,
		allowExpired: true,
		allowMissingExpiry: true
	});
	const entries = dedupeOfficialExternalPluginCatalogEntries(filterOfficialExternalPluginCatalogEntriesBySourceRefs(parseOfficialExternalPluginCatalogEntries(parsed.feed), {
		catalogConfig: params.catalogConfig,
		requireManifestInstallSourceRef: params.requireManifestInstallSourceRef
	}));
	const visibleEntries = parsed.expired ? entries.map((entry) => removeOfficialExternalPluginCatalogInstallAuthority(entry)) : entries;
	return {
		source: "hosted-snapshot",
		entries: visibleEntries,
		feed: parsed.expired ? {
			...parsed.feed,
			entries: visibleEntries
		} : parsed.feed,
		metadata: params.snapshot.metadata,
		snapshot: params.snapshot,
		...parsed.trust ? { trust: parsed.trust } : {},
		error: parsed.expired ? `${formatErrorMessage(params.error)}; ${parsed.feed.expiresAt ? `hosted catalog signed feed expired at ${parsed.feed.expiresAt}` : "hosted catalog signed feed has no expiresAt"}` : formatErrorMessage(params.error)
	};
}
function removeOfficialExternalPluginCatalogInstallAuthority(entry) {
	const { install: _feedInstall, [MANIFEST_KEY]: manifest, ...metadata } = entry;
	if (!manifest) return {
		...metadata,
		state: "unavailable"
	};
	const { install: _manifestInstall, ...manifestMetadata } = manifest;
	return {
		...metadata,
		state: "unavailable",
		[MANIFEST_KEY]: manifestMetadata
	};
}
function isHostedCatalogSignedFeedRollback(params) {
	if (params.candidate.sequence < params.current.sequence) return true;
	if (params.candidate.sequence > params.current.sequence) return false;
	if (params.current.generatedAt === void 0) return false;
	return Date.parse(params.candidate.generatedAt) < Date.parse(params.current.generatedAt);
}
function assertSnapshotMatchesRequestValidators(params) {
	if (params.ifNoneMatch && params.snapshot.metadata.etag !== params.ifNoneMatch) throw new Error("hosted catalog snapshot ETag did not match request validator");
	if (!params.ifNoneMatch && params.ifModifiedSince && params.snapshot.metadata.lastModified !== params.ifModifiedSince) throw new Error("hosted catalog snapshot Last-Modified did not match request validator");
}
async function snapshotOrBundledFallbackResult(params) {
	if (params.snapshotStore) try {
		const snapshot = await params.snapshotStore.read(params.url);
		if (snapshot) return await loadHostedCatalogSnapshotResult({
			snapshot,
			error: params.error,
			expectedSha256: params.expectedSha256,
			ifNoneMatch: params.ifNoneMatch,
			ifModifiedSince: params.ifModifiedSince,
			catalogConfig: params.catalogConfig,
			requireManifestInstallSourceRef: params.requireManifestInstallSourceRef,
			expectedFeedId: params.expectedFeedId,
			verification: params.verification,
			now: params.now
		});
	} catch (snapshotErr) {
		if (params.verification?.mode === "signed") return emptyBundledFallbackResult(`${formatErrorMessage(params.error)}; snapshot fallback failed: ${formatErrorMessage(snapshotErr)}`);
		return bundledFallbackResult(`${formatErrorMessage(params.error)}; snapshot fallback failed: ${formatErrorMessage(snapshotErr)}`, params.metadata);
	}
	if (params.verification?.mode === "signed") return emptyBundledFallbackResult(params.error);
	return bundledFallbackResult(params.error, params.metadata);
}
async function resolveHostedCatalogSnapshotStore(params) {
	if (params.snapshotStore !== void 0) return params.snapshotStore ?? void 0;
	const { createSqliteHostedOfficialExternalPluginCatalogSnapshotStore } = await import("./official-external-plugin-catalog-snapshot-store-DjD6MWl5.js");
	return createSqliteHostedOfficialExternalPluginCatalogSnapshotStore({
		...params.env ? { env: params.env } : {},
		...params.stateDir ? { stateDir: params.stateDir } : {},
		...params.stateDatabasePath ? { stateDatabasePath: params.stateDatabasePath } : {}
	});
}
async function loadHostedOfficialExternalPluginCatalogEntries(params) {
	let source;
	try {
		source = resolveHostedCatalogFeedSource({
			feedUrl: params?.feedUrl,
			feedProfile: params?.feedProfile,
			catalogConfig: params?.catalogConfig
		});
	} catch (err) {
		return bundledFallbackResult(err);
	}
	const { url } = source;
	const snapshotStore = await resolveHostedCatalogSnapshotStore({
		snapshotStore: params?.snapshotStore,
		env: params?.env,
		stateDir: params?.stateDir,
		stateDatabasePath: params?.stateDatabasePath
	});
	const expectedSha256 = normalizeOptionalString(params?.expectedSha256);
	const currentTime = () => params?.now?.() ?? /* @__PURE__ */ new Date();
	const requireManifestInstallSourceRef = shouldRequireManifestInstallSourceRef({
		feedUrl: params?.feedUrl,
		feedProfile: params?.feedProfile,
		catalogConfig: params?.catalogConfig
	});
	if (params?.offline === true) return await snapshotOrBundledFallbackResult({
		error: "hosted catalog feed offline mode",
		snapshotStore,
		url: url.href,
		expectedSha256,
		catalogConfig: params?.catalogConfig,
		requireManifestInstallSourceRef,
		expectedFeedId: source.expectedFeedId,
		verification: source.verification,
		now: currentTime()
	});
	const headers = new Headers();
	const ifNoneMatch = normalizeOptionalString(params?.ifNoneMatch);
	const signedOperation = source.verification?.mode === "signed";
	const ifModifiedSince = signedOperation ? void 0 : normalizeOptionalString(params?.ifModifiedSince);
	if (ifNoneMatch) headers.set("if-none-match", ifNoneMatch);
	if (ifModifiedSince) headers.set("if-modified-since", ifModifiedSince);
	if (signedOperation) headers.set("accept", DSSE_ENVELOPE_MEDIA_TYPE);
	const metadataBase = (response) => {
		const etag = normalizeHostedCatalogHeader(response.headers.get("etag"));
		const lastModified = normalizeHostedCatalogHeader(response.headers.get("last-modified"));
		return {
			url: url.href,
			status: response.status,
			...etag ? { etag } : {},
			...lastModified ? { lastModified } : {}
		};
	};
	let response;
	let release;
	try {
		const { fetchWithSsrFGuard } = await import("./fetch-guard-CjR_2lxp.js");
		const guarded = await fetchWithSsrFGuard({
			url: url.href,
			fetchImpl: params?.fetchImpl,
			init: {
				method: "GET",
				headers
			},
			requireHttps: true,
			maxRedirects: 2,
			timeoutMs: params?.timeoutMs ?? DEFAULT_HOSTED_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_TIMEOUT_MS,
			policy: { hostnameAllowlist: source.hostnameAllowlist },
			auditContext: "official-external-plugin-catalog-feed"
		});
		response = guarded.response;
		release = guarded.release;
		const base = metadataBase(response);
		if (response.status === 304) return await snapshotOrBundledFallbackResult({
			error: "hosted catalog feed returned HTTP 304",
			snapshotStore,
			url: url.href,
			metadata: base,
			expectedSha256,
			ifNoneMatch,
			ifModifiedSince,
			catalogConfig: params?.catalogConfig,
			requireManifestInstallSourceRef,
			expectedFeedId: source.expectedFeedId,
			verification: source.verification,
			now: currentTime()
		});
		if (!response.ok) return await snapshotOrBundledFallbackResult({
			error: `hosted catalog feed returned HTTP ${response.status}`,
			snapshotStore,
			url: url.href,
			metadata: base,
			expectedSha256,
			ifNoneMatch,
			ifModifiedSince,
			catalogConfig: params?.catalogConfig,
			requireManifestInstallSourceRef,
			expectedFeedId: source.expectedFeedId,
			verification: source.verification,
			now: currentTime()
		});
		if (signedOperation && response.headers.get("content-type")?.split(";", 1)[0]?.trim().toLowerCase() !== DSSE_ENVELOPE_MEDIA_TYPE) return await snapshotOrBundledFallbackResult({
			error: `signed hosted catalog feed must use ${DSSE_ENVELOPE_MEDIA_TYPE}`,
			snapshotStore,
			url: url.href,
			metadata: base,
			expectedSha256,
			ifNoneMatch,
			catalogConfig: params?.catalogConfig,
			requireManifestInstallSourceRef,
			expectedFeedId: source.expectedFeedId,
			verification: source.verification,
			now: currentTime()
		});
		const body = await readHostedCatalogResponseText({
			response,
			maxBytes: params?.maxBytes ?? DEFAULT_HOSTED_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_MAX_BYTES,
			chunkTimeoutMs: params?.chunkTimeoutMs ?? DEFAULT_HOSTED_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_CHUNK_TIMEOUT_MS
		});
		const checksum = sha256Hex(body);
		const metadata = {
			...base,
			checksum
		};
		if (expectedSha256 && expectedSha256 !== checksum) return await snapshotOrBundledFallbackResult({
			error: `hosted catalog feed checksum mismatch: expected ${expectedSha256}`,
			snapshotStore,
			url: url.href,
			metadata,
			expectedSha256,
			ifNoneMatch,
			ifModifiedSince,
			catalogConfig: params?.catalogConfig,
			requireManifestInstallSourceRef,
			expectedFeedId: source.expectedFeedId,
			verification: source.verification,
			now: currentTime()
		});
		const now = currentTime();
		const verifiedAt = now.toISOString();
		const parsed = await parseHostedCatalogFeedBody({
			body,
			expectedFeedId: source.expectedFeedId,
			verification: source.verification,
			verifiedAt,
			now
		}).catch(async (err) => {
			return await snapshotOrBundledFallbackResult({
				error: err,
				snapshotStore,
				url: url.href,
				metadata,
				expectedSha256,
				ifNoneMatch,
				ifModifiedSince,
				catalogConfig: params?.catalogConfig,
				requireManifestInstallSourceRef,
				expectedFeedId: source.expectedFeedId,
				verification: source.verification,
				now
			});
		});
		if ("source" in parsed) return parsed;
		if (snapshotStore && parsed.trust?.mode === "signed") {
			const currentSnapshot = await snapshotStore.read(url.href);
			if (currentSnapshot?.trust?.mode === "signed") {
				const current = currentSnapshot.monotonic?.mode === "signed-feed" ? currentSnapshot.monotonic : (await parseHostedCatalogFeedBody({
					body: currentSnapshot.body,
					expectedFeedId: source.expectedFeedId,
					verification: source.verification,
					verifiedAt: currentSnapshot.trust.verifiedAt,
					allowLegacyBetaEnvelope: true,
					now,
					allowExpired: true,
					allowMissingExpiry: true
				}).catch((err) => {
					if (err instanceof HostedCatalogFeedTimestampError) return { feed: { sequence: err.sequence } };
					throw err;
				})).feed;
				if (isHostedCatalogSignedFeedRollback({
					candidate: parsed.feed,
					current
				})) throw new HostedCatalogSignedFeedMonotonicityError("hosted catalog signed feed sequence is older than current snapshot");
			}
		}
		const entries = filterOfficialExternalPluginCatalogEntriesBySourceRefs(parseOfficialExternalPluginCatalogEntries(parsed.feed), {
			catalogConfig: params?.catalogConfig,
			requireManifestInstallSourceRef
		});
		await snapshotStore?.write({
			body,
			metadata,
			savedAt: verifiedAt,
			...parsed.trust ? { trust: parsed.trust } : {},
			...parsed.trust?.mode === "signed" ? { monotonic: {
				mode: "signed-feed",
				sequence: parsed.feed.sequence,
				generatedAt: parsed.feed.generatedAt
			} } : {}
		}).catch((err) => {
			if (err instanceof HostedCatalogSignedFeedMonotonicityError) throw err;
			if (params?.requireSnapshotWrite) throw new HostedCatalogSnapshotWriteError(err);
		});
		return {
			source: "hosted",
			entries: dedupeOfficialExternalPluginCatalogEntries(entries),
			feed: parsed.feed,
			metadata,
			...parsed.trust ? { trust: parsed.trust } : {}
		};
	} catch (err) {
		if (err instanceof HostedCatalogSnapshotWriteError) throw err.originalError;
		return await snapshotOrBundledFallbackResult({
			error: err,
			snapshotStore,
			url: url.href,
			expectedSha256,
			ifNoneMatch,
			ifModifiedSince,
			catalogConfig: params?.catalogConfig,
			requireManifestInstallSourceRef,
			expectedFeedId: source.expectedFeedId,
			verification: source.verification,
			now: currentTime()
		});
	} finally {
		await cancelUnreadResponseBody(response);
		await release?.().catch(() => void 0);
	}
}
function normalizeDefaultChoice(value) {
	return value === "clawhub" || value === "npm" || value === "local" ? value : void 0;
}
function formatFeedInstallCandidateSpec(candidate) {
	const packageName = normalizeOptionalString(candidate.package);
	if (!packageName) return;
	const version = normalizeOptionalString(candidate.version);
	if (!version || packageName.endsWith(`@${version}`)) return packageName;
	return `${packageName}@${version}`;
}
function getFeedEntryCandidateSourceType(candidate, config) {
	const sourceRef = normalizeOptionalString(candidate.sourceRef);
	if (!sourceRef) return;
	return resolveOfficialExternalPluginCatalogProfileConfig(config).sources[sourceRef]?.type;
}
function getPreferredFeedEntryInstallCandidate(params) {
	const candidates = getFeedEntryInstallCandidates(params.entry).filter((candidate) => Boolean(normalizeOptionalString(candidate.package)));
	return candidates.find((candidate) => normalizeOptionalString(candidate.sourceRef) === DEFAULT_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_CLAWHUB_SOURCE_REF) ?? candidates.find((candidate) => normalizeOptionalString(candidate.sourceRef) === DEFAULT_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_NPM_SOURCE_REF) ?? candidates.find((candidate) => Boolean(getFeedEntryCandidateSourceType(candidate, params.catalogConfig)));
}
function resolveFeedEntryInstallCandidate(params) {
	const candidate = getPreferredFeedEntryInstallCandidate(params);
	if (!candidate) return null;
	const spec = formatFeedInstallCandidateSpec(candidate);
	if (!spec) return null;
	const sourceType = getFeedEntryCandidateSourceType(candidate, params.catalogConfig);
	if (sourceType === "clawhub") {
		const expectedIntegrity = normalizeClawHubSha256ExpectedIntegrity(candidate.integrity);
		return {
			clawhubSpec: `clawhub:${spec}`,
			defaultChoice: "clawhub",
			...expectedIntegrity ? { expectedIntegrity } : {}
		};
	}
	if (sourceType === "npm") {
		const expectedIntegrity = normalizeNpmExpectedIntegrity(candidate.integrity);
		return {
			npmSpec: spec,
			defaultChoice: "npm",
			...expectedIntegrity ? { expectedIntegrity } : {}
		};
	}
	return null;
}
function normalizeClawHubSha256ExpectedIntegrity(value) {
	const integrity = normalizeOptionalString(value);
	return integrity ? normalizeClawHubSha256Integrity(integrity) ?? void 0 : void 0;
}
function normalizeNpmExpectedIntegrity(value) {
	const integrity = normalizeOptionalString(value);
	if (!integrity || !/^[a-z0-9]+-[A-Za-z0-9+/=]+$/i.test(integrity)) return;
	return integrity;
}
/** Returns manifest metadata from an official external catalog entry when present. */
function getOfficialExternalPluginCatalogManifest(entry) {
	const manifest = entry[MANIFEST_KEY];
	return isRecord(manifest) ? manifest : void 0;
}
function resolveOfficialExternalPluginId(entry) {
	const manifest = getOfficialExternalPluginCatalogManifest(entry);
	return normalizeOptionalString(manifest?.plugin?.id) ?? normalizeOptionalString(manifest?.channel?.id) ?? normalizeOptionalString(manifest?.providers?.[0]?.id) ?? normalizeOptionalString(entry.id);
}
/** Returns legacy plugin ids used only for trusted update migrations. */
function resolveOfficialExternalPluginLegacyIds(entry) {
	return uniqueStrings((getOfficialExternalPluginCatalogManifest(entry)?.legacyPluginIds ?? []).map((pluginId) => normalizeOptionalString(pluginId)).filter((pluginId) => Boolean(pluginId)));
}
/** Returns the host-owned setup migration selected for an external channel cutover. */
function resolveOfficialExternalChannelCompatibilityMigration(channelId) {
	return normalizeOptionalString(getOfficialExternalPluginCatalogManifest(getOfficialExternalPluginCatalogEntry(channelId) ?? {})?.channelHostConfig?.compatibilityMigration);
}
function resolveOfficialExternalPluginLookupIds(entry) {
	const manifest = getOfficialExternalPluginCatalogManifest(entry);
	const lookupIds = [normalizeOptionalString(manifest?.plugin?.id), normalizeOptionalString(manifest?.channel?.id)];
	for (const provider of manifest?.providers ?? []) {
		lookupIds.push(normalizeOptionalString(provider.id));
		for (const alias of provider.aliases ?? []) lookupIds.push(normalizeOptionalString(alias));
	}
	return uniqueStrings(lookupIds.filter((value) => Boolean(value)));
}
function resolveOfficialExternalPluginLabel(entry) {
	const manifest = getOfficialExternalPluginCatalogManifest(entry);
	return normalizeOptionalString(manifest?.plugin?.label) ?? normalizeOptionalString(manifest?.channel?.label) ?? normalizeOptionalString(manifest?.providers?.[0]?.name) ?? normalizeOptionalString(entry.title) ?? normalizeOptionalString(entry.name) ?? resolveOfficialExternalPluginId(entry) ?? "plugin";
}
function resolveOfficialExternalPluginInstall(entry, params) {
	const state = normalizeOptionalString(entry.state);
	const publisherTrust = normalizeOptionalString(entry.publisher?.trust);
	if ((state || publisherTrust) && (state !== "available" || publisherTrust !== "official")) return null;
	const install = getOfficialExternalPluginCatalogManifest(entry)?.install;
	const clawhubSpec = normalizeOptionalString(install?.clawhubSpec);
	const manifestNpmSpec = normalizeOptionalString(install?.npmSpec);
	const localPath = normalizeOptionalString(install?.localPath);
	const candidateInstall = resolveFeedEntryInstallCandidate({
		entry,
		catalogConfig: params?.catalogConfig
	});
	if (candidateInstall) return {
		...candidateInstall,
		...install?.minHostVersion ? { minHostVersion: install.minHostVersion } : {},
		...install?.expectedIntegrity && !candidateInstall.expectedIntegrity ? { expectedIntegrity: install.expectedIntegrity } : {},
		...install?.allowInvalidConfigRecovery === true ? { allowInvalidConfigRecovery: true } : {}
	};
	const hasFeedInstallCandidates = getFeedEntryInstallCandidateRecords(entry).length > 0;
	const npmSpec = manifestNpmSpec ?? (hasFeedInstallCandidates ? void 0 : normalizeOptionalString(entry.name));
	const defaultChoice = normalizeDefaultChoice(install?.defaultChoice) ?? (npmSpec ? "npm" : clawhubSpec ? "clawhub" : localPath ? "local" : void 0);
	if (!clawhubSpec && !npmSpec && !localPath) return null;
	return {
		...clawhubSpec ? { clawhubSpec } : {},
		...npmSpec ? { npmSpec } : {},
		...localPath ? { localPath } : {},
		...defaultChoice ? { defaultChoice } : {},
		...install?.minHostVersion ? { minHostVersion: install.minHostVersion } : {},
		...install?.expectedIntegrity ? { expectedIntegrity: install.expectedIntegrity } : {},
		...install?.allowInvalidConfigRecovery === true ? { allowInvalidConfigRecovery: true } : {}
	};
}
async function loadConfiguredHostedOfficialExternalPluginCatalogEntries(params) {
	return await loadHostedOfficialExternalPluginCatalogEntries(params);
}
function listOfficialExternalPluginCatalogEntries() {
	return dedupeOfficialExternalPluginCatalogEntries(bundledOfficialExternalPluginCatalogEntries());
}
/** Returns whether an id is the canonical id of an official external plugin. */
function isOfficialExternalPluginId(pluginId) {
	const normalized = normalizeOptionalString(pluginId)?.toLowerCase();
	if (!normalized) return false;
	return listOfficialExternalPluginCatalogEntries().some((entry) => resolveOfficialExternalPluginId(entry)?.toLowerCase() === normalized);
}
/** Resolves official external plugin owners for configured capability provider ids. */
function resolveOfficialExternalProviderContractPluginIds(params) {
	const configuredProviderIds = new Set([...params.providerIds].map((providerId) => normalizeOptionalString(providerId)?.toLowerCase()).filter((providerId) => Boolean(providerId)));
	if (configuredProviderIds.size === 0) return [];
	const pluginIds = /* @__PURE__ */ new Set();
	for (const entry of listOfficialExternalPluginCatalogEntries()) {
		const pluginId = resolveOfficialExternalPluginId(entry);
		const providerIds = getOfficialExternalPluginCatalogManifest(entry)?.contracts?.[params.contract];
		if (pluginId && providerIds?.some((providerId) => {
			const normalized = normalizeOptionalString(providerId)?.toLowerCase();
			return normalized ? configuredProviderIds.has(normalized) : false;
		})) pluginIds.add(pluginId);
	}
	return [...pluginIds].toSorted((left, right) => left.localeCompare(right));
}
/** Resolves official web provider owners from matching documented environment credentials. */
function resolveOfficialExternalWebProviderContractPluginIdsForEnv(params) {
	const pluginIds = /* @__PURE__ */ new Set();
	for (const entry of listOfficialExternalPluginCatalogEntries()) {
		const pluginId = resolveOfficialExternalPluginId(entry);
		const manifest = getOfficialExternalPluginCatalogManifest(entry);
		const contractProviderIds = new Set((manifest?.contracts?.[params.contract] ?? []).map((providerId) => normalizeOptionalString(providerId)?.toLowerCase()).filter((providerId) => Boolean(providerId)));
		if (pluginId && contractProviderIds.size > 0 && manifest?.webSearchProviders?.some((provider) => {
			const providerId = normalizeOptionalString(provider.id)?.toLowerCase();
			return providerId !== void 0 && contractProviderIds.has(providerId) && provider.envVars?.some((envVar) => Boolean(params.env[envVar]?.trim()));
		})) pluginIds.add(pluginId);
	}
	return [...pluginIds].toSorted((left, right) => left.localeCompare(right));
}
/** Resolves official external plugin owners for configured model provider ids. */
function resolveOfficialExternalProviderPluginIds(params) {
	const configuredProviderIds = new Set([...params.providerIds].map((providerId) => normalizeOptionalString(providerId)?.toLowerCase()).filter((providerId) => Boolean(providerId)));
	if (configuredProviderIds.size === 0) return [];
	const pluginIds = /* @__PURE__ */ new Set();
	for (const entry of listOfficialExternalProviderCatalogEntries()) {
		const pluginId = resolveOfficialExternalPluginId(entry);
		const providers = getOfficialExternalPluginCatalogManifest(entry)?.providers;
		if (pluginId && providers?.some((provider) => [provider.id, ...provider.aliases ?? []].some((providerId) => {
			const normalized = normalizeOptionalString(providerId)?.toLowerCase();
			return normalized ? configuredProviderIds.has(normalized) : false;
		}))) pluginIds.add(pluginId);
	}
	return [...pluginIds].toSorted((left, right) => left.localeCompare(right));
}
/** Resolves official external provider owners with configured environment credentials. */
function resolveOfficialExternalProviderPluginIdsForEnv(env) {
	const pluginIds = /* @__PURE__ */ new Set();
	for (const entry of listOfficialExternalProviderCatalogEntries()) {
		const pluginId = resolveOfficialExternalPluginId(entry);
		const providers = getOfficialExternalPluginCatalogManifest(entry)?.providers;
		if (pluginId && providers?.some((provider) => provider.envVars?.some((envVar) => Boolean(env[envVar]?.trim())))) pluginIds.add(pluginId);
	}
	return [...pluginIds].toSorted((left, right) => left.localeCompare(right));
}
function listOfficialExternalChannelCatalogEntries() {
	return listOfficialExternalPluginCatalogEntries().filter((entry) => Boolean(getOfficialExternalPluginCatalogManifest(entry)?.channel));
}
function listOfficialExternalChannelEnvVars() {
	return listOfficialExternalChannelCatalogEntries().flatMap((entry) => {
		const channel = getOfficialExternalPluginCatalogManifest(entry)?.channel;
		const channelId = normalizeOptionalString(channel?.id)?.toLowerCase();
		const envVars = uniqueStrings([
			...channel?.envVars ?? [],
			...channel?.configuredState?.env?.allOf ?? [],
			...channel?.configuredState?.env?.anyOf ?? []
		].map((envVar) => normalizeOptionalString(envVar)).filter((envVar) => Boolean(envVar)));
		return channelId && envVars.length > 0 ? [{
			channelId,
			envVars
		}] : [];
	});
}
const CHANNEL_SECRET_FIELD_PATTERN = /^[A-Za-z][A-Za-z0-9]*$/;
const CHANNEL_SECRET_ENV_PATTERN = /^[A-Z][A-Z0-9_]*$/;
/** Returns a validated host fallback secret contract for one external channel. */
function getOfficialExternalChannelSecretContract(channelId) {
	const normalizedChannelId = normalizeOptionalString(channelId)?.toLowerCase();
	if (!normalizedChannelId) return;
	const fields = getOfficialExternalPluginCatalogManifest(listOfficialExternalChannelCatalogEntries().find((candidate) => {
		return normalizeOptionalString(getOfficialExternalPluginCatalogManifest(candidate)?.channel?.id)?.toLowerCase() === normalizedChannelId;
	}) ?? {})?.channelSecrets?.fields;
	if (!fields) return;
	const normalizedFields = fields.flatMap((field) => {
		const fieldName = normalizeOptionalString(field.field);
		const activationField = normalizeOptionalString(field.activationField);
		const activationEnv = normalizeOptionalString(field.activationEnv);
		if (!fieldName || !CHANNEL_SECRET_FIELD_PATTERN.test(fieldName) || activationField !== void 0 && !CHANNEL_SECRET_FIELD_PATTERN.test(activationField) || activationEnv !== void 0 && !CHANNEL_SECRET_ENV_PATTERN.test(activationEnv)) return [];
		return [{
			field: fieldName,
			...activationField ? { activationField } : {},
			...activationEnv ? { activationEnv } : {}
		}];
	});
	return normalizedFields.length > 0 ? {
		channelId: normalizedChannelId,
		fields: normalizedFields
	} : void 0;
}
/** Returns trusted host validation clauses for one official external channel. */
function getOfficialExternalChannelHostSchemaAllOf(channelId) {
	const normalizedChannelId = normalizeOptionalString(channelId)?.toLowerCase();
	if (!normalizedChannelId) return [];
	const clauses = getOfficialExternalPluginCatalogManifest(listOfficialExternalChannelCatalogEntries().find((candidate) => {
		return normalizeOptionalString(getOfficialExternalPluginCatalogManifest(candidate)?.channel?.id)?.toLowerCase() === normalizedChannelId;
	}) ?? {})?.channelHostConfig?.schemaAllOf;
	return Array.isArray(clauses) ? clauses.filter(isRecord) : [];
}
function listOfficialExternalProviderCatalogEntries() {
	return listOfficialExternalPluginCatalogEntries().filter((entry) => (getOfficialExternalPluginCatalogManifest(entry)?.providers?.length ?? 0) > 0);
}
function getOfficialExternalPluginCatalogEntry(pluginId) {
	const normalized = pluginId.trim();
	if (!normalized) return;
	return listOfficialExternalPluginCatalogEntries().find((entry) => resolveOfficialExternalPluginLookupIds(entry).includes(normalized));
}
function getOfficialExternalPluginCatalogEntryForPackage(packageName) {
	const normalized = packageName?.trim();
	if (!normalized) return;
	return listOfficialExternalPluginCatalogEntries().find((entry) => normalizeOptionalString(entry.name) === normalized);
}
//#endregion
export { resolveOfficialExternalProviderPluginIdsForEnv as C, resolveOfficialExternalProviderPluginIds as S, resolveOfficialExternalPluginId as _, getOfficialExternalPluginCatalogEntryForPackage as a, resolveOfficialExternalPluginLegacyIds as b, isOfficialExternalPluginCatalogSequence as c, listOfficialExternalChannelEnvVars as d, listOfficialExternalPluginCatalogEntries as f, resolveOfficialExternalChannelCompatibilityMigration as g, parseOfficialExternalPluginCatalogTimestamp as h, getOfficialExternalPluginCatalogEntry as i, isOfficialExternalPluginId as l, loadConfiguredHostedOfficialExternalPluginCatalogEntries as m, getOfficialExternalChannelHostSchemaAllOf as n, getOfficialExternalPluginCatalogManifest as o, listOfficialExternalProviderCatalogEntries as p, getOfficialExternalChannelSecretContract as r, isOfficialExternalPluginCatalogFeed as s, HostedCatalogSignedFeedMonotonicityError as t, listOfficialExternalChannelCatalogEntries as u, resolveOfficialExternalPluginInstall as v, resolveOfficialExternalWebProviderContractPluginIdsForEnv as w, resolveOfficialExternalProviderContractPluginIds as x, resolveOfficialExternalPluginLabel as y };
