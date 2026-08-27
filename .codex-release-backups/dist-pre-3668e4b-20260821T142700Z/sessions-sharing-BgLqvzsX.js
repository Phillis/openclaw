import { t as ErrorCodes } from "./gateway-error-details-BWo6Le6w.js";
import { en as patchSessionEntryCore } from "./session-accessor-CIiPoGwM.js";
import { X as runExclusiveSessionLifecycleMutation } from "./agent-harness-session-key-BpWapmwX.js";
import { ar as validateSessionMemberAddParams, fr as validateSessionVisibilitySetParams, or as validateSessionMemberRemoveParams, sr as validateSessionMembersListParams } from "./src-BlUKtAtD.js";
import { s as errorShape } from "./error-codes-CMSvT5-d.js";
import { n as loadCombinedSessionStoreForGatewayCore } from "./combined-store-gateway-BgoNjNGZ.js";
import { d as removeSessionMember, l as listSessionMembers, s as addSessionMember } from "./sessions-Bh837xaa.js";
import { t as resolveRequestedSessionAgentId } from "./session-request-agent-D8DcCzQX.js";
import { f as listProfiles } from "./user-profiles-BhIW_Pod.js";
import { d as isSessionVisibilityAllowed, g as invalidateSessionSharingSnapshot, h as resolveSessionVisibility, m as resolveSessionSharingTarget, n as allowedSessionVisibilities, p as resolveSessionSharingRole, s as canManageSessionSharing, v as gatewayClientSessionCreator } from "./session-sharing-YSn98RD0.js";
import { n as emitSessionsChanged } from "./session-change-event-XKNRoRWi.js";
import { t as assertValidParams } from "./validation-CsGeElrb.js";
import { t as appendSessionAudit } from "./session-audit-CV4hulLj.js";
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
function actorIdentity(client) {
	return gatewayClientSessionCreator(client) ?? (client?.connect.scopes?.includes("operator.admin") ? {
		type: "system",
		id: "operator.admin",
		label: "Administrator"
	} : {
		type: "system",
		id: "local-operator",
		label: "Local operator"
	});
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
	remember(params.actor);
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
	params.context.broadcast("session.sharing", params.event, { sessionKeys: [params.event.sessionKey] });
	emitSessionsChanged(params.context, {
		reason: "sharing",
		sessionKey: params.event.sessionKey,
		agentId: params.agentId
	});
	emitSessionsChanged(params.context, { reason: "sharing" });
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
			const previous = resolveSessionVisibility(current.entry);
			if (previous === visibility) return;
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
			invalidateSessionSharingSnapshot(current.canonicalKey);
			const now = Date.now();
			const actor = actorIdentity(client);
			try {
				await appendSessionAudit({
					cfg,
					target: {
						...current,
						sessionKey: current.storeKey
					},
					text: `${actor.label ?? actor.id} changed session visibility from ${previous} to ${visibility}.`,
					now
				});
			} catch (error) {
				await patchSessionEntryCore(scope, (entry) => entry.sessionId === current.entry.sessionId && resolveSessionVisibility(entry) === visibility ? { visibility: previous } : null);
				invalidateSessionSharingSnapshot(current.canonicalKey);
				throw error;
			}
			publishSharingChange({
				context,
				agentId: current.agentId,
				event: {
					action: "visibility",
					sessionKey: current.canonicalKey,
					agentId: current.agentId,
					actor,
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
	"session.members.list": async ({ params, respond, client, context }) => {
		if (!assertValidParams(params, validateSessionMembersListParams, "session.members.list", respond)) return;
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
		const members = listSessionMembers({
			agentId: target.agentId,
			sessionKey: target.storeKey,
			storePath: target.storePath
		});
		const identities = knownSessionIdentities({
			cfg,
			actor
		});
		for (const member of members) if (!identities.some((identity) => identity.id === member.identityId)) identities.push({
			type: "human",
			id: member.identityId
		});
		identities.sort((left, right) => (left.label ?? left.id).localeCompare(right.label ?? right.id) || left.id.localeCompare(right.id));
		const owner = target.entry.createdActor?.id ? target.entry.createdActor : void 0;
		respond(true, {
			sessionKey: target.canonicalKey,
			...owner ? { owner: { ...owner } } : {},
			members,
			identities,
			role: managed.role,
			allowedVisibilities: allowedSessionVisibilities(cfg)
		}, void 0);
	},
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
			const added = addSessionMember(scope, {
				identityId: params.identityId,
				addedBy: actor.id,
				addedAt: now,
				expectedSessionId: current.entry.sessionId
			});
			if (!added.inserted) return;
			try {
				await appendSessionAudit({
					cfg,
					target: {
						...current,
						sessionKey: current.storeKey
					},
					text: `${actor.label ?? actor.id} added ${params.identityId} as a session member.`,
					now
				});
			} catch (error) {
				removeSessionMember(scope, params.identityId, added.member, current.entry.sessionId);
				throw error;
			}
			publishSharingChange({
				context,
				agentId: current.agentId,
				event: {
					action: "member-added",
					sessionKey: current.canonicalKey,
					agentId: current.agentId,
					actor,
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
			const scope = {
				agentId: current.agentId,
				sessionKey: current.storeKey,
				storePath: current.storePath
			};
			const removed = removeSessionMember(scope, params.identityId, void 0, current.entry.sessionId);
			if (!removed) return;
			const now = Date.now();
			const actor = actorIdentity(client);
			try {
				await appendSessionAudit({
					cfg,
					target: {
						...current,
						sessionKey: current.storeKey
					},
					text: `${actor.label ?? actor.id} removed ${params.identityId} from session members.`,
					now
				});
			} catch (error) {
				addSessionMember(scope, {
					identityId: removed.identityId,
					addedBy: removed.addedBy,
					addedAt: removed.addedAt,
					expectedSessionId: current.entry.sessionId
				});
				throw error;
			}
			publishSharingChange({
				context,
				agentId: current.agentId,
				event: {
					action: "member-removed",
					sessionKey: current.canonicalKey,
					agentId: current.agentId,
					actor,
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
