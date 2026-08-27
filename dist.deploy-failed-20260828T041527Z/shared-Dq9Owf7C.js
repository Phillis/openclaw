import { w as parseStrictPositiveInteger, x as parseStrictFiniteNumber } from "./number-coercion-CLj0HTDM.js";
import { a as writeRuntimeJson, r as defaultRuntime } from "./runtime-LRpY2Icg.js";
import "./agent-scope-DigoIwHb.js";
import { d as resolveAgentOperationAgentId, l as resolveAgentDir, m as resolveConfiguredAgentId } from "./agent-scope-config-CUBiGmG3.js";
import { n as getRuntimeConfig } from "./io-ClLVsBMp.js";
import { t as getProviderEnvVars } from "./provider-env-vars-CHIRS9qE.js";
import { T as setRuntimeConfigSnapshot, c as getRuntimeConfigSourceSnapshot } from "./runtime-snapshot-Cv5MaU8U.js";
import "./config-B_0xOnKq.js";
import { n as inheritOptionFromParent } from "./command-options-BDuSHeWG.js";
import { n as parseTimeoutMsWithFallback } from "./parse-timeout-BhPKqfrV.js";
import { n as listProfilesForProvider } from "./profile-list-CFe_FbXc.js";
import { d as loadAuthProfileStoreForRuntime } from "./store-C6iqqcJy.js";
import "./auth-profiles-wr_j3m1O.js";
import { t as resolveCommandConfigWithSecrets } from "./command-config-resolution-oMbLdJph.js";
//#region src/cli/capability-cli/shared.ts
function resolveTransport(opts) {
	if (opts.local && opts.gateway) throw new Error("Pass only one of --local or --gateway.");
	if (opts.local) {
		if (!opts.supported.includes("local")) throw new Error("This command does not support --local.");
		return "local";
	}
	if (opts.gateway) {
		if (!opts.supported.includes("gateway")) throw new Error("This command does not support --gateway.");
		return "gateway";
	}
	return opts.defaultTransport;
}
function emitJsonOrText(runtime, json, value, textFormatter) {
	if (json) {
		writeRuntimeJson(runtime, value);
		return;
	}
	runtime.log(textFormatter(value));
}
function formatEnvelopeForText(value) {
	const envelope = value;
	if (!envelope.ok) return `${envelope.capability} failed: ${envelope.error ?? "unknown error"}`;
	const lines = [
		`${envelope.capability} via ${envelope.transport}`,
		...envelope.provider ? [`provider: ${envelope.provider}`] : [],
		...envelope.model ? [`model: ${envelope.model}`] : [],
		...envelope.ignoredOverrides && envelope.ignoredOverrides.length > 0 ? [`ignoredOverrides: ${JSON.stringify(envelope.ignoredOverrides)}`] : [],
		`outputs: ${String(envelope.outputs.length)}`
	];
	for (const output of envelope.outputs) {
		const pathValue = typeof output.path === "string" ? output.path : void 0;
		const textValue = typeof output.text === "string" ? output.text : void 0;
		if (pathValue || textValue) lines.push(...[pathValue, textValue].filter((entry) => Boolean(entry)));
		else lines.push(JSON.stringify(output));
	}
	return lines.join("\n");
}
function providerSummaryText(value) {
	return value.map((entry) => JSON.stringify(entry)).join("\n") || "No results found.";
}
function hasOwnKeys(value) {
	return Boolean(value && typeof value === "object" && Object.keys(value).length > 0);
}
function resolveSelectedProviderFromModelRef(modelRef) {
	return resolveModelRefOverride(modelRef).provider;
}
function resolveCapabilityProviderAgentId(cfg, rawAgentId, surface = "inference provider inspection") {
	const requestedAgentId = rawAgentId?.trim();
	if (rawAgentId !== void 0 && !requestedAgentId) throw new Error("--agent must not be blank");
	return resolveConfiguredAgentId(cfg, resolveAgentOperationAgentId(cfg, requestedAgentId, {
		surface,
		hint: "Pass --agent <id> or set agents.defaults.systemAgent.agentId."
	}));
}
function resolveCapabilityAgentOption(command, rawAgentId) {
	return typeof rawAgentId === "string" ? rawAgentId : inheritOptionFromParent(command, "agent");
}
function getAuthProfileIdsForProvider(cfg, providerId, agentId) {
	return listProfilesForProvider(loadAuthProfileStoreForRuntime(resolveAgentDir(cfg, agentId)), providerId);
}
function providerHasGenericConfig(params) {
	const modelsProviders = params.cfg.models?.providers ?? {};
	const pluginEntries = params.cfg.plugins?.entries ?? {};
	const ttsProviders = params.cfg.tts?.providers ?? {};
	const envConfigured = (params.envVars ?? getProviderEnvVars(params.providerId, {
		config: params.cfg,
		includeUntrustedWorkspacePlugins: false
	})).some((envVar) => Boolean(process.env[envVar]?.trim()));
	return (params.agentId ? getAuthProfileIdsForProvider(params.cfg, params.providerId, params.agentId).length > 0 : false) || hasOwnKeys(modelsProviders[params.providerId]) || hasOwnKeys(pluginEntries[params.providerId]?.config) || hasOwnKeys(ttsProviders[params.providerId]) || envConfigured;
}
function resolveModelRefOverride(raw) {
	const trimmed = raw?.trim();
	if (!trimmed) return {};
	const slash = trimmed.indexOf("/");
	if (slash <= 0 || slash === trimmed.length - 1) return { model: trimmed };
	return {
		provider: trimmed.slice(0, slash),
		model: trimmed.slice(slash + 1)
	};
}
function requireProviderModelOverride(raw) {
	const resolved = resolveModelRefOverride(raw);
	if (!raw?.trim()) return;
	if (!resolved.provider || !resolved.model) throw new Error("Model overrides must use the form <provider/model>.");
	return {
		provider: resolved.provider,
		model: resolved.model
	};
}
function parseOptionalFiniteNumber(raw, label) {
	if (raw === void 0 || typeof raw === "string" && raw.trim() === "") return;
	const value = parseStrictFiniteNumber(raw);
	if (value === void 0) throw new Error(`${label} must be a finite number`);
	return value;
}
function parseOptionalPositiveInteger(raw, label) {
	if (raw === void 0 || typeof raw === "string" && raw.trim() === "") return;
	const value = parseStrictPositiveInteger(raw);
	if (value === void 0) throw new Error(`${label} must be a positive integer`);
	return value;
}
function parseOptionalTimeoutMs(raw) {
	if (raw === void 0 || typeof raw === "string" && raw.trim() === "") return;
	return parseTimeoutMsWithFallback(raw, 0, { invalidType: "error" });
}
async function resolveLocalCapabilityRuntimeConfig(params) {
	const { effectiveConfig } = await resolveCommandConfigWithSecrets({
		config: params.config ?? getRuntimeConfig(),
		commandName: params.commandName,
		targetIds: params.targetIds,
		...params.allowedPaths ? { allowedPaths: params.allowedPaths } : {},
		...params.forcedActivePaths ? { forcedActivePaths: params.forcedActivePaths } : {},
		...params.optionalActivePaths ? { optionalActivePaths: params.optionalActivePaths } : {},
		runtime: defaultRuntime,
		autoEnable: true
	});
	pinRuntimeConfigSnapshot(effectiveConfig);
	return effectiveConfig;
}
function pinRuntimeConfigSnapshot(config) {
	const sourceConfig = getRuntimeConfigSourceSnapshot();
	if (sourceConfig) setRuntimeConfigSnapshot(config, sourceConfig);
	else setRuntimeConfigSnapshot(config);
}
//#endregion
export { parseOptionalTimeoutMs as a, providerSummaryText as c, resolveCapabilityProviderAgentId as d, resolveLocalCapabilityRuntimeConfig as f, resolveTransport as h, parseOptionalPositiveInteger as i, requireProviderModelOverride as l, resolveSelectedProviderFromModelRef as m, formatEnvelopeForText as n, pinRuntimeConfigSnapshot as o, resolveModelRefOverride as p, parseOptionalFiniteNumber as r, providerHasGenericConfig as s, emitJsonOrText as t, resolveCapabilityAgentOption as u };
