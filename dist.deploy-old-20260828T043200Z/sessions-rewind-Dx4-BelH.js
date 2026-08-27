import { t as ErrorCodes } from "./gateway-error-details-C2IaYyht.js";
import { Ur as validateSessionsForkParams, br as validateSessionsBranchesListParams, mi as validateSessionsRewindParams, xr as validateSessionsBranchesSwitchParams } from "./src-4dv5TpeQ.js";
import { l as isCompetingSessionWorkAdmissionActive, p as runExclusiveSessionLifecycleMutation } from "./session-lifecycle-admission-1qqb7Ac0.js";
import { B as listSessionBranches, H as rewindSessionToMessage, U as switchSessionBranch, z as forkSessionAtMessage } from "./session-accessor-B-FKZX9M.js";
import { u as recordSessionCreated } from "./session-state-events-BkuyPMaw.js";
import { r as readSessionUpstreamLink } from "./session-upstream-links-CTGE6Gwv.js";
import { d as errorShape } from "./validation-errors-rELRlKfn.js";
import { r as listRegisteredAgentHarnesses } from "./registry-lPXwErEe.js";
import { t as MEDIA_MAX_BYTES, u as readMediaBuffer } from "./store-B6ILpvye.js";
import { i as tryResolveSessionCompatibilityOwnerAgentId, n as resolveRequestedSessionAgentId } from "./session-request-agent-C9E8iDY4.js";
import { t as clearSessionQueues } from "./cleanup-BNML21Fq.js";
import { r as resolveSessionWorkerPlacementMutationError } from "./session-placement-lifecycle-SteNC2br.js";
import { a as resolveCreatorSandbox, t as authorizeGatewaySessionCreation } from "./operator-role-policy-Bvt-UeJ1.js";
import { i as resolveVisibleActiveSessionRunState } from "./session-active-runs-C7YJ2XPa.js";
import { n as emitSessionsChanged } from "./session-change-event-BVVK9xuQ.js";
import { n as resolveOperatorSessionCreation } from "./session-creation-provenance-B9w3HHXu.js";
import { t as asWorkerInferenceControl } from "./inference-control-CDvM08Nt.js";
import { t as assertValidParams } from "./validation-kYFXohur.js";
import { d as respondSessionWorkerPlacementMutationError, i as loadAccessorSessionEntryForGatewayTarget } from "./sessions-shared-BYADMHw6.js";
import { t as buildDashboardSessionKey } from "./session-create-service-CjNljuQX.js";
import path from "node:path";
//#region src/gateway/server-methods/sessions-rewind.ts
const EXTERNAL_CONVERSATION_ERROR = "Session history changes are unavailable because this session is owned by an external agent harness.";
const EDITOR_MEDIA_REF_LIMIT = 10;
async function resolveEditorMediaAttachments(refs) {
	if (!refs) return [];
	const seen = /* @__PURE__ */ new Set();
	const attachments = [];
	for (const ref of refs) {
		const id = path.basename(ref.path);
		if (seen.has(id)) continue;
		seen.add(id);
		if (seen.size > EDITOR_MEDIA_REF_LIMIT) break;
		try {
			const media = await readMediaBuffer(id, "inbound", MEDIA_MAX_BYTES);
			attachments.push({
				mimeType: ref.contentType,
				data: media.buffer.toString("base64")
			});
		} catch {}
	}
	return attachments;
}
function resolveUpstreamForkHarness(link) {
	const matches = listRegisteredAgentHarnesses().filter((entry) => entry.harness.sessionFork?.upstreamKinds.includes(link.upstreamKind));
	return matches.length === 1 ? matches[0]?.harness.sessionFork : void 0;
}
const sessionRewindHandlers = {
	"sessions.branches.list": async (options) => {
		if (!assertValidParams(options.params, validateSessionsBranchesListParams, "sessions.branches.list", options.respond)) return;
		await listBranches(options);
	},
	"sessions.branches.switch": async (options) => {
		if (!assertValidParams(options.params, validateSessionsBranchesSwitchParams, "sessions.branches.switch", options.respond)) return;
		await mutateSessionAtMessage(options, "switch");
	},
	"sessions.rewind": async (options) => {
		if (!assertValidParams(options.params, validateSessionsRewindParams, "sessions.rewind", options.respond)) return;
		await mutateSessionAtMessage(options, "rewind");
	},
	"sessions.fork": async (options) => {
		if (!assertValidParams(options.params, validateSessionsForkParams, "sessions.fork", options.respond)) return;
		await mutateSessionAtMessage(options, "fork");
	}
};
async function listBranches(options) {
	const { params, respond, context } = options;
	const sessionKey = typeof params.sessionKey === "string" ? params.sessionKey.trim() : "";
	const cfg = context.getRuntimeConfig();
	const requestedAgent = resolveRequestedSessionAgentId(cfg, sessionKey, typeof params.agentId === "string" ? params.agentId : void 0);
	if (!requestedAgent.ok) {
		respond(false, void 0, requestedAgent.error);
		return;
	}
	const current = loadAccessorSessionEntryForGatewayTarget({
		key: sessionKey,
		cfg,
		agentId: requestedAgent.agentId
	});
	if (!current.entry?.sessionId) {
		respond(true, { branches: [] }, void 0);
		return;
	}
	if (readSessionUpstreamLink(current.canonicalKey, current.target.agentId)) {
		respond(true, { branches: [] }, void 0);
		return;
	}
	const result = await listSessionBranches({
		agentId: current.target.agentId,
		sessionKey: current.canonicalKey,
		sessionStoreKey: current.sessionStoreKey,
		storePath: current.storePath
	});
	if (result.status !== "ok") {
		respondBranchListError(result, respond);
		return;
	}
	respond(true, { branches: result.branches }, void 0);
}
async function mutateSessionAtMessage(options, action) {
	const { params, respond, context, client } = options;
	const sessionKey = typeof params.sessionKey === "string" ? params.sessionKey.trim() : "";
	const entryId = action === "switch" ? typeof params.leafEntryId === "string" ? params.leafEntryId.trim() : "" : typeof params.entryId === "string" ? params.entryId.trim() : "";
	const cfg = context.getRuntimeConfig();
	const requestedAgent = resolveRequestedSessionAgentId(cfg, sessionKey, typeof params.agentId === "string" ? params.agentId : void 0);
	if (!requestedAgent.ok) {
		respond(false, void 0, requestedAgent.error);
		return;
	}
	const initial = loadAccessorSessionEntryForGatewayTarget({
		key: sessionKey,
		cfg,
		agentId: requestedAgent.agentId
	});
	if (!initial.entry?.sessionId) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `session not found: ${sessionKey}`));
		return;
	}
	if (action === "fork") {
		const creationError = authorizeGatewaySessionCreation({
			cfg,
			client,
			agentId: initial.target.agentId
		});
		if (creationError) {
			respond(false, void 0, creationError);
			return;
		}
	}
	const initialSessionId = initial.entry.sessionId;
	const initialLifecycleRevision = initial.entry.lifecycleRevision;
	if (readSessionUpstreamLink(initial.canonicalKey, initial.target.agentId) && action !== "fork") {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, EXTERNAL_CONVERSATION_ERROR));
		return;
	}
	const initialPlacementError = resolveSessionWorkerPlacementMutationError({
		action,
		context,
		key: sessionKey,
		sessionId: initial.entry.sessionId
	});
	if (initialPlacementError) {
		respondSessionWorkerPlacementMutationError(initialPlacementError, respond);
		return;
	}
	const lifecycleIdentities = [
		sessionKey,
		initial.canonicalKey,
		initial.sessionStoreKey,
		initialSessionId,
		initialLifecycleRevision
	];
	let targetStillCurrent = true;
	let blockedByActiveRun = false;
	await runExclusiveSessionLifecycleMutation({
		scope: initial.storePath,
		identities: [initialSessionId, initialLifecycleRevision],
		prepare: async () => {
			const current = loadAccessorSessionEntryForGatewayTarget({
				key: sessionKey,
				cfg,
				agentId: requestedAgent.agentId
			});
			targetStillCurrent = current.entry?.sessionId === initialSessionId && current.entry.lifecycleRevision === initialLifecycleRevision;
			if (!targetStillCurrent) return;
			blockedByActiveRun = isCompetingSessionWorkAdmissionActive(initial.storePath, lifecycleIdentities) || (asWorkerInferenceControl(context.workerEnvironmentService)?.hasInferenceForSession(initialSessionId) ?? false) || resolveVisibleActiveSessionRunState({
				context,
				requestedKey: sessionKey,
				canonicalKey: current.canonicalKey,
				sessionId: initialSessionId,
				agentId: requestedAgent.agentId,
				defaultAgentId: tryResolveSessionCompatibilityOwnerAgentId(cfg, sessionKey)
			}).active;
		},
		run: async () => {
			if (!targetStillCurrent) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `Session ${sessionKey} changed; retry ${action}.`));
				return;
			}
			if (blockedByActiveRun) {
				respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, action === "switch" ? "Branch switch is unavailable while the agent is working." : `${action === "fork" ? "Fork" : "Rewind"} is unavailable while the agent is working.`));
				return;
			}
			const current = loadAccessorSessionEntryForGatewayTarget({
				key: sessionKey,
				cfg,
				agentId: requestedAgent.agentId
			});
			if (current.entry?.sessionId !== initialSessionId || current.entry.lifecycleRevision !== initialLifecycleRevision) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `Session ${sessionKey} changed; retry ${action}.`));
				return;
			}
			const upstreamLink = readSessionUpstreamLink(current.canonicalKey, current.target.agentId);
			const archived = current.entry.archivedAt !== void 0;
			if ((archived || upstreamLink) && action !== "fork") {
				const message = archived ? `${action === "switch" ? "Branch switch" : "Rewind"} is unavailable for archived sessions.` : EXTERNAL_CONVERSATION_ERROR;
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, message));
				return;
			}
			const placementError = resolveSessionWorkerPlacementMutationError({
				action,
				context,
				key: sessionKey,
				sessionId: current.entry.sessionId
			});
			if (placementError) {
				respondSessionWorkerPlacementMutationError(placementError, respond);
				return;
			}
			const targetKey = action === "fork" ? buildDashboardSessionKey(current.target.agentId) : current.canonicalKey;
			const expectedState = {
				sessionId: current.entry.sessionId,
				lifecycleRevision: current.entry.lifecycleRevision
			};
			const upstreamForkHarness = upstreamLink ? resolveUpstreamForkHarness(upstreamLink) : void 0;
			if (upstreamLink && !upstreamForkHarness) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, EXTERNAL_CONVERSATION_ERROR));
				return;
			}
			const upstreamFork = upstreamLink && upstreamForkHarness ? await upstreamForkHarness.fork({
				targetKey,
				source: {
					agentId: current.target.agentId,
					sessionId: current.entry.sessionId,
					sessionKey: current.canonicalKey,
					storePath: current.storePath,
					entryId
				},
				upstream: {
					catalogId: upstreamLink.catalogId,
					hostId: upstreamLink.hostId,
					kind: upstreamLink.upstreamKind,
					threadId: upstreamLink.threadId,
					ref: upstreamLink.upstreamRef
				}
			}) : void 0;
			if (upstreamFork?.status === "failed") {
				respond(false, void 0, errorShape(upstreamFork.code === "upstream-unavailable" ? ErrorCodes.UNAVAILABLE : ErrorCodes.INVALID_REQUEST, upstreamFork.message, { details: { reason: upstreamFork.code } }));
				return;
			}
			if (upstreamFork?.status === "created") {
				respond(true, {
					sessionKey: upstreamFork.key,
					...upstreamFork.editorText !== void 0 ? { editorText: upstreamFork.editorText } : {}
				}, void 0);
				emitSessionsChanged(context, {
					sessionKey: upstreamFork.key,
					agentId: requestedAgent.agentId,
					reason: "fork"
				});
				return;
			}
			let result;
			try {
				const creation = resolveOperatorSessionCreation(client);
				result = await (action === "fork" ? forkSessionAtMessage({
					agentId: current.target.agentId,
					entryId,
					sessionKey: current.canonicalKey,
					sessionStoreKey: current.sessionStoreKey,
					storePath: current.storePath,
					targetKey,
					creation: {
						...creation,
						...resolveCreatorSandbox(cfg, creation) === "required" ? { sandbox: "required" } : {}
					}
				}, expectedState) : action === "rewind" ? rewindSessionToMessage({
					agentId: current.target.agentId,
					entryId,
					sessionKey: current.canonicalKey,
					sessionStoreKey: current.sessionStoreKey,
					storePath: current.storePath
				}, expectedState) : switchSessionBranch({
					agentId: current.target.agentId,
					leafEntryId: entryId,
					sessionKey: current.canonicalKey,
					sessionStoreKey: current.sessionStoreKey,
					storePath: current.storePath
				}, expectedState));
			} catch {
				respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, `Failed to ${action} the local session. Try again.`));
				return;
			}
			if (result.status !== "created") {
				respondMessageCutError(result, action, entryId, respond);
				return;
			}
			const editorAttachments = action === "switch" ? [] : [..."editorAttachments" in result ? result.editorAttachments ?? [] : [], ...await resolveEditorMediaAttachments("editorMediaRefs" in result ? result.editorMediaRefs : void 0)];
			if (action !== "fork") clearSessionQueues(lifecycleIdentities);
			else recordSessionCreated({
				sessionKey: result.key,
				agentId: current.target.agentId,
				entry: result.entry
			});
			respond(true, action === "fork" ? {
				sessionKey: result.key,
				..."editorText" in result && result.editorText ? { editorText: result.editorText } : {},
				...editorAttachments.length > 0 ? { editorAttachments } : {}
			} : action === "rewind" ? {
				..."editorText" in result && result.editorText ? { editorText: result.editorText } : {},
				...editorAttachments.length > 0 ? { editorAttachments } : {}
			} : {}, void 0);
			emitSessionsChanged(context, {
				sessionKey: action === "fork" ? result.key : current.canonicalKey,
				agentId: requestedAgent.agentId,
				reason: action === "switch" ? "branch-switch" : action
			});
		}
	});
}
function respondMessageCutError(result, action, entryId, respond) {
	const actionLabel = action === "switch" ? "branch switch" : action;
	const message = result.status === "conflict" ? `Session changed; retry ${action}.` : result.status === "missing-session" ? "session not found" : result.status === "missing-entry" ? `${action === "switch" ? "branch" : "message"} entry not found: ${entryId}` : result.status === "not-branch-tip" ? `entry is not a branch tip: ${entryId}` : result.status === "already-active" ? `branch is already active: ${entryId}` : result.status === "not-user-message" ? `entry is not a user message: ${entryId}` : result.status === "off-active-path" ? `message entry is not on the active path: ${entryId}` : result.status === "unsupported-storage" ? `session transcript storage does not support ${actionLabel}` : `failed to ${actionLabel} session`;
	respond(false, void 0, errorShape(result.status === "failed" ? ErrorCodes.UNAVAILABLE : ErrorCodes.INVALID_REQUEST, message));
}
function respondBranchListError(result, respond) {
	const message = result.status === "missing-session" ? "session not found" : result.status === "unsupported-storage" ? "session transcript storage does not support branch listing" : "failed to list session branches";
	respond(false, void 0, errorShape(result.status === "failed" ? ErrorCodes.UNAVAILABLE : ErrorCodes.INVALID_REQUEST, message));
}
//#endregion
export { sessionRewindHandlers };
