import { a as createLazyRuntimeSurface, n as createLazyRuntimeMethodBinder, r as createLazyRuntimeModule, t as createLazyRuntimeMethod } from "./lazy-runtime-CgCh8H_K.js";
import { w as resolveStateDir } from "./paths-CqeDjSA4.js";
import "./agent-scope-BizOtGGz.js";
import { d as resolveAgentWorkspaceDir, l as resolveAgentDir, p as resolveDefaultAgentId, s as resolveAgentConfig } from "./agent-scope-config-BdXMWufB.js";
import { o as resolveSessionStorePathCore } from "./paths-B2oibYbs.js";
import { r as getRuntimeConfig } from "./io-CeQckj5v.js";
import { r as normalizeLogLevel } from "./levels-CLdqNCQ3.js";
import { i as getChildLogger, s as isFileLogLevelEnabled } from "./logger-BWBYvpHz.js";
import { n as VERSION } from "./version-o4XN9fka.js";
import { c as mergeAlsoAllowPolicy, g as normalizeToolPolicyName, m as expandToolGroups, v as resolveToolProfilePolicy } from "./tool-policy-CWmnHLY1.js";
import { n as isToolAllowedByPolicies } from "./tool-policy-match-CEXvGj1C.js";
import { b as resolveModelRefFromString, i as buildModelAliasIndex, r as buildConfiguredModelCatalog } from "./model-selection-shared-BSy9FczT.js";
import { n as DEFAULT_MODEL, r as DEFAULT_PROVIDER } from "./defaults-CdX9UGcX.js";
import { w as resolveDefaultModelForAgent } from "./codex-route-model-ref-0uJOp6W2.js";
import { s as normalizeThinkLevel } from "./thinking.shared-bHYuuc1L.js";
import { u as onAgentEvent } from "./agent-events-Cmj8toCy.js";
import { c as resolveThinkingProfile } from "./thinking-dphnnN-M.js";
import { r as replaceConfigFile, t as mutateConfigFile } from "./mutate-DOUWd6so.js";
import "./config-Dl8DJbzM.js";
import { i as shouldLogVerbose } from "./globals-CAwGc4B6.js";
import { r as runCommandWithTimeout } from "./exec-BL80Wdzl.js";
import { s as normalizeDeliveryContext } from "./delivery-context.shared-D-qPZITK.js";
import { o as mediaKindFromMime } from "./constants-Mf57IYS0.js";
import { n as detectMime } from "./mime-Hm4eS2i0.js";
import { $t as loadSessionEntryReadOnly, K as updateSessionEntry, Pt as listSessionEntriesCore, en as patchSessionEntryCore, in as replaceSessionEntry, qt as listSessionEntriesReadOnly } from "./session-accessor-Bi6bzKQE.js";
import { a as rollbackPluginOwnedSessionEntryLifecycle, i as rollbackAgentHarnessSessionEntryLifecycle, n as deleteSessionEntryLifecycle } from "./session-accessor.sqlite-lifecycle-Cv8qGX3X.js";
import { X as runExclusiveSessionLifecycleMutation, Y as isSessionWorkAdmissionActive, w as normalizeResolvedMaintenanceConfigInput, z as beginSessionWorkAdmission } from "./agent-harness-session-key-BMj1lPtX.js";
import { r as onSessionTranscriptUpdate } from "./transcript-events-D-a7D51Y.js";
import "./logging-B9hJxSny.js";
import { c as getImageMetadata, p as resizeToJpeg } from "./image-ops-CuoBGLvn.js";
import "./media-services-BMidrwE0.js";
import { o as resolveEffectiveAgentRuntime, t as concretizeAgentRuntime } from "./thinking-runtime-BnpBwpz_.js";
import { n as resolveThinkingDefault } from "./model-thinking-default-B9IHGxZs.js";
import { i as resolveAllowedModelRef } from "./model-selection-Dg63KcCa.js";
import { m as ensureAgentWorkspace } from "./workspace-CiE104ur.js";
import { c as requestHeartbeat } from "./heartbeat-wake-WmGdPBfX.js";
import { a as enqueueSystemEvent } from "./system-events-kSFsVzdG.js";
import { B as createManagedTaskFlow, K as finishFlow, O as listTasksForFlowId, Q as requestFlowCancel, W as failFlow, et as resumeFlow, tt as setFlowWaiting } from "./task-registry-DkfAoDv0.js";
import "./runtime-internal-CEnngiYh.js";
import { _ as getTaskFlowByIdForOwner, d as getFlowTaskSummary, g as findLatestTaskFlowForOwner, p as runTaskInFlowForOwner, r as cancelFlowByIdForOwner, t as cancelDetachedTaskRunById, v as listTaskFlowsForOwner, y as resolveTaskFlowForLookupTokenForOwner } from "./task-executor-Bt13TeAV.js";
import { n as summarizeTaskRecords } from "./task-registry.summary-BwpoHlXv.js";
import { n as resolveAgentTimeoutMs } from "./timeout-CRSytcvC.js";
import { s as resolveSessionWorkStartError } from "./lifecycle-BOW0O5mU.js";
import { a as resolveSessionModelRef } from "./placement-session-runtime-BVw2N8ij.js";
import { i as resolveSandboxConfigForAgent } from "./config-l_EuSzmS.js";
import { n as resolveSandboxRuntimeStatus } from "./runtime-status-DwfYu5UM.js";
import { n as resolveAgentIdentity } from "./identity-hPPJEi06.js";
import { a as resolveInheritedToolPolicyForSession, o as resolveSubagentToolPolicyForSession, r as resolveEffectiveToolPolicy } from "./agent-tools.policy-BjBsVONt.js";
import { n as loadWebMedia } from "./web-media-Dk8VJTPc.js";
import { z as normalizeExecTarget } from "./exec-approvals-DkNiV-ux.js";
import { n as generateMusic, r as listRuntimeMusicGenerationProviders } from "./openclaw-tools--aBnq3g4.js";
import { a as getTaskByIdForOwner, o as listTasksForRelatedSessionKeyForOwner, r as findLatestTaskForRelatedSessionKeyForOwner, s as resolveTaskForLookupTokenForOwner } from "./task-owner-access-DHoLazam.js";
import { o as resolveEffectiveSessionToolsVisibility } from "./session-visibility-tSWqHzCC.js";
import { n as listRuntimeImageGenerationProviders, t as generateImage } from "./runtime-D1l4pVHB.js";
import { n as listRuntimeVideoGenerationProviders, t as generateVideo } from "./runtime-CHpOBt-M.js";
import { i as listWebSearchProviders, o as runWebSearch } from "./runtime-cxdXSplN.js";
import { t as RequestScopedSubagentRuntimeError } from "./error-runtime-CmlvK1A3.js";
import { n as isVoiceMessageCompatibleAudio } from "./audio-Dm6sjmv5.js";
import { t as resolveEmbeddedCliBackendDispatchEligibility } from "./cli-backend-dispatch-eligibility-BLpEyfRo.js";
import { t as createRuntimeChannel } from "./runtime-channel-P2jG0Iea.js";
import { isDeepStrictEqual } from "node:util";
//#region src/agents/sandbox/workspace-authority.ts
const WORKSPACE_CONFINED_SANDBOX_TOOLS = /* @__PURE__ */ new Set([
	"apply_patch",
	"edit",
	"exec",
	"image",
	"process",
	"read",
	"session_status",
	"sessions_history",
	"sessions_list",
	"sessions_search",
	"sessions_yield",
	"update_plan",
	"web_fetch",
	"web_search",
	"write"
]);
function findUnconfinedAllowedTool(policies, confinedToolNames) {
	const candidatePolicy = policies.filter((policy) => Boolean(policy?.allow?.length)).toSorted((left, right) => left.allow.length - right.allow.length)[0];
	if (!candidatePolicy?.allow?.length) return "unbounded allow policy";
	for (const entry of candidatePolicy.allow) for (const candidate of expandToolGroups([entry])) {
		const normalized = normalizeToolPolicyName(candidate);
		if (!isToolAllowedByPolicies(normalized, policies)) continue;
		if (WORKSPACE_CONFINED_SANDBOX_TOOLS.has(normalized) || confinedToolNames.has(normalized)) continue;
		return entry;
	}
}
function resolveWorkspaceToolPolicies(params) {
	const effective = resolveEffectiveToolPolicy({
		config: params.config,
		agentId: params.agentId,
		sessionKey: params.sessionKey,
		modelProvider: params.modelProvider,
		modelId: params.modelId
	});
	return [
		mergeAlsoAllowPolicy(resolveToolProfilePolicy(effective.profile), effective.profileAlsoAllow),
		mergeAlsoAllowPolicy(resolveToolProfilePolicy(effective.providerProfile), effective.providerProfileAlsoAllow),
		effective.globalPolicy,
		effective.globalProviderPolicy,
		effective.agentPolicy,
		effective.agentProviderPolicy,
		params.sandboxPolicy,
		resolveSubagentToolPolicyForSession(params.config, params.sessionKey),
		resolveInheritedToolPolicyForSession(params.config, params.sessionKey)
	];
}
function resolveWorkspaceAuthorityModel(params) {
	const selected = resolveSessionModelRef(params.config, params.sessionEntry, params.agentId);
	const explicitProvider = params.modelProvider?.trim();
	const explicitModel = params.modelId?.trim();
	if (!explicitModel) return {
		provider: explicitProvider ?? selected.provider,
		model: selected.model
	};
	const defaultProvider = explicitProvider ?? selected.provider;
	const raw = explicitProvider && !explicitModel.includes("/") ? `${explicitProvider}/${explicitModel}` : explicitModel;
	return resolveModelRefFromString({
		cfg: params.config,
		raw,
		defaultProvider,
		aliasIndex: buildModelAliasIndex({
			cfg: params.config,
			defaultProvider
		})
	})?.ref ?? {
		provider: defaultProvider,
		model: explicitModel
	};
}
function resolveSandboxWorkspaceAuthority(params) {
	const runtime = resolveSandboxRuntimeStatus({
		cfg: params.config,
		agentId: params.agentId,
		sessionKey: params.sessionKey
	});
	const sandbox = resolveSandboxConfigForAgent(params.config, runtime.agentId);
	if (!runtime.sandboxed) return {
		sandboxed: false,
		workspaceAccess: sandbox.workspaceAccess
	};
	const backend = sandbox.backend.trim().toLowerCase();
	let confinementError;
	if (backend !== "docker" && backend !== "podman") confinementError = "target sandbox backend does not provide local workspace confinement.";
	else if (sandbox.scope !== "session") confinementError = "target sandbox is not exclusive to this worker session.";
	else if (sandbox.docker.dangerouslyAllowExternalBindSources === true || sandbox.docker.dangerouslyAllowReservedContainerTargets === true || sandbox.docker.dangerouslyAllowContainerNamespaceJoin === true) confinementError = "target sandbox enables dangerous Docker isolation overrides.";
	else {
		const elevated = resolveAgentConfig(params.config, runtime.agentId)?.tools?.elevated;
		if (params.config.tools?.elevated?.enabled === true && elevated?.enabled !== false) confinementError = "target agent can request host-level elevated execution.";
		const rawSessionExecHost = params.sessionEntry?.execHost?.trim();
		const sessionExecHost = normalizeExecTarget(rawSessionExecHost);
		const execHost = sessionExecHost ?? resolveAgentConfig(params.config, runtime.agentId)?.tools?.exec?.host ?? params.config.tools?.exec?.host ?? "auto";
		if (!confinementError && rawSessionExecHost && !sessionExecHost) confinementError = "target session has an invalid shell execution override.";
		else if (!confinementError && (Boolean(params.sessionEntry?.execNode?.trim()) || execHost !== "auto" && execHost !== "sandbox")) confinementError = "target sandbox routes shell execution outside the sandbox.";
		else if (!confinementError && sandbox.browser.allowHostControl) confinementError = "target sandbox allows host browser control.";
		else if (!confinementError && ["agent", "all"].includes(resolveEffectiveSessionToolsVisibility({
			cfg: params.config,
			sandboxed: true
		}))) confinementError = "target sandbox allows access to host-wide sessions.";
		else if (!confinementError) {
			const model = resolveWorkspaceAuthorityModel({
				config: params.config,
				agentId: runtime.agentId,
				sessionEntry: params.sessionEntry,
				modelProvider: params.modelProvider,
				modelId: params.modelId
			});
			const policies = resolveWorkspaceToolPolicies({
				config: params.config,
				agentId: runtime.agentId,
				sessionKey: params.sessionKey,
				modelProvider: model.provider,
				modelId: model.model,
				sandboxPolicy: sandbox.tools
			});
			const unavailableTool = (params.requiredToolNames ?? []).map(normalizeToolPolicyName).find((name) => !isToolAllowedByPolicies(name, policies));
			if (unavailableTool) confinementError = `target tool policy blocks required tool ${unavailableTool}.`;
			else {
				const unsafeTool = findUnconfinedAllowedTool(policies, new Set((params.confinedToolNames ?? []).map(normalizeToolPolicyName)));
				if (unsafeTool) confinementError = `target sandbox allows unclassified tool surface ${unsafeTool}.`;
			}
		}
	}
	return {
		sandboxed: true,
		workspaceAccess: sandbox.workspaceAccess,
		...confinementError ? { confinementError } : {}
	};
}
//#endregion
//#region src/plugins/runtime/runtime-agent-session-catalog.ts
/**
* Resolve a synchronous catalog create target through the same model/runtime
* policy used by agent turns, without making plugins import that policy graph.
*/
function resolveAgentCatalogCreateTarget(params) {
	const agentId = params.requestedAgentId ?? resolveDefaultAgentId(params.config);
	const defaultModel = resolveDefaultModelForAgent({
		cfg: params.config,
		agentId
	});
	for (const modelId of params.modelIds) {
		if (resolveEffectiveAgentRuntime({
			cfg: params.config,
			provider: params.provider,
			modelId,
			agentId
		}) !== params.agentRuntime) continue;
		const model = `${params.provider}/${modelId}`;
		if (!("error" in resolveAllowedModelRef({
			cfg: params.config,
			catalog: [],
			raw: model,
			defaultProvider: defaultModel.provider,
			defaultModel: defaultModel.model,
			agentId
		}))) return {
			model,
			agentRuntime: params.agentRuntime
		};
	}
}
//#endregion
//#region src/plugins/runtime/runtime-agent-thinking.ts
function resolveRuntimeThinkingCatalog(params, buildConfiguredCatalog) {
	if (params.catalog) return params.catalog;
	const configuredCatalog = buildConfiguredCatalog();
	return configuredCatalog.length > 0 ? configuredCatalog : void 0;
}
//#endregion
//#region src/plugins/runtime/runtime-cache.ts
/** Defines a lazily computed enumerable property on a runtime facade. */
function defineCachedValue(target, key, create) {
	let cached;
	let ready = false;
	Object.defineProperty(target, key, {
		configurable: true,
		enumerable: true,
		get() {
			if (!ready) {
				cached = create();
				ready = true;
			}
			return cached;
		}
	});
}
//#endregion
//#region src/plugins/runtime/runtime-agent.ts
const loadEmbeddedAgentRuntime = createLazyRuntimeModule(() => import("./runtime-embedded-agent.runtime.js"));
function toSessionAccessScope(params) {
	return {
		sessionKey: params.sessionKey,
		...params.agentId !== void 0 ? { agentId: params.agentId } : {},
		...params.env !== void 0 ? { env: params.env } : {},
		...params.hydrateSkillPromptRefs !== void 0 ? { hydrateSkillPromptRefs: params.hydrateSkillPromptRefs } : {},
		...params.readConsistency !== void 0 ? { readConsistency: params.readConsistency } : {},
		...params.storePath !== void 0 ? { storePath: params.storePath } : {}
	};
}
function getSessionEntry(params) {
	return loadSessionEntryReadOnly(toSessionAccessScope(params));
}
function listSessionEntries(params = {}) {
	return (params.readOnly ? listSessionEntriesReadOnly : listSessionEntriesCore)({
		...params.agentId !== void 0 ? { agentId: params.agentId } : {},
		...params.env !== void 0 ? { env: params.env } : {},
		...params.hydrateSkillPromptRefs !== void 0 ? { hydrateSkillPromptRefs: params.hydrateSkillPromptRefs } : {},
		...params.storePath !== void 0 ? { storePath: params.storePath } : {}
	});
}
async function patchSessionEntry(params) {
	return await patchSessionEntryCore(toSessionAccessScope(params), params.update, {
		fallbackEntry: params.fallbackEntry,
		maintenanceConfig: params.maintenanceConfig !== void 0 ? normalizeResolvedMaintenanceConfigInput(params.maintenanceConfig) : void 0,
		preserveActivity: params.preserveActivity,
		replaceEntry: params.replaceEntry
	});
}
async function updateSessionStoreEntry(params) {
	return await updateSessionEntry({
		sessionKey: params.sessionKey,
		storePath: params.storePath
	}, params.update, {
		skipMaintenance: params.skipMaintenance,
		takeCacheOwnership: params.takeCacheOwnership,
		requireWriteSuccess: params.requireWriteSuccess
	});
}
async function upsertSessionEntry(params) {
	await replaceSessionEntry(toSessionAccessScope(params), params.entry);
}
async function createSessionEntry(params) {
	const [{ createGatewaySession }, { resolveGatewaySessionStoreTarget }, { readAcpSessionMetaForEntry, upsertAcpSessionMeta }] = await Promise.all([
		import("./session-create-service-D7k1a7e3.js"),
		import("./session-utils-CmJM2U64.js"),
		import("./session-meta-B_otESz3.js")
	]);
	const target = resolveGatewaySessionStoreTarget({
		cfg: params.cfg,
		key: params.key,
		...params.agentId !== void 0 ? { agentId: params.agentId } : {}
	});
	const cliInitial = "cliBackendId" in params.initialEntry ? params.initialEntry : void 0;
	const acpInitial = "acpSessionBinding" in params.initialEntry ? params.initialEntry : void 0;
	const harnessInitial = "agentHarnessId" in params.initialEntry ? params.initialEntry : void 0;
	const pluginInitial = cliInitial ?? acpInitial;
	const acpBackendId = acpInitial?.acpBackendId.trim();
	const acpAgentId = acpInitial?.acpSessionBinding.acpAgentId.trim();
	const agentSessionId = acpInitial?.acpSessionBinding.agentSessionId.trim();
	if (acpInitial && (!acpBackendId || !acpAgentId || !agentSessionId)) throw new Error("initial ACP session binding fields must be non-empty");
	const initialAcpMeta = (now) => acpInitial ? {
		backend: acpBackendId,
		agent: acpAgentId,
		runtimeSessionName: target.canonicalKey,
		identity: {
			state: "resolved",
			agentSessionId,
			source: "ensure",
			lastUpdatedAt: now
		},
		mode: "persistent",
		...params.spawnedCwd?.trim() ? { cwd: params.spawnedCwd.trim() } : {},
		state: "idle",
		lastActivityAt: now
	} : void 0;
	const persistedAcpBinding = acpInitial ? {
		acpBackendId,
		acpAgentId,
		agentSessionId
	} : void 0;
	const acpMetaMatches = (meta) => {
		return Boolean(meta && meta.backend === acpBackendId && meta.agent === acpAgentId && meta.runtimeSessionName === target.canonicalKey && meta.identity?.state === "resolved" && meta.identity.agentSessionId === agentSessionId && meta.mode === "persistent" && meta.cwd === (params.spawnedCwd?.trim() || void 0));
	};
	const initializesAfterCreate = Boolean(params.afterCreate || acpInitial);
	const matchesExceptUpdatedAt = (left, right) => {
		const { updatedAt: _leftUpdatedAt, ...leftStable } = left;
		const { updatedAt: _rightUpdatedAt, ...rightStable } = right;
		return isDeepStrictEqual(leftStable, rightStable);
	};
	const identities = /* @__PURE__ */ new Set([target.canonicalKey, ...target.storeKeys]);
	return await runExclusiveSessionLifecycleMutation({
		scope: target.storePath,
		identities,
		prepare: async () => {
			if (isSessionWorkAdmissionActive(target.storePath, identities)) throw new Error(`Session "${target.canonicalKey}" is still active; retry creation later.`);
		},
		run: async () => {
			const afterCreate = params.afterCreate;
			let callbackContext;
			let finalEntryPatch;
			let rollbackExpectedEntry;
			const runAfterCreate = async (context) => {
				callbackContext = context;
				if (acpInitial) {
					const meta = initialAcpMeta(Date.now());
					if (!(await upsertAcpSessionMeta({
						cfg: params.cfg,
						sessionKey: context.key,
						agentId: context.agentId,
						mutate: () => meta
					}))?.acp) throw new Error(`could not persist initial ACP binding for ${context.key}`);
					const persistedEntry = getSessionEntry({
						sessionKey: context.key,
						storePath: context.storePath,
						readConsistency: "latest"
					});
					if (!persistedEntry) throw new Error(`created ACP session ${context.key} disappeared during initialization`);
					callbackContext = {
						...context,
						entry: persistedEntry
					};
				}
				rollbackExpectedEntry = structuredClone(callbackContext.entry);
				if (!afterCreate) return;
				const finalPatch = await afterCreate({
					key: callbackContext.key,
					agentId: callbackContext.agentId,
					sessionId: callbackContext.entry.sessionId,
					entry: structuredClone(callbackContext.entry)
				});
				if (finalPatch === void 0) return;
				const patchKeys = Object.keys(finalPatch);
				if (patchKeys.length !== 1 || patchKeys[0] !== "pluginExtensions") throw new Error("session creation final patch may only contain pluginExtensions");
				finalEntryPatch = { pluginExtensions: structuredClone(finalPatch.pluginExtensions) };
			};
			try {
				const matchingEntry = params.recoverMatchingInitialEntry === true ? getSessionEntry({
					sessionKey: target.canonicalKey,
					storePath: target.storePath,
					readConsistency: "latest"
				}) : void 0;
				let recovered = false;
				let created;
				if (matchingEntry) {
					const expectedSpawnedCwd = params.spawnedCwd?.trim() || void 0;
					const expectedExecNode = params.execNode?.trim() || void 0;
					const expectedExecCwd = params.execCwd?.trim() || void 0;
					const matchingAcpMeta = acpInitial ? readAcpSessionMetaForEntry({
						sessionKey: target.canonicalKey,
						agentId: target.agentId,
						entry: matchingEntry
					}) : void 0;
					if (!(matchingEntry.initializationPending === true && matchingEntry.agentHarnessId === harnessInitial?.agentHarnessId && matchingEntry.pluginOwnerId === pluginInitial?.pluginOwnerId && matchingEntry.modelSelectionLocked === params.initialEntry.modelSelectionLocked && (!cliInitial || matchingEntry.providerOverride === cliInitial.cliBackendId && matchingEntry.modelOverride === cliInitial.model && isDeepStrictEqual(matchingEntry.cliSessionBindings?.[cliInitial.cliBackendId], cliInitial.cliSessionBinding)) && (!acpInitial || isDeepStrictEqual(matchingEntry.acpSessionBinding, persistedAcpBinding) && (matchingAcpMeta === void 0 || acpMetaMatches(matchingAcpMeta))) && matchingEntry.spawnedCwd === expectedSpawnedCwd && matchingEntry.execNode === expectedExecNode && matchingEntry.execCwd === expectedExecCwd && isDeepStrictEqual(matchingEntry.pluginExtensions, params.initialEntry.pluginExtensions))) throw new Error(`Session "${target.canonicalKey}" does not match its trusted recovery state.`);
					if (!afterCreate) throw new Error("session creation recovery requires an initializer");
					recovered = true;
					created = {
						key: target.canonicalKey,
						agentId: target.agentId,
						entry: matchingEntry
					};
					await runAfterCreate({
						...created,
						storePath: target.storePath
					});
				} else {
					const result = await createGatewaySession({
						cfg: params.cfg,
						key: params.key,
						...params.agentId !== void 0 ? { agentId: params.agentId } : {},
						...params.label !== void 0 ? { label: params.label } : {},
						...params.spawnedCwd !== void 0 ? { spawnedCwd: params.spawnedCwd } : {},
						...params.execNode !== void 0 ? { execNode: params.execNode } : {},
						...params.execCwd !== void 0 ? { execCwd: params.execCwd } : {},
						initialEntry: {
							...harnessInitial ? { agentHarnessId: harnessInitial.agentHarnessId } : {},
							...cliInitial ? {
								pluginOwnerId: cliInitial.pluginOwnerId,
								providerOverride: cliInitial.cliBackendId,
								modelOverride: cliInitial.model,
								modelOverrideRouteResolution: "resolved",
								cliSessionBindings: { [cliInitial.cliBackendId]: cliInitial.cliSessionBinding }
							} : {},
							...acpInitial ? {
								pluginOwnerId: acpInitial.pluginOwnerId,
								acpSessionBinding: persistedAcpBinding
							} : {},
							...params.initialEntry.modelSelectionLocked === true ? { modelSelectionLocked: true } : {},
							...params.initialEntry.pluginExtensions ? { pluginExtensions: params.initialEntry.pluginExtensions } : {},
							...initializesAfterCreate ? { initializationPending: true } : {}
						},
						...harnessInitial ? { authorizedAgentHarnessId: harnessInitial.agentHarnessId } : {},
						...pluginInitial?.pluginOwnerId ? { authorizedPluginId: pluginInitial.pluginOwnerId } : {},
						creation: {
							via: "plugin",
							actor: {
								type: "system",
								...pluginInitial?.pluginOwnerId ? { id: pluginInitial.pluginOwnerId } : {}
							}
						},
						commandSource: "plugin-runtime",
						...initializesAfterCreate ? { afterCreate: runAfterCreate } : {}
					});
					if (!result.ok) throw new Error(result.error.message);
					created = result;
				}
				if (recovered && !finalEntryPatch) throw new Error("session creation recovery requires a final patch");
				let finalEntry = created.entry;
				if (initializesAfterCreate) {
					const patch = {
						...finalEntryPatch,
						initializationPending: void 0,
						...acpInitial ? { acpSessionBinding: void 0 } : {}
					};
					const expectedEntry = rollbackExpectedEntry;
					if (!callbackContext || !expectedEntry) throw new Error("session creation final patch is missing its created entry");
					const createdContext = callbackContext;
					const finalized = await patchSessionEntryCore({
						sessionKey: createdContext.key,
						storePath: createdContext.storePath
					}, (currentEntry) => {
						if (JSON.stringify(currentEntry) !== JSON.stringify(expectedEntry)) throw new Error(`created session ${createdContext.key} changed before finalization`);
						return patch;
					}, {
						preserveActivity: true,
						requireWriteSuccess: true
					});
					if (!finalized) throw new Error(`created session ${createdContext.key} disappeared before finalization`);
					finalEntry = finalized;
					rollbackExpectedEntry = structuredClone(finalized);
				}
				return {
					key: created.key,
					agentId: created.agentId,
					sessionId: finalEntry.sessionId,
					entry: finalEntry
				};
			} catch (error) {
				if (!callbackContext) throw error;
				try {
					let expectedEntry = rollbackExpectedEntry ?? callbackContext.entry;
					if (acpInitial && !rollbackExpectedEntry) {
						const currentEntry = getSessionEntry({
							sessionKey: callbackContext.key,
							storePath: callbackContext.storePath,
							readConsistency: "latest"
						});
						if (currentEntry && matchesExceptUpdatedAt(currentEntry, callbackContext.entry)) expectedEntry = currentEntry;
					}
					const rollbackParams = {
						agentId: callbackContext.agentId,
						archiveTranscript: true,
						expectedEntry,
						expectedSessionId: callbackContext.entry.sessionId,
						expectedUpdatedAt: expectedEntry.updatedAt,
						storePath: callbackContext.storePath,
						target: {
							canonicalKey: callbackContext.key,
							storeKeys: [callbackContext.key]
						}
					};
					if (!(expectedEntry.modelSelectionLocked === true ? expectedEntry.agentHarnessId ? await rollbackAgentHarnessSessionEntryLifecycle(rollbackParams) : await rollbackPluginOwnedSessionEntryLifecycle({
						...rollbackParams,
						expectedPluginOwnerId: pluginInitial?.pluginOwnerId ?? ""
					}) : await deleteSessionEntryLifecycle(rollbackParams)).deleted) throw new Error(`created session ${callbackContext.key} changed before rollback`, { cause: error });
					if (acpInitial) await upsertAcpSessionMeta({
						cfg: params.cfg,
						sessionKey: callbackContext.key,
						agentId: callbackContext.agentId,
						mutate: () => null
					});
				} catch (rollbackError) {
					throw new AggregateError([error, rollbackError], `Session initialization failed and guarded rollback did not complete for ${callbackContext.key}.`, { cause: rollbackError });
				}
				throw error;
			}
		}
	});
}
async function runWithSessionWorkAdmission(params, run) {
	const initialEntry = getSessionEntry({
		storePath: params.storePath,
		sessionKey: params.sessionKey,
		readConsistency: "latest"
	});
	const lifecycleAbortController = new AbortController();
	const admission = await beginSessionWorkAdmission({
		scope: params.storePath,
		identities: [params.sessionKey, initialEntry?.sessionId],
		signal: params.signal,
		onInterrupt: () => lifecycleAbortController.abort(/* @__PURE__ */ new Error("Agent work interrupted by a session lifecycle change.")),
		assertAllowed: () => {
			const currentEntry = getSessionEntry({
				storePath: params.storePath,
				sessionKey: params.sessionKey,
				readConsistency: "latest"
			});
			if (initialEntry ? !currentEntry || currentEntry.sessionId !== initialEntry.sessionId : Boolean(currentEntry)) throw new Error(`Session "${params.sessionKey}" changed while starting work. Retry.`);
			const archivedSessionError = resolveSessionWorkStartError(params.sessionKey, currentEntry);
			if (archivedSessionError) throw new Error(archivedSessionError);
		}
	});
	try {
		const signal = params.signal ? AbortSignal.any([params.signal, lifecycleAbortController.signal]) : lifecycleAbortController.signal;
		return await admission.run(async () => await run(signal));
	} finally {
		admission.release();
	}
}
/** Creates the plugin runtime agent facade with lazy embedded-agent/session helpers. */
function createRuntimeAgent() {
	const agentRuntime = {
		defaults: {
			model: DEFAULT_MODEL,
			provider: DEFAULT_PROVIDER
		},
		resolveAgentDir,
		resolveAgentWorkspaceDir,
		resolveAgentIdentity,
		resolveSessionCatalogCreateTarget: resolveAgentCatalogCreateTarget,
		resolveThinkingDefault,
		normalizeThinkingLevel: normalizeThinkLevel,
		resolveThinkingPolicy: (params) => {
			const cfg = getRuntimeConfig();
			const effectiveRuntime = params.agentRuntime ? concretizeAgentRuntime(params.agentRuntime) : params.provider && params.model ? resolveEffectiveAgentRuntime({
				cfg,
				provider: params.provider,
				modelId: params.model
			}) : void 0;
			const profile = resolveThinkingProfile({
				...params,
				agentRuntime: effectiveRuntime,
				catalog: resolveRuntimeThinkingCatalog(params, () => buildConfiguredModelCatalog({ cfg: getRuntimeConfig() }))
			});
			const policy = { levels: profile.levels.map(({ id, label }) => ({
				id,
				label
			})) };
			return profile.defaultLevel ? {
				...policy,
				defaultLevel: profile.defaultLevel
			} : policy;
		},
		resolveAgentTimeoutMs,
		resolveCliBackendDispatchEligibility: resolveEmbeddedCliBackendDispatchEligibility,
		ensureAgentWorkspace
	};
	defineCachedValue(agentRuntime, "runEmbeddedAgent", () => createLazyRuntimeMethod(loadEmbeddedAgentRuntime, (runtime) => runtime.runPluginEmbeddedAgent));
	defineCachedValue(agentRuntime, "runEmbeddedPiAgent", () => agentRuntime.runEmbeddedAgent);
	defineCachedValue(agentRuntime, "session", () => ({
		resolveStorePath: resolveSessionStorePathCore,
		createSessionEntry,
		getSessionEntry,
		listSessionEntries,
		patchSessionEntry,
		upsertSessionEntry,
		runWithWorkAdmission: runWithSessionWorkAdmission,
		updateSessionStoreEntry
	}));
	return agentRuntime;
}
//#endregion
//#region src/plugins/runtime/runtime-config.ts
function createRuntimeConfig() {
	return {
		current: getRuntimeConfig,
		mutateConfigFile: async (params) => await mutateConfigFile({
			...params,
			writeOptions: params.writeOptions
		}),
		replaceConfigFile: async (params) => await replaceConfigFile({
			...params,
			writeOptions: params.writeOptions
		})
	};
}
//#endregion
//#region src/plugins/runtime/runtime-events.ts
/** Creates the plugin runtime event subscription facade. */
function createRuntimeEvents() {
	return {
		onAgentEvent,
		onSessionTranscriptUpdate
	};
}
//#endregion
//#region src/plugins/runtime/runtime-logging.ts
function writeRuntimeLog(log, message, meta) {
	if (meta && Object.keys(meta).length > 0) {
		log(meta, message);
		return;
	}
	log(message);
}
/** Creates the plugin runtime logging facade. */
function createRuntimeLogging() {
	return {
		shouldLogVerbose,
		getChildLogger: (bindings, opts) => {
			const overrideLevel = opts?.level ? normalizeLogLevel(opts.level) : void 0;
			const childOpts = overrideLevel ? { level: overrideLevel } : void 0;
			const emit = (level) => (message, meta) => {
				if (!overrideLevel && !isFileLogLevelEnabled(level)) return;
				const logger = getChildLogger(bindings, childOpts);
				writeRuntimeLog(logger[level].bind(logger), message, meta);
			};
			return {
				debug: emit("debug"),
				info: emit("info"),
				warn: emit("warn"),
				error: emit("error")
			};
		}
	};
}
//#endregion
//#region src/plugins/runtime/runtime-media.ts
/** Creates the plugin runtime media facade. */
function createRuntimeMedia() {
	return {
		loadWebMedia,
		detectMime,
		mediaKindFromMime,
		isVoiceCompatibleAudio: isVoiceMessageCompatibleAudio,
		getImageMetadata,
		resizeToJpeg
	};
}
//#endregion
//#region src/plugins/runtime/native-deps.ts
/** Formats concise guidance for installing and rebuilding a native dependency. */
function formatNativeDependencyHint(params) {
	const manager = params.manager ?? "pnpm";
	const rebuildCommand = params.rebuildCommand ?? (manager === "npm" ? `npm rebuild ${params.packageName}` : manager === "yarn" ? `yarn rebuild ${params.packageName}` : `pnpm rebuild ${params.packageName}`);
	const steps = [
		params.approveBuildsCommand ?? (manager === "pnpm" ? `pnpm approve-builds (select ${params.packageName})` : void 0),
		rebuildCommand,
		params.downloadCommand
	].filter((step) => Boolean(step));
	if (steps.length === 0) return `Install ${params.packageName} and rebuild its native module.`;
	return `Install ${params.packageName} and rebuild its native module (${steps.join("; ")}).`;
}
//#endregion
//#region src/plugins/runtime/runtime-system.ts
const runHeartbeatOnceInternal = createLazyRuntimeMethod(createLazyRuntimeModule(() => import("./heartbeat-runner-CQMX_Klm.js")), (runtime) => runtime.runHeartbeatOnce);
/** Creates the plugin runtime system facade with heartbeat/event/process helpers. */
function createRuntimeSystem() {
	const requestHeartbeatNow = (opts) => requestHeartbeat({
		source: opts?.source ?? "other",
		intent: opts?.intent ?? "immediate",
		reason: opts?.reason,
		coalesceMs: opts?.coalesceMs,
		agentId: opts?.agentId,
		sessionKey: opts?.sessionKey,
		heartbeat: opts?.heartbeat
	});
	return {
		enqueueSystemEvent,
		requestHeartbeat,
		requestHeartbeatNow,
		runHeartbeatOnce: (opts) => {
			const { reason, agentId, sessionKey, heartbeat } = opts ?? {};
			return runHeartbeatOnceInternal({
				reason,
				agentId,
				sessionKey,
				heartbeat: heartbeat ? { target: heartbeat.target } : void 0
			});
		},
		runCommandWithTimeout,
		formatNativeDependencyHint
	};
}
//#endregion
//#region src/plugins/runtime/runtime-taskflow.ts
function assertSessionKey$1(sessionKey, errorMessage) {
	const normalized = sessionKey?.trim();
	if (!normalized) throw new Error(errorMessage);
	return normalized;
}
function asManagedTaskFlowRecord(flow) {
	if (!flow || flow.syncMode !== "managed" || !flow.controllerId) return;
	return flow;
}
function mapFlowUpdateResult(result) {
	if (result.applied) {
		const managed = asManagedTaskFlowRecord(result.flow);
		if (!managed) return {
			applied: false,
			code: "not_managed",
			current: result.flow
		};
		return {
			applied: true,
			flow: managed
		};
	}
	return {
		applied: false,
		code: result.reason,
		...result.current ? { current: result.current } : {}
	};
}
function applyManagedFlowMutationForOwner(params) {
	const flow = getTaskFlowByIdForOwner({
		flowId: params.flowId,
		callerOwnerKey: params.ownerKey
	});
	if (!flow) return {
		applied: false,
		code: "not_found"
	};
	const managed = asManagedTaskFlowRecord(flow);
	if (!managed) return {
		applied: false,
		code: "not_managed",
		current: flow
	};
	return mapFlowUpdateResult(params.mutate(managed.flowId));
}
function createBoundTaskFlowRuntime(params) {
	const ownerKey = assertSessionKey$1(params.sessionKey, "TaskFlow runtime requires a bound sessionKey.");
	const requesterOrigin = params.requesterOrigin ? normalizeDeliveryContext(params.requesterOrigin) : void 0;
	const tryCreateManaged = (input) => {
		return asManagedTaskFlowRecord(createManagedTaskFlow({
			ownerKey,
			controllerId: input.controllerId,
			requesterOrigin,
			status: input.status,
			notifyPolicy: input.notifyPolicy,
			goal: input.goal,
			currentStep: input.currentStep,
			stateJson: input.stateJson,
			waitJson: input.waitJson,
			cancelRequestedAt: input.cancelRequestedAt,
			createdAt: input.createdAt,
			updatedAt: input.updatedAt,
			endedAt: input.endedAt
		}) ?? void 0) ?? null;
	};
	return {
		sessionKey: ownerKey,
		...requesterOrigin ? { requesterOrigin } : {},
		createManaged: (input) => {
			const flow = tryCreateManaged(input);
			if (!flow) throw new Error("TaskFlow persistence failed.");
			return flow;
		},
		tryCreateManaged,
		get: (flowId) => getTaskFlowByIdForOwner({
			flowId,
			callerOwnerKey: ownerKey
		}),
		list: () => listTaskFlowsForOwner({ callerOwnerKey: ownerKey }),
		findLatest: () => findLatestTaskFlowForOwner({ callerOwnerKey: ownerKey }),
		resolve: (token) => resolveTaskFlowForLookupTokenForOwner({
			token,
			callerOwnerKey: ownerKey
		}),
		getTaskSummary: (flowId) => {
			const flow = getTaskFlowByIdForOwner({
				flowId,
				callerOwnerKey: ownerKey
			});
			return flow ? getFlowTaskSummary(flow.flowId) : void 0;
		},
		setWaiting: (input) => applyManagedFlowMutationForOwner({
			flowId: input.flowId,
			ownerKey,
			mutate: (flowId) => setFlowWaiting({
				flowId,
				expectedRevision: input.expectedRevision,
				currentStep: input.currentStep,
				stateJson: input.stateJson,
				waitJson: input.waitJson,
				blockedTaskId: input.blockedTaskId,
				blockedSummary: input.blockedSummary,
				updatedAt: input.updatedAt
			})
		}),
		resume: (input) => applyManagedFlowMutationForOwner({
			flowId: input.flowId,
			ownerKey,
			mutate: (flowId) => resumeFlow({
				flowId,
				expectedRevision: input.expectedRevision,
				status: input.status,
				currentStep: input.currentStep,
				stateJson: input.stateJson,
				updatedAt: input.updatedAt
			})
		}),
		finish: (input) => applyManagedFlowMutationForOwner({
			flowId: input.flowId,
			ownerKey,
			mutate: (flowId) => finishFlow({
				flowId,
				expectedRevision: input.expectedRevision,
				stateJson: input.stateJson,
				updatedAt: input.updatedAt,
				endedAt: input.endedAt
			})
		}),
		fail: (input) => applyManagedFlowMutationForOwner({
			flowId: input.flowId,
			ownerKey,
			mutate: (flowId) => failFlow({
				flowId,
				expectedRevision: input.expectedRevision,
				stateJson: input.stateJson,
				blockedTaskId: input.blockedTaskId,
				blockedSummary: input.blockedSummary,
				updatedAt: input.updatedAt,
				endedAt: input.endedAt
			})
		}),
		requestCancel: (input) => applyManagedFlowMutationForOwner({
			flowId: input.flowId,
			ownerKey,
			mutate: (flowId) => requestFlowCancel({
				flowId,
				expectedRevision: input.expectedRevision,
				cancelRequestedAt: input.cancelRequestedAt
			})
		}),
		cancel: ({ flowId, cfg }) => cancelFlowByIdForOwner({
			cfg,
			flowId,
			callerOwnerKey: ownerKey
		}),
		runTask: (input) => {
			const created = runTaskInFlowForOwner({
				flowId: input.flowId,
				callerOwnerKey: ownerKey,
				runtime: input.runtime,
				sourceId: input.sourceId,
				childSessionKey: input.childSessionKey,
				parentTaskId: input.parentTaskId,
				agentId: input.agentId,
				runId: input.runId,
				label: input.label,
				task: input.task,
				preferMetadata: input.preferMetadata,
				notifyPolicy: input.notifyPolicy,
				deliveryStatus: input.deliveryStatus,
				status: input.status,
				startedAt: input.startedAt,
				lastEventAt: input.lastEventAt,
				progressSummary: input.progressSummary
			});
			if (!created.created) return {
				created: false,
				found: created.found,
				reason: created.reason ?? "Task was not created.",
				...created.flow ? { flow: created.flow } : {}
			};
			const managed = asManagedTaskFlowRecord(created.flow);
			if (!managed) return {
				created: false,
				found: true,
				reason: "TaskFlow does not accept managed child tasks.",
				flow: created.flow
			};
			if (!created.task) return {
				created: false,
				found: true,
				reason: "Task was not created.",
				flow: created.flow
			};
			return {
				created: true,
				flow: managed,
				task: created.task
			};
		}
	};
}
function createRuntimeTaskFlow() {
	return {
		bindSession: (params) => createBoundTaskFlowRuntime({
			sessionKey: params.sessionKey,
			requesterOrigin: params.requesterOrigin
		}),
		fromToolContext: (ctx) => createBoundTaskFlowRuntime({
			sessionKey: assertSessionKey$1(ctx.sessionKey, "TaskFlow runtime requires tool context with a sessionKey."),
			requesterOrigin: ctx.deliveryContext
		})
	};
}
//#endregion
//#region src/tasks/task-domain-views.ts
/** Maps internal task summary counts to the plugin task-domain view contract. */
function mapTaskRunAggregateSummary(summary) {
	return {
		total: summary.total,
		active: summary.active,
		terminal: summary.terminal,
		failures: summary.failures,
		byStatus: { ...summary.byStatus },
		byRuntime: { ...summary.byRuntime }
	};
}
function mapTaskRunView(task) {
	return {
		id: task.taskId,
		runtime: task.runtime,
		...task.sourceId ? { sourceId: task.sourceId } : {},
		sessionKey: task.requesterSessionKey,
		ownerKey: task.ownerKey,
		scope: task.scopeKind,
		...task.childSessionKey ? { childSessionKey: task.childSessionKey } : {},
		...task.parentFlowId ? { flowId: task.parentFlowId } : {},
		...task.parentTaskId ? { parentTaskId: task.parentTaskId } : {},
		...task.agentId ? { agentId: task.agentId } : {},
		...task.runId ? { runId: task.runId } : {},
		...task.label ? { label: task.label } : {},
		title: task.task,
		status: task.status,
		deliveryStatus: task.deliveryStatus,
		notifyPolicy: task.notifyPolicy,
		createdAt: task.createdAt,
		...task.startedAt !== void 0 ? { startedAt: task.startedAt } : {},
		...task.endedAt !== void 0 ? { endedAt: task.endedAt } : {},
		...task.lastEventAt !== void 0 ? { lastEventAt: task.lastEventAt } : {},
		...task.cleanupAfter !== void 0 ? { cleanupAfter: task.cleanupAfter } : {},
		...task.error ? { error: task.error } : {},
		...task.progressSummary ? { progressSummary: task.progressSummary } : {},
		...task.terminalSummary ? { terminalSummary: task.terminalSummary } : {},
		...task.terminalOutcome ? { terminalOutcome: task.terminalOutcome } : {}
	};
}
function mapTaskRunDetail(task) {
	return mapTaskRunView(task);
}
function mapTaskFlowView(flow) {
	return {
		id: flow.flowId,
		ownerKey: flow.ownerKey,
		...flow.requesterOrigin ? { requesterOrigin: { ...flow.requesterOrigin } } : {},
		status: flow.status,
		notifyPolicy: flow.notifyPolicy,
		goal: flow.goal,
		...flow.currentStep ? { currentStep: flow.currentStep } : {},
		...flow.cancelRequestedAt !== void 0 ? { cancelRequestedAt: flow.cancelRequestedAt } : {},
		createdAt: flow.createdAt,
		updatedAt: flow.updatedAt,
		...flow.endedAt !== void 0 ? { endedAt: flow.endedAt } : {}
	};
}
function mapTaskFlowDetail(params) {
	const summary = params.summary ?? summarizeTaskRecords(params.tasks);
	return {
		...mapTaskFlowView(params.flow),
		...params.flow.stateJson !== void 0 ? { state: params.flow.stateJson } : {},
		...params.flow.waitJson !== void 0 ? { wait: params.flow.waitJson } : {},
		...params.flow.blockedTaskId || params.flow.blockedSummary ? { blocked: {
			...params.flow.blockedTaskId ? { taskId: params.flow.blockedTaskId } : {},
			...params.flow.blockedSummary ? { summary: params.flow.blockedSummary } : {}
		} } : {},
		tasks: params.tasks.map((task) => mapTaskRunView(task)),
		taskSummary: mapTaskRunAggregateSummary(summary)
	};
}
//#endregion
//#region src/plugins/runtime/runtime-tasks.ts
function assertSessionKey(sessionKey, errorMessage) {
	const normalized = sessionKey?.trim();
	if (!normalized) throw new Error(errorMessage);
	return normalized;
}
function mapCancelledTaskResult(result) {
	return {
		found: result.found,
		cancelled: result.cancelled,
		...result.reason ? { reason: result.reason } : {},
		...result.task ? { task: mapTaskRunDetail(result.task) } : {}
	};
}
function createBoundTaskRunsRuntime(params) {
	const ownerKey = assertSessionKey(params.sessionKey, "Tasks runtime requires a bound sessionKey.");
	const requesterOrigin = params.requesterOrigin ? normalizeDeliveryContext(params.requesterOrigin) : void 0;
	return {
		sessionKey: ownerKey,
		...requesterOrigin ? { requesterOrigin } : {},
		get: (taskId) => {
			const task = getTaskByIdForOwner({
				taskId,
				callerOwnerKey: ownerKey,
				callerAgentId: params.agentId
			});
			return task ? mapTaskRunDetail(task) : void 0;
		},
		list: () => listTasksForRelatedSessionKeyForOwner({
			relatedSessionKey: ownerKey,
			callerOwnerKey: ownerKey,
			callerAgentId: params.agentId
		}).map((task) => mapTaskRunView(task)),
		findLatest: () => {
			const task = findLatestTaskForRelatedSessionKeyForOwner({
				relatedSessionKey: ownerKey,
				callerOwnerKey: ownerKey,
				callerAgentId: params.agentId
			});
			return task ? mapTaskRunDetail(task) : void 0;
		},
		resolve: (token) => {
			const task = resolveTaskForLookupTokenForOwner({
				token,
				callerOwnerKey: ownerKey,
				callerAgentId: params.agentId
			});
			return task ? mapTaskRunDetail(task) : void 0;
		},
		cancel: async ({ taskId, cfg }) => {
			const task = getTaskByIdForOwner({
				taskId,
				callerOwnerKey: ownerKey,
				callerAgentId: params.agentId
			});
			if (!task) return {
				found: false,
				cancelled: false,
				reason: "Task not found."
			};
			return mapCancelledTaskResult(await cancelDetachedTaskRunById({
				cfg,
				taskId: task.taskId
			}));
		}
	};
}
function createBoundTaskFlowsRuntime(params) {
	const ownerKey = assertSessionKey(params.sessionKey, "TaskFlow runtime requires a bound sessionKey.");
	const requesterOrigin = params.requesterOrigin ? normalizeDeliveryContext(params.requesterOrigin) : void 0;
	const getDetail = (flowId) => {
		const flow = getTaskFlowByIdForOwner({
			flowId,
			callerOwnerKey: ownerKey
		});
		if (!flow) return;
		return mapTaskFlowDetail({
			flow,
			tasks: listTasksForFlowId(flow.flowId),
			summary: getFlowTaskSummary(flow.flowId)
		});
	};
	return {
		sessionKey: ownerKey,
		...requesterOrigin ? { requesterOrigin } : {},
		get: (flowId) => getDetail(flowId),
		list: () => listTaskFlowsForOwner({ callerOwnerKey: ownerKey }).map((flow) => mapTaskFlowView(flow)),
		findLatest: () => {
			const flow = findLatestTaskFlowForOwner({ callerOwnerKey: ownerKey });
			return flow ? getDetail(flow.flowId) : void 0;
		},
		resolve: (token) => {
			const flow = resolveTaskFlowForLookupTokenForOwner({
				token,
				callerOwnerKey: ownerKey
			});
			return flow ? getDetail(flow.flowId) : void 0;
		},
		getTaskSummary: (flowId) => {
			const flow = getTaskFlowByIdForOwner({
				flowId,
				callerOwnerKey: ownerKey
			});
			return flow ? mapTaskRunAggregateSummary(getFlowTaskSummary(flow.flowId)) : void 0;
		}
	};
}
function createRuntimeTaskRuns() {
	return {
		bindSession: (params) => createBoundTaskRunsRuntime({
			sessionKey: params.sessionKey,
			agentId: params.agentId,
			requesterOrigin: params.requesterOrigin
		}),
		fromToolContext: (ctx) => createBoundTaskRunsRuntime({
			sessionKey: assertSessionKey(ctx.sessionKey, "Tasks runtime requires tool context with a sessionKey."),
			agentId: ctx.agentId,
			requesterOrigin: ctx.deliveryContext
		})
	};
}
function createRuntimeTaskFlows() {
	return {
		bindSession: (params) => createBoundTaskFlowsRuntime({
			sessionKey: params.sessionKey,
			requesterOrigin: params.requesterOrigin
		}),
		fromToolContext: (ctx) => createBoundTaskFlowsRuntime({
			sessionKey: assertSessionKey(ctx.sessionKey, "TaskFlow runtime requires tool context with a sessionKey."),
			requesterOrigin: ctx.deliveryContext
		})
	};
}
function createRuntimeTasks(params) {
	return {
		runs: createRuntimeTaskRuns(),
		flows: createRuntimeTaskFlows(),
		managedFlows: params.managedTaskFlow
	};
}
//#endregion
//#region src/plugins/runtime/index.ts
const loadTtsRuntime = createLazyRuntimeModule(() => import("./plugin-sdk/tts-runtime.js"));
const loadTtsRequestRuntime = createLazyRuntimeModule(() => import("./runtime-tts-request-CwoZHriF.js"));
const loadMediaUnderstandingRuntime = createLazyRuntimeModule(() => import("./runtime-C1w4XNE2.js"));
const loadModelAuthRuntime = createLazyRuntimeModule(() => import("./runtime-model-auth.runtime.js"));
const loadGatewayPluginRuntime = createLazyRuntimeModule(() => import("./server-plugins-BpaY45T6.js"));
function createRuntimeGateway() {
	return {
		isAvailable: async () => {
			return (await loadGatewayPluginRuntime()).hasInProcessGatewayContext();
		},
		request: async (method, params, options) => {
			return (await loadGatewayPluginRuntime()).dispatchTrustedPluginGatewayMethod(method, params, options);
		}
	};
}
function createRuntimeTts() {
	const bindTtsRuntime = createLazyRuntimeMethodBinder(loadTtsRuntime);
	return {
		prepareTtsRequest: createLazyRuntimeMethodBinder(loadTtsRequestRuntime)((runtime) => runtime.prepareTtsRequest),
		textToSpeech: bindTtsRuntime((runtime) => runtime.textToSpeech),
		textToSpeechStream: bindTtsRuntime((runtime) => runtime.textToSpeechStream),
		textToSpeechTelephony: bindTtsRuntime((runtime) => runtime.textToSpeechTelephony),
		listVoices: bindTtsRuntime((runtime) => runtime.listSpeechVoices)
	};
}
function createRuntimeMediaUnderstandingFacade() {
	const bindMediaUnderstandingRuntime = createLazyRuntimeMethodBinder(loadMediaUnderstandingRuntime);
	return {
		runFile: bindMediaUnderstandingRuntime((runtime) => runtime.runMediaUnderstandingFile),
		describeImageFile: bindMediaUnderstandingRuntime((runtime) => runtime.describeImageFile),
		describeImageFileWithModel: bindMediaUnderstandingRuntime((runtime) => runtime.describeImageFileWithModel),
		extractStructuredWithModel: bindMediaUnderstandingRuntime((runtime) => runtime.extractStructuredWithModel),
		describeVideoFile: bindMediaUnderstandingRuntime((runtime) => runtime.describeVideoFile),
		transcribeAudioFile: bindMediaUnderstandingRuntime((runtime) => runtime.transcribeAudioFile)
	};
}
function createRuntimeImageGeneration() {
	return {
		generate: (params) => generateImage(params),
		listProviders: (params) => listRuntimeImageGenerationProviders(params)
	};
}
function createRuntimeVideoGeneration() {
	return {
		generate: (params) => generateVideo(params),
		listProviders: (params) => listRuntimeVideoGenerationProviders(params)
	};
}
function createRuntimeMusicGeneration() {
	return {
		generate: (params) => generateMusic(params),
		listProviders: (params) => listRuntimeMusicGenerationProviders(params)
	};
}
function createRuntimeLlmFacade() {
	const loadAcquireLocalService = createLazyRuntimeMethod(() => import("./provider-local-service-CacgVExC.js"), (runtime) => runtime.createConfiguredProviderLocalServiceAcquirer(getRuntimeConfig));
	const loadLlm = createLazyRuntimeSurface(() => import("./runtime-llm.runtime.js"), (m) => m.createRuntimeLlm({
		getConfig: getRuntimeConfig,
		authority: { allowComplete: true }
	}));
	return {
		acquireLocalService: (...args) => loadAcquireLocalService(...args),
		complete: async (params) => {
			return (await loadLlm()).complete(params);
		}
	};
}
function createRuntimeModelAuth() {
	const getApiKeyForModel = createLazyRuntimeMethod(loadModelAuthRuntime, (runtime) => runtime.getApiKeyForModel);
	const getRuntimeAuthForModel = createLazyRuntimeMethod(loadModelAuthRuntime, (runtime) => runtime.getRuntimeAuthForModelCore);
	const resolveApiKeyForProvider = createLazyRuntimeMethod(loadModelAuthRuntime, (runtime) => runtime.resolveProviderRuntimeApiKey);
	return {
		getApiKeyForModel: (params) => getApiKeyForModel({
			model: params.model,
			cfg: params.cfg,
			workspaceDir: params.workspaceDir
		}),
		getRuntimeAuthForModel: (params) => getRuntimeAuthForModel({
			model: params.model,
			cfg: params.cfg,
			workspaceDir: params.workspaceDir
		}),
		resolveApiKeyForProvider: (params) => resolveApiKeyForProvider({
			provider: params.provider,
			cfg: params.cfg,
			workspaceDir: params.workspaceDir
		})
	};
}
function createUnavailableSubagentRuntime() {
	const unavailable = () => {
		throw new RequestScopedSubagentRuntimeError();
	};
	return {
		run: unavailable,
		waitForRun: unavailable,
		getSessionMessages: unavailable,
		deleteSession: unavailable
	};
}
function createUnavailableNodesRuntime() {
	const unavailable = () => {
		throw new Error("Plugin node runtime is only available inside the Gateway.");
	};
	return {
		list: unavailable,
		invoke: unavailable
	};
}
function createRuntimeWorktrees() {
	const loadService = () => import("./service-DCuEjlUx.js");
	return {
		async resolveCheckoutRoot(params) {
			const { findGitCheckoutRoot } = await import("./git-C2DqabfS.js");
			return findGitCheckoutRoot(params.path) ?? void 0;
		},
		async hasSelfContainedCheckoutMetadata(params) {
			const { hasSelfContainedGitMetadata } = await import("./git-C2DqabfS.js");
			return await hasSelfContainedGitMetadata(params.path);
		},
		async create(params) {
			const { managedWorktrees } = await loadService();
			const record = await managedWorktrees.create(params);
			await managedWorktrees.acquire(record.id);
			return {
				id: record.id,
				path: record.path,
				branch: record.branch
			};
		},
		async release(params) {
			const { managedWorktrees } = await loadService();
			await managedWorktrees.releaseByPath(params.path);
		},
		async removeIfLossless(params) {
			const { managedWorktrees } = await loadService();
			return managedWorktrees.removeIfLosslessByPath(params.path, {
				ownerKind: params.ownerKind,
				ownerId: params.ownerId
			});
		}
	};
}
function createRuntimeSandbox(agent) {
	const resolveWorkspaceAuthority = (params) => resolveSandboxWorkspaceAuthority({
		...params,
		sessionEntry: agent.session.getSessionEntry({
			agentId: params.agentId,
			sessionKey: params.sessionKey
		})
	});
	return {
		resolveWorkspaceAuthority,
		async prepareWorkspaceAuthority(params) {
			const authority = resolveWorkspaceAuthority(params);
			if (!authority.sandboxed || authority.confinementError) return authority;
			const { resolveSandboxContext } = await import("./context-DiItrLI3.js");
			await resolveSandboxContext({
				config: params.config,
				agentId: params.agentId,
				sessionKey: params.sessionKey,
				workspaceDir: params.workspaceDir,
				requireCurrentConfig: true
			});
			return authority;
		}
	};
}
function createPluginRuntime(_options = {}) {
	const mediaUnderstanding = createRuntimeMediaUnderstandingFacade();
	const tasks = createRuntimeTasks({ managedTaskFlow: createRuntimeTaskFlow() });
	const agent = createRuntimeAgent();
	const runtime = {
		version: VERSION,
		gateway: createRuntimeGateway(),
		config: createRuntimeConfig(),
		agent,
		subagent: _options.subagent ?? createUnavailableSubagentRuntime(),
		nodes: _options.nodes ?? createUnavailableNodesRuntime(),
		sandbox: createRuntimeSandbox(agent),
		worktrees: createRuntimeWorktrees(),
		system: createRuntimeSystem(),
		media: createRuntimeMedia(),
		webSearch: {
			listProviders: listWebSearchProviders,
			search: runWebSearch
		},
		channel: createRuntimeChannel(),
		events: createRuntimeEvents(),
		logging: createRuntimeLogging(),
		state: {
			resolveStateDir,
			openBlobStore: () => {
				throw new Error("openBlobStore is only available through the plugin runtime proxy.");
			},
			openKeyedStore: () => {
				throw new Error("openKeyedStore is only available through the plugin runtime proxy.");
			},
			openSyncKeyedStore: () => {
				throw new Error("openSyncKeyedStore is only available through the plugin runtime proxy.");
			},
			openChannelIngressQueue: () => {
				throw new Error("openChannelIngressQueue is only available through the plugin runtime proxy.");
			},
			openChannelIngressDrain: () => {
				throw new Error("openChannelIngressDrain is only available through the plugin runtime proxy.");
			}
		},
		tasks
	};
	defineCachedValue(runtime, "tts", createRuntimeTts);
	defineCachedValue(runtime, "mediaUnderstanding", () => mediaUnderstanding);
	defineCachedValue(runtime, "modelAuth", createRuntimeModelAuth);
	defineCachedValue(runtime, "imageGeneration", createRuntimeImageGeneration);
	defineCachedValue(runtime, "videoGeneration", createRuntimeVideoGeneration);
	defineCachedValue(runtime, "musicGeneration", createRuntimeMusicGeneration);
	defineCachedValue(runtime, "llm", createRuntimeLlmFacade);
	return runtime;
}
//#endregion
export { createPluginRuntime as t };
