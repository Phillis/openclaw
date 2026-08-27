import "./account-id-BRqK6RmF.js";
import { a as resolveChannelDmAllowFrom, o as resolveChannelDmPolicy } from "./dm-access-C_vMmAfR.js";
import "./setup-helpers-D-LqhtmB.js";
import { N as splitSetupEntries, O as resolveSetupAccountId, b as patchChannelConfigForAccount, t as addWildcardAllowFrom, w as promptResolvedAllowFrom } from "./setup-wizard-helpers-Dm-d9du3.js";
import "./setup-credential-DGTRzzky.js";
import "./clack-prompter-FYG9QoOA.js";
//#region src/channels/plugins/setup-wizard-legacy-compat.ts
function patchLegacyChannelConfig(params) {
	const channelConfig = params.cfg.channels?.[params.channel] ?? {};
	const dmConfig = channelConfig.dm ?? {};
	return {
		...params.cfg,
		channels: {
			...params.cfg.channels,
			[params.channel]: {
				...channelConfig,
				...params.patch,
				dm: {
					...dmConfig,
					enabled: typeof dmConfig.enabled === "boolean" ? dmConfig.enabled : true
				}
			}
		}
	};
}
function setLegacyChannelDmPolicy(params) {
	const existingAllowFrom = resolveChannelDmAllowFrom({ account: params.cfg.channels?.[params.channel] ?? {} });
	const allowFrom = params.dmPolicy === "open" ? addWildcardAllowFrom(existingAllowFrom) : void 0;
	return patchLegacyChannelConfig({
		cfg: params.cfg,
		channel: params.channel,
		patch: {
			dmPolicy: params.dmPolicy,
			...allowFrom ? { allowFrom } : {}
		}
	});
}
/** @deprecated Compatibility for plugins published before setup policy became plugin-owned. */
function createLegacyCompatChannelDmPolicy(params) {
	return {
		label: params.label,
		channel: params.channel,
		policyKey: `channels.${params.channel}.dmPolicy`,
		allowFromKey: `channels.${params.channel}.allowFrom`,
		resolveConfigKeys: (_cfg, accountId) => accountId && accountId !== "default" ? {
			policyKey: `channels.${params.channel}.accounts.${accountId}.dmPolicy`,
			allowFromKey: `channels.${params.channel}.accounts.${accountId}.allowFrom`
		} : {
			policyKey: `channels.${params.channel}.dmPolicy`,
			allowFromKey: `channels.${params.channel}.allowFrom`
		},
		getCurrent: (cfg, accountId) => {
			const channelConfig = cfg.channels?.[params.channel] ?? {};
			return resolveChannelDmPolicy({
				account: accountId && accountId !== "default" ? channelConfig.accounts?.[accountId] : void 0,
				parent: channelConfig,
				defaultPolicy: "pairing"
			});
		},
		setPolicy: (cfg, policy, accountId) => accountId && accountId !== "default" ? patchChannelConfigForAccount({
			cfg,
			channel: params.channel,
			accountId,
			patch: {
				dmPolicy: policy,
				...policy === "open" ? { allowFrom: addWildcardAllowFrom(resolveChannelDmAllowFrom({
					account: (cfg.channels?.[params.channel])?.accounts?.[accountId],
					parent: cfg.channels?.[params.channel]
				})) } : {}
			}
		}) : setLegacyChannelDmPolicy({
			cfg,
			channel: params.channel,
			dmPolicy: policy
		}),
		...params.promptAllowFrom ? { promptAllowFrom: params.promptAllowFrom } : {}
	};
}
/** @deprecated Compatibility for plugins published before setup allowlists became plugin-owned. */
async function promptLegacyChannelAllowFromForAccount(params) {
	const accountId = resolveSetupAccountId({
		accountId: params.accountId,
		defaultAccountId: params.defaultAccountId
	});
	const account = params.resolveAccount(params.cfg, accountId);
	await params.prompter.note(params.noteLines.join("\n"), params.noteTitle);
	const allowFrom = await promptResolvedAllowFrom({
		prompter: params.prompter,
		existing: params.resolveExisting(account, params.cfg),
		token: params.resolveToken(account),
		message: params.message,
		placeholder: params.placeholder,
		label: params.noteTitle,
		parseInputs: splitSetupEntries,
		parseId: params.parseId,
		invalidWithoutTokenNote: params.invalidWithoutTokenNote,
		resolveEntries: params.resolveEntries
	});
	return patchLegacyChannelConfig({
		cfg: params.cfg,
		channel: params.channel,
		patch: { allowFrom }
	});
}
//#endregion
export { promptLegacyChannelAllowFromForAccount as n, createLegacyCompatChannelDmPolicy as t };
