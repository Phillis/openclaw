import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { C as resolveSessionAuthProfileOverrideSource, h as resolveSessionAgentId } from "./agent-scope-D9GLFAyB.js";
import { d as resolveAgentWorkspaceDir } from "./agent-scope-config-CsnnOL14.js";
import { a as resolveSessionFilePathOptions, i as resolveSessionFilePathCore } from "./paths-CfFmgJmW.js";
import { a as listOpenAIAuthProfileProvidersForAgentRuntime, i as isOpenAIProvider } from "./openai-routing-BC0q3X-J.js";
import { a as resolveAgentHarnessOwnerPluginId } from "./registry-BG-SOVGv.js";
import { t as applyPreparedRuntimeAuthToModel } from "./provider-request-config-BR35Bqmj.js";
import { a as unwrapSecretSentinelsForProviderEgress, t as protectPreparedProviderRuntimeAuth } from "./provider-secret-egress-NmAMmdEt.js";
import { Pt as listSessionEntriesCore, Qt as loadSessionEntry } from "./session-accessor-CIiPoGwM.js";
import { n as parseSqliteSessionFileMarker } from "./legacy-sqlite-marker-COPKCuIN.js";
import { x as scanSessionTranscriptTree } from "./session-transcript-index-B7GQuTh4.js";
import { y as loadTranscriptEvents } from "./session-accessor.sqlite-transcript-store-Cgnm_AHf.js";
import { b as prepareProviderRuntimeAuth } from "./provider-runtime-Bq7-AfnG.js";
import { a as ensureAuthProfileStoreWithoutExternalProfiles, r as ensureAuthProfileStore } from "./store-DZy8rsrA.js";
import { st as getModelRegistryRuntime } from "./sessions-BHNzcBA2.js";
import { a as migrateSessionEntries, t as buildSessionContext } from "./session-manager-codec-CBbtVKV-.js";
import { c as stripToolResultDetails } from "./ai-transport-runtime-host-B7O6W1a9.js";
import "./session-manager-2mjIFFdj.js";
import { r as resolveImageSanitizationLimits } from "./image-sanitization-CxLP0YN-.js";
import { n as sanitizeImageBlocks } from "./tool-images-DoRcRuZO.js";
import { o as requireApiKey } from "./model-auth-runtime-shared-C48YoQY0.js";
import { i as isCliRuntimeAliasForProvider, s as resolveCliRuntimeExecutionProvider } from "./model-runtime-aliases-BoIMzL8U.js";
import { a as loadPreparedModelRuntimeSnapshot, p as preparedModelRuntimeConfigsMatch } from "./prepared-model-runtime-BK-D17bD.js";
import { l as resolveAgentHarnessPreparedAuthSupport, u as resolveAgentHarnessPreparedRouteSupport } from "./thinking-runtime-_QT_qncS.js";
import { i as resolveSessionRuntimeOverrideForProvider } from "./session-runtime-compat-DNLW-mvy.js";
import { r as applySecretRefHeaderSentinels } from "./model-auth-BgXCiN_L.js";
import { t as ensureSelectedAgentHarnessPlugin } from "./runtime-plugin-CJ0GKn_5.js";
import { s as prepareSystemAgentRunAdmission } from "./admitted-run-context-Dl2hrF3z.js";
import { n as resolveAgentTimeoutMs } from "./timeout-CRSytcvC.js";
import { t as diagnosticLogger } from "./diagnostic-runtime-wcLaeG_l.js";
import "./diagnostic-CM9bZ9kv.js";
import { o as getActiveEmbeddedRunSnapshot } from "./runs-CQbSP9aq.js";
import "./sessions-Bh837xaa.js";
import { a as resolveSessionModelRef } from "./placement-session-runtime-D3R4yOqT.js";
import { n as resolveSandboxContext } from "./context-BwBSG27A.js";
import { r as prepareAgentRuntimeAuth } from "./prepare-auth-3_FyKq21.js";
import { a as isModelSelectionLocked } from "./model-overrides-D4SC_nUZ.js";
import { t as resolvePreferredSessionKeyForSessionIdMatches } from "./session-id-resolution-9Zisrbl5.js";
import { P as streamWithPayloadPatch } from "./provider-stream-shared-Ch9sLjFi.js";
import { a as resolveEmbeddedAgentStreamFn } from "./attempt.model-diagnostic-events-D8rbCjf-.js";
import { t as registerProviderStreamForModel } from "./provider-stream-oP65p1LQ.js";
import { t as EmbeddedBlockChunker } from "./embedded-agent-block-chunker-BDFESe1L.js";
import { i as resolveModelWithRegistry, r as resolveModelAsync } from "./model-D2zXW9cg.js";
import { t as materializePreparedRuntimeModel } from "./materialize-model-DBvajuYm.js";
import { t as createAgentHarnessHostCapabilities } from "./host-capability-CWXrFjtp.js";
import { a as resolvePluginHarnessPolicyToolsAllow, c as selectAgentHarness, i as resolveAvailableAgentHarnessPolicy, l as selectAgentHarnessForPreparedModelProviders } from "./selection-C0s8kcIb.js";
import { n as resolveSessionAuthProfileOverride } from "./session-override-Bt9HxG2P.js";
import { n as resolvePreparedRuntimeModelAuth, r as scopeAuthProfileStoreToPreparedPlan, t as resolvePreparedRuntimeAuthAttempts } from "./resolve-auth-DXKM3KEe.js";
import { n as resolveSessionPlacementSandbox } from "./session-placement-admission-CG0soa0B.js";
import { t as resolveExternalCliAuthOverlayScopeFromSelection } from "./external-cli-auth-selection-BVTTAIh4.js";
import { t as executePreparedCliRun } from "./execute.runtime-Bw0XmNgP.js";
import { t as prepareCliRunContext } from "./prepare.runtime-DGNQOIk-.js";
import { randomUUID } from "node:crypto";
//#region src/agents/btw-transcript.ts
/**
* Reads prior session transcript context for `/btw` side-question handoffs.
*/
/** Resolves the persisted transcript file for a BTW session handoff. */
function resolveBtwSessionTranscriptPath(params) {
	try {
		const agentId = params.sessionKey?.split(":")[1];
		const pathOpts = resolveSessionFilePathOptions({
			agentId,
			storePath: params.storePath
		});
		return resolveSessionFilePathCore(params.sessionId, params.sessionEntry, pathOpts);
	} catch (error) {
		diagnosticLogger.debug(`resolveSessionTranscriptPath failed: sessionId=${params.sessionId} err=${String(error)}`);
		return;
	}
}
function readSessionEntryId(entry) {
	const id = entry.id;
	return typeof id === "string" && id.trim().length > 0 ? id : void 0;
}
function buildSessionBranchEntries(tree, leafId) {
	if (leafId === null) return [];
	if (!leafId) return;
	const branch = [];
	const seen = /* @__PURE__ */ new Set();
	let currentId = leafId;
	while (currentId) {
		if (seen.has(currentId)) return;
		seen.add(currentId);
		const node = tree.byId.get(currentId);
		if (!node) return;
		if (node.entry.type !== "leaf") branch.push(node.entry.parentId === node.parentId ? node.entry : {
			...node.entry,
			parentId: node.parentId
		});
		currentId = node.parentId ?? void 0;
	}
	return branch.toReversed();
}
function isTrailingUserMessage(entry) {
	return entry?.type === "message" && entry.message?.role === "user";
}
/**
* Reads prior messages for BTW continuation.
*
* When a transcript has fork links, this returns the selected snapshot branch
* instead of the full file so a resumed agent does not inherit sibling-branch
* messages.
*/
async function readBtwTranscriptMessages(params) {
	try {
		const marker = parseSqliteSessionFileMarker(params.sessionFile);
		const completeTarget = Boolean(params.agentId?.trim() && params.sessionId.trim() && params.sessionKey?.trim() && params.storePath?.trim());
		const agentId = completeTarget ? params.agentId : params.agentId ?? marker?.agentId;
		const sessionId = completeTarget ? params.sessionId : marker?.sessionId ?? params.sessionId;
		const storePath = completeTarget ? params.storePath : params.storePath ?? marker?.storePath;
		const markerMatches = marker && !completeTarget ? listSessionEntriesCore({
			agentId: marker.agentId,
			storePath: marker.storePath
		}).filter(({ entry }) => entry.sessionId === marker.sessionId) : [];
		const suppliedEntry = marker && params.sessionKey && !completeTarget ? loadSessionEntry({
			agentId: marker.agentId,
			sessionKey: params.sessionKey,
			storePath: marker.storePath
		}) : void 0;
		if (marker && !completeTarget && params.sessionKey && (suppliedEntry && suppliedEntry.sessionId !== marker.sessionId || !suppliedEntry && markerMatches.length > 0)) return [];
		const sessionKey = completeTarget ? params.sessionKey : marker ? suppliedEntry?.sessionId === marker.sessionId ? params.sessionKey : resolvePreferredSessionKeyForSessionIdMatches(markerMatches.map(({ sessionKey: mappedKey, entry }) => [mappedKey, entry]), marker.sessionId) ?? (markerMatches.length === 0 ? params.sessionKey : void 0) : params.sessionKey;
		if (!sessionKey || !storePath) return [];
		const entries = await loadTranscriptEvents({
			agentId,
			sessionId,
			sessionKey,
			storePath
		});
		migrateSessionEntries(entries);
		const sessionEntries = entries.filter((entry) => entry.type !== "session");
		const tree = scanSessionTranscriptTree(sessionEntries);
		if (!tree.hasLeafUpdate) return buildSessionContext(sessionEntries).messages;
		const hasSnapshotLeaf = params.snapshotLeafId !== void 0;
		let branchEntries = hasSnapshotLeaf ? buildSessionBranchEntries(tree, params.snapshotLeafId) : void 0;
		if (hasSnapshotLeaf && branchEntries === void 0) diagnosticLogger.debug(`btw snapshot leaf unavailable: sessionId=${sessionId} leaf=${params.snapshotLeafId}`);
		branchEntries ??= buildSessionBranchEntries(tree, tree.leafId);
		if (!hasSnapshotLeaf && isTrailingUserMessage(branchEntries?.at(-1))) {
			const trailingId = readSessionEntryId(branchEntries.at(-1));
			const parentId = trailingId ? tree.byId.get(trailingId)?.parentId : null;
			branchEntries = parentId ? buildSessionBranchEntries(tree, parentId) ?? [] : [];
		}
		const sessionContext = buildSessionContext(branchEntries ?? sessionEntries);
		return Array.isArray(sessionContext.messages) ? sessionContext.messages : [];
	} catch {
		return [];
	}
}
//#endregion
//#region src/agents/btw.ts
/**
* Runs `/btw` side questions against the active conversation without resuming
* or continuing the main task.
*/
function collectTextContent(content) {
	return content.filter((part) => part.type === "text").map((part) => part.text).join("");
}
function collectThinkingContent(content) {
	return content.filter((part) => part.type === "thinking").map((part) => part.thinking).join("");
}
function buildBtwSystemPrompt() {
	return [
		"You are answering an ephemeral /btw side question about the current conversation.",
		"Use the conversation only as background context.",
		"Answer only the side question in the last user message.",
		"Do not continue, resume, or complete any unfinished task from the conversation.",
		"Do not emit tool calls, pseudo-tool calls, shell commands, file writes, patches, or code unless the side question explicitly asks for them.",
		"Do not say you will continue the main task after answering.",
		"If the question can be answered briefly, answer briefly."
	].join("\n");
}
function resolveReturnedAuthProfileSource(sessionEntry, authProfileId) {
	if (!authProfileId?.trim()) return;
	if (sessionEntry?.authProfileOverride?.trim() !== authProfileId) return "auto";
	return resolveSessionAuthProfileOverrideSource(sessionEntry);
}
function resolveBtwAuthProfileStore(params) {
	if (isOpenAIProvider(params.provider)) return {
		store: ensureAuthProfileStore(params.agentDir, {
			externalCliProviderIds: ["openai"],
			allowKeychainPrompt: false
		}),
		ignoreAutoPreferredProfile: false
	};
	const userPinnedAuthProfileId = params.authProfileIdSource === "user" ? params.authProfileId : void 0;
	let externalCliAuthScope = resolveExternalCliAuthOverlayScopeFromSelection({
		provider: params.provider,
		cfg: params.cfg,
		agentId: params.agentId,
		modelId: params.modelId,
		workspaceDir: params.workspaceDir,
		userPinnedAuthProfileId
	});
	let store;
	if (externalCliAuthScope.providerIds) store = ensureAuthProfileStore(params.agentDir, {
		externalCliProviderIds: externalCliAuthScope.providerIds,
		allowKeychainPrompt: false
	});
	else {
		store = ensureAuthProfileStoreWithoutExternalProfiles(params.agentDir, { allowKeychainPrompt: false });
		externalCliAuthScope = resolveExternalCliAuthOverlayScopeFromSelection({
			provider: params.provider,
			cfg: params.cfg,
			agentId: params.agentId,
			modelId: params.modelId,
			workspaceDir: params.workspaceDir,
			store,
			userPinnedAuthProfileId
		});
		if (externalCliAuthScope.providerIds) store = ensureAuthProfileStore(params.agentDir, {
			externalCliProviderIds: externalCliAuthScope.providerIds,
			allowKeychainPrompt: false
		});
	}
	return {
		store,
		ignoreAutoPreferredProfile: externalCliAuthScope.ignoreAutoPreferredProfile
	};
}
function buildBtwQuestionPrompt(question, inFlightPrompt) {
	const lines = ["Answer this side question only.", "Ignore any unfinished task in the conversation while answering it."];
	const trimmedPrompt = inFlightPrompt?.trim();
	if (trimmedPrompt) lines.push("", "Current in-flight main task request for background context only:", "<in_flight_main_task>", trimmedPrompt, "</in_flight_main_task>", "Do not continue or complete that task while answering the side question.");
	lines.push("", "<btw_side_question>", question.trim(), "</btw_side_question>");
	return lines.join("\n");
}
function collectBtwMessageText(content) {
	if (typeof content === "string") return content.trim();
	if (!Array.isArray(content)) return "";
	return content.flatMap((part) => {
		if (part.type === "text") return part.text;
		if (part.type === "image") return "[Image content omitted from CLI side-question context.]";
		return [];
	}).join("\n").trim();
}
function buildBtwCliPrompt(params) {
	const lines = [
		"Use this sanitized conversation history as background context only.",
		"Do not continue, resume, or complete any unfinished task from the conversation.",
		"",
		"<conversation_history>"
	];
	for (const message of params.messages) {
		const text = collectBtwMessageText(message.content);
		if (!text) continue;
		lines.push(`${message.role === "assistant" ? "Assistant" : "User"}:`, text, "");
	}
	lines.push("</conversation_history>", "");
	lines.push(buildBtwQuestionPrompt(params.question, params.inFlightPrompt));
	return lines.join("\n");
}
function normalizeBtwContentBlocks(content) {
	if (Array.isArray(content)) return content;
	if (content && typeof content === "object") return [content];
}
function isBtwTextBlock(block) {
	if (!block || typeof block !== "object") return false;
	const record = block;
	return normalizeLowercaseStringOrEmpty(record.type) === "text" && typeof record.text === "string";
}
function isBtwImageBlock(block) {
	if (!block || typeof block !== "object") return false;
	const record = block;
	return normalizeLowercaseStringOrEmpty(record.type) === "image" && typeof record.data === "string" && typeof record.mimeType === "string";
}
async function sanitizeBtwUserMessage(params) {
	if (typeof params.message.content === "string") return params.message;
	const blocks = normalizeBtwContentBlocks(params.message.content);
	if (!blocks) return;
	const content = [];
	for (const block of blocks) {
		if (isBtwTextBlock(block)) {
			content.push({
				type: "text",
				text: block.text
			});
			continue;
		}
		if (!isBtwImageBlock(block)) continue;
		const { images } = await sanitizeImageBlocks([block], "btw:context", params.imageLimits);
		const image = images[0];
		if (image) content.push(image);
	}
	if (content.length === 0) return;
	return {
		...params.message,
		content
	};
}
function sanitizeBtwAssistantMessage(message) {
	const rawContent = message.content;
	if (typeof rawContent === "string") {
		const trimmed = rawContent.trim();
		return trimmed.length > 0 ? {
			...message,
			content: [{
				type: "text",
				text: trimmed
			}]
		} : void 0;
	}
	const blocks = normalizeBtwContentBlocks(rawContent);
	if (!blocks) return;
	const content = blocks.flatMap((block) => isBtwTextBlock(block) ? [{
		type: "text",
		text: block.text
	}] : []);
	if (content.length === 0) return;
	return {
		...message,
		content
	};
}
async function toSimpleContextMessages(params) {
	const contextMessages = [];
	for (const message of params.messages) {
		if (!message || typeof message !== "object") continue;
		const role = message.role;
		if (role === "user") {
			const sanitizedMessage = await sanitizeBtwUserMessage({
				message,
				imageLimits: params.imageLimits
			});
			if (sanitizedMessage) contextMessages.push(sanitizedMessage);
			continue;
		}
		if (role !== "assistant") continue;
		const sanitizedMessage = sanitizeBtwAssistantMessage(message);
		if (sanitizedMessage) contextMessages.push(sanitizedMessage);
	}
	return stripToolResultDetails(contextMessages);
}
async function materializeBtwRuntimeModel(params) {
	const { agentDir, config: cfg, workspaceDir } = params.preparedModelRuntime;
	return await materializePreparedRuntimeModel({
		plan: params.plan,
		provider: params.provider,
		modelId: params.modelId,
		config: cfg,
		model: params.model,
		...params.forceResolve !== void 0 ? { forceResolve: params.forceResolve } : {},
		resolveModel: ({ config, authProfileId, authProfileMode }) => resolveModelAsync(params.provider, params.modelId, agentDir, config, {
			authStorage: params.authStorage,
			modelRegistry: params.modelRegistry,
			skipAgentDiscovery: true,
			allowBundledStaticCatalogFallback: true,
			preferBundledStaticCatalogTransport: true,
			preparedModelRuntime: params.preparedModelRuntime,
			workspaceDir,
			authProfileId,
			authProfileMode
		})
	}) ?? params.model;
}
async function resolveBtwPreparedRuntimeAuth(params) {
	const { agentDir, config: cfg, workspaceDir } = params.preparedModelRuntime;
	return resolvePreparedRuntimeAuthAttempts({
		attempts: params.preparation.attempts,
		store: params.authProfileStore,
		modelId: params.modelId,
		model: params.model,
		materializeModel: ({ plan, model, forceResolve }) => materializeBtwRuntimeModel({
			...params,
			plan,
			model,
			forceResolve
		}),
		resolveAuth: async ({ attempt, model }) => await resolvePreparedRuntimeModelAuth({
			plan: attempt.plan,
			model,
			cfg,
			store: params.authProfileStore,
			agentDir,
			workspaceDir,
			...attempt.allowAuthProfileFallback !== void 0 ? { allowAuthProfileFallback: attempt.allowAuthProfileFallback } : {},
			secretSentinels: true
		}),
		errorMessage: "BTW prepared auth attempts could not be resolved."
	});
}
async function resolveRuntimeModel(params) {
	const preparedModelRuntime = params.preparedModelRuntime;
	const cfg = preparedModelRuntime.config;
	const agentDir = preparedModelRuntime.agentDir;
	const workspaceDir = preparedModelRuntime.workspaceDir;
	const { authStorage, modelRegistry } = preparedModelRuntime.createStores();
	let model = resolveModelWithRegistry({
		provider: params.provider,
		modelId: params.model,
		modelRegistry,
		cfg
	});
	if (!model) throw new Error(`Unknown model: ${params.provider}/${params.model}`);
	const runtimeProvider = model.provider;
	const runtimeModelId = model.id;
	const authProfileId = await resolveSessionAuthProfileOverride({
		cfg,
		provider: runtimeProvider,
		acceptedProviderIds: listOpenAIAuthProfileProvidersForAgentRuntime({
			provider: runtimeProvider,
			harnessRuntime: params.harnessId,
			agentHarnessId: params.harnessId,
			config: cfg
		}),
		agentDir,
		sessionEntry: params.sessionEntry,
		sessionStore: params.sessionStore,
		sessionKey: params.sessionKey,
		storePath: params.storePath,
		isNewSession: params.isNewSession
	});
	const authProfileIdSource = resolveReturnedAuthProfileSource(params.sessionEntry, authProfileId);
	const authProfileStoreSelection = resolveBtwAuthProfileStore({
		cfg,
		provider: runtimeProvider,
		modelId: runtimeModelId,
		agentId: params.agentId,
		agentDir,
		workspaceDir,
		authProfileId,
		authProfileIdSource
	});
	const effectiveAuthProfileId = authProfileStoreSelection.ignoreAutoPreferredProfile && authProfileIdSource !== "user" ? void 0 : authProfileId;
	const runtimeAuthPreparation = prepareAgentRuntimeAuth({
		provider: runtimeProvider,
		modelId: runtimeModelId,
		modelApi: model.api,
		modelBaseUrl: model.baseUrl,
		config: cfg,
		env: process.env,
		workspaceDir,
		authProfileStore: authProfileStoreSelection.store,
		sessionAuthProfileId: effectiveAuthProfileId,
		sessionAuthProfileSource: authProfileIdSource,
		harnessId: params.harnessId,
		harnessRuntime: params.harnessId,
		harnessAuthBootstrap: params.harnessAuthBootstrap
	});
	model = await materializeBtwRuntimeModel({
		provider: runtimeProvider,
		modelId: runtimeModelId,
		preparedModelRuntime,
		authStorage,
		modelRegistry,
		plan: runtimeAuthPreparation.plan,
		model
	});
	return {
		model,
		authProfileId: runtimeAuthPreparation.plan.forwardedAuthProfileId,
		authProfileIdSource: runtimeAuthPreparation.plan.forwardedAuthProfileSource,
		authProfileStore: authProfileStoreSelection.store,
		runtimeAuthPreparation,
		authStorage,
		modelRegistry
	};
}
async function runCliBtwSideQuestion(params) {
	const timeoutMs = resolveAgentTimeoutMs({
		cfg: params.cfg,
		overrideSeconds: params.opts?.timeoutOverrideSeconds
	});
	const runId = params.authorityRunId;
	const preparedRunAdmission = prepareSystemAgentRunAdmission(params.cfg, runId, params.sessionAgentId, "btw.side-question");
	let prepared;
	try {
		prepared = await prepareCliRunContext({
			preparedRunAdmission,
			sessionId: params.sessionId,
			sessionKey: params.sessionKey,
			sessionEntry: params.sessionEntry,
			agentId: params.sessionAgentId,
			trigger: "user",
			sessionFile: params.sessionFile,
			workspaceDir: params.workspaceDir,
			config: params.cfg,
			prompt: buildBtwCliPrompt({
				messages: params.messages,
				question: params.question,
				inFlightPrompt: params.inFlightPrompt
			}),
			extraSystemPrompt: buildBtwSystemPrompt(),
			executionMode: "side-question",
			provider: params.cliProvider,
			model: params.model,
			thinkLevel: params.resolvedThinkLevel,
			disableTools: true,
			timeoutMs,
			runTimeoutOverrideMs: timeoutMs,
			runId,
			authProfileId: params.authProfileId,
			abortSignal: params.opts?.abortSignal,
			messageChannel: params.messageChannel,
			messageProvider: params.messageProvider,
			currentChannelId: params.currentChannelId
		});
		const text = (await executePreparedCliRun(prepared)).text.trim();
		if (!text) throw new Error(`/btw side question via ${params.cliProvider} produced no answer.`);
		return { text };
	} finally {
		await prepared?.preparedBackend.cleanup?.();
		preparedRunAdmission.close();
	}
}
/** Answers a side question using sanitized session context and no tool execution. */
async function runBtwSideQuestion(paramsInput) {
	let params = {
		...paramsInput,
		authorityRunId: paramsInput.authorityRunId ?? `btw-${randomUUID()}`
	};
	const sessionId = params.sessionEntry.sessionId?.trim();
	if (!sessionId) throw new Error("No active session context.");
	const sessionFile = resolveBtwSessionTranscriptPath({
		sessionId,
		sessionEntry: params.sessionEntry,
		sessionKey: params.sessionKey,
		storePath: params.storePath
	});
	if (!sessionFile) throw new Error("No active session transcript.");
	const requestedAgentId = resolveSessionAgentId({
		sessionKey: params.sessionKey,
		config: params.cfg
	});
	const requestedWorkspaceDir = resolveAgentWorkspaceDir(params.cfg, requestedAgentId);
	const preparedModelRuntime = await loadPreparedModelRuntimeSnapshot({
		config: params.cfg,
		agentId: requestedAgentId,
		agentDir: params.agentDir,
		workspaceDir: requestedWorkspaceDir,
		...params.allowGatewaySubagentBinding ? { allowGatewaySubagentBinding: true } : {}
	});
	const sessionAgentId = preparedModelRuntime.agentId ?? resolveSessionAgentId({
		sessionKey: params.sessionKey,
		config: preparedModelRuntime.config
	});
	const workspaceDir = preparedModelRuntime.workspaceDir ?? resolveAgentWorkspaceDir(preparedModelRuntime.config, sessionAgentId);
	const preparedModelRef = preparedModelRuntimeConfigsMatch(preparedModelRuntime.config, params.cfg) ? {
		provider: params.provider,
		model: params.model
	} : resolveSessionModelRef(preparedModelRuntime.config, params.sessionEntry, sessionAgentId);
	params = {
		...params,
		cfg: preparedModelRuntime.config,
		agentDir: preparedModelRuntime.agentDir,
		provider: preparedModelRef.provider,
		model: preparedModelRef.model
	};
	const preparedHarnesses = /* @__PURE__ */ new Map();
	const prepareHarness = async (provider, modelId, modelProvider) => {
		const agentHarnessId = isModelSelectionLocked(params.sessionEntry) ? params.sessionEntry.agentHarnessId : void 0;
		const agentHarnessRuntimeOverride = agentHarnessId ? void 0 : resolveSessionRuntimeOverrideForProvider({
			provider,
			entry: params.sessionEntry,
			cfg: params.cfg
		});
		const key = [
			`${provider}/${modelId}/${agentHarnessId ?? agentHarnessRuntimeOverride ?? "configured"}`,
			modelProvider?.api ?? "",
			modelProvider?.baseUrl ?? "",
			modelProvider?.requestTransportOverrides ?? "",
			modelProvider?.runtimePolicy?.compatibleIds.join(",") ?? "",
			modelProvider?.preparedAuth?.source ?? "",
			modelProvider?.preparedAuth?.mode ?? "",
			modelProvider?.preparedAuth?.requirement ?? ""
		].join("\0");
		const cached = preparedHarnesses.get(key);
		if (cached) return cached;
		await ensureSelectedAgentHarnessPlugin({
			provider,
			modelId,
			config: params.cfg,
			agentId: sessionAgentId,
			sessionKey: params.sessionKey,
			workspaceDir,
			...agentHarnessId ? { agentHarnessId } : {},
			...agentHarnessRuntimeOverride ? { agentHarnessRuntimeOverride } : {},
			pluginRegistry: preparedModelRuntime.pluginRegistry
		});
		const selectionParams = {
			provider,
			modelId,
			config: params.cfg,
			agentId: sessionAgentId,
			sessionKey: params.sessionKey,
			...agentHarnessId ? { agentHarnessId } : {},
			...agentHarnessRuntimeOverride ? { agentHarnessRuntimeOverride } : {}
		};
		const harness = modelProvider ? selectAgentHarnessForPreparedModelProviders({
			...selectionParams,
			modelProviders: [modelProvider]
		}) : selectAgentHarness(selectionParams);
		preparedHarnesses.set(key, harness);
		return harness;
	};
	const harness = await prepareHarness(params.provider, params.model);
	let runtimeSelection;
	const resolveRuntimeSelection = async () => {
		if (!runtimeSelection) runtimeSelection = await resolveRuntimeModel({
			cfg: params.cfg,
			provider: params.provider,
			model: params.model,
			agentId: sessionAgentId,
			agentDir: params.agentDir,
			workspaceDir,
			sessionEntry: params.sessionEntry,
			sessionStore: params.sessionStore,
			sessionKey: params.sessionKey,
			storePath: params.storePath,
			isNewSession: params.isNewSession,
			harnessId: harness.id,
			harnessAuthBootstrap: harness.authBootstrap,
			preparedModelRuntime
		});
		return runtimeSelection;
	};
	let preparedOpenClawFallback;
	const runHarnessSideQuestion = async (selectedHarness, runtime, routeFinalized = false) => {
		const toolsAllow = resolvePluginHarnessPolicyToolsAllow({
			config: params.cfg,
			sessionId,
			sessionKey: params.sessionKey,
			sandboxSessionKey: params.sandboxSessionKey,
			agentId: sessionAgentId,
			provider: runtime.model.provider,
			modelId: runtime.model.id,
			messageProvider: params.messageProvider,
			messageChannel: params.messageChannel,
			spawnedBy: params.spawnedBy,
			groupId: params.groupId,
			groupChannel: params.groupChannel,
			groupSpace: params.groupSpace,
			agentAccountId: params.agentAccountId,
			senderId: params.senderId,
			senderName: params.senderName,
			senderUsername: params.senderUsername,
			senderE164: params.senderE164
		});
		const authProfileStoreSelection = selectedHarness.id === harness.id ? void 0 : resolveBtwAuthProfileStore({
			cfg: params.cfg,
			provider: runtime.model.provider,
			modelId: runtime.model.id,
			agentId: sessionAgentId,
			agentDir: params.agentDir,
			workspaceDir,
			authProfileId: runtime.authProfileId,
			authProfileIdSource: runtime.authProfileIdSource
		});
		const runtimeAuthPreparation = authProfileStoreSelection ? prepareAgentRuntimeAuth({
			provider: runtime.model.provider,
			modelId: runtime.model.id,
			modelApi: runtime.model.api,
			modelBaseUrl: runtime.model.baseUrl,
			config: params.cfg,
			env: process.env,
			workspaceDir,
			authProfileStore: authProfileStoreSelection.store,
			sessionAuthProfileId: authProfileStoreSelection.ignoreAutoPreferredProfile && runtime.authProfileIdSource !== "user" ? void 0 : runtime.authProfileId,
			sessionAuthProfileSource: runtime.authProfileIdSource,
			harnessId: selectedHarness.id,
			harnessRuntime: selectedHarness.id,
			harnessAuthBootstrap: selectedHarness.authBootstrap
		}) : runtime.runtimeAuthPreparation;
		const selectedAuthProfileStore = authProfileStoreSelection?.store ?? runtime.authProfileStore;
		const implicitHarnessAuthPlan = selectedHarness.authBootstrap === "harness" && runtimeAuthPreparation.attempts.length === 1 && runtimeAuthPreparation.attempts[0]?.kind === "implicit" && runtimeAuthPreparation.attempts[0].plan.harnessAuthProvider ? runtimeAuthPreparation.attempts[0].plan : void 0;
		const resolvedAttempt = implicitHarnessAuthPlan ? {
			plan: implicitHarnessAuthPlan,
			model: runtime.model
		} : await resolveBtwPreparedRuntimeAuth({
			preparation: runtimeAuthPreparation,
			model: runtime.model,
			provider: runtime.model.provider,
			modelId: runtime.model.id,
			preparedModelRuntime,
			authStorage: runtime.authStorage,
			modelRegistry: runtime.modelRegistry,
			authProfileStore: selectedAuthProfileStore
		});
		const runtimeAuthPlan = resolvedAttempt.plan;
		const runtimeModel = resolvedAttempt.model;
		const finalizedHarness = await prepareHarness(runtimeModel.provider, runtimeModel.id, {
			api: runtimeModel.api,
			baseUrl: runtimeModel.baseUrl,
			...resolveAgentHarnessPreparedRouteSupport(runtimeAuthPlan),
			preparedAuth: resolveAgentHarnessPreparedAuthSupport({ plan: runtimeAuthPlan })
		});
		if (finalizedHarness.id !== selectedHarness.id) {
			if (routeFinalized) throw new Error("Agent harness selection changed after route materialization.");
			return runHarnessSideQuestion(finalizedHarness, {
				...runtime,
				model: runtimeModel,
				runtimeAuthPreparation,
				authProfileStore: selectedAuthProfileStore
			}, true);
		}
		if (!selectedHarness.runSideQuestion) {
			if (selectedHarness.id !== "openclaw" || !("auth" in resolvedAttempt)) throw new Error(`Selected agent harness "${selectedHarness.id}" does not support /btw side questions.`);
			return {
				kind: "openclaw",
				harness: selectedHarness,
				runtime: {
					...runtime,
					model: runtimeModel,
					authProfileId: runtimeAuthPlan.forwardedAuthProfileId,
					authProfileIdSource: runtimeAuthPlan.forwardedAuthProfileSource,
					authProfileStore: selectedAuthProfileStore,
					runtimeAuthPreparation
				},
				resolvedAttempt
			};
		}
		const resolvedApiKey = runtimeAuthPlan.modelRoute?.authRequirement === "api-key" && "auth" in resolvedAttempt ? resolvedAttempt.auth.apiKey?.trim() : void 0;
		const sideRunId = params.authorityRunId;
		const sandbox = await resolveSessionPlacementSandbox({
			agentId: sessionAgentId,
			config: params.cfg,
			sessionId,
			sessionKey: params.sessionKey,
			workspaceDir
		}) ?? await resolveSandboxContext({
			config: params.cfg,
			sessionKey: params.sandboxSessionKey ?? params.sessionKey ?? sessionId,
			workspaceDir
		});
		const preparedRunAdmission = prepareSystemAgentRunAdmission(params.cfg, sideRunId, sessionAgentId, "btw.side-question");
		const admittedRunContext = await preparedRunAdmission.admit("plugin-harness");
		try {
			const { model: _sideModel, authorityRunId: _authorityRunId, ...hostAttempt } = params;
			const host = createAgentHarnessHostCapabilities({
				attempt: {
					...hostAttempt,
					admittedRunContext,
					config: params.cfg,
					agentId: sessionAgentId,
					sessionId,
					sessionKey: params.sessionKey,
					sandbox,
					workspaceDir,
					runId: sideRunId,
					currentMessagingTarget: params.messageTo,
					currentThreadTs: params.messageThreadId === void 0 ? void 0 : String(params.messageThreadId)
				},
				pluginId: resolveAgentHarnessOwnerPluginId(selectedHarness)
			});
			const sideParams = {
				...hostAttempt,
				hostCapabilities: host.capabilities,
				sandbox,
				provider: runtimeModel.provider,
				model: runtimeModel.id,
				runtimeModel,
				preparedRuntimeAuth: {
					plan: runtimeAuthPlan,
					authProfileStore: scopeAuthProfileStoreToPreparedPlan(selectedAuthProfileStore, runtimeAuthPlan),
					authStorage: runtime.authStorage,
					modelRegistry: runtime.modelRegistry,
					...resolvedApiKey ? { resolvedApiKey: unwrapSecretSentinelsForProviderEgress(resolvedApiKey, "BTW harness handoff") } : {}
				},
				sessionId,
				sessionFile,
				agentId: sessionAgentId,
				workspaceDir,
				...toolsAllow ? { toolsAllow } : {},
				authProfileId: runtimeAuthPlan.modelRoute?.authRequirement === "api-key" ? void 0 : runtimeAuthPlan.forwardedAuthProfileId,
				opts: {
					...params.opts,
					runId: sideRunId
				},
				authProfileIdSource: runtimeAuthPlan.modelRoute?.authRequirement === "api-key" ? void 0 : runtimeAuthPlan.forwardedAuthProfileSource
			};
			let result;
			try {
				result = await selectedHarness.runSideQuestion(sideParams);
			} finally {
				host.close();
			}
			return {
				kind: "handled",
				payload: { text: result.text }
			};
		} finally {
			preparedRunAdmission.close();
		}
	};
	if (harness.runSideQuestion) {
		const dispatch = await runHarnessSideQuestion(harness, await resolveRuntimeSelection());
		if (dispatch.kind === "handled") return dispatch.payload;
		preparedOpenClawFallback = dispatch;
	}
	if (harness.id === "codex" && !harness.runSideQuestion) throw new Error(`Selected agent harness "${harness.id}" does not support /btw side questions.`);
	const activeRunSnapshot = getActiveEmbeddedRunSnapshot(sessionId);
	const imageLimits = resolveImageSanitizationLimits(params.cfg);
	let messages = [];
	let inFlightPrompt;
	if (Array.isArray(activeRunSnapshot?.messages) && activeRunSnapshot.messages.length > 0) {
		messages = await toSimpleContextMessages({
			messages: activeRunSnapshot.messages,
			imageLimits
		});
		inFlightPrompt = activeRunSnapshot.inFlightPrompt;
	} else if (activeRunSnapshot) inFlightPrompt = activeRunSnapshot.inFlightPrompt;
	if (messages.length === 0) messages = await toSimpleContextMessages({
		messages: await readBtwTranscriptMessages({
			agentId: sessionAgentId,
			sessionFile,
			sessionId,
			sessionKey: params.sessionKey,
			storePath: params.storePath,
			snapshotLeafId: activeRunSnapshot?.transcriptLeafId
		}),
		imageLimits
	});
	if (messages.length === 0 && !inFlightPrompt?.trim()) throw new Error("No active session context.");
	const fallbackRuntime = resolveAvailableAgentHarnessPolicy({
		provider: params.provider,
		modelId: params.model,
		config: params.cfg,
		agentId: sessionAgentId,
		sessionKey: params.sessionKey
	}).runtime.trim();
	const sessionAuthProfileId = params.sessionEntry.authProfileOverride?.trim() || void 0;
	const sessionAuthProfileSource = resolveReturnedAuthProfileSource(params.sessionEntry, sessionAuthProfileId);
	const cliProviderFromSessionAuth = sessionAuthProfileId ? resolveCliRuntimeExecutionProvider({
		provider: params.provider,
		cfg: params.cfg,
		agentId: sessionAgentId,
		modelId: params.model,
		authProfileId: sessionAuthProfileId
	})?.trim() : void 0;
	const cliProviderFromAuthOrder = !sessionAuthProfileId || sessionAuthProfileSource === "auto" ? resolveCliRuntimeExecutionProvider({
		provider: params.provider,
		cfg: params.cfg,
		agentId: sessionAgentId,
		modelId: params.model
	})?.trim() : void 0;
	const cliProvider = cliProviderFromSessionAuth ?? cliProviderFromAuthOrder ?? (isCliRuntimeAliasForProvider({
		runtime: fallbackRuntime,
		provider: params.provider,
		cfg: params.cfg
	}) ? fallbackRuntime : void 0);
	if (cliProvider) return runCliBtwSideQuestion({
		cfg: params.cfg,
		model: params.model,
		question: params.question,
		sessionId,
		sessionFile,
		sessionEntry: params.sessionEntry,
		sessionKey: params.sessionKey,
		sessionAgentId,
		workspaceDir,
		cliProvider,
		authProfileId: cliProviderFromSessionAuth ? sessionAuthProfileId : void 0,
		resolvedThinkLevel: params.resolvedThinkLevel,
		messages,
		inFlightPrompt,
		opts: params.opts,
		authorityRunId: params.authorityRunId,
		messageChannel: params.messageChannel,
		messageProvider: params.messageProvider,
		currentChannelId: params.currentChannelId
	});
	const initialOpenClawFallback = preparedOpenClawFallback;
	const runtimeSelectionForHarness = initialOpenClawFallback?.runtime ?? await resolveRuntimeSelection();
	const runtimeHarness = initialOpenClawFallback?.harness ?? await prepareHarness(runtimeSelectionForHarness.model.provider, runtimeSelectionForHarness.model.id);
	if (runtimeHarness.runSideQuestion) {
		const dispatch = await runHarnessSideQuestion(runtimeHarness, runtimeSelectionForHarness);
		if (dispatch.kind === "handled") return dispatch.payload;
		preparedOpenClawFallback = dispatch;
	}
	if (runtimeHarness.id === "codex" && !runtimeHarness.runSideQuestion) throw new Error(`Selected agent harness "${runtimeHarness.id}" does not support /btw side questions.`);
	const finalizedOpenClawFallback = preparedOpenClawFallback;
	const { authStorage, model, modelRegistry, authProfileStore, runtimeAuthPreparation } = finalizedOpenClawFallback?.runtime ?? runtimeSelectionForHarness;
	const resolvedAttempt = finalizedOpenClawFallback?.resolvedAttempt ?? await resolveBtwPreparedRuntimeAuth({
		preparation: runtimeAuthPreparation,
		model,
		provider: model.provider,
		modelId: model.id,
		preparedModelRuntime,
		authStorage,
		modelRegistry,
		authProfileStore
	});
	const apiKeyInfo = resolvedAttempt.auth;
	const resolvedAuthProfileId = resolvedAttempt.plan.forwardedAuthProfileId;
	let runtimeModel = resolvedAttempt.model;
	let apiKey = apiKeyInfo.mode === "aws-sdk" && !apiKeyInfo.apiKey ? void 0 : requireApiKey(apiKeyInfo, runtimeModel.provider);
	if (apiKey) {
		const preparedAuth = protectPreparedProviderRuntimeAuth({
			provider: runtimeModel.provider,
			preparedAuth: await prepareProviderRuntimeAuth({
				provider: runtimeModel.provider,
				config: params.cfg,
				workspaceDir,
				env: process.env,
				context: {
					config: params.cfg,
					agentDir: params.agentDir,
					workspaceDir,
					env: process.env,
					provider: runtimeModel.provider,
					modelId: runtimeModel.id,
					model: runtimeModel,
					apiKey: unwrapSecretSentinelsForProviderEgress(apiKey, "provider runtime auth exchange"),
					authMode: apiKeyInfo.mode,
					profileId: resolvedAuthProfileId
				}
			})
		});
		runtimeModel = applyPreparedRuntimeAuthToModel(runtimeModel, preparedAuth);
		if (preparedAuth?.apiKey) apiKey = preparedAuth.apiKey;
	}
	runtimeModel = applySecretRefHeaderSentinels(runtimeModel, params.cfg);
	const modelRegistryRuntime = getModelRegistryRuntime(modelRegistry);
	const providerStreamFn = registerProviderStreamForModel({
		model: runtimeModel,
		cfg: params.cfg,
		agentDir: params.agentDir,
		workspaceDir,
		env: process.env,
		apiRegistry: modelRegistryRuntime.apiRegistry
	});
	const streamFn = resolveEmbeddedAgentStreamFn({
		llmRuntime: modelRegistryRuntime.llmRuntime,
		currentStreamFn: modelRegistryRuntime.llmRuntime.streamSimple,
		providerStreamFn,
		sessionId,
		signal: params.opts?.abortSignal,
		model: runtimeModel,
		resolvedApiKey: apiKey,
		authProfileId: resolvedAuthProfileId
	});
	const chunker = params.opts?.onBlockReply && params.blockReplyChunking ? new EmbeddedBlockChunker(params.blockReplyChunking) : void 0;
	let emittedBlocks = 0;
	let blockEmitChain = Promise.resolve();
	let answerText = "";
	let reasoningText = "";
	let assistantStarted = false;
	let sawTextEvent = false;
	const emitBlockChunk = async (text) => {
		if (!text.trim() || !params.opts?.onBlockReply) return;
		emittedBlocks += 1;
		blockEmitChain = blockEmitChain.then(async () => {
			await params.opts?.onBlockReply?.({
				text,
				btw: { question: params.question }
			});
		});
		await blockEmitChain;
	};
	const stream = await streamWithPayloadPatch(streamFn, runtimeModel, {
		systemPrompt: buildBtwSystemPrompt(),
		messages: [...messages, {
			role: "user",
			content: [{
				type: "text",
				text: buildBtwQuestionPrompt(params.question, inFlightPrompt)
			}],
			timestamp: Date.now()
		}]
	}, {
		apiKey,
		reasoning: void 0,
		signal: params.opts?.abortSignal
	}, (payloadObj) => {
		if (Array.isArray(payloadObj.tools) && payloadObj.tools.length === 0) delete payloadObj.tools;
	});
	let finalEvent;
	for await (const event of stream) {
		finalEvent = event.type === "done" || event.type === "error" ? event : finalEvent;
		if (!assistantStarted && (event.type === "text_start" || event.type === "start")) {
			assistantStarted = true;
			await params.opts?.onAssistantMessageStart?.();
		}
		if (event.type === "text_delta") {
			sawTextEvent = true;
			answerText += event.delta;
			chunker?.append(event.delta);
			if (chunker && params.resolvedBlockStreamingBreak === "text_end") chunker.drain({
				force: false,
				emit: (chunk) => void emitBlockChunk(chunk)
			});
			continue;
		}
		if (event.type === "text_end" && chunker && params.resolvedBlockStreamingBreak === "text_end") {
			chunker.drain({
				force: true,
				emit: (chunk) => void emitBlockChunk(chunk)
			});
			continue;
		}
		if (event.type === "thinking_delta") {
			reasoningText += event.delta;
			if (params.resolvedReasoningLevel !== "off") await params.opts?.onReasoningStream?.({
				text: reasoningText,
				isReasoning: true
			});
			continue;
		}
		if (event.type === "thinking_end" && params.resolvedReasoningLevel !== "off") await params.opts?.onReasoningEnd?.();
	}
	if (chunker && params.resolvedBlockStreamingBreak !== "text_end" && chunker.hasBuffered()) chunker.drain({
		force: true,
		emit: (chunk) => void emitBlockChunk(chunk)
	});
	await blockEmitChain;
	if (finalEvent?.type === "error") {
		const message = collectTextContent(finalEvent.error.content);
		throw new Error(message || finalEvent.error.errorMessage || "BTW failed.");
	}
	const finalMessage = finalEvent?.type === "done" ? finalEvent.message : void 0;
	if (finalMessage) {
		if (!sawTextEvent) answerText = collectTextContent(finalMessage.content);
		if (!reasoningText) collectThinkingContent(finalMessage.content);
	}
	const answer = answerText.trim();
	if (!answer) throw new Error("No BTW response generated.");
	if (emittedBlocks > 0) return;
	return { text: answer };
}
//#endregion
export { runBtwSideQuestion as t };
