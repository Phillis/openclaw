import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import "./src-BntaCZM-.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import { t as stableStringify } from "./stable-stringify-DoZ6Yalc.js";
import { r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
import "./agent-scope-DigoIwHb.js";
import { n as ok, t as err } from "./result-BQGgYouL.js";
import { n as normalizeAgentId } from "./agent-id-CeT3w4ap.js";
import { f as resolveAgentWorkspaceDir } from "./agent-scope-config-CUBiGmG3.js";
import { c as parseAgentSessionKey } from "./session-key-utils-Di3FvABa.js";
import { t as ADMIN_SCOPE } from "./operator-scopes-Dw7Gu2cA.js";
import { t as ErrorCodes } from "./gateway-error-details-C2IaYyht.js";
import { Fr as validateSessionsCreateParams, em as SESSION_CREATE_IDEMPOTENCY_RETENTION_MS } from "./src-4dv5TpeQ.js";
import { r as authorizeOperatorScopesForRequiredScope } from "./method-scopes-BTnJZEGh.js";
import { r as resolveAgentMainSessionKey } from "./main-session-CPkeRwvL.js";
import { E as sessionEntryForkedFromParent } from "./session-accessor.sqlite-entry-CNdoUuFZ.js";
import { d as errorShape, f as missingScopeErrorShape } from "./validation-errors-rELRlKfn.js";
import { a as readSessionMessageCountAsync } from "./session-transcript-readers-CgCxlOAj.js";
import { a as insideGitCheckout } from "./git-CsWoUZAt.js";
import { n as resolveRequestedSessionAgentId } from "./session-request-agent-C9E8iDY4.js";
import { d as resolveGatewaySessionStoreTarget, i as loadGatewaySessionEntryReadOnly } from "./session-utils-store-DtQnSTMm.js";
import "./session-utils-BTR52tOf.js";
import { n as resolveWorkspacePathContainment } from "./workspace-path-containment-CPewJH89.js";
import "./server-constants-DKuFNbQH.js";
import { l as managedWorktrees, o as WorktreeRepositoryError } from "./service-P2Ot4H_g.js";
import { t as slugifyWorktreeTitle } from "./name-DmUK_jiX.js";
import { n as emitSessionsChanged } from "./session-change-event-BVVK9xuQ.js";
import { n as resolveOperatorSessionCreation } from "./session-creation-provenance-B9w3HHXu.js";
import { t as assertValidParams } from "./validation-kYFXohur.js";
import { t as normalizeRpcAttachmentsToChatAttachments } from "./attachment-normalize-BA7mKleS.js";
import { a as normalizeSessionProjectGitUrl, o as validateSessionProjectPreparation, s as prepareSessionCreateFilesystemRoot } from "./chat-send-handler-BYL7V6ZJ.js";
import { t as chatHandlers } from "./chat-C9Dr0d5-.js";
import { o as prepareWorktreeSessionTitle } from "./dashboard-session-title-wKKJH5Bw.js";
import { c as resolveProjectDirectory, l as resolveProjectRegistry, s as resolveProjectCheckout, t as ProjectCheckoutError } from "./project-registry-CPtTZbcF.js";
import { n as createAgentRuntimeAuthorityGuard } from "./agent-runtime-authority-DnVI97Gp.js";
import { f as sessionLog } from "./sessions-shared-BYADMHw6.js";
import { t as resolveRegisteredCatalogCreateTarget } from "./session-catalog-lN8hF_x-.js";
import { n as createGatewaySession, r as resolveSessionCreateModelSelection, t as buildDashboardSessionKey } from "./session-create-service-CjNljuQX.js";
import { r as ensureSessionGroupRegistered } from "./session-groups-CcCK_VZz.js";
import fs from "node:fs";
import path from "node:path";
import { createHash, randomUUID } from "node:crypto";
//#region src/gateway/server-methods/session-create-category.ts
function registerCreatedSessionCategory(category, context) {
	if (!category) return;
	try {
		if (ensureSessionGroupRegistered(category)) emitSessionsChanged(context, { reason: "groups" });
	} catch (error) {
		sessionLog.warn(`failed to register created session category: ${formatErrorMessage(error)}`);
	}
}
//#endregion
//#region src/gateway/server-methods/session-create-idempotency.ts
const sessionCreatesByContext = /* @__PURE__ */ new WeakMap();
function idempotentSessionCreate(handler) {
	return async (request) => {
		const idempotencyKey = request.params.idempotencyKey;
		if (typeof idempotencyKey !== "string" || !idempotencyKey) {
			await handler(request);
			return;
		}
		const principal = request.client?.authenticatedUserProfile?.profileId ?? request.client?.authenticatedUserId;
		const deviceId = request.client?.connect.device?.id?.trim();
		if (!principal && !deviceId) {
			request.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "idempotent session creation requires an authenticated principal or device identity"));
			return;
		}
		const owner = principal ? `principal:${principal}` : `device:${deviceId}`;
		let entriesByOwner = sessionCreatesByContext.get(request.context);
		if (!entriesByOwner) {
			entriesByOwner = /* @__PURE__ */ new Map();
			sessionCreatesByContext.set(request.context, entriesByOwner);
		}
		const now = Date.now();
		let retainedEntryCount = 0;
		for (const [entryOwner, ownerEntries] of entriesByOwner) {
			for (const [key, entry] of ownerEntries) if (entry.state.kind === "completed" && entry.expiresAt <= now) ownerEntries.delete(key);
			if (ownerEntries.size === 0) entriesByOwner.delete(entryOwner);
			else retainedEntryCount += ownerEntries.size;
		}
		let entries = entriesByOwner.get(owner);
		const requestIdentity = createHash("sha256").update(stableStringify(request.params)).digest("hex");
		const authorization = {
			role: request.client?.connect.role ?? null,
			scopes: request.client?.connect.scopes?.toSorted() ?? []
		};
		const existing = entries?.get(idempotencyKey);
		if (existing) {
			if (existing.requestIdentity !== requestIdentity) {
				request.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "session creation idempotency key was reused with different parameters"));
				return;
			}
			if (existing.authorization.role !== authorization.role) {
				request.respond(false, void 0, errorShape(ErrorCodes.FORBIDDEN, "session creation authorization changed; start again"));
				return;
			}
			const missingScope = existing.authorization.scopes.find((scope) => !authorization.scopes.includes(scope));
			if (missingScope) {
				request.respond(false, void 0, missingScopeErrorShape({
					missingScope,
					requiredScopes: existing.authorization.scopes
				}));
				return;
			}
			const result = existing.state.kind === "completed" ? existing.state.result : await existing.state.work;
			request.respond(result.ok, result.payload, result.error, {
				...result.meta,
				cached: true
			});
			return;
		}
		if ((entries?.size ?? 0) >= 1e3 || retainedEntryCount >= 1e3 * 2) {
			request.respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "session creation capacity is full; retry later"));
			return;
		}
		if (!entries) {
			entries = /* @__PURE__ */ new Map();
			entriesByOwner.set(owner, entries);
		}
		const releaseEntry = () => {
			entries.delete(idempotencyKey);
			if (entries.size === 0) entriesByOwner.delete(owner);
		};
		const work = Promise.resolve().then(async () => {
			try {
				let result;
				await handler({
					...request,
					respond: (ok, payload, error, meta) => {
						result = {
							ok,
							payload,
							error,
							meta
						};
					}
				});
				result ??= {
					ok: false,
					error: errorShape(ErrorCodes.UNAVAILABLE, "session creation was interrupted")
				};
				if (result.ok) {
					entry.expiresAt = Date.now() + SESSION_CREATE_IDEMPOTENCY_RETENTION_MS;
					entry.state = {
						kind: "completed",
						result
					};
				} else releaseEntry();
				return result;
			} catch (error) {
				releaseEntry();
				throw error;
			}
		});
		const entry = {
			requestIdentity,
			authorization,
			expiresAt: now + SESSION_CREATE_IDEMPOTENCY_RETENTION_MS,
			state: {
				kind: "inflight",
				work
			}
		};
		entries.set(idempotencyKey, entry);
		const result = await work;
		request.respond(result.ok, result.payload, result.error, result.meta);
	};
}
//#endregion
//#region src/gateway/server-methods/session-create-initial-turn.ts
function resolveOptionalInitialSessionMessage(params) {
	if (typeof params.task === "string" && params.task.trim()) return params.task;
	if (typeof params.message === "string" && params.message.trim()) return params.message;
}
function resolveSessionCreateInitialTurn(params) {
	const message = resolveOptionalInitialSessionMessage(params);
	const normalizedAttachments = normalizeRpcAttachmentsToChatAttachments(params.attachments);
	if (params.attachments?.length && !message && normalizedAttachments.length === 0) return null;
	const attachments = normalizedAttachments.length ? normalizedAttachments : void 0;
	return {
		attachments,
		hasInitialTurn: message !== void 0 || attachments !== void 0,
		message
	};
}
function shouldAttachPendingMessageSeq(params) {
	if (params.cached) return false;
	return (params.payload && typeof params.payload === "object" ? params.payload.status : void 0) === "started";
}
//#endregion
//#region src/gateway/server-methods/sessions-create.ts
const sessionCreateHandlers = { "sessions.create": async ({ req, params, respond, context, client, isWebchatConnect, sessionMutationCommitGuard, sessionMutationAuthorization }) => {
	if (!assertValidParams(params, validateSessionsCreateParams, "sessions.create", respond)) return;
	const p = params;
	const parentSessionKey = normalizeOptionalString(p.parentSessionKey);
	const requestedModel = normalizeOptionalString(p.model);
	const cfg = context.getRuntimeConfig();
	const authority = createAgentRuntimeAuthorityGuard(client, context, respond);
	const commitGuard = authority.commitGuard || sessionMutationCommitGuard || sessionMutationAuthorization ? () => {
		sessionMutationCommitGuard?.();
		authority.commitGuard?.();
		sessionMutationAuthorization?.assertCurrent();
	} : void 0;
	const catalogId = normalizeOptionalString(p.catalogId);
	const catalogConflict = p.model ? "model" : p.key ? "key" : void 0;
	if (catalogId && catalogConflict) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `sessions.create catalogId cannot include ${catalogConflict}`));
		return;
	}
	const explicitlyRequestedKey = normalizeOptionalString(p.key);
	const explicitlyRequestedAgentId = normalizeOptionalString(p.agentId);
	const explicitlyRequestedAgent = resolveRequestedSessionAgentId(cfg, explicitlyRequestedKey ?? (explicitlyRequestedAgentId ? `agent:${normalizeAgentId(explicitlyRequestedAgentId)}:main` : "main"), p.agentId ?? parseAgentSessionKey(explicitlyRequestedKey)?.agentId);
	if (!explicitlyRequestedAgent.ok) {
		respond(false, void 0, explicitlyRequestedAgent.error);
		return;
	}
	const catalogRequestedKey = normalizeOptionalString(p.key) ?? "global";
	const catalogAgentId = catalogId ? normalizeAgentId(parseAgentSessionKey(catalogRequestedKey)?.agentId ?? explicitlyRequestedAgent.agentId) : void 0;
	const catalogTarget = catalogId && catalogAgentId ? resolveRegisteredCatalogCreateTarget(catalogId, catalogAgentId, cfg) : void 0;
	if (catalogTarget && !catalogTarget.ok) {
		respond(false, void 0, errorShape(catalogTarget.unknownCatalog ? ErrorCodes.INVALID_REQUEST : ErrorCodes.UNAVAILABLE, catalogTarget.message));
		return;
	}
	const initialTurn = resolveSessionCreateInitialTurn(p);
	if (!initialTurn) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "sessions.create attachments require usable content"));
		return;
	}
	const { attachments: initialAttachments, hasInitialTurn, message: initialMessage } = initialTurn;
	let requestedCwd = normalizeOptionalString(p.cwd);
	const requestedExecNode = normalizeOptionalString(p.execNode);
	const requestedProjectId = normalizeOptionalString(p.projectId);
	const requestedProjectGitUrl = p.projectGitUrl;
	const projectPreparationError = validateSessionProjectPreparation({
		cwd: requestedCwd,
		execNode: requestedExecNode,
		gitUrl: requestedProjectGitUrl,
		hasInitialTurn,
		projectId: requestedProjectId,
		worktree: p.worktree === true
	});
	if (projectPreparationError) {
		respond(false, void 0, projectPreparationError);
		return;
	}
	if (!(!requestedCwd || (requestedExecNode ? path.isAbsolute(requestedCwd) || path.win32.isAbsolute(requestedCwd) : path.isAbsolute(requestedCwd)))) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "sessions.create cwd must be absolute"));
		return;
	}
	const clientScopes = Array.isArray(client?.connect?.scopes) ? client.connect.scopes : [];
	if (p.permissionMode === "full" && client !== null && !clientScopes.includes("operator.admin")) {
		respond(false, void 0, missingScopeErrorShape({
			missingScope: ADMIN_SCOPE,
			requiredScopes: [ADMIN_SCOPE]
		}));
		return;
	}
	if (requestedCwd && !requestedExecNode && !clientScopes.includes("operator.admin")) {
		const containment = await resolveWorkspacePathContainment(requestedCwd, cfg);
		if (!containment) {
			respond(false, void 0, missingScopeErrorShape({
				missingScope: ADMIN_SCOPE,
				requiredScopes: [ADMIN_SCOPE]
			}));
			return;
		}
		requestedCwd = containment.path;
	}
	if (requestedExecNode && p.worktree === true) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "sessions.create worktree cannot target execNode"));
		return;
	}
	const requestedWorktreeBaseRef = normalizeOptionalString(p.worktreeBaseRef);
	const requestedWorktreeName = normalizeOptionalString(p.worktreeName);
	if ((requestedWorktreeBaseRef || requestedWorktreeName) && p.worktree !== true) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "sessions.create worktreeBaseRef/worktreeName require worktree=true"));
		return;
	}
	const explicitSessionLabel = normalizeOptionalString(p.label);
	const titleAgentId = explicitlyRequestedAgent.agentId;
	const shouldPrepareWorktreeTitle = p.worktree === true && !requestedWorktreeName && !explicitSessionLabel;
	const deferWorktreeTitle = shouldPrepareWorktreeTitle && Boolean(parentSessionKey) && !catalogTarget && !requestedModel;
	const worktreeTitleParams = shouldPrepareWorktreeTitle ? {
		cfg,
		agentId: titleAgentId,
		userMessage: initialMessage ?? "",
		attachments: initialAttachments,
		onError: (error) => sessionLog.warn(`worktree title failed: ${formatErrorMessage(error)}`)
	} : void 0;
	let worktreeTitle = worktreeTitleParams && !deferWorktreeTitle ? prepareWorktreeSessionTitle({
		...worktreeTitleParams,
		entry: resolveSessionCreateModelSelection(cfg, titleAgentId, catalogTarget?.target ?? p.model)
	}) : void 0;
	let projectRoot;
	if (requestedProjectId) {
		const project = resolveProjectRegistry(cfg, requestedProjectId);
		if (!project) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `unknown project id: ${requestedProjectId}`));
			return;
		}
		try {
			const checkout = p.worktree === true ? await resolveProjectCheckout(project.repoRoot) : void 0;
			projectRoot = checkout?.path ?? await resolveProjectDirectory(project.repoRoot);
			if (checkout && project.source !== "workspace" && checkout.path !== checkout.repoRoot) throw new ProjectCheckoutError(`project root is no longer a git checkout`);
		} catch (error) {
			const detail = error instanceof ProjectCheckoutError ? error.message : formatErrorMessage(error);
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, `project ${requestedProjectId} is unavailable (${detail}); update the agent workspace path or re-register the project`));
			return;
		}
	}
	let sessionKey = p.key;
	let sessionAgentId = catalogAgentId ?? explicitlyRequestedAgent.agentId;
	let sessionWorktree;
	const sessionExecCwd = requestedExecNode ? requestedCwd : void 0;
	let sessionCwd = requestedExecNode ? void 0 : projectRoot ?? requestedCwd;
	let prepareLifecycle;
	const preparedRoot = prepareSessionCreateFilesystemRoot({
		cfg,
		enforceSandboxContainment: Boolean(sessionCwd && !requestedExecNode && (requestedProjectId || p.worktree !== true)),
		requestedExecNode,
		requestedProjectId,
		sessionCwd,
		sessionKey,
		targetAgentId: sessionAgentId
	});
	if (!preparedRoot.ok) {
		respond(false, void 0, preparedRoot.error);
		return;
	}
	sessionCwd = preparedRoot.value.sessionCwd;
	const sessionRoot = preparedRoot.value.sessionRoot;
	if (p.worktree === true) {
		const explicitKey = explicitlyRequestedKey;
		const agentId = explicitlyRequestedAgent.agentId;
		let targetKey = explicitKey;
		let preservesUnspecifiedKey = false;
		if (!targetKey && parentSessionKey && p.emitCommandHooks === true && !hasInitialTurn && cfg.session?.dmScope === "main") {
			const parentRequestedAgent = resolveRequestedSessionAgentId(cfg, parentSessionKey, agentId);
			if (!parentRequestedAgent.ok) {
				respond(false, void 0, parentRequestedAgent.error);
				return;
			}
			const parent = loadGatewaySessionEntryReadOnly(parentSessionKey, { agentId: parentRequestedAgent.agentId });
			const parentAgentId = parentRequestedAgent.agentId;
			if (parent.entry?.sessionId && parent.canonicalKey === resolveAgentMainSessionKey({
				cfg,
				agentId: parentAgentId
			})) {
				targetKey = parent.canonicalKey;
				preservesUnspecifiedKey = true;
			}
		}
		targetKey ??= buildDashboardSessionKey(agentId);
		const target = resolveGatewaySessionStoreTarget({
			cfg,
			key: targetKey,
			agentId
		});
		sessionKey = preservesUnspecifiedKey ? void 0 : targetKey;
		sessionAgentId = target.agentId;
		const workspace = projectRoot ?? requestedCwd ?? resolveAgentWorkspaceDir(cfg, target.agentId);
		if (!insideGitCheckout(workspace)) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "agent workspace is not a git checkout"));
			return;
		}
		let requestedRepository;
		try {
			requestedRepository = await managedWorktrees.resolveRepositoryPaths(workspace);
		} catch (error) {
			if (error instanceof WorktreeRepositoryError) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "agent workspace is not a git checkout"));
				return;
			}
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, formatErrorMessage(error)));
			return;
		}
		const scopes = Array.isArray(client?.connect.scopes) ? client.connect.scopes : [];
		prepareLifecycle = async (lifecycleTarget) => {
			try {
				if (deferWorktreeTitle && worktreeTitleParams) worktreeTitle = prepareWorktreeSessionTitle({
					...worktreeTitleParams,
					entry: lifecycleTarget.titleModelSelection
				});
				const boundId = normalizeOptionalString(lifecycleTarget.entry?.worktree?.id);
				let existing = boundId ? managedWorktrees.findLiveById(boundId) : void 0;
				if (existing && (existing.ownerKind !== "session" || existing.ownerId !== lifecycleTarget.key)) return err(errorShape(ErrorCodes.UNAVAILABLE, "session worktree binding has a different owner"));
				existing ??= managedWorktrees.findLiveByOwner("session", lifecycleTarget.key);
				let existingDirectory = false;
				if (existing) try {
					existingDirectory = fs.lstatSync(existing.path).isDirectory();
				} catch {}
				let provisioned = false;
				if (existing && existingDirectory) {
					if (existing.repoRoot !== requestedRepository.canonicalRoot) return err(errorShape(ErrorCodes.INVALID_REQUEST, "session worktree belongs to a different repository"));
					if (requestedWorktreeName && existing.name !== requestedWorktreeName || requestedWorktreeBaseRef) return err(errorShape(ErrorCodes.INVALID_REQUEST, `session is already bound to worktree ${existing.name} (${existing.branch})`));
					sessionWorktree = existing;
				} else {
					const generatedTitle = await worktreeTitle?.generated;
					sessionWorktree = await managedWorktrees.create({
						repoRoot: workspace,
						ownerKind: "session",
						ownerId: lifecycleTarget.key,
						name: requestedWorktreeName,
						suggestedName: slugifyWorktreeTitle(explicitSessionLabel ?? generatedTitle ?? worktreeTitle?.source ?? ""),
						baseRef: requestedWorktreeBaseRef,
						runSetupScript: scopes.includes(ADMIN_SCOPE),
						...commitGuard ? { commitGuard } : {}
					});
					provisioned = true;
				}
				sessionCwd = sessionWorktree.path;
				try {
					const relative = path.relative(requestedRepository.sourceRoot, fs.realpathSync(workspace));
					if (relative && !relative.startsWith("..") && !path.isAbsolute(relative)) {
						sessionCwd = path.join(sessionWorktree.path, relative);
						fs.mkdirSync(sessionCwd, { recursive: true });
					}
				} catch {
					sessionCwd = sessionWorktree.path;
				}
				const preparedWorktree = sessionWorktree;
				const preparedSessionRoot = fs.realpathSync(preparedWorktree.path);
				return ok({
					spawnedCwd: sessionCwd,
					sessionRoot: preparedSessionRoot,
					worktree: {
						id: preparedWorktree.id,
						branch: preparedWorktree.branch,
						repoRoot: preparedWorktree.repoRoot,
						canonicalWorkspaceDir: workspace
					},
					...provisioned ? { rollback: async () => {
						await managedWorktrees.remove({
							id: preparedWorktree.id,
							reason: "session-create-failed",
							allowSnapshotLoss: true
						});
					} } : {}
				});
			} catch (error) {
				if (error instanceof TypeError && !authority.hasActive()) throw error;
				if (error instanceof WorktreeRepositoryError) return err(errorShape(ErrorCodes.INVALID_REQUEST, "agent workspace is not a git checkout"));
				return err(errorShape(ErrorCodes.UNAVAILABLE, formatErrorMessage(error)));
			}
		};
	}
	let runPayload;
	let runError;
	let runMeta;
	let messageSeq;
	const sessionCreation = resolveOperatorSessionCreation(client, { allowTrustedHint: true });
	const spawnRequesterSessionKey = sessionCreation.via === "spawn" ? normalizeOptionalString(sessionCreation.requesterSessionKey) : void 0;
	if (sessionCreation.inheritedToolPolicy && parentSessionKey !== spawnRequesterSessionKey) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "spawn parent must match the trusted agent caller"));
		return;
	}
	const allowExistingModelSelection = authorizeOperatorScopesForRequiredScope(ADMIN_SCOPE, clientScopes).allowed;
	const modelCatalogAgentId = sessionAgentId;
	if (!authority.ensureActive()) return;
	const created = await createGatewaySession({
		cfg,
		key: sessionKey,
		agentId: sessionAgentId,
		label: p.label,
		category: p.category,
		...catalogTarget ? { catalogTarget: catalogTarget.target } : { model: requestedModel },
		contextWindow: p.contextWindow,
		thinkingLevel: p.thinkingLevel,
		projectId: requestedProjectId,
		pendingProjectGitUrl: normalizeSessionProjectGitUrl(requestedProjectGitUrl),
		incognito: p.incognito,
		...client?.connect ? { requestingOperatorScopes: clientScopes } : {},
		...client?.authenticatedUserProfile ? { requestingOperatorProfileId: client.authenticatedUserProfile.profileId } : {},
		...client?.internal?.operatorRoleActor ? { operatorRoleActor: client.internal.operatorRoleActor } : {},
		visibility: p.visibility,
		allowExistingModelSelection,
		parentSessionKey,
		spawnDepth: p.spawnDepth,
		spawnToolPolicy: sessionCreation.via === "spawn" && sessionCreation.inheritedToolPolicy ? {
			...sessionCreation.inheritedToolPolicy,
			...sessionCreation.completionOwnerSessionKey ? { completionOwnerSessionKey: sessionCreation.completionOwnerSessionKey } : {}
		} : void 0,
		spawnedCwd: p.worktree === true ? void 0 : sessionCwd,
		sessionRoot: p.worktree === true ? void 0 : sessionRoot,
		permissionMode: p.permissionMode ?? (p.worktree === true ? "workspace" : void 0),
		...p.toolOverrides !== void 0 ? { toolOverrides: p.toolOverrides } : {},
		prepareLifecycle,
		onLifecycleCleanupError: (error) => {
			sessionLog.warn(`failed to finalize session worktree lifecycle: ${formatErrorMessage(error)}`);
		},
		execNode: requestedExecNode,
		execCwd: sessionExecCwd,
		clearExecBinding: !requestedExecNode,
		clearSpawnedCwd: p.worktree !== true && !sessionCwd,
		fork: p.fork,
		forkFrom: p.forkFrom,
		succeedsParent: p.succeedsParent,
		emitCommandHooks: p.emitCommandHooks,
		resetMainWhenUnspecified: !hasInitialTurn,
		commandSource: "webchat",
		creation: sessionCreation,
		authorizedPluginId: normalizeOptionalString(client?.internal?.pluginRuntimeOwnerId),
		armSessionDiffBaselineCapture: true,
		loadGatewayModelCatalog: () => context.loadGatewayModelCatalog({ agentId: modelCatalogAgentId }),
		...commitGuard ? { commitGuard } : {},
		afterCreate: async ({ key, agentId, entry, storePath }) => {
			if (!authority.hasActive()) return;
			if (await worktreeTitle?.persist(agentId, entry, key, storePath)) emitSessionsChanged(context, {
				sessionKey: key,
				agentId,
				reason: "chat.title"
			});
			if (hasInitialTurn) {
				if (!authority.hasActive()) return;
				messageSeq = await readSessionMessageCountAsync({
					agentId,
					sessionEntry: entry,
					sessionId: entry.sessionId,
					sessionKey: key,
					storePath
				}) + 1;
				await expectDefined(chatHandlers["chat.send"], "chat.send handler")({
					req,
					params: {
						sessionKey: key,
						agentId,
						message: initialMessage ?? "",
						idempotencyKey: randomUUID(),
						...initialAttachments ? { attachments: initialAttachments } : {}
					},
					respond: (ok, payload, error, meta) => {
						if (ok && payload && typeof payload === "object") runPayload = payload;
						else runError = error;
						runMeta = meta;
					},
					context,
					client,
					isWebchatConnect
				});
			}
		}
	}).catch((error) => authority.handleClosedError(error));
	if (!created) return;
	if (!created.ok) {
		respond(false, void 0, created.error);
		return;
	}
	if (created.postCommit.status === "failed") runError = errorShape(ErrorCodes.UNAVAILABLE, formatErrorMessage(created.postCommit.error));
	registerCreatedSessionCategory(normalizeOptionalString(p.category), context);
	const createdWorktree = sessionWorktree ? {
		id: sessionWorktree.id,
		path: sessionWorktree.path,
		branch: sessionWorktree.branch
	} : void 0;
	const responseEntry = sessionEntryForkedFromParent(created.entry) ? {
		...created.entry,
		forkedFromParent: true
	} : created.entry;
	if (created.resetExisting) {
		respond(true, {
			ok: true,
			key: created.key,
			sessionId: created.entry.sessionId,
			entry: responseEntry,
			resolved: created.resolved,
			runStarted: false,
			...createdWorktree ? { worktree: createdWorktree } : {}
		}, void 0);
		emitSessionsChanged(context, {
			sessionKey: created.key,
			agentId: created.agentId,
			reason: "new"
		});
		return;
	}
	const runStarted = runPayload !== void 0 && shouldAttachPendingMessageSeq({
		payload: runPayload,
		cached: runMeta?.cached === true
	});
	respond(true, {
		ok: true,
		key: created.key,
		sessionId: created.entry.sessionId,
		entry: responseEntry,
		runStarted,
		...runPayload ? runPayload : {},
		...runStarted && typeof messageSeq === "number" ? { messageSeq } : {},
		...runError ? { runError } : {},
		resolved: created.resolved,
		...createdWorktree ? { worktree: createdWorktree } : {}
	}, void 0);
	emitSessionsChanged(context, {
		sessionKey: created.key,
		agentId: created.agentId,
		reason: "create"
	});
	if (runStarted) emitSessionsChanged(context, {
		sessionKey: created.key,
		agentId: created.agentId,
		reason: "send"
	});
} };
sessionCreateHandlers["sessions.create"] = idempotentSessionCreate(expectDefined(sessionCreateHandlers["sessions.create"], "sessions.create handler"));
//#endregion
export { shouldAttachPendingMessageSeq as n, sessionCreateHandlers as t };
