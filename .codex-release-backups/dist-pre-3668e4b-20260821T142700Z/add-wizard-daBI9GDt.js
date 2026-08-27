import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.js";
import "./agent-scope-D9GLFAyB.js";
import { d as resolveAgentWorkspaceDir, p as resolveDefaultAgentId } from "./agent-scope-config-CsnnOL14.js";
import { n as normalizeAccountId } from "./account-id-BRqK6RmF.js";
import { l as readConfigFileSnapshot } from "./io-BTBpQ7uO.js";
import { n as resolveChannelSetupExecutionAdapter } from "./setup-contract-DNfi_CdO.js";
import "./config-CfeGo4K4.js";
import { n as getLoadedChannelPlugin, t as getChannelPlugin } from "./registry-BQt6AaEH.js";
import "./plugins-BItc4cFS.js";
import { t as describeBinding } from "./agents.binding-format-C3S9Mq5U.js";
import { t as applyAgentBindings } from "./agents.bindings-1PK731SW.js";
import { t as commitConfigWithPendingPluginInstalls } from "./install-record-commit-Ce0Yzvb3.js";
import { n as refreshPluginRegistryAfterConfigMutation } from "./registry-refresh-Arve5e6V.js";
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
	return await import("./onboard-channels-BVl-mh0D.js");
}
/** Resolve a raw channel name/alias against the installed setup entries. */
async function resolveInitialWizardChannel(raw, cfg) {
	const normalized = normalizeOptionalLowercaseString(raw);
	if (!normalized) return;
	const [{ listActiveChannelSetupPlugins }, { resolveChannelSetupEntries }] = await Promise.all([import("./setup-registry-xG__pnsQ.js"), import("./discovery-DKVvltoZ.js")]);
	const resolved = resolveChannelSetupEntries({
		cfg,
		installedPlugins: listActiveChannelSetupPlugins(),
		workspaceDir: resolveAgentWorkspaceDir(cfg, resolveDefaultAgentId(cfg))
	});
	return (resolved.entries.find((entry) => normalizeOptionalLowercaseString(entry.id) === normalized) ?? resolved.entries.find((entry) => (entry.meta.aliases ?? []).some((alias) => normalizeOptionalLowercaseString(alias) === normalized)))?.id;
}
/** Run the interactive channel-setup flow and persist the resulting config. */
async function runChannelsAddWizardFlow(params) {
	const { cfg, baseHash, runtime, prompter } = params;
	const [{ buildAgentSummaries }, onboardChannels] = await Promise.all([import("./agents.config-U4jUx7z5.js"), loadOnboardChannels()]);
	const postWriteHooks = onboardChannels.createChannelOnboardingPostWriteHookCollector();
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
		onPostWriteHook: (hook) => {
			postWriteHooks.collect(hook);
		},
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
		await params.beforePersistentEffect?.();
		const committed = await commitConfigWithPendingPluginInstalls({
			nextConfig: config,
			...baseHash !== void 0 ? { baseHash } : {}
		});
		if (committed.movedInstallRecords) await refreshPluginRegistryAfterConfigMutation({
			config: committed.config,
			reason: "source-changed",
			installRecords: committed.installRecords,
			logger: { warn: (message) => runtime.log(message) }
		});
		await onboardChannels.runCollectedChannelOnboardingPostWriteHooks({
			hooks: postWriteHooks.drain(),
			cfg: committed.config,
			runtime,
			...params.beforePersistentEffect ? { beforePersistentEffect: params.beforePersistentEffect } : {}
		});
		return committed.config;
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
			const defaultAgentId = resolveDefaultAgentId(nextConfig);
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
	const initialChannel = opts.channel ? await resolveInitialWizardChannel(opts.channel, cfg) : void 0;
	await runChannelsAddWizardFlow({
		cfg,
		...snapshot.hash !== void 0 ? { baseHash: snapshot.hash } : {},
		runtime,
		prompter,
		...initialChannel ? { initialChannel } : {},
		deferDeviceLinkToClient: true,
		...opts.onConfigured ? { onConfigured: opts.onConfigured } : {},
		...opts.beforePersistentEffect ? { beforePersistentEffect: opts.beforePersistentEffect } : {}
	});
}
//#endregion
export { resolveInitialWizardChannel, runChannelsAddWizardFlow, runChannelsSetupWizard };
