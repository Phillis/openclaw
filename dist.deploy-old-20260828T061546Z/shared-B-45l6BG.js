import { r as createLazyRuntimeModule } from "./lazy-runtime-CgCh8H_K.js";
import { n as normalizeAccountId } from "./account-id-BH0zJUew.js";
import { t as defineChannelSetupContract } from "./setup-contract-CIbR6uxD.js";
import { a as createScopedChannelConfigAdapter, s as createScopedDmSecurityResolver, t as adaptScopedAccountAccessor } from "./channel-config-helpers-C7An4wuC.js";
import { c as resolveConfiguredFromCredentialStatuses } from "./account-snapshot-fields-DPncjgDN.js";
import { n as describeAccountSnapshot } from "./account-helpers-Cnv50TjD.js";
import { r as createEnvPatchedAccountSetupAdapter } from "./setup-helpers-ChQBLW6h.js";
import "./setup-runtime-C7HBq6bD.js";
import "./channel-setup-BFU3ELzE.js";
import { t as formatAllowFromLowercase } from "./allow-from-C78YI2I3.js";
import "./channel-status-Bt34VDhN.js";
import { M as createConditionalWarningCollector, P as createOpenProviderConfiguredRouteWarningCollector } from "./channel-policy-RPOWSkLP.js";
import { c as resolveDiscordAccount, d as resolveDiscordAccountDisabledReason, f as resolveDiscordAccountDmPolicy, l as resolveDiscordAccountAllowFrom, n as isDiscordAccountEnabledForRuntime, o as mergeDiscordAccountConfig, r as listDiscordAccountIds, s as resolveDefaultDiscordAccountId } from "./accounts-DWE66f3w.js";
import { t as inspectDiscordAccount } from "./account-inspect-CvEWqlsl.js";
import { t as DiscordChannelConfigSchema } from "./config-schema-aLS81cTc.js";
import { n as normalizeCompatibilityConfig } from "./doctor-contract-DZ_EOgQO.js";
import { t as DISCORD_LEGACY_CONFIG_RULES } from "./doctor-shared-cypKrFwC.js";
import { r as secretTargetRegistryEntries, t as collectRuntimeConfigAssignments } from "./secret-config-contract-BvEwvKfL.js";
import { n as unsupportedSecretRefSurfacePatterns, t as collectUnsupportedSecretRefConfigCandidates } from "./security-contract-Co8E68JS.js";
import { t as deriveLegacySessionChatType } from "./session-contract-BO5tlIdl.js";
//#region extensions/discord/src/channel-api.ts
const DISCORD_CHANNEL_META = {
	id: "discord",
	label: "Discord",
	selectionLabel: "Discord (Bot API)",
	detailLabel: "Discord Bot",
	docsPath: "/channels/discord",
	docsLabel: "discord",
	blurb: "very well supported right now.",
	systemImage: "bubble.left.and.bubble.right",
	markdownCapable: true,
	preferSessionLookupForAnnounceTarget: true
};
function getChatChannelMeta(id) {
	if (id !== DISCORD_CHANNEL_META.id) throw new Error(`Unsupported Discord channel meta lookup: ${id}`);
	return DISCORD_CHANNEL_META;
}
//#endregion
//#region extensions/discord/src/security.ts
const resolveDiscordDmPolicy = createScopedDmSecurityResolver({
	channelKey: "discord",
	resolvePolicy: (account) => account.config.dmPolicy,
	resolveAllowFrom: (account) => account.config.allowFrom,
	resolveAccess: ({ cfg, account }) => ({
		dmPolicy: resolveDiscordAccountDmPolicy({
			cfg,
			accountId: account.accountId
		}),
		allowFrom: resolveDiscordAccountAllowFrom({
			cfg,
			accountId: account.accountId
		})
	}),
	policyPathSuffix: "dmPolicy",
	normalizeEntry: (raw) => raw.trim().replace(/^(discord|user):/i, "").replace(/^<@!?(\d+)>$/, "$1")
});
const collectDiscordSecurityWarnings = createOpenProviderConfiguredRouteWarningCollector({
	providerConfigPresent: (cfg) => cfg.channels?.discord !== void 0,
	resolveGroupPolicy: (account) => account.config.groupPolicy,
	resolveRouteAllowlistConfigured: (account) => Object.keys(account.config.guilds ?? {}).length > 0,
	configureRouteAllowlist: {
		surface: "Discord guilds",
		openScope: "any channel not explicitly denied",
		groupPolicyPath: "channels.discord.groupPolicy",
		routeAllowlistPath: "channels.discord.guilds.<id>.channels"
	},
	missingRouteAllowlist: {
		surface: "Discord guilds",
		openBehavior: "with no guild/channel allowlist; any channel can trigger (mention-gated)",
		remediation: "Set channels.discord.groupPolicy=\"allowlist\" and configure channels.discord.guilds.<id>.channels"
	}
});
const collectDiscordSecurityFindings = createConditionalWarningCollector.findings({
	collectWarnings: collectDiscordSecurityWarnings,
	checkId: "channels.discord.groups.open",
	severity: "critical",
	title: "Discord security warning"
});
const loadDiscordSecurityAuditModule = createLazyRuntimeModule(() => import("./security-audit.runtime.js"));
const discordSecurityAdapter = {
	resolveDmPolicy: resolveDiscordDmPolicy,
	collectWarnings: collectDiscordSecurityFindings,
	collectAuditFindings: async (params) => (await loadDiscordSecurityAuditModule()).collectDiscordSecurityAuditFindings(params)
};
const discordSetupContract = defineChannelSetupContract({
	fields: {
		token: {
			kind: "string",
			sensitive: true,
			cli: {
				flags: "--token <token>",
				description: "Discord bot token"
			}
		},
		useEnv: {
			kind: "boolean",
			cli: {
				flags: "--use-env",
				description: "Use DISCORD_BOT_TOKEN"
			},
			envVars: ["DISCORD_BOT_TOKEN"]
		}
	},
	legacyAdapter: createEnvPatchedAccountSetupAdapter({
		channelKey: "discord",
		defaultAccountOnlyEnvError: "DISCORD_BOT_TOKEN can only be used for the default account.",
		missingCredentialError: "Discord requires token (or --use-env).",
		hasCredentials: (input) => Boolean(input.token),
		buildPatch: (input) => input.token ? { token: input.token } : {}
	})
});
//#endregion
//#region extensions/discord/src/shared.ts
const DISCORD_CHANNEL = "discord";
const loadDiscordDoctorModule = createLazyRuntimeModule(() => import("./doctor-j71pkQQ9.js"));
const discordDoctor = {
	dmAllowFromMode: "topOnly",
	groupModel: "route",
	groupAllowFromFallbackToAllowFrom: false,
	warnOnEmptyGroupSenderAllowlist: false,
	legacyConfigRules: DISCORD_LEGACY_CONFIG_RULES,
	normalizeCompatibilityConfig,
	collectPreviewWarnings: async (params) => (await loadDiscordDoctorModule()).discordDoctor.collectPreviewWarnings?.(params) ?? [],
	collectMutableAllowlistWarnings: async (params) => (await loadDiscordDoctorModule()).discordDoctor.collectMutableAllowlistWarnings?.(params) ?? [],
	repairConfig: async (params) => (await loadDiscordDoctorModule()).discordDoctor.repairConfig?.(params) ?? {
		config: params.cfg,
		changes: []
	}
};
function resolveDiscordConfigAccessorAccount(params) {
	const accountId = normalizeAccountId(params.accountId ?? resolveDefaultDiscordAccountId(params.cfg));
	const config = mergeDiscordAccountConfig(params.cfg, accountId);
	return {
		allowFrom: resolveDiscordAccountAllowFrom({
			cfg: params.cfg,
			accountId
		}),
		defaultTo: config.defaultTo
	};
}
const discordConfigAdapter = createScopedChannelConfigAdapter({
	sectionKey: DISCORD_CHANNEL,
	listAccountIds: listDiscordAccountIds,
	resolveAccount: adaptScopedAccountAccessor(resolveDiscordAccount),
	resolveAccessorAccount: resolveDiscordConfigAccessorAccount,
	inspectAccount: adaptScopedAccountAccessor(inspectDiscordAccount),
	defaultAccountId: resolveDefaultDiscordAccountId,
	clearBaseFields: ["token", "name"],
	resolveAllowFrom: (account) => account.allowFrom,
	formatAllowFrom: (allowFrom) => formatAllowFromLowercase({ allowFrom }),
	resolveDefaultTo: (account) => account.defaultTo
});
function createDiscordPluginBase(params) {
	return {
		id: DISCORD_CHANNEL,
		setupContract: params.setupContract,
		...params.setupWizard ? { setupWizard: params.setupWizard } : {},
		meta: { ...getChatChannelMeta(DISCORD_CHANNEL) },
		capabilities: {
			chatTypes: [
				"direct",
				"channel",
				"thread"
			],
			polls: true,
			reactions: true,
			threads: true,
			media: true,
			tts: { voice: { synthesisTarget: "voice-note" } },
			nativeCommands: true
		},
		commands: {
			nativeCommandsAutoEnabled: true,
			nativeSkillsAutoEnabled: true,
			resolveNativeCommandName: ({ commandKey, defaultName }) => commandKey === "tts" ? "voice" : defaultName
		},
		doctor: discordDoctor,
		streaming: { blockStreamingCoalesceDefaults: {
			minChars: 1500,
			idleMs: 1e3
		} },
		reload: { configPrefixes: ["channels.discord"] },
		configSchema: DiscordChannelConfigSchema,
		config: {
			...discordConfigAdapter,
			hasConfiguredState: ({ env }) => typeof env?.DISCORD_BOT_TOKEN === "string" && env.DISCORD_BOT_TOKEN.trim().length > 0,
			isEnabled: (account, cfg) => isDiscordAccountEnabledForRuntime(account, cfg),
			disabledReason: (account, cfg) => resolveDiscordAccountDisabledReason(account, cfg),
			isConfigured: (account) => resolveConfiguredFromCredentialStatuses(account) ?? Boolean(account.token?.trim()),
			describeAccount: (account) => describeAccountSnapshot({
				account,
				configured: resolveConfiguredFromCredentialStatuses(account) ?? Boolean(account.token?.trim()),
				extra: {
					tokenSource: account.tokenSource,
					tokenStatus: account.tokenStatus
				}
			})
		},
		messaging: { deriveLegacySessionChatType },
		security: discordSecurityAdapter,
		secrets: {
			secretTargetRegistryEntries,
			unsupportedSecretRefSurfacePatterns,
			collectUnsupportedSecretRefConfigCandidates,
			collectRuntimeConfigAssignments
		}
	};
}
//#endregion
export { discordSecurityAdapter as i, discordConfigAdapter as n, discordSetupContract as r, createDiscordPluginBase as t };
