import { r as createLazyRuntimeModule } from "./lazy-runtime-CgCh8H_K.js";
import { n as normalizeAccountId } from "./account-id-BRqK6RmF.js";
import { t as defineChannelSetupContract } from "./setup-contract-DNfi_CdO.js";
import { a as createScopedChannelConfigAdapter, s as createScopedDmSecurityResolver, t as adaptScopedAccountAccessor } from "./channel-config-helpers-C6dKYMZI.js";
import { c as resolveConfiguredFromCredentialStatuses } from "./account-snapshot-fields-BFfRc-QZ.js";
import { n as describeAccountSnapshot } from "./account-helpers-CEliAVvN.js";
import { r as createEnvPatchedAccountSetupAdapter } from "./setup-helpers-DKfRvbZ6.js";
import "./setup-runtime-jPhXOAPk.js";
import "./channel-setup-BDsIe7lJ.js";
import { t as formatAllowFromLowercase } from "./allow-from-D8N51uwu.js";
import { P as createOpenProviderConfiguredRouteWarningCollector } from "./channel-policy-DlGVx39H.js";
import { a as mergeDiscordAccountConfig, c as resolveDiscordAccountAllowFrom, d as resolveDiscordAccountDmPolicy, n as isDiscordAccountEnabledForRuntime, o as resolveDefaultDiscordAccountId, r as listDiscordAccountIds, s as resolveDiscordAccount, u as resolveDiscordAccountDisabledReason } from "./accounts-B99sjC_p.js";
import { t as DiscordChannelConfigSchema } from "./config-schema-ysh-xpzB.js";
import { t as getChatChannelMeta } from "./channel-api-CWlbI7Qw.js";
import { t as inspectDiscordAccount } from "./account-inspect-CGju5LKQ.js";
import { n as normalizeCompatibilityConfig } from "./doctor-contract-7rEih92W.js";
import { t as DISCORD_LEGACY_CONFIG_RULES } from "./doctor-shared-cypKrFwC.js";
import { n as secretTargetRegistryEntries, t as collectRuntimeConfigAssignments } from "./secret-config-contract-DrTsCcB7.js";
import { n as unsupportedSecretRefSurfacePatterns, t as collectUnsupportedSecretRefConfigCandidates } from "./security-contract-BjBmFIRA.js";
import { t as deriveLegacySessionChatType } from "./session-contract-BO5tlIdl.js";
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
const loadDiscordSecurityAuditModule = createLazyRuntimeModule(() => import("./security-audit.runtime.js"));
const discordSecurityAdapter = {
	resolveDmPolicy: resolveDiscordDmPolicy,
	collectWarnings: collectDiscordSecurityWarnings,
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
const loadDiscordDoctorModule = createLazyRuntimeModule(() => import("./doctor-DYG-RGbc.js"));
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
