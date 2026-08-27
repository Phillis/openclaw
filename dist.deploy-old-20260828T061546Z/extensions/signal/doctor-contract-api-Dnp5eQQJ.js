import { a as isSignalManagedNativeConnectionUrlForBind, c as buildSignalTransportHttpUrl, i as assignSignalManagedNativePort, o as isValidSignalManagedNativePort, r as allocateSignalManagedNativePort, s as resolveLocalSignalTransportPort, u as normalizeSignalTransportUrl } from "./transport-policy-DxvSMHp9.js";
import { isRecord, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { DEFAULT_ACCOUNT_ID, normalizeAccountId } from "openclaw/plugin-sdk/account-resolution";
import { defineChannelAliasMigration } from "openclaw/plugin-sdk/runtime-doctor-migrations";
//#region extensions/signal/src/config-compat.ts
const LEGACY_TRANSPORT_FIELDS = [
	"configPath",
	"httpUrl",
	"httpHost",
	"httpPort",
	"cliPath",
	"autoStart",
	"startupTimeoutMs",
	"receiveMode",
	"ignoreStories"
];
const PENDING_LEGACY_TRANSPORT_WARNING = "- channels.signal: legacy auto transport is ambiguous while its endpoint is unavailable; bring the endpoint online and rerun openclaw doctor --fix, or replace the retired fields with an explicit account-owned transport in openclaw.json.";
const PENDING_LEGACY_INVALID_URL_WARNING = "- channels.signal: legacy httpUrl is invalid; keep the current config, correct httpUrl, then run openclaw doctor --fix.";
const PENDING_LEGACY_INVALID_HOST_WARNING = "- channels.signal: legacy httpHost is invalid; keep the current config, correct httpHost, then run openclaw doctor --fix.";
const PENDING_LEGACY_INVALID_PORT_WARNING = "- channels.signal: legacy httpPort must be an integer between 1 and 65535; correct httpPort, then run openclaw doctor --fix.";
const PENDING_LEGACY_CONTAINER_ACCOUNT_WARNING = "- channels.signal: legacy container transport requires an account number; add channels.signal.account (or the relevant channels.signal.accounts.*.account) and rerun openclaw doctor --fix.";
function isSignalTransportConfig(value) {
	if (!isRecord(value)) return false;
	if (value.kind === "managed-native") {
		if (value.httpPort !== void 0 && !isValidSignalManagedNativePort(value.httpPort)) return false;
		if (value.url === void 0) return true;
		if (typeof value.url !== "string") return false;
		try {
			normalizeSignalTransportUrl(value.url);
			return true;
		} catch {
			return false;
		}
	}
	if (value.kind !== "external-native" && value.kind !== "container" || typeof value.url !== "string") return false;
	try {
		normalizeSignalTransportUrl(value.url);
		return true;
	} catch {
		return false;
	}
}
function inherited(entry, parent, key) {
	return Object.hasOwn(entry, key) ? entry[key] : parent[key];
}
function legacyBaseUrl(entry, parent) {
	const url = normalizeOptionalString(inherited(entry, parent, "httpUrl"));
	if (url) return normalizeSignalTransportUrl(url);
	const host = normalizeOptionalString(inherited(entry, parent, "httpHost")) ?? "127.0.0.1";
	const rawPort = inherited(entry, parent, "httpPort");
	return buildSignalTransportHttpUrl(host, typeof rawPort === "number" ? rawPort : 8080);
}
function hasLegacyFields(entry) {
	return LEGACY_TRANSPORT_FIELDS.some((field) => Object.hasOwn(entry, field));
}
function wasLegacySignalAccountConfigured(entry, parent) {
	return Boolean(normalizeOptionalString(inherited(entry, parent, "account")) || normalizeOptionalString(inherited(entry, parent, "configPath")) || normalizeOptionalString(inherited(entry, parent, "httpUrl")) || normalizeOptionalString(inherited(entry, parent, "httpHost")) || normalizeOptionalString(inherited(entry, parent, "cliPath")) || typeof inherited(entry, parent, "httpPort") === "number" || typeof inherited(entry, parent, "autoStart") === "boolean");
}
function hasInvalidLegacyHttpUrl(entries, parent) {
	return entries.some((entry) => {
		const httpUrl = normalizeOptionalString(inherited(entry, parent, "httpUrl"));
		if (!httpUrl) return false;
		try {
			normalizeSignalTransportUrl(httpUrl);
			return false;
		} catch {
			return true;
		}
	});
}
function findInvalidLegacyDerivedEndpoint(entries, parent) {
	for (const entry of entries) {
		if (normalizeOptionalString(inherited(entry, parent, "httpUrl"))) continue;
		const rawPort = inherited(entry, parent, "httpPort");
		if (rawPort !== void 0 && !isValidSignalManagedNativePort(rawPort)) return "port";
		const host = normalizeOptionalString(inherited(entry, parent, "httpHost")) ?? "127.0.0.1";
		try {
			buildSignalTransportHttpUrl(host, typeof rawPort === "number" ? rawPort : 8080);
		} catch {
			return "host";
		}
	}
}
function hasInvalidManagedTransportPort(transports) {
	return transports.some((transport) => transport?.kind === "managed-native" && transport.httpPort !== void 0 && !isValidSignalManagedNativePort(transport.httpPort));
}
function requiresDetection(entry, parent, apiMode) {
	if (apiMode !== void 0 && apiMode !== "auto") return false;
	return Boolean(normalizeOptionalString(inherited(entry, parent, "httpUrl"))) || !resolveLegacyAutoStart(entry, parent);
}
function resolveLegacyAutoStart(entry, parent) {
	const autoStart = inherited(entry, parent, "autoStart");
	if (typeof autoStart === "boolean") return autoStart;
	return !normalizeOptionalString(inherited(entry, parent, "httpUrl"));
}
function resolveManagedConnectionUrl(entry, parent) {
	const httpUrl = normalizeOptionalString(inherited(entry, parent, "httpUrl"));
	if (!httpUrl) return;
	const normalizedUrl = normalizeSignalTransportUrl(httpUrl);
	const endpoint = new URL(normalizedUrl);
	const bindHost = (normalizeOptionalString(inherited(entry, parent, "httpHost")) ?? "127.0.0.1").replace(/^\[|\]$/g, "").toLowerCase();
	const rawBindPort = inherited(entry, parent, "httpPort");
	const bindPort = typeof rawBindPort === "number" ? rawBindPort : 8080;
	const endpointHost = endpoint.hostname.replace(/^\[|\]$/g, "").toLowerCase();
	const endpointPort = endpoint.port ? Number.parseInt(endpoint.port, 10) : endpoint.protocol === "https:" ? 443 : 80;
	return endpoint.protocol === "http:" && endpointHost === bindHost && endpointPort === bindPort ? void 0 : normalizedUrl;
}
function buildManagedNativeTransport(entry, parent) {
	const value = (key) => inherited(entry, parent, key);
	const configPath = normalizeOptionalString(value("configPath"));
	const cliPath = normalizeOptionalString(value("cliPath"));
	const url = resolveManagedConnectionUrl(entry, parent);
	const httpHost = normalizeOptionalString(value("httpHost"));
	const httpPort = value("httpPort");
	const startupTimeoutMs = value("startupTimeoutMs");
	const receiveMode = value("receiveMode");
	const ignoreStories = value("ignoreStories");
	return {
		kind: "managed-native",
		...configPath ? { configPath } : {},
		...cliPath ? { cliPath } : {},
		...url ? { url } : {},
		...httpHost ? { httpHost } : {},
		...typeof httpPort === "number" ? { httpPort } : {},
		...typeof startupTimeoutMs === "number" ? { startupTimeoutMs } : {},
		...receiveMode === "on-start" || receiveMode === "manual" ? { receiveMode } : {},
		...typeof ignoreStories === "boolean" ? { ignoreStories } : {}
	};
}
function resolveLegacyTransportWithoutDetection(params) {
	if (isSignalTransportConfig(params.entry.transport)) return params.entry.transport;
	const baseUrl = legacyBaseUrl(params.entry, params.parent);
	const autoStart = inherited(params.entry, params.parent, "autoStart");
	if (params.apiMode === "container") return {
		kind: "container",
		url: baseUrl
	};
	if (params.apiMode === "native") return resolveLegacyAutoStart(params.entry, params.parent) ? buildManagedNativeTransport(params.entry, params.parent) : {
		kind: "external-native",
		url: baseUrl
	};
	if (requiresDetection(params.entry, params.parent, params.apiMode)) return;
	if (autoStart === false) return {
		kind: "external-native",
		url: baseUrl
	};
	return buildManagedNativeTransport(params.entry, params.parent);
}
async function resolveLegacyTransport(params) {
	const resolved = resolveLegacyTransportWithoutDetection(params);
	if (resolved) return resolved;
	const account = normalizeOptionalString(inherited(params.entry, params.parent, "account"));
	try {
		const detected = await params.detect?.({
			url: legacyBaseUrl(params.entry, params.parent),
			...account ? { account } : {}
		});
		if (detected?.kind === "external-native" && resolveLegacyAutoStart(params.entry, params.parent)) return buildManagedNativeTransport(params.entry, params.parent);
		return detected;
	} catch {
		if (resolveLegacyAutoStart(params.entry, params.parent)) return buildManagedNativeTransport(params.entry, params.parent);
		return;
	}
}
function clearLegacyTransportFields(entry) {
	for (const field of LEGACY_TRANSPORT_FIELDS) delete entry[field];
}
function hasRootSignalAccount(entries) {
	const root = entries[0];
	return entries.length === 1 || Boolean(normalizeOptionalString(root?.account)) || isSignalTransportConfig(root?.transport);
}
function signalAccountIds(entries) {
	const accounts = isRecord(entries[0]?.accounts) ? entries[0].accounts : {};
	return Object.entries(accounts).filter(([, entry]) => isRecord(entry)).map(([accountId]) => accountId);
}
function isDefaultSignalAccountId(accountId) {
	return Boolean(accountId?.trim()) && normalizeAccountId(accountId) === DEFAULT_ACCOUNT_ID;
}
function resolveSignalAccountKey(accounts, accountId) {
	const normalizedAccountId = normalizeAccountId(accountId);
	return Object.keys(accounts).find((key) => Boolean(key.trim()) && normalizeAccountId(key) === normalizedAccountId);
}
function nestedDefaultOwnsEffectiveTransport(entries) {
	const accounts = isRecord(entries[0]?.accounts) ? entries[0].accounts : {};
	const nestedDefaultKey = resolveSignalAccountKey(accounts, DEFAULT_ACCOUNT_ID);
	const nestedDefault = nestedDefaultKey ? accounts[nestedDefaultKey] : void 0;
	return isRecord(nestedDefault) && (isSignalTransportConfig(nestedDefault.transport) || hasLegacyFields(nestedDefault));
}
function isDiscardedTransportEntry(entries, index) {
	if (index === 0) return !hasRootSignalAccount(entries) || nestedDefaultOwnsEffectiveTransport(entries);
	return isDefaultSignalAccountId(signalAccountIds(entries)[index - 1]) && isSignalTransportConfig(entries[0]?.transport);
}
function shouldMaterializeTransport(entries, index) {
	if (isDiscardedTransportEntry(entries, index)) return false;
	const entry = entries[index];
	const parent = entries[0];
	return Boolean(entry && parent && (isSignalTransportConfig(entry.transport) || wasLegacySignalAccountConfigured(entry, parent)));
}
function clearLegacySignalTransportFieldsForAccount(params) {
	const next = structuredClone(params.cfg);
	const signal = next.channels?.signal;
	if (!isRecord(signal)) return next;
	if (isDefaultSignalAccountId(params.accountId)) {
		clearLegacyTransportFields(signal);
		delete signal.apiMode;
		const accounts = isRecord(signal.accounts) ? signal.accounts : void 0;
		const nestedDefaultKey = accounts ? resolveSignalAccountKey(accounts, DEFAULT_ACCOUNT_ID) : void 0;
		const nestedDefault = nestedDefaultKey ? accounts?.[nestedDefaultKey] : void 0;
		if (isRecord(nestedDefault)) {
			clearLegacyTransportFields(nestedDefault);
			delete nestedDefault.transport;
		}
		return next;
	}
	const accounts = isRecord(signal.accounts) ? signal.accounts : void 0;
	const accountKey = accounts ? resolveSignalAccountKey(accounts, params.accountId) : void 0;
	const account = accountKey ? accounts?.[accountKey] : void 0;
	if (isRecord(account)) clearLegacyTransportFields(account);
	return next;
}
function allocateMigratedManagedPorts(params) {
	const reservedPorts = /* @__PURE__ */ new Set();
	const rootIsAccount = hasRootSignalAccount(params.entries);
	const nestedDefaultOffset = signalAccountIds(params.entries).findIndex((accountId) => isDefaultSignalAccountId(accountId));
	const canonicalDefaultIndex = isSignalTransportConfig(params.entries[0]?.transport) ? 0 : nestedDefaultOffset >= 0 ? nestedDefaultOffset + 1 : rootIsAccount ? 0 : void 0;
	for (const [index, transport] of params.transports.entries()) {
		if (!transport || index === 0 && canonicalDefaultIndex !== 0) continue;
		if (transport.kind !== "managed-native") {
			const localPort = resolveLocalSignalTransportPort(transport.url);
			if (localPort !== void 0) reservedPorts.add(localPort);
			continue;
		}
		if (transport.url && !isSignalManagedNativeConnectionUrlForBind(transport)) {
			const localConnectionPort = resolveLocalSignalTransportPort(transport.url);
			if (localConnectionPort !== void 0) reservedPorts.add(localConnectionPort);
		}
		if (index === canonicalDefaultIndex || isRecord(params.entries[index]?.transport)) reservedPorts.add(transport.httpPort ?? 8080);
	}
	return params.transports.map((transport, index) => {
		if (!transport || index === 0 && canonicalDefaultIndex !== 0) return transport;
		if (transport.kind !== "managed-native") return transport;
		if (isRecord(params.entries[index]?.transport) || index === canonicalDefaultIndex) return transport;
		const rawPreferredPort = params.entries[index]?.httpPort;
		const preferredPort = typeof rawPreferredPort === "number" ? rawPreferredPort : transport.httpPort;
		const httpPort = allocateSignalManagedNativePort({
			reservedPorts,
			...typeof preferredPort === "number" ? { preferredPort } : {}
		});
		reservedPorts.add(httpPort);
		return assignSignalManagedNativePort(transport, httpPort);
	});
}
function applyMigratedSignalTransports(params) {
	const next = structuredClone(params.cfg);
	const nextSignal = next.channels?.signal;
	if (!isRecord(nextSignal)) return;
	const accountIds = signalAccountIds(params.entries);
	const nextAccounts = isRecord(nextSignal.accounts) ? nextSignal.accounts : {};
	const nextEntries = [nextSignal, ...Object.values(nextAccounts).filter(isRecord)];
	const rootIsAccount = hasRootSignalAccount(params.entries);
	const canonicalRootTransport = isSignalTransportConfig(params.entries[0]?.transport) ? params.entries[0].transport : void 0;
	for (const [index, entry] of nextEntries.entries()) {
		if (isDefaultSignalAccountId(index === 0 ? void 0 : accountIds[index - 1])) {
			const defaultTransport = canonicalRootTransport ?? params.transports[index];
			if (defaultTransport) nextSignal.transport = defaultTransport;
			else delete nextSignal.transport;
			delete entry.transport;
		} else if (index === 0 && !rootIsAccount) delete entry.transport;
		else if (params.transports[index]) entry.transport = params.transports[index];
		else delete entry.transport;
		clearLegacyTransportFields(entry);
	}
	delete nextSignal.apiMode;
	return next;
}
function hasContainerTransportWithoutEffectiveAccount(cfg) {
	const signal = cfg.channels?.signal;
	if (!isRecord(signal)) return false;
	const accounts = isRecord(signal.accounts) ? signal.accounts : {};
	const rootTransport = isSignalTransportConfig(signal.transport) ? signal.transport : void 0;
	const defaultKey = resolveSignalAccountKey(accounts, DEFAULT_ACCOUNT_ID);
	const defaultEntry = defaultKey ? accounts[defaultKey] : void 0;
	const defaultAccount = isRecord(defaultEntry) && defaultEntry.account !== void 0 ? normalizeOptionalString(defaultEntry.account) : normalizeOptionalString(signal.account);
	const channelEnabled = signal.enabled !== false;
	const defaultEnabled = !isRecord(defaultEntry) || defaultEntry.enabled !== false;
	if (rootTransport?.kind === "container" && channelEnabled && defaultEnabled && !defaultAccount) return true;
	for (const [accountId, entry] of Object.entries(accounts)) {
		if (!isRecord(entry)) continue;
		if (!channelEnabled || entry.enabled === false) continue;
		const isDefaultAccount = isDefaultSignalAccountId(accountId);
		if ((isDefaultAccount && rootTransport ? rootTransport : isSignalTransportConfig(entry.transport) ? entry.transport : void 0)?.kind !== "container" || isDefaultAccount && rootTransport) continue;
		if (!(entry.account === void 0 ? normalizeOptionalString(signal.account) : normalizeOptionalString(entry.account))) return true;
	}
	return false;
}
async function migrateLegacySignalTransportConfig(params) {
	const signal = params.cfg.channels?.signal;
	if (!isRecord(signal)) return {
		config: params.cfg,
		changes: []
	};
	const accounts = isRecord(signal.accounts) ? signal.accounts : {};
	if (!(Object.hasOwn(signal, "apiMode") || hasLegacyFields(signal) || Object.values(accounts).some((entry) => isRecord(entry) && hasLegacyFields(entry)))) return {
		config: params.cfg,
		changes: []
	};
	const apiMode = signal.apiMode;
	const entries = [signal, ...Object.values(accounts).filter(isRecord)];
	const legacyResolutionEntries = entries.filter((_, index) => shouldMaterializeTransport(entries, index)).filter((entry) => !isSignalTransportConfig(entry.transport));
	const invalidDerivedEndpoint = findInvalidLegacyDerivedEndpoint(legacyResolutionEntries, signal);
	if (invalidDerivedEndpoint) return {
		config: params.cfg,
		changes: [],
		warnings: [invalidDerivedEndpoint === "port" ? PENDING_LEGACY_INVALID_PORT_WARNING : PENDING_LEGACY_INVALID_HOST_WARNING]
	};
	if (hasInvalidLegacyHttpUrl(legacyResolutionEntries, signal)) return {
		config: params.cfg,
		changes: [],
		warnings: [PENDING_LEGACY_INVALID_URL_WARNING]
	};
	if (!params.detect && legacyResolutionEntries.some((entry) => requiresDetection(entry, signal, apiMode))) return {
		config: params.cfg,
		changes: [],
		warnings: [PENDING_LEGACY_TRANSPORT_WARNING]
	};
	const resolvedTransports = await Promise.all(entries.map(async (entry, index) => !shouldMaterializeTransport(entries, index) ? void 0 : await resolveLegacyTransport({
		entry,
		parent: signal,
		apiMode,
		detect: params.detect
	})));
	if (hasInvalidManagedTransportPort(resolvedTransports)) return {
		config: params.cfg,
		changes: [],
		warnings: [PENDING_LEGACY_INVALID_PORT_WARNING]
	};
	const transports = allocateMigratedManagedPorts({
		entries,
		transports: resolvedTransports
	});
	if (transports.some((transport, index) => shouldMaterializeTransport(entries, index) && !transport)) return {
		config: params.cfg,
		changes: [],
		warnings: [PENDING_LEGACY_TRANSPORT_WARNING]
	};
	const next = applyMigratedSignalTransports({
		cfg: params.cfg,
		entries,
		transports
	});
	if (!next) return {
		config: params.cfg,
		changes: []
	};
	if (hasContainerTransportWithoutEffectiveAccount(next)) return {
		config: params.cfg,
		changes: [],
		warnings: [PENDING_LEGACY_CONTAINER_ACCOUNT_WARNING]
	};
	return {
		config: next,
		changes: ["Migrated channels.signal transport settings to concrete account-owned transport objects."]
	};
}
function migrateLegacySignalTransportConfigSync(cfg) {
	const signal = cfg.channels?.signal;
	if (!isRecord(signal)) return {
		config: cfg,
		changes: []
	};
	const accounts = isRecord(signal.accounts) ? signal.accounts : {};
	if (!(Object.hasOwn(signal, "apiMode") || hasLegacyFields(signal) || Object.values(accounts).some((entry) => isRecord(entry) && hasLegacyFields(entry)))) return {
		config: cfg,
		changes: []
	};
	const entries = [signal, ...Object.values(accounts).filter(isRecord)];
	const legacyResolutionEntries = entries.filter((_, index) => shouldMaterializeTransport(entries, index)).filter((entry) => !isSignalTransportConfig(entry.transport));
	const invalidDerivedEndpoint = findInvalidLegacyDerivedEndpoint(legacyResolutionEntries, signal);
	if (invalidDerivedEndpoint) return {
		config: cfg,
		changes: [],
		warnings: [invalidDerivedEndpoint === "port" ? PENDING_LEGACY_INVALID_PORT_WARNING : PENDING_LEGACY_INVALID_HOST_WARNING]
	};
	if (hasInvalidLegacyHttpUrl(legacyResolutionEntries, signal)) return {
		config: cfg,
		changes: [],
		warnings: [PENDING_LEGACY_INVALID_URL_WARNING]
	};
	const resolvedTransports = entries.map((entry, index) => {
		if (!shouldMaterializeTransport(entries, index)) return;
		return resolveLegacyTransportWithoutDetection({
			entry,
			parent: signal,
			apiMode: signal.apiMode
		});
	});
	if (hasInvalidManagedTransportPort(resolvedTransports)) return {
		config: cfg,
		changes: [],
		warnings: [PENDING_LEGACY_INVALID_PORT_WARNING]
	};
	const transports = allocateMigratedManagedPorts({
		entries,
		transports: resolvedTransports
	});
	if (transports.some((transport, index) => shouldMaterializeTransport(entries, index) && !transport)) return {
		config: cfg,
		changes: [],
		warnings: [PENDING_LEGACY_TRANSPORT_WARNING]
	};
	const next = applyMigratedSignalTransports({
		cfg,
		entries,
		transports
	});
	if (!next) return {
		config: cfg,
		changes: []
	};
	if (hasContainerTransportWithoutEffectiveAccount(next)) return {
		config: cfg,
		changes: [],
		warnings: [PENDING_LEGACY_CONTAINER_ACCOUNT_WARNING]
	};
	return {
		config: next,
		changes: ["Migrated channels.signal transport settings to concrete account-owned transport objects."]
	};
}
//#endregion
//#region extensions/signal/doctor-contract-api.ts
const RETIRED_SIGNAL_ACCOUNT_TRANSPORT_FIELDS = [
	"configPath",
	"httpUrl",
	"httpHost",
	"httpPort",
	"cliPath",
	"autoStart",
	"startupTimeoutMs",
	"receiveMode",
	"ignoreStories"
];
function hasRetiredSignalAccountTransportFields(value) {
	return isRecord(value) && RETIRED_SIGNAL_ACCOUNT_TRANSPORT_FIELDS.some((field) => Object.hasOwn(value, field));
}
function hasRetiredSignalAccountMapTransportFields(value) {
	return isRecord(value) && Object.values(value).some(hasRetiredSignalAccountTransportFields);
}
const streamingAliasMigration = defineChannelAliasMigration({
	channelId: "signal",
	streaming: {
		defaultMode: "partial",
		deliveryOnly: true
	},
	accountStreamingReplacesRoot: true
});
const legacyConfigRules = [
	...streamingAliasMigration.legacyConfigRules,
	{
		path: ["channels", "signal"],
		message: "Signal transport config is now account-owned; run \"openclaw doctor --fix\" to migrate retired channels.signal transport fields.",
		match: (value) => isRecord(value) && (Object.hasOwn(value, "apiMode") || hasRetiredSignalAccountTransportFields(value))
	},
	{
		path: [
			"channels",
			"signal",
			"accounts"
		],
		message: "Signal transport config is now account-owned; run \"openclaw doctor --fix\" to migrate retired per-account transport fields.",
		match: hasRetiredSignalAccountMapTransportFields
	}
];
function normalizeCompatibilityConfig({ cfg }) {
	const streaming = streamingAliasMigration.normalizeChannelConfig({ cfg });
	const transport = migrateLegacySignalTransportConfigSync(streaming.config);
	return {
		config: transport.config,
		changes: [...streaming.changes, ...transport.changes],
		...transport.warnings?.length ? { warnings: transport.warnings } : {}
	};
}
//#endregion
export { migrateLegacySignalTransportConfig as i, normalizeCompatibilityConfig as n, clearLegacySignalTransportFieldsForAccount as r, legacyConfigRules as t };
