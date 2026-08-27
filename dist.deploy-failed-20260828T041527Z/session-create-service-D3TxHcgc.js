import { r as createLazyRuntimeModule } from "./lazy-runtime-CgCh8H_K.js";
import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import "./src-BntaCZM-.js";
import { t as stableStringify } from "./stable-stringify-DoZ6Yalc.js";
import "./agent-scope-DigoIwHb.js";
import { n as normalizeAgentId } from "./agent-id-CeT3w4ap.js";
import { f as resolveAgentWorkspaceDir, l as resolveAgentDir } from "./agent-scope-config-CUBiGmG3.js";
import { a as isSubagentSessionKey, c as parseAgentSessionKey } from "./session-key-utils-Di3FvABa.js";
import { t as isIncognitoSessionKey } from "./incognito-session-key-BwpD1Lwd.js";
import { b as toAgentStoreSessionKey, f as resolveAgentIdFromSessionKey } from "./session-key-Dbce_H9p.js";
import { o as resolveSessionStorePathCore } from "./paths-DVAvlIOc.js";
import { y as normalizeOptionalAgentRuntimeId } from "./openai-routing-Chr0R2hQ.js";
import { T as resolveSubagentConfiguredModelSelection, w as resolveDefaultModelForAgent } from "./codex-route-model-ref-BJZ-8dtR.js";
import { t as ADMIN_SCOPE } from "./operator-scopes-Dw7Gu2cA.js";
import { t as ErrorCodes } from "./gateway-error-details-C2IaYyht.js";
import { r as resolveAgentMainSessionKey } from "./main-session-CPkeRwvL.js";
import { o as listSessionEntriesReadOnly } from "./session-accessor.sqlite-entry-Ik-U-wpI.js";
import { c as normalizeSessionDeliveryState } from "./delivery-context.shared-azPdmUls.js";
import { d as isSessionWorkAdmissionActive, p as runExclusiveSessionLifecycleMutation } from "./session-lifecycle-admission-BtKN0pjk.js";
import { st as buildSessionCreationStamp } from "./session-accessor.sqlite-entry-store-BIW-GrsF.js";
import { Ot as inheritSessionSelection, Q as createSessionEntryWithTranscript, zt as resolveSessionEntryAccessTarget } from "./session-accessor-fcDZuc2H.js";
import { a as isAgentHarnessSessionKey, o as isAgentHarnessSessionKeyOwnedBy, r as AGENT_HARNESS_SESSION_KEY_RESERVED_MESSAGE } from "./agent-harness-session-key-D9_Ct3Lx.js";
import { u as recordSessionCreated } from "./session-state-events-DvygRPJJ.js";
import { d as errorShape, f as missingScopeErrorShape } from "./validation-errors-rELRlKfn.js";
import "./model-selection-Cp8EGD61.js";
import { u as isEmbeddedAgentRunActive } from "./runs-eqaxGmoQ.js";
import { g as normalizeInheritedToolDenylist, h as normalizeInheritedToolAllowlist } from "./subagent-capabilities-Chg191Ne.js";
import { i as hasInternalHookListeners, n as createInternalHookEvent, u as triggerInternalHook } from "./internal-hooks-CR02IMJl.js";
import { a as isModelSelectionLocked } from "./model-overrides-BcLzAaaZ.js";
import { i as forkSessionFromParentWithDecision, t as MODEL_SELECTION_LOCKED_PARENT_FORK_MESSAGE } from "./session-fork-QEJxwfxN.js";
import { n as resolveSessionModelRef } from "./session-model-ref-Dc9mG8e_.js";
import { n as resolveRequestedSessionAgentId } from "./session-request-agent-C9E8iDY4.js";
import { n as projectPublicSessionEntry } from "./session-entry-projection-CWfZj8nO.js";
import { d as resolveGatewaySessionStoreTarget, i as loadGatewaySessionEntryReadOnly } from "./session-utils-store-Dmx2MxPy.js";
import "./session-utils-uVsFjoXC.js";
import { n as buildMainSessionRecoveryClearPatch } from "./main-session-recovery-clear-H7IP1700.js";
import { n as shouldPreserveSessionAuthProfileOverride } from "./auth-profile-preservation-CrI9_wtQ.js";
import "./embedded-agent-uA4hl59E.js";
import { t as createSessionDiffBaselineCaptureClaim } from "./session-diff-baseline-capture-6ejBT0Am.js";
import { a as resolveCreatorSandbox, t as authorizeGatewaySessionCreation } from "./operator-role-policy-il7s4lXY.js";
import { _ as resolveSessionVisibility, p as isSessionVisibilityAllowed } from "./session-sharing-DSLYm21V.js";
import { t as rollbackGatewaySessionPreparation } from "./session-lifecycle-preparation-DmXI5toe.js";
import { t as resolvePluginSessionOwnershipError } from "./session-plugin-ownership-Dk6fjq2Z.js";
import { n as resolveSessionPatchModelSelection, t as projectSessionsPatchEntry } from "./sessions-patch-u8GJWIwF.js";
import { randomUUID } from "node:crypto";
//#region src/gateway/session-create-fork-entry.ts
function buildForkedGatewaySessionEntry(entry, fork, forkSource, previousEntry) {
	return {
		...entry,
		...buildMainSessionRecoveryClearPatch(entry),
		sessionId: fork.sessionId,
		lifecycleRunId: void 0,
		lastRunId: void 0,
		forkSource: previousEntry?.forkSource ?? forkSource,
		...previousEntry?.sessionId && previousEntry.sessionId !== fork.sessionId ? { previousSessionId: previousEntry.sessionId } : {},
		totalTokens: void 0,
		totalTokensFresh: false,
		totalTokensVersion: void 0
	};
}
//#endregion
//#region src/gateway/session-create-service.ts
const loadSessionLifecycleRuntime = createLazyRuntimeModule(() => import("./sessions.runtime.js"));
function resolveSessionCreateModelSelection(cfg, agentId, input, parentEntry) {
	const model = normalizeOptionalString(typeof input === "string" ? input : input?.model);
	if (!model) {
		const inherited = inheritSessionSelection(parentEntry);
		return {
			providerOverride: inherited.providerOverride,
			modelOverride: inherited.modelOverride,
			agentRuntimeOverride: inherited.agentRuntimeOverride,
			authProfileOverride: inherited.authProfileOverride
		};
	}
	const defaults = resolveDefaultModelForAgent({
		cfg,
		agentId
	});
	const resolved = resolveSessionPatchModelSelection({
		cfg,
		catalog: [],
		raw: model,
		defaultProvider: defaults.provider,
		defaultModel: defaults.model
	});
	if (!resolved.ok) return null;
	const agentRuntimeOverride = normalizeOptionalAgentRuntimeId(typeof input === "string" ? void 0 : input?.agentRuntime);
	return {
		providerOverride: resolved.provider,
		modelOverride: resolved.model,
		...agentRuntimeOverride ? { agentRuntimeOverride } : {},
		...resolved.profile ? { authProfileOverride: resolved.profile } : {}
	};
}
async function existingModelSelectionWouldChange(params) {
	if (params.catalogModel) return true;
	const requestedThinkingLevel = normalizeOptionalString(params.requestedThinkingLevel);
	const requestedContextWindow = normalizeOptionalString(params.requestedContextWindow);
	if (requestedContextWindow && requestedContextWindow !== normalizeOptionalString(params.existingEntry.contextWindow)) return true;
	if (requestedThinkingLevel && requestedThinkingLevel !== normalizeOptionalString(params.existingEntry.thinkingLevel)) return true;
	const requestedModel = normalizeOptionalString(params.requestedModel);
	if (!requestedModel) return false;
	if (!params.loadGatewayModelCatalog) return true;
	const catalog = await params.loadGatewayModelCatalog();
	const resolved = resolveSessionPatchModelSelection({
		cfg: params.cfg,
		catalog,
		raw: requestedModel,
		defaultProvider: params.defaultProvider,
		defaultModel: params.defaultModel,
		subagentModelHint: params.subagentModelHint
	});
	if (!resolved.ok) return true;
	let existingProvider = normalizeOptionalString(params.existingEntry.providerOverride) ?? params.defaultProvider;
	let existingModel = normalizeOptionalString(params.existingEntry.modelOverride) ?? params.defaultModel;
	if (!normalizeOptionalString(params.existingEntry.modelOverride) && params.subagentModelHint) {
		const resolvedSubagentDefault = resolveSessionPatchModelSelection({
			cfg: params.cfg,
			catalog,
			raw: params.subagentModelHint,
			defaultProvider: params.defaultProvider,
			defaultModel: params.defaultModel
		});
		if (!resolvedSubagentDefault.ok) return true;
		if (!normalizeOptionalString(params.existingEntry.providerOverride)) existingProvider = resolvedSubagentDefault.provider;
		existingModel = resolvedSubagentDefault.model;
	}
	const existingProfile = normalizeOptionalString(params.existingEntry.authProfileOverride);
	const requestedProfile = normalizeOptionalString(resolved.profile);
	const profileWouldChange = requestedProfile !== void 0 ? requestedProfile !== existingProfile : existingProfile !== void 0 && !shouldPreserveSessionAuthProfileOverride({
		cfg: params.cfg,
		agentDir: resolveAgentDir(params.cfg, params.agentId),
		currentProvider: params.existingEntry.providerOverride ?? params.existingEntry.modelProvider ?? params.defaultProvider,
		entry: params.existingEntry,
		provider: resolved.provider
	});
	return resolved.provider !== existingProvider || resolved.model !== existingModel || profileWouldChange;
}
function buildDashboardSessionKey(agentId, options = {}) {
	return `agent:${agentId}:dashboard:${`${options.incognito ? "incognito-" : ""}${randomUUID()}`}`;
}
async function createGatewaySession(params) {
	const requestedKey = normalizeOptionalString(params.key);
	const parentSessionKey = normalizeOptionalString(params.parentSessionKey);
	const projectId = normalizeOptionalString(params.projectId);
	const pendingProjectGitUrl = normalizeOptionalString(params.pendingProjectGitUrl);
	const requestedToolOverrides = params.toolOverrides !== void 0;
	const explicitAgentId = params.agentId;
	const normalizedExplicitAgentId = normalizeOptionalString(explicitAgentId);
	const explicitKeyAgentId = parseAgentSessionKey(requestedKey)?.agentId;
	const selectedAgent = resolveRequestedSessionAgentId(params.cfg, requestedKey ?? (normalizedExplicitAgentId ? `agent:${normalizeAgentId(normalizedExplicitAgentId)}:main` : "main"), explicitAgentId ?? explicitKeyAgentId);
	if (!selectedAgent.ok) return selectedAgent;
	const agentId = selectedAgent.agentId;
	const catalogModel = normalizeOptionalString(params.catalogTarget?.model);
	const catalogAgentRuntime = normalizeOptionalAgentRuntimeId(params.catalogTarget?.agentRuntime);
	const catalogPluginOwnerId = normalizeOptionalString(params.catalogTarget?.pluginOwnerId);
	if (params.catalogTarget && (!catalogModel || !catalogAgentRuntime || !catalogPluginOwnerId)) return {
		ok: false,
		error: errorShape(ErrorCodes.INVALID_REQUEST, "invalid catalog session target")
	};
	if (params.succeedsParent !== void 0) {
		if (!parentSessionKey) return {
			ok: false,
			error: errorShape(ErrorCodes.INVALID_REQUEST, "succeedsParent requires parentSessionKey")
		};
		if (params.emitCommandHooks !== true) return {
			ok: false,
			error: errorShape(ErrorCodes.INVALID_REQUEST, "succeedsParent requires emitCommandHooks")
		};
		if (params.succeedsParent && params.fork === true) return {
			ok: false,
			error: errorShape(ErrorCodes.INVALID_REQUEST, "succeedsParent conflicts with fork: a fork runs in parallel to its parent")
		};
	}
	const loweredRequestedKey = normalizeOptionalLowercaseString(requestedKey);
	const explicitTargetKey = requestedKey ? loweredRequestedKey === "global" || loweredRequestedKey === "unknown" ? loweredRequestedKey : toAgentStoreSessionKey({
		agentId,
		requestKey: requestedKey,
		mainKey: params.cfg.session?.mainKey
	}) : void 0;
	const explicitTargetParts = parseAgentSessionKey(explicitTargetKey);
	const explicitIncognito = isIncognitoSessionKey(explicitTargetKey);
	const explicitDashboardIncognito = explicitIncognito && explicitTargetParts?.agentId === agentId && explicitTargetParts.rest.startsWith("dashboard:");
	if (explicitIncognito && params.incognito !== true) return {
		ok: false,
		error: errorShape(ErrorCodes.INVALID_REQUEST, "incognito-shaped session keys require incognito: true")
	};
	if (params.incognito === true && explicitTargetKey) {
		if (!explicitDashboardIncognito) return {
			ok: false,
			error: errorShape(ErrorCodes.INVALID_REQUEST, "incognito sessions are web-only")
		};
		if (listSessionEntriesReadOnly({
			agentId,
			storePath: resolveSessionStorePathCore(params.cfg.session?.store, { agentId })
		}).some(({ sessionKey }) => sessionKey === explicitTargetKey) || loadGatewaySessionEntryReadOnly(explicitTargetKey).entry) return {
			ok: false,
			error: errorShape(ErrorCodes.INVALID_REQUEST, "incognito is immutable and requires a new session key")
		};
	}
	if (params.catalogTarget && explicitTargetKey && !explicitTargetKey.startsWith(`agent:${agentId}:dashboard:`)) return {
		ok: false,
		error: errorShape(ErrorCodes.INVALID_REQUEST, "catalog sessions require a generated dashboard key")
	};
	const authorizedHarnessCreation = Boolean(explicitTargetKey && params.initialEntry && normalizeOptionalAgentRuntimeId(params.authorizedAgentHarnessId) === normalizeOptionalAgentRuntimeId(params.initialEntry.agentHarnessId) && isAgentHarnessSessionKeyOwnedBy(explicitTargetKey, params.authorizedAgentHarnessId));
	const authorizedPluginCreation = Boolean(explicitTargetKey && params.initialEntry?.pluginOwnerId && params.authorizedPluginId === params.initialEntry.pluginOwnerId);
	if (params.initialEntry?.pluginOwnerId && !authorizedPluginCreation) return {
		ok: false,
		error: errorShape(ErrorCodes.INVALID_REQUEST, "trusted plugin session owner is not authorized")
	};
	const existingHarnessEntry = explicitTargetKey && isAgentHarnessSessionKey(explicitTargetKey) ? resolveSessionEntryAccessTarget({
		cfg: params.cfg,
		sessionKey: explicitTargetKey
	}).entry : void 0;
	if (explicitTargetKey && isAgentHarnessSessionKey(explicitTargetKey) && !authorizedHarnessCreation && (!existingHarnessEntry || existingHarnessEntry.modelSelectionLocked === true)) return {
		ok: false,
		error: errorShape(ErrorCodes.INVALID_REQUEST, AGENT_HARNESS_SESSION_KEY_RESERVED_MESSAGE)
	};
	if (params.fork === true && !parentSessionKey) return {
		ok: false,
		error: errorShape(ErrorCodes.INVALID_REQUEST, "fork requires parentSessionKey")
	};
	if (params.forkFrom && params.fork !== true) return {
		ok: false,
		error: errorShape(ErrorCodes.INVALID_REQUEST, "forkFrom requires fork=true")
	};
	if (params.spawnDepth !== void 0) {
		if (!Number.isInteger(params.spawnDepth) || params.spawnDepth < 1) return {
			ok: false,
			error: errorShape(ErrorCodes.INVALID_REQUEST, "spawnDepth must be an integer >= 1")
		};
		if (!parentSessionKey) return {
			ok: false,
			error: errorShape(ErrorCodes.INVALID_REQUEST, "spawnDepth requires parentSessionKey")
		};
	}
	if (params.spawnToolPolicy && params.spawnDepth === void 0) return {
		ok: false,
		error: errorShape(ErrorCodes.INVALID_REQUEST, "spawn tool policy requires spawnDepth")
	};
	let canonicalParentSessionKey;
	let parentSessionEntry;
	let parentSelectedAgentId;
	let parentSessionTarget;
	if (parentSessionKey) {
		const parentRequestedAgent = resolveRequestedSessionAgentId(params.cfg, parentSessionKey, !parseAgentSessionKey(parentSessionKey) && ["global", "unknown"].includes(parentSessionKey.toLowerCase()) ? explicitAgentId : void 0);
		if (!parentRequestedAgent.ok) return parentRequestedAgent;
		parentSelectedAgentId = parentRequestedAgent.agentId;
		const parent = loadGatewaySessionEntryReadOnly(parentSessionKey, { agentId: parentSelectedAgentId });
		if (!parent.entry?.sessionId) return {
			ok: false,
			error: errorShape(ErrorCodes.INVALID_REQUEST, `unknown parent session: ${parentSessionKey}`)
		};
		const parentOwnershipError = resolvePluginSessionOwnershipError({
			action: params.fork === true ? "fork" : "link",
			entry: parent.entry,
			key: parent.canonicalKey,
			pluginOwnerId: params.authorizedPluginId
		});
		if (parentOwnershipError) return {
			ok: false,
			error: parentOwnershipError
		};
		if (isModelSelectionLocked(parent.entry)) return {
			ok: false,
			error: errorShape(ErrorCodes.INVALID_REQUEST, MODEL_SELECTION_LOCKED_PARENT_FORK_MESSAGE)
		};
		canonicalParentSessionKey = parent.canonicalKey;
		parentSessionEntry = parent.entry;
		parentSessionTarget = resolveGatewaySessionStoreTarget({
			cfg: params.cfg,
			key: parentSessionKey,
			...parentSelectedAgentId ? { agentId: parentSelectedAgentId } : {}
		});
	}
	const parentIncognito = parentSessionEntry?.incognito === true || isIncognitoSessionKey(canonicalParentSessionKey);
	const incognito = params.incognito === true || parentIncognito;
	if (incognito && params.requestingOperatorScopes !== void 0 && !params.requestingOperatorScopes.includes("operator.admin")) return {
		ok: false,
		error: errorShape(ErrorCodes.INVALID_REQUEST, `incognito sessions require gateway scope: ${ADMIN_SCOPE}`)
	};
	if (incognito && canonicalParentSessionKey && !parentIncognito) return {
		ok: false,
		error: errorShape(ErrorCodes.INVALID_REQUEST, "incognito sessions cannot have durable parents")
	};
	if (parentIncognito && explicitTargetKey) return {
		ok: false,
		error: errorShape(ErrorCodes.INVALID_REQUEST, "incognito sessions are web-only")
	};
	if (canonicalParentSessionKey && explicitTargetKey && resolveGatewaySessionStoreTarget({
		cfg: params.cfg,
		key: explicitTargetKey,
		agentId
	}).canonicalKey === canonicalParentSessionKey) return {
		ok: false,
		error: errorShape(ErrorCodes.INVALID_REQUEST, "sessions.create key must differ from parentSessionKey")
	};
	const targetSessionKey = explicitTargetKey ?? buildDashboardSessionKey(agentId, { incognito });
	const creationTarget = resolveGatewaySessionStoreTarget({
		cfg: params.cfg,
		key: targetSessionKey,
		agentId
	});
	if (explicitTargetKey && !params.initialEntry) {
		if (resolveSessionEntryAccessTarget({
			cfg: params.cfg,
			sessionKey: creationTarget.canonicalKey
		}).entry?.initializationPending === true) return {
			ok: false,
			error: errorShape(ErrorCodes.UNAVAILABLE, `Session ${creationTarget.canonicalKey} is still initializing; retry creation later.`)
		};
	}
	const agentMainSessionKey = resolveAgentMainSessionKey({
		cfg: params.cfg,
		agentId
	});
	const dashboardParentSessionKey = !parentSessionKey && !params.authorizedPluginId && !incognito && params.fork !== true && (params.cfg.session?.dmScope ?? "main") === "main" && params.cfg.session?.scope !== "global" && targetSessionKey !== agentMainSessionKey ? agentMainSessionKey : void 0;
	if (canonicalParentSessionKey && params.fork !== true && params.emitCommandHooks === true && !requestedKey && params.resetMainWhenUnspecified === true && !requestedToolOverrides && !parentIncognito && !params.catalogTarget && params.cfg.session?.dmScope === "main") {
		const parentAgentId = normalizeAgentId(parentSelectedAgentId ?? resolveAgentIdFromSessionKey(canonicalParentSessionKey) ?? agentId);
		const parentMainKey = resolveAgentMainSessionKey({
			cfg: params.cfg,
			agentId: parentAgentId
		});
		if (canonicalParentSessionKey === parentMainKey) {
			if (params.visibility) return {
				ok: false,
				error: errorShape(ErrorCodes.INVALID_REQUEST, "sessions.create visibility requires a new session")
			};
			const { performGatewaySessionReset } = await loadSessionLifecycleRuntime();
			const spawnedCwd = normalizeOptionalString(params.spawnedCwd);
			const execCwd = normalizeOptionalString(params.execCwd);
			const resetResult = await performGatewaySessionReset({
				key: canonicalParentSessionKey,
				...parentSelectedAgentId ? { agentId: parentSelectedAgentId } : {},
				...params.requestingOperatorProfileId ? { requestingOperatorProfileId: params.requestingOperatorProfileId } : {},
				...params.operatorRoleActor ? { operatorRoleActor: params.operatorRoleActor } : {},
				reason: "new",
				commandSource: params.commandSource,
				...params.creation ? { creation: params.creation } : {},
				...spawnedCwd ? { spawnedCwd } : {},
				...params.sessionRoot ? { sessionRoot: params.sessionRoot } : {},
				...params.permissionMode ? { permissionMode: params.permissionMode } : {},
				...params.prepareLifecycle ? { prepareLifecycle: params.prepareLifecycle } : {},
				...params.onLifecycleCleanupError ? { onLifecycleCleanupError: params.onLifecycleCleanupError } : {},
				...params.execNode ? { execNode: params.execNode } : {},
				...execCwd ? { execCwd } : {},
				...params.clearExecBinding ? { clearExecBinding: true } : {},
				...params.clearSpawnedCwd && !spawnedCwd ? { clearSpawnedCwd: true } : {},
				...params.armSessionDiffBaselineCapture ? { armSessionDiffBaselineCapture: true } : {},
				...params.commitGuard ? { assertAuthorizedInstance: params.commitGuard } : {}
			});
			if (!resetResult.ok) return resetResult;
			if ("incognitoDeleted" in resetResult) return {
				ok: false,
				error: errorShape(ErrorCodes.INVALID_REQUEST, "incognito sessions cannot reset in place")
			};
			return {
				ok: true,
				key: resetResult.key,
				agentId: resetResult.agentId,
				entry: projectPublicSessionEntry(resetResult.entry),
				resolved: resetResult.resolved,
				resetExisting: true,
				postCommit: { status: "completed" }
			};
		}
	}
	let createdContext;
	let createdNewEntry = false;
	let preparedLifecycle;
	let lifecyclePreparationCommitted = false;
	const spawnToolPolicy = params.spawnToolPolicy && canonicalParentSessionKey ? {
		completionOwnerSessionKey: normalizeOptionalString(params.spawnToolPolicy.completionOwnerSessionKey),
		allow: normalizeInheritedToolAllowlist(params.spawnToolPolicy.allow),
		deny: normalizeInheritedToolDenylist(params.spawnToolPolicy.deny),
		parentSessionKey: canonicalParentSessionKey
	} : void 0;
	const createChildSession = async () => {
		params.commitGuard?.();
		let currentParentSessionEntry = parentSessionEntry;
		if (canonicalParentSessionKey && parentSessionTarget && (params.emitCommandHooks === true || params.fork === true || params.authorizedPluginId !== void 0)) {
			const currentParentEntry = loadGatewaySessionEntryReadOnly(canonicalParentSessionKey, parentSelectedAgentId ? { agentId: parentSelectedAgentId } : void 0).entry;
			if (!currentParentEntry?.sessionId || currentParentEntry.sessionId !== parentSessionEntry?.sessionId) return {
				ok: false,
				error: errorShape(ErrorCodes.INVALID_REQUEST, `Parent session ${parentSessionKey} changed before ${params.fork === true ? "fork" : "/new"}; retry.`)
			};
			currentParentSessionEntry = currentParentEntry;
			const parentOwnershipError = resolvePluginSessionOwnershipError({
				action: params.fork === true ? "fork" : "link",
				entry: currentParentEntry,
				key: canonicalParentSessionKey,
				pluginOwnerId: params.authorizedPluginId
			});
			if (parentOwnershipError) return {
				ok: false,
				error: parentOwnershipError
			};
			if ((params.emitCommandHooks === true || params.fork === true) && isModelSelectionLocked(currentParentEntry)) return {
				ok: false,
				error: errorShape(ErrorCodes.INVALID_REQUEST, MODEL_SELECTION_LOCKED_PARENT_FORK_MESSAGE)
			};
			if ((params.emitCommandHooks === true || params.fork === true) && (isEmbeddedAgentRunActive(currentParentEntry.sessionId) || isSessionWorkAdmissionActive(parentSessionTarget.storePath, [canonicalParentSessionKey, currentParentEntry.sessionId])) && (params.forkFrom !== "last-completed" || params.emitCommandHooks === true)) return {
				ok: false,
				error: errorShape(ErrorCodes.UNAVAILABLE, `Parent session ${parentSessionKey} is still active; try again in a moment.`)
			};
		}
		if (canonicalParentSessionKey && parentSessionTarget && params.emitCommandHooks === true) {
			const parentEntry = currentParentSessionEntry;
			const parentAgentId = normalizeAgentId(parentSelectedAgentId ?? resolveAgentIdFromSessionKey(canonicalParentSessionKey) ?? agentId);
			const workspaceDir = resolveAgentWorkspaceDir(params.cfg, parentAgentId);
			if (hasInternalHookListeners("command", "new")) await triggerInternalHook(createInternalHookEvent("command", "new", canonicalParentSessionKey, {
				agentId: parentAgentId,
				sessionEntry: parentEntry,
				previousSessionEntry: parentEntry,
				commandSource: params.commandSource,
				cfg: params.cfg,
				storePath: parentSessionTarget.storePath,
				workspaceDir
			}));
			const { emitGatewayBeforeResetPluginHook } = await loadSessionLifecycleRuntime();
			await emitGatewayBeforeResetPluginHook({
				cfg: params.cfg,
				key: canonicalParentSessionKey,
				target: parentSessionTarget,
				storePath: parentSessionTarget.storePath,
				entry: parentEntry,
				reason: "new"
			});
		}
		const target = creationTarget;
		const currentTargetEntry = loadGatewaySessionEntryReadOnly(target.canonicalKey, { agentId: target.agentId }).entry;
		if (!currentTargetEntry) {
			const creationError = authorizeGatewaySessionCreation({
				cfg: params.cfg,
				agentId: target.agentId,
				...params.operatorRoleActor ? { actor: params.operatorRoleActor } : { profileId: params.requestingOperatorProfileId }
			});
			if (creationError) return {
				ok: false,
				error: creationError
			};
		}
		const titleModelSelection = resolveSessionCreateModelSelection(params.cfg, target.agentId, params.catalogTarget ?? params.model, currentParentSessionEntry);
		const preparationResult = params.prepareLifecycle ? await params.prepareLifecycle({
			agentId: target.agentId,
			entry: currentTargetEntry,
			key: target.canonicalKey,
			storePath: target.storePath,
			titleModelSelection
		}) : void 0;
		if (preparationResult && !preparationResult.ok) return {
			ok: false,
			error: preparationResult.error
		};
		preparedLifecycle = preparationResult?.value;
		const spawnedCwd = normalizeOptionalString(preparedLifecycle?.spawnedCwd ?? params.spawnedCwd);
		const sessionRoot = normalizeOptionalString(preparedLifecycle?.sessionRoot ?? params.sessionRoot);
		const runtimeCwd = spawnedCwd ?? sessionRoot;
		const created = await createSessionEntryWithTranscript({
			agentId: target.agentId,
			sessionKey: target.canonicalKey,
			storePath: target.storePath
		}, async ({ existingEntry, sessionEntries }) => {
			if (!existingEntry) {
				const creationError = authorizeGatewaySessionCreation({
					cfg: params.cfg,
					agentId: target.agentId,
					...params.operatorRoleActor ? { actor: params.operatorRoleActor } : { profileId: params.requestingOperatorProfileId }
				});
				if (creationError) return {
					ok: false,
					error: creationError
				};
			}
			const existingOwnershipError = resolvePluginSessionOwnershipError({
				action: "adopt",
				entry: existingEntry,
				key: target.canonicalKey,
				pluginOwnerId: params.authorizedPluginId
			});
			if (existingOwnershipError) return {
				ok: false,
				error: existingOwnershipError
			};
			if (isAgentHarnessSessionKey(target.canonicalKey) && !authorizedHarnessCreation && (!existingEntry || existingEntry.modelSelectionLocked === true)) return {
				ok: false,
				error: errorShape(ErrorCodes.INVALID_REQUEST, AGENT_HARNESS_SESSION_KEY_RESERVED_MESSAGE)
			};
			if (!params.initialEntry && existingEntry?.initializationPending === true) return {
				ok: false,
				error: errorShape(ErrorCodes.UNAVAILABLE, `Session ${target.canonicalKey} is still initializing; retry creation later.`)
			};
			if (params.initialEntry && existingEntry !== void 0) return {
				ok: false,
				error: errorShape(ErrorCodes.INVALID_REQUEST, "trusted initial session state requires a new session")
			};
			if (params.catalogTarget && existingEntry !== void 0) return {
				ok: false,
				error: errorShape(ErrorCodes.INVALID_REQUEST, "catalog session target requires a new session")
			};
			if (pendingProjectGitUrl && existingEntry !== void 0) return {
				ok: false,
				error: errorShape(ErrorCodes.INVALID_REQUEST, "remote project preparation requires a new session")
			};
			if (spawnToolPolicy && existingEntry !== void 0) return {
				ok: false,
				error: errorShape(ErrorCodes.INVALID_REQUEST, "spawn tool policy requires a new session")
			};
			if (params.visibility && existingEntry === void 0 && !isSessionVisibilityAllowed(params.cfg, params.visibility)) return {
				ok: false,
				error: errorShape(ErrorCodes.INVALID_REQUEST, `session visibility is disabled: ${params.visibility}`, { details: {
					code: "SESSION_VISIBILITY_DISABLED",
					visibility: params.visibility
				} })
			};
			if (params.visibility && existingEntry !== void 0 && resolveSessionVisibility(existingEntry) !== params.visibility) return {
				ok: false,
				error: errorShape(ErrorCodes.INVALID_REQUEST, "sessions.create visibility requires a new session")
			};
			createdNewEntry = existingEntry === void 0;
			const requestedModel = normalizeOptionalString(params.model);
			const requestedContextWindow = normalizeOptionalString(params.contextWindow);
			const requestedThinkingLevel = normalizeOptionalString(params.thinkingLevel);
			if (existingEntry?.sessionId && params.allowExistingModelSelection !== true) {
				const gateDefaultModel = resolveDefaultModelForAgent({
					cfg: params.cfg,
					agentId: target.agentId
				});
				if (await existingModelSelectionWouldChange({
					agentId: target.agentId,
					cfg: params.cfg,
					catalogModel,
					defaultModel: gateDefaultModel.model,
					defaultProvider: gateDefaultModel.provider,
					existingEntry,
					loadGatewayModelCatalog: params.loadGatewayModelCatalog,
					requestedModel,
					requestedContextWindow,
					requestedThinkingLevel,
					subagentModelHint: isSubagentSessionKey(target.canonicalKey) ? resolveSubagentConfiguredModelSelection({
						cfg: params.cfg,
						agentId: target.agentId
					}) : void 0
				})) return {
					ok: false,
					error: missingScopeErrorShape({
						missingScope: ADMIN_SCOPE,
						requiredScopes: [ADMIN_SCOPE]
					})
				};
			}
			const patched = await projectSessionsPatchEntry({
				cfg: params.cfg,
				existingEntry: sessionEntries[target.canonicalKey],
				isLabelInUse: (label) => Object.entries(sessionEntries).some(([sessionKey, entry]) => sessionKey !== target.canonicalKey && entry.label === label),
				storeKey: target.canonicalKey,
				agentId: target.agentId,
				preparedSessionRoot: sessionRoot,
				patch: {
					key: target.canonicalKey,
					label: normalizeOptionalString(params.label),
					category: normalizeOptionalString(params.category),
					...catalogModel ?? requestedModel ? { model: catalogModel ?? requestedModel } : {},
					...requestedContextWindow ? { contextWindow: requestedContextWindow } : {},
					...requestedThinkingLevel ? { thinkingLevel: requestedThinkingLevel } : {},
					...requestedToolOverrides ? { toolOverrides: params.toolOverrides } : {},
					...params.permissionMode ? { permissionMode: params.permissionMode } : {}
				},
				loadGatewayModelCatalog: params.loadGatewayModelCatalog,
				authorizedAgentHarnessId: params.authorizedAgentHarnessId
			});
			if (!patched.ok) return patched;
			if (requestedToolOverrides && existingEntry !== void 0 && stableStringify(existingEntry.toolOverrides) !== stableStringify(patched.entry.toolOverrides)) return {
				ok: false,
				error: errorShape(ErrorCodes.INVALID_REQUEST, "sessions.create toolOverrides requires a new session")
			};
			sessionEntries[target.canonicalKey] = patched.entry;
			const execNode = normalizeOptionalString(params.execNode);
			const execCwd = normalizeOptionalString(params.execCwd);
			const initialAgentHarnessId = params.initialEntry ? normalizeOptionalString(params.initialEntry.agentHarnessId) : void 0;
			if (params.initialEntry && !initialAgentHarnessId && !authorizedPluginCreation) return {
				ok: false,
				error: errorShape(ErrorCodes.INVALID_REQUEST, params.initialEntry?.agentHarnessId !== void 0 ? "initial agentHarnessId must be non-empty" : "trusted initial session state requires an authorized owner")
			};
			if (params.initialEntry?.modelSelectionLocked !== void 0 && !params.initialEntry.modelSelectionLocked) return {
				ok: false,
				error: errorShape(ErrorCodes.INVALID_REQUEST, "initial modelSelectionLocked must be true when provided")
			};
			const catalogResolvedModel = params.catalogTarget ? resolveSessionModelRef(params.cfg, patched.entry, target.agentId) : void 0;
			const initializedEntry = {
				...patched.entry,
				...existingEntry === void 0 && patched.entry.delivery === void 0 ? { delivery: normalizeSessionDeliveryState() } : {},
				...params.creation && createdNewEntry ? buildSessionCreationStamp({
					...params.creation,
					sandbox: resolveCreatorSandbox(params.cfg, params.creation)
				}) : {},
				...params.visibility && createdNewEntry ? { visibility: params.visibility } : {},
				...projectId && createdNewEntry ? { projectId } : {},
				...pendingProjectGitUrl && createdNewEntry ? { pendingProjectGitUrl } : {},
				...catalogResolvedModel && catalogAgentRuntime ? {
					providerOverride: catalogResolvedModel.provider,
					modelOverride: catalogResolvedModel.model,
					modelOverrideSource: "user",
					modelOverrideRouteResolution: "resolved",
					agentRuntimeOverride: catalogAgentRuntime,
					modelSelectionLocked: true,
					pluginOwnerId: catalogPluginOwnerId
				} : {},
				...spawnedCwd ? { spawnedCwd } : {},
				...preparedLifecycle?.worktree ? { worktree: preparedLifecycle.worktree } : {},
				...execNode ? {
					execHost: "node",
					execNode,
					...execCwd ? { execCwd } : {}
				} : {},
				...createdNewEntry && params.armSessionDiffBaselineCapture && !execNode ? { sessionDiffBaselineCapture: createSessionDiffBaselineCaptureClaim() } : {},
				...initialAgentHarnessId ? { agentHarnessId: initialAgentHarnessId } : {},
				...createdNewEntry && params.authorizedPluginId && !params.catalogTarget ? { pluginOwnerId: params.authorizedPluginId } : {},
				...authorizedPluginCreation && params.initialEntry?.providerOverride ? { providerOverride: params.initialEntry.providerOverride } : {},
				...authorizedPluginCreation && params.initialEntry?.modelOverride ? { modelOverride: params.initialEntry.modelOverride } : {},
				...authorizedPluginCreation && params.initialEntry?.modelOverrideRouteResolution ? { modelOverrideRouteResolution: params.initialEntry.modelOverrideRouteResolution } : {},
				...authorizedPluginCreation && params.initialEntry?.cliSessionBindings ? { cliSessionBindings: structuredClone(params.initialEntry.cliSessionBindings) } : {},
				...params.initialEntry?.initializationPending === true ? { initializationPending: true } : {},
				...params.initialEntry?.modelSelectionLocked === true ? { modelSelectionLocked: true } : {},
				...params.initialEntry?.pluginExtensions !== void 0 ? { pluginExtensions: structuredClone(params.initialEntry.pluginExtensions) } : {},
				...existingEntry === void 0 ? { spawnDepth: params.spawnDepth ?? 0 } : {},
				...existingEntry === void 0 && spawnToolPolicy ? {
					spawnedBy: spawnToolPolicy.parentSessionKey,
					...spawnToolPolicy.completionOwnerSessionKey ? { completionOwnerSessionKey: spawnToolPolicy.completionOwnerSessionKey } : {},
					inheritedToolPolicyVersion: 1,
					...spawnToolPolicy.allow.length > 0 ? { inheritedToolAllow: spawnToolPolicy.allow } : {},
					...spawnToolPolicy.deny.length > 0 ? { inheritedToolDeny: spawnToolPolicy.deny } : {}
				} : {},
				...existingEntry === void 0 && incognito ? { incognito: true } : {}
			};
			sessionEntries[target.canonicalKey] = initializedEntry;
			const initialized = {
				...patched,
				entry: initializedEntry
			};
			const storedParentSessionKey = canonicalParentSessionKey ?? normalizeOptionalString(initializedEntry.parentSessionKey) ?? dashboardParentSessionKey;
			if (!storedParentSessionKey) return initialized;
			const inheritedSelection = !canonicalParentSessionKey || catalogModel || normalizeOptionalString(params.model) ? {} : inheritSessionSelection(currentParentSessionEntry);
			if (requestedToolOverrides) delete inheritedSelection.toolOverrides;
			const entry = {
				...initializedEntry,
				...inheritedSelection,
				parentSessionKey: storedParentSessionKey,
				...canonicalParentSessionKey && currentParentSessionEntry?.sessionId ? { parentSessionId: currentParentSessionEntry.sessionId } : {}
			};
			if (params.fork !== true) return {
				...initialized,
				entry
			};
			const forkParentSessionKey = canonicalParentSessionKey;
			if (!forkParentSessionKey || !currentParentSessionEntry || !parentSessionTarget) return {
				ok: false,
				error: errorShape(ErrorCodes.UNAVAILABLE, "failed to resolve parent session for fork")
			};
			const forkResult = await forkSessionFromParentWithDecision({
				parentEntry: currentParentSessionEntry,
				agentId: parentSessionTarget.agentId,
				...params.commitGuard ? { commitGuard: params.commitGuard } : {},
				parentSessionKey: forkParentSessionKey,
				sessionKey: target.canonicalKey,
				storePath: parentSessionTarget.storePath,
				targetStorePath: target.storePath,
				...params.forkFrom ? { forkFrom: params.forkFrom } : {}
			});
			if (forkResult.status === "too-large") return {
				ok: false,
				error: errorShape(ErrorCodes.INVALID_REQUEST, `parent session is too large to fork (${forkResult.decision.parentTokens}/${forkResult.decision.maxTokens} tokens)`)
			};
			if (forkResult.status !== "created") return {
				ok: false,
				error: errorShape(ErrorCodes.UNAVAILABLE, "failed to fork parent session transcript")
			};
			const fork = forkResult.transcript;
			return {
				...initialized,
				entry: buildForkedGatewaySessionEntry(entry, fork, {
					sessionKey: forkParentSessionKey,
					sessionId: currentParentSessionEntry.sessionId
				}, existingEntry)
			};
		}, {
			...params.initialEntry ? {
				activeSessionKey: target.canonicalKey,
				requireWriteSuccess: true
			} : {},
			...params.commitGuard ? { commitGuard: params.commitGuard } : {},
			...runtimeCwd ? { cwd: runtimeCwd } : {}
		});
		if (!created.ok) return {
			ok: false,
			error: created.phase === "transcript" ? errorShape(ErrorCodes.UNAVAILABLE, `failed to create session transcript: ${created.error}`) : created.error
		};
		createdContext = {
			key: target.canonicalKey,
			agentId: target.agentId,
			entry: projectPublicSessionEntry(created.entry),
			storePath: target.storePath
		};
		lifecyclePreparationCommitted = true;
		if (createdNewEntry) recordSessionCreated({
			sessionKey: createdContext.key,
			agentId: createdContext.agentId,
			entry: createdContext.entry
		});
		if (canonicalParentSessionKey && parentSessionTarget && params.emitCommandHooks === true) {
			const parentEntry = currentParentSessionEntry;
			const { emitGatewaySessionEndPluginHook, emitGatewaySessionStartPluginHook } = await loadSessionLifecycleRuntime();
			if (params.succeedsParent !== false) emitGatewaySessionEndPluginHook({
				cfg: params.cfg,
				sessionKey: canonicalParentSessionKey,
				sessionId: parentEntry?.sessionId,
				storePath: parentSessionTarget.storePath,
				sessionFile: canonicalParentSessionKey,
				agentId: parentSessionTarget.agentId,
				reason: "new",
				nextSessionId: created.entry.sessionId,
				nextSessionKey: target.canonicalKey
			});
			emitGatewaySessionStartPluginHook({
				cfg: params.cfg,
				sessionKey: target.canonicalKey,
				sessionId: created.entry.sessionId,
				resumedFrom: parentEntry?.sessionId,
				storePath: target.storePath,
				sessionFile: target.canonicalKey,
				agentId: target.agentId
			});
		}
		const selectedModel = resolveSessionModelRef(params.cfg, created.entry, target.agentId);
		return {
			ok: true,
			key: target.canonicalKey,
			agentId: target.agentId,
			entry: projectPublicSessionEntry(created.entry),
			resolved: {
				modelProvider: selectedModel.provider,
				model: selectedModel.model
			},
			resetExisting: false
		};
	};
	const lifecycleTargets = [{
		scope: creationTarget.storePath,
		identities: [creationTarget.canonicalKey]
	}];
	if (canonicalParentSessionKey && parentSessionEntry?.sessionId && parentSessionTarget && (params.emitCommandHooks === true || params.fork === true || params.authorizedPluginId !== void 0)) lifecycleTargets.push({
		scope: parentSessionTarget.storePath,
		identities: [canonicalParentSessionKey, parentSessionEntry.sessionId]
	});
	const result = await runExclusiveSessionLifecycleMutation({
		targets: lifecycleTargets,
		run: createChildSession,
		finalize: async () => {
			if (!lifecyclePreparationCommitted) await rollbackGatewaySessionPreparation({
				prepared: preparedLifecycle,
				onError: params.onLifecycleCleanupError
			});
		}
	});
	if (!result.ok) return result;
	if (result.resetExisting || !createdContext || !params.afterCreate) return {
		...result,
		postCommit: { status: "completed" }
	};
	try {
		await params.afterCreate(createdContext);
		return {
			...result,
			postCommit: { status: "completed" }
		};
	} catch (error) {
		return {
			...result,
			postCommit: {
				status: "failed",
				error
			}
		};
	}
}
//#endregion
export { createGatewaySession as n, resolveSessionCreateModelSelection as r, buildDashboardSessionKey as t };
