import { i as createLazyRuntimeNamedExport, r as createLazyRuntimeModule } from "./lazy-runtime-CgCh8H_K.js";
import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty, s as normalizeNullableString } from "./string-coerce-CIXf7egm.js";
import { v as uniqueStrings } from "./string-normalization-e_fvmxMf.js";
import { n as findNormalizedProviderValue } from "./provider-id-DMd-TDFp.js";
import { i as resolveAgentModelPrimaryValue, r as resolveAgentModelFallbackValues } from "./model-input-ekSMR50U.js";
import { b as resolveModelRefFromString, i as buildModelAliasIndex, l as inferUniqueProviderFromConfiguredModels } from "./model-selection-shared-BSy9FczT.js";
import { w as resolveDefaultModelForAgent } from "./codex-route-model-ref-0uJOp6W2.js";
import { i as logWarn } from "./logger-DKrZPnAI.js";
import { i as shouldLogVerbose, r as logVerbose } from "./globals-CAwGc4B6.js";
import { u as normalizeMediaFacts } from "./media-facts-CdKKNGmE.js";
import { r as classifyMediaReferenceSource } from "./media-reference-BeABx1cr.js";
import "./model-selection-Adc4uFq_.js";
import { r as mergeInboundPathRoots } from "./inbound-path-policy-DQ5Rksw7.js";
import { i as getDefaultMediaLocalRoots } from "./local-roots-Beya70q2.js";
import { n as normalizeMediaProviderId, t as normalizeMediaExecutionProviderId } from "./provider-id-DSbuCFIb.js";
import { t as resolveChannelInboundAttachmentRoots } from "./channel-inbound-roots-E49RyguK.js";
import { n as isMinimaxVlmProvider, t as isMinimaxVlmModel } from "./minimax-vlm-DW5Mieub.js";
import { t as providerSupportsCapability } from "./provider-supports-msSTK_XS.js";
import { c as buildMediaUnderstandingRegistry, l as getMediaUnderstandingProvider } from "./defaults.constants-BTkiooBF.js";
import { i as matchesMediaEntryCapability } from "./runtime-media-secret-owner-xJvrDBVt.js";
import { a as resolveModelEntries, s as resolveScopeDecision } from "./resolve-II6CtamH.js";
import { n as resolveOpenAiAudioAuthModelApi } from "./openai-audio-api-BEkNYRPi.js";
import { a as normalizeAttachments } from "./attachments.normalize-Bo4XFKe5.js";
import { a as runCliEntry, d as selectAttachments, l as MediaAttachmentCache, o as runProviderEntry, r as formatDecisionSummary, t as buildModelDecision, u as isMediaUnderstandingSkipError } from "./runner.entries-DYdF7KsG.js";
import { r as inspectLocalAudioSelection, t as clearLocalAudioInspectionCacheForTests } from "./local-audio-sn4mvYpW.js";
import path from "node:path";
//#region src/media-understanding/runner.attachments.ts
/** Normalizes message context media fields for the media-understanding runner. */
function normalizeMediaAttachments(ctx) {
	const attachments = normalizeAttachments(ctx);
	return ctx.SkipStickerMediaUnderstanding ? attachments.filter((attachment) => attachment.index !== 0) : attachments;
}
/** Creates the lazy attachment cache used by image, audio, video, and document providers. */
function createMediaAttachmentCache(attachments, options) {
	return new MediaAttachmentCache(attachments, options);
}
//#endregion
//#region src/media-understanding/runner.ts
const loadHasAvailableAuthForProvider = createLazyRuntimeNamedExport(() => import("./model-auth-DotpFjV2.js"), "hasAvailableAuthForProvider");
const loadPreparedModelCatalogApi = createLazyRuntimeModule(async () => ({
	...await import("./model-catalog-CHKoyY52.js"),
	...await import("./prepared-model-catalog-DcxNkklg.js")
}));
function resolveLiteralProviderApiKey(cfg, providerId) {
	return normalizeNullableString(findNormalizedProviderValue(cfg?.models?.providers, providerId)?.apiKey);
}
async function hasProviderAuthAvailable(params) {
	if (resolveLiteralProviderApiKey(params.cfg, params.provider)) return true;
	return await (await loadHasAvailableAuthForProvider())({
		...params,
		modelApi: resolveOpenAiAudioAuthModelApi({
			capability: params.capability,
			providerId: params.provider
		})
	});
}
function resolveConfiguredKeyProviderOrder(params) {
	return uniqueStrings([...uniqueStrings(Object.keys(params.cfg.models?.providers ?? {}).map((providerId) => normalizeMediaExecutionProviderId(providerId)).filter(Boolean)).filter((providerId) => providerSupportsCapability(params.providerRegistry.get(normalizeMediaProviderId(providerId)), params.capability)), ...params.fallbackProviders]);
}
function resolveConfiguredImageModelId(params) {
	if (isMinimaxVlmProvider(params.providerId)) return;
	return resolveConfiguredImageModel(params)?.id?.trim() || void 0;
}
function resolveConfiguredImageModel(params) {
	return findNormalizedProviderValue(params.cfg.models?.providers, params.providerId)?.models?.find((entry) => {
		const id = entry?.id?.trim();
		return Boolean(id) && entry?.input?.includes("image");
	});
}
function resolveCatalogImageModelId(params) {
	const matches = params.catalog.filter((entry) => normalizeMediaProviderId(entry.provider) === normalizeMediaProviderId(params.providerId) && params.modelSupportsVision(entry));
	if (matches.length === 0) return;
	return normalizeOptionalString((matches.find((entry) => normalizeLowercaseStringOrEmpty(entry.id) === "auto") ?? matches[0])?.id);
}
function resolveDefaultMediaModelFromRegistry(params) {
	return normalizeOptionalString(params.providerRegistry.get(normalizeMediaProviderId(params.providerId))?.defaultModels?.[params.capability]);
}
function resolveAutoMediaKeyProvidersFromRegistry(params) {
	return [...params.providerRegistry.values()].filter((provider) => provider.capabilities?.includes(params.capability) ?? providerSupportsCapability(provider, params.capability)).map((provider) => {
		const priority = provider.autoPriority?.[params.capability];
		return typeof priority === "number" && Number.isFinite(priority) ? {
			provider,
			priority
		} : null;
	}).filter((entry) => entry !== null).toSorted((left, right) => {
		if (left.priority !== right.priority) return left.priority - right.priority;
		return left.provider.id.localeCompare(right.provider.id);
	}).map((entry) => normalizeMediaProviderId(entry.provider.id)).filter(Boolean);
}
async function explicitImageModelVisionStatus(params) {
	if (isMinimaxVlmProvider(params.providerId) && !isMinimaxVlmModel(params.providerId, params.model)) return "unsupported";
	const configured = resolveConfiguredImageModel(params);
	if (configured?.id?.trim() === params.model && configured.input?.includes("image")) return "supported";
	const { findModelInCatalog, loadPreparedModelCatalog, modelSupportsVision } = await loadPreparedModelCatalogApi();
	const entry = findModelInCatalog(await loadPreparedModelCatalog({
		config: params.cfg,
		...params.agentId ? { agentId: params.agentId } : {},
		...params.agentDir ? { agentDir: params.agentDir } : {},
		...params.workspaceDir ? { workspaceDir: params.workspaceDir } : {}
	}), params.providerId, params.model);
	if (!entry) return "unknown";
	return modelSupportsVision(entry) ? "supported" : "unsupported";
}
async function resolveAutoImageModelId(params) {
	const explicit = normalizeOptionalString(params.explicitModel);
	if (explicit) {
		if (await explicitImageModelVisionStatus({
			cfg: params.cfg,
			agentId: params.agentId,
			providerId: params.providerId,
			model: explicit,
			agentDir: params.agentDir,
			workspaceDir: params.workspaceDir
		}) !== "unsupported") return explicit;
	}
	if (isMinimaxVlmProvider(params.providerId)) return "MiniMax-VL-01";
	const configuredModel = resolveConfiguredImageModelId(params);
	if (configuredModel) return configuredModel;
	const defaultModel = resolveDefaultMediaModelFromRegistry({
		providerId: params.providerId,
		capability: "image",
		providerRegistry: params.providerRegistry
	});
	if (defaultModel) return defaultModel;
	const { resolveDefaultMediaModel } = await import("./defaults-CXzRVIJP.js");
	const bundledDefaultModel = resolveDefaultMediaModel({
		cfg: params.cfg,
		providerId: params.providerId,
		capability: "image",
		workspaceDir: params.workspaceDir
	});
	if (bundledDefaultModel) return bundledDefaultModel;
	const { loadPreparedModelCatalog, modelSupportsVision } = await loadPreparedModelCatalogApi();
	const catalog = await loadPreparedModelCatalog({
		config: params.cfg,
		...params.agentId ? { agentId: params.agentId } : {},
		...params.agentDir ? { agentDir: params.agentDir } : {},
		...params.workspaceDir ? { workspaceDir: params.workspaceDir } : {}
	});
	return resolveCatalogImageModelId({
		providerId: params.providerId,
		catalog,
		modelSupportsVision
	});
}
function buildProviderRegistry(overrides, cfg) {
	return buildMediaUnderstandingRegistry(overrides, cfg);
}
function resolveMediaAttachmentLocalRoots(params) {
	const workspaceDirs = normalizeMediaFacts(params.ctx.media).flatMap((fact) => fact.workspaceDir ? [path.resolve(fact.workspaceDir)] : []);
	return mergeInboundPathRoots(getDefaultMediaLocalRoots(), workspaceDirs, params.workspaceDir ? [path.resolve(params.workspaceDir)] : void 0, resolveChannelInboundAttachmentRoots(params));
}
function clearMediaUnderstandingBinaryCacheForTests() {
	clearLocalAudioInspectionCacheForTests();
}
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.mediaUnderstandingRunnerTestApi")] = { clearMediaUnderstandingBinaryCacheForTests };
async function resolveKeyEntry(params) {
	const { cfg, agentId, agentDir, workspaceDir, providerRegistry, capability } = params;
	const checkProvider = async (providerId, model) => {
		const provider = getMediaUnderstandingProvider(providerId, providerRegistry);
		if (!provider) return null;
		if (capability === "audio" && !provider.transcribeAudio) return null;
		if (capability === "image" && !provider.describeImage) return null;
		if (capability === "video" && !provider.describeVideo) return null;
		if (!await hasProviderAuthAvailable({
			capability,
			provider: providerId,
			cfg,
			agentDir,
			workspaceDir
		})) return null;
		const resolvedModel = capability === "image" ? await resolveAutoImageModelId({
			cfg,
			agentId,
			providerId,
			providerRegistry,
			explicitModel: model,
			agentDir,
			workspaceDir
		}) : capability === "audio" ? resolveDefaultMediaModelFromRegistry({
			providerId,
			capability: "audio",
			providerRegistry
		}) : model ?? resolveDefaultMediaModelFromRegistry({
			providerId,
			capability: "video",
			providerRegistry
		});
		if (capability === "image" && !resolvedModel) return null;
		return {
			type: "provider",
			provider: providerId,
			model: resolvedModel
		};
	};
	const activeProvider = params.activeModel?.provider?.trim();
	if (activeProvider) {
		const activeEntry = await checkProvider(activeProvider, params.activeModel?.model);
		if (activeEntry) return activeEntry;
	}
	for (const providerId of resolveConfiguredKeyProviderOrder({
		cfg,
		providerRegistry,
		capability,
		fallbackProviders: resolveAutoMediaKeyProvidersFromRegistry({
			capability,
			providerRegistry
		})
	})) {
		const entry = await checkProvider(providerId, void 0);
		if (entry) return entry;
	}
	return null;
}
function resolveImageModelFromAgentDefaults(params) {
	const refs = [];
	const primary = resolveAgentModelPrimaryValue(params.cfg.agents?.defaults?.imageModel);
	if (primary?.trim()) refs.push(primary.trim());
	for (const fb of resolveAgentModelFallbackValues(params.cfg.agents?.defaults?.imageModel)) if (fb?.trim()) refs.push(fb.trim());
	if (refs.length === 0) return [];
	const defaultProvider = resolveDefaultModelForAgent({
		cfg: params.cfg,
		agentId: params.agentId
	}).provider;
	const entries = [];
	for (const ref of refs) {
		const effectiveDefaultProvider = ref.includes("/") ? defaultProvider : inferUniqueProviderFromConfiguredModels({
			cfg: params.cfg,
			model: ref
		}) ?? defaultProvider;
		const aliasIndex = buildModelAliasIndex({
			cfg: params.cfg,
			defaultProvider: effectiveDefaultProvider
		});
		const resolved = resolveModelRefFromString({
			cfg: params.cfg,
			raw: ref,
			defaultProvider: effectiveDefaultProvider,
			aliasIndex
		});
		if (!resolved) continue;
		entries.push({
			type: "provider",
			provider: resolved.ref.provider,
			model: resolved.ref.model
		});
	}
	return entries;
}
function hasExplicitImageUnderstandingConfig(params) {
	return (params.cfg.tools?.media?.models ?? []).some((entry) => matchesMediaEntryCapability({
		entry,
		source: "shared",
		capability: "image",
		providerRegistry: params.providerRegistry
	}));
}
function isMinimaxNativeVisionModel(params) {
	return isMinimaxVlmProvider(params.provider) && /^MiniMax-M3(\b|[-.])/i.test(params.model?.trim() ?? "");
}
async function activeModelSupportsNativeVision(params) {
	const activeProvider = params.activeModel?.provider?.trim();
	if (!activeProvider) return false;
	if (isMinimaxVlmProvider(activeProvider) && !isMinimaxNativeVisionModel({
		provider: activeProvider,
		model: params.activeModel?.model
	})) return false;
	const { findModelInCatalog, loadPreparedModelCatalog, modelSupportsVision } = await loadPreparedModelCatalogApi();
	return modelSupportsVision(findModelInCatalog(await loadPreparedModelCatalog({
		config: params.cfg,
		...params.agentId ? { agentId: params.agentId } : {},
		...params.agentDir ? { agentDir: params.agentDir } : {},
		...params.workspaceDir ? { workspaceDir: params.workspaceDir } : {}
	}), activeProvider, params.activeModel?.model ?? ""));
}
async function resolveAutoEntries(params) {
	if (params.capability === "image" && !params.nativeVisionActive) {
		const imageModelEntries = resolveImageModelFromAgentDefaults({
			cfg: params.cfg,
			agentId: params.agentId
		});
		if (imageModelEntries.length > 0) return imageModelEntries;
	}
	const activeEntry = await resolveActiveModelEntry(params);
	if (activeEntry) return [activeEntry];
	if (params.capability === "audio") {
		const keyEntry = await resolveKeyEntry(params);
		if (keyEntry) return [keyEntry];
		const localAudio = await inspectLocalAudioSelection();
		if (localAudio.entries.length > 0) return localAudio.entries;
	}
	const keys = await resolveKeyEntry(params);
	if (keys) return [keys];
	return [];
}
async function resolveAutoImageModel(params) {
	const providerRegistry = buildProviderRegistry(void 0, params.cfg);
	const toActive = (entry) => {
		if (!entry || entry.type === "cli") return null;
		const provider = entry.provider;
		const model = entry.model?.trim();
		if (!provider || !model) return null;
		return {
			provider,
			model
		};
	};
	const configuredImageModel = resolveImageModelFromAgentDefaults({
		cfg: params.cfg,
		agentId: params.agentId
	}).map((entry) => toActive(entry)).find((entry) => entry !== null);
	if (configuredImageModel) return configuredImageModel;
	const resolvedActive = toActive(await resolveActiveModelEntry({
		cfg: params.cfg,
		agentId: params.agentId,
		agentDir: params.agentDir,
		workspaceDir: params.workspaceDir,
		providerRegistry,
		capability: "image",
		activeModel: params.activeModel
	}));
	if (resolvedActive) return resolvedActive;
	return toActive(await resolveKeyEntry({
		cfg: params.cfg,
		agentId: params.agentId,
		agentDir: params.agentDir,
		workspaceDir: params.workspaceDir,
		providerRegistry,
		capability: "image",
		activeModel: params.activeModel
	}));
}
async function resolveActiveModelEntry(params) {
	const activeProviderRaw = params.activeModel?.provider?.trim();
	if (!activeProviderRaw) return null;
	const providerId = normalizeMediaExecutionProviderId(activeProviderRaw);
	if (!providerId) return null;
	const provider = getMediaUnderstandingProvider(providerId, params.providerRegistry);
	if (!provider) return null;
	if (params.capability === "audio" && !provider.transcribeAudio) return null;
	if (params.capability === "image" && !provider.describeImage) return null;
	if (params.capability === "video" && !provider.describeVideo) return null;
	if (!await hasProviderAuthAvailable({
		capability: params.capability,
		provider: providerId,
		cfg: params.cfg,
		agentDir: params.agentDir,
		workspaceDir: params.workspaceDir
	})) return null;
	let model;
	if (params.capability === "image") model = await resolveAutoImageModelId({
		cfg: params.cfg,
		agentId: params.agentId,
		providerId,
		providerRegistry: params.providerRegistry,
		explicitModel: params.activeModel?.model,
		agentDir: params.agentDir,
		workspaceDir: params.workspaceDir
	});
	else if (params.capability === "audio") model = resolveDefaultMediaModelFromRegistry({
		providerId,
		capability: "audio",
		providerRegistry: params.providerRegistry
	});
	else model = params.activeModel?.model ?? resolveDefaultMediaModelFromRegistry({
		providerId,
		capability: "video",
		providerRegistry: params.providerRegistry
	});
	if (params.capability === "image" && !model) return null;
	return {
		type: "provider",
		provider: providerId,
		model
	};
}
async function runAttachmentEntries(params) {
	const { entries, capability } = params;
	const attachmentIndex = params.attachment.index;
	const attempts = [];
	for (const candidate of entries) {
		const { entry } = candidate;
		const entryType = entry.type ?? (entry.command ? "cli" : "provider");
		try {
			const result = entryType === "cli" ? await runCliEntry({
				capability,
				entry,
				cfg: params.cfg,
				ctx: params.ctx,
				attachment: params.attachment,
				cache: params.cache,
				config: params.config
			}) : await runProviderEntry({
				capability,
				entry,
				cfg: params.cfg,
				ctx: params.ctx,
				attachmentIndex,
				cache: params.cache,
				agentId: params.agentId,
				agentDir: params.agentDir,
				workspaceDir: params.workspaceDir,
				providerRegistry: params.providerRegistry,
				config: params.config,
				secretOwnerId: candidate.secretOwnerId
			});
			if (result?.text) {
				const decision = buildModelDecision({
					entry,
					entryType,
					outcome: "success"
				});
				if (result.provider) decision.provider = result.provider;
				if (result.model) decision.model = result.model;
				if (result.requestedBackend) decision.requestedBackend = result.requestedBackend;
				if (result.observedBackend) decision.observedBackend = result.observedBackend;
				attempts.push(decision);
				return {
					output: result,
					attempts
				};
			}
			attempts.push(buildModelDecision({
				entry,
				entryType,
				outcome: "skipped",
				reason: "empty output"
			}));
		} catch (err) {
			if (isMediaUnderstandingSkipError(err)) {
				attempts.push(buildModelDecision({
					entry,
					entryType,
					outcome: "skipped",
					reason: `${err.reason}: ${err.message}`
				}));
				if (shouldLogVerbose()) logVerbose(`Skipping ${capability} model due to ${err.reason}: ${err.message}`);
				continue;
			}
			attempts.push(buildModelDecision({
				entry,
				entryType,
				outcome: "failed",
				reason: String(err)
			}));
			if (shouldLogVerbose()) logVerbose(`${capability} understanding failed: ${String(err)}`);
		}
	}
	return {
		output: null,
		attempts
	};
}
function hasFailedMediaAttempt(attachments) {
	return attachments.some((attachment) => attachment.attempts.some((attempt) => attempt.outcome === "failed"));
}
function createAttachmentDispositions(indexes, disposition) {
	return Object.fromEntries(indexes.map((index) => [index, disposition]));
}
async function runCapability(params) {
	const { capability, cfg, ctx } = params;
	const config = params.config ?? cfg.tools?.media?.[capability] ?? {};
	const selection = selectAttachments({
		capability,
		attachments: params.media,
		policy: config.attachments
	});
	const selectedAttachmentIndexes = selection.selected.map((attachment) => attachment.index);
	const activeProvider = params.activeModel?.provider?.trim();
	let nativeVisionProbe;
	const resolveNativeVisionFlag = () => {
		nativeVisionProbe ??= activeModelSupportsNativeVision({
			cfg,
			agentId: params.agentId,
			activeModel: params.activeModel,
			agentDir: params.agentDir,
			workspaceDir: params.workspaceDir
		}).catch((err) => {
			if (shouldLogVerbose()) logVerbose(`native vision support probe failed: ${String(err)}`);
		});
		return nativeVisionProbe;
	};
	const buildDispositions = (selectedDisposition, droppedDisposition = selectedDisposition) => ({
		...createAttachmentDispositions(selectedAttachmentIndexes, selectedDisposition),
		...createAttachmentDispositions(selection.droppedAttachmentIndexes, droppedDisposition)
	});
	const rendersMarker = (dispositions) => Object.values(dispositions).some((d) => d.kind !== "handled" && d.kind !== "handed-to-native-vision");
	const buildDecision = async (outcome, attachments, attachmentDispositions) => {
		const nativeVisionActive = capability === "image" && (nativeVisionProbe !== void 0 || rendersMarker(attachmentDispositions)) ? await resolveNativeVisionFlag() : void 0;
		return {
			capability,
			outcome,
			attachments,
			attachmentDispositions,
			...nativeVisionActive !== void 0 ? { nativeVisionActive } : {}
		};
	};
	if (config?.enabled === false) return {
		outputs: [],
		decision: await buildDecision("disabled", [], buildDispositions({ kind: "capability-disabled" }))
	};
	if (selection.selected.length === 0) return {
		outputs: [],
		decision: await buildDecision("no-attachment", [], {})
	};
	if (resolveScopeDecision({
		scope: config?.scope,
		ctx
	}) === "deny") {
		if (shouldLogVerbose()) logVerbose(`${capability} understanding disabled by scope policy.`);
		return {
			outputs: [],
			decision: await buildDecision("scope-deny", selection.selected.map((item) => ({
				attachmentIndex: item.index,
				attempts: []
			})), buildDispositions({ kind: "scope-denied" }))
		};
	}
	if (capability === "image" && activeProvider && !hasExplicitImageUnderstandingConfig({
		cfg,
		providerRegistry: params.providerRegistry
	}) && await resolveNativeVisionFlag() === true) {
		if (shouldLogVerbose()) logVerbose("Skipping image understanding: primary model supports vision natively");
		const model = params.activeModel?.model?.trim();
		const reason = "primary model supports vision natively";
		const nativeDeliverable = (item) => Boolean(item.path) || Boolean(item.url) && classifyMediaReferenceSource(item.url ?? "").isMediaStoreUrl;
		return {
			outputs: [],
			decision: await buildDecision("skipped", selection.selected.map((item) => {
				if (!nativeDeliverable(item)) return {
					attachmentIndex: item.index,
					attempts: []
				};
				const attempt = {
					type: "provider",
					provider: activeProvider,
					model: model || void 0,
					outcome: "skipped",
					reason
				};
				return {
					attachmentIndex: item.index,
					attempts: [attempt],
					chosen: attempt
				};
			}), {
				...buildDispositions({ kind: "handed-to-native-vision" }),
				...createAttachmentDispositions(selection.selected.filter((item) => !nativeDeliverable(item)).map((item) => item.index), {
					kind: "failed",
					reason: "remote-url image is not natively deliverable"
				})
			})
		};
	}
	let resolvedEntries = resolveModelEntries({
		cfg,
		capability,
		config,
		providerRegistry: params.providerRegistry
	});
	if (resolvedEntries.length === 0) resolvedEntries = (await resolveAutoEntries({
		cfg,
		agentId: params.agentId,
		agentDir: params.agentDir,
		workspaceDir: params.workspaceDir,
		providerRegistry: params.providerRegistry,
		capability,
		activeModel: params.activeModel,
		nativeVisionActive: capability === "image" && await resolveNativeVisionFlag() === true
	})).map((entry) => ({ entry }));
	if (resolvedEntries.length === 0) return {
		outputs: [],
		decision: await buildDecision("skipped", selection.selected.map((item) => ({
			attachmentIndex: item.index,
			attempts: []
		})), buildDispositions({ kind: "no-model" }, { kind: "not-selected" }))
	};
	const outputs = [];
	const attachmentDecisions = [];
	const attachmentDispositions = buildDispositions({ kind: "failed" }, { kind: "not-selected" });
	for (const attachment of selection.selected) {
		const { output, attempts } = await runAttachmentEntries({
			capability,
			cfg,
			ctx,
			attachment,
			agentId: params.agentId,
			agentDir: params.agentDir,
			workspaceDir: params.workspaceDir,
			providerRegistry: params.providerRegistry,
			cache: params.attachments,
			entries: resolvedEntries,
			config
		});
		if (output) outputs.push(output);
		attachmentDispositions[attachment.index] = output ? { kind: "handled" } : { kind: "failed" };
		attachmentDecisions.push({
			attachmentIndex: attachment.index,
			attempts,
			chosen: attempts.find((attempt) => attempt.outcome === "success")
		});
	}
	const decision = await buildDecision(outputs.length > 0 ? "success" : hasFailedMediaAttempt(attachmentDecisions) ? "failed" : "skipped", attachmentDecisions, attachmentDispositions);
	if (decision.outcome === "failed") logWarn(`media-understanding: ${formatDecisionSummary(decision)}`);
	else if (shouldLogVerbose()) logVerbose(`Media understanding ${formatDecisionSummary(decision)}`);
	return {
		outputs,
		decision
	};
}
//#endregion
export { createMediaAttachmentCache as a, runCapability as i, resolveAutoImageModel as n, normalizeMediaAttachments as o, resolveMediaAttachmentLocalRoots as r, buildProviderRegistry as t };
