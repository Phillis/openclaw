import { E as isModelsStatusJsonOutput } from "./argv-CCdO9MSu.js";
import { r as theme } from "./theme-vjDs9tao.js";
import { t as formatDocsLink } from "./links-ClIwBcy4.js";
import { n as setCommandJsonMode } from "./json-mode-BvX-XNl0.js";
//#region src/cli/models-cli.ts
function createModuleLoader(load) {
	let promise;
	return () => promise ??= load();
}
const loadModelsRuntime = createModuleLoader(() => import("./models-cli.runtime.js"));
const loadModelsStatusCommands = createModuleLoader(() => import("./list.status-command-CQ3A3dj6.js"));
const loadModelsAliasesCommands = createModuleLoader(() => import("./aliases-_t9RDxPL.js"));
const loadModelsFallbacksCommands = createModuleLoader(() => import("./fallbacks-shared-DBLYsyhH.js"));
const loadModelsAuthCommands = createModuleLoader(() => import("./auth-CabbqJZC.js"));
const loadModelsAuthOrderCommands = createModuleLoader(() => import("./auth-order-Dl_tRaAw.js"));
async function withModelsRuntime(action) {
	const runtime = await loadModelsRuntime();
	return runtime.runModelsCommand(() => action(runtime));
}
function registerModelsCli(program) {
	const models = program.command("models").description("Model discovery, scanning, and configuration").option("--json", "Output JSON (alias for `models status --json`)", false).option("--status-json", "Output JSON (alias for `models status --json`)", false).option("--status-plain", "Plain output (alias for `models status --plain`)", false).option("--agent <id>", "Agent id to inspect (overrides OPENCLAW_AGENT_DIR)").addHelpText("after", () => `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/models", "docs.openclaw.ai/cli/models")}\n`);
	const hasJsonOutput = (opts) => Boolean(opts?.json || models.opts().json);
	setCommandJsonMode(models, "output", ({ argv, command }) => isModelsStatusJsonOutput(argv, command));
	models.command("list").description("List models (configured by default)").option("--all", "Show full model catalog", false).option("--local", "Filter to local models", false).option("--provider <id>", "Filter by provider id").option("--agent <id>", "Agent id to inspect (overrides OPENCLAW_AGENT_DIR)").option("--json", "Output JSON", false).option("--plain", "Plain line output", false).action(async (opts, command) => {
		await withModelsRuntime(async ({ defaultRuntime, resolveModelAgentOption }) => {
			const { modelsListCommand } = await import("./list.list-command-_6GadwQf.js");
			await modelsListCommand({
				...opts,
				json: hasJsonOutput(opts),
				agent: resolveModelAgentOption(command, opts)
			}, defaultRuntime);
		});
	});
	models.command("status").description("Show configured model state").option("--json", "Output JSON", false).option("--plain", "Plain output", false).option("--check", "Exit non-zero if auth is expiring/expired (1=expired/missing, 2=expiring)", false).option("--probe", "Probe configured provider auth (live)", false).option("--probe-provider <name>", "Only probe a single provider").option("--probe-profile <id>", "Only probe specific auth profile ids (repeat or comma-separated)", (value, previous) => {
		const next = Array.isArray(previous) ? previous : previous ? [previous] : [];
		next.push(value);
		return next;
	}).option("--probe-timeout <ms>", "Per-probe timeout in ms").option("--probe-concurrency <n>", "Concurrent probes").option("--probe-max-tokens <n>", "Probe max tokens (best-effort)").option("--agent <id>", "Agent id to inspect (overrides OPENCLAW_AGENT_DIR)").action(async (opts, command) => {
		await withModelsRuntime(async ({ defaultRuntime, resolveModelAgentOption }) => {
			const agent = resolveModelAgentOption(command, opts);
			const { modelsStatusCommand } = await loadModelsStatusCommands();
			await modelsStatusCommand({
				json: hasJsonOutput(opts),
				plain: Boolean(opts.plain),
				check: Boolean(opts.check),
				probe: Boolean(opts.probe),
				probeProvider: opts.probeProvider,
				probeProfile: opts.probeProfile,
				probeTimeout: opts.probeTimeout,
				probeConcurrency: opts.probeConcurrency,
				probeMaxTokens: opts.probeMaxTokens,
				agent
			}, defaultRuntime);
		});
	});
	models.command("refresh").description("Refresh the hosted model catalog").option("--json", "Output JSON", false).action(async (opts, command) => {
		const runtime = await loadModelsRuntime();
		runtime.rejectAgentScopedModelCommand(command, "refresh");
		await runtime.runModelsCommand(async () => {
			const { modelsRefreshCommand } = await import("./refresh-DIogz06x.js");
			await modelsRefreshCommand({ json: hasJsonOutput(opts) }, runtime.defaultRuntime);
		});
	});
	models.command("set").description("Set the default model").argument("<model>", "Model id or alias").action(async (model, _opts, command) => {
		const runtime = await loadModelsRuntime();
		runtime.rejectAgentScopedModelCommand(command, "set");
		await runtime.runModelsCommand(async () => {
			const { modelsSetCommand } = await import("./set-PpCjOwFd.js");
			await modelsSetCommand(model, runtime.defaultRuntime);
		});
	});
	models.command("set-image").description("Set the image model").argument("<model>", "Model id or alias").action(async (model, _opts, command) => {
		const runtime = await loadModelsRuntime();
		runtime.rejectAgentScopedModelCommand(command, "set-image");
		await runtime.runModelsCommand(async () => {
			const { modelsSetImageCommand } = await import("./set-image-BGgFfioX.js");
			await modelsSetImageCommand(model, runtime.defaultRuntime);
		});
	});
	const aliases = models.command("aliases").description("Manage model aliases");
	aliases.command("list").description("List model aliases").option("--json", "Output JSON", false).option("--plain", "Plain output", false).action(async (opts, command) => {
		const runtime = await loadModelsRuntime();
		runtime.rejectAgentScopedModelCommand(command, "aliases list");
		await runtime.runModelsCommand(async () => {
			const { modelsAliasesListCommand } = await loadModelsAliasesCommands();
			await modelsAliasesListCommand({
				...opts,
				json: hasJsonOutput(opts)
			}, runtime.defaultRuntime);
		});
	});
	aliases.command("add").description("Add or update a model alias").argument("<alias>", "Alias name").argument("<model>", "Model id or alias").action(async (alias, model, _opts, command) => {
		const runtime = await loadModelsRuntime();
		runtime.rejectAgentScopedModelCommand(command, "aliases add");
		await runtime.runModelsCommand(async () => {
			const { modelsAliasesAddCommand } = await loadModelsAliasesCommands();
			await modelsAliasesAddCommand(alias, model, runtime.defaultRuntime);
		});
	});
	aliases.command("remove").description("Remove a model alias").argument("<alias>", "Alias name").action(async (alias, _opts, command) => {
		const runtime = await loadModelsRuntime();
		runtime.rejectAgentScopedModelCommand(command, "aliases remove");
		await runtime.runModelsCommand(async () => {
			const { modelsAliasesRemoveCommand } = await loadModelsAliasesCommands();
			await modelsAliasesRemoveCommand(alias, runtime.defaultRuntime);
		});
	});
	for (const params of [{
		name: "fallbacks",
		modelType: "model",
		noun: "fallback",
		article: "a",
		key: "model",
		label: "Fallbacks",
		notFoundLabel: "Fallback",
		clearedMessage: "Fallback list cleared."
	}, {
		name: "image-fallbacks",
		modelType: "image model",
		noun: "image fallback",
		article: "an",
		key: "imageModel",
		label: "Image fallbacks",
		notFoundLabel: "Image fallback",
		clearedMessage: "Image fallback list cleared."
	}]) {
		const { name, modelType, noun, article } = params;
		const group = models.command(name).description(`Manage ${modelType} fallback list`);
		group.command("list").description(`List ${noun} models`).option("--json", "Output JSON", false).option("--plain", "Plain output", false).action(async (opts) => {
			await withModelsRuntime(async ({ defaultRuntime }) => {
				const { listFallbacksCommand } = await loadModelsFallbacksCommands();
				await listFallbacksCommand(params, {
					...opts,
					json: hasJsonOutput(opts)
				}, defaultRuntime);
			});
		});
		for (const [action, handler] of [["add", "addFallbackCommand"], ["remove", "removeFallbackCommand"]]) group.command(action).description(`${action === "add" ? "Add" : "Remove"} ${article} ${noun} model`).argument("<model>", "Model id or alias").action(async (model) => {
			await withModelsRuntime(async ({ defaultRuntime }) => {
				await (await loadModelsFallbacksCommands())[handler](params, model, defaultRuntime);
			});
		});
		group.command("clear").description(`Clear all ${noun} models`).action(async () => {
			await withModelsRuntime(async ({ defaultRuntime }) => {
				const { clearFallbacksCommand } = await loadModelsFallbacksCommands();
				await clearFallbacksCommand(params, defaultRuntime);
			});
		});
	}
	models.command("scan").description("Scan OpenRouter free models for tools + images").option("--min-params <b>", "Minimum parameter size (billions)").option("--max-age-days <days>", "Skip models older than N days").option("--provider <name>", "Filter by provider prefix").option("--max-candidates <n>", "Max fallback candidates", "6").option("--timeout <ms>", "Per-probe timeout in ms").option("--concurrency <n>", "Probe concurrency").option("--no-probe", "Skip live probes; list free candidates only").option("--yes", "Accept defaults without prompting", false).option("--no-input", "Disable prompts (use defaults)").option("--set-default", "Set agents.defaults.model to the first selection", false).option("--set-image", "Set agents.defaults.imageModel to the first image selection", false).option("--json", "Output JSON", false).action(async (opts, command) => {
		const runtime = await loadModelsRuntime();
		runtime.rejectAgentScopedModelCommand(command, "scan");
		await runtime.runModelsCommand(async () => {
			const { modelsScanCommand } = await import("./scan-C3yfDYYi.js");
			await modelsScanCommand({
				...opts,
				json: hasJsonOutput(opts)
			}, runtime.defaultRuntime);
		});
	});
	models.action(async (opts) => {
		await withModelsRuntime(async ({ defaultRuntime }) => {
			const { modelsStatusCommand } = await loadModelsStatusCommands();
			await modelsStatusCommand({
				json: Boolean(opts?.json || opts?.statusJson),
				plain: Boolean(opts?.statusPlain),
				agent: opts?.agent
			}, defaultRuntime);
		});
	});
	const auth = models.command("auth").description("Manage model auth profiles");
	auth.option("--agent <id>", "Agent id for auth commands");
	auth.action(() => {
		auth.help();
	});
	auth.command("list").description("List saved auth profiles").option("--provider <id>", "Filter by provider id").option("--agent <id>", "Agent id (default: configured system agent)").option("--json", "Output JSON", false).action(async (opts, command) => {
		await withModelsRuntime(async ({ defaultRuntime, resolveModelAgentOption }) => {
			const agent = resolveModelAgentOption(command, opts);
			const { modelsAuthListCommand } = await import("./auth-list-DgMfLWQz.js");
			await modelsAuthListCommand({
				provider: opts.provider,
				agent,
				json: hasJsonOutput(opts)
			}, defaultRuntime);
		});
	});
	auth.command("add").description("Interactive auth helper (provider auth or paste token)").option("--agent <id>", "Agent id (default: configured default agent)").action(async (opts, command) => {
		await withModelsRuntime(async ({ defaultRuntime, resolveModelAgentOption }) => {
			const agent = resolveModelAgentOption(command, opts);
			const { modelsAuthAddCommand } = await loadModelsAuthCommands();
			await modelsAuthAddCommand({ agent }, defaultRuntime);
		});
	});
	auth.command("logout").description("Remove a saved auth profile (see `models auth list` for ids)").argument("<profileId>", "Auth profile id (e.g. openai:manual)").option("--agent <id>", "Agent id (default: configured default agent)").option("--yes", "Skip the confirmation prompt", false).action(async (profileId, opts, command) => {
		await withModelsRuntime(async ({ defaultRuntime, resolveModelAgentOption }) => {
			const agent = resolveModelAgentOption(command, opts);
			const { modelsAuthLogoutCommand } = await import("./auth-logout-Ca8qK2Vx.js");
			await modelsAuthLogoutCommand({
				profileId,
				agent,
				yes: Boolean(opts.yes)
			}, defaultRuntime);
		});
	});
	auth.command("login").description("Run a provider plugin auth flow (OAuth/API key)").option("--agent <id>", "Agent id (default: configured default agent)").option("--provider <id>", "Provider id registered by a plugin").option("--method <id>", "Provider auth method id").option("--device-code", "Use the provider device-code auth method", false).option("--profile-id <id>", "Auth profile id override for single-profile login methods").option("--set-default", "Apply the provider's default model recommendation", false).option("--force", "Remove existing profiles for the provider before logging in (use when a cached OAuth profile is stuck or you want to switch accounts)", false).action(async (opts, command) => {
		if (opts.deviceCode && typeof opts.method === "string" && opts.method !== "device-code") throw new Error("--device-code cannot be combined with --method unless method is device-code.");
		await withModelsRuntime(async ({ defaultRuntime, resolveModelAgentOption }) => {
			const agent = resolveModelAgentOption(command);
			const { modelsAuthLoginCommand } = await loadModelsAuthCommands();
			await modelsAuthLoginCommand({
				provider: opts.provider,
				method: opts.deviceCode ? "device-code" : opts.method,
				profileId: opts.profileId,
				setDefault: Boolean(opts.setDefault),
				force: Boolean(opts.force),
				agent
			}, defaultRuntime);
		});
	});
	auth.command("setup-token").description("Run a provider CLI to create/sync a token (TTY required)").option("--agent <id>", "Agent id (default: configured default agent)").option("--provider <name>", "Provider id").option("--yes", "Skip confirmation", false).action(async (opts, command) => {
		await withModelsRuntime(async ({ defaultRuntime, resolveModelAgentOption }) => {
			const agent = resolveModelAgentOption(command);
			const { modelsAuthSetupTokenCommand } = await loadModelsAuthCommands();
			await modelsAuthSetupTokenCommand({
				provider: opts.provider,
				yes: Boolean(opts.yes),
				agent
			}, defaultRuntime);
		});
	});
	auth.command("paste-token").description("Paste a token into auth-profiles.json and update config").option("--agent <id>", "Agent id (default: configured default agent)").requiredOption("--provider <name>", "Provider id (e.g. anthropic)").option("--profile-id <id>", "Auth profile id (default: <provider>:manual)").option("--expires-in <duration>", "Optional expiry duration (e.g. 365d, 12h). Stored as absolute expiresAt.").action(async (opts, command) => {
		await withModelsRuntime(async ({ defaultRuntime, resolveModelAgentOption }) => {
			const agent = resolveModelAgentOption(command);
			const { modelsAuthPasteTokenCommand } = await loadModelsAuthCommands();
			await modelsAuthPasteTokenCommand({
				provider: opts.provider,
				profileId: opts.profileId,
				expiresIn: opts.expiresIn,
				agent
			}, defaultRuntime);
		});
	});
	auth.command("paste-api-key").description("Paste an API key into auth-profiles.json and update config").option("--agent <id>", "Agent id (default: configured default agent)").requiredOption("--provider <name>", "Provider id (e.g. openai)").option("--profile-id <id>", "Auth profile id (default: <provider>:manual)").action(async (opts, command) => {
		await withModelsRuntime(async ({ defaultRuntime, resolveModelAgentOption }) => {
			const agent = resolveModelAgentOption(command);
			const { modelsAuthPasteApiKeyCommand } = await loadModelsAuthCommands();
			await modelsAuthPasteApiKeyCommand({
				provider: opts.provider,
				profileId: opts.profileId,
				agent
			}, defaultRuntime);
		});
	});
	auth.command("login-github-copilot").description("Login to GitHub Copilot via GitHub device flow (TTY required)").option("--agent <id>", "Agent id (default: configured default agent)").option("--yes", "Overwrite existing profile without prompting", false).action(async (opts, command) => {
		await withModelsRuntime(async ({ defaultRuntime, resolveModelAgentOption }) => {
			const agent = resolveModelAgentOption(command);
			const { modelsAuthLoginCommand } = await loadModelsAuthCommands();
			await modelsAuthLoginCommand({
				provider: "github-copilot",
				method: "device",
				yes: Boolean(opts.yes),
				agent
			}, defaultRuntime);
		});
	});
	const order = auth.command("order").description("Manage per-agent auth profile order overrides");
	order.command("get").description("Show per-agent auth profile order override").requiredOption("--provider <name>", "Provider id (e.g. anthropic)").option("--agent <id>", "Agent id (default: configured system agent)").option("--json", "Output JSON", false).action(async (opts, command) => {
		await withModelsRuntime(async ({ defaultRuntime, resolveModelAgentOption }) => {
			const agent = resolveModelAgentOption(command, opts);
			const { modelsAuthOrderGetCommand } = await loadModelsAuthOrderCommands();
			await modelsAuthOrderGetCommand({
				provider: opts.provider,
				agent,
				json: hasJsonOutput(opts)
			}, defaultRuntime);
		});
	});
	order.command("set").description("Set per-agent auth profile order override").requiredOption("--provider <name>", "Provider id (e.g. anthropic)").option("--agent <id>", "Agent id (default: configured default agent)").argument("<profileIds...>", "Auth profile ids (e.g. anthropic:default)").action(async (profileIds, opts, command) => {
		await withModelsRuntime(async ({ defaultRuntime, resolveModelAgentOption }) => {
			const agent = resolveModelAgentOption(command, opts);
			const { modelsAuthOrderSetCommand } = await loadModelsAuthOrderCommands();
			await modelsAuthOrderSetCommand({
				provider: opts.provider,
				agent,
				order: profileIds
			}, defaultRuntime);
		});
	});
	order.command("clear").description("Clear per-agent auth profile order override").requiredOption("--provider <name>", "Provider id (e.g. anthropic)").option("--agent <id>", "Agent id (default: configured default agent)").action(async (opts, command) => {
		await withModelsRuntime(async ({ defaultRuntime, resolveModelAgentOption }) => {
			const agent = resolveModelAgentOption(command, opts);
			const { modelsAuthOrderClearCommand } = await loadModelsAuthOrderCommands();
			await modelsAuthOrderClearCommand({
				provider: opts.provider,
				agent
			}, defaultRuntime);
		});
	});
}
//#endregion
export { registerModelsCli };
