import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import "./src-BntaCZM-.js";
import { t as stableStringify } from "./stable-stringify-DoZ6Yalc.js";
import { l as readToolAllowlistIntersection } from "./tool-policy-shared-DmpG3HvD.js";
import "./tool-policy-B1rvCc4B.js";
import { t as normalizeChatType } from "./chat-type-CG0X_HJM.js";
import { b as resolveGroupSessionKey } from "./session-lifecycle-admission-BtKN0pjk.js";
import { n as resolveSandboxRuntimeStatus } from "./runtime-status-D-khMh6L.js";
import { t as resolveConversationCapabilityProfile } from "./conversation-capability-profile-D367C0tS.js";
import { t as resolveOriginMessageProvider } from "./origin-routing-Dv8H5khf.js";
import { createHash } from "node:crypto";
//#region src/auto-reply/reply/reply-tool-authority.ts
/** Projects current inbound facts against the active run's frozen authority snapshot. */
function resolveInboundReplyToolAuthorityOverlay(params) {
	const { ctx } = params;
	return {
		originatingChannel: ctx.OriginatingChannel,
		messageProvider: resolveOriginMessageProvider({
			originatingChannel: ctx.OriginatingChannel,
			provider: ctx.Provider ?? ctx.Surface
		}),
		chatType: normalizeChatType(ctx.ChatType),
		agentAccountId: ctx.AccountId,
		conversationToolPolicy: ctx.ConversationToolPolicy,
		groupId: resolveGroupSessionKey(ctx)?.id,
		groupChannel: normalizeOptionalString(ctx.GroupChannel) ?? normalizeOptionalString(ctx.GroupSubject),
		groupSpace: normalizeOptionalString(ctx.GroupSpace),
		memberRoleIds: Array.isArray(ctx.MemberRoleIds) ? ctx.MemberRoleIds.map((roleId) => normalizeOptionalString(roleId)).filter((roleId) => Boolean(roleId)) : void 0,
		spawnedBy: normalizeOptionalString(params.sessionEntry?.spawnedBy),
		senderId: normalizeOptionalString(ctx.SenderId),
		senderName: normalizeOptionalString(ctx.SenderName),
		senderUsername: normalizeOptionalString(ctx.SenderUsername),
		senderE164: normalizeOptionalString(ctx.SenderE164),
		senderIsOwner: params.senderIsOwner,
		inputProvenance: ctx.InputProvenance,
		trustedInternalHandoff: void 0,
		scheduledToolPolicy: void 0,
		runtimePluginToolGrant: void 0,
		toolsAllow: params.toolsAllow,
		disableTools: params.disableTools,
		traceAuthorized: params.senderIsOwner || (ctx.GatewayClientScopes ?? []).includes("operator.admin"),
		approvalReviewerDeviceId: normalizeOptionalString(ctx.ApprovalReviewerDeviceId),
		clientCaps: ctx.GatewayClientCaps,
		toolBindings: ctx.GatewayRunToolBindings
	};
}
function snapshotFollowupRunToolAuthority(run) {
	return {
		originatingChannel: run.originatingChannel,
		toolsAllow: run.toolsAllow,
		toolsAllowIntersection: run.toolsAllow ? readToolAllowlistIntersection(run.toolsAllow) : void 0,
		disableTools: run.disableTools === true,
		run: {
			...run.run,
			clientCaps: run.run.clientCaps ? [...run.run.clientCaps] : void 0,
			memberRoleIds: run.run.memberRoleIds ? [...run.run.memberRoleIds] : void 0
		}
	};
}
function applyReplyToolAuthorityOverlay(snapshot, overlay) {
	return {
		...snapshot,
		originatingChannel: overlay.originatingChannel,
		toolsAllow: overlay.toolsAllow,
		toolsAllowIntersection: overlay.toolsAllow ? readToolAllowlistIntersection(overlay.toolsAllow) : void 0,
		disableTools: overlay.disableTools,
		run: {
			...snapshot.run,
			messageProvider: overlay.messageProvider,
			chatType: overlay.chatType,
			agentAccountId: overlay.agentAccountId,
			conversationToolPolicy: overlay.conversationToolPolicy,
			groupId: overlay.groupId,
			groupChannel: overlay.groupChannel,
			groupSpace: overlay.groupSpace,
			memberRoleIds: overlay.memberRoleIds,
			spawnedBy: overlay.spawnedBy,
			senderId: overlay.senderId,
			senderName: overlay.senderName,
			senderUsername: overlay.senderUsername,
			senderE164: overlay.senderE164,
			senderIsOwner: overlay.senderIsOwner,
			inputProvenance: overlay.inputProvenance,
			trustedInternalHandoff: overlay.trustedInternalHandoff,
			scheduledToolPolicy: overlay.scheduledToolPolicy,
			runtimePluginToolGrant: overlay.runtimePluginToolGrant,
			traceAuthorized: overlay.traceAuthorized,
			approvalReviewerDeviceId: overlay.approvalReviewerDeviceId,
			clientCaps: overlay.clientCaps,
			toolBindings: overlay.toolBindings
		}
	};
}
function resolveReplyToolAuthoritySnapshotFingerprint(snapshot, route) {
	const execution = snapshot.run;
	const provider = route?.provider ?? execution.provider;
	const model = route?.model ?? execution.model;
	const policySessionKey = execution.runtimePolicySessionKey ?? execution.sessionKey;
	const sandboxRuntime = resolveSandboxRuntimeStatus({
		cfg: execution.config,
		sessionKey: policySessionKey
	});
	const capabilityProfile = resolveConversationCapabilityProfile({
		config: execution.config,
		sessionId: execution.sessionId,
		sessionKey: policySessionKey,
		runSessionKey: execution.sessionKey,
		sandboxSessionKey: policySessionKey,
		agentId: execution.agentId,
		agentDir: execution.agentDir,
		agentAccountId: execution.agentAccountId,
		modelProvider: provider,
		modelId: model,
		messageProvider: execution.messageProvider,
		messageChannel: snapshot.originatingChannel,
		chatType: execution.chatType,
		conversationToolPolicy: execution.conversationToolPolicy,
		groupId: execution.groupId,
		groupChannel: execution.groupChannel,
		groupSpace: execution.groupSpace,
		memberRoleIds: execution.memberRoleIds,
		spawnedBy: execution.spawnedBy,
		senderId: execution.senderId,
		senderName: execution.senderName,
		senderUsername: execution.senderUsername,
		senderE164: execution.senderE164,
		senderIsOwner: execution.senderIsOwner,
		workspaceDir: execution.workspaceDir,
		cwd: execution.cwd,
		sandboxToolPolicy: sandboxRuntime.sandboxed ? sandboxRuntime.toolPolicy : void 0,
		inputProvenance: execution.inputProvenance,
		trustedInternalHandoff: execution.trustedInternalHandoff,
		scheduledToolPolicy: execution.scheduledToolPolicy,
		runtimePluginToolGrant: execution.runtimePluginToolGrant
	});
	return createHash("sha256").update(stableStringify({
		provider,
		model,
		policy: capabilityProfile.policy,
		toolsAllow: snapshot.toolsAllow,
		toolsAllowIntersection: snapshot.toolsAllowIntersection,
		disableTools: snapshot.disableTools,
		sessionFile: execution.sessionFile,
		agentDir: execution.agentDir,
		workspaceDir: execution.workspaceDir,
		cwd: execution.cwd,
		toolOverrides: execution.toolOverrides,
		execOverrides: execution.execOverrides,
		elevatedLevel: execution.elevatedLevel,
		bashElevated: execution.bashElevated,
		traceAuthorized: execution.traceAuthorized === true,
		approvalReviewerDeviceId: execution.approvalReviewerDeviceId,
		authProfileId: execution.authProfileId,
		clientCaps: [...new Set(execution.clientCaps ?? [])].toSorted(),
		toolBindings: execution.toolBindings
	})).digest("hex");
}
/** Fingerprints the complete model-facing tool authority owned by one queued turn. */
function resolveFollowupRunToolAuthorityFingerprint(run, route) {
	return resolveReplyToolAuthoritySnapshotFingerprint(snapshotFollowupRunToolAuthority(run), route);
}
/** Projects a new inbound turn against one active run's frozen owner authority. */
function createFollowupRunToolAuthorityProjector(run) {
	const snapshot = snapshotFollowupRunToolAuthority(run);
	return (overlay, route) => resolveReplyToolAuthoritySnapshotFingerprint(applyReplyToolAuthorityOverlay(snapshot, overlay), route);
}
//#endregion
export { resolveFollowupRunToolAuthorityFingerprint as n, resolveInboundReplyToolAuthorityOverlay as r, createFollowupRunToolAuthorityProjector as t };
