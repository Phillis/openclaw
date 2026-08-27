import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { c as resolveUserPath } from "./home-dir-DcrXWQPU.js";
import { m as shortenHomePath } from "./utils-DEqefz4f.js";
import { t as formatCliCommand } from "./command-format-Dr_cCOb_.js";
import { a as writeRuntimeJson, r as defaultRuntime } from "./runtime-DtFIMC-W.js";
import "./agent-scope-BizOtGGz.js";
import { n as normalizeAgentId } from "./agent-id-Db0rqw_J.js";
import { d as resolveAgentWorkspaceDir, l as resolveAgentDir, p as resolveDefaultAgentId, r as listAgentEntries } from "./agent-scope-config-BdXMWufB.js";
import { c as resolveSharedMainAuthAgentDir } from "./path-resolve-CttHagpC.js";
import { a as inspectPersistedAuthProfileStoreRaw, m as resolveAuthProfileDatabasePath } from "./sqlite-CtUje688.js";
import { r as AuthProfileStoreUnreadableError } from "./legacy-source-diagnostic-rVpdYvZu.js";
import { a as loadPersistedAuthProfileStore } from "./persisted-tYYP9V51.js";
import { p as loadAuthProfileStoreWithoutExternalProfiles, r as ensureAuthProfileStore, v as saveAuthProfileStore } from "./store-2zwMbXSG.js";
import { r as isReservedSystemAgentId } from "./agent-id-BYpRMvce.js";
import { t as buildPortableAuthProfileStoreForAgentCopy } from "./auth-profiles-i3N9ji0c.js";
import { n as ensureOnboardingAgentWorkspace, r as resolveOnboardingAgentTarget } from "./onboard-agent-target-CMWQlqye.js";
import { t as WizardCancelledError } from "./prompts-B0iOB1_a.js";
import { t as createClackPrompter } from "./clack-prompter-9tEHHVYQ.js";
import { r as logConfigUpdated } from "./logging-CVOiRigR.js";
import { t as describeBinding } from "./agents.binding-format-C3S9Mq5U.js";
import { n as buildChannelBindings, t as applyAgentBindings } from "./agents.bindings-laCM4ySw.js";
import { t as applyAgentConfig } from "./agents.config-C5ikYlLh.js";
import { n as createAgent, t as checkAgentCreationGate } from "./agent-create-CFvN6X4B.js";
import { t as withPluginLifecycleLease } from "./plugin-lifecycle-lease-wbp6QsX_.js";
import { s as transformConfigWithPendingPluginInstalls, t as commitConfigWithPendingPluginInstalls } from "./install-record-commit-DQjHzbZN.js";
import { n as promptAuthChoiceGrouped } from "./auth-choice-prompt-iNi2vnGr.js";
import { i as applyAuthChoice, r as warnIfModelConfigLooksOff } from "./auth-choice-DPisswJh.js";
import { n as requireValidConfigFileSnapshot } from "./config-validation-DQ3LvziX.js";
import { i as setupChannels } from "./onboard-channels-CtHMUmDt.js";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/commands/agents.commands.add.ts
function emptyBindingResult(config) {
	return {
		config,
		added: [],
		updated: [],
		skipped: [],
		conflicts: []
	};
}
function loadReadablePersistedAuthProfileStore(agentDir) {
	const store = loadPersistedAuthProfileStore(agentDir);
	if (!store && inspectPersistedAuthProfileStoreRaw(agentDir).status !== "missing") throw new AuthProfileStoreUnreadableError(agentDir);
	return store;
}
function hasOAuthProfiles(store, profileIds) {
	return profileIds.some((profileId) => store.profiles[profileId]?.type === "oauth");
}
function formatSkippedOAuthProfilesMessage(sourceAgentId, sourceIsInheritedMain) {
	return sourceIsInheritedMain ? `OAuth profiles stay shared from "${sourceAgentId}" unless this agent signs in separately.` : `OAuth profiles were not copied from "${sourceAgentId}"; sign in separately for this agent.`;
}
/** Create or update an agent through the non-interactive path or guided wizard. */
async function agentsAddCommand(opts, runtime = defaultRuntime, params) {
	const configSnapshot = await requireValidConfigFileSnapshot(runtime);
	if (!configSnapshot) return;
	const cfg = configSnapshot.sourceConfig ?? configSnapshot.config;
	const baseHash = configSnapshot.hash;
	const workspaceFlag = opts.workspace?.trim();
	const nameInput = opts.name?.trim();
	const hasFlags = params?.hasFlags === true;
	if (opts.nonInteractive === true || hasFlags) {
		if (!workspaceFlag) {
			runtime.error(`Non-interactive agent creation requires --workspace. Re-run ${formatCliCommand("openclaw agents add <id> --workspace <path>")} or omit flags to use the wizard.`);
			runtime.exit(1);
			return;
		}
		if (!nameInput) {
			runtime.error(`Agent name is required in non-interactive mode. Run ${formatCliCommand("openclaw agents add <id> --workspace <path>")}.`);
			runtime.exit(1);
			return;
		}
		const agentId = normalizeAgentId(nameInput);
		if (agentId !== nameInput) runtime.log(`Normalized agent id to "${agentId}".`);
		const created = await withPluginLifecycleLease({}, async () => {
			return await createAgent({
				name: nameInput,
				workspace: workspaceFlag,
				...opts.agentDir ? { agentDir: opts.agentDir } : {},
				...opts.model ? { model: opts.model } : {},
				...opts.bind?.length ? { bindingSpecs: opts.bind } : {},
				transformConfig: transformConfigWithPendingPluginInstalls
			});
		});
		if (created.status === "error") {
			runtime.error(created.reason === "reserved-id" ? `"${created.agentId}" is reserved. Choose another name, or run ${formatCliCommand("openclaw agents list")} to inspect configured agents.` : created.reason === "already-exists" ? `Agent "${created.agentId}" already exists.` : created.message);
			runtime.exit(1);
			return;
		}
		const bindingResult = created.bindingResult ?? emptyBindingResult(cfg);
		if (!opts.json) logConfigUpdated(runtime);
		const payload = {
			agentId: created.agentId,
			name: created.name,
			workspace: created.workspace,
			agentDir: created.agentDir,
			model: created.model,
			bindings: {
				added: bindingResult.added.map(describeBinding),
				updated: bindingResult.updated.map(describeBinding),
				skipped: bindingResult.skipped.map(describeBinding),
				conflicts: bindingResult.conflicts.map((conflict) => `${describeBinding(conflict.binding)} (agent=${conflict.existingAgentId})`)
			}
		};
		if (opts.json) writeRuntimeJson(runtime, payload);
		else {
			runtime.log(`Agent: ${agentId}`);
			runtime.log(`Workspace: ${shortenHomePath(created.workspace)}`);
			runtime.log(`Agent dir: ${shortenHomePath(created.agentDir)}`);
			if (created.model) runtime.log(`Model: ${created.model}`);
			if (bindingResult.conflicts.length > 0) runtime.error(["Skipped bindings already claimed by another agent:", ...bindingResult.conflicts.map((conflict) => `- ${describeBinding(conflict.binding)} (agent=${conflict.existingAgentId})`)].join("\n"));
		}
		return;
	}
	const prompter = createClackPrompter();
	try {
		await prompter.intro("Add OpenClaw agent");
		const agentName = normalizeOptionalString(nameInput ?? await prompter.text({
			message: "Agent name",
			validate: (value) => {
				if (!value?.trim()) return "Required";
				const normalized = normalizeAgentId(value);
				if (isReservedSystemAgentId(normalized)) return `"${normalized}" is reserved. Choose another name.`;
			}
		})) ?? "";
		const agentId = normalizeAgentId(agentName);
		if (isReservedSystemAgentId(agentId)) {
			await prompter.outro(`"${agentId}" is reserved. Choose another name.`);
			return;
		}
		if (agentName !== agentId) await prompter.note(`Normalized id to "${agentId}".`, "Agent id");
		const existingAgent = listAgentEntries(cfg).find((agent) => normalizeAgentId(agent.id) === agentId);
		if (existingAgent) {
			if (!await prompter.confirm({
				message: `Agent "${agentId}" already exists. Update it?`,
				initialValue: false
			})) {
				await prompter.outro("No changes made.");
				return;
			}
		} else {
			const gateError = await checkAgentCreationGate(agentId);
			if (gateError) {
				await prompter.outro(gateError.message);
				return;
			}
		}
		const workspaceDefault = resolveAgentWorkspaceDir(cfg, agentId);
		const workspaceDir = resolveUserPath(normalizeOptionalString(await prompter.text({
			message: "Workspace directory",
			initialValue: workspaceDefault,
			validate: (value) => value?.trim() ? void 0 : "Required"
		})) || workspaceDefault);
		const agentDir = resolveAgentDir(cfg, agentId);
		let nextConfig = applyAgentConfig(cfg, {
			agentId,
			name: agentName,
			workspace: workspaceDir,
			agentDir
		});
		const defaultAgentId = resolveDefaultAgentId(cfg);
		if (defaultAgentId !== agentId) {
			const sourceAgentDir = resolveAgentDir(cfg, defaultAgentId);
			const sourceAuthPath = resolveAuthProfileDatabasePath(sourceAgentDir);
			const destAuthPath = resolveAuthProfileDatabasePath(agentDir);
			const sharedMainAgentPath = resolveAuthProfileDatabasePath(resolveSharedMainAuthAgentDir());
			const sameAuthPath = normalizeLowercaseStringOrEmpty(path.resolve(sourceAuthPath)) === normalizeLowercaseStringOrEmpty(path.resolve(destAuthPath));
			const sourceIsInheritedMain = normalizeLowercaseStringOrEmpty(path.resolve(sourceAuthPath)) === normalizeLowercaseStringOrEmpty(path.resolve(sharedMainAgentPath));
			if (!sameAuthPath) {
				const sourceStore = sourceIsInheritedMain ? loadAuthProfileStoreWithoutExternalProfiles(sourceAgentDir) : loadReadablePersistedAuthProfileStore(sourceAgentDir);
				const destStore = loadReadablePersistedAuthProfileStore(agentDir);
				const portable = sourceStore ? buildPortableAuthProfileStoreForAgentCopy(sourceStore) : void 0;
				if (sourceStore && portable && portable.copiedProfileIds.length > 0 && Object.keys(destStore?.profiles ?? {}).length === 0) {
					if (await prompter.confirm({
						message: `Copy portable auth profiles from "${defaultAgentId}"?`,
						initialValue: false
					})) {
						await fs.mkdir(agentDir, { recursive: true });
						saveAuthProfileStore(portable.store, agentDir, {
							filterExternalAuthProfiles: false,
							syncExternalCli: false
						});
						const persistedDestStore = loadPersistedAuthProfileStore(agentDir);
						const copiedCount = portable.copiedProfileIds.filter((profileId) => persistedDestStore?.profiles[profileId] !== void 0).length;
						const skippedOAuthProfiles = hasOAuthProfiles(sourceStore, portable.skippedProfileIds) || portable.copiedProfileIds.some((profileId) => sourceStore.profiles[profileId]?.type === "oauth" && persistedDestStore?.profiles[profileId] === void 0);
						const copiedText = copiedCount > 0 ? `Copied ${copiedCount} portable auth profile${copiedCount === 1 ? "" : "s"} from "${defaultAgentId}".` : "";
						const skippedText = skippedOAuthProfiles ? ` ${formatSkippedOAuthProfilesMessage(defaultAgentId, sourceIsInheritedMain)}` : "";
						await prompter.note(`${copiedText}${skippedText}`.trim(), "Auth profiles");
					}
				} else if (sourceStore && portable && hasOAuthProfiles(sourceStore, portable.skippedProfileIds)) await prompter.note(formatSkippedOAuthProfilesMessage(defaultAgentId, sourceIsInheritedMain), "Auth profiles");
			}
		}
		if (await prompter.confirm({
			message: "Configure model/auth for this agent now?",
			initialValue: false
		})) {
			const authStore = ensureAuthProfileStore(agentDir, { allowKeychainPrompt: false });
			while (true) {
				const authResult = await applyAuthChoice({
					authChoice: await promptAuthChoiceGrouped({
						prompter,
						store: authStore,
						includeSkip: true,
						config: nextConfig
					}),
					config: nextConfig,
					prompter,
					runtime,
					agentDir,
					setDefaultModel: false,
					agentId
				});
				nextConfig = authResult.config;
				if (authResult.retrySelection) continue;
				if (authResult.agentModelOverride) nextConfig = applyAgentConfig(nextConfig, {
					agentId,
					model: authResult.agentModelOverride
				});
				break;
			}
		}
		await warnIfModelConfigLooksOff(nextConfig, prompter, {
			agentId,
			agentDir,
			validateCatalog: false
		});
		let selection = [];
		const channelAccountIds = {};
		nextConfig = await setupChannels(nextConfig, runtime, prompter, {
			allowIMessageInstall: true,
			allowSignalInstall: true,
			onSelection: (value) => {
				selection = value;
			},
			promptAccountIds: true,
			onAccountId: (channel, accountId) => {
				channelAccountIds[channel] = accountId;
			}
		});
		if (selection.length > 0) if (await prompter.confirm({
			message: "Route selected channels to this agent now? (bindings)",
			initialValue: false
		})) {
			const desiredBindings = buildChannelBindings({
				agentId,
				selection,
				config: nextConfig,
				accountIds: channelAccountIds
			});
			const result = applyAgentBindings(nextConfig, desiredBindings);
			nextConfig = result.config;
			if (result.conflicts.length > 0) await prompter.note(["Skipped bindings already claimed by another agent:", ...result.conflicts.map((conflict) => `- ${describeBinding(conflict.binding)} (agent=${conflict.existingAgentId})`)].join("\n"), "Routing bindings");
		} else await prompter.note(["Routing unchanged. Add bindings when you're ready.", "Docs: https://docs.openclaw.ai/concepts/multi-agent"].join("\n"), "Routing");
		let payload;
		if (existingAgent) {
			nextConfig = (await commitConfigWithPendingPluginInstalls({
				nextConfig,
				...baseHash !== void 0 ? { baseHash } : {}
			})).config;
			const target = resolveOnboardingAgentTarget(nextConfig, agentId);
			await ensureOnboardingAgentWorkspace(target, runtime, {
				skipBootstrap: Boolean(nextConfig.agents?.defaults?.skipBootstrap),
				skipOptionalBootstrapFiles: nextConfig.agents?.defaults?.skipOptionalBootstrapFiles
			});
			payload = {
				agentId: target.agentId,
				name: agentName,
				workspace: target.workspaceDir,
				agentDir: target.agentDir
			};
		} else {
			const entry = listAgentEntries(nextConfig).find((candidate) => normalizeAgentId(candidate.id) === agentId);
			if (!entry) throw new Error(`staged agent "${agentId}" is missing from config`);
			const created = await createAgent({
				entry: {
					...entry,
					id: agentId
				},
				expectedConfigHash: baseHash ?? null,
				stagedConfig: nextConfig,
				transformConfig: transformConfigWithPendingPluginInstalls
			});
			if (created.status === "error") {
				await prompter.outro(created.message);
				return;
			}
			payload = {
				agentId: created.agentId,
				name: created.name,
				workspace: created.workspace,
				agentDir: created.agentDir
			};
		}
		logConfigUpdated(runtime);
		if (opts.json) writeRuntimeJson(runtime, payload);
		await prompter.outro(`Agent "${agentId}" ready.`);
	} catch (err) {
		if (err instanceof WizardCancelledError) {
			runtime.exit(1);
			return;
		}
		throw err;
	}
}
//#endregion
export { agentsAddCommand };
