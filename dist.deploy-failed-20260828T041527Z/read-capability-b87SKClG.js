import { d as resolveConfigDir } from "./utils-Bw16L5tB.js";
import "./agent-scope-DigoIwHb.js";
import { f as resolveAgentWorkspaceDir } from "./agent-scope-config-CUBiGmG3.js";
import { n as isToolAllowedByPolicies } from "./tool-policy-match-DfCekeWz.js";
import { i as resolveManagedMediaRoot } from "./sandbox-paths-C7Hkb46-.js";
import { n as resolvePathFromInput } from "./path-policy-DK2wTBdY.js";
import { n as resolveWorkspaceRoot } from "./workspace-dir-35xKeV2k.js";
import { i as resolveGroupToolPolicy } from "./agent-tools.policy-BuNXvHMo.js";
import { t as resolveSenderToolPolicy } from "./sender-tool-policy-DuMIfV8W.js";
import { t as resolveEffectiveToolFsRootExpansionAllowed } from "./tool-fs-policy-DwrFWb3k.js";
import { l as createBoundedOutboundMediaReadFile } from "./web-media-CUWAcYnl.js";
import { r as getAgentScopedMediaLocalRootsForSources } from "./local-roots-CtOvegzo.js";
import { i as readLocalMediaFile } from "./local-media-access-lFkLlNeH.js";
import path from "node:path";
//#region src/media/read-capability.ts
function isAgentScopedMediaReadAllowedByToolPolicy(params) {
	if (!isToolAllowedByPolicies("read", [resolveGroupToolPolicy({
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
	}), resolveSenderToolPolicy({
		config: params.cfg,
		agentId: params.agentId,
		sessionKey: params.sessionKey,
		messageProvider: params.messageProvider,
		senderId: params.requesterSenderId,
		senderName: params.requesterSenderName,
		senderUsername: params.requesterSenderUsername,
		senderE164: params.requesterSenderE164
	})])) return false;
	return true;
}
/** Creates a host reader bound to the agent workspace and configured local-file safety checks. */
function createAgentScopedHostMediaReadFile(params) {
	if (!resolveEffectiveToolFsRootExpansionAllowed({
		cfg: params.cfg,
		agentId: params.agentId
	}) || !isAgentScopedMediaReadAllowedByToolPolicy(params)) return;
	const workspaceRoot = resolveWorkspaceRoot(params.workspaceDir ?? (params.agentId ? resolveAgentWorkspaceDir(params.cfg, params.agentId) : void 0));
	return createBoundedOutboundMediaReadFile(async (filePath, options) => {
		return await readLocalMediaFile(resolvePathFromInput(filePath, workspaceRoot), params.localRoots, { maxBytes: options?.maxBytes ?? Number.MAX_SAFE_INTEGER });
	});
}
function getManagedMediaLocalRoots(mediaSources) {
	const roots = /* @__PURE__ */ new Set([path.join(resolveConfigDir(), "media", "outbound")]);
	for (const source of mediaSources ?? []) {
		const managedRoot = resolveManagedMediaRoot(source);
		if (managedRoot) roots.add(managedRoot);
	}
	return Array.from(roots);
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
	const mediaReadAllowed = isAgentScopedMediaReadAllowedByToolPolicy(params);
	const baseLocalRoots = mediaReadAllowed ? params.mediaAccess?.localRoots ?? getAgentScopedMediaLocalRootsForSources({
		cfg: params.cfg,
		agentId: params.agentId,
		mediaSources: params.mediaSources
	}) : getManagedMediaLocalRoots(params.mediaSources);
	const localRoots = mediaReadAllowed ? appendWorkspaceDirToLocalRoots(baseLocalRoots, resolvedWorkspaceDir) : baseLocalRoots;
	const readFile = mediaReadAllowed ? params.mediaAccess?.readFile ?? params.mediaReadFile ?? createAgentScopedHostMediaReadFile({
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
	}) : void 0;
	return {
		...localRoots?.length ? { localRoots } : {},
		...readFile ? { readFile } : {},
		...resolvedWorkspaceDir ? { workspaceDir: resolvedWorkspaceDir } : {}
	};
}
//#endregion
export { resolveAgentScopedOutboundMediaAccess as t };
