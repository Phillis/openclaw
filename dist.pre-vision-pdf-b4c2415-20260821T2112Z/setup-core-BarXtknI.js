import { n as normalizeAccountId } from "./account-id-BRqK6RmF.js";
import { t as defineChannelSetupContract } from "./setup-contract-DNfi_CdO.js";
import { l as prepareScopedSetupConfig } from "./setup-helpers-DKfRvbZ6.js";
import "./setup-BcJSTbge.js";
import "./channel-setup-BDsIe7lJ.js";
import { a as namedAccountPromotionKeys, i as validateMatrixSetupInput, n as applyMatrixSetupAccountConfig, o as resolveSingleAccountPromotionTarget, s as singleAccountKeysToMove, t as createMatrixSetupDmPolicy } from "./setup-dm-policy-md4NVAIR.js";
//#region extensions/matrix/src/setup-core.ts
const channel = "matrix";
function resolveMatrixSetupAccountId(params) {
	return normalizeAccountId(params.accountId?.trim() || params.name?.trim() || "default");
}
function createMatrixSetupWizardProxy(loadWizardModule) {
	let wizardPromise = null;
	const loadWizard = () => {
		wizardPromise ??= loadWizardModule().then((module) => module.matrixSetupWizard);
		return wizardPromise;
	};
	return {
		channel,
		getStatus: async (ctx) => await (await loadWizard()).getStatus(ctx),
		configure: async (ctx) => await (await loadWizard()).configure(ctx),
		configureInteractive: async (ctx) => {
			const wizard = await loadWizard();
			return await (wizard.configureInteractive ?? wizard.configure)(ctx);
		},
		configureWhenConfigured: async (ctx) => {
			const wizard = await loadWizard();
			return await (wizard.configureWhenConfigured ?? wizard.configureInteractive ?? wizard.configure)(ctx);
		},
		afterConfigWritten: async (ctx) => await (await loadWizard()).afterConfigWritten?.(ctx),
		dmPolicy: createMatrixSetupDmPolicy(async (params) => {
			const promptAllowFrom = (await loadWizard()).dmPolicy?.promptAllowFrom;
			return promptAllowFrom ? await promptAllowFrom(params) : params.cfg;
		}),
		disable: (cfg) => ({
			...cfg,
			channels: {
				...cfg.channels,
				matrix: {
					...cfg.channels?.matrix,
					enabled: false
				}
			}
		})
	};
}
const matrixSetupAdapter = {
	singleAccountKeysToMove,
	namedAccountPromotionKeys,
	resolveSingleAccountPromotionTarget,
	resolveAccountId: ({ accountId, input }) => resolveMatrixSetupAccountId({
		accountId,
		name: input?.name
	}),
	resolveBindingAccountId: ({ accountId, agentId }) => resolveMatrixSetupAccountId({
		accountId,
		name: agentId
	}),
	applyAccountName: ({ cfg, accountId, name }) => prepareScopedSetupConfig({
		cfg,
		channelKey: channel,
		accountId,
		name
	}),
	validateInput: ({ accountId, input }) => validateMatrixSetupInput({
		accountId,
		input
	}),
	applyAccountConfig: ({ cfg, accountId, input }) => applyMatrixSetupAccountConfig({
		cfg,
		accountId,
		input
	}),
	afterAccountConfigWritten: async ({ previousCfg, cfg, accountId, runtime }) => {
		const { runMatrixSetupBootstrapAfterConfigWrite } = await import("./setup-bootstrap-BIFBQzLt.js");
		await runMatrixSetupBootstrapAfterConfigWrite({
			previousCfg,
			cfg,
			accountId,
			runtime
		});
	}
};
const matrixSetupContract = defineChannelSetupContract({
	fields: {
		homeserver: {
			kind: "string",
			cli: {
				flags: "--homeserver <url>",
				description: "Matrix homeserver URL"
			}
		},
		userId: {
			kind: "string",
			cli: {
				flags: "--user-id <id>",
				description: "Matrix user id"
			}
		},
		accessToken: {
			kind: "string",
			sensitive: true,
			cli: {
				flags: "--access-token <token>",
				description: "Matrix access token"
			}
		},
		password: {
			kind: "string",
			sensitive: true,
			cli: {
				flags: "--password <password>",
				description: "Matrix password"
			}
		},
		deviceName: {
			kind: "string",
			cli: {
				flags: "--device-name <name>",
				description: "Matrix device name"
			}
		},
		avatarUrl: {
			kind: "string",
			cli: {
				flags: "--avatar-url <url>",
				description: "Matrix avatar URL"
			}
		},
		initialSyncLimit: {
			kind: "integer",
			cli: {
				flags: "--initial-sync-limit <n>",
				description: "Matrix initial sync room limit"
			}
		},
		proxy: {
			kind: "string",
			cli: {
				flags: "--proxy <url>",
				description: "Matrix proxy URL"
			}
		},
		dangerouslyAllowPrivateNetwork: {
			kind: "boolean",
			cli: {
				flags: "--dangerously-allow-private-network",
				description: "Allow private-network Matrix homeservers"
			}
		},
		useEnv: {
			kind: "boolean",
			cli: {
				flags: "--use-env",
				description: "Use Matrix environment credentials"
			}
		}
	},
	legacyAdapter: matrixSetupAdapter
});
//#endregion
export { matrixSetupAdapter as n, matrixSetupContract as r, createMatrixSetupWizardProxy as t };
