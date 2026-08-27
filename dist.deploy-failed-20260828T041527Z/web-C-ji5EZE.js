import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { r as defaultRuntime } from "./runtime-LRpY2Icg.js";
import "./agent-scope-DigoIwHb.js";
import { l as resolveAgentDir } from "./agent-scope-config-CUBiGmG3.js";
import { n as getRuntimeConfig } from "./io-ClLVsBMp.js";
import "./config-B_0xOnKq.js";
import { i as getCapabilityWebFetchCommandSecretTargets, o as getCapabilityWebSearchCommandSecretTargets } from "./command-secret-targets-B3UG58Gq.js";
import { i as listWebSearchProviders, n as isWebSearchProviderConfigured, o as runWebSearch } from "./runtime-BuYDkFEi.js";
import { i as resolveWebFetchDefinition, n as isWebFetchProviderConfigured, r as listWebFetchProviders } from "./runtime-DLYDvVNr.js";
import { n as runCommandWithRuntime } from "./cli-utils-DKdcuZ9M.js";
import { d as resolveCapabilityProviderAgentId, f as resolveLocalCapabilityRuntimeConfig, i as parseOptionalPositiveInteger, n as formatEnvelopeForText, t as emitJsonOrText } from "./shared-Dq9Owf7C.js";
//#region src/cli/capability-cli/web.ts
function describeWebResultFailure(result) {
	const statusCode = typeof result.statusCode === "number" && Number.isFinite(result.statusCode) ? result.statusCode : void 0;
	const error = result.error;
	const errorMessage = typeof error === "string" ? error : error && typeof error === "object" && typeof error.message === "string" ? error.message : void 0;
	if (result.ok !== false && (statusCode === void 0 || statusCode < 400) && !errorMessage) return;
	return errorMessage ?? (statusCode ? `provider returned status ${statusCode}` : "provider reported failure");
}
async function runWebSearchCommand(params) {
	const rawConfig = getRuntimeConfig();
	const scopedTargets = getCapabilityWebSearchCommandSecretTargets(rawConfig, { providerId: params.provider });
	const result = await runWebSearch({
		config: await resolveLocalCapabilityRuntimeConfig({
			commandName: "infer web search",
			targetIds: scopedTargets.targetIds,
			...scopedTargets.allowedPaths ? { allowedPaths: scopedTargets.allowedPaths } : {},
			...scopedTargets.forcedActivePaths ? { forcedActivePaths: scopedTargets.forcedActivePaths } : {},
			...scopedTargets.optionalActivePaths ? { optionalActivePaths: scopedTargets.optionalActivePaths } : {},
			config: rawConfig
		}),
		providerId: params.provider,
		args: {
			query: params.query,
			count: params.limit,
			limit: params.limit
		}
	});
	const error = describeWebResultFailure(result.result);
	return {
		ok: error === void 0,
		capability: "web.search",
		transport: "local",
		provider: result.provider,
		attempts: [],
		outputs: [{ result: result.result }],
		...error ? { error } : {}
	};
}
async function runWebFetchCommand(params) {
	const rawConfig = getRuntimeConfig();
	const scopedTargets = getCapabilityWebFetchCommandSecretTargets(rawConfig, { providerId: params.provider });
	const resolved = resolveWebFetchDefinition({
		config: await resolveLocalCapabilityRuntimeConfig({
			commandName: "infer web fetch",
			targetIds: scopedTargets.targetIds,
			...scopedTargets.allowedPaths ? { allowedPaths: scopedTargets.allowedPaths } : {},
			...scopedTargets.forcedActivePaths ? { forcedActivePaths: scopedTargets.forcedActivePaths } : {},
			...scopedTargets.optionalActivePaths ? { optionalActivePaths: scopedTargets.optionalActivePaths } : {},
			config: rawConfig
		}),
		providerId: params.provider
	});
	if (!resolved) throw new Error("web.fetch is disabled or no provider is available.");
	const result = await resolved.definition.execute({
		url: params.url,
		format: params.format
	});
	const error = describeWebResultFailure(result);
	return {
		ok: error === void 0,
		capability: "web.fetch",
		transport: "local",
		provider: resolved.provider.id,
		attempts: [],
		outputs: [{ result }],
		...error ? { error } : {}
	};
}
function registerWebCapabilityCommands(capability) {
	const web = capability.command("web").description("Web capabilities");
	web.command("search").description("Run web search").requiredOption("--query <text>", "Search query").option("--provider <id>", "Provider id").option("--limit <n>", "Result limit").option("--json", "Output JSON", false).action(async (opts) => {
		let failed = false;
		await runCommandWithRuntime(defaultRuntime, async () => {
			const result = await runWebSearchCommand({
				query: String(opts.query),
				provider: opts.provider,
				limit: parseOptionalPositiveInteger(opts.limit, "--limit")
			});
			failed = !result.ok;
			emitJsonOrText(defaultRuntime, Boolean(opts.json), result, formatEnvelopeForText);
		});
		if (failed) defaultRuntime.exit(1);
	});
	web.command("fetch").description("Fetch one URL").requiredOption("--url <url>", "URL").option("--provider <id>", "Provider id").option("--format <format>", "Format hint").option("--json", "Output JSON", false).action(async (opts) => {
		let failed = false;
		await runCommandWithRuntime(defaultRuntime, async () => {
			const result = await runWebFetchCommand({
				url: String(opts.url),
				provider: opts.provider,
				format: opts.format
			});
			failed = !result.ok;
			emitJsonOrText(defaultRuntime, Boolean(opts.json), result, formatEnvelopeForText);
		});
		if (failed) defaultRuntime.exit(1);
	});
	web.command("providers").description("List web providers").option("--agent <id>", "Agent whose provider state should be inspected").option("--json", "Output JSON", false).action(async (opts) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const cfg = getRuntimeConfig();
			const agentDir = resolveAgentDir(cfg, resolveCapabilityProviderAgentId(cfg, opts.agent));
			const selectedSearchProvider = typeof cfg.tools?.web?.search?.provider === "string" ? normalizeLowercaseStringOrEmpty(cfg.tools.web.search.provider) : "";
			const selectedFetchProvider = typeof cfg.tools?.web?.fetch?.provider === "string" ? normalizeLowercaseStringOrEmpty(cfg.tools.web.fetch.provider) : "";
			const result = {
				search: listWebSearchProviders({ config: cfg }).map((provider) => ({
					available: true,
					configured: isWebSearchProviderConfigured({
						provider,
						config: cfg,
						agentDir
					}),
					selected: provider.id === selectedSearchProvider,
					id: provider.id,
					envVars: provider.envVars
				})),
				fetch: listWebFetchProviders({ config: cfg }).map((provider) => ({
					available: true,
					configured: isWebFetchProviderConfigured({
						provider,
						config: cfg
					}),
					selected: provider.id === selectedFetchProvider,
					id: provider.id,
					envVars: provider.envVars
				}))
			};
			emitJsonOrText(defaultRuntime, Boolean(opts.json), result, (value) => JSON.stringify(value, null, 2));
		});
	});
}
//#endregion
export { registerWebCapabilityCommands };
