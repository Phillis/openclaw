import { n as getRuntimeConfig } from "./io-DlN5njvP.js";
import "./config-B2bSneS2.js";
import { i as loadGatewaySessionEntryReadOnly } from "./session-utils-store-DtQnSTMm.js";
import "./session-utils-BTR52tOf.js";
import { a as getActiveSecretsRuntimeConfigSnapshot } from "./runtime-state-LhRdbFR1.js";
import { a as prepareGitHubPublicationIdentity, i as matchesPreparedGitHubPublicationIdentity } from "./github-tool-identity-C15aB8z0.js";
import { l as managedWorktrees } from "./service-P2Ot4H_g.js";
import { r as requestCurrentGitHubOAuthRefresh } from "./github-oauth-lifecycle-DzXTeK4S.js";
//#region src/gateway/github-publication-availability.ts
function publicationConfigSnapshot() {
	const active = getActiveSecretsRuntimeConfigSnapshot();
	if (active) return active;
	const config = getRuntimeConfig();
	return {
		config,
		sourceConfig: config
	};
}
function currentGitHubPublicationConfig() {
	return publicationConfigSnapshot().config;
}
async function prepareCurrentGitHubPublicationIdentity(agentId) {
	await requestCurrentGitHubOAuthRefresh(agentId);
	const snapshot = publicationConfigSnapshot();
	return await prepareGitHubPublicationIdentity({
		config: snapshot.config,
		sourceConfig: snapshot.sourceConfig,
		agentId
	});
}
function matchesCurrentGitHubPublicationIdentity(params) {
	return matchesPreparedGitHubPublicationIdentity({
		config: currentGitHubPublicationConfig(),
		...params
	});
}
function resolveGitHubPublicationWorktreeOwner(params) {
	const loaded = loadGatewaySessionEntryReadOnly(params.sessionKey, { agentId: params.agentId });
	const entry = loaded.entry;
	const worktree = managedWorktrees.findLiveByOwner("session", loaded.canonicalKey);
	if (loaded.agentId !== params.agentId || loaded.canonicalKey !== params.sessionKey || entry?.sessionId !== params.sessionId || entry.archivedAt !== void 0 || !entry.worktree?.id || !worktree || worktree.id !== entry.worktree.id || worktree.ownerKind !== "session" || worktree.ownerId !== loaded.canonicalKey || worktree.branch !== entry.worktree.branch || worktree.repoRoot !== entry.worktree.repoRoot) throw new Error("GitHub publication session worktree owner changed.");
	if (params.expected && (worktree.id !== params.expected.worktreeId || worktree.repoFingerprint !== params.expected.repositoryFingerprint || worktree.branch !== params.expected.branch)) throw new Error("GitHub publication workspace authority changed.");
	return {
		loaded,
		worktree
	};
}
async function prepareGitHubPublicationAvailability(params) {
	try {
		if (params.assertCurrent?.() === false) return false;
		resolveGitHubPublicationWorktreeOwner(params);
		const identity = await prepareCurrentGitHubPublicationIdentity(params.agentId);
		if (params.assertCurrent?.() === false) return false;
		resolveGitHubPublicationWorktreeOwner(params);
		return matchesCurrentGitHubPublicationIdentity({
			agentId: params.agentId,
			identity
		});
	} catch {
		return false;
	}
}
//#endregion
export { resolveGitHubPublicationWorktreeOwner as a, prepareGitHubPublicationAvailability as i, matchesCurrentGitHubPublicationIdentity as n, prepareCurrentGitHubPublicationIdentity as r, currentGitHubPublicationConfig as t };
