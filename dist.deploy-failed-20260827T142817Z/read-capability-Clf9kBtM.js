import "./agent-scope-BizOtGGz.js";
import { d as resolveAgentWorkspaceDir } from "./agent-scope-config-BdXMWufB.js";
import { n as isToolAllowedByPolicies } from "./tool-policy-match-CEXvGj1C.js";
import { t as resolvePathFromInput } from "./path-policy-fuudDMle.js";
import { n as resolveWorkspaceRoot } from "./workspace-dir-DK-npY9b.js";
import { i as resolveGroupToolPolicy } from "./agent-tools.policy-D3C_cMAq.js";
import { n as resolveEffectiveToolFsRootExpansionAllowed } from "./tool-fs-policy-DRfGQzmo.js";
import { l as createBoundedOutboundMediaReadFile } from "./web-media-CJi3g5iH.js";
import { n as getAgentScopedMediaLocalRoots, r as getAgentScopedMediaLocalRootsForSources } from "./local-roots-Beya70q2.js";
import { i as readLocalMediaFile } from "./local-media-access-DtoZyOsB.js";
import path from "node:path";
//#region src/media/read-capability.ts
function isAgentScopedHostMediaReadAllowed(params) {
	if (!resolveEffectiveToolFsRootExpansionAllowed({
		cfg: params.cfg,
		agentId: params.agentId
	})) return false;
	const groupPolicy = resolveGroupToolPolicy({
		config: params.cfg,
		sessionKey: params.sessionKey,
		messageProvider: params.messageProvider,
		groupId: params.groupId,
		groupChannel: params.groupChannel,
		groupSpace: params.groupSpace,
		accountId: params.accountId,
		senderId: params.requesterSenderId,
		senderName: params.requesterSenderName,
		senderUsername: params.requesterSenderUsername,
		senderE164: params.requesterSenderE164
	});
	if (groupPolicy && !isToolAllowedByPolicies("read", [groupPolicy])) return false;
	return true;
}
/** Creates a host reader bound to the agent workspace and configured local-file safety checks. */
function createAgentScopedHostMediaReadFile(params) {
	if (!isAgentScopedHostMediaReadAllowed(params)) return;
	const workspaceRoot = resolveWorkspaceRoot(params.workspaceDir ?? (params.agentId ? resolveAgentWorkspaceDir(params.cfg, params.agentId) : void 0));
	return createBoundedOutboundMediaReadFile(async (filePath, options) => {
		return await readLocalMediaFile(resolvePathFromInput(filePath, workspaceRoot), params.localRoots, { maxBytes: options?.maxBytes ?? Number.MAX_SAFE_INTEGER });
	});
}
function appendWorkspaceDirToLocalRoots(roots, workspaceDir) {
	if (!workspaceDir) return roots;
	const resolvedWorkspaceDir = path.resolve(workspaceDir);
	if (!roots?.length) return [resolvedWorkspaceDir];
	if (roots.some((root) => path.resolve(root) === resolvedWorkspaceDir)) return roots;
	return [...roots, resolvedWorkspaceDir];
}
/** Resolves roots and optional host read capability for outbound media in an agent context. */
function resolveAgentScopedOutboundMediaAccess(params) {
	const resolvedWorkspaceDir = params.workspaceDir ?? params.mediaAccess?.workspaceDir ?? (params.agentId ? resolveAgentWorkspaceDir(params.cfg, params.agentId) : void 0);
	const hostMediaReadAllowed = isAgentScopedHostMediaReadAllowed(params);
	const localRoots = appendWorkspaceDirToLocalRoots(params.mediaAccess?.localRoots ?? (hostMediaReadAllowed ? getAgentScopedMediaLocalRootsForSources({
		cfg: params.cfg,
		agentId: params.agentId,
		mediaSources: params.mediaSources
	}) : getAgentScopedMediaLocalRoots(params.cfg, params.agentId)), resolvedWorkspaceDir);
	const readFile = params.mediaAccess?.readFile ?? params.mediaReadFile ?? (hostMediaReadAllowed ? createAgentScopedHostMediaReadFile({
		cfg: params.cfg,
		agentId: params.agentId,
		localRoots: localRoots ?? [],
		workspaceDir: resolvedWorkspaceDir,
		sessionKey: params.sessionKey,
		messageProvider: params.messageProvider,
		groupId: params.groupId,
		groupChannel: params.groupChannel,
		groupSpace: params.groupSpace,
		accountId: params.accountId,
		requesterSenderId: params.requesterSenderId,
		requesterSenderName: params.requesterSenderName,
		requesterSenderUsername: params.requesterSenderUsername,
		requesterSenderE164: params.requesterSenderE164
	}) : void 0);
	return {
		...localRoots?.length ? { localRoots } : {},
		...readFile ? { readFile } : {},
		...resolvedWorkspaceDir ? { workspaceDir: resolvedWorkspaceDir } : {}
	};
}
//#endregion
export { resolveAgentScopedOutboundMediaAccess as t };
