import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty, p as normalizeStringifiedOptionalString } from "./string-coerce-CIXf7egm.js";
import "./account-id-BH0zJUew.js";
import { t as defineChannelSetupContract } from "./setup-contract-CIbR6uxD.js";
import { t as formatDocsLink } from "./links-ClIwBcy4.js";
import { a as createScopedChannelConfigAdapter, t as adaptScopedAccountAccessor } from "./channel-config-helpers-C7An4wuC.js";
import { n as describeAccountSnapshot } from "./account-helpers-Cnv50TjD.js";
import "./string-coerce-runtime-C8jKEm3h.js";
import { t as createSetupTranslator } from "./i18n-BQpjgFU-.js";
import { a as createSetupInputPresenceValidator, i as createPatchedAccountSetupAdapter, n as applySetupAccountConfigPatch, o as migrateBaseNameToDefaultAccount } from "./setup-helpers-ChQBLW6h.js";
import { N as splitSetupEntries, o as createPromptParsedAllowFromForAccount, p as mergeAllowFromEntries, s as createStandardChannelSetupStatus } from "./setup-wizard-helpers-BGcFrkxT.js";
import "./setup-BevReM2T.js";
import "./setup-runtime-C7HBq6bD.js";
import "./channel-setup-BFU3ELzE.js";
import { n as formatNormalizedAllowFromEntries } from "./allow-from-C78YI2I3.js";
import { t as createChannelDmPolicy } from "./channel-dm-policy-B8rf1RpT.js";
import { a as resolveGoogleChatConfigAccessorAccount, i as resolveGoogleChatAccount, n as listGoogleChatAccountIds, r as resolveDefaultGoogleChatAccountId, t as inspectGoogleChatAccount } from "./accounts-BKR-gDyB.js";
const googlechatSetupAdapter = createPatchedAccountSetupAdapter({
	channelKey: "googlechat",
	validateInput: createSetupInputPresenceValidator({
		defaultAccountOnlyEnvError: "GOOGLE_CHAT_SERVICE_ACCOUNT env vars can only be used for the default account.",
		whenNotUseEnv: [{
			someOf: ["token", "tokenFile"],
			message: "Google Chat requires --token (service account JSON) or --token-file."
		}]
	}),
	buildPatch: (input) => {
		const setupInput = input;
		const patch = setupInput.useEnv ? {} : setupInput.tokenFile ? { serviceAccountFile: setupInput.tokenFile } : setupInput.token ? { serviceAccount: setupInput.token } : {};
		const audienceType = setupInput.audienceType?.trim();
		const audience = setupInput.audience?.trim();
		const webhookPath = setupInput.webhookPath?.trim();
		const webhookUrl = setupInput.webhookUrl?.trim();
		return {
			...patch,
			...audienceType ? { audienceType } : {},
			...audience ? { audience } : {},
			...webhookPath ? { webhookPath } : {},
			...webhookUrl ? { webhookUrl } : {}
		};
	}
});
const googlechatSetupContract = defineChannelSetupContract({
	fields: {
		token: {
			kind: "string",
			sensitive: true,
			cli: {
				flags: "--token <json>",
				description: "Google Chat service account JSON"
			}
		},
		tokenFile: {
			kind: "string",
			sensitive: true,
			cli: {
				flags: "--token-file <path>",
				description: "Google Chat service account file"
			}
		},
		audienceType: {
			kind: "choice",
			choices: ["app-url", "project-number"],
			cli: {
				flags: "--audience-type <type>",
				description: "Google Chat audience type"
			}
		},
		audience: {
			kind: "string",
			cli: {
				flags: "--audience <value>",
				description: "Google Chat audience value"
			}
		},
		webhookPath: {
			kind: "string",
			cli: {
				flags: "--webhook-path <path>",
				description: "Google Chat webhook path"
			}
		},
		webhookUrl: {
			kind: "string",
			cli: {
				flags: "--webhook-url <url>",
				description: "Google Chat webhook URL"
			}
		},
		useEnv: {
			kind: "boolean",
			cli: {
				flags: "--use-env",
				description: "Use Google Chat environment credentials"
			},
			envVars: ["GOOGLE_CHAT_SERVICE_ACCOUNT", "GOOGLE_CHAT_SERVICE_ACCOUNT_FILE"],
			envVarMode: "any"
		}
	},
	legacyAdapter: googlechatSetupAdapter
});
//#endregion
//#region extensions/googlechat/src/setup-surface.ts
const t = createSetupTranslator();
const channel = "googlechat";
const ENV_SERVICE_ACCOUNT = "GOOGLE_CHAT_SERVICE_ACCOUNT";
const ENV_SERVICE_ACCOUNT_FILE = "GOOGLE_CHAT_SERVICE_ACCOUNT_FILE";
const USE_ENV_FLAG = "__googlechatUseEnv";
const AUTH_METHOD_FLAG = "__googlechatAuthMethod";
const googlechatDmPolicy = createChannelDmPolicy({
	label: "Google Chat",
	channel,
	resolveAccount: (cfg, accountId) => resolveGoogleChatAccount({
		cfg,
		accountId: accountId ?? resolveDefaultGoogleChatAccountId(cfg)
	}),
	applyPatch: ({ cfg, account, patch }) => applySetupAccountConfigPatch({
		cfg,
		channelKey: channel,
		accountId: account.accountId,
		patch
	}),
	promptAllowFrom: createPromptParsedAllowFromForAccount({
		defaultAccountId: resolveDefaultGoogleChatAccountId,
		message: t("wizard.googlechat.allowFromPrompt"),
		placeholder: "users/123456789, name@example.com",
		parseEntries: (raw) => ({ entries: mergeAllowFromEntries(void 0, splitSetupEntries(raw)) }),
		getExistingAllowFrom: ({ cfg, accountId }) => resolveGoogleChatAccount({
			cfg,
			accountId
		}).config.allowFrom ?? [],
		applyAllowFrom: ({ cfg, accountId, allowFrom }) => applySetupAccountConfigPatch({
			cfg,
			channelKey: channel,
			accountId,
			patch: { allowFrom }
		})
	})
});
function createServiceAccountTextInput(params) {
	return {
		inputKey: params.inputKey,
		message: params.message,
		placeholder: params.placeholder,
		shouldPrompt: ({ credentialValues }) => credentialValues[USE_ENV_FLAG] !== "1" && credentialValues[AUTH_METHOD_FLAG] === params.authMethod,
		validate: ({ value }) => normalizeStringifiedOptionalString(value) ? void 0 : "Required",
		normalizeValue: ({ value }) => normalizeStringifiedOptionalString(value) ?? "",
		applySet: async ({ cfg, accountId, value }) => applySetupAccountConfigPatch({
			cfg,
			channelKey: channel,
			accountId,
			patch: { [params.patchKey]: value }
		})
	};
}
const googlechatSetupWizard = {
	channel,
	status: createStandardChannelSetupStatus({
		channelLabel: "Google Chat",
		configuredLabel: t("wizard.channels.statusConfigured"),
		unconfiguredLabel: t("wizard.channels.statusNeedsServiceAccount"),
		configuredHint: t("wizard.channels.statusConfigured"),
		unconfiguredHint: t("wizard.channels.statusNeedsAuth"),
		includeStatusLine: true,
		resolveConfigured: ({ cfg, accountId }) => resolveGoogleChatAccount({
			cfg,
			accountId
		}).credentialSource !== "none"
	}),
	introNote: {
		title: t("wizard.googlechat.setupTitle"),
		lines: [
			t("wizard.googlechat.setupServiceAccount"),
			t("wizard.googlechat.setupScopes"),
			t("wizard.googlechat.setupAudience"),
			t("wizard.channels.docs", { link: formatDocsLink("/channels/googlechat", "googlechat") })
		]
	},
	prepare: async ({ cfg, accountId, credentialValues, prompter }) => {
		if (accountId === "default" && Boolean(normalizeOptionalString(process.env[ENV_SERVICE_ACCOUNT]) || normalizeOptionalString(process.env[ENV_SERVICE_ACCOUNT_FILE]))) {
			if (await prompter.confirm({
				message: t("wizard.googlechat.useEnvPrompt"),
				initialValue: true
			})) return {
				cfg: applySetupAccountConfigPatch({
					cfg,
					channelKey: channel,
					accountId,
					patch: {}
				}),
				credentialValues: {
					...credentialValues,
					[USE_ENV_FLAG]: "1"
				}
			};
		}
		const method = await prompter.select({
			message: t("wizard.googlechat.authMethod"),
			options: [{
				value: "file",
				label: t("wizard.googlechat.serviceAccountFile")
			}, {
				value: "inline",
				label: t("wizard.googlechat.serviceAccountInline")
			}],
			initialValue: "file"
		});
		return { credentialValues: {
			...credentialValues,
			[USE_ENV_FLAG]: "0",
			[AUTH_METHOD_FLAG]: method
		} };
	},
	credentials: [],
	textInputs: [createServiceAccountTextInput({
		inputKey: "tokenFile",
		message: t("wizard.googlechat.serviceAccountPath"),
		placeholder: "/path/to/service-account.json",
		authMethod: "file",
		patchKey: "serviceAccountFile"
	}), createServiceAccountTextInput({
		inputKey: "token",
		message: t("wizard.googlechat.serviceAccountJson"),
		placeholder: "{\"type\":\"service_account\", ... }",
		authMethod: "inline",
		patchKey: "serviceAccount"
	})],
	finalize: async ({ cfg, accountId, prompter }) => {
		const account = resolveGoogleChatAccount({
			cfg,
			accountId
		});
		const audienceType = await prompter.select({
			message: t("wizard.googlechat.webhookAudienceType"),
			options: [{
				value: "app-url",
				label: t("wizard.googlechat.appUrlRecommended")
			}, {
				value: "project-number",
				label: t("wizard.googlechat.projectNumber")
			}],
			initialValue: account.config.audienceType === "project-number" ? "project-number" : "app-url"
		});
		const audience = await prompter.text({
			message: audienceType === "project-number" ? t("wizard.googlechat.projectNumber") : t("wizard.googlechat.appUrl"),
			placeholder: audienceType === "project-number" ? "1234567890" : "https://your.host/googlechat",
			initialValue: account.config.audience || void 0,
			validate: (value) => normalizeStringifiedOptionalString(value) ? void 0 : t("common.required")
		});
		return { cfg: migrateBaseNameToDefaultAccount({
			cfg: applySetupAccountConfigPatch({
				cfg,
				channelKey: channel,
				accountId,
				patch: {
					audienceType,
					audience: normalizeOptionalString(audience) ?? ""
				}
			}),
			channelKey: channel
		}) };
	},
	dmPolicy: googlechatDmPolicy
};
//#endregion
//#region extensions/googlechat/src/channel-base.ts
const GOOGLECHAT_CHANNEL_ID = "googlechat";
const googlechatMeta = {
	id: GOOGLECHAT_CHANNEL_ID,
	label: "Google Chat",
	selectionLabel: "Google Chat (Chat API)",
	docsPath: "/channels/googlechat",
	docsLabel: "googlechat",
	blurb: "Google Workspace Chat app with HTTP webhook.",
	aliases: ["gchat", "google-chat"],
	order: 55,
	detailLabel: "Google Chat",
	systemImage: "message.badge",
	markdownCapable: true
};
const formatGoogleChatAllowFromEntry = (entry) => normalizeLowercaseStringOrEmpty(entry.trim().replace(/^(googlechat|google-chat|gchat):/i, "").replace(/^user:/i, "").replace(/^users\//i, ""));
const googleChatConfigAdapter = createScopedChannelConfigAdapter({
	sectionKey: GOOGLECHAT_CHANNEL_ID,
	listAccountIds: listGoogleChatAccountIds,
	resolveAccount: adaptScopedAccountAccessor(resolveGoogleChatAccount),
	resolveAccessorAccount: resolveGoogleChatConfigAccessorAccount,
	defaultAccountId: resolveDefaultGoogleChatAccountId,
	clearBaseFields: [
		"serviceAccount",
		"serviceAccountFile",
		"audienceType",
		"audience",
		"webhookPath",
		"webhookUrl",
		"botUser",
		"name"
	],
	resolveAllowFrom: (account) => account.config.allowFrom,
	formatAllowFrom: (allowFrom) => formatNormalizedAllowFromEntries({
		allowFrom,
		normalizeEntry: formatGoogleChatAllowFromEntry
	}),
	resolveDefaultTo: (account) => account.config.defaultTo
});
function isGoogleChatAccountConfigured(account) {
	return account.tokenStatus ? account.tokenStatus !== "missing" : account.credentialSource !== "none";
}
function createGoogleChatPluginBase(params = {}) {
	return {
		id: GOOGLECHAT_CHANNEL_ID,
		meta: { ...googlechatMeta },
		setupContract: googlechatSetupContract,
		setupWizard: googlechatSetupWizard,
		capabilities: {
			chatTypes: [
				"direct",
				"group",
				"thread"
			],
			threads: true,
			media: true,
			nativeCommands: false,
			blockStreaming: true
		},
		streaming: { blockStreamingCoalesceDefaults: {
			minChars: 1500,
			idleMs: 1e3
		} },
		reload: { configPrefixes: ["channels.googlechat"] },
		...params.configSchema ? { configSchema: params.configSchema } : {},
		config: {
			...googleChatConfigAdapter,
			inspectAccount: adaptScopedAccountAccessor(inspectGoogleChatAccount),
			isConfigured: isGoogleChatAccountConfigured,
			describeAccount: (account) => describeAccountSnapshot({
				account,
				configured: isGoogleChatAccountConfigured(account),
				extra: {
					credentialSource: account.credentialSource,
					tokenStatus: account.tokenStatus
				}
			})
		}
	};
}
//#endregion
export { googlechatSetupAdapter as a, googlechatSetupWizard as i, createGoogleChatPluginBase as n, formatGoogleChatAllowFromEntry as r, GOOGLECHAT_CHANNEL_ID as t };
