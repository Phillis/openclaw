import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.js";
import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.js";
import { C as parseStrictNonNegativeInteger } from "./number-coercion-oCkfUEEq.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { t as formatCliCommand } from "./command-format-Dr_cCOb_.js";
import { r as defaultRuntime } from "./runtime-DtFIMC-W.js";
import "./agent-scope-D9GLFAyB.js";
import { d as resolveAgentWorkspaceDir, p as resolveDefaultAgentId } from "./agent-scope-config-CsnnOL14.js";
import { n as normalizeAccountId } from "./account-id-BRqK6RmF.js";
import { n as resolveChannelSetupExecutionAdapter } from "./setup-contract-DNfi_CdO.js";
import { i as getBundledChannelSetupPlugin } from "./bundled-lDYhdxhX.js";
import { n as ok, t as err } from "./result-BQGgYouL.js";
import { c as formatUnknownChannelMessage, l as formatUnsupportedChannelActionMessage } from "./error-format-BAHQH0iA.js";
import { r as isTerminalInteractive } from "./terminal-interactivity-Bmck99HR.js";
import { a as normalizeChannelId, n as getLoadedChannelPlugin, t as getChannelPlugin } from "./registry-BQt6AaEH.js";
import "./plugins-BItc4cFS.js";
import { r as parseOptionalDelimitedEntries } from "./helpers-C-WC19Mc.js";
import { s as moveSingleAccountChannelSectionToDefaultAccount } from "./setup-helpers-D-LqhtmB.js";
import { t as WizardCancelledError } from "./prompts-B0iOB1_a.js";
import { t as createClackPrompter } from "./clack-prompter-FYG9QoOA.js";
import { t as commitConfigWithPendingPluginInstalls } from "./install-record-commit-Ce0Yzvb3.js";
import { n as refreshPluginRegistryAfterConfigMutation } from "./registry-refresh-Arve5e6V.js";
import { n as resolveChannelSetupCliOptionMetadata } from "./cli-add-options-A5t52OYC.js";
import { n as requireValidConfigFileSnapshot } from "./config-validation-RWiVWlp1.js";
import { t as normalizeExternalChannelSetupConfig } from "./config-compatibility-IBvmNPtL.js";
import { c as shouldUseWizard } from "./shared-BcvIjl9U.js";
//#region src/channels/plugins/account-config-mutation.ts
function resolveMissingSetupEnvMessage(plugin, input) {
	if (!plugin.setupContract || !isRecord(input) || input.useEnv !== true) return;
	const useEnvField = plugin.setupContract.metadata.fields.find((field) => field.kind === "boolean" && field.key === "useEnv");
	if (!useEnvField?.envVars?.length) return;
	const { envVars, envVarMode } = useEnvField;
	const missing = envVars.filter((name) => !process.env[name]?.trim());
	if (envVarMode === "any" ? missing.length < envVars.length : !missing.length) return;
	return envVarMode === "any" ? `Set one of these environment variables before using --use-env: ${missing.join(", ")}.` : `Set these environment variables before using --use-env: ${missing.join(", ")}.`;
}
async function prepareChannelAccountConfiguration(params) {
	const setup = resolveChannelSetupExecutionAdapter(params.plugin);
	if (!setup?.applyAccountConfig) return err({ kind: "unsupported" });
	const rawInput = params.resolveInput();
	let input;
	if (params.plugin.setupContract) {
		const parsed = params.plugin.setupContract.parseInput(rawInput);
		if (!parsed.ok) return err({
			kind: "invalid-input",
			message: parsed.error
		});
		input = parsed.value;
	} else input = rawInput;
	const accountId = setup.resolveAccountId?.({
		cfg: params.cfg,
		accountId: params.requestedAccountId,
		input
	}) ?? normalizeAccountId(params.requestedAccountId);
	if (setup.prepareAccountConfigInput) {
		await params.beforePersistentEffect?.();
		input = await setup.prepareAccountConfigInput({
			cfg: params.cfg,
			accountId,
			input,
			runtime: params.runtime
		});
	}
	const validationError = setup.validateInput?.({
		cfg: params.cfg,
		accountId,
		input
	});
	if (validationError) return err({
		kind: "invalid-input",
		message: validationError
	});
	const missingEnvMessage = resolveMissingSetupEnvMessage(params.plugin, input);
	if (missingEnvMessage) return err({
		kind: "invalid-input",
		message: missingEnvMessage
	});
	return ok({
		plugin: params.plugin,
		setup,
		applyAccountConfig: setup.applyAccountConfig,
		accountId,
		input
	});
}
async function applyPreparedChannelAccountConfiguration(params) {
	const { accountId, applyAccountConfig, input, plugin, setup } = params.prepared;
	const configAccountId = normalizeAccountId(accountId);
	let nextConfig = params.cfg;
	if (accountId !== "default") nextConfig = moveSingleAccountChannelSectionToDefaultAccount({
		cfg: nextConfig,
		channelKey: params.channel,
		setupSurface: setup
	});
	nextConfig = applyAccountConfig({
		cfg: nextConfig,
		accountId: configAccountId,
		input
	});
	if (plugin.lifecycle?.onAccountConfigChanged) {
		await params.beforePersistentEffect?.();
		await plugin.lifecycle.onAccountConfigChanged({
			prevCfg: params.cfg,
			nextCfg: nextConfig,
			accountId,
			runtime: params.runtime
		});
	}
	return {
		nextConfig,
		accountId,
		input,
		...setup.afterAccountConfigWritten ? { afterAccountConfigWritten: setup.afterAccountConfigWritten } : {}
	};
}
function prepareChannelAccountRemoval(params) {
	const accountId = normalizeAccountId(params.accountId);
	return {
		plugin: params.plugin,
		action: params.action,
		accountId,
		accountKey: accountId || "default",
		shouldStopRuntime: Boolean(params.plugin.gateway?.startAccount || params.plugin.gateway?.logoutAccount)
	};
}
async function applyPreparedChannelAccountRemoval(params) {
	const { accountId, action, plugin } = params.prepared;
	if (action === "delete") {
		if (!plugin.config.deleteAccount) return err({
			kind: "unsupported-action",
			action
		});
		const nextConfig = plugin.config.deleteAccount({
			cfg: { ...params.cfg },
			accountId
		});
		await plugin.lifecycle?.onAccountRemoved?.({
			prevCfg: params.cfg,
			accountId,
			runtime: params.runtime
		});
		return ok({ nextConfig });
	}
	if (!plugin.config.setAccountEnabled) return err({
		kind: "unsupported-action",
		action
	});
	const nextConfig = plugin.config.setAccountEnabled({
		cfg: { ...params.cfg },
		accountId,
		enabled: false
	});
	await plugin.lifecycle?.onAccountConfigChanged?.({
		prevCfg: params.cfg,
		nextCfg: nextConfig,
		accountId,
		runtime: params.runtime
	});
	return ok({ nextConfig });
}
//#endregion
//#region src/commands/channels/runtime-label.ts
/** Resolve a display label from loaded, setup-only, or bundled channel plugin metadata. */
const channelLabel = (channel) => {
	return (getLoadedChannelPlugin(channel) ?? getBundledChannelSetupPlugin(channel) ?? getChannelPlugin(channel))?.meta.label ?? channel;
};
//#endregion
//#region src/commands/channels/add.ts
const channelSetupPluginInstallLoader = createLazyImportLoader(() => import("./plugin-install-DDGLWhHH.js"));
const onboardChannelsLoader = createLazyImportLoader(() => import("./onboard-channels-BVl-mh0D.js"));
function loadChannelSetupPluginInstall() {
	return channelSetupPluginInstallLoader.load();
}
function loadOnboardChannels() {
	return onboardChannelsLoader.load();
}
const CHANNEL_ADD_CONTROL_OPTION_KEYS = /* @__PURE__ */ new Set(["channel", "account"]);
async function resolveCatalogChannelEntry(raw, cfg) {
	const trimmed = normalizeOptionalLowercaseString(raw);
	if (!trimmed) return;
	return (cfg ? await import("./trusted-catalog-BJiBxPWH.js").then(({ listTrustedChannelPluginCatalogEntries }) => listTrustedChannelPluginCatalogEntries({
		cfg,
		workspaceDir: resolveAgentWorkspaceDir(cfg, resolveDefaultAgentId(cfg))
	})) : await import("./catalog-BIfLuGuv.js").then(({ listRawChannelPluginCatalogEntries }) => listRawChannelPluginCatalogEntries({ excludeWorkspace: true }))).find((entry) => {
		if (normalizeOptionalLowercaseString(entry.id) === trimmed) return true;
		return (entry.meta.aliases ?? []).some((alias) => normalizeOptionalLowercaseString(alias) === trimmed);
	});
}
function buildChannelSetupInput(opts) {
	const input = {};
	const { valueMetadataByAttributeName } = resolveChannelSetupCliOptionMetadata(opts.channel);
	for (const [key, value] of Object.entries(opts)) {
		if (CHANNEL_ADD_CONTROL_OPTION_KEYS.has(key) || value === void 0) continue;
		const metadata = valueMetadataByAttributeName.get(key);
		if (metadata?.valueType !== "int") {
			input[key] = metadata?.valueType === "list" ? Array.isArray(value) ? value.filter((entry) => typeof entry === "string") : parseOptionalDelimitedEntries(typeof value === "string" ? value : void 0) : value;
			continue;
		}
		if (value === null || value === "") {
			input[key] = void 0;
			continue;
		}
		const parsed = parseStrictNonNegativeInteger(value);
		if (parsed === void 0) throw new Error(`${metadata.longFlag} must be a non-negative integer.`);
		input[key] = parsed;
	}
	return input;
}
function buildChannelOwnedSetupInput(opts) {
	return Object.fromEntries(Object.entries(opts).filter(([key, value]) => !CHANNEL_ADD_CONTROL_OPTION_KEYS.has(key) && value !== void 0));
}
/** Add or configure a channel account, using the wizard when no concrete flags are supplied. */
async function channelsAddCommand(opts, runtime = defaultRuntime, params) {
	try {
		return await channelsAddCommandImpl(opts, runtime, params);
	} catch (err) {
		if (err instanceof WizardCancelledError) {
			runtime.exit(1);
			return;
		}
		throw err;
	}
}
async function channelsAddCommandImpl(opts, runtime, params) {
	const configSnapshot = await requireValidConfigFileSnapshot(runtime);
	if (!configSnapshot) return;
	const cfg = configSnapshot.sourceConfig ?? configSnapshot.config;
	const baseHash = configSnapshot.hash;
	let nextConfig = cfg;
	let pluginRegistrySourceChanged = false;
	if (shouldUseWizard(params)) {
		if (!isTerminalInteractive()) {
			runtime.error("Interactive channel setup requires a TTY. Use `openclaw channels add --channel <id> --use-env` or pass the channel's credential flags for non-interactive setup.");
			runtime.exit(1);
			return;
		}
		const { resolveInitialWizardChannel, runChannelsAddWizardFlow } = await import("./add-wizard-daBI9GDt.js");
		const initialChannel = await resolveInitialWizardChannel(opts.channel ?? "", cfg);
		await runChannelsAddWizardFlow({
			cfg,
			...baseHash !== void 0 ? { baseHash } : {},
			runtime,
			prompter: createClackPrompter(),
			...initialChannel ? { initialChannel } : {},
			...params?.beforePersistentEffect ? { beforePersistentEffect: params.beforePersistentEffect } : {}
		});
		return;
	}
	const rawChannel = opts.channel ?? "";
	let channel = normalizeChannelId(rawChannel);
	let catalogEntry = await resolveCatalogChannelEntry(rawChannel, nextConfig);
	const resolveWorkspaceDir = () => resolveAgentWorkspaceDir(nextConfig, resolveDefaultAgentId(nextConfig));
	const loadScopedPlugin = async (channelId, pluginId) => {
		const existing = getLoadedChannelPlugin(channelId);
		if (existing?.setupContract?.applyAccountConfig || existing?.setup?.applyAccountConfig) return existing;
		const { loadChannelSetupPluginRegistrySnapshotForChannel } = await loadChannelSetupPluginInstall();
		const snapshot = loadChannelSetupPluginRegistrySnapshotForChannel({
			cfg: nextConfig,
			runtime,
			channel: channelId,
			...pluginId ? { pluginId } : {},
			workspaceDir: resolveWorkspaceDir(),
			forceSetupOnlyChannelPlugins: true
		});
		return snapshot.channelSetups.find((entry) => entry.plugin.id === channelId)?.plugin ?? getBundledChannelSetupPlugin(channelId) ?? snapshot.channels.find((entry) => entry.plugin.id === channelId)?.plugin ?? existing;
	};
	if (catalogEntry) {
		const workspaceDir = resolveWorkspaceDir();
		const { isCatalogChannelInstalled } = await import("./discovery-DKVvltoZ.js");
		const registeredPlugin = channel ? getLoadedChannelPlugin(channel) : void 0;
		const bundledSetupPlugin = channel ? getBundledChannelSetupPlugin(channel) : void 0;
		if (!registeredPlugin && !bundledSetupPlugin && !isCatalogChannelInstalled({
			cfg: nextConfig,
			entry: catalogEntry,
			workspaceDir
		})) {
			const { ensureChannelSetupPluginInstalled } = await loadChannelSetupPluginInstall();
			const prompter = createClackPrompter();
			const result = await ensureChannelSetupPluginInstalled({
				cfg: nextConfig,
				entry: catalogEntry,
				prompter,
				runtime,
				workspaceDir,
				promptInstall: false,
				...params?.beforePersistentEffect ? { beforePersistentEffect: params.beforePersistentEffect } : {}
			});
			nextConfig = result.cfg;
			if (!result.installed) return;
			pluginRegistrySourceChanged = true;
			catalogEntry = {
				...catalogEntry,
				...result.pluginId ? { pluginId: result.pluginId } : {}
			};
		}
		channel ??= normalizeChannelId(catalogEntry.id) ?? catalogEntry.id;
	}
	if (!channel) {
		const hint = catalogEntry ? `Plugin ${catalogEntry.meta.label} could not be loaded after install. Run openclaw doctor --fix, then retry openclaw channels add.` : formatUnknownChannelMessage({ channel: rawChannel });
		runtime.error(hint);
		runtime.exit(1);
		return;
	}
	const plugin = await loadScopedPlugin(channel, catalogEntry?.pluginId);
	if (!plugin) {
		runtime.error(`${formatUnsupportedChannelActionMessage({
			channel,
			action: "non-interactive add"
		})} Run ${formatCliCommand("openclaw channels add")} with no flags for guided setup.`);
		runtime.exit(1);
		return;
	}
	const prepared = await prepareChannelAccountConfiguration({
		cfg: nextConfig,
		plugin,
		requestedAccountId: opts.account,
		resolveInput: () => plugin.setupContract ? buildChannelOwnedSetupInput(opts) : buildChannelSetupInput(opts),
		runtime,
		...params?.beforePersistentEffect ? { beforePersistentEffect: params.beforePersistentEffect } : {}
	});
	if (!prepared.ok) {
		runtime.error(prepared.error.kind === "unsupported" ? `${formatUnsupportedChannelActionMessage({
			channel,
			action: "non-interactive add"
		})} Run ${formatCliCommand("openclaw channels add")} with no flags for guided setup.` : prepared.error.message);
		runtime.exit(1);
		return;
	}
	const applied = await applyPreparedChannelAccountConfiguration({
		cfg: nextConfig,
		channel,
		prepared: prepared.value,
		runtime,
		...params?.beforePersistentEffect ? { beforePersistentEffect: params.beforePersistentEffect } : {}
	});
	nextConfig = normalizeExternalChannelSetupConfig({
		cfg: applied.nextConfig,
		channel
	});
	await params?.beforePersistentEffect?.();
	const committed = await commitConfigWithPendingPluginInstalls({
		nextConfig,
		...baseHash !== void 0 ? { baseHash } : {}
	});
	const writtenConfig = committed.config;
	if (committed.movedInstallRecords || pluginRegistrySourceChanged) await refreshPluginRegistryAfterConfigMutation({
		config: writtenConfig,
		reason: "source-changed",
		...committed.movedInstallRecords ? { installRecords: committed.installRecords } : {},
		logger: { warn: (message) => runtime.log(message) }
	});
	runtime.log(`Added ${plugin.meta.label ?? channelLabel(channel)} account "${applied.accountId}".`);
	const afterAccountConfigWritten = applied.afterAccountConfigWritten;
	if (afterAccountConfigWritten) {
		const { runCollectedChannelOnboardingPostWriteHooks } = await loadOnboardChannels();
		await runCollectedChannelOnboardingPostWriteHooks({
			hooks: [{
				channel,
				accountId: applied.accountId,
				run: async ({ cfg: writtenCfg, runtime: hookRuntime }) => await afterAccountConfigWritten({
					previousCfg: cfg,
					cfg: writtenCfg,
					accountId: applied.accountId,
					input: applied.input,
					runtime: hookRuntime
				})
			}],
			cfg: writtenConfig,
			runtime,
			...params?.beforePersistentEffect ? { beforePersistentEffect: params.beforePersistentEffect } : {}
		});
	}
}
//#endregion
export { prepareChannelAccountRemoval as i, channelLabel as n, applyPreparedChannelAccountRemoval as r, channelsAddCommand as t };
