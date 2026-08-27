import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import "./utils-DEqefz4f.js";
import { t as CONFIG_PATH } from "./paths-CqeDjSA4.js";
import { t as formatCliCommand } from "./command-format-Dr_cCOb_.js";
import { t as sanitizeForLog } from "./ansi-DjDeieuH.js";
import { r as normalizeProviderId$1 } from "./provider-id-DMd-TDFp.js";
import "./agent-scope-BizOtGGz.js";
import { n as normalizeAgentId } from "./agent-id-Db0rqw_J.js";
import { d as resolveAgentWorkspaceDir, o as readAgentRosterProperty, x as tryResolveSoleAgentId } from "./agent-scope-config-BdXMWufB.js";
import { t as DEFAULT_ACCOUNT_ID } from "./account-id-BRqK6RmF.js";
import "./session-key-D8GLfPr_.js";
import { J as resolveNormalizedProviderModelMaxTokens, ct as containsAuthoredInclude, lt as isSingleTopLevelIncludeMigration, ot as applyChannelDoctorCompatibilityMigrations, st as classifyOtelGrpcMigrationOwnership } from "./io-CeQckj5v.js";
import { t as createSubsystemLogger } from "./subsystem-CDLhGl2-.js";
import { s as HeartbeatSchema } from "./zod-schema.agent-runtime-Cn77iddo.js";
import { _ as parseLegacySecretRefEnvMarker, u as isLegacySecretRefEnvMarker } from "./types.secrets-BrIfhxSG.js";
import { i as getBundledChannelSetupPlugin, o as hasBundledChannelPackageSetupFeature } from "./bundled-CY1EA4MS.js";
import { r as collectConfiguredModelRefs } from "./configured-model-refs-0XUAFjEF.js";
import { _ as selectedCanonicalModelRefsForRuntimePolicy, d as migrateLegacyWebSearchConfig, f as migrateLegacyXSearchConfig, g as modelEntryWithRuntimePolicy, h as migrateLegacyRuntimeModelRef, l as stripRetiredTuningKnobs, m as listLegacyRuntimeModelProviderAliases, p as legacyRuntimeModelAliasRequiresRuntimePolicy, u as migrateLegacyWebFetchConfig, v as hasOwnKey } from "./legacy-BXBI_5fp.js";
import { r as isLegacyModelsAddCodexMetadataModel } from "./legacy-config-migrations.runtime.models-B0iO1829.js";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BIKs-96s.js";
import { r as retainLegacyDefaultAgentId } from "./legacy.default-agent-owner-D8ws5hED.js";
import { a as isBlockedLegacyCodexModelRef } from "./codex-route-model-ref-0uJOp6W2.js";
import { n as formatConfigIssueLines } from "./issue-format-I3BIXbd4.js";
import { t as migratePersistedImplicitMainRoster } from "./legacy.roster-C_J5B3wB.js";
import { r as normalizeTalkSection } from "./talk-C4-s9E1x.js";
import { t as configIncludeOwnsAgentRoster } from "./agent-roster-provenance-DMVAWWCV.js";
import { i as setPathExistingStrict } from "./path-utils-B8kD15O2.js";
import { n as discoverConfigSecretTargets } from "./target-registry-query-Cu36BxFQ.js";
import "./target-registry-UxdnmGQF.js";
import { s as callGateway } from "./call-D4XcT41c.js";
import { a as runPluginSetupConfigMigrations } from "./setup-registry-DxR0jJ50.js";
import { t as DEFAULT_GOOGLE_API_BASE_URL } from "./google-api-base-url-UBNiBOzj.js";
import { n as resolveSingleAccountPromotion } from "./setup-promotion-helpers-B6epgpo7.js";
import { t as note } from "./note-D7f3pYFE.js";
import { a as noteOpencodeProviderOverrides, c as stripUnknownConfigKeys, i as noteMcpOriginWarning, n as noteImplicitFallbackClobberWarnings, o as noteSandboxOriginProxyWarning } from "./doctor-config-analysis-DulL0xR1.js";
import { t as migrateLegacyConfig } from "./legacy-config-migrate-9_qkVa_5.js";
import { t as runDoctorConfigPreflight } from "./doctor-config-preflight-CVLF8tqj.js";
import { n as cronCodexRuntimePolicyTargetKey } from "./store-migration-zzTHgdxd.js";
import { t as applyDoctorConfigMutation } from "./config-mutation-state-BcUMmqz1.js";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";
//#region src/commands/doctor/emit-notes.ts
/** Strip terminal control sequences from a potentially multi-line doctor note. */
function sanitizeDoctorNote(note) {
	return note.split("\n").map((line) => sanitizeForLog(line)).join("\n");
}
/** Emit grouped doctor change, info, and warning notes with sanitized content. */
function emitDoctorNotes(params) {
	for (const change of params.changeNotes ?? []) params.note(sanitizeDoctorNote(change), "Doctor changes");
	for (const info of params.infoNotes ?? []) params.note(sanitizeDoctorNote(info), "Doctor info");
	for (const warning of params.warningNotes ?? []) params.note(sanitizeDoctorNote(warning), "Doctor warnings");
}
//#endregion
//#region src/commands/doctor/finalize-config-flow.ts
/** Decide whether doctor should write the repaired candidate config or only print hints. */
async function finalizeDoctorConfigFlow(params) {
	if (!params.shouldRepair && params.pendingChanges) {
		if (await params.confirm({
			message: "Apply recommended config repairs now?",
			initialValue: true
		})) return {
			cfg: params.candidate,
			shouldWriteConfig: true
		};
		if (params.fixHints.length > 0) params.note(params.fixHints.join("\n"), "Doctor");
		return {
			cfg: params.cfg,
			shouldWriteConfig: false
		};
	}
	if (params.shouldRepair && params.pendingChanges) return {
		cfg: params.cfg,
		shouldWriteConfig: true
	};
	return {
		cfg: params.cfg,
		shouldWriteConfig: false
	};
}
//#endregion
//#region src/commands/doctor-auth-profile-config.ts
/** Protects active auth profile metadata while doctor repairs broader config state. */
const AUTH_PROFILE_MODES = /* @__PURE__ */ new Set([
	"api_key",
	"aws-sdk",
	"oauth",
	"token"
]);
function normalizeProviderId(value) {
	return normalizeLowercaseStringOrEmpty(value);
}
function normalizeProfileId(value) {
	return normalizeOptionalString(value) ?? null;
}
function normalizeMode(value) {
	return typeof value === "string" && AUTH_PROFILE_MODES.has(value) ? value : null;
}
function extractProviderFromModelRef(value) {
	const { model } = splitTrailingAuthProfile(value);
	const slash = model.indexOf("/");
	if (slash <= 0) return null;
	return normalizeProviderId(model.slice(0, slash)) || null;
}
function extractProviderFromProfileId(profileId) {
	const colon = profileId.indexOf(":");
	if (colon <= 0) return null;
	return normalizeProviderId(profileId.slice(0, colon)) || null;
}
function collectActiveAuthHints(config) {
	const activeProviders = /* @__PURE__ */ new Set();
	const explicitProfileIds = /* @__PURE__ */ new Set();
	const explicitProfileProviders = /* @__PURE__ */ new Map();
	const models = isRecord(config.models) ? config.models : {};
	const providers = isRecord(models.providers) ? models.providers : {};
	for (const providerId of Object.keys(providers)) {
		const normalized = normalizeProviderId(providerId);
		if (normalized) activeProviders.add(normalized);
	}
	for (const { value } of collectConfiguredModelRefs(config)) {
		const { profile } = splitTrailingAuthProfile(value);
		const provider = extractProviderFromModelRef(value);
		if (profile) {
			explicitProfileIds.add(profile);
			if (provider) {
				const providersLocal = explicitProfileProviders.get(profile) ?? /* @__PURE__ */ new Set();
				providersLocal.add(provider);
				explicitProfileProviders.set(profile, providersLocal);
			}
		}
		if (provider) activeProviders.add(provider);
	}
	const auth = isRecord(config.auth) ? config.auth : {};
	const order = isRecord(auth.order) ? auth.order : {};
	for (const [providerId, profileIds] of Object.entries(order)) {
		const provider = normalizeProviderId(providerId);
		if (!provider || !activeProviders.has(provider) || !Array.isArray(profileIds)) continue;
		for (const profileId of profileIds) {
			const normalized = normalizeProfileId(profileId);
			if (normalized) explicitProfileIds.add(normalized);
		}
	}
	return {
		activeProviders,
		explicitProfileIds,
		explicitProfileProviders
	};
}
function isValidProfileMetadata(value) {
	if (!isRecord(value)) return false;
	return normalizeProviderId(value.provider) !== "" && normalizeMode(value.mode) !== null;
}
function buildProfileMetadata(params) {
	const before = isRecord(params.before) ? params.before : {};
	const after = isRecord(params.after) ? params.after : {};
	const provider = normalizeProviderId(after.provider) || normalizeProviderId(before.provider) || extractProviderFromProfileId(params.profileId) || normalizeProviderId(params.providerHint);
	if (!provider) return null;
	const repaired = {
		provider,
		mode: normalizeMode(after.mode) ?? normalizeMode(before.mode) ?? "api_key"
	};
	const email = normalizeOptionalString(after.email) ?? normalizeOptionalString(before.email);
	const displayName = normalizeOptionalString(after.displayName) ?? normalizeOptionalString(before.displayName);
	if (email) repaired.email = email;
	if (displayName) repaired.displayName = displayName;
	return repaired;
}
function ensureAuthProfiles(config) {
	const root = config;
	const auth = isRecord(root.auth) ? root.auth : {};
	if (root.auth !== auth) root.auth = auth;
	if (!isRecord(auth.profiles)) auth.profiles = {};
	return auth.profiles;
}
/**
* Restores valid metadata for auth profiles still referenced by active model config.
*
* Doctor can rebuild or prune auth config; this guard keeps active profiles usable when their
* provider/mode metadata can be inferred from the before/after config or profile id.
*/
function protectActiveAuthProfileConfig(params) {
	const { activeProviders, explicitProfileIds, explicitProfileProviders } = collectActiveAuthHints(params.before);
	const beforeAuth = isRecord(params.before.auth) ? params.before.auth : {};
	const beforeProfiles = isRecord(beforeAuth.profiles) ? beforeAuth.profiles : {};
	if (Object.keys(beforeProfiles).length === 0) return {
		config: params.after,
		repairs: [],
		warnings: []
	};
	const config = structuredClone(params.after);
	const afterAuth = isRecord(config.auth) ? config.auth : {};
	const afterProfiles = isRecord(afterAuth.profiles) ? afterAuth.profiles : {};
	const repairs = [];
	const warnings = [];
	for (const [profileId, beforeProfile] of Object.entries(beforeProfiles)) {
		const afterProfile = afterProfiles[profileId];
		const afterProfileRecord = isRecord(afterProfile) ? afterProfile : null;
		const beforeProfileRecord = isRecord(beforeProfile) ? beforeProfile : null;
		if (isValidProfileMetadata(afterProfile)) continue;
		const provider = normalizeProviderId(afterProfileRecord?.provider) || normalizeProviderId(beforeProfileRecord?.provider) || extractProviderFromProfileId(profileId);
		const protectsActiveProvider = provider !== null && activeProviders.has(provider);
		const protectsExplicitProfile = explicitProfileIds.has(profileId);
		if (!protectsActiveProvider && !protectsExplicitProfile) continue;
		const repaired = buildProfileMetadata({
			profileId,
			before: beforeProfile,
			after: afterProfile,
			providerHint: explicitProfileProviders.get(profileId)?.size === 1 ? [...explicitProfileProviders.get(profileId) ?? []][0] : void 0
		});
		if (!repaired) {
			warnings.push(`auth.profiles.${profileId}: active auth profile metadata could not be inferred; repair manually before running doctor --fix.`);
			continue;
		}
		const profiles = ensureAuthProfiles(config);
		profiles[profileId] = repaired;
		repairs.push(`Repaired auth.profiles.${profileId} metadata for active ${repaired.provider} auth.`);
	}
	return {
		config,
		repairs,
		warnings
	};
}
//#endregion
//#region src/commands/doctor/shared/config-flow-steps.ts
/** Apply legacy config migrations and update preview/fix state for doctor config flow. */
function applyLegacyCompatibilityStep(params) {
	if (params.snapshot.legacyIssues.length === 0) return {
		state: params.state,
		issueLines: [],
		changeLines: []
	};
	const issueLines = formatConfigIssueLines(params.snapshot.legacyIssues, "-");
	const otelOwnership = classifyOtelGrpcMigrationOwnership({
		snapshot: params.snapshot,
		authoredConfig: params.snapshot.parsed,
		resolvedConfig: params.snapshot.sourceConfig
	});
	if (otelOwnership) {
		const ownership = otelOwnership;
		if (ownership.kind === "manual") {
			const otelPath = "diagnostics.otel.protocol";
			const targets = ownership.targetPaths.length > 0 ? ` Inspect these candidate source files and remove or replace ${otelPath} = "grpc" from every definition: ${ownership.targetPaths.join(", ")}.` : ` Remove or replace ${otelPath} = "grpc" in the owning $include directive or included file.`;
			return {
				state: params.state,
				issueLines: [...issueLines, `- ${otelPath}: Doctor cannot safely rewrite this $include ownership.${targets} No config files were changed.`],
				changeLines: [],
				blocksWrite: true
			};
		}
	}
	const hasAuthoredIncludes = containsAuthoredInclude(params.snapshot.parsed);
	const { config: migrated, sourceConfig: migratedSource, changes, partiallyValid } = migrateLegacyConfig(hasAuthoredIncludes ? params.snapshot.sourceConfig : params.snapshot.parsed, {
		authoredRaw: params.snapshot.parsed,
		resolvedRaw: params.snapshot.sourceConfig
	});
	if (!migrated) return {
		state: {
			...params.state,
			pendingChanges: params.state.pendingChanges || params.snapshot.legacyIssues.length > 0,
			fixHints: params.shouldRepair ? params.state.fixHints : [...params.state.fixHints, `Run "${params.doctorFixCommand}" to migrate legacy config keys.`]
		},
		issueLines,
		changeLines: changes
	};
	const migrationCandidate = hasAuthoredIncludes && migratedSource ? migratedSource : migrated;
	return {
		state: {
			cfg: migrationCandidate,
			candidate: migrationCandidate,
			pendingChanges: params.state.pendingChanges || params.snapshot.legacyIssues.length > 0,
			fixHints: params.shouldRepair ? params.state.fixHints : [...params.state.fixHints, `Run "${params.doctorFixCommand}" to ${partiallyValid ? "finish fixing" : "migrate"} legacy config keys.`]
		},
		issueLines,
		changeLines: changes,
		partiallyValid: partiallyValid === true ? true : void 0
	};
}
/** Strip unknown config keys while preserving active auth profile settings. */
function applyUnknownConfigKeyStep(params) {
	const unknown = stripUnknownConfigKeys(params.state.candidate);
	if (unknown.removed.length === 0) return {
		state: params.state,
		removed: [],
		repairs: [],
		warnings: []
	};
	const protectedAuth = protectActiveAuthProfileConfig({
		before: params.state.candidate,
		after: unknown.config
	});
	return {
		state: {
			cfg: params.shouldRepair ? protectedAuth.config : params.state.cfg,
			candidate: protectedAuth.config,
			pendingChanges: true,
			fixHints: params.shouldRepair ? params.state.fixHints : [...params.state.fixHints, `Run "${params.doctorFixCommand}" to remove these keys.`]
		},
		removed: unknown.removed,
		repairs: protectedAuth.repairs,
		warnings: protectedAuth.warnings
	};
}
//#endregion
//#region src/secrets/legacy-secretref-env-marker.ts
function toCandidate(target, defaults) {
	if (!isLegacySecretRefEnvMarker(target.value)) return null;
	return {
		path: target.path,
		pathSegments: target.pathSegments,
		value: target.value.trim(),
		ref: parseLegacySecretRefEnvMarker(target.value, defaults?.env)
	};
}
/**
* Finds legacy env marker strings on registered secret targets without mutating config.
*/
function collectLegacySecretRefEnvMarkerCandidates(config) {
	const defaults = config.secrets?.defaults;
	return discoverConfigSecretTargets(config).map((target) => toCandidate(target, defaults)).filter((candidate) => candidate !== null);
}
/**
* Converts parseable legacy env marker strings into structured env SecretRef objects.
*/
function migrateLegacySecretRefEnvMarkers(config) {
	const candidates = collectLegacySecretRefEnvMarkerCandidates(config).filter((candidate) => candidate.ref !== null);
	if (candidates.length === 0) return {
		config,
		changes: []
	};
	const next = structuredClone(config);
	const changes = [];
	for (const candidate of candidates) {
		const ref = candidate.ref;
		if (!ref) continue;
		if (setPathExistingStrict(next, candidate.pathSegments, ref)) changes.push(`Moved ${candidate.path} ${candidate.value} marker → structured env SecretRef.`);
	}
	return {
		config: next,
		changes
	};
}
//#endregion
//#region src/commands/doctor/shared/legacy-config-binding-repair.ts
function pruneBindingsForMissingAgents(cfg, changes) {
	const agents = cfg.agents?.list;
	const bindings = cfg.bindings;
	if (!Array.isArray(agents) || agents.length === 0 || !Array.isArray(bindings)) return cfg;
	const validAgents = agents.filter((agent) => {
		return agent !== null && typeof agent === "object" && typeof agent.id === "string";
	});
	if (validAgents.length !== agents.length) return cfg;
	const agentIds = new Set(validAgents.map((agent) => normalizeAgentId(agent.id)));
	const nextBindings = bindings.filter((binding) => {
		const agentId = binding && typeof binding === "object" ? binding.agentId : void 0;
		return typeof agentId !== "string" || agentId === "main" || agentIds.has(normalizeAgentId(agentId));
	});
	const removed = bindings.length - nextBindings.length;
	if (removed === 0) return cfg;
	changes.push(`Removed ${removed} binding${removed === 1 ? "" : "s"} that referenced missing agents.list ids.`);
	return {
		...cfg,
		...nextBindings.length > 0 ? { bindings: nextBindings } : { bindings: void 0 }
	};
}
//#endregion
//#region src/channels/plugins/setup-promotion-bundled.ts
/**
* Doctor-only bundled setup promotion surface lookup.
*
* Kept separate so hot Plugin SDK setup helpers never import bundled discovery.
*/
function resolveBundledChannelSetupPromotionSurface(channelKey) {
	if (!hasBundledChannelPackageSetupFeature(channelKey, "configPromotion")) return null;
	const plugin = getBundledChannelSetupPlugin(channelKey);
	const setup = plugin?.setupContract ?? plugin?.setup;
	return setup && typeof setup === "object" ? setup : null;
}
//#endregion
//#region src/commands/doctor/shared/legacy-talk-config-normalizer.ts
function buildLegacyTalkProviderCompat(talk) {
	const compat = {};
	for (const key of [
		"voiceId",
		"voiceAliases",
		"modelId",
		"outputFormat",
		"apiKey"
	]) if (talk[key] !== void 0) compat[key] = talk[key];
	return Object.keys(compat).length > 0 ? compat : void 0;
}
function buildLegacyRealtimeTalkCompat(talk, normalizedTalk) {
	if (talk.realtime !== void 0) return;
	const compat = {};
	for (const key of [
		"model",
		"mode",
		"transport",
		"brain"
	]) if (talk[key] !== void 0) compat[key] = talk[key];
	if (talk.voice !== void 0) compat.speakerVoice = talk.voice;
	if (Object.keys(compat).length === 0) return;
	if (normalizedTalk.provider !== void 0) compat.provider = normalizedTalk.provider;
	if (normalizedTalk.providers !== void 0) compat.providers = normalizedTalk.providers;
	return normalizeTalkSection({ realtime: compat })?.realtime;
}
/** Normalize legacy Talk provider/realtime fields into current talk.providers and talk.realtime. */
function normalizeLegacyTalkConfig(cfg, changes) {
	const rawTalk = cfg.talk;
	if (!isRecord(rawTalk)) return cfg;
	const normalizedTalk = normalizeTalkSection(rawTalk) ?? {};
	const legacyProviderCompat = buildLegacyTalkProviderCompat(rawTalk);
	if (legacyProviderCompat) normalizedTalk.providers = {
		...normalizedTalk.providers,
		elevenlabs: {
			...legacyProviderCompat,
			...normalizedTalk.providers?.elevenlabs
		}
	};
	const legacyRealtimeCompat = buildLegacyRealtimeTalkCompat(rawTalk, normalizedTalk);
	if (legacyRealtimeCompat) normalizedTalk.realtime = {
		...legacyRealtimeCompat,
		...normalizedTalk.realtime
	};
	if (Object.keys(normalizedTalk).length === 0 || isDeepStrictEqual(normalizedTalk, rawTalk)) return cfg;
	changes.push("Normalized talk.provider/providers shape (trimmed provider ids and merged missing compatibility fields).");
	if (legacyRealtimeCompat) changes.push("Moved legacy realtime Talk provider/model fields into talk.realtime.");
	return {
		...cfg,
		talk: normalizedTalk
	};
}
//#endregion
//#region src/commands/doctor/shared/legacy-config-core-normalizers.ts
const INHERITED_ACCOUNT_POLICY_KEYS = [
	"dmPolicy",
	"allowFrom",
	"groupPolicy",
	"groupAllowFrom"
];
const log = createSubsystemLogger("doctor");
/** Migrate legacy browser/Chrome relay config to current browser profile settings. */
function normalizeLegacyBrowserConfig(cfg, changes) {
	const rawBrowser = cfg.browser;
	if (!isRecord(rawBrowser)) return cfg;
	const browser = structuredClone(rawBrowser);
	let browserChanged = false;
	if ("relayBindHost" in browser) {
		delete browser.relayBindHost;
		browserChanged = true;
		changes.push("Removed browser.relayBindHost (legacy Chrome extension relay setting; the extension relay binds loopback on the profile cdpPort).");
	}
	const rawProfiles = browser.profiles;
	if (isRecord(rawProfiles)) {
		const profiles = { ...rawProfiles };
		let profilesChanged = false;
		for (const [profileName, rawProfile] of Object.entries(rawProfiles)) {
			if (!isRecord(rawProfile)) continue;
			if ((normalizeOptionalString(rawProfile.driver) ?? "") !== "extension" || !normalizeOptionalString(rawProfile.cdpUrl)) continue;
			const nextProfile = { ...rawProfile };
			delete nextProfile.cdpUrl;
			profiles[profileName] = nextProfile;
			profilesChanged = true;
			changes.push(`Removed browser.profiles.${profileName}.cdpUrl (extension driver profiles own their relay endpoint).`);
		}
		if (profilesChanged) {
			browser.profiles = profiles;
			browserChanged = true;
		}
	}
	const rawSsrFPolicy = browser.ssrfPolicy;
	if (isRecord(rawSsrFPolicy) && "allowPrivateNetwork" in rawSsrFPolicy) {
		const legacyAllowPrivateNetwork = rawSsrFPolicy.allowPrivateNetwork;
		const currentDangerousAllowPrivateNetwork = rawSsrFPolicy.dangerouslyAllowPrivateNetwork;
		let resolvedDangerousAllowPrivateNetwork = currentDangerousAllowPrivateNetwork;
		if (typeof legacyAllowPrivateNetwork === "boolean" || typeof currentDangerousAllowPrivateNetwork === "boolean") resolvedDangerousAllowPrivateNetwork = legacyAllowPrivateNetwork === true || currentDangerousAllowPrivateNetwork === true;
		else if (currentDangerousAllowPrivateNetwork === void 0) resolvedDangerousAllowPrivateNetwork = legacyAllowPrivateNetwork;
		const nextSsrFPolicy = { ...rawSsrFPolicy };
		delete nextSsrFPolicy.allowPrivateNetwork;
		if (resolvedDangerousAllowPrivateNetwork !== void 0) nextSsrFPolicy.dangerouslyAllowPrivateNetwork = resolvedDangerousAllowPrivateNetwork;
		browser.ssrfPolicy = nextSsrFPolicy;
		browserChanged = true;
		changes.push(`Moved browser.ssrfPolicy.allowPrivateNetwork → browser.ssrfPolicy.dangerouslyAllowPrivateNetwork (${String(resolvedDangerousAllowPrivateNetwork)}).`);
	}
	if (!browserChanged) return cfg;
	return {
		...cfg,
		browser
	};
}
/** Move single-account channel fields into accounts.default when account maps exist. */
function seedMissingDefaultAccountsFromSingleAccountBase(cfg, changes) {
	const channels = cfg.channels;
	if (!channels) return cfg;
	let channelsChanged = false;
	const nextChannels = { ...channels };
	for (const [channelId, rawChannel] of Object.entries(channels)) {
		if (!isRecord(rawChannel)) continue;
		const rawAccounts = rawChannel.accounts;
		if (!isRecord(rawAccounts)) continue;
		const accountKeys = Object.keys(rawAccounts);
		if (accountKeys.length === 0) continue;
		if (accountKeys.some((key) => normalizeOptionalLowercaseString(key) === "default")) continue;
		const promotion = resolveSingleAccountPromotion({
			channelKey: channelId,
			channel: rawChannel,
			resolveBundledSurface: resolveBundledChannelSetupPromotionSurface
		});
		if (promotion.shouldDeferPromotion) {
			log.debug(`Deferring channels.${channelId} single-account promotion until its plugin declares uncovered root keys.`);
			continue;
		}
		const keysToMove = promotion.keysToMove;
		if (keysToMove.length === 0) continue;
		const defaultAccount = {};
		for (const key of keysToMove) {
			const value = rawChannel[key];
			defaultAccount[key] = value && typeof value === "object" ? structuredClone(value) : value;
		}
		const nextChannel = { ...rawChannel };
		for (const key of keysToMove) delete nextChannel[key];
		const inheritedPolicyKeys = INHERITED_ACCOUNT_POLICY_KEYS.filter((key) => keysToMove.includes(key));
		const nextAccounts = {
			...rawAccounts,
			[DEFAULT_ACCOUNT_ID]: defaultAccount
		};
		if (inheritedPolicyKeys.length > 0) for (const [accountId, rawAccount] of Object.entries(rawAccounts)) {
			if (!isRecord(rawAccount)) continue;
			const nextAccount = { ...rawAccount };
			let accountChanged = false;
			for (const key of inheritedPolicyKeys) {
				if (hasOwnKey(nextAccount, key)) continue;
				const value = rawChannel[key];
				nextAccount[key] = value && typeof value === "object" ? structuredClone(value) : value;
				accountChanged = true;
			}
			if (accountChanged) nextAccounts[accountId] = nextAccount;
		}
		nextChannel.accounts = nextAccounts;
		nextChannels[channelId] = nextChannel;
		channelsChanged = true;
		changes.push(`Moved channels.${channelId} single-account top-level values into channels.${channelId}.accounts.default.`);
	}
	if (!channelsChanged) return cfg;
	return {
		...cfg,
		channels: nextChannels
	};
}
const LEGACY_CODEX_CLI_RUNTIME_ID = "codex-cli";
const CODEX_APP_SERVER_RUNTIME_ID = "codex";
function resolveLegacyWholeAgentRuntimePolicy(raw) {
	if (!isRecord(raw)) return;
	const runtime = normalizeOptionalLowercaseString(raw.id);
	if (!runtime || runtime === "auto" || runtime === "openclaw") return;
	const alias = listLegacyRuntimeModelProviderAliases().find((entry) => entry.cli && normalizeProviderId$1(entry.runtime) === runtime);
	return alias ? {
		provider: alias.provider,
		runtime: alias.runtime,
		requiresRuntimePolicy: alias.requiresRuntimePolicy
	} : void 0;
}
function migratedRuntimeRequiresPolicy(legacyProvider) {
	return legacyRuntimeModelAliasRequiresRuntimePolicy(legacyProvider);
}
function mergeModelEntry(legacyEntry, currentEntry) {
	if (!isRecord(legacyEntry) || !isRecord(currentEntry)) return currentEntry ?? legacyEntry;
	return {
		...legacyEntry,
		...currentEntry
	};
}
function normalizeLegacyCodexCliAgentRuntimePolicy(raw) {
	if (!isRecord(raw)) return {
		value: raw,
		changed: false
	};
	if (normalizeOptionalLowercaseString(raw.id) !== LEGACY_CODEX_CLI_RUNTIME_ID) return {
		value: raw,
		changed: false
	};
	return {
		value: {
			...raw,
			id: CODEX_APP_SERVER_RUNTIME_ID
		},
		changed: true
	};
}
function normalizeLegacyRuntimeAgentModelConfig(raw, blockedModelIdentities) {
	if (typeof raw === "string") {
		const migrated = isBlockedLegacyCodexModelRef({
			modelRef: raw,
			blockedModelIdentities
		}) ? null : migrateLegacyRuntimeModelRef(raw);
		return migrated ? {
			value: migrated.ref,
			changed: true,
			selectedRuntime: migrated.runtime,
			selectedRuntimeRequiresPolicy: migratedRuntimeRequiresPolicy(migrated.legacyProvider),
			selectedRefs: [{
				ref: migrated.ref,
				runtime: migrated.runtime,
				requiresRuntimePolicy: migratedRuntimeRequiresPolicy(migrated.legacyProvider)
			}]
		} : {
			value: raw,
			changed: false,
			selectedRuntimeRequiresPolicy: false,
			selectedRefs: []
		};
	}
	if (!isRecord(raw)) return {
		value: raw,
		changed: false,
		selectedRuntimeRequiresPolicy: false,
		selectedRefs: []
	};
	const migratedPrimary = typeof raw.primary === "string" && !isBlockedLegacyCodexModelRef({
		modelRef: raw.primary,
		blockedModelIdentities
	}) ? migrateLegacyRuntimeModelRef(raw.primary) : null;
	let changed = false;
	const next = { ...raw };
	const selectedRefs = [];
	let selectedRuntime = migratedPrimary?.runtime;
	let selectedRuntimeRequiresPolicy = migratedPrimary !== null && migratedRuntimeRequiresPolicy(migratedPrimary.legacyProvider);
	if (migratedPrimary) {
		next.primary = migratedPrimary.ref;
		selectedRefs.push({
			ref: migratedPrimary.ref,
			runtime: migratedPrimary.runtime,
			requiresRuntimePolicy: migratedRuntimeRequiresPolicy(migratedPrimary.legacyProvider)
		});
		changed = true;
	}
	if (Array.isArray(raw.fallbacks)) next.fallbacks = raw.fallbacks.map((fallback) => {
		if (typeof fallback !== "string") return fallback;
		const migratedFallback = isBlockedLegacyCodexModelRef({
			modelRef: fallback,
			blockedModelIdentities
		}) ? null : migrateLegacyRuntimeModelRef(fallback);
		if (migratedFallback && (migratedFallback.runtime === selectedRuntime || migratedFallback.legacyProvider === LEGACY_CODEX_CLI_RUNTIME_ID)) {
			selectedRuntime ??= migratedFallback.runtime;
			selectedRuntimeRequiresPolicy ||= migratedRuntimeRequiresPolicy(migratedFallback.legacyProvider);
			selectedRefs.push({
				ref: migratedFallback.ref,
				runtime: migratedFallback.runtime,
				requiresRuntimePolicy: migratedRuntimeRequiresPolicy(migratedFallback.legacyProvider)
			});
			changed = true;
			return migratedFallback.ref;
		}
		return fallback;
	});
	if (!changed) return {
		value: raw,
		changed: false,
		selectedRuntimeRequiresPolicy: false,
		selectedRefs: []
	};
	return {
		value: next,
		changed: true,
		selectedRuntime,
		selectedRuntimeRequiresPolicy,
		selectedRefs
	};
}
function runtimeNeedsExplicitModelPolicy(runtime) {
	return Boolean(runtime && runtime !== "codex");
}
function mergeModelEntryWithRuntimePolicy(legacyEntry, currentEntry, runtime, requiresRuntimePolicy = runtimeNeedsExplicitModelPolicy(runtime)) {
	const merged = mergeModelEntry(legacyEntry, currentEntry);
	return runtime && requiresRuntimePolicy ? modelEntryWithRuntimePolicy(merged, runtime).entry : merged;
}
function normalizeLegacyRuntimeAllowlistModels(rawModels, selectedRuntime, selectedRuntimeRequiresPolicy, blockedModelIdentities) {
	if (!isRecord(rawModels)) return {
		value: rawModels,
		changed: false
	};
	let changed = false;
	const next = {};
	const legacyEntries = [];
	for (const [rawKey, entry] of Object.entries(rawModels)) {
		const migrated = isBlockedLegacyCodexModelRef({
			modelRef: rawKey,
			blockedModelIdentities
		}) ? null : migrateLegacyRuntimeModelRef(rawKey);
		if (migrated && (migrated.runtime === selectedRuntime || migrated.legacyProvider === LEGACY_CODEX_CLI_RUNTIME_ID)) {
			changed = true;
			next[rawKey] = mergeModelEntry(entry, next[rawKey]);
			legacyEntries.push({
				migratedKey: migrated.ref,
				entry,
				runtime: migrated.runtime,
				requiresRuntimePolicy: migratedRuntimeRequiresPolicy(migrated.legacyProvider)
			});
			continue;
		}
		next[rawKey] = mergeModelEntry(entry, next[rawKey]);
	}
	for (const { migratedKey, entry, runtime, requiresRuntimePolicy } of legacyEntries) next[migratedKey] = mergeModelEntryWithRuntimePolicy(entry, next[migratedKey], runtime, requiresRuntimePolicy || runtime === selectedRuntime && selectedRuntimeRequiresPolicy);
	return {
		value: next,
		changed
	};
}
function ensureSelectedModelRuntimePolicies(rawModels, selectedRefs) {
	if (selectedRefs.length === 0) return {
		value: rawModels,
		changed: false
	};
	const next = isRecord(rawModels) ? { ...rawModels } : {};
	let changed = false;
	for (const { ref, runtime, requiresRuntimePolicy } of selectedRefs) {
		if (!requiresRuntimePolicy) continue;
		const current = next[ref];
		const updated = modelEntryWithRuntimePolicy(current, runtime);
		if (!updated.changed) continue;
		next[ref] = updated.entry;
		changed = true;
	}
	return {
		value: next,
		changed
	};
}
function normalizeLegacyCodexCliRuntimePinsInModels(rawModels, path, changes) {
	if (!isRecord(rawModels)) return {
		value: rawModels,
		changed: false
	};
	let changed = false;
	const next = { ...rawModels };
	for (const [modelRef, rawEntry] of Object.entries(rawModels)) {
		if (!isRecord(rawEntry)) continue;
		const runtime = normalizeLegacyCodexCliAgentRuntimePolicy(rawEntry.agentRuntime);
		if (!runtime.changed) continue;
		next[modelRef] = {
			...rawEntry,
			agentRuntime: runtime.value
		};
		changed = true;
		changes.push(`Moved ${path}.${sanitizeForLog(modelRef)} agentRuntime.id from codex-cli to codex.`);
	}
	return {
		value: next,
		changed
	};
}
function normalizeLegacyRuntimeAgentContainer(raw, path, changes, blockedModelIdentities) {
	let changed = false;
	const next = { ...raw };
	const legacyWholeAgentRuntime = resolveLegacyWholeAgentRuntimePolicy(raw.agentRuntime);
	const model = normalizeLegacyRuntimeAgentModelConfig(raw.model, blockedModelIdentities);
	if (model.changed) {
		next.model = model.value;
		changed = true;
		const runtimeSuffix = model.selectedRuntime ? ` and selected ${model.selectedRuntime} runtime` : "";
		changes.push(`Moved ${path}.model legacy runtime primary refs to canonical provider refs${runtimeSuffix}.`);
	}
	const models = normalizeLegacyRuntimeAllowlistModels(raw.models, model.selectedRuntime, model.selectedRuntimeRequiresPolicy, blockedModelIdentities);
	if (models.changed) {
		next.models = models.value;
		changed = true;
		changes.push(`Moved ${path}.models legacy runtime keys to canonical provider keys.`);
	}
	if (model.selectedRuntime) {
		const modelRuntimes = ensureSelectedModelRuntimePolicies(next.models, model.selectedRefs);
		if (modelRuntimes.changed) {
			next.models = modelRuntimes.value;
			changed = true;
			changes.push(`Selected ${model.selectedRuntime} runtime for ${path}.models entries.`);
		}
	}
	if (legacyWholeAgentRuntime) {
		const selectedRefs = selectedCanonicalModelRefsForRuntimePolicy(next.model ?? raw.model, legacyWholeAgentRuntime.provider).map((ref) => ({
			ref,
			runtime: legacyWholeAgentRuntime.runtime,
			requiresRuntimePolicy: legacyWholeAgentRuntime.requiresRuntimePolicy
		}));
		const modelRuntimes = ensureSelectedModelRuntimePolicies(next.models, selectedRefs);
		if (modelRuntimes.changed) {
			next.models = modelRuntimes.value;
			changed = true;
			changes.push(`Moved ${path}.agentRuntime.id ${legacyWholeAgentRuntime.runtime} to matching ${legacyWholeAgentRuntime.provider} model runtime policy.`);
		}
	}
	const codexCliRuntimePins = normalizeLegacyCodexCliRuntimePinsInModels(next.models, `${path}.models`, changes);
	if (codexCliRuntimePins.changed) {
		next.models = codexCliRuntimePins.value;
		changed = true;
	}
	return {
		value: next,
		changed
	};
}
function normalizeLegacyCodexCliProviderRuntimePins(cfg, changes) {
	const rawModels = cfg.models;
	if (!isRecord(rawModels) || !isRecord(rawModels.providers)) return {
		config: cfg,
		changed: false
	};
	let changed = false;
	const nextProviders = { ...rawModels.providers };
	for (const [providerId, rawProvider] of Object.entries(rawModels.providers)) {
		if (!isRecord(rawProvider)) continue;
		let providerChanged = false;
		const nextProvider = { ...rawProvider };
		const providerRuntime = normalizeLegacyCodexCliAgentRuntimePolicy(rawProvider.agentRuntime);
		if (providerRuntime.changed) {
			nextProvider.agentRuntime = providerRuntime.value;
			providerChanged = true;
			changes.push(`Moved models.providers.${sanitizeForLog(providerId)} agentRuntime.id from codex-cli to codex.`);
		}
		if (Array.isArray(rawProvider.models)) {
			const nextProviderModels = rawProvider.models.map((entry, index) => {
				if (!isRecord(entry)) return entry;
				const runtime = normalizeLegacyCodexCliAgentRuntimePolicy(entry.agentRuntime);
				if (!runtime.changed) return entry;
				providerChanged = true;
				const modelId = normalizeOptionalString(entry.id) ?? `[${index}]`;
				changes.push(`Moved models.providers.${sanitizeForLog(providerId)}.models.${sanitizeForLog(modelId)} agentRuntime.id from codex-cli to codex.`);
				return Object.assign({}, entry, { agentRuntime: runtime.value });
			});
			if (providerChanged) nextProvider.models = nextProviderModels;
		}
		if (providerChanged) {
			nextProviders[providerId] = nextProvider;
			changed = true;
		}
	}
	return changed ? {
		config: {
			...cfg,
			models: {
				...rawModels,
				providers: nextProviders
			}
		},
		changed: true
	} : {
		config: cfg,
		changed: false
	};
}
/** Move legacy runtime-tagged model/provider refs onto current agentRuntime policy fields. */
function normalizeLegacyRuntimeModelRefs(cfg, changes, blockedModelIdentities) {
	const cfgWithProviders = normalizeLegacyCodexCliProviderRuntimePins(cfg, changes).config;
	const rawAgents = cfgWithProviders.agents;
	if (!isRecord(rawAgents)) return cfgWithProviders;
	let changed = false;
	const nextAgents = { ...rawAgents };
	if (isRecord(rawAgents.defaults)) {
		const defaults = normalizeLegacyRuntimeAgentContainer(rawAgents.defaults, "agents.defaults", changes, blockedModelIdentities);
		if (defaults.changed) {
			nextAgents.defaults = defaults.value;
			changed = true;
		}
	}
	if (Array.isArray(rawAgents.list)) {
		const nextList = rawAgents.list.map((entry, index) => {
			if (!isRecord(entry)) return entry;
			const agentId = normalizeOptionalString(entry.id);
			const agent = normalizeLegacyRuntimeAgentContainer(entry, agentId ? `agents.list.${sanitizeForLog(agentId)}` : `agents.list[${index}]`, changes, blockedModelIdentities);
			if (agent.changed) {
				changed = true;
				return agent.value;
			}
			return entry;
		});
		if (changed) nextAgents.list = nextList;
	}
	return changed ? {
		...cfgWithProviders,
		agents: nextAgents
	} : cfgWithProviders;
}
/** Add missing metadata source markers to legacy OpenAI Codex model catalog entries. */
function normalizeLegacyOpenAICodexModelsAddMetadata(cfg, changes) {
	const rawModels = cfg.models;
	if (!isRecord(rawModels) || !isRecord(rawModels.providers)) return cfg;
	const rawProviders = rawModels.providers;
	let providersChanged = false;
	const nextProviders = { ...rawProviders };
	for (const [providerId, rawProvider] of Object.entries(rawProviders)) {
		if (normalizeProviderId$1(providerId) !== "openai-codex" || !isRecord(rawProvider)) continue;
		const rawProviderModels = rawProvider.models;
		if (!Array.isArray(rawProviderModels)) continue;
		let providerChanged = false;
		const nextModels = [];
		for (const model of rawProviderModels) if (isRecord(model) && !("metadataSource" in model) && isLegacyModelsAddCodexMetadataModel({
			provider: providerId,
			model
		})) {
			providerChanged = true;
			const safeProviderId = sanitizeForLog(providerId);
			const safeModelId = sanitizeForLog(normalizeOptionalString(model.id) ?? "unknown");
			changes.push(`Marked models.providers.${safeProviderId}.models.${safeModelId} as /models add metadata so official OpenAI Codex metadata can override it.`);
			nextModels.push(Object.assign({}, model, { metadataSource: "models-add" }));
		} else nextModels.push(model);
		if (!providerChanged) continue;
		nextProviders[providerId] = {
			...rawProvider,
			models: nextModels
		};
		providersChanged = true;
	}
	if (!providersChanged) return cfg;
	return {
		...cfg,
		models: {
			...rawModels,
			providers: nextProviders
		}
	};
}
/** Rename legacy OpenAI API identifiers to the current completion/chat API ids. */
function normalizeLegacyOpenAIModelProviderApi(cfg, changes) {
	const rawModels = cfg.models;
	if (!isRecord(rawModels) || !isRecord(rawModels.providers)) return cfg;
	const rawProviders = rawModels.providers;
	let providersChanged = false;
	const nextProviders = { ...rawProviders };
	for (const [providerId, rawProvider] of Object.entries(rawProviders)) {
		if (!isRecord(rawProvider)) continue;
		let providerChanged = false;
		const nextProvider = { ...rawProvider };
		if (nextProvider.api === "openai") {
			nextProvider.api = "openai-completions";
			providerChanged = true;
			changes.push(`Moved models.providers.${sanitizeForLog(providerId)}.api "openai" → "openai-completions".`);
		}
		const rawProviderModels = rawProvider.models;
		if (Array.isArray(rawProviderModels)) {
			let modelsChanged = false;
			const nextModels = [];
			rawProviderModels.forEach((model, index) => {
				if (!isRecord(model) || model.api !== "openai") {
					nextModels.push(model);
					return;
				}
				modelsChanged = true;
				changes.push(`Moved models.providers.${sanitizeForLog(providerId)}.models[${index}].api "openai" → "openai-completions".`);
				nextModels.push({
					...model,
					api: "openai-completions"
				});
			});
			if (modelsChanged) {
				nextProvider.models = nextModels;
				providerChanged = true;
			}
		}
		if (!providerChanged) continue;
		nextProviders[providerId] = nextProvider;
		providersChanged = true;
	}
	if (!providersChanged) return cfg;
	return {
		...cfg,
		models: {
			...rawModels,
			providers: nextProviders
		}
	};
}
/** Remove retired bundled nano-banana skill config after migrating image generation models. */
function normalizeLegacyNanoBananaSkill(cfg, changes) {
	const NANO_BANANA_SKILL_KEY = "nano-banana-pro";
	const NANO_BANANA_MODEL = "google/gemini-3-pro-image-preview";
	const rawSkills = cfg.skills;
	if (!isRecord(rawSkills)) return cfg;
	let next = cfg;
	let skillsChanged = false;
	const skills = structuredClone(rawSkills);
	if (Array.isArray(skills.allowBundled)) {
		const allowBundled = skills.allowBundled.filter((value) => typeof value !== "string" || value.trim() !== NANO_BANANA_SKILL_KEY);
		if (allowBundled.length !== skills.allowBundled.length) {
			if (allowBundled.length === 0) {
				delete skills.allowBundled;
				changes.push(`Removed skills.allowBundled entry for ${NANO_BANANA_SKILL_KEY}.`);
			} else {
				skills.allowBundled = allowBundled;
				changes.push(`Removed ${NANO_BANANA_SKILL_KEY} from skills.allowBundled.`);
			}
			skillsChanged = true;
		}
	}
	const rawEntries = skills.entries;
	if (!isRecord(rawEntries)) {
		if (!skillsChanged) return cfg;
		return {
			...cfg,
			skills
		};
	}
	const rawLegacyEntry = rawEntries[NANO_BANANA_SKILL_KEY];
	if (!isRecord(rawLegacyEntry)) {
		if (!skillsChanged) return cfg;
		return {
			...cfg,
			skills
		};
	}
	if (next.agents?.defaults?.mediaModels?.image === void 0) {
		next = {
			...next,
			agents: {
				...next.agents,
				defaults: {
					...next.agents?.defaults,
					mediaModels: {
						...next.agents?.defaults?.mediaModels,
						image: { primary: NANO_BANANA_MODEL }
					}
				}
			}
		};
		changes.push(`Moved skills.entries.${NANO_BANANA_SKILL_KEY} → agents.defaults.mediaModels.image.primary (${NANO_BANANA_MODEL}).`);
	}
	const legacyEnvApiKey = normalizeOptionalString((isRecord(rawLegacyEntry.env) ? rawLegacyEntry.env : void 0)?.GEMINI_API_KEY) ?? "";
	const legacyApiKey = legacyEnvApiKey || (typeof rawLegacyEntry.apiKey === "string" ? normalizeOptionalString(rawLegacyEntry.apiKey) : rawLegacyEntry.apiKey && isRecord(rawLegacyEntry.apiKey) ? structuredClone(rawLegacyEntry.apiKey) : void 0);
	const rawModels = isRecord(next.models) ? structuredClone(next.models) : {};
	const rawProviders = isRecord(rawModels.providers) ? { ...rawModels.providers } : {};
	const rawGoogle = isRecord(rawProviders.google) ? { ...rawProviders.google } : {};
	if (!(rawGoogle.apiKey !== void 0) && legacyApiKey) {
		rawGoogle.apiKey = legacyApiKey;
		if (!rawGoogle.baseUrl) rawGoogle.baseUrl = DEFAULT_GOOGLE_API_BASE_URL;
		if (!Array.isArray(rawGoogle.models)) rawGoogle.models = [];
		rawProviders.google = rawGoogle;
		rawModels.providers = rawProviders;
		next = {
			...next,
			models: rawModels
		};
		changes.push(`Moved skills.entries.${NANO_BANANA_SKILL_KEY}.${legacyEnvApiKey ? "env.GEMINI_API_KEY" : "apiKey"} → models.providers.google.apiKey.`);
	}
	const entries = { ...rawEntries };
	delete entries[NANO_BANANA_SKILL_KEY];
	if (Object.keys(entries).length === 0) delete skills.entries;
	else skills.entries = entries;
	changes.push(`Removed legacy skills.entries.${NANO_BANANA_SKILL_KEY}.`);
	skillsChanged = true;
	if (Object.keys(skills).length === 0) {
		const { skills: _ignored, ...rest } = next;
		return rest;
	}
	if (!skillsChanged) return next;
	return {
		...next,
		skills
	};
}
function normalizeConfiguredPositiveInteger(value) {
	if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) return;
	return Math.floor(value);
}
function resolveConfiguredOllamaModelNumCtxBudget(params) {
	const modelContextWindow = normalizeConfiguredPositiveInteger(params.model.contextWindow);
	if (modelContextWindow !== void 0) return modelContextWindow;
	const providerContextWindow = normalizeConfiguredPositiveInteger(params.provider.contextWindow);
	if (providerContextWindow !== void 0) return params.providerNumCtxApplies ? void 0 : providerContextWindow;
	const modelMaxTokens = normalizeConfiguredPositiveInteger(params.model.maxTokens);
	if (modelMaxTokens !== void 0) return modelMaxTokens;
	const providerMaxTokens = normalizeConfiguredPositiveInteger(params.provider.maxTokens);
	if (providerMaxTokens !== void 0) return params.providerNumCtxApplies ? void 0 : providerMaxTokens;
}
function resolveConfiguredOllamaProviderNumCtxBudget(provider) {
	return normalizeConfiguredPositiveInteger(provider.contextWindow) ?? normalizeConfiguredPositiveInteger(provider.maxTokens);
}
function isNativeOllamaProviderConfig(_providerId, provider) {
	return normalizeOptionalLowercaseString(provider.api) === "ollama";
}
function isNativeOllamaModelConfig(params) {
	const modelApi = normalizeOptionalLowercaseString(params.model.api);
	if (modelApi) return modelApi === "ollama";
	const providerApi = normalizeOptionalLowercaseString(params.provider.api);
	if (providerApi) return providerApi === "ollama";
	return false;
}
function hasConfiguredOllamaProviderNumCtx(provider) {
	const rawParams = provider.params;
	return isRecord(rawParams) && hasOwnKey(rawParams, "num_ctx");
}
function applyLegacyOllamaProviderNumCtxParams(params) {
	if (!isNativeOllamaProviderConfig(params.providerId, params.provider)) return {
		provider: params.provider,
		changed: false
	};
	const rawParams = params.provider.params;
	if (rawParams !== void 0 && !isRecord(rawParams)) return {
		provider: params.provider,
		changed: false
	};
	if (rawParams && hasOwnKey(rawParams, "num_ctx")) return {
		provider: params.provider,
		changed: false
	};
	const numCtx = resolveConfiguredOllamaProviderNumCtxBudget(params.provider);
	if (numCtx === void 0) return {
		provider: params.provider,
		changed: false
	};
	params.changes.push(`Set models.providers.${sanitizeForLog(params.providerId)}.params.num_ctx to ${numCtx} for native Ollama compatibility.`);
	return {
		provider: {
			...params.provider,
			params: rawParams ? {
				...rawParams,
				num_ctx: numCtx
			} : { num_ctx: numCtx }
		},
		changed: true
	};
}
/** Seed native Ollama num_ctx params from legacy context-token budgets. */
function normalizeLegacyOllamaNativeNumCtxParams(cfg, changes) {
	const rawProviders = cfg.models?.providers;
	if (!isRecord(rawProviders)) return cfg;
	let providersChanged = false;
	const nextProviders = { ...rawProviders };
	for (const [providerId, rawProvider] of Object.entries(rawProviders)) {
		if (!isRecord(rawProvider)) continue;
		const rawModels = rawProvider.models;
		if (!Array.isArray(rawModels)) continue;
		const providerParams = applyLegacyOllamaProviderNumCtxParams({
			providerId,
			provider: rawProvider,
			changes
		});
		const providerNumCtxApplies = isNativeOllamaProviderConfig(providerId, providerParams.provider) && hasConfiguredOllamaProviderNumCtx(providerParams.provider);
		if (rawModels.length === 0) {
			if (!providerParams.changed) continue;
			nextProviders[providerId] = providerParams.provider;
			providersChanged = true;
			continue;
		}
		let modelsChanged = false;
		const nextModels = rawModels.map((model, index) => {
			if (!isRecord(model)) return model;
			if (!isNativeOllamaModelConfig({
				providerId,
				provider: providerParams.provider,
				model
			})) return model;
			const rawParams = model.params;
			if (rawParams !== void 0 && !isRecord(rawParams)) return model;
			if (rawParams && hasOwnKey(rawParams, "num_ctx")) return model;
			const numCtx = resolveConfiguredOllamaModelNumCtxBudget({
				model,
				provider: providerParams.provider,
				providerNumCtxApplies
			});
			if (numCtx === void 0) return model;
			modelsChanged = true;
			changes.push(`Set models.providers.${sanitizeForLog(providerId)}.models[${index}].params.num_ctx to ${numCtx} for native Ollama compatibility.`);
			return Object.assign({}, model, { params: rawParams ? {
				...rawParams,
				num_ctx: numCtx
			} : { num_ctx: numCtx } });
		});
		if (!modelsChanged && !providerParams.changed) continue;
		nextProviders[providerId] = {
			...providerParams.provider,
			models: nextModels
		};
		providersChanged = true;
	}
	if (!providersChanged) return cfg;
	return {
		...cfg,
		models: {
			...cfg.models,
			providers: nextProviders
		}
	};
}
const MISTRAL_MODEL_CACHE_READ_COST_BY_ID = {
	"codestral-latest": .03,
	"devstral-medium-latest": .04,
	"magistral-small": .05,
	"mistral-large-latest": .05,
	"mistral-medium-2508": .04,
	"mistral-medium-3-5": .15,
	"mistral-small-latest": .01,
	"pixtral-large-latest": .2
};
function normalizeLegacyMistralModelCost(params) {
	const cost = params.model.cost;
	if (!isRecord(cost) || cost.cacheRead !== 0) return {
		model: params.model,
		changed: false
	};
	const normalizedCacheRead = MISTRAL_MODEL_CACHE_READ_COST_BY_ID[params.modelId.toLowerCase()];
	if (normalizedCacheRead === void 0) return {
		model: params.model,
		changed: false
	};
	params.changes.push(`Normalized models.providers.${sanitizeForLog(params.providerId)}.models[${params.index}].cost.cacheRead (0 → ${normalizedCacheRead}) for Mistral prompt-cache billing.`);
	return {
		model: {
			...params.model,
			cost: {
				...cost,
				cacheRead: normalizedCacheRead
			}
		},
		changed: true
	};
}
/** Normalize stale Mistral model defaults such as prompt-cache read cost. */
function normalizeLegacyMistralModelDefaults(cfg, changes) {
	const rawProviders = cfg.models?.providers;
	if (!isRecord(rawProviders)) return cfg;
	let providersChanged = false;
	const nextProviders = { ...rawProviders };
	for (const [providerId, rawProvider] of Object.entries(rawProviders)) {
		if (normalizeProviderId$1(providerId) !== "mistral" || !isRecord(rawProvider)) continue;
		const rawModels = rawProvider.models;
		if (!Array.isArray(rawModels)) continue;
		let modelsChanged = false;
		const nextModels = rawModels.map((model, index) => {
			if (!isRecord(model)) return model;
			const modelId = normalizeOptionalString(model.id) ?? "";
			if (!modelId) return model;
			let nextModel = model;
			let modelChanged = false;
			const contextWindow = typeof model.contextWindow === "number" && Number.isFinite(model.contextWindow) ? model.contextWindow : null;
			const maxTokens = typeof model.maxTokens === "number" && Number.isFinite(model.maxTokens) ? model.maxTokens : null;
			if (contextWindow !== null && maxTokens !== null) {
				const normalizedMaxTokens = resolveNormalizedProviderModelMaxTokens({
					providerId,
					modelId,
					contextWindow,
					rawMaxTokens: maxTokens
				});
				if (normalizedMaxTokens !== maxTokens) {
					nextModel = Object.assign({}, nextModel, { maxTokens: normalizedMaxTokens });
					modelChanged = true;
					changes.push(`Normalized models.providers.${providerId}.models[${index}].maxTokens (${maxTokens} → ${normalizedMaxTokens}) to avoid Mistral context-window rejects.`);
				}
			}
			const costNormalization = normalizeLegacyMistralModelCost({
				providerId,
				model: nextModel,
				modelId,
				index,
				changes
			});
			if (costNormalization.changed) {
				nextModel = costNormalization.model;
				modelChanged = true;
			}
			if (modelChanged) modelsChanged = true;
			return modelChanged ? nextModel : model;
		});
		if (!modelsChanged) continue;
		nextProviders[providerId] = {
			...rawProvider,
			models: nextModels
		};
		providersChanged = true;
	}
	if (!providersChanged) return cfg;
	return {
		...cfg,
		models: {
			...cfg.models,
			providers: nextProviders
		}
	};
}
//#endregion
//#region src/commands/doctor/shared/legacy-config-compatibility-base.ts
/** Run common compatibility migrations before caller-specific setup/channel passes. */
function normalizeBaseCompatibilityConfigValues(cfg, changes, afterBrowser, blockedModelIdentities) {
	let next = seedMissingDefaultAccountsFromSingleAccountBase(cfg, changes);
	next = normalizeLegacyBrowserConfig(next, changes);
	next = afterBrowser ? afterBrowser(next) : next;
	for (const migrate of [
		migrateLegacyWebSearchConfig,
		migrateLegacyWebFetchConfig,
		migrateLegacyXSearchConfig
	]) {
		const migrated = migrate(next);
		if (migrated.changes.length === 0) continue;
		next = migrated.config;
		changes.push(...migrated.changes);
	}
	next = normalizeLegacyNanoBananaSkill(next, changes);
	next = normalizeLegacyTalkConfig(next, changes);
	next = normalizeLegacyOpenAIModelProviderApi(next, changes);
	next = normalizeLegacyRuntimeModelRefs(next, changes, blockedModelIdentities);
	next = normalizeLegacyOllamaNativeNumCtxParams(next, changes);
	return normalizeLegacyMistralModelDefaults(next, changes);
}
//#endregion
//#region src/commands/doctor/shared/reserved-mcp-server-name-migrate.ts
const RESERVED_MCP_SERVER_NAME = "__proto__";
function resolveMcpServers(raw, nodeHost) {
	if (!isRecord(raw)) return;
	const owner = nodeHost ? raw.nodeHost : raw;
	if (!isRecord(owner)) return;
	const mcp = isRecord(owner.mcp) ? owner.mcp : void 0;
	return isRecord(mcp?.servers) ? mcp.servers : void 0;
}
/** Drop reserved MCP server names before canonical config validation runs. */
function migrateReservedMcpServerNames(cfg, sourceRaw = cfg) {
	const locations = [{
		path: "mcp.servers",
		nodeHost: false
	}, {
		path: "nodeHost.mcp.servers",
		nodeHost: true
	}].filter(({ nodeHost }) => [sourceRaw, cfg].some((value) => Object.hasOwn(resolveMcpServers(value, nodeHost) ?? {}, RESERVED_MCP_SERVER_NAME)));
	if (locations.length === 0) return {
		config: cfg,
		changes: []
	};
	const next = structuredClone(cfg);
	const changes = [];
	for (const { path, nodeHost } of locations) {
		const servers = resolveMcpServers(next, nodeHost);
		if (servers) delete servers[RESERVED_MCP_SERVER_NAME];
		changes.push(`Dropped MCP server "${RESERVED_MCP_SERVER_NAME}" from ${path} because the name is reserved; re-add it under a different name.`);
	}
	return {
		config: next,
		changes
	};
}
//#endregion
//#region src/commands/doctor/shared/legacy-config-core-migrate.ts
function repairInvalidHeartbeatActiveHours(cfg, changes) {
	const repairHeartbeat = (heartbeat, path) => {
		if (!heartbeat || typeof heartbeat !== "object" || Array.isArray(heartbeat)) return {
			value: heartbeat,
			changed: false
		};
		const record = heartbeat;
		if (!Object.hasOwn(record, "activeHours")) return {
			value: heartbeat,
			changed: false
		};
		if (HeartbeatSchema.safeParse({ activeHours: record.activeHours }).success) return {
			value: heartbeat,
			changed: false
		};
		const { activeHours: _activeHours, ...rest } = record;
		changes.push(`Removed invalid ${path}.activeHours; heartbeats will use unrestricted hours until it is reconfigured.`);
		return {
			value: rest,
			changed: true
		};
	};
	const defaultsHeartbeat = repairHeartbeat(cfg.agents?.defaults?.heartbeat, "agents.defaults.heartbeat");
	const agents = cfg.agents?.list;
	let listChanged = false;
	const nextAgents = Array.isArray(agents) ? agents.map((agent, index) => {
		if (!agent || typeof agent !== "object") return agent;
		const repaired = repairHeartbeat(agent.heartbeat, `agents.list[${index}].heartbeat`);
		if (!repaired.changed) return agent;
		listChanged = true;
		return {
			...agent,
			heartbeat: repaired.value
		};
	}) : agents;
	if (!defaultsHeartbeat.changed && !listChanged) return cfg;
	return {
		...cfg,
		agents: {
			...cfg.agents,
			...defaultsHeartbeat.changed ? { defaults: {
				...cfg.agents?.defaults,
				heartbeat: defaultsHeartbeat.value
			} } : {},
			...listChanged ? { list: nextAgents } : {}
		}
	};
}
function repairNullAgentWorkspaces(cfg, changes) {
	const agents = cfg.agents?.list;
	if (!Array.isArray(agents)) return cfg;
	let repaired = 0;
	const nextAgents = agents.map((agent) => {
		if (agent && typeof agent === "object" && agent.workspace === null) {
			repaired += 1;
			const { workspace: _workspace, ...rest } = agent;
			return rest;
		}
		return agent;
	});
	if (repaired === 0) return cfg;
	changes.push(`Removed null workspace value${repaired === 1 ? "" : "s"} from agents.list entr${repaired === 1 ? "y" : "ies"}.`);
	return {
		...cfg,
		agents: {
			...cfg.agents,
			list: nextAgents
		}
	};
}
/** Normalize current config through core, plugin setup, channel, and secret-ref migrations. */
function normalizeCompatibilityConfigValues(cfg, options = {}) {
	const changes = [];
	const reservedMcpServerNames = migrateReservedMcpServerNames(cfg, options.sourceRaw);
	changes.push(...reservedMcpServerNames.changes);
	let next = normalizeBaseCompatibilityConfigValues(reservedMcpServerNames.config, changes, (config) => {
		const setupMigration = runPluginSetupConfigMigrations({ config });
		if (setupMigration.changes.length === 0) return config;
		changes.push(...setupMigration.changes);
		return setupMigration.config;
	}, options.blockedModelIdentities);
	const tuningCandidate = structuredClone(next);
	if (stripRetiredTuningKnobs(tuningCandidate)) {
		next = tuningCandidate;
		changes.push("Removed retired runtime tuning knobs; built-in defaults now apply.");
	}
	const channelMigrations = applyChannelDoctorCompatibilityMigrations(next);
	if (channelMigrations.changes.length > 0) {
		next = channelMigrations.next;
		changes.push(...channelMigrations.changes);
	}
	const secretRefMarkers = migrateLegacySecretRefEnvMarkers(next);
	if (secretRefMarkers.changes.length > 0) {
		next = secretRefMarkers.config;
		changes.push(...secretRefMarkers.changes);
	}
	next = normalizeLegacyOpenAICodexModelsAddMetadata(next, changes);
	next = repairInvalidHeartbeatActiveHours(next, changes);
	next = repairNullAgentWorkspaces(next, changes);
	next = pruneBindingsForMissingAgents(next, changes);
	return {
		config: next,
		changes
	};
}
//#endregion
//#region src/commands/doctor-config-flow.ts
/** Main doctor config flow: preflight, migrations, previews, repairs, and final write decision. */
function collectInvalidHookTransformsDirWarnings(cfg, configPath) {
	const transformsDir = cfg.hooks?.transformsDir?.trim();
	if (!transformsDir) return [];
	const configDir = path.dirname(configPath);
	const transformsRoot = path.join(configDir, "hooks", "transforms");
	const resolved = path.isAbsolute(transformsDir) ? path.resolve(transformsDir) : path.resolve(transformsRoot, transformsDir);
	const relative = path.relative(transformsRoot, resolved);
	if (!(relative === ".." || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative))) return [];
	return [`- hooks.transformsDir: ${transformsDir} is outside ${transformsRoot}. Hook transform modules must live under ${transformsRoot}; move custom transforms there or remove hooks.transformsDir.`];
}
function collectUnsupportedInternalHookEntryWarnings(cfg) {
	const entries = cfg.hooks?.internal?.entries;
	if (!entries) return [];
	const unsupportedKeysByEntry = Object.entries(entries).filter(([, entry]) => entry && typeof entry === "object" && !Array.isArray(entry)).map(([hookKey, entry]) => {
		return {
			hookKey,
			unsupportedKeys: [
				"handler",
				"module",
				"extraDirs",
				"installs"
			].filter((key) => Object.hasOwn(entry, key))
		};
	}).filter(({ unsupportedKeys }) => unsupportedKeys.length > 0);
	if (unsupportedKeysByEntry.length === 0) return [];
	return unsupportedKeysByEntry.map(({ hookKey, unsupportedKeys }) => `- hooks.internal.entries.${hookKey}: unsupported loader key${unsupportedKeys.length === 1 ? "" : "s"} ${unsupportedKeys.join(", ")} will not load hook modules. Use bootstrap-extra-files for session bootstrap content, or create a managed/workspace hook directory with HOOK.md + handler.js. Doctor cannot rewrite this automatically because per-hook entry keys are open-ended hook configuration.`);
}
function collectConfiguredChannelIds(cfg) {
	const channels = cfg.channels && typeof cfg.channels === "object" && !Array.isArray(cfg.channels) ? cfg.channels : null;
	if (!channels) return [];
	return Object.keys(channels).filter((channelId) => channelId !== "defaults");
}
function emitDoctorChangesPanel(changeLines, shouldRepair, options = {}) {
	if (changeLines.length === 0) return;
	const body = changeLines.join("\n");
	note(options.sanitize ? sanitizeDoctorNote(body) : body, shouldRepair ? "Doctor changes" : "Doctor changes preview");
}
async function refreshGatewayAuthStateAfterAuthProfileRepair() {
	try {
		await callGateway({
			method: "secrets.reload",
			params: {},
			timeoutMs: 3e3
		});
	} catch {}
	try {
		await callGateway({
			method: "models.authStatus",
			params: { refresh: true },
			timeoutMs: 3e3
		});
	} catch {}
}
/**
* Loads config, runs doctor migrations/repairs, and returns the config write plan.
*
* This is the config-side orchestration boundary for doctor; it keeps preview notes, repair
* mutations, gateway auth refreshes, and final write confirmation in one ordered flow.
*/
async function loadAndMaybeMigrateDoctorConfig(params) {
	const shouldRepair = params.options.repair === true || params.options.yes === true;
	const preflight = await runDoctorConfigPreflight({
		repairPrefixedConfig: shouldRepair,
		recoverCorruptTargetStore: shouldRepair,
		doctorOnlyStateMigrations: shouldRepair,
		preparePluginMetadataSnapshot: true
	});
	const snapshot = preflight.snapshot;
	const baseCfg = preflight.baseConfig;
	const pluginMetadataSnapshotState = { current: preflight.pluginMetadataSnapshot };
	const { createDoctorPluginMetadataSnapshotScope } = await import("./plugin-metadata-snapshot-scope-Dhbl1oPI.js");
	const pluginMetadataSnapshotScope = createDoctorPluginMetadataSnapshotScope({
		getBaseSnapshot: () => pluginMetadataSnapshotState.current,
		env: process.env
	});
	const runWithPluginMetadataSnapshot = pluginMetadataSnapshotScope.run;
	const invalidatePluginMetadataSnapshot = () => {
		pluginMetadataSnapshotState.current = void 0;
		pluginMetadataSnapshotScope.invalidate();
	};
	const runWithCurrentPluginMetadata = (config, run) => {
		const soleAgentId = tryResolveSoleAgentId(config);
		return runWithPluginMetadataSnapshot({
			config,
			workspaceDir: soleAgentId ? resolveAgentWorkspaceDir(config, soleAgentId) : void 0
		}, run);
	};
	let state = {
		cfg: baseCfg,
		candidate: structuredClone(baseCfg),
		pendingChanges: false,
		fixHints: []
	};
	const explicitSetPaths = [];
	let shouldRepairCronCodexModelRefsAfterConfigWrite = false;
	let openAICodexAuthProfileIdMap;
	const doctorFixCommand = formatCliCommand("openclaw doctor --fix");
	const applyConfigMutation = (mutation, options) => {
		emitDoctorChangesPanel(mutation.changes, shouldRepair, options.sanitize ? { sanitize: true } : {});
		if (options.emitWarnings && mutation.warnings?.length) emitDoctorNotes({
			note,
			warningNotes: mutation.warnings
		});
		state = applyDoctorConfigMutation({
			state,
			mutation,
			shouldRepair,
			fixHint: options.fixHint
		});
	};
	const sourceMeta = snapshot.sourceConfig?.meta;
	const sourceLastTouchedVersion = typeof sourceMeta?.lastTouchedVersion === "string" ? sourceMeta.lastTouchedVersion : void 0;
	const rawRosterMigrations = [snapshot.sourceConfigBeforeMigrations, snapshot.parsed].filter((source) => source !== void 0).map((source) => migratePersistedImplicitMainRoster(source));
	const rosterMigrations = rawRosterMigrations.filter((migration) => migration.changed);
	const rosterMigrationNeeded = rosterMigrations.length > 0;
	const legacyDefaultAgentId = rawRosterMigrations.map((migration) => migration.retainedLegacyDefaultAgentId).find((agentId) => agentId !== void 0);
	const legacyStep = runWithCurrentPluginMetadata(state.candidate, () => applyLegacyCompatibilityStep({
		snapshot,
		state,
		shouldRepair,
		doctorFixCommand
	}));
	state = legacyStep.state;
	if (legacyDefaultAgentId) {
		retainLegacyDefaultAgentId(state.cfg, legacyDefaultAgentId);
		retainLegacyDefaultAgentId(state.candidate, legacyDefaultAgentId);
	}
	const legacyMigrationPartiallyValid = legacyStep.partiallyValid === true;
	const legacyMigrationBlocksWrite = legacyStep.blocksWrite === true;
	const includeOwnsRoster = configIncludeOwnsAgentRoster(snapshot);
	if (snapshot.exists && rosterMigrationNeeded && !includeOwnsRoster) {
		const migrated = migratePersistedImplicitMainRoster(state.candidate, { materializeWorkspace: true }).config;
		const migratedRoster = readAgentRosterProperty(migrated);
		const migratedEntries = migratedRoster?.kind === "entries" ? migratedRoster.value : void 0;
		const { list: _legacyList, ...candidateAgents } = migrated.agents ?? {};
		const stampsExplicitOwnership = legacyDefaultAgentId !== void 0 && Object.keys(migratedEntries ?? {}).length > 1;
		applyConfigMutation({
			config: {
				...migrated,
				agents: {
					...candidateAgents,
					...stampsExplicitOwnership ? { ownership: "explicit" } : {},
					entries: migratedEntries
				}
			},
			changes: [...new Set(rosterMigrations.flatMap((migration) => migration.diagnostics).concat("Prepared the canonical agent roster without retired default markers for persistence.", ...stampsExplicitOwnership ? ["Stamped the multi-agent roster for explicit per-surface ownership."] : []))]
		}, { fixHint: `Run "${doctorFixCommand}" to persist the explicit agent roster.` });
		explicitSetPaths.push(["agents", "entries"]);
		if (stampsExplicitOwnership) explicitSetPaths.push(["agents", "ownership"]);
	}
	const { collectBlockedLegacyOpenAICodexProviderPlan } = await import("./legacy-config-migrations.runtime.models-BoleAIrW.js");
	const blockedCodexProviderPlan = collectBlockedLegacyOpenAICodexProviderPlan(state.candidate);
	const blockedCodexModelIdentities = new Set(blockedCodexProviderPlan.blockedModelIdentities);
	if (preflight.cronCodexRuntimePolicyTargets?.length) {
		const { repairCronCodexRuntimePolicies } = await import("./runtime-policy-migration-BXMWtf01.js");
		const cronRuntimeRepair = repairCronCodexRuntimePolicies({
			cfg: state.candidate,
			targets: preflight.cronCodexRuntimePolicyTargets,
			blockedModelIdentities: blockedCodexModelIdentities
		});
		applyConfigMutation(cronRuntimeRepair, {
			fixHint: `Run "${doctorFixCommand}" to preserve migrated cron runtime policy.`,
			emitWarnings: true
		});
		const blockedTargets = new Set(cronRuntimeRepair.blockedTargets.map(cronCodexRuntimePolicyTargetKey));
		shouldRepairCronCodexModelRefsAfterConfigWrite = preflight.cronCodexRuntimePolicyTargets.some((target) => !blockedTargets.has(cronCodexRuntimePolicyTargetKey(target)));
	}
	const pluginLegacyIssues = await (async () => {
		if (snapshot.parsed === snapshot.sourceConfig) return [];
		const { findDoctorLegacyConfigIssues } = await import("./legacy-config-issues-_zh3JeC1.js");
		return runWithCurrentPluginMetadata(state.candidate, () => findDoctorLegacyConfigIssues(snapshot.parsed, snapshot.parsed));
	})();
	const seenLegacyIssues = new Set(snapshot.legacyIssues.map((issue) => `${issue.path}:${issue.message}`));
	const pluginIssueLines = pluginLegacyIssues.filter((issue) => {
		const key = `${issue.path}:${issue.message}`;
		if (seenLegacyIssues.has(key)) return false;
		seenLegacyIssues.add(key);
		return true;
	}).map((issue) => `- ${issue.path}: ${issue.message}`);
	const legacyIssueLines = [...legacyStep.issueLines, ...pluginIssueLines];
	if (pluginIssueLines.length > 0 && !shouldRepair && !state.fixHints.includes(`Run "${doctorFixCommand}" to migrate legacy config keys.`)) state.fixHints.push(`Run "${doctorFixCommand}" to migrate legacy config keys.`);
	if (legacyIssueLines.length > 0) note(legacyIssueLines.join("\n"), "Legacy config keys detected");
	emitDoctorChangesPanel(legacyStep.changeLines, shouldRepair);
	const hookTransformsDirWarnings = collectInvalidHookTransformsDirWarnings(state.cfg, snapshot.path);
	if (hookTransformsDirWarnings.length > 0) note(sanitizeDoctorNote(hookTransformsDirWarnings.join("\n")), "Doctor warnings");
	const unsupportedInternalHookEntryWarnings = collectUnsupportedInternalHookEntryWarnings(state.cfg);
	if (unsupportedInternalHookEntryWarnings.length > 0) note(sanitizeDoctorNote(unsupportedInternalHookEntryWarnings.join("\n")), "Doctor warnings");
	applyConfigMutation(runWithCurrentPluginMetadata(state.candidate, () => normalizeCompatibilityConfigValues(state.candidate, {
		blockedModelIdentities: blockedCodexModelIdentities,
		sourceRaw: snapshot.parsed
	})), { fixHint: `Run "${doctorFixCommand}" to apply these changes.` });
	const { prepareRetiredPhoneControlCleanup } = await import("./doctor-retired-phone-control-CtQrlymc.js");
	const retiredPhoneControlCleanup = await prepareRetiredPhoneControlCleanup({
		cfg: state.candidate,
		env: process.env
	});
	applyConfigMutation({
		config: retiredPhoneControlCleanup.config,
		changes: retiredPhoneControlCleanup.configChanges,
		warnings: retiredPhoneControlCleanup.warnings
	}, {
		fixHint: `Run "${doctorFixCommand}" to retire Phone Control lease configuration.`,
		emitWarnings: true
	});
	if (retiredPhoneControlCleanup.cleanupPending && !shouldRepair) note(`Retired Phone Control lease state remains. Run "${doctorFixCommand}" to archive it.`, "Legacy state detected");
	const pluginActivationSourceConfig = state.candidate;
	const { applyPluginAutoEnable } = await import("./plugin-auto-enable-oIm11A37.js");
	applyConfigMutation(runWithCurrentPluginMetadata(state.candidate, () => applyPluginAutoEnable({
		config: state.candidate,
		env: process.env
	})), { fixHint: `Run "${doctorFixCommand}" to apply these changes.` });
	if (!shouldRepair) {
		const { repairStaleAgentModelRefs } = await import("./stale-agent-model-ref-repair-BI-bGlFs.js");
		applyConfigMutation(runWithCurrentPluginMetadata(state.candidate, () => repairStaleAgentModelRefs(state.candidate, { env: process.env })), {
			fixHint: `Run "${doctorFixCommand}" to remove stale agent model references.`,
			sanitize: true,
			emitWarnings: true
		});
	}
	const { collectPluginToolAllowlistWarnings } = await import("./plugin-tool-allowlist-warnings-DUjGVvoS.js");
	const pluginToolAllowlistWarnings = runWithCurrentPluginMetadata(state.candidate, () => collectPluginToolAllowlistWarnings({
		cfg: state.candidate,
		env: process.env
	}));
	if (pluginToolAllowlistWarnings.length > 0) note(sanitizeDoctorNote(pluginToolAllowlistWarnings.join("\n")), "Doctor warnings");
	const hasConfiguredChannels = collectConfiguredChannelIds(state.candidate).length > 0;
	let collectMutableAllowlistWarnings;
	if (hasConfiguredChannels) {
		const channelDoctor = await import("./channel-doctor-DdIrHfTy.js");
		collectMutableAllowlistWarnings = channelDoctor.collectChannelDoctorMutableAllowlistWarnings;
		const channelDoctorSequence = await runWithCurrentPluginMetadata(state.candidate, () => channelDoctor.runChannelDoctorConfigSequences({
			cfg: state.candidate,
			env: process.env,
			shouldRepair
		}));
		emitDoctorNotes({
			note,
			changeNotes: channelDoctorSequence.changeNotes,
			warningNotes: channelDoctorSequence.warningNotes
		});
		const staleChannelCleanups = await runWithCurrentPluginMetadata(state.candidate, () => channelDoctor.collectChannelDoctorStaleConfigMutations(state.candidate, { env: process.env }));
		for (const staleCleanup of staleChannelCleanups) applyConfigMutation(staleCleanup, {
			fixHint: `Run "${doctorFixCommand}" to remove stale channel plugin references.`,
			sanitize: true,
			emitWarnings: true
		});
	}
	const { repairHooksTokenReuseGatewayAuth } = await import("./hooks-token-reuse-repair-DoOo8gGG.js");
	applyConfigMutation(await repairHooksTokenReuseGatewayAuth(state.candidate, process.env), { fixHint: `Run "${doctorFixCommand}" to rotate hooks.token away from Gateway auth.` });
	if (shouldRepair) {
		const { runDoctorRepairSequence } = await import("./repair-sequencing-DX1ajN04.js");
		const repairSequence = await runDoctorRepairSequence({
			state,
			doctorFixCommand,
			env: process.env,
			blockedCodexProviderPlan,
			pluginMetadataSnapshotState,
			runWithPluginMetadataSnapshot
		});
		state = repairSequence.state;
		pluginMetadataSnapshotState.current = repairSequence.pluginMetadataSnapshot;
		openAICodexAuthProfileIdMap = repairSequence.openAICodexAuthProfileIdMap;
		if (repairSequence.authProfilesRepaired) await refreshGatewayAuthStateAfterAuthProfileRepair();
		emitDoctorNotes({
			note,
			changeNotes: repairSequence.changeNotes,
			warningNotes: repairSequence.warningNotes
		});
	} else {
		const { collectDoctorPreviewNotes } = await import("./preview-warnings-BXK5JRl5.js");
		const collectPreviewNotes = async () => await collectDoctorPreviewNotes({
			cfg: state.candidate,
			activationSourceConfig: pluginActivationSourceConfig,
			doctorFixCommand,
			env: process.env,
			allowExec: params.options.allowExec === true,
			blockedCodexProviderPlan,
			runWithPluginMetadataSnapshot
		});
		const previewNotes = await runWithCurrentPluginMetadata(state.candidate, collectPreviewNotes);
		emitDoctorNotes({
			note,
			infoNotes: previewNotes.infoNotes,
			warningNotes: previewNotes.warningNotes
		});
	}
	const mutableAllowlistWarnings = collectMutableAllowlistWarnings ? await runWithCurrentPluginMetadata(state.candidate, () => collectMutableAllowlistWarnings({
		cfg: state.candidate,
		env: process.env
	})) : [];
	if (mutableAllowlistWarnings.length > 0) note(sanitizeDoctorNote(mutableAllowlistWarnings.join("\n")), "Doctor warnings");
	const unknownStep = applyUnknownConfigKeyStep({
		state,
		shouldRepair,
		doctorFixCommand
	});
	state = unknownStep.state;
	if (unknownStep.removed.length > 0 || unknownStep.repairs.length > 0) note([...unknownStep.removed.map((pathLocal) => `- ${pathLocal}`), ...unknownStep.repairs.map((change) => `- ${change}`)].join("\n"), shouldRepair ? "Doctor changes" : "Unknown config keys");
	if (unknownStep.warnings.length > 0) note(unknownStep.warnings.join("\n"), "Doctor warnings");
	const finalized = await finalizeDoctorConfigFlow({
		cfg: state.cfg,
		candidate: state.candidate,
		pendingChanges: state.pendingChanges,
		shouldRepair,
		fixHints: state.fixHints,
		confirm: params.confirm,
		note
	});
	const cfg = finalized.cfg;
	if (legacyDefaultAgentId) retainLegacyDefaultAgentId(cfg, legacyDefaultAgentId);
	const shouldWriteConfig = finalized.shouldWriteConfig && !legacyMigrationBlocksWrite;
	const singleTopLevelIncludeWrite = shouldWriteConfig && isSingleTopLevelIncludeMigration({
		parsed: snapshot.parsed,
		sourceConfig: snapshot.sourceConfig,
		candidate: cfg
	});
	const configuredOpencodePluginIds = [cfg.models?.providers?.opencode || cfg.models?.providers?.["opencode-zen"] ? "opencode" : void 0, cfg.models?.providers?.["opencode-go"] ? "opencode-go" : void 0].filter((pluginId) => pluginId !== void 0);
	let activeOpencodePluginIds = [];
	if (configuredOpencodePluginIds.length > 0) {
		const { resolveEnabledProviderPluginIds } = await import("./providers-CjnxerDf.js");
		activeOpencodePluginIds = runWithCurrentPluginMetadata(cfg, () => resolveEnabledProviderPluginIds({
			config: cfg,
			onlyPluginIds: configuredOpencodePluginIds
		}));
	}
	noteOpencodeProviderOverrides(cfg, {
		opencodePluginActive: activeOpencodePluginIds.includes("opencode"),
		opencodeGoPluginActive: activeOpencodePluginIds.includes("opencode-go")
	});
	noteImplicitFallbackClobberWarnings(cfg);
	noteSandboxOriginProxyWarning(cfg);
	noteMcpOriginWarning(cfg);
	return {
		cfg,
		path: snapshot.path ?? CONFIG_PATH,
		shouldWriteConfig,
		sourceConfigValid: snapshot.valid,
		...sourceLastTouchedVersion ? { sourceLastTouchedVersion } : {},
		...legacyMigrationPartiallyValid ? { skipPluginValidationOnWrite: true } : {},
		...shouldWriteConfig && explicitSetPaths.length > 0 ? { explicitSetPaths } : {},
		...singleTopLevelIncludeWrite ? { skipWizardMetadataForIncludeWrite: true } : {},
		...shouldRepairCronCodexModelRefsAfterConfigWrite ? { shouldRepairCronCodexModelRefsAfterConfigWrite: true } : {},
		...shouldRepair && retiredPhoneControlCleanup.cleanupPending && retiredPhoneControlCleanup.cleanupSafe ? { retiredPhoneControlStateCleanupPending: true } : {},
		...blockedCodexProviderPlan.blockedModelIdentities.length > 0 ? { blockedCodexModelIdentities: blockedCodexProviderPlan.blockedModelIdentities } : {},
		...openAICodexAuthProfileIdMap?.size ? { openAICodexAuthProfileIdMap } : {},
		...pluginMetadataSnapshotState.current ? { pluginMetadataSnapshot: pluginMetadataSnapshotState.current } : {},
		runWithPluginMetadataSnapshot,
		invalidatePluginMetadataSnapshot
	};
}
//#endregion
export { loadAndMaybeMigrateDoctorConfig };
