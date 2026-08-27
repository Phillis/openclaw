import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.js";
import { i as isPluginRegistryRetired } from "./registry-lifecycle-DOGws0E2.js";
import { n as resolveSelectedPluginCommandRegistry, t as listRegisteredPluginCommands } from "./plugin-command-registry-Be4XFGiW.js";
import { n as projectPluginCommandNativeMetadata, t as pluginCommandSupportsChannel } from "./plugin-command-metadata-jSFxBwiS.js";
import { t as matchRegisteredPluginCommand } from "./plugin-command-matcher-HWL--X0R.js";
import { t as retainPluginCommandCatalogForCurrentAccount } from "./plugin-command-account-start-scope-Dr3w7h_I.js";
//#region src/plugins/plugin-command-dispatch-contract.ts
/** Lightweight reply-option contract for prepared plugin command ownership. */
const PLUGIN_COMMAND_DISPATCH = Symbol.for("openclaw.pluginCommandDispatch");
//#endregion
//#region src/plugins/plugin-command-runtime.ts
/** Registry-bound plugin command selection and execution for native/channel surfaces. */
const dispatchSelections = /* @__PURE__ */ new WeakMap();
const runtimeStates = /* @__PURE__ */ new WeakMap();
const INVALID_SELECTION_REPLY = { text: "⚠️ This command selection is no longer valid. Please try again." };
const RETIRED_SELECTION_REPLY = { text: "⚠️ This command is no longer available after the plugin registry changed. Please try again." };
function createSelectedPluginCommandDispatch(runtime, state, command, channel, args) {
	const dispatch = Object.freeze({
		kind: "plugin",
		async execute(context) {
			if (this !== dispatch) return { ...INVALID_SELECTION_REPLY };
			return await executeSelectedPluginCommand(runtime, dispatch, context);
		}
	});
	dispatchSelections.set(dispatch, {
		runtime,
		registry: state.registry,
		command,
		channel: normalizeOptionalLowercaseString(channel) ?? "",
		...args?.trim() ? { args: args.trim() } : {}
	});
	return dispatch;
}
async function executeSelectedPluginCommand(runtime, dispatch, context) {
	const selected = dispatchSelections.get(dispatch);
	if (!selected || runtime && selected.runtime !== runtime) return { ...INVALID_SELECTION_REPLY };
	if (isPluginRegistryRetired(selected.registry)) return { ...RETIRED_SELECTION_REPLY };
	const channel = normalizeOptionalLowercaseString(context.channel) ?? "";
	if (selected.channel !== channel) return { ...INVALID_SELECTION_REPLY };
	const { executeRegisteredPluginCommand } = await import("./plugin-command-execution-DN05aCqN.js");
	if (isPluginRegistryRetired(selected.registry)) return { ...RETIRED_SELECTION_REPLY };
	return await executeRegisteredPluginCommand(selected.registry, {
		...context,
		args: selected.args,
		command: selected.command
	});
}
/** Validates and executes a dispatch carried through the core reply pipeline. */
async function executePluginCommandDispatch(dispatch, context) {
	return await executeSelectedPluginCommand(void 0, dispatch, context);
}
/** Creates one command runtime bound permanently to the current scoped registry generation. */
function createPluginCommandRuntime() {
	const registry = resolveSelectedPluginCommandRegistry();
	if (!registry) throw new Error("Plugin command runtime requires an active or request-scoped registry.");
	const state = Object.freeze({
		registry,
		commands: Object.freeze(listRegisteredPluginCommands(registry))
	});
	const assertCurrent = () => {
		if (isPluginRegistryRetired(state.registry)) throw new Error("Plugin command runtime is bound to a retired registry generation.");
	};
	const runtime = Object.freeze({
		listNativeCandidates(provider) {
			assertCurrent();
			const channel = normalizeOptionalLowercaseString(provider) ?? "";
			return Object.freeze(state.commands.filter((command) => pluginCommandSupportsChannel(command, channel)).map((command) => {
				const metadata = projectPluginCommandNativeMetadata(command, channel);
				return Object.freeze({
					...metadata,
					prepareDispatch(rawArgs) {
						const args = rawArgs?.trim();
						if (args && !command.acceptsArgs) return Object.freeze({ kind: "non-plugin" });
						return createSelectedPluginCommandDispatch(runtime, state, command, channel, args);
					}
				});
			}));
		},
		retainNativeCatalog(provider) {
			assertCurrent();
			const channel = normalizeOptionalLowercaseString(provider) ?? "";
			if (!state.commands.some((command) => pluginCommandSupportsChannel(command, channel))) return;
			retainPluginCommandCatalogForCurrentAccount(channel);
		}
	});
	runtimeStates.set(runtime, state);
	return runtime;
}
/** Core-only text matcher that returns a dispatch from the same bound runtime. */
function matchPluginCommandInvocation(runtime, commandBody, options) {
	const state = runtimeStates.get(runtime);
	if (!state) return null;
	if (isPluginRegistryRetired(state.registry)) throw new Error("Plugin command runtime is bound to a retired registry generation.");
	const channel = normalizeOptionalLowercaseString(options.channel) ?? "";
	const provider = normalizeOptionalLowercaseString(options.provider) ?? channel;
	const match = matchRegisteredPluginCommand({
		commands: state.commands,
		commandBody,
		channel,
		aliasScope: {
			kind: "provider",
			provider
		}
	});
	if (!match) return null;
	const metadata = projectPluginCommandNativeMetadata(match.command, provider);
	return Object.freeze({
		dispatch: createSelectedPluginCommandDispatch(runtime, state, match.command, channel, match.args),
		acceptsArgs: metadata.acceptsArgs,
		requireAuth: metadata.requireAuth,
		...metadata.progressMessage ? { progressMessage: metadata.progressMessage } : {}
	});
}
//#endregion
export { PLUGIN_COMMAND_DISPATCH as i, executePluginCommandDispatch as n, matchPluginCommandInvocation as r, createPluginCommandRuntime as t };
