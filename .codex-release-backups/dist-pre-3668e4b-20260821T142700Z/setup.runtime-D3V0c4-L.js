import { i as toErrorObject } from "./error-coercion-DisD0JTb.js";
import { r as formatErrorMessage } from "./errors-CqPTYU6G.js";
import { r as fetchWithSsrFGuard } from "./fetch-guard-IFayOKvf.js";
import { p as readProviderJsonResponse } from "./provider-http-errors-DwYSuIHs.js";
import { c as isNonSecretApiKeyMarker } from "./model-auth-markers-DzAepWRR.js";
import { t as normalizeOptionalSecretInput } from "./normalize-secret-input-Df_qhWv_.js";
import "./provider-auth-DqOUi0El.js";
import { i as normalizeApiKeyInput, n as ensureApiKeyFromOptionEnvOrPrompt, s as validateApiKeyInput } from "./provider-auth-input-CjTtR15n.js";
import "./error-runtime-oXQewkZq.js";
import { t as expectDefined } from "./expect-runtime--WgnKYXT.js";
import "./ssrf-runtime-D3OHU1vE.js";
import "./provider-http-D7FntVgP.js";
import { n as applyAgentDefaultModelPrimary } from "./provider-onboard-DSzC4JPQ.js";
import { t as WizardCancelledError } from "./prompts-B0iOB1_a.js";
import "./setup-BVnDItNa.js";
import { a as OLLAMA_DEFAULT_API_KEY, n as OLLAMA_CLOUD_BASE_URL, p as resolveOllamaSetupDefaultBaseUrl, r as OLLAMA_CLOUD_DEFAULT_MODELS, u as OLLAMA_DEFAULT_MODEL } from "./defaults-BNbpVpwQ.js";
import { t as readProviderBaseUrl } from "./provider-base-url-E6aWTKii.js";
import { c as enrichOllamaModelsWithContext, d as isOllamaCloudModel, g as resolveOllamaApiBase, i as buildOllamaProvider, n as buildOllamaBaseUrlSsrFPolicy, u as fetchOllamaModels } from "./provider-models-Bl5Rr7jW.js";
import "./discovery-shared-BqMOJDbT.js";
import { a as inspectOllamaModelsForSetup, i as findAvailableOllamaModelName, l as selectAppGuidedOllamaModelFromDiscovery, n as buildOllamaModelsConfig, o as mergeUniqueModelNames, r as discoverOllamaModelsForSetup, s as normalizeOllamaModelName } from "./setup-model-selection-DfGdHQIg.js";
import { t as checkNdjsonRecordCap } from "./stream-ndjson-cap-D0o3ZPYU.js";
//#region extensions/ollama/src/setup-pull.ts
const OLLAMA_PULL_RESPONSE_TIMEOUT_MS = 3e4;
const OLLAMA_PULL_STREAM_IDLE_TIMEOUT_MS = 3e5;
function formatOllamaPullStatus(status) {
	const trimmed = status.trim();
	const partStatusMatch = trimmed.match(/^([a-z-]+)\s+(?:sha256:)?[a-f0-9]{8,}$/i);
	if (partStatusMatch) return {
		text: `${partStatusMatch[1]} part`,
		hidePercent: false
	};
	const hidePercent = /^verifying\b.*\bdigest\b/i.test(trimmed);
	return {
		text: hidePercent ? "verifying digest" : trimmed,
		hidePercent
	};
}
async function readOllamaPullChunkWithIdleTimeout(reader) {
	return await new Promise((resolve, reject) => {
		const timeoutId = setTimeout(() => {
			reader.cancel().catch(() => void 0);
			reject(/* @__PURE__ */ new Error(`Ollama pull stalled: no data received for ${Math.round(OLLAMA_PULL_STREAM_IDLE_TIMEOUT_MS / 1e3)}s`));
		}, OLLAMA_PULL_STREAM_IDLE_TIMEOUT_MS);
		reader.read().then(resolve, (error) => reject(toErrorObject(error, "Non-Error rejection"))).finally(() => clearTimeout(timeoutId));
	});
}
async function pullOllamaModelCore(params) {
	const baseUrl = resolveOllamaApiBase(params.baseUrl);
	const modelName = normalizeOllamaModelName(params.modelName) ?? params.modelName.trim();
	const responseController = new AbortController();
	const responseTimeout = setTimeout(responseController.abort.bind(responseController), OLLAMA_PULL_RESPONSE_TIMEOUT_MS);
	try {
		params.signal?.throwIfAborted();
		const { response, release } = await fetchWithSsrFGuard({
			url: `${baseUrl}/api/pull`,
			init: {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ model: modelName })
			},
			signal: params.signal ? AbortSignal.any([responseController.signal, params.signal]) : responseController.signal,
			policy: buildOllamaBaseUrlSsrFPolicy(baseUrl),
			auditContext: "ollama-setup.pull"
		});
		clearTimeout(responseTimeout);
		try {
			if (!response.ok) {
				response.body?.cancel().catch(() => void 0);
				return {
					ok: false,
					message: `Failed to download ${modelName} (HTTP ${response.status})`
				};
			}
			if (!response.body) return {
				ok: false,
				message: `Failed to download ${modelName} (no response body)`
			};
			const reader = response.body.getReader();
			const decoder = new TextDecoder();
			let buffer = "";
			let pendingRecordBytes = 0;
			const layers = /* @__PURE__ */ new Map();
			const parseLine = (line) => {
				if (!line.trim()) return;
				try {
					const chunk = JSON.parse(line);
					if (chunk.error) return {
						ok: false,
						message: `Download failed: ${chunk.error}`
					};
					if (!chunk.status || chunk.status === "success") return chunk.status ? { ok: true } : void 0;
					if (chunk.total && chunk.completed !== void 0) {
						layers.set(chunk.status, {
							total: chunk.total,
							completed: chunk.completed
						});
						const totals = {
							total: 0,
							completed: 0
						};
						for (const layer of layers.values()) {
							totals.total += layer.total;
							totals.completed += layer.completed;
						}
						params.onStatus?.(chunk.status, totals.total > 0 ? Math.round(totals.completed / totals.total * 100) : null);
					} else params.onStatus?.(chunk.status, null);
				} catch {}
			};
			try {
				for (;;) {
					const { done, value } = await readOllamaPullChunkWithIdleTimeout(reader);
					if (done) {
						const terminal = parseLine(buffer);
						if (terminal) return terminal;
						throw new Error("pull stream ended before success");
					}
					pendingRecordBytes = checkNdjsonRecordCap(value, pendingRecordBytes);
					buffer += decoder.decode(value, { stream: true });
					const lines = buffer.split("\n");
					buffer = lines.pop() ?? "";
					for (const line of lines) {
						const parsed = parseLine(line);
						if (parsed) return parsed;
					}
				}
			} finally {
				reader.cancel().catch(() => void 0);
				reader.releaseLock();
			}
		} finally {
			await release();
		}
	} catch (err) {
		return {
			ok: false,
			message: `Failed to download ${modelName}: ${formatErrorMessage(err)}`
		};
	} finally {
		clearTimeout(responseTimeout);
	}
}
async function pullOllamaModel(baseUrl, modelName, prompter, signal) {
	const spinner = prompter.progress(`Downloading ${modelName}...`);
	const result = await pullOllamaModelCore({
		baseUrl,
		modelName,
		...signal ? { signal } : {},
		onStatus: (status, percent) => {
			const displayStatus = formatOllamaPullStatus(status);
			const progress = displayStatus.hidePercent ? "" : ` - ${percent ?? 0}%`;
			spinner.update(`Downloading ${modelName} - ${displayStatus.text}${progress}`);
		}
	});
	spinner.stop(result.ok ? `Downloaded ${modelName}` : result.message);
	return result.ok;
}
async function pullOllamaModelNonInteractive(baseUrl, modelName, runtime) {
	runtime.log(`Downloading ${modelName}...`);
	const result = await pullOllamaModelCore({
		baseUrl,
		modelName
	});
	if (result.ok) runtime.log(`Downloaded ${modelName}`);
	else runtime.error(result.message);
	return result.ok;
}
//#endregion
//#region extensions/ollama/src/setup.runtime.ts
const OLLAMA_SUGGESTED_MODELS_LOCAL = [OLLAMA_DEFAULT_MODEL];
const OLLAMA_SUGGESTED_MODELS_CLOUD = OLLAMA_CLOUD_DEFAULT_MODELS.map((model) => model.id);
const OLLAMA_SUGGESTED_MODELS_LOCAL_CLOUD = OLLAMA_CLOUD_DEFAULT_MODELS.map((model) => `${model.id}:cloud`);
const OLLAMA_CLOUD_MAX_DISCOVERED_MODELS = 500;
const OLLAMA_RECOMMENDED_TOOLS_MODEL = "gemma4:e4b";
const OLLAMA_RECOMMENDED_TOOLS_MODEL_SIZE = "about 9.6 GB";
const HOST_BACKED_OLLAMA_MODE_CONFIG = {
	"cloud-local": {
		includeCloudModels: true,
		noteTitle: "Ollama Cloud + Local"
	},
	"local-only": {
		includeCloudModels: false,
		noteTitle: "Ollama"
	}
};
function buildOllamaUnreachableLines(baseUrl, retry) {
	return [
		`Ollama could not be reached at ${baseUrl}.`,
		"Start or restart the Ollama server for this address.",
		"If Ollama is not installed on that machine, download it at https://ollama.com/download",
		...retry ? ["", "Continue when it is running. OpenClaw will retry this address."] : []
	];
}
function buildOllamaCloudSigninLines(signinUrl) {
	return [
		"Cloud models on this Ollama host need `ollama signin`.",
		signinUrl ?? "Run `ollama signin` on the configured Ollama host.",
		"",
		"Continuing with local models only for now."
	];
}
async function checkOllamaCloudAuth(baseUrl) {
	try {
		const apiBase = resolveOllamaApiBase(baseUrl);
		const { response, release } = await fetchWithSsrFGuard({
			url: `${apiBase}/api/me`,
			init: { method: "POST" },
			timeoutMs: 5e3,
			policy: buildOllamaBaseUrlSsrFPolicy(apiBase),
			auditContext: "ollama-setup.me"
		});
		try {
			if (response.status === 401) return {
				signedIn: false,
				signinUrl: (await readProviderJsonResponse(response, "ollama.cloud-auth")).signin_url
			};
			if (!response.ok) return { signedIn: false };
			return { signedIn: true };
		} finally {
			response.body?.cancel().catch(() => void 0);
			await release();
		}
	} catch {
		return { signedIn: false };
	}
}
async function promptForOllamaCloudCredential(params) {
	const captured = {};
	const optionToken = normalizeOptionalSecretInput(params.opts?.ollamaApiKey);
	const discoveryApiKey = await ensureApiKeyFromOptionEnvOrPrompt({
		token: optionToken ?? normalizeOptionalSecretInput(params.opts?.token),
		tokenProvider: optionToken ? "ollama" : normalizeOptionalSecretInput(params.opts?.tokenProvider),
		secretInputMode: params.allowSecretRefPrompt === false ? params.secretInputMode ?? "plaintext" : params.secretInputMode,
		config: params.cfg,
		env: params.env,
		expectedProviders: ["ollama"],
		provider: "ollama",
		envLabel: "OLLAMA_API_KEY",
		promptMessage: "Ollama API key",
		normalize: normalizeApiKeyInput,
		validate: validateApiKeyInput,
		prompter: params.prompter,
		setCredential: async (apiKey, mode) => {
			captured.credential = apiKey;
			captured.credentialMode = mode;
		}
	});
	if (!captured.credential) throw new Error("Missing Ollama API key input.");
	if (typeof captured.credential === "string" && isNonSecretApiKeyMarker(captured.credential, { includeEnvVarName: false })) throw new Error("Cloud-only Ollama setup requires a real OLLAMA_API_KEY.");
	return {
		credential: captured.credential,
		credentialMode: captured.credentialMode,
		discoveryApiKey
	};
}
function applyOllamaProviderConfig(cfg, baseUrl, modelNames, discoveredModelsByName, apiKey = OLLAMA_DEFAULT_API_KEY, defaultModels = []) {
	return {
		...cfg,
		models: {
			...cfg.models,
			mode: cfg.models?.mode ?? "merge",
			providers: {
				...cfg.models?.providers,
				ollama: {
					baseUrl,
					api: "ollama",
					apiKey,
					models: buildOllamaModelsConfig(modelNames, discoveredModelsByName, defaultModels)
				}
			}
		}
	};
}
async function promptForOllamaBaseUrl(prompter, env = process.env) {
	const defaultBaseUrl = resolveOllamaSetupDefaultBaseUrl(env);
	return resolveOllamaApiBase((await prompter.text({
		message: "Ollama base URL",
		initialValue: defaultBaseUrl,
		placeholder: defaultBaseUrl,
		validate: (value) => value?.trim() ? void 0 : "Required"
	}) ?? defaultBaseUrl).trim().replace(/\/+$/, ""));
}
async function resolveHostBackedSuggestedModelNames(params) {
	const modeConfig = HOST_BACKED_OLLAMA_MODE_CONFIG[params.mode];
	if (!modeConfig.includeCloudModels) return OLLAMA_SUGGESTED_MODELS_LOCAL;
	const auth = await checkOllamaCloudAuth(params.baseUrl);
	if (auth.signedIn) return mergeUniqueModelNames(OLLAMA_SUGGESTED_MODELS_LOCAL, OLLAMA_SUGGESTED_MODELS_LOCAL_CLOUD);
	await params.prompter.note(buildOllamaCloudSigninLines(auth.signinUrl).join("\n"), modeConfig.noteTitle);
	return OLLAMA_SUGGESTED_MODELS_LOCAL;
}
async function promptAndConfigureHostBackedOllama(params) {
	const baseUrl = await promptForOllamaBaseUrl(params.prompter, params.env);
	let discovery = await discoverOllamaModelsForSetup({
		baseUrl,
		inspectTools: true,
		...params.signal ? { signal: params.signal } : {}
	});
	if (!discovery.reachable) {
		await params.prompter.note(buildOllamaUnreachableLines(baseUrl, true).join("\n"), "Ollama");
		if (!await params.prompter.confirm({
			message: "Retry this Ollama address now?",
			initialValue: true
		})) throw new WizardCancelledError("Ollama setup cancelled");
		params.signal?.throwIfAborted();
		discovery = await discoverOllamaModelsForSetup({
			baseUrl,
			inspectTools: true,
			...params.signal ? { signal: params.signal } : {}
		});
	}
	if (!discovery.reachable) throw new WizardCancelledError(`Ollama is still not reachable at ${baseUrl}`);
	const { models, inspectedModels, discoveredModelsByName, inspectionFailures, hasToolsCapableModel } = discovery;
	if (inspectionFailures.length > 0) await params.prompter.note([
		"Some installed models could not be inspected and were skipped:",
		...inspectionFailures.slice(0, 5).map((line) => `- ${line}`),
		...inspectionFailures.length > 5 ? [`…and ${inspectionFailures.length - 5} more`] : []
	].join("\n"), "Ollama");
	let discoveredModelNames = models.map((model) => model.name);
	const inspectionUsable = inspectedModels.length === 0 || inspectionFailures.length < inspectedModels.length;
	if (!hasToolsCapableModel && inspectionUsable) {
		if (await params.prompter.confirm({
			message: `No tools-capable Ollama model is installed. Pull ${OLLAMA_RECOMMENDED_TOOLS_MODEL} (${OLLAMA_RECOMMENDED_TOOLS_MODEL_SIZE})?`,
			initialValue: false
		})) {
			if (!await pullOllamaModel(baseUrl, OLLAMA_RECOMMENDED_TOOLS_MODEL, params.prompter, params.signal)) throw new WizardCancelledError("Failed to download recommended Ollama model");
			params.signal?.throwIfAborted();
			const recommendedScan = await inspectOllamaModelsForSetup(baseUrl, [{ name: OLLAMA_RECOMMENDED_TOOLS_MODEL }], params.signal);
			if (recommendedScan.inspectionFailures.length > 0) throw new WizardCancelledError(`Failed to verify pulled Ollama model: ${recommendedScan.inspectionFailures[0]}`);
			const [recommendedModel] = recommendedScan.inspected;
			if (recommendedModel) discoveredModelsByName.set(recommendedModel.name, recommendedModel);
			discoveredModelNames = mergeUniqueModelNames(discoveredModelNames, [OLLAMA_RECOMMENDED_TOOLS_MODEL]);
		}
	}
	const suggestedModelNames = await resolveHostBackedSuggestedModelNames({
		mode: params.mode,
		baseUrl,
		prompter: params.prompter
	});
	const cloudDefaultModelId = suggestedModelNames.find(isOllamaCloudModel);
	const defaultModelId = selectAppGuidedOllamaModelFromDiscovery(discoveredModelsByName.values()) ?? cloudDefaultModelId;
	return {
		...defaultModelId ? { defaultModel: `ollama/${defaultModelId}` } : {},
		config: applyOllamaProviderConfig(params.cfg, baseUrl, mergeUniqueModelNames(suggestedModelNames, discoveredModelNames), discoveredModelsByName)
	};
}
async function promptAndConfigureOllama(params) {
	const mode = await params.prompter.select({
		message: "Ollama mode",
		options: [
			{
				value: "cloud-local",
				label: "Cloud + Local",
				hint: "Route cloud and local models through your Ollama host"
			},
			{
				value: "cloud-only",
				label: "Cloud only",
				hint: "Hosted Ollama models via ollama.com"
			},
			{
				value: "local-only",
				label: "Local only",
				hint: "Local models only"
			}
		]
	});
	if (mode === "cloud-only") {
		const { credential, credentialMode, discoveryApiKey } = await promptForOllamaCloudCredential({
			cfg: params.cfg,
			env: params.env,
			opts: params.opts,
			prompter: params.prompter,
			secretInputMode: params.secretInputMode,
			allowSecretRefPrompt: params.allowSecretRefPrompt
		});
		const { models: rawDiscoveredModels } = await fetchOllamaModels(OLLAMA_CLOUD_BASE_URL, { apiKey: discoveryApiKey });
		const discoveredModelNames = rawDiscoveredModels.slice(0, OLLAMA_CLOUD_MAX_DISCOVERED_MODELS).map((model) => model.name);
		const modelNames = discoveredModelNames.length > 0 ? mergeUniqueModelNames(OLLAMA_SUGGESTED_MODELS_CLOUD, discoveredModelNames) : OLLAMA_SUGGESTED_MODELS_CLOUD;
		const defaultModelId = modelNames[0];
		return {
			credential,
			credentialMode,
			...defaultModelId ? { defaultModel: `ollama/${defaultModelId}` } : {},
			config: applyOllamaProviderConfig(params.cfg, OLLAMA_CLOUD_BASE_URL, modelNames, void 0, credential, OLLAMA_CLOUD_DEFAULT_MODELS)
		};
	}
	return await promptAndConfigureHostBackedOllama({
		cfg: params.cfg,
		mode,
		prompter: params.prompter,
		env: params.env,
		...params.signal ? { signal: params.signal } : {}
	});
}
async function configureOllamaNonInteractive(params) {
	const baseUrl = resolveOllamaApiBase((params.opts.customBaseUrl?.trim() || resolveOllamaSetupDefaultBaseUrl()).replace(/\/+$/, ""));
	const { reachable, models, discoveredModelsByName } = await discoverOllamaModelsForSetup({ baseUrl });
	const explicitModel = normalizeOllamaModelName(params.opts.customModelId);
	if (!reachable) {
		params.runtime.error(buildOllamaUnreachableLines(baseUrl, false).join("\n"));
		params.runtime.exit(1);
		return params.nextConfig;
	}
	const modelNames = models.map((model) => model.name);
	const orderedModelNames = mergeUniqueModelNames(OLLAMA_SUGGESTED_MODELS_LOCAL.filter((modelName) => findAvailableOllamaModelName(modelName, modelNames) !== void 0), modelNames);
	const requestedDefaultModelId = explicitModel ?? selectAppGuidedOllamaModelFromDiscovery(discoveredModelsByName.values()) ?? expectDefined(OLLAMA_SUGGESTED_MODELS_LOCAL[0], "default suggested Ollama model");
	const availableModelNames = new Set(modelNames);
	const availableDefaultModelId = findAvailableOllamaModelName(requestedDefaultModelId, availableModelNames);
	const requestedCloudModel = isOllamaCloudModel(requestedDefaultModelId);
	let pulledRequestedModel = false;
	if (requestedCloudModel) availableModelNames.add(requestedDefaultModelId);
	else if (!availableDefaultModelId) {
		pulledRequestedModel = await pullOllamaModelNonInteractive(baseUrl, requestedDefaultModelId, params.runtime);
		if (pulledRequestedModel) availableModelNames.add(requestedDefaultModelId);
	}
	let allModelNames = orderedModelNames;
	let defaultModelId = availableDefaultModelId ?? requestedDefaultModelId;
	if ((pulledRequestedModel || requestedCloudModel) && !allModelNames.includes(requestedDefaultModelId)) allModelNames = [...allModelNames, requestedDefaultModelId];
	if (!findAvailableOllamaModelName(defaultModelId, availableModelNames)) {
		if (availableModelNames.size === 0) {
			params.runtime.error([`No Ollama models are available at ${baseUrl}.`, "Pull a model first, then re-run setup."].join("\n"));
			params.runtime.exit(1);
			return params.nextConfig;
		}
		defaultModelId = allModelNames.find((name) => findAvailableOllamaModelName(name, availableModelNames)) ?? expectDefined(availableModelNames.values().next().value, "available Ollama setup model");
		params.runtime.log(`Ollama model ${requestedDefaultModelId} was not available; using ${defaultModelId} instead.`);
	}
	if (!requestedCloudModel && !discoveredModelsByName.has(defaultModelId)) {
		const selectedModel = expectDefined((await enrichOllamaModelsWithContext(baseUrl, [models.find((model) => model.name === defaultModelId) ?? { name: defaultModelId }]))[0], "selected Ollama setup model");
		discoveredModelsByName.set(defaultModelId, selectedModel);
	}
	const config = applyOllamaProviderConfig(params.nextConfig, baseUrl, allModelNames, discoveredModelsByName);
	params.runtime.log(`Default Ollama model: ${defaultModelId}`);
	return applyAgentDefaultModelPrimary(config, `ollama/${defaultModelId}`);
}
async function ensureOllamaModelPulled(params) {
	if (!params.model.startsWith("ollama/")) return;
	const baseUrl = readProviderBaseUrl(params.config.models?.providers?.ollama) ?? "http://127.0.0.1:11434";
	const modelName = params.model.slice(7);
	if (isOllamaCloudModel(modelName)) return;
	const { models } = await fetchOllamaModels(baseUrl);
	if (findAvailableOllamaModelName(modelName, models.map((model) => model.name))) return;
	if (!await pullOllamaModel(baseUrl, modelName, params.prompter)) throw new WizardCancelledError("Failed to download selected Ollama model");
}
//#endregion
export { buildOllamaProvider, checkOllamaCloudAuth, configureOllamaNonInteractive, ensureOllamaModelPulled, promptAndConfigureOllama, resolveOllamaSetupDefaultBaseUrl };
