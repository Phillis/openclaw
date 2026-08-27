import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import "./src-BkwWvwB2.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import { a as isPathInside } from "./path-CYL8StfC.js";
import { c as resolveUserPath } from "./home-dir-DcrXWQPU.js";
import "./path-guards-CQdx2c2I.js";
import "./utils-D9gvQMP6.js";
import { r as formatErrorMessage } from "./errors-CqPTYU6G.js";
import "./agent-scope-D9GLFAyB.js";
import { n as normalizeAgentId } from "./agent-id-Db0rqw_J.js";
import { d as resolveAgentWorkspaceDir } from "./agent-scope-config-CsnnOL14.js";
import { c as parseAgentSessionKey } from "./session-key-utils-D8x_bjrd.js";
import { n as ok, t as err } from "./result-BQGgYouL.js";
import { t as ADMIN_SCOPE } from "./operator-scopes-Dw7Gu2cA.js";
import { t as ErrorCodes } from "./gateway-error-details-BWo6Le6w.js";
import { r as authorizeOperatorScopesForRequiredScope } from "./method-scopes-CEKLLcTa.js";
import { r as resolveAgentMainSessionKey } from "./main-session-Dth0X5B9.js";
import { n as resolveSessionStoreAgentId } from "./session-store-key-Cc0gbvo8.js";
import { _n as sessionEntryForkedFromParent } from "./session-accessor-CIiPoGwM.js";
import { kr as validateSessionsCreateParams } from "./src-BlUKtAtD.js";
import { c as missingScopeErrorShape, s as errorShape } from "./error-codes-CMSvT5-d.js";
import { m as ensureAgentWorkspace } from "./workspace-Bhf9rmeb.js";
import { s as readSessionMessageCountAsync } from "./session-transcript-readers-BIeuEaZ3.js";
import { E as loadGatewaySessionEntryReadOnly, M as resolveGatewaySessionStoreTarget } from "./session-utils-row-xwseApeF.js";
import { i as insideGitCheckout } from "./git-DtO1o8gm.js";
import { t as resolveRequestedSessionAgentId } from "./session-request-agent-D8DcCzQX.js";
import "./session-utils-DvNvk7rk.js";
import { n as resolveSandboxRuntimeStatus } from "./runtime-status-DlGUtpYV.js";
import { a as WorktreeRepositoryError, l as slugifyWorktreeTitle, s as managedWorktrees } from "./service-BcZ9HgDx.js";
import { t as ensureSessionDiffBaseline } from "./session-diff-baseline-BqKMUiNL.js";
import { n as emitSessionsChanged } from "./session-change-event-XKNRoRWi.js";
import { n as resolveOperatorSessionCreation } from "./session-creation-provenance-CX5dCIoC.js";
import { t as assertValidParams } from "./validation-CsGeElrb.js";
import { t as normalizeRpcAttachmentsToChatAttachments } from "./attachment-normalize-B7-Wq5M9.js";
import { t as chatHandlers } from "./chat-fuM4lVEL.js";
import { t as buildDashboardSessionTitleSource } from "./dashboard-session-title-RzvyeVO-.js";
import { n as createAgentRuntimeAuthorityGuard } from "./agent-runtime-authority-Clnn0OSD.js";
import { p as sessionLog } from "./sessions-shared-D_8AKVeN.js";
import { t as resolveWorkspacePathContainment } from "./workspace-path-containment-ggQOajTR.js";
import { o as resolveProjectCheckout, s as resolveProjectRegistry, t as ProjectCheckoutError } from "./project-registry-DQKMASKT.js";
import { t as resolveRegisteredCatalogCreateTarget } from "./session-catalog-BraLHG_E.js";
import { n as createGatewaySession, t as buildDashboardSessionKey } from "./session-create-service-u0xZXtb6.js";
import { randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
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
//#region src/gateway/server-methods/session-create-diff-baseline.ts
async function prepareSessionDiffBaseline(params) {
	const workspace = await ensureAgentWorkspace({
		dir: resolveAgentWorkspaceDir(params.cfg, params.agentId),
		ensureBootstrapFiles: !params.cfg.agents?.defaults?.skipBootstrap,
		skipOptionalBootstrapFiles: params.cfg.agents?.defaults?.skipOptionalBootstrapFiles
	});
	return await ensureSessionDiffBaseline({
		cwd: normalizeOptionalString(params.entry.spawnedCwd) ?? normalizeOptionalString(params.entry.spawnedWorkspaceDir) ?? workspace.dir,
		entry: params.entry,
		force: true,
		isNewSession: true,
		sessionKey: params.sessionKey,
		storePath: params.storePath
	});
}
async function captureCreatedSessionDiffBaseline(params) {
	try {
		Object.assign(params.entry, await prepareSessionDiffBaseline({
			agentId: params.agentId,
			cfg: params.cfg,
			entry: params.entry,
			sessionKey: params.key,
			storePath: params.storePath
		}));
	} catch (error) {
		sessionLog.warn(`session diff baseline capture failed for ${params.key}: ${formatErrorMessage(error)}`);
	}
}
//#endregion
//#region src/gateway/server-methods/sessions-create.ts
const sessionCreateHandlers = { "sessions.create": async ({ req, params, respond, context, client, isWebchatConnect }) => {
	if (!assertValidParams(params, validateSessionsCreateParams, "sessions.create", respond)) return;
	const p = params;
	const cfg = context.getRuntimeConfig();
	const authority = createAgentRuntimeAuthorityGuard(client, context, respond);
	const catalogId = normalizeOptionalString(p.catalogId);
	if (catalogId && p.model) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "sessions.create catalogId cannot include model"));
		return;
	}
	if (catalogId && p.key) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "sessions.create catalogId cannot include key"));
		return;
	}
	const explicitlyRequestedKey = normalizeOptionalString(p.key);
	const explicitlyRequestedAgentId = normalizeOptionalString(p.agentId);
	const explicitlyRequestedAgent = resolveRequestedSessionAgentId(cfg, explicitlyRequestedKey ?? (explicitlyRequestedAgentId ? `agent:${normalizeAgentId(explicitlyRequestedAgentId)}:main` : "main"), explicitlyRequestedAgentId, { allowUnconfiguredExplicitAgent: true });
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
	if (requestedProjectId && (requestedCwd || requestedExecNode)) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "sessions.create projectId cannot be combined with cwd or execNode"));
		return;
	}
	if (!(!requestedCwd || (requestedExecNode ? path.isAbsolute(requestedCwd) || path.win32.isAbsolute(requestedCwd) : path.isAbsolute(requestedCwd)))) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "sessions.create cwd must be absolute"));
		return;
	}
	const clientScopes = Array.isArray(client?.connect?.scopes) ? client.connect.scopes : [];
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
	let projectRoot;
	if (requestedProjectId) {
		const project = resolveProjectRegistry(cfg, requestedProjectId);
		if (!project) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `unknown project id: ${requestedProjectId}`));
			return;
		}
		try {
			const checkout = await resolveProjectCheckout(project.repoRoot);
			if (project.source !== "workspace" && checkout.path !== checkout.repoRoot) throw new ProjectCheckoutError(`project root is no longer a git checkout`);
			projectRoot = checkout.path;
		} catch (error) {
			const detail = error instanceof ProjectCheckoutError ? error.message : formatErrorMessage(error);
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, `project ${requestedProjectId} is unavailable (${detail}); re-register it or run openclaw doctor --fix`));
			return;
		}
	}
	let sessionKey = p.key;
	let sessionAgentId = catalogAgentId ?? explicitlyRequestedAgent.agentId ?? p.agentId ?? parseAgentSessionKey(explicitlyRequestedKey)?.agentId;
	let sessionWorktree;
	const sessionExecCwd = requestedExecNode ? requestedCwd : void 0;
	let sessionCwd = requestedExecNode ? void 0 : projectRoot ?? requestedCwd;
	let prepareLifecycle;
	if (sessionCwd && !requestedExecNode && (requestedProjectId || p.worktree !== true)) {
		const targetAgentId = normalizeAgentId(sessionAgentId ?? parseAgentSessionKey(sessionKey ?? "")?.agentId ?? explicitlyRequestedAgent.agentId);
		if (resolveSandboxRuntimeStatus({
			cfg,
			agentId: targetAgentId,
			sessionKey: sessionKey ?? `agent:${targetAgentId}:dashboard:pending`
		}).sandboxed && !isPathInside(resolveUserPath(resolveAgentWorkspaceDir(cfg, targetAgentId)), resolveUserPath(sessionCwd))) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, requestedProjectId ? "sessions.create project is outside the sandboxed agent workspace" : "sessions.create cwd is outside the sandboxed agent workspace"));
			return;
		}
	}
	if (p.worktree === true) {
		const explicitKey = explicitlyRequestedKey;
		const agentId = normalizeAgentId(explicitlyRequestedAgent.agentId ?? normalizeOptionalString(p.agentId) ?? parseAgentSessionKey(explicitKey)?.agentId);
		let targetKey = explicitKey;
		let preservesUnspecifiedKey = false;
		const parentSessionKey = normalizeOptionalString(p.parentSessionKey);
		if (!targetKey && parentSessionKey && p.emitCommandHooks === true && !hasInitialTurn && cfg.session?.dmScope === "main") {
			const parentRequestedAgent = resolveRequestedSessionAgentId(cfg, parentSessionKey, agentId);
			if (!parentRequestedAgent.ok) {
				respond(false, void 0, parentRequestedAgent.error);
				return;
			}
			const parent = loadGatewaySessionEntryReadOnly(parentSessionKey, { agentId: parentRequestedAgent.agentId });
			const parentAgentId = normalizeAgentId(parentRequestedAgent.agentId ?? resolveSessionStoreAgentId(cfg, parent.canonicalKey));
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
					sessionWorktree = await managedWorktrees.create({
						repoRoot: workspace,
						ownerKind: "session",
						ownerId: lifecycleTarget.key,
						name: requestedWorktreeName,
						suggestedName: slugifyWorktreeTitle(normalizeOptionalString(p.label) ?? buildDashboardSessionTitleSource({
							message: initialMessage ?? "",
							attachments: initialAttachments
						})),
						baseRef: requestedWorktreeBaseRef,
						runSetupScript: scopes.includes(ADMIN_SCOPE),
						...authority.commitGuard ? { commitGuard: authority.commitGuard } : {}
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
				return ok({
					spawnedCwd: sessionCwd,
					worktree: {
						id: preparedWorktree.id,
						branch: preparedWorktree.branch,
						repoRoot: preparedWorktree.repoRoot
					},
					...provisioned ? { rollback: async () => {
						await managedWorktrees.remove({
							id: preparedWorktree.id,
							reason: "session-create-failed",
							force: true
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
	const spawnActorSessionKey = sessionCreation.via === "spawn" && sessionCreation.actor?.type === "agent" ? normalizeOptionalString(sessionCreation.actor.id) : void 0;
	if (sessionCreation.inheritedToolPolicy && spawnActorSessionKey && normalizeOptionalString(p.parentSessionKey) !== spawnActorSessionKey) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "spawn parent must match the trusted agent caller"));
		return;
	}
	const allowExistingModelSelection = authorizeOperatorScopesForRequiredScope(ADMIN_SCOPE, clientScopes).allowed;
	const modelCatalogAgentId = normalizeAgentId(sessionAgentId ?? parseAgentSessionKey(sessionKey ?? "")?.agentId ?? explicitlyRequestedAgent.agentId);
	if (!authority.ensureActive()) return;
	const created = await createGatewaySession({
		cfg,
		key: sessionKey,
		agentId: sessionAgentId,
		label: p.label,
		...catalogTarget ? { catalogTarget: catalogTarget.target } : { model: p.model },
		thinkingLevel: p.thinkingLevel,
		projectId: requestedProjectId,
		incognito: p.incognito,
		...client?.connect ? { requestingOperatorScopes: clientScopes } : {},
		visibility: p.visibility,
		allowExistingModelSelection,
		parentSessionKey: p.parentSessionKey,
		spawnDepth: p.spawnDepth,
		spawnToolPolicy: sessionCreation.via === "spawn" && sessionCreation.inheritedToolPolicy ? {
			...sessionCreation.inheritedToolPolicy,
			...sessionCreation.completionOwnerSessionKey ? { completionOwnerSessionKey: sessionCreation.completionOwnerSessionKey } : {}
		} : void 0,
		spawnedCwd: p.worktree === true ? void 0 : sessionCwd,
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
		loadGatewayModelCatalog: () => context.loadGatewayModelCatalog({ agentId: modelCatalogAgentId }),
		...authority.commitGuard ? { commitGuard: authority.commitGuard } : {},
		afterCreate: async ({ key, agentId, entry, storePath }) => {
			if (!authority.hasActive()) return;
			await captureCreatedSessionDiffBaseline({
				key,
				agentId,
				cfg,
				entry,
				storePath
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
	if (created.resetExisting) await captureCreatedSessionDiffBaseline({
		key: created.key,
		agentId: created.agentId,
		cfg,
		entry: created.entry,
		storePath: resolveGatewaySessionStoreTarget({
			cfg,
			key: created.key,
			agentId: created.agentId
		}).storePath
	});
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
//#endregion
export { shouldAttachPendingMessageSeq as n, sessionCreateHandlers as t };
