import { i as upsertPresence } from "./system-presence-Ccv3L_9H.js";
import { t as buildAuthenticatedPresenceUser } from "./authenticated-presence-user-Bu6EwhFp.js";
//#region src/gateway/server/client-presence.ts
function isLiveClient(client) {
	return !client.invalidated && client.socket.readyState === 1;
}
function presenceIdentity(client) {
	return client.authenticatedUserProfile?.profileId ?? (client.authenticatedGitHubIdentitySync ? void 0 : client.authenticatedUserId);
}
/** Reconciles canonical identity and timing using only currently registered sockets. */
function refreshClientPresence(clients, client) {
	if (!clients.has(client) || !isLiveClient(client) || !client.presenceKey) return false;
	const identity = presenceIdentity(client);
	if (!identity || !client.authenticatedUserId) return false;
	const peers = [...clients].filter((peer) => isLiveClient(peer) && peer.presenceKey && presenceIdentity(peer) === identity && (peer === client || client.personPresence && peer.personPresence));
	const timing = client.personPresence;
	for (const peer of peers) if (timing && peer.personPresence) {
		timing.onlineSince = Math.min(timing.onlineSince, peer.personPresence.onlineSince);
		const activity = peer.personPresence.lastActivityAt;
		if (activity !== void 0) timing.lastActivityAt = Math.max(timing.lastActivityAt ?? activity, activity);
	}
	for (const peer of peers) {
		if (timing && peer.personPresence) peer.personPresence = timing;
		upsertPresence(peer.presenceKey, {
			user: buildAuthenticatedPresenceUser(peer),
			...peer.personPresence
		});
	}
	return true;
}
/** Records accepted human activity; copies and clients closed during admission cannot write. */
function recordClientPresenceActivity(clients, client) {
	for (const live of clients) {
		if (live !== client || !isLiveClient(live) || !live.presenceKey || !live.personPresence || !presenceIdentity(live)) continue;
		live.personPresence.lastActivityAt = Date.now();
		return refreshClientPresence(clients, live);
	}
	return false;
}
//#endregion
export { refreshClientPresence as n, recordClientPresenceActivity as t };
