import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { n as hasSensitiveUrlHintTag, o as redactSensitiveUrlLikeString, r as isSensitiveUrlConfigPath } from "./redact-sensitive-url-BN1NZvXG.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { r as parseConcreteConfigPath } from "./dot-path-BOSboevO.js";
import { c as resolveUserPath } from "./home-dir-BFvskzn8.js";
import { m as shortenHomePath } from "./utils-Bw16L5tB.js";
import "./types.secrets-Bre8L6Ts.js";
import { r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
import { n as normalizeAgentId, r as normalizeAgentIdStrict } from "./agent-id-CeT3w4ap.js";
import { b as tryResolveAmbientOwnerAgentId } from "./agent-scope-config-CUBiGmG3.js";
import { a as buildAgentMainSessionKey } from "./session-key-Dbce_H9p.js";
import { J as collectChannelSchemaMetadataCore, Y as collectPluginSchemaMetadataCore } from "./io-DlN5njvP.js";
import { l as isValidSecretRef } from "./ref-contract-BHWY70rN.js";
import { t as normalizePluginPolicyId } from "./plugin-policy-id-4QxPdFqy.js";
import { t as CHANNEL_IDS } from "./ids-Cgp0iV_A.js";
import { n as getCurrentPluginMetadataSnapshot } from "./current-plugin-metadata-snapshot-CKAJM6x9.js";
import { a as getRuntimeConfigSnapshot } from "./runtime-snapshot-Cv5MaU8U.js";
import { t as isSensitiveConfigPath } from "./sensitive-paths-uMRji-4g.js";
import { S as findWildcardHintMatch } from "./zod-schema-AsvAsngV.js";
import { n as ChannelsSchema } from "./zod-schema.channels-config-D6JdoD4u.js";
import { r as isReservedSystemAgentId } from "./agent-id-DC26pYcR.js";
import { n as redactConfigObject, t as REDACTED_SENTINEL } from "./redact-snapshot-Cc1aNUFV.js";
import { n as t } from "./i18n-BQpjgFU-.js";
import { i as appendSystemAgentAuditEntry, r as SYSTEM_AGENT_AUDIT_STORE_LABEL } from "./audit-C7t95Ufg.js";
import { s as parseConfigSetValue } from "./config-cli-path-5PvjHNq2.js";
import { i as isKernelOwnedChannelConfigKey, n as classifyConfigSchemaPathSegment, t as buildConfigSchemaCore } from "./schema-DoXi-GPm.js";
import { i as sameDefaultInferenceRoute, n as projectInferenceRoute, t as projectDefaultInferenceRoute } from "./inference-route-B3bBax5n.js";
import { r as isOpenClawTrustedPluginInstallSpec } from "./install-provenance-BsWbYkyF.js";
//#region src/system-agent/config-redaction.ts
const baseConfigSchema = buildConfigSchemaCore();
const SENSITIVE_CONFIG_CONTAINER_KEYS = /* @__PURE__ */ new Set(["env", "headers"]);
function collectUiHintPaths(uiHints, accept) {
	return Object.entries(uiHints).flatMap(([path, hint]) => {
		if (!path) return [];
		const parts = splitConfigHintPath(path);
		return accept(hint, parts) ? [parts] : [];
	});
}
const baseConfigRedactionMetadata = {
	schema: baseConfigSchema,
	uiHints: baseConfigSchema.uiHints,
	sensitiveHintPaths: collectUiHintPaths(baseConfigSchema.uiHints, (hint) => hint.sensitive === true || hasSensitiveUrlHintTag(hint)),
	wildcardHintPaths: collectUiHintPaths(baseConfigSchema.uiHints, (_hint, parts) => parts.includes("*")),
	pluginIds: /* @__PURE__ */ new Set(),
	channelIds: new Set(CHANNEL_IDS)
};
const invalidConfigRedactionMetadata = {
	...baseConfigRedactionMetadata,
	channelIds: /* @__PURE__ */ new Set()
};
const metadataConfigRedaction = /* @__PURE__ */ new WeakMap();
function resolveMetadataConfigRedaction(snapshot) {
	const cached = metadataConfigRedaction.get(snapshot);
	if (cached) return cached;
	const plugins = collectPluginSchemaMetadataCore(snapshot.manifestRegistry);
	const channels = collectChannelSchemaMetadataCore(snapshot.manifestRegistry);
	const schema = buildConfigSchemaCore({
		plugins,
		channels
	});
	const uiHints = schema.uiHints;
	const metadata = {
		schema,
		uiHints,
		sensitiveHintPaths: collectUiHintPaths(uiHints, (hint) => hint.sensitive === true || hasSensitiveUrlHintTag(hint)),
		wildcardHintPaths: collectUiHintPaths(uiHints, (_hint, parts) => parts.includes("*")),
		pluginIds: new Set(plugins.filter((plugin) => plugin.configSchema !== void 0).map((plugin) => normalizePluginPolicyId(plugin.id))),
		channelIds: /* @__PURE__ */ new Set([...CHANNEL_IDS, ...channels.filter((channel) => channel.configSchema !== void 0).map((channel) => channel.id)])
	};
	metadataConfigRedaction.set(snapshot, metadata);
	return metadata;
}
function resolveSystemAgentConfigRedactionMetadata(source) {
	if (source?.valid === false) return invalidConfigRedactionMetadata;
	const config = source?.config ?? getRuntimeConfigSnapshot();
	if (!config) {
		const snapshot = getCurrentPluginMetadataSnapshot({
			env: process.env,
			allowWorkspaceScopedSnapshot: true,
			requireDefaultDiscoveryContext: true
		});
		return snapshot ? resolveMetadataConfigRedaction(snapshot) : baseConfigRedactionMetadata;
	}
	const snapshot = getCurrentPluginMetadataSnapshot({
		config,
		env: process.env,
		allowWorkspaceScopedSnapshot: true
	});
	return snapshot ? resolveMetadataConfigRedaction(snapshot) : baseConfigRedactionMetadata;
}
function splitConfigHintPath(path) {
	return parseConcreteConfigPath(path.replace(/\[\]/g, "[*]"));
}
function resolveConfigUiHint(path, uiHints, includeAncestors = false, acceptHint) {
	return findWildcardHintMatch({
		uiHints,
		path: path.join("."),
		targetParts: path,
		splitPath: splitConfigHintPath,
		includeAncestors,
		acceptHint
	})?.hint ?? void 0;
}
function isUnknownDynamicOwnerPath(path, metadata) {
	const pluginId = path[2];
	if (path[0] === "plugins" && path[1] === "entries" && pluginId && path[3] === "config") return !metadata.pluginIds.has(normalizePluginPolicyId(pluginId));
	const channelId = path[1];
	if (path[0] === "channels" && channelId) return !(isKernelOwnedChannelConfigKey(channelId) || metadata.channelIds.has(channelId));
	return false;
}
function isDynamicOwnerIdSegment(path, index) {
	return path[0] === "channels" && index === 1 || path[0] === "plugins" && path[1] === "entries" && index === 2;
}
function hasSensitiveHintSegmentPrefix(path, index, metadata) {
	const segment = path[index];
	if (segment === void 0) return false;
	for (let end = 1; end < segment.length; end += 1) {
		const prefixPath = [...path.slice(0, index), segment.slice(0, end)];
		if (metadata.sensitiveHintPaths.some((hintPath) => matchesHintPath(hintPath, prefixPath))) return true;
	}
	return false;
}
function isKernelPassthroughSegment(path, index) {
	return path[0] === "hooks" && path[1] === "entries" && (index === 2 || index === 3) || path[0] === "talk" && path[1] === "providers" && (index === 2 || index === 3);
}
function isSchemaDynamicSegment(path, index, metadata) {
	if (path[0] === "channels" && path[1] === "modelByChannel" && (index === 2 || index === 3)) return true;
	if (isKernelPassthroughSegment(path, index)) return !hasSensitiveHintSegmentPrefix(path, index, metadata);
	const segment = path[index];
	if (segment === void 0) return false;
	const kind = classifyConfigSchemaPathSegment(metadata.schema, path.slice(0, index), segment);
	if (kind === "record-key" || kind === "array-index") return !hasSensitiveHintSegmentPrefix(path, index, metadata);
	if (kind === "invalid-record-key") return false;
	if (classifyConfigSchemaPathSegment(metadata.schema, path.slice(0, index), "0") === "array-index") return false;
	return metadata.wildcardHintPaths.some((hintParts) => hintParts[index] === "*" && hintParts.slice(index + 1).some((part) => part !== "*") && hintParts.slice(0, index).every((part, partIndex) => part === "*" || part === path[partIndex]));
}
function matchesHintPath(pattern, path) {
	return pattern.length === path.length && pattern.every((part, index) => part === "*" || part === path[index]);
}
function hasSensitiveConfigValue(path, value, metadata) {
	if (isUnknownDynamicOwnerPath(path, metadata)) return true;
	const { uiHints } = metadata;
	const canonicalPath = path.join(".");
	if (resolveConfigUiHint(path, uiHints, true, (candidate) => candidate.sensitive !== void 0)?.sensitive === true || isSensitiveConfigPath(canonicalPath)) return true;
	const hint = resolveConfigUiHint(path, uiHints);
	if (typeof value === "string" && (hasSensitiveUrlHintTag(hint) || isSensitiveUrlConfigPath(canonicalPath)) && redactSensitiveUrlLikeString(value) !== value) return true;
	if (Array.isArray(value)) return value.some((entry, index) => hasSensitiveConfigValue([...path, String(index)], entry, metadata));
	if (value && typeof value === "object") return Object.entries(value).some(([key, entry]) => hasSensitiveConfigValue([...path, key], entry, metadata));
	return false;
}
/** Return whether a config value must stay out of model-visible command text. */
function isSystemAgentSensitiveConfigValue(path, value) {
	let parsedPath;
	try {
		parsedPath = parseConcreteConfigPath(path);
	} catch {
		return true;
	}
	const parsedValue = typeof value === "string" ? parseConfigSetValue(value, false) : value;
	return hasSensitiveConfigValue(parsedPath, parsedValue, resolveSystemAgentConfigRedactionMetadata());
}
function isSensitiveConfigPathParts(path, metadata, includeAncestors = true) {
	const { uiHints } = metadata;
	const canonicalPath = path.join(".");
	if (resolveConfigUiHint(path, uiHints, includeAncestors, (candidate) => candidate.sensitive !== void 0)?.sensitive === true || isSensitiveConfigPath(canonicalPath)) return true;
	return hasSensitiveUrlHintTag(resolveConfigUiHint(path, uiHints)) || isSensitiveUrlConfigPath(canonicalPath);
}
function hasSensitiveSegmentPrefix(parsedPath, index, metadata) {
	const segment = parsedPath[index];
	if (segment === void 0) return false;
	for (let end = 1; end < segment.length; end += 1) {
		const prefixPath = [...parsedPath.slice(0, index), segment.slice(0, end)];
		const canonicalPath = prefixPath.join(".");
		if (isSensitiveConfigPath(canonicalPath) || isSensitiveUrlConfigPath(canonicalPath) || metadata.sensitiveHintPaths.some((hintPath) => matchesHintPath(hintPath, prefixPath))) return true;
	}
	return false;
}
function hasSensitiveContainerAssignment(path, index) {
	return SENSITIVE_CONFIG_CONTAINER_KEYS.has(path[index - 1] ?? "") && (path[index]?.includes("=") ?? false);
}
/** Redact unknown-owner paths and data appended after a sensitive key. */
function redactSystemAgentConfigPath(path) {
	try {
		const parsedPath = parseConcreteConfigPath(path);
		const metadata = resolveSystemAgentConfigRedactionMetadata();
		const hasSensitivePathData = parsedPath.some((segment, index) => hasSensitiveContainerAssignment(parsedPath, index) || !isDynamicOwnerIdSegment(parsedPath, index) && !isSchemaDynamicSegment(parsedPath, index, metadata) && (segment.includes("=") || !SENSITIVE_CONFIG_CONTAINER_KEYS.has(parsedPath[index - 1] ?? "") && hasSensitiveSegmentPrefix(parsedPath, index, metadata)) || index > 0 && !SENSITIVE_CONFIG_CONTAINER_KEYS.has(parsedPath[index - 1] ?? "") && isSensitiveConfigPathParts(parsedPath.slice(0, index), metadata));
		return isUnknownDynamicOwnerPath(parsedPath, metadata) || hasSensitivePathData ? "<redacted path>" : path;
	} catch {
		return "<redacted path>";
	}
}
/** Return whether a path segment embeds data after a sensitive config key. */
function isSystemAgentSensitiveConfigPathEmbedding(path) {
	let parsedPath;
	try {
		parsedPath = parseConcreteConfigPath(path);
	} catch {
		return true;
	}
	const metadata = resolveSystemAgentConfigRedactionMetadata();
	const unknownOwner = isUnknownDynamicOwnerPath(parsedPath, metadata);
	return parsedPath.some((segment, index) => {
		if (unknownOwner && segment.includes("=")) return true;
		if (hasSensitiveContainerAssignment(parsedPath, index)) return true;
		if (isDynamicOwnerIdSegment(parsedPath, index) || SENSITIVE_CONFIG_CONTAINER_KEYS.has(parsedPath[index - 1] ?? "") || isSchemaDynamicSegment(parsedPath, index, metadata)) return false;
		return segment.includes("=") || hasSensitiveSegmentPrefix(parsedPath, index, metadata);
	});
}
function redactUnknownDynamicOwners(value, metadata, invalidConfig) {
	if (!isRecord(value)) return value;
	let result = value;
	const plugins = isRecord(value.plugins) ? value.plugins : void 0;
	if (invalidConfig && Object.hasOwn(value, "plugins") && !plugins) result = {
		...result,
		plugins: REDACTED_SENTINEL
	};
	const entries = plugins && isRecord(plugins.entries) ? plugins.entries : void 0;
	if (invalidConfig && plugins && Object.hasOwn(plugins, "entries") && !entries) result = {
		...result,
		plugins: {
			...plugins,
			entries: REDACTED_SENTINEL
		}
	};
	if (entries) {
		let redactedEntries;
		for (const [pluginId, entry] of Object.entries(entries)) {
			if (!isRecord(entry) || !Object.hasOwn(entry, "config")) {
				if (invalidConfig) {
					redactedEntries ??= { ...entries };
					redactedEntries[pluginId] = REDACTED_SENTINEL;
				}
				continue;
			}
			if (metadata.pluginIds.has(normalizePluginPolicyId(pluginId))) continue;
			redactedEntries ??= { ...entries };
			redactedEntries[pluginId] = {
				...entry,
				config: REDACTED_SENTINEL
			};
		}
		if (redactedEntries) result = {
			...result,
			plugins: {
				...plugins,
				entries: redactedEntries
			}
		};
	}
	const channels = isRecord(value.channels) ? value.channels : void 0;
	if (invalidConfig && Object.hasOwn(value, "channels") && !channels) result = {
		...result,
		channels: REDACTED_SENTINEL
	};
	if (channels) {
		let redactedChannels;
		for (const [channelId, channelConfig] of Object.entries(channels)) {
			if (isKernelOwnedChannelConfigKey(channelId)) {
				if (invalidConfig) {
					redactedChannels ??= { ...channels };
					redactedChannels[channelId] = redactInvalidKernelChannelConfig(channelId, channelConfig);
				}
				continue;
			}
			if (metadata.channelIds.has(channelId)) continue;
			redactedChannels ??= { ...channels };
			redactedChannels[channelId] = REDACTED_SENTINEL;
		}
		if (redactedChannels) result = {
			...result,
			channels: redactedChannels
		};
	}
	return result;
}
function redactInvalidKernelChannelConfig(key, value) {
	if (key === "modelByChannel") return ChannelsSchema.safeParse({ modelByChannel: value }).success ? value : REDACTED_SENTINEL;
	if (key !== "defaults" || !isRecord(value)) return REDACTED_SENTINEL;
	return Object.fromEntries(Object.entries(value).map(([field, entry]) => [field, ChannelsSchema.safeParse({ defaults: { [field]: entry } }).success ? entry : REDACTED_SENTINEL]));
}
function replaceRedactionSentinels(value) {
	if (value === "__OPENCLAW_REDACTED__") return "<redacted>";
	if (Array.isArray(value)) return value.map(replaceRedactionSentinels);
	if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, replaceRedactionSentinels(entry)]));
	return value;
}
/** Redact a config object before any subtree is projected into a model-visible result. */
function redactSystemAgentConfig(value, source) {
	const metadata = resolveSystemAgentConfigRedactionMetadata(source);
	return replaceRedactionSentinels(redactConfigObject(redactUnknownDynamicOwners(value, metadata, source?.valid === false), metadata.uiHints));
}
//#endregion
//#region src/system-agent/config-write-policy.ts
/**
* Config roots the system agent must never write directly, with the operator
* escalation for each. These stay human-only regardless of approval:
* credential material, alternate-config inclusion, and provider/catalog
* definitions that feed inference routing (which has the verified
* `set_default_model` path instead). Everything else in the schema is
* agent-writable behind the exact-operation human approval gate — the
* config-write-parity contract test enforces that classification.
*/
const SYSTEM_AGENT_CONFIG_WRITE_DENYLIST = {
	$include: "alternate-config inclusion; edit openclaw.json in a trusted shell",
	auth: "provider auth; `openclaw onboard` on the machine running OpenClaw",
	env: "environment/credential injection; edit openclaw.json in a trusted shell",
	models: "provider/catalog definitions feed routing; use `set_default_model` or `openclaw onboard`",
	secrets: "secret providers; edit openclaw.json in a trusted shell"
};
function classifyInferenceRouteConfigPath(path) {
	const [root, scope, ownerOrField, field] = path.map((segment) => segment.trim().toLowerCase()).filter(Boolean);
	if (root && root in SYSTEM_AGENT_CONFIG_WRITE_DENYLIST) return "blocked";
	if (root === "plugins") return scope === "entries" && ownerOrField ? "plugin-entry" : "blocked";
	if (root !== "agents") return "allowed";
	if (!scope || scope === "defaults" && !ownerOrField || scope === "list" && !ownerOrField) return "blocked";
	if (scope === "defaults") return [
		"agentruntime",
		"model",
		"models",
		"params"
	].includes(ownerOrField ?? "") ? "blocked" : "allowed";
	if (scope !== "list") return "allowed";
	if (/^\d+$/.test(ownerOrField ?? "") && !field) return "blocked";
	const routeField = /^\d+$/.test(ownerOrField ?? "") ? field : ownerOrField;
	if ([
		"agentdir",
		"default",
		"id"
	].includes(routeField ?? "")) return "blocked";
	return [
		"agentruntime",
		"model",
		"models",
		"params"
	].includes(routeField ?? "") ? "agent-route" : "allowed";
}
//#endregion
//#region src/system-agent/operations-internal.ts
const INVALID_CONFIG_SET_MESSAGE = "Invalid config path. Check its quoting or escaping and try again.";
function isInvalidConfigSetOperation(operation) {
	return operation.kind === "none" && operation.message === "Invalid config path. Check its quoting or escaping and try again.";
}
//#endregion
//#region src/system-agent/plugin-install-spec.ts
function validateSystemAgentPluginInstallSpec(spec) {
	const trimmed = spec.trim();
	if (!trimmed) return "Plugin install spec is required.";
	if (/\s/.test(trimmed)) return "OpenClaw plugin install accepts one npm or ClawHub package spec.";
	if (/^(?:\.{1,2}\/|\/|~\/|file:|git(?:\+ssh|\+https)?:|https?:)/i.test(trimmed)) return "OpenClaw plugin install accepts npm or ClawHub package specs only.";
	if (!isOpenClawTrustedPluginInstallSpec(trimmed)) return "OpenClaw installs only ClawHub, bundled, or official-catalog plugins. Use `openclaw plugins install <spec>` in a trusted shell to review an arbitrary executable source.";
	return null;
}
//#endregion
//#region src/system-agent/operations-parse.ts
const ARG_WORD = String.raw`(?:"[^"]+"|'[^']+'|\S+)`;
const CONFIG_SET_PREFIX_RE = /^(?:config\s+set|set\s+config)\s+/i;
const CONFIG_SET_REF_PREFIX_RE = /^(?:config\s+set-ref|set\s+secretref|set\s+secret\s+ref)\s+/i;
const CONFIG_GET_PREFIX_RE = /^config\s+get(?=\s|$)/i;
const CONFIG_SCHEMA_PREFIX_RE = /^config\s+schema(?=\s|$)/i;
const CONFIG_SET_REF_ARGS_RE = new RegExp(String.raw`^(?:(?<source>env|file|exec|store)\s+)?(?<id>\S+)(?:\s+provider\s+(?<provider>[A-Za-z0-9_-]+))?$`, "i");
const SETUP_RE = new RegExp(String.raw`^(?:setup|set\s+me\s+up|set\s+up\s+openclaw|onboard(?:\s+me)?|bootstrap|first\s+run)(?:\s+workspace\s+(?<workspace>${ARG_WORD}))?(?:\s+model\s+(?<model>\S+))?$`, "i");
const MODEL_SETUP_RE = new RegExp(String.raw`^(?:configure\s+(?:a\s+)?model\s+provider|set\s*up\s+(?:a\s+)?model\s+provider|model\s+setup)(?:\s+workspace\s+(?<workspace>${ARG_WORD}))?$`, "i");
const CREATE_AGENT_RE = new RegExp(String.raw`^(?:create|add|set\s*up|new)\s+(?:(?:an?|new|my)\s+)?agent\s+(?<agent>[a-z0-9_-]+)(?:\s+workspace\s+(?<workspace>${ARG_WORD}))?(?:\s+model\s+(?<model>\S+))?$`, "i");
const TALK_AGENT_RE = new RegExp(String.raw`^(?:talk\s+to|switch\s+to|open|enter)\s+(?:(?:my|the)\s+)?(?:(?<agent>[a-z0-9_-]+)\s+)?agent(?:\s+(?:for|in|workspace)\s+(?<workspace>${ARG_WORD}))?$`, "i");
const SET_MODEL_RE = /^(?:set|configure|use)\s+(?:the\s+)?(?:default\s+)?models?\s+(?<model>\S+)(?:\s+for\s+agent\s+(?<agent>\S+))?$/i;
const GATEWAY_RE = /^(?:gateway\s+(?<sub>status|start|stop|restart)|(?<verb>start|stop|restart)\s+(?:the\s+)?gateway)$/i;
const PLUGIN_LIST_RE = /^(?:(?:plugins?|clawhub)\s+list|list\s+plugins?)$/i;
const PLUGIN_SEARCH_RE = /^(?:(?:plugins?|clawhub)\s+search|search\s+plugins?(?:\s+for)?)\s+(?<query>.+)$/i;
const PLUGIN_INSTALL_RE = /^(?:plugins?\s+install|install\s+(?:(?<source>npm|clawhub)\s+)?plugins?)\s+(?<spec>\S+)$/i;
const PLUGIN_UNINSTALL_RE = /^(?:plugins?\s+(?:uninstall|remove)|(?:uninstall|remove)\s+plugins?)\s+(?<pluginId>[A-Za-z0-9_.@/-]+)$/i;
const CHANNEL_LIST_RE = /^(?:channels|list\s+channels|show\s+channels)$/i;
const CHANNEL_CONNECT_RE = /^(?:connect|link)\s+(?:channel\s+)?(?:to\s+)?(?<channel>[a-z0-9_-]+)(?:\s+channel)?$/i;
const CHANNEL_INFO_RE = /^(?:channel\s+info\s+(?<channel>[a-z0-9_-]+)|about\s+(?<aboutChannel>[a-z0-9_-]+)\s+channel)$/i;
const SKILLS_SETUP_RE = /^(?:configure|set\s*up|setup)\s+skills$/i;
const SEARCH_SETUP_RE = /^(?:(?:configure|set\s*up|setup)\s+(?:web\s+)?search|(?:web\s+)?search\s+provider\s+setup)$/i;
const GATEWAY_CONFIG_SETUP_RE = /^(?:configure\s+gateway|set\s*up\s+gateway|gateway\s+settings)$/i;
const MEMORY_IMPORT_RE = /^(?:import\s+memor(?:y|ies)|memory\s+import)$/i;
const OPEN_GUIDED_SETUP_RE = /^(?:open\s+setup\s+wizard|setup\s+wizard|menu\s+setup|use\s+the\s+(?:setup\s+)?wizard)$/i;
const OPEN_CLASSIC_SETUP_RE = /^(?:open\s+classic(?:\s+setup)?\s+wizard|classic\s+setup)$/i;
const OPEN_CHANNEL_SETUP_RE = /^open\s+channel\s+wizard(?:\s+for\s+(?<channel>[a-z0-9_-]+))?$/i;
const OPEN_SEARCH_SETUP_RE = /^open\s+(?:web\s+)?search\s+wizard$/i;
const OPEN_GATEWAY_SETUP_RE = /^open\s+gateway\s+wizard$/i;
const NO_MATCH_MESSAGE = "I can run doctor/status/health, check or restart Gateway, configure gateway settings, list agents/models, configure skills or web search, import memory, set default model, connect channels (`connect telegram`), show `channel info <channel>`, open the setup wizard, show audit, or switch to your agent TUI.";
function normalizeExplicitSystemAgentId(agentId) {
	const normalized = normalizeAgentIdStrict(agentId);
	return normalized.ok ? normalized.value : agentId;
}
function parseConfigSetCommand(input) {
	const prefix = input.match(CONFIG_SET_PREFIX_RE)?.[0];
	if (!prefix) return;
	const body = input.slice(prefix.length);
	for (const separator of body.matchAll(/\s+/gu)) {
		const path = body.slice(0, separator.index);
		const value = body.slice(separator.index).trim();
		if (!value) continue;
		try {
			parseConcreteConfigPath(path);
			if (isSystemAgentSensitiveConfigPathEmbedding(path)) return { valid: false };
			return {
				path,
				value,
				valid: true
			};
		} catch {
			continue;
		}
	}
	return body.trim() ? { valid: false } : void 0;
}
function parseConfigReadPath(input, prefixPattern, options) {
	const prefix = input.match(prefixPattern)?.[0];
	if (!prefix) return;
	const path = input.slice(prefix.length).trim();
	if (!path) return options.allowEmpty ? { valid: true } : { valid: false };
	if (options.allowRoot && path === ".") return {
		path,
		valid: true
	};
	try {
		parseConcreteConfigPath(path);
		return isSystemAgentSensitiveConfigPathEmbedding(path) ? { valid: false } : {
			path,
			valid: true
		};
	} catch {
		return { valid: false };
	}
}
function parseConfigSetRefCommand(input) {
	const prefix = input.match(CONFIG_SET_REF_PREFIX_RE)?.[0];
	if (!prefix) return;
	const body = input.slice(prefix.length);
	for (const separator of body.matchAll(/\s+/gu)) {
		const path = body.slice(0, separator.index);
		const args = body.slice(separator.index).trim().match(CONFIG_SET_REF_ARGS_RE);
		if (!args?.groups?.id) continue;
		try {
			parseConcreteConfigPath(path);
			if (isSystemAgentSensitiveConfigPathEmbedding(path)) return { valid: false };
		} catch {
			continue;
		}
		const source = args.groups.source?.toLowerCase() ?? "env";
		const id = args.groups.id.trim();
		if (!isValidSecretRef({
			source,
			provider: args.groups.provider ?? "default",
			id
		})) return { valid: false };
		return {
			path,
			source,
			id,
			...args.groups.provider ? { provider: args.groups.provider } : {},
			valid: true
		};
	}
	return body.trim() ? { valid: false } : void 0;
}
/**
* Parse one user command into OpenClaw's closed operation union. Anything
* that does not match the anchored grammar exactly returns kind "none" so the
* caller can route it to the system agent (or show guidance).
*/
function parseSystemAgentOperation(input) {
	const trimmed = input.trim();
	const lower = trimmed.toLowerCase();
	if (!trimmed) return {
		kind: "none",
		message: "Tiny claw tap: say status, doctor, models, agents, or talk to agent."
	};
	if ([
		"help",
		"?",
		"overview",
		"system"
	].includes(lower)) return { kind: "overview" };
	switch (lower) {
		case "audit":
		case "audit log":
		case "show audit": return { kind: "audit" };
		case "status": return { kind: "status" };
		case "health": return { kind: "health" };
		case "doctor": return { kind: "doctor" };
		case "doctor fix":
		case "doctor repair": return { kind: "doctor-fix" };
		case "config validate":
		case "validate config": return { kind: "config-validate" };
		case "agents":
		case "list agents": return { kind: "agents" };
		case "models":
		case "list models": return { kind: "models" };
		case "tui":
		case "open tui":
		case "chat": return { kind: "open-tui" };
		case "quit":
		case "exit": return {
			kind: "none",
			message: "OpenClaw retracts into shell. Bye."
		};
		default: break;
	}
	const configSetRef = parseConfigSetRefCommand(trimmed);
	if (configSetRef?.valid) return {
		kind: "config-set-ref",
		path: configSetRef.path,
		source: configSetRef.source,
		id: configSetRef.id,
		...configSetRef.provider ? { provider: configSetRef.provider } : {}
	};
	if (configSetRef && !configSetRef.valid) return {
		kind: "none",
		message: INVALID_CONFIG_SET_MESSAGE
	};
	const configSet = parseConfigSetCommand(trimmed);
	if (configSet) {
		if (!configSet.valid) return {
			kind: "none",
			message: INVALID_CONFIG_SET_MESSAGE
		};
		return {
			kind: "config-set",
			path: configSet.path,
			value: configSet.value
		};
	}
	const configGet = parseConfigReadPath(trimmed, CONFIG_GET_PREFIX_RE, { allowEmpty: false });
	if (configGet?.valid && configGet.path) return {
		kind: "config-get",
		path: configGet.path
	};
	if (configGet && !configGet.valid) return {
		kind: "none",
		message: INVALID_CONFIG_SET_MESSAGE
	};
	const configSchema = parseConfigReadPath(trimmed, CONFIG_SCHEMA_PREFIX_RE, {
		allowEmpty: true,
		allowRoot: true
	});
	if (configSchema?.valid) return {
		kind: "config-schema",
		...configSchema.path ? { path: configSchema.path } : {}
	};
	if (configSchema && !configSchema.valid) return {
		kind: "none",
		message: INVALID_CONFIG_SET_MESSAGE
	};
	if (PLUGIN_LIST_RE.test(trimmed)) return { kind: "plugin-list" };
	const pluginSearchMatch = trimmed.match(PLUGIN_SEARCH_RE);
	if (pluginSearchMatch?.groups?.query?.trim()) return {
		kind: "plugin-search",
		query: pluginSearchMatch.groups.query.trim()
	};
	const pluginInstallMatch = trimmed.match(PLUGIN_INSTALL_RE);
	if (pluginInstallMatch?.groups?.spec?.trim()) {
		const spec = normalizePluginInstallSpec(pluginInstallMatch.groups.spec.trim(), pluginInstallMatch.groups.source);
		const validationError = validateSystemAgentPluginInstallSpec(spec);
		if (validationError) return {
			kind: "none",
			message: validationError
		};
		return {
			kind: "plugin-install",
			spec
		};
	}
	const pluginUninstallMatch = trimmed.match(PLUGIN_UNINSTALL_RE);
	if (pluginUninstallMatch?.groups?.pluginId?.trim()) return {
		kind: "plugin-uninstall",
		pluginId: pluginUninstallMatch.groups.pluginId.trim()
	};
	if (CHANNEL_LIST_RE.test(trimmed)) return { kind: "channel-list" };
	const channelInfoMatch = trimmed.match(CHANNEL_INFO_RE);
	const channelInfo = channelInfoMatch?.groups?.channel ?? channelInfoMatch?.groups?.aboutChannel;
	if (channelInfo) return {
		kind: "channel-info",
		channel: channelInfo.toLowerCase()
	};
	const channelConnectMatch = trimmed.match(CHANNEL_CONNECT_RE);
	if (channelConnectMatch?.groups?.channel) return {
		kind: "channel-setup",
		channel: channelConnectMatch.groups.channel.toLowerCase()
	};
	if (SKILLS_SETUP_RE.test(trimmed)) return { kind: "skills-setup" };
	if (SEARCH_SETUP_RE.test(trimmed)) return { kind: "search-setup" };
	if (GATEWAY_CONFIG_SETUP_RE.test(trimmed)) return { kind: "gateway-config-setup" };
	if (MEMORY_IMPORT_RE.test(trimmed)) return { kind: "memory-import" };
	const modelSetupMatch = trimmed.match(MODEL_SETUP_RE);
	if (modelSetupMatch) {
		const workspace = trimShellishToken(modelSetupMatch.groups?.workspace);
		return {
			kind: "model-setup",
			...workspace ? { workspace } : {}
		};
	}
	if (OPEN_GUIDED_SETUP_RE.test(trimmed)) return {
		kind: "open-setup",
		target: "guided"
	};
	if (OPEN_CLASSIC_SETUP_RE.test(trimmed)) return {
		kind: "open-setup",
		target: "classic"
	};
	const openChannelSetupMatch = trimmed.match(OPEN_CHANNEL_SETUP_RE);
	if (openChannelSetupMatch) {
		const channel = openChannelSetupMatch.groups?.channel?.toLowerCase();
		return {
			kind: "open-setup",
			target: "channels",
			...channel ? { channel } : {}
		};
	}
	if (OPEN_SEARCH_SETUP_RE.test(trimmed)) return {
		kind: "open-setup",
		target: "search"
	};
	if (OPEN_GATEWAY_SETUP_RE.test(trimmed)) return {
		kind: "open-setup",
		target: "gateway"
	};
	const setupMatch = trimmed.match(SETUP_RE);
	if (setupMatch) {
		const workspace = trimShellishToken(setupMatch.groups?.workspace);
		const model = setupMatch.groups?.model;
		return {
			kind: "setup",
			...workspace ? { workspace } : {},
			...model ? { model } : {}
		};
	}
	const gatewayMatch = trimmed.match(GATEWAY_RE);
	if (gatewayMatch) {
		const action = (gatewayMatch.groups?.sub ?? gatewayMatch.groups?.verb ?? "").toLowerCase();
		if (action === "start") return { kind: "gateway-start" };
		if (action === "stop") return { kind: "gateway-stop" };
		if (action === "restart") return { kind: "gateway-restart" };
		return { kind: "gateway-status" };
	}
	const createMatch = trimmed.match(CREATE_AGENT_RE);
	if (createMatch?.groups?.agent) {
		const workspace = trimShellishToken(createMatch.groups.workspace);
		const model = createMatch.groups.model;
		return {
			kind: "create-agent",
			agentId: normalizeExplicitSystemAgentId(createMatch.groups.agent),
			...workspace ? { workspace } : {},
			...model ? { model } : {}
		};
	}
	const talkMatch = trimmed.match(TALK_AGENT_RE);
	if (talkMatch) {
		const workspace = trimShellishToken(talkMatch.groups?.workspace);
		return {
			kind: "open-tui",
			...talkMatch.groups?.agent ? { agentId: talkMatch.groups.agent } : {},
			...workspace ? { workspace } : {}
		};
	}
	const setModelMatch = trimmed.match(SET_MODEL_RE);
	if (setModelMatch?.groups?.model) {
		const agent = setModelMatch.groups.agent?.trim();
		return {
			kind: "set-default-model",
			model: setModelMatch.groups.model,
			...agent ? { agentId: normalizeExplicitSystemAgentId(agent) } : {}
		};
	}
	return {
		kind: "none",
		message: NO_MATCH_MESSAGE
	};
}
function trimShellishToken(value) {
	const trimmed = value?.trim();
	if (!trimmed) return;
	if (trimmed.startsWith("\"") && trimmed.endsWith("\"") || trimmed.startsWith("'") && trimmed.endsWith("'")) return trimmed.slice(1, -1).trim() || void 0;
	return trimmed;
}
function normalizePluginInstallSpec(spec, source) {
	const trimmed = spec.trim();
	const normalizedSource = source?.toLowerCase();
	if (normalizedSource === "npm" && !trimmed.toLowerCase().startsWith("npm:")) return `npm:${trimmed}`;
	if (normalizedSource === "clawhub" && !trimmed.toLowerCase().startsWith("clawhub:")) return `clawhub:${trimmed}`;
	return trimmed;
}
/**
* Return whether an operation can change local state or process lifecycle.
* Guided setup operations are intentionally absent: starting a wizard is not
* itself a write; the wizard owns approval and persistence for its answers.
*/
function isPersistentSystemAgentOperation(operation) {
	return operation.kind === "set-default-model" || operation.kind === "config-set" || operation.kind === "config-set-ref" || operation.kind === "setup" || operation.kind === "plugin-install" || operation.kind === "plugin-uninstall" || operation.kind === "create-agent" && !operation.model?.trim() && !isReservedSystemAgentId(operation.agentId) || operation.kind === "gateway-start" || operation.kind === "gateway-stop" || operation.kind === "gateway-restart";
}
/** Format a user-facing description for an operation requiring approval. */
function describeSystemAgentPersistentOperation(operation) {
	switch (operation.kind) {
		case "set-default-model": return operation.agentId ? `set agent ${operation.agentId}'s model to ${operation.model}` : `set agents.defaults.model.primary to ${operation.model}`;
		case "config-set": return `set config ${redactSystemAgentConfigPath(operation.path)} to ${formatConfigSetValueForPlan(operation.path, operation.value)}`;
		case "config-set-ref": return `set config ${redactSystemAgentConfigPath(operation.path)} to ${operation.source} SecretRef <redacted>`;
		case "setup": return formatSetupPlanDescription(operation);
		case "model-setup": return "configure a model provider and default model";
		case "doctor-fix": return "run openclaw doctor --fix on the machine running OpenClaw, with OpenClaw stopped";
		case "plugin-install": return `install plugin ${operation.spec}`;
		case "plugin-uninstall": return `uninstall plugin ${operation.pluginId}`;
		case "create-agent": return [`create agent ${operation.agentId} with workspace ${formatCreateAgentWorkspace(operation.workspace)}`, operation.requesterAgentId ? `requested by agent ${operation.requesterAgentId}` : void 0].filter(Boolean).join(", ");
		case "gateway-start": return "start the Gateway";
		case "gateway-stop": return "stop the Gateway";
		case "gateway-restart": return "restart the Gateway";
		default: return "apply this action";
	}
}
/** Format the standard approval plan text for a persistent operation. */
function formatSystemAgentPersistentPlan(operation) {
	return `Plan: ${describeSystemAgentPersistentOperation(operation)}. Say yes to apply.`;
}
function formatCreateAgentWorkspace(workspace) {
	return workspace ? shortenHomePath(resolveUserPath(workspace)) : shortenHomePath(process.cwd());
}
function formatConfigSetValueForPlan(configPath, value) {
	if (isSystemAgentSensitiveConfigValue(configPath, value)) return "<redacted>";
	return value;
}
function formatSetupPlanDescription(operation) {
	return `bootstrap OpenClaw setup for workspace ${shortenHomePath(resolveUserPath(operation.workspace ?? process.cwd()))}`;
}
//#endregion
//#region src/system-agent/operations-execution-helpers.ts
const loadConfigModule = async () => await import("./config/config.js");
const loadOverviewModule$1 = async () => await import("./overview-D0ao3HYb.js");
const CONFIG_GET_OUTPUT_MAX_CHARS = 2e3;
function readConfigValueAtPath(config, path) {
	let current = config;
	for (const rawSegment of path.split(".")) {
		const parts = rawSegment.split(/[[\]]/).filter(Boolean);
		for (const part of parts) {
			if (current === null || typeof current !== "object") return { found: false };
			const index = /^\d+$/.test(part) ? Number(part) : void 0;
			if (index !== void 0 && Array.isArray(current)) current = current[index];
			else current = current[part];
			if (current === void 0) return { found: false };
		}
	}
	return {
		found: true,
		value: current
	};
}
function formatGatewayStatusLine(overview) {
	return [
		`Gateway: ${overview.gateway.reachable ? "reachable" : "not reachable"}`,
		`URL: ${overview.gateway.url}`,
		`Source: ${overview.gateway.source}`,
		overview.gateway.error ? `Note: ${overview.gateway.error}` : void 0
	].filter((line) => line !== void 0).join("\n");
}
async function runGatewayLifecycle(operation, surface) {
	if (operation === "restart" && surface === "gateway") {
		const { scheduleSafeGatewayRestart } = await import("./restart-coordinator-Be7INHEN.js");
		return scheduleSafeGatewayRestart({
			reason: "gateway.restart.safe",
			delayMs: 0
		}).ok;
	}
	const lifecycle = await import("./lifecycle-CnORbpGp.js");
	if (operation === "start") {
		await lifecycle.runDaemonStart();
		return;
	}
	if (operation === "stop") {
		await lifecycle.runDaemonStop({ force: true });
		return;
	}
	return await lifecycle.runDaemonRestart();
}
async function readConfigFileSnapshotLazy() {
	const { readConfigFileSnapshot } = await loadConfigModule();
	return await readConfigFileSnapshot();
}
async function loadOverviewForOperation(deps) {
	if (deps?.loadOverview) return await deps.loadOverview();
	const { loadSystemAgentOverview } = await loadOverviewModule$1();
	return await loadSystemAgentOverview();
}
async function resolveChannelSetupState(deps) {
	const listPlugins = deps?.listChannelSetupPlugins ?? (await import("./setup-registry-D2b94872.js")).listChannelSetupPlugins;
	const resolveEntries = deps?.resolveChannelSetupEntries ?? (await import("./discovery-CUUejx00.js")).resolveChannelSetupEntries;
	const isConfigured = deps?.isChannelConfigured ?? (await import("./channel-configured-shared-6FsLfNHu.js")).isStaticallyChannelConfigured;
	const { shouldShowChannelInSetup } = await import("./discovery-CUUejx00.js");
	const snapshot = await readConfigFileSnapshotLazy();
	const cfg = snapshot.valid ? snapshot.runtimeConfig ?? snapshot.config : {};
	const installedPlugins = listPlugins();
	const resolved = resolveEntries({
		cfg,
		installedPlugins
	});
	return {
		cfg,
		installedPlugins,
		resolved: {
			...resolved,
			entries: resolved.entries.filter((entry) => shouldShowChannelInSetup(entry.meta))
		},
		isConfigured
	};
}
function formatChannelDocsUrl(docsPath) {
	return `https://docs.openclaw.ai${docsPath.startsWith("/") ? docsPath : `/${docsPath}`}`;
}
function formatConfigValidationLine(snapshot) {
	if (!snapshot.exists) return `Config missing: ${shortenHomePath(snapshot.path)}`;
	if (snapshot.valid) return `Config valid: ${shortenHomePath(snapshot.path)}`;
	return [`Config invalid: ${shortenHomePath(snapshot.path)}`, ...snapshot.issues.map((issue) => {
		return `  - ${issue.path ? `${issue.path}: ` : ""}${issue.message}`;
	})].join("\n");
}
function createNoExitRuntime(runtime) {
	return {
		...runtime,
		exit: (code) => {
			throw new Error(`operation exited with code ${code}`);
		}
	};
}
function resolveTuiAgentId(params) {
	const { overview } = params;
	const workspace = params.requestedWorkspace ? resolveUserPath(params.requestedWorkspace) : void 0;
	if (workspace) {
		const workspaceMatch = overview.agents.find((agent) => {
			return agent.workspace ? resolveUserPath(agent.workspace) === workspace : false;
		});
		if (workspaceMatch) return workspaceMatch.id;
	}
	if (!params.requestedAgentId?.trim()) return overview.defaultAgentId;
	const requested = normalizeAgentId(params.requestedAgentId);
	return overview.agents.find((agent) => {
		return normalizeAgentId(agent.id) === requested || (agent.name ? normalizeAgentId(agent.name) === requested : false);
	})?.id ?? requested;
}
async function applyPersistentOperation(params) {
	const { auditOperation, runtime, opts } = params;
	if (!opts.approved) {
		const message = formatSystemAgentPersistentPlan(params.operation);
		runtime.log(message);
		return {
			applied: false,
			message
		};
	}
	runtime.log(`[openclaw] running: ${auditOperation}`);
	const { readConfigFileSnapshot } = await loadConfigModule();
	const before = await readConfigFileSnapshot();
	const commit = async (effect) => {
		await opts.beforePersistentApply?.();
		return await effect();
	};
	const outcome = await params.run({
		runtime,
		deps: opts.deps,
		commit
	});
	const after = await readConfigFileSnapshot();
	try {
		await appendSystemAgentAuditEntry({
			operation: auditOperation,
			summary: outcome.summary,
			configPath: outcome.configPath ?? after.path ?? before.path ?? void 0,
			configHashBefore: before.hash ?? null,
			configHashAfter: after.hash ?? null,
			details: {
				...opts.auditDetails,
				...outcome.details
			}
		});
	} catch (error) {
		runtime.error(`${outcome.summary}, but OpenClaw could not record its audit entry: ${formatErrorMessage(error)}`);
	}
	runtime.log(`[openclaw] done: ${auditOperation}`);
	return {
		applied: true,
		...outcome.bootstrapPending === void 0 ? {} : { bootstrapPending: outcome.bootstrapPending },
		...outcome.agentId ? { agentId: outcome.agentId } : {}
	};
}
async function runConfigSetOperation(params) {
	const { operation, ctx } = params;
	const runConfigSet = ctx.deps?.runConfigSet ?? (async (setOpts) => {
		const { runConfigSet: importedRunConfigSet } = await import("./config-cli-DoomYwAr.js");
		await importedRunConfigSet({
			...setOpts,
			runtime: createNoExitRuntime(ctx.runtime)
		});
	});
	if (operation.kind === "config-set") {
		await ctx.commit(async () => {
			await assertConfigWriteDoesNotBypassInferenceVerification(operation);
			await runConfigSet({
				path: operation.path,
				value: operation.value,
				cliOptions: {}
			});
		});
		return;
	}
	await ctx.commit(async () => {
		await assertConfigWriteDoesNotBypassInferenceVerification(operation);
		await runConfigSet({
			path: operation.path,
			cliOptions: {
				refProvider: operation.provider ?? "default",
				refSource: operation.source,
				refId: operation.id
			}
		});
	});
}
async function isDefaultAgentListPath(segments) {
	const listIndexSegment = segments.map((segment) => segment.trim().toLowerCase()).filter(Boolean)[2];
	if (!listIndexSegment || !/^\d+$/.test(listIndexSegment)) return true;
	const { readConfigFileSnapshot } = await loadConfigModule();
	const snapshot = await readConfigFileSnapshot();
	if (!snapshot.exists || !snapshot.valid) return true;
	const config = snapshot.sourceConfig ?? snapshot.config;
	const authoredList = snapshot.sourceConfigBeforeMigrations?.agents?.list;
	const entry = Array.isArray(authoredList) ? authoredList[Number(listIndexSegment)] : void 0;
	if (!entry?.id) return true;
	const defaultAgentId = config ? tryResolveAmbientOwnerAgentId(config) : void 0;
	return !defaultAgentId || normalizeAgentId(entry.id) === normalizeAgentId(defaultAgentId);
}
async function assertConfigWriteDoesNotBypassInferenceVerification(operation) {
	const { parseConfigSetPath } = await import("./config-cli-DoomYwAr.js");
	const segments = parseConfigSetPath(operation.path);
	const verdict = classifyInferenceRouteConfigPath(segments);
	if (verdict === "allowed") return;
	if (verdict === "agent-route" && !await isDefaultAgentListPath(segments)) return;
	if (verdict === "plugin-entry") {
		const pluginId = segments.filter((segment) => segment.trim())[2] ?? "";
		if (!await isPluginBackingDefaultInferenceRoute(pluginId)) return;
		throw new Error(`Direct config writes cannot change plugin "${pluginId}" because it may back OpenClaw's own active inference route. Editing it is a human-only change, made with OpenClaw stopped from a trusted shell on the machine running it.`);
	}
	const deniedRoot = segments[0]?.trim().toLowerCase() ?? "";
	const denialReason = SYSTEM_AGENT_CONFIG_WRITE_DENYLIST[deniedRoot];
	throw new Error(denialReason ? `Direct config writes cannot change \`${deniedRoot}\` (${denialReason}).` : "Direct config writes cannot change the default inference route or include alternate config. Use `set_default_model` (optionally with agentId) for an already configured route; changing provider or auth access is `openclaw onboard` on the machine running OpenClaw.");
}
async function verifyCurrentSetupInference(runtime, deps) {
	const { readConfigFileSnapshot } = await loadConfigModule();
	const before = await readConfigFileSnapshot();
	if (!before.exists || !before.valid) throw new Error("OpenClaw setup requires a valid configured inference route. Run `openclaw onboard` on the machine running OpenClaw, then retry.");
	const beforeConfig = before.runtimeConfig ?? before.config;
	const beforeRoute = await projectDefaultInferenceRoute(beforeConfig);
	if (!beforeRoute.route) throw new Error("OpenClaw setup requires working inference first. Run `openclaw onboard` on the machine running OpenClaw, then retry.");
	const verification = await (deps?.verifyInferenceConfig ?? (await import("./system-agent/setup-inference.js")).verifySetupInferenceConfig)({
		config: beforeConfig,
		runtime
	});
	if (!verification.ok) throw new Error(`OpenClaw setup requires working inference first. The configured route failed a live check: ${verification.error} Run \`openclaw onboard\` on the machine running OpenClaw, then retry.`);
	const after = await readConfigFileSnapshot();
	if (!after.exists || !after.valid) throw new Error("The default-agent inference route changed during setup verification, so setup was not applied. Review the current config and retry.");
	const afterRoute = await projectDefaultInferenceRoute(after.runtimeConfig ?? after.config);
	if (!sameDefaultInferenceRoute(beforeRoute, afterRoute) || verification.modelRef !== afterRoute.route?.modelLabel) throw new Error("The default-agent inference route changed during setup verification, so setup was not applied. Review the current model/auth/runtime settings and retry.");
	return {
		modelRef: verification.modelRef,
		route: afterRoute,
		latencyMs: verification.latencyMs
	};
}
async function executeSetup(operation, runtime, opts) {
	const defaultModel = (await loadOverviewForOperation(opts.deps)).defaultModel?.trim();
	if (!defaultModel) throw new Error("OpenClaw setup requires working inference first. Run `openclaw onboard` on the machine running OpenClaw to configure and verify a default model, then start OpenClaw again.");
	const requestedModel = operation.model?.trim();
	if (requestedModel && requestedModel !== defaultModel) throw new Error(`OpenClaw setup will preserve the verified default model ${defaultModel}. Staging, live-testing, and saving a different inference route is \`openclaw onboard\` on the machine running OpenClaw.`);
	if (!opts.approved) {
		const message = [formatSystemAgentPersistentPlan(operation), `Model choice: keep verified default ${defaultModel}.`].join("\n");
		runtime.log(message);
		return {
			applied: false,
			message
		};
	}
	const verified = await verifyCurrentSetupInference(runtime, opts.deps);
	if (requestedModel && requestedModel !== verified.modelRef) throw new Error(`The verified default model is now ${verified.modelRef}, not ${requestedModel}. Review the current route, or run \`openclaw onboard\` on the machine running OpenClaw, before retrying setup.`);
	return await applyPersistentOperation({
		auditOperation: "openclaw.setup",
		operation,
		runtime,
		opts,
		run: async (ctx) => {
			const applySetup = ctx.deps?.applySetup ?? (await import("./setup-apply-CZejj76D.js")).applySystemAgentSetup;
			const surface = ctx.deps?.setupSurface ?? "cli";
			const recovery = surface === "cli" ? await (await import("./setup-recovery-CKEb_aBP.js")).loadLocalSetupRecovery(operation.workspace) : void 0;
			const workspace = recovery?.workspace ?? resolveUserPath(operation.workspace ?? process.cwd());
			const applied = await ctx.commit(() => applySetup({
				workspace,
				...operation.agentName ? { firstAgent: { name: operation.agentName } } : {},
				expectedInferenceRoute: verified.route,
				...recovery?.applyOptions,
				surface,
				runtime: ctx.runtime
			}, { commit: (effect) => ctx.commit(effect) }));
			if (!applied.workspaceReady) throw new Error("The workspace could not be prepared. Retry onboarding to finish setup.");
			if (applied.gateway.status === "failed") throw new Error(applied.gateway.error);
			const after = await recovery?.complete(applied.configPath, (effect) => ctx.commit(effect)) ?? await readConfigFileSnapshotLazy();
			ctx.runtime.log(`Updated ${after.path || applied.configPath || "config"}`);
			for (const line of applied.lines) ctx.runtime.log(line);
			ctx.runtime.log(`Default model: ${verified.modelRef} (verified and kept)`);
			return {
				summary: "Bootstrapped setup workspace",
				bootstrapPending: applied.bootstrapPending,
				configPath: after.path || applied.configPath,
				details: {
					workspace,
					model: verified.modelRef,
					modelSource: "live-verified default model",
					inferenceLatencyMs: verified.latencyMs
				}
			};
		}
	});
}
async function executeSetDefaultModel(operation, runtime, opts) {
	return await applyPersistentOperation({
		auditOperation: "config.setDefaultModel",
		operation,
		runtime,
		opts,
		run: async (ctx) => {
			const { mutateConfigFile, readConfigFileSnapshot } = await loadConfigModule();
			const { applySystemAgentModelSelection, createSystemAgentModelSelectionUpdater } = await import("./setup-model-selection-VxLRTe2X.js");
			const targetAgentId = operation.agentId;
			const snapshot = await readConfigFileSnapshot();
			const projectRoute = (config) => projectInferenceRoute(config, targetAgentId);
			const stagedConfig = await applySystemAgentModelSelection({
				config: snapshot.sourceConfig,
				model: operation.model,
				...targetAgentId ? { targetAgentId } : {}
			});
			const beforeRoute = await projectRoute(snapshot.sourceConfig);
			const verifiedRoute = await projectRoute(stagedConfig);
			const verifyInferenceConfig = ctx.deps?.verifyInferenceConfig ?? (await import("./system-agent/setup-inference.js")).verifySetupInferenceConfig;
			const initialVerification = await verifyInferenceConfig({
				config: stagedConfig,
				runtime: ctx.runtime,
				requireExecutionOwner: true,
				...targetAgentId ? { agentId: targetAgentId } : {}
			});
			if (!initialVerification.ok) throw new Error(`The requested model failed a live inference test, so the current default model was not changed. ${initialVerification.error} Fix provider authentication or model access, then retry.`);
			const verifiedModelRef = verifiedRoute.route?.modelLabel;
			if (!verifiedModelRef || initialVerification.modelRef !== verifiedModelRef) throw new Error("The live inference test did not verify the exact model route that would be saved, so the current default model was not changed. Review model aliases and runtime routing, then retry.");
			let persistedVerification = initialVerification;
			let persistedBinding;
			let selectedRouteForCommit = verifiedRoute;
			const selectModel = await createSystemAgentModelSelectionUpdater({
				model: operation.model,
				...targetAgentId ? { targetAgentId } : {}
			});
			const result = await mutateConfigFile({
				base: "source",
				writeOptions: {
					auditOrigin: "system-agent",
					preCommitRuntimePreflight: async (sourceConfig) => {
						const commitRoute = await projectRoute(sourceConfig);
						if (!sameDefaultInferenceRoute(commitRoute, selectedRouteForCommit)) throw new Error("The selected inference route changed while preparing the config write, so the requested model was not saved. Review the current model/auth/runtime settings and retry.");
						await opts.beforePersistentApply?.();
						let latestBinding;
						const latestVerification = await verifyInferenceConfig({
							config: sourceConfig,
							runtime: ctx.runtime,
							requireExecutionOwner: true,
							...targetAgentId ? { agentId: targetAgentId } : {},
							...opts.onVerifiedInferenceChanged ? { onVerifiedExecution: (_auth, binding) => {
								latestBinding = binding;
							} } : {}
						});
						if (!latestVerification.ok) throw new Error(`The requested model no longer passes live inference at the config commit boundary, so it was not saved. ${latestVerification.error} Review concurrent configuration changes and retry.`);
						if (latestVerification.modelRef !== commitRoute.route?.modelLabel) throw new Error("The final live inference test did not verify the exact model route at the config commit boundary, so the requested model was not saved. Review model aliases and runtime routing, then retry.");
						if (opts.onVerifiedInferenceChanged && !latestBinding) throw new Error("The final live inference test did not return a reusable session binding, so the requested model was not saved. Retry the model change.");
						await opts.beforePersistentApply?.();
						persistedVerification = latestVerification;
						persistedBinding = latestBinding;
					}
				},
				mutate: async (cfg) => {
					if (!sameDefaultInferenceRoute(await projectRoute(cfg), beforeRoute)) throw new Error("The default-agent inference route changed during verification, so the requested model was not saved. Review the current model/auth/runtime settings and retry.");
					const selected = selectModel(cfg);
					const selectedRoute = await projectRoute(selected);
					if (selectedRoute.route?.modelLabel !== verifiedModelRef) throw new Error("The model selection no longer resolves to the exact model that passed live inference. Review the current model/auth/runtime settings and retry.");
					selectedRouteForCommit = selectedRoute;
					cfg.agents = selected.agents;
				}
			});
			if (persistedBinding) opts.onVerifiedInferenceChanged?.(persistedBinding);
			ctx.runtime.log(`Updated ${result.path}`);
			ctx.runtime.log(targetAgentId ? `Agent ${targetAgentId} model: ${persistedVerification.modelRef}` : `Default model: ${persistedVerification.modelRef}`);
			return {
				summary: targetAgentId ? `Set agent ${targetAgentId} model to ${operation.model}` : `Set default model to ${operation.model}`,
				configPath: result.path,
				details: {
					...targetAgentId ? { agentId: targetAgentId } : {},
					requestedModel: operation.model,
					effectiveModel: persistedVerification.modelRef,
					inferenceVerified: true,
					inferenceLatencyMs: persistedVerification.latencyMs
				}
			};
		}
	});
}
/**
* Uninstalling the plugin that provides the active default inference route
* would break the very session driving the change, so that case stays a
* terminal-only operation. Every other plugin is uninstallable behind the
* standard approval gate — matching what the operator can do from the UI/CLI.
*/
async function isPluginBackingDefaultInferenceRoute(pluginId) {
	const { readConfigFileSnapshot } = await loadConfigModule();
	const snapshot = await readConfigFileSnapshot();
	if (!snapshot.exists || !snapshot.valid) return true;
	const config = snapshot.runtimeConfig ?? snapshot.config;
	const route = (await projectDefaultInferenceRoute(config ?? {})).route;
	if (!route) return false;
	const { resolveModelRuntimePolicy } = await import("./model-runtime-policy-ByraZ4dg.js");
	const runtimePolicyId = resolveModelRuntimePolicy({
		config,
		provider: route.provider,
		modelId: route.model,
		agentId: route.agentId
	}).policy?.id;
	const normalizedPluginId = pluginId.trim().toLowerCase();
	const components = [
		route.provider,
		runtimePolicyId,
		route.runner === "embedded" ? route.agentHarnessRuntimeOverride : void 0
	].map((component) => component?.trim().toLowerCase()).filter((component) => Boolean(component));
	if (components.includes(normalizedPluginId)) return true;
	const { resolveOwningPluginIdsForProviderRef } = await import("./providers-DzOYSf0w.js");
	return components.some((component) => (resolveOwningPluginIdsForProviderRef({
		provider: component,
		config
	}) ?? []).some((owner) => owner.trim().toLowerCase() === normalizedPluginId));
}
//#endregion
//#region src/system-agent/plugin-install.ts
async function executePluginInstall(operation, runtime, opts) {
	const validationError = validateSystemAgentPluginInstallSpec(operation.spec);
	if (validationError) throw new Error(validationError);
	const result = await applyPersistentOperation({
		auditOperation: "plugin.install",
		operation,
		runtime,
		opts,
		run: async (ctx) => {
			await ctx.commit(async () => {
				const { runPluginInstallCommand } = await import("./plugins-install-command-BWCVxgY7.js");
				await runPluginInstallCommand({
					raw: operation.spec,
					opts: {},
					runtime: createNoExitRuntime(ctx.runtime),
					allowInstallPolicyWarningPrompt: false
				});
			});
			return {
				summary: `Installed plugin ${operation.spec}`,
				details: { spec: operation.spec }
			};
		}
	});
	if (result.applied) runtime.log("Restart the Gateway to apply installed plugin changes.");
	return result;
}
//#endregion
//#region src/system-agent/operations-execute.ts
const loadOverviewModule = async () => await import("./overview-D0ao3HYb.js");
/** Execute a parsed OpenClaw operation after applying approval gates and audit logging. */
async function executeSystemAgentOperation(operation, runtime, opts = {}) {
	switch (operation.kind) {
		case "none":
			runtime.log(operation.message);
			return {
				applied: false,
				exitsInteractive: operation.message.includes("Bye.")
			};
		case "overview": {
			const overview = await loadOverviewForOperation(opts.deps);
			if (opts.deps?.formatOverview) runtime.log(opts.deps.formatOverview(overview));
			else {
				const { formatSystemAgentOverview } = await loadOverviewModule();
				runtime.log(formatSystemAgentOverview(overview));
			}
			return { applied: false };
		}
		case "agents": {
			const overview = await loadOverviewForOperation(opts.deps);
			runtime.log(["Agents:", ...overview.agents.map((agent) => {
				return `  - ${[
					agent.id,
					agent.isDefault ? "default" : void 0,
					agent.name ? `name=${agent.name}` : void 0,
					agent.workspace ? `workspace=${shortenHomePath(resolveUserPath(agent.workspace))}` : void 0
				].filter(Boolean).join(" | ")}`;
			})].join("\n"));
			return { applied: false };
		}
		case "models": {
			const overview = await loadOverviewForOperation(opts.deps);
			runtime.log([
				`Default model: ${overview.defaultModel ?? "not configured"}`,
				`Codex: ${overview.tools.codex.found ? "found" : "not found"}`,
				`Claude Code: ${overview.tools.claude.found ? "found" : "not found"}`,
				`Gemini CLI: ${overview.tools.gemini.found ? "found" : "not found"}`,
				`OpenAI key: ${overview.tools.apiKeys.openai ? "found" : "not found"}`,
				`Anthropic key: ${overview.tools.apiKeys.anthropic ? "found" : "not found"}`
			].join("\n"));
			return { applied: false };
		}
		case "plugin-list":
			await (opts.deps?.runPluginsList ?? (async (pluginRuntime) => {
				const { runPluginsListCommand } = await import("./plugins-list-command-BpF0_oXx.js");
				await runPluginsListCommand({}, pluginRuntime);
			}))(runtime);
			return { applied: false };
		case "plugin-search":
			await (opts.deps?.runPluginsSearch ?? (async (query, pluginRuntime) => {
				const { runPluginsSearchCommand } = await import("./plugins-search-command-C8R0dsCN.js");
				await runPluginsSearchCommand(query, {}, pluginRuntime);
			}))(operation.query, runtime);
			return { applied: false };
		case "audit":
			runtime.log(`Audit state: ${SYSTEM_AGENT_AUDIT_STORE_LABEL}`);
			runtime.log("Only applied writes/actions are recorded; discovery stays quiet.");
			return { applied: false };
		case "config-validate": {
			const snapshot = await readConfigFileSnapshotLazy();
			runtime.log(formatConfigValidationLine(snapshot));
			return { applied: false };
		}
		case "config-get": {
			const snapshot = await readConfigFileSnapshotLazy();
			if (!snapshot.exists) {
				runtime.log(`Config missing: ${shortenHomePath(snapshot.path)}`);
				return { applied: false };
			}
			const cfg = snapshot.sourceConfig;
			const lookup = readConfigValueAtPath(redactSystemAgentConfig(cfg, {
				config: cfg,
				valid: snapshot.valid
			}), operation.path);
			if (!lookup.found) {
				runtime.log(`${operation.path}: not set. Use \`config schema ${operation.path}\` to see what is allowed.`);
				return { applied: false };
			}
			const rendered = JSON.stringify(lookup.value, null, 2) ?? "null";
			runtime.log(rendered.length > 2e3 ? `${operation.path} = ${truncateUtf16Safe(rendered, CONFIG_GET_OUTPUT_MAX_CHARS)}\n… (truncated)` : `${operation.path} = ${rendered}`);
			return { applied: false };
		}
		case "config-schema": {
			const { buildConfigSchemaCore, lookupConfigSchema } = await import("./schema-HoaEiPvR.js");
			const response = buildConfigSchemaCore();
			const path = operation.path ?? ".";
			const result = lookupConfigSchema(response, path);
			if (!result) {
				runtime.log(`No config schema at "${path}". Try \`config schema .\` for the root keys.`);
				return { applied: false };
			}
			const schema = result.schema;
			const childLines = result.children.slice(0, 40).map((child) => {
				const bits = [
					Array.isArray(child.type) ? child.type.join("|") : child.type ?? "object",
					child.required ? "required" : void 0,
					child.hasChildren ? "…" : void 0
				].filter(Boolean).join(", ");
				return `  - ${child.path} (${bits})`;
			});
			runtime.log([
				`Schema for ${result.path === "" ? "." : result.path}:`,
				schema.type ? `type: ${Array.isArray(schema.type) ? schema.type.join("|") : schema.type}` : void 0,
				schema.description ? `description: ${schema.description}` : void 0,
				schema.enum ? `allowed values: ${schema.enum.map((v) => JSON.stringify(v)).join(", ")}` : void 0,
				schema.default !== void 0 ? `default: ${JSON.stringify(schema.default)}` : void 0,
				...childLines.length > 0 ? ["keys:", ...childLines] : [],
				result.children.length > 40 ? `… +${result.children.length - 40} more keys` : void 0
			].filter((line) => line !== void 0).join("\n"));
			return { applied: false };
		}
		case "channel-list": {
			const { resolved } = await resolveChannelSetupState(opts.deps);
			const entries = resolved.entries.toSorted((a, b) => a.id.localeCompare(b.id));
			runtime.log([
				"Channels:",
				...entries.map((entry) => `  - ${entry.id}${entry.meta.label ? ` (${entry.meta.label})` : ""}`),
				"",
				"Say `connect <channel>` to walk through setup (for example `connect telegram`)."
			].join("\n"));
			return { applied: false };
		}
		case "channel-info": {
			const { cfg, installedPlugins, resolved, isConfigured } = await resolveChannelSetupState(opts.deps);
			const channel = operation.channel.toLowerCase();
			const entry = resolved.entries.find((candidate) => candidate.id === channel);
			if (!entry) {
				const knownIds = resolved.entries.map((candidate) => candidate.id).toSorted();
				runtime.log([`Unknown channel: ${channel}`, `Known channels: ${knownIds.length > 0 ? knownIds.join(", ") : "none"}`].join("\n"));
				return { applied: false };
			}
			const installed = installedPlugins.some((plugin) => plugin.id === entry.id) || resolved.installedCatalogById.has(entry.id);
			runtime.log([
				`${entry.meta.label} (${entry.id})`,
				entry.meta.blurb,
				`Configured: ${isConfigured(cfg, entry.id) ? "yes" : "no"}`,
				`Installed: ${installed ? "yes" : "no"}`,
				`Docs: ${formatChannelDocsUrl(entry.meta.docsPath)}`,
				"",
				`Say \`connect ${entry.id}\` to set it up here, or \`open channel wizard for ${entry.id}\` for the masked terminal wizard.`
			].join("\n"));
			return { applied: false };
		}
		case "channel-setup":
			runtime.log([
				`Connecting ${operation.channel} needs an interactive session.`,
				"Run `openclaw setup` and say `connect " + operation.channel + "`,",
				"or run `openclaw channels add` for the terminal wizard."
			].join("\n"));
			return { applied: false };
		case "skills-setup":
			runtime.log([
				"Skills setup needs an interactive session.",
				"Run `openclaw setup` and say `configure skills`,",
				"or run `openclaw configure --section skills` for the terminal wizard."
			].join("\n"));
			return { applied: false };
		case "search-setup":
			runtime.log([
				"Web search setup needs an interactive session.",
				"Run `openclaw setup` and say `configure search`,",
				"or run `openclaw configure --section web` for the masked terminal wizard."
			].join("\n"));
			return { applied: false };
		case "gateway-config-setup":
			runtime.log([
				"Gateway configuration needs an interactive session.",
				"Run `openclaw setup` and say `configure gateway`,",
				"or run `openclaw configure --section gateway` for the masked terminal wizard."
			].join("\n"));
			return { applied: false };
		case "memory-import":
			runtime.log([
				"Memory import needs an interactive session.",
				"Open the Memory page in the Control UI,",
				"or run `openclaw onboard` for the terminal wizard."
			].join("\n"));
			return { applied: false };
		case "model-setup":
			runtime.log(["Changing model providers must happen outside the inference session that powers OpenClaw.", "Stop the OpenClaw host through whatever started it. Run `openclaw onboard` on the machine running OpenClaw: it stages credentials, live-tests the candidate route, and saves only a passing setup. Then restart the host."].join("\n"));
			return { applied: false };
		case "open-setup": {
			const command = operation.target === "guided" ? "openclaw onboard" : operation.target === "classic" ? "openclaw onboard --classic" : operation.target === "channels" ? `openclaw channels add${operation.channel ? ` --channel ${operation.channel}` : ""}` : operation.target === "search" ? "openclaw configure --section web" : "openclaw configure --section gateway";
			runtime.log(`This session cannot host an interactive wizard. Run \`${command}\` on the machine running OpenClaw.`);
			return { applied: false };
		}
		case "setup": return await executeSetup(operation, runtime, opts);
		case "config-set":
			await assertConfigWriteDoesNotBypassInferenceVerification(operation);
			return await applyPersistentOperation({
				auditOperation: "config.set",
				operation,
				runtime,
				opts,
				run: async (ctx) => {
					await runConfigSetOperation({
						operation,
						ctx
					});
					return {
						summary: `Set config ${operation.path}`,
						details: { path: operation.path }
					};
				}
			});
		case "config-set-ref":
			await assertConfigWriteDoesNotBypassInferenceVerification(operation);
			return await applyPersistentOperation({
				auditOperation: "config.setRef",
				operation,
				runtime,
				opts,
				run: async (ctx) => {
					await runConfigSetOperation({
						operation,
						ctx
					});
					return {
						summary: `Set config ${operation.path} SecretRef`,
						details: {
							path: operation.path,
							source: operation.source,
							provider: operation.provider ?? "default"
						}
					};
				}
			});
		case "plugin-install": return await executePluginInstall(operation, runtime, opts);
		case "plugin-uninstall": {
			if (await isPluginBackingDefaultInferenceRoute(operation.pluginId)) {
				const message = [`Uninstalling ${operation.pluginId} could remove the provider behind OpenClaw's own active inference route.`, `Removing it has to happen with OpenClaw stopped: run \`openclaw plugins uninstall ${operation.pluginId}\` on the machine running it.`].join("\n");
				runtime.log(message);
				return {
					applied: false,
					message
				};
			}
			const result = await applyPersistentOperation({
				auditOperation: "plugin.uninstall",
				operation,
				runtime,
				opts,
				run: async (ctx) => {
					const runPluginUninstall = ctx.deps?.runPluginUninstall ?? (async (pluginId, pluginRuntime) => {
						const { runPluginUninstallCommand } = await import("./plugins-uninstall-command-6BwSYKWT.js");
						await runPluginUninstallCommand(pluginId, {}, pluginRuntime);
					});
					await ctx.commit(async () => {
						if (await isPluginBackingDefaultInferenceRoute(operation.pluginId)) throw new Error(`Uninstall aborted: ${operation.pluginId} now backs the active inference route. Removing it has to happen with OpenClaw stopped: run \`openclaw plugins uninstall ${operation.pluginId}\` on the machine running it.`);
						await runPluginUninstall(operation.pluginId, createNoExitRuntime(ctx.runtime));
					});
					return {
						summary: `Uninstalled plugin ${operation.pluginId}`,
						details: { pluginId: operation.pluginId }
					};
				}
			});
			if (result.applied) runtime.log("Restart the Gateway to apply plugin changes.");
			return result;
		}
		case "create-agent":
			if (isReservedSystemAgentId(operation.agentId)) throw new Error(`Agent id "${normalizeAgentId(operation.agentId)}" is reserved for the system agent. Choose a different agent id.`);
			if (operation.model?.trim()) throw new Error("OpenClaw cannot save an explicit per-agent model until that new route can be live-tested. Retry without `model`; the new agent inherits the verified default, then use `set_default_model` with agentId to live-test and save its own model.");
			return await applyPersistentOperation({
				auditOperation: "agents.create",
				operation,
				runtime,
				opts,
				run: async (ctx) => {
					const createAgentForOperation = ctx.deps?.createAgent ?? (await import("./agent-create-C2ncr9Iw.js")).createAgent;
					const result = await ctx.commit(async () => {
						return await createAgentForOperation({
							name: operation.agentId,
							...operation.workspace ? { workspace: operation.workspace } : {},
							provenance: {
								createdVia: "agent",
								creatorAgentId: operation.requesterAgentId ?? "openclaw"
							}
						});
					});
					if (result.status === "error") throw new Error(result.message);
					return {
						summary: `Created agent ${result.agentId}`,
						bootstrapPending: result.bootstrapPending,
						agentId: result.agentId,
						details: {
							agentId: result.agentId,
							workspace: result.workspace
						}
					};
				}
			});
		case "doctor":
			await (opts.deps?.runDoctor ?? (await import("./doctor-DIAnTMga.js")).doctorCommand)(runtime, { nonInteractive: true });
			return { applied: false };
		case "doctor-fix":
			runtime.log("Doctor repairs can change the inference route that powers this session, so they run with OpenClaw stopped: `openclaw doctor --fix` on the machine running it.");
			return { applied: false };
		case "status": {
			const { statusCommand } = await import("./status.command-DkehmSCL.js");
			await statusCommand({ timeoutMs: 1e4 }, runtime);
			return { applied: false };
		}
		case "health": {
			const { healthCommand } = await import("./health-CeqxuFQG.js");
			await healthCommand({ timeoutMs: 1e4 }, runtime);
			return { applied: false };
		}
		case "gateway-status": {
			const overview = await loadOverviewForOperation(opts.deps);
			runtime.log(formatGatewayStatusLine(overview));
			return { applied: false };
		}
		case "gateway-start": return await applyPersistentOperation({
			auditOperation: "gateway.start",
			operation,
			runtime,
			opts,
			run: async (ctx) => {
				const runGatewayStart = ctx.deps?.runGatewayStart ?? (() => runGatewayLifecycle("start"));
				await ctx.commit(runGatewayStart);
				return { summary: "Started Gateway" };
			}
		});
		case "gateway-stop": return await applyPersistentOperation({
			auditOperation: "gateway.stop",
			operation,
			runtime,
			opts,
			run: async (ctx) => {
				const runGatewayStop = ctx.deps?.runGatewayStop ?? (() => runGatewayLifecycle("stop"));
				await ctx.commit(runGatewayStop);
				return { summary: "Stopped Gateway" };
			}
		});
		case "gateway-restart": return await applyPersistentOperation({
			auditOperation: "gateway.restart",
			operation,
			runtime,
			opts,
			run: async (ctx) => {
				const gatewayHosted = ctx.deps?.setupSurface === "gateway";
				const runGatewayRestart = ctx.deps?.runGatewayRestart ?? (() => runGatewayLifecycle("restart", gatewayHosted ? "gateway" : void 0));
				if (await ctx.commit(runGatewayRestart) === false) throw new Error("Gateway restart did not complete");
				const summary = gatewayHosted ? "Scheduled Gateway restart" : "Restarted Gateway";
				if (gatewayHosted) ctx.runtime.log(summary);
				return { summary };
			}
		});
		case "open-tui": {
			const overview = await loadOverviewForOperation(opts.deps);
			const agentId = resolveTuiAgentId({
				requestedAgentId: operation.agentId,
				requestedWorkspace: operation.workspace,
				overview
			});
			const session = agentId ? buildAgentMainSessionKey({ agentId }) : void 0;
			const result = await (opts.deps?.runTui ?? (await import("./tui-Cc6OljHQ.js")).runTui)({
				local: !overview.gateway.reachable,
				session,
				deliver: false,
				historyLimit: 200,
				...operation.agentDraft === "hatch" ? { message: t("wizard.finalize.bootstrapHatchMessage") } : {}
			});
			if (result?.exitReason === "return-to-system-agent") {
				runtime.log(result.systemAgentMessage ? `[openclaw] returned from agent with request: ${result.systemAgentMessage}` : "[openclaw] returned from agent");
				return {
					applied: false,
					returnToShell: true,
					nextInput: result.systemAgentMessage
				};
			}
			return {
				applied: false,
				exitsInteractive: true
			};
		}
		case "set-default-model": return await executeSetDefaultModel(operation, runtime, opts);
		default: return { applied: false };
	}
}
//#endregion
export { parseSystemAgentOperation as a, isSystemAgentSensitiveConfigValue as c, isPersistentSystemAgentOperation as i, redactSystemAgentConfigPath as l, describeSystemAgentPersistentOperation as n, validateSystemAgentPluginInstallSpec as o, formatSystemAgentPersistentPlan as r, isInvalidConfigSetOperation as s, executeSystemAgentOperation as t };
