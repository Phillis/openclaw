import { n as normalizeAccountId } from "./account-id-BRqK6RmF.js";
import { t as defineChannelSetupContract } from "./setup-contract-DNfi_CdO.js";
import { t as formatDocsLink } from "./links-ClIwBcy4.js";
import { t as createSetupTranslator } from "./i18n-BzsUVhtU.js";
import { a as createSetupInputPresenceValidator, c as patchScopedAccountConfig, i as createPatchedAccountSetupAdapter } from "./setup-helpers-D-LqhtmB.js";
import { j as setSetupChannelEnabled, p as mergeAllowFromEntries } from "./setup-wizard-helpers-Dm-d9du3.js";
import { i as createDelegatedSetupWizardProxy } from "./setup-credential-DGTRzzky.js";
import "./setup-BVnDItNa.js";
import "./channel-setup-BeEHkyUZ.js";
import { t as createChannelDmPolicy } from "./channel-dm-policy-BciMMWsn.js";
import { i as resolveZaloAccount, r as resolveDefaultZaloAccountId } from "./accounts-DYGQn3sb.js";
//#region extensions/zalo/src/setup-allow-from.ts
const t$1 = createSetupTranslator();
async function noteZaloTokenHelp(prompter) {
	await prompter.note([
		t$1("wizard.zalo.helpOpenPlatform"),
		t$1("wizard.zalo.helpCreateBot"),
		t$1("wizard.zalo.helpTokenFormat"),
		t$1("wizard.zalo.helpEnvTip"),
		`Docs: ${formatDocsLink("/channels/zalo", "zalo")}`
	].join("\n"), t$1("wizard.zalo.botTokenTitle"));
}
async function promptZaloAllowFrom(params) {
	const { cfg, prompter } = params;
	const accountId = params.accountId ?? resolveDefaultZaloAccountId(cfg);
	const existingAllowFrom = resolveZaloAccount({
		cfg,
		accountId
	}).config.allowFrom ?? [];
	const unique = mergeAllowFromEntries(existingAllowFrom, [(await prompter.text({
		message: t$1("wizard.zalo.allowFromPrompt"),
		placeholder: "123456789",
		initialValue: existingAllowFrom[0] ? String(existingAllowFrom[0]) : void 0,
		validate: (value) => {
			const raw = (value ?? "").trim();
			if (!raw) return t$1("common.required");
			if (!/^\d+$/.test(raw)) return t$1("wizard.zalo.allowFromNumeric");
		}
	})).trim()]);
	if (accountId === "default") return {
		...cfg,
		channels: {
			...cfg.channels,
			zalo: {
				...cfg.channels?.zalo,
				enabled: true,
				dmPolicy: "allowlist",
				allowFrom: unique
			}
		}
	};
	const currentAccount = cfg.channels?.zalo?.accounts?.[accountId];
	return {
		...cfg,
		channels: {
			...cfg.channels,
			zalo: {
				...cfg.channels?.zalo,
				enabled: true,
				accounts: {
					...cfg.channels?.zalo?.accounts,
					[accountId]: {
						...currentAccount,
						enabled: currentAccount?.enabled ?? true,
						dmPolicy: "allowlist",
						allowFrom: unique
					}
				}
			}
		}
	};
}
//#endregion
//#region extensions/zalo/src/setup-core.ts
const t = createSetupTranslator();
const channel = "zalo";
const zaloSetupAdapter = {
	...createPatchedAccountSetupAdapter({
		channelKey: channel,
		validateInput: createSetupInputPresenceValidator({
			defaultAccountOnlyEnvError: "ZALO_BOT_TOKEN can only be used for the default account.",
			whenNotUseEnv: [{
				someOf: ["token", "tokenFile"],
				message: "Zalo requires token or --token-file (or --use-env)."
			}]
		}),
		buildPatch: (input) => input.useEnv ? {} : input.tokenFile ? { tokenFile: input.tokenFile } : input.token ? { botToken: input.token } : {}
	}),
	singleAccountKeysToMove: ["webhookSecret", "tokenFile"]
};
const zaloSetupContract = defineChannelSetupContract({
	fields: {
		token: {
			kind: "string",
			sensitive: true,
			cli: {
				flags: "--token <token>",
				description: "Zalo bot token"
			}
		},
		tokenFile: {
			kind: "string",
			sensitive: true,
			cli: {
				flags: "--token-file <path>",
				description: "Zalo bot token file"
			}
		},
		useEnv: {
			kind: "boolean",
			cli: {
				flags: "--use-env",
				description: "Use ZALO_BOT_TOKEN"
			},
			envVars: ["ZALO_BOT_TOKEN"]
		}
	},
	legacyAdapter: zaloSetupAdapter
});
const zaloDmPolicy = createChannelDmPolicy({
	label: "Zalo",
	channel,
	resolveAccount: (cfg, accountId) => {
		return resolveZaloAccount({
			cfg,
			accountId: accountId && normalizeAccountId(accountId) ? normalizeAccountId(accountId) ?? "default" : resolveDefaultZaloAccountId(cfg)
		});
	},
	applyPatch: ({ cfg, account, patch }) => patchScopedAccountConfig({
		cfg,
		channelKey: channel,
		accountId: account.accountId,
		patch
	}),
	promptAllowFrom: async ({ cfg, prompter, accountId }) => promptZaloAllowFrom({
		cfg,
		prompter,
		accountId: accountId ?? resolveDefaultZaloAccountId(cfg)
	})
});
function createZaloSetupWizardProxy(loadWizard) {
	return createDelegatedSetupWizardProxy({
		channel,
		loadWizard,
		status: {
			configuredLabel: t("wizard.channels.statusConfigured"),
			unconfiguredLabel: t("wizard.channels.statusNeedsToken"),
			configuredHint: t("wizard.channels.statusRecommendedConfigured"),
			unconfiguredHint: t("wizard.channels.statusRecommendedNewcomerFriendly"),
			configuredScore: 1,
			unconfiguredScore: 10
		},
		credentials: [],
		delegateFinalize: true,
		dmPolicy: zaloDmPolicy,
		disable: (cfg) => setSetupChannelEnabled(cfg, channel, false)
	});
}
//#endregion
export { noteZaloTokenHelp as a, zaloSetupContract as i, zaloDmPolicy as n, promptZaloAllowFrom as o, zaloSetupAdapter as r, createZaloSetupWizardProxy as t };
