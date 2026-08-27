import { t as ErrorCodes } from "./gateway-error-details-C2IaYyht.js";
import { _r as validateSessionVisibilitySetParams, dr as validateSessionMemberRemoveParams, fr as validateSessionMembersListParams, ur as validateSessionMemberAddParams } from "./src-4dv5TpeQ.js";
import { m as patchSessionEntryCore } from "./session-accessor.sqlite-entry-CNdoUuFZ.js";
import { p as runExclusiveSessionLifecycleMutation } from "./session-lifecycle-admission-1qqb7Ac0.js";
import "./session-accessor-B-FKZX9M.js";
import { n as loadCombinedSessionStoreForGatewayCore } from "./combined-store-gateway-DCSDDfZL.js";
import { _ as removeSessionMember, h as listSessionMembers, p as addSessionMember } from "./sessions-CdrF1uzY.js";
import { d as errorShape } from "./validation-errors-rELRlKfn.js";
import { m as listProfiles } from "./user-profiles-DGHdUlAe.js";
import { n as resolveRequestedSessionAgentId } from "./session-request-agent-C9E8iDY4.js";
import { d as gatewayClientSessionCreator } from "./operator-role-policy-Bvt-UeJ1.js";
import { _ as resolveSessionVisibility, c as canManageSessionSharing, g as resolveSessionSharingTarget, h as resolveSessionSharingRole, n as allowedSessionVisibilities, p as isSessionVisibilityAllowed, v as invalidateSessionSharingSnapshot } from "./session-sharing-C4OmHGYo.js";
import { n as emitSessionsChanged } from "./session-change-event-BVVK9xuQ.js";
import { t as assertValidParams } from "./validation-kYFXohur.js";
import { n as getGatewayLocalUserIngress } from "./local-user-ingress-Ci8q8U5g.js";
//#region src/gateway/server-methods/sessions-sharing.ts
function runExclusiveSharingMutation(target, run) {
	return runExclusiveSessionLifecycleMutation({
		scope: target.storePath,
		identities: [
			target.canonicalKey,
			target.storeKey,
			...target.storeKeys,
			target.entry.sessionId
		],
		run
	});
}
const UNKNOWN_SHARING_ACTOR_STORAGE_REF = "actor-evidence:unknown";
const UNATTRIBUTED_SHARING_ACTOR_STORAGE_REF = "actor-evidence:unattributed";
const LEGACY_SYNTHETIC_SHARING_ACTOR_STORAGE_REFS = /* @__PURE__ */ new Set(["local-operator", "operator.admin"]);
function actorIdentity(client) {
	const principal = gatewayClientSessionCreator(client);
	if (principal) return {
		state: "present",
		actor: principal
	};
	return getGatewayLocalUserIngress(client)?.facts.invoker?.state === "unknown" ? { state: "unknown" } : { state: "absent" };
}
function sharingActorStorageRef(facts) {
	return facts.state === "present" ? facts.actor.id : facts.state === "unknown" ? UNKNOWN_SHARING_ACTOR_STORAGE_REF : UNATTRIBUTED_SHARING_ACTOR_STORAGE_REF;
}
function projectSessionMemberEvidence(member) {
	const common = {
		identityId: member.identityId,
		addedAt: member.addedAt
	};
	if (member.addedBy === UNKNOWN_SHARING_ACTOR_STORAGE_REF) return {
		...common,
		addedByState: "unknown"
	};
	if (member.addedBy === UNATTRIBUTED_SHARING_ACTOR_STORAGE_REF || LEGACY_SYNTHETIC_SHARING_ACTOR_STORAGE_REFS.has(member.addedBy)) return common;
	return {
		...common,
		addedBy: member.addedBy
	};
}
function projectLegacySessionMember(member) {
	if (!member.addedBy) return null;
	return {
		identityId: member.identityId,
		addedBy: member.addedBy,
		addedAt: member.addedAt
	};
}
function requireManageableTarget(params) {
	const requestedAgent = resolveRequestedSessionAgentId(params.cfg, params.sessionKey, params.agentId);
	if (!requestedAgent.ok) {
		params.respond(false, void 0, requestedAgent.error);
		return null;
	}
	const target = resolveSessionSharingTarget({
		cfg: params.cfg,
		sessionKey: params.sessionKey,
		agentId: requestedAgent.agentId
	});
	if (!target) {
		params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `unknown session: ${params.sessionKey}`));
		return null;
	}
	const role = resolveSessionSharingRole({
		client: params.client,
		cfg: params.cfg,
		target
	});
	if (!canManageSessionSharing(role)) {
		params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "session owner or operator.admin required", { details: {
			code: "SESSION_SHARING_MANAGER_REQUIRED",
			sessionKey: target.canonicalKey
		} }));
		return null;
	}
	return {
		target,
		role
	};
}
function requireCurrentManagedTarget(params) {
	const current = resolveSessionSharingTarget({
		cfg: params.cfg,
		sessionKey: params.authorized.canonicalKey,
		agentId: params.authorized.agentId
	});
	if (!current || current.entry.sessionId !== params.authorized.entry.sessionId) throw new Error("session changed before sharing mutation");
	if (!canManageSessionSharing(resolveSessionSharingRole({
		client: params.client,
		cfg: params.cfg,
		target: current
	}))) throw new Error("session ownership changed before sharing mutation");
	return current;
}
function knownSessionIdentities(params) {
	const identities = /* @__PURE__ */ new Map();
	const remember = (identity) => {
		if (!identity?.id) return;
		const current = identities.get(identity.id);
		identities.set(identity.id, {
			type: identity.type,
			id: identity.id,
			...identity.label ?? current?.label ? { label: identity.label ?? current?.label } : {}
		});
	};
	if (params.actor.state === "present") remember(params.actor.actor);
	for (const entry of Object.values(loadCombinedSessionStoreForGatewayCore(params.cfg).store)) remember(entry.createdActor ?? null);
	for (const profile of listProfiles()) remember({
		type: "human",
		id: profile.id,
		...profile.displayName ? { label: profile.displayName } : {}
	});
	return [...identities.values()].toSorted((left, right) => (left.label ?? left.id).localeCompare(right.label ?? right.id) || left.id.localeCompare(right.id));
}
function publishSharingChange(params) {
	invalidateSessionSharingSnapshot(params.event.sessionKey);
	const eventOptions = { sessionKeys: [params.event.sessionKey] };
	if (params.actor.state === "present") {
		const event = {
			...params.event,
			actor: params.actor.actor
		};
		params.context.broadcast("session.sharing", event, eventOptions);
	} else {
		const event = {
			...params.event,
			...params.actor.state === "unknown" ? { actorState: "unknown" } : {}
		};
		params.context.broadcast("session.sharing.evidence", event, eventOptions);
	}
	emitSessionsChanged(params.context, {
		reason: "sharing",
		sessionKey: params.event.sessionKey,
		agentId: params.agentId
	});
	emitSessionsChanged(params.context, { reason: "sharing" });
}
function createSessionMembersListHandler(method) {
	const evidenceAware = method === "session.members.listEvidence";
	return async ({ params, respond, client, context }) => {
		if (!assertValidParams(params, validateSessionMembersListParams, method, respond)) return;
		const cfg = context.getRuntimeConfig();
		const managed = requireManageableTarget({
			cfg,
			client,
			sessionKey: params.sessionKey,
			agentId: params.agentId,
			respond
		});
		if (!managed) return;
		const target = managed.target;
		const actor = actorIdentity(client);
		const evidenceMembers = listSessionMembers({
			agentId: target.agentId,
			sessionKey: target.storeKey,
			storePath: target.storePath
		}).map(projectSessionMemberEvidence);
		const members = evidenceAware ? evidenceMembers : evidenceMembers.map(projectLegacySessionMember);
		if (!evidenceAware && members.some((member) => member === null)) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "session membership includes actor evidence this client cannot represent", { details: {
				code: "SESSION_MEMBER_ACTOR_EVIDENCE_UNSUPPORTED",
				recommendedMethod: "session.members.listEvidence"
			} }));
			return;
		}
		const projectedMembers = members.filter((member) => member !== null);
		const identities = knownSessionIdentities({
			cfg,
			actor
		});
		for (const member of projectedMembers) if (!identities.some((identity) => identity.id === member.identityId)) identities.push({
			type: "human",
			id: member.identityId
		});
		identities.sort((left, right) => (left.label ?? left.id).localeCompare(right.label ?? right.id) || left.id.localeCompare(right.id));
		const owner = target.entry.createdActor?.id ? target.entry.createdActor : void 0;
		respond(true, {
			sessionKey: target.canonicalKey,
			...owner ? { owner: { ...owner } } : {},
			members: projectedMembers,
			identities,
			role: managed.role,
			allowedVisibilities: allowedSessionVisibilities(cfg)
		}, void 0);
	};
}
const sessionSharingHandlers = {
	"session.visibility.set": async ({ params, respond, client, context }) => {
		if (!assertValidParams(params, validateSessionVisibilitySetParams, "session.visibility.set", respond)) return;
		const cfg = context.getRuntimeConfig();
		const managed = requireManageableTarget({
			cfg,
			client,
			sessionKey: params.sessionKey,
			agentId: params.agentId,
			respond
		});
		if (!managed) return;
		const visibility = params.visibility;
		if (!isSessionVisibilityAllowed(cfg, visibility)) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `session visibility is disabled: ${visibility}`, { details: {
				code: "SESSION_VISIBILITY_DISABLED",
				visibility
			} }));
			return;
		}
		await runExclusiveSharingMutation(managed.target, async () => {
			const current = requireCurrentManagedTarget({
				cfg,
				client,
				authorized: managed.target
			});
			if (resolveSessionVisibility(current.entry) === visibility) return;
			const scope = {
				agentId: current.agentId,
				sessionKey: current.canonicalKey,
				storePath: current.storePath
			};
			let sessionChanged = false;
			await patchSessionEntryCore(scope, (entry) => {
				if (entry.sessionId !== current.entry.sessionId) {
					sessionChanged = true;
					return null;
				}
				return { visibility };
			});
			if (sessionChanged) throw new Error("session changed before sharing mutation");
			const now = Date.now();
			const actor = actorIdentity(client);
			publishSharingChange({
				context,
				agentId: current.agentId,
				actor,
				event: {
					action: "visibility",
					sessionKey: current.canonicalKey,
					agentId: current.agentId,
					visibility,
					ts: now
				}
			});
		});
		respond(true, {
			ok: true,
			sessionKey: managed.target.canonicalKey,
			visibility
		}, void 0);
	},
	"session.members.list": createSessionMembersListHandler("session.members.list"),
	"session.members.listEvidence": createSessionMembersListHandler("session.members.listEvidence"),
	"session.members.add": async ({ params, respond, client, context }) => {
		if (!assertValidParams(params, validateSessionMemberAddParams, "session.members.add", respond)) return;
		const cfg = context.getRuntimeConfig();
		const managed = requireManageableTarget({
			cfg,
			client,
			sessionKey: params.sessionKey,
			agentId: params.agentId,
			respond
		});
		if (!managed) return;
		const actor = actorIdentity(client);
		if (!knownSessionIdentities({
			cfg,
			actor
		}).some((identity) => identity.id === params.identityId)) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "unknown identity"));
			return;
		}
		await runExclusiveSharingMutation(managed.target, async () => {
			const current = requireCurrentManagedTarget({
				cfg,
				client,
				authorized: managed.target
			});
			const scope = {
				agentId: current.agentId,
				sessionKey: current.storeKey,
				storePath: current.storePath
			};
			const now = Date.now();
			if (!addSessionMember(scope, {
				identityId: params.identityId,
				addedBy: sharingActorStorageRef(actor),
				addedAt: now,
				expectedSessionId: current.entry.sessionId
			}).inserted) return;
			publishSharingChange({
				context,
				agentId: current.agentId,
				actor,
				event: {
					action: "member-added",
					sessionKey: current.canonicalKey,
					agentId: current.agentId,
					identityId: params.identityId,
					ts: now
				}
			});
		});
		respond(true, {
			ok: true,
			sessionKey: managed.target.canonicalKey,
			identityId: params.identityId
		}, void 0);
	},
	"session.members.remove": async ({ params, respond, client, context }) => {
		if (!assertValidParams(params, validateSessionMemberRemoveParams, "session.members.remove", respond)) return;
		const cfg = context.getRuntimeConfig();
		const managed = requireManageableTarget({
			cfg,
			client,
			sessionKey: params.sessionKey,
			agentId: params.agentId,
			respond
		});
		if (!managed) return;
		await runExclusiveSharingMutation(managed.target, async () => {
			const current = requireCurrentManagedTarget({
				cfg,
				client,
				authorized: managed.target
			});
			if (!removeSessionMember({
				agentId: current.agentId,
				sessionKey: current.storeKey,
				storePath: current.storePath
			}, params.identityId, void 0, current.entry.sessionId)) return;
			const now = Date.now();
			const actor = actorIdentity(client);
			publishSharingChange({
				context,
				agentId: current.agentId,
				actor,
				event: {
					action: "member-removed",
					sessionKey: current.canonicalKey,
					agentId: current.agentId,
					identityId: params.identityId,
					ts: now
				}
			});
		});
		respond(true, {
			ok: true,
			sessionKey: managed.target.canonicalKey,
			identityId: params.identityId
		}, void 0);
	}
};
//#endregion
export { sessionSharingHandlers };
