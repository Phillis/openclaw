import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.js";
import "./agent-scope-DigoIwHb.js";
import { d as resolveAgentOperationAgentId, f as resolveAgentWorkspaceDir } from "./agent-scope-config-CUBiGmG3.js";
import { n as normalizeAccountId } from "./account-id-BH0zJUew.js";
import { s as readConfigFileSnapshot } from "./io-DlN5njvP.js";
import { n as resolveChannelSetupExecutionAdapter } from "./setup-contract-CIbR6uxD.js";
import "./config-B2bSneS2.js";
import { c as formatUnknownChannelMessage } from "./error-format-HTpcnFye.js";
import { n as getLoadedChannelPlugin, t as getChannelPlugin } from "./registry-CL5HFEAI.js";
import "./plugins-CmLI4MOi.js";
import { t as describeBinding } from "./agents.binding-format-BRYI5aWJ.js";
import { t as applyAgentBindings } from "./agents.bindings-BHWVU46E.js";
import { t as commitConfigWithPendingPluginInstalls } from "./install-record-commit-BwV39-oy.js";
import { n as refreshPluginRegistryAfterConfigMutation } from "./registry-refresh-DHzKSPNn.js";
//#region src/commands/channels/add-mutators.ts
/** Apply a display name to a channel account when the plugin supports account naming. */
function applyAccountName(params) {
	const accountId = normalizeAccountId(params.accountId);
	const plugin = params.plugin ?? getChannelPlugin(params.channel);
	const apply = plugin ? resolveChannelSetupExecutionAdapter(plugin)?.applyAccountName : void 0;
	return apply ? apply({
		cfg: params.cfg,
		accountId,
		name: params.name
	}) : params.cfg;
}
//#endregion
//#region src/commands/channels/add-wizard.ts
async function loadOnboardChannels() {
	return await import("./onboard-channels-BA395Ry6.js");
}
function unresolvedInitialWizardChannelTarget(channel) {
	return {
		kind: "unresolved",
		message: formatUnknownChannelMessage({ channel })
	};
}
/** Resolve omitted, matched, and unmatched channel targets without collapsing caller intent. */
async function resolveInitialWizardChannelTarget(raw, cfg) {
	if (raw === void 0) return { kind: "omitted" };
	const normalized = normalizeOptionalLowercaseString(raw);
	if (!normalized) return unresolvedInitialWizardChannelTarget("");
	const [{ listActiveChannelSetupPlugins }, { resolveChannelSetupEntries }] = await Promise.all([import("./setup-registry-D2b94872.js"), import("./discovery-CUUejx00.js")]);
	const resolved = resolveChannelSetupEntries({
		cfg,
		installedPlugins: listActiveChannelSetupPlugins(),
		workspaceDir: resolveAgentWorkspaceDir(cfg, resolveAgentOperationAgentId(cfg))
	});
	const matchedEntry = resolved.entries.find((candidate) => normalizeOptionalLowercaseString(candidate.id) === normalized) ?? resolved.entries.find((candidate) => (candidate.meta.aliases ?? []).some((alias) => normalizeOptionalLowercaseString(alias) === normalized));
	return matchedEntry ? {
		kind: "resolved",
		channel: matchedEntry.id
	} : unresolvedInitialWizardChannelTarget(raw.trim());
}
/** Run the interactive channel-setup flow and persist the resulting config. */
async function runChannelsAddWizardFlow(params) {
	const { cfg, baseHash, runtime, prompter } = params;
	const [{ buildAgentSummaries }, onboardChannels] = await Promise.all([import("./agents.config-DvsD-6Rr.js"), loadOnboardChannels()]);
	const channelSetup = onboardChannels.createChannelSetupTransaction({
		runtime,
		...params.beforePersistentEffect ? { beforePersistentEffect: params.beforePersistentEffect } : {}
	});
	let selection = [];
	const accountIds = {};
	const resolvedPlugins = /* @__PURE__ */ new Map();
	await prompter.intro("Channel setup");
	let nextConfig = await onboardChannels.setupChannels(cfg, runtime, prompter, {
		...params.initialChannel ? { initialSelection: [params.initialChannel] } : {},
		...params.initialChannel ? { finishAfterInitialSelection: true } : {},
		allowDisable: false,
		allowIMessageInstall: true,
		allowSignalInstall: true,
		...params.beforePersistentEffect ? { beforePersistentEffect: params.beforePersistentEffect } : {},
		...params.deferDeviceLinkToClient ? { deferDeviceLinkToClient: true } : {},
		onPostWriteHook: (hook) => channelSetup.onPostWriteHook(hook),
		promptAccountIds: true,
		deferStatusUntilSelection: true,
		skipStatusNote: true,
		onSelection: (value) => {
			selection = value;
		},
		onAccountId: (channel, accountId) => {
			accountIds[channel] = accountId;
		},
		onResolvedPlugin: (channel, plugin) => {
			resolvedPlugins.set(channel, plugin);
		}
	});
	const commitWizardConfig = async (config) => {
		return await channelSetup.commit(config, async (configToCommit) => {
			const committed = await commitConfigWithPendingPluginInstalls({
				nextConfig: configToCommit,
				...baseHash !== void 0 ? { baseHash } : {}
			});
			if (committed.movedInstallRecords) await refreshPluginRegistryAfterConfigMutation({
				config: committed.config,
				reason: "source-changed",
				installRecords: committed.installRecords,
				logger: { warn: (message) => runtime.log(message) }
			});
			return committed.config;
		});
	};
	if (selection.length === 0) {
		if (nextConfig !== cfg) {
			await commitWizardConfig(nextConfig);
			await prompter.outro("Channels updated.");
			return;
		}
		await prompter.outro("No channel changes made.");
		return;
	}
	const usesTargetedDefaults = params.initialChannel !== void 0 && selection.length === 1 && selection[0] === params.initialChannel;
	if (usesTargetedDefaults ? false : await prompter.confirm({
		message: "Name these channel accounts now? (optional)",
		initialValue: false
	})) for (const channel of selection) {
		const accountId = accountIds[channel] ?? "default";
		const plugin = resolvedPlugins.get(channel) ?? getLoadedChannelPlugin(channel);
		const account = plugin?.config.resolveAccount(nextConfig, accountId);
		const existingName = (plugin?.config.describeAccount?.(account, nextConfig))?.name ?? account?.name;
		const name = await prompter.text({
			message: `${channel} display name for account "${accountId}"`,
			initialValue: existingName
		});
		if (name?.trim()) nextConfig = applyAccountName({
			cfg: nextConfig,
			channel,
			accountId,
			name,
			plugin
		});
	}
	const bindTargets = selection.map((channel) => ({
		channel,
		accountId: accountIds[channel]?.trim()
	})).filter((value) => Boolean(value.accountId));
	if (bindTargets.length > 0) {
		const agentSummaries = buildAgentSummaries(nextConfig);
		if (usesTargetedDefaults && agentSummaries.length <= 1 ? false : usesTargetedDefaults ? true : await prompter.confirm({
			message: "Route these channel accounts to agents now?",
			initialValue: true
		})) {
			const defaultAgentId = resolveAgentOperationAgentId(nextConfig);
			for (const target of bindTargets) {
				const targetAgentId = await prompter.select({
					message: `Send ${target.channel}/${target.accountId} messages to agent`,
					options: agentSummaries.map((agent) => ({
						value: agent.id,
						label: agent.isDefault ? `${agent.id} (default)` : agent.id
					})),
					initialValue: defaultAgentId
				});
				const bindingResult = applyAgentBindings(nextConfig, [{
					agentId: targetAgentId,
					match: {
						channel: target.channel,
						accountId: target.accountId
					}
				}]);
				nextConfig = bindingResult.config;
				if (bindingResult.added.length > 0 || bindingResult.updated.length > 0) await prompter.note([...bindingResult.added.map((binding) => `Added: ${describeBinding(binding)}`), ...bindingResult.updated.map((binding) => `Updated: ${describeBinding(binding)}`)].join("\n"), "Routing bindings");
				if (bindingResult.conflicts.length > 0) await prompter.note(["Skipped bindings already claimed by another agent:", ...bindingResult.conflicts.map((conflict) => `- ${describeBinding(conflict.binding)} (agent=${conflict.existingAgentId})`)].join("\n"), "Routing bindings");
			}
		}
	}
	await commitWizardConfig(nextConfig);
	params.onConfigured?.(selection.map((channel) => ({
		channel,
		accountId: accountIds[channel] ?? "default"
	})));
	await prompter.outro("Channels updated.");
}
/**
* Gateway entry for `wizard.start {flow:"channels"}`. Unlike the CLI path this
* must never call runtime.exit — failures throw and surface as wizard errors.
*/
async function runChannelsSetupWizard(opts, runtime, prompter) {
	const snapshot = await readConfigFileSnapshot();
	if (snapshot.exists && !snapshot.valid) throw new Error("OpenClaw config is invalid; run `openclaw doctor --fix`, then retry channel setup.");
	const cfg = snapshot.sourceConfig ?? snapshot.config;
	const target = await resolveInitialWizardChannelTarget(opts.channel, cfg);
	if (target.kind === "unresolved") throw new Error(target.message);
	await runChannelsAddWizardFlow({
		cfg,
		...snapshot.hash !== void 0 ? { baseHash: snapshot.hash } : {},
		runtime,
		prompter,
		...target.kind === "resolved" ? { initialChannel: target.channel } : {},
		deferDeviceLinkToClient: true,
		...opts.onConfigured ? { onConfigured: opts.onConfigured } : {},
		...opts.beforePersistentEffect ? { beforePersistentEffect: opts.beforePersistentEffect } : {}
	});
}
//#endregion
export { resolveInitialWizardChannelTarget, runChannelsAddWizardFlow, runChannelsSetupWizard };
