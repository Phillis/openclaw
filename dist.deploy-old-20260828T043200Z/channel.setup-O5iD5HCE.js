import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { l as hasConfiguredSecretInput } from "./types.secrets-Bre8L6Ts.js";
import { t as formatCliCommand } from "./command-format-HwSAdvXB.js";
import { n as normalizeAccountId, t as DEFAULT_ACCOUNT_ID } from "./account-id-BH0zJUew.js";
import { t as defineChannelSetupContract } from "./setup-contract-CIbR6uxD.js";
import { o as getChatChannelMeta } from "./registry-DbgR8dhg.js";
import { t as formatDocsLink } from "./links-ClIwBcy4.js";
import { n as resolveNormalizedAccountEntry } from "./account-lookup-CaTe6-6f.js";
import { a as createScopedChannelConfigAdapter, t as adaptScopedAccountAccessor } from "./channel-config-helpers-C7An4wuC.js";
import "./string-coerce-runtime-C8jKEm3h.js";
import "./account-core-D-Gu5DXB.js";
import "./routing-DM8631ts.js";
import { t as createSetupTranslator } from "./i18n-BQpjgFU-.js";
import { n as applySetupAccountConfigPatch, r as createEnvPatchedAccountSetupAdapter } from "./setup-helpers-ChQBLW6h.js";
import { N as splitSetupEntries, a as createAllowFromSection, b as patchChannelConfigForAccount, j as setSetupChannelEnabled, s as createStandardChannelSetupStatus, w as promptResolvedAllowFrom } from "./setup-wizard-helpers-JxuPdtZE.js";
import { n as defineTokenCredential } from "./setup-credential-Cg5429p2.js";
import "./setup-BBR49zgr.js";
import "./setup-runtime-DoSscGn3.js";
import "./channel-setup-o7ff3LvZ.js";
import "./setup-tools-BHWa-m36.js";
import { t as formatAllowFromLowercase } from "./allow-from-C78YI2I3.js";
import { t as createChannelDmPolicy } from "./channel-dm-policy-uVsTh424.js";
import "./channel-plugin-common-DgLrUXRP.js";
import { t as mergeTelegramAccountConfig } from "./account-config-Bw5EPvnW.js";
import { a as resolveDefaultTelegramAccountId, o as resolveTelegramAccount, r as listTelegramAccountIds } from "./accounts-3yDZGxKI.js";
import { t as isNumericTelegramSenderUserId } from "./allow-from-Byf7JKVc.js";
import { t as inspectTelegramAccount } from "./account-inspect-Br0r-wcR.js";
import { n as singleAccountKeysToMove, t as namedAccountPromotionKeys } from "./setup-contract-CDcIs5O0.js";
import { t as TelegramChannelConfigSchema } from "./config-schema-B4PrDKNq.js";
import { n as collectRuntimeConfigAssignments, r as secretTargetRegistryEntries } from "./secret-contract-0oROIhqA.js";
//#region extensions/telegram/src/config-adapter.ts
const TELEGRAM_CHANNEL$1 = "telegram";
function findTelegramTokenOwnerAccountId(params) {
	const normalizedAccountId = normalizeAccountId(params.accountId);
	const tokenOwners = /* @__PURE__ */ new Map();
	for (const id of listTelegramAccountIds(params.cfg)) {
		const account = inspectTelegramAccount({
			cfg: params.cfg,
			accountId: id
		});
		const token = (account.token ?? "").trim();
		if (!token) continue;
		const ownerAccountId = tokenOwners.get(token);
		if (!ownerAccountId) {
			tokenOwners.set(token, account.accountId);
			continue;
		}
		if (account.accountId === normalizedAccountId) return ownerAccountId;
	}
	return null;
}
function formatDuplicateTelegramTokenReason(params) {
	return `Duplicate Telegram bot token: account "${params.accountId}" shares a token with account "${params.ownerAccountId}". Keep one owner account per bot token.`;
}
/**
* Returns true when the runtime token resolver (`resolveTelegramToken`) would
* block channel-level fallthrough for the given accountId. This mirrors the
* guard in `token.ts` so that status-check functions (`isConfigured`,
* `unconfiguredReason`, `describeAccount`) stay consistent with the gateway
* runtime behavior.
*
* The guard fires when:
*   1. The accountId is not the default account, AND
*   2. The config has an explicit `accounts` section with entries, AND
*   3. The accountId is not found in that `accounts` section.
*
* See: https://github.com/openclaw/openclaw/issues/53876
*/
function isBlockedByMultiBotGuard(cfg, accountId) {
	if (normalizeAccountId(accountId) === "default") return false;
	const accounts = cfg.channels?.telegram?.accounts;
	if (!(Boolean(accounts) && typeof accounts === "object" && !Array.isArray(accounts) && Object.keys(accounts).length > 0)) return false;
	return !resolveNormalizedAccountEntry(accounts, accountId, normalizeAccountId);
}
function resolveTelegramConfigAccessorAccount(params) {
	const accountId = normalizeAccountId(params.accountId ?? resolveDefaultTelegramAccountId(params.cfg));
	return { config: mergeTelegramAccountConfig(params.cfg, accountId) };
}
const telegramConfigAdapter = createScopedChannelConfigAdapter({
	sectionKey: TELEGRAM_CHANNEL$1,
	listAccountIds: listTelegramAccountIds,
	resolveAccount: adaptScopedAccountAccessor(resolveTelegramAccount),
	resolveAccessorAccount: resolveTelegramConfigAccessorAccount,
	inspectAccount: adaptScopedAccountAccessor(inspectTelegramAccount),
	defaultAccountId: resolveDefaultTelegramAccountId,
	clearBaseFields: [
		"botToken",
		"tokenFile",
		"name"
	],
	resolveAllowFrom: (account) => account.config.allowFrom,
	formatAllowFrom: (allowFrom) => formatAllowFromLowercase({
		allowFrom,
		stripPrefixRe: /^(telegram|tg):/i
	}),
	resolveDefaultTo: (account) => account.config.defaultTo
});
function createTelegramPluginConfig() {
	return {
		...telegramConfigAdapter,
		hasConfiguredState: ({ env }) => typeof env?.TELEGRAM_BOT_TOKEN === "string" && env.TELEGRAM_BOT_TOKEN.trim().length > 0,
		isConfigured: (account, cfg) => {
			if (isBlockedByMultiBotGuard(cfg, account.accountId)) return false;
			if (!inspectTelegramAccount({
				cfg,
				accountId: account.accountId
			}).token?.trim()) return false;
			return !findTelegramTokenOwnerAccountId({
				cfg,
				accountId: account.accountId
			});
		},
		unconfiguredReason: (account, cfg) => {
			if (isBlockedByMultiBotGuard(cfg, account.accountId)) return `not configured: unknown accountId "${account.accountId}" in multi-bot setup`;
			const inspected = inspectTelegramAccount({
				cfg,
				accountId: account.accountId
			});
			if (!inspected.token?.trim()) return inspected.tokenStatus === "configured_unavailable" ? `not configured: token ${inspected.tokenSource} is configured but unavailable` : "not configured";
			const ownerAccountId = findTelegramTokenOwnerAccountId({
				cfg,
				accountId: account.accountId
			});
			return ownerAccountId ? formatDuplicateTelegramTokenReason({
				accountId: account.accountId,
				ownerAccountId
			}) : "not configured";
		},
		describeAccount: (account, cfg) => {
			if (isBlockedByMultiBotGuard(cfg, account.accountId)) return {
				accountId: account.accountId,
				name: account.name,
				enabled: account.enabled,
				configured: false,
				tokenSource: "none"
			};
			const inspected = inspectTelegramAccount({
				cfg,
				accountId: account.accountId
			});
			return {
				accountId: account.accountId,
				name: account.name,
				enabled: account.enabled,
				configured: inspected.tokenStatus !== "missing" && !findTelegramTokenOwnerAccountId({
					cfg,
					accountId: account.accountId
				}),
				tokenSource: inspected.tokenSource,
				tokenStatus: inspected.tokenStatus
			};
		}
	};
}
//#endregion
//#region extensions/telegram/src/setup-core.ts
const t$1 = createSetupTranslator();
const channel$2 = "telegram";
function getTelegramTokenHelpLines() {
	return [
		t$1("wizard.telegram.tokenHelpOpenBotFather"),
		t$1("wizard.telegram.tokenHelpNewBot"),
		t$1("wizard.telegram.tokenHelpCopyToken"),
		t$1("wizard.telegram.tokenHelpWebApp", { url: "https://t.me/BotFather?startapp" }),
		t$1("wizard.telegram.tokenEnvTip"),
		t$1("wizard.channels.docs", { link: formatDocsLink("/telegram") }),
		t$1("wizard.telegram.website", { url: "https://openclaw.ai" })
	];
}
function getTelegramUserIdHelpLines() {
	return [
		t$1("wizard.telegram.userIdHelpLogs", { command: formatCliCommand("openclaw logs --follow") }),
		t$1("wizard.telegram.userIdHelpGetUpdates"),
		t$1("wizard.telegram.userIdHelpThirdParty"),
		t$1("wizard.channels.docs", { link: formatDocsLink("/telegram") }),
		t$1("wizard.telegram.website", { url: "https://openclaw.ai" })
	];
}
function normalizeTelegramAllowFromInput(raw) {
	return raw.trim().replace(/^(telegram|tg):/i, "").trim();
}
function parseTelegramAllowFromId(raw) {
	const stripped = normalizeTelegramAllowFromInput(raw);
	return isNumericTelegramSenderUserId(stripped) ? stripped : null;
}
async function promptTelegramAllowFromForAccount(params) {
	const accountId = params.accountId ?? resolveDefaultTelegramAccountId(params.cfg);
	const resolved = resolveTelegramAccount({
		cfg: params.cfg,
		accountId
	});
	await params.prompter.note(getTelegramUserIdHelpLines().join("\n"), t$1("wizard.telegram.userIdTitle"));
	const unique = await promptResolvedAllowFrom({
		prompter: params.prompter,
		existing: resolved.config.allowFrom ?? [],
		message: t$1("wizard.telegram.allowFromPrompt"),
		placeholder: "123456789",
		label: t$1("wizard.telegram.allowlistTitle"),
		parseInputs: splitSetupEntries,
		parseId: parseTelegramAllowFromId,
		invalidWithoutTokenNote: t$1("wizard.telegram.allowFromInvalid"),
		resolveEntries: async ({ entries }) => entries.map((entry) => {
			const id = parseTelegramAllowFromId(entry);
			return {
				input: entry,
				resolved: Boolean(id),
				id
			};
		})
	});
	return patchChannelConfigForAccount({
		cfg: params.cfg,
		channel: channel$2,
		accountId,
		patch: {
			dmPolicy: "allowlist",
			allowFrom: unique
		},
		setupSurface: telegramSetupAdapter
	});
}
const telegramSetupAdapter = {
	...createEnvPatchedAccountSetupAdapter({
		channelKey: channel$2,
		defaultAccountOnlyEnvError: "TELEGRAM_BOT_TOKEN can only be used for the default account.",
		missingCredentialError: "Telegram requires token or --token-file (or --use-env).",
		hasCredentials: (input) => Boolean(input.token || input.tokenFile),
		buildPatch: (input) => input.tokenFile ? { tokenFile: input.tokenFile } : input.token ? { botToken: input.token } : {}
	}),
	singleAccountKeysToMove,
	namedAccountPromotionKeys
};
const telegramSetupContract = defineChannelSetupContract({
	fields: {
		token: {
			kind: "string",
			sensitive: true,
			cli: {
				flags: "--token <token>",
				description: "Telegram bot token"
			}
		},
		tokenFile: {
			kind: "string",
			sensitive: true,
			cli: {
				flags: "--token-file <path>",
				description: "Telegram bot token file"
			}
		},
		useEnv: {
			kind: "boolean",
			cli: {
				flags: "--use-env",
				description: "Use TELEGRAM_BOT_TOKEN"
			},
			envVars: ["TELEGRAM_BOT_TOKEN"]
		}
	},
	legacyAdapter: telegramSetupAdapter
});
//#endregion
//#region extensions/telegram/src/setup-surface.helpers.ts
const channel$1 = "telegram";
function ensureTelegramDefaultGroupMentionGate(cfg, accountId) {
	const resolved = resolveTelegramAccount({
		cfg,
		accountId
	});
	const wildcardGroup = resolved.config.groups?.["*"];
	if (wildcardGroup?.requireMention !== void 0) return cfg;
	return patchChannelConfigForAccount({
		cfg,
		channel: channel$1,
		accountId,
		patch: { groups: {
			...resolved.config.groups,
			"*": {
				...wildcardGroup,
				requireMention: true
			}
		} },
		setupSurface: telegramSetupAdapter
	});
}
function shouldShowTelegramDmAccessWarning(cfg, accountId) {
	const merged = mergeTelegramAccountConfig(cfg, accountId);
	const policy = merged.dmPolicy ?? "pairing";
	const hasAllowFrom = Array.isArray(merged.allowFrom) && merged.allowFrom.some((entry) => normalizeOptionalString(String(entry)));
	return policy === "pairing" && !hasAllowFrom;
}
function buildTelegramDmAccessWarningLines(accountId) {
	const configBase = accountId === "default" ? "channels.telegram" : `channels.telegram.accounts.${accountId}`;
	return [
		"Your bot is using DM policy: pairing.",
		"Any Telegram user who discovers the bot can send pairing requests.",
		"For private use, configure an allowlist with your Telegram user id:",
		"  " + formatCliCommand(`openclaw config set ${configBase}.dmPolicy "allowlist"`),
		"  " + formatCliCommand(`openclaw config set ${configBase}.allowFrom '["YOUR_USER_ID"]'`),
		`Docs: ${formatDocsLink("/channels/pairing", "channels/pairing")}`
	];
}
const telegramSetupDmPolicy = createChannelDmPolicy({
	label: "Telegram",
	channel: channel$1,
	resolveAccount: (cfg, accountId) => {
		const resolvedAccountId = accountId ?? resolveDefaultTelegramAccountId(cfg);
		return {
			accountId: resolvedAccountId,
			config: mergeTelegramAccountConfig(cfg, resolvedAccountId)
		};
	},
	applyPatch: ({ cfg, requestedAccountId, account, patch }) => requestedAccountId == null && account.accountId !== "default" ? applySetupAccountConfigPatch({
		cfg,
		channelKey: channel$1,
		accountId: account.accountId,
		patch
	}) : patchChannelConfigForAccount({
		cfg,
		channel: channel$1,
		accountId: account.accountId,
		patch,
		setupSurface: telegramSetupAdapter
	}),
	promptAllowFrom: promptTelegramAllowFromForAccount
});
//#endregion
//#region extensions/telegram/src/setup-surface.ts
const t = createSetupTranslator();
const channel = "telegram";
const telegramSetupWizard = {
	channel,
	status: createStandardChannelSetupStatus({
		channelLabel: "Telegram",
		configuredLabel: t("wizard.channels.statusConfigured"),
		unconfiguredLabel: t("wizard.channels.statusNeedsToken"),
		configuredHint: t("wizard.channels.statusRecommendedConfigured"),
		unconfiguredHint: t("wizard.channels.statusRecommendedNewcomerFriendly"),
		configuredScore: 1,
		unconfiguredScore: 10,
		resolveConfigured: ({ cfg, accountId }) => (accountId ? [accountId] : listTelegramAccountIds(cfg)).some((resolvedAccountId) => {
			return inspectTelegramAccount({
				cfg,
				accountId: resolvedAccountId
			}).configured;
		})
	}),
	prepare: async ({ cfg, accountId, credentialValues }) => ({
		cfg: ensureTelegramDefaultGroupMentionGate(cfg, accountId),
		credentialValues
	}),
	credentials: [defineTokenCredential({
		inputKey: "token",
		configKey: "botToken",
		configuredFields: ["botToken", "tokenFile"],
		providerHint: channel,
		credentialLabel: t("wizard.telegram.botToken"),
		preferredEnvVar: "TELEGRAM_BOT_TOKEN",
		helpTitle: t("wizard.telegram.botToken"),
		helpLines: getTelegramTokenHelpLines(),
		envPrompt: t("wizard.telegram.tokenEnvPrompt"),
		keepPrompt: t("wizard.telegram.tokenKeepPrompt"),
		inputPrompt: t("wizard.telegram.tokenInputPrompt"),
		allowEnv: ({ accountId }) => accountId === DEFAULT_ACCOUNT_ID,
		resolveAccount: ({ cfg, accountId }) => resolveTelegramAccount({
			cfg,
			accountId
		}),
		hasConfiguredValue: (account) => hasConfiguredSecretInput(account.config.botToken) || Boolean(account.config.tokenFile?.trim()),
		resolvedValue: (account) => normalizeOptionalString(account.token),
		envValue: ({ accountId }) => accountId === "default" ? normalizeOptionalString(process.env.TELEGRAM_BOT_TOKEN) : void 0
	})],
	allowFrom: createAllowFromSection({
		helpTitle: t("wizard.telegram.userIdTitle"),
		helpLines: getTelegramUserIdHelpLines(),
		message: t("wizard.telegram.allowFromPrompt"),
		placeholder: "123456789",
		invalidWithoutCredentialNote: t("wizard.telegram.allowFromInvalid"),
		parseInputs: splitSetupEntries,
		parseId: parseTelegramAllowFromId,
		resolveEntries: async ({ entries }) => entries.map((entry) => {
			const id = parseTelegramAllowFromId(entry);
			return {
				input: entry,
				resolved: Boolean(id),
				id
			};
		}),
		apply: async ({ cfg, accountId, allowFrom }) => patchChannelConfigForAccount({
			cfg,
			channel,
			accountId,
			patch: {
				dmPolicy: "allowlist",
				allowFrom
			},
			setupSurface: telegramSetupAdapter
		})
	}),
	finalize: async ({ cfg, accountId, prompter }) => {
		if (!shouldShowTelegramDmAccessWarning(cfg, accountId)) return;
		await prompter.note(buildTelegramDmAccessWarningLines(accountId).join("\n"), "Telegram DM access warning");
	},
	dmPolicy: telegramSetupDmPolicy,
	disable: (cfg) => setSetupChannelEnabled(cfg, channel, false)
};
//#endregion
//#region extensions/telegram/src/setup-plugin.ts
const TELEGRAM_CHANNEL = "telegram";
function createTelegramSetupPluginBase(params) {
	return {
		id: TELEGRAM_CHANNEL,
		setupContract: params.setupContract,
		meta: {
			...getChatChannelMeta(TELEGRAM_CHANNEL),
			quickstartAllowFrom: true
		},
		setupWizard: params.setupWizard,
		capabilities: {
			chatTypes: [
				"direct",
				"group",
				"channel",
				"thread"
			],
			reactions: true,
			threads: true,
			media: true,
			tts: { voice: {
				synthesisTarget: "voice-note",
				captionedFinalText: true
			} },
			polls: true,
			nativeCommands: true,
			blockStreaming: true
		},
		reload: { configPrefixes: ["channels.telegram"] },
		configSchema: TelegramChannelConfigSchema,
		config: createTelegramPluginConfig(),
		secrets: {
			secretTargetRegistryEntries,
			collectRuntimeConfigAssignments
		}
	};
}
//#endregion
//#region extensions/telegram/src/channel.setup.ts
const telegramSetupPlugin = { ...createTelegramSetupPluginBase({
	setupWizard: telegramSetupWizard,
	setupContract: telegramSetupContract
}) };
//#endregion
export { findTelegramTokenOwnerAccountId as a, telegramConfigAdapter as c, telegramSetupContract as i, createTelegramSetupPluginBase as n, formatDuplicateTelegramTokenReason as o, telegramSetupWizard as r, resolveTelegramConfigAccessorAccount as s, telegramSetupPlugin as t };
