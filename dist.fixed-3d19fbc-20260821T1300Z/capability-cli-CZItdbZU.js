import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty, p as normalizeStringifiedOptionalString } from "./string-coerce-CIXf7egm.js";
import { w as parseStrictPositiveInteger, x as parseStrictFiniteNumber } from "./number-coercion-oCkfUEEq.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { a as writeRuntimeJson, r as defaultRuntime } from "./runtime-DtFIMC-W.js";
import { i as resolveAgentModelPrimaryValue } from "./model-input-ekSMR50U.js";
import { o as resolveAgentEffectiveModelPrimary } from "./agent-scope-D9GLFAyB.js";
import { a as listAgentIds, g as resolveSystemAgentTargetAgentId, l as resolveAgentDir, p as resolveDefaultAgentId } from "./agent-scope-config-CsnnOL14.js";
import { r as getRuntimeConfig } from "./io-BTBpQ7uO.js";
import { d as readResponseWithLimit } from "./http-body-B0Ouh_va.js";
import { r as DEFAULT_PROVIDER } from "./defaults-CdX9UGcX.js";
import { c as loadManifestMetadataSnapshot } from "./manifest-contract-eligibility-l7ndhGM_.js";
import { s as normalizeThinkLevel } from "./thinking.shared-bHYuuc1L.js";
import { t as planEffectiveModelCatalogRows } from "./model-catalog-5PpQ61MN.js";
import { r as theme } from "./theme-vjDs9tao.js";
import { i as assertProviderBinaryResponseContent, n as assertOkOrThrowHttpError } from "./provider-http-errors-DwYSuIHs.js";
import { t as getProviderEnvVars } from "./provider-env-vars-BN1Fc4Xk.js";
import { T as setRuntimeConfigSnapshot, c as getRuntimeConfigSourceSnapshot } from "./runtime-snapshot-DIuCzlel.js";
import "./thinking-D9bT8eOf.js";
import { t as ADMIN_SCOPE } from "./operator-scopes-Dw7Gu2cA.js";
import "./config-CfeGo4K4.js";
import { t as formatDocsLink } from "./links-ClIwBcy4.js";
import { o as isLoopbackHost } from "./net-BRYQcUG8.js";
import { i as GATEWAY_CLIENT_NAMES, r as GATEWAY_CLIENT_MODES } from "./client-info-yubNQC1L.js";
import { _ as randomIdempotencyKey, s as callGateway } from "./call-CZ1eu88h.js";
import { t as buildGatewayConnectionDetailsWithResolvers } from "./connection-details-BsRSnf71.js";
import { n as listProfilesForProvider } from "./profile-list-C4c5_QKQ.js";
import { p as sanitizeConfiguredModelProviderRequest } from "./provider-request-config-BR35Bqmj.js";
import { d as normalizeMimeType, n as detectMime, r as extensionForMime } from "./mime-Hm4eS2i0.js";
import { b as updateAuthProfileStoreWithLock, d as loadAuthProfileStoreForRuntime } from "./store-DZy8rsrA.js";
import { c as getImageMetadata, i as convertHeicToJpeg } from "./image-ops-CuoBGLvn.js";
import "./media-services-BhxTAMtw.js";
import { d as saveMediaBuffer } from "./store-CvNsGg9Z.js";
import { i as loadPreparedModelCatalog } from "./prepared-model-catalog-DFpNDAcU.js";
import "./auth-profiles-TorfVJYv.js";
import { s as resolveApiKeyForProviderCore } from "./model-auth-BgXCiN_L.js";
import { n as canonicalizeCaseOnlyCatalogModelRef } from "./model-selection-BEGvRdL1.js";
import { n as normalizeSpeechProviderId } from "./provider-registry-core-DL1pv3pg.js";
import { o as listSpeechProviders, r as canonicalizeSpeechProviderId } from "./directives-C8r_PhR_.js";
import { _ as resolveTtsPrefsPath, h as resolveTtsConfig, l as listTtsPersonas, o as getTtsPersona } from "./tts-settings-DOeA7h1Y.js";
import { t as publishOutputFileAtomically } from "./output-file.runtime.js";
import { r as resolveGeneratedMediaMaxBytes } from "./configured-max-bytes-kmWDwnsJ.js";
import { t as resolveMemorySearchConfig } from "./memory-search-DIuge812.js";
import { n as listEmbeddingProviders } from "./embedding-provider-runtime-BVpM6Nvc.js";
import { r as listRegisteredMemoryEmbeddingProviderAdapters } from "./memory-embedding-provider-runtime-D8D_3Wmy.js";
import { n as listRuntimeImageGenerationProviders, t as generateImage } from "./runtime-DhsmcfZ_.js";
import { t as buildExplicitSessionIdSessionKey } from "./session-ChRzjWPw.js";
import { t as runWithImageModelFallback } from "./model-fallback-image-BPownRMl.js";
import { o as fetchWithTimeoutGuarded, p as resolveProviderHttpRequestConfig } from "./shared-DEePW_9S.js";
import { c as buildMediaUnderstandingRegistry } from "./defaults.constants-D89wfMnk.js";
import { h as getTtsCommandSecretTargetIds, i as getCapabilityWebFetchCommandSecretTargets, l as getMemoryEmbeddingCommandSecretTargetIds, o as getCapabilityWebSearchCommandSecretTargets, u as getModelsCommandSecretTargetIds } from "./command-secret-targets-JklITWYj.js";
import { _ as setTtsProvider, g as setTtsPersona, l as listSpeechVoices, m as setTtsEnabled, s as resolveExplicitTtsOverrides, t as getTtsProvider } from "./runtime-api-BGYhni6A.js";
import { n as textToSpeech } from "./tts-QE2khNZ2.js";
import { n as listRuntimeVideoGenerationProviders, t as generateVideo } from "./runtime-DYci4waw.js";
import { i as listWebSearchProviders, n as isWebSearchProviderConfigured, o as runWebSearch } from "./runtime-QGQYfFQ9.js";
import { r as prepareSimpleCompletionModelForAgent, t as completeWithPreparedSimpleCompletionModel } from "./simple-completion-runtime-DkOU1eq2.js";
import { r as inspectLocalAudioSelection } from "./local-audio-CIgfwKaY.js";
import { i as resolveWebFetchDefinition, n as isWebFetchProviderConfigured, r as listWebFetchProviders } from "./runtime-Bw5nBsfr.js";
import "./provider-http-D7FntVgP.js";
import { n as runCommandWithRuntime } from "./cli-utils-Dg8R0Gwl.js";
import { t as removeCommandByName } from "./command-tree-CA1ToIBK.js";
import { c as transcribeAudioFile, i as describeVideoFile, o as prepareImageDescriptionInput, r as describePreparedImageWithModel, t as describeImageFile } from "./runtime-7sAO676C.js";
import { t as resolveCommandConfigWithSecrets } from "./command-config-resolution-C4AGlO6v.js";
import { n as parseTimeoutMsWithFallback } from "./parse-timeout-CJ2ASpTh.js";
import { r as createEmbeddingProvider } from "./memory-core-bundled-runtime-ChFeExlk.js";
import { t as collectOption } from "./helpers-DMLW8VDh.js";
import { randomUUID } from "node:crypto";
import { createWriteStream } from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
import { Readable } from "node:stream";
import { pipeline as pipeline$1 } from "node:stream/promises";
//#region src/cli/capability-cli/media-understanding-result.ts
function isMissingMediaUnderstandingProvider(result) {
	const decision = result.decision;
	return decision?.outcome === "skipped" && decision.attachments.length > 0 && decision.attachments.every((attachment) => attachment.attempts.length === 0);
}
//#endregion
//#region src/cli/capability-cli/shared.ts
function resolveTransport(opts) {
	if (opts.local && opts.gateway) throw new Error("Pass only one of --local or --gateway.");
	if (opts.local) {
		if (!opts.supported.includes("local")) throw new Error("This command does not support --local.");
		return "local";
	}
	if (opts.gateway) {
		if (!opts.supported.includes("gateway")) throw new Error("This command does not support --gateway.");
		return "gateway";
	}
	return opts.defaultTransport;
}
function emitJsonOrText(runtime, json, value, textFormatter) {
	if (json) {
		writeRuntimeJson(runtime, value);
		return;
	}
	runtime.log(textFormatter(value));
}
function formatEnvelopeForText(value) {
	const envelope = value;
	if (!envelope.ok) return `${envelope.capability} failed: ${envelope.error ?? "unknown error"}`;
	const lines = [
		`${envelope.capability} via ${envelope.transport}`,
		...envelope.provider ? [`provider: ${envelope.provider}`] : [],
		...envelope.model ? [`model: ${envelope.model}`] : [],
		...envelope.ignoredOverrides && envelope.ignoredOverrides.length > 0 ? [`ignoredOverrides: ${JSON.stringify(envelope.ignoredOverrides)}`] : [],
		`outputs: ${String(envelope.outputs.length)}`
	];
	for (const output of envelope.outputs) {
		const pathValue = typeof output.path === "string" ? output.path : void 0;
		const textValue = typeof output.text === "string" ? output.text : void 0;
		if (pathValue) lines.push(pathValue);
		else if (textValue) lines.push(textValue);
		else lines.push(JSON.stringify(output));
	}
	return lines.join("\n");
}
function providerSummaryText(value) {
	return value.map((entry) => JSON.stringify(entry)).join("\n");
}
function hasOwnKeys(value) {
	return Boolean(value && typeof value === "object" && Object.keys(value).length > 0);
}
function resolveSelectedProviderFromModelRef(modelRef) {
	return resolveModelRefOverride(modelRef).provider;
}
function resolveCapabilityProviderAgentId(cfg, rawAgentId) {
	const requestedAgentId = rawAgentId?.trim();
	if (rawAgentId !== void 0 && !requestedAgentId) throw new Error("--agent must not be blank");
	const agentId = resolveSystemAgentTargetAgentId(cfg, requestedAgentId, {
		surface: "inference provider inspection",
		hint: "Pass --agent <id> or set agents.defaults.systemAgent.agentId."
	});
	if (!listAgentIds(cfg).includes(agentId)) throw new Error(`Unknown agent id "${agentId}". Run \`openclaw agents list\` to see configured agents.`);
	return agentId;
}
function getAuthProfileIdsForProvider(cfg, providerId, agentId) {
	return listProfilesForProvider(loadAuthProfileStoreForRuntime(resolveAgentDir(cfg, agentId)), providerId);
}
function providerHasGenericConfig(params) {
	const modelsProviders = params.cfg.models?.providers ?? {};
	const pluginEntries = params.cfg.plugins?.entries ?? {};
	const ttsProviders = params.cfg.tts?.providers ?? {};
	const envConfigured = (params.envVars ?? getProviderEnvVars(params.providerId, {
		config: params.cfg,
		includeUntrustedWorkspacePlugins: false
	})).some((envVar) => Boolean(process.env[envVar]?.trim()));
	return (params.agentId ? getAuthProfileIdsForProvider(params.cfg, params.providerId, params.agentId).length > 0 : false) || hasOwnKeys(modelsProviders[params.providerId]) || hasOwnKeys(pluginEntries[params.providerId]?.config) || hasOwnKeys(ttsProviders[params.providerId]) || envConfigured;
}
function resolveModelRefOverride(raw) {
	const trimmed = raw?.trim();
	if (!trimmed) return {};
	const slash = trimmed.indexOf("/");
	if (slash <= 0 || slash === trimmed.length - 1) return { model: trimmed };
	return {
		provider: trimmed.slice(0, slash),
		model: trimmed.slice(slash + 1)
	};
}
function requireProviderModelOverride(raw) {
	const resolved = resolveModelRefOverride(raw);
	if (!raw?.trim()) return;
	if (!resolved.provider || !resolved.model) throw new Error("Model overrides must use the form <provider/model>.");
	return {
		provider: resolved.provider,
		model: resolved.model
	};
}
function parseOptionalFiniteNumber(raw, label) {
	if (raw === void 0 || typeof raw === "string" && raw.trim() === "") return;
	const value = parseStrictFiniteNumber(raw);
	if (value === void 0) throw new Error(`${label} must be a finite number`);
	return value;
}
function parseOptionalPositiveInteger(raw, label) {
	if (raw === void 0 || typeof raw === "string" && raw.trim() === "") return;
	const value = parseStrictPositiveInteger(raw);
	if (value === void 0) throw new Error(`${label} must be a positive integer`);
	return value;
}
function parseOptionalTimeoutMs(raw) {
	if (raw === void 0 || typeof raw === "string" && raw.trim() === "") return;
	return parseTimeoutMsWithFallback(raw, 0, { invalidType: "error" });
}
async function resolveLocalCapabilityRuntimeConfig(params) {
	const { effectiveConfig } = await resolveCommandConfigWithSecrets({
		config: params.config ?? getRuntimeConfig(),
		commandName: params.commandName,
		targetIds: params.targetIds,
		...params.allowedPaths ? { allowedPaths: params.allowedPaths } : {},
		...params.forcedActivePaths ? { forcedActivePaths: params.forcedActivePaths } : {},
		...params.optionalActivePaths ? { optionalActivePaths: params.optionalActivePaths } : {},
		runtime: defaultRuntime,
		autoEnable: true
	});
	pinRuntimeConfigSnapshot(effectiveConfig);
	return effectiveConfig;
}
function pinRuntimeConfigSnapshot(config) {
	const sourceConfig = getRuntimeConfigSourceSnapshot();
	if (sourceConfig) setRuntimeConfigSnapshot(config, sourceConfig);
	else setRuntimeConfigSnapshot(config);
}
//#endregion
//#region src/cli/capability-cli/audio.ts
async function runAudioTranscribe(params) {
	const cfg = await resolveLocalCapabilityRuntimeConfig({
		commandName: "infer audio transcribe",
		targetIds: getModelsCommandSecretTargetIds()
	});
	const activeModel = requireProviderModelOverride(params.model);
	const result = await transcribeAudioFile({
		filePath: path.resolve(params.file),
		cfg,
		language: params.language,
		activeModel,
		prompt: params.prompt
	});
	if (!result.text) {
		if (isMissingMediaUnderstandingProvider(result)) throw new Error("No audio transcription provider is configured or ready. Configure an audio-capable tools.media.models entry, or pass --model <provider/model> after configuring that provider's auth/API key.");
		throw new Error(`No transcript returned for audio: ${path.resolve(params.file)}`);
	}
	return {
		ok: true,
		capability: "audio.transcribe",
		transport: "local",
		attempts: [],
		outputs: [{
			path: path.resolve(params.file),
			text: result.text,
			kind: "audio.transcription"
		}]
	};
}
function registerAudioCapabilityCommands(capability) {
	const audio = capability.command("audio").description("Audio transcription");
	audio.command("transcribe").description("Transcribe one audio file").requiredOption("--file <path>", "Audio file").option("--language <code>", "Language hint").option("--prompt <text>", "Prompt hint").option("--model <provider/model>", "Model override").option("--json", "Output JSON", false).action(async (opts) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const result = await runAudioTranscribe({
				file: String(opts.file),
				language: opts.language,
				model: opts.model,
				prompt: opts.prompt
			});
			emitJsonOrText(defaultRuntime, Boolean(opts.json), result, formatEnvelopeForText);
		});
	});
	audio.command("providers").description("List audio transcription providers").option("--agent <id>", "Agent whose provider state should be inspected").option("--json", "Output JSON", false).action(async (opts) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const cfg = getRuntimeConfig();
			const agentId = resolveCapabilityProviderAgentId(cfg, opts.agent);
			const remoteProviders = [...buildMediaUnderstandingRegistry(void 0, cfg).values()].filter((provider) => provider.capabilities?.includes("audio")).map((provider) => ({
				available: true,
				configured: providerHasGenericConfig({
					cfg,
					providerId: provider.id,
					agentId,
					envVars: getProviderEnvVars(provider.id, {
						config: cfg,
						includeUntrustedWorkspacePlugins: false
					})
				}),
				selected: false,
				id: provider.id,
				capabilities: provider.capabilities,
				defaultModels: provider.defaultModels
			}));
			const localProviders = (await inspectLocalAudioSelection()).candidates.filter((candidate) => candidate.available).map((candidate) => Object.assign({
				available: candidate.available,
				configured: candidate.ready,
				selected: false,
				localFallbackSelected: candidate.selected,
				id: `local/${candidate.id}`,
				transport: "local-cli",
				command: candidate.command,
				observedBackend: candidate.observedBackend ?? "unknown",
				evidence: candidate.evidence
			}, candidate.capableBackend ? { capableBackend: candidate.capableBackend } : {}, candidate.requestedBackend ? { requestedBackend: candidate.requestedBackend } : {}, candidate.reason ? { reason: candidate.reason } : {}));
			const providers = [...remoteProviders, ...localProviders];
			emitJsonOrText(defaultRuntime, Boolean(opts.json), providers, providerSummaryText);
		});
	});
}
//#endregion
//#region src/cli/capability-cli/embedding.ts
async function closeEmbeddingProviderWithRetry(provider) {
	let lastError;
	for (let attempt = 0; attempt < 2; attempt += 1) try {
		await provider.close?.();
		return;
	} catch (err) {
		lastError = err;
	}
	throw lastError;
}
async function runMemoryEmbeddingCreate(params) {
	const modelRef = requireProviderModelOverride(params.model);
	const cfg = await resolveLocalCapabilityRuntimeConfig({
		commandName: "infer embedding create",
		targetIds: getMemoryEmbeddingCommandSecretTargetIds()
	});
	const requestedProvider = normalizeOptionalString(params.provider) || modelRef?.provider || "auto";
	const result = await createEmbeddingProvider({
		config: cfg,
		agentDir: resolveAgentDir(cfg, resolveDefaultAgentId(cfg)),
		provider: requestedProvider,
		fallback: "none",
		model: modelRef?.model ?? ""
	});
	if (!result.provider) throw new Error(result.providerUnavailableReason ?? "No embedding provider available.");
	const provider = result.provider;
	let embeddings = [];
	let operationError;
	let operationFailed = false;
	try {
		embeddings = await provider.embedBatch(params.texts);
	} catch (err) {
		operationError = err;
		operationFailed = true;
	}
	let closeError;
	let closeFailed = false;
	try {
		await closeEmbeddingProviderWithRetry(provider);
	} catch (err) {
		closeError = err;
		closeFailed = true;
	}
	if (operationFailed) throw operationError;
	if (closeFailed) throw closeError;
	return {
		ok: true,
		capability: "embedding.create",
		transport: "local",
		provider: provider.id,
		model: provider.model,
		attempts: result.fallbackFrom ? [{
			provider: result.fallbackFrom,
			outcome: "failed",
			error: result.fallbackReason
		}] : [],
		outputs: embeddings.map((embedding, index) => ({
			text: params.texts[index],
			embedding,
			dimensions: embedding.length
		}))
	};
}
function registerEmbeddingCapabilityCommands(capability) {
	const embedding = capability.command("embedding").description("Embedding providers");
	embedding.command("create").description("Create embeddings").requiredOption("--text <text>", "Input text", collectOption, []).option("--provider <id>", "Provider id").option("--model <provider/model>", "Model override").option("--json", "Output JSON", false).action(async (opts) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const result = await runMemoryEmbeddingCreate({
				texts: opts.text,
				provider: opts.provider,
				model: opts.model
			});
			emitJsonOrText(defaultRuntime, Boolean(opts.json), result, formatEnvelopeForText);
		});
	});
	embedding.command("providers").description("List embedding providers").option("--agent <id>", "Agent whose provider state should be inspected").option("--json", "Output JSON", false).action(async (opts) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const cfg = getRuntimeConfig();
			const agentId = resolveCapabilityProviderAgentId(cfg, opts.agent);
			const resolvedMemory = resolveMemorySearchConfig(cfg, agentId);
			const selectedProvider = resolvedMemory?.provider;
			const providers = new Map(listRegisteredMemoryEmbeddingProviderAdapters().map((provider) => [provider.id, {
				id: provider.id,
				defaultModel: provider.defaultModel,
				transport: provider.transport,
				autoSelectPriority: provider.autoSelectPriority
			}]));
			for (const provider of listEmbeddingProviders(cfg)) {
				if (providers.has(provider.id)) continue;
				providers.set(provider.id, {
					id: provider.id,
					defaultModel: provider.defaultModel,
					transport: provider.transport,
					autoSelectPriority: void 0
				});
			}
			if (selectedProvider && !providers.has(selectedProvider)) providers.set(selectedProvider, {
				id: selectedProvider,
				defaultModel: resolvedMemory?.model || void 0,
				transport: providerHasGenericConfig({
					cfg,
					providerId: selectedProvider,
					agentId
				}) ? "remote" : void 0,
				autoSelectPriority: void 0
			});
			const result = Array.from(providers.values()).map((provider) => ({
				available: true,
				configured: provider.id === selectedProvider || providerHasGenericConfig({
					cfg,
					providerId: provider.id,
					agentId
				}),
				selected: provider.id === selectedProvider,
				id: provider.id,
				defaultModel: provider.defaultModel,
				transport: provider.transport,
				autoSelectPriority: provider.autoSelectPriority
			}));
			emitJsonOrText(defaultRuntime, Boolean(opts.json), result, providerSummaryText);
		});
	});
}
//#endregion
//#region src/cli/media-output.ts
async function writeOutputAsset(params) {
	if (!params.outputPath) {
		const saved = await saveMediaBuffer(params.buffer, params.mimeType, params.subdir, Number.MAX_SAFE_INTEGER, params.originalFilename);
		return {
			path: saved.path,
			mimeType: saved.contentType,
			size: saved.size
		};
	}
	const resolvedOutput = path.resolve(params.outputPath);
	const parsed = path.parse(resolvedOutput);
	const detectedMime = await detectMime({
		buffer: params.buffer,
		headerMime: params.mimeType
	}) ?? params.mimeType;
	const requestedMime = normalizeMimeType(await detectMime({ filePath: resolvedOutput }));
	const detectedNormalized = normalizeMimeType(detectedMime);
	const canonicalDetectedExt = extensionForMime(detectedNormalized);
	const fallbackExt = parsed.ext || path.extname(params.originalFilename ?? "") || "";
	const ext = parsed.ext && requestedMime === detectedNormalized ? parsed.ext : canonicalDetectedExt ?? fallbackExt;
	const filePath = params.outputCount <= 1 ? path.join(parsed.dir, `${parsed.name}${ext}`) : path.join(parsed.dir, `${parsed.name}-${String(params.outputIndex + 1)}${ext}`);
	await publishOutputFileAtomically({
		filePath,
		writeTemp: async (tempPath) => {
			await fs$1.writeFile(tempPath, params.buffer, { flag: "wx" });
		}
	});
	return {
		path: filePath,
		mimeType: detectedNormalized ?? params.mimeType,
		size: params.buffer.byteLength
	};
}
async function readInputFiles(files) {
	return await Promise.all(files.map(async (filePath) => ({
		path: path.resolve(filePath),
		buffer: await fs$1.readFile(path.resolve(filePath))
	})));
}
//#endregion
//#region src/cli/capability-cli/image.ts
const IMAGE_OUTPUT_FORMATS = [
	"png",
	"jpeg",
	"webp"
];
const IMAGE_BACKGROUNDS = [
	"transparent",
	"opaque",
	"auto"
];
async function runImageGenerate(params) {
	requireProviderModelOverride(params.model);
	const cfg = await resolveLocalCapabilityRuntimeConfig({
		commandName: `infer ${params.capability}`,
		targetIds: getModelsCommandSecretTargetIds()
	});
	const agentDir = resolveAgentDir(cfg, resolveDefaultAgentId(cfg));
	const inputImages = params.file && params.file.length > 0 ? await Promise.all((await readInputFiles(params.file)).map(async (entry) => ({
		buffer: entry.buffer,
		fileName: path.basename(entry.path),
		mimeType: await detectMime({
			buffer: entry.buffer,
			filePath: entry.path
		}) ?? "image/png"
	}))) : void 0;
	const result = await generateImage({
		cfg,
		agentDir,
		prompt: params.prompt,
		modelOverride: params.model,
		count: params.count,
		size: params.size,
		aspectRatio: params.aspectRatio,
		resolution: params.resolution,
		quality: params.quality,
		outputFormat: params.outputFormat,
		background: params.background,
		providerOptions: params.openaiBackground || params.openaiModeration ? { openai: {
			...params.openaiBackground ? { background: params.openaiBackground } : {},
			...params.openaiModeration ? { moderation: params.openaiModeration } : {}
		} } : void 0,
		timeoutMs: params.timeoutMs,
		inputImages
	});
	const outputs = await Promise.all(result.images.map(async (image, index) => {
		const written = await writeOutputAsset({
			buffer: image.buffer,
			mimeType: image.mimeType,
			originalFilename: image.fileName,
			outputPath: params.output,
			outputIndex: index,
			outputCount: result.images.length,
			subdir: "generated"
		});
		const metadata = await getImageMetadata(image.buffer).catch(() => void 0);
		return {
			...written,
			width: metadata?.width,
			height: metadata?.height,
			revisedPrompt: image.revisedPrompt
		};
	}));
	return {
		ok: true,
		capability: params.capability,
		transport: "local",
		provider: result.provider,
		model: result.model,
		attempts: result.attempts,
		outputs,
		ignoredOverrides: result.ignoredOverrides
	};
}
async function runImageDescribe(params) {
	const cfg = await resolveLocalCapabilityRuntimeConfig({
		commandName: `infer ${params.capability}`,
		targetIds: getModelsCommandSecretTargetIds()
	});
	const agentDir = resolveAgentDir(cfg, resolveDefaultAgentId(cfg));
	const activeModel = requireProviderModelOverride(params.model);
	const prompt = normalizeOptionalString(params.prompt);
	const outputs = await Promise.all(params.files.map(async (filePath) => {
		const resolvedPath = resolveImageDescribeInput(filePath);
		const isRemoteUrl = /^https?:\/\//i.test(resolvedPath);
		const preparedImage = activeModel ? await prepareImageDescriptionInput({
			filePath: resolvedPath,
			...isRemoteUrl ? { mediaUrl: resolvedPath } : {},
			cfg,
			timeoutMs: params.timeoutMs
		}) : void 0;
		const result = activeModel && preparedImage ? await runWithImageModelFallback({
			cfg,
			modelOverride: `${activeModel.provider}/${activeModel.model}`,
			run: async (provider, model) => {
				const described = await describePreparedImageWithModel({
					image: preparedImage,
					cfg,
					agentDir,
					provider,
					model,
					prompt: prompt ?? "Describe the image.",
					timeoutMs: params.timeoutMs
				});
				if (!described.text?.trim()) throw new Error(`No description returned for image: ${resolvedPath}`);
				return described;
			}
		}) : {
			result: await describeImageFile({
				filePath: resolvedPath,
				...isRemoteUrl ? { mediaUrl: resolvedPath } : {},
				cfg,
				agentDir,
				prompt,
				timeoutMs: params.timeoutMs
			}),
			provider: void 0,
			model: void 0,
			attempts: []
		};
		if (!result.result.text) {
			if (isMissingMediaUnderstandingProvider(result.result)) throw new Error("No image understanding provider is configured or ready. Configure an image-capable tools.media.models entry or agents.defaults.imageModel.primary, or pass --model <provider/model> after configuring that provider's auth/API key.");
			throw new Error(`No description returned for image: ${resolvedPath}`);
		}
		return {
			path: resolvedPath,
			text: result.result.text,
			provider: result.provider ?? result.result.provider,
			model: result.result.model ?? result.model,
			attempts: result.attempts,
			kind: "image.description"
		};
	}));
	return {
		ok: true,
		capability: params.capability,
		transport: "local",
		provider: outputs[0]?.provider,
		model: outputs[0]?.model,
		attempts: outputs.flatMap((output) => output.attempts),
		outputs: outputs.map(({ attempts: _attempts, ...output }) => output)
	};
}
function normalizeImageOutputFormat(raw) {
	const normalized = normalizeLowercaseStringOrEmpty(raw);
	if (!normalized) return;
	if (IMAGE_OUTPUT_FORMATS.includes(normalized)) return normalized;
	throw new Error("--output-format must be one of png, jpeg, or webp");
}
function normalizeImageBackground(raw, label = "--background") {
	const normalized = normalizeLowercaseStringOrEmpty(raw);
	if (!normalized) return;
	if (IMAGE_BACKGROUNDS.includes(normalized)) return normalized;
	throw new Error(`${label} must be one of transparent, opaque, or auto`);
}
function normalizeImageQuality(raw) {
	const normalized = normalizeLowercaseStringOrEmpty(raw);
	if (!normalized) return;
	if (normalized === "low" || normalized === "medium" || normalized === "high" || normalized === "auto") return normalized;
	throw new Error("--quality must be one of low, medium, high, or auto");
}
function normalizeOpenAIModeration(raw) {
	const normalized = normalizeLowercaseStringOrEmpty(raw);
	if (!normalized) return;
	if (normalized === "low" || normalized === "auto") return normalized;
	throw new Error("--openai-moderation must be one of low or auto");
}
function resolveImageDescribeInput(filePath) {
	const trimmed = filePath.trim();
	return /^https?:\/\//i.test(trimmed) ? trimmed : path.resolve(filePath);
}
function addImageGenerationOptions(command) {
	return command.option("--model <provider/model>", "Model override").option("--count <n>", "Number of images").option("--size <size>", "Size hint like 1024x1024").option("--aspect-ratio <ratio>", "Aspect ratio hint like 16:9").option("--resolution <value>", "Resolution hint: 1K, 2K, or 4K").option("--output-format <format>", "Output format hint: png, jpeg, or webp").option("--background <value>", "Background hint: transparent, opaque, or auto").option("--openai-background <value>", "OpenAI background hint: transparent, opaque, or auto").option("--openai-moderation <value>", "OpenAI moderation hint: low or auto").option("--quality <value>", "Quality hint: low, medium, high, or auto").option("--timeout-ms <ms>", "Provider request timeout in milliseconds").option("--output <path>", "Output path").option("--json", "Output JSON", false);
}
function resolveImageGenerationOptions(opts) {
	return {
		model: opts.model,
		count: parseOptionalPositiveInteger(opts.count, "--count"),
		size: opts.size,
		aspectRatio: opts.aspectRatio,
		resolution: opts.resolution,
		outputFormat: normalizeImageOutputFormat(opts.outputFormat),
		background: normalizeImageBackground(opts.background),
		openaiBackground: normalizeImageBackground(opts.openaiBackground, "--openai-background"),
		openaiModeration: normalizeOpenAIModeration(opts.openaiModeration),
		quality: normalizeImageQuality(opts.quality),
		timeoutMs: parseOptionalTimeoutMs(opts.timeoutMs),
		output: opts.output
	};
}
function registerImageCapabilityCommands(capability) {
	const image = capability.command("image").description("Image generation and description");
	addImageGenerationOptions(image.command("generate").description("Generate images").requiredOption("--prompt <text>", "Prompt text")).action(async (opts) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const result = await runImageGenerate({
				capability: "image.generate",
				prompt: String(opts.prompt),
				...resolveImageGenerationOptions(opts)
			});
			emitJsonOrText(defaultRuntime, Boolean(opts.json), result, formatEnvelopeForText);
		});
	});
	addImageGenerationOptions(image.command("edit").description("Edit images with one or more input files").requiredOption("--file <path>", "Input file", collectOption, []).requiredOption("--prompt <text>", "Prompt text")).action(async (opts) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const files = Array.isArray(opts.file) ? opts.file : [String(opts.file)];
			const result = await runImageGenerate({
				capability: "image.edit",
				prompt: String(opts.prompt),
				file: files,
				...resolveImageGenerationOptions(opts)
			});
			emitJsonOrText(defaultRuntime, Boolean(opts.json), result, formatEnvelopeForText);
		});
	});
	image.command("describe").description("Describe one image file").requiredOption("--file <path>", "Image file").option("--prompt <text>", "Prompt hint").option("--model <provider/model>", "Model override").option("--timeout-ms <ms>", "Provider request timeout in milliseconds").option("--json", "Output JSON", false).action(async (opts) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const result = await runImageDescribe({
				capability: "image.describe",
				files: [String(opts.file)],
				model: opts.model,
				prompt: opts.prompt,
				timeoutMs: parseOptionalTimeoutMs(opts.timeoutMs)
			});
			emitJsonOrText(defaultRuntime, Boolean(opts.json), result, formatEnvelopeForText);
		});
	});
	image.command("describe-many").description("Describe multiple image files").requiredOption("--file <path>", "Image file", collectOption, []).option("--prompt <text>", "Prompt hint").option("--model <provider/model>", "Model override").option("--timeout-ms <ms>", "Provider request timeout in milliseconds").option("--json", "Output JSON", false).action(async (opts) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const result = await runImageDescribe({
				capability: "image.describe-many",
				files: opts.file,
				model: opts.model,
				prompt: opts.prompt,
				timeoutMs: parseOptionalTimeoutMs(opts.timeoutMs)
			});
			emitJsonOrText(defaultRuntime, Boolean(opts.json), result, formatEnvelopeForText);
		});
	});
	image.command("providers").description("List image generation providers").option("--agent <id>", "Agent whose provider state should be inspected").option("--json", "Output JSON", false).action(async (opts) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const cfg = getRuntimeConfig();
			const agentId = resolveCapabilityProviderAgentId(cfg, opts.agent);
			const selectedProvider = resolveSelectedProviderFromModelRef(resolveAgentModelPrimaryValue(cfg.agents?.defaults?.mediaModels?.image));
			const result = listRuntimeImageGenerationProviders({ config: cfg }).map((provider) => ({
				available: true,
				configured: selectedProvider === provider.id || providerHasGenericConfig({
					cfg,
					providerId: provider.id,
					agentId
				}),
				selected: selectedProvider === provider.id,
				id: provider.id,
				label: provider.label,
				defaultModel: provider.defaultModel,
				models: provider.models ?? [],
				capabilities: provider.capabilities
			}));
			emitJsonOrText(defaultRuntime, Boolean(opts.json), result, providerSummaryText);
		});
	});
}
//#endregion
//#region src/cli/capability-cli/metadata.ts
const CAPABILITY_METADATA = [
	{
		id: "model.run",
		description: "Run a one-shot inference turn through the selected model provider.",
		transports: ["local", "gateway"],
		flags: [
			"--prompt",
			"--file",
			"--model",
			"--thinking",
			"--local",
			"--gateway",
			"--json"
		],
		resultShape: "normalized payloads plus provider/model attribution"
	},
	{
		id: "model.list",
		description: "List known models from the model catalog.",
		transports: ["local"],
		flags: ["--json"],
		resultShape: "catalog entries"
	},
	{
		id: "model.inspect",
		description: "Inspect one model catalog entry.",
		transports: ["local"],
		flags: ["--model", "--json"],
		resultShape: "single catalog entry"
	},
	{
		id: "model.providers",
		description: "List model providers discovered from the catalog.",
		transports: ["local"],
		flags: ["--agent", "--json"],
		resultShape: "provider ids with counts and defaults"
	},
	{
		id: "model.auth.login",
		description: "Run the existing provider auth login flow.",
		transports: ["local"],
		flags: ["--provider", "--method"],
		resultShape: "interactive auth result"
	},
	{
		id: "model.auth.logout",
		description: "Remove saved auth profiles for one provider.",
		transports: ["local"],
		flags: [
			"--provider",
			"--agent",
			"--json"
		],
		resultShape: "removed profile ids"
	},
	{
		id: "model.auth.status",
		description: "Show configured model auth state.",
		transports: ["local"],
		flags: ["--json"],
		resultShape: "model status summary"
	},
	{
		id: "image.generate",
		description: "Generate raster images with configured image providers.",
		transports: ["local"],
		flags: [
			"--prompt",
			"--model",
			"--count",
			"--size",
			"--aspect-ratio",
			"--resolution",
			"--output-format",
			"--background",
			"--openai-background",
			"--openai-moderation",
			"--quality",
			"--timeout-ms",
			"--output",
			"--json"
		],
		resultShape: "saved image files plus attempts"
	},
	{
		id: "image.edit",
		description: "Generate edited images from one or more input files.",
		transports: ["local"],
		flags: [
			"--file",
			"--prompt",
			"--model",
			"--count",
			"--size",
			"--aspect-ratio",
			"--resolution",
			"--output-format",
			"--background",
			"--openai-background",
			"--openai-moderation",
			"--quality",
			"--timeout-ms",
			"--output",
			"--json"
		],
		resultShape: "saved image files plus attempts"
	},
	{
		id: "image.describe",
		description: "Describe one image file through media-understanding providers.",
		transports: ["local"],
		flags: [
			"--file",
			"--prompt",
			"--model",
			"--timeout-ms",
			"--json"
		],
		resultShape: "normalized text output"
	},
	{
		id: "image.describe-many",
		description: "Describe multiple image files independently.",
		transports: ["local"],
		flags: [
			"--file",
			"--prompt",
			"--model",
			"--timeout-ms",
			"--json"
		],
		resultShape: "one text output per file"
	},
	{
		id: "image.providers",
		description: "List image generation providers.",
		transports: ["local"],
		flags: ["--agent", "--json"],
		resultShape: "provider ids and defaults"
	},
	{
		id: "audio.transcribe",
		description: "Transcribe one audio file.",
		transports: ["local"],
		flags: [
			"--file",
			"--language",
			"--prompt",
			"--model",
			"--json"
		],
		resultShape: "normalized text output"
	},
	{
		id: "audio.providers",
		description: "List audio transcription providers.",
		transports: ["local"],
		flags: ["--agent", "--json"],
		resultShape: "provider ids and capabilities"
	},
	{
		id: "tts.convert",
		description: "Convert text to speech.",
		transports: ["local", "gateway"],
		flags: [
			"--text",
			"--channel",
			"--voice",
			"--provider",
			"--model",
			"--output",
			"--local",
			"--gateway",
			"--json"
		],
		resultShape: "saved audio file plus attempts"
	},
	{
		id: "tts.voices",
		description: "List voices for a speech provider.",
		transports: ["local"],
		flags: ["--provider", "--json"],
		resultShape: "voice entries"
	},
	{
		id: "tts.providers",
		description: "List speech providers.",
		transports: ["local", "gateway"],
		flags: [
			"--agent",
			"--local",
			"--gateway",
			"--json"
		],
		resultShape: "provider ids, configured state, models, voices"
	},
	{
		id: "tts.personas",
		description: "List TTS personas.",
		transports: ["local", "gateway"],
		flags: [
			"--local",
			"--gateway",
			"--json"
		],
		resultShape: "persona ids, labels, providers, active persona"
	},
	{
		id: "tts.status",
		description: "Show gateway-managed TTS state.",
		transports: ["gateway"],
		flags: ["--gateway", "--json"],
		resultShape: "enabled/provider state"
	},
	{
		id: "tts.enable",
		description: "Enable TTS in prefs.",
		transports: ["local", "gateway"],
		flags: [
			"--local",
			"--gateway",
			"--json"
		],
		resultShape: "enabled state"
	},
	{
		id: "tts.disable",
		description: "Disable TTS in prefs.",
		transports: ["local", "gateway"],
		flags: [
			"--local",
			"--gateway",
			"--json"
		],
		resultShape: "enabled state"
	},
	{
		id: "tts.set-provider",
		description: "Set the active TTS provider.",
		transports: ["local", "gateway"],
		flags: [
			"--provider",
			"--local",
			"--gateway",
			"--json"
		],
		resultShape: "selected provider"
	},
	{
		id: "tts.set-persona",
		description: "Set the active TTS persona.",
		transports: ["local", "gateway"],
		flags: [
			"--persona",
			"--off",
			"--local",
			"--gateway",
			"--json"
		],
		resultShape: "selected persona"
	},
	{
		id: "video.generate",
		description: "Generate video files with configured video providers.",
		transports: ["local"],
		flags: [
			"--prompt",
			"--model",
			"--size",
			"--aspect-ratio",
			"--resolution",
			"--duration",
			"--audio",
			"--watermark",
			"--timeout-ms",
			"--output",
			"--json"
		],
		resultShape: "saved video files plus attempts"
	},
	{
		id: "video.describe",
		description: "Describe one video file through media-understanding providers.",
		transports: ["local"],
		flags: [
			"--file",
			"--model",
			"--json"
		],
		resultShape: "normalized text output"
	},
	{
		id: "video.providers",
		description: "List video generation and description providers.",
		transports: ["local"],
		flags: ["--agent", "--json"],
		resultShape: "provider ids and defaults"
	},
	{
		id: "web.search",
		description: "Run provider-backed web search.",
		transports: ["local"],
		flags: [
			"--query",
			"--provider",
			"--limit",
			"--json"
		],
		resultShape: "search provider result"
	},
	{
		id: "web.fetch",
		description: "Fetch URL content through configured web fetch providers.",
		transports: ["local"],
		flags: [
			"--url",
			"--provider",
			"--format",
			"--json"
		],
		resultShape: "fetch provider result"
	},
	{
		id: "web.providers",
		description: "List web search and fetch providers.",
		transports: ["local"],
		flags: ["--agent", "--json"],
		resultShape: "provider ids grouped by family"
	},
	{
		id: "embedding.create",
		description: "Create embeddings through embedding providers.",
		transports: ["local"],
		flags: [
			"--text",
			"--provider",
			"--model",
			"--json"
		],
		resultShape: "vectors with provider/model attribution"
	},
	{
		id: "embedding.providers",
		description: "List embedding providers.",
		transports: ["local"],
		flags: ["--agent", "--json"],
		resultShape: "provider ids and default models"
	}
];
function findCapabilityMetadata(id) {
	return CAPABILITY_METADATA.find((entry) => entry.id === id);
}
//#endregion
//#region src/cli/capability-cli/model.ts
const LOCAL_MODEL_RUN_SYSTEM_PROMPT = "You are a personal assistant running inside OpenClaw.";
const HEIC_MODEL_RUN_MIMES = /* @__PURE__ */ new Set(["image/heic", "image/heif"]);
async function loadModelCatalogForInspection(cfg, agentId) {
	const prepared = await loadPreparedModelCatalog({
		config: cfg,
		agentId,
		readOnly: true
	});
	const manifest = planEffectiveModelCatalogRows({
		registry: loadManifestMetadataSnapshot({
			config: cfg,
			env: process.env
		}).manifestRegistry,
		config: cfg
	}).rows;
	const entries = /* @__PURE__ */ new Map();
	for (const entry of manifest) entries.set(`${entry.provider}\0${entry.id}`, entry);
	for (const entry of prepared) entries.set(`${entry.provider}\0${entry.id}`, entry);
	return [...entries.values()].toSorted((a, b) => a.provider.localeCompare(b.provider) || a.id.localeCompare(b.id));
}
async function canonicalizeModelRunRef(params) {
	return await canonicalizeCaseOnlyCatalogModelRef({
		cfg: params.cfg,
		raw: params.raw,
		defaultProvider: DEFAULT_PROVIDER,
		loadCatalog: () => loadPreparedModelCatalog({
			config: params.cfg,
			readOnly: true
		}),
		preserveAuthProfile: params.preserveAuthProfile
	});
}
function collectModelRunText(content) {
	return content.map((block) => block.type === "text" && typeof block.text === "string" ? block.text : "").join("").trim();
}
function requireModelRunPrompt(value) {
	if (typeof value !== "string" || normalizeOptionalString(value) === void 0) throw new Error("--prompt cannot be empty or whitespace-only.");
	return value;
}
async function readModelRunImageFiles(files) {
	if (!files || files.length === 0) return [];
	return await Promise.all(files.map(async (filePath) => {
		const resolvedPath = path.resolve(filePath);
		const buffer = await fs$1.readFile(resolvedPath);
		const mimeType = normalizeMimeType(await detectMime({
			buffer,
			filePath: resolvedPath
		}));
		if (!mimeType?.startsWith("image/")) throw new Error(`Unsupported --file for model run: ${resolvedPath}. Only image files are supported; use infer audio transcribe for audio files.`);
		if (HEIC_MODEL_RUN_MIMES.has(mimeType)) {
			const converted = await convertHeicToJpeg(buffer);
			return {
				path: resolvedPath,
				fileName: path.basename(resolvedPath),
				mimeType: "image/jpeg",
				data: converted.toString("base64")
			};
		}
		return {
			path: resolvedPath,
			fileName: path.basename(resolvedPath),
			mimeType,
			data: buffer.toString("base64")
		};
	}));
}
function normalizeModelRunThinking(value) {
	if (value === void 0) return;
	if (typeof value !== "string") throw new Error("--thinking must be a string.");
	const normalized = normalizeThinkLevel(value);
	if (!normalized) throw new Error("Invalid thinking level. Use one of: off, minimal, low, medium, high, adaptive, xhigh, max.");
	return normalized;
}
async function runModelRun(params) {
	const explicitModelOverride = requireProviderModelOverride(params.model);
	const cfg = params.transport === "local" ? await resolveLocalCapabilityRuntimeConfig({
		commandName: "infer model run",
		targetIds: getModelsCommandSecretTargetIds()
	}) : getRuntimeConfig();
	const agentId = resolveDefaultAgentId(cfg);
	const modelRef = await canonicalizeModelRunRef({
		raw: params.model,
		cfg,
		preserveAuthProfile: params.transport === "local"
	});
	const hasExplicitProviderModelOverride = Boolean(explicitModelOverride);
	const imageFiles = await readModelRunImageFiles(params.files);
	const messageContent = imageFiles.length > 0 ? [{
		type: "text",
		text: params.prompt
	}, ...imageFiles.map((image) => ({
		type: "image",
		data: image.data,
		mimeType: image.mimeType
	}))] : params.prompt;
	if (params.transport === "local") {
		const prepared = await prepareSimpleCompletionModelForAgent({
			cfg,
			agentId,
			modelRef,
			allowMissingApiKeyModes: ["aws-sdk"],
			...hasExplicitProviderModelOverride ? { allowBundledStaticCatalogFallback: true } : {},
			skipAgentDiscovery: true
		});
		if ("error" in prepared) throw new Error(prepared.error);
		if (prepared.selection.provider === "codex") throw new Error("The codex provider is served by the Codex app-server agent runtime, not the local simple-completion transport. Use an openai/<model> ref with provider/model agentRuntime.id: \"codex\", run through the gateway, or use /codex commands.");
		const localModelRunSystemPrompt = prepared.model.api === "openai-chatgpt-responses" ? LOCAL_MODEL_RUN_SYSTEM_PROMPT : void 0;
		const result = await completeWithPreparedSimpleCompletionModel({
			model: prepared.model,
			auth: prepared.auth,
			cfg,
			context: {
				...localModelRunSystemPrompt ? { systemPrompt: localModelRunSystemPrompt } : {},
				messages: [{
					role: "user",
					content: messageContent,
					timestamp: Date.now()
				}]
			},
			options: {
				maxTokens: typeof prepared.model.maxTokens === "number" && Number.isFinite(prepared.model.maxTokens) ? prepared.model.maxTokens : void 0,
				...params.thinking ? { reasoning: params.thinking } : {}
			}
		});
		const text = collectModelRunText(result.content);
		if (!text) {
			const providerErrorMessage = result.errorMessage;
			const detail = typeof providerErrorMessage === "string" && providerErrorMessage.trim() ? `: ${providerErrorMessage.trim()}` : "";
			throw new Error(`No text output returned for provider "${prepared.selection.provider}" model "${prepared.selection.modelId}"${detail}.`);
		}
		return {
			ok: true,
			capability: "model.run",
			transport: "local",
			provider: prepared.selection.provider,
			model: prepared.selection.modelId,
			attempts: [],
			...imageFiles.length > 0 ? { inputs: imageFiles.map((image) => ({
				path: image.path,
				mimeType: image.mimeType
			})) } : {},
			outputs: [{
				text,
				mediaUrl: null
			}]
		};
	}
	const { provider, model } = requireProviderModelOverride(modelRef) ?? {};
	const hasModelOverride = Boolean(provider || model);
	const sessionId = `model-run-${randomUUID()}`;
	const response = await callGateway({
		method: "agent",
		params: {
			agentId,
			sessionId,
			sessionKey: buildExplicitSessionIdSessionKey({
				agentId,
				sessionId
			}),
			message: params.prompt,
			attachments: imageFiles.length > 0 ? imageFiles.map((image) => ({
				type: "image",
				fileName: image.fileName,
				mimeType: image.mimeType,
				content: image.data
			})) : void 0,
			provider,
			model,
			...params.thinking ? { thinking: params.thinking } : {},
			modelRun: true,
			promptMode: "none",
			cleanupBundleMcpOnRunEnd: true,
			idempotencyKey: randomIdempotencyKey()
		},
		expectFinal: true,
		timeoutMs: 12e4,
		clientName: hasModelOverride ? GATEWAY_CLIENT_NAMES.GATEWAY_CLIENT : GATEWAY_CLIENT_NAMES.CLI,
		mode: hasModelOverride ? GATEWAY_CLIENT_MODES.BACKEND : GATEWAY_CLIENT_MODES.CLI,
		...hasModelOverride ? { scopes: [ADMIN_SCOPE] } : {}
	});
	return {
		ok: true,
		capability: "model.run",
		transport: "gateway",
		provider: response?.result?.meta?.agentMeta?.provider,
		model: response?.result?.meta?.agentMeta?.model,
		attempts: response?.result?.meta?.agentMeta?.fallbackAttempts ?? [],
		outputs: (response?.result?.payloads ?? []).map((payload) => ({
			text: payload.text,
			mediaUrl: payload.mediaUrl,
			mediaUrls: payload.mediaUrls
		})),
		...imageFiles.length > 0 ? { inputs: imageFiles.map((image) => ({
			path: image.path,
			mimeType: image.mimeType
		})) } : {}
	};
}
async function buildModelProviders(rawAgentId) {
	const cfg = getRuntimeConfig();
	const agentId = resolveCapabilityProviderAgentId(cfg, rawAgentId);
	const catalog = await loadModelCatalogForInspection(cfg, agentId);
	const selectedProvider = resolveSelectedProviderFromModelRef(resolveAgentEffectiveModelPrimary(cfg, agentId));
	const grouped = /* @__PURE__ */ new Map();
	for (const entry of catalog) {
		const current = grouped.get(entry.provider) ?? {
			provider: entry.provider,
			count: 0,
			defaults: [],
			available: true,
			configured: providerHasGenericConfig({
				cfg,
				providerId: entry.provider,
				agentId,
				envVars: getProviderEnvVars(entry.provider)
			}),
			selected: selectedProvider === entry.provider
		};
		current.count += 1;
		if (current.defaults.length < 3) current.defaults.push(entry.id);
		grouped.set(entry.provider, current);
	}
	return [...grouped.values()].toSorted((a, b) => a.provider.localeCompare(b.provider));
}
async function runModelAuthStatus() {
	const captured = [];
	const { modelsStatusCommand } = await import("./list.status-command-Dd8j_3-D.js");
	await modelsStatusCommand({ json: true }, {
		log: (...args) => captured.push(args.join(" ")),
		error: (message) => {
			throw message instanceof Error ? message : new Error(String(message));
		},
		exit: (code) => {
			throw new Error(`exit ${code}`);
		}
	});
	const raw = captured.find((line) => line.trim().startsWith("{"));
	return raw ? JSON.parse(raw) : {};
}
async function runModelAuthLogout(provider, agent) {
	const cfg = getRuntimeConfig();
	const agentDir = resolveAgentDir(cfg, agent?.trim() || resolveDefaultAgentId(cfg));
	const profileIds = listProfilesForProvider(loadAuthProfileStoreForRuntime(agentDir), provider);
	if (!await updateAuthProfileStoreWithLock({
		agentDir,
		updater: (nextStore) => {
			let changed = false;
			for (const profileId of profileIds) {
				if (nextStore.profiles[profileId]) {
					delete nextStore.profiles[profileId];
					changed = true;
				}
				if (nextStore.usageStats?.[profileId]) {
					delete nextStore.usageStats[profileId];
					changed = true;
				}
			}
			if (nextStore.order?.[provider]) {
				delete nextStore.order[provider];
				changed = true;
			}
			if (nextStore.lastGood?.[provider]) {
				delete nextStore.lastGood[provider];
				changed = true;
			}
			return changed;
		}
	})) throw new Error(`Failed to remove saved auth profiles for provider ${provider}.`);
	return {
		provider,
		removedProfiles: profileIds
	};
}
function registerModelCapabilityCommands(capability) {
	const model = capability.command("model").description("Text inference and model catalog commands");
	model.command("run").description("Run a one-shot model turn").requiredOption("--prompt <text>", "Prompt text").option("--file <path>", "Image file", collectOption, []).option("--model <provider/model>", "Model override").option("--thinking <level>", "Thinking level override").option("--local", "Force local execution", false).option("--gateway", "Force gateway execution", false).option("--json", "Output JSON", false).action(async (opts) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const prompt = requireModelRunPrompt(opts.prompt);
			const thinking = normalizeModelRunThinking(opts.thinking);
			const transport = resolveTransport({
				local: Boolean(opts.local),
				gateway: Boolean(opts.gateway),
				supported: ["local", "gateway"],
				defaultTransport: "local"
			});
			const result = await runModelRun({
				prompt,
				files: opts.file,
				model: opts.model,
				thinking,
				transport
			});
			emitJsonOrText(defaultRuntime, Boolean(opts.json), result, formatEnvelopeForText);
		});
	});
	model.command("list").description("List known models").option("--json", "Output JSON", false).action(async (opts) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const result = await loadModelCatalogForInspection(getRuntimeConfig());
			emitJsonOrText(defaultRuntime, Boolean(opts.json), result, providerSummaryText);
		});
	});
	model.command("inspect").description("Inspect one model catalog entry").requiredOption("--model <provider/model>", "Model id").option("--json", "Output JSON", false).action(async (opts) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const target = normalizeStringifiedOptionalString(opts.model) ?? "";
			const catalog = await loadModelCatalogForInspection(getRuntimeConfig());
			const entry = catalog.find((candidate) => `${candidate.provider}/${candidate.id}` === target) ?? catalog.find((candidate) => candidate.id === target);
			if (!entry) throw new Error(`Model not found: ${target}`);
			emitJsonOrText(defaultRuntime, Boolean(opts.json), entry, (value) => JSON.stringify(value, null, 2));
		});
	});
	model.command("providers").description("List model providers from the catalog").option("--agent <id>", "Agent whose provider state should be inspected").option("--json", "Output JSON", false).action(async (opts) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const result = await buildModelProviders(opts.agent);
			emitJsonOrText(defaultRuntime, Boolean(opts.json), result, providerSummaryText);
		});
	});
	const modelAuth = model.command("auth").description("Provider auth helpers");
	modelAuth.command("login").description("Run provider auth login").requiredOption("--provider <id>", "Provider id").option("--method <id>", "Provider auth method id").action(async (opts) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const { modelsAuthLoginCommand } = await import("./auth-W3-jnbzF.js");
			await modelsAuthLoginCommand({
				provider: String(opts.provider),
				method: opts.method ? String(opts.method) : void 0
			}, defaultRuntime);
		});
	});
	modelAuth.command("logout").description("Remove saved auth profiles for one provider").requiredOption("--provider <id>", "Provider id").option("--agent <id>", "Agent id (default: configured default agent)").option("--json", "Output JSON", false).action(async (opts) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const result = await runModelAuthLogout(String(opts.provider), typeof opts.agent === "string" ? opts.agent : void 0);
			emitJsonOrText(defaultRuntime, Boolean(opts.json), result, (value) => JSON.stringify(value, null, 2));
		});
	});
	modelAuth.command("status").description("Show configured auth state").option("--json", "Output JSON", false).action(async (opts) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const result = await runModelAuthStatus();
			emitJsonOrText(defaultRuntime, Boolean(opts.json), result, (value) => JSON.stringify(value, null, 2));
		});
	});
}
//#endregion
//#region src/cli/capability-cli/tts-runtime.ts
async function copyTtsOutputAtomically(sourcePath, targetPath) {
	await publishOutputFileAtomically({
		filePath: targetPath,
		writeTemp: async (tempPath) => {
			await fs$1.copyFile(sourcePath, tempPath);
		}
	});
}
async function runTtsConvert(params) {
	if (params.transport === "gateway") {
		const gatewayConnection = buildGatewayConnectionDetailsWithResolvers({ config: getRuntimeConfig() });
		const result = await callGateway({
			method: "tts.convert",
			params: {
				text: params.text,
				channel: params.channel,
				provider: normalizeOptionalString(params.provider),
				modelId: params.modelId,
				voiceId: params.voiceId
			},
			timeoutMs: 12e4
		});
		let outputPath = result.audioPath;
		if (params.output && result.audioPath) {
			const gatewayHost = new URL(gatewayConnection.url).hostname;
			if (!isLoopbackHost(gatewayHost)) throw new Error(`--output is not supported for remote gateway TTS yet (gateway target: ${gatewayConnection.url}).`);
			const target = path.resolve(params.output);
			await copyTtsOutputAtomically(result.audioPath, target);
			outputPath = target;
		}
		return {
			ok: true,
			capability: "tts.convert",
			transport: "gateway",
			provider: result.provider,
			attempts: [],
			outputs: [{
				path: outputPath,
				format: result.outputFormat,
				voiceCompatible: result.voiceCompatible
			}]
		};
	}
	const cfg = await resolveLocalCapabilityRuntimeConfig({
		commandName: "infer tts convert",
		targetIds: getTtsCommandSecretTargetIds()
	});
	const effectiveCfg = await injectTtsAuthProfileApiKey({
		cfg,
		provider: resolveTtsProviderForAuthHydration({
			cfg,
			provider: params.provider,
			modelId: params.modelId,
			channelId: params.channel
		}),
		channelId: params.channel
	});
	if (effectiveCfg !== cfg) pinRuntimeConfigSnapshot(effectiveCfg);
	const overrides = resolveExplicitTtsOverrides({
		cfg: effectiveCfg,
		provider: params.provider,
		modelId: params.modelId,
		voiceId: params.voiceId,
		channelId: params.channel
	});
	const hasExplicitSelection = Boolean(overrides.provider || normalizeOptionalString(params.modelId) || normalizeOptionalString(params.voiceId));
	const result = await textToSpeech({
		text: params.text,
		cfg: effectiveCfg,
		channel: params.channel,
		overrides,
		disableFallback: hasExplicitSelection
	});
	if (!result.success || !result.audioPath) throw new Error(result.error ?? "TTS conversion failed");
	let outputPath = result.audioPath;
	if (params.output) {
		const target = path.resolve(params.output);
		await copyTtsOutputAtomically(result.audioPath, target);
		outputPath = target;
	}
	return {
		ok: true,
		capability: "tts.convert",
		transport: "local",
		provider: result.provider,
		attempts: result.attempts ?? [],
		outputs: [{
			path: outputPath,
			format: result.outputFormat,
			voiceCompatible: result.voiceCompatible
		}]
	};
}
function resolveTtsProviderForAuthHydration(params) {
	const explicitProvider = params.provider ?? resolveSelectedProviderFromModelRef(normalizeOptionalString(params.modelId));
	if (explicitProvider) return explicitProvider;
	const ttsConfig = resolveTtsConfig(params.cfg, { channelId: params.channelId });
	return getTtsProvider(ttsConfig, resolveTtsPrefsPath(ttsConfig));
}
async function injectTtsAuthProfileApiKey(params) {
	if (!params.provider) return params.cfg;
	const providerId = canonicalizeSpeechProviderId(params.provider, params.cfg) ?? normalizeLowercaseStringOrEmpty(params.provider);
	if (!providerId) return params.cfg;
	if (resolvedTtsConfigHasProviderApiKey(resolveTtsConfig(params.cfg, { channelId: params.channelId }), providerId)) return params.cfg;
	const existingProviderConfig = resolveExistingTtsProviderConfig({
		cfg: params.cfg,
		providerId,
		channelId: params.channelId
	});
	if (ttsProviderConfigHasApiKey(existingProviderConfig?.value)) return params.cfg;
	const auth = await resolveApiKeyForProviderCore({
		provider: providerId,
		cfg: params.cfg,
		credentialPrecedence: "profile-first"
	}).catch(() => void 0);
	if (!auth?.apiKey || auth.mode !== "api-key") return params.cfg;
	if (existingProviderConfig?.scope === "channel") {
		const channels = { ...params.cfg.channels };
		const channel = channels[existingProviderConfig.channelKey];
		if (!isRecord(channel)) return params.cfg;
		const nextChannel = {
			...channel,
			tts: buildTtsConfigWithHydratedProvider({
				tts: channel.tts,
				existingProviderConfig,
				providerId,
				apiKey: auth.apiKey
			})
		};
		return {
			...params.cfg,
			channels: {
				...channels,
				[existingProviderConfig.channelKey]: nextChannel
			}
		};
	}
	const nextTts = buildTtsConfigWithHydratedProvider({
		tts: params.cfg.tts,
		existingProviderConfig,
		providerId,
		apiKey: auth.apiKey
	});
	return {
		...params.cfg,
		tts: nextTts
	};
}
function resolveExistingTtsProviderConfig(params) {
	const channelTts = resolveChannelTtsConfigForAuthHydration(params);
	if (channelTts) {
		const channelProviderConfig = resolveExistingTtsProviderConfigInTts({
			cfg: params.cfg,
			tts: channelTts.tts,
			providerId: params.providerId
		});
		if (channelProviderConfig) return {
			...channelProviderConfig,
			scope: "channel",
			channelKey: channelTts.channelKey
		};
	}
	const rootProviderConfig = resolveExistingTtsProviderConfigInTts({
		cfg: params.cfg,
		tts: params.cfg.tts,
		providerId: params.providerId
	});
	return rootProviderConfig ? {
		...rootProviderConfig,
		scope: "root"
	} : void 0;
}
function resolveExistingTtsProviderConfigInTts(params) {
	if (!isRecord(params.tts)) return;
	const providers = isRecord(params.tts.providers) ? params.tts.providers : void 0;
	if (!providers) return resolveDirectTtsProviderConfig(params);
	const exact = providers[params.providerId];
	if (exact !== void 0) return {
		container: "providers",
		key: params.providerId,
		value: exact
	};
	for (const [key, value] of Object.entries(providers)) if (normalizeLowercaseStringOrEmpty(canonicalizeSpeechProviderId(key, params.cfg) ?? key) === params.providerId) return {
		container: "providers",
		key,
		value
	};
	return resolveDirectTtsProviderConfig(params);
}
const TTS_CONFIG_RESERVED_KEYS = /* @__PURE__ */ new Set([
	"auto",
	"enabled",
	"maxTextLength",
	"mode",
	"modelOverrides",
	"persona",
	"personas",
	"prefsPath",
	"provider",
	"providers",
	"summaryModel",
	"timeoutMs"
]);
function resolveDirectTtsProviderConfig(params) {
	if (!isRecord(params.tts)) return;
	for (const [key, value] of Object.entries(params.tts)) {
		if (TTS_CONFIG_RESERVED_KEYS.has(key)) continue;
		if (normalizeLowercaseStringOrEmpty(canonicalizeSpeechProviderId(key, params.cfg) ?? key) === params.providerId) return {
			container: "direct",
			key,
			value
		};
	}
}
function resolveChannelTtsConfigForAuthHydration(params) {
	const channels = params.cfg.channels;
	const normalizedChannelId = normalizeOptionalString(params.channelId);
	if (!isRecord(channels) || !normalizedChannelId) return;
	const channelKey = Object.hasOwn(channels, normalizedChannelId) ? normalizedChannelId : Object.keys(channels).find((candidate) => normalizeLowercaseStringOrEmpty(candidate) === normalizeLowercaseStringOrEmpty(normalizedChannelId));
	const channel = channelKey ? channels[channelKey] : void 0;
	if (!channelKey || !isRecord(channel)) return;
	return {
		channelKey,
		tts: channel.tts
	};
}
function buildTtsConfigWithHydratedProvider(params) {
	const tts = isRecord(params.tts) ? { ...params.tts } : {};
	const providers = isRecord(tts.providers) ? { ...tts.providers } : {};
	const providerConfigKey = params.existingProviderConfig?.key ?? params.providerId;
	const nextProviderConfig = {
		...isRecord(params.existingProviderConfig?.value) ? params.existingProviderConfig.value : {},
		apiKey: params.apiKey
	};
	if (params.existingProviderConfig?.container === "direct") tts[providerConfigKey] = nextProviderConfig;
	else {
		providers[providerConfigKey] = nextProviderConfig;
		tts.providers = providers;
	}
	return tts;
}
function ttsProviderConfigHasApiKey(value) {
	return isRecord(value) && "apiKey" in value;
}
function resolvedTtsConfigHasProviderApiKey(config, providerId) {
	if (!isRecord(config) || !isRecord(config.providerConfigs)) return false;
	return ttsProviderConfigHasApiKey(config.providerConfigs[providerId]);
}
async function runTtsProviders(transport, rawAgentId) {
	const cfg = getRuntimeConfig();
	if (transport === "gateway") {
		if (rawAgentId !== void 0) throw new Error("--agent is only supported with local TTS provider inspection.");
		const payload = await callGateway({
			method: "tts.providers",
			timeoutMs: 3e4
		});
		return {
			...payload,
			providers: (payload.providers ?? []).map((provider) => {
				const id = typeof provider.id === "string" ? provider.id : "";
				return Object.assign({
					available: true,
					configured: typeof provider.configured === `boolean` ? provider.configured : providerHasGenericConfig({
						cfg,
						providerId: id
					}),
					selected: Boolean(id && payload.active === id)
				}, provider);
			})
		};
	}
	const agentId = resolveCapabilityProviderAgentId(cfg, rawAgentId);
	const config = resolveTtsConfig(cfg);
	const active = getTtsProvider(config, resolveTtsPrefsPath(config));
	return {
		providers: listSpeechProviders(cfg).map((provider) => ({
			available: true,
			configured: active === provider.id || providerHasGenericConfig({
				cfg,
				providerId: provider.id,
				agentId
			}),
			selected: active === provider.id,
			id: provider.id,
			name: provider.label,
			models: [...provider.models ?? []],
			voices: [...provider.voices ?? []]
		})),
		active
	};
}
async function runTtsPersonas(transport) {
	if (transport === "gateway") return await callGateway({
		method: "tts.personas",
		timeoutMs: 3e4
	});
	const config = resolveTtsConfig(getRuntimeConfig());
	return {
		active: getTtsPersona(config, resolveTtsPrefsPath(config))?.id ?? null,
		personas: listTtsPersonas(config).map((persona) => ({
			id: persona.id,
			label: persona.label,
			description: persona.description,
			provider: persona.provider,
			fallbackPolicy: persona.fallbackPolicy,
			providers: Object.keys(persona.providers ?? {})
		}))
	};
}
async function runTtsVoices(providerRaw) {
	const cfg = await resolveLocalCapabilityRuntimeConfig({
		commandName: "infer tts voices",
		targetIds: getTtsCommandSecretTargetIds()
	});
	const config = resolveTtsConfig(cfg);
	const prefsPath = resolveTtsPrefsPath(config);
	return await listSpeechVoices({
		provider: normalizeOptionalString(providerRaw) || getTtsProvider(config, prefsPath),
		cfg,
		config
	});
}
async function runTtsStateMutation(params) {
	if (params.transport === "gateway") return await callGateway({
		method: params.capability === "tts.enable" ? "tts.enable" : params.capability === "tts.disable" ? "tts.disable" : params.capability === "tts.set-provider" ? "tts.setProvider" : "tts.setPersona",
		params: params.capability === "tts.set-provider" ? { provider: params.provider } : params.capability === "tts.set-persona" ? { persona: params.persona ?? "off" } : void 0,
		timeoutMs: 3e4
	});
	const cfg = getRuntimeConfig();
	const config = resolveTtsConfig(cfg);
	const prefsPath = resolveTtsPrefsPath(config);
	if (params.capability === "tts.enable") {
		setTtsEnabled(prefsPath, true);
		return { enabled: true };
	}
	if (params.capability === "tts.disable") {
		setTtsEnabled(prefsPath, false);
		return { enabled: false };
	}
	if (params.capability === "tts.set-persona") {
		if (!params.persona) {
			setTtsPersona(prefsPath, null);
			return { persona: null };
		}
		const persona = listTtsPersonas(config).find((entry) => entry.id === normalizeLowercaseStringOrEmpty(params.persona ?? ""));
		if (!persona) throw new Error(`Unknown TTS persona: ${params.persona}`);
		setTtsPersona(prefsPath, persona.id);
		return { persona: persona.id };
	}
	if (!params.provider) throw new Error("--provider is required");
	const provider = canonicalizeSpeechProviderId(params.provider, cfg);
	if (!provider) throw new Error(`Unknown speech provider: ${params.provider}`);
	setTtsProvider(prefsPath, provider);
	return { provider };
}
//#endregion
//#region src/cli/capability-cli/tts.ts
function registerTransportTtsCommand(command, defaultTransport, run, formatText = (value) => JSON.stringify(value, null, 2)) {
	command.option("--local", "Force local execution", false).option("--gateway", "Force gateway execution", false).option("--json", "Output JSON", false).action(async (opts) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const result = await run(opts, resolveTransport({
				local: Boolean(opts.local),
				gateway: Boolean(opts.gateway),
				supported: ["local", "gateway"],
				defaultTransport
			}));
			emitJsonOrText(defaultRuntime, Boolean(opts.json), result, formatText);
		});
	});
}
function registerTtsCapabilityCommands(capability) {
	const tts = capability.command("tts").description("Text to speech");
	registerTransportTtsCommand(tts.command("convert").description("Convert text to speech").requiredOption("--text <text>", "Input text").option("--channel <id>", "Channel hint").option("--voice <id>", "Voice hint").option("--provider <id>", "Speech provider id").option("--model <provider/model>", "Model override").option("--output <path>", "Output path"), "local", async (opts, transport) => {
		const modelRef = resolveModelRefOverride(opts.model);
		if (opts.model && !modelRef.provider) throw new Error("TTS model overrides must use the form <provider/model>.");
		const provider = normalizeSpeechProviderId(typeof opts.provider === "string" && opts.provider.trim() ? opts.provider.trim() : modelRef.provider);
		const modelProvider = normalizeSpeechProviderId(modelRef.provider);
		if (provider && modelProvider && provider !== modelProvider) throw new Error("TTS --provider must match the provider in --model.");
		return await runTtsConvert({
			text: String(opts.text),
			channel: opts.channel,
			provider,
			modelId: modelProvider ? modelRef.model : void 0,
			voiceId: opts.voice,
			output: opts.output,
			transport
		});
	}, formatEnvelopeForText);
	tts.command("voices").description("List voices for a TTS provider").option("--provider <id>", "Speech provider id").option("--json", "Output JSON", false).action(async (opts) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const voices = await runTtsVoices(opts.provider);
			emitJsonOrText(defaultRuntime, Boolean(opts.json), voices, providerSummaryText);
		});
	});
	registerTransportTtsCommand(tts.command("providers").description("List speech providers").option("--agent <id>", "Agent whose provider state should be inspected"), "local", (opts, transport) => runTtsProviders(transport, opts.agent));
	registerTransportTtsCommand(tts.command("personas").description("List TTS personas"), "local", (_, transport) => runTtsPersonas(transport));
	tts.command("status").description("Show TTS status").option("--gateway", "Force gateway execution", false).option("--json", "Output JSON", false).action(async (opts) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const transport = resolveTransport({
				gateway: Boolean(opts.gateway),
				supported: ["gateway"],
				defaultTransport: "gateway"
			});
			const result = await callGateway({
				method: "tts.status",
				timeoutMs: 3e4
			});
			emitJsonOrText(defaultRuntime, Boolean(opts.json), {
				transport,
				...result
			}, (value) => JSON.stringify(value, null, 2));
		});
	});
	for (const [commandName, capabilityId] of [["enable", "tts.enable"], ["disable", "tts.disable"]]) registerTransportTtsCommand(tts.command(commandName).description(`${commandName === "enable" ? "Enable" : "Disable"} TTS`), "gateway", (_, transport) => runTtsStateMutation({
		capability: capabilityId,
		transport
	}));
	registerTransportTtsCommand(tts.command("set-provider").description("Set the active TTS provider").requiredOption("--provider <id>", "Speech provider id"), "gateway", (opts, transport) => runTtsStateMutation({
		capability: "tts.set-provider",
		provider: String(opts.provider),
		transport
	}));
	registerTransportTtsCommand(tts.command("set-persona").description("Set the active TTS persona").option("--persona <id>", "TTS persona id").option("--off", "Disable the active TTS persona", false), "gateway", (opts, transport) => {
		if (!opts.off && !opts.persona) throw new Error("--persona is required unless --off is set");
		return runTtsStateMutation({
			capability: "tts.set-persona",
			persona: opts.off ? null : String(opts.persona),
			transport
		});
	});
}
//#endregion
//#region src/cli/capability-cli/video.ts
const GENERATED_VIDEO_DOWNLOAD_TIMEOUT_MS = 12e4;
function normalizeVideoResolution(raw) {
	const normalized = raw?.trim().toUpperCase();
	if (!normalized) return;
	if (normalized === "360P" || normalized === "480P" || normalized === "540P" || normalized === "720P" || normalized === "768P" || normalized === "1080P") return normalized;
	throw new Error("video resolution must be one of 360P, 480P, 540P, 720P, 768P, or 1080P");
}
async function fetchGeneratedVideoDownload(params) {
	const providerConfig = params.cfg.models?.providers?.[params.provider];
	const { allowPrivateNetwork, dispatcherPolicy } = resolveProviderHttpRequestConfig({
		baseUrl: params.url,
		defaultBaseUrl: params.url,
		request: sanitizeConfiguredModelProviderRequest(providerConfig?.request),
		provider: params.provider,
		capability: "video",
		transport: "http"
	});
	const result = await fetchWithTimeoutGuarded(params.url, { method: "GET" }, GENERATED_VIDEO_DOWNLOAD_TIMEOUT_MS, fetch, {
		...allowPrivateNetwork ? { ssrfPolicy: { allowPrivateNetwork: true } } : {},
		...dispatcherPolicy ? { dispatcherPolicy } : {},
		auditContext: `${params.provider}-generated-video-download`
	});
	try {
		await assertOkOrThrowHttpError(result.response, `${params.provider} generated video download failed`);
		assertProviderBinaryResponseContent(result.response, `${params.provider} generated video download`, "video");
		return result;
	} catch (error) {
		await result.release();
		throw error;
	}
}
async function runVideoGenerate(params) {
	requireProviderModelOverride(params.model);
	const cfg = await resolveLocalCapabilityRuntimeConfig({
		commandName: "infer video.generate",
		targetIds: getModelsCommandSecretTargetIds()
	});
	const result = await generateVideo({
		cfg,
		agentDir: resolveAgentDir(cfg, resolveDefaultAgentId(cfg)),
		prompt: params.prompt,
		modelOverride: params.model,
		size: params.size,
		aspectRatio: params.aspectRatio,
		resolution: params.resolution,
		durationSeconds: params.durationSeconds,
		audio: params.audio,
		watermark: params.watermark,
		timeoutMs: params.timeoutMs
	});
	const outputs = await Promise.all(result.videos.map(async (video, index) => {
		if (!video.buffer && !video.url) throw new Error(`Video asset at index ${index} has neither buffer nor url`);
		let videoBuffer = video.buffer;
		if (!videoBuffer && video.url) {
			const download = await fetchGeneratedVideoDownload({
				cfg,
				provider: result.provider,
				url: video.url
			});
			const response = download.response;
			try {
				if (params.output && response.body) {
					const ext = extensionForMime(normalizeMimeType(video.mimeType)) || path.extname(video.fileName ?? "") || path.extname(params.output);
					const resolvedOutput = path.resolve(params.output);
					const parsed = path.parse(resolvedOutput);
					const filePath = result.videos.length <= 1 ? path.join(parsed.dir, `${parsed.name}${ext}`) : path.join(parsed.dir, `${parsed.name}-${String(index + 1)}${ext}`);
					const size = await publishOutputFileAtomically({
						filePath,
						writeTemp: async (tempPath) => {
							await pipeline$1(Readable.fromWeb(response.body), createWriteStream(tempPath, { flags: "wx" }));
							const writtenSize = (await fs$1.stat(tempPath)).size;
							if (writtenSize === 0) throw new Error("Generated media output is empty.");
							return writtenSize;
						}
					});
					return {
						path: filePath,
						mimeType: video.mimeType,
						size
					};
				}
				videoBuffer = await readResponseWithLimit(response, resolveGeneratedMediaMaxBytes(cfg, "video"), { onOverflow: ({ maxBytes }) => /* @__PURE__ */ new Error(`${result.provider} generated video download exceeds ${maxBytes} bytes; pass --output to stream large videos to disk`) });
				if (videoBuffer.byteLength === 0) throw new Error("Generated media output is empty.");
			} finally {
				await download.release();
			}
		}
		return { ...await writeOutputAsset({
			buffer: videoBuffer,
			mimeType: video.mimeType,
			originalFilename: video.fileName,
			outputPath: params.output,
			outputIndex: index,
			outputCount: result.videos.length,
			subdir: "generated"
		}) };
	}));
	return {
		ok: true,
		capability: "video.generate",
		transport: "local",
		provider: result.provider,
		model: result.model,
		attempts: result.attempts,
		outputs
	};
}
async function runVideoDescribe(params) {
	const cfg = await resolveLocalCapabilityRuntimeConfig({
		commandName: "infer video.describe",
		targetIds: getModelsCommandSecretTargetIds()
	});
	const activeModel = requireProviderModelOverride(params.model);
	const result = await describeVideoFile({
		filePath: path.resolve(params.file),
		cfg,
		activeModel
	});
	if (!result.text) throw new Error(`No description returned for video: ${path.resolve(params.file)}`);
	return {
		ok: true,
		capability: "video.describe",
		transport: "local",
		provider: result.provider,
		model: result.model,
		attempts: [],
		outputs: [{
			path: path.resolve(params.file),
			text: result.text,
			kind: "video.description"
		}]
	};
}
function registerVideoCapabilityCommands(capability) {
	const video = capability.command("video").description("Video generation and description");
	video.command("generate").description("Generate video").requiredOption("--prompt <text>", "Prompt text").option("--model <provider/model>", "Model override").option("--size <size>", "Size hint like 1280x720").option("--aspect-ratio <ratio>", "Aspect ratio hint like 16:9").option("--resolution <value>", "Resolution hint: 360P, 480P, 540P, 720P, 768P, or 1080P").option("--duration <seconds>", "Target duration in seconds").option("--audio", "Enable generated audio when supported").option("--watermark", "Request provider watermark when supported").option("--timeout-ms <ms>", "Provider request timeout in milliseconds").option("--output <path>", "Output path").option("--json", "Output JSON", false).action(async (opts) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const result = await runVideoGenerate({
				prompt: String(opts.prompt),
				model: opts.model,
				output: opts.output,
				size: opts.size,
				aspectRatio: opts.aspectRatio,
				resolution: normalizeVideoResolution(opts.resolution),
				durationSeconds: parseOptionalFiniteNumber(opts.duration, "--duration"),
				audio: opts.audio === true ? true : void 0,
				watermark: opts.watermark === true ? true : void 0,
				timeoutMs: parseOptionalTimeoutMs(opts.timeoutMs)
			});
			emitJsonOrText(defaultRuntime, Boolean(opts.json), result, formatEnvelopeForText);
		});
	});
	video.command("describe").description("Describe one video file").requiredOption("--file <path>", "Video file").option("--model <provider/model>", "Model override").option("--json", "Output JSON", false).action(async (opts) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const result = await runVideoDescribe({
				file: String(opts.file),
				model: opts.model
			});
			emitJsonOrText(defaultRuntime, Boolean(opts.json), result, formatEnvelopeForText);
		});
	});
	video.command("providers").description("List video generation and description providers").option("--agent <id>", "Agent whose provider state should be inspected").option("--json", "Output JSON", false).action(async (opts) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const cfg = getRuntimeConfig();
			const agentId = resolveCapabilityProviderAgentId(cfg, opts.agent);
			const selectedGenerationProvider = resolveSelectedProviderFromModelRef(resolveAgentModelPrimaryValue(cfg.agents?.defaults?.mediaModels?.video));
			const result = {
				generation: listRuntimeVideoGenerationProviders({ config: cfg }).map((provider) => ({
					available: true,
					configured: selectedGenerationProvider === provider.id || providerHasGenericConfig({
						cfg,
						providerId: provider.id,
						agentId
					}),
					selected: selectedGenerationProvider === provider.id,
					id: provider.id,
					label: provider.label,
					defaultModel: provider.defaultModel,
					models: provider.models ?? [],
					capabilities: provider.capabilities
				})),
				description: [...buildMediaUnderstandingRegistry(void 0, cfg).values()].filter((provider) => provider.capabilities?.includes("video")).map((provider) => ({
					available: true,
					configured: providerHasGenericConfig({
						cfg,
						providerId: provider.id,
						agentId
					}),
					selected: false,
					id: provider.id,
					capabilities: provider.capabilities,
					defaultModels: provider.defaultModels
				}))
			};
			emitJsonOrText(defaultRuntime, Boolean(opts.json), result, (value) => JSON.stringify(value, null, 2));
		});
	});
}
//#endregion
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
//#region src/cli/capability-cli.ts
function registerCapabilityListAndInspect(capability) {
	capability.command("list").description("List canonical capability ids and supported transports").option("--json", "Output JSON", false).action(async (opts) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const result = CAPABILITY_METADATA.map((entry) => ({
				id: entry.id,
				transports: entry.transports,
				description: entry.description
			}));
			emitJsonOrText(defaultRuntime, Boolean(opts.json), result, providerSummaryText);
		});
	});
	capability.command("inspect").description("Inspect one canonical capability id").requiredOption("--name <capability>", "Capability id").option("--json", "Output JSON", false).action(async (opts) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const entry = findCapabilityMetadata(String(opts.name));
			if (!entry) throw new Error(`Unknown capability: ${String(opts.name)}`);
			emitJsonOrText(defaultRuntime, Boolean(opts.json), entry, (value) => JSON.stringify(value, null, 2));
		});
	});
}
function registerCapabilityCli(program) {
	removeCommandByName(program, "infer");
	removeCommandByName(program, "capability");
	const capability = program.command("infer").alias("capability").description("Run provider-backed inference commands through a stable CLI surface").addHelpText("after", () => `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/infer", "docs.openclaw.ai/cli/infer")}\n`);
	registerCapabilityListAndInspect(capability);
	registerModelCapabilityCommands(capability);
	registerImageCapabilityCommands(capability);
	registerAudioCapabilityCommands(capability);
	registerTtsCapabilityCommands(capability);
	registerVideoCapabilityCommands(capability);
	registerWebCapabilityCommands(capability);
	registerEmbeddingCapabilityCommands(capability);
}
//#endregion
export { CAPABILITY_METADATA, registerCapabilityCli };
